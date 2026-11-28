"""Voice for non-English episodes via Microsoft Edge TTS (free, needs speech.platform.bing.com).

    python voice_edge.py <episode_dir>

script.json: {"tts": "edge", "voice": "de-DE-ChristophNeural", "rate": "+10%",
              "lines": [[cue, text, pause, {rate, pitch, volume, pre, gain}?], ...]}
  rate "+10%", pitch "+12Hz", volume "+20%" are Edge prosody values per line (livelier delivery),
  pre = seconds of silence before the line, gain = dB boost for punchlines.
  Display overrides like voice.py: "[shown|spoken words]".
Writes build/voice.wav + build/timeline.json (same format as voice.py, word timings from Edge WordBoundary).
"""
import asyncio, json, os, re, subprocess, sys
import numpy as np, soundfile as sf

EP = sys.argv[1]; OUT = f"{EP}/build"; os.makedirs(OUT, exist_ok=True)
S = json.load(open(f"{EP}/script.json"))
VOICE, RATE, SR, FPS, LEAD_IN = S.get("voice", "de-DE-ChristophNeural"), S.get("rate", "+0%"), 24000, 30, 0.25
PROXY = os.environ.get("HTTPS_PROXY") or os.environ.get("https_proxy")
CA = "/root/.ccr/ca-bundle.crt"

import certifi, edge_tts
if os.path.exists(CA): certifi.where = lambda: CA   # this environment's TLS-inspecting proxy


def parse(text):  # -> spoken text, [(display word, n spoken words)]
    spoken, disp = [], []
    for m in re.finditer(r"\[([^|\]]+)\|([^\]]+)\]([^\s]*)|(\S+)", text):
        if m.group(4): disp.append((m.group(4), 1)); spoken.append(m.group(4))
        else:
            words = m.group(2).split(); disp.append((m.group(1) + m.group(3), len(words))); spoken.append(" ".join(words) + m.group(3))
    return " ".join(spoken), disp


async def synth(text, o):
    c = edge_tts.Communicate(text, VOICE, rate=o.get("rate", RATE), pitch=o.get("pitch", "+0Hz"), volume=o.get("volume", "+0%"),
                             boundary="WordBoundary", proxy=PROXY)
    audio, marks = bytearray(), []
    async for ch in c.stream():
        if ch["type"] == "audio": audio += ch["data"]
        elif ch["type"] == "WordBoundary": marks.append((ch["offset"] / 1e7, (ch["offset"] + ch["duration"]) / 1e7, ch["text"]))
    pcm = subprocess.run(["ffmpeg", "-v", "error", "-i", "pipe:0", "-f", "f32le", "-ac", "1", "-ar", str(SR), "pipe:1"],
                         input=bytes(audio), capture_output=True, check=True).stdout
    return np.frombuffer(pcm, np.float32).copy(), marks


norm = lambda s: re.sub(r"[^\w']", "", s.lower())


def align(spoken_words, marks, dur):
    """spoken word -> (s, e); Edge marks drop punctuation and may merge/split tokens, so match greedily."""
    out, j = [], 0
    for w in spoken_words:
        nw, hit = norm(w), None
        for k in range(j, min(j + 4, len(marks))):
            if norm(marks[k][2]) == nw or (nw and norm(marks[k][2]).startswith(nw[:3])): hit = k; break
        if hit is None and j < len(marks): hit = j
        if hit is None: out.append(None); continue
        out.append(marks[hit][:2]); j = hit + 1
    for i, v in enumerate(out):  # fill gaps by interpolation
        if v is None:
            p = out[i - 1][1] if i and out[i - 1] else 0.0
            n = next((x[0] for x in out[i + 1:] if x), dur)
            out[i] = (p, max(p + 0.05, n))
    return out


async def main():
    track, t, timeline = [np.zeros(int(LEAD_IN * SR), np.float32)], LEAD_IN, []
    for row in S["lines"]:
        cue, text, pause = row[:3]; o = row[3] if len(row) > 3 else {}
        spoken, disp = parse(text)
        audio, marks = await synth(spoken, o)
        idx = np.where(np.abs(audio) > 0.004)[0]
        a, b = max(0, idx[0] - 240), min(len(audio), idx[-1] + 1200); cut = a / SR
        audio = audio[a:b]
        if o.get("pre"): track.append(np.zeros(int(o["pre"] * SR), np.float32)); t += o["pre"]
        if o.get("gain"): audio = np.tanh(audio * 10 ** (o["gain"] / 20) / 0.6) * 0.6
        dur = len(audio) / SR
        times = align(spoken.split(), marks, dur + cut)
        words, i = [], 0
        for w, n in disp:
            grp = times[i:i + n]; i += n
            s, e = grp[0][0] - cut, grp[-1][1] - cut
            words.append({"w": w, "s": round(t + max(0, s), 3), "e": round(t + min(dur, max(e, s + 0.05)), 3)})
        timeline.append({"cue": cue, "text": " ".join(w for w, _ in disp), "s": round(t, 3), "e": round(t + dur, 3), "words": words})
        print(f"{t:6.2f}-{t + dur:6.2f}  {cue:9s} {spoken}")
        track += [audio.astype(np.float32), np.zeros(int(pause * SR), np.float32)]
        t += dur + pause
    voice = np.concatenate(track); voice = voice / np.abs(voice).max() * 0.89
    sf.write(f"{OUT}/voice.wav", voice, SR)
    hop = SR // FPS; n = int(np.ceil(len(voice) / hop))
    rms = np.array([np.sqrt(np.mean(voice[i * hop:(i + 1) * hop] ** 2)) for i in range(n)])
    rms = np.convolve(rms, [0.25, 0.5, 0.25], "same")
    mouth = np.clip((rms - 0.012) / (np.percentile(rms, 95) - 0.012), 0, 1)
    json.dump({"fps": FPS, "duration": round(len(voice) / SR, 3), "lines": timeline, "mouth": [round(float(x), 3) for x in mouth]},
              open(f"{OUT}/timeline.json", "w"), indent=1)
    print(f"total {len(voice) / SR:.2f}s  voice {VOICE}")

asyncio.run(main())
