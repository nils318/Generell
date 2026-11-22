# WHAT IF? #1 – „What if toilets had no U-bend?“

**Video:** `WhatIf_01_Toilet_UBend.mp4` (1080×1920, 30 fps, 49 s, Englisch mit Karaoke-Untertiteln, −14 LUFS)
**Hauptfigur:** `quix_character_sheet.png`

## Quix – der Serien-Host
- Lila „Bohne“ mit orangem Schal, weißen Handschuhen und Sneakern, cooler Halb-Lid-Blick.
- **Wiedererkennungsmerkmal:** leuchtende gelbe **„?“-Antenne**. Quix selbst ist der Punkt des Fragezeichens,
  seine Silhouette ist also ein „?“. Bei einer Erkenntnis wird sie zum **„!“**.
- Serien-Gimmick: Quix **löscht** in jeder Folge ein winziges Teil eines Alltagsdings mit einem Strahl aus der Antenne.
- Expressions: cool, happy, curious, shock, worried, disgust, smug. Posen: idle, hips, wave, point, thumb, nose, match, shrug, think, cheer, tap.

## Fakten (geprüft)
- Die Biegung (Geruchsverschluss/„trap“) hält Wasser und sperrt Kanalgase aus.
- Kanalgas enthält u. a. Schwefelwasserstoff (H₂S, Faule-Eier-Geruch, in hoher Konzentration giftig) und Methan (brennbar).
- 1775 erhielt der Uhrmacher Alexander Cumming das erste britische Patent auf ein Spül-WC mit S-förmigem Siphon.
- Ausgetrockneter Siphon in selten genutzten Bädern ist eine häufige Ursache für Kanalgeruch. Wasser laufen lassen füllt ihn wieder.

## Pipeline (alles per Code)
| Schritt | Datei |
|---|---|
| Stimme (Kokoro-82M, Stimme `af_heart`) + wortgenaue Timings | `src/voice.py`, `src/patch_model.py` |
| Figur | `src/render/quix.js` |
| Szenen / Untertitel / Effekte (Canvas, Playwright) | `src/render/*.js`, `src/render.js` |
| Musik + SFX (synthetisiert) + Mix | `src/audio_mix.py` |
| Gesamt | `src/compose.sh <modell-ordner>` |

Andere Stimme: In `src/voice.py` z. B. `VOICE = "am_michael"` (männlich) setzen und `compose.sh` neu laufen lassen.
Schriften: Bungee & Lilita One (SIL Open Font License).
