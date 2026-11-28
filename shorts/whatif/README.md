# WHAT IF? – Kurzvideo-Serie mit Quix

| Folge | Thema | Video |
|---|---|---|
| #1 | What if toilets had no U-bend? | `ep01_toilet/WhatIf_01_Toilet_UBend.mp4` (47 s) |
| #2 | What if car exhaust wasn't filtered? (Katalysator gelöscht) | `ep02_exhaust/WhatIf_02_Car_Exhaust.mp4` (53 s) |
| #3 | What if plane windows had no tiny hole? (Atmungsloch) | `ep03_plane/WhatIf_03_Plane_Window.mp4` (46 s) |
| #4 | What if coins had no ridges? (Reeding, Isaac Newton) | `ep04_coins/WhatIf_04_Coin_Ridges.mp4` (57 s) |
| #5 | What if microwaves had no metal mesh? (Türgitter) | `ep05_microwave/WhatIf_05_Microwave_Mesh.mp4` (56 s) |
| #6 | What if tires had no tread? (Aquaplaning) | `ep06_tires/WhatIf_06_Tire_Tread.mp4` (64 s) |
| #7 | What if escalators had no side brushes? (Rolltreppe) | `ep07_escalator/WhatIf_07_Escalator_Brushes.mp4` (65 s) |

Weitere recherchierte Themen mit Quellen: **`THEMEN.md`**.

**Format ab #7:** Jede Folge beginnt mit einer Vorschau (dem lustigsten Moment, mit „PREVIEW“-Label), danach kommt das Thema.
Tempo 1,18, mindestens 60 Sekunden.

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

**#3** Das Atmungsloch in der mittleren Scheibe gleicht den Druck zum Kabinenraum aus. So trägt die äußere Scheibe die Last,
und die mittlere bleibt Reserve. Zudem kann Feuchtigkeit entweichen, sonst beschlägt und vereist das Fenster
([Time](https://time.com/4725944/tiny-hole-airplane-windows-travel), [Mental Floss](https://www.mentalfloss.com/transportation/planes-airports/why-airplane-windows-have-tiny-holes)).
**#4** Wer Silbermünzen abschabte („clipping“), beging in England Hochverrat. Gerändelte Kanten machen das Abschaben sichtbar.
Isaac Newton wurde 1696 Warden der Royal Mint und verfolgte Fälscher. Heute helfen Rillen Blinden, Münzen zu ertasten
([Wikipedia: Reeding](https://en.wikipedia.org/wiki/Reeding), [Great Recoinage 1696](https://en.Wikipedia.com/wiki/Great_Recoinage_of_1696)).
**#5** Mikrowellen (2,45 GHz) sind ca. 12 cm lang, die Löcher im Türgitter nur 0,2–2 mm, also werden sie reflektiert,
Licht kommt durch. WLAN funkt auf 2,4 GHz. 1945 schmolz Percy Spencer ein Süßigkeitenriegel in der Tasche (welcher, ist
umstritten). Der Radarange von 1947 war fast 1,8 m hoch
([IEEE Spectrum](https://spectrum.ieee.org/a-history-of-the-microwave-oven), [Wikipedia: Percy Spencer](https://en.wikipedia.org/wiki/Percy_Spencer)).

**#6** Profil leitet Wasser aus der Kontaktfläche. Neue Reifen verdrängen laut Continental bis ca. 30 Liter Wasser pro Sekunde bei 80 km/h
([Continental: Aquaplaning](https://continental-tires.com/ca/en/b2c/tire-knowledge/aquaplaning)). Mindestprofil in den meisten EU-Ländern: 1,6 mm.
F1-Slicks haben kein Profil, bis es regnet. Herstellerangaben, nicht unabhängig getestet.

**#7** Die Seitenbürsten halten Füße, Schnürsenkel und Kleidung vom Spalt zwischen Stufen und Seitenwand fern.
Sie stoppen die Rolltreppe nicht, dafür ist der Not-Aus da ([KONE](https://www.kone.com.au/blogs/why-do-escalators-have-brushes.aspx),
[Elevator World](https://elevatorworld.com/blog/the-true-purpose-of-escalator-brushes/)).

Schriften: Bungee & Lilita One (SIL Open Font License). Musik und Soundeffekte sind komplett synthetisiert.
