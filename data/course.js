/* The fixed learning path: 12 modules from medium to very advanced.
   Each item is one of:
     { read: 'article-id' }                 read a theory/style page (done when opened)
     { lh: 'pattern-id:step' }              a left-hand exercise (done when mastered); steps: exC exF exG exChanges ex12 exBackbeat exCharleston exOffbeat
     { lick: 'lick-id' }                    a lick or chorus (done when mastered at full tempo, hands together)
     { jam: 'jam-key' }                     improvise over a backing track (done when the band was started)
     { ear: 'int' | 'chord' | 'fn', level } ear quiz: reach this level (1-based)
     { task: 'id', nl, en }                 a playing assignment you tick off yourself
   'weeks' is a guideline at about 20 minutes a day. */
BW.course = [
  {
    id: 'm01', weeks: 2,
    title: { nl: 'De motor: shuffle en 12 maten', en: 'The engine: shuffle and 12 bars' },
    goal: {
      nl: 'Je speelt de shuffle-linkerhand door het hele bluesschema zonder na te denken en zet er twee eenvoudige riffs boven. Dit is het fundament: neem er de tijd voor.',
      en: 'You play the shuffle left hand through the whole blues form without thinking and put two simple riffs on top. This is the foundation: take your time.'
    },
    items: [
      { read: 'twelve-bar-blues' }, { read: 'shuffle-feel' },
      { lh: 'chop-shuffle:exC' }, { lh: 'chop-shuffle:exChanges' }, { lh: 'chop-shuffle:ex12' },
      { lick: 'riff-shuffle-thirds' }, { lick: 'riff-crushed-third' },
      { ear: 'fn', level: 2 },
      { jam: 'shuffle' },
      { task: 'm01-count', nl: 'Speel het 12-matenschema met alleen de linkerhand en zeg hardop de akkoorden (C7, F7, G7) op het moment dat ze wisselen.', en: 'Play the 12-bar form with the left hand alone and say the chords (C7, F7, G7) out loud as they change.' }
    ]
  },
  {
    id: 'm02', weeks: 2,
    title: { nl: 'Blue notes en de eerste turnaround', en: 'Blue notes and the first turnaround' },
    goal: {
      nl: 'Je kent de bluesladder en de gecrushte noot, speelt een tweede baspatroon en sluit een chorus af met een turnaround.',
      en: 'You know the blues scale and the crushed note, play a second bass pattern and close a chorus with a turnaround.'
    },
    items: [
      { read: 'blues-scale' }, { read: 'crushed-notes' },
      { lh: 'chop-shuffle:exBackbeat' }, { lh: 'walking-eighths:exC' }, { lh: 'walking-eighths:exChanges' }, { lh: 'walking-eighths:ex12' },
      { lick: 'riff-repeated-c-jump' }, { lick: 'fill-blues-scale-mixed' }, { lick: 'turn-chromatic-pedal' },
      { ear: 'int', level: 2 },
      { task: 'm02-combine', nl: 'Speel op de backing track "Medium shuffle" een chorus met riff-shuffle-tertsen in maat 1-8 en de chromatische turnaround in maat 11-12.', en: 'On the "Medium shuffle" backing track play a chorus with the shuffle-thirds riff in bars 1-8 and the chromatic turnaround in bars 11-12.' }
    ]
  },
  {
    id: 'm03', weeks: 3,
    title: { nl: 'Je eerste complete chorus', en: 'Your first complete chorus' },
    goal: {
      nl: 'Je speelt een volledig chorus van 12 maten met beide handen en begrijpt hoe het is opgebouwd: vraag, herhaling, antwoord, turnaround.',
      en: 'You play a complete 12-bar chorus hands together and understand how it is built: call, repeat, answer, turnaround.'
    },
    items: [
      { read: 'sevenths-sixths-ninths' }, { read: 'building-a-solo' },
      { lh: 'chop-shuffle:exCharleston' }, { lh: 'walking-eighths:exBackbeat' },
      { lick: 'riff-chromatic-sixths' }, { lick: 'riff-c6-c9-stabs' }, { lick: 'turn-tritone-shuffle' },
      { lick: 'chorus-first-shuffle' },
      { ear: 'chord', level: 2 },
      { jam: 'quick' },
      { task: 'm03-memory', nl: 'Speel het eerste chorus uit het hoofd (weergave "Uit hoofd") op minstens 80% tempo.', en: 'Play the first chorus from memory ("Memory" view) at 80% tempo or more.' }
    ]
  },
  {
    id: 'm04', weeks: 3,
    title: { nl: 'De pioniers: Pine Top en Yancey', en: 'The pioneers: Pine Top and Yancey' },
    goal: {
      nl: 'Twee tegenpolen: de stuwende bas van Pine Top Smith en de trage, zingende blues van Jimmy Yancey. Je speelt van elk een compleet chorus.',
      en: 'Two opposites: the driving bass of Pine Top Smith and the slow, singing blues of Jimmy Yancey. You play a complete chorus of each.'
    },
    items: [
      { read: 'style-pinetop' }, { lh: 'pinetop:exChanges' }, { lh: 'pinetop:ex12' },
      { lick: 'pinetop-one-note-riff' }, { lick: 'fill-triplet-cascade' }, { lick: 'pinetop-intro-tremolo' },
      { lick: 'chorus-pinetop' }, { lick: 'break-stop-time' }, { lick: 'pinetop-closing-phrase' }, { lick: 'pinetop-octave-break' },
      { read: 'style-yancey' }, { lh: 'yancey:exChanges' }, { lh: 'yancey:ex12' },
      { lick: 'riff-yancey-sigh' }, { lick: 'adv-riff-yancey-sixths' }, { lick: 'pro-yancey-call-answer' }, { lick: 'chorus-yancey-slow' },
      { jam: 'slow' }
    ]
  },
  {
    id: 'm05', weeks: 3,
    title: { nl: 'Tertsen, sexten en tremolo', en: 'Thirds, sixths and tremolo' },
    goal: {
      nl: 'De rechterhand krijgt klank: dubbelgrepen en tremolo boven de rollende gebroken-octaafbas. Hier ga je van medium naar gevorderd.',
      en: 'The right hand gains sound: double stops and tremolo over the rolling broken-octave bass. This is where you move from medium to advanced.'
    },
    items: [
      { read: 'thirds-sixths' }, { read: 'tremolo-rolls-repeats' },
      { lh: 'broken-octaves:exC' }, { lh: 'broken-octaves:exChanges' }, { lh: 'broken-octaves:ex12' },
      { lick: 'riff-c7-f7-sixths' }, { lick: 'riff-simple-tremolo' }, { lick: 'riff-call-response' }, { lick: 'adv-turn-chromatic-sixths' },
      { ear: 'int', level: 3 },
      { task: 'm05-keys', nl: 'Speel de sextenriff door C7 en F7 ook in F en in G (kies de toonsoort in het oefenscherm).', en: 'Play the sixths riff through C7 and F7 in F and in G as well (choose the key in the practice screen).' }
    ]
  },
  {
    id: 'm06', weeks: 3,
    title: { nl: 'Vorm: intro, break en slot', en: 'Form: intro, break and ending' },
    goal: {
      nl: 'Een stuk heeft een begin en een eind. Je leert een intro, twee breaks, een turnaround en een slot, en plakt ze aan een chorus tot een compleet nummer.',
      en: 'A piece has a beginning and an end. You learn an intro, two breaks, a turnaround and an ending and join them to a chorus to make a complete tune.'
    },
    items: [
      { read: 'hand-independence' },
      { lh: 'walking-eighths:exCharleston' }, { lh: 'octave-stomp:exChanges' }, { lh: 'octave-stomp:ex12' },
      { lick: 'adv-intro-dominant-shuffle' }, { lick: 'adv-break-stop-time' }, { lick: 'riff-rocknroll-octaves' },
      { lick: 'adv-turn-walkdown' }, { lick: 'adv-end-triplet-tag' },
      { jam: 'jump' },
      { task: 'm06-tune', nl: 'Speel achter elkaar: intro vanaf de dominant, het eerste chorus, een chorus met de stop-time break in maat 1-4, en het triolen-slot.', en: 'Play in one go: the intro from the dominant, the first chorus, a chorus with the stop-time break in bars 1-4, and the triplet tag ending.' }
    ]
  },
  {
    id: 'm07', weeks: 3,
    title: { nl: 'New Orleans en de trage blues verdiept', en: 'New Orleans and the slow blues in depth' },
    goal: {
      nl: 'Rollende triolen in de stijl van New Orleans en de gevorderde kant van Yancey: triolenfiguren en een stil slot.',
      en: 'Rolling triplets in the New Orleans style and the advanced side of Yancey: triplet figures and a quiet ending.'
    },
    items: [
      { read: 'style-neworleans' }, { lh: 'nola-bass:exChanges' }, { lh: 'nola-bass:ex12' }, { lh: 'nola-bass:exBackbeat' },
      { lick: 'riff-nola-triplet-chords' }, { lick: 'pro-nola-rolling-triplets' }, { lick: 'pro-nola-crushed-fill' }, { lick: 'chorus-nola' },
      { lick: 'pro-yancey-triplet-lament' }, { lick: 'pro-yancey-ending' },
      { ear: 'chord', level: 3 },
      { jam: 'nola' }
    ]
  },
  {
    id: 'm08', weeks: 4,
    title: { nl: 'Chicago en Kansas City op tempo', en: 'Chicago and Kansas City at tempo' },
    goal: {
      nl: 'Het grote werk: de rollende bas van Ammons, gerolde akkoorden, riffs in blokakkoorden en twee complete choruses boven 150 bpm.',
      en: 'The big league: the rolling Ammons bass, rolled chords, block-chord riffs and two complete choruses above 150 bpm.'
    },
    items: [
      { read: 'style-chicago' }, { read: 'style-kansascity' },
      { lh: 'ammons-rolling:exC' }, { lh: 'ammons-rolling:exChanges' }, { lh: 'ammons-rolling:ex12' },
      { lick: 'adv-riff-rolled-chords' }, { lick: 'adv-intro-rolled-cascade' }, { lick: 'pro-chi-intro-descent' }, { lick: 'pro-chi-train-chords' },
      { lick: 'adv-break-triplet-stop' }, { lick: 'adv-chorus-pedal-riff' },
      { lick: 'pro-kc-block-riff' }, { lick: 'adv-turn-triplet-arpeggio' }, { lick: 'chorus-kc-riff' },
      { jam: 'boogie' }
    ]
  },
  {
    id: 'm09', weeks: 2,
    title: { nl: "Rock-'n-roll", en: "Rock 'n' roll" },
    goal: {
      nl: 'Hard, hoog en met veel herhaling: gehamerde triolenakkoorden boven een stampende octaafbas, en een chorus dat de zaal op zijn kop zet.',
      en: 'Loud, high and repetitive: hammered triplet chords over a stomping octave bass, and a chorus that brings the house down.'
    },
    items: [
      { read: 'style-rocknroll' }, { lh: 'octave-stomp:exCharleston' }, { lh: 'octave-stomp:exOffbeat' },
      { lick: 'pro-rnr-hammered-chords' }, { lick: 'adv-end-chromatic-climb' }, { lick: 'chorus-rnr' }, { lick: 'pro-rnr-high-break' },
      { jam: 'eight' }
    ]
  },
  {
    id: 'm10', weeks: 4,
    title: { nl: 'Virtuoos: tremolo, kruisritme en runs', en: 'Virtuoso: tremolo, cross-rhythm and runs' },
    goal: {
      nl: 'Niveau 5: octaaftremolo, drie tegen vier, trillers en lange runs. Oefen deze kort en vaak; ontspanning gaat voor snelheid.',
      en: 'Level 5: octave tremolo, three against four, trills and long runs. Practise these briefly and often; relaxation comes before speed.'
    },
    items: [
      { lh: 'broken-octaves:exOffbeat' }, { lh: 'ammons-rolling:exOffbeat' },
      { lick: 'adv-riff-cross-rhythm' }, { lick: 'adv-riff-octave-tremolo' }, { lick: 'adv-intro-tremolo' }, { lick: 'pro-pinetop-trill-riff' },
      { lick: 'pro-kc-run-fill' }, { lick: 'pro-nola-turnaround-run' }, { lick: 'pro-chi-ending-run' },
      { lick: 'chorus-ammons' },
      { ear: 'int', level: 4 }
    ]
  },
  {
    id: 'm11', weeks: 4,
    title: { nl: 'De moderne Europese school', en: 'The modern European school' },
    goal: {
      nl: 'Strak, snel en harmonisch rijker: negen- en dertienakkoorden, zestiendenloopjes die in een akkoord vallen en unisono-breaks.',
      en: 'Tight, fast and harmonically richer: ninth and thirteenth chords, sixteenth runs that drop into a chord and unison breaks.'
    },
    items: [
      { read: 'style-modern' },
      { lick: 'pro-modern-drive-riff' }, { lick: 'adv-turn-modern-dim' }, { lick: 'adv-fill-blues-cascade' },
      { lick: 'pro-modern-sixteenth-riff' }, { lick: 'pro-modern-octave-break' }, { lick: 'adv-end-tremolo-c69' },
      { lick: 'chorus-modern' },
      { jam: 'vamp' }
    ]
  },
  {
    id: 'm12', weeks: 4,
    title: { nl: 'Eindproject: je eigen boogie', en: 'Final project: your own boogie' },
    goal: {
      nl: 'Je stelt uit alles wat je kent een eigen nummer samen en speelt het zonder noten. Er is geen app-score meer: jij bent de muzikant.',
      en: 'From everything you know you put together your own tune and play it without the notes. No more app score: you are the musician.'
    },
    items: [
      { task: 'm12-plan', nl: 'Schrijf een opzet: intro, vier choruses (elk een ander idee, opbouwend in drukte), een break-chorus en een slot.', en: 'Write a plan: intro, four choruses (each a different idea, building in intensity), a break chorus and an ending.' },
      { task: 'm12-own', nl: 'Maak een chorus dat van jezelf is: neem een riff die je kent en verander het ritme of de richting, en gebruik dat idee twaalf maten lang.', en: 'Make one chorus that is your own: take a riff you know, change its rhythm or direction, and use that idea for twelve bars.' },
      { task: 'm12-keys', nl: 'Speel je nummer in C, F en G op de backing track "Up-tempo boogie".', en: 'Play your tune in C, F and G on the "Up-tempo boogie" backing track.' },
      { task: 'm12-solo', nl: 'Speel het zonder backing track, met je eigen linkerhand, en neem het op. Luister terug: swingt de bas gelijkmatig?', en: 'Play it without the backing track, with your own left hand, and record it. Listen back: does the bass swing evenly?' },
      { task: 'm12-slow', nl: 'Speel een trage blues van drie choruses in Yancey-stijl uit het hoofd.', en: 'Play a slow three-chorus blues in the Yancey style from memory.' }
    ]
  }
];
