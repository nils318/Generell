"""WHAT IF? series audio: theme music + SFX bank + voice mix. Everything is synthesized here.

usage: python audio_mix.py <episode_dir>
reads  build/{voice.wav,timeline.json,sfx.json,music.json}   writes build/mix.wav (48 kHz stereo)
"""
import json, sys
import numpy as np
import soundfile as sf
from scipy.signal import butter, sosfilt, resample_poly

import os
B = os.path.join(sys.argv[1], "build")
SR = 48000
TL = json.load(open(f"{B}/timeline.json"))
CUES = json.load(open(f"{B}/sfx.json"))
MUS = json.load(open(f"{B}/music.json"))
DUR = TL["duration"] + 0.05
N = int(DUR * SR)
R = np.random.default_rng(7)
tt = lambda d: np.arange(int(d * SR)) / SR


def env(n, a=0.005, d=0.3):
    x = np.arange(n) / SR
    return np.minimum(1, x / max(a, 1e-4)) * np.exp(-x / d)


def lp(x, f, o=2): return sosfilt(butter(o, f, "low", fs=SR, output="sos"), x)
def hp(x, f, o=2): return sosfilt(butter(o, f, "high", fs=SR, output="sos"), x)
def bp(x, lo, hi, o=2): return sosfilt(butter(o, [lo, hi], "band", fs=SR, output="sos"), x)
def sweep(f0, f1, d, curve=1.0):
    x = tt(d); f = f0 + (f1 - f0) * (x / d) ** curve
    return np.sin(2 * np.pi * np.cumsum(f) / SR)
def noise(d): return R.standard_normal(int(d * SR))


# ------------------------------------------------------------------ SFX bank
def s_pop():
    x = sweep(950, 380, 0.09, 0.6) * env(int(0.09 * SR), 0.001, 0.035)
    return x * 0.8
def s_whoosh(d=0.55, lo=300, hi=3500, up=True):
    n = noise(d); e = np.sin(np.linspace(0, np.pi, len(n))) ** 2
    a, b = (bp(n, lo, hi * 0.4), bp(n, lo * 2, hi)) if up else (bp(n, lo * 2, hi), bp(n, lo, hi * 0.4))
    m = np.linspace(0, 1, len(n))
    return (a * (1 - m) + b * m) * e * 0.55
def s_ding(f=1568):
    x = tt(1.2); e = np.exp(-x * 3.2)
    return sum(np.sin(2 * np.pi * f * k * x) * w for k, w in [(1, 1), (2.01, 0.4), (3.02, 0.2), (4.2, 0.1)]) * e * 0.3
def s_charge():
    d = 0.95; x = tt(d)
    s = sweep(180, 1700, d, 1.6) * (0.6 + 0.4 * np.sin(2 * np.pi * 28 * x))
    return (s * (x / d) ** 1.2 * 0.45 + hp(noise(d), 3000) * (x / d) ** 2 * 0.12)
def s_zap():
    d = 0.45; x = tt(d); f = 2400 * np.exp(-x * 9) + 90
    saw = 2 * ((np.cumsum(f) / SR) % 1) - 1
    return (lp(saw, 5000) * 0.6 + hp(noise(d), 2000) * 0.35) * env(len(x), 0.001, 0.18) * 0.9
def s_crumble():
    out = np.zeros(int(1.1 * SR))
    for i in range(70):
        at = int(R.uniform(0, 0.95) * SR); f = R.uniform(900, 4200)
        b = np.sin(2 * np.pi * f * tt(0.03)) * env(int(0.03 * SR), 0.0005, 0.008)
        out[at:at + len(b)] += b * R.uniform(0.1, 0.35)
    return out * np.linspace(1, 0.3, len(out))
def s_stamp():
    d = 0.4; x = tt(d)
    return (np.sin(2 * np.pi * (60 + 90 * np.exp(-x * 25)) * x) * np.exp(-x * 9) * 0.9
            + lp(noise(d), 2500) * env(len(x), 0.001, 0.03) * 0.6)
