# Boogie Woogie Studio

Een boogie-woogiecursus als web-app (PWA) voor de iPad: licks oefenen met tempo-ladder,
linkerhand-leerlijn, begeleiding, theorie en stijlen. Nederlands en Engels.

## Starten

| Wat | Hoe |
|---|---|
| Alleen op deze pc | dubbelklik `start.cmd`, open daarna <http://localhost:8321> in Chrome of Edge |
| Op de iPad via een tunnel | dubbelklik `start-tunnel.cmd`; in het venster verschijnt een adres dat eindigt op `trycloudflare.com`. Open dat adres op de iPad. |

De tunnel werkt alleen zolang het venster openstaat. Het adres verandert bij elke start, en
omdat de voortgang per adres wordt bewaard, begint de iPad dan weer op nul. Voor dagelijks
gebruik is een vast adres beter (zie "Vaste plek" onderaan).

Op de iPad: tik in Safari op Deel → **Zet op beginscherm**. De app opent dan schermvullend.

## MIDI-keyboard

- **Pc (Chrome/Edge):** sluit het keyboard aan, open de app, sta MIDI toe. Het bolletje bij
  "MIDI" linksonder wordt groen.
- **iPad:** Safari ondersteunt geen Web MIDI. De app werkt dan met het schermklavier.
  Voor het keyboard via de Lightning-camera-adapter zijn er drie opties, in volgorde van moeite:
  1. Een browser-app uit de App Store die Web MIDI toevoegt (zoek op "Web MIDI Browser").
     Open daarin het tunnel-adres. Onder Instellingen in de app zie je of er een keyboard is gevonden.
  2. Het keyboard aan de pc hangen en de iPad alleen als scherm gebruiken.
  3. De app verpakken in een native jasje (Capacitor + CoreMIDI). De app heeft hiervoor al een
     ingang: `window.BWMidiIn(status, data1, data2)` neemt ruwe MIDI-bytes aan.
- Zonder MIDI kun je op de pc ook het toetsenbord gebruiken: `A W S E D F T G Y H U J K` = C tot C,
  `Z`/`X` = octaaf omlaag/omhoog. Spatie = oefenen starten/stoppen.

Geeft je keyboard zelf geluid, zet dan in het mengpaneel "Laat mijn spel horen" uit.

## Zo werkt het oefenscherm

1. **Luister** speelt de lick op vol tempo; **Langzaam** speelt hem op je oefentempo.
2. Kies **Rechts**, **Links** of **Samen**. De app speelt de andere hand en de begeleiding.
3. **Wachtmodus**: de app wacht tot je de gemarkeerde noten speelt (vingers staan op de toetsen).
4. **In tempo**: één maat aftellen, daarna loopt de lick in een lus. Na elke doorgang zie je hoe
   zuiver het was en of je te vroeg of te laat zat. Na een aantal foutloze doorgangen gaat het
   tempo automatisch een stap omhoog (in te stellen in het mengpaneel); bij drie mislukte
   doorgangen een stap terug. Met − en + stel je het tempo zelf in; met de schakelaar zet je de
   automatische ladder uit.
5. **Lus**: tik een maat aan in het notenbeeld om alleen die maat te oefenen; tik een tweede
   maat aan om de lus te verlengen.
6. Per lick kun je een andere **linkerhand** kiezen en een andere **toonsoort**. De vingerzetting
   is geschreven voor C; in andere toonsoorten kan ze afwijken.

Een lick die je op 100% foutloos haalt, komt later vanzelf terug onder "Vandaag" (na 1, 2, 4, 7,
14, 30 dagen).

## Cursus (vaste leerlijn)

Onder **Cursus** staat de leerlijn in twaalf modules, van medium tot ver gevorderd:

1. De motor: shuffle en 12 maten
2. Blue notes en de eerste turnaround
3. Je eerste complete chorus
4. De pioniers: Pine Top en Yancey
5. Tertsen, sexten en tremolo
6. Vorm: intro, break en slot
7. New Orleans en de trage blues verdiept
8. Chicago en Kansas City op tempo
9. Rock-'n-roll
10. Virtuoos: tremolo, kruisritme en runs
11. De moderne Europese school
12. Eindproject: je eigen boogie

