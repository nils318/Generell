"""WHAT IF? voice-over with exact word timings (any episode).

Kokoro-82M (ONNX), patched by patch_model.py:
- per-phoneme durations (1 frame = 600 samples @ 24 kHz) -> frame-exact word timings
  for subtitles and lip sync without any aligner;
- a pitch-expressiveness control: the predicted intonation curve is widened around the
  line's own median pitch (script "expr", per-line "k") and can be shifted per line
  ("pitch" in semitones) before the decoder renders it.

script.json: {"voice", "speed", "expr", "lines": [[cue, text, pause, {speed, pitch, k, pre, gain}?], ...]}
  pre = seconds of silence before the line (comedic beat), gain = dB boost for punchlines

usage: python voice.py <model_dir> <episode_dir>   (reads <episode>/script.json, writes <episode>/build/)
"""
import json, re, sys
import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro

import os
MODEL_DIR, EP = sys.argv[1], sys.argv[2]
OUT = os.path.join(EP, "build"); os.makedirs(OUT, exist_ok=True)
SCRIPT = json.load(open(os.path.join(EP, "script.json")))
VOICE, SPEED, SR, FPS = SCRIPT.get("voice", "am_fenrir"), SCRIPT.get("speed", 1.0), 24000, 30
EXPR = SCRIPT.get("expr", 1.0)
# (cue, text, pause_after_s, options). Display overrides: [shown|spoken]
LINES = [(l[0], l[1], l[2], l[3] if len(l) > 3 else {}) for l in SCRIPT["lines"]]
LEAD_IN = 0.25

import onnxruntime as rt
k = Kokoro(f"{MODEL_DIR}/kokoro-v1.0.onnx", f"{MODEL_DIR}/voices-v1.0.bin")  # tokenizer + voices
sess = rt.InferenceSession(f"{MODEL_DIR}/kokoro-expr.onnx")
style_bank = k.voices[VOICE]


def parse(text):
    """-> spoken text, list of (display_word, n_spoken_words)."""
    disp, spoken = [], []
    for m in re.finditer(r"\[([^|\]]+)\|([^\]]+)\](\S*)|(\S+)", text):
        if m.group(4):
            disp.append((m.group(4), 1)); spoken.append(m.group(4))
        else:
            words = m.group(2).replace("-", " ").split()
            disp.append((m.group(1) + m.group(3), len(words)))
            spoken.append(" ".join(words) + m.group(3))
    return " ".join(spoken), disp


def synth(text, opt):
    ph = " ".join(k.tokenizer.phonemize(text, "en-us").split())
    toks = k.tokenizer.tokenize(ph)
    assert len(toks) == len(ph), "phoneme/token mismatch (unknown symbol)"
    feed = {"tokens": np.array([[0, *toks, 0]], dtype=np.int64), "style": style_bank[len(toks) - 1],
            "speed": np.array([SPEED * opt.get("speed", 1.0)], dtype=np.float32)}
    f = lambda x: np.array([x], np.float32)
    run = lambda lref, khi, klo, lsh: sess.run(None, {**feed, "f0_lref": f(lref), "f0_khi": f(khi), "f0_klo": f(klo), "f0_lshift": f(lsh)})
    khi, shift = opt.get("k", EXPR), 2 ** (opt.get("pitch", 0) / 12)
    klo = 1 + (khi - 1) * 0.25                     # lows move much less than peaks
    _, _, f0 = run(0.0, 1.0, 1.0, 0.0)             # pass 1: natural intonation
    voiced = f0.ravel()[f0.ravel() > 50]
    ref = float(np.median(voiced)) if len(voiced) else 120.0
    audio, dur, _ = run(np.log(ref), khi, klo, np.log(shift))   # pass 2: livelier melody
    r = np.log(voiced / ref); rx = np.where(r > 0, r * khi, r * klo)
    STATS.append((np.std(12 * r / np.log(2)), np.std(12 * rx / np.log(2)), ref * np.exp(rx.max()) * shift))
    audio, dur = audio.ravel(), dur.ravel()
    edges = np.concatenate([[0], np.cumsum(dur)]) * 600  # sample offset per token boundary
    # phoneme-words = runs of non-space tokens; token i spans edges[i+1]..edges[i+2]
    pw = []
    for m in re.finditer(r"[^ ]+", ph):
        core = [i for i in range(m.start(), m.end()) if ph[i] not in PUNCT]
        if core:
            pw.append(core)
    return audio, pw, edges, ph


PUNCT = set(".,!?;:…—\"'ˈˌ")
STATS = []


def plen(word):
    """Phoneme length of a single word said on its own (alignment weight)."""
    p = k.tokenizer.phonemize(word, "en-us")
    return max(1, sum(c not in PUNCT and c != " " for c in p))


