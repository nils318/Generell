#!/bin/bash
# Full pipeline for WHAT IF #01. Needs: kokoro-onnx, onnx, scipy, soundfile, playwright (node), ffmpeg.
#   ./compose.sh <kokoro_model_dir>     (dir with kokoro-timed.onnx + voices-v1.0.bin, see README)
set -e
cd "$(dirname "$0")/.."
B=build; mkdir -p $B
if [ -n "$1" ]; then python3 src/voice.py "$1" $B; fi          # voice.wav + timeline.json
node src/render.js $B/timeline.json $B/frames --workers 4      # frames + sfx.json + shots.json
python3 src/audio_mix.py $B                                    # mix.wav
ffmpeg -y -v error -framerate 30 -i $B/frames/%05d.png -i $B/mix.wav \
  -c:v libx264 -preset slow -crf 19 -pix_fmt yuv420p -profile:v high -r 30 \
  -af "loudnorm=I=-14:TP=-1.5:LRA=11" -c:a aac -b:a 192k -ar 48000 \
  -shortest -movflags +faststart WhatIf_01_Toilet_UBend.mp4
echo "-> WhatIf_01_Toilet_UBend.mp4"
