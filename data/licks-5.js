/* Complete 12-bar choruses in four styles, levels 2-4, ordered easy to hard.
   Each chorus has a shape: statement, variation over F7, answer over G7-F7
   and a turnaround. All in C, 12/8 shuffle, 24 units per bar. */
BW.addLicks([
  /* ------------------------------------------------------------ level 2 */
  {
    id: 'chorus-first-shuffle',
    level: 2,
    cat: 'chorus',
    style: 'chicago',
    tech: ['thirds', 'grace'],
    title: { nl: 'Je eerste shuffle-chorus', en: 'Your first shuffle chorus' },
    desc: {
      nl: 'Een compleet chorus van 12 maten, opgebouwd uit de meest gebruikte standaardfiguren van de Chicago-shuffle: de geknepen terts Es-E met G en de buurterts F-A als vraag (maat 1, 3 en 7), de afloop C-A-G-E door de C6-klank als antwoord (maat 2 en 8, in maat 4 met Bes als opstap naar F7). Op F7 schuift hetzelfde idee een kwart omhoog, in maat 9-10 zakt de geknepen terts van G7 naar F7, en maat 11-12 sluiten af met de bekende chromatische turnaround C-B-Bes-A boven een liggende G. Dit is gemeengoed dat je bij vrijwel elke blues- en boogiepianist hoort, niet het werk van een bepaalde speler.',
      en: 'A complete 12-bar chorus assembled from the most common stock figures of the Chicago shuffle: the crushed third Eb-E with G and the neighbouring third F-A as the call (bars 1, 3 and 7), the run C-A-G-E through the C6 sound as the response (bars 2 and 8, in bar 4 with Bb as a step towards F7). On F7 the same idea moves up a fourth, in bars 9-10 the crushed third steps down from G7 to F7, and bars 11-12 close with the well-known chromatic turnaround C-B-Bb-A over a held G. This is shared vocabulary you hear from practically every blues and boogie pianist, not the work of one particular player.'
    },
    tip: {
      nl: 'Leer eerst maat 1 en 2: samen zijn ze bijna het halve chorus, en maat 5-6 is dezelfde vorm op F7. Bij elke geknepen terts in maat 1-8 glijdt 2 van de zwarte naar de witte toets en speelt 4 de bovenste noot; de buurterts neem je met 3-5. In maat 9-10 neem je de geknepen terts met 3-5 (3 glijdt), zodat 3 op de B en de A blijft liggen als de duim er de G en de F onder speelt; in maat 11 blijft de duim op G liggen terwijl 5-4-3-2 de bovenstem omlaag lopen, in maat 12 zakt de duim naar F.',
      en: 'Learn bars 1 and 2 first: together they are almost half the chorus, and bars 5-6 are the same shape on F7. On every crushed third in bars 1-8 finger 2 slides from the black key onto the white key and 4 plays the top note; take the neighbouring third with 3-5. In bars 9-10 take the crushed third with 3-5 (3 slides), so that 3 stays on B and A while the thumb adds G and F below; in bar 11 the thumb stays on G while 5-4-3-2 walk the top voice down; in bar 12 the thumb drops to F.'
    },
    key: 'C',
    tempo: 126,
    chords: ['C7', 'C7', 'C7', 'C7', 'F7', 'F7', 'C7', 'C7', 'G7', 'F7', 'C7', 'G7'],
    rh: [
      '(Eb4:2)E4+G4/4:24 E4+G4/2:24 F4+A4/4:35 E4+G4/2:24 E4+G4/6:24 r/6',
      'r/4 C5/2:5 A4/4:4 G4/2:3 (Eb4:2)E4/4:2 C4/8:1',
      '(Eb4:2)E4+G4/4:24 E4+G4/2:24 F4+A4/4:35 E4+G4/2:24 r/4 (Eb4:2)E4+G4/2:24 E4+G4/6:24',
      'r/4 C5/2:5 Bb4/4:4 G4/2:3 (Eb4:2)E4/4:2 G4/2:3 Bb4/6:4',
      '(Ab4:2)A4+C5/4:24 A4+C5/2:24 Bb4+D5/4:35 A4+C5/2:24 A4+C5/6:24 r/6',
      'r/4 F5/2:5 Eb5/4:4 C5/2:3 (Ab4:2)A4/4:2 F4/2:1 r/6',
      '(Eb4:2)E4+G4/4:24 E4+G4/2:24 F4+A4/4:35 E4+G4/2:24 E4+G4/6:24 r/6',
      'r/4 C5/2:5 A4/4:4 G4/2:3 (Eb4:2)E4/4:2 G4/6:3 r/2',
      '(Bb4:3)B4+D5/4:35 B4+D5/2:35 r/4 (Bb4:3)B4+D5/2:35 B4+D5/4:35 G4+B4/2:13 G4+B4/6:13',
      '(Ab4:3)A4+C5/4:35 A4+C5/2:35 r/4 (Ab4:3)A4+C5/2:35 A4+C5/4:35 F4+A4/2:13 F4+A4/6:13',
      'G4+C5/4:15 G4+C5/2:15 G4+B4/6:14 G4+Bb4/4:13 G4+Bb4/2:13 G4+A4/6:12',
      'F4+B4/4:14 F4+B4/2:14 r/4 F4+B4/2:14 F4+G4+B4/6:124 r/6'
    ],
    lh: 'chop-shuffle'
  },

  /* ------------------------------------------------------------ level 3 */
  {
    id: 'chorus-pinetop',
    level: 3,
    cat: 'chorus',
    style: 'pinetop',
    tech: ['thirds', 'repeated', 'chords'],
    title: { nl: 'Pine Top\'s tertsenchorus', en: 'Pine Top\'s thirds chorus' },
    desc: {
      nl: 'Het beroemde chorus uit Pine Top\'s Boogie Woogie: de duim speelt een dalend lijntje (terts, secunde, grondtoon en een chromatische opstap) en daartussen vallen tertsen die stap voor stap zakken. Op F7 en G7 schuift dezelfde figuur mee; maat 11-12 sluiten af met tertsen en een C6-akkoord. Bron: de gedrukte uitgave The Original Boogie Woogie (Melrose, 1929, bewerkt door Tiny Parham), publiek domein; daar in F, hier naar C getransponeerd. Overgenomen uit letter C van die uitgave; in de slotmaat speelt de linkerhand hier het patroon gewoon door.',
      en: 'The famous chorus from Pine Top\'s Boogie Woogie: the thumb plays a falling line (third, second, root and a chromatic step up) and between those notes fall thirds that descend step by step. On F7 and G7 the same figure moves along; bars 11-12 close with thirds and a C6 chord. Source: the printed edition The Original Boogie Woogie (Melrose, 1929, edited by Tiny Parham), public domain; in F there, transposed to C here. Taken from letter C of that edition; in the final bar the left hand simply keeps playing the pattern here.'
    },
    tip: {
      nl: 'Elke tel is een nieuwe handgreep: duim onder, 3 en 5 op de terts erboven, en de hele hand zakt telkens een toets. Oefen eerst alleen maat 1 als vier grepen (E met C-E, D met Bes-D, C met A-C, Dis met G-B). De duim glijdt aan het eind van de maat van Dis naar E. Leer daarna de F-maat (maat 5) en de G-maat (maat 9): dezelfde greep, andere plek.',
      en: 'Every beat is a new hand shape: thumb below, 3 and 5 on the third above, and the whole hand drops one key each time. First practise bar 1 alone as four shapes (E with C-E, D with Bb-D, C with A-C, D# with G-B). At the end of the bar the thumb slides from D# to E. Then learn the F bar (bar 5) and the G bar (bar 9): same shape, different place.'
    },
    key: 'C',
    tempo: 120,
    chords: ['C7', 'C7', 'C7', 'C7', 'F7', 'F7', 'C7', 'C7', 'G7', 'F7', 'C7', 'C7'],
    rh: [
      'E4/4:1 C5+E5/2:35 Bb4+D5/4:35 D4/2:1 A4+C5/4:35 C4/2:1 G4+B4/4:35 D#4/2:1',
      'E4/4:1 C5+E5/2:35 Bb4+D5/4:35 D4/2:1 A4+C5/4:35 C4/2:1 G4+B4/4:35 D#4/2:1',
      'E4/4:1 C5+E5/2:35 Bb4+D5/4:35 D4/2:1 A4+C5/4:35 C4/2:1 G4+B4/4:35 D#4/2:1',
      'E4/4:1 C5+E5/2:35 Bb4+D5/4:35 D4/2:1 A4+C5/4:35 C4/2:1 G4+B4/4:35 G#4/2:1',
      'A4/4:1 F5+A5/2:35 Eb5+G5/4:35 G4/2:1 D5+F5/4:35 F4/2:1 C5+E5/4:35 G#4/2:1',
      'A4/4:1 F5+A5/2:35 Eb5+G5/4:35 G4/2:1 D5+F5/4:35 F4/2:1 C5+E5/4:35 D#4/2:1',
      'E4/4:1 C5+E5/2:35 Bb4+D5/4:35 D4/2:1 A4+C5/4:35 C4/2:1 G4+B4/4:35 D#4/2:1',
      'E4/4:1 C5+E5/2:35 Bb4+D5/4:35 D4/2:1 A4+C5/4:35 C4/2:1 G4+B4/4:35 A#4/2:1',
      'B4/4:1 G5+B5/2:35 F5+A5/4:35 A4/2:1 E5+G5/4:35 G4/2:1 D5+F5/4:35 G#4/2:1',
      'A4/4:1 F5+A5/2:35 Eb5+G5/4:35 G4/2:1 D5+F5/4:35 F4/2:1 A4+E5/4:25 G4/2:1',
      'E4+G4+C5/6:135 E4+G4/4:24 F4+A4/2:35 E4+G4/4:24 G3/2:1 A3+C4+Eb4/4:235 G3/2:1',
      'E3+G3+C4/6:135 r/10 C4+E4+G4+A4+C5/6:12345 r/2'
    ],
    lh: 'pinetop'
  },
  {
    id: 'chorus-yancey-slow',
    level: 3,
    cat: 'chorus',
    style: 'yancey',
    tech: ['sixths', 'grace'],
    title: { nl: 'Langzaam Yancey-chorus', en: 'Slow Yancey chorus' },
    desc: {
      nl: 'Een ingetogen chorus met veel ruimte, opgebouwd uit standaardfiguren van de trage blues zoals je ze bij Jimmy Yancey hoort: gecrushte blue notes, zingende sexten en lange stiltes boven de habanera-achtige Yancey-bas. De vraag is een sext G-E met gecrushte Es die even naar de buursext A-F wiegt (maat 1, 3 en 7, op F7 een kwart hoger in maat 5); het antwoord is een zuchtende enkelstemmige afloop door de C6-klank (maat 2 en 8, op F7 in maat 6). Maat 9-10 vormen een sequens: dezelfde frase op G7 en een toon lager op F7. In maat 11-12 komen beide motieven samen in een zachte slotfrase die landt op de sext E-C, met een stille G7-sext als laatste woord.',
      en: 'An introspective chorus with lots of space, built from standard slow-blues figures of the kind you hear with Jimmy Yancey: crushed blue notes, singing sixths and long silences over the habanera-like Yancey bass. The call is a sixth G-E with a crushed Eb that sways briefly to the neighbouring sixth A-F (bars 1, 3 and 7, a fourth higher on F7 in bar 5); the response is a sighing single-note line down through the C6 sound (bars 2 and 8, on F7 in bar 6). Bars 9-10 form a sequence: the same phrase on G7 and a step lower on F7. In bars 11-12 both motifs meet in a gentle closing phrase that settles on the sixth E-C, with a quiet G7 sixth as the last word.'
    },
    tip: {
      nl: 'Leer eerst de handligging van maat 1-2: duim op G, 2 op A, 4 op E, 5 op F of de hoge G; de gecrushte Es speel je met 4 die naar de E glijdt. Daarna maat 5-6, dezelfde vorm met de duim op C, en de sequens van maat 9-10. Houd het tempo echt laag, laat de bovenstem zingen en gebruik de rusten om de hand rustig te verplaatsen. Yancey zelf eindigde zijn stukken opvallend vaak in Es, ongeacht de toonsoort; dat is een leuk idee voor je allerlaatste chorus.',
      en: 'First learn the hand position of bars 1-2: thumb on G, 2 on A, 4 on E, 5 on F or the high G; play the crushed Eb with 4 sliding onto E. Then bars 5-6, the same shape with the thumb on C, and the sequence in bars 9-10. Keep the tempo genuinely slow, let the top voice sing and use the rests to move the hand calmly. Yancey himself famously ended his pieces in Eb, whatever the key; a nice idea for your very last chorus.'
    },
    key: 'C',
    tempo: 84,
    chords: ['C7', 'C7', 'C7', 'C7', 'F7', 'F7', 'C7', 'C7', 'G7', 'F7', 'C7', 'C7 G7'],
    rh: [
      '(Eb5:4)G4+E5/10:14 A4+F5/2:25 G4+E5/6:14 r/6',
      'r/4 G5/2:5 (Eb5:4)E5/4:4 C5/2:3 A4/4:2 G4/2:1 r/6',
      '(Eb5:4)G4+E5/10:14 A4+F5/2:25 Bb4+G5/6:25 r/6',
      'r/6 Bb4+G5/4:25 A4+F5/2:25 G4+E5/4:14 A4+Eb5/4:24 r/4',
      '(Ab5:4)C5+A5/10:14 D5+Bb5/2:25 C5+A5/6:14 r/6',
      'r/4 C6/2:5 (Ab5:4)A5/4:4 F5/2:3 Eb5/4:2 C5/2:1 r/6',
      '(Eb5:4)G4+E5/10:14 A4+F5/2:25 G4+E5/6:14 r/6',
      'r/4 G5/2:5 (Eb5:4)E5/4:4 C5/2:3 r/6 (Bb4:2)B4/4:2 r/2',
      '(Bb5:4)D5+B5/6:14 E5+C6/4:25 D5+B5/2:14 G5/4:3 F5/2:2 D5/2:1 r/4',
      '(Ab5:4)C5+A5/6:14 D5+Bb5/4:25 C5+A5/2:14 F5/4:3 Eb5/2:2 C5/2:1 r/4',
      '(Eb5:4)G4+E5/6:14 C5/4:3 A4/2:2 G4/6:1 r/6',
      '(Eb4:2)E4+C5/12:25 F4+D5/6:25 r/6'
    ],
    lh: 'yancey'
  },

  /* ------------------------------------------------------------ level 4 */
  {
    id: 'chorus-nola',
    level: 4,
    cat: 'chorus',
    style: 'neworleans',
    tech: ['chords', 'triplets', 'repeated', 'grace', 'blues-scale'],
    title: { nl: 'New Orleans-chorus met triolenakkoorden', en: 'New Orleans triplet-chord chorus' },
    desc: {
      nl: 'Een chorus rond het handelsmerk van Fats Domino, de herhaalde triolenakkoorden in de rechterhand (bijvoorbeeld in Blueberry Hill): in maat 1, 3, 5, 7 en 9 rollen ze door, waarbij C wisselt met C7 en C6, F7 met F en G7 met G. Tussen de frases vullen gecrushte triolenfiguurtjes de ruimte, standaardvocabulaire van de New Orleans-piano: omlaag E-C-A op C7 (maat 2, 4 en 8), omhoog A-C-Es op F7 (maat 6). Maat 10 combineert akkoorden en een fill, en maat 11 eindigt met een bluesladder-loop omlaag die in maat 12 op G7 uitkomt.',
      en: 'A chorus built around the trademark of Fats Domino, repeated triplet chords in the right hand (for example on Blueberry Hill): in bars 1, 3, 5, 7 and 9 they roll along, with C alternating with C7 and C6, F7 with F and G7 with G. Between the phrases crushed triplet figures, standard New Orleans piano vocabulary, fill the space: down E-C-A on C7 (bars 2, 4 and 8), up A-C-Eb on F7 (bar 6). Bar 10 combines chords and a fill, and bar 11 ends with a blues-scale run down that lands on G7 in bar 12.'
    },
    tip: {
      nl: 'Leer eerst de akkoordgrepen: G-C-E met 1-3-5, G-Bes-E met 1-2-5, A-C-Es en B-D-F met 2-3-5, en het slotakkoord D-F-B in maat 12 met 1-2-5. Van C naar F7 blijft 3 op C liggen en zakt 5 van E naar Es; speel de triolen vanuit een losse pols. Oefen daarna de fills van maat 2 en 6 los (4 glijdt van Es naar E, 2 van As naar A) en tot slot de loop van maat 11: 5-4-3-2-1 omlaag, dan 3 over de duim naar E.',
      en: 'First learn the chord grips: G-C-E with 1-3-5, G-Bb-E with 1-2-5, A-C-Eb and B-D-F with 2-3-5, and the closing D-F-B chord in bar 12 with 1-2-5. From C to F7 finger 3 stays on C and 5 drops from E to Eb; play the triplets from a loose wrist. Then practise the fills of bars 2 and 6 separately (4 slides from Eb to E, 2 from Ab to A) and finally the run in bar 11: 5-4-3-2-1 down, then 3 over the thumb to E.'
    },
    key: 'C',
    tempo: 132,
    chords: ['C7', 'C7', 'C7', 'C7', 'F7', 'F7', 'C7', 'C7', 'G7', 'F7', 'C7', 'G7'],
    rh: [
      '(Eb5:4)G4+C5+E5/2:135 G4+C5+E5/2:135 G4+C5+E5/2:135 G4+C5+E5/2:135 G4+C5+E5/2:135 G4+C5+E5/2:135 G4+Bb4+E5/2:125 G4+Bb4+E5/2:125 G4+Bb4+E5/2:125 G4+A4+E5/4:125 r/2',
      'r/6 (Eb5:4)E5/2:4 C5/2:3 A4/2:2 (Eb5:4)E5/2:4 C5/2:3 A4/2:2 (Eb5:4)E5/2:4 C5/2:3 G4/2:1',
      '(Eb5:4)G4+C5+E5/2:135 G4+C5+E5/2:135 G4+C5+E5/2:135 G4+Bb4+E5/2:125 G4+Bb4+E5/2:125 G4+Bb4+E5/2:125 G4+C5+E5/2:135 G4+C5+E5/2:135 G4+C5+E5/2:135 G4+Bb4+E5/2:125 G4+Bb4+E5/2:125 G4+Bb4+E5/2:125',
      'G4+Bb4+E5/2:125 G4+Bb4+E5/2:125 G4+Bb4+E5/2:125 G4+Bb4+E5/2:125 G4+Bb4+E5/2:125 G4+Bb4+E5/2:125 (Eb5:4)E5/2:4 C5/2:3 A4/2:2 G4/2:1 Bb4/2:3 G4/2:1',
      '(Ab4:2)A4+C5+Eb5/2:235 A4+C5+Eb5/2:235 A4+C5+Eb5/2:235 A4+C5+F5/2:235 A4+C5+F5/2:235 A4+C5+F5/2:235 A4+C5+Eb5/2:235 A4+C5+Eb5/2:235 A4+C5+Eb5/2:235 A4+C5+F5/2:235 A4+C5+F5/2:235 A4+C5+F5/2:235',
      'r/6 (Ab4:2)A4/2:2 C5/2:3 Eb5/2:4 (Ab4:2)A4/2:2 C5/2:3 Eb5/2:4 F5/2:5 Eb5/2:4 C5/2:3',
      '(Eb5:4)G4+C5+E5/2:135 G4+C5+E5/2:135 G4+C5+E5/2:135 G4+C5+E5/2:135 G4+C5+E5/2:135 G4+C5+E5/2:135 G4+Bb4+E5/2:125 G4+Bb4+E5/2:125 G4+Bb4+E5/2:125 G4+A4+E5/4:125 r/2',
      'r/6 (Eb5:4)E5/2:4 C5/2:3 A4/2:2 (Eb5:4)E5/2:4 C5/2:3 A4/2:2 C5/2:3 A4/2:2 G4/2:1',
      '(Bb4:2)B4+D5+F5/2:235 B4+D5+F5/2:235 B4+D5+F5/2:235 B4+D5+F5/2:235 B4+D5+F5/2:235 B4+D5+F5/2:235 B4+D5+G5/2:235 B4+D5+G5/2:235 B4+D5+G5/2:235 B4+D5+F5/4:235 r/2',
      '(Ab4:2)A4+C5+Eb5/2:235 A4+C5+Eb5/2:235 A4+C5+Eb5/2:235 A4+C5+Eb5/2:235 A4+C5+Eb5/2:235 A4+C5+Eb5/2:235 F5/2:5 Eb5/2:4 C5/2:3 (Ab4:2)A4/4:2 G4/2:1',
      '(Eb5:4)G4+C5+E5/2:135 G4+C5+E5/2:135 G4+C5+E5/2:135 G4+Bb4+E5/2:125 G4+Bb4+E5/2:125 G4+Bb4+E5/2:125 E5/2:5 Eb5/2:4 C5/2:3 Bb4/2:2 G4/2:1 E4/2:3',
      'D4+F4+B4/2:125 D4+F4+B4/2:125 D4+F4+B4/2:125 D4+F4+B4/2:125 D4+F4+B4/2:125 D4+F4+B4/2:125 D4+F4+G4+B4/4:1235 r/2 r/6'
    ],
    lh: 'nola-bass'
  }
]);
