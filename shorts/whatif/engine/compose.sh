#!/bin/bash
# WHAT IF? pipeline for one episode.
#   engine/compose.sh <episode_dir> <output.mp4> [kokoro_model_dir]
# kokoro_model_dir holds kokoro-v1.0.onnx, kokoro-expr.onnx (from patch_model.py) + voices-v1.0.bin;
# omit it to reuse build/voice.wav.
set -e
ENG="$(cd "$(dirname "$0")" && pwd)"; EP="$1"; OUT="$2"
if [ -n "$3" ]; then python3 "$ENG/voice.py" "$3" "$EP"; fi      # build/voice.wav + timeline.json
rm -rf "$EP/build/frames"
node "$ENG/render.js" "$EP" --workers 4                           # build/frames + sfx/shots/music.json
python3 "$ENG/audio_mix.py" "$EP"                                 # build/mix.wav
# encode into build/ first, move into place only when complete (no half-written videos in the repo)
ffmpeg -y -v error -framerate 30 -i "$EP/build/frames/%05d.png" -i "$EP/build/mix.wav" \
  -c:v libx264 -preset slow -crf 19 -pix_fmt yuv420p -profile:v high -r 30 \
  -af "loudnorm=I=-14:TP=-1.5:LRA=11" -c:a aac -b:a 192k -ar 48000 \
  -shortest -movflags +faststart "$EP/build/encode.mp4"
mv "$EP/build/encode.mp4" "$OUT"
echo "-> $OUT"
