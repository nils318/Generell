"""Expose Kokoro's per-phoneme durations as a second ONNX output (exact word timings).

usage: python patch_model.py kokoro-v1.0.onnx kokoro-timed.onnx
Model files: github.com/thewh1teagle/kokoro-onnx/releases (model-files-v1.0)
"""
import sys, onnx
m = onnx.load(sys.argv[1])
m.graph.output.append(onnx.helper.make_tensor_value_info('/encoder/Gather_output_0', onnx.TensorProto.INT64, None))
onnx.save(m, sys.argv[2])