def s_gurgle():
    out = np.zeros(int(1.3 * SR))
    for i in range(16):
        at = int(i * 0.075 * SR + R.uniform(0, 0.03) * SR); d = R.uniform(0.05, 0.11)
        f0 = R.uniform(180, 420)
        b = sweep(f0, f0 * 2.2, d, 2) * env(int(d * SR), 0.004, d / 2)
        out[at:at + len(b)] += b * 0.45
    return lp(out, 1800)
def s_boing():
    d = 0.6; x = tt(d); f = 260 + 140 * np.sin(2 * np.pi * 9 * x) * np.exp(-x * 5) + 120 * x
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(x), 0.002, 0.25) * 0.5
def s_drip():
    b = sweep(1400, 520, 0.08, 0.5) * env(int(0.08 * SR), 0.001, 0.03)
    out = np.zeros(int(0.9 * SR))
    for k, g in enumerate([1, 0.35, 0.15]): out[int(k * 0.22 * SR):int(k * 0.22 * SR) + len(b)] += b * g
    return out * 0.7
def s_hit(big=False):
    d = 1.4 if big else 0.5; x = tt(d)
    k = np.sin(2 * np.pi * (45 + 120 * np.exp(-x * 30)) * x) * np.exp(-x * (3 if big else 8))
    sn = lp(noise(d), 6000) * env(len(x), 0.001, 0.12 if big else 0.05)
    out = k * 0.9 + sn * 0.45
    if big:
        tail = lp(noise(d), 1200) * np.exp(-x * 2.5) * 0.25
        out += tail
    return out
def s_burst():
    d = 1.1; x = tt(d)
    n = noise(d); m = 0.5 + 0.5 * np.sin(2 * np.pi * (28 - 14 * x) * x)
    return (bp(n, 70, 420) * m * 2.2 + np.sin(2 * np.pi * (70 - 25 * x) * x) * 0.6) * env(len(x), 0.01, 0.45) * 0.8
def s_fly():
    d = 1.6; x = tt(d); f = 210 + 25 * np.sin(2 * np.pi * 7 * x) + 40 * np.sin(2 * np.pi * 1.3 * x)
    saw = 2 * ((np.cumsum(f) / SR) % 1) - 1
    e = np.sin(np.linspace(0, np.pi, len(x))) * (0.6 + 0.4 * np.sin(2 * np.pi * 3 * x))
    return bp(saw, 300, 3000) * e * 0.25
def s_alarm():
    out = np.zeros(int(1.0 * SR))
    for k in range(3):
        for j, f in enumerate([880, 660]):
            d = 0.13; x = tt(d); sq = np.sign(np.sin(2 * np.pi * f * x)) * env(len(x), 0.003, 0.2)
            at = int((k * 0.3 + j * 0.14) * SR); out[at:at + len(sq)] += sq * 0.16
    return lp(out, 4000)
def s_strike():
    d = 0.5; x = tt(d)
    scr = hp(noise(0.18), 2500) * env(int(0.18 * SR), 0.002, 0.06) * 0.6
    fw = bp(noise(d), 200, 1500) * np.sin(np.linspace(0, np.pi, len(x))) * 0.5
    out = fw.copy(); out[:len(scr)] += scr
    return out
def s_blow():
    d = 0.5; x = tt(d)
    return bp(noise(d), 300, 2000) * np.sin(np.linspace(0, np.pi, len(x))) ** 0.7 * 0.6
def s_rewind():
    d = 1.15; x = tt(d); out = np.zeros(len(x))
    f = 300 + 2600 * (x / d) ** 1.5
    chirp = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * (0.5 + 0.5 * np.sin(2 * np.pi * 22 * x))
    out += lp(chirp, 5000) * 0.15 + hp(noise(d), 1500) * 0.05
    return out * np.minimum(1, (d - x) / 0.1)
def s_tick():
    out = np.zeros(int(1.6 * SR))
    for k in range(4):
        c = hp(noise(0.012), 3000) * env(int(0.012 * SR), 0.0002, 0.003)
        at = int(k * 0.38 * SR); out[at:at + len(c)] += c * (0.7 if k % 2 else 0.45)
    return out