def align(text_words, pw, edges):
    """DP-align text words to espeak's phoneme words (it merges 'was a' -> 'wʌzɐ'
    and may split hyphenated words). Returns (start, end) seconds per text word."""
    L = [plen(w) for w in text_words]
    P = [len(c) for c in pw]
    nT, nP, INF = len(L), len(P), 1e9
    moves = [(1, 1), (2, 1), (3, 1), (1, 2), (1, 3)]
    cost = np.full((nT + 1, nP + 1), INF); cost[0, 0] = 0
    back = {}
    for i in range(nT + 1):
        for j in range(nP + 1):
            if cost[i, j] >= INF:
                continue
            for di, dj in moves:
                a, b = i + di, j + dj
                if a > nT or b > nP:
                    continue
                lt, lp = sum(L[i:a]), sum(P[j:b])
                c = cost[i, j] + abs(lt - lp) / max(lt, lp) + (0 if (di, dj) == (1, 1) else 0.35)
                if c < cost[a, b]:
                    cost[a, b] = c; back[(a, b)] = (i, j)
    assert cost[nT, nP] < INF, "alignment failed"
    groups, ij = [], (nT, nP)
    while ij != (0, 0):
        pi, pj = back[ij]; groups.append((pi, ij[0], pj, ij[1])); ij = (pi, pj)
    out = [None] * nT
    for ti, te, pj, pe in reversed(groups):
        toks = [t for c in pw[pj:pe] for t in c]
        w = np.cumsum([0] + L[ti:te]) / sum(L[ti:te])
        for n, i in enumerate(range(ti, te)):
            a = toks[min(len(toks) - 1, int(round(w[n] * len(toks))))]
            b = toks[max(0, int(round(w[n + 1] * len(toks))) - 1)]
            out[i] = (edges[a + 1] / SR, edges[b + 2] / SR)
    return out


def trim(audio, thr=0.004):
    idx = np.where(np.abs(audio) > thr)[0]
    a, b = max(0, idx[0] - 240), min(len(audio), idx[-1] + 1200)
    return audio[a:b], a / SR


track, t, timeline = [np.zeros(int(LEAD_IN * SR), np.float32)], LEAD_IN, []
for cue, text, pause, opt in LINES:
    spoken, disp = parse(text)
    audio, pw, edges, ph = synth(spoken, opt)
    audio, cut = trim(audio)
    if opt.get("pre"):   # comedic beat: silence before the line
        track.append(np.zeros(int(opt["pre"] * SR), np.float32)); t += opt["pre"]
    if opt.get("gain"):  # punchline: louder, softly saturated so it doesn't dominate the peak normalisation
        audio = np.tanh(audio * 10 ** (opt["gain"] / 20) / 0.6) * 0.6
    times = align(spoken.split(), pw, edges)
    words, i = [], 0
    for w, n in disp:
        grp = times[i:i + n]; i += n
        words.append({"w": w, "s": t + grp[0][0] - cut, "e": t + grp[-1][1] - cut})
    dur = len(audio) / SR
    for wd in words:  # final-phoneme lengthening can run past the trimmed audio
        wd["s"], wd["e"] = round(max(t, wd["s"]), 3), round(min(t + dur, wd["e"]), 3)
    timeline.append({"cue": cue, "text": " ".join(w for w, _ in disp),
                     "s": round(t, 3), "e": round(t + dur, 3), "words": words})
    print(f"{t:6.2f}-{t + dur:6.2f}  {cue:9s} {ph}")
    track += [audio.astype(np.float32), np.zeros(int(pause * SR), np.float32)]
    t += dur + pause

voice = np.concatenate(track)
voice = voice / np.abs(voice).max() * 0.89
sf.write(f"{OUT}/voice.wav", voice, SR)

# per-video-frame mouth openness (RMS envelope, smoothed, 0..1)
hop = SR // FPS
n = int(np.ceil(len(voice) / hop))
rms = np.array([np.sqrt(np.mean(voice[i * hop:(i + 1) * hop] ** 2)) for i in range(n)])
rms = np.convolve(rms, [0.25, 0.5, 0.25], "same")
mouth = np.clip((rms - 0.012) / (np.percentile(rms, 95) - 0.012), 0, 1)
json.dump({"fps": FPS, "duration": round(len(voice) / SR, 3), "lines": timeline,
           "mouth": [round(float(x), 3) for x in mouth]}, open(f"{OUT}/timeline.json", "w"), indent=1)
st = np.array(STATS)
print(f"total {len(voice) / SR:.2f}s   voice {VOICE}  pitch variation {st[:, 0].mean():.2f} -> {st[:, 1].mean():.2f} semitones, peak {st[:, 2].max():.0f} Hz")
