/* Advanced and structural vocabulary: turnarounds, intros, endings, breaks,
   advanced riffs/fills and a full chorus. Levels 3-5, ordered easy to hard.
   All in C, 12/8 shuffle, 24 units per bar.
   Every item is traditional stock vocabulary (or an honest combination of
   stock elements); nothing is a bar-for-bar quote of a copyrighted record. */
BW.addLicks([
  /* ------------------------------------------------------------ level 3 */
  {
    id: 'adv-turn-chromatic-sixths',
    level: 3,
    cat: 'turnaround',
    style: 'chicago',
    tech: ['sixths', 'grace'],
    title: { nl: 'Turnaround met dalende sexten', en: 'Descending sixths turnaround' },
    desc: {
      nl: 'De standaard-turnaround van de blues- en boogiepiano: grote sexten die halve toon voor halve toon zakken van Bes-G naar G-E, terwijl de bas doorshufflet. In maat 2 landt de lijn op C (E-C) en wijst een G7-stoot terug naar het begin. Gemeengoed bij alle Chicago-bluespianisten, geen citaat van één opname; je gebruikt hem in maat 11-12.',
      en: 'The standard turnaround of blues and boogie piano: major sixths sliding down half step by half step from Bb-G to G-E while the bass keeps shuffling. In bar 2 the line lands on C (E-C) and a G7 stab points back to the top. Common property of all Chicago blues pianists, not a quote of one record; use it in bars 11-12.'
    },
    tip: {
      nl: 'Wissel 2-5 en 1-4 af: 2-5 op de sexten met een zwarte onderste toets (Bes-G, As-F), 1-4 op de witte (A-Fis, G-E). Zo blijft de lijn bijna legato. In maat 2 glijdt 2 van Es naar E; voor G7 houd je 1-4 op F-B en zet je daarna F-G-B-D met 1-2-3-5.',
      en: 'Alternate 2-5 and 1-4: 2-5 on the sixths with a black lower key (Bb-G, Ab-F), 1-4 on the white ones (A-F#, G-E). That keeps the line almost legato. In bar 2 finger 2 slides from Eb to E; for G7 keep 1-4 on F-B, then set F-G-B-D with 1-2-3-5.'
    },
    key: 'C',
    tempo: 144,
    chords: ['C7', 'C7 G7'],
    rh: [
      'Bb4+G5/4:25 Bb4+G5/2:25 A4+F#5/4:14 A4+F#5/2:14 Ab4+F5/4:25 Ab4+F5/2:25 G4+E5/4:14 G4+E5/2:14',
      '(Eb4:2)E4+C5/6:25 r/6 F4+B4/4:14 F4+B4/2:14 F4+G4+B4+D5/4:1235 r/2'
    ],
    lh: [
      'C2+G2/4:52 C2+G2/2:52 C2+A2/4:51 C2+A2/2:51 C2+Bb2/4:51 C2+Bb2/2:51 C2+A2/4:51 C2+A2/2:51',
      'C2+G2/4:52 C2+G2/2:52 C2+A2/4:51 C2+A2/2:51 G2+D3/4:52 G2+D3/2:52 G2+E3/4:51 G2+F3/2:51'
    ]
  },
  {
    id: 'adv-riff-yancey-sixths',
    level: 3,
    cat: 'riff',
    style: 'yancey',
    tech: ['sixths', 'grace'],
    title: { nl: 'Zingende sexten (Yancey)', en: 'Singing sixths (Yancey)' },
    desc: {
      nl: 'Losse sexten met gecrushte blue notes, laat ingezet en met veel lucht, boven de habanera-achtige bas: dat is het vocabulaire van de trage blues van Jimmy Yancey. De frase zelf is een combinatie van die standaardelementen, geen citaat van een opname. Mooi voor een langzaam openingschorus.',
      en: 'Detached sixths with crushed blue notes, entering late and with lots of air, over the habanera-like bass: that is the vocabulary of Jimmy Yancey’s slow blues. The phrase itself combines those stock elements and is not a quote of a record. Lovely for a slow opening chorus.'
    },
    tip: {
      nl: 'Bijna alle sexten neem je met 1-5; alleen na een voorslag gebruik je 2-5, waarbij 2 van de zwarte naar de witte toets glijdt (Es-E, As-A). De Es boven in maat 1 crush je met 4 vlak voor de 5 op E. Laat de bovenstem zingen en houd het tempo echt laag: de stilte hoort bij de stijl.',
      en: 'Take almost all sixths with 1-5; only after a grace note use 2-5, with 2 sliding off the black key onto the white (Eb-E, Ab-A). The top Eb in bar 1 is crushed with 4 just before 5 lands on E. Let the top voice sing and keep the tempo genuinely slow: the silence is part of the style.'
    },
    key: 'C',
    tempo: 88,
    chords: ['C7', 'C7', 'F7', 'C7'],
    rh: [
      '(Eb4:2)E4+C5/6:25 r/4 G4+E5/2:15 (Eb5:4)G4+E5/6:15 C5+A5/4:15 G4+E5/2:15',
      'C5+A5/4:15 G4+E5/2:15 E4+C5/4:15 C4+A4/2:15 (Eb4:2)E4+C5/12:25',
      '(Ab4:2)A4+F5/6:25 r/4 C5+A5/2:15 (Ab4:2)A4+F5/4:25 Eb4+C5/2:25 r/6',
      '(Eb4:2)E4+C5/4:25 D4+Bb4/2:14 (Eb4:2)E4+C5/6:25 C4+A4/12:15'
    ],
    lh: 'yancey'
  },
  {
    id: 'adv-break-stop-time',
    level: 3,
    cat: 'break',
    style: 'rocknroll',
    tech: ['chords', 'grace', 'syncopation'],
    title: { nl: 'Stop-time break', en: 'Stop-time break' },
    desc: {
      nl: "Vier maten stop-time: beide handen slaan samen op tel 1, daarna antwoordt de rechterhand alleen met een kort bluesloopje; in maat 4 loopt de bas omhoog naar F7. Stop-time is standaard in jump blues en rock-’n-roll en gaat terug op de stops in Pine Top's Boogie Woogie (1928). Gebruik hem in maat 1-4 van een chorus.",
      en: "Four bars of stop-time: both hands hit together on beat 1, then the right hand answers alone with a short blues line; in bar 4 the bass walks up into F7. Stop-time is standard in jump blues and rock and roll and goes back to the stops in Pine Top's Boogie Woogie (1928). Use it in bars 1-4 of a chorus."
    },
    tip: {
      nl: 'Tel de rusten hardop mee; de spanning zit in de stilte. De slag is steeds E-G-Bes-C met 1-2-3-5. Let op het einde van maat 2: de duim speelt Es en glijdt meteen naar de E van het volgende akkoord.',
      en: 'Count the rests out loud; the tension lives in the silence. The hit is always E-G-Bb-C with 1-2-3-5. Watch the end of bar 2: the thumb plays Eb and slides straight onto the E of the next chord.'
    },
    key: 'C',
    tempo: 152,
    chords: ['C7', 'C7', 'C7', 'C7'],
    rh: [
      'E4+G4+Bb4+C5/4:1235 r/8 (Eb4:2)E4/4:2 G4/2:3 Bb4/4:4 G4/2:3',
      'E4+G4+Bb4+C5/4:1235 r/8 C5/4:5 Bb4/2:4 G4/4:2 Eb4/2:1',
      'E4+G4+Bb4+C5/4:1235 r/8 G4/2:1 Bb4/2:2 C5/2:3 (Eb5:4)E5/4:4 r/2',
      'E4+G4+Bb4+C5/4:1235 r/8 E4+G4/4:13 E4+G4/2:13 Eb4+A4/4:14 r/2'
    ],
    lh: [
      'C2+C3/4:51 r/20',
      'C2+C3/4:51 r/20',
      'C2+C3/4:51 r/20',
      'C2+C3/4:51 r/8 C2/4:5 E2/2:3 G2/4:2 A2/2:1'
    ]
  },
  {
    id: 'adv-intro-dominant-shuffle',
    level: 3,
    cat: 'intro',
    style: 'kansascity',
    tech: ['chords', 'grace'],
    title: { nl: 'Intro vanaf de dominant', en: 'Intro from the dominant' },
    desc: {
      nl: 'Inzetten op de laatste vier maten van het schema (G7-F7-C7-G7) is de standaardmanier om een boogie te beginnen. Erboven gecrushte akkoorden uit terts, kwint en septiem met een blue note als voorslag: standaardfiguur, te horen bij Pete Johnson en Albert Ammons. Zo staan tempo en sfeer voordat het eerste chorus begint.',
      en: 'Starting on the last four bars of the form (G7-F7-C7-G7) is the standard way to kick off a boogie. On top: crushed chords of third, fifth and seventh with a blue note as grace: standard figure, heard with Pete Johnson and Albert Ammons. It sets tempo and mood before the first chorus starts.'
    },
    tip: {
      nl: 'Het is drie keer dezelfde handvorm (terts-kwint-septiem, een verminderd drieklankje) met 2-3-5: B-D-F, A-C-Es, E-G-Bes. De eerste voorslag tik je met de duim; na de opmaatnoot (duim) neem je de voorslag met 2 en glij je door naar het akkoord. Houd de bas strak acht in de maat.',
      en: 'It is the same hand shape three times (third-fifth-seventh, a little diminished triad) with 2-3-5: B-D-F, A-C-Eb, E-G-Bb. Flick the first grace with the thumb; after the pickup note (thumb) take the grace with 2 and slide on into the chord. Keep the bass strictly eight to the bar.'
    },
    key: 'C',
    tempo: 150,
    chords: ['G7', 'F7', 'C7', 'G7'],
    rh: [
      '(Bb4:1)B4+D5+F5/4:235 B4+D5+F5/2:235 r/4 G4/2:1 (Bb4:2)B4+D5+F5/4:235 B4+D5+F5/2:235 D5/4:3 B4/2:2',
      '(Ab4:1)A4+C5+Eb5/4:235 A4+C5+Eb5/2:235 r/4 F4/2:1 (Ab4:2)A4+C5+Eb5/4:235 A4+C5+Eb5/2:235 C5/4:3 A4/2:2',
      '(Eb4:1)E4+G4+Bb4/4:235 E4+G4+Bb4/2:235 r/4 C4/2:1 (Eb4:2)E4+G4+Bb4/4:235 E4+G4+Bb4/2:235 G4/4:3 E4/2:2',
      '(F#4:1)G4/4:1 B4/2:2 D5/4:3 F5/2:5 G4+B4+D5+F5/4:1235 r/2 r/6'
    ],
    lh: [
      'G2/4:5 B2/2:4 D3/4:3 E3/2:2 F3/4:1 E3/2:2 D3/4:3 B2/2:4',
      'F2/4:5 A2/2:4 C3/4:3 D3/2:2 Eb3/4:1 D3/2:2 C3/4:3 A2/2:4',
      'C2/4:5 E2/2:4 G2/4:3 A2/2:2 Bb2/4:1 A2/2:2 G2/4:3 E2/2:4',
      'G2/4:5 B2/2:4 D3/4:3 E3/2:2 F3/4:1 E3/2:2 D3/4:3 B2/2:4'
    ]
  },
  {
    id: 'adv-end-triplet-tag',
    level: 3,
    cat: 'ending',
    style: 'neworleans',
    tech: ['chords', 'triplets', 'grace'],
    title: { nl: 'Triolen-slot met C6', en: 'Triplet tag ending on C6' },
    desc: {
      nl: 'Herhaalde triolenakkoorden boven een bas die C-E-F-Fis-G klimt: de standaardwending F7 - Fis-verminderd - C/G - G7 uit de New Orleans-rhythm-and-blues en de gospel, te horen bij Fats Domino. Alles landt op een warm C6-akkoord.',
      en: 'Repeated triplet chords over a bass that climbs C-E-F-F#-G: the standard move F7 - F#dim - C/G - G7 of New Orleans rhythm and blues and gospel, heard with Fats Domino. Everything lands on a warm C6 chord.'
    },
    tip: {
      nl: 'Speel de triolen vanuit de pols met losse, gelijke aanslagen en houd per akkoord dezelfde vingers. Bij de overgang F naar Es in maat 1 beweegt alleen de duim; 2 en 4 blijven op A en C liggen.',
      en: 'Play the triplets from the wrist with loose, even strokes and keep the same fingers per chord. At the F to Eb change in bar 1 only the thumb moves; 2 and 4 stay on A and C.'
    },
    key: 'C',
    tempo: 140,
    chords: ['C7 F7', 'C7 G7', 'C6'],
    rh: [
      'E4+G4+C5/2:125 E4+G4+C5/2:125 E4+G4+C5/2:125 E4+G4+Bb4/2:124 E4+G4+Bb4/2:124 E4+G4+Bb4/2:124 F4+A4+C5/2:124 F4+A4+C5/2:124 F4+A4+C5/2:124 Eb4+A4+C5/4:124 r/2',
      'E4+G4+C5/2:125 E4+G4+C5/2:125 E4+G4+C5/2:125 E4+G4+Bb4/2:124 E4+G4+Bb4/2:124 E4+G4+Bb4/2:124 D4+F4+B4/2:124 D4+F4+B4/2:124 D4+F4+B4/2:124 D4+F4+G4+B4/4:1235 r/2',
      '(Eb4:1)E4+G4+A4+C5/18:2345 r/6'
    ],
    lh: [
      'C2+C3/4:51 C2+C3/2:51 E2+E3/4:51 E2+E3/2:51 F2+F3/4:51 F2+F3/2:51 F#2+F#3/4:51 F#2+F#3/2:51',
      'G2+G3/4:51 G2+G3/2:51 E2+E3/4:51 E2+E3/2:51 D2+D3/4:51 D2+D3/2:51 G2+G3/4:51 r/2',
      'C2+G2+C3/18:521 r/6'
    ]
  },
  {
    id: 'adv-turn-walkdown',
    level: 3,
    cat: 'turnaround',
    style: 'neworleans',
    tech: ['chords', 'grace'],
    title: { nl: 'Chromatische walk-down', en: 'Chromatic walk-down' },
    desc: {
      nl: 'De bas loopt in octaven chromatisch omlaag van C naar G, terwijl de rechterhand bijna stil blijft staan en alleen binnenstemmen een halve toon verschuift: C - C/B - C7/Bes - A7 - As7 - G7. Een standaard-turnaround uit jazz en rhythm-and-blues, geen citaat van één pianist; mooi voor maat 11-12.',
      en: 'The bass walks down chromatically in octaves from C to G while the right hand nearly stands still and only shifts inner voices by half steps: C - C/B - C7/Bb - A7 - Ab7 - G7. A standard turnaround from jazz and rhythm and blues, not a quote of one pianist; lovely for bars 11-12.'
    },
    tip: {
      nl: 'Houd 1-3-5 de hele tijd op de akkoorden en laat elke vinger alleen een halve toon schuiven. De lage B, Bes, A, As en G liggen onder C2: kijk niet naar de toetsen maar voel de octaafvorm in de linkerhand.',
      en: 'Keep 1-3-5 on the chords throughout and let each finger slide only a half step. The low B, Bb, A, Ab and G sit below C2: do not look at the keys, feel the octave shape in the left hand.'
    },
    key: 'C',
    tempo: 138,
    chords: ['C7', 'Ab7 G7'],
    rh: [
      '(Eb5:4)G4+C5+E5/4:135 G4+C5+E5/2:135 r/4 G4+C5+E5/2:135 G4+C5+E5/4:135 r/2 G4+C#5+E5/4:135 G4+C#5+E5/2:135',
      'Gb4+C5+Eb5/4:135 Gb4+C5+Eb5/2:135 r/4 Gb4+C5+Eb5/2:135 F4+B4+D5/4:135 F4+B4+D5/2:135 r/4 F4+B4+D5/2:135'
    ],
    lh: [
      'C2+C3/4:51 C2+C3/2:51 B1+B2/4:51 B1+B2/2:51 Bb1+Bb2/4:51 Bb1+Bb2/2:51 A1+A2/4:51 A1+A2/2:51',
      'Ab1+Ab2/4:51 Ab1+Ab2/2:51 Ab1+Ab2/4:51 Ab1+Ab2/2:51 G1+G2/4:51 G1+G2/2:51 G1+G2/4:51 r/2'
    ]
  },

  /* ------------------------------------------------------------ level 4 */
  {
    id: 'adv-intro-rolled-cascade',
    level: 4,
    cat: 'intro',
    style: 'pinetop',
    tech: ['rolls', 'triplets', 'blues-scale', 'grace'],
    title: { nl: 'Intro met rollend akkoord en cascade', en: 'Rolled chord and cascade intro' },
    desc: {
      nl: 'Twee standaardelementen achter elkaar: een gerold akkoord zoals Pine Top Smith het speelde, en meteen daarna de triolenwaterval door de bluesladder vanaf de hoge C. Maat 2 antwoordt op F7, maat 3 laat de waterval verder doorlopen en maat 4 zet met drie slagen op G7 het chorus klaar. Een eigen combinatie, geen citaat; de bas is de wiegende Pinetop-bas.',
      en: 'Two stock elements back to back: a rolled chord the way Pine Top Smith played it, and straight after it the triplet waterfall down the blues scale from high C. Bar 2 answers on F7, bar 3 lets the waterfall run further down and bar 4 sets up the chorus with three hits on G7. An own combination, not a quote; the bass is the rocking Pinetop bass.'
    },
    tip: {
      nl: 'De roll speel je met 1-2-3 als voorslagen en landt met 5 op de topnoot. Waterval: C-Bes-G-Ges-F = 5-4-3-2-1, dan 3 over de duim naar Es, duim op C, weer 3 over naar Bes en duim op G. Oefen die vingerzetting eerst langzaam in gelijke triolen zonder linkerhand.',
      en: 'Play the roll with 1-2-3 as grace notes and land with 5 on the top note. Waterfall: C-Bb-G-Gb-F = 5-4-3-2-1, then 3 over the thumb to Eb, thumb on C, 3 over again to Bb and thumb on G. Practise that fingering slowly in even triplets without the left hand first.'
    },
    key: 'C',
    tempo: 152,
    chords: ['C7', 'F7', 'C7', 'G7'],
    rh: [
      '(E4:1,G4:2,Bb4:3)C5/4:5 r/2 C6/2:5 Bb5/2:4 G5/2:3 Gb5/2:2 F5/2:1 Eb5/2:3 C5/4:1 r/2',
      '(A4:1,C5:2,Eb5:3)F5/4:5 r/2 r/4 C5+Eb5/2:35 (Ab4:1)A4+C5+Eb5/4:235 A4+C5+Eb5/2:235 r/4 A4+C5+Eb5/2:235',
      '(E4:1,G4:2,Bb4:3)C5/4:5 r/2 C6/2:5 Bb5/2:4 G5/2:3 Gb5/2:2 F5/2:1 Eb5/2:3 C5/2:1 Bb4/2:3 G4/2:1',
      '(Bb4:2)B4+D5+F5/4:235 r/2 B4+D5+F5/4:235 r/2 G4+B4+D5+F5/4:1235 r/8'
    ],
    lh: [
      'C3/4:5 G3/2:3 C3/4:5 A3/2:2 C3/4:5 Bb3/2:1 C3/4:5 A3/2:2',
      'F2/4:5 C3/2:3 F2/4:5 D3/2:2 F2/4:5 Eb3/2:1 F2/4:5 D3/2:2',
      'C3/4:5 G3/2:3 C3/4:5 A3/2:2 C3/4:5 Bb3/2:1 C3/4:5 A3/2:2',
      'G2+G3/4:51 r/2 G2+G3/4:51 r/2 G2+G3/4:51 r/8'
    ]
  },
  {
    id: 'adv-turn-triplet-arpeggio',
    level: 4,
    cat: 'turnaround',
    style: 'kansascity',
    tech: ['triplets', 'blues-scale', 'grace'],
    title: { nl: 'Triolen-turnaround', en: 'Triplet turnaround' },
    desc: {
      nl: 'Gebroken akkoorden in doorlopende triolen zijn een handelsmerk van Pete Johnson. Hier als turnaround: C7 en F7 met blue notes als arpeggio, daarna de dalende bluesladder naar een gecrusht G7. Een combinatie van standaardelementen, geen citaat; de wandelende bas wisselt elke halve maat van akkoord.',
      en: 'Broken chords in running triplets are a trademark of Pete Johnson. Here as a turnaround: C7 and F7 with blue notes as arpeggios, then the descending blues scale into a crushed G7. A combination of stock elements, not a quote; the walking bass changes chord every half bar.'
    },
    tip: {
      nl: 'De triolen moeten tegen de shufflebas gelijk blijven: tel 1-2-3 per tel en laat de bas het lang-kort dragen. In maat 2 kruist 3 over de duim naar Bes; houd de pols daarbij rustig. De voorslagen Es-E en As-A neem je met dezelfde vinger als de hoofdnoot.',
      en: 'Keep the triplets even against the shuffle bass: count 1-2-3 per beat and let the bass carry the long-short feel. In bar 2, 3 crosses over the thumb to Bb; keep the wrist calm there. Take the graces Eb-E and Ab-A with the same finger as the main note.'
    },
    key: 'C',
    tempo: 156,
    chords: ['C7 F7', 'C7 G7'],
    rh: [
      'G4/2:1 C5/2:2 (Eb5:3)E5/2:3 G5/2:5 E5/2:3 C5/2:2 (Ab4:1)A4/2:1 C5/2:2 Eb5/2:3 F5/2:5 Eb5/2:3 C5/2:2',
      'G5/2:5 E5/2:4 Eb5/2:3 C5/2:1 Bb4/2:3 G4/2:1 (Bb4:2)B4+D5+F5/4:235 B4+D5+F5/2:235 G4+B4+D5+F5/4:1235 r/2'
    ],
    lh: [
      'C2/4:5 E2/2:4 G2/4:3 A2/2:2 F2/4:5 A2/2:4 C3/4:3 D3/2:2',
      'C2/4:5 E2/2:4 G2/4:3 A2/2:2 G2/4:5 B2/2:4 D3/4:2 F3/2:1'
    ]
  },
  {
    id: 'adv-break-triplet-stop',
    level: 4,
    cat: 'break',
    style: 'chicago',
    tech: ['chords', 'triplets', 'blues-scale', 'syncopation'],
    title: { nl: 'Gesyncopeerde stop-time met triolen', en: 'Syncopated stop-time with triplets' },
    desc: {
      nl: 'Stop-time met twee slagen per maat, op tel 1 en op de "en" van tel 2: een standaard ritmische break. Daarna vult de rechterhand de stilte met triolenlijnen door de bluesladder (omhoog, omlaag, weer omhoog), gewone boogievocabulaire; de combinatie is eigen werk. In maat 4 kruipt de bas chromatisch naar F7.',
      en: 'Stop-time with two hits per bar, on beat 1 and on the "and" of beat 2: a standard rhythmic break. The right hand then fills the silence with triplet lines through the blues scale (up, down, up again), ordinary boogie vocabulary; the combination is our own. In bar 4 the bass creeps chromatically up to F7.'
    },
    tip: {
      nl: 'De tweede slag valt op de korte shuffle-achtste, vlak voor tel 3: oefen eerst alleen de twee slagen met beide handen en een metronoom op de tellen. Pas als dat strak zit voeg je de triolen toe; in maat 2 kruist 2 over de duim naar Es.',
      en: 'The second hit falls on the short shuffle eighth just before beat 3: first practise only the two hits with both hands and a metronome on the beats. Add the triplets only when that feels tight; in bar 2, 2 crosses over the thumb to Eb.'
    },
    key: 'C',
    tempo: 150,
    chords: ['C7', 'C7', 'C7', 'C7'],
    rh: [
      'E4+G4+Bb4+C5/4:1235 r/6 E4+G4+Bb4+C5/2:1235 G4/2:1 Bb4/2:2 C5/2:3 (Eb5:4)E5/2:4 C5/2:3 Bb4/2:2',
      'E4+G4+Bb4+C5/4:1235 r/6 E4+G4+Bb4+C5/2:1235 Bb4/2:4 G4/2:3 Gb4/2:2 F4/2:1 Eb4/2:2 C4/2:1',
      'E4+G4+Bb4+C5/4:1235 r/6 E4+G4+Bb4+C5/2:1235 C4/2:1 Eb4/2:2 E4/2:3 G4/2:1 Bb4/2:2 C5/2:3',
      'E4+G4+Bb4+C5/4:1235 r/6 E4+G4+Bb4+C5/2:1235 G4/2:1 Bb4/2:2 C5/2:3 (Eb5:4)E5/4:4 r/2'
    ],
    lh: [
      'C2+C3/4:51 r/6 C2+C3/2:51 r/12',
      'C2+C3/4:51 r/6 C2+C3/2:51 r/12',
      'C2+C3/4:51 r/6 C2+C3/2:51 r/12',
      'C2+C3/4:51 r/6 C2+C3/2:51 C2/4:5 D2/2:4 Eb2/4:3 E2/2:2'
    ]
  },
  {
    id: 'adv-riff-rolled-chords',
    level: 4,
    cat: 'riff',
    style: 'pinetop',
    tech: ['rolls', 'chords', 'grace'],
    title: { nl: 'Gerolde en gecrushte akkoorden', en: 'Rolled and crushed chords' },
    desc: {
      nl: 'Elke maat opent met een snel gerold akkoord, gevolgd door gecrushte akkoordjes op de korte achtsten: het glinsterende, licht ruwe geluid van de vroege boogie. Standaardfiguur, te horen bij Pine Top Smith en later bij Albert Ammons; dit is geen citaat van één opname. Vier maten over C7-C7-F7-C7.',
      en: 'Each bar opens with a quick rolled chord, followed by crushed chords on the short eighths: the sparkling, slightly rough sound of early boogie. Standard figure, heard with Pine Top Smith and later Albert Ammons; this is not a quote of one record. Four bars over C7-C7-F7-C7.'
    },
    tip: {
      nl: 'Speel de roll (1-2-3-5) als een snelle draai van de pols, niet als vier losse aanslagen; de topnoot krijgt het accent. Bij de gecrushte akkoorden tikt de duim de voorslag en valt de hand meteen op 2-3-5.',
      en: 'Play the roll (1-2-3-5) as one quick turn of the wrist, not as four separate strokes; the top note gets the accent. On the crushed chords the thumb flicks the grace note and the hand drops straight onto 2-3-5.'
    },
    key: 'C',
    tempo: 148,
    chords: ['C7', 'C7', 'F7', 'C7'],
    rh: [
      'E4/1:1 G4/1:2 Bb4/1:3 C5/3:5 r/4 (Eb4:1)E4+G4+C5/2:235 r/4 (Eb4:1)E4+G4+C5/2:235 G4+Bb4/4:34 E4+G4/2:23',
      'G4/1:1 Bb4/1:2 C5/1:3 E5/3:5 r/4 C5+E5/2:35 E5/1:5 C5/1:3 Bb4/1:2 G4/3:1 (Eb4:2)E4/4:2 r/2',
      'A4/1:1 C5/1:2 Eb5/1:3 F5/3:5 r/4 (Ab4:1)A4+C5+F5/2:235 r/4 (Ab4:1)A4+C5+F5/2:235 C5+Eb5/4:34 A4+C5/2:23',
      'E4/1:1 G4/1:2 Bb4/1:3 C5/3:5 r/4 (Eb4:1)E4+G4+C5/2:235 C5/1:5 Bb4/1:4 G4/1:2 E4/3:1 r/6'
    ],
    lh: 'pinetop'
  },
  {
    id: 'adv-end-chromatic-climb',
    level: 4,
    cat: 'ending',
    style: 'rocknroll',
    tech: ['octaves', 'grace', 'chords'],
    title: { nl: 'Chromatische klim naar C9', en: 'Chromatic climb to C9' },
    desc: {
      nl: "Het standaard-slot van jump blues en rock-’n-roll: een maat gecrushte tertsen op C7, dan klimmen beide handen samen in octaven chromatisch van G naar B, en de laatste maat landt op een hoge C met een C9-akkoord erachteraan. Gemeengoed, niet aan één pianist toe te schrijven.",
      en: 'The standard ending of jump blues and rock and roll: one bar of crushed thirds on C7, then both hands climb together in octaves chromatically from G to B, and the last bar lands on a high C followed by a C9 chord. Common property, not attributable to one pianist.'
    },
    tip: {
      nl: 'Octaven in de rechterhand met 1-5 op wit en 1-4 op zwart; in de linkerhand overal 5-1. Speel de klim uit de arm en maak hem een beetje crescendo, de klap komt op de C. Voor C9 glijdt de duim van Des naar D.',
      en: 'Right-hand octaves with 1-5 on white and 1-4 on black; in the left hand 5-1 throughout. Play the climb from the arm and make a slight crescendo; the punch comes on the C. For C9 the thumb slides from Db to D.'
    },
    key: 'C',
    tempo: 160,
    chords: ['C7', 'G7', 'C9'],
    rh: [
      '(Eb5:2)E5+G5/4:24 C5/2:1 (Eb5:2)E5+G5/4:24 C5/2:1 (Eb5:2)E5+G5/4:24 C5/2:1 Bb4/4:2 G4/2:1',
      'G4+G5/4:15 G4+G5/2:15 Ab4+Ab5/4:14 Ab4+Ab5/2:14 A4+A5/4:15 A4+A5/2:15 Bb4+Bb5/4:14 B4+B5/2:15',
      'C5+C6/4:15 r/2 (Db5:1)D5+E5+G5+Bb5/18:1235'
    ],
    lh: [
      'C2/4:5 E2/2:4 G2/4:3 A2/2:2 Bb2/4:1 A2/2:2 G2/4:3 E2/2:4',
      'G2+G3/4:51 G2+G3/2:51 Ab2+Ab3/4:51 Ab2+Ab3/2:51 A2+A3/4:51 A2+A3/2:51 Bb2+Bb3/4:51 B2+B3/2:51',
      'C2+C3/4:51 r/2 C2+G2+C3/18:521'
    ]
  },
  {
    id: 'adv-chorus-pedal-riff',
    level: 4,
    cat: 'chorus',
    style: 'chicago',
    tech: ['sixths', 'grace', 'repeated', 'triplets', 'blues-scale'],
    title: { nl: 'Riff-chorus met orgelpunt', en: 'Pedal-point riff chorus' },
    desc: {
      nl: 'Een compleet chorus rond één stock-riff: een liggende hoge noot die op C7 en F7 gemeenschappelijk is (C) en op G7 een stap stijgt (D), met een binnenstem die eronder heen en weer beweegt. Dat gemeenschappelijke-toon-riff is standaard boogievocabulaire; de uitwerking (verschuivingen, de triolenloop in maat 4) is eigen werk, geen citaat.',
      en: 'A complete chorus around one stock riff: a held high note that is common to C7 and F7 (C) and moves up a step on G7 (D), with an inner voice rocking underneath. That common-tone riff is standard boogie vocabulary; the working-out (displacements, the triplet run in bar 4) is our own, not a quote.'
    },
    tip: {
      nl: 'De pink speelt steeds de orgelpunt en blijft licht; de binnenstem (2-3-4) zingt. Oefen eerst de drie basisvormen op C7, F7 en G7 los, daarna het hele chorus. Let op de verschoven maten 2 en 6 die op de korte achtste beginnen.',
      en: 'The little finger always plays the pedal note and stays light; the inner voice (2-3-4) sings. First practise the three basic shapes on C7, F7 and G7 separately, then the whole chorus. Watch the displaced bars 2 and 6 that start on the short eighth.'
    },
    key: 'C',
    tempo: 150,
    chords: ['C7', 'C7', 'C7', 'C7', 'F7', 'F7', 'C7', 'C7', 'G7', 'F7', 'C7', 'G7'],
    rh: [
      '(Eb4:1)E4+C5/4:25 E4+C5/2:25 G4+C5/4:35 G4+C5/2:35 Bb4+C5/4:45 G4+C5/2:35 E4+C5/4:25 r/2',
      'r/4 (Eb4:1)E4+C5/2:25 E4+C5/4:25 G4+C5/2:35 Bb4+C5/4:45 G4+C5/2:35 E4+C5/6:25',
      '(Eb4:1)E4+C5/4:25 E4+C5/2:25 G4+C5/4:35 G4+C5/2:35 Bb4+C5/4:45 Bb4+C5/2:45 Bb4+C5/4:45 Bb4+C5/2:45',
      'C5/2:5 Bb4/2:4 G4/2:3 Gb4/2:2 F4/2:1 Eb4/2:2 E4/4:2 r/2 Eb4+A4/4:13 r/2',
      '(Ab4:2)A4+C5/4:35 A4+C5/2:35 F4+C5/4:25 F4+C5/2:25 Eb4+C5/4:15 F4+C5/2:25 A4+C5/4:35 r/2',
      'r/4 (Ab4:2)A4+C5/2:35 A4+C5/4:35 F4+C5/2:25 Eb4+C5/4:15 F4+C5/2:25 A4+C5/6:35',
      '(Eb4:1)E4+C5/4:25 E4+C5/2:25 G4+C5/4:35 G4+C5/2:35 Bb4+C5/4:45 G4+C5/2:35 E4+C5/4:25 r/2',
      'r/4 (Eb4:1)E4+C5/2:25 E4+C5/4:25 G4+C5/2:35 Bb4+C5/4:45 G4+C5/2:35 E4+C5/4:25 r/2',
      '(Bb4:2)B4+D5/4:35 B4+D5/2:35 G4+D5/4:25 G4+D5/2:25 F4+D5/4:15 G4+D5/2:25 B4+D5/4:35 r/2',
      '(Ab4:2)A4+C5/4:35 A4+C5/2:35 F4+C5/4:25 F4+C5/2:25 Eb4+C5/4:15 F4+C5/2:25 A4+C5/4:35 r/2',
      '(Eb4:1)E4+C5/4:25 E4+C5/2:25 G4+C5/4:35 G4+C5/2:35 Bb4+C5/4:45 G4+C5/2:35 E4+C5/4:25 r/2',
      '(Bb4:2)B4+D5/4:35 B4+D5/2:35 G4+D5/4:25 G4+D5/2:25 F4+D5/4:15 B4+D5/2:35 r/6'
    ],
    lh: 'walking-eighths'
  },

  /* ------------------------------------------------------------ level 5 */
  {
    id: 'adv-intro-tremolo',
    level: 5,
    cat: 'intro',
    style: 'kansascity',
    tech: ['tremolo', 'triplets', 'blues-scale', 'chords'],
    title: { nl: 'Tremolo-intro', en: 'Tremolo intro' },
    desc: {
      nl: 'Een boogie openen met een brede akkoordtremolo is standaard; je hoort het bij Albert Ammons en Pete Johnson. Hier trilt de terts onderin tegen septiem plus grondtoon bovenin, eerst op C7, dan op F7. In maat 3 breekt de tremolo af in de bluesladder-waterval, en een G7-tremolo kondigt het chorus aan. Een combinatie van stock-elementen, geen citaat.',
      en: 'Opening a boogie with a wide chord tremolo is standard; you hear it with Albert Ammons and Pete Johnson. Here the third below shakes against the seventh plus root above, first on C7, then on F7. In bar 3 the tremolo breaks off into the blues scale waterfall, and a G7 tremolo announces the chorus. A combination of stock elements, not a quote.'
    },
    tip: {
      nl: 'Tremolo is rotatie: de onderarm draait als bij het omdraaien van een deurklink, duim en 4-5 blijven dicht bij de toetsen. Begin met achtsten (2 eenheden) en verdubbel pas als het ontspannen blijft. De sprong naar de hoge C in maat 3 maak je in de korte rust: kijk er vooraf al naar.',
      en: 'Tremolo is rotation: the forearm turns as if turning a door handle, thumb and 4-5 stay close to the keys. Start with eighths (2 units) and only double up while it stays relaxed. Make the jump to high C in bar 3 during the short rest: look at it in advance.'
    },
    key: 'C',
    tempo: 166,
    chords: ['C7', 'F7', 'C7', 'G7'],
    rh: [
      'E4/1:1 Bb4+C5/1:45 E4/1:1 Bb4+C5/1:45 E4/1:1 Bb4+C5/1:45 E4/1:1 Bb4+C5/1:45 E4/1:1 Bb4+C5/1:45 E4/1:1 Bb4+C5/1:45 E4/1:1 Bb4+C5/1:45 E4/1:1 Bb4+C5/1:45 E4/1:1 Bb4+C5/1:45 E4/1:1 Bb4+C5/1:45 E4/1:1 Bb4+C5/1:45 E4/1:1 Bb4+C5/1:45',
      'A4/1:1 Eb5+F5/1:45 A4/1:1 Eb5+F5/1:45 A4/1:1 Eb5+F5/1:45 A4/1:1 Eb5+F5/1:45 A4/1:1 Eb5+F5/1:45 A4/1:1 Eb5+F5/1:45 A4/1:1 Eb5+F5/1:45 A4/1:1 Eb5+F5/1:45 A4/1:1 Eb5+F5/1:45 A4/1:1 Eb5+F5/1:45 A4/1:1 Eb5+F5/1:45 A4/1:1 Eb5+F5/1:45',
      'E4/1:1 Bb4+C5/1:45 E4/1:1 Bb4+C5/1:45 E4/1:1 Bb4+C5/1:45 E4/1:1 Bb4+C5/1:45 E4/1:1 Bb4+C5/1:45 r/2 C6/2:5 Bb5/2:4 G5/2:3 Gb5/2:2 F5/2:1 Eb5/2:3',
      'C5/2:2 Bb4/2:1 G4/2:3 (Bb4:1)B4/1:1 F5+G5/1:45 B4/1:1 F5+G5/1:45 B4/1:1 F5+G5/1:45 B4/1:1 F5+G5/1:45 B4/1:1 F5+G5/1:45 B4/1:1 F5+G5/1:45 G4+B4+D5+F5/4:1235 r/2'
    ],
    lh: [
      'C2/4:5 E2/2:4 G2/4:3 A2/2:2 Bb2/4:1 A2/2:2 G2/4:3 E2/2:4',
      'F2/4:5 A2/2:4 C3/4:3 D3/2:2 Eb3/4:1 D3/2:2 C3/4:3 A2/2:4',
      'C2/4:5 E2/2:4 G2/4:3 A2/2:2 Bb2/4:1 A2/2:2 G2/4:3 E2/2:4',
      'G2/4:5 B2/2:4 D3/4:3 E3/2:2 F3/4:1 E3/2:2 G2+G3/4:51 r/2'
    ]
  },
  {
    id: 'adv-turn-modern-dim',
    level: 5,
    cat: 'turnaround',
    style: 'modern',
    tech: ['chords', 'syncopation', 'blues-scale', 'grace'],
    title: { nl: 'Moderne turnaround met F#dim', en: 'Modern turnaround with F#dim' },
    desc: {
      nl: 'De standaardwending C - C7/E - F - Fis-verminderd - C/G - G7 met stijgende bas, gemeengoed uit jazz en gospel en veel gebruikt in de moderne Europese boogieschool. Hier in gebroken octaven, met snelle zestiendenloopjes die op de korte achtste in een akkoord vallen: strak, helder en met veel drive. Geen citaat van één pianist.',
      en: 'The standard move C - C7/E - F - F#dim - C/G - G7 over a rising bass, common property of jazz and gospel and much used in the modern European boogie school. Here in broken octaves, with quick sixteenth runs that drop into a chord on the short eighth: tight, bright and driving. Not a quote of one pianist.'
    },
    tip: {
      nl: 'De Es aan het eind van maat 1 blijft onder vinger 4 en wordt meteen de voorslag van het C-akkoord: niet loslaten en opnieuw zoeken. In maat 2 glijdt 4 ook binnen het loopje van Es naar E. Oefen de zestiendenloopjes los met de aankomst op het akkoord als doel.',
      en: 'The Eb at the end of bar 1 stays under finger 4 and immediately becomes the grace note of the C chord: do not let go and search again. In bar 2 finger 4 also slides from Eb to E inside the run. Practise the sixteenth runs separately with the arrival chord as the target.'
    },
    key: 'C',
    tempo: 172,
    chords: ['C7 F7', 'C7 G7'],
    rh: [
      'G4+C5+E5/4:135 G4+C5+E5/2:135 E5/1:5 D5/1:4 C5/1:3 Bb4/1:2 G4+Bb4+E5/2:125 A4+C5+F5/4:135 r/2 r/4 A4+C5+Eb5/2:134',
      '(Eb5:4)G4+C5+E5/4:135 r/2 G4/1:1 Bb4/1:2 C5/1:3 Eb5/1:4 E5/1:4 G5/1:5 B4+D5+F5+G5/4:1235 r/2 r/4 B4+D5+F5+G5/2:1235'
    ],
    lh: [
      'C2/4:5 C3/2:1 E2/4:5 E3/2:1 F2/4:5 F3/2:1 F#2/4:5 F#3/2:1',
      'G2/4:5 G3/2:1 G2/4:5 G3/2:1 G2+G3/4:51 r/2 r/4 G2+G3/2:51'
    ]
  },
  {
    id: 'adv-riff-cross-rhythm',
    level: 5,
    cat: 'riff',
    style: 'chicago',
    tech: ['syncopation', 'repeated', 'grace'],
    title: { nl: 'Kruisritme 3 tegen 4', en: 'Cross-rhythm 3 against 4' },
    desc: {
      nl: 'Een herhaald figuur van vier triolenachtsten, zodat het accent elke keer op een andere plek in de tel valt: drie figuren over vier tellen. Zulke hypnotiserende kruisritmes zijn het handelsmerk van Meade Lux Lewis, beroemd uit zijn Honky Tonk Train Blues; dit figuur is standaardvocabulaire in die geest, geen citaat. Op F7 schuift het figuur een kwart omhoog.',
      en: 'A repeated figure of four triplet eighths, so the accent falls on a different spot in the beat each time: three figures across four beats. Hypnotic cross-rhythms like this are the trademark of Meade Lux Lewis, famous from his Honky Tonk Train Blues; this figure is stock vocabulary in that vein, not a quote. On F7 the figure moves up a fourth.'
    },
    tip: {
      nl: 'De hand ligt in de C7-ligging: E=1, G=2, Bes=4, C=5 (op F7: A=1, C=2, Es=4, F=5); de duim glijdt van Es naar E. Accentueer alleen de tweeklank aan het begin van elk figuur. Tel eerst hardop in triolen en klap de accenten; pas daarna met de gebroken-octavenbas, die stoïcijns op de tel blijft.',
      en: 'The hand sits in the C7 position: E=1, G=2, Bb=4, C=5 (on F7: A=1, C=2, Eb=4, F=5); the thumb slides from Eb to E. Accent only the double note at the start of each figure. First count out loud in triplets and clap the accents; only then add the broken-octave bass, which stays stubbornly on the beat.'
    },
    key: 'C',
    tempo: 160,
    chords: ['C7', 'C7', 'F7', 'C7'],
    rh: [
      '(Eb4:1)E4+Bb4/2:14 G4/2:2 C5/2:5 G4/2:2 (Eb4:1)E4+Bb4/2:14 G4/2:2 C5/2:5 G4/2:2 (Eb4:1)E4+Bb4/2:14 G4/2:2 C5/2:5 G4/2:2',
      '(Eb4:1)E4+Bb4/2:14 G4/2:2 C5/2:5 G4/2:2 (Eb4:1)E4+Bb4/2:14 G4/2:2 C5/2:5 G4/2:2 (Eb4:1)E4+Bb4/2:14 G4/2:2 C5/4:5',
      '(Ab4:1)A4+Eb5/2:14 C5/2:2 F5/2:5 C5/2:2 (Ab4:1)A4+Eb5/2:14 C5/2:2 F5/2:5 C5/2:2 (Ab4:1)A4+Eb5/2:14 C5/2:2 F5/2:5 C5/2:2',
      '(Eb4:1)E4+Bb4/2:14 G4/2:2 C5/2:5 G4/2:2 (Eb4:1)E4+Bb4/2:14 G4/2:2 C5/2:5 G4/2:2 (Eb4:1)E4+G4+C5/6:125 r/2'
    ],
    lh: 'broken-octaves'
  },
  {
    id: 'adv-riff-octave-tremolo',
    level: 5,
    cat: 'riff',
    style: 'chicago',
    tech: ['tremolo', 'octaves', 'triplets', 'chords', 'grace'],
    title: { nl: 'Octaaftremolo (Ammons-stijl)', en: 'Octave tremolo (Ammons style)' },
    desc: {
      nl: 'Krachtige octaaftremolo in zestienden, beantwoord door gecrushte akkoorden of een triolenloop. Standaardfiguur, te horen bij Albert Ammons boven zijn rollende bas; de vier maten zelf zijn geen citaat. In de laatste maat wordt de octaaf opgevuld met de terts: een brullend boogiegeluid.',
      en: 'Powerful octave tremolo in sixteenths, answered by crushed chords or a triplet run. Standard figure, heard with Albert Ammons over his rolling bass; the four bars themselves are not a quote. In the last bar the octave is filled in with the third: a roaring boogie sound.'
    },
    tip: {
      nl: 'Houd de hand in de octaafvorm (1-5) en laat de onderarm roteren; de vingers zelf bewegen bijna niet. Bij de Bes-octaaf blijven 1 en 5 gewoon op de zwarte toetsen; in de laatste maat speel je de E-G bovenin met 3-5. Wissel de tremolo in je oefening af met rust, anders verkrampt de hand.',
      en: 'Keep the hand in the octave shape (1-5) and let the forearm rotate; the fingers themselves hardly move. On the Bb octave 1 and 5 simply stay on the black keys; in the last bar play the E-G on top with 3-5. Alternate the tremolo with rest in your practice, or the hand will tense up.'
    },
    key: 'C',
    tempo: 164,
    chords: ['C7', 'C7', 'F7', 'C7'],
    rh: [
      'G4/1:1 G5/1:5 G4/1:1 G5/1:5 G4/1:1 G5/1:5 G4/1:1 G5/1:5 G4/1:1 G5/1:5 G4/1:1 G5/1:5 (Eb5:3)E5+G5/4:35 E5+G5/2:35 G4+C5+E5/4:135 r/2',
      'Bb4/1:1 Bb5/1:5 Bb4/1:1 Bb5/1:5 Bb4/1:1 Bb5/1:5 Bb4/1:1 Bb5/1:5 Bb4/1:1 Bb5/1:5 Bb4/1:1 Bb5/1:5 G5/2:4 E5/2:3 Eb5/2:2 C5/2:1 Bb4/2:3 G4/2:1',
      '(Ab4:1)A4/1:1 A5/1:5 A4/1:1 A5/1:5 A4/1:1 A5/1:5 A4/1:1 A5/1:5 A4/1:1 A5/1:5 A4/1:1 A5/1:5 (Ab4:1)A4+C5+Eb5/4:235 A4+C5+Eb5/2:235 F4+A4+C5+Eb5/4:1235 r/2',
      'G4/1:1 E5+G5/1:35 G4/1:1 E5+G5/1:35 G4/1:1 E5+G5/1:35 G4/1:1 E5+G5/1:35 G4/1:1 E5+G5/1:35 G4/1:1 E5+G5/1:35 G4/1:1 E5+G5/1:35 G4/1:1 E5+G5/1:35 G4/1:1 E5+G5/1:35 G4+C5+E5/4:135 r/2'
    ],
    lh: 'ammons-rolling'
  },
  {
    id: 'adv-fill-blues-cascade',
    level: 5,
    cat: 'fill',
    style: 'modern',
    tech: ['triplets', 'blues-scale', 'crossover'],
    title: { nl: 'Bluesladder-waterval over twee octaven', en: 'Two-octave blues scale cascade' },
    desc: {
      nl: 'De triolenwaterval door de bluesladder is standaardvocabulaire, van Pete Johnson tot de moderne Europese spelers; hier over twee octaven, van C6 tot Es4. De Es lost op naar E en de lijn schiet weer omhoog naar een gesyncopeerd C13-akkoord. Ideaal als vulling in maat 4 of maat 12.',
      en: 'The triplet waterfall down the blues scale is stock vocabulary, from Pete Johnson to the modern European players; here over two octaves, from C6 down to Eb4. The Eb resolves to E and the line shoots back up to a syncopated C13 chord. Ideal as a fill in bar 4 or bar 12.'
    },
    tip: {
      nl: 'Na de eerste vijf noten (5-4-3-2-1) herhaalt de vingerzetting zich per drie noten: 3-2-1, steeds met 3 over de duim. Oefen in groepjes (Es-C-Bes, G-Ges-F) en laat de arm rustig naar links meeglijden. Op de terugweg glijdt 3 van Es naar E en gaat de duim onder 3 door naar G.',
      en: 'After the first five notes (5-4-3-2-1) the fingering repeats in groups of three: 3-2-1, each time with 3 over the thumb. Practise in groups (Eb-C-Bb, G-Gb-F) and let the arm glide calmly to the left. On the way back up 3 slides from Eb to E and the thumb passes under 3 to G.'
    },
    key: 'C',
    tempo: 176,
    chords: ['C7', 'C7'],
    rh: [
      'C6/2:5 Bb5/2:4 G5/2:3 Gb5/2:2 F5/2:1 Eb5/2:3 C5/2:2 Bb4/2:1 G4/2:3 Gb4/2:2 F4/2:1 Eb4/2:3',
      'E4/2:3 G4/2:1 Bb4/2:2 C5/2:3 Eb5/2:4 E5/2:4 G5/4:5 r/2 r/4 Bb4+E5+A5/2:135'
    ],
    lh: 'walking-eighths'
  },
  {
    id: 'adv-end-tremolo-c69',
    level: 5,
    cat: 'ending',
    style: 'modern',
    tech: ['tremolo', 'chords', 'syncopation'],
    title: { nl: 'Tremolo-slot op C6/9', en: 'Tremolo ending on C6/9' },
    desc: {
      nl: 'Een modern slot met gesyncopeerde negenakkoorden: C9 en F9, daarna C9 en Des9 als tritonus-vervanger van G7, de standaardwending uit de jazz. De stemmen zakken een halve of hele toon naar C6/9, dat eerst als akkoordtremolo trilt en dan als vol akkoord blijft hangen. Gemeengoed in de moderne Europese boogie, geen citaat.',
      en: 'A modern ending with syncopated ninth chords: C9 and F9, then C9 and Db9 as a tritone substitute for G7, the standard jazz move. The voices slide down a half or whole step into C6/9, which first shimmers as a chord tremolo and then rings as a full chord. Common property in modern European boogie, not a quote.'
    },
    tip: {
      nl: 'Alle negenakkoorden neem je met 1-2-3-5; van Des9 naar C6/9 schuiven de vingers een halve of hele toon omlaag in bijna dezelfde handvorm: voel dat eerst langzaam. Voor de tremolo wissel je E-G (1-2) en A-D (3-5) af met een lichte rotatie; begin zacht en bouw op.',
      en: 'Take all ninth chords with 1-2-3-5; from Db9 to C6/9 the fingers slide down a half or whole step in almost the same hand shape: feel that slowly first. For the tremolo alternate E-G (1-2) and A-D (3-5) with a light rotation; start soft and build up.'
    },
    key: 'C',
    tempo: 160,
    chords: ['C7 F7', 'C7 Db7', 'C6', 'C6'],
    rh: [
      '(Eb4:1)E4+G4+Bb4+D5/4:1235 r/6 E4+G4+Bb4+D5/2:1235 Eb4+G4+A4+C5/4:1235 r/6 Eb4+G4+A4+C5/2:1235',
      'E4+G4+Bb4+D5/4:1235 r/6 E4+G4+Bb4+D5/2:1235 F4+Ab4+B4+Eb5/4:1235 r/6 F4+Ab4+B4+Eb5/2:1235',
      'E4+G4/1:12 A4+D5/1:35 E4+G4/1:12 A4+D5/1:35 E4+G4/1:12 A4+D5/1:35 E4+G4/1:12 A4+D5/1:35 E4+G4/1:12 A4+D5/1:35 E4+G4/1:12 A4+D5/1:35 E4+G4/1:12 A4+D5/1:35 E4+G4/1:12 A4+D5/1:35 E4+G4/1:12 A4+D5/1:35 E4+G4/1:12 A4+D5/1:35 E4+G4/1:12 A4+D5/1:35 E4+G4/1:12 A4+D5/1:35',
      'E4+G4+A4+C5+D5/18:12345 r/6'
    ],
    lh: [
      'C2+C3/4:51 r/6 C2+C3/2:51 F2+F3/4:51 r/6 F2+F3/2:51',
      'C2+C3/4:51 r/6 C2+C3/2:51 Db2+Db3/4:51 r/6 Db2+Db3/2:51',
      'C2/1:5 C3/1:1 C2/1:5 C3/1:1 C2/1:5 C3/1:1 C2/1:5 C3/1:1 C2/1:5 C3/1:1 C2/1:5 C3/1:1 C2/1:5 C3/1:1 C2/1:5 C3/1:1 C2/1:5 C3/1:1 C2/1:5 C3/1:1 C2/1:5 C3/1:1 C2/1:5 C3/1:1',
      'C2+G2+C3/18:521 r/6'
    ]
  }
]);
