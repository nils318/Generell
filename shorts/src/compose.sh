#!/bin/bash
# Frames + Audio + Text -> fertiger 1080x1920 Short
set -e
cd "$(dirname "$0")"
F=/usr/share/fonts/opentype/inter/Inter-Black.otf

txt() { # text, color, y, start, end, size
  local a="if(lt(t,$4+0.15),(t-$4)/0.15,if(gt(t,$5-0.15),($5-t)/0.15,1))"
  printf "drawtext=fontfile=%s:text='%s':fontsize=%s:fontcolor=%s:borderw=9:bordercolor=black:shadowx=0:shadowy=6:shadowcolor=black@0.5:x=(w-text_w)/2:y=%s:alpha='%s':enable='between(t,%s,%s)'" \
    "$F" "$1" "$6" "$2" "$3" "$a" "$4" "$5"
}

VF="scale=1080:1920:flags=lanczos,unsharp=5:5:0.6"
VF+=",$(txt 'Diese Animation' white 300 0.2 3.4 92)"
VF+=",$(txt 'hat eine KI gemacht' '#FFD400' 410 0.5 3.4 92)"
VF+=",$(txt 'nur mit Python-Code' white 300 3.6 6.8 88)"
VF+=",$(txt '0 Mausklicks' '#FFD400' 410 4.0 6.8 92)"
VF+=",$(txt 'Soll ich Teil 2 machen?' white 300 7.1 9.9 80)"

ffmpeg -y -v error -framerate 30 -i frames/%04d.png -i audio.wav \
  -vf "$VF" -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p \
  -c:a aac -b:a 192k -shortest -movflags +faststart test_short.mp4
echo ok
