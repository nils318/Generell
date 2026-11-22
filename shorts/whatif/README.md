# WHAT IF? – Kurzvideo-Serie mit Quix

| Folge | Thema | Video |
|---|---|---|
| #1 | What if toilets had no U-bend? | `ep01_toilet/WhatIf_01_Toilet_UBend.mp4` (47 s) |
| #2 | What if car exhaust wasn't filtered? (Katalysator gelöscht) | `ep02_exhaust/WhatIf_02_Car_Exhaust.mp4` (53 s) |

Alle Folgen: 1080×1920, 30 fps, Englisch mit Karaoke-Untertiteln, −14 LUFS, **ohne Hintergrundmusik**
(nur Stimme + Soundeffekte; wieder einschalten mit `"music": true` in `script.json`).

**Stimme:** Kokoro `am_fenrir` (männlich) mit Ausdrucks-Regler. Die vom Modell vorhergesagte Satzmelodie wird
vor der Klangerzeugung verstärkt, Betonungen nach oben stärker als die Tiefen. So schwankt die Tonhöhe um
ca. 5,8 statt 3,4 Halbtöne (vorher `am_michael`, eher monoton). Pro Satz lassen sich Tempo (`speed`),
Tonlage (`pitch`, Halbtöne) und Lebendigkeit (`k`) in `script.json` einstellen.

**Profilbild:** `profile/quix_profile_purple.png` und `profile/quix_profile_teal.png` (2048×2048, kreissicher),
Vorschau in Feed-Größen: `profile/quix_profile_preview.png`.

## Quix – der Serien-Host (`quix_character_sheet.png`)
- Lila „Bohne“ mit orangem Schal, weißen Handschuhen und Sneakern, cooler Halb-Lid-Blick.
- **Wiedererkennungsmerkmal:** leuchtende gelbe **„?“-Antenne**. Quix selbst ist der Punkt des Fragezeichens,
  bei einer Erkenntnis wird sie zum **„!“**.
- **Format:** „I'm Quix. And today… I'm deleting it.“ Quix löscht mit einem Strahl aus der Antenne ein Teil
  eines Alltagsdings, danach zeigt die Folge die Konsequenzen. Schluss: „So… what should I delete next?“
- Requisiten: Perücke (`wig`), Fedora (`hat: 'fedora'`), Streichholz (`match`), Tränen (`tears`), Schweiß (`sweat`).

## Aufbau
```
engine/            gemeinsame Serien-Engine
  voice.py         Stimme + wortgenaue Timings (liest <folge>/script.json)
  patch_model.py   Kokoro-Patch: Lautdauern als Ausgang + Ausdrucks-Regler für die Satzmelodie
  avatar.js        rendert die Profilbilder
  render.js        Frames per Playwright (Canvas), parallel
  audio_mix.py     Serien-Musik + SFX-Bank + Ducking + Mix
  compose.sh       komplette Pipeline für eine Folge
  web/             core.js (Untertitel, Intro/Outro, Effekte), quix.js, kit.js, lib.js, Fonts
epXX_name/
  script.json      Sprechertext, Stimme, Tempo
  web/scenes.js    Zeichnungen der Folge
  web/shots.js     Ablauf/Timing, Soundeffekte, Musik-Pausen
```
Neue Folge: Ordner kopieren, `script.json`, `scenes.js` und `shots.js` anpassen, dann
`engine/compose.sh epXX_name epXX_name/Video.mp4 <kokoro-modellordner>`.

## Fakten-Check
**#1** Der Siphon hält Wasser und sperrt Kanalgase aus. Kanalgas enthält H₂S (giftig) und Methan (brennbar).
1775 bekam Alexander Cumming das erste britische Patent auf ein Spül-WC mit S-Siphon.
**#2** Der Katalysator wandelt CO, Stickoxide und unverbrannte Kohlenwasserstoffe um, mit Platin, Palladium und Rhodium
auf einem Wabenkörper. Weltweit fahren ca. 1,4 Mrd. Fahrzeuge (Ward's, 2019). Stickoxide und Kohlenwasserstoffe
bilden mit Sonnenlicht Smog/Ozon. Stickoxide werden zu Salpetersäure (saurer Regen). 1943 hielten Menschen in
Los Angeles den Smog für einen Gasangriff. Ab Modelljahr 1975 hatten die meisten neuen US-Benziner einen Kat.
Hinweis: Die 1975er-Kats waren Zwei-Wege-Kats (CO + HC). Stickoxide filtern erst die Drei-Wege-Kats ab etwa 1981.
Der Kat stoppt kein CO₂.

Schriften: Bungee & Lilita One (SIL Open Font License). Musik und Soundeffekte sind komplett synthetisiert.
