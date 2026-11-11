/* Four complete 12-bar choruses in different styles (levels 4-5):
   rock and roll, Kansas City riff, Albert Ammons and modern European.
   All in C, 12/8 shuffle, 24 units per bar. */
BW.addLicks([
  /* ------------------------------------------------------------ level 4 */
  {
    id: 'chorus-rnr',
    level: 4,
    cat: 'chorus',
    style: 'rocknroll',
    tech: ['chords', 'triplets', 'repeated', 'thirds', 'grace', 'tremolo', 'octaves', 'syncopation'],
    title: { nl: 'Rock-and-roll-chorus met hamerende triolen', en: 'Rock and roll chorus with hammered triplets' },
    desc: {
      nl: 'Een chorus van 12 maten uit standaardfiguren van de rock-and-roll-piano. De hamerende triolenakkoorden hoog op de C-greep (maat 1, 3, 5, 7, 11) zijn het handelsmerk van Little Richard en Jerry Lee Lewis; de gecrushte tertsen Eb-E onder G (maat 2 en 6) zijn het standaardlick dat je hoort bij Johnnie Johnson achter Chuck Berry; de akkoordtremolo in maat 4 is typisch Jerry Lee Lewis. Op F7 komen dezelfde vormen een kwart hoger terug, maat 8 zakt in octaven door de bluesladder, maat 9-10 zijn stop-time-slagen in de rechterhand boven de doorstampende bas, en maat 11-12 sluiten af met zakkende triolen en een slag op G7.',
      en: 'A 12-bar chorus built from stock rock and roll piano figures. The hammered triplet chords high on the C grip (bars 1, 3, 5, 7, 11) are the trademark of Little Richard and Jerry Lee Lewis; the crushed Eb-E thirds under G (bars 2 and 6) are the standard lick you hear from Johnnie Johnson behind Chuck Berry; the chord tremolo in bar 4 is typical Jerry Lee Lewis. On F7 the same shapes return a fourth higher, bar 8 falls in octaves down the blues scale, bars 9-10 are stop-time hits in the right hand over the stomping bass, and bars 11-12 close with sinking triplets and a hit on G7.'
    },
    tip: {
      nl: 'Leer eerst de hamerende triolen van maat 1 (steeds 1-3-5, vanuit een losse pols) en de tertsen van maat 2 (2-4, met de duim op C). Maat 5 en 6 zijn dezelfde vormen een kwart hoger; alleen eindigt maat 6 met het triolenloopje Es-C-A (3 over de duim, dan 2-1). De tremolo in maat 4 is rotatie tussen duim en 3-5: begin in triolen en versnel pas als het los blijft. Octaven in maat 8 speel je met 1-5 op wit en 1-4 op zwart, en in maat 9-10 tel je de rusten hardop mee.',
      en: 'First learn the hammered triplets of bar 1 (always 1-3-5, from a loose wrist) and the thirds of bar 2 (2-4, with the thumb on C). Bars 5 and 6 are the same shapes a fourth higher; only bar 6 ends with the triplet run Eb-C-A (3 over the thumb, then 2-1). The tremolo in bar 4 is rotation between the thumb and 3-5: start in triplets and only speed up while it stays loose. Play the octaves in bar 8 with 1-5 on white and 1-4 on black, and count the rests out loud in bars 9-10.'
    },
    key: 'C',
    tempo: 144,
    chords: ['C7', 'C7', 'C7', 'C7', 'F7', 'F7', 'C7', 'C7', 'G7', 'F7', 'C7', 'C7 G7'],
    rh: [
      '(Eb5:4)G4+C5+E5/2:135 G4+C5+E5/2:135 G4+C5+E5/2:135 G4+C5+E5/2:135 G4+C5+E5/2:135 G4+C5+E5/2:135 G4+C5+E5/2:135 G4+C5+E5/2:135 G4+C5+E5/2:135 G4+Bb4+E5/2:135 r/4',
      '(Eb5:2)E5+G5/4:24 E5+G5/2:24 r/4 C5/2:1 (Eb5:2)E5+G5/4:24 C5/2:1 Bb4/4:2 G4/2:1',
      '(Eb5:4)G4+C5+E5/2:135 G4+C5+E5/2:135 G4+C5+E5/2:135 G4+C5+E5/2:135 G4+C5+E5/2:135 G4+C5+E5/2:135 G4+Bb4+E5/2:135 G4+Bb4+E5/2:135 G4+Bb4+E5/2:135 G4+Bb4+E5/2:135 r/4',
      'G4/1:1 C5+E5/1:35 G4/1:1 C5+E5/1:35 G4/1:1 C5+E5/1:35 G4/1:1 C5+E5/1:35 G4/1:1 C5+E5/1:35 G4/1:1 C5+E5/1:35 G4/1:1 C5+E5/1:35 G4/1:1 C5+E5/1:35 G4/1:1 C5+E5/1:35 G4+Bb4+E5/2:135 r/4',
      '(Ab5:4)C5+F5+A5/2:135 C5+F5+A5/2:135 C5+F5+A5/2:135 C5+F5+A5/2:135 C5+F5+A5/2:135 C5+F5+A5/2:135 C5+F5+A5/2:135 C5+F5+A5/2:135 C5+F5+A5/2:135 C5+Eb5+A5/2:135 r/4',
      '(Ab5:2)A5+C6/4:24 A5+C6/2:24 r/4 F5/2:1 (Ab5:2)A5+C6/4:24 F5/2:1 Eb5/2:3 C5/2:2 A4/2:1',
      '(Eb5:4)G4+C5+E5/2:135 G4+C5+E5/2:135 G4+C5+E5/2:135 G4+C5+E5/2:135 G4+C5+E5/2:135 G4+C5+E5/2:135 G4+C5+E5/2:135 G4+C5+E5/2:135 G4+C5+E5/2:135 G4+Bb4+E5/2:135 r/4',
      'C5+C6/4:15 Bb4+Bb5/2:14 G4+G5/4:15 Gb4+Gb5/2:14 F4+F5/4:15 Eb4+Eb5/2:14 D4+D5/2:15 r/4',
      'G4+B4+D5+F5/4:1235 r/6 G4+B4+D5+F5/2:1235 r/6 (Bb4:2)B4/2:2 D5/2:3 F5/2:5',
      'F4+A4+C5+Eb5/4:1235 r/6 F4+A4+C5+Eb5/2:1235 r/6 Eb5/2:5 C5/2:3 A4/2:2',
      '(Eb5:4)G4+C5+E5/2:135 G4+C5+E5/2:135 G4+C5+E5/2:135 G4+C5+E5/2:135 G4+C5+E5/2:135 G4+C5+E5/2:135 G4+Bb4+E5/2:135 G4+Bb4+E5/2:135 G4+Bb4+E5/2:135 G4+A4+Eb5/2:124 G4+A4+Eb5/2:124 G4+A4+Eb5/2:124',
      'G4+C5+E5/4:135 r/6 G4+C5+E5/2:135 G4+B4+D5+F5/4:1235 r/8'
    ],
    lh: 'octave-stomp'
  },
  {
    id: 'chorus-kc-riff',
    level: 4,
    cat: 'chorus',
    style: 'kansascity',
    tech: ['chords', 'sixths', 'grace', 'syncopation', 'triplets'],
    title: { nl: 'Kansas City-riffchorus', en: 'Kansas City riff chorus' },
    desc: {
      nl: 'Een riff-chorus zoals in de Kansas City-jumpmuziek, waar de piano een blazersriff van twee maten herhaalt en over de akkoorden meeschuift; die werkwijze hoor je bij Pete Johnson. Het riff zelf bestaat uit standaardfiguren: in maat 1 korte stoten met C6 en het verminderde buurakkoord (een halve toon erboven), in maat 2 de bekende chromatisch dalende sexten. Het riff komt terug in maat 3-4 en 7-8, schuift in maat 5-6 een kwart omhoog naar F7 en klinkt in maat 9-10 op G7 en F7. Maat 11 is de klassieke blues-turnaround in triolen (hoge C blijft liggen, de binnenstem zakt Bb-A-Ab-G), maat 12 duwt via het verminderde akkoord naar G7.',
      en: 'A riff chorus as in Kansas City jump music, where the piano repeats a two-bar horn riff and moves it along with the chords; you hear that approach with Pete Johnson. The riff itself is made of stock figures: short stabs in bar 1 with C6 and the diminished neighbour chord (a half step above), and in bar 2 the well-known chromatically falling sixths. The riff returns in bars 3-4 and 7-8, moves up a fourth to F7 in bars 5-6 and sounds on G7 and F7 in bars 9-10. Bar 11 is the classic blues turnaround in triplets (high C stays, the inner voice sinks Bb-A-Ab-G), and bar 12 pushes through the diminished chord to G7.'
    },
    tip: {
      nl: 'Alle vierklanken zijn 1-2-3-5: bij het verminderde buurakkoord schuiven 1 en 2 een halve toon en 3 en 5 een hele toon omhoog, en meteen weer terug. De dalende sexten neem je allemaal met 2-5, als één vaste handvorm die chromatisch omlaag schuift; 2 ligt al klaar vanaf het akkoord ervoor (op G, in maat 6 op C), en maat 6 gebruikt precies dezelfde vingers als maat 2, een kwart hoger. In de turnaround van maat 11 blijven duim op E en pink op C liggen; de binnenstem gaat 4-3-3-2. Leer eerst maat 1-2, daarna maat 5-6 en als laatste maat 11-12.',
      en: 'All four-note chords are 1-2-3-5: on the diminished neighbour chord 1 and 2 move up a half step and 3 and 5 a whole step, then straight back down. Take all the falling sixths with 2-5, as one fixed hand shape sliding down chromatically; 2 is already in place from the chord before (on G, in bar 6 on C), and bar 6 uses exactly the same fingers as bar 2, a fourth higher. In the turnaround of bar 11 the thumb stays on E and the little finger on C; the inner voice goes 4-3-3-2. Learn bars 1-2 first, then bars 5-6 and finally bars 11-12.'
    },
    key: 'C',
    tempo: 156,
    chords: ['C7', 'C7', 'C7', 'C7', 'F7', 'F7', 'C7', 'C7', 'G7', 'F7', 'C7', 'C7 G7'],
    rh: [
      'r/4 E4+G4+A4+C5/2:1235 E4+G4+A4+C5/4:1235 F4+Ab4+B4+D5/2:1235 E4+G4+A4+C5/4:1235 r/2 E4+G4+Bb4+C5/4:1235 r/2',
      'G4+E5/4:25 r/2 Gb4+Eb5/4:25 F4+D5/2:25 (Eb4:2)E4+C5/6:25 r/6',
      'r/4 E4+G4+A4+C5/2:1235 E4+G4+A4+C5/4:1235 F4+Ab4+B4+D5/2:1235 E4+G4+A4+C5/4:1235 r/2 E4+G4+Bb4+C5/4:1235 r/2',
      'G4+E5/4:25 r/2 Gb4+Eb5/4:25 F4+D5/2:25 (Eb4:2)E4+C5/4:25 r/2 E4+G4+Bb4+C5/4:1235 r/2',
      'r/4 A4+C5+D5+F5/2:1235 A4+C5+D5+F5/4:1235 Bb4+Db5+E5+G5/2:1235 A4+C5+D5+F5/4:1235 r/2 A4+C5+Eb5+F5/4:1235 r/2',
      'C5+A5/4:25 r/2 B4+Ab5/4:25 Bb4+G5/2:25 (Ab4:2)A4+F5/6:25 r/6',
      'r/4 E4+G4+A4+C5/2:1235 E4+G4+A4+C5/4:1235 F4+Ab4+B4+D5/2:1235 E4+G4+A4+C5/4:1235 r/2 E4+G4+Bb4+C5/4:1235 r/2',
      'G4+E5/4:25 r/2 Gb4+Eb5/4:25 F4+D5/2:25 (Eb4:2)E4+C5/6:25 r/6',
      'r/4 B4+D5+E5+G5/2:1235 B4+D5+E5+G5/4:1235 C5+Eb5+F#5+A5/2:1235 B4+D5+E5+G5/4:1235 r/2 B4+D5+F5+G5/4:1235 r/2',
      'r/4 A4+C5+D5+F5/2:1235 A4+C5+D5+F5/4:1235 Bb4+Db5+E5+G5/2:1235 A4+C5+D5+F5/4:1235 r/2 A4+C5+Eb5+F5/2:1235 r/4',
      'E4+Bb4+C5/2:145 E4+Bb4+C5/2:145 E4+Bb4+C5/2:145 E4+A4+C5/2:135 E4+A4+C5/2:135 E4+A4+C5/2:135 E4+Ab4+C5/2:135 E4+Ab4+C5/2:135 E4+Ab4+C5/2:135 E4+G4+C5/2:125 E4+G4+C5/2:125 E4+G4+C5/2:125',
      '(Eb4:1)E4+A4+C5/4:135 r/6 F4+Ab4+B4+D5/2:1235 G4+B4+D5+F5/4:1235 r/8'
    ],
    lh: 'walking-eighths'
  },

  /* ------------------------------------------------------------ level 5 */
  {
    id: 'chorus-ammons',
    level: 5,
    cat: 'chorus',
    style: 'chicago',
    tech: ['tremolo', 'octaves', 'chords', 'grace', 'triplets', 'blues-scale', 'crossover'],
    title: { nl: 'Chorus in de geest van Albert Ammons', en: 'Chorus in the spirit of Albert Ammons' },
    desc: {
      nl: 'Een krachtig chorus boven een rollende octavenbas, opgebouwd uit de standaardfiguren die je bij Albert Ammons hoort: de octaaftremolo, de gecrushte akkoorden met Eb-E (een figuur die teruggaat op Pine Top Smith) en de dalende triolenlopen door de bluesladder, het soort chorus van zijn Boogie Woogie Stomp. Maat 1 zet de toon met een octaaftremolo op C die uitloopt in een triolenwaterval door de bluesladder; maat 2 antwoordt met gecrushte volle akkoorden. Maat 3 herhaalt het idee met de tremolo op Bb, maat 4 slaat drie keer een hoog C7-akkoord. Op F7 (maat 5-6) blijft de tremolo op C liggen en volgen gecrushte F-akkoorden. In maat 7-8 loopt de waterval door en klimt weer omhoog, in maat 9-10 lossen gecrushte G7- en F7-akkoorden op in een akkoordtremolo, en het slot is groots: hamerende triolenakkoorden met een zakkende binnenstem C-Bb-A-Ab en een laatste waterval van de hoge C naar G7.',
      en: 'A powerful chorus over a rolling octave bass, built from the stock figures you hear with Albert Ammons: the octave tremolo, the crushed chords with Eb-E (a figure that goes back to Pine Top Smith) and the falling triplet runs down the blues scale, the kind of chorus of his Boogie Woogie Stomp. Bar 1 sets the tone with an octave tremolo on C that spills into a triplet waterfall down the blues scale; bar 2 answers with crushed full chords. Bar 3 repeats the idea with the tremolo on Bb, and bar 4 hits a high C7 chord three times. On F7 (bars 5-6) the tremolo stays on C, followed by crushed F chords. In bars 7-8 the waterfall runs on and climbs back up, in bars 9-10 crushed G7 and F7 chords dissolve into a chord tremolo, and the finish is big: hammered triplet chords with an inner voice sinking C-Bb-A-Ab and a last waterfall from high C down to G7.'
    },
    tip: {
      nl: 'Leer eerst de waterval van maat 1 (Bb-G-Gb-F = 4-3-2-1, dan 3 over de duim naar Eb en 2 op C, zodat je hand meteen in de greep van maat 2 staat) en de gecrushte akkoorden van maat 2 met 1-2-4-5, waarbij 4 van Eb naar E glijdt. Oefen de octaaftremolo (1-5) apart vanuit de onderarm, eerst in achtsten. In maat 9-10 blijft de handvorm van het akkoord liggen: de tremolo wisselt 1-2 onder en 4-5 boven. Maat 11 is zwaar werk: houd de pols los en de duim op G.',
      en: 'First learn the waterfall of bar 1 (Bb-G-Gb-F = 4-3-2-1, then 3 over the thumb to Eb and 2 on C, so your hand is already in the grip of bar 2) and the crushed chords of bar 2 with 1-2-4-5, where 4 slides from Eb to E. Practise the octave tremolo (1-5) separately from the forearm, in eighths at first. In bars 9-10 the chord shape stays in place: the tremolo alternates 1-2 below and 4-5 above. Bar 11 is hard work: keep the wrist loose and the thumb on G.'
    },
    key: 'C',
    tempo: 164,
    chords: ['C7', 'C7', 'C7', 'C7', 'F7', 'F7', 'C7', 'C7', 'G7', 'F7', 'C7', 'C7 G7'],
    rh: [
      'C5/1:1 C6/1:5 C5/1:1 C6/1:5 C5/1:1 C6/1:5 C5/1:1 C6/1:5 C5/1:1 C6/1:5 C5/1:1 C6/1:5 Bb5/2:4 G5/2:3 Gb5/2:2 F5/2:1 Eb5/2:3 C5/2:2',
      '(Eb5:4)G4+C5+E5+G5/4:1245 r/2 (Eb5:4)G4+C5+E5+G5/4:1245 G4+Bb4+E5+G5/2:1245 r/4 G4+Bb4+E5+G5/2:1245 G4+C5+E5+G5/4:1245 r/2',
      'Bb4/1:1 Bb5/1:5 Bb4/1:1 Bb5/1:5 Bb4/1:1 Bb5/1:5 Bb4/1:1 Bb5/1:5 Bb4/1:1 Bb5/1:5 Bb4/1:1 Bb5/1:5 G5/2:3 Gb5/2:2 F5/2:1 Eb5/2:3 C5/2:1 r/2',
      '(Eb5:2)C5+E5+G5+Bb5/4:1235 r/6 (Eb5:2)C5+E5+G5+Bb5/2:1235 C5+E5+G5+Bb5/4:1235 r/8',
      'C5/1:1 C6/1:5 C5/1:1 C6/1:5 C5/1:1 C6/1:5 C5/1:1 C6/1:5 C5/1:1 C6/1:5 C5/1:1 C6/1:5 A5/2:4 Ab5/2:3 F5/2:1 Eb5/2:3 C5/2:1 r/2',
      '(Ab5:4)C5+F5+A5+C6/4:1245 r/2 (Ab5:4)C5+F5+A5+C6/4:1245 C5+Eb5+A5+C6/2:1245 r/4 C5+Eb5+A5+C6/2:1245 C5+F5+A5+C6/4:1245 r/2',
      'C5/1:1 C6/1:5 C5/1:1 C6/1:5 C5/1:1 C6/1:5 C5/1:1 C6/1:5 C5/1:1 C6/1:5 C5/1:1 C6/1:5 Bb5/2:4 G5/2:3 Gb5/2:2 F5/2:1 Eb5/2:3 C5/2:1',
      'Bb4/2:3 G4/2:1 Bb4/2:2 C5/2:3 Eb5/2:4 E5/2:5 (Eb5:4)G4+C5+E5+G5/4:1245 r/8',
      '(Bb4:1)B4+D5+F5+G5/4:1245 r/2 B4+D5/1:12 F5+G5/1:45 B4+D5/1:12 F5+G5/1:45 B4+D5/1:12 F5+G5/1:45 B4+D5/1:12 F5+G5/1:45 B4+D5/1:12 F5+G5/1:45 B4+D5/1:12 F5+G5/1:45 F5/2:4 D5/2:2 r/2',
      '(Ab4:1)A4+C5+Eb5+F5/4:1245 r/2 A4+C5/1:12 Eb5+F5/1:45 A4+C5/1:12 Eb5+F5/1:45 A4+C5/1:12 Eb5+F5/1:45 A4+C5/1:12 Eb5+F5/1:45 A4+C5/1:12 Eb5+F5/1:45 A4+C5/1:12 Eb5+F5/1:45 Eb5/2:4 C5/2:2 A4/2:1',
      '(Eb5:4)G4+C5+E5+G5/2:1245 G4+C5+E5+G5/2:1245 G4+C5+E5+G5/2:1245 G4+Bb4+E5+G5/2:1245 G4+Bb4+E5+G5/2:1245 G4+Bb4+E5+G5/2:1245 G4+A4+Eb5+G5/2:1245 G4+A4+Eb5+G5/2:1245 G4+A4+Eb5+G5/2:1245 G4+Ab4+D5+F5/2:1245 r/4',
      'C6/2:5 Bb5/2:4 G5/2:3 Gb5/2:2 F5/2:1 Eb5/2:3 (Bb4:1)B4+D5+F5+G5/4:1245 r/6 B4+D5+F5+G5/2:1245'
    ],
    lh: 'ammons-rolling'
  },
  {
    id: 'chorus-modern',
    level: 5,
    cat: 'chorus',
    style: 'modern',
    tech: ['chords', 'syncopation', 'blues-scale', 'grace', 'repeated', 'crossover'],
    title: { nl: 'Modern Europees boogie-chorus', en: 'Modern European boogie chorus' },
    desc: {
      nl: 'Een strak chorus met de woordenschat van de moderne Europese school (Axel Zwingenberger, Vince Weber, Silvan Zingg): gesyncopeerde negen- en dertienakkoorden, snelle bluesladder-loopjes en het kruisritme van groepjes van vier triolenachtsten dat teruggaat op Meade Lux Lewis. Maat 1 en 3 zetten gesyncopeerde C9- en C13-stoten neer, maat 2 en 4 antwoorden met snelle zestiendenloopjes die op een akkoord landen. Maat 5-8 zijn een kruisritme: elke twee triolenachtsten een akkoord, afwisselend negen en dertien, zodat de accenten drie keer over vier tellen vallen; maat 6 en 8 eindigen met een loopje. In maat 9-10 komen de stoten terug op G7 en F7 met voorgetrokken akkoorden, en maat 11-12 vormen de turnaround: een loopje omhoog naar C13 en een loopje omlaag naar G9.',
      en: 'A tight chorus in the vocabulary of the modern European school (Axel Zwingenberger, Vince Weber, Silvan Zingg): syncopated ninth and thirteenth chords, fast blues-scale runs and the cross-rhythm of groups of four triplet eighths that goes back to Meade Lux Lewis. Bars 1 and 3 set down syncopated C9 and C13 punches, bars 2 and 4 answer with fast sixteenth runs that land on a chord. Bars 5-8 are a cross-rhythm: a chord every two triplet eighths, alternating ninth and thirteenth, so the accents fall three times across four beats; bars 6 and 8 end with a run. In bars 9-10 the punches return on G7 and F7 with anticipated chords, and bars 11-12 are the turnaround: a run up to C13 and a run down to G9.'
    },
    tip: {
      nl: 'Leer eerst de kruisritme-maten 5-8: alleen vinger 2 beweegt (C naar D op F7, G naar A op C7), de rest van de hand blijft liggen; accentueer de negen-akkoorden. Daarna de loopjes: omhoog G-Bb-C-Eb-E-G = 1-2-3-4-4-5 (4 glijdt van Eb naar E), omlaag in maat 4 5-4-3-2-1, 3 over de duim, 2-1, weer 3 over de duim en 2. De vastgebonden akkoorden aan het eind van maat 4, 9 en 10 vallen een triolenachtste vóór de tel: tel ze eerst langzaam uit.',
      en: 'First learn the cross-rhythm bars 5-8: only finger 2 moves (C to D on F7, G to A on C7), the rest of the hand stays put; accent the ninth chords. Then the runs: up G-Bb-C-Eb-E-G = 1-2-3-4-4-5 (4 slides from Eb to E), down in bar 4 5-4-3-2-1, 3 over the thumb, 2-1, 3 over the thumb again and 2. The tied chords at the end of bars 4, 9 and 10 fall one triplet eighth before the beat: count them out slowly first.'
    },
    key: 'C',
    tempo: 152,
    chords: ['C7', 'C7', 'C7', 'C7', 'F7', 'F7', 'C7', 'C7', 'G7', 'F7', 'C7', 'C7 G7'],
    rh: [
      '(Eb4:1)E4+G4+Bb4+D5/4:1235 r/6 E4+G4+Bb4+D5/2:1235 r/4 E4+A4+Bb4+D5/2:1235 r/4 E4+A4+Bb4+D5/2:1235',
      'r/6 G4/1:1 Bb4/1:2 C5/1:3 Eb5/1:4 E5/1:4 G5/1:5 Bb4+D5+E5+A5/4:1235 Bb4+D5+E5+A5/2:1235 r/6',
      '(Eb4:1)E4+G4+Bb4+D5/4:1235 r/6 E4+G4+Bb4+D5/2:1235 r/4 E4+A4+Bb4+D5/2:1235 r/6',
      'C6/1:5 Bb5/1:4 G5/1:3 Gb5/1:2 F5/1:1 Eb5/1:3 D5/1:2 C5/1:1 Bb4/1:3 A4/1:2 G4+Bb4+D5+E5/2:1235 r/4 G4+Bb4+D5+E5/2:1235 r/4 A4+C5+Eb5+G5/2:1235~',
      'A4+C5+Eb5+G5/2:1235 r/2 A4+D5+Eb5+G5/2:1235 r/2 A4+C5+Eb5+G5/2:1235 r/2 A4+D5+Eb5+G5/2:1235 r/2 A4+C5+Eb5+G5/2:1235 r/2 A4+D5+Eb5+G5/2:1235 r/2',
      'A4+C5+Eb5+G5/2:1235 r/2 A4+D5+Eb5+G5/2:1235 r/2 A4+C5+Eb5+G5/2:1235 r/2 A4+D5+Eb5+G5/2:1235 r/2 A4+C5+Eb5+G5/2:1235 F5/1:4 Eb5/1:3 C5/1:2 A4/1:1 G4/1:3 F4/1:2',
      'E4+G4+Bb4+D5/2:1235 r/2 E4+A4+Bb4+D5/2:1235 r/2 E4+G4+Bb4+D5/2:1235 r/2 E4+A4+Bb4+D5/2:1235 r/2 E4+G4+Bb4+D5/2:1235 r/2 E4+A4+Bb4+D5/2:1235 r/2',
      'E4+G4+Bb4+D5/2:1235 r/2 E4+A4+Bb4+D5/2:1235 r/2 E4+G4+Bb4+D5/2:1235 r/2 E4+A4+Bb4+D5/2:1235 r/4 G4/1:1 Bb4/1:2 C5/1:3 Eb5/1:4 E5/1:4 G5/1:5',
      'B4+D5+F5+A5/4:1235 r/6 B4+D5+F5+A5/2:1235 r/4 B4+E5+F5+A5/2:1235 r/4 A4+C5+Eb5+G5/2:1235~',
      'A4+C5+Eb5+G5/4:1235 r/6 A4+D5+Eb5+G5/2:1235 G5/1:5 F5/1:4 Eb5/1:3 D5/1:2 C5/1:1 A4/1:3 G4/1:2 E4/1:1 r/2 E4+G4+A4+D5/2:1235~',
      'E4+G4+A4+D5/4:1235 r/6 G4+Bb4+D5+E5/2:1235 G4/1:1 Bb4/1:2 C5/1:3 Eb5/1:4 E5/1:4 G5/1:5 Bb4+D5+E5+A5/4:1235 r/2',
      'r/4 Bb4+D5+E5+A5/2:1235 A5/1:5 G5/1:4 E5/1:3 D5/1:2 B4/2:1 B4+D5+F5+A5/4:1235 r/2 B4+E5+F5+A5/2:1235 r/4'
    ],
    lh: 'broken-octaves'
  }
]);