Elke module combineert leesstof, linkerhand-oefeningen, licks, meestal een compleet chorus,
gehoortraining, vrij spelen op de band en een speelopdracht die je zelf afvinkt. Een module is
klaar bij 80% van de onderdelen; de dagsessie op de startpagina haalt haar nieuwe stof dan uit de
volgende module. Niets is op slot: je mag altijd vooruit of terug. De tijdsduur per module is een
richtlijn bij ongeveer twintig minuten per dag. De indeling staat in `data/course.js`.

## Timing meten (vertraging)

Op een iPhone of iPad komt het geluid merkbaar later uit de luidspreker dan de app denkt, en de
MIDI-browser voegt daar nog wat aan toe. Je speelt mee met wat je hoort, dus zonder correctie noemt
de app je "te laat" of rekent hij noten fout. Tik daarom eenmalig per apparaat (en per luidspreker
of koptelefoon) op **MIDI → Timing meten**: je speelt twaalf tikken mee en de app slaat de gemeten
vertraging op. Dezelfde knop staat in het mengpaneel van het oefenscherm, en verschijnt bij een
resultaat dat duidelijk te laat of fout is. Gebruik je het geluid van je eigen keyboard, zet dan
"Laat mijn spel horen" uit; anders klinkt de iPad of telefoon dubbel en iets na.

## MIDI-uit: de app speelt op je keyboard

Onder **MIDI → MIDI-uit** kies je de uitgang (meestal hetzelfde keyboard) en tik je op **Test** om te
horen of het werkt. Zet je **Voorspelen op mijn keyboard** aan, dan klinkt de pianopartij van de app
(voorspelen en de hand die de app overneemt) op je eigen piano in plaats van uit de luidspreker; drums
en bas blijven uit het apparaat komen. Klinkt het keyboard net voor of na de drums, verschuif dan
**MIDI-uit timing**. Stuurt je keyboard alles wat het ontvangt weer terug (MIDI thru), dan negeert de
app die echo's.

Klinken akkoorden via MIDI-uit als losse noten, gebruik dan **Akkoordtest** en kies de manier
(A of B) waarbij je het hele akkoord hoort. Standaard is B: de noten gaan een paar milliseconden na
elkaar de deur uit, wat met Web MIDI Browser op de iPhone het betrouwbaarst bleek.

## Leermethode

- **Eerst horen, dan spelen:** elke lick is op vol tempo te beluisteren voordat je begint.
- **Langzaam en foutloos, dan sneller:** de tempo-ladder verhoogt pas na foutloze herhalingen.
- **Directe, specifieke feedback:** per doorgang zie je zuiverheid, gemiste en foute noten en of je
  voor of achter de tel zat; gemiste noten kleuren rood in het notenbeeld.
- **Beheersing is streng:** een lick telt pas als beheerst na meerdere foutloze doorgangen achter
  elkaar op 100%, met beide handen. Alleen rechts op tempo geeft de melding dat samen de volgende stap is.
- **Uit het hoofd:** de weergave "Uit hoofd" verbergt noten en vallende balken, zodat je het uit je
  geheugen moet ophalen.
- **Gehoortraining:** in de modus "Gehoor" speelt de app telkens één maat voor met de noten
  verborgen en speel jij hem na. Na drie missers op dezelfde noot wordt de toets als hint gemarkeerd;
  met "Nog eens" hoor je de maat opnieuw. Het tempo van het voorspelen stel je in met − en +.
- **Gespreid herhalen:** beheerste licks komen terug na 1, 2, 4, 7, 14, 30 en 60 dagen.
- **Afwisselen:** "Start dagsessie" op de startpagina zet linkerhand, herhaling (in wisselende
  volgorde), lopende licks en een nieuwe lick achter elkaar; met Volgende ga je door.
- **Kort en dagelijks:** de startpagina toont je oefenminuten van vandaag en je reeks dagen.

## Gehoortraining

Onder **Gehoor** staan drie quizzen: intervallen, akkoordsoorten (majeur, mineur, C7, C6, C9,
verminderd, mineur 7) en blues-trappen (hoor je I, IV of V?). Elke quiz begint met een paar
duidelijk verschillende klanken; bij 8 van de laatste 10 in een keer goed komt het volgende niveau
erbij. Bij een fout hoor je de klank opnieuw en probeer je verder. Daarnaast is er in het
oefenscherm de modus **Gehoor**, waarin je een lick maat voor maat naspeelt zonder de noten te zien.