def s_rebuild(): return np.concatenate([s_crumble()[::-1] * 0.8, np.zeros(10)]) + np.pad(sweep(300, 1600, 0.9, 1.4) * np.linspace(0, 1, int(0.9 * SR)) * 0.2, (0, int(0.2 * SR) + 10))
def s_sparkle():
    out = np.zeros(int(1.4 * SR))
    for i, f in enumerate([1568, 1976, 2349, 3136, 2637]):
        b = np.sin(2 * np.pi * f * tt(0.6)) * env(int(0.6 * SR), 0.002, 0.18)
        at = int(i * 0.07 * SR); out[at:at + len(b)] += b * 0.16
    return out
def s_squeak():
    d = 0.25; x = tt(d); f = 1350 + 160 * np.sin(2 * np.pi * 30 * x) + 500 * x
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.linspace(0, np.pi, len(x))) * 0.18
def s_water():
    d = 2.2; x = tt(d); n = noise(d)
    m = 0.6 + 0.4 * lp(np.abs(R.standard_normal(len(x))), 30) * 3
    e = np.minimum(1, x / 0.15) * np.minimum(1, (d - x) / 0.5)
    return bp(n, 400, 5000) * m * e * 0.35

BANK = {"pop": s_pop, "whoosh": lambda: s_whoosh(), "whoosh_scan": lambda: s_whoosh(0.6, 800, 9000),
        "whoosh_down": lambda: s_whoosh(1.4, 120, 3000, up=False), "whoosh_up": lambda: s_whoosh(1.8, 120, 3000, up=True),
        "ding": s_ding, "charge": s_charge, "zap": s_zap, "crumble": s_crumble, "stamp": s_stamp, "gurgle": s_gurgle,
        "boing": s_boing, "drip": s_drip, "hit": s_hit, "hit_big": lambda: s_hit(True), "burst": s_burst, "fly": s_fly,
        "alarm": s_alarm, "strike": s_strike, "blow": s_blow, "rewind": s_rewind, "tick": s_tick, "rebuild": s_rebuild,
        "sparkle": s_sparkle, "squeak": s_squeak, "water": s_water}
GAIN = {"crumble": 0.8, "gurgle": 0.9, "hit": 0.75, "hit_big": 0.95, "burst": 0.9, "alarm": 0.6, "water": 0.7,
        "whoosh_down": 0.8, "whoosh_up": 0.8, "fly": 0.8, "pop": 0.7}


# ---- EP02 additions
def s_engine(d=3.4, rough=0.0):
    x = tt(d); f = 38 + 4 * np.sin(2 * np.pi * 0.7 * x)
    saw = 2 * ((np.cumsum(f) / SR) % 1) - 1
    rumble = lp(saw, 260) * (0.7 + 0.3 * np.sin(2 * np.pi * 9 * x)) * 0.55
    if rough: rumble += lp(noise(d), 600) * (0.5 + 0.5 * np.sign(np.sin(2 * np.pi * 5 * x))) * rough * 0.35
    return rumble * np.minimum(1, x / 0.2) * np.minimum(1, (d - x) / 0.5)
def s_cough():
    out = np.zeros(int(0.9 * SR))
    for k, at in enumerate([0.0, 0.32]):
        d = 0.22; b = bp(noise(d), 300, 2200) * env(int(d * SR), 0.004, 0.06) * 0.9
        b += np.sin(2 * np.pi * (170 - 60 * tt(d)) * tt(d)) * env(int(d * SR), 0.004, 0.05) * 0.4
        out[int(at * SR):int(at * SR) + len(b)] += b * (1 - 0.3 * k)
    return out
def s_counter():
    out = np.zeros(int(1.2 * SR)); tt0 = 0.0; gap = 0.09
    while tt0 < 1.1:
        c = np.sin(2 * np.pi * 2200 * tt(0.02)) * env(int(0.02 * SR), 0.0005, 0.006) * 0.35
        out[int(tt0 * SR):int(tt0 * SR) + len(c)] += c; tt0 += gap; gap = max(0.025, gap * 0.88)
    return out
def s_clink(f=2637):
    x = tt(0.8); return sum(np.sin(2 * np.pi * f * k * x) * w for k, w in [(1, 1), (2.76, 0.5), (5.4, 0.25)]) * np.exp(-x * 7) * 0.22
