// Boogie woogie course - foundation licks, levels 1-3 (right-hand vocabulary).
// All licks in C, 12/8 shuffle grid: 1 unit = sixteenth, 1 beat = 6, 1 bar = 24.
// Every lick here is traditional stock vocabulary (or an honest combination of
// stock elements); the desc names where the figure is heard without inventing sources.
BW.addLicks([

  // ===================================================================
  // LEVEL 1
  // ===================================================================

  {
    id: "riff-shuffle-thirds",
    level: 1,
    cat: "riff",
    style: "chicago",
    tech: ["thirds"],
    title: { nl: "Shuffle-tertsen", en: "Shuffle thirds" },
    desc: {
      nl: "Het basisriff van de rechterhand: de terts E-G schommelt met de buurterts F-A in lang-kort shuffle-ritme, en in maat 2 schuift het schommelen een stapje op naar G-Bes en F-A voordat het weer op E-G landt. Het is de rechterhandversie van de kwint-sext-shuffle in de bas. Standaardfiguur zonder één bron: je hoort hem bij vrijwel elke shuffle- en boogiepianist.",
      en: "The basic right-hand riff: the third E-G rocks with the neighbouring third F-A in long-short shuffle rhythm, and in bar 2 the rocking moves up a step to G-Bb and F-A before settling back on E-G. It is the right-hand version of the fifth-sixth shuffle in the bass. A standard figure with no single source: you hear it with virtually every shuffle and boogie pianist."
    },
    tip: {
      nl: "Je hand blijft de hele tijd in één ligging: duim op E, dan 1-3 voor E-G, 2-4 voor F-A en 3-5 voor G-Bes. Speel de lange noot van elk paar iets zwaarder en de korte licht, als een stuitertje vanuit de pols.",
      en: "Your hand stays in one position the whole time: thumb on E, then 1-3 for E-G, 2-4 for F-A and 3-5 for G-Bb. Lean slightly into the long note of each pair and keep the short one light, like a small bounce from the wrist."
    },
    key: "C",
    tempo: 132,
    chords: ["C7", "C7"],
    rh: [
      "E4+G4/4:13 E4+G4/2:13 F4+A4/4:24 E4+G4/2:13 E4+G4/4:13 E4+G4/2:13 F4+A4/4:24 E4+G4/2:13",
      "G4+Bb4/4:35 F4+A4/2:24 G4+Bb4/4:35 F4+A4/2:24 E4+G4/6:13 r/6"
    ],
    lh: "chop-shuffle"
  },

  {
    id: "riff-crushed-third",
    level: 1,
    cat: "riff",
    style: "chicago",
    tech: ["thirds", "grace"],
    title: { nl: "Geknepen terts Es-E", en: "Crushed third Eb-E" },
    desc: {
      nl: "De blue note Es glijdt in een flits naar E terwijl je G erbij aanslaat: de geknepen terts, het meest elementaire gebaar van de boogie-woogie. Standaardfiguur, te horen bij Pine Top Smith, Meade Lux Lewis, Albert Ammons en vrijwel iedereen na hen. Maat 1 zet het motief neer op tel 1 en 3, maat 2 beantwoordt het met de afloop A-G-E-C.",
      en: "The blue note Eb slides in a flash to E while you strike G with it: the crushed third, the most basic gesture in boogie-woogie. A standard figure, heard with Pine Top Smith, Meade Lux Lewis, Albert Ammons and virtually everyone after them. Bar 1 states the motif on beats 1 and 3, bar 2 answers with the run-down A-G-E-C."
    },
    tip: {
      nl: "Speel Es en E met dezelfde vinger 2: zet hem op de zwarte toets en laat hem naar voren-beneden van de Es op de E glijden, met G tegelijk op 4. De Es is geen aparte tel, maar zit vlak vóór de tel. In maat 2: A=5, G=4, E=2 en de duim ligt klaar op C.",
      en: "Play Eb and E with the same finger 2: place it on the black key and let it slide off forward-down onto E, with G on 4 at the same moment. The Eb is not a separate beat; it sits just before the beat. In bar 2: A=5, G=4, E=2, and the thumb is ready on C."
    },
    key: "C",
    tempo: 126,
    chords: ["C7", "C7"],
    rh: [
      "(Eb4:2)E4+G4/4:24 E4+G4/2:24 r/6 (Eb4:2)E4+G4/4:24 E4+G4/2:24 r/6",
      "(Eb4:2)E4+G4/4:24 E4+G4/2:24 A4/4:5 G4/2:4 (Eb4:2)E4/4:2 C4/8:1"
    ],
    lh: "chop-shuffle"
  },

  {
    id: "riff-repeated-c-jump",
    level: 1,
    cat: "riff",
    style: "kansascity",
    tech: ["repeated"],
    title: { nl: "Herhaalde-noot jumpriff", en: "Repeated-note jump riff" },
    desc: {
      nl: "Een riff dat bijna helemaal op één noot (C) leeft, zoals de blazerssecties van de Kansas City-bands hun riffs speelden; de spanning komt puur uit het ritme en de afloop Bes-A-G sluit het af. Herhaalde-noot-riffs zijn standaardwoordenschat, te horen bij Pete Johnson; dit is de eenvoudigste vorm ervan, geen citaat uit één opname.",
      en: "A riff that lives almost entirely on one note (C), the way the horn sections of the Kansas City bands played their riffs; the tension comes purely from the rhythm and the Bb-A-G descent rounds it off. Repeated-note riffs are standard vocabulary, heard with Pete Johnson; this is their simplest form, not a quote from one recording."
    },
    tip: {
      nl: "Duim op G, 2 op A, 3 op Bes en 4 op C: de hand verschuift niet. Laat de herhaalde C's vanuit een losse pols veren in plaats van uit de vinger te drukken. Accent op de lange noten; de korte C's zijn bijna gefluisterd.",
      en: "Thumb on G, 2 on A, 3 on Bb and 4 on C: the hand does not move. Let the repeated Cs bounce from a loose wrist instead of pushing from the finger. Accent the long notes; the short Cs are almost whispered."
    },
    key: "C",
    tempo: 132,
    chords: ["C7", "C7"],
    rh: [
      "C5/4:4 C5/2:4 C5/4:4 Bb4/2:3 G4/6:1 r/6",
      "C5/4:4 C5/2:4 C5/4:4 C5/2:4 Bb4/4:3 A4/2:2 G4/6:1"
    ],
    lh: "octave-stomp"
  },

  {
    id: "turn-chromatic-pedal",
    level: 1,
    cat: "turnaround",
    style: "chicago",
    tech: ["chords"],
    title: { nl: "Chromatische turnaround op G", en: "Chromatic turnaround over G" },
    desc: {
      nl: "De klassieke turnaround voor de laatste twee maten van een blues: boven een liggende G zakt de bovenstem chromatisch C-B-Bes-A, waarna G7 (F-G-B) terugwijst naar het begin. Standaardfiguur die in talloze varianten bij blues- en boogiepianisten te horen is; geen specifieke opname.",
      en: "The classic turnaround for the last two bars of a blues: over a held G the top voice slides down chromatically C-B-Bb-A, after which G7 (F-G-B) points back to the start. A standard figure heard in countless variants with blues and boogie pianists; no specific recording."
    },
    tip: {
      nl: "Duim blijft op G liggen en de vingers 5-4-3-2 lopen één voor één omlaag: geen gezoek. Bij G7 zakt de duim één toets naar F; laat de rust op tel 4 echt stil zijn voordat je opnieuw begint.",
      en: "The thumb stays on G while fingers 5-4-3-2 walk down one by one: no searching. On G7 the thumb drops one key to F; let the rest on beat 4 be truly silent before you start again."
    },
    key: "C",
    tempo: 126,
    chords: ["C7", "G7"],
    rh: [
      "G4+C5/4:15 G4+C5/2:15 G4+B4/4:14 G4+B4/2:14 G4+Bb4/4:13 G4+Bb4/2:13 G4+A4/4:12 G4+A4/2:12",
      "F4+B4/4:14 F4+B4/2:14 F4+G4+B4/4:124 F4+G4+B4/2:124 F4+G4+B4/6:124 r/6"
    ],
    lh: "chop-shuffle"
  },

  {
    id: "fill-blues-scale-mixed",
    level: 1,
    cat: "fill",
    style: "rocknroll",
    tech: ["blues-scale", "grace", "crossover"],
    title: { nl: "Bluestoonladder omlaag, majeur terug", en: "Blues scale down, major back up" },
    desc: {
      nl: "Maat 1 daalt door de bluestoonladder (C-Bes-G-Ges-F-Es-C), maat 2 antwoordt met het majeurmotief E-G-A-G-E-C. Beide helften zijn standaardwoordenschat; de combinatie is een lesvorm, geen citaat. Dat contrast tussen mineur en majeur is de kern van het bluesgeluid; gebruik deze fill aan het eind van een frase.",
      en: "Bar 1 descends through the blues scale (C-Bb-G-Gb-F-Eb-C), bar 2 answers with the major motif E-G-A-G-E-C. Both halves are standard vocabulary; the combination is a teaching form, not a quote. That contrast between minor and major is the heart of the blues sound; use this fill at the end of a phrase."
    },
    tip: {
      nl: "Vingerzetting maat 1: 5-4-3-2-1 van C tot F, dan zet je 3 over de duim op Es en schuift de duim eronderdoor naar C. Laat Ges echt naar F vallen (daarom Ges, niet Fis). In maat 2 glijdt vinger 2 van Es naar E, met G=3 en A=4.",
      en: "Fingering bar 1: 5-4-3-2-1 from C down to F, then cross 3 over the thumb onto Eb and pass the thumb under to C. Let the Gb really fall to F (that is why it is Gb, not F#). In bar 2 finger 2 slides from Eb to E, with G=3 and A=4."
    },
    key: "C",
    tempo: 138,
    chords: ["C7", "C7"],
    rh: [
      "C5/4:5 Bb4/2:4 G4/4:3 Gb4/2:2 F4/4:1 Eb4/2:3 C4/6:1",
      "(Eb4:2)E4/4:2 G4/2:3 A4/4:4 G4/2:3 E4/4:2 C4/8:1"
    ],
    lh: "octave-stomp"
  },

  // ===================================================================
  // LEVEL 2
  // ===================================================================

  {
    id: "riff-yancey-sigh",
    level: 2,
    cat: "riff",
    style: "yancey",
    tech: ["grace", "blues-scale"],
    title: { nl: "Yancey-zucht", en: "Yancey sigh" },
    desc: {
      nl: "Een langzaam, ruim riff in de manier van Jimmy Yancey: een lang aangehouden geknepen terts, dan een korte zuchtende afloop C-A-G-E. Maat 2 herhaalt de vorm vanaf de lage C, nu met de blauwe Bes. Zo'n afloop met geknepen terts is gangbare woordenschat van de trage blues die je bij Yancey hoort; het riff zelf is geen citaat uit een opname.",
      en: "A slow, spacious riff in Jimmy Yancey's manner: a long, held crushed third, then a short sighing descent C-A-G-E. Bar 2 repeats the shape from low C, now with the bluesy Bb. A fall with a crushed third like this is common slow-blues vocabulary that you hear with Yancey; the riff itself is not a quote from a recording."
    },
    tip: {
      nl: "Hand in de C6-ligging: C=1, E=2, G=3, A of Bes=4, hoge C=5; je hoeft nergens te verspringen. Laat de lange noten echt doorklinken en speel de korte noten zacht en iets laat, alsof je even aarzelt.",
      en: "Hand in the C6 position: C=1, E=2, G=3, A or Bb=4, high C=5; no position shifts anywhere. Let the long notes really ring and play the short notes soft and slightly late, as if you hesitate."
    },
    key: "C",
    tempo: 88,
    chords: ["C7", "C7"],
    rh: [
      "(Eb4:2)E4+G4/10:23 C5/2:5 A4/4:4 G4/2:3 (Eb4:2)E4/6:2",
      "C4/10:1 G4/2:3 Bb4/4:4 G4/2:3 (Eb4:2)E4/4:2 C4/2:1"
    ],
    lh: "yancey"
  },

  {
    id: "turn-tritone-shuffle",
    level: 2,
    cat: "turnaround",
    style: "kansascity",
    tech: ["chords"],
    title: { nl: "Tritonus-turnaround", en: "Tritone turnaround" },
    desc: {
      nl: "Turnaround met wisselakkoorden per halve maat (C7-F7, C7-G7). De rechterhand speelt steeds de terts en septiem van het akkoord (E-Bes, Es-A, F-B), die telkens maar een halve toon verschuiven. Standaard stemvoering uit de Kansas City- en swingbegeleiding; geen specifieke bron.",
      en: "Turnaround with chords changing every half bar (C7-F7, C7-G7). The right hand plays the third and seventh of each chord (E-Bb, Eb-A, F-B), which only ever move by a half step. Standard voice leading from Kansas City and swing comping; no specific source."
    },
    tip: {
      nl: "Duim en vinger 4 schuiven samen een halve toon: E-Bes naar Es-A is één kleine beweging naar beneden. De korte noot met 5 op de bovenste C of D geeft elke halve maat een staartje; houd die licht.",
      en: "Thumb and finger 4 slide together by a half step: E-Bb to Eb-A is one small move down. The short note with 5 on top (C or D) gives every half bar a little tail; keep it light."
    },
    key: "C",
    tempo: 132,
    chords: ["C7 F7", "C7 G7"],
    rh: [
      "E4+Bb4/4:14 E4+Bb4/2:14 E4+Bb4/4:14 E4+C5/2:15 Eb4+A4/4:14 Eb4+A4/2:14 Eb4+A4/4:14 Eb4+C5/2:15",
      "E4+Bb4/4:14 E4+Bb4/2:14 E4+C5/4:15 E4+C5/2:15 F4+B4/4:14 F4+B4/2:14 F4+B4/4:14 F4+D5/2:15"
    ],
    lh: "walking-eighths"
  },

  {
    id: "riff-chromatic-sixths",
    level: 2,
    cat: "riff",
    style: "chicago",
    tech: ["sixths"],
    title: { nl: "Chromatisch zakkende sexten", en: "Sliding chromatic sixths" },
    desc: {
      nl: "Parallelle sexten die chromatisch zakken: G-E via Ges-Es en F-D naar E-C. Standaardfiguur, te horen bij Albert Ammons en Pete Johnson. Maat 2 schommelt tussen A-F en G-E, de 'IV-buur' die C7 extra glans geeft.",
      en: "Parallel sixths sliding down chromatically: G-E through Gb-Eb and F-D to E-C. A standard figure, heard with Albert Ammons and Pete Johnson. Bar 2 rocks between A-F and G-E, the IV-neighbour that gives C7 extra shine."
    },
    tip: {
      nl: "Begin met 1-5 op G-E en schuif dan met 1-4 omlaag: duim en vinger 4 glijden samen, de hand blijft rustig. In maat 2 wissel je 2-5 (A-F) en 1-4 (G-E) af, zodat de hand niet hoeft te springen. Speel kort en gelijkmatig; beide noten van de sext moeten precies tegelijk klinken.",
      en: "Start with 1-5 on G-E, then slide down with 1-4: thumb and finger 4 glide together while the hand stays calm. In bar 2 alternate 2-5 (A-F) and 1-4 (G-E) so the hand does not have to jump. Play detached and even; both notes of the sixth must sound exactly together."
    },
    key: "C",
    tempo: 132,
    chords: ["C7", "C7"],
    rh: [
      "G4+E5/4:15 G4+E5/2:15 Gb4+Eb5/4:14 F4+D5/2:14 E4+C5/4:14 E4+C5/2:14 r/6",
      "A4+F5/4:25 G4+E5/2:14 A4+F5/4:25 G4+E5/2:14 E4+C5/6:14 r/6"
    ],
    lh: "broken-octaves"
  },

  {
    id: "riff-c6-c9-stabs",
    level: 2,
    cat: "riff",
    style: "kansascity",
    tech: ["chords", "syncopation"],
    title: { nl: "C6-, C7- en C9-stoten", en: "C6, C7 and C9 stabs" },
    desc: {
      nl: "De rechterhand als blazerssectie: korte akkoordstoten met C6 (E-A-C), C9 (E-Bes-D) en C7 (E-G-Bes). Maat 1 heeft een vooruitgeschoven C9, maat 2 zet elke stoot op de shuffle-achtertel. Standaardfiguur uit de Kansas City-jumpbands, door pianisten als Pete Johnson naar het klavier vertaald; geen specifieke opname.",
      en: "The right hand as a horn section: short chord stabs with C6 (E-A-C), C9 (E-Bb-D) and C7 (E-G-Bb). Bar 1 has an anticipated C9, bar 2 puts every stab on the shuffle offbeat. A standard figure from the Kansas City jump bands, carried over to the keyboard by pianists such as Pete Johnson; no specific recording."
    },
    tip: {
      nl: "Duim blijft op E; alleen de bovenste vingers wisselen (1-3-5 voor C6 en C9, 1-2-4 voor C7). Tel de rusten hardop mee: de stoten in maat 2 vallen op het laatste triooltje van elke tel, net vóór de linkerhand.",
      en: "The thumb stays on E; only the upper fingers change (1-3-5 for C6 and C9, 1-2-4 for C7). Count the rests out loud: the stabs in bar 2 fall on the last triplet of each beat, just ahead of the left hand."
    },
    key: "C",
    tempo: 138,
    chords: ["C7", "C7"],
    rh: [
      "E4+A4+C5/4:135 E4+A4+C5/2:135 r/4 E4+Bb4+D5/8:135 r/6",
      "r/4 E4+A4+C5/2:135 r/4 E4+Bb4+D5/2:135 r/4 E4+A4+C5/2:135 r/4 E4+G4+Bb4/2:124"
    ],
    lh: "walking-eighths"
  },

  {
    id: "riff-nola-triplet-chords",
    level: 2,
    cat: "riff",
    style: "neworleans",
    tech: ["chords", "triplets", "repeated", "grace"],
    title: { nl: "Triolenakkoorden (New Orleans)", en: "Triplet chords (New Orleans)" },
    desc: {
      nl: "Herhaalde akkoorden in triolen, het handelsmerk van Fats Domino (denk aan Blueberry Hill uit 1956). De kleur verschuift van C naar C7 en C6; in maat 2 komt het F-buurakkoord langs voordat de geknepen C terugkeert.",
      en: "Repeated chords in triplets, the trademark of Fats Domino (think of Blueberry Hill from 1956). The colour shifts from C to C7 and C6; in bar 2 the F neighbour chord passes by before the crushed C returns."
    },
    tip: {
      nl: "Speel de triolen vanuit de onderarm met een soepele pols, niet uit de vingers; houd de vingers per akkoord gelijk (1-2-5, 1-2-4, 1-2-3, en 1-3-5 voor F). De duim glijdt van Es naar E voor de geknepen inzet. Gelijkmatigheid gaat vóór volume.",
      en: "Play the triplets from the forearm with a supple wrist, not from the fingers; keep the same fingers per chord (1-2-5, 1-2-4, 1-2-3, and 1-3-5 for F). The thumb slides from Eb to E for the crushed entry. Evenness comes before volume."
    },
    key: "C",
    tempo: 100,
    chords: ["C7", "C7"],
    rh: [
      "(Eb4:1)E4+G4+C5/2:125 E4+G4+C5/2:125 E4+G4+C5/2:125 E4+G4+C5/2:125 E4+G4+C5/2:125 E4+G4+C5/2:125 E4+G4+Bb4/2:124 E4+G4+Bb4/2:124 E4+G4+Bb4/2:124 E4+G4+A4/6:123",
      "F4+A4+C5/2:135 F4+A4+C5/2:135 F4+A4+C5/2:135 (Eb4:1)E4+G4+C5/2:125 E4+G4+C5/2:125 E4+G4+C5/2:125 E4+G4+C5/6:125 r/6"
    ],
    lh: "nola-bass"
  },

  {
    id: "fill-triplet-cascade",
    level: 2,
    cat: "fill",
    style: "pinetop",
    tech: ["grace", "blues-scale", "repeated"],
    title: { nl: "Pine Tops Dis-E met oploop", en: "Pine Top's D#-E with run-up" },
    desc: {
      nl: "De figuur waarmee Pine Top Smith een heel chorus vult: Dis schuift naar E en blijft liggen, dan een snelle chromatische oploop G-A-Ais-B naar C en D, en meteen weer Dis-E. Hij speelt hem ook op F7 gewoon door. Bron: de gedrukte uitgave The Original Boogie Woogie (Melrose, 1929, bewerkt door Tiny Parham), publiek domein; daar in F, hier naar C getransponeerd. Overgenomen uit letter B van die uitgave.",
      en: "The figure Pine Top Smith fills a whole chorus with: D# slides to E and is held, then a quick chromatic run-up G-A-A#-B to C and D, and straight back to D#-E. He simply keeps playing it over F7 as well. Source: the printed edition The Original Boogie Woogie (Melrose, 1929, edited by Tiny Parham), public domain; in F there, transposed to C here. Taken from letter B of that edition."
    },
    tip: {
      nl: "Vinger 3 glijdt van Dis naar E. De oploop is 1-2-3-4 en de duim gaat onder 4 door naar C, daarna 2 op D; zo ligt 3 weer klaar op Dis. Speel de vier kleine noten als een veeg vlak voor de tel, niet als afgemeten zestienden.",
      en: "Finger 3 slides from D# to E. The run-up is 1-2-3-4 and the thumb passes under 4 to C, then 2 on D; that leaves 3 ready on D# again. Play the four small notes as one sweep just before the beat, not as measured sixteenths."
    },
    key: "C",
    tempo: 120,
    chords: ["C7", "C7"],
    rh: [
      "D#5/4:3 E5/8:3 r/6 (G4:1,A4:2,A#4:3,B4:4)C5/4:1 D5/2:2",
      "D#5/4:3 E5/8:3 r/6 (G4:1,A4:2,A#4:3,B4:4)C5/4:1 D5/2:2"
    ],
    lh: "pinetop"
  },

  // ===================================================================
  // LEVEL 3
  // ===================================================================

  {
    id: "break-stop-time",
    level: 3,
    cat: "break",
    style: "pinetop",
    tech: ["chords", "syncopation", "thirds"],
    title: { nl: "Pine Tops shout-chorus (stop-time)", en: "Pine Top's shout chorus (stop-time)" },
    desc: {
      nl: "Het chorus waarin Pine Top Smith de dansers toeroept: twee korte C6-akkoorden per maat, op tel 1 en vlak voor tel 4, boven een wandelende bas in gebroken octaven. Op F7 zakt alleen de E een halve toon (E wordt Es), op G7 en F7 in maat 9-10 komen andere grepen, en maat 11 loopt in gesyncopeerde tweeklanken terug naar C, waarna de bas het Pine Top-patroon inzet. Bron: de gedrukte uitgave The Original Boogie Woogie (Melrose, 1929, bewerkt door Tiny Parham), publiek domein; daar in F, hier naar C getransponeerd. Overgenomen uit letter D van die uitgave.",
      en: "The chorus in which Pine Top Smith calls out to the dancers: two short C6 chords per bar, on beat 1 and just before beat 4, over a walking bass in broken octaves. On F7 only the E drops a half step (E becomes Eb), on G7 and F7 in bars 9-10 the shapes change, and bar 11 walks back to C in syncopated double notes, after which the bass starts the Pine Top pattern. Source: the printed edition The Original Boogie Woogie (Melrose, 1929, edited by Tiny Parham), public domain; in F there, transposed to C here. Taken from letter D of that edition."
    },
    tip: {
      nl: "Tel de stiltes mee: het tweede akkoord valt op de korte achtste na tel 3 en wordt even vastgehouden. Het C6-akkoord (C-E-G-A-C) neem je met alle vijf vingers; voor F7 schuift alleen vinger 2 van E naar Es. Oefen de linkerhand eerst apart: 5-1 in octaven, de pink op de tel. In maat 11 beginnen de tweeklanken op de korte achtste na tel 1.",
      en: "Count through the silences: the second chord falls on the short eighth after beat 3 and is held briefly. Take the C6 chord (C-E-G-A-C) with all five fingers; for F7 only finger 2 moves from E to Eb. Practise the left hand alone first: 5-1 in octaves, little finger on the beat. In bar 11 the double notes start on the short eighth after beat 1."
    },
    key: "C",
    tempo: 126,
    chords: ["C7", "C7", "C7", "C7", "F7", "F7", "C7", "C7", "G7", "F7", "C7", "C7"],
    rh: [
      "C5+E5+G5+A5+C6/6:12345 r/10 C5+E5+G5+A5+C6/6:12345 r/2",
      "C5+E5+G5+A5+C6/6:12345 r/10 C5+E5+G5+A5+C6/6:12345 r/2",
      "C5+E5+G5+A5+C6/6:12345 r/10 C5+E5+G5+A5+C6/6:12345 r/2",
      "C5+E5+G5+A5+C6/6:12345 r/10 C5+E5+G5+A5+C6/6:12345 r/2",
      "C5+Eb5+G5+A5+C6/6:12345 r/10 C5+Eb5+G5+A5+C6/6:12345 r/2",
      "C5+Eb5+G5+A5+C6/6:12345 r/10 C5+Eb5+G5+A5+C6/6:12345 r/2",
      "C5+E5+G5+A5+C6/6:12345 r/10 C5+E5+G5+A5+C6/6:12345 r/2",
      "C5+E5+G5+A5+C6/6:12345 r/10 C5+E5+G5+A5+C6/6:12345 r/2",
      "G4+B4+D5+F5+G5/6:12345 r/10 G4+B4+D5+F5+G5/6:12345 r/2",
      "G4+A4+C5+Eb5/6:1235 r/10 G4+A4+C5+Eb5/6:1235 r/2",
      "C5/4:1 G5+C6/6:25 G5+C6/2:25 F5+A5/4:35 F5+A5/2:35 D5/4:2 Eb5+G5/2:35",
      "G4+C5+E5/6:135 r/18"
    ],
    lh: [
      "C2/4:5 C3/2:1 E2/4:5 E3/2:1 G2/4:5 G3/2:1 A2/4:5 A3/2:1",
      "C3/4:5 C4/2:1 A2/4:5 A3/2:1 G2/4:5 G3/2:1 E2/4:5 E3/2:1",
      "C2/4:5 C3/2:1 E2/4:5 E3/2:1 G2/4:5 G3/2:1 A2/4:5 A3/2:1",
      "C3/4:5 C4/2:1 A2/4:5 A3/2:1 G2/4:5 G3/2:1 E2/4:5 E3/2:1",
      "F1/4:5 F2/2:1 A1/4:5 A2/2:1 C2/4:5 C3/2:1 D2/4:5 D3/2:1",
      "Eb2/4:5 Eb3/2:1 D2/4:5 D3/2:1 C2/4:5 C3/2:1 A1/4:5 A2/2:1",
      "C2/4:5 C3/2:1 E2/4:5 E3/2:1 G2/4:5 G3/2:1 A2/4:5 A3/2:1",
      "C3/4:5 C4/2:1 A2/4:5 A3/2:1 G2/4:5 G3/2:1 E2/4:5 E3/2:1",
      "G1/4:5 G2/2:1 B1/4:5 B2/2:1 D2/4:5 D3/2:1 B1/4:5 B2/2:1",
      "F1/4:5 F2/2:1 A1/4:5 A2/2:1 C2/4:5 C3/2:1 A1/4:5 A2/2:1",
      "C2/4:5 E2/6:3 E2/2:3 F2/6:2 F#2/6:2",
      "C2+G2/4:52 C2+G2/2:52 C2+A2/4:51 C2+A2/2:51 C2+G2/4:52 C2+G2/2:52 C2+Eb2/4:53 C2+E2/2:53"
    ]
  },

  {
    id: "riff-simple-tremolo",
    level: 3,
    cat: "riff",
    style: "chicago",
    tech: ["tremolo"],
    title: { nl: "Eenvoudig tremolo", en: "Simple tremolo" },
    desc: {
      nl: "Een uitgeschreven tremolo: G wisselt snel met C-E (maat 1) en met Bes-E (maat 2), daarna een kort shuffle-staartje terug naar G. Standaardfiguur om spanning op te bouwen, te horen bij Albert Ammons en Meade Lux Lewis.",
      en: "A written-out tremolo: G alternates rapidly with C-E (bar 1) and with Bb-E (bar 2), then a short shuffle tail back to G. A standard figure for building tension, heard with Albert Ammons and Meade Lux Lewis."
    },
    tip: {
      nl: "Duim op G, 3-5 op C-E en 2-5 op Bes-E. Tremolo komt uit een draaiende onderarm, niet uit de vingers: duim en bovenste vingers wippen als een wip heen en weer. Begin langzaam en gelijkmatig, en laat het staartje op tel 4 (maat 1) en tel 3 (maat 2) precies op tijd landen.",
      en: "Thumb on G, 3-5 on C-E and 2-5 on Bb-E. A tremolo comes from a rotating forearm, not from the fingers: thumb and upper fingers rock like a seesaw. Start slowly and evenly, and make the tail on beat 4 (bar 1) and beat 3 (bar 2) land exactly in time."
    },
    key: "C",
    tempo: 128,
    chords: ["C7", "C7"],
    rh: [
      "G4/1:1 C5+E5/1:35 G4/1:1 C5+E5/1:35 G4/1:1 C5+E5/1:35 G4/1:1 C5+E5/1:35 G4/1:1 C5+E5/1:35 G4/1:1 C5+E5/1:35 G4/1:1 C5+E5/1:35 G4/1:1 C5+E5/1:35 G4/1:1 C5+E5/1:35 Bb4/4:2 G4/2:1",
      "G4/1:1 Bb4+E5/1:25 G4/1:1 Bb4+E5/1:25 G4/1:1 Bb4+E5/1:25 G4/1:1 Bb4+E5/1:25 G4/1:1 Bb4+E5/1:25 G4/1:1 Bb4+E5/1:25 C5+E5/4:35 Bb4/2:2 G4/6:1"
    ],
    lh: "ammons-rolling"
  },

  {
    id: "riff-call-response",
    level: 3,
    cat: "riff",
    style: "kansascity",
    tech: ["blues-scale", "grace", "thirds", "chords"],
    title: { nl: "Vraag en antwoord", en: "Call and response" },
    desc: {
      nl: "Vier maten vraag-en-antwoord, de grondvorm van de Kansas City-riffbands: een hoge enkelstemmige 'vraag' wordt beantwoord door tertsen en akkoorden in het midden. De frasen zelf zijn standaard bluesfrasen; de combinatie is een eigen lesvorm, geen citaat. De tweede vraag eindigt open op Bes, het tweede antwoord lost op naar C.",
      en: "Four bars of call and response, the basic form of the Kansas City riff bands: a high single-line call is answered by thirds and chords in the middle. The phrases themselves are standard blues phrases; the combination is an own teaching form, not a quote. The second call ends open on Bb, the second answer resolves to C."
    },
    tip: {
      nl: "Gebruik de rusten aan het begin van elke maat om rustig te verspringen; de hand moet al boven de nieuwe ligging hangen vóór de eerste noot. Hoog: E=2, G=3, Bes=4, C=5. Midden: 2-4 voor Fis/G-Bes, 1-3 voor E-G en de duim op E voor de akkoorden. Laat het antwoord iets voller klinken dan de vraag.",
      en: "Use the rests at the start of each bar to shift calmly; the hand should already hover over the new position before the first note. High: E=2, G=3, Bb=4, C=5. Middle: 2-4 for F#/G-Bb, 1-3 for E-G and the thumb on E for the chords. Let the answer sound a little fuller than the call."
    },
    key: "C",
    tempo: 144,
    chords: ["C7", "C7", "C7", "C7"],
    rh: [
      "r/4 Bb5/2:4 C6/4:5 Bb5/2:4 G5/4:3 (Eb5:2)E5/2:2 G5/6:3",
      "r/6 (F#4:2)G4+Bb4/4:24 G4+Bb4/2:24 E4+G4/4:13 E4+G4/2:13 E4+G4/6:13",
      "r/4 Bb5/2:4 C6/4:5 C6/2:5 Bb5/4:4 G5/2:3 Bb5/6:4",
      "r/6 E4+G4+Bb4/4:124 E4+G4+Bb4/2:124 E4+G4+A4/4:123 E4+G4+A4/2:123 E4+G4+C5/6:125"
    ],
    lh: "walking-eighths"
  },

  {
    id: "riff-c7-f7-sixths",
    level: 3,
    cat: "riff",
    style: "chicago",
    tech: ["sixths", "grace", "triplets"],
    title: { nl: "Sextenriff door C7 en F7", en: "Sixths riff through C7 and F7" },
    desc: {
      nl: "Een vier-maats riff boven een liggende duimnoot: op C7 een sext G-E met geknepen Es, op F7 schuift de bovenstem naar Es (de septiem van F7) boven A. Een liggende duimnoot met bewegende bovenstem is standaardwoordenschat, te horen bij Albert Ammons en Meade Lux Lewis. Zo leer je een riff aan het akkoord aan te passen in plaats van hem blind te herhalen.",
      en: "A four-bar riff over a held thumb note: on C7 a sixth G-E with a crushed Eb, on F7 the top voice moves to Eb (the seventh of F7) above A. A held thumb note with a moving top voice is standard vocabulary, heard with Albert Ammons and Meade Lux Lewis. This teaches you to adapt a riff to the chord instead of repeating it blindly."
    },
    tip: {
      nl: "De geknepen Es speel je met 4 en de E met 5, terwijl de duim G aanslaat: één beweging. In maat 3 verschuift de duim slechts één toets naar A. Maat 4 begint met een rust; daar zit de syncope, dus niet inhalen.",
      en: "Play the crushed Eb with 4 and the E with 5 while the thumb strikes G: one motion. In bar 3 the thumb only moves one key up to A. Bar 4 starts with a rest; that is where the syncopation is, so do not rush in."
    },
    key: "C",
    tempo: 144,
    chords: ["C7", "C7", "F7", "C7"],
    rh: [
      "(Eb5:4)G4+E5/4:15 G4+E5/2:15 G4+C5/4:13 G4+Bb4/2:12 r/4 G4+C5/2:13 G4+C5/6:13",
      "(Eb5:4)G4+E5/4:15 G4+E5/2:15 C5/2:3 Bb4/2:2 G4/2:1 Bb4/2:2 G4/2:1 Bb4/2:2 C5/6:3",
      "A4+Eb5/4:14 A4+Eb5/2:14 A4+C5/4:13 A4+Eb5/2:14 r/4 A4+C5/2:13 A4+C5/6:13",
      "r/4 (Eb5:4)G4+E5/2:15 G4+E5/4:15 G4+C5/2:13 G4+Bb4/4:12 G4+A4/2:12 G4+C5/6:13"
    ],
    lh: "broken-octaves"
  },

  {
    id: "riff-rocknroll-octaves",
    level: 3,
    cat: "riff",
    style: "rocknroll",
    tech: ["octaves", "blues-scale"],
    title: { nl: "Rock-'n-roll-octaven", en: "Rock and roll octaves" },
    desc: {
      nl: "Een stevig octaafriff voor rock-'n-roll en jump blues: G-Bes-C in octaven, dan een blauwe Es die naar E oplost en een chromatische klim Bes-B-C. Een boogielijn in rechterhandoctaven verdubbelen, als een saxofoonsectie, is standaard in jump blues en vroege rock-'n-roll; dit riff is een eigen combinatie van die elementen, geen citaat.",
      en: "A punchy octave riff for rock and roll and jump blues: G-Bb-C in octaves, then a bluesy Eb resolving to E and a chromatic climb Bb-B-C. Doubling a boogie line in right-hand octaves, like a sax section, is standard in jump blues and early rock and roll; this riff is an own combination of those elements, not a quote."
    },
    tip: {
      nl: "Witte toetsen 1-5, zwarte toetsen 1-4: zo blijft de hand smal en kan hij dicht bij de zwarte toetsen blijven. Laat de octaven vanuit de pols komen met een vaste handvorm; speel eerst alleen de duimlijn om de sprongen te leren.",
      en: "White keys 1-5, black keys 1-4: that keeps the hand narrow and close to the black keys. Let the octaves come from the wrist with a fixed hand shape; first play only the thumb line to learn the leaps."
    },
    key: "C",
    tempo: 144,
    chords: ["C7", "C7"],
    rh: [
      "G4+G5/4:15 G4+G5/2:15 Bb4+Bb5/4:14 G4+G5/2:15 C5+C6/4:15 C5+C6/2:15 Bb4+Bb5/4:14 G4+G5/2:15",
      "Eb4+Eb5/4:14 E4+E5/2:15 G4+G5/4:15 Bb4+Bb5/2:14 r/4 B4+B5/2:15 C5+C6/6:15"
    ],
    lh: "octave-stomp"
  }

]);
