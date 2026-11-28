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
| #8 | What if jeans had no rivets? (Levi Strauss, 1873) | `ep08_jeans/WhatIf_08_Jeans_Rivets.mp4` (70 s) |
| #9 | What if keyboards had no bumps? (F/J, **erste 3D-Folge**) | `ep09_keyboard/WhatIf_09_Keyboard_Bumps.mp4` (65 s) |
| #10 DE | Was wäre ohne die Huckel? (deutsche Fassung, 2D-Quix in 3D) | `ep10_tastatur_de/WasWaere_10_Tastatur_Huckel_DE.mp4` (76 s) |
| Geschichte DE | Keine Sklaven?! Wie die Pyramiden gebaut wurden (Quix als Pharao/Historiker) | `ep11_pyramiden/Quix_Pyramiden_DE.mp4` (88 s) |
| Geschichte DE | Wäsche mit Urin?! Die Römer (Quix als Römer/Kaiser/Historiker) | `ep12_roemer/Quix_Roemer_DE.mp4` (89 s) |

Weitere recherchierte Themen mit Quellen: **`THEMEN.md`**.

**Format ab #7:** Jede Folge beginnt mit einer Vorschau (dem lustigsten Moment, mit „PREVIEW“-Label), danach kommt das Thema.
Tempo 1,18, mindestens 60 Sekunden. Quix hat eigene Sprüche, die witzig sind und dabei etwas erklären.
**Pointen ab #9:** eigene Zeile mit `pre` (Pause davor), langsamer, höher, `k` 1,9 und `gain` +3 dB, danach Rimshot oder Plattenkratzer.
**Deutsch ab #10:** `engine/voice_edge.py` (Edge TTS, Wort-Zeitstempel aus WordBoundary, pro Zeile `rate`/`pitch`/`volume`, `pre`, `gain`).
Stimme: `fr-FR-RemyMultilingualNeural` (spricht Deutsch, klingt natürlicher als `de-DE-ChristophNeural`). Braucht den Host `speech.platform.bing.com`.
`"lang": "de-DE"` ersetzt das von edge_tts fest gesetzte `en-US`. Für deutsche Aussprache: keine englischen Wörter, Zahlen immer in ganzen deutschen Sätzen.
Pointen ab Römer-Folge: tiefer statt höher (`pitch` −4 Hz, `rate` −4 %, `volume` +20 %, `pre` 0,4 s).
**Kostüme (2D-Quix):** `outfit: 'pharaoh'` (Nemes, Bart, Kragen), `'historian'` (Tropenhelm, Brille), `'roman'`/`'emperor'` (Toga, Lorbeer), `item: 'jug' | 'pointer' | 'coin' | 'pot'`.
**3D ab #9:** `engine/web/q3d.js` (three.js r150, Toon-Look mit Konturen, 3D-Quix). Untertitel und Labels bleiben 2D darüber.

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
**#8** Nieten sichern die Taschenecken, wo der Stoff am stärksten belastet wird. US-Patent 139,121 vom 20. Mai 1873 für Jacob W. Davis
und Levi Strauss & Co. Davis konnte die Patentgebühr nicht zahlen, Strauss (sein Stofflieferant) übernahm sie
([Google Patents](https://patents.google.com/patent/US139121), [History.com](https://www.history.com/this-day-in-history/may-20/levi-strauss-and-jacob-davis-receive-patent-for-blue-jeans)).
**#9** Die Huckel auf F und J markieren die Grundreihe fürs Zehnfingersystem: linker Zeigefinger auf F, rechter auf J.
Die 5 im Ziffernblock hat ebenfalls einen Huckel ([PCWorld](https://www.pcworld.com/article/2337532/this-is-why-the-f-and-j-keys-on-keyboards-are-usually-raised.html)).
**Pyramiden** Bauarbeiter waren keine Sklaven: Ehrengräber neben den Pyramiden mit Brot und Bier, eigene Arbeiterstadt (Hawass, Lehner).
Die Arbeit war aber teils verpflichtend und lief in wechselnden Schichten ([CBC](https://www.cbc.ca/technology/story/2010/01/11/tech-egypt-pyramid.html), [Harvard Magazine](https://www.harvardmagazine.com/2003/07/who-built-the-pyramids.html)).
Team-Graffiti „Freunde des Cheops“, „Trunkenbolde des Mykerinos“ (Lehner). Nasser Sand halbiert die Zugkraft (Uni Amsterdam 2014, Hypothese mit Laborbeleg,
[Live Science](https://www.livescience.com/45285-how-egyptians-moved-pyramid-stones.html)). ca. 2,3 Mio. Blöcke, ca. 6 Mio. t, weiße Tura-Kalksteinverkleidung,
über 3.800 Jahre höchstes Bauwerk ([Wikipedia](https://en.wikipedia.org/wiki/Great_Pyramid_of_Giza)). Bauzeit je nach Quelle ca. 20–27 Jahre.
**Römer** Walker (fullones) wuschen mit abgestandenem Urin, Ammoniak als Reiniger; Vespasian besteuerte Urin, Titus beschwerte sich, Münze unter der Nase (Sueton)
([Wikipedia: Pecunia non olet](https://en.wikipedia.org/wiki/Pecunia_non_olet)). Gladiatoren aus Ephesos aßen überwiegend Pflanzliches, erhöhtes Strontium passt zu Pflanzenasche-Trank (PLOS ONE 2014,
[PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC4198250)). Selbstheilender römischer Beton durch Kalkklasten (MIT 2023, [MIT News](https://news.mit.edu/2023/roman-concrete-durability-lime-casts-0106)),
Pantheon-Kuppel 128 n. Chr. Thermopolium in Pompeji 2020 mit Resten von Ente, Ziege, Schwein, Fisch, Schnecken ([NPR](https://www.npr.org/2020/12/27/950645473/whats-on-the-menu-in-ancient-pompeii-duck-goat-snail-researchers-say)).

Schriften: Bungee & Lilita One (SIL Open Font License). 3D: three.js (MIT, `engine/web/vendor/THREE_LICENSE`). Musik und Soundeffekte sind komplett synthetisiert.