def s_traffic():
    d = 3.0; x = tt(d); out = s_engine(d) * 0.8 + lp(noise(d), 900) * 0.12
    for at, f in [(0.6, 440), (1.9, 392)]:
        hd = 0.32; h = (np.sign(np.sin(2 * np.pi * f * tt(hd))) + np.sign(np.sin(2 * np.pi * f * 1.26 * tt(hd)))) * env(int(hd * SR), 0.01, 0.3) * 0.08
        out[int(at * SR):int(at * SR) + len(h)] += lp(h, 3000)
    return out
def s_siren():
    d = 2.2; x = tt(d); f = 520 + 280 * (0.5 - 0.5 * np.cos(2 * np.pi * x / 1.1))
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.minimum(1, x / 0.3) * np.minimum(1, (d - x) / 0.6) * 0.2
def s_paper():
    out = s_whoosh(0.6, 400, 6000) * 0.8
    slap = hp(noise(0.12), 800) * env(int(0.12 * SR), 0.001, 0.03) * 0.8
    out = np.concatenate([out, np.zeros(int(0.2 * SR))]); out[int(0.55 * SR):int(0.55 * SR) + len(slap)] += slap
    return out
def s_rain():
    d = 3.2; x = tt(d); n = bp(noise(d), 1500, 9000) * 0.18
    for i in range(160):
        at = int(R.uniform(0, d - 0.05) * SR); c = hp(noise(0.01), 3000) * env(int(0.01 * SR), 0.0003, 0.002) * R.uniform(0.05, 0.25)
        n[at:at + len(c)] += c
    return n * np.minimum(1, x / 0.3) * np.minimum(1, (d - x) / 0.6)
def s_thunder():
    d = 2.0; x = tt(d); return lp(noise(d), 180, 4) * 3.0 * env(len(x), 0.02, 0.6)
def s_sizzle():
    d = 1.0; x = tt(d); return hp(noise(d), 4000) * (0.5 + 0.5 * np.abs(np.sin(2 * np.pi * 13 * x))) * env(len(x), 0.05, 0.45) * 0.35

BANK.update({"engine": s_engine, "engine_dirty": lambda: s_engine(2.0, 1.0), "cough": s_cough, "counter": s_counter,
             "clink": s_clink, "traffic": s_traffic, "siren": s_siren, "paper": s_paper, "rain": s_rain,
             "thunder": s_thunder, "sizzle": s_sizzle})
GAIN.update({"engine": 0.6, "engine_dirty": 0.8, "traffic": 0.6, "rain": 0.7, "thunder": 0.9})

sfx = np.zeros(N)
for c in CUES:
    s = BANK[c["n"]]() * GAIN.get(c["n"], 0.85) * c.get("g", 1)
    i = int(c["t"] * SR); e = min(N, i + len(s))
    if i < N: sfx[i:e] += s[:e - i]

# ------------------------------------------------------------------ music
BPM = 96; beat = 60 / BPM; bar = 4 * beat
# Am9 - Dm9 - G13 - Cmaj9 (voicings in Hz)
CH = [[220.0, 261.6, 329.6, 392.0, 493.9], [146.8, 220.0, 261.6, 349.2, 329.6 * 2],
      [196.0, 246.9, 349.2, 329.6 * 2, 440.0], [130.8 * 2, 329.6, 392.0, 493.9, 587.3]]
ROOT = [55.0, 73.4, 49.0, 65.4]
mus_l = np.zeros(N); mus_r = np.zeros(N); drums = np.zeros(N)


def put(buf, sig, t0):
    i = int(t0 * SR)
    if i >= N or i + len(sig) <= 0: return
    a = max(0, -i); e = min(N, i + len(sig)); buf[max(0, i):e] += sig[a:a + e - max(0, i)]


def epiano(f, d):
    x = tt(d); mod = np.sin(2 * np.pi * f * 1.0 * x) * 1.2 * np.exp(-x * 3)
    return np.sin(2 * np.pi * f * x + mod) * env(len(x), 0.004, 0.9) * 0.08


