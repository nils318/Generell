"""Synthesized music + SFX, synced to the 30 fps animation (10 s)."""
import numpy as np, wave, sys

SR, DUR = 44100, 10.0
N = int(SR * DUR)
t = np.arange(N) / SR
mix = np.zeros(N)

def add(sig, at):
    i = int(at * SR)
    end = min(N, i + len(sig))
    mix[i:end] += sig[: end - i]

def env(n, a=0.005, d=0.2):
    x = np.arange(n) / SR
    return np.minimum(1, x / a) * np.exp(-x / d)

def tone(freq, dur, kind="square", vol=0.2, d=0.15):
    n = int(dur * SR); x = np.arange(n) / SR
    ph = 2 * np.pi * freq * x
    w = np.sign(np.sin(ph)) * 0.6 + np.sin(ph) * 0.4 if kind == "square" else np.sin(ph)
    return w * env(n, d=d) * vol

# ---- music: 120 BPM, chiptune-ish, C - Am - F - G ----
beat = 0.5
chords = [(261.6, 329.6, 392.0), (220.0, 261.6, 329.6), (174.6, 220.0, 261.6), (196.0, 246.9, 293.7)]
bass = [130.8, 110.0, 87.3, 98.0]
mel = [523, 659, 784, 659, 587, 523, 440, 523, 587, 659, 523, 440, 392, 440, 494, 587]
for b in range(int(DUR / beat)):
    bt = b * beat
    ci = (b // 4) % 4
    # kick on every beat, hat offbeat
    k = int(0.15 * SR); kx = np.arange(k) / SR
    add(np.sin(2 * np.pi * (50 + 120 * np.exp(-kx * 30)) * kx) * np.exp(-kx * 18) * 0.5, bt)
    add(np.random.randn(int(0.04 * SR)) * env(int(0.04 * SR), d=0.01) * 0.08, bt + beat / 2)
    add(tone(bass[ci], beat * 0.9, "square", 0.09, 0.25), bt)
    if b % 2 == 0:
        for f in chords[ci]:
            add(tone(f, beat * 1.8, "sine", 0.05, 0.5), bt)
    add(tone(mel[b % 16], beat * 0.45, "square", 0.06, 0.12), bt)
    add(tone(mel[(b + 3) % 16], beat * 0.4, "square", 0.04, 0.1), bt + beat / 2)

# ---- SFX (frame -> seconds = f/30) ----
def sweep(f0, f1, dur, vol, curve=1.0):
    n = int(dur * SR); x = np.arange(n) / SR
    f = f0 + (f1 - f0) * (x / dur) ** curve
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, a=0.002, d=dur / 2) * vol

def noise_burst(dur, vol, d):
    n = int(dur * SR)
    return np.convolve(np.random.randn(n), np.ones(8) / 8, "same") * env(n, d=d) * vol

# footsteps during walk (frames 30-90, 3.2 steps/s)
s = 30 / 30 + 0.08
while s < 3.0:
    add(noise_burst(0.08, 0.35, 0.02) + sweep(180, 90, 0.08, 0.25), s); s += 1 / 3.2
add(sweep(300, 1200, 0.35, 0.35, 0.6), 103 / 30)        # jump boing up
add(noise_burst(0.5, 0.15, 0.25), 106 / 30)             # whoosh (spin)
add(sweep(140, 45, 0.25, 0.7), 135 / 30); add(noise_burst(0.15, 0.4, 0.05), 135 / 30)  # landing thud
for i, f in enumerate([1047, 1319, 1568, 2093]):         # sparkle on wave
    add(tone(f, 0.25, "sine", 0.12, 0.12), 152 / 30 + i * 0.06)
for h in (220, 240, 260):                                # celebration hops
    add(sweep(400, 900, 0.15, 0.25), h / 30)

# master: fade out + normalize
mix *= np.clip((DUR - t) / 0.8, 0, 1)
mix = np.tanh(mix * 1.2)
mix /= np.abs(mix).max() / 0.85
pcm = (mix * 32767).astype(np.int16)
with wave.open(sys.argv[1], "wb") as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