## Backing tracks

Onder **Backing** staan acht tracks waar de band doorspeelt en jij vrij improviseert: medium
shuffle, quick change, slow blues, New Orleans, jump, up-tempo boogie, 8-maten blues en een vamp
op C7. Tempo, toonsoort en linkerhandpatroon zijn per track te kiezen. Zet in het mengpaneel
"App speelt de andere hand" uit om zelf de linkerhand te spelen. Daarnaast heeft elke lick en
elke oefening dezelfde band als begeleiding, in elk tempo.

## Geluid

De piano is een echte vleugel (Salamander Grand Piano, opnames per kleine terts), de drums een
akoestisch drumstel en de bas een geplukte bas die wat ronder is gefilterd. De samples staan in
`samples/` (samen ongeveer 5 MB) en worden op de achtergrond geladen; tot ze er zijn hoor je een
gesynthetiseerde noodklank. Bronnen en licenties: `samples/LICENSE.txt`.

Het voorspelen is bewust niet machinaal: accenten op de tel en de backbeat, een lichtere korte
shuffle-noot, en per noot een paar milliseconden en een beetje dynamiek verschil. De begeleiding
speelt een swing-hihat, backbeat met ghost notes, een fill aan het eind van langere lussen en een
lopende bas die chromatisch naar het volgende akkoord toe loopt.

## Inhoud aanpassen of toevoegen

Alle muziek staat als tekst in `data/`. Het formaat staat in `data/FORMAT.md`.
Na een wijziging: `node tools/validate.js` controleert maatlengtes, vingers en botsende handen.

**Echtheid van de licks.** De licks zijn opgebouwd uit de traditionele boogie-vocabulaire en bij
elke lick staat in de beschrijving waar de figuur vandaan komt. Ze zijn uit het geheugen van een
taalmodel genoteerd, niet van bladmuziek of opnames overgenomen. Staat er "standaardfiguur" of
"geen citaat", dan is het een gangbare figuur of een eigen combinatie van standaardelementen en
geen letterlijke noot-voor-noot-weergave van een opname. Wil je een lick precies zoals op de plaat,
toets hem dan aan de opname en pas de noten aan in het bestand.

Drie onderdelen zijn wel rechtstreeks uit een gedrukte bron overgenomen, namelijk uit *The Original
Boogie Woogie* van Clarence "Pine Top" Smith (Melrose Music, 1929, bewerkt door Tiny Parham; publiek
domein; scan bij de University of South Florida, https://digitalcommons.usf.edu/aa_sheet_music/392/):
de linkerhand "Pine Top-bas", "Pine Tops tremolo-intro" en "Pine Tops slotfrase" (letter A van de
uitgave), "Pine Tops Dis-E met oploop" (letter B), "Pine Top's tertsenchorus" (letter C), "Pine Tops
shout-chorus (stop-time)" (letter D), "Pine Tops riff op één noot" (letter F) en "Pine Tops break in
octaven" (letter G). Ze staan samen in module 4 van de cursus. De uitgave staat in F; in de app staat
alles in C. Waar iets is ingekort of vereenvoudigd, staat dat in de beschrijving van de lick. Letter E
en de slotmaten van letter H zijn niet overgenomen, omdat de druk daar te onduidelijk is.
Voor Ammons, Yancey, Pete Johnson en Meade Lux Lewis zijn geen vrije bronnen gevonden: hun stukken
zijn van 1936 of later en bestaan alleen als betaalde transcripties (bijvoorbeeld bij Blue Black
Jazz, Hal Leonard en Jazzscripts).

De vingerzettingen zijn door een tweede model nagekeken, maar niet aan een piano getest.
Kom je er een tegen die niet lekker ligt: het is één cijfer in het bestand.

## Vaste plek (later)

De app bestaat alleen uit statische bestanden. Zet de map op GitHub Pages of Cloudflare Pages
en je hebt een vast https-adres: werkt offline na de eerste keer laden, de pc hoeft niet aan,
en de voortgang blijft bewaard.

## Mappen

- `index.html`, `css/`, `js/` — de app (geen build-stap, geen externe bibliotheken)
- `samples/` — piano-, drum- en bassamples
- `data/` — licks, linkerhandpatronen, theorie en stijlen
- `tools/serve.js` — kleine lokale server; `tools/validate.js` — inhoudscontrole