kick = lambda: np.sin(2 * np.pi * (48 + 110 * np.exp(-tt(0.35) * 28)) * tt(0.35)) * np.exp(-tt(0.35) * 9) * 0.8
snare = lambda: (bp(noise(0.22), 1200, 7000) * env(int(0.22 * SR), 0.001, 0.07) * 0.45
                 + np.sin(2 * np.pi * 190 * tt(0.22)) * env(int(0.22 * SR), 0.001, 0.05) * 0.3)
hat = lambda v: hp(noise(0.05), 7000) * env(int(0.05 * SR), 0.0005, 0.015) * v
mel = [659.3, 784.0, 880.0, 784.0, 659.3, 587.3, 523.3, 587.3]

nb = int(DUR / bar) + 2
for b in range(nb):
    t0 = 0.0 + b * bar; ci = b % 4
    for f in CH[ci]:
        sig = epiano(f, bar * 1.05)
        put(mus_l, sig, t0); put(mus_r, sig, t0 + 0.012)
    for k, (bt, ln) in enumerate([(0, 1.5), (1.75, 0.25), (2, 1.5), (3.5, 0.5)]):
        sig = np.sin(2 * np.pi * ROOT[ci] * tt(ln * beat)) * env(int(ln * beat * SR), 0.01, ln * beat) * 0.38
        put(mus_l, sig, t0 + bt * beat); put(mus_r, sig, t0 + bt * beat)
    for s in range(8):  # 8ths with swing
        st = t0 + s * beat / 2 + (0.06 if s % 2 else 0)
        if s in (0, 5): put(drums, kick(), st)
        if s in (2, 6): put(drums, snare(), st)
        put(drums, hat(0.12 if s % 2 else 0.18), st)
    if b % 2 == 1:  # little pluck motif every other bar
        for s, f in enumerate(mel):
            x = tt(0.25); pl = (np.sin(2 * np.pi * f * x) + 0.3 * np.sin(4 * np.pi * f * x)) * env(len(x), 0.002, 0.12) * 0.05
            put(mus_l if s % 2 else mus_r, pl, t0 + s * beat / 2)

music = np.stack([mus_l + drums * 0.9, mus_r + drums * 0.9])
t_axis = np.arange(N) / SR


def window(a, b, fade=0.05):
    return np.clip(np.minimum((t_axis - a) / fade, (b - t_axis) / fade), 0, 1)

# arrangement: drop out for the delete impact and for the "which is... flammable" beat,
# old-radio filter during the 1775 flashback, intro fade-in
gain = np.ones(N)
gain *= np.clip(t_axis / 0.4, 0, 1)
for a, b, depth in MUS["drops"]:
    gain *= 1 - window(a, b, 0.04) * depth
hist = np.zeros(N)
for a, b in MUS["radio"]:
    hist = np.maximum(hist, window(a, b, 0.15))
radio = np.stack([bp(music[0], 500, 2500, 2), bp(music[1], 500, 2500, 2)]) * 1.6
music = music * (1 - hist) + radio * hist
# duck under the voice (smoothed envelope sidechain)
voice, vsr = sf.read(f"{B}/voice.wav")
voice = resample_poly(voice, SR, vsr)[:N]
voice = np.pad(voice, (0, N - len(voice)))
venv = lp(np.abs(voice), 6)
venv = venv / (venv.max() + 1e-9)
duck = 1 - 0.55 * np.clip(venv * 4, 0, 1)
music *= gain * duck * 0.42

# voice polish: gentle presence lift + light compression
v = voice + hp(voice, 2500) * 0.25
v = np.tanh(v * 1.6) / np.tanh(1.6)

mix = music.copy()
mix += v * 0.95
mix += sfx * 0.42
end_fade = np.clip((DUR - t_axis) / 0.6, 0, 1)
mix *= end_fade
mix = np.tanh(mix * 1.05)
mix /= np.abs(mix).max() / 0.93
sf.write(f"{B}/mix.wav", mix.T.astype(np.float32), SR, subtype="PCM_16")
print("mix ok", mix.shape[1] / SR, "s  peaks voice/music/sfx:",
      round(float(np.abs(v).max()), 2), round(float(np.abs(music).max()), 2), round(float(np.abs(sfx * 0.42).max()), 2))
