/* Style vocabulary: Yancey, New Orleans and modern European boogie.
   Levels 3-5, ordered easy to hard. All in C, 12/8 shuffle, 24 units per bar. */
BW.addLicks([
  /* ------------------------------------------------------------ level 3 */
  {
    id: 'pro-yancey-call-answer',
    level: 3,
    cat: 'riff',
    style: 'yancey',
    tech: ['sixths', 'grace'],
    title: { nl: 'Vraag en stilte (Yancey)', en: 'Call and silence (Yancey)' },
    desc: {
      nl: 'Jimmy Yancey stond bekend om zijn spaarzame rechterhand: korte bluesfrases met veel ruimte, boven zijn eigen wiegende bas (de bas die Meade Lux Lewis eerde in Yancey Special). Hier zingt de rechterhand in maat 1 en 3 een korte frase en landt ze in maat 2 en 4 op een zachte sext, waarna de bas alleen verder speelt. Op F7 verandert alleen de bovenkant: E-G wordt Eb-F.',
      en: 'Jimmy Yancey was known for his sparse right hand: short blues phrases with lots of space, over his own rocking bass (the bass Meade Lux Lewis paid tribute to in Yancey Special). Here the right hand sings a short phrase in bars 1 and 3 and lands on a soft sixth in bars 2 and 4, after which the bass carries on alone. On F7 only the top changes: E-G becomes Eb-F.'
    },
    tip: {
      nl: 'Maat 1 en 3 liggen in dezelfde handpositie: duim op A, 2 op C, 3 op E of Eb. In maat 1 glijdt 3 van Eb naar E en neemt 5 de G; in maat 3 speelt 4 de F en glijdt de duim van Ab naar A. Tel de rusten hardop door: die stilte is het antwoord.',
      en: 'Bars 1 and 3 sit in the same hand position: thumb on A, 2 on C, 3 on E or Eb. In bar 1, 3 slides from Eb to E and 5 takes the G; in bar 3, 4 plays the F and the thumb slides from Ab to A. Count the rests out loud: that silence is the answer.'
    },
    key: 'C',
    tempo: 88,
    chords: ['C7', 'C7', 'F7', 'C7'],
    rh: [
      '(Eb5:3)E5/6:3 G5/4:5 E5/2:3 C5/4:2 A4/2:1 C5/6:2',
      '(Eb5:4)G4+E5/10:15 r/14',
      'Eb5/6:3 F5/4:4 Eb5/2:3 C5/4:2 (Ab4:1)A4/2:1 C5/6:2',
      '(Eb4:2)E4+C5/10:25 r/14'
    ],
    lh: 'yancey'
  },

  /* ------------------------------------------------------------ level 4 */
  {
    id: 'pro-yancey-triplet-lament',
    level: 4,
    cat: 'riff',
    style: 'yancey',
    tech: ['triplets', 'grace', 'thirds', 'crossover'],
    title: { nl: 'Triolen-klaagzang (Yancey)', en: 'Triplet lament (Yancey)' },
    desc: {
      nl: 'Gebouwd uit de standaardtaal van de trage blues zoals Yancey die speelde: triolen met een gecrushte terts, een dalende bovenstem en wiegende tweeklanken boven een stilstaande duim. De melodie zakt Eb-D-C op F7 en Bb-A-G op C7; maat 4 daalt via de bluesladder naar een zachte sext G-E.',
      en: 'Built from the stock language of the slow blues as Yancey played it: triplets with a crushed third, a falling top voice and rocking double notes above a still thumb. The melody sinks Eb-D-C on F7 and Bb-A-G on C7; bar 4 descends the blues scale to a soft G-E sixth.'
    },
    tip: {
      nl: 'Elke triool begint met de melodienoot (5, 4 of 3) en valt via de terts op 2 (meestal gecrusht: 2 glijdt dan van de zwarte naar de witte toets) naar de duim. Geef de bovenstem gewicht en speel 2 en de duim bijna fluisterend. De sprong naar Bb in maat 3 maak je in de korte rust na de A-C aan het eind van maat 2; in maat 4 kruist 3 over de duim naar Bb.',
      en: 'Each triplet starts on the melody note (5, 4 or 3) and falls through the third on 2 (mostly crushed: 2 then slides from the black key to the white) to the thumb. Give the top voice weight and play 2 and the thumb almost in a whisper. Make the leap to Bb in bar 3 in the short rest after the A-C at the end of bar 2; in bar 4, 3 crosses over the thumb to Bb.'
    },
    key: 'C',
    tempo: 80,
    chords: ['F7', 'F7', 'C7', 'C7'],
    rh: [
      'Eb5/2:5 (Ab4:2)A4/2:2 F4/2:1 D5/2:4 (Ab4:2)A4/2:2 F4/2:1 C5/2:3 A4/2:2 F4/2:1 Eb5/6:5',
      '(Ab4:2)A4+C5/2:23 F4/2:1 A4+C5/2:23 (Ab4:2)A4+D5/2:24 F4/2:1 A4+D5/2:24 A4+Eb5/2:25 F4/2:1 A4+Eb5/2:25 A4+C5/4:23 r/2',
      'Bb5/2:5 (Eb5:2)E5/2:2 C5/2:1 A5/2:4 (Eb5:2)E5/2:2 C5/2:1 G5/2:3 E5/2:2 C5/2:1 (F#5:3)G5/6:3',
      'E5/2:2 C5/2:1 Bb4/2:3 (Ab4:2)A4/4:2 G4/2:1 (Eb5:4)G4+E5/12:15'
    ],
    lh: 'yancey'
  },
  {
    id: 'pro-yancey-ending',
    level: 4,
    cat: 'ending',
    style: 'yancey',
    tech: ['sixths', 'grace', 'triplets', 'chords'],
    title: { nl: 'Stil slot met Eb-staartje', en: 'Quiet ending with an E-flat tag' },
    desc: {
      nl: 'Het beroemdste handelsmerk van Jimmy Yancey: hij liet zijn stukken bijna altijd in Eb eindigen, in welke toonsoort hij ook speelde. Hier loopt een trage blues met dalende sexten en triolen over C7-F7 en C7-G7 netjes uit op C6, waarna, net als bij Yancey, onverwacht een zacht Eb6-akkoord volgt. De linkerhand speelt een rustige habanera-achtige bas.',
      en: 'Jimmy Yancey\'s most famous trademark: he ended almost every piece in E-flat, whatever key he was playing in. Here a slow blues with falling sixths and triplets over C7-F7 and C7-G7 settles properly on C6, and then, just as Yancey did, an unexpected soft Eb6 chord follows. The left hand plays a calm, habanera-like bass.'
    },
    tip: {
      nl: 'Let op de duimglijders: C# naar D op het G7-akkoord en Eb naar E op het C6-akkoord. Aan het begin van maat 2 kruist 2 over de duim naar de Eb-voorslag. Het opmaatje G-Bb-C speel je met 1-2-3, zodat de vingers al klaarliggen voor Eb6 (1-2-3-5); laat dat akkoord heel zacht uitklinken.',
      en: 'Watch the thumb slides: C# to D on the G7 chord and Eb to E on the C6 chord. At the start of bar 2, 2 crosses over the thumb to the Eb grace note. Play the little G-Bb-C pickup with 1-2-3 so the fingers are already in place for Eb6 (1-2-3-5); let that chord ring out very softly.'
    },
    key: 'C',
    tempo: 76,
    chords: ['C7 F7', 'C7 G7', 'C6', 'Eb6'],
    rh: [
      '(Eb5:4)G4+E5/6:15 Bb4/2:3 A4/2:2 G4/2:1 (Ab4:2)A4+Eb5/6:25 C5/2:3 A4/2:2 F4/2:1',
      '(Eb4:2)E4+C5/6:25 Bb4/2:4 G4/2:3 E4/2:2 (C#4:1)D4+F4+B4/10:124 r/2',
      '(Eb4:1)E4+G4+A4+C5/12:1235 r/6 G4/2:1 Bb4/2:2 C5/2:3',
      'G4+Bb4+C5+Eb5/18:1235 r/6'
    ],
    lh: [
      'C2/4:5 G2/2:3 C3/6:1 F2/4:5 C3/2:3 F3/6:1',
      'C2/4:5 G2/2:3 C3/6:1 G2/4:5 D3/2:3 F3/6:1',
      'C2/10:5 G2/2:3 C3/6:1 G2/6:3',
      'Eb2+Bb2+Eb3/18:521 r/6'
    ]
  },
  {
    id: 'pro-nola-rolling-triplets',
    level: 4,
    cat: 'riff',
    style: 'neworleans',
    tech: ['triplets', 'chords', 'grace'],
    title: { nl: 'Fats Domino-triolen met binnenstem', en: 'Fats Domino triplets with an inner voice' },
    desc: {
      nl: 'De herhaalde triolenakkoorden die het handelsmerk van Fats Domino zijn: de duim houdt E (op F7 A), de pink houdt C (op F7 F) en de binnenstem loopt 5-6-b7-6, dezelfde lijn als de boogie-bas. In maat 2 en 4 rollen dezelfde noten als gebroken triolen omhoog, en het geheel eindigt op C6. Standaardwoordenschat van de New Orleans-piano.',
      en: 'The repeated triplet chords that are Fats Domino\'s trademark: the thumb keeps E (A on F7), the little finger keeps C (F on F7) and the inner voice walks 5-6-b7-6, the same line as the boogie bass. In bars 2 and 4 the same notes roll upward as broken triplets, and it all ends on C6. Standard New Orleans piano vocabulary.'
    },
    tip: {
      nl: 'Speel de akkoordtriolen uit een losse pols met gelijke, lichte aanslagen. Duim en pink blijven liggen; elke binnennoot heeft een eigen vinger: G = 2, A = 3, Bb = 4, en op F7 C = 2, D = 3, Eb = 4. De duim glijdt van Eb naar E (op F7 van Ab naar A). In maat 4 staat de duim op G: E-C-G = 5-3-1 en E-Bb-G = 5-2-1.',
      en: 'Play the chord triplets from a loose wrist with even, light strokes. Thumb and little finger stay put; every inner note has its own finger: G = 2, A = 3, Bb = 4, and on F7 C = 2, D = 3, Eb = 4. The thumb slides from Eb to E (on F7 from Ab to A). In bar 4 the thumb sits on G: E-C-G = 5-3-1 and E-Bb-G = 5-2-1.'
    },
    key: 'C',
    tempo: 120,
    chords: ['C7', 'C7', 'F7', 'C7'],
    rh: [
      '(Eb4:1)E4+G4+C5/2:125 E4+G4+C5/2:125 E4+G4+C5/2:125 E4+A4+C5/2:135 E4+A4+C5/2:135 E4+A4+C5/2:135 E4+Bb4+C5/2:145 E4+Bb4+C5/2:145 E4+Bb4+C5/2:145 E4+A4+C5/2:135 E4+A4+C5/2:135 E4+A4+C5/2:135',
      '(Eb4:1)E4/2:1 G4/2:2 C5/2:5 E4/2:1 A4/2:3 C5/2:5 (Eb4:1)E4+G4+Bb4+C5/4:1245 E4+G4+Bb4+C5/2:1245 E4+G4+A4+C5/4:1235 r/2',
      '(Ab4:1)A4+C5+F5/2:125 A4+C5+F5/2:125 A4+C5+F5/2:125 A4+D5+F5/2:135 A4+D5+F5/2:135 A4+D5+F5/2:135 A4+Eb5+F5/2:145 A4+Eb5+F5/2:145 A4+Eb5+F5/2:145 A4+D5+F5/2:135 A4+D5+F5/2:135 A4+D5+F5/2:135',
      'E5/2:5 C5/2:3 G4/2:1 E5/2:5 Bb4/2:2 G4/2:1 (Eb4:1)E4+G4+C5/4:125 E4+G4+C5/2:125 E4+G4+A4+C5/4:1235 r/2'
    ],
    lh: 'nola-bass'
  },
  {
    id: 'pro-nola-crushed-fill',
    level: 4,
    cat: 'fill',
    style: 'neworleans',
    tech: ['grace', 'thirds', 'triplets', 'rolls', 'crossover'],
    title: { nl: 'Gecrushte fill met gerold C9', en: 'Crushed fill with a rolled C9' },
    desc: {
      nl: 'Twee standaardfiguren van de New Orleans-piano, gehoord bij Professor Longhair en later Dr. John: gecrushte tertsen E-G om en om met de duim op C (met een felle G-Bb op tel 3), en een gerold akkoord als afsluiter. Maat 2 valt door het C7-arpeggio naar de lage C en landt op een gerold C9. Een mooie vulling voor maat 3-4 van een chorus, vlak voor F7.',
      en: 'Two stock figures of New Orleans piano, heard with Professor Longhair and later Dr. John: crushed E-G thirds alternating with the thumb on C (with a bright G-Bb on beat 3), and a rolled chord to close. Bar 2 falls through the C7 arpeggio to low C and lands on a rolled C9. A nice fill for bars 3-4 of a chorus, just before F7.'
    },
    tip: {
      nl: 'In maat 1 blijft de duim op C, glijdt 2 telkens van Eb naar E en speelt 4 de G; voor G-Bb wissel je naar 3 (glijdend van F# naar G) en 5. In maat 2 kruist 3 steeds over de duim (naar Bb en Eb) en landt de duim op C, G en C. De roll E-G-Bb-D speel je met 1-2-3-5 in een snelle draai van de pols.',
      en: 'In bar 1 the thumb stays on C, 2 slides from Eb to E each time and 4 plays the G; for G-Bb switch to 3 (sliding from F# to G) and 5. In bar 2, 3 keeps crossing over the thumb (to Bb and Eb) and the thumb lands on C, G and C. Play the E-G-Bb-D roll with 1-2-3-5 as one quick turn of the wrist.'
    },
    key: 'C',
    tempo: 116,
    chords: ['C7', 'C9'],
    rh: [
      '(Eb5:2)E5+G5/2:24 C5/2:1 (Eb5:2)E5+G5/2:24 C5/2:1 (Eb5:2)E5+G5/2:24 C5/2:1 (F#5:3)G5+Bb5/4:35 C5/2:1 (Eb5:2)E5+G5/4:24 C5/2:1',
      '(Eb5:2)E5/2:2 C5/2:1 Bb4/2:3 G4/2:1 Eb4/2:3 C4/2:1 (E4:1,G4:2,Bb4:3)D5/10:5 r/2'
    ],
    lh: 'nola-bass'
  },
  {
    id: 'pro-modern-drive-riff',
    level: 4,
    cat: 'riff',
    style: 'modern',
    tech: ['chords', 'syncopation', 'grace', 'triplets'],
    title: { nl: 'Moderne drive-riff', en: 'Modern drive riff' },
    desc: {
      nl: 'Een eigen combinatie van stockfiguren uit de moderne Europese boogie-scene (spelers als Axel Zwingenberger en Vince Weber): een dalend lijntje b7-5 naar de gecrushte terts, en een volle C7-akkoordstoot die op de korte achtste valt en over de tel heen doorklinkt. Maat 2 antwoordt met stoten tussen de tellen; op F7 schuift de vorm een kwart omhoog. Boven gebroken octaven geeft dat veel drive.',
      en: 'An own combination of stock figures from the modern European boogie scene (players such as Axel Zwingenberger and Vince Weber): a falling b7-5 line into the crushed third, and a full C7 chord punch that lands on the short eighth and rings across the beat. Bar 2 answers with punches between the beats; on F7 the shape moves up a fourth. Over broken octaves it drives hard.'
    },
    tip: {
      nl: 'Het akkoord is de klassieke greep 1-2-3-5 (E-G-Bb-C, op F7 A-C-Eb-F). In maat 1 en 3 valt de lijn er met 5-3-2 recht in, terwijl de duim van Eb naar E (op F7 van Ab naar A) glijdt; de duim pakt ook het opmaatje C. In maat 2 en 4 klim je met 2-3-4-5 (2 glijdt van Eb naar E) en zet je in de rust na de Bb de duim terug op E voor de stoten. Tel "1-tri-ool" per tel en speel de stoten kort en droog precies op "ool".',
      en: 'The chord is the classic 1-2-3-5 grip (E-G-Bb-C, on F7 A-C-Eb-F). In bars 1 and 3 the line falls straight into it with 5-3-2 while the thumb slides from Eb to E (on F7 from Ab to A); the thumb also takes the C pickup. In bars 2 and 4 climb with 2-3-4-5 (2 slides from Eb to E) and use the rest after the Bb to put the thumb back on E for the punches. Count "1-trip-let" per beat and play the punches short and dry exactly on "let".'
    },
    key: 'C',
    tempo: 160,
    chords: ['C7', 'C7', 'F7', 'C7'],
    rh: [
      'C5/2:5 Bb4/2:3 G4/2:2 (Eb4:1)E4/4:1 E4+G4+Bb4+C5/8:1235 E4+G4+Bb4+C5/4:1235 C4/2:1',
      '(Eb4:2)E4/2:2 G4/2:3 Bb4/2:4 C5/4:5 Bb4/2:4 r/4 E4+G4+Bb4+C5/2:1235 r/4 E4+G4+Bb4+C5/2:1235',
      'F5/2:5 Eb5/2:3 C5/2:2 (Ab4:1)A4/4:1 A4+C5+Eb5+F5/8:1235 A4+C5+Eb5+F5/4:1235 r/2',
      '(Eb4:2)E4/2:2 G4/2:3 Bb4/2:4 C5/4:5 Bb4/2:4 r/4 E4+G4+Bb4+C5/2:1235 E4+G4+Bb4+C5/4:1235 r/2'
    ],
    lh: 'broken-octaves'
  },

  /* ------------------------------------------------------------ level 5 */
  {
    id: 'pro-nola-turnaround-run',
    level: 5,
    cat: 'turnaround',
    style: 'neworleans',
    tech: ['blues-scale', 'crossover', 'chords', 'grace'],
    title: { nl: 'Turnaround met snelle loopjes', en: 'Fast-run turnaround' },
    desc: {
      nl: 'Snelle bluesladder-runs door de turnaround zijn standaardwoordenschat van de New Orleans-piano, gehoord bij James Booker en Dr. John. Hier: een hoog gecrusht C-akkoord, een zestiendenwaterval naar F7, een loopje terug omhoog naar C6 en een lange waterval van C6 naar E die op G7 landt, met een extra stoot op de laatste korte achtste. De linkerhand slaat octaven en loopt in triolen door.',
      en: 'Fast blues-scale runs through the turnaround are standard New Orleans piano vocabulary, heard with James Booker and Dr. John. Here: a high crushed C chord, a sixteenth-note waterfall down to F7, a run back up to C6 and a long waterfall from C6 down to E that lands on G7, with an extra punch on the last short eighth. The left hand hits octaves and walks on in triplets.'
    },
    tip: {
      nl: 'Omlaag begin je steeds met 5-4-3-2-1 vanaf C6 (of 4-3-2-1 vanaf Bb). In maat 1 kruist daarna 2 over de duim naar Eb en blijft daar liggen voor het akkoord C-Eb-A (1-2-5). In maat 2 kruist 3 over de duim naar Eb (Eb-C-Bb = 3-2-1) en nog eens naar G, waarna 2 van Eb naar E glijdt. Omhoog speel je C-D-Eb met 1-2-3, zet je de duim onder naar F en speel je G-A met 2-3. Oefen elke tel als los groepje dat eindigt op de aankomstnoot, en begin op half tempo.',
      en: 'Going down, always start with 5-4-3-2-1 from C6 (or 4-3-2-1 from Bb). In bar 1, 2 then crosses over the thumb to Eb and stays there for the C-Eb-A chord (1-2-5). In bar 2, 3 crosses over the thumb to Eb (Eb-C-Bb = 3-2-1) and once more to G, after which 2 slides from Eb to E. Going up, play C-D-Eb with 1-2-3, pass the thumb under to F and play G-A with 2-3. Practise each beat as a separate group ending on its arrival note, and start at half tempo.'
    },
    key: 'C',
    tempo: 116,
    chords: ['C7 F7', 'C7 G7'],
    rh: [
      '(Eb5:2)E5+G5+C6/4:235 r/2 Bb5/1:4 G5/1:3 Gb5/1:2 F5/1:1 Eb5/2:2 C5+Eb5+A5/4:125 r/2 C5/1:1 D5/1:2 Eb5/1:3 F5/1:1 G5/1:2 A5/1:3',
      'C6/1:5 Bb5/1:4 G5/1:3 Gb5/1:2 F5/1:1 Eb5/1:3 C5/1:2 Bb4/1:1 G4/1:3 (Eb4:2)E4/3:2 D4+F4+G4+B4/4:1235 r/2 r/4 D4+F4+G4+B4/2:1235'
    ],
    lh: [
      'C2+C3/4:51 r/2 C2/2:5 E2/2:3 G2/2:1 F2+F3/4:51 r/2 F2/2:5 A2/2:3 C3/2:1',
      'C2+C3/4:51 r/2 C3/2:1 Bb2/2:2 A2/2:3 G2+G3/4:51 r/2 r/4 G2+G3/2:51'
    ]
  },
  {
    id: 'pro-modern-octave-break',
    level: 5,
    cat: 'break',
    style: 'modern',
    tech: ['octaves', 'blues-scale', 'chords', 'triplets'],
    title: { nl: 'Octaafbreak in unisono', en: 'Unison octave break' },
    desc: {
      nl: 'Beide handen in octaven unisono door de bluesladder is een standaard-break uit de boogie-woogie, van de oude meesters tot de moderne Europese spelers. Na een C7-slag klimt de lijn C-Eb-E-G-Bb, valt door de bluesladder terug, klimt in maat 3 chromatisch Bb-B-C in triolen en eindigt met een laatste slag op C7.',
      en: 'Both hands in unison octaves through the blues scale is a standard boogie-woogie break, from the old masters to the modern European players. After a C7 hit the line climbs C-Eb-E-G-Bb, falls back down the blues scale, climbs chromatically Bb-B-C in triplets in bar 3 and ends with a final hit on C7.'
    },
    tip: {
      nl: 'Rechterhand: octaven met 1-5 op witte toetsen en 1-4 op zwarte (Eb, Gb, Bb); linkerhand overal 5-1. Bevries de handen in de octaafvorm en speel vanuit de onderarm. Oefen eerst elke hand apart en langzaam; de triolen Bb-B-C in maat 3 zijn het moeilijkste stuk, dus oefen die apart als drie losse octaven.',
      en: 'Right hand: octaves with 1-5 on white keys and 1-4 on black keys (Eb, Gb, Bb); left hand 5-1 throughout. Freeze both hands in the octave shape and play from the forearm. Practise each hand alone and slowly first; the Bb-B-C triplet in bar 3 is the hardest spot, so drill it as three separate octaves.'
    },
    key: 'C',
    tempo: 152,
    chords: ['C7', 'C7', 'C7', 'C7'],
    rh: [
      '(Eb4:1)E4+G4+Bb4+C5/4:1235 r/2 r/4 C4+C5/2:15 Eb4+Eb5/4:14 E4+E5/2:15 G4+G5/4:15 Bb4+Bb5/2:14',
      'C5+C6/4:15 Bb4+Bb5/2:14 G4+G5/4:15 Gb4+Gb5/2:14 F4+F5/4:15 Eb4+Eb5/2:14 C4+C5/4:15 r/2',
      '(Eb4:1)E4+G4+Bb4+C5/4:1235 r/2 r/4 G4+G5/2:15 Bb4+Bb5/2:14 B4+B5/2:15 C5+C6/2:15 Bb4+Bb5/4:14 G4+G5/2:15',
      'Gb4+Gb5/4:14 F4+F5/2:15 Eb4+Eb5/4:14 C4+C5/2:15 E4+G4+Bb4+C5/4:1235 r/2 r/6'
    ],
    lh: [
      'C2+C3/4:51 r/2 r/4 C2+C3/2:51 Eb2+Eb3/4:51 E2+E3/2:51 G2+G3/4:51 Bb2+Bb3/2:51',
      'C3+C4/4:51 Bb2+Bb3/2:51 G2+G3/4:51 Gb2+Gb3/2:51 F2+F3/4:51 Eb2+Eb3/2:51 C2+C3/4:51 r/2',
      'C2+C3/4:51 r/2 r/4 G2+G3/2:51 Bb2+Bb3/2:51 B2+B3/2:51 C3+C4/2:51 Bb2+Bb3/4:51 G2+G3/2:51',
      'Gb2+Gb3/4:51 F2+F3/2:51 Eb2+Eb3/4:51 C2+C3/2:51 C2+G2+C3/4:521 r/2 r/6'
    ]
  },
  {
    id: 'pro-modern-sixteenth-riff',
    level: 5,
    cat: 'riff',
    style: 'modern',
    tech: ['blues-scale', 'grace', 'chords', 'crossover'],
    title: { nl: 'Zestienden-riff', en: 'Sixteenth-note riff' },
    desc: {
      nl: 'Een eigen combinatie van stockelementen: het snelle bluesloopje G-E-Eb dat in de grondtoon C valt (overal in de boogie te horen, hier in zestienden zoals moderne spelers het graag versnellen), de gecrushte terts E-G en korte akkoordstoten. Maat 2 valt vanaf A, maat 3 speelt de riff een kwart hoger op F7 en maat 4 loopt af naar twee C7-stoten. Boven de rollende Ammons-bas.',
      en: 'An own combination of stock elements: the quick blues run G-E-Eb falling into the root C (heard everywhere in boogie, here in sixteenths the way modern players like to speed it up), the crushed E-G third and short chord punches. Bar 2 drops from A, bar 3 plays the riff a fourth higher on F7 and bar 4 runs down into two C7 punches. Over the rolling Ammons bass.'
    },
    tip: {
      nl: 'Elke val is een beweging: de vingers vallen na elkaar, 5-3-2-1 (vanaf A, en in maat 2 ook vanaf G, 5-4-3-2-1; daar landt de duim op Bb), als bij een snelle roll naar beneden, niet als losse aanslagen. De duim op C (op F7 op F) is het anker en 2 glijdt van Eb naar E. In maat 4 kruist 3 twee keer over de duim, naar Bb en naar de voorslag Eb; de sprong naar F7 maak je in de korte rust aan het eind van maat 2.',
      en: 'Each drop is one movement: the fingers fall one after another, 5-3-2-1 (from A, and in bar 2 also from G, 5-4-3-2-1; there the thumb lands on Bb), like a quick downward roll, not separate strokes. The thumb on C (on F7 on F) is the anchor and 2 slides from Eb to E. In bar 4, 3 crosses over the thumb twice, to Bb and to the Eb grace note; make the jump to F7 in the short rest at the end of bar 2.'
    },
    key: 'C',
    tempo: 168,
    chords: ['C7', 'C7', 'F7', 'C7'],
    rh: [
      'G5/1:5 E5/1:3 Eb5/1:2 C5/3:1 (Eb5:2)E5+G5/4:25 C5/2:1 G5/1:5 E5/1:3 Eb5/1:2 C5/3:1 Bb4+E5+G5/4:135 r/2',
      'A5/1:5 G5/1:4 E5/1:3 Eb5/1:2 C5/2:1 (Eb5:2)E5+A5/4:25 C5/2:1 G5/1:5 E5/1:4 Eb5/1:3 C5/1:2 Bb4/2:1 G4+C5+E5/2:125 r/4',
      'C6/1:5 A5/1:3 Ab5/1:2 F5/3:1 (Ab5:2)A5+C6/4:25 F5/2:1 C6/1:5 A5/1:3 Ab5/1:2 F5/3:1 Eb5+A5+C6/4:135 r/2',
      'A5/1:5 G5/1:4 E5/1:3 Eb5/1:2 C5/2:1 Bb4/2:3 G4/2:1 (Eb4:3)E4/2:3 r/4 E4+G4+Bb4+C5/2:1235 E4+G4+Bb4+C5/4:1235 r/2'
    ],
    lh: 'ammons-rolling'
  }
]);
