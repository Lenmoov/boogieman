# Boogie Woogie course — content format

All musical content lives in plain JS files in `data/`. Each file calls one of
`BW.addPatterns([...])`, `BW.addLicks([...])`, `BW.addArticles([...])`.
No build step. Files are loaded with `<script>` tags, so they must be valid
plain JavaScript (no imports/exports).

## 1. Rhythm grid

Everything is written in **12/8 (shuffle) time**: 4 beats per bar, each beat a
dotted quarter.

- **1 unit = one sixteenth note.** 1 beat = 6 units. **1 bar = 24 units.**
- shuffle eighths ("long-short") = `4` + `2`
- triplet eighths (three per beat) = `2` `2` `2`
- sixteenths (tremolo, fast runs) = `1` each (six per beat)
- quarter = `4`, a full beat (dotted quarter) = `6`, two beats = `12`, whole bar = `24`
- any integer duration is allowed (e.g. `8`, `10`, `18`); the notation engine
  splits it into tied notes automatically. Notes must start on a unit.
- Do NOT write straight (even) eighths; everything is shuffle/triplet feel.
- No pickups (anacrusis). Bar 1 starts at unit 0. Use rests where needed.

`tempo` is always in **beats (dotted quarters) per minute** at full speed.

## 2. Bar syntax

A hand part is an array of strings, **one string per bar**. A bar is a list of
space-separated tokens played one after another. **The durations in one bar
must add up to exactly 24.**

Token: `[(GRACE)]NOTES/DUR[:FINGERS][~]`

| Part | Meaning | Example |
|---|---|---|
| `NOTES` | one note, or a chord joined with `+`, **lowest note first**. Rest = `r` | `E4`, `Eb4+G4+C5`, `r` |
| `/DUR` | duration in units | `/4` |
| `:FINGERS` | one digit (1–5) per note, same order as the notes (low → high). 1 = thumb in both hands. **Required on every non-rest token.** | `:135` |
| `(GRACE)` | crushed grace note(s) played just before the main note: `(Eb4:2)` or `(D4:1,Eb4:2)`; each is `NOTE:FINGER` | `(Eb4:2)E4/4:3` |
| `~` | tie: this note is held into the **first token of the next bar**, which must have the same notes (fingers optional there) | `C5/6:5~` |

Pitch names: scientific pitch, **C4 = middle C (MIDI 60)**. Accidentals `#` and
`b` (e.g. `Eb4`, `F#4`, `Bb3`). Spell blue notes idiomatically for C blues:
`Eb` (b3), `F#` when it resolves up to G / `Gb` when it falls to F, `Bb` (b7).

Example bar (sum = 24):

```
"(Eb4:2)E4+G4/4:24 E4+G4/2:24 A4/4:5 G4/2:4 r/6 C5/4:5 A4/2:3"
```

Typical ranges: RH `C4`–`C6`, LH `C2`–`C4`.

## 3. Left-hand patterns  (`data/patterns.js`)

```js
BW.addPatterns([{
  id: 'chop-shuffle',            // fixed ids, see list below
  level: 1,                      // 1 (medium) … 5 (very advanced)
  style: 'chicago',
  tempo: 144,                    // target tempo, beats per minute
  title: { nl: '…', en: '…' },
  desc:  { nl: '…', en: '…' },   // 2–4 sentences: what it is, who used it, where it fits
  tip:   { nl: '…', en: '…' },   // 1–3 sentences practical practice / fingering advice
  bars: {                        // the pattern on each chord of a C blues
    C: '…one bar…',              // a string = 1-bar pattern
    F: '…',                      //   or an array of 2 strings = 2-bar pattern
    G: '…'                       //   (C, F and G must have the same form)
  }
}]);
```

The first two beats of each pattern bar (units 0–11) must also make sense on
their own: they are used when a bar has two chords (half a bar each).

Fixed pattern ids (licks refer to them):

