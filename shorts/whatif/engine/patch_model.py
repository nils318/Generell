"""Patch Kokoro's ONNX graph for the WHAT IF? pipeline.

1. Exposes per-phoneme durations (`/encoder/Gather_output_0`) -> exact word timings.
2. Exposes the predicted pitch curve (`f0_raw`) for analysis.
3. Inserts an expressiveness control on the pitch curve before the decoder. In log-pitch
   around the line's median (ln_ref): r = ln f0 - ln_ref,
      r' = k_hi * relu(r) + k_lo * (r - relu(r)),   f0' = exp(ln_ref + r' + ln_shift)
   so pitch accents (peaks) are lifted more than the lows are lowered (no creak), and the
   decoder renders the livelier melody natively, so there are no vocoder artefacts.

usage: python patch_model.py kokoro-v1.0.onnx kokoro-timed.onnx
Model files: github.com/thewh1teagle/kokoro-onnx/releases (model-files-v1.0)
"""
import sys
import onnx
from onnx import helper, TensorProto

m = onnx.load(sys.argv[1])
g = m.graph
F0 = '/encoder/Reshape_output_0'          # predicted F0 curve [1, T]
consumers = [n for n in g.node if F0 in n.input]
assert consumers, 'F0 tensor not found'

g.input.extend([helper.make_tensor_value_info(n, TensorProto.FLOAT, [1]) for n in ('f0_lref', 'f0_khi', 'f0_klo', 'f0_lshift')])
g.initializer.append(helper.make_tensor('f0_eps', TensorProto.FLOAT, [1], [1e-3]))
N = helper.make_node
new = [
    N('Relu', [F0], ['f0_relu']),
    N('Add', ['f0_relu', 'f0_eps'], ['f0_pos']),
    N('Log', ['f0_pos'], ['f0_log']),
    N('Sub', ['f0_log', 'f0_lref'], ['f0_r']),
    N('Relu', ['f0_r'], ['f0_rpos']),
    N('Sub', ['f0_r', 'f0_rpos'], ['f0_rneg']),
    N('Mul', ['f0_rpos', 'f0_khi'], ['f0_rpos2']),
    N('Mul', ['f0_rneg', 'f0_klo'], ['f0_rneg2']),
    N('Add', ['f0_rpos2', 'f0_rneg2'], ['f0_r2']),
    N('Add', ['f0_r2', 'f0_lref'], ['f0_l2']),
    N('Add', ['f0_l2', 'f0_lshift'], ['f0_l3']),
    N('Exp', ['f0_l3'], ['f0_exp']),
    N('Sub', ['f0_exp', 'f0_eps'], ['f0_voiced']),
    # keep the (rare) negative unvoiced values untouched: f0 - relu(f0) = min(f0, 0)
    N('Sub', [F0, 'f0_relu'], ['f0_neg']),
    N('Add', ['f0_voiced', 'f0_neg'], ['f0_expr']),
    N('Identity', [F0], ['f0_raw']),
]
for n in consumers:
    for i, x in enumerate(n.input):
        if x == F0:
            n.input[i] = 'f0_expr'
# insert right after the producer of F0 to keep topological order
prod = next(i for i, n in enumerate(g.node) if F0 in n.output)
for k, n in enumerate(new):
    g.node.insert(prod + 1 + k, n)
g.output.extend([helper.make_tensor_value_info('/encoder/Gather_output_0', TensorProto.INT64, None),
                 helper.make_tensor_value_info('f0_raw', TensorProto.FLOAT, None)])
onnx.save(m, sys.argv[2])
print('patched ->', sys.argv[2])
