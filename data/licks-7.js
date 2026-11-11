/* Pine Top's Boogie Woogie: figures taken from the printed edition
   "The Original Boogie Woogie", Clarence "Pine Top" Smith, edited by Tiny Parham,
   Melrose Music Corp. 1929 (public domain). The edition is in F; everything here is transposed to C.
   See also: the 'pinetop' left-hand pattern, chorus-pinetop (letter C), fill-triplet-cascade (letter B)
   and break-stop-time (letter D). */
BW.addLicks([
  {
    id: 'pinetop-one-note-riff',
    level: 2,
    cat: 'riff',
    style: 'pinetop',
    tech: ['grace', 'repeated', 'syncopation'],
    title: { nl: 'Pine Tops riff op één noot', en: 'Pine Top\'s one-note riff' },
    desc: {
      nl: 'Een heel chorus op één noot: drie korte voorslagen G-A-B naar een geaccentueerde C, meteen nog een C, en die blijft liggen tot in de volgende maat. Daarna twee tellen stilte, en opnieuw. De bas doet al het werk. Bron: de gedrukte uitgave The Original Boogie Woogie (Melrose, 1929, bewerkt door Tiny Parham), publiek domein; daar in F, hier naar C getransponeerd. Overgenomen uit letter F van die uitgave.',
      en: 'A whole chorus on one note: three quick grace notes G-A-B into an accented C, straight away another C, and that one is held into the next bar. Then two beats of silence, and again. The bass does all the work. Source: the printed edition The Original Boogie Woogie (Melrose, 1929, edited by Tiny Parham), public domain; in F there, transposed to C here. Taken from letter F of that edition.'
    },
    tip: {
      nl: 'Voorslagen met 1-2-3, de C met 4: de hand blijft in één positie liggen. Beide C\'s krijgen een accent en de tweede wordt over de maatstreep vastgehouden. Speel hem ook op F7 gewoon door, zoals Pine Top doet.',
      en: 'Grace notes with 1-2-3, the C with 4: the hand stays in one position. Both Cs are accented and the second is held across the bar line. Simply keep playing it over F7 as well, as Pine Top does.'
    },
    key: 'C',
    tempo: 126,
    chords: ['C7', 'C7', 'C7', 'C7'],
    rh: [
      'r/18 (G4:1,A4:2,B4:3)C5/4:4 C5/2:4~',
      'C5/6:4 r/12 (G4:1,A4:2,B4:3)C5/4:4 C5/2:4~',
      'C5/6:4 r/12 (G4:1,A4:2,B4:3)C5/4:4 C5/2:4~',
      'C5/6:4 r/18'
    ],
    lh: 'pinetop'
  },
  {
    id: 'pinetop-closing-phrase',
    level: 3,
    cat: 'turnaround',
    style: 'pinetop',
    tech: ['chords', 'blues-scale', 'grace'],
    title: { nl: 'Pine Tops slotfrase (maat 9-12)', en: 'Pine Top\'s closing phrase (bars 9-12)' },
    desc: {
      nl: 'Zo sluit Pine Top zijn eerste chorus af. Op G7 twee stops: eerst het septiemakkoord met voorslag, dan een greep die een toets zakt (A-C-D-F). Op F7 een blueslijntje dat rond de terts draait (Es, Gis-A, C, Es-D-C, A, Es) en op C landt; in maat 11 antwoordt een snelle loop omlaag vanaf A. Bron: de gedrukte uitgave The Original Boogie Woogie (Melrose, 1929, bewerkt door Tiny Parham), publiek domein; daar in F, hier naar C getransponeerd. Overgenomen uit letter A en B van die uitgave; het ritme van de snelle noten is aangepast aan het shuffle-raster.',
      en: 'This is how Pine Top closes his first chorus. Two stops on G7: first the seventh chord with a grace note, then a shape that drops one key (A-C-D-F). On F7 a blues line circling the third (Eb, G#-A, C, Eb-D-C, A, Eb) that lands on C; in bar 11 a quick run down from A answers. Source: the printed edition The Original Boogie Woogie (Melrose, 1929, edited by Tiny Parham), public domain; in F there, transposed to C here. Taken from letters A and B of that edition; the rhythm of the fast notes is adapted to the shuffle grid.'
    },
    tip: {
      nl: 'Maat 10 is de kern: 4 op Es, de duim glijdt van Gis naar A, 2 op C, dan Es-D-C met 4-3-2 en de duim op A. Vinger 2 pakt de lage Es en glijdt in maat 11 door naar E onder het C-akkoord (2-3-5). De loop in maat 11 is 5-4-3-2-1 vanaf de hoge A; daarna springt de hand naar Es-A (2-4), en vinger 2 glijdt weer naar E van het slotakkoord.',
      en: 'Bar 10 is the heart: 4 on Eb, the thumb slides from G# to A, 2 on C, then Eb-D-C with 4-3-2 and the thumb on A. Finger 2 takes the low Eb and in bar 11 slides on to E under the C chord (2-3-5). The run in bar 11 is 5-4-3-2-1 from the high A; then the hand jumps to Eb-A (2-4), and finger 2 slides on to the E of the final chord.'
    },
    key: 'C',
    tempo: 120,
    chords: ['G7', 'F7', 'C7', 'C7'],
    rh: [
      '(A#4:1)B4+D5+F5/6:235 r/10 A4+C5+D5+F5/6:1235 r/2',
      'Eb5/4:4 G#4/2:1 A4/4:1 C5/2:2 Eb5/4:4 D5/1:3 C5/1:2 A4/4:1 Eb4/2:2',
      'E4+G4+C5/6:235 r/6 A5/2:5 G5/1:4 F5/1:3 Eb5/2:2 D5/4:1 Eb4+A4/2:24',
      'E4+G4+C5/6:235 r/18'
    ],
    lh: 'pinetop'
  },
  {
    id: 'pinetop-intro-tremolo',
    level: 3,
    cat: 'intro',
    style: 'pinetop',
    tech: ['tremolo', 'grace'],
    title: { nl: 'Pine Tops tremolo-intro', en: 'Pine Top\'s tremolo intro' },
    desc: {
      nl: 'De opening van Pine Top\'s Boogie Woogie: de rechterhand tremoleert op telkens twee noten, eerst E-G, dan G-Bes, nog eens hetzelfde, en dan omhoog naar A-C en C-Es; de linkerhand begint een octaaf lager op E-G en tremoleert daarna tussen grondtoon en kwint of septiem (C-Bes, C-G, F-C, F-Es). Drie voorslagen naar een geaccentueerde C breken het af en de bas zet in, met Dis-E als staartje. Bron: de gedrukte uitgave The Original Boogie Woogie (Melrose, 1929, bewerkt door Tiny Parham), publiek domein; daar in F, hier naar C getransponeerd. Overgenomen uit letter A van die uitgave; de laatste maat (akkoorden in de rechterhand) is weggelaten.',
      en: 'The opening of Pine Top\'s Boogie Woogie: the right hand tremolos on two notes at a time, first E-G, then G-Bb, the same again, and then up to A-C and C-Eb; the left hand starts an octave lower on E-G and then tremolos between root and fifth or seventh (C-Bb, C-G, F-C, F-Eb). Three grace notes into an accented C break it off and the bass comes in, with D#-E as a tail. Source: the printed edition The Original Boogie Woogie (Melrose, 1929, edited by Tiny Parham), public domain; in F there, transposed to C here. Taken from letter A of that edition; the last bar (right-hand chords) is left out.'
    },
    tip: {
      nl: 'Tremolo is rollen met de onderarm, niet tikken met de vingers: rechts 1 en 3; links 3 en 1 in de eerste maat, daarna 5 en 1 op de grotere afstanden. In de uitgave staat alleen "tremolo", dus de snelheid is vrij; begin rustig en houd beide handen gelijk. Verplaats de hand op de maatstreep zonder te stoppen.',
      en: 'Tremolo is rolling the forearm, not tapping with the fingers: right hand 1 and 3; left hand 3 and 1 in the first bar, then 5 and 1 on the wider intervals. The edition only says "tremolo", so the speed is free; start calmly and keep the hands together. Move the hand at the bar line without stopping.'
    },
    key: 'C',
    tempo: 96,
    chords: ['C7', 'C7', 'C7', 'C7', 'F7', 'F7', 'C7', 'C7'],
    rh: [
      'E4/1:1 G4/1:3 E4/1:1 G4/1:3 E4/1:1 G4/1:3 E4/1:1 G4/1:3 E4/1:1 G4/1:3 E4/1:1 G4/1:3 E4/1:1 G4/1:3 E4/1:1 G4/1:3 E4/1:1 G4/1:3 E4/1:1 G4/1:3 E4/1:1 G4/1:3 E4/1:1 G4/1:3',
      'G4/1:1 Bb4/1:3 G4/1:1 Bb4/1:3 G4/1:1 Bb4/1:3 G4/1:1 Bb4/1:3 G4/1:1 Bb4/1:3 G4/1:1 Bb4/1:3 G4/1:1 Bb4/1:3 G4/1:1 Bb4/1:3 G4/1:1 Bb4/1:3 G4/1:1 Bb4/1:3 G4/1:1 Bb4/1:3 G4/1:1 Bb4/1:3',
      'E4/1:1 G4/1:3 E4/1:1 G4/1:3 E4/1:1 G4/1:3 E4/1:1 G4/1:3 E4/1:1 G4/1:3 E4/1:1 G4/1:3 E4/1:1 G4/1:3 E4/1:1 G4/1:3 E4/1:1 G4/1:3 E4/1:1 G4/1:3 E4/1:1 G4/1:3 E4/1:1 G4/1:3',
      'G4/1:1 Bb4/1:3 G4/1:1 Bb4/1:3 G4/1:1 Bb4/1:3 G4/1:1 Bb4/1:3 G4/1:1 Bb4/1:3 G4/1:1 Bb4/1:3 G4/1:1 Bb4/1:3 G4/1:1 Bb4/1:3 G4/1:1 Bb4/1:3 G4/1:1 Bb4/1:3 G4/1:1 Bb4/1:3 G4/1:1 Bb4/1:3',
      'A4/1:1 C5/1:3 A4/1:1 C5/1:3 A4/1:1 C5/1:3 A4/1:1 C5/1:3 A4/1:1 C5/1:3 A4/1:1 C5/1:3 A4/1:1 C5/1:3 A4/1:1 C5/1:3 A4/1:1 C5/1:3 A4/1:1 C5/1:3 A4/1:1 C5/1:3 A4/1:1 C5/1:3',
      'C5/1:1 Eb5/1:3 C5/1:1 Eb5/1:3 C5/1:1 Eb5/1:3 C5/1:1 Eb5/1:3 C5/1:1 Eb5/1:3 C5/1:1 Eb5/1:3 C5/1:1 Eb5/1:3 C5/1:1 Eb5/1:3 C5/1:1 Eb5/1:3 C5/1:1 Eb5/1:3 C5/1:1 Eb5/1:3 C5/1:1 Eb5/1:3',
      '(G4:1,A4:2,B4:3)C5/6:4 r/18',
      'r/24'
    ],
    lh: [
      'E3/1:3 G3/1:1 E3/1:3 G3/1:1 E3/1:3 G3/1:1 E3/1:3 G3/1:1 E3/1:3 G3/1:1 E3/1:3 G3/1:1 E3/1:3 G3/1:1 E3/1:3 G3/1:1 E3/1:3 G3/1:1 E3/1:3 G3/1:1 E3/1:3 G3/1:1 E3/1:3 G3/1:1',
      'C3/1:5 Bb3/1:1 C3/1:5 Bb3/1:1 C3/1:5 Bb3/1:1 C3/1:5 Bb3/1:1 C3/1:5 Bb3/1:1 C3/1:5 Bb3/1:1 C3/1:5 Bb3/1:1 C3/1:5 Bb3/1:1 C3/1:5 Bb3/1:1 C3/1:5 Bb3/1:1 C3/1:5 Bb3/1:1 C3/1:5 Bb3/1:1',
      'C3/1:5 G3/1:1 C3/1:5 G3/1:1 C3/1:5 G3/1:1 C3/1:5 G3/1:1 C3/1:5 G3/1:1 C3/1:5 G3/1:1 C3/1:5 G3/1:1 C3/1:5 G3/1:1 C3/1:5 G3/1:1 C3/1:5 G3/1:1 C3/1:5 G3/1:1 C3/1:5 G3/1:1',
      'C3/1:5 Bb3/1:1 C3/1:5 Bb3/1:1 C3/1:5 Bb3/1:1 C3/1:5 Bb3/1:1 C3/1:5 Bb3/1:1 C3/1:5 Bb3/1:1 C3/1:5 Bb3/1:1 C3/1:5 Bb3/1:1 C3/1:5 Bb3/1:1 C3/1:5 Bb3/1:1 C3/1:5 Bb3/1:1 C3/1:5 Bb3/1:1',
      'F3/1:5 C4/1:1 F3/1:5 C4/1:1 F3/1:5 C4/1:1 F3/1:5 C4/1:1 F3/1:5 C4/1:1 F3/1:5 C4/1:1 F3/1:5 C4/1:1 F3/1:5 C4/1:1 F3/1:5 C4/1:1 F3/1:5 C4/1:1 F3/1:5 C4/1:1 F3/1:5 C4/1:1',
      'F3/1:5 Eb4/1:1 F3/1:5 Eb4/1:1 F3/1:5 Eb4/1:1 F3/1:5 Eb4/1:1 F3/1:5 Eb4/1:1 F3/1:5 Eb4/1:1 F3/1:5 Eb4/1:1 F3/1:5 Eb4/1:1 F3/1:5 Eb4/1:1 F3/1:5 Eb4/1:1 F3/1:5 Eb4/1:1 F3/1:5 Eb4/1:1',
      'r/4 C2+G2/2:52 D#2/4:3 C2+E2/2:53 C2+G2/4:52 C2+G2/2:52 C2+A2/4:51 C2+A2/2:51',
      'C2+G2/4:52 C2+G2/2:52 D#2/4:3 C2+E2/2:53 C2+G2/4:52 C2+G2/2:52 C2+A2/4:51 C2+A2/2:51'
    ]
  },
  {
    id: 'pinetop-octave-break',
    level: 4,
    cat: 'break',
    style: 'pinetop',
    tech: ['tremolo', 'octaves', 'triplets', 'grace'],
    title: { nl: 'Pine Tops break in octaven', en: 'Pine Top\'s octave break' },
    desc: {
      nl: 'Een break zonder bas: eerst een maat tremolo op C7 in beide handen, dan spelen de handen samen, octaven uit elkaar, na drie voorslagen een dalend blueslijntje in brede triolen: C-C-Bes, G-Bes-G, en nog eens vanaf E. Bron: de gedrukte uitgave The Original Boogie Woogie (Melrose, 1929, bewerkt door Tiny Parham), publiek domein; daar in F, hier naar C getransponeerd. Overgenomen uit letter G van die uitgave; de vierde maat is vereenvoudigd tot een slotnoot.',
      en: 'A break without bass: first a bar of tremolo on C7 in both hands, then the hands play together, octaves apart, after three grace notes a falling blues line in broad triplets: C-C-Bb, G-Bb-G, and once more from E. Source: the printed edition The Original Boogie Woogie (Melrose, 1929, edited by Tiny Parham), public domain; in F there, transposed to C here. Taken from letter G of that edition; the fourth bar is simplified to a closing note.'
    },
    tip: {
      nl: 'De brede triolen zijn drie gelijke noten over twee tellen: tel "1-2-3, 1-2-3" per maat en laat je niet opjagen. Rechts 5 op C, 4 op Bes, 2 op G; links spiegelt dat met 1-2-4. In maat 3 wordt de tweede noot langer en de derde kort.',
      en: 'The broad triplets are three equal notes across two beats: count "1-2-3, 1-2-3" per bar and do not rush. Right hand 5 on C, 4 on Bb, 2 on G; the left hand mirrors that with 1-2-4. In bar 3 the second note becomes longer and the third short.'
    },
    key: 'C',
    tempo: 120,
    chords: ['C7', 'C7', 'C7', 'C7'],
    rh: [
      'E4/1:1 Bb4/1:5 E4/1:1 Bb4/1:5 E4/1:1 Bb4/1:5 E4/1:1 Bb4/1:5 E4/1:1 Bb4/1:5 E4/1:1 Bb4/1:5 E4/1:1 Bb4/1:5 E4/1:1 Bb4/1:5 E4/1:1 Bb4/1:5 E4/1:1 Bb4/1:5 E4/1:1 Bb4/1:5 E4/1:1 Bb4/1:5',
      '(G5:2,A5:3,B5:4)C6/4:5 C6/4:5 Bb5/4:4 G5/4:2 Bb5/4:4 G5/4:2',
      'E5/4:5 C5/6:3 Bb4/2:2 G4/4:1 Bb4/2:2 G4/6:1',
      'C5/12:3 r/12'
    ],
    lh: [
      'C3/1:5 G3/1:1 C3/1:5 G3/1:1 C3/1:5 G3/1:1 C3/1:5 G3/1:1 C3/1:5 G3/1:1 C3/1:5 G3/1:1 C3/1:5 G3/1:1 C3/1:5 G3/1:1 C3/1:5 G3/1:1 C3/1:5 G3/1:1 C3/1:5 G3/1:1 C3/1:5 G3/1:1',
      '(G3:4,A3:3,B3:2)C4/4:1 C4/4:1 Bb3/4:2 G3/4:4 Bb3/4:2 G3/4:4',
      'E4/4:1 C4/6:2 Bb3/2:3 G3/4:5 Bb3/2:3 G3/6:5',
      'C3+G3/12:51 r/12'
    ]
  }
]);