| id | description |
|---|---|
| `chop-shuffle` | root+fifth / root+sixth shuffle "chop" (the classic two-note shuffle) |
| `walking-eighths` | single-note walking boogie line, eight to the bar: 1-3-5-6-b7-6-5-3 |
| `octave-stomp` | octave / quarter-note stomp with shuffle pickups (jump blues, rock 'n' roll) |
| `broken-octaves` | walking line in broken octaves (low-high), the classic rolling boogie bass |
| `pinetop` | bass in the style of Pine Top Smith |
| `ammons-rolling` | powerful rolling bass in the style of Albert Ammons |
| `yancey` | slow, sparse, habanera-like bass in the style of Jimmy Yancey |
| `nola-bass` | New Orleans triplet-feel bass line in the style of Fats Domino |

## 4. Licks  (`data/licks-*.js`)

```js
BW.addLicks([{
  id: 'riff-crushed-thirds',     // unique, kebab-case
  level: 2,                      // 1 (medium) … 5 (very advanced)
  cat: 'riff',                   // riff | fill | turnaround | intro | ending | break | chorus
  style: 'chicago',              // chicago | pinetop | yancey | neworleans | kansascity | rocknroll | modern
  tech: ['thirds', 'grace'],     // tags from: thirds, sixths, grace, tremolo, triplets, repeated,
                                 //   octaves, blues-scale, chords, syncopation, rolls, crossover
  title: { nl: '…', en: '…' },
  desc:  { nl: '…', en: '…' },   // 1–3 sentences: what it is and where you use it
  tip:   { nl: '…', en: '…' },   // 1–3 sentences: how to practise it, fingering remark
  key: 'C',                      // all content is written in C
  tempo: 152,                    // full-speed target, beats per minute
  chords: ['C7', 'C7'],          // one entry per bar. Two chords in a bar: 'G7 F7'
  rh: ['…bar 1…', '…bar 2…'],
  lh: 'chop-shuffle'             // a pattern id (chords must then be C7/F7/G7 family),
                                 //   OR an explicit array of bar strings like rh
}]);
```

`chords`, `rh` (and `lh` if explicit) must have the same number of bars.
Typical lengths: riffs/fills 1, 2 or 4 bars, turnarounds 2 bars, intros 4 bars,
endings 2–4 bars, a `chorus` is a full 12 bars.

12-bar blues in C: `C7 C7 C7 C7 | F7 F7 C7 C7 | G7 F7 C7 G7`.

## 5. Articles  (`data/articles.js`)

```js
BW.addArticles([{
  id: 'twelve-bar-blues',
  section: 'theory',             // theory | styles
  order: 1,
  style: 'chicago',              // only for section 'styles': same tags as licks
  title: { nl: '…', en: '…' },
  body:  { nl: `…`, en: `…` }    // template literals; never use backticks or ${ inside
}]);
```

Body is "markdown-lite", one block per line group:

- `## Heading`
- normal paragraphs (blank line between), `**bold**` allowed
- bullet lines starting with `- `
- a playable music example on ONE line:
  `@example {"title":"…","tempo":100,"chords":["C7"],"rh":["…bar…"],"lh":["…bar…"]}`
  (strict JSON; `rh` and `lh` are both optional but at least one is needed;
  bar syntax as in section 2; fingerings required here too)

## 6. Fingering rules (important)

Fingerings must be genuinely playable and idiomatic for an adult hand:

- 1 = thumb, 5 = little finger, in both hands. Chord fingers listed low → high
  (so a LH octave C2+C3 is `:51`, a RH third E4+G4 is `:13` or `:24`).
- Chord span at most an octave (a ninth only when unavoidable).
- Crushed blue notes that slide from a black key to the adjacent white key
  (Eb→E, F#→G, Bb→B) use the **same finger** (sliding), usually 2 or 3 — or a
  neighbouring finger pair when the main note is part of a chord.
- Consecutive thirds: alternate pairs such as 1-3 / 2-4 / 3-5; sixths 1-5 / 1-4 / 2-5.
- Keep the hand in one position as long as possible; position shifts happen at
  rests or long notes, thumb-under / finger-over only where natural.
- Fast repeated single notes may change fingers (3-2-1); repeated chords keep the same fingers.
- LH: 5 on the low root, 1 on top; broken octaves 5-1; walking single notes
  e.g. C-E-G-A-Bb-A-G-E = 5-3-2-1-1(or 2 over)… choose what a teacher would write.
- No finger may be asked to play two different keys at once; no impossible
  crossings inside a chord (fingers in a chord must ascend with pitch in RH:
  low→high = lower finger number→higher; in LH low→high = higher number→lower).
