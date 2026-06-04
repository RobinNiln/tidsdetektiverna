import React, { useState, useEffect, useRef, useMemo } from "react";

// ============================================================
// TIDSDETEKTIVERNA — v13
// + Spotlight hover på kartan
// + Förstoringsglas-läge
// + Gömd SVG-katt
// ============================================================

const ASSETS = {
  map: "/tidsdetektiverna/map.jpg",
  tickelton: "/tidsdetektiverna/tickelton.jpg",
  klocktornBg: "/tidsdetektiverna/klocktorn_inne.jpg",
  klocktornVideo: "/tidsdetektiverna/klocktorn.mp4",
  tickeltonFull: "/tidsdetektiverna/tickelton_full.png",
  observatoriumBg: "/tidsdetektiverna/observatorium_inne.jpg",
  stjarnhimmel: "/tidsdetektiverna/stjarnhimmel.jpg",
  // Tidsstaden (finalen)
  tidsstadenTorg: "/tidsdetektiverna/tidsstaden_torg.jpg",
  urmakarenInne: "/tidsdetektiverna/urmakaren_inne.jpg",
  leksaksbodenInne: "/tidsdetektiverna/leksaksboden_inne.jpg",
  brunnNer: "/tidsdetektiverna/brunn_ner.jpg",
  murreFull: "/tidsdetektiverna/murre_full.png",
  tornInne: "/tidsdetektiverna/torn_inne.jpg",
  papegojaFull: "/tidsdetektiverna/papegoja_full.png",
  urmakareFull: "/tidsdetektiverna/urmakare_full.png",
  leksaksmakareFull: "/tidsdetektiverna/leksaksmakare_full.png",
  mira: "/tidsdetektiverna/mira.jpg",
  klonk: "/tidsdetektiverna/klonk.jpg",
  klonkFull: "/tidsdetektiverna/klonk_full.png",
  puzzleWorkshop: "/tidsdetektiverna/pusselverkstaden.jpg",
  kartaDetalj: "/tidsdetektiverna/karta_detalj.jpg",
  fonsterDetalj: "/tidsdetektiverna/fonster_detalj.jpg",
  // Kartanimationer
  ballong: "/tidsdetektiverna/ballong.png",
  bird: "/tidsdetektiverna/bird.png",
  bird2: "/tidsdetektiverna/bird2.png",
  leaf1: "/tidsdetektiverna/leaf1.png",
  leaf2: "/tidsdetektiverna/Leaf2.png",
  leaf3: "/tidsdetektiverna/leaf3.png",
  // Hamnen
  hamn: "/tidsdetektiverna/hamn.jpg",
  hamnVideo: "/tidsdetektiverna/hamn.mp4",
  hamnPoster: "/tidsdetektiverna/hamn_poster.jpg",
  falk: "/tidsdetektiverna/falk.jpg",
  lasse: "/tidsdetektiverna/lasse.jpg",
  berit: "/tidsdetektiverna/berit.jpg",
  framling: "/tidsdetektiverna/framling.jpg",
  falkFull: "/tidsdetektiverna/falk_full.png",
  lasseFull: "/tidsdetektiverna/lasse_full.png",
  beritFull: "/tidsdetektiverna/berit_full.png",
  framlingFull: "/tidsdetektiverna/framling_full.png",
  vik: "/tidsdetektiverna/vik.jpg",
  eka: "/tidsdetektiverna/eka.png",
  // Bokgränden
  bokgrandenGata: "/tidsdetektiverna/bokgranden_gata.jpg",
  bokaffaren: "/tidsdetektiverna/bokaffaren.jpg",
  hattaffaren: "/tidsdetektiverna/hattaffaren.jpg",
  varldsaffaren: "/tidsdetektiverna/varldsaffaren.jpg",
  gubbeFull: "/tidsdetektiverna/gubbe_full.png",
  blomsterFull: "/tidsdetektiverna/blomster_full.png",
  miraFull: "/tidsdetektiverna/mira_full.png",
  hattmakareFull: "/tidsdetektiverna/hattmakare_full.png",
  varldskvinnaFull: "/tidsdetektiverna/varldskvinna_full.png",
  varldskarta: "/tidsdetektiverna/varldskarta.jpg",
  // Den glömda grottan
  grottaIngang: "/tidsdetektiverna/grotta_ingang.jpg",
  grottaSjo: "/tidsdetektiverna/grotta_sjo.jpg",
  grottaPelare: "/tidsdetektiverna/grotta_pelare.jpg",
  grottaVerkstad: "/tidsdetektiverna/grotta_verkstad.jpg",
  ugglemarkFull: "/tidsdetektiverna/ugglemark_full.png",
  // Grottans fel-vägar (där man hittar en pryl)
  grottaVind: "/tidsdetektiverna/grotta_vind.jpg",
  grottaStrand: "/tidsdetektiverna/grotta_strand.jpg",
  grottaHjort: "/tidsdetektiverna/grotta_hjort.jpg",
};

// ============================================================
// ITEMS — alla saker spelaren kan samla i sin väska
// ============================================================
const ITEM_DATA = {
  "harbor:key": {
    name: "Den gamla nyckeln",
    icon: "🗝️",
    obtainedFrom: "Kapten Falk",
    description: "En gammal mässings-nyckel med konstigt välarbetad form. Falk gav den till dig efter att du seglat ekan tur och retur till fyren. 'Min farfar sa alltid att den skulle vara värdefull någon dag', sa han. Den passar nog till något... men vad?",
  },
  "reading:bookmark": {
    name: "Bokmärket",
    icon: "🔖",
    obtainedFrom: "Mira i Bokgränden",
    description: "Ett bokmärke i mörkröd sammet med ett gammalt mönster broderat i guldtråd. Mira hittade det inuti den äldsta boken i biblioteket. Mönstret påminner om något du sett tidigare.",
  },
  "clock:hand": {
    name: "Klockvisaren",
    icon: "⏱️",
    obtainedFrom: "Professor Tickelton",
    description: "En liten gyllene klockvisare som låg gömd i tornets klockverk. Tickelton sa att den 'rört sig framåt i 200 år utan att hejda sig en sekund'. Den är förvånansvärt tung för sin storlek.",
  },
  "puzzle:gear": {
    name: "Det gyllene kugghjulet",
    icon: "⚙️",
    obtainedFrom: "Klonk i Pusselverkstaden",
    description: "Ett vackert litet kugghjul med konstiga symboler ingraverade i kanten. Klonk muttrade något om 'tidens motor' när hen gav dig det. Symbolerna ser nästan ut att röra sig om man tittar tillräckligt länge.",
  },
  "treasure:medal": {
    name: "Junior-detektiv-medaljen",
    icon: "🏅",
    obtainedFrom: "Skattjakten",
    description: "Den ultimata utmärkelsen för en ung detektiv. Du löste mysteriet med Tidsmaskinen!",
  },

  // === SAMLARPRYLAR (mojänger) — Hamnen ===
  "harbor:shell": {
    name: "Den spiralvridna snäckan",
    icon: "🐚",
    obtainedFrom: "Gömd i Hamnen",
    description: "En stor snäcka med en perfekt spiral. Håller du den mot örat hör du havet — fast Berit säger att det bara är ditt eget blod som susar. Du tror ändå att det är havet.",
  },
  "harbor:hook": {
    name: "Den rostiga fiskkroken",
    icon: "🪝",
    obtainedFrom: "Gömd i Hamnen",
    description: "En böjd järnkrok, alldeles orange av rost. Lasse påstår att den fångat 'en fisk så stor som en eka', men Lasse påstår ju mycket. Den luktar fortfarande svagt av tång.",
  },
  "harbor:compass": {
    name: "Den knäppta kompassen",
    icon: "🧭",
    obtainedFrom: "Gömd i Hamnen",
    description: "En liten mässingskompass vars nål snurrar runt, runt utan att stanna. Trasig? Eller pekar den mot något som inte är norr? Falk rynkar pannan varje gång han ser den.",
  },
  "harbor:coin": {
    name: "Det gröna myntet",
    icon: "🪙",
    obtainedFrom: "Gömd i Hamnen",
    description: "Ett gammalt mynt helt överdraget med grön ärg. Man kan nästan ana ett ansikte och några bokstäver, men de är för slitna att läsa. Hur länge har det legat här?",
  },

  // === SAMLARPRYLAR (mojänger) — Pusselverkstaden ===
  "puzzle:nut": {
    name: "Den sexkantiga muttern",
    icon: "🔩",
    obtainedFrom: "Gömd i Pusselverkstaden",
    description: "En tung mässingsmutter, mycket större än vanliga. Klonk har säkert tappat den. Eller också är den en pusselbit till något — i den här verkstaden vet man aldrig.",
  },
  "puzzle:magnet": {
    name: "Den envisa magneten",
    icon: "🧲",
    obtainedFrom: "Gömd i Pusselverkstaden",
    description: "En hästskoformad magnet som vägrar släppa taget om allt av järn. Den fastnade i din ficka och du fick brottas loss den. Klonk säger att den är 'opålitlig men lojal'.",
  },
  "puzzle:marble": {
    name: "Den blå glaskulan",
    icon: "🔮",
    obtainedFrom: "Gömd i Pusselverkstaden",
    description: "En klar glaskula med en virvel av blått fruset inuti. Håller du upp den mot ljuset ser världen bakom den upp-och-ner. Klonk vet inte var den kom ifrån, och det stör honom.",
  },
  "puzzle:feather": {
    name: "Den mekaniska fjädern",
    icon: "🪶",
    obtainedFrom: "Gömd i Pusselverkstaden",
    description: "En fjäder gjord helt av tunn koppartråd, formad som en riktig fågelfjäder. Den fjädrar lätt mellan fingrarna. Vem gör en sådan sak? Klonk ler hemlighetsfullt men säger inget.",
  },

  // === BOKGRÄNDEN ===
  "reading:hat": {
    name: "Den vackra hatten",
    icon: "🎩",
    obtainedFrom: "Hattmakaren i Bokgränden",
    description: "En elegant hatt med en mjuk fjäder och ett siden-band. Hattmakaren tyckte att en riktig detektiv borde ha en ordentlig hatt. Den sitter perfekt och får dig att känna dig minst tio centimeter längre.",
  },

  // === DEN GLÖMDA GROTTAN ===
  "cave:lantern": {
    name: "Den slocknade lyktan",
    icon: "🏮",
    obtainedFrom: "Gömd i Den glömda grottan",
    description: "En gammal lykta som slocknade för länge sedan. Glaset är sotigt och oljan slut, men någon har ristat ett litet kugghjul i botten. Vem bar den här genom mörkret en gång?",
  },
  "cave:crystal": {
    name: "Den lysande kristallen",
    icon: "💎",
    obtainedFrom: "Gömd i Den glömda grottan",
    description: "En klar kristall som lyser med ett svagt blått sken helt av sig själv. Den är kall som is men ljuset slocknar aldrig. Professor Ugglemark skulle bli mycket intresserad av den här.",
  },
  "cave:fossil": {
    name: "Det uråldriga fossilet",
    icon: "🦴",
    obtainedFrom: "Gömd i Den glömda grottan",
    description: "Ett fossil av någon varelse som levde för miljontals år sedan, inbäddat i sten. Spiralformen ser nästan ut som ett kugghjul gjort av naturen själv. Tiden gömmer sina hemligheter väl.",
  },
  "cave:key": {
    name: "Den sista nyckeln",
    icon: "🗝️",
    obtainedFrom: "Professor Ugglemark",
    description: "En tung mässingsnyckel format som ett kugghjul. Professor Ugglemark gömde den i grottan i åratal. Med den kan stadens tidsmaskin äntligen lagas — på rätt sätt.",
  },

  // === TIDSSTADEN (finalen) ===
  "city:gear": {
    name: "Det lilla kugghjulet",
    icon: "⚙️",
    obtainedFrom: "Urmakaren i Tidsstaden",
    description: "Ett blankt litet kugghjul som låg och glittrade i urmakarens verkstad. Det passar precis i handflatan, och tänderna är så fina att de nästan inte syns. Kanske behövs det till något stort?",
  },
  "city:toy": {
    name: "Den uppdragbara leksaken",
    icon: "🪀",
    obtainedFrom: "Leksaksmakaren i Tidsstaden",
    description: "En liten plåtleksak som man drar upp med en nyckel. När den går surrar och hoppar den glatt omkring. Leksaksmakaren sa att den 'aldrig slutar förrän tiden är inne'.",
  },
  "city:coin": {
    name: "Det blanka myntet",
    icon: "🪙",
    obtainedFrom: "Gömt i brunnen i Tidsstaden",
    description: "Ett mynt som glittrade på botten av den gamla brunnen. Till skillnad från hamnens gröna mynt är det här alldeles blankt, som om någon nyss tappat det. Eller som om tiden inte biter på det.",
  },
  "city:feather": {
    name: "Papegojans fjäder",
    icon: "🪶",
    obtainedFrom: "Papegojan i tornet",
    description: "En lysande fjäder i rött, blått och gult som den kloka papegojan i tornet gav dig sedan du löst alla tre gåtor. Den är len som siden och skiftar i färg när du vrider på den.",
  },
  "city:watch": {
    name: "Den fina fickklockan",
    icon: "⏱️",
    obtainedFrom: "Urmakaren i Tidsstaden",
    description: "En blank fickklocka i silver som urmakaren gav dig sedan du räknat hennes klockor rätt. Den tickar mjukt och lockets insida är graverad med små stjärnor.",
  },
  "city:spinningtop": {
    name: "Den målade snurran",
    icon: "🎁",
    obtainedFrom: "Leksaksmakaren i Tidsstaden",
    description: "En vacker handmålad snurra som leksaksmakaren gav dig sedan du klarat hans minnesspel. När den snurrar blandas färgerna till en regnbåge.",
  },
};


// ============================================================
// VÄSKAN — knapp och overlay för att visa items
// ============================================================
function InventoryButton({ count, onClick }) {
  return (
    <button
      className="td-inventory-btn"
      onClick={onClick}
      aria-label={`Öppna väskan, ${count} saker`}
    >
      <img
        className="td-inventory-bag-img"
        src={`${import.meta.env.BASE_URL}rygg.png`}
        alt=""
        aria-hidden="true"
      />
      {count > 0 && <span className="td-inventory-count">{count}</span>}
    </button>
  );
}

function InventoryModal({ foundItems, onClose }) {
  const [selectedId, setSelectedId] = useState(null);
  const selected = selectedId ? ITEM_DATA[selectedId] : null;

  return (
    <div className="td-inventory-overlay" onClick={onClose}>
      <div
        className="td-inventory-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="td-inventory-header">
          <h2>🎒 VÄSKAN</h2>
          <button
            className="td-inventory-close"
            onClick={onClose}
            aria-label="Stäng väskan"
          >
            ×
          </button>
        </div>

        {foundItems.length === 0 ? (
          <div className="td-inventory-empty">
            <div className="td-inventory-empty-icon">🎒</div>
            <p>Väskan är tom. Hjälp folket i staden så fyller du på den med ledtrådar och artefakter!</p>
          </div>
        ) : (
          <>
            <div className="td-inventory-grid">
              {foundItems.map((id) => {
                const item = ITEM_DATA[id];
                if (!item) return null;
                return (
                  <button
                    key={id}
                    className={`td-inventory-item ${selectedId === id ? "td-inventory-item-selected" : ""}`}
                    onClick={() => setSelectedId(selectedId === id ? null : id)}
                  >
                    <div className="td-inventory-item-icon">{item.icon}</div>
                    <div className="td-inventory-item-name">{item.name}</div>
                  </button>
                );
              })}
            </div>

            {selected && (
              <div className="td-inventory-detail">
                <div className="td-inventory-detail-header">
                  <span className="td-inventory-detail-icon">{selected.icon}</span>
                  <div>
                    <div className="td-inventory-detail-name">{selected.name}</div>
                    <div className="td-inventory-detail-from">Från: {selected.obtainedFrom}</div>
                  </div>
                </div>
                <p className="td-inventory-detail-desc">{selected.description}</p>
              </div>
            )}

            {!selected && (
              <p className="td-inventory-hint">Klicka på en sak för att läsa mer om den.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// Hotspot-koordinater + ankarpunkt för spotlight-cirkeln (centrum)
const HOTSPOTS = {
  reading: {
    key: "reading", title: "Bokgränden", short: "Läs ledtråden",
    character: "mira", characterName: "Mira Murr",
    x: 16, y: 45, w: 24, h: 38,
    cx: 28, cy: 64, // centrum för spotlighten
  },
  clock: {
    key: "clock", title: "Klocktornet", short: "Lös tiden",
    character: "tickelton", characterName: "Professor Tickelton",
    x: 56, y: 32, w: 16, h: 50,
    cx: 64, cy: 57,
  },
  puzzle: {
    key: "puzzle", title: "Pusselverkstaden", short: "Hitta mönstret",
    character: "klonk", characterName: "Herr Klonk",
    x: 78, y: 42, w: 20, h: 40,
    cx: 88, cy: 62,
  },
  timemachine: {
    key: "timemachine", title: "Tidsmaskinen", short: "Öppna porten",
    character: null,
    x: 41, y: 22, w: 22, h: 28,
    cx: 52, cy: 36,
  },
  harbor: {
    key: "harbor", title: "Hamnen", short: "Bonus-uppdrag",
    character: "falk", characterName: "Kapten Falk",
    x: 1, y: 14, w: 14, h: 32,
    cx: 8, cy: 30,
    bonus: true, // räknas inte som stjärnuppdrag
  },
  cave: {
    key: "cave", title: "Den glömda grottan", short: "Utforska grottan",
    character: null,
    x: 86, y: 30, w: 11, h: 16,
    cx: 91, cy: 38,
    bonus: true, // räknas inte som stjärnuppdrag
  },
  observatory: {
    key: "observatory", title: "Observatoriet", short: "Titta på stjärnorna",
    character: null,
    x: 70, y: 6, w: 14, h: 18,
    cx: 76, cy: 13,
    bonus: true, // räknas inte som stjärnuppdrag
  },
};

// Den gömda kattens position på kartan (centrum)
const HIDDEN_CAT = { x: 42, y: 25 };

const KLONK_RAPID_DIALOGS = [
  "Bra dag för att skruva! Tack att du kom. Min maskin har glömt sina mönster. Kan du hjälpa den minnas?",
  "Oj, du verkar ha bråttom! Var det något särskilt?",
  "Du gillar verkligen att klicka, va? Mustaschen min börjar bli förvirrad.",
  "Okej, jag fattar att du vill att jag ska dansa. Men jag kan inte. Mustaschen blir tung.",
];

const PUZZLE_POOL = {
  level1: [
    { text: "Vilken färg fortsätter mönstret?",
      sequence: ["color:red", "color:blue", "color:red", "color:blue", "mystery"],
      answer: "color:red",
      choices: ["color:red", "color:blue", "color:green"],
      hint: "Färgerna turas om — röd, blå, röd, blå..." },
    { text: "Vilken färg fortsätter mönstret?",
      sequence: ["color:yellow", "color:green", "color:yellow", "color:green", "mystery"],
      answer: "color:yellow",
      choices: ["color:yellow", "color:green", "color:red"],
      hint: "Gul, grön, gul, grön..." },
    { text: "Vilken färg fortsätter mönstret?",
      sequence: ["color:red", "color:yellow", "color:red", "color:yellow", "mystery"],
      answer: "color:red",
      choices: ["color:red", "color:yellow", "color:blue"],
      hint: "Röd och gul växlar." },
  ],
  level2: [
    { text: "Vilken färg fortsätter mönstret?",
      sequence: ["color:red", "color:blue", "color:green", "color:red", "color:blue", "mystery"],
      answer: "color:green",
      choices: ["color:green", "color:red", "color:blue"],
      hint: "Tre färger turas om: röd, blå, grön, röd, blå..." },
    { text: "Vilken färg fortsätter mönstret?",
      sequence: ["color:yellow", "color:red", "color:blue", "color:yellow", "color:red", "mystery"],
      answer: "color:blue",
      choices: ["color:blue", "color:yellow", "color:red"],
      hint: "Gul, röd, blå... och så börjar det om." },
    { text: "Vilken färg fortsätter mönstret?",
      sequence: ["color:green", "color:yellow", "color:red", "color:green", "color:yellow", "mystery"],
      answer: "color:red",
      choices: ["color:red", "color:green", "color:yellow"],
      hint: "Grön, gul, röd — sedan börjar det om." },
  ],
  level3: [
    { text: "Vilken storlek fortsätter mönstret?",
      sequence: ["size:small", "size:medium", "size:large", "size:small", "size:medium", "mystery"],
      answer: "size:large",
      choices: ["size:large", "size:medium", "size:small"],
      hint: "Liten, mellan, stor — sedan börjar det om." },
    { text: "Vilken storlek fortsätter mönstret?",
      sequence: ["size:large", "size:medium", "size:small", "size:large", "size:medium", "mystery"],
      answer: "size:small",
      choices: ["size:small", "size:medium", "size:large"],
      hint: "Stor, mellan, liten — den krymper varje gång." },
  ],
  level4: [
    { text: "Vilken form fortsätter mönstret?",
      sequence: ["shape:triangle", "shape:circle", "shape:triangle", "shape:circle", "shape:triangle", "mystery"],
      answer: "shape:circle",
      choices: ["shape:circle", "shape:triangle", "shape:square"],
      hint: "Trianglar och cirklar turas om." },
    { text: "Vilken form fortsätter mönstret?",
      sequence: ["shape:circle", "shape:square", "shape:circle", "shape:square", "shape:circle", "mystery"],
      answer: "shape:square",
      choices: ["shape:square", "shape:circle", "shape:triangle"],
      hint: "Cirklar och fyrkanter turas om." },
    { text: "Vilken form fortsätter mönstret?",
      sequence: ["shape:square", "shape:triangle", "shape:square", "shape:triangle", "shape:square", "mystery"],
      answer: "shape:triangle",
      choices: ["shape:triangle", "shape:square", "shape:circle"],
      hint: "Fyrkanter och trianglar turas om." },
  ],
  level5: [
    { text: "Hur många prickar kommer härnäst?",
      sequence: ["dots:1", "dots:2", "dots:3", "mystery"],
      answer: "dots:4",
      choices: ["dots:4", "dots:3", "dots:5"],
      hint: "Det blir en prick mer varje gång — 1, 2, 3, sedan..." },
    { text: "Hur många prickar kommer härnäst?",
      sequence: ["dots:2", "dots:4", "dots:6", "mystery"],
      answer: "dots:8",
      choices: ["dots:8", "dots:7", "dots:6"],
      hint: "Det blir två prickar mer varje gång — 2, 4, 6..." },
    { text: "Hur många prickar kommer härnäst?",
      sequence: ["dots:1", "dots:3", "dots:5", "mystery"],
      answer: "dots:7",
      choices: ["dots:7", "dots:6", "dots:8"],
      hint: "Två fler varje gång — 1, 3, 5..." },
  ],
  level6: [
    { text: "Vilken figur fortsätter mönstret?",
      sequence: ["cs:red-triangle", "cs:blue-circle", "cs:red-triangle", "cs:blue-circle", "cs:red-triangle", "mystery"],
      answer: "cs:blue-circle",
      choices: ["cs:blue-circle", "cs:red-triangle", "cs:blue-triangle"],
      hint: "En röd triangel och en blå cirkel turas om." },
    { text: "Vilken figur fortsätter mönstret?",
      sequence: ["cs:yellow-square", "cs:green-circle", "cs:yellow-square", "cs:green-circle", "cs:yellow-square", "mystery"],
      answer: "cs:green-circle",
      choices: ["cs:green-circle", "cs:yellow-square", "cs:green-square"],
      hint: "Gul fyrkant och grön cirkel turas om." },
    { text: "Vilken figur fortsätter mönstret?",
      sequence: ["cs:red-circle", "cs:blue-triangle", "cs:red-circle", "cs:blue-triangle", "cs:red-circle", "mystery"],
      answer: "cs:blue-triangle",
      choices: ["cs:blue-triangle", "cs:red-circle", "cs:red-triangle"],
      hint: "Röd cirkel och blå triangel turas om." },
  ],
  level7: [
    { text: "Mönstret går fram och tillbaka. Vad kommer härnäst?",
      sequence: ["color:red", "color:blue", "color:green", "color:green", "color:blue", "mystery"],
      answer: "color:red",
      choices: ["color:red", "color:green", "color:blue"],
      hint: "Mönstret går till mitten och tillbaka: röd, blå, grön, grön, blå... och nu?" },
    { text: "Mönstret går fram och tillbaka. Vad kommer härnäst?",
      sequence: ["size:small", "size:medium", "size:large", "size:large", "size:medium", "mystery"],
      answer: "size:small",
      choices: ["size:small", "size:medium", "size:large"],
      hint: "Storlekarna växer och krymper sedan tillbaka: liten, mellan, stor, stor, mellan..." },
  ],
};

const KLONK_PROGRESS_REMARKS = [
  "Bra! Nästa kugghjul lyser!",
  "Snyggt! Maskinen surrar lite mer.",
  "Du är på rätt spår!",
  "Mustaschen min vibrerar — det är ett bra tecken.",
  "Aha! Ännu ett kugghjul vaknar.",
  "Du är duktig på det här!",
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function buildPuzzleRound() {
  const levels = ["level1", "level2", "level3", "level4", "level5", "level6", "level7"];
  return levels.map((lvl, i) => {
    const variant = randomFrom(PUZZLE_POOL[lvl]);
    return {
      ...variant,
      choices: shuffle(variant.choices),
      levelIndex: i,
    };
  });
}

// ============================================================
// HUVUDKOMPONENT
// ============================================================
export default function App() {
  const [view, setView] = useState("start");
  const [activeLocation, setActiveLocation] = useState(null);
  const [completed, setCompleted] = useState({
    reading: false, clock: false, puzzle: false, cave: false,
  });
  const [hovered, setHovered] = useState(null);
  const [foundItems, setFoundItems] = useState([]);
  const [interiorDialog, setInteriorDialog] = useState(null);
  const [detailView, setDetailView] = useState(null);
  const [inventoryOpen, setInventoryOpen] = useState(false);

  const stars = Object.values(completed).filter(Boolean).length;
  // TILLFÄLLIGT FÖR TEST: tidsmaskinen alltid upplåst.
  // Ändra tillbaka till "stars === 3" när finalen är klar att låsas igen.
  const allDone = true; // const allDone = stars === 3;

  function enterLocation(key) {
    if (key === "timemachine") { if (allDone) setView("city"); return; }
    setActiveLocation(key); setInteriorDialog(null); setDetailView(null);
    setView("interior");
  }
  function startMission() {
    if (activeLocation === "harbor") setView("boatgame");
    else if (activeLocation === "cave") {
      pickUpItem("cave:key");
      completeMission("cave");
      // stannar kvar i grottan (verkstaden) som nu visar "klar"-läget
    }
    else if (activeLocation === "clock") {
      pickUpItem("clock:hand");
      completeMission("clock");
      // stannar kvar i klocktornet som nu visar "klar"-läget
    }
    else setView("mission");
  }
  function backToInterior() { setView("interior"); }
  function backToMap() {
    setActiveLocation(null); setInteriorDialog(null);
    setDetailView(null); setView("map");
  }
  function completeMission(key) { setCompleted((p) => ({ ...p, [key]: true })); }
  function pickUpItem(id) {
    if (!foundItems.includes(id)) setFoundItems((p) => [...p, id]);
  }
  function reset() {
    setCompleted({ reading: false, clock: false, puzzle: false, cave: false });
    setFoundItems([]); setActiveLocation(null);
    setInteriorDialog(null); setDetailView(null); setView("start");
  }

  return (
    <div className="td-app">
      <Styles />
      {view === "start" && <StartScreen onStart={() => setView("map")} />}
      {view === "map" && (
        <MapView completed={completed} stars={stars} allDone={allDone}
          hovered={hovered} setHovered={setHovered}
          onPick={enterLocation} onReset={reset} />
      )}
      {view === "interior" && activeLocation && (
        <InteriorView locationKey={activeLocation}
          completed={completed[activeLocation]}
          foundItems={foundItems} dialog={interiorDialog}
          setDialog={setInteriorDialog}
          onPickUpItem={pickUpItem}
          onStartMission={startMission} onBack={backToMap}
          detailView={detailView} setDetailView={setDetailView} />
      )}
      {view === "mission" && activeLocation && (
        <MissionOverlay hotspot={HOTSPOTS[activeLocation]} onClose={backToInterior}>
          {activeLocation === "reading" && (
            <ReadingMission alreadyDone={completed.reading}
              onComplete={() => completeMission("reading")} onBack={backToInterior} />
          )}
          {activeLocation === "clock" && (
            <ClockMission alreadyDone={completed.clock}
              onComplete={() => completeMission("clock")} onBack={backToInterior} />
          )}
          {activeLocation === "puzzle" && (
            <MachinePuzzle alreadyDone={completed.puzzle}
              onComplete={() => completeMission("puzzle")} onBack={backToInterior} />
          )}
        </MissionOverlay>
      )}
      {view === "boatgame" && (
        <BoatGame
          onComplete={() => {
            pickUpItem("harbor:key");
            setView("interior");
          }}
          onBack={() => setView("interior")}
        />
      )}
      {view === "city" && (
        <CityView
          foundItems={foundItems}
          dialog={interiorDialog}
          setDialog={setInteriorDialog}
          onPickUpItem={pickUpItem}
          onEnterMachine={() => setView("end")}
          onBack={backToMap}
        />
      )}
      {view === "end" && (
        <MissionOverlay grand onClose={() => setView("map")}>
          <EndScreen onReset={reset} />
        </MissionOverlay>
      )}

      {/* Väska — synlig på alla vyer utom startskärm och båtspel */}
      {view !== "start" && view !== "boatgame" && (
        <InventoryButton
          count={foundItems.length}
          onClick={() => setInventoryOpen(true)}
        />
      )}

      {inventoryOpen && (
        <InventoryModal
          foundItems={foundItems}
          onClose={() => setInventoryOpen(false)}
        />
      )}
    </div>
  );
}

function StartScreen({ onStart }) {
  return (
    <div className="td-start-screen td-fade-in">
      <div className="td-start-card">
        <div className="td-stamp">N°1 · Det första äventyret</div>
        <h1 className="td-title">Tidsdetektiverna</h1>
        <p className="td-intro">
          Stadens klockor har börjat gå fel. Kan du hjälpa invånarna att hitta
          ledtrådarna och laga tiden?
        </p>
        <div className="td-trio">
          <CharacterPortrait src={ASSETS.tickelton} name="Professor Tickelton" />
          <CharacterPortrait src={ASSETS.mira} name="Mira Murr" />
          <CharacterPortrait src={ASSETS.klonk} name="Herr Klonk" />
        </div>
        <button className="td-btn td-btn-big" onClick={onStart}>
          ▸ Starta äventyret
        </button>
      </div>
    </div>
  );
}

function CharacterPortrait({ src, name }) {
  return (
    <figure className="td-portrait">
      <div className="td-portrait-frame"><img src={src} alt={name} /></div>
      <figcaption className="td-portrait-name">{name}</figcaption>
    </figure>
  );
}

// ============================================================
// KARTAN — Spotlight + Förstoringsglas + Gömd katt
// ============================================================
function MapView({ completed, stars, allDone, hovered, setHovered, onPick, onReset }) {
  const visibleHotspots = ["reading", "clock", "puzzle", "harbor", "cave", "observatory"];
  const mapRef = useRef(null);

  // === Förstoringsglas-läge ===
  const [magnifierOn, setMagnifierOn] = useState(false);
  const [mouseProc, setMouseProc] = useState({ x: 50, y: 50 }); // procent
  const [insideMap, setInsideMap] = useState(false);

  function handleMouseMove(e) {
    if (!magnifierOn || !mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMouseProc({ x, y });
  }

  // Hitta vilken spotlight-cirkel som ska visas (den hovrade hotspotens cx/cy)
  let spotlight = null;
  if (hovered) {
    const h = HOTSPOTS[hovered];
    spotlight = { x: h.cx, y: h.cy };
  }

  return (
    <div className="td-map-wrap td-fade-in">
      <div
        ref={mapRef}
        className={`td-map ${magnifierOn ? "td-map-magnifier-on" : ""}`}
        style={{ backgroundImage: `url(${ASSETS.map})` }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setInsideMap(true)}
        onMouseLeave={() => setInsideMap(false)}
      >

        <MapAtmosphere />

        {/* === SPOTLIGHT-LAGER (dimmar resten av kartan) === */}
        <div
          className={`td-spotlight ${spotlight ? "td-spotlight-active" : ""}`}
          style={
            spotlight
              ? {
                  background: `radial-gradient(
                    circle at ${spotlight.x}% ${spotlight.y}%,
                    transparent 0%,
                    transparent 12%,
                    rgba(30, 20, 10, 0.55) 22%,
                    rgba(30, 20, 10, 0.72) 100%
                  )`,
                }
              : undefined
          }
        />

        {/* === FÖRSTORINGSGLAS-KNAPPEN === */}
        <button
          className={`td-magnifier-toggle ${magnifierOn ? "td-magnifier-toggle-on" : ""}`}
          onClick={() => setMagnifierOn(v => !v)}
          aria-label="Slå på/av förstoringsglas"
          aria-pressed={magnifierOn}
          title={magnifierOn ? "Stäng glaset" : "Förstoringsglas"}
        >
          <img
            className="td-magnifier-img"
            src={`${import.meta.env.BASE_URL}glas.png`}
            alt=""
            aria-hidden="true"
          />
        </button>

        {/* === GÖMD SVG-KATT === */}
        <HiddenCat x={HIDDEN_CAT.x} y={HIDDEN_CAT.y} />

        <div className="td-hud">
          <div className="td-hud-banner">
            <span className="td-hud-text">Välj ditt nästa äventyr</span>
            <StarRow filled={stars} />
          </div>
          <button className="td-btn td-btn-small td-hud-reset" onClick={onReset}>↺ Börja om</button>
        </div>

        {visibleHotspots.map((key) => {
          const h = HOTSPOTS[key];
          const done = completed[key];
          const isHovered = hovered === key;
          return (
            <button key={key}
              className={`td-hotspot ${done ? "td-hotspot-done" : ""} ${isHovered ? "td-hotspot-hover" : ""}`}
              style={{ left: `${h.x}%`, top: `${h.y}%`, width: `${h.w}%`, height: `${h.h}%` }}
              onClick={() => onPick(key)}
              onMouseEnter={() => setHovered(key)}
              onMouseLeave={() => setHovered(null)}
              aria-label={h.title}>
              {done && <span className="td-hotspot-star">★</span>}
            </button>
          );
        })}

        <button
          className={`td-hotspot td-hotspot-finale ${allDone ? "td-hotspot-finale-active" : "td-hotspot-finale-locked"} ${hovered === "timemachine" ? "td-hotspot-hover" : ""}`}
          style={{
            left: `${HOTSPOTS.timemachine.x}%`, top: `${HOTSPOTS.timemachine.y}%`,
            width: `${HOTSPOTS.timemachine.w}%`, height: `${HOTSPOTS.timemachine.h}%`,
          }}
          onClick={() => onPick("timemachine")}
          onMouseEnter={() => allDone && setHovered("timemachine")}
          onMouseLeave={() => setHovered(null)}
          aria-label="Tidsmaskinen"
          disabled={!allDone}>
        </button>

        {hovered && (
          <HoverLabel hotspot={HOTSPOTS[hovered]} done={completed[hovered]} allDone={allDone} />
        )}

        {/* === FÖRSTORINGSGLASETS LINS === */}
        {magnifierOn && insideMap && (
          <MagnifierLens
            mouseProc={mouseProc}
            backgroundImage={ASSETS.map}
          />
        )}
      </div>
    </div>
  );
}

// ============================================================
// MagnifierLens — visar zoomad del av kartan vid muspekaren
// ============================================================
function MagnifierLens({ mouseProc, backgroundImage }) {
  const LENS_SIZE_PX = 180; // diameter
  const ZOOM = 2.4;

  // Hur långt ned/upp/höger/vänster ska den underliggande bilden förskjutas
  // för att visa rätt zoomad region
  const bgPosX = mouseProc.x;
  const bgPosY = mouseProc.y;

  return (
    <div
      className="td-magnifier-lens"
      style={{
        left: `${mouseProc.x}%`,
        top: `${mouseProc.y}%`,
        width: `${LENS_SIZE_PX}px`,
        height: `${LENS_SIZE_PX}px`,
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: `${ZOOM * 100}% auto`,
        backgroundPosition: `${bgPosX}% ${bgPosY}%`,
        backgroundRepeat: "no-repeat",
      }}
    />
  );
}

// ============================================================
// HiddenCat — liten svart SVG-katt som bara syns under glaset
// ============================================================
function HiddenCat({ x, y }) {
  // Katten ritas som svart silhuett i kartans stil
  // Storlek: ca 2.4% av kartans bredd → måste zoomas för att synas tydligt
  return (
    <div
      className="td-hidden-cat"
      style={{ left: `${x}%`, top: `${y}%` }}
      aria-hidden="true"
    >
      <svg viewBox="0 0 40 40" width="100%" height="100%">
        {/* Kroppen — sittande katt */}
        <path
          d="M 12 32
             C 10 32, 9 30, 9 27
             L 9 22
             C 9 19, 11 16, 14 16
             L 26 16
             C 29 16, 31 19, 31 22
             L 31 27
             C 31 30, 30 32, 28 32
             Z"
          fill="#1a0f06"
          stroke="#000"
          strokeWidth="0.4"
        />
        {/* Huvudet */}
        <ellipse cx="20" cy="14" rx="7" ry="6.5"
                 fill="#1a0f06" stroke="#000" strokeWidth="0.4" />
        {/* Vänster öra */}
        <path d="M 14 9 L 12 4 L 17 8 Z"
              fill="#1a0f06" stroke="#000" strokeWidth="0.4"
              strokeLinejoin="round" />
        {/* Höger öra */}
        <path d="M 26 9 L 28 4 L 23 8 Z"
              fill="#1a0f06" stroke="#000" strokeWidth="0.4"
              strokeLinejoin="round" />
        {/* Svans som sticker upp */}
        <path d="M 30 28 C 33 26, 35 23, 34 19 C 33.5 17, 33 17, 32 18"
              fill="none" stroke="#1a0f06" strokeWidth="2.5"
              strokeLinecap="round" />
        {/* Gula ögon — pyttesmå prickar som lyser */}
        <circle cx="17.5" cy="13.5" r="0.9" fill="#fdc94d" />
        <circle cx="22.5" cy="13.5" r="0.9" fill="#fdc94d" />
      </svg>
    </div>
  );
}

// ============================================================
// MapAtmosphere — levande element på kartan
// ============================================================
function MapAtmosphere() {
  return (
    <>
      {/* Skorstensrök från Klocktornets tåg */}
      <div className="td-map-smoke td-map-smoke-train"
           style={{ left: "60%", top: "55%" }}>
        <span className="td-map-smoke-puff td-map-smoke-1" />
        <span className="td-map-smoke-puff td-map-smoke-2" />
        <span className="td-map-smoke-puff td-map-smoke-3" />
      </div>

      {/* Skorstensrök från Pusselverkstaden */}
      <div className="td-map-smoke td-map-smoke-workshop"
           style={{ left: "87%", top: "40%" }}>
        <span className="td-map-smoke-puff td-map-smoke-1" />
        <span className="td-map-smoke-puff td-map-smoke-2" />
        <span className="td-map-smoke-puff td-map-smoke-3" />
      </div>

      {/* Fyrens blink uppe vid Hamnen */}
      <div className="td-map-lighthouse"
           style={{ left: "3.5%", top: "22%" }} />

      {/* Vattenglitter */}
      <div className="td-water-shimmer" style={{ left: "3%", top: "55%" }} />
      <div className="td-water-shimmer" style={{ left: "7%", top: "62%", animationDelay: "0.7s" }} />
      <div className="td-water-shimmer" style={{ left: "2%", top: "70%", animationDelay: "1.3s" }} />
      <div className="td-water-shimmer" style={{ left: "5%", top: "75%", animationDelay: "2s" }} />

      {/* Luftskeppet driver långsamt över himlen */}
      <img
        src={ASSETS.ballong}
        alt=""
        aria-hidden="true"
        className="td-map-airship"
      />

      {/* Övriga animationer (fågel, klockfågel, löv) kommer när
          deras PNG-filer har transparent bakgrund */}
    </>
  );
}

function HoverLabel({ hotspot, done, allDone }) {
  const isFinale = hotspot.key === "timemachine";
  const characterSrc = hotspot.character ? ASSETS[hotspot.character] : null;
  let status;
  if (isFinale) status = allDone ? "✦ Redo att öppnas" : "Låst tills alla stjärnor hittats";
  else status = done ? "★ Klart" : "Inte klart";

  // Om hotspoten ligger långt till höger får kortet inte plats till höger om den.
  // Då visar vi kortet till vänster om hotspoten istället.
  const flipLeft = hotspot.x + hotspot.w > 68;
  const posStyle = flipLeft
    ? { right: `${100 - hotspot.x + 1}%`, top: `${Math.max(8, hotspot.y - 2)}%` }
    : { left: `${hotspot.x + hotspot.w + 1}%`, top: `${Math.max(8, hotspot.y - 2)}%` };

  return (
    <div className="td-hover-card" style={posStyle}>
      {characterSrc && (
        <div className="td-hover-character"><img src={characterSrc} alt={hotspot.characterName} /></div>
      )}
      <div className="td-hover-content">
        <div className="td-hover-title">{hotspot.title}</div>
        <div className="td-hover-short">{hotspot.short}</div>
        <div className={`td-hover-status ${done || (isFinale && allDone) ? "ok" : ""}`}>{status}</div>
      </div>
    </div>
  );
}

function StarRow({ filled = 0 }) {
  return (
    <span className="td-star-row">
      {[0, 1, 2].map((i) => (
        <span key={i} className={`td-star ${i < filled ? "td-star-filled" : ""}`}>★</span>
      ))}
    </span>
  );
}

// ============================================================
// DialogBubble — enhetlig konversation för HELA spelet
// Stöder: sträng, { text, name, portrait, action },
// och flerstegs { name, portrait, lines: [...], action }
// Alltid: "Nästa →" mellan repliker, tydlig "Stäng ✕"-knapp.
// ============================================================
function DialogBubble({ dialog, onClose }) {
  const [step, setStep] = useState(0);

  // Normalisera alla format till { name, portrait, lines[], action }
  let name, portrait, lines, action;
  if (typeof dialog === "string") {
    lines = [dialog];
  } else {
    name = dialog.name;
    portrait = dialog.portrait;
    action = dialog.action;
    lines = dialog.lines || (dialog.text != null ? [dialog.text] : [""]);
  }

  const isLast = step >= lines.length - 1;

  return (
    <div className="td-dialog-bubble">
      <button className="td-dialog-close" onClick={onClose} aria-label="Stäng samtalet">✕</button>
      <div className="td-dialog-header">
        {portrait && (
          <div className="td-dialog-portrait"><img src={portrait} alt={name || ""} /></div>
        )}
        {name && <strong className="td-dialog-name">{name}</strong>}
      </div>
      <p>{lines[step]}</p>
      <div className="td-dialog-buttons">
        {!isLast ? (
          <button className="td-btn td-btn-gold" onClick={() => setStep(step + 1)}>
            Nästa →
          </button>
        ) : action ? (
          <button className="td-btn td-btn-gold" onClick={action.onClick}>
            {action.label}
          </button>
        ) : (
          <button className="td-btn" onClick={onClose}>Stäng</button>
        )}
      </div>
    </div>
  );
}

function InteriorView({ locationKey, completed, foundItems, dialog, setDialog,
                        onPickUpItem, onStartMission, onBack,
                        detailView, setDetailView }) {
  const hotspot = HOTSPOTS[locationKey];
  let scene;
  if (locationKey === "puzzle") {
    scene = (
      <PuzzleWorkshopScene completed={completed} foundItems={foundItems}
        setDialog={setDialog} onPickUpItem={onPickUpItem}
        onStartMission={onStartMission} setDetailView={setDetailView} />
    );
  } else if (locationKey === "harbor") {
    scene = (
      <HarborScene foundItems={foundItems}
        setDialog={setDialog} onPickUpItem={onPickUpItem}
        onStartMission={onStartMission} />
    );
  } else if (locationKey === "reading") {
    scene = (
      <BokgrandenScene completed={completed} foundItems={foundItems}
        setDialog={setDialog} onPickUpItem={onPickUpItem}
        onStartMission={onStartMission} />
    );
  } else if (locationKey === "cave") {
    scene = (
      <CaveScene completed={completed} foundItems={foundItems}
        setDialog={setDialog} onPickUpItem={onPickUpItem}
        onStartMission={onStartMission} />
    );
  } else if (locationKey === "clock") {
    scene = (
      <ClockTowerScene completed={completed} setDialog={setDialog} onStartMission={onStartMission} />
    );
  } else if (locationKey === "observatory") {
    scene = (
      <ObservatoryScene foundItems={foundItems} setDialog={setDialog} onPickUpItem={onPickUpItem} />
    );
  } else {
    scene = <ComingSoonScene title={hotspot.title} onStartMission={onStartMission} />;
  }
  return (
    <div className="td-interior td-fade-in">
      <div className="td-interior-topbar">
        <button className="td-btn td-btn-small" onClick={onBack}>← Tillbaka till kartan</button>
        <div className="td-interior-title-banner"><span>{hotspot.title}</span></div>
        <div style={{ width: "150px" }} />
      </div>
      <div className="td-interior-stage">{scene}</div>
      {dialog && (
        <DialogBubble dialog={dialog} onClose={() => setDialog(null)} />
      )}
      {detailView && (
        <DetailOverlay type={detailView} onClose={() => setDetailView(null)} />
      )}
    </div>
  );
}

function DetailOverlay({ type, onClose }) {
  if (type === "karta") {
    return (
      <div className="td-detail-overlay" onClick={onClose}>
        <div className="td-detail-content" onClick={(e) => e.stopPropagation()}>
          <div className="td-detail-stamp">UPPHITTAD KARTA</div>
          <div className="td-detail-image-wrap">
            <img src={ASSETS.kartaDetalj} alt="Kartan på verktygsväggen" />
          </div>
          <p className="td-detail-caption">
            En gammal karta över stadens kloakgångar. Linjerna slingrar sig som
            en labyrint under hela staden. Två kompassrosor markerar ingångar.
            Vem ritade den här?
          </p>
          <button className="td-btn td-btn-gold" onClick={onClose}>✕ Lägg tillbaka</button>
        </div>
      </div>
    );
  }
  if (type === "fonster") {
    return (
      <div className="td-detail-overlay" onClick={onClose}>
        <div className="td-detail-content td-detail-window" onClick={(e) => e.stopPropagation()}>
          <div className="td-detail-stamp">UTSIKTEN</div>
          <div className="td-window-frame">
            <div className="td-window-shutter td-window-shutter-left" />
            <div className="td-window-shutter td-window-shutter-right" />
            <div className="td-window-view">
              <img src={ASSETS.fonsterDetalj} alt="Utsikt över staden" />
            </div>
          </div>
          <p className="td-detail-caption">
            Stadens tak breder ut sig. Två tornspiror reser sig i fjärran — det
            ena är säkert klocktornet. Solen står konstigt högt på himlen för
            att vara så här tidigt på dagen...
          </p>
          <button className="td-btn td-btn-gold" onClick={onClose}>✕ Stäng fönstret</button>
        </div>
      </div>
    );
  }
  return null;
}

function PuzzleWorkshopScene({ completed, foundItems, setDialog, onPickUpItem,
                                onStartMission, setDetailView }) {
  const gearFound = foundItems.includes("puzzle:gear");
  const trapdoorFound = foundItems.includes("puzzle:trapdoor");
  const klonkClickCount = useRef(0);
  const klonkClickTimer = useRef(null);
  const [klonkSurprised, setKlonkSurprised] = useState(false);

  function handleKlonkClick() {
    if (klonkClickTimer.current) clearTimeout(klonkClickTimer.current);
    const idx = Math.min(klonkClickCount.current, KLONK_RAPID_DIALOGS.length - 1);
    setDialog(KLONK_RAPID_DIALOGS[idx]);
    klonkClickCount.current += 1;
    klonkClickTimer.current = setTimeout(() => { klonkClickCount.current = 0; }, 3000);
  }

  const [trapdoorVisible, setTrapdoorVisible] = useState(false);
  const [trapdoorPos, setTrapdoorPos] = useState({ x: 50, y: 85 });

  useEffect(() => {
    if (trapdoorFound) return;
    function spawnTrapdoor() {
      const x = 28 + Math.random() * 35;
      const y = 80 + Math.random() * 10;
      setTrapdoorPos({ x, y });
      setTrapdoorVisible(true);
      setTimeout(() => setTrapdoorVisible(false), 2500);
    }
    const initial = setTimeout(spawnTrapdoor, 15000);
    const interval = setInterval(spawnTrapdoor, 30000);
    return () => { clearTimeout(initial); clearInterval(interval); };
  }, [trapdoorFound]);

  function catchTrapdoor() {
    onPickUpItem("puzzle:trapdoor");
    setTrapdoorVisible(false);
    setDialog("Du hittade en hemlig lucka i golvet! Inuti finns en burk pepparkakor, ett gammalt mynt, och en lapp: 'Gå inte ner i kloakerna utan kompass.' Vad i hela friden...");
  }

  const [valvePhase, setValvePhase] = useState("idle");
  const [valveClickedOnce, setValveClickedOnce] = useState(false);

  function handleValveClick() {
    if (valvePhase !== "idle") return;
    setValvePhase("twisting");
    setKlonkSurprised(true);
    setTimeout(() => { setValvePhase("running"); }, 500);
    setTimeout(() => {
      setValvePhase("cooling");
      setKlonkSurprised(false);
      setDialog(
        valveClickedOnce
          ? "PUFF... PUFF... \"Skramlar bara,\" suckar Klonk. \"Maskinen behöver rätt mönster för att fungera på riktigt — inte bara en knapp.\""
          : "PUFF... PUFF... Klonk stryker bort en oljedroppe från glasögonen. \"Oj, det är testventilen! Jag glömde nästan att den fanns. Men utan rätt mönster bara skramlar maskinen. Vi behöver lösa pusslet på riktigt.\""
      );
      setValveClickedOnce(true);
    }, 2500);
    setTimeout(() => { setValvePhase("idle"); }, 7500);
  }

  const machineRunning = valvePhase === "running";

  return (
    <div className={`td-scene-image ${machineRunning ? "td-scene-shake" : ""}`}
         style={{ backgroundImage: `url(${ASSETS.puzzleWorkshop})` }}>
      <svg className="td-anim-overlay" viewBox="0 0 100 100"
           style={{ left: "67%", top: "30%", width: "5%", height: "9%" }}>
        <circle cx="50" cy="50" r="42" fill="rgba(253, 201, 77, 0.18)"
                style={{ transformOrigin: "50% 50%",
                  animation: `tdSpin ${machineRunning ? "0.5s" : "8s"} linear infinite` }} />
      </svg>
      <svg className="td-anim-overlay" viewBox="0 0 100 100"
           style={{ left: "75%", top: "32%", width: "4%", height: "7%" }}>
        <circle cx="50" cy="50" r="42" fill="rgba(253, 201, 77, 0.15)"
                style={{ transformOrigin: "50% 50%",
                  animation: `tdSpinReverse ${machineRunning ? "0.7s" : "12s"} linear infinite` }} />
      </svg>
      <div className="td-steam" style={{ left: "76%", top: "8%", width: "5%", height: "10%" }}>
        <span className="td-steam-puff td-steam-puff-1" style={{ animationDuration: machineRunning ? "0.8s" : "3s" }} />
        <span className="td-steam-puff td-steam-puff-2" style={{ animationDuration: machineRunning ? "0.8s" : "3s" }} />
        <span className="td-steam-puff td-steam-puff-3" style={{ animationDuration: machineRunning ? "0.8s" : "3s" }} />
      </div>
      {machineRunning && (
        <>
          <div className="td-extra-steam" style={{ left: "60%", top: "30%" }}><span className="td-burst-puff" /></div>
          <div className="td-extra-steam" style={{ left: "85%", top: "40%" }}><span className="td-burst-puff" style={{ animationDelay: "0.3s" }} /></div>
          <div className="td-extra-steam" style={{ left: "73%", top: "55%" }}><span className="td-burst-puff" style={{ animationDelay: "0.6s" }} /></div>
          <div className="td-extra-steam" style={{ left: "62%", top: "65%" }}><span className="td-burst-puff" style={{ animationDelay: "0.9s" }} /></div>
        </>
      )}
      <div className={`td-lamp-flicker ${machineRunning ? "td-lamp-overdrive" : ""}`}
           style={{ left: "42%", top: "23%", width: "8%", height: "10%" }} />
      <div className={`td-puzzle-grid ${machineRunning ? "td-puzzle-grid-running" : ""}`}
           style={{ left: "63%", top: "46%", width: "5%", height: "11%" }}>
        <span style={{ animationDelay: "0s" }} />
        <span style={{ animationDelay: "0.4s" }} />
        <span style={{ animationDelay: "0.8s" }} />
        <span style={{ animationDelay: "1.2s" }} />
      </div>
      {machineRunning && (
        <div className="td-machine-running-text-big">RAGGA-DAGG!</div>
      )}
      <TaggedHotspot
        style={{ left: "57%", top: "10%", width: "34%", height: "65%" }}
        tagPosition={{ left: "50%", top: "78%" }} tagRotation={-2}
        onClick={onStartMission}
        label={completed ? "Maskinen ✓" : "Maskinen"} primary
        ariaLabel="Den stora maskinen" />
      <button className={`td-tagged td-tagged-valve td-valve-${valvePhase}`}
        style={{ left: "55%", top: "47%", width: "5%", height: "7%" }}
        onClick={handleValveClick}
        aria-label="Röd ventil — testkör maskinen"
        disabled={valvePhase !== "idle"}>
        <span className="td-tagged-glow" />
        <span className="td-valve-knob">
          <svg viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="14" fill="rgba(217, 76, 61, 0.4)" stroke="rgba(58, 42, 23, 0.6)" strokeWidth="2" />
            <line x1="20" y1="8" x2="20" y2="32" stroke="rgba(58, 42, 23, 0.8)" strokeWidth="3" />
            <line x1="8" y1="20" x2="32" y2="20" stroke="rgba(58, 42, 23, 0.8)" strokeWidth="3" />
            <circle cx="20" cy="20" r="3" fill="rgba(58, 42, 23, 0.9)" />
          </svg>
        </span>
        <span className="td-paper-tag"
              style={{ left: "50%", top: "115%", transform: "translateX(-50%) rotate(4deg)" }}>
          {valvePhase === "cooling" ? "...puh..." : "Ventilen"}
        </span>
      </button>
      <TaggedHotspot
        style={{ left: "1%", top: "26%", width: "32%", height: "40%" }}
        tagPosition={{ left: "50%", top: "100%" }} tagRotation={2}
        onClick={() => setDetailView("karta")} label="Verktygsväggen"
        ariaLabel="Verktygsväggen" />
      <TaggedHotspot
        style={{ left: "10%", top: "4%", width: "22%", height: "20%" }}
        tagPosition={{ left: "50%", top: "100%" }} tagRotation={-3}
        onClick={() => setDetailView("fonster")} label="Fönstret"
        ariaLabel="Fönstret" />
      {!gearFound && (
        <TaggedHotspot
          style={{ left: "76%", top: "78%", width: "12%", height: "16%" }}
          tagPosition={{ left: "50%", top: "100%" }} tagRotation={3}
          onClick={() => {
            onPickUpItem("puzzle:gear");
            setDialog("Du hittade ett glittrande kugghjul på arbetsbänken! Det glömmer du inte i första taget.");
          }}
          label="Skatt!" treasure ariaLabel="Glittrande kugghjul" />
      )}
      {trapdoorVisible && (
        <button className="td-trapdoor"
          style={{ left: `${trapdoorPos.x}%`, top: `${trapdoorPos.y}%` }}
          onClick={catchTrapdoor} aria-label="Hemlig lucka" />
      )}
      <button className={`td-character-figure ${klonkSurprised ? "td-character-surprised" : ""}`}
              onClick={handleKlonkClick} aria-label="Prata med Herr Klonk">
        <img src={ASSETS.klonkFull} alt="Herr Klonk" />
        <span className={`td-character-bubble ${klonkSurprised ? "td-character-bubble-surprised" : ""}`}>
          {klonkSurprised ? "!!" : "!"}
        </span>
      </button>
      {/* Murre — katten, sitter bredvid Klonks fötter, klickbar */}
      <button className="td-murre"
        aria-label="Klappa Murre katten"
        onClick={() => setDialog({
          name: "Murre",
          portrait: ASSETS.murreFull,
          lines: [
            "*Murre tittar upp på dig och spinner.* Mjau!",
            "*Katten gnider sig mot ditt ben och kurar ihop sig nöjt.* Mrrrow.",
          ],
        })}>
        <img src={ASSETS.murreFull} alt="Murre katten" />
      </button>
      {/* === GÖMDA SAMLARPRYLAR === */}
      <Hideaway
        x={60} y={90} size={4}
        found={foundItems.includes("puzzle:nut")}
        icon="🔩"
        hint="Något ligger på arbetsbänken..."
        foundText="En tung sexkantig mutter låg bland kugghjulen! Du stoppar den i väskan."
        onFind={(t) => { onPickUpItem("puzzle:nut"); setDialog(t); }}
      />
      <Hideaway
        x={38} y={45} size={4}
        found={foundItems.includes("puzzle:magnet")}
        icon="🧲"
        hint="Något sitter fast i byrålådan..."
        foundText="Du drog ut en byrålåda och hittade en envis liten magnet!"
        onFind={(t) => { onPickUpItem("puzzle:magnet"); setDialog(t); }}
      />
      <Hideaway
        x={41} y={22} size={4}
        found={foundItems.includes("puzzle:marble")}
        icon="🔮"
        hint="Något glimmar på hyllan..."
        foundText="En blå glaskula låg i en kruka högt upp på hyllan! Vacker."
        onFind={(t) => { onPickUpItem("puzzle:marble"); setDialog(t); }}
      />
      <Hideaway
        x={73} y={62} size={4}
        found={foundItems.includes("puzzle:feather")}
        icon="🪶"
        hint="Något sticker ut vid maskinen..."
        foundText="Bakom en kuggdriven lucka hittade du en fjäder av koppartråd!"
        onFind={(t) => { onPickUpItem("puzzle:feather"); setDialog(t); }}
      />

      <div className="td-scene-hint">Klicka på något som intresserar dig</div>
    </div>
  );
}

// ============================================================
// HAMNENS SCEN
// ============================================================
const HARBOR_DIALOGS = {
  falk: {
    portrait: "falk",
    name: "Kapten Falk",
    initial: "Ahoj där, ung detektiv! Jag är Kapten Falk. Lyssna nu — jag har ett paket som måste till fyrvaktaren ute på Yttre Skäret. Min gamla rygg är inte vad den varit, men min eka putt-putt-puttrar fortfarande! Vill du ta paketet dit och hämta hem ett brev jag väntar på?",
    accepted: "Bra! Hoppa i ekan vid bryggan. Akta dig för reven och var rädd om virvelvattnet... och de där flytande stockarna. Färden går ut, sedan tillbaka. Lycka till, sjöman!",
    completed: "Du klarade det! Här, behåll den här gamla nyckeln som tack. Jag vet inte vad den går till, men min farfar sa alltid att den skulle vara värdefull någon dag.",
  },
  lasse: {
    portrait: "lasse",
    name: "Lurige Lasse",
    initial: "Pssst! Du där, unga detektiv! Jag har en alldeles ÄKTA skattkarta till piraternas guld! Bara tre guldmynt! ...okej, två. Helt äkta, det lovar jag på min mormors grav! Hon dog förresten med ett leende på läpparna, så hennes grav är en mycket pålitlig sak att lova på.",
    second: "Inte intresserad? Hmm. Vill du köpa en magisk burk med Atlantissand då? Den gör att man flyter på vatten. Eller... eller får det att regna! En av de där! Bara två mynt. Helt äkta sand, säger jag!",
    third: "Du tror inte på mig?! Hmpf. Den där skattkartan KOMMER du att ångra att du inte köpte. När du står där om en månad utan guld och tänker 'om jag bara hade lyssnat på Lurige Lasse'... så minns mig då. Jag finns alltid här. Tyvärr.",
  },
  berit: {
    portrait: "berit",
    name: "Berit",
    initial: "Hej! Jag är Berit, hamnens starkaste arm. Ska du segla med Falks eka? Då måste jag varna dig — viken är FULL av rev under ytan. Håll dig till de djupare partierna. Och virveln vid mittpunkten? Närma dig inte den! Min farbror gjorde det en gång. Han kom hem... men håret blev grått över en natt.",
    second: "Det finns ett SJÖODJUR i norra viken. Stort, grönt, ganska gulligt faktiskt — men det är så pass dumt att det kan slå omkull en båt om man kommer för nära. Och piratskeppet uppe vid de norra klipporna? Det är förvisso övergivet, men ändå. Akta sig!",
    third: "Stockarna som driver i viken är gamla telegrafstolpar från ett vrak från 1923. Tyngre än de ser ut. Krocka inte. Och hajfena du kanske ser? Den är bara en delfin som ser ut som haj. Men vi säger inte det till turisterna.",
  },
  framling: {
    portrait: "framling",
    name: "Den mystiska främlingen",
    initial: "*Främlingen tittar upp från sin bok och ler svagt.* Du letar efter Tidsmaskinen, inte sant? Jag har sett ditt namn i mina anteckningar... fast bläcket är inte torrt ännu. Lyssna noga: TRE nycklar krävs för att öppna porten i Tidsstaden. Du har redan börjat hitta den första.",
    second: "*Främlingen bläddrar i sin bok med kompass i handen.* Klockan i tornet räknar inte sekunder. Den räknar något annat. Och boken i bokgränden är inte bara en bok — den är en karta. Lyssna på det som inte sägs.",
    third: "*Främlingen slår igen sin bok med en smäll.* En sista varning, ung detektiv: när du står vid Tidsmaskinen och ska välja — välj inte den knapp som glöder starkast. Det är den som VILL bli vald som väntar på dig.",
  },
};

function HarborScene({ foundItems, setDialog, onPickUpItem, onStartMission }) {
  const [missionAccepted, setMissionAccepted] = useState(false);
  const harborKeyFound = foundItems.includes("harbor:key");

  // Visa en specifik dialog i en cykel-karaktärs sekvens (Lasse, Berit, Främlingen)
  // — Med "Nästa →"-knapp om det finns mer att säga
  function showCycleDialog(charKey, dialogIndex) {
    const data = HARBOR_DIALOGS[charKey];
    const dialogs = [data.initial, data.second, data.third];
    const text = dialogs[dialogIndex];
    const hasNext = dialogIndex < dialogs.length - 1;

    setDialog({
      portrait: ASSETS[data.portrait],
      name: data.name,
      text,
      action: hasNext
        ? {
            label: "Nästa →",
            onClick: () => showCycleDialog(charKey, dialogIndex + 1),
          }
        : null,
    });
  }

  function talkTo(charKey) {
    const data = HARBOR_DIALOGS[charKey];
    if (charKey === "falk") {
      let text;
      let action;
      if (harborKeyFound) {
        text = data.completed;
      } else if (missionAccepted) {
        text = data.accepted;
        action = { label: "▸ Ge dig av igen!", onClick: () => { setDialog(null); onStartMission(); } };
      } else {
        text = data.initial;
        action = { label: "▸ Jag tar uppdraget!", onClick: startBoatGame };
      }
      setDialog({
        portrait: ASSETS[data.portrait],
        name: data.name,
        text,
        action,
      });
    } else {
      // Cykel-karaktärer: börja från första dialog med "Nästa →"-knapp
      showCycleDialog(charKey, 0);
    }
  }

  function startBoatGame() {
    setMissionAccepted(true);
    setDialog(null);
    onStartMission();
  }

  return (
    <div className="td-scene-image td-scene-video-wrap">

      {/* Levande bakgrund: loopande video med rörligt vatten.
          LoopingVideo ger mjuk cross-fade vid skarven (inget hopp).
          poster visas direkt medan videon laddar så scenen aldrig är tom. */}
      <LoopingVideo src={ASSETS.hamnVideo} poster={ASSETS.hamnPoster} />

      {/* === LEVANDE BAKGRUNDSELEMENT === */}
      {/* Lyktornas glöd — uppe vid hamnkaptenens hus */}
      <div className="td-harbor-lantern" style={{ left: "8%", top: "33%" }} />
      <div className="td-harbor-lantern" style={{ left: "27%", top: "33%", animationDelay: "1.3s" }} />
      <div className="td-harbor-lantern" style={{ left: "59%", top: "45%", animationDelay: "0.7s" }} />

      {/* Fyrens blink i fjärran */}
      <div className="td-harbor-lighthouse" style={{ left: "82%", top: "26%" }} />

      {/* Måsen på pållaren */}
      <div className="td-harbor-seagull" style={{ left: "94%", top: "70%" }} />

      {/* Fågel-silhuett som flyger förbi i fjärran */}
      <svg className="td-harbor-bird-fly" viewBox="0 0 30 14" aria-hidden="true">
        <path d="M 3 8 Q 6 4, 9 8 Q 12 4, 15 8" stroke="#3a2a17"
              strokeWidth="1.5" fill="none" strokeLinecap="round" />
      </svg>

      {/* === KLICKBARA KARAKTÄRER === */}

      {/* Falk — LÄNGST FRAM, nära kameran, störst */}
      <HarborCharacter
        style={{ left: "33%", bottom: "-6%", height: "74%", aspectRatio: "793 / 1983", zIndex: 14 }}
        image={ASSETS.falkFull}
        label="Kapten Falk"
        onClick={() => talkTo("falk")}
        primary
        smoking
      />

      {/* Lasse — närmare kameran, framför hamnkontoret */}
      <HarborCharacter
        style={{ left: "8%", bottom: "11%", height: "47%", aspectRatio: "793 / 1983", zIndex: 10 }}
        image={ASSETS.lasseFull}
        label="???"
        onClick={() => talkTo("lasse")}
        suspicious
      />

      {/* Främlingen — på bryggdäcket längst bak, vid lådorna, minst, mystisk */}
      <HarborCharacter
        style={{ left: "46%", bottom: "20%", height: "30%", aspectRatio: "793 / 1983", zIndex: 8 }}
        image={ASSETS.framlingFull}
        label="?"
        onClick={() => talkTo("framling")}
        mystery
      />

      {/* === EKAN — Falks dialog startar båtspelet === */}

      {/* === GÖMDA SAMLARPRYLAR === */}
      <Hideaway
        x={4} y={84} size={4}
        found={foundItems.includes("harbor:shell")}
        icon="🐚"
        hint="Något ligger i gräset..."
        foundText="Du hittade en spiralvriden snäcka i gräset! Den lägger du i väskan."
        onFind={(t) => { onPickUpItem("harbor:shell"); setDialog(t); }}
      />
      <Hideaway
        x={14} y={72} size={4}
        found={foundItems.includes("harbor:hook")}
        icon="🪝"
        hint="Något glimmar vid trälådan..."
        foundText="En rostig fiskkrok låg fastkrokad i nätet! Nu är den din."
        onFind={(t) => { onPickUpItem("harbor:hook"); setDialog(t); }}
      />
      <Hideaway
        x={63} y={54} size={4}
        found={foundItems.includes("harbor:compass")}
        icon="🧭"
        hint="Något ligger bland tunnorna..."
        foundText="Du hittade en liten kompass bakom tunnorna! Nålen snurrar konstigt."
        onFind={(t) => { onPickUpItem("harbor:compass"); setDialog(t); }}
      />
      <Hideaway
        x={33} y={80} size={4}
        found={foundItems.includes("harbor:coin")}
        icon="🪙"
        hint="Något glimmar mellan plankorna..."
        foundText="Ett grönt mynt satt fastklämt mellan två plankor! Du petar loss det."
        onFind={(t) => { onPickUpItem("harbor:coin"); setDialog(t); }}
      />

      <div className="td-scene-hint">
        Prata med folket på hamnen
      </div>
    </div>
  );
}

// ============================================================
// HarborCharacter — full-body karaktär som står på kajen
// ============================================================
function HarborCharacter({ style, image, label, onClick, primary, suspicious, mystery, smoking, mirror }) {
  return (
    <button
      className={`td-harbor-character ${primary ? "td-harbor-primary" : ""} ${suspicious ? "td-harbor-suspicious" : ""} ${mystery ? "td-harbor-mystery" : ""} ${mirror ? "td-harbor-mirror" : ""}`}
      style={style}
      onClick={onClick}
      aria-label={label}
    >
      <span className="td-harbor-character-glow" />
      <img src={image} alt={label} className="td-harbor-character-img" />
      {smoking && (
        <span className="td-harbor-smoke" aria-hidden="true">
          <span className="td-harbor-smoke-puff td-harbor-smoke-1" />
          <span className="td-harbor-smoke-puff td-harbor-smoke-2" />
          <span className="td-harbor-smoke-puff td-harbor-smoke-3" />
        </span>
      )}
      <span className="td-harbor-character-tag">{label}</span>
    </button>
  );
}


// ============================================================
// BÅTSPELET — top-down navigation genom viken
// ============================================================

// Spelvärldens konstanter (alla i procent av vikens storlek)
const BOAT_TARGETS = {
  lighthouse: { x: 80, y: 11, r: 7 },
  harbor: { x: 47, y: 88, r: 5 },
};

const BOAT_WHIRLPOOL = { x: 51, y: 37, r: 5, pull: 3, spin: 70 };

const BOAT_OBSTACLES = [
  // === Stora öar ===
  { x: 22, y: 38, r: 7, msg: "AJ! En ö i vägen!" },
  { x: 65, y: 56, r: 7, msg: "AJ! Pang i ön!" },

  // === Sjöodjur & andra varelser ===
  { x: 52, y: 14, r: 5, msg: "OJ! Ett sjöodjur!" },
  { x: 54, y: 30, r: 2.5, msg: "Sjöormens unge!" },
  { x: 45, y: 55, r: 2, msg: "En säl ploppade upp!" },
  { x: 50, y: 62, r: 2, msg: "En hajfena! Bort!" },

  // === Piratskepp ===
  { x: 35, y: 25, r: 4, msg: "OJ! Ett piratskepp!" },

  // === Synliga stenar (få, små radie) ===
  { x: 60, y: 25, r: 1.5, msg: "AJ! Stenar!" },
  { x: 78, y: 45, r: 1.5, msg: "AJ! Klippor!" },
  { x: 28, y: 41, r: 1.5, msg: "AJ! Klippor!" },

  // === Flytande stockar (små radie) ===
  { x: 44, y: 18, r: 1.5, msg: "AJ! En stock!" },
  { x: 76, y: 32, r: 1.5, msg: "AJ! En stock!" },
  { x: 54, y: 54, r: 1.5, msg: "AJ! En stock!" },
  { x: 78, y: 70, r: 1.5, msg: "AJ! En stock!" },
  { x: 18, y: 90, r: 1.5, msg: "AJ! En stock!" },

  // === Vänster strand ===
  { x: 8, y: 15, r: 3, msg: "AJ! Stranden!" },
  { x: 8, y: 28, r: 3, msg: "AJ! Stranden!" },
  { x: 6, y: 40, r: 3, msg: "AJ! Stranden!" },
  { x: 6, y: 55, r: 3, msg: "AJ! Stranden!" },
  { x: 8, y: 70, r: 3, msg: "AJ! Stranden!" },
  { x: 11, y: 85, r: 3, msg: "AJ! Stranden!" },

  // === Höger strand ===
  { x: 87, y: 18, r: 3, msg: "AJ! Stranden!" },
  { x: 87, y: 32, r: 3, msg: "AJ! Stranden!" },
  { x: 87, y: 47, r: 3, msg: "AJ! Stranden!" },
  { x: 89, y: 62, r: 3, msg: "AJ! Stranden!" },
  { x: 89, y: 77, r: 3, msg: "AJ! Stranden!" },
  { x: 87, y: 88, r: 3, msg: "AJ! Stranden!" },

  // === Övre strand ===
  { x: 17, y: 8, r: 3, msg: "AJ! Stranden!" },
  { x: 32, y: 7, r: 3, msg: "AJ! Stranden!" },
  { x: 70, y: 7, r: 3, msg: "AJ! Stranden!" },

  // === Nedre strand ===
  { x: 18, y: 92, r: 3, msg: "AJ! Stranden!" },
  { x: 28, y: 95, r: 3, msg: "AJ! Stranden!" },
  { x: 65, y: 95, r: 3, msg: "AJ! Stranden!" },
  { x: 78, y: 92, r: 3, msg: "AJ! Stranden!" },

  // === Bryggan ===
  { x: 40, y: 91, r: 2, msg: "AJ! Bryggan!" },
  { x: 54, y: 91, r: 2, msg: "AJ! Bryggan!" },
];

function BoatGame({ onComplete, onBack }) {
  const stageRef = useRef(null);
  const boatRef = useRef(null);

  // Allt snabbt-ändrande data lagras i ref för att undvika
  // React-rerendering varje frame
  const dataRef = useRef({
    x: 45, y: 78,        // båtens startposition (i öppet vatten ovanför bryggan)
    angle: 0,            // 0 = uppåt
    speed: 0,
    target: null,        // {x, y} dit spelaren pekar
    phase: "to_lighthouse",
    crashing: false,
    lastTrailTime: 0,
    nextTrailId: 0,
  });

  const [boat, setBoat] = useState({ x: 45, y: 78, angle: 0 });
  const [phase, setPhase] = useState("to_lighthouse");
  const [targetMarker, setTargetMarker] = useState(null);
  const [crashMsg, setCrashMsg] = useState(null);
  const [arrivedAtLighthouse, setArrivedAtLighthouse] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [trail, setTrail] = useState([]);
  const [splashes, setSplashes] = useState([]);
  const nextSplashIdRef = useRef(0);

  // Zoom-nivå för kameran — högre = närmare båten, men mindre översikt
  const ZOOM = 2;

  // Kamerans position — följer båten direkt utan clamping
  // (så även vid kanten av kartan visas båten i mitten av skärmen)
  function getWorldOffset(bx, by) {
    return {
      wL: 50 - ZOOM * bx,
      wT: 50 - ZOOM * by,
    };
  }

  function eventToPos(e) {
    const vpRect = stageRef.current.getBoundingClientRect();
    const vpX = ((e.clientX - vpRect.left) / vpRect.width) * 100;
    const vpY = ((e.clientY - vpRect.top) / vpRect.height) * 100;
    // Konvertera viewport-koordinater till world-koordinater (vikens 0-100)
    const data = dataRef.current;
    const { wL, wT } = getWorldOffset(data.x, data.y);
    const worldX = (vpX - wL) / ZOOM;
    const worldY = (vpY - wT) / ZOOM;
    return { x: worldX, y: worldY };
  }

  function handlePointerDown(e) {
    if (completed) return;
    e.preventDefault();
    if (e.target.setPointerCapture && e.pointerId !== undefined) {
      try { e.target.setPointerCapture(e.pointerId); } catch {}
    }
    const pos = eventToPos(e);
    dataRef.current.target = pos;
    setTargetMarker(pos);
  }
  function handlePointerMove(e) {
    if (!dataRef.current.target || completed) return;
    const pos = eventToPos(e);
    dataRef.current.target = pos;
    setTargetMarker(pos);
  }
  function handlePointerUp() {
    dataRef.current.target = null;
    setTargetMarker(null);
  }

  // Game loop
  useEffect(() => {
    let raf;
    let lastTime = performance.now();

    function loop(time) {
      const dt = Math.min((time - lastTime) / 1000, 0.05);
      lastTime = time;
      const d = dataRef.current;

      // === Styrning ===
      if (d.target && !completed) {
        const dx = d.target.x - d.x;
        const dy = d.target.y - d.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist > 1.5) {
          // Önskad vinkel (atan2 med sin/cos eftersom 0 = uppåt)
          const targetAngle = (Math.atan2(dx, -dy) * 180) / Math.PI;
          let diff = targetAngle - d.angle;
          while (diff > 180) diff -= 360;
          while (diff < -180) diff += 360;

          // Vänd båten gradvis
          const turnRate = 90; // grader/sek
          const turn = Math.max(-turnRate * dt, Math.min(turnRate * dt, diff));
          d.angle += turn;

          // Acceleration — bara om vi är någotsånär rätt riktad
          const maxSpeed = 4; // procent/sek (puttrande gammal eka)
          const aimedOk = Math.abs(diff) < 60;
          if (aimedOk) {
            d.speed = Math.min(maxSpeed, d.speed + 2.5 * dt);
          } else {
            d.speed = Math.max(0, d.speed - 2 * dt);
          }
        } else {
          // Vi är nästan vid målet — sakta in
          d.speed = Math.max(0, d.speed - 12 * dt);
        }
      } else {
        // Inget mål → sakta in
        d.speed = Math.max(0, d.speed - 6 * dt);
      }

      // === Flytta ===
      const rad = (d.angle * Math.PI) / 180;
      d.x += Math.sin(rad) * d.speed * dt;
      d.y -= Math.cos(rad) * d.speed * dt;

      // Spelytans yttre gränser (förhindrar att båten åker utanför kartan helt)
      d.x = Math.max(11, Math.min(89, d.x));
      d.y = Math.max(6, Math.min(91, d.y));

      // === Virveln drar in ===
      const wdx = d.x - BOAT_WHIRLPOOL.x;
      const wdy = d.y - BOAT_WHIRLPOOL.y;
      const wdist = Math.sqrt(wdx * wdx + wdy * wdy);
      if (wdist < BOAT_WHIRLPOOL.r && wdist > 0.1) {
        const strength = (1 - wdist / BOAT_WHIRLPOOL.r);
        d.x -= (wdx / wdist) * BOAT_WHIRLPOOL.pull * strength * dt;
        d.y -= (wdy / wdist) * BOAT_WHIRLPOOL.pull * strength * dt;
        d.angle += BOAT_WHIRLPOOL.spin * strength * dt;
      }

      // === Kollisioner med sliding response ===
      for (const obs of BOAT_OBSTACLES) {
        const odx = d.x - obs.x;
        const ody = d.y - obs.y;
        const odist = Math.sqrt(odx * odx + ody * ody);
        if (odist < obs.r && odist > 0.01) {
          // Normal mot kollisionen (riktning från hinder till båt)
          const nx = odx / odist;
          const ny = ody / odist;

          // Knuffa ut båten helt utanför hindret + lite marginal
          const push = obs.r - odist + 0.3;
          d.x += nx * push;
          d.y += ny * push;

          // Beräkna båtens hastighetsvektor
          const ang = (d.angle * Math.PI) / 180;
          const vx = Math.sin(ang) * d.speed;
          const vy = -Math.cos(ang) * d.speed;

          // Projektion av hastighet på normalen
          const vDotN = vx * nx + vy * ny;

          // Om båten åkte INTO hindret, ta bort den komponenten
          // så båten glider TANGENTIELLT längs hindret istället för att stanna
          if (vDotN < 0) {
            const tx = vx - nx * vDotN;
            const ty = vy - ny * vDotN;
            const slidingSpeed = Math.sqrt(tx * tx + ty * ty) * 0.6;
            if (slidingSpeed > 0.3) {
              d.angle = (Math.atan2(tx, -ty) * 180) / Math.PI;
              d.speed = slidingSpeed;
            } else {
              d.speed = 0;
            }
          }

          if (!d.crashing) {
            d.crashing = true;
            setCrashMsg(obs.msg);
            // Spawna vattenspruta vid krock-punkten
            const splashId = nextSplashIdRef.current++;
            const splashX = d.x;
            const splashY = d.y;
            setSplashes((prev) => [...prev, { id: splashId, x: splashX, y: splashY }]);
            setTimeout(() => {
              setSplashes((prev) => prev.filter((s) => s.id !== splashId));
            }, 700);
            setTimeout(() => {
              setCrashMsg(null);
              d.crashing = false;
            }, 1400);
          }
          break; // bara EN kollision per frame
        }
      }

      // === Mål-kontroll ===
      if (!completed) {
        const targ = d.phase === "to_lighthouse" ? BOAT_TARGETS.lighthouse
                   : d.phase === "to_harbor" ? BOAT_TARGETS.harbor : null;
        if (targ) {
          const tdx = d.x - targ.x;
          const tdy = d.y - targ.y;
          if (Math.sqrt(tdx * tdx + tdy * tdy) < targ.r) {
            if (d.phase === "to_lighthouse") {
              d.phase = "to_harbor";
              setPhase("to_harbor");
              setArrivedAtLighthouse(true);
              d.speed = 0;
              d.target = null;
              setTargetMarker(null);
            } else if (d.phase === "to_harbor") {
              d.phase = "done";
              setCompleted(true);
              d.speed = 0;
              d.target = null;
              setTargetMarker(null);
            }
          }
        }
      }

      // === BÅTENS SPÅR ===
      // Skapa en ny trail-bubbla bakom båten om den rör sig
      if (d.speed > 1.5 && !completed) {
        const now = performance.now();
        if (now - d.lastTrailTime > 90) {
          d.lastTrailTime = now;
          // Position bakom båten (motsatt riktning av framdriften)
          const rad2 = (d.angle * Math.PI) / 180;
          const backX = d.x - Math.sin(rad2) * 2.8;
          const backY = d.y + Math.cos(rad2) * 2.8;
          const id = d.nextTrailId++;
          setTrail((prev) => [...prev, { id, x: backX, y: backY }]);
          // Ta bort efter animation klar
          setTimeout(() => {
            setTrail((prev) => prev.filter((p) => p.id !== id));
          }, 2500);
        }
      }

      // Skriv state → React (för rendering)
      setBoat({ x: d.x, y: d.y, angle: d.angle });

      raf = requestAnimationFrame(loop);
    }

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [completed]);

  // Aktuellt mål för visuell markör
  const currentTarget = phase === "to_lighthouse" ? BOAT_TARGETS.lighthouse
                      : phase === "to_harbor" ? BOAT_TARGETS.harbor : null;

  // Kamerans position
  const { wL, wT } = getWorldOffset(boat.x, boat.y);

  return (
    <div className="td-boat-game td-fade-in">
      <div className="td-boat-topbar">
        <button className="td-btn td-btn-small" onClick={onBack}>← Lämna båten</button>
        <div className="td-boat-status">
          {phase === "to_lighthouse" && "🎯 Lämna paketet vid fyren"}
          {phase === "to_harbor" && !completed && "🎯 Tillbaka till hamnen"}
          {completed && "★ Klart!"}
        </div>
        <div style={{ width: 130 }} />
      </div>

      <div className="td-boat-stage-wrap">
        <div
          ref={stageRef}
          className="td-boat-stage"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          {/* World — själva spelytan, större än viewport, följer båten */}
          <div
            className="td-boat-world"
            style={{
              transform: `translate3d(${wL / ZOOM}%, ${wT / ZOOM}%, 0)`,
              width: `${ZOOM * 100}%`,
              height: `${ZOOM * 100}%`,
              backgroundImage: `url(${ASSETS.vik})`,
            }}
          >
            {/* Fyrljuset — pulserande gulden glöd ovanpå fyren */}
            <div
              className="td-boat-lighthouse-light"
              style={{ left: `${BOAT_TARGETS.lighthouse.x}%`, top: `${BOAT_TARGETS.lighthouse.y}%` }}
            />

            {/* Virvel — animerade ringar ovanpå virveln på kartan */}
            <div
              className="td-boat-whirlpool-fx"
              style={{
                left: `${BOAT_WHIRLPOOL.x}%`,
                top: `${BOAT_WHIRLPOOL.y}%`,
                width: `${BOAT_WHIRLPOOL.r * 2}%`,
                aspectRatio: "1 / 1",
              }}
            >
              <div className="td-boat-whirlpool-ring td-boat-whirlpool-ring-1" />
              <div className="td-boat-whirlpool-ring td-boat-whirlpool-ring-2" />
              <div className="td-boat-whirlpool-ring td-boat-whirlpool-ring-3" />
            </div>

            {/* Mål-markör */}
            {currentTarget && !completed && (
              <div
                className="td-boat-target-marker"
                style={{ left: `${currentTarget.x}%`, top: `${currentTarget.y}%` }}
              >
                <span>★</span>
              </div>
            )}

            {/* Pekar-cirkel — visar vart spelaren styr */}
            {targetMarker && (
              <div
                className="td-boat-pointer"
                style={{ left: `${targetMarker.x}%`, top: `${targetMarker.y}%` }}
              />
            )}

            {/* Båtens spår i vattnet */}
            {trail.map((p) => (
              <div
                key={p.id}
                className="td-boat-trail"
                style={{ left: `${p.x}%`, top: `${p.y}%` }}
              />
            ))}

            {/* Båten */}
            <img
              ref={boatRef}
              src={ASSETS.eka}
              className="td-boat-sprite"
              alt=""
              style={{
                left: `${boat.x}%`,
                top: `${boat.y}%`,
                transform: `translate(-50%, -50%) rotate(${boat.angle}deg)`,
              }}
            />

            {/* Vattenspruta vid krockar */}
            {splashes.map((s) => (
              <div
                key={s.id}
                className="td-boat-splash"
                style={{ left: `${s.x}%`, top: `${s.y}%` }}
              >
                {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                  <span
                    key={i}
                    className="td-boat-splash-drop"
                    style={{ "--angle": `${(360 / 7) * i}deg` }}
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Krasch-meddelande (ligger i viewport, inte i world) */}
          {crashMsg && (
            <div className="td-boat-crash">{crashMsg}</div>
          )}

          {/* Anlände till fyren — kort dialog */}
          {arrivedAtLighthouse && phase === "to_harbor" && !completed && (
            <div className="td-boat-arrival-overlay"
                 onClick={() => setArrivedAtLighthouse(false)}>
              <div className="td-boat-arrival-card">
                <div className="td-stamp">FYREN</div>
                <p>
                  Du anlände till fyren! Fyrvaktaren tar emot paketet med
                  ett leende. <em>"Tack, unga sjöman! Här är ett brev till
                  Falk — ta det tillbaka säkert."</em>
                </p>
                <button className="td-btn td-btn-gold">▸ Sätt segel hemåt</button>
              </div>
            </div>
          )}

          {/* Klart-overlay */}
          {completed && (
            <div className="td-boat-arrival-overlay">
              <div className="td-boat-arrival-card td-boat-success">
                <div className="td-stamp">✦ Framme! ✦</div>
                <p>
                  Du seglade hela vägen tillbaka till hamnen!
                  Kapten Falk väntar på dig med en överraskning...
                </p>
                <button className="td-btn td-btn-big td-btn-gold"
                        onClick={onComplete}>
                  ★ Möt Kapten Falk
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="td-boat-hint">
        {phase === "to_lighthouse" && !targetMarker && "Håll ner musen eller fingret där du vill att båten ska åka"}
        {phase === "to_harbor" && !targetMarker && !completed && "Hitta hem igen!"}
        {targetMarker && "Släpp för att stanna"}
      </div>
    </div>
  );
}


function TaggedHotspot({ style, tagPosition, tagRotation = -2, onClick, label,
                          primary, treasure, ariaLabel }) {
  return (
    <button
      className={`td-tagged ${primary ? "td-tagged-primary" : ""} ${treasure ? "td-tagged-treasure" : ""}`}
      style={style} onClick={onClick} aria-label={ariaLabel}>
      <span className="td-tagged-glow" />
      <span className="td-paper-tag"
            style={{ ...tagPosition, transform: `translateX(-50%) rotate(${tagRotation}deg)` }}>
        {label}
      </span>
    </button>
  );
}

// ============================================================
// GÖMSTÄLLE — klickbar plats där en samlarpryl ligger gömd
// Visas bara om prylen inte redan hittats. När man klickar
// "hittar" man prylen (läggs i väskan) och markören försvinner.
// ============================================================
function Hideaway({ x, y, size = 4, found, icon, hint, foundText, onFind }) {
  if (found) return null;
  return (
    <button
      className="td-hideaway"
      style={{ left: `${x}%`, top: `${y}%`, width: `${size}%` }}
      onClick={() => onFind(foundText)}
      aria-label={hint}
      title={hint}
    >
      <span className="td-hideaway-glint" />
      <span className="td-hideaway-icon">{icon}</span>
    </button>
  );
}

// ============================================================
// BOKGRÄNDEN — gata med tre butiker man klickar in i
// ============================================================
const READING_TEXT = `Den gamla klockan på torget hade slutat slå. Varje morgon brukade den ringa sex slag när solen gick upp, men nu var den helt tyst. Mira märkte att fågeln som bodde i klocktornet hade flugit sin väg. Utan fågelns sång vaknade inte klockmästaren, och utan klockmästaren ringde inte klockan.`;

const READING_QUESTIONS = [
  {
    q: "Hur många slag brukade klockan slå på morgonen?",
    options: ["Tre slag", "Sex slag", "Tolv slag"],
    correct: 1,
  },
  {
    q: "Vem hade flugit sin väg?",
    options: ["Fågeln i klocktornet", "Klockmästaren", "Mira"],
    correct: 0,
  },
  {
    q: "Varför ringde inte klockan längre?",
    options: [
      "Den var sönder för alltid",
      "Klockmästaren vaknade inte utan fågelns sång",
      "Solen gick inte upp",
    ],
    correct: 1,
  },
];

// Föremål som ska matchas mot rätt världsdel i världsbutiken
const WORLD_ITEMS = [
  { id: "mask", icon: "🎭", name: "Afrikansk mask", region: "afrika" },
  { id: "buddha", icon: "🧘", name: "Buddha-staty", region: "asien" },
  { id: "totem", icon: "🗿", name: "Totem-figur", region: "amerika" },
  { id: "vase", icon: "🏺", name: "Antik vas", region: "europa" },
];
const WORLD_REGIONS = [
  { id: "amerika", name: "Amerika", cx: 22, cy: 55, rx: 18, ry: 40 },
  { id: "europa", name: "Europa", cx: 52, cy: 30, rx: 10, ry: 16 },
  { id: "afrika", name: "Afrika", cx: 56, cy: 62, rx: 12, ry: 24 },
  { id: "asien", name: "Asien", cx: 76, cy: 38, rx: 18, ry: 26 },
];

function BokgrandenScene({ completed, foundItems, setDialog, onPickUpItem, onStartMission }) {
  const [shop, setShop] = useState(null); // null = gata, annars "bok"/"hatt"/"varld"

  if (shop === "bok") {
    return <BokaffarShop alreadyDone={completed} onComplete={onStartMission}
      setDialog={setDialog} onBack={() => setShop(null)} />;
  }
  if (shop === "hatt") {
    return <HattaffarShop hatFound={foundItems.includes("reading:hat")}
      onPickUpItem={onPickUpItem} setDialog={setDialog}
      onBack={() => setShop(null)} />;
  }
  if (shop === "varld") {
    return <VarldsaffarShop onBack={() => setShop(null)} setDialog={setDialog} />;
  }

  // GATAN — tre klickbara butiker
  return (
    <div className="td-scene-image td-fade-in"
         style={{ backgroundImage: `url(${ASSETS.bokgrandenGata})` }}>
      <button className="td-shop-hotspot" style={{ left: "30%", top: "38%", width: "8.5%", height: "45%" }}
        onClick={() => setShop("bok")} aria-label="Gå in i bokbutiken">
        <span className="td-shop-label" style={{ top: "-11%" }}>📖 Bokbutiken</span>
      </button>
      <button className="td-shop-hotspot" style={{ left: "53.5%", top: "34%", width: "7%", height: "47%" }}
        onClick={() => setShop("hatt")} aria-label="Gå in i hattmakaren">
        <span className="td-shop-label" style={{ top: "-10%" }}>🎩 Hattmakaren</span>
      </button>
      <button className="td-shop-hotspot" style={{ left: "76%", top: "33%", width: "8.5%", height: "53%" }}
        onClick={() => setShop("varld")} aria-label="Gå in i världsbutiken">
        <span className="td-shop-label" style={{ top: "-9%" }}>🌍 Världsbutiken</span>
      </button>

      {/* Gatufigurer — liv och rörelse, klickbara med samtal */}
      <HarborCharacter
        style={{ left: "38%", bottom: "2%", height: "40%", aspectRatio: "696 / 1844", zIndex: 6 }}
        image={ASSETS.gubbeFull}
        label="Gamle Gustav"
        onClick={() => setDialog({
          name: "Gamle Gustav",
          portrait: ASSETS.gubbeFull,
          lines: [
            "En sån fin dag för en promenad i gränden!",
            "Jag har bott här i hela mitt liv. Den här lilla gränden gömmer fler hemligheter än du tror.",
            "Bokhandlerskan Mira där borta — hon har läst varenda bok i sin affär. Fråga henne om du kör fast.",
          ],
        })}
      />
      <HarborCharacter
        style={{ left: "62%", bottom: "0%", height: "38%", aspectRatio: "715 / 1889", zIndex: 6 }}
        image={ASSETS.blomsterFull}
        label="Blomster-Lina"
        onClick={() => setDialog({
          name: "Blomster-Lina",
          portrait: ASSETS.blomsterFull,
          lines: [
            "Färska blommor! Vill du köpa en bukett?",
            "Jag säljer blommor här varje dag. Man ser allt möjligt folk komma och gå.",
            "Letar du efter något mystiskt? Då ska du gå in i världsbutiken — där finns saker från hela jorden!",
          ],
        })}
      />

      <div className="td-scene-hint">Klicka på en butik för att gå in</div>
    </div>
  );
}

// --- BOKBUTIKEN: läsförståelse ---
function BokaffarShop({ alreadyDone, onComplete, setDialog, onBack }) {
  const [step, setStep] = useState("intro"); // intro -> reading -> q -> done
  const [qIndex, setQIndex] = useState(0);
  const [wrong, setWrong] = useState(false);

  function answer(i) {
    if (i === READING_QUESTIONS[qIndex].correct) {
      setWrong(false);
      if (qIndex + 1 < READING_QUESTIONS.length) {
        setQIndex(qIndex + 1);
      } else {
        setStep("done");
      }
    } else {
      setWrong(true);
    }
  }

  return (
    <div className="td-scene-image td-fade-in"
         style={{ backgroundImage: `url(${ASSETS.bokaffaren})` }}>
      <button className="td-shop-back td-btn td-btn-small" onClick={onBack}>← Ut på gatan</button>

      <button className="td-shop-figure td-shop-figure-btn"
        style={{ left: "8%", bottom: "0%", height: "82%", aspectRatio: "631 / 1813" }}
        aria-label="Prata med Mira"
        onClick={() => setDialog({
          name: "Mira",
          portrait: ASSETS.miraFull,
          lines: [
            "Åh, en ung detektiv! Så roligt att få besök i min lilla bokbutik.",
            "Jag älskar böcker mer än något annat. Varje bok är ett nytt mysterium att lösa.",
            "Vill du prova ett läsuppdrag? Då kan du förtjäna en av de tre nycklarna. Tryck på skylten så börjar vi!",
          ],
        })}>
        <img src={ASSETS.miraFull} alt="Mira" />
      </button>

      <div className="td-shop-panel">
        <button className="td-dialog-close" onClick={onBack} aria-label="Stäng">✕</button>
        {step === "intro" && (
          <>
            <div className="td-shop-speaker">📚 Mira</div>
            <p>Välkommen till bokbutiken, unga detektiv! Jag har hittat en mystisk text. Läs den noga — sedan ställer jag tre frågor. Klarar du dem får du något värdefullt.</p>
            <button className="td-btn td-btn-big" onClick={() => setStep("reading")}>Visa texten →</button>
          </>
        )}
        {step === "reading" && (
          <>
            <div className="td-shop-speaker">📖 Läs noga</div>
            <p className="td-reading-text">{READING_TEXT}</p>
            <button className="td-btn td-btn-big" onClick={() => setStep("q")}>Jag har läst klart →</button>
          </>
        )}
        {step === "q" && (
          <>
            <div className="td-shop-speaker">Fråga {qIndex + 1} av {READING_QUESTIONS.length}</div>
            <p>{READING_QUESTIONS[qIndex].q}</p>
            <div className="td-answer-list">
              {READING_QUESTIONS[qIndex].options.map((opt, i) => (
                <button key={i} className="td-btn td-answer-btn" onClick={() => answer(i)}>{opt}</button>
              ))}
            </div>
            {wrong && <p className="td-wrong-hint">Inte riktigt — läs texten igen och försök på nytt!</p>}
          </>
        )}
        {step === "done" && (
          <>
            <div className="td-shop-speaker">⭐ Bra jobbat!</div>
            <p>Du läste och förstod precis rätt! Här är din belöning — och en stjärna för Bokgränden.</p>
            <button className="td-btn td-btn-big" onClick={onComplete}>Ta emot belöningen ★</button>
          </>
        )}
      </div>
    </div>
  );
}

// --- HATTMAKAREN: ger en hatt ---
function HattaffarShop({ hatFound, onPickUpItem, setDialog, onBack }) {
  return (
    <div className="td-scene-image td-fade-in"
         style={{ backgroundImage: `url(${ASSETS.hattaffaren})` }}>
      <button className="td-shop-back td-btn td-btn-small" onClick={onBack}>← Ut på gatan</button>
      <button className="td-shop-figure td-shop-figure-btn"
        style={{ left: "6%", bottom: "0%", height: "86%", aspectRatio: "768 / 1914" }}
        aria-label="Prata med hattmakaren"
        onClick={() => setDialog({
          name: "Hattmakaren",
          portrait: ASSETS.hattmakareFull,
          lines: [
            "Goddag, goddag! Välkommen till stadens finaste hattaffär.",
            "Jag har sytt hattar åt kungar, sjökaptener och till och med en riktig upptäcktsresande.",
            "En detektiv utan hatt är som en bok utan ord! Låt mig se vad jag har åt dig...",
          ],
        })}>
        <img src={ASSETS.hattmakareFull} alt="Hattmakaren" />
      </button>
      <div className="td-shop-panel">
        <button className="td-dialog-close" onClick={onBack} aria-label="Stäng">✕</button>
        <div className="td-shop-speaker">🎩 Hattmakaren</div>
        {hatFound ? (
          <p>Den där hatten klär dig verkligen! En riktig detektiv-look.</p>
        ) : (
          <>
            <p>Aha, en blivande detektiv! Vet du vad varje stor detektiv behöver? En ordentlig hatt! Här — ta den här. Den är min present till dig.</p>
            <button className="td-btn td-btn-big" onClick={() => {
              onPickUpItem("reading:hat");
              setDialog("Du fick Den vackra hatten! Den ligger nu i väskan.");
            }}>Ta emot hatten 🎩</button>
          </>
        )}
      </div>
    </div>
  );
}

// --- VÄRLDSBUTIKEN: matcha föremål till världsdel ---
function VarldsaffarShop({ onBack, setDialog }) {
  const [started, setStarted] = useState(false);
  const [placed, setPlaced] = useState({});   // itemId -> regionId
  const [selected, setSelected] = useState(null);
  const [wrong, setWrong] = useState(null);

  const allDone = WORLD_ITEMS.every((it) => placed[it.id] === it.region);

  function tryPlace(regionId) {
    if (!selected) return;
    const item = WORLD_ITEMS.find((i) => i.id === selected);
    if (item.region === regionId) {
      setPlaced({ ...placed, [item.id]: regionId });
      setSelected(null);
      setWrong(null);
    } else {
      setWrong(regionId);
      setTimeout(() => setWrong(null), 600);
    }
  }

  const remaining = WORLD_ITEMS.filter((it) => !placed[it.id]);

  // INTRO: butiken med klickbar karta på väggen
  if (!started) {
    return (
      <div className="td-scene-image td-fade-in"
           style={{ backgroundImage: `url(${ASSETS.varldsaffaren})` }}>
        <button className="td-shop-back td-btn td-btn-small" onClick={onBack}>← Ut på gatan</button>
        <button className="td-shop-figure td-shop-figure-btn"
          style={{ left: "60%", bottom: "0%", height: "60%", aspectRatio: "656 / 1896" }}
          aria-label="Prata med världshandlerskan"
          onClick={() => setDialog({
            name: "Världshandlerskan",
            portrait: ASSETS.varldskvinnaFull,
            lines: [
              "Välkommen, lilla resenär! Stig på i min butik full av under.",
              "Jag har rest över hela jorden och samlat skatter — masker, statyer, vaser från fjärran länder.",
              "Men oj, etiketterna har ramlat av! Klicka på kartan så hjälps vi åt att lista ut varifrån sakerna kommer.",
            ],
          })}>
          <img src={ASSETS.varldskvinnaFull} alt="Världshandlerskan" />
        </button>

        {/* Klickbar världskarta på väggen */}
        <button className="td-shop-hotspot" style={{ left: "28%", top: "16%", width: "34%", height: "32%" }}
          onClick={() => setStarted(true)} aria-label="Undersök världskartan">
          <span className="td-shop-label" style={{ top: "-12%" }}>🗺️ Undersök kartan</span>
        </button>

        <div className="td-shop-panel" style={{ left: "4%", right: "auto", top: "auto", bottom: "6%", transform: "none" }}>
          <div className="td-shop-speaker">🧣 Världshandlerskan</div>
          <p>Välkommen, lilla detektiv! Etiketterna på mina föremål har ramlat av. Klicka på den stora <b>världskartan</b> på väggen, så hjälps vi åt att lista ut varifrån sakerna kommer.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="td-scene-image td-fade-in"
         style={{ backgroundImage: `url(${ASSETS.varldsaffaren})` }}>
      <button className="td-shop-back td-btn td-btn-small" onClick={onBack}>← Ut på gatan</button>
      <div className="td-world-game td-world-game-map">
        <div className="td-world-instructions">
          {allDone
            ? "🎉 Alla föremål på rätt plats!"
            : selected
              ? "Klicka på rätt världsdel på kartan!"
              : "🌍 Välj ett föremål och placera det på rätt världsdel på kartan."}
        </div>

        {/* KARTAN ÄR SPELPLANEN — riktiga kartan från butiken */}
        <div className="td-map-board" style={{ backgroundImage: `url(${ASSETS.varldskarta})` }}>
          {WORLD_REGIONS.map((r) => {
            const here = WORLD_ITEMS.find((it) => placed[it.id] === r.id);
            const isWrong = wrong === r.id;
            return (
              <button key={r.id}
                className={`td-map-zone ${here ? "td-map-filled" : ""} ${isWrong ? "td-map-wrong" : ""} ${selected ? "td-map-active" : ""}`}
                style={{
                  left: `${r.cx - r.rx}%`, top: `${r.cy - r.ry}%`,
                  width: `${r.rx * 2}%`, height: `${r.ry * 2}%`,
                }}
                onClick={() => tryPlace(r.id)}
                aria-label={r.name}>
                <span className="td-map-zone-label">{r.name}</span>
                {here && <span className="td-map-zone-icon">{here.icon}</span>}
              </button>
            );
          })}
        </div>

        {!allDone ? (
          <div className="td-world-items">
            {remaining.map((it) => (
              <button key={it.id}
                className={`td-world-item ${selected === it.id ? "td-world-item-sel" : ""}`}
                onClick={() => setSelected(it.id)}>
                <span className="td-world-item-icon">{it.icon}</span>
                <span>{it.name}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="td-world-done">
            <button className="td-btn td-btn-big" onClick={() => {
              setDialog("Världsbutikens ägare applåderar: 'Imponerande! Du kan din geografi.'");
              onBack();
            }}>Klar! ★</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// DEN GLÖMDA GROTTAN — vägval med ledtrådar + Professor Ugglemark
// ============================================================
function CaveScene({ completed, foundItems, setDialog, onPickUpItem, onStartMission }) {
  const [room, setRoom] = useState("ingang");   // ingang -> sjo -> pelare -> verkstad
  const [detour, setDetour] = useState(null);   // vilken fel-väg/återvändsgränd man tittar på
  const [riddleOpen, setRiddleOpen] = useState(false);
  const [riddleWrong, setRiddleWrong] = useState(false);

  // En liten återvändsgränd-ruta (fel väg) — visar text + ev. gömd pryl, sen backa
  function Detour({ title, text, item, itemText, bg, onBack }) {
    const found = item ? foundItems.includes(item) : true;
    // Om en bakgrundsbild finns visar vi den i helbild med en panel ovanpå.
    if (bg) {
      return (
        <div className="td-scene-image td-fade-in td-cave-detour-scene"
             style={{ backgroundImage: `url(${bg})` }}>
          <button className="td-shop-back td-btn td-btn-small" onClick={onBack}>← Backa tillbaka</button>
          <div className="td-cave-detour td-cave-detour-onimg">
            <div className="td-shop-speaker">{title}</div>
            <p>{text}</p>
            {item && !found && (
              <button className="td-btn td-btn-big" onClick={() => {
                onPickUpItem(item);
                setDialog(itemText);
              }}>Plocka upp {ITEM_DATA[item].icon}</button>
            )}
            {item && found && <p className="td-cave-found">Du har redan hittat det som fanns här.</p>}
          </div>
        </div>
      );
    }
    // Annars: vanlig textruta (för fel-vägar utan pryl).
    return (
      <div className="td-cave-detour">
        <button className="td-dialog-close" onClick={onBack} aria-label="Backa">✕</button>
        <div className="td-shop-speaker">{title}</div>
        <p>{text}</p>
        {item && !found && (
          <button className="td-btn td-btn-big" onClick={() => {
            onPickUpItem(item);
            setDialog(itemText);
          }}>Plocka upp {ITEM_DATA[item].icon}</button>
        )}
        {item && found && <p className="td-cave-found">Du har redan hittat det som fanns här.</p>}
        <button className="td-btn" onClick={onBack}>← Backa tillbaka</button>
      </div>
    );
  }

  // === RUM 1: INGÅNGEN ===
  if (room === "ingang") {
    return (
      <div className="td-scene-image td-fade-in"
           style={{ backgroundImage: `url(${ASSETS.grottaIngang})` }}>
        <div className="td-cave-clue">🪨 Inristat i stenen: <i>"Följ vattnets sus, inte vindens viskning."</i></div>

        {!detour && (
          <div className="td-cave-choices">
            <button className="td-btn td-cave-choice" onClick={() => setDetour("vind")}>← Vänster gång</button>
            <button className="td-btn td-cave-choice td-cave-choice-fwd" onClick={() => { setRoom("sjo"); setDetour(null); }}>↑ Rakt fram</button>
            <button className="td-btn td-cave-choice" onClick={() => setDetour("tyst")}>Höger gång →</button>
          </div>
        )}

        {detour === "vind" && (
          <Detour title="🦇 Vindens gång"
            bg={ASSETS.grottaVind}
            text="Du hör vinden vina och fladdermöss fladdra! Det här är fel väg — men något ligger och glittrar bland stenarna."
            item="cave:lantern"
            itemText="Du hittade Den slocknade lyktan bland stenarna! Den ligger nu i väskan."
            onBack={() => setDetour(null)} />
        )}
        {detour === "tyst" && (
          <Detour title="🤫 Den tysta gången"
            text="Det är becksvart och alldeles tyst här inne. Ingen vind, inget vatten. Det här leder ingenstans — ledtråden sa ju att du skulle följa vattnets sus."
            onBack={() => setDetour(null)} />
        )}
      </div>
    );
  }

  // === RUM 2: UNDERJORDISKA SJÖN ===
  if (room === "sjo") {
    return (
      <div className="td-scene-image td-fade-in"
           style={{ backgroundImage: `url(${ASSETS.grottaSjo})` }}>
        <button className="td-shop-back td-btn td-btn-small" onClick={() => { setRoom("ingang"); setDetour(null); }}>← Tillbaka</button>
        <div className="td-cave-clue">🪨 På bron står det ristat: <i>"Gå mot ljuset som aldrig slocknar."</i></div>

        {!detour && (
          <div className="td-cave-choices">
            <button className="td-btn td-cave-choice" onClick={() => setDetour("strand")}>← Längs stranden</button>
            <button className="td-btn td-cave-choice td-cave-choice-fwd" onClick={() => { setRoom("pelare"); setDetour(null); }}>↑ Mot ljuset</button>
            <button className="td-btn td-cave-choice" onClick={() => setDetour("morker")}>Över bron →</button>
          </div>
        )}

        {detour === "strand" && (
          <Detour title="✨ Strandkanten"
            bg={ASSETS.grottaStrand}
            text="Du följer den glittrande strandkanten. Vattnet lyser turkost — och där, mellan kristallerna, ligger något alldeles speciellt!"
            item="cave:crystal"
            itemText="Du hittade Den lysande kristallen! Den lyser svagt blått i väskan."
            onBack={() => setDetour(null)} />
        )}
        {detour === "morker" && (
          <Detour title="🌑 Bron in i mörkret"
            text="Bron leder ut i kompakt mörker. Inget ljus alls. Ledtråden sa ju att du skulle gå MOT ljuset, inte bort från det. Bäst att vända."
            onBack={() => setDetour(null)} />
        )}
      </div>
    );
  }

  // === RUM 3: STENPELARNAS SAL ===
  if (room === "pelare") {
    return (
      <div className="td-scene-image td-fade-in"
           style={{ backgroundImage: `url(${ASSETS.grottaPelare})` }}>
        <button className="td-shop-back td-btn td-btn-small" onClick={() => { setRoom("sjo"); setDetour(null); }}>← Tillbaka</button>
        <div className="td-cave-clue">🪨 <i>"Tre pelare, men bara en bär uppfinnarens märke — ett kugghjul."</i></div>

        {!detour && (
          <div className="td-cave-choices">
            <button className="td-btn td-cave-choice" onClick={() => setDetour("hjort")}>Pelaren med hjorten 🦌</button>
            <button className="td-btn td-cave-choice" onClick={() => setDetour("sol")}>Pelaren med solen ☀️</button>
            <button className="td-btn td-cave-choice td-cave-choice-fwd" onClick={() => { setRoom("verkstad"); setDetour(null); }}>Pelaren med kugghjulet ⚙️</button>
          </div>
        )}

        {detour === "hjort" && (
          <Detour title="🦌 Hjortens pelare"
            bg={ASSETS.grottaHjort}
            text="Den här pelaren visar djur och skogar — vacker, men inget kugghjul. Bakom den ligger dock något uråldrigt och halvt begravt i sten..."
            item="cave:fossil"
            itemText="Du hittade Det uråldriga fossilet bakom pelaren! Det ligger nu i väskan."
            onBack={() => setDetour(null)} />
        )}
        {detour === "sol" && (
          <Detour title="☀️ Solens pelare"
            text="Den här pelaren visar solen, månen och stjärnorna. Märket är vackert men det är ingen kugghjul. Leta efter uppfinnarens eget märke."
            onBack={() => setDetour(null)} />
        )}
      </div>
    );
  }

  // === RUM 4: UPPFINNARENS VERKSTAD ===
  const caveDone = completed;
  return (
    <div className="td-scene-image td-fade-in"
         style={{ backgroundImage: `url(${ASSETS.grottaVerkstad})` }}>
      <button className="td-shop-back td-btn td-btn-small" onClick={() => { setRoom("pelare"); setDetour(null); }}>← Tillbaka</button>

      <button className="td-shop-figure td-shop-figure-btn td-ugglemark-center"
        style={{ left: "50%", bottom: "2%", height: "74%", aspectRatio: "750 / 1932" }}
        aria-label="Prata med Professor Ugglemark"
        onClick={() => {
          if (caveDone) {
            setDialog({
              name: "Professor Ugglemark",
              portrait: ASSETS.ugglemarkFull,
              lines: [
                "Tack än en gång, lilla detektiv! Med den sista nyckeln kan tidsmaskinen äntligen lagas.",
                "Hälsa de andra i Tidsstaden från den gamle uppfinnaren!",
              ],
            });
          } else {
            setDialog({
              name: "Professor Ugglemark",
              portrait: ASSETS.ugglemarkFull,
              lines: [
                "Va? Besök?! Här nere? Det var länge sedan någon hittade ända hit...",
                "Jag är Professor Ugglemark. För många, många år sedan var jag med och byggde stadens allra första tidsmaskin.",
                "Men maskinen gick sönder, och en del av den var för farlig. Jag gömde mig här med den sista delen — för att skydda den.",
                "Främlingen i hamnen... ja, jag vet om honom. Han har letat efter mig i åratal. Men han ville ha delen av fel anledning.",
                "Du verkar vara en riktig liten detektiv. Men innan jag ger dig den sista nyckeln måste jag vara säker. Lös min gåta!",
              ],
              action: { label: "Jag är redo för gåtan →", onClick: () => { setDialog(null); setRiddleOpen(true); setRiddleWrong(false); } },
            });
          }
        }}>
        <img src={ASSETS.ugglemarkFull} alt="Professor Ugglemark" />
      </button>

      {riddleOpen && !caveDone && (
        <div className="td-cave-detour td-cave-riddle">
          <button className="td-dialog-close" onClick={() => setRiddleOpen(false)} aria-label="Stäng">✕</button>
          <div className="td-shop-speaker">🦉 Professor Ugglemarks gåta</div>
          <p className="td-riddle-text"><i>"Jag talar utan mun och hörs utan öron. Jag har ingen kropp, men jag vaknar när du ropar i grottan. Vad är jag?"</i></p>
          <div className="td-answer-list">
            <button className="td-btn td-answer-btn" onClick={() => setRiddleWrong(true)}>En fladdermus</button>
            <button className="td-btn td-answer-btn" onClick={() => {
              setRiddleOpen(false);
              setDialog({
                name: "Professor Ugglemark",
                portrait: ASSETS.ugglemarkFull,
                lines: [
                  "Ett EKO! Precis rätt! Du är sannerligen en klurig detektiv.",
                  "Här, ta den sista nyckeln. Nu kan tidsmaskinen äntligen lagas — på rätt sätt.",
                ],
                action: { label: "Ta emot den sista nyckeln ★", onClick: () => { setDialog(null); onStartMission(); } },
              });
            }}>Ett eko</button>
            <button className="td-btn td-answer-btn" onClick={() => setRiddleWrong(true)}>Vinden</button>
          </div>
          {riddleWrong && <p className="td-wrong-hint">Inte riktigt... Tänk på vad som svarar dig när du ropar i en grotta. Försök igen!</p>}
        </div>
      )}

      <div className="td-cave-clue td-cave-clue-final">
        {caveDone
          ? "⚙️ Professor Ugglemarks verkstad. Den sista nyckeln är din."
          : "⚙️ Du hittade Professor Ugglemarks gömda verkstad! Klicka på honom för att prata."}
      </div>
    </div>
  );
}

// Loopande bakgrundsvideo med mjuk cross-fade vid skarven (inget "hopp").
// Två kopior av videon spelar förskjutet; den ena tonar ut medan den andra tonar in.
function LoopingVideo({ src, poster, fade = 0.8 }) {
  const vidA = useRef(null);
  const vidB = useRef(null);
  const [front, setFront] = useState("a"); // vilken video som syns just nu

  useEffect(() => {
    const a = vidA.current;
    const b = vidB.current;
    if (!a || !b) return;
    a.play().catch(() => {});

    let raf;
    let switching = false;
    function tick() {
      const active = front === "a" ? a : b;
      const other = front === "a" ? b : a;
      if (active.duration && active.currentTime >= active.duration - fade && !switching) {
        // Starta den andra videon från början och börja tona över.
        switching = true;
        other.currentTime = 0;
        other.play().catch(() => {});
        setFront((f) => (f === "a" ? "b" : "a"));
      }
      // När den gamla videon tonat klart: pausa och nollställ så den är redo nästa varv.
      if (active.duration && active.currentTime >= active.duration - 0.05) {
        active.pause();
        active.currentTime = 0;
      }
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [front, fade]);

  return (
    <>
      <video ref={vidA} className="td-scene-video td-loop-video"
        src={src} poster={poster} muted playsInline aria-hidden="true"
        style={{ opacity: front === "a" ? 1 : 0, transition: `opacity ${fade}s linear` }} />
      <video ref={vidB} className="td-scene-video td-loop-video"
        src={src} muted playsInline aria-hidden="true"
        style={{ opacity: front === "b" ? 1 : 0, transition: `opacity ${fade}s linear` }} />
    </>
  );
}

// Stjärnbilder i stjärnvyn. Koordinater i procent av den stora stjärnkartan.
// stars = punkter (x,y i %), lines = vilka punkter som binds ihop (index-par).
const CONSTELLATIONS = [
  {
    id: "karlavagnen",
    name: "Karlavagnen",
    fact: "Karlavagnen är kanske den mest kända stjärnbilden på vår himmel. Dess sju stjärnor bildar en kastrull eller vagn!",
    stars: [
      { x: 22, y: 30 }, { x: 30, y: 28 }, { x: 38, y: 32 }, { x: 44, y: 40 },
      { x: 52, y: 38 }, { x: 58, y: 46 }, { x: 47, y: 50 },
    ],
    lines: [[0,1],[1,2],[2,3],[3,6],[6,0],[3,4],[4,5],[5,6]],
  },
  {
    id: "lillabjorn",
    name: "Lilla björn",
    fact: "Lilla björn ser ut som en mindre karlavagn. Längst ut i svansen sitter Polstjärnan!",
    stars: [
      { x: 70, y: 18 }, { x: 66, y: 26 }, { x: 62, y: 34 }, { x: 56, y: 40 },
      { x: 64, y: 44 }, { x: 72, y: 40 }, { x: 70, y: 30 },
    ],
    lines: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,1]],
  },
  {
    id: "polstjarnan",
    name: "Polstjärnan",
    fact: "Polstjärnan står nästan rakt i norr och rör sig nästan inte alls. Sjömän har hittat hem med den i tusentals år.",
    stars: [{ x: 70, y: 18 }],
    lines: [],
    single: true,
  },
];

// Andra himlaobjekt man kan hitta genom att panorera runt (x,y i % av stjärnkartan).
const SKY_OBJECTS = [
  { id: "komet", name: "Kometen", type: "comet", x: 10, y: 78 },
  { id: "saturnus", name: "Planeten Saturnus", type: "planet", x: 90, y: 70 },
  { id: "manen", name: "Månen", type: "moon", x: 92, y: 10 },
];

function ObservatoryScene({ foundItems, setDialog, onPickUpItem }) {
  const [stargazing, setStargazing] = useState(false);

  if (stargazing) {
    return <StarMapView onBack={() => setStargazing(false)} />;
  }

  return (
    <div className="td-scene-image td-fade-in"
         style={{ backgroundImage: `url(${ASSETS.observatoriumBg})` }}>
      {/* Stora stjärnkikaren — klickbar, leder till stjärnvyn */}
      <button className="td-telescope-btn"
        aria-label="Titta i stjärnkikaren"
        onClick={() => {
          setDialog({
            name: "Stjärnkikaren",
            lines: [
              "Den stora mässingskikaren pekar upp mot kupolens öppning, rakt mot natthimlen.",
              "Vill du titta i den? Kanske kan du hitta några stjärnbilder där uppe...",
            ],
            action: { label: "Titta i kikaren →", onClick: () => { setDialog(null); setStargazing(true); } },
          });
        }}>
        <span className="td-telescope-glow" />
      </button>

      <div className="td-cave-clue td-cave-clue-final td-clue-narrow">
        🔭 Du kom in i Observatoriet! Klicka på den stora stjärnkikaren.
      </div>
    </div>
  );
}

function StarMapView({ onBack }) {
  // Panorering (px) + zoom (skalfaktor). Större karta = mer att utforska.
  const [pan, setPan] = useState({ x: -400, y: -300 });
  const [zoom, setZoom] = useState(1);
  const [found, setFound] = useState([]);
  const [shootingStar, setShootingStar] = useState(null); // {key} när ett stjärnfall visas
  const dragRef = useRef(null);

  // Den stora himmelsytan i px (vid zoom 1). Större än förut.
  const MAP_W = 2600;
  const MAP_H = 1800;

  // Stjärnfall: dyker upp slumpvis var 4-9:e sekund och far förbi.
  useEffect(() => {
    let timer;
    function schedule() {
      const delay = 4000 + Math.random() * 5000;
      timer = setTimeout(() => {
        setShootingStar({ key: Date.now(), top: 10 + Math.random() * 50, left: 20 + Math.random() * 50 });
        setTimeout(() => setShootingStar(null), 1200);
        schedule();
      }, delay);
    }
    schedule();
    return () => clearTimeout(timer);
  }, []);

  // Begränsa panorering så man inte drar bort kartan (beror på zoom).
  function clampPan(nx, ny) {
    const maxX = 0;
    const maxY = 0;
    const minX = -(MAP_W * zoom - 600);
    const minY = -(MAP_H * zoom - 500);
    return {
      x: Math.max(minX, Math.min(maxX, nx)),
      y: Math.max(minY, Math.min(maxY, ny)),
    };
  }

  function startDrag(e) {
    const point = e.touches ? e.touches[0] : e;
    dragRef.current = { startX: point.clientX, startY: point.clientY, panX: pan.x, panY: pan.y };
  }
  function onDrag(e) {
    if (!dragRef.current) return;
    const point = e.touches ? e.touches[0] : e;
    const dx = point.clientX - dragRef.current.startX;
    const dy = point.clientY - dragRef.current.startY;
    setPan(clampPan(dragRef.current.panX + dx, dragRef.current.panY + dy));
  }
  function endDrag() { dragRef.current = null; }

  function zoomBy(factor) {
    setZoom((z) => {
      const nz = Math.max(0.7, Math.min(2.2, z * factor));
      return nz;
    });
  }

  function clickConstellation(c) {
    if (c.single) return;
    if (!found.includes(c.id)) setFound((f) => [...f, c.id]);
  }
  function clickObject(o) {
    if (!found.includes(o.id)) setFound((f) => [...f, o.id]);
  }

  const allFound = CONSTELLATIONS.filter((c) => !c.single).every((c) => found.includes(c.id))
    && SKY_OBJECTS.every((o) => found.includes(o.id));

  return (
    <div className="td-starmap-wrap">
      <div className="td-telescope-lens">
        <div
          className="td-starmap-pan"
          style={{
            width: `${MAP_W}px`, height: `${MAP_H}px`,
            backgroundImage: `url(${ASSETS.stjarnhimmel})`,
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "top left",
          }}
          onMouseDown={startDrag} onMouseMove={onDrag} onMouseUp={endDrag} onMouseLeave={endDrag}
          onTouchStart={startDrag} onTouchMove={onDrag} onTouchEnd={endDrag}
        >
          {/* Stjärnbilder + objekt ritas i SVG som täcker hela den stora ytan */}
          <svg className="td-constellation-layer" viewBox="0 0 1000 700" preserveAspectRatio="none"
               style={{ width: `${MAP_W}px`, height: `${MAP_H}px` }}>
            {CONSTELLATIONS.map((c) => {
              if (c.single) return null;
              const lit = found.includes(c.id);
              return (
                <g key={c.id} className={`td-constellation ${lit ? "td-constellation-lit" : ""}`}
                   onClick={(e) => { e.stopPropagation(); clickConstellation(c); }}>
                  {c.lines.map(([a, b], i) => (
                    <line key={i}
                      x1={c.stars[a].x * 10} y1={c.stars[a].y * 7}
                      x2={c.stars[b].x * 10} y2={c.stars[b].y * 7}
                      className="td-constellation-line" />
                  ))}
                  {c.stars.map((s, i) => (
                    <circle key={i} cx={s.x * 10} cy={s.y * 7} r={lit ? 6 : 4}
                      className="td-constellation-star" />
                  ))}
                </g>
              );
            })}

            {SKY_OBJECTS.map((o) => {
              const cx = o.x * 10, cy = o.y * 7;
              const lit = found.includes(o.id);
              return (
                <g key={o.id} className={`td-sky-object ${lit ? "td-sky-object-lit" : ""}`}
                   onClick={(e) => { e.stopPropagation(); clickObject(o); }}>
                  {o.type === "comet" && (
                    <>
                      <line x1={cx} y1={cy} x2={cx - 50} y2={cy - 28} className="td-comet-tail" />
                      <line x1={cx} y1={cy} x2={cx - 44} y2={cy - 14} className="td-comet-tail" />
                      <circle cx={cx} cy={cy} r="7" className="td-comet-head" />
                    </>
                  )}
                  {o.type === "planet" && (
                    <>
                      <ellipse cx={cx} cy={cy} rx="22" ry="7" className="td-planet-ring" />
                      <circle cx={cx} cy={cy} r="11" className="td-planet-body" />
                    </>
                  )}
                  {o.type === "moon" && (
                    <>
                      <circle cx={cx} cy={cy} r="16" className="td-moon-body" />
                      <circle cx={cx + 6} cy={cy - 3} r="14" className="td-moon-shadow" />
                    </>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Stjärnfall — far diagonalt över linsen då och då */}
        {shootingStar && (
          <div key={shootingStar.key} className="td-shooting-star"
               style={{ top: `${shootingStar.top}%`, left: `${shootingStar.left}%` }} />
        )}
      </div>

      {/* Zoom-knappar */}
      <div className="td-zoom-controls">
        <button className="td-zoom-btn" onClick={() => zoomBy(1.25)} aria-label="Zooma in">+</button>
        <button className="td-zoom-btn" onClick={() => zoomBy(0.8)} aria-label="Zooma ut">−</button>
      </div>

      <div className="td-starmap-names">
        {found.map((id) => {
          const c = CONSTELLATIONS.find((x) => x.id === id);
          if (c) return <span key={id} className="td-starmap-name">✦ {c.name}</span>;
          const o = SKY_OBJECTS.find((x) => x.id === id);
          if (o) return <span key={id} className="td-starmap-name">✦ {o.name}</span>;
          return null;
        })}
        {found.includes("lillabjorn") && <span className="td-starmap-name">✦ Polstjärnan</span>}
      </div>

      <div className="td-cave-clue td-cave-clue-final td-clue-narrow td-starmap-hint">
        {allFound
          ? "✨ Du hittade allt på himlen! Bra jobbat, stjärnskådare."
          : "Dra för att titta runt. Klicka på stjärnbilder och annat du hittar på himlen!"}
      </div>

      <button className="td-shop-back td-btn td-btn-small td-starmap-back" onClick={onBack}>← Tillbaka</button>
    </div>
  );
}

function ClockTowerScene({ completed, setDialog, onStartMission }) {
  const [playing, setPlaying] = useState(false);

  // Klockspelet visas när man valt att hjälpa Tickelton (eller om det redan är klart).
  if (playing || completed.clock) {
    return (
      <div className="td-scene-image td-scene-video-wrap">
        <video className="td-scene-video" src={ASSETS.klocktornVideo} poster={ASSETS.klocktornBg}
          autoPlay loop muted playsInline aria-hidden="true" />
        {!completed.clock && (
          <button className="td-shop-back td-btn td-btn-small" onClick={() => setPlaying(false)}>← Tillbaka</button>
        )}
        <div className="td-clocktower-panel">
          <ClockMission
            alreadyDone={completed.clock}
            onComplete={onStartMission}
            onBack={() => setPlaying(false)}
          />
        </div>
      </div>
    );
  }

  // Annars: tornrummet med Tickelton stående, klickbar.
  return (
    <div className="td-scene-image td-scene-video-wrap">
      <video className="td-scene-video" src={ASSETS.klocktornVideo} poster={ASSETS.klocktornBg}
        autoPlay loop muted playsInline aria-hidden="true" />
      <button className="td-shop-figure td-shop-figure-btn td-ugglemark-center"
        style={{ left: "35%", bottom: "-19%", height: "55%", aspectRatio: "773 / 1655" }}
        aria-label="Prata med Professor Tickelton"
        onClick={() => {
          setDialog({
            name: "Professor Tickelton",
            portrait: ASSETS.tickeltonFull,
            lines: [
              "Åh, en besökare! Välkommen upp i klocktornet, lilla detektiv.",
              "Jag är Professor Tickelton, stadens klockmakare. Men jag har ett stort problem...",
              "Alla mina klockor har hamnat i oordning! Ingen visar rätt tid längre, och den stora tornklockan har slutat slå.",
              "Kan du hjälpa mig att ställa klockorna rätt? Då vaknar tornet till liv igen!",
            ],
            action: { label: "Jag hjälper dig! →", onClick: () => { setDialog(null); setPlaying(true); } },
          });
        }}>
        <img src={ASSETS.tickeltonFull} alt="Professor Tickelton" />
      </button>

      <div className="td-cave-clue td-cave-clue-final td-clue-narrow">
        🕰️ Du kom upp i klocktornet! Klicka på Professor Tickelton för att prata.
      </div>
    </div>
  );
}

function ComingSoonScene({ title, onStartMission }) {
  return (
    <div className="td-coming-soon">
      <div className="td-coming-soon-card">
        <div className="td-stamp">På väg...</div>
        <h2 className="td-h2">{title}</h2>
        <p>Interiören för den här platsen håller på att byggas. Du kan starta uppdraget direkt så länge.</p>
        <button className="td-btn td-btn-big" onClick={onStartMission}>▸ Starta uppdraget</button>
      </div>
    </div>
  );
}

function MissionOverlay({ hotspot, grand, onClose, children }) {
  const characterSrc = hotspot?.character ? ASSETS[hotspot.character] : null;
  return (
    <div className="td-overlay">
      <div className={`td-overlay-card ${grand ? "td-overlay-grand" : ""}`}>
        {hotspot && (
          <div className="td-overlay-header">
            <div className="td-overlay-host">
              {characterSrc && (
                <div className="td-overlay-host-img"><img src={characterSrc} alt={hotspot.characterName} /></div>
              )}
              <div>
                <h2 className="td-h2">{hotspot.title}</h2>
                {hotspot.characterName && (
                  <div className="td-overlay-host-name">med {hotspot.characterName}</div>
                )}
              </div>
            </div>
            <button className="td-btn td-btn-small" onClick={onClose}>✕ Stäng</button>
          </div>
        )}
        <div className="td-overlay-body">{children}</div>
      </div>
    </div>
  );
}

function MachinePuzzle({ alreadyDone, onComplete, onBack }) {
  const round = useMemo(() => buildPuzzleRound(), []);
  const totalSteps = round.length;
  const [step, setStep] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [solvedSteps, setSolvedSteps] = useState(new Array(totalSteps).fill(false));
  const current = round[step];
  const allSolved = solvedSteps.every(Boolean);

  function pick(choiceId) {
    if (choiceId === current.answer) {
      const newSolved = [...solvedSteps];
      newSolved[step] = true;
      setSolvedSteps(newSolved);
      const remark = randomFrom(KLONK_PROGRESS_REMARKS);
      const finalText = step === totalSteps - 1
        ? "Sista kugghjulet snurrar! Maskinen lever igen!"
        : remark;
      setFeedback({ type: "success", text: finalText });
    } else {
      setFeedback({ type: "error", text: `Inte riktigt. Ledtråd: ${current.hint}` });
    }
  }

  function nextStep() {
    setFeedback(null);
    if (step < totalSteps - 1) setStep(step + 1);
    else if (!alreadyDone) onComplete();
  }

  if (allSolved && feedback?.type === "success" && step === totalSteps - 1) {
    return (
      <div className="td-puzzle-complete">
        <GearProgressRow total={totalSteps} solved={totalSteps} active={-1} />
        <p className="td-mission-text">
          <em>"Maskinen lever igen!"</em> Herr Klonk klappar händerna och torkar
          en oljedroppe från mustaschen. Alla {totalSteps} kugghjul snurrar i takt —
          maskinen är lagad!
        </p>
        <button className="td-btn td-btn-gold td-btn-big" onClick={onBack}>
          ★ Tillbaka till verkstaden
        </button>
      </div>
    );
  }

  return (
    <>
      <GearProgressRow total={totalSteps} solved={solvedSteps.filter(Boolean).length} active={step} />
      <p className="td-puzzle-step-label">Pussel {step + 1} av {totalSteps}</p>
      <p className="td-mission-text">
        <em>{stepIntro(step)}</em>
        {current.text}
      </p>
      <PuzzleSequence sequence={current.sequence} />
      <div className="td-choices td-choices-row">
        {current.choices.map((cId) => (
          <button key={cId} className="td-choice td-choice-visual"
                  onClick={() => pick(cId)}>
            <PuzzleItem itemId={cId} small />
            <span>{labelForItem(cId)}</span>
          </button>
        ))}
      </div>
      {feedback && (
        <div className={`td-feedback td-feedback-${feedback.type}`}>
          <p>{feedback.text}</p>
          {feedback.type === "success" && (
            <button className="td-btn td-btn-gold" onClick={nextStep}>
              {step < totalSteps - 1 ? "→ Nästa pussel" : "★ Avsluta"}
            </button>
          )}
        </div>
      )}
    </>
  );
}

function stepIntro(step) {
  const intros = [
    `"Vi börjar enkelt — färger."`,
    `"Bra! Nu med tre färger."`,
    `"Storlekar nästa..."`,
    `"Vad sägs om former?"`,
    `"Nu räknar vi prickar."`,
    `"Färger OCH former tillsammans."`,
    `"Sista pusslet — det här går fram OCH tillbaka."`,
  ];
  return intros[step] || `"Pussel ${step + 1}!"`;
}

function GearProgressRow({ total, solved, active }) {
  return (
    <div className="td-puzzle-progress">
      {[...Array(total)].map((_, i) => (
        <GearIndicator key={i} solved={i < solved} active={i === active} />
      ))}
    </div>
  );
}

function GearIndicator({ solved, active }) {
  return (
    <div className={`td-gear-indicator ${solved ? "solved" : ""} ${active ? "active" : ""}`}>
      <svg viewBox="0 0 40 40">
        {[...Array(8)].map((_, i) => (
          <rect key={i} x="18" y="2" width="4" height="6"
            fill={solved ? "#fdc94d" : "#a08878"}
            stroke="#3a2a17" strokeWidth="1.2"
            transform={`rotate(${i * 45} 20 20)`} />
        ))}
        <circle cx="20" cy="20" r="12"
          fill={solved ? "#fdc94d" : "#a08878"}
          stroke="#3a2a17" strokeWidth="1.5" />
        <circle cx="20" cy="20" r="5" fill="#3a2a17" />
      </svg>
    </div>
  );
}

function PuzzleSequence({ sequence }) {
  return (
    <div className="td-puzzle-sequence">
      {sequence.map((itemId, i) => (
        <React.Fragment key={i}>
          <PuzzleItem itemId={itemId} />
          {i < sequence.length - 1 && <span className="td-sequence-arrow">→</span>}
        </React.Fragment>
      ))}
    </div>
  );
}

function PuzzleItem({ itemId, small }) {
  const sz = small ? 32 : 48;
  if (itemId === "mystery") {
    return (
      <span className="td-puzzle-item td-puzzle-item-mystery"
            style={{ width: sz, height: sz, fontSize: sz * 0.5 }}>?</span>
    );
  }
  const [kind, value] = itemId.split(":");
  if (kind === "color") {
    const colors = { red: "#d94c3d", blue: "#3a6ea8", green: "#5fa860", yellow: "#f0c040" };
    return (
      <span className="td-puzzle-item"
            style={{ width: sz, height: sz, background: colors[value], borderRadius: "50%" }} />
    );
  }
  if (kind === "size") {
    const sizeMap = { small: 0.5, medium: 0.75, large: 1.0 };
    const ratio = sizeMap[value];
    return (
      <span className="td-puzzle-item-wrap" style={{ width: sz, height: sz }}>
        <span className="td-puzzle-item"
              style={{ width: sz * ratio, height: sz * ratio,
                       background: "#3a6ea8", borderRadius: "50%" }} />
      </span>
    );
  }
  if (kind === "shape") {
    return (
      <span className="td-puzzle-item-shape" style={{ width: sz, height: sz }}>
        <ShapeSvg shape={value} size={sz} color="#d94c3d" />
      </span>
    );
  }
  if (kind === "dots") {
    return <DotsItem count={parseInt(value, 10)} size={sz} />;
  }
  if (kind === "cs") {
    const [colorName, shapeName] = value.split("-");
    const colors = { red: "#d94c3d", blue: "#3a6ea8", green: "#5fa860", yellow: "#f0c040" };
    return (
      <span className="td-puzzle-item-shape" style={{ width: sz, height: sz }}>
        <ShapeSvg shape={shapeName} size={sz} color={colors[colorName]} />
      </span>
    );
  }
  return null;
}

function ShapeSvg({ shape, size, color }) {
  const stroke = "#3a2a17"; const strokeW = 2.5;
  if (shape === "triangle") {
    return (
      <svg viewBox="0 0 40 40" width={size} height={size}>
        <polygon points="20,5 36,35 4,35" fill={color}
                 stroke={stroke} strokeWidth={strokeW} strokeLinejoin="round" />
      </svg>
    );
  }
  if (shape === "circle") {
    return (
      <svg viewBox="0 0 40 40" width={size} height={size}>
        <circle cx="20" cy="20" r="16" fill={color} stroke={stroke} strokeWidth={strokeW} />
      </svg>
    );
  }
  if (shape === "square") {
    return (
      <svg viewBox="0 0 40 40" width={size} height={size}>
        <rect x="6" y="6" width="28" height="28" fill={color}
              stroke={stroke} strokeWidth={strokeW} strokeLinejoin="round" />
      </svg>
    );
  }
  return null;
}

function DotsItem({ count, size }) {
  const positions = {
    1: [[20, 20]],
    2: [[12, 20], [28, 20]],
    3: [[20, 10], [12, 28], [28, 28]],
    4: [[12, 12], [28, 12], [12, 28], [28, 28]],
    5: [[12, 12], [28, 12], [20, 20], [12, 28], [28, 28]],
    6: [[10, 12], [20, 12], [30, 12], [10, 28], [20, 28], [30, 28]],
    7: [[10, 10], [20, 10], [30, 10], [20, 20], [10, 30], [20, 30], [30, 30]],
    8: [[10, 10], [20, 10], [30, 10], [10, 20], [30, 20], [10, 30], [20, 30], [30, 30]],
  };
  const dots = positions[count] || [];
  return (
    <span className="td-puzzle-item-shape" style={{ width: size, height: size }}>
      <svg viewBox="0 0 40 40" width={size} height={size}>
        <circle cx="20" cy="20" r="18" fill="#fdf3d8" stroke="#3a2a17" strokeWidth="2.5" />
        {dots.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="2.5" fill="#3a2a17" />
        ))}
      </svg>
    </span>
  );
}

function labelForItem(itemId) {
  if (itemId === "mystery") return "?";
  const [kind, value] = itemId.split(":");
  if (kind === "color") {
    const names = { red: "röd", blue: "blå", green: "grön", yellow: "gul" };
    return names[value] || value;
  }
  if (kind === "size") {
    const names = { small: "liten", medium: "mellan", large: "stor" };
    return names[value] || value;
  }
  if (kind === "shape") {
    const names = { triangle: "triangel", circle: "cirkel", square: "fyrkant" };
    return names[value] || value;
  }
  if (kind === "dots") {
    const n = parseInt(value, 10);
    return `${n} ${n === 1 ? "prick" : "prickar"}`;
  }
  if (kind === "cs") {
    const [colorName, shapeName] = value.split("-");
    const colors = { red: "röd", blue: "blå", green: "grön", yellow: "gul" };
    const shapes = { triangle: "triangel", circle: "cirkel", square: "fyrkant" };
    return `${colors[colorName]} ${shapes[shapeName]}`;
  }
  return itemId;
}

function ReadingMission({ alreadyDone, onComplete, onBack }) {
  const [feedback, setFeedback] = useState(null);
  const choices = [
    { id: "a", text: "Den blå väskan på bordet", correct: false },
    { id: "b", text: "Den röda väskan bredvid katten", correct: true },
    { id: "c", text: "Den gröna hatten på stolen", correct: false },
  ];
  function pick(c) {
    if (c.correct) {
      setFeedback({ type: "success", text: "Bra spanat! Du hittade ledtråden." });
      if (!alreadyDone) onComplete();
    } else {
      setFeedback({ type: "error", text: "Nästan! Ledtråd: titta efter orden röd, väska och katt." });
    }
  }
  return (
    <>
      <p className="td-mission-text">
        <em>"Hjälp mig hitta vad detektiven tappat!"</em> Mira håller upp
        ledtråden: Hitta den <strong>röda väskan</strong> bredvid <strong>katten</strong>.
      </p>
      <div className="td-choices">
        {choices.map((c) => (
          <button key={c.id} className="td-choice" onClick={() => pick(c)}>{c.text}</button>
        ))}
      </div>
      <Feedback feedback={feedback} done={alreadyDone || feedback?.type === "success"} onBack={onBack} />
    </>
  );
}

function ClockMission({ alreadyDone, onComplete, onBack }) {
  // Tre rundor: bara hela timmar och halvtimmar (lagom för 8 år).
  // targetHour = timmen 1-12, targetHalf = true om det är "halv".
  const ROUNDS = [
    { text: "Ugglan säger att tåget går klockan tre. Ställ den stora klockan på", label: "klockan tre", hour: 3, half: false },
    { text: "Bagaren öppnar halv sju på morgonen. Ställ klockan på", label: "halv sju", hour: 7, half: true },
    { text: "Sista uppdraget! Marknaden börjar klockan halv ett. Ställ klockan på", label: "halv ett", hour: 1, half: true },
  ];

  const [round, setRound] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [allDone, setAllDone] = useState(alreadyDone);

  // Visarnas läge i "steg". Minutvisaren har bara 2 lägen: 0 (heltimme) och 6 (halv).
  // Timvisaren har 12 lägen (1-12). Vi börjar på en neutral utgångstid.
  const [handHour, setHandHour] = useState(12); // 1..12
  const [handHalf, setHandHalf] = useState(false); // false = :00, true = :30

  const target = ROUNDS[round];

  // Rätt om timvisaren pekar på rätt timme OCH minutvisaren på rätt hel/halv.
  function check() {
    const correct = handHour === target.hour && handHalf === target.half;
    if (correct) {
      if (round < ROUNDS.length - 1) {
        setFeedback({ type: "success", text: "Rätt! Nästa klocka..." });
      } else {
        setFeedback({ type: "success", text: "Alla klockor stämmer! Hör — tornklockan börjar slå igen! 🔔" });
        setAllDone(true);
        if (!alreadyDone) onComplete();
      }
    } else {
      setFeedback({ type: "error", text: "Inte riktigt. Den korta visaren pekar på timmen, den långa på 12 (hel) eller 6 (halv). Försök igen!" });
    }
  }

  function nextRound() {
    setRound((r) => r + 1);
    setFeedback(null);
    setHandHour(12);
    setHandHalf(false);
  }

  if (alreadyDone || allDone) {
    return (
      <div className="td-clock-panel">
        <p className="td-mission-text">
          <em>"Tack, lilla detektiv!"</em> Professor Tickelton stryker sig om
          mustaschen. Tornets klocka tickar nu i takt igen.
        </p>
        <DraggableClock hour={target.hour} half={target.half} onChange={() => {}} locked />
        <Feedback feedback={{ type: "success", text: "Klocktornet är löst." }} done onBack={onBack} />
      </div>
    );
  }

  const showNext = feedback?.type === "success" && round < ROUNDS.length - 1;

  return (
    <div className="td-clock-panel">
      <p className="td-mission-text">
        <em>"Mina klockor är i oordning!"</em> {target.text}{" "}
        <strong>{target.label}</strong>.
      </p>
      <p className="td-clock-hint">Dra visarna med fingret! Liten visare = timme, stor visare = hel eller halv.</p>
      <DraggableClock
        hour={handHour}
        half={handHalf}
        onChange={(h, half) => { setHandHour(h); setHandHalf(half); }}
      />
      <div className="td-clock-readout">
        Klockan visar nu: <strong>{handHour}:{handHalf ? "30" : "00"}</strong>
      </div>
      {!showNext && (
        <div className="td-choices">
          <button className="td-choice td-choice-check" onClick={check}>Klart! Kolla klockan</button>
        </div>
      )}
      {feedback && (
        <div className={`td-feedback td-feedback-${feedback.type}`}>
          <p>{feedback.text}</p>
          {showNext && <button className="td-btn td-btn-gold" onClick={nextRound}>Nästa klocka →</button>}
        </div>
      )}
    </div>
  );
}

// Interaktiv klocka: dra tim- och minutvisaren. Minutvisaren snäpper till hel/halv.
function DraggableClock({ hour, half, onChange, locked }) {
  const svgRef = useRef(null);
  const [dragging, setDragging] = useState(null); // "hour" | "minute" | null

  // Räkna ut vinkeln (i grader, 12 = 0°) från en pekpunkt relativt klockans mitt.
  function angleFromEvent(e) {
    const svg = svgRef.current;
    if (!svg) return 0;
    const rect = svg.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const point = e.touches ? e.touches[0] : e;
    const dx = point.clientX - cx;
    const dy = point.clientY - cy;
    let deg = (Math.atan2(dy, dx) * 180) / Math.PI + 90; // 0° rakt upp
    if (deg < 0) deg += 360;
    return deg;
  }

  function handleMove(e) {
    if (!dragging || locked) return;
    e.preventDefault();
    const deg = angleFromEvent(e);
    if (dragging === "hour") {
      // Närmaste hela timme: 30° per timme.
      let h = Math.round(deg / 30) % 12;
      if (h === 0) h = 12;
      onChange(h, half);
    } else {
      // Minutvisaren snäpper bara till 12 (hel) eller 6 (halv).
      const newHalf = deg > 90 && deg < 270;
      onChange(hour, newHalf);
    }
  }

  function endDrag() { setDragging(null); }

  // Vinklar för att rita visarna.
  const minuteDeg = half ? 180 : 0;
  const hourDeg = (hour % 12) * 30 + (half ? 15 : 0);
  const rad = (d) => ((d - 90) * Math.PI) / 180;
  const hourX = 100 + Math.cos(rad(hourDeg)) * 45;
  const hourY = 100 + Math.sin(rad(hourDeg)) * 45;
  const minX = 100 + Math.cos(rad(minuteDeg)) * 65;
  const minY = 100 + Math.sin(rad(minuteDeg)) * 65;

  return (
    <svg
      ref={svgRef}
      className={`td-clock td-clock-draggable ${locked ? "td-clock-locked" : ""}`}
      viewBox="0 0 200 200"
      onMouseMove={handleMove}
      onMouseUp={endDrag}
      onMouseLeave={endDrag}
      onTouchMove={handleMove}
      onTouchEnd={endDrag}
    >
      <circle cx="100" cy="100" r="92" fill="#fdf3d8" stroke="#3a2a17" strokeWidth="5" />
      <circle cx="100" cy="100" r="84" fill="none" stroke="#3a2a17" strokeWidth="1.5" />
      {[...Array(12)].map((_, i) => {
        const angle = (i / 12) * 2 * Math.PI - Math.PI / 2;
        const x1 = 100 + Math.cos(angle) * 75;
        const y1 = 100 + Math.sin(angle) * 75;
        const x2 = 100 + Math.cos(angle) * 82;
        const y2 = 100 + Math.sin(angle) * 82;
        const tx = 100 + Math.cos(angle) * 65;
        const ty = 100 + Math.sin(angle) * 65;
        return (
          <g key={i}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#3a2a17" strokeWidth="3" />
            <text x={tx} y={ty + 5} textAnchor="middle" fontSize="14" fontWeight="bold" fill="#3a2a17">
              {i === 0 ? 12 : i}
            </text>
          </g>
        );
      })}
      {/* Timvisaren (kort, brun) — dragbar */}
      <line x1="100" y1="100" x2={hourX} y2={hourY}
        stroke="#3a2a17" strokeWidth="6" strokeLinecap="round" />
      <circle cx={hourX} cy={hourY} r="14" fill="#3a2a17" opacity={locked ? 0 : 0.001}
        style={{ cursor: locked ? "default" : "grab" }}
        onMouseDown={() => !locked && setDragging("hour")}
        onTouchStart={() => !locked && setDragging("hour")} />
      {/* Minutvisaren (lång, röd) — dragbar */}
      <line x1="100" y1="100" x2={minX} y2={minY}
        stroke="#c0392b" strokeWidth="4" strokeLinecap="round" />
      <circle cx={minX} cy={minY} r="14" fill="#c0392b" opacity={locked ? 0 : 0.001}
        style={{ cursor: locked ? "default" : "grab" }}
        onMouseDown={() => !locked && setDragging("minute")}
        onTouchStart={() => !locked && setDragging("minute")} />
      <circle cx="100" cy="100" r="5" fill="#3a2a17" />
    </svg>
  );
}

function AnalogClock({ hour, minute }) {
  const minuteAngle = (minute / 60) * 360;
  const hourAngle = ((hour % 12) / 12) * 360 + (minute / 60) * 30;
  return (
    <svg className="td-clock" viewBox="0 0 200 200" aria-hidden="true">
      <circle cx="100" cy="100" r="92" fill="#fdf3d8" stroke="#3a2a17" strokeWidth="5" />
      <circle cx="100" cy="100" r="84" fill="none" stroke="#3a2a17" strokeWidth="1.5" />
      {[...Array(12)].map((_, i) => {
        const angle = (i / 12) * 2 * Math.PI - Math.PI / 2;
        const x1 = 100 + Math.cos(angle) * 75;
        const y1 = 100 + Math.sin(angle) * 75;
        const x2 = 100 + Math.cos(angle) * 82;
        const y2 = 100 + Math.sin(angle) * 82;
        const tx = 100 + Math.cos(angle) * 65;
        const ty = 100 + Math.sin(angle) * 65;
        return (
          <g key={i}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#3a2a17" strokeWidth="3" />
            <text x={tx} y={ty + 5} textAnchor="middle" fontSize="14" fontWeight="bold" fill="#3a2a17">
              {i === 0 ? 12 : i}
            </text>
          </g>
        );
      })}
      <line x1="100" y1="100"
        x2={100 + Math.cos(((hourAngle - 90) * Math.PI) / 180) * 45}
        y2={100 + Math.sin(((hourAngle - 90) * Math.PI) / 180) * 45}
        stroke="#3a2a17" strokeWidth="6" strokeLinecap="round" />
      <line x1="100" y1="100"
        x2={100 + Math.cos(((minuteAngle - 90) * Math.PI) / 180) * 65}
        y2={100 + Math.sin(((minuteAngle - 90) * Math.PI) / 180) * 65}
        stroke="#c0392b" strokeWidth="4" strokeLinecap="round" />
      <circle cx="100" cy="100" r="5" fill="#3a2a17" />
    </svg>
  );
}

// CityView — ramen runt Tidsstaden (topbar + scen + dialog)
function CityView({ foundItems, dialog, setDialog, onPickUpItem, onEnterMachine, onBack }) {
  return (
    <div className="td-interior td-fade-in">
      <div className="td-interior-topbar">
        <button className="td-btn td-btn-small" onClick={onBack}>← Tillbaka till kartan</button>
        <div className="td-interior-title-banner"><span>Tidsstaden</span></div>
        <div style={{ width: "150px" }} />
      </div>
      <div className="td-interior-stage">
        <TidsstadenScene
          foundItems={foundItems}
          setDialog={setDialog}
          onPickUpItem={onPickUpItem}
          onEnterMachine={onEnterMachine}
        />
      </div>
      {dialog && <DialogBubble dialog={dialog} onClose={() => setDialog(null)} />}
    </div>
  );
}

// ============================================================
// TIDSSTADEN — finalens utforskningslager (torg, brunn, butiker)
// ============================================================
function TidsstadenScene({ foundItems, setDialog, onPickUpItem, onEnterMachine }) {
  const [sub, setSub] = useState(null); // null = torg, annars "urmakare"/"leksak"/"brunn"

  if (sub === "urmakare") {
    return <UrmakareShop foundItems={foundItems}
      onPickUpItem={onPickUpItem} setDialog={setDialog} onBack={() => setSub(null)} />;
  }
  if (sub === "leksak") {
    return <LeksaksbodShop foundItems={foundItems}
      onPickUpItem={onPickUpItem} setDialog={setDialog} onBack={() => setSub(null)} />;
  }
  if (sub === "brunn") {
    return <BrunnView found={foundItems.includes("city:coin")}
      onPickUpItem={onPickUpItem} setDialog={setDialog} onBack={() => setSub(null)} />;
  }
  if (sub === "torn") {
    return <TornView featherFound={foundItems.includes("city:feather")}
      onPickUpItem={onPickUpItem} setDialog={setDialog} onBack={() => setSub(null)} />;
  }

  // TORGET
  return (
    <div className="td-scene-image td-fade-in"
         style={{ backgroundImage: `url(${ASSETS.tidsstadenTorg})` }}>
      {/* Urmakaren — vänster */}
      <button className="td-shop-hotspot" style={{ left: "8%", top: "34%", width: "16%", height: "42%" }}
        onClick={() => setSub("urmakare")} aria-label="Gå in hos urmakaren">
        <span className="td-shop-label" style={{ top: "-8%" }}>⏰ Urmakaren</span>
      </button>
      {/* Leksaksboden — höger */}
      <button className="td-shop-hotspot" style={{ left: "76%", top: "34%", width: "16%", height: "42%" }}
        onClick={() => setSub("leksak")} aria-label="Gå in i leksaksboden">
        <span className="td-shop-label" style={{ top: "-8%" }}>🧸 Leksaksboden</span>
      </button>
      {/* Brunnen — nere i mitten */}
      <button className="td-shop-hotspot" style={{ left: "40%", top: "70%", width: "20%", height: "24%" }}
        onClick={() => setSub("brunn")} aria-label="Titta ner i brunnen">
        <span className="td-shop-label" style={{ top: "-14%" }}>🪣 Brunnen</span>
      </button>
      {/* Tidsmaskinen — i mitten, leder till finalen */}
      <button className="td-machine-hotspot" style={{ left: "42%", top: "30%", width: "16%", height: "34%" }}
        onClick={() => {
          setDialog({
            name: "Tidsmaskinen",
            lines: [
              "Mitt på torget står den stora tidsmaskinen. Kugghjul, rattar och en port som väntar på att öppnas.",
              "Du har samlat allt du behöver. Är du redo att laga den och starta tidsresan?",
            ],
            action: { label: "Gå till tidsmaskinen →", onClick: () => { setDialog(null); onEnterMachine(); } },
          });
        }}>
        <span className="td-shop-label" style={{ top: "-6%" }}>✦ Tidsmaskinen</span>
      </button>

      {/* Tornet — papegojans gåtor (uppe till höger, justera mot bilden) */}
      <button className="td-shop-hotspot" style={{ left: "62%", top: "6%", width: "12%", height: "30%" }}
        onClick={() => setSub("torn")} aria-label="Gå upp i tornet">
        <span className="td-shop-label" style={{ top: "-6%" }}>🦜 Tornet</span>
      </button>

      <div className="td-cave-clue td-cave-clue-final td-clue-narrow">
        🏛️ Välkommen till Tidsstaden! Utforska torget — och gå till tidsmaskinen när du är redo.
      </div>
    </div>
  );
}

// --- URMAKAREN: gömt kugghjul ---
function UrmakareShop({ foundItems, onPickUpItem, setDialog, onBack }) {
  const gearFound = foundItems.includes("city:gear");
  const watchDone = foundItems.includes("city:watch");

  // Tre rundor med stigande antal föremål att räkna.
  const ROUNDS = [
    { icon: "🕰️", name: "gökur", count: 4, positions: [
      { x: 10, y: 20 }, { x: 22, y: 32 }, { x: 14, y: 48 }, { x: 28, y: 18 },
    ]},
    { icon: "⏱️", name: "fickur", count: 6, positions: [
      { x: 8, y: 18 }, { x: 20, y: 26 }, { x: 12, y: 40 }, { x: 26, y: 44 }, { x: 18, y: 56 }, { x: 30, y: 32 },
    ]},
    { icon: "⏳", name: "sandklockor", count: 8, positions: [
      { x: 8, y: 16 }, { x: 18, y: 22 }, { x: 28, y: 18 }, { x: 12, y: 36 },
      { x: 24, y: 38 }, { x: 32, y: 30 }, { x: 16, y: 54 }, { x: 28, y: 56 },
    ]},
  ];

  const [round, setRound] = useState(-1); // -1 = inte startat
  const [wrong, setWrong] = useState(false);

  const active = round >= 0 && round < ROUNDS.length;
  const cur = active ? ROUNDS[round] : null;

  // Skapa svarsalternativ runt rätt antal (ett under, rätt, ett över).
  function options(correct) {
    return [correct - 1, correct, correct + 1];
  }

  function answer(n) {
    if (n === cur.count) {
      setWrong(false);
      if (round < ROUNDS.length - 1) {
        setRound(round + 1);
        setDialog({ name: "Urmakaren", portrait: ASSETS.urmakareFull,
          lines: [round === 0 ? "Rätt! Nu en lite klurigare..." : "Helt rätt igen! Sista rundan — den svåraste!"] });
      } else {
        setRound(-1);
        if (!watchDone) onPickUpItem("city:watch");
        setDialog({
          name: "Urmakaren", portrait: ASSETS.urmakareFull,
          lines: [
            "Alla tre rätt! Du har riktig urmakarblick, lilla detektiv.",
            "Här, ta den här fina fickklockan som tack. ⏱️",
          ],
        });
      }
    } else {
      setWrong(true);
    }
  }

  return (
    <div className="td-scene-image td-fade-in"
         style={{ backgroundImage: `url(${ASSETS.urmakarenInne})` }}>
      <button className="td-shop-back td-btn td-btn-small" onClick={onBack}>← Ut på torget</button>

      <button className="td-shop-figure td-shop-figure-btn"
        style={{ left: "6%", bottom: "-4%", height: "70%", aspectRatio: "574 / 1444" }}
        aria-label="Prata med urmakaren"
        onClick={() => {
          if (watchDone) {
            setDialog({ name: "Urmakaren", portrait: ASSETS.urmakareFull,
              lines: ["Tack för hjälpen med att räkna, lilla vän! Titta dig gärna omkring."] });
          } else {
            setDialog({
              name: "Urmakaren", portrait: ASSETS.urmakareFull,
              lines: [
                "Välkommen till min verkstad! Här tickar tusen klockor.",
                "Jag har tappat räkningen på mina klockor... Kan du hjälpa mig räkna? Det blir tre rundor, en klurigare än den andra!",
              ],
              action: { label: "Börja räkna →", onClick: () => { setDialog(null); setRound(0); setWrong(false); } },
            });
          }
        }}>
        <img src={ASSETS.urmakareFull} alt="Urmakaren" />
      </button>

      {/* Föremål att räkna */}
      {active && cur.positions.map((p, i) => (
        <div key={i} className="td-count-clock" style={{ left: `${p.x}%`, top: `${p.y}%` }}>{cur.icon}</div>
      ))}

      {/* Räknepanel */}
      {active && (
        <div className="td-clocktower-panel td-parrot-panel" style={{ left: "64%" }}>
          <div className="td-shop-speaker">⏰ Runda {round + 1} av 3</div>
          <p>Hur många {cur.name} ({cur.icon}) ser du i rummet?</p>
          <div className="td-answer-list">
            {options(cur.count).map((n) => (
              <button key={n} className="td-btn td-answer-btn" onClick={() => answer(n)}>{n} stycken</button>
            ))}
          </div>
          {wrong && <p className="td-wrong-hint">Inte riktigt — räkna en gång till!</p>}
        </div>
      )}

      <Hideaway
        x={70} y={55} size={5}
        found={gearFound}
        icon="⚙️"
        hint="Något litet glittrar bland urverken..."
        foundText="Du hittade ett litet blankt kugghjul bland klockorna! Det lägger du i väskan."
        onFind={(t) => { onPickUpItem("city:gear"); setDialog(t); }}
      />
      {!active && (
        <div className="td-cave-clue td-cave-clue-final td-clue-narrow">
          ⏰ Urmakarens verkstad. Prata med urmakaren — och se om något glittrar bland klockorna.
        </div>
      )}
    </div>
  );
}

// --- LEKSAKSBODEN: figur, minnesspel (3 rundor) + gömd leksak ---
function LeksaksbodShop({ foundItems, onPickUpItem, setDialog, onBack }) {
  const toyFound = foundItems.includes("city:toy");
  const topDone = foundItems.includes("city:spinningtop");
  const TOYS = ["🧸", "🚂", "🎈", "🪁", "🎺"];

  // Tre rundor: längre sekvens varje gång.
  const SEQUENCES = [
    [0, 2, 1],
    [3, 0, 2, 4],
    [1, 4, 0, 3, 2],
  ];

  const [round, setRound] = useState(-1); // -1 = inte startat
  const [phase, setPhase] = useState("idle"); // idle | show | input | done
  const [litIndex, setLitIndex] = useState(-1);
  const [playerStep, setPlayerStep] = useState(0);
  const [wrong, setWrong] = useState(false);

  function showSequence(r) {
    setPhase("show");
    setWrong(false);
    setPlayerStep(0);
    const seq = SEQUENCES[r];
    let i = 0;
    function flash() {
      setLitIndex(seq[i]);
      setTimeout(() => {
        setLitIndex(-1);
        i++;
        if (i < seq.length) setTimeout(flash, 350);
        else setTimeout(() => setPhase("input"), 400);
      }, 650);
    }
    setTimeout(flash, 500);
  }

  function startRound(r) {
    setRound(r);
    showSequence(r);
  }

  function clickToy(toyIndex) {
    if (phase !== "input") return;
    const seq = SEQUENCES[round];
    if (toyIndex === seq[playerStep]) {
      const next = playerStep + 1;
      if (next === seq.length) {
        // Rundan klar
        if (round < SEQUENCES.length - 1) {
          setPhase("idle");
          setDialog({ name: "Leksaksmakaren", portrait: ASSETS.leksaksmakareFull,
            lines: [round === 0 ? "Bra! Nu en längre ordning..." : "Snyggt! Sista rundan — den längsta!"],
            action: { label: "Nästa runda →", onClick: () => { setDialog(null); startRound(round + 1); } } });
        } else {
          setPhase("done");
          setRound(-1);
          if (!topDone) onPickUpItem("city:spinningtop");
          setDialog({
            name: "Leksaksmakaren", portrait: ASSETS.leksaksmakareFull,
            lines: [
              "Helt rätt, alla tre rundorna! Vilket fantastiskt minne du har!",
              "Här får du den här målade snurran som tack. 🎁",
            ],
          });
        }
      } else {
        setPlayerStep(next);
      }
    } else {
      setWrong(true);
      setPhase("idle");
      setRound(-1);
    }
  }

  const toyPositions = [
    { x: 36, y: 26 }, { x: 50, y: 24 }, { x: 43, y: 42 }, { x: 57, y: 40 }, { x: 50, y: 58 },
  ];
  const active = phase === "show" || phase === "input";

  return (
    <div className="td-scene-image td-fade-in"
         style={{ backgroundImage: `url(${ASSETS.leksaksbodenInne})` }}>
      <button className="td-shop-back td-btn td-btn-small" onClick={onBack}>← Ut på torget</button>

      <button className="td-shop-figure td-shop-figure-btn"
        style={{ left: "74%", bottom: "-4%", height: "70%", aspectRatio: "733 / 1446" }}
        aria-label="Prata med leksaksmakaren"
        onClick={() => {
          if (topDone) {
            setDialog({ name: "Leksaksmakaren", portrait: ASSETS.leksaksmakareFull,
              lines: ["Tack för att du spelade med mig! Titta dig gärna omkring i boden."] });
          } else {
            setDialog({
              name: "Leksaksmakaren", portrait: ASSETS.leksaksmakareFull,
              lines: [
                "Hej och välkommen till leksaksboden!",
                "Vill du spela mitt minnesspel? Jag tänder leksaker i en ordning, sen klickar du dem i samma ordning. Tre rundor — längre för varje gång!",
              ],
              action: { label: "Spela minnesspelet →", onClick: () => { setDialog(null); startRound(0); } },
            });
          }
        }}>
        <img src={ASSETS.leksaksmakareFull} alt="Leksaksmakaren" />
      </button>

      {/* Leksakerna */}
      {active && toyPositions.map((p, i) => (
        <button key={i}
          className={`td-memory-toy ${litIndex === i ? "td-memory-toy-lit" : ""}`}
          style={{ left: `${p.x}%`, top: `${p.y}%` }}
          onClick={() => clickToy(i)}
          aria-label={`Leksak ${i + 1}`}>
          {TOYS[i]}
        </button>
      ))}

      {active && (
        <div className="td-cave-clue td-cave-clue-final td-clue-narrow">
          Runda {round + 1} av 3 — {phase === "show" ? "titta noga och kom ihåg ordningen!" : "din tur, klicka i samma ordning!"}
        </div>
      )}
      {wrong && phase === "idle" && (
        <div className="td-cave-clue td-cave-clue-final td-clue-narrow">
          Oj, fel ordning! Prata med leksaksmakaren och försök igen från början.
        </div>
      )}

      <Hideaway
        x={20} y={62} size={5}
        found={toyFound}
        icon="🪀"
        hint="Något står och väntar bland leksakerna..."
        foundText="Du hittade en uppdragbar plåtleksak! Den surrar glatt ner i väskan."
        onFind={(t) => { onPickUpItem("city:toy"); setDialog(t); }}
      />
      {phase === "idle" && !wrong && (
        <div className="td-cave-clue td-cave-clue-final td-clue-narrow">
          🧸 Leksaksboden. Prata med leksaksmakaren — och leta efter något gömt bland leksakerna.
        </div>
      )}
    </div>
  );
}

// --- BRUNNEN: gömt mynt ---
function BrunnView({ found, onPickUpItem, setDialog, onBack }) {
  return (
    <div className="td-scene-image td-fade-in"
         style={{ backgroundImage: `url(${ASSETS.brunnNer})` }}>
      <button className="td-shop-back td-btn td-btn-small" onClick={onBack}>← Tillbaka upp</button>
      <Hideaway
        x={50} y={52} size={6}
        found={found}
        icon="🪙"
        hint="Något blänker längst ner i vattnet..."
        foundText="Du fiskade upp ett blankt mynt från brunnens botten! Det glittrar i väskan."
        onFind={(t) => { onPickUpItem("city:coin"); setDialog(t); }}
      />
      <div className="td-cave-clue td-cave-clue-final td-clue-narrow">
        🪣 Du tittar ner i den djupa brunnen. Vattnet är mörkt och stilla... men något blänker.
      </div>
    </div>
  );
}

// --- TORNET: papegojan ställer tre gåtor, ger en fjäder ---
const PARROT_RIDDLES = [
  {
    q: "Jag har städer men inga hus, skogar men inga träd, och vatten men ingen fisk. Vad är jag?",
    options: ["En karta", "En sjö", "En trädgård"],
    correct: 0,
  },
  {
    q: "Ju mer du tar bort av mig, desto större blir jag. Vad är jag?",
    options: ["En kaka", "Ett hål", "En boll"],
    correct: 1,
  },
  {
    q: "Jag går runt hela huset, men rör mig aldrig ur fläcken. Vad är jag?",
    options: ["En katt", "Vinden", "Ett staket"],
    correct: 2,
  },
];

function TornView({ featherFound, onPickUpItem, setDialog, onBack }) {
  const [step, setStep] = useState("intro"); // intro | q0 | q1 | q2 | done
  const [wrong, setWrong] = useState(false);

  function startRiddles() {
    setStep("q0");
  }

  function answer(qIndex, optIndex) {
    if (optIndex === PARROT_RIDDLES[qIndex].correct) {
      setWrong(false);
      if (qIndex < PARROT_RIDDLES.length - 1) {
        setStep(`q${qIndex + 1}`);
      } else {
        setStep("done");
        if (!featherFound) onPickUpItem("city:feather");
      }
    } else {
      setWrong(true);
    }
  }

  const qMatch = step.match(/^q(\d)$/);
  const qIndex = qMatch ? parseInt(qMatch[1], 10) : -1;

  return (
    <div className="td-scene-image td-fade-in"
         style={{ backgroundImage: `url(${ASSETS.tornInne})` }}>
      <button className="td-shop-back td-btn td-btn-small" onClick={onBack}>← Ut på torget</button>

      {/* Papegojan svävar i luften */}
      <button className="td-shop-figure td-shop-figure-btn td-parrot-fly"
        style={{ left: "52%", top: "14%", height: "auto", width: "34%", aspectRatio: "1191 / 1115" }}
        aria-label="Prata med papegojan"
        onClick={() => { if (step === "intro") startRiddles(); }}>
        <img src={ASSETS.papegojaFull} alt="Papegojan" />
      </button>

      {/* Gåtepanel */}
      <div className="td-clocktower-panel td-parrot-panel">
        {step === "intro" && (
          <>
            <div className="td-shop-speaker">🦜 Papegojan</div>
            {featherFound ? (
              <>
                <p>"Vraak! Du har redan löst mina gåtor, kloka vän. Fjädern är din."</p>
                <button className="td-btn" onClick={onBack}>← Ut på torget</button>
              </>
            ) : (
              <>
                <p>"Vraak! En besökare! Jag är tornets papegoja. Klarar du mina tre gåtor får du en vacker fjäder. Är du redo?"</p>
                <button className="td-btn td-btn-big" onClick={startRiddles}>Ja, ställ gåtorna! →</button>
              </>
            )}
          </>
        )}

        {qIndex >= 0 && (
          <>
            <div className="td-shop-speaker">🦜 Gåta {qIndex + 1} av {PARROT_RIDDLES.length}</div>
            <p>{PARROT_RIDDLES[qIndex].q}</p>
            <div className="td-answer-list">
              {PARROT_RIDDLES[qIndex].options.map((opt, i) => (
                <button key={i} className="td-btn td-answer-btn" onClick={() => answer(qIndex, i)}>{opt}</button>
              ))}
            </div>
            {wrong && <p className="td-wrong-hint">"Vraak! Inte riktigt — tänk efter och försök igen!"</p>}
          </>
        )}

        {step === "done" && (
          <>
            <div className="td-shop-speaker">⭐ Alla gåtor lösta!</div>
            <p>"Vraaak! Du är en riktig gåtmästare! Här är din belöning — en av mina finaste fjädrar."</p>
            <button className="td-btn td-btn-big" onClick={() => {
              setDialog({
                name: "Papegojan",
                portrait: ASSETS.papegojaFull,
                lines: ["Du fick Papegojans fjäder! 🪶 Den lägger du i väskan."],
              });
              onBack();
            }}>Ta emot fjädern 🪶</button>
          </>
        )}
      </div>
    </div>
  );
}

function EndScreen({ onReset }) {
  return (
    <div className="td-end">
      <div className="td-stamp">✦ Äventyr fullbordat ✦</div>
      <h2 className="td-h2">Tidsmaskinen lever!</h2>
      <div className="td-trio">
        <CharacterPortrait src={ASSETS.tickelton} name="Professor Tickelton" />
        <CharacterPortrait src={ASSETS.mira} name="Mira Murr" />
        <CharacterPortrait src={ASSETS.klonk} name="Herr Klonk" />
      </div>
      <p className="td-intro">Fantastiskt! Du hittade alla tre stjärnor och lagade stadens första tidsmaskin.</p>
      <p className="td-intro td-intro-small">
        Nästa gång kan äventyret fortsätta till <strong>Hamnen</strong>,{" "}
        <strong>Observatoriet</strong> och <strong>Den glömda grottan</strong>.
      </p>
      <div className="td-end-stars"><StarRow filled={3} /></div>
      <button className="td-btn td-btn-big" onClick={onReset}>↺ Spela igen</button>
    </div>
  );
}

function Feedback({ feedback, done, onBack }) {
  if (!feedback) return null;
  return (
    <div className={`td-feedback td-feedback-${feedback.type}`}>
      <p>{feedback.text}</p>
      {done && <button className="td-btn td-btn-gold" onClick={onBack}>★ Tillbaka</button>}
    </div>
  );
}

function Styles() {
  return (
    <style>{`
      :root {
        --ink: #3a2a17;
        --paper: #f5e6c4;
        --cream: #fdf3d8;
        --red: #c0392b;
        --gold: #fdc94d;
        --blue: #3a6ea8;
        --green: #5fa860;
      }

      .td-app {
        font-family: 'Georgia', 'Bookman Old Style', serif;
        color: var(--ink); min-height: 100vh;
        background: #2a1f12; overflow: hidden;
      }

      .td-fade-in { animation: tdFadeIn 0.5s ease; }
      @keyframes tdFadeIn { from { opacity: 0; } to { opacity: 1; } }
      @keyframes tdSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      @keyframes tdSpinReverse { from { transform: rotate(0deg); } to { transform: rotate(-360deg); } }

      .td-start-screen {
        position: fixed; inset: 0;
        background: url(${ASSETS.map}) center/cover no-repeat;
        display: flex; align-items: center; justify-content: center;
        padding: 20px; overflow-y: auto;
      }
      .td-start-screen::before {
        content: ""; position: absolute; inset: 0;
        background: rgba(40, 30, 18, 0.55);
      }
      .td-start-card {
        position: relative; z-index: 1;
        background: var(--cream);
        border: 4px solid var(--ink); border-radius: 12px;
        padding: 36px; max-width: 640px; text-align: center;
        box-shadow: 10px 10px 0 var(--ink);
        transform: rotate(-1deg); margin: 20px 0;
      }
      .td-stamp {
        display: inline-block;
        border: 2.5px solid var(--ink);
        padding: 6px 16px; font-size: 12px; letter-spacing: 2px;
        text-transform: uppercase; background: var(--paper);
        font-weight: bold; margin-bottom: 16px;
        box-shadow: 3px 3px 0 var(--ink);
      }
      .td-title {
        font-size: clamp(40px, 7vw, 60px);
        margin: 6px 0 16px; color: var(--red);
        font-weight: 900; letter-spacing: -1px;
        text-shadow: 3px 3px 0 var(--gold), 5px 5px 0 var(--ink);
        line-height: 0.95;
      }
      .td-intro { font-size: 18px; line-height: 1.5; margin: 14px 0; }
      .td-intro-small { font-size: 15px; opacity: 0.85; }

      .td-trio { display: flex; justify-content: center; gap: 14px; margin: 24px 0; flex-wrap: wrap; }
      .td-portrait { margin: 0; text-align: center; flex: 1 1 130px; max-width: 160px; }
      .td-portrait-frame {
        width: 100%; aspect-ratio: 1 / 1;
        border: 3px solid var(--ink); border-radius: 50%;
        overflow: hidden; box-shadow: 4px 4px 0 var(--ink);
        background: var(--paper);
      }
      .td-portrait-frame img { width: 100%; height: 100%; object-fit: cover; display: block; }
      .td-portrait-name { margin-top: 10px; font-weight: bold; font-size: 14px; color: var(--ink); }

      .td-btn {
        background: var(--cream); border: 3px solid var(--ink); color: var(--ink);
        padding: 10px 20px; font-family: inherit; font-size: 16px; font-weight: bold;
        cursor: pointer; border-radius: 8px;
        box-shadow: 4px 4px 0 var(--ink);
        transition: transform 0.1s, box-shadow 0.1s;
      }
      .td-btn:hover { transform: translate(-2px, -2px); box-shadow: 6px 6px 0 var(--ink); }
      .td-btn:active { transform: translate(2px, 2px); box-shadow: 1px 1px 0 var(--ink); }
      .td-btn-big { font-size: 20px; padding: 14px 30px; background: var(--red); color: var(--cream); }
      .td-btn-small { font-size: 13px; padding: 6px 14px; }
      .td-btn-gold { background: var(--gold); }

      /* === KARTAN === */
      .td-map-wrap {
        position: fixed; inset: 0; background: #1a1208;
        display: flex; align-items: center; justify-content: center;
      }
      .td-map {
        position: relative; width: 100%; height: 100%;
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
        background-color: #1a1208;
        overflow: hidden;
      }
      /* När förstoringsglas är på — göm vanlig markör */
      .td-map-magnifier-on { cursor: none; }
      .td-map-magnifier-on .td-hotspot { cursor: none; }

      /* === SPOTLIGHT (C) — dimmar resten av kartan === */
      .td-spotlight {
        position: absolute;
        inset: 0;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.35s ease, background 0.35s ease;
        z-index: 3;
      }
      .td-spotlight-active { opacity: 1; }

      /* === FÖRSTORINGSGLAS — knappen === */
      .td-magnifier-toggle {
        position: fixed;
        top: 116px; right: 16px;
        width: 76px; height: 76px;
        background: var(--cream);
        border: 3px solid var(--ink);
        border-radius: 14px;
        padding: 8px;
        font-family: 'Georgia', serif;
        font-weight: bold;
        color: var(--ink);
        cursor: pointer;
        box-shadow: 4px 4px 0 var(--ink);
        z-index: 100;
        display: flex; align-items: center; justify-content: center;
        transition: transform 0.1s, box-shadow 0.1s, background 0.2s;
      }
      .td-magnifier-toggle:hover {
        transform: translate(-2px, -2px);
        box-shadow: 6px 6px 0 var(--ink);
      }
      .td-magnifier-toggle:active {
        transform: translate(2px, 2px);
        box-shadow: 1px 1px 0 var(--ink);
      }
      .td-magnifier-toggle-on {
        background: var(--gold);
      }
      .td-magnifier-icon { font-size: 38px; line-height: 1; }
      .td-magnifier-img {
        display: block;
        max-width: 100%;
        max-height: 100%;
        width: auto;
        height: auto;
        object-fit: contain;
      }
      .td-magnifier-label { letter-spacing: 0.5px; }

      /* === FÖRSTORINGSGLAS — själva linsen som följer musen === */
      .td-magnifier-lens {
        position: absolute;
        transform: translate(-50%, -50%);
        border-radius: 50%;
        border: 4px solid var(--ink);
        box-shadow:
          0 0 0 2px var(--gold),
          0 0 20px rgba(0, 0, 0, 0.6),
          inset 0 0 40px rgba(0, 0, 0, 0.15);
        pointer-events: none;
        z-index: 20;
        background-color: var(--paper);
      }
      /* Liten "handtag" på förstoringsglaset */
      .td-magnifier-lens::after {
        content: "";
        position: absolute;
        right: -8px; bottom: -8px;
        width: 30px; height: 30px;
        background: var(--ink);
        border-radius: 50%;
        transform: rotate(45deg) translateX(18px);
        box-shadow: 2px 2px 4px rgba(0,0,0,0.4);
        border: 2px solid var(--ink);
      }

      /* === GÖMD KATT === */
      .td-hidden-cat {
        position: absolute;
        transform: translate(-50%, -50%);
        width: 2.5%; /* mycket liten — måste zoomas för att synas */
        aspect-ratio: 1 / 1;
        pointer-events: none;
        z-index: 2;
        opacity: 0.92;
      }

      .td-hud {
        position: absolute; bottom: 16px; left: 50%;
        transform: translateX(-50%); z-index: 10;
        display: flex; gap: 12px; align-items: center;
      }
      .td-hud-banner {
        background: var(--cream); border: 3px solid var(--ink);
        border-radius: 8px; padding: 8px 22px;
        box-shadow: 4px 4px 0 var(--ink);
        display: flex; align-items: center; gap: 16px;
      }
      .td-hud-text { font-weight: bold; font-size: 16px; text-transform: uppercase; letter-spacing: 1.5px; }
      .td-hud-reset { background: var(--paper); }

      .td-star-row { display: inline-flex; gap: 4px; }
      .td-star { font-size: 22px; color: #c0a878; text-shadow: 1px 1px 0 var(--ink); line-height: 1; }
      .td-star-filled { color: var(--gold); animation: starPop 0.4s ease; }
      @keyframes starPop {
        0% { transform: scale(0); }
        60% { transform: scale(1.4); }
        100% { transform: scale(1); }
      }

      .td-hotspot {
        position: absolute;
        background: transparent;
        border: none;
        cursor: pointer;
        padding: 0;
        transition: transform 0.25s ease;
        z-index: 4;
      }
      .td-hotspot:focus { outline: none; }
      .td-hotspot:focus-visible {
        outline: 3px dashed rgba(253, 201, 77, 0.7);
        outline-offset: -3px;
        border-radius: 12px;
      }
      .td-hotspot-star {
        position: absolute; top: 4%; right: 4%;
        font-size: 36px; color: var(--gold);
        text-shadow: 2px 2px 0 var(--ink), -1px -1px 0 var(--ink);
        animation: starPop 0.5s ease;
        z-index: 6;
      }
      .td-hotspot-done {
        filter: drop-shadow(0 0 20px rgba(253, 201, 77, 0.5));
        animation: tdDoneGlow 3s ease-in-out infinite;
      }
      @keyframes tdDoneGlow {
        0%, 100% { filter: drop-shadow(0 0 18px rgba(253, 201, 77, 0.4)); }
        50% { filter: drop-shadow(0 0 28px rgba(253, 201, 77, 0.7)); }
      }
      .td-hotspot-finale-locked { cursor: not-allowed; opacity: 0.5; }
      .td-hotspot-finale-active {
        animation: tdFinaleGlow 1.4s ease-in-out infinite;
      }
      @keyframes tdFinaleGlow {
        0%, 100% { filter: drop-shadow(0 0 20px rgba(253, 201, 77, 0.6)); }
        50% { filter: drop-shadow(0 0 40px rgba(253, 201, 77, 1)) drop-shadow(0 0 60px rgba(253, 201, 77, 0.7)); }
      }

      .td-hover-card {
        position: absolute; z-index: 12;
        background: var(--cream); border: 3px solid var(--ink);
        border-radius: 8px; padding: 10px;
        box-shadow: 4px 4px 0 var(--ink);
        min-width: 200px; max-width: 240px;
        transform: rotate(-2deg); pointer-events: none;
        animation: cardIn 0.15s ease;
        display: flex; gap: 10px; align-items: center;
      }
      @keyframes cardIn {
        from { opacity: 0; transform: rotate(-2deg) scale(0.9); }
        to { opacity: 1; transform: rotate(-2deg) scale(1); }
      }
      .td-hover-character {
        width: 54px; height: 54px;
        border: 2.5px solid var(--ink); border-radius: 50%;
        overflow: hidden; flex-shrink: 0; background: var(--paper);
      }
      .td-hover-character img { width: 100%; height: 100%; object-fit: cover; display: block; }
      .td-hover-content { flex: 1; min-width: 0; }
      .td-hover-title { font-weight: bold; font-size: 16px; color: var(--red); }
      .td-hover-short { font-size: 13px; margin: 2px 0 4px; }
      .td-hover-status { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.7; }
      .td-hover-status.ok { color: var(--green); opacity: 1; font-weight: bold; }

      /* === LEVANDE KARTELEMENT === */
      .td-map-smoke { position: absolute; width: 30px; height: 60px; pointer-events: none; z-index: 2; }
      .td-map-smoke-puff {
        position: absolute;
        bottom: 0; left: 50%;
        width: 20px; height: 20px;
        background: radial-gradient(circle, rgba(80, 60, 40, 0.4) 0%, rgba(80, 60, 40, 0) 70%);
        border-radius: 50%;
        opacity: 0;
        animation: tdMapSmokeRise 5s ease-out infinite;
      }
      .td-map-smoke-1 { animation-delay: 0s; }
      .td-map-smoke-2 { animation-delay: 1.7s; }
      .td-map-smoke-3 { animation-delay: 3.4s; }
      @keyframes tdMapSmokeRise {
        0% { transform: translate(-50%, 0) scale(0.4); opacity: 0; }
        20% { opacity: 0.5; }
        100% { transform: translate(-50%, -60px) scale(1.6); opacity: 0; }
      }
      .td-map-smoke-workshop .td-map-smoke-puff {
        background: radial-gradient(circle, rgba(100, 80, 60, 0.35) 0%, rgba(100, 80, 60, 0) 70%);
        animation-duration: 4s;
      }

      .td-map-lighthouse {
        position: absolute;
        width: 24px; height: 24px;
        pointer-events: none;
        z-index: 2;
        background: radial-gradient(circle, rgba(253, 201, 77, 0.95) 0%, rgba(253, 201, 77, 0.4) 30%, rgba(253, 201, 77, 0) 70%);
        border-radius: 50%;
        animation: tdLighthouseBlink 4s ease-in-out infinite;
      }
      @keyframes tdLighthouseBlink {
        0%, 90%, 100% { opacity: 0; transform: scale(0.5); }
        5%, 15% { opacity: 1; transform: scale(1.2); }
        25% { opacity: 0.3; transform: scale(1); }
        35%, 45% { opacity: 0.9; transform: scale(1.1); }
        55% { opacity: 0; }
      }

      .td-water-shimmer {
        position: absolute;
        width: 4px; height: 4px;
        background: rgba(255, 255, 255, 0.85);
        border-radius: 50%;
        pointer-events: none;
        z-index: 2;
        animation: tdWaterShimmer 2.5s ease-in-out infinite;
        box-shadow: 0 0 4px rgba(255, 255, 255, 0.7);
      }
      @keyframes tdWaterShimmer {
        0%, 100% { opacity: 0; transform: scale(0.5); }
        50% { opacity: 1; transform: scale(1.2); }
      }

      /* === LUFTSKEPPET === */
      .td-map-airship {
        position: absolute;
        top: 4%;
        width: 11%;
        height: auto;
        pointer-events: none;
        z-index: 2;
        left: -14%;
        animation: tdAirshipDrift 75s linear infinite;
        filter: drop-shadow(3px 4px 4px rgba(0, 0, 0, 0.25));
      }
      @keyframes tdAirshipDrift {
        0% { left: -14%; transform: translateY(0); }
        25% { transform: translateY(-8px); }
        50% { transform: translateY(6px); }
        75% { transform: translateY(-5px); }
        100% { left: 110%; transform: translateY(0); }
      }

      /* === FÅGELFLOCKEN (vanliga svarta fåglar) === */
      .td-map-birds {
        position: absolute;
        width: 10%;
        height: auto;
        pointer-events: none;
        z-index: 2;
        left: -12%;
        opacity: 0.85;
        animation: tdBirdsFly 45s linear infinite;
      }
      @keyframes tdBirdsFly {
        0% { left: -12%; transform: translateY(0); }
        25% { transform: translateY(-8px); }
        50% { transform: translateY(4px); }
        75% { transform: translateY(-5px); }
        100% { left: 110%; transform: translateY(0); }
      }

      /* === KLOCKFÅGELN (röd, flyger baklänges) === */
      .td-map-bird-reverse {
        position: absolute;
        width: 5%;
        height: auto;
        pointer-events: none;
        z-index: 2;
        right: -8%;
        opacity: 0.9;
        animation: tdBirdReverse 35s linear infinite;
        filter: drop-shadow(0 0 6px rgba(217, 76, 61, 0.5));
      }
      @keyframes tdBirdReverse {
        0% { right: -8%; transform: scaleX(-1) translateY(0); }
        30% { transform: scaleX(-1) translateY(10px); }
        60% { transform: scaleX(-1) translateY(-6px); }
        100% { right: 110%; transform: scaleX(-1) translateY(0); }
      }

      /* === LÖV SOM FALLER UPPÅT === */
      .td-falling-leaf {
        position: absolute;
        width: 2.5%;
        height: auto;
        pointer-events: none;
        z-index: 3;
        bottom: -5%;
        opacity: 0;
        animation-iteration-count: infinite;
        animation-timing-function: ease-in-out;
      }
      .td-leaf-1 {
        animation-name: tdLeafFallsUp;
        animation-duration: 14s;
        animation-delay: 0s;
      }
      .td-leaf-2 {
        animation-name: tdLeafFallsUp2;
        animation-duration: 18s;
        animation-delay: 5s;
      }
      .td-leaf-3 {
        animation-name: tdLeafFallsUp3;
        animation-duration: 16s;
        animation-delay: 10s;
      }
      @keyframes tdLeafFallsUp {
        0% { bottom: -5%; transform: rotate(0deg) translateX(0); opacity: 0; }
        8% { opacity: 0.95; }
        25% { transform: rotate(60deg) translateX(20px); }
        50% { transform: rotate(180deg) translateX(-15px); }
        75% { transform: rotate(280deg) translateX(25px); }
        92% { opacity: 0.95; }
        100% { bottom: 105%; transform: rotate(360deg) translateX(0); opacity: 0; }
      }
      @keyframes tdLeafFallsUp2 {
        0% { bottom: -5%; transform: rotate(0deg) translateX(0); opacity: 0; }
        8% { opacity: 0.95; }
        30% { transform: rotate(-70deg) translateX(-25px); }
        55% { transform: rotate(-180deg) translateX(20px); }
        80% { transform: rotate(-300deg) translateX(-18px); }
        92% { opacity: 0.95; }
        100% { bottom: 105%; transform: rotate(-360deg) translateX(0); opacity: 0; }
      }
      @keyframes tdLeafFallsUp3 {
        0% { bottom: -5%; transform: rotate(0deg) translateX(0); opacity: 0; }
        8% { opacity: 0.9; }
        20% { transform: rotate(40deg) translateX(-15px); }
        45% { transform: rotate(150deg) translateX(25px); }
        70% { transform: rotate(240deg) translateX(-20px); }
        92% { opacity: 0.9; }
        100% { bottom: 105%; transform: rotate(360deg) translateX(0); opacity: 0; }
      }

      /* === INTERIÖR-VY === */
      .td-interior {
        position: fixed; inset: 0; background: #1a1208;
        display: flex; flex-direction: column;
      }
      .td-interior-topbar {
        background: var(--cream); border-bottom: 3px solid var(--ink);
        padding: 10px 16px;
        display: flex; align-items: center; justify-content: space-between;
        gap: 16px; z-index: 5;
      }
      .td-interior-title-banner {
        background: var(--gold); border: 2.5px solid var(--ink);
        padding: 6px 22px; font-weight: bold; font-size: 18px;
        letter-spacing: 1.5px; text-transform: uppercase;
        box-shadow: 3px 3px 0 var(--ink);
        transform: rotate(-1deg);
      }
      .td-interior-stage {
        flex: 1; display: flex; align-items: center; justify-content: center;
        overflow: hidden; position: relative; background: #1a1208;
      }
      .td-scene-image {
        position: relative; width: 100%; height: 100%;
        background-size: cover; background-position: center; background-repeat: no-repeat;
        background-color: #1a1208;
      }
      .td-scene-shake { animation: tdSceneShake 0.1s ease-in-out infinite; }

      /* Video-bakgrund (rörligt vatten i hamnen) */
      .td-scene-video-wrap { overflow: hidden; }
      .td-scene-video {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
        z-index: 0;
        pointer-events: none;
      }
      .td-scene-video-wrap > *:not(.td-scene-video) {
        position: relative;
        z-index: 1;
      }
      @keyframes tdSceneShake {
        0%, 100% { transform: translate(0, 0); }
        25% { transform: translate(-2px, 1px); }
        50% { transform: translate(2px, -1px); }
        75% { transform: translate(-1px, 2px); }
      }

      .td-anim-overlay { position: absolute; pointer-events: none; }
      .td-steam { position: absolute; pointer-events: none; }
      .td-steam-puff {
        position: absolute; bottom: 0; left: 50%;
        width: 30px; height: 30px;
        background: radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0) 70%);
        border-radius: 50%; opacity: 0;
        animation: tdSteamRise 3s ease-out infinite;
      }
      .td-steam-puff-1 { animation-delay: 0s; }
      .td-steam-puff-2 { animation-delay: 1s; }
      .td-steam-puff-3 { animation-delay: 2s; }
      @keyframes tdSteamRise {
        0% { transform: translate(-50%, 0) scale(0.4); opacity: 0; }
        20% { opacity: 0.5; }
        100% { transform: translate(-50%, -120px) scale(1.8); opacity: 0; }
      }

      .td-extra-steam {
        position: absolute; width: 40px; height: 40px;
        pointer-events: none; z-index: 5;
      }
      .td-burst-puff {
        position: absolute; inset: 0;
        background: radial-gradient(circle, rgba(255, 255, 255, 0.85) 0%, rgba(255, 255, 255, 0) 70%);
        border-radius: 50%;
        animation: tdBurstPuff 1.5s ease-out infinite;
      }
      @keyframes tdBurstPuff {
        0% { transform: scale(0.2); opacity: 0; }
        15% { opacity: 0.9; }
        100% { transform: scale(2.5); opacity: 0; }
      }

      .td-lamp-flicker {
        position: absolute; pointer-events: none;
        background: radial-gradient(circle, rgba(253, 201, 77, 0.3) 0%, rgba(253, 201, 77, 0) 60%);
        border-radius: 50%;
        animation: tdLampFlicker 4s ease-in-out infinite;
      }
      @keyframes tdLampFlicker {
        0%, 100% { opacity: 0.7; transform: scale(1); }
        15% { opacity: 0.9; }
        25% { opacity: 0.4; transform: scale(0.95); }
        28% { opacity: 0.9; transform: scale(1.02); }
        60% { opacity: 0.85; }
      }
      .td-lamp-overdrive {
        background: radial-gradient(circle, rgba(253, 201, 77, 0.8) 0%, rgba(253, 201, 77, 0) 70%) !important;
        animation: tdLampOverdrive 0.15s ease-in-out infinite !important;
      }
      @keyframes tdLampOverdrive {
        0%, 100% { opacity: 1; transform: scale(1.2); }
        50% { opacity: 0.4; transform: scale(0.9); }
      }

      .td-puzzle-grid {
        position: absolute; pointer-events: none;
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr 1fr; gap: 2%;
      }
      .td-puzzle-grid span {
        background: rgba(255, 255, 255, 0);
        border-radius: 2px;
        animation: tdPuzzleBlink 3s ease-in-out infinite;
      }
      @keyframes tdPuzzleBlink {
        0%, 100% { background: rgba(255, 255, 255, 0); box-shadow: none; }
        50% {
          background: rgba(253, 201, 77, 0.25);
          box-shadow: 0 0 6px rgba(253, 201, 77, 0.4);
        }
      }
      .td-puzzle-grid-running span {
        animation: tdPuzzleBlinkRunning 0.3s ease-in-out infinite !important;
      }
      @keyframes tdPuzzleBlinkRunning {
        0% { background: rgba(217, 76, 61, 0.9); box-shadow: 0 0 16px rgba(217, 76, 61, 1); }
        33% { background: rgba(58, 110, 168, 0.9); box-shadow: 0 0 16px rgba(58, 110, 168, 1); }
        66% { background: rgba(95, 168, 96, 0.9); box-shadow: 0 0 16px rgba(95, 168, 96, 1); }
        100% { background: rgba(253, 201, 77, 0.9); box-shadow: 0 0 16px rgba(253, 201, 77, 1); }
      }

      .td-machine-running-text-big {
        position: absolute;
        top: 35%; left: 50%;
        transform: translate(-50%, -50%);
        background: var(--gold); border: 5px solid var(--ink);
        padding: 16px 36px;
        font-weight: 900;
        font-size: clamp(36px, 6vw, 64px);
        color: var(--red); font-family: 'Georgia', serif;
        box-shadow: 8px 8px 0 var(--ink);
        text-transform: uppercase; letter-spacing: 4px;
        z-index: 8; pointer-events: none;
        animation: tdBigTextShake 0.15s ease-in-out infinite, tdBigTextIn 0.3s ease-out;
        text-shadow: 2px 2px 0 var(--ink);
      }
      @keyframes tdBigTextIn {
        from { transform: translate(-50%, -50%) scale(0.3) rotate(-15deg); opacity: 0; }
        to { transform: translate(-50%, -50%) scale(1) rotate(-3deg); opacity: 1; }
      }
      @keyframes tdBigTextShake {
        0%, 100% { transform: translate(-50%, -50%) rotate(-3deg); }
        25% { transform: translate(calc(-50% - 4px), calc(-50% + 2px)) rotate(-1deg); }
        50% { transform: translate(calc(-50% + 4px), calc(-50% - 2px)) rotate(-5deg); }
        75% { transform: translate(calc(-50% - 2px), calc(-50% + 4px)) rotate(-2deg); }
      }

      .td-tagged {
        position: absolute; background: transparent; border: none;
        cursor: pointer; padding: 0; z-index: 3; border-radius: 12px;
        transition: transform 0.25s ease;
      }
      .td-tagged-glow {
        position: absolute; inset: 0; border-radius: inherit;
        background: radial-gradient(
          ellipse at center,
          rgba(253, 201, 77, 0) 0%,
          rgba(253, 201, 77, 0) 50%,
          rgba(253, 201, 77, 0) 100%
        );
        transition: background 0.3s ease;
        pointer-events: none;
      }
      .td-tagged:hover { transform: scale(1.015); }
      .td-tagged:hover .td-tagged-glow {
        background: radial-gradient(
          ellipse at center,
          rgba(253, 201, 77, 0.35) 0%,
          rgba(253, 201, 77, 0.18) 50%,
          rgba(253, 201, 77, 0.02) 100%
        );
      }
      .td-tagged:focus { outline: none; }
      .td-tagged:focus-visible {
        outline: 3px dashed rgba(253, 201, 77, 0.7);
        outline-offset: -3px;
      }

      /* === GÖMSTÄLLE — samlarpryl-markör === */
      .td-hideaway {
        position: absolute;
        aspect-ratio: 1 / 1;
        transform: translate(-50%, -50%);
        background: transparent;
        border: none;
        padding: 0;
        cursor: pointer;
        z-index: 4;
        display: flex;
        align-items: center;
        justify-content: center;
        animation: tdHideawayBob 3.5s ease-in-out infinite;
      }
      /* Mjuk glöd bakom prylen — syns bara vid hover/fokus */
      .td-hideaway-glint {
        position: absolute;
        inset: -25%;
        border-radius: 50%;
        background: radial-gradient(
          circle at center,
          rgba(253, 201, 77, 0.55) 0%,
          rgba(253, 201, 77, 0.22) 45%,
          rgba(253, 201, 77, 0) 70%
        );
        opacity: 0;
        transition: opacity 0.25s ease;
        pointer-events: none;
      }
      .td-hideaway:hover .td-hideaway-glint,
      .td-hideaway:focus-visible .td-hideaway-glint {
        opacity: 1;
        animation: tdGlintPulse 2.6s ease-in-out infinite;
      }
      /* Bara prylen (emojin) — ingen bricka, ligger som ett föremål i miljön */
      .td-hideaway-icon {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 28px;
        line-height: 1;
        filter:
          drop-shadow(0 3px 2px rgba(0, 0, 0, 0.45))
          drop-shadow(0 0 1px rgba(0, 0, 0, 0.5));
        transition: transform 0.2s ease;
      }
      .td-hideaway:hover .td-hideaway-icon,
      .td-hideaway:focus-visible .td-hideaway-icon {
        transform: scale(1.22);
      }
      .td-hideaway:focus { outline: none; }
      @keyframes tdGlintPulse {
        0%, 100% { transform: scale(0.85); opacity: 0.55; }
        50% { transform: scale(1.1); opacity: 0.9; }
      }
      @keyframes tdHideawayBob {
        0%, 100% { margin-top: 0; }
        50% { margin-top: -3px; }
      }

      /* === BOKGRÄNDEN === */
      .td-shop-hotspot {
        position: absolute;
        background: transparent;
        border: 3px dashed transparent;
        border-radius: 12px;
        cursor: pointer;
        z-index: 5;
        transition: background 0.2s, border-color 0.2s;
        display: flex;
        align-items: flex-start;
        justify-content: center;
      }
      .td-shop-hotspot:hover, .td-shop-hotspot:focus-visible {
        background: transparent;
        border-color: transparent;
        outline: none;
      }
      /* Tidsmaskinen på torget: alltid en svag lockande glöd */
      .td-machine-hotspot {
        position: absolute;
        background: radial-gradient(ellipse at center, rgba(253,201,77,0.18) 0%, rgba(253,201,77,0) 70%);
        border: none;
        border-radius: 16px;
        cursor: pointer;
        z-index: 6;
        display: flex;
        align-items: flex-start;
        justify-content: center;
        animation: tdMachinePulse 2.5s ease-in-out infinite;
      }
      @keyframes tdMachinePulse {
        0%, 100% { background: radial-gradient(ellipse at center, rgba(253,201,77,0.12) 0%, rgba(253,201,77,0) 70%); }
        50% { background: radial-gradient(ellipse at center, rgba(253,201,77,0.30) 0%, rgba(253,201,77,0) 72%); }
      }
      .td-shop-label {
        position: absolute;
        background: var(--cream);
        border: 2.5px solid var(--ink);
        border-radius: 8px;
        padding: 4px 12px;
        font-family: 'Georgia', serif;
        font-weight: bold;
        font-size: 15px;
        color: var(--ink);
        white-space: nowrap;
        opacity: 0;
        transform: translateY(6px);
        transition: opacity 0.2s, transform 0.2s;
        box-shadow: 2px 2px 0 var(--ink);
        pointer-events: none;
      }
      .td-shop-hotspot:hover .td-shop-label,
      .td-shop-hotspot:focus-visible .td-shop-label {
        opacity: 1;
        transform: translateY(0);
      }
      .td-shop-back {
        position: absolute;
        top: 14px; left: 14px;
        z-index: 20;
      }
      .td-shop-figure {
        position: absolute;
        width: auto;
        object-fit: contain;
        object-position: bottom;
        z-index: 12;
        filter: drop-shadow(0 6px 8px rgba(0,0,0,0.35));
        pointer-events: none;
      }
      .td-shop-figure-btn {
        background: transparent;
        border: none;
        padding: 0;
        cursor: pointer;
        pointer-events: auto;
        transition: transform 0.15s ease;
      }
      .td-shop-figure-btn img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        object-position: bottom;
        display: block;
      }
      .td-shop-figure-btn:hover { transform: scale(1.03); }
      .td-shop-figure-btn:active { transform: scale(0.99); }
      /* Ugglemark centrerad på golvet — behåll centrering även vid hover */
      .td-ugglemark-center { transform: translateX(-50%); }
      .td-ugglemark-center:hover { transform: translateX(-50%) scale(1.03); }
      .td-ugglemark-center:active { transform: translateX(-50%) scale(0.99); }
      .td-dialog-close {
        position: absolute;
        top: 8px; right: 10px;
        width: 30px; height: 30px;
        background: var(--cream);
        border: 2px solid var(--ink);
        border-radius: 50%;
        font-size: 15px;
        font-weight: bold;
        color: var(--ink);
        cursor: pointer;
        line-height: 1;
        z-index: 5;
        transition: background 0.15s, transform 0.15s;
      }
      .td-dialog-close:hover { background: var(--red); color: var(--cream); transform: scale(1.1); }
      .td-dialog-buttons {
        display: flex;
        gap: 10px;
        justify-content: flex-end;
        margin-top: 6px;
      }
      .td-shop-panel {
        position: absolute;
        right: 4%;
        top: 50%;
        transform: translateY(-50%);
        width: 360px;
        max-width: 44%;
        background: var(--cream);
        border: 3px solid var(--ink);
        border-radius: 14px;
        padding: 20px 22px;
        box-shadow: 5px 5px 0 var(--ink);
        z-index: 15;
        font-family: 'Georgia', serif;
        color: var(--ink);
      }
      .td-shop-speaker {
        font-weight: bold;
        font-size: 18px;
        margin-bottom: 10px;
        border-bottom: 2px solid var(--ink);
        padding-bottom: 6px;
      }
      .td-shop-panel p { line-height: 1.5; margin: 0 0 16px; }
      .td-reading-text {
        background: #fff9ec;
        border-left: 4px solid var(--gold);
        padding: 12px 14px;
        font-style: italic;
        border-radius: 4px;
      }
      .td-answer-list { display: flex; flex-direction: column; gap: 8px; }
      .td-answer-btn { text-align: left; }
      .td-wrong-hint { color: var(--red); font-size: 14px; margin-top: 10px; }

      /* Världsbutikens matcha-spel */
      .td-world-game {
        position: absolute;
        left: 50%; bottom: 4%;
        transform: translateX(-50%);
        width: 90%;
        max-width: 760px;
        background: rgba(253, 243, 216, 0.94);
        border: 3px solid var(--ink);
        border-radius: 14px;
        padding: 16px;
        box-shadow: 4px 4px 0 var(--ink);
        z-index: 15;
        font-family: 'Georgia', serif;
        color: var(--ink);
      }
      .td-world-instructions { font-weight: bold; text-align: center; margin-bottom: 12px; }
      .td-world-items { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; margin-bottom: 14px; }
      .td-world-item {
        display: flex; flex-direction: column; align-items: center; gap: 4px;
        background: var(--cream); border: 2.5px solid var(--ink); border-radius: 10px;
        padding: 8px 12px; cursor: pointer; font-family: 'Georgia', serif;
        font-size: 13px; font-weight: bold; transition: transform 0.15s;
      }
      .td-world-item-icon { font-size: 30px; }
      .td-world-item:hover { transform: translateY(-3px); }
      .td-world-item-sel { background: var(--gold); box-shadow: 0 0 0 3px var(--ink); }
      .td-world-regions { display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
      .td-world-region {
        min-width: 120px; min-height: 64px;
        background: #e9dcc0; border: 2.5px dashed var(--ink); border-radius: 10px;
        padding: 8px; cursor: pointer; font-family: 'Georgia', serif;
        font-weight: bold; display: flex; flex-direction: column; align-items: center;
        justify-content: center; gap: 4px; transition: background 0.2s;
      }
      .td-world-region:hover { background: #f0e6cf; }
      .td-world-filled { background: #d4e6c8; border-style: solid; }
      .td-world-region-icon { font-size: 28px; }
      .td-world-wrong { animation: tdWorldShake 0.3s; background: #f0c0bc; }
      @keyframes tdWorldShake {
        0%,100% { transform: translateX(0); }
        25% { transform: translateX(-6px); }
        75% { transform: translateX(6px); }
      }
      .td-world-done { text-align: center; }
      .td-world-done p { font-size: 18px; font-weight: bold; margin-bottom: 12px; }

      /* Kart-spelplanen — riktiga kartan med klickzoner */
      .td-world-game-map { max-width: 640px; }
      .td-map-board {
        position: relative;
        width: 100%;
        aspect-ratio: 485 / 249;
        margin: 0 auto 14px;
        background-size: cover;
        background-position: center;
        border: 3px solid var(--ink);
        border-radius: 10px;
        overflow: hidden;
        box-shadow: inset 0 0 0 2px rgba(58,42,23,0.2);
      }
      .td-map-zone {
        position: absolute;
        background: transparent;
        border: 2px dashed transparent;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        transition: background 0.2s, border-color 0.2s;
      }
      .td-map-zone-label {
        font-family: 'Georgia', serif;
        font-weight: bold;
        font-size: 14px;
        color: var(--ink);
        text-shadow: 0 0 4px rgba(253,243,216,0.9), 0 0 4px rgba(253,243,216,0.9);
        pointer-events: none;
      }
      .td-map-zone-icon { font-size: 26px; pointer-events: none; filter: drop-shadow(0 1px 2px rgba(0,0,0,0.4)); }
      .td-map-zone:hover { background: rgba(253,201,77,0.25); }
      .td-map-active { border-color: rgba(253,201,77,0.7); }
      .td-map-active:hover { background: rgba(253,201,77,0.45); }
      .td-map-filled { background: rgba(95,168,96,0.4); border-color: rgba(95,168,96,0.8); border-style: solid; }
      .td-map-wrong { background: rgba(192,57,43,0.4); animation: tdWorldShake 0.3s; }

      /* === DEN GLÖMDA GROTTAN === */
      .td-cave-clue {
        position: absolute;
        top: 16px; left: 50%; transform: translateX(-50%);
        background: rgba(45, 32, 18, 0.88);
        color: #f5e6c4;
        border: 2px solid var(--gold);
        border-radius: 10px;
        padding: 10px 20px;
        font-family: 'Georgia', serif;
        font-size: 16px;
        max-width: 80%;
        text-align: center;
        z-index: 15;
        box-shadow: 0 3px 10px rgba(0,0,0,0.5);
      }
      .td-cave-clue-final { background: rgba(45,32,18,0.9); border-color: var(--green); }
      .td-clue-narrow { max-width: 420px; width: auto; font-size: 15px; padding: 8px 16px; }
      .td-cave-choices {
        position: absolute;
        bottom: 8%; left: 50%; transform: translateX(-50%);
        display: flex; gap: 16px; flex-wrap: wrap; justify-content: center;
        z-index: 15;
      }
      .td-cave-choice {
        font-size: 17px;
        padding: 14px 22px;
        background: rgba(45, 32, 18, 0.92);
        color: #f5e6c4;
        border: 2.5px solid var(--gold);
        box-shadow: 3px 3px 0 rgba(0,0,0,0.4);
      }
      .td-cave-choice:hover { background: rgba(70, 50, 28, 0.95); transform: translateY(-2px); }
      .td-cave-choice-fwd { border-color: var(--green); }
      .td-cave-detour {
        position: absolute;
        bottom: 6%; left: 50%; transform: translateX(-50%);
        width: 90%; max-width: 560px;
        background: var(--cream);
        border: 3px solid var(--ink);
        border-radius: 14px;
        padding: 20px 24px;
        box-shadow: 5px 5px 0 var(--ink);
        z-index: 16;
        font-family: 'Georgia', serif;
        color: var(--ink);
        text-align: center;
      }
      .td-cave-detour .td-shop-speaker { border: none; font-size: 19px; margin-bottom: 8px; }
      .td-cave-detour p { line-height: 1.5; margin: 0 0 16px; }
      .td-cave-detour .td-btn { margin: 0 6px; }
      .td-cave-found { font-style: italic; color: #7a6a4a; }
      /* Detour-vy med bakgrundsbild: panelen läggs ovanpå med mörk bakgrund */
      .td-cave-detour-onimg {
        background: rgba(28, 20, 10, 0.82);
        border-color: var(--cream);
        color: var(--cream);
        box-shadow: 5px 5px 0 rgba(0,0,0,0.45);
      }
      .td-cave-detour-onimg .td-shop-speaker { color: #fff; }
      .td-cave-detour-onimg .td-cave-found { color: #d8c9a8; }
      .td-riddle-text {
        background: #fff9ec;
        border-left: 4px solid var(--gold);
        padding: 12px 14px;
        border-radius: 4px;
        font-size: 17px;
      }
      .td-cave-riddle .td-answer-list { margin-top: 8px; }

      .td-paper-tag {
        position: absolute;
        background: #fdf3d8;
        border: 2.5px solid var(--ink);
        padding: 4px 14px;
        font-weight: bold; font-size: 14px;
        color: var(--ink); font-family: 'Georgia', serif;
        white-space: nowrap;
        box-shadow: 2px 3px 0 var(--ink);
        pointer-events: none;
        animation: tdTagWiggle 3.5s ease-in-out infinite;
        transition: transform 0.25s ease, filter 0.25s ease;
      }
      .td-paper-tag::before {
        content: ""; position: absolute;
        top: -10px; left: 50%; margin-left: -1px;
        width: 2px; height: 10px; background: var(--ink);
      }
      .td-paper-tag::after {
        content: ""; position: absolute;
        top: -14px; left: 50%; margin-left: -5px;
        width: 10px; height: 10px;
        background: var(--red);
        border: 2px solid var(--ink);
        border-radius: 50%;
        box-shadow: 1px 1px 0 var(--ink);
      }
      @keyframes tdTagWiggle {
        0%, 100% { filter: brightness(1); }
        50% { filter: brightness(1.08); }
      }

      .td-tagged-primary .td-paper-tag {
        background: var(--gold); font-size: 15px; padding: 5px 18px;
      }
      .td-tagged-primary:hover .td-tagged-glow {
        background: radial-gradient(
          ellipse at center,
          rgba(253, 201, 77, 0.5) 0%,
          rgba(253, 201, 77, 0.22) 50%,
          rgba(253, 201, 77, 0.04) 100%
        );
      }

      .td-tagged-treasure .td-paper-tag {
        background: var(--gold);
        animation: tdTagShimmer 1.5s ease-in-out infinite;
        font-size: 13px;
      }
      @keyframes tdTagShimmer {
        0%, 100% {
          filter: brightness(1);
          box-shadow: 2px 3px 0 var(--ink), 0 0 0 rgba(253, 201, 77, 0);
        }
        50% {
          filter: brightness(1.15);
          box-shadow: 2px 3px 0 var(--ink), 0 0 18px rgba(253, 201, 77, 0.9);
        }
      }
      .td-tagged-treasure .td-tagged-glow {
        background: radial-gradient(
          ellipse at center,
          rgba(253, 201, 77, 0.25) 0%,
          rgba(253, 201, 77, 0.08) 60%,
          rgba(253, 201, 77, 0) 100%
        );
        animation: tdTreasureGlow 2s ease-in-out infinite;
      }
      @keyframes tdTreasureGlow {
        0%, 100% { opacity: 0.7; }
        50% { opacity: 1; }
      }
      .td-tagged-treasure:hover .td-tagged-glow {
        background: radial-gradient(
          ellipse at center,
          rgba(253, 201, 77, 0.55) 0%,
          rgba(253, 201, 77, 0.25) 50%,
          rgba(253, 201, 77, 0.05) 100%
        );
        animation: none; opacity: 1;
      }

      .td-tagged-valve .td-paper-tag {
        background: var(--red); color: var(--cream); font-size: 13px;
      }
      .td-tagged-valve .td-paper-tag::after { background: var(--gold); }
      .td-tagged-valve .td-tagged-glow {
        background: radial-gradient(
          ellipse at center,
          rgba(217, 76, 61, 0.3) 0%,
          rgba(217, 76, 61, 0.1) 60%,
          rgba(217, 76, 61, 0) 100%
        );
        animation: tdValvePulse 2s ease-in-out infinite;
      }
      @keyframes tdValvePulse {
        0%, 100% { opacity: 0.5; }
        50% { opacity: 1; }
      }
      .td-tagged-valve:hover .td-tagged-glow {
        background: radial-gradient(
          ellipse at center,
          rgba(217, 76, 61, 0.6) 0%,
          rgba(217, 76, 61, 0.25) 50%,
          rgba(217, 76, 61, 0.05) 100%
        );
        animation: none; opacity: 1;
      }

      .td-valve-knob {
        position: absolute; inset: 10%;
        pointer-events: none;
        transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
      }
      .td-valve-knob svg { width: 100%; height: 100%; }
      .td-valve-twisting .td-valve-knob { transform: rotate(90deg); }
      .td-valve-twisting .td-tagged-glow {
        background: radial-gradient(
          ellipse at center,
          rgba(217, 76, 61, 0.8) 0%,
          rgba(217, 76, 61, 0.3) 50%,
          rgba(217, 76, 61, 0.05) 100%
        ) !important;
        animation: none !important; opacity: 1 !important;
      }
      .td-valve-running .td-valve-knob { transform: rotate(90deg); }
      .td-valve-running .td-tagged-glow {
        background: radial-gradient(
          ellipse at center,
          rgba(217, 76, 61, 1) 0%,
          rgba(253, 201, 77, 0.6) 40%,
          rgba(217, 76, 61, 0.1) 100%
        ) !important;
        animation: tdValveBurning 0.2s ease-in-out infinite !important;
        opacity: 1 !important;
      }
      @keyframes tdValveBurning {
        0%, 100% { filter: brightness(1.3); }
        50% { filter: brightness(1.7); }
      }
      .td-valve-cooling { cursor: not-allowed; opacity: 0.5; }
      .td-valve-cooling .td-valve-knob {
        transform: rotate(45deg); filter: grayscale(80%);
      }
      .td-valve-cooling .td-tagged-glow {
        background: radial-gradient(
          ellipse at center,
          rgba(120, 120, 120, 0.3) 0%,
          rgba(120, 120, 120, 0.1) 60%,
          rgba(120, 120, 120, 0) 100%
        ) !important;
        animation: none !important;
      }
      .td-valve-cooling .td-paper-tag {
        background: #888 !important; color: var(--cream);
      }
      .td-valve-cooling .td-paper-tag::after { background: #555 !important; }

      .td-tagged:hover .td-paper-tag {
        animation-play-state: paused;
        filter: brightness(1.12);
      }

      .td-trapdoor {
        position: absolute;
        width: 28px; height: 28px;
        background: radial-gradient(circle,
          rgba(253, 201, 77, 0.9) 0%,
          rgba(253, 201, 77, 0.4) 40%,
          rgba(253, 201, 77, 0) 80%);
        border: 2px solid var(--ink);
        border-radius: 50%;
        cursor: pointer; padding: 0; z-index: 5;
        transform: translate(-50%, -50%);
        animation: tdTrapdoorAppear 0.4s ease, tdTrapdoorPulse 0.8s ease-in-out infinite 0.4s;
        box-shadow:
          0 0 20px rgba(253, 201, 77, 0.9),
          0 0 40px rgba(253, 201, 77, 0.5),
          2px 2px 0 var(--ink);
      }
      @keyframes tdTrapdoorAppear {
        from { opacity: 0; transform: translate(-50%, -50%) scale(0.3); }
        to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
      }
      @keyframes tdTrapdoorPulse {
        0%, 100% { transform: translate(-50%, -50%) scale(1); }
        50% { transform: translate(-50%, -50%) scale(1.2); }
      }
      .td-trapdoor:hover {
        background: radial-gradient(circle,
          rgba(253, 201, 77, 1) 0%,
          rgba(253, 201, 77, 0.6) 40%,
          rgba(253, 201, 77, 0) 80%);
      }

      .td-character-figure {
        position: absolute; bottom: 0; left: 32%;
        height: 70%; width: auto;
        background: transparent; border: none; padding: 0;
        cursor: pointer; z-index: 4;
        transition: filter 0.25s ease, transform 0.25s ease;
        animation: tdCharSway 4s ease-in-out infinite;
        transform-origin: bottom center;
        filter: drop-shadow(4px 6px 8px rgba(0, 0, 0, 0.4));
      }
      .td-character-figure img {
        height: 100%; width: auto; display: block;
        pointer-events: none;
      }
      /* Murre — katten bredvid Klonks fötter */
      .td-murre {
        position: absolute; bottom: -1%; left: 47%;
        height: 17%; width: auto;
        background: transparent; border: none; padding: 0;
        cursor: pointer; z-index: 5;
        transition: transform 0.2s ease;
        filter: drop-shadow(3px 4px 5px rgba(0,0,0,0.35));
      }
      .td-murre img { height: 100%; width: auto; display: block; pointer-events: none; }
      .td-murre:hover { transform: scale(1.05); }
      @keyframes tdCharSway {
        0%, 100% { transform: rotate(-0.5deg); }
        50% { transform: rotate(0.5deg); }
      }
      .td-character-surprised {
        animation: tdCharSurprised 0.4s ease-in-out infinite !important;
      }
      @keyframes tdCharSurprised {
        0%, 100% { transform: translateY(0) rotate(-2deg); }
        50% { transform: translateY(-8px) rotate(2deg); }
      }
      .td-character-figure:hover {
        animation-play-state: paused;
        transform: rotate(0deg) scale(1.03);
        filter: drop-shadow(4px 6px 8px rgba(0, 0, 0, 0.4))
                drop-shadow(0 0 18px rgba(253, 201, 77, 0.8));
      }
      .td-character-bubble {
        position: absolute; top: 8%; right: -6%;
        width: 34px; height: 34px;
        background: var(--gold); border: 2.5px solid var(--ink);
        border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        font-size: 20px; font-weight: 900; color: var(--ink);
        box-shadow: 2px 2px 0 var(--ink);
        animation: tdBubbleFloat 2.4s ease-in-out infinite;
      }
      @keyframes tdBubbleFloat {
        0%, 100% { transform: translateY(0); opacity: 0.9; }
        50% { transform: translateY(-4px); opacity: 1; }
      }
      .td-character-bubble-surprised {
        background: var(--red) !important; color: var(--cream) !important;
        font-size: 18px !important;
        animation: tdBubbleSurprised 0.2s ease-in-out infinite !important;
        width: 40px !important; height: 40px !important;
      }
      @keyframes tdBubbleSurprised {
        0%, 100% { transform: scale(1) rotate(-5deg); }
        50% { transform: scale(1.2) rotate(5deg); }
      }

      .td-scene-hint {
        position: absolute; bottom: 12px; left: 50%; transform: translateX(-50%);
        background: rgba(40, 30, 18, 0.7); color: var(--cream);
        padding: 6px 18px; border-radius: 20px;
        font-style: italic; font-size: 13px;
        pointer-events: none; white-space: nowrap; z-index: 5;
      }

      /* === HAMNENS KARAKTÄRER === */
      /* === HAMNENS KARAKTÄRER (full-body) === */
      .td-harbor-character {
        position: absolute;
        background: transparent;
        border: none;
        cursor: pointer;
        padding: 0;
        z-index: 4;
        animation: tdHarborBreathe 3.5s ease-in-out infinite;
        filter: drop-shadow(3px 6px 6px rgba(0, 0, 0, 0.4));
        transition: transform 0.2s ease;
      }
      /* Skugga på marken vid karaktärens fötter — förankrar dem visuellt */
      .td-harbor-character::before {
        content: "";
        position: absolute;
        bottom: -1.5%;
        left: 50%;
        transform: translateX(-50%);
        width: 75%;
        height: 5%;
        background: radial-gradient(
          ellipse at center,
          rgba(20, 12, 5, 0.55) 0%,
          rgba(20, 12, 5, 0.3) 40%,
          rgba(20, 12, 5, 0) 75%
        );
        pointer-events: none;
        z-index: -1;
      }
      @keyframes tdHarborBreathe {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-3px); }
      }
      .td-harbor-character:hover {
        transform: scale(1.04) translateY(-4px);
        animation-play-state: paused;
        z-index: 6;
      }
      .td-harbor-character:focus { outline: none; }
      .td-harbor-character:focus-visible {
        outline: 3px dashed rgba(253, 201, 77, 0.7);
        outline-offset: 4px;
        border-radius: 8px;
      }

      /* Bilden — fyller hela containern */
      .td-harbor-character-img {
        width: 100%;
        height: 100%;
        display: block;
        object-fit: contain;
        pointer-events: none;
      }

      /* Spegelvänd för Berit så hon lutar åt rätt håll mot kajens lådor */
      .td-harbor-mirror .td-harbor-character-img {
        transform: scaleX(-1);
      }

      /* Mark under karaktären — gulden glöd vid fötterna */
      .td-harbor-character-glow {
        position: absolute;
        bottom: -3%;
        left: 50%;
        transform: translateX(-50%);
        width: 100%;
        height: 12%;
        background: radial-gradient(
          ellipse at center,
          rgba(253, 201, 77, 0.6) 0%,
          rgba(253, 201, 77, 0) 70%
        );
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.25s ease;
      }
      .td-harbor-character:hover .td-harbor-character-glow {
        opacity: 1;
      }

      /* Namnskylt OVANFÖR huvudet — så den alltid syns även om karaktären är vid scenens kant */
      .td-harbor-character-tag {
        position: absolute;
        top: -28px;
        bottom: auto;
        left: 50%;
        transform: translateX(-50%) rotate(-2deg);
        background: var(--cream);
        border: 2px solid var(--ink);
        padding: 3px 10px;
        font-weight: bold;
        font-size: 12px;
        color: var(--ink);
        font-family: 'Georgia', serif;
        white-space: nowrap;
        box-shadow: 2px 2px 0 var(--ink);
        pointer-events: none;
        z-index: 5;
      }

      /* === Specialvarianter === */
      /* Falk — huvudpersonen får gulden ring och pulserar */
      .td-harbor-primary .td-harbor-character-tag {
        background: var(--gold);
      }
      .td-harbor-primary .td-harbor-character-glow {
        opacity: 0.6;
        animation: tdHarborPrimaryPulse 2.5s ease-in-out infinite;
      }
      @keyframes tdHarborPrimaryPulse {
        0%, 100% { opacity: 0.5; }
        50% { opacity: 0.95; }
      }

      /* Lasse — kikar nervöst åt sidan */
      .td-harbor-suspicious .td-harbor-character-img {
        animation: tdLasseNervous 5s ease-in-out infinite;
        transform-origin: bottom center;
      }
      @keyframes tdLasseNervous {
        0%, 40%, 100% { transform: rotate(0deg); }
        50%, 60% { transform: rotate(-3deg); }
        70%, 80% { transform: rotate(3deg); }
      }
      .td-harbor-suspicious .td-harbor-character-tag {
        background: #d4c098;
        font-style: italic;
      }

      /* Främlingen — svajande mystiskt */
      .td-harbor-mystery .td-harbor-character-img {
        animation: tdMysterySway 7s ease-in-out infinite;
        transform-origin: bottom center;
        filter: brightness(0.95) saturate(0.85);
      }
      @keyframes tdMysterySway {
        0%, 100% { transform: rotate(-1.5deg); }
        50% { transform: rotate(1.5deg); }
      }
      .td-harbor-mystery .td-harbor-character-tag {
        background: #c4b6d4;
        color: #3a2a4a;
      }

      /* === FALKS PIPRÖK === */
      .td-harbor-smoke {
        position: absolute;
        left: 62%;
        top: 12%;
        width: 30px;
        height: 70px;
        pointer-events: none;
        z-index: 5;
      }
      .td-harbor-smoke-puff {
        position: absolute;
        bottom: 0;
        left: 50%;
        width: 12px;
        height: 12px;
        background: radial-gradient(circle,
          rgba(220, 210, 200, 0.85) 0%,
          rgba(220, 210, 200, 0) 70%);
        border-radius: 50%;
        opacity: 0;
        animation: tdSmokeRise 4s ease-out infinite;
      }
      .td-harbor-smoke-1 { animation-delay: 0s; }
      .td-harbor-smoke-2 { animation-delay: 1.3s; }
      .td-harbor-smoke-3 { animation-delay: 2.6s; }
      @keyframes tdSmokeRise {
        0% {
          transform: translate(-50%, 0) scale(0.4);
          opacity: 0;
        }
        15% { opacity: 0.7; }
        60% {
          transform: translate(-30%, -40px) scale(1.3);
          opacity: 0.5;
        }
        100% {
          transform: translate(-10%, -80px) scale(2);
          opacity: 0;
        }
      }

      /* === VATTENGLITTER === */
      .td-harbor-shimmer {
        position: absolute;
        width: 5px;
        height: 5px;
        background: rgba(255, 255, 255, 0.9);
        border-radius: 50%;
        pointer-events: none;
        z-index: 2;
        animation: tdHarborShimmer 3s ease-in-out infinite;
        box-shadow: 0 0 6px rgba(255, 240, 200, 0.7);
      }
      @keyframes tdHarborShimmer {
        0%, 100% { opacity: 0; transform: scale(0.3); }
        50% { opacity: 1; transform: scale(1.4); }
      }

      /* === LYKTOR — varma puls === */
      .td-harbor-lantern {
        position: absolute;
        width: 24px;
        height: 24px;
        pointer-events: none;
        z-index: 2;
        background: radial-gradient(circle,
          rgba(253, 201, 77, 0.6) 0%,
          rgba(253, 201, 77, 0.15) 40%,
          rgba(253, 201, 77, 0) 80%);
        border-radius: 50%;
        animation: tdLanternPulse 3s ease-in-out infinite;
        transform: translate(-50%, -50%);
      }
      @keyframes tdLanternPulse {
        0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(0.9); }
        50% { opacity: 0.95; transform: translate(-50%, -50%) scale(1.15); }
      }

      /* === FYRENS BLINK === */
      .td-harbor-lighthouse {
        position: absolute;
        width: 18px;
        height: 18px;
        pointer-events: none;
        z-index: 2;
        background: radial-gradient(circle,
          rgba(253, 201, 77, 0.95) 0%,
          rgba(253, 201, 77, 0.3) 40%,
          rgba(253, 201, 77, 0) 80%);
        border-radius: 50%;
        animation: tdHarborLighthouseBlink 5s ease-in-out infinite;
        transform: translate(-50%, -50%);
      }
      @keyframes tdHarborLighthouseBlink {
        0%, 88%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
        4%, 12% { opacity: 1; transform: translate(-50%, -50%) scale(1.3); }
        20% { opacity: 0.2; }
        30%, 40% { opacity: 0.9; transform: translate(-50%, -50%) scale(1.1); }
        55% { opacity: 0; }
      }

      /* === MÅSE PÅ PÅLLARE === */
      .td-harbor-seagull {
        position: absolute;
        width: 18px;
        height: 18px;
        pointer-events: none;
        z-index: 3;
        animation: tdSeagullPeck 6s ease-in-out infinite;
        transform-origin: bottom center;
      }
      .td-harbor-seagull::before {
        content: "";
        position: absolute;
        inset: 0;
        background: radial-gradient(ellipse 60% 40% at 50% 40%,
          rgba(0, 0, 0, 0.15) 0%, rgba(0, 0, 0, 0) 80%);
        border-radius: 50%;
      }
      @keyframes tdSeagullPeck {
        0%, 70%, 100% { transform: rotate(0deg); }
        75%, 78% { transform: rotate(-15deg); }
        82%, 85% { transform: rotate(0deg); }
        88% { transform: rotate(-12deg); }
        92% { transform: rotate(0deg); }
      }

      /* === FÅGEL SOM FLYGER FÖRBI === */
      .td-harbor-bird-fly {
        position: absolute;
        top: 18%;
        left: -5%;
        width: 28px;
        height: 14px;
        pointer-events: none;
        z-index: 2;
        opacity: 0.55;
        animation: tdHarborBirdFly 22s linear infinite;
        animation-delay: 8s;
      }
      @keyframes tdHarborBirdFly {
        0% { left: -5%; top: 18%; }
        25% { top: 14%; }
        50% { top: 20%; }
        75% { top: 15%; }
        100% { left: 105%; top: 18%; }
      }

      /* === VÄSKAN (INVENTORY) === */
      .td-inventory-btn {
        position: fixed;
        top: 14px;
        right: 16px;
        z-index: 100;
        width: 76px; height: 76px;
        background: var(--cream);
        border: 3px solid var(--ink);
        border-radius: 14px;
        padding: 6px;
        cursor: pointer;
        box-shadow: 4px 4px 0 var(--ink);
        transition: transform 0.15s ease, box-shadow 0.15s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 0;
      }
      .td-inventory-btn:hover {
        transform: translate(-2px, -2px);
        box-shadow: 6px 6px 0 var(--ink);
      }
      .td-inventory-btn:hover .td-inventory-bag-img {
        animation: tdBagWobble 0.6s ease-in-out;
      }
      .td-inventory-btn:active {
        transform: translate(2px, 2px);
        box-shadow: 2px 2px 0 var(--ink);
      }
      .td-inventory-bag-img {
        display: block;
        max-width: 100%;
        max-height: 100%;
        width: auto;
        height: auto;
        object-fit: contain;
      }
      @keyframes tdBagWobble {
        0%, 100% { transform: rotate(0deg); }
        25% { transform: rotate(-6deg); }
        75% { transform: rotate(6deg); }
      }
      .td-inventory-count {
        position: absolute;
        top: -8px;
        right: -8px;
        background: var(--red);
        color: var(--cream);
        border: 2.5px solid var(--ink);
        border-radius: 999px;
        min-width: 28px;
        height: 28px;
        padding: 0 7px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        font-size: 15px;
        font-weight: bold;
        line-height: 1;
        font-family: 'Georgia', serif;
        box-shadow: 2px 2px 0 var(--ink);
      }

      .td-inventory-overlay {
        position: fixed;
        inset: 0;
        background: rgba(20, 12, 5, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 200;
        padding: 20px;
        animation: tdFadeIn 0.25s ease;
      }
      .td-inventory-modal {
        background: var(--cream);
        border: 4px solid var(--ink);
        border-radius: 10px;
        padding: 0;
        max-width: 580px;
        width: 100%;
        max-height: 88vh;
        overflow-y: auto;
        box-shadow: 10px 10px 0 var(--ink);
        animation: tdDetailIn 0.3s ease;
      }
      .td-inventory-header {
        background: var(--ink);
        color: var(--cream);
        padding: 14px 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 3px solid var(--gold);
      }
      .td-inventory-header h2 {
        margin: 0;
        font-size: 22px;
        font-family: 'Georgia', serif;
        letter-spacing: 1px;
      }
      .td-inventory-close {
        background: transparent;
        border: 2px solid var(--cream);
        color: var(--cream);
        width: 32px;
        height: 32px;
        font-size: 20px;
        font-weight: bold;
        cursor: pointer;
        border-radius: 999px;
        padding: 0;
        line-height: 1;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .td-inventory-close:hover {
        background: var(--cream);
        color: var(--ink);
      }
      .td-inventory-empty {
        padding: 40px 30px;
        text-align: center;
      }
      .td-inventory-empty-icon {
        font-size: 56px;
        margin-bottom: 16px;
        opacity: 0.5;
      }
      .td-inventory-empty p {
        font-size: 16px;
        font-style: italic;
        color: #5a4a3a;
        margin: 0;
      }
      .td-inventory-grid {
        padding: 20px;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
        gap: 14px;
      }
      .td-inventory-item {
        background: #f0e2c4;
        border: 2.5px solid var(--ink);
        border-radius: 8px;
        padding: 14px 8px 10px;
        cursor: pointer;
        text-align: center;
        transition: transform 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
        font-family: 'Georgia', serif;
      }
      .td-inventory-item:hover {
        transform: translateY(-3px);
        background: var(--gold);
        box-shadow: 3px 5px 0 var(--ink);
      }
      .td-inventory-item-selected {
        background: var(--gold);
        box-shadow: 3px 5px 0 var(--ink);
      }
      .td-inventory-item-icon {
        font-size: 38px;
        margin-bottom: 6px;
        line-height: 1;
      }
      .td-inventory-item-name {
        font-size: 12px;
        font-weight: bold;
        color: var(--ink);
      }
      .td-inventory-detail {
        margin: 0 20px 20px;
        background: #fffaef;
        border: 2.5px solid var(--ink);
        border-radius: 8px;
        padding: 16px;
      }
      .td-inventory-detail-header {
        display: flex;
        align-items: center;
        gap: 14px;
        margin-bottom: 12px;
        padding-bottom: 12px;
        border-bottom: 2px dashed var(--ink);
      }
      .td-inventory-detail-icon {
        font-size: 42px;
        line-height: 1;
      }
      .td-inventory-detail-name {
        font-size: 18px;
        font-weight: bold;
        font-family: 'Georgia', serif;
        color: var(--ink);
      }
      .td-inventory-detail-from {
        font-size: 12px;
        color: var(--red);
        font-style: italic;
        margin-top: 2px;
      }
      .td-inventory-detail-desc {
        font-size: 15px;
        line-height: 1.5;
        margin: 0;
        color: #3a2a17;
      }
      .td-inventory-hint {
        text-align: center;
        font-style: italic;
        color: #7a6a55;
        margin: 0 20px 20px;
        font-size: 13px;
      }

      /* === BÅTSPELET === */
      .td-boat-game {
        position: fixed;
        inset: 0;
        background: #1a1208;
        display: flex;
        flex-direction: column;
      }
      .td-boat-topbar {
        background: var(--cream);
        border-bottom: 3px solid var(--ink);
        padding: 6px 14px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        z-index: 5;
        min-height: 44px;
      }
      .td-boat-status {
        background: var(--gold);
        border: 2px solid var(--ink);
        padding: 4px 14px;
        font-weight: bold;
        font-size: 13px;
        letter-spacing: 0.5px;
        box-shadow: 2px 2px 0 var(--ink);
        transform: rotate(-1deg);
      }
      .td-boat-stage-wrap {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        padding: 4px;
        background: #1a1208;
      }
      .td-boat-stage {
        position: relative;
        aspect-ratio: 3 / 4;
        max-height: 100%;
        height: 100%;
        background: #d4b896; /* papper-färg för utanför kartan */
        border: 3px solid var(--ink);
        border-radius: 4px;
        box-shadow: 0 0 30px rgba(0, 0, 0, 0.7);
        cursor: pointer;
        touch-action: none;
        user-select: none;
        -webkit-user-select: none;
        overflow: hidden;
      }

      /* === WORLD — den faktiska kartan som rullar med båten === */
      .td-boat-world {
        position: absolute;
        top: 0;
        left: 0;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        will-change: transform;
        transform: translate3d(0, 0, 0);
      }

      /* === BÅTEN (sprite) === */
      .td-boat-sprite {
        position: absolute;
        width: 4.5%;
        height: auto;
        pointer-events: none;
        z-index: 10;
        filter: drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.6));
        will-change: transform, left, top;
        transition: transform 0.05s linear;
      }

      /* === BÅTENS SPÅR I VATTNET === */
      .td-boat-trail {
        position: absolute;
        transform: translate(-50%, -50%);
        width: 8px;
        height: 8px;
        background: radial-gradient(circle,
          rgba(255, 255, 255, 0.7) 0%,
          rgba(220, 240, 255, 0.4) 40%,
          rgba(255, 255, 255, 0) 75%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 6;
        animation: tdTrailFade 2.5s ease-out forwards;
      }
      @keyframes tdTrailFade {
        0% { opacity: 0.9; transform: translate(-50%, -50%) scale(0.4); }
        30% { opacity: 0.85; }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(2.5); }
      }

      /* === FYRLJUSET I BÅTSPELET === */
      .td-boat-lighthouse-light {
        position: absolute;
        transform: translate(-50%, -50%);
        width: 14%;
        aspect-ratio: 1 / 1;
        background: radial-gradient(circle,
          rgba(255, 230, 120, 0.85) 0%,
          rgba(255, 200, 80, 0.4) 25%,
          rgba(255, 180, 60, 0.15) 50%,
          rgba(255, 180, 60, 0) 75%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 4;
        animation: tdBoatLighthouseBlink 4.5s ease-in-out infinite;
      }
      @keyframes tdBoatLighthouseBlink {
        0%, 100% { opacity: 0; transform: translate(-50%, -50%) scale(0.4); }
        8%, 18% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
        26% { opacity: 0.3; }
        36%, 46% { opacity: 0.9; transform: translate(-50%, -50%) scale(1); }
        60% { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
      }

      /* === VIRVELN === */
      .td-boat-whirlpool-fx {
        position: absolute;
        transform: translate(-50%, -50%);
        pointer-events: none;
        z-index: 3;
      }
      .td-boat-whirlpool-ring {
        position: absolute;
        inset: 0;
        border: 2.5px solid rgba(240, 250, 255, 0.45);
        border-radius: 50%;
        animation: tdWhirlpoolRing 3.5s linear infinite;
      }
      .td-boat-whirlpool-ring-1 { animation-delay: 0s; }
      .td-boat-whirlpool-ring-2 { animation-delay: 1.2s; }
      .td-boat-whirlpool-ring-3 { animation-delay: 2.4s; }
      @keyframes tdWhirlpoolRing {
        0% {
          transform: rotate(0deg) scale(0.2);
          opacity: 0;
          border-color: rgba(255, 255, 255, 0.8);
        }
        15% { opacity: 0.7; }
        100% {
          transform: rotate(720deg) scale(1.2);
          opacity: 0;
          border-color: rgba(200, 230, 255, 0.2);
        }
      }

      /* === VATTENSPRUT VID KROCK === */
      .td-boat-splash {
        position: absolute;
        transform: translate(-50%, -50%);
        width: 30px;
        height: 30px;
        pointer-events: none;
        z-index: 12;
      }
      .td-boat-splash-drop {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 7px;
        height: 7px;
        margin: -3.5px 0 0 -3.5px;
        background: radial-gradient(circle,
          rgba(255, 255, 255, 0.95) 0%,
          rgba(200, 230, 255, 0.7) 40%,
          rgba(180, 210, 240, 0) 70%);
        border-radius: 50%;
        animation: tdSplashFly 0.7s ease-out forwards;
        transform-origin: center;
      }
      @keyframes tdSplashFly {
        0% {
          transform: rotate(var(--angle)) translateY(0) scale(0.3);
          opacity: 1;
        }
        100% {
          transform: rotate(var(--angle)) translateY(-35px) scale(1.6);
          opacity: 0;
        }
      }

      /* === MÅL-MARKÖR (fyren / hamnen) === */
      .td-boat-target-marker {
        position: absolute;
        transform: translate(-50%, -50%);
        width: 60px;
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 36px;
        color: var(--gold);
        text-shadow:
          0 0 10px rgba(253, 201, 77, 0.9),
          0 0 20px rgba(253, 201, 77, 0.6),
          2px 2px 0 var(--ink);
        pointer-events: none;
        z-index: 5;
        animation: tdBoatTargetPulse 1.5s ease-in-out infinite;
      }
      @keyframes tdBoatTargetPulse {
        0%, 100% { transform: translate(-50%, -50%) scale(1); }
        50% { transform: translate(-50%, -50%) scale(1.25); }
      }

      /* === PEKAR-CIRKEL (där spelaren håller) === */
      .td-boat-pointer {
        position: absolute;
        transform: translate(-50%, -50%);
        width: 36px;
        height: 36px;
        border: 3px dashed var(--gold);
        border-radius: 50%;
        pointer-events: none;
        z-index: 8;
        animation: tdBoatPointerSpin 2s linear infinite;
        background: radial-gradient(circle,
          rgba(253, 201, 77, 0.25) 0%,
          rgba(253, 201, 77, 0) 70%);
        box-shadow: 0 0 12px rgba(253, 201, 77, 0.5);
      }
      @keyframes tdBoatPointerSpin {
        from { transform: translate(-50%, -50%) rotate(0deg); }
        to { transform: translate(-50%, -50%) rotate(360deg); }
      }

      /* === KRASCH-MEDDELANDE === */
      .td-boat-crash {
        position: absolute;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--red);
        color: var(--cream);
        border: 3px solid var(--ink);
        padding: 10px 24px;
        font-family: 'Georgia', serif;
        font-weight: bold;
        font-size: 18px;
        box-shadow: 4px 4px 0 var(--ink);
        z-index: 20;
        animation: tdBoatCrashIn 0.3s ease-out, tdBoatCrashShake 0.15s ease-in-out 3;
        pointer-events: none;
      }
      @keyframes tdBoatCrashIn {
        from { opacity: 0; transform: translateX(-50%) translateY(-20px) scale(0.7); }
        to { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); }
      }
      @keyframes tdBoatCrashShake {
        0%, 100% { transform: translateX(-50%) translateY(0); }
        25% { transform: translateX(calc(-50% - 4px)) translateY(0); }
        75% { transform: translateX(calc(-50% + 4px)) translateY(0); }
      }

      /* === HINT-TEXT === */
      .td-boat-hint {
        background: rgba(40, 30, 18, 0.9);
        color: var(--cream);
        padding: 5px 14px;
        text-align: center;
        font-style: italic;
        font-size: 12px;
        border-top: 1px solid var(--ink);
        min-height: 14px;
      }

      /* === ANLÄND-OVERLAY (fyren och hamnen) === */
      .td-boat-arrival-overlay {
        position: absolute;
        inset: 0;
        background: rgba(40, 30, 18, 0.75);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 50;
        animation: tdFadeIn 0.4s ease;
        padding: 20px;
      }
      .td-boat-arrival-card {
        background: var(--cream);
        border: 4px solid var(--ink);
        border-radius: 12px;
        padding: 28px;
        max-width: 460px;
        width: 100%;
        text-align: center;
        box-shadow: 10px 10px 0 var(--ink);
        animation: tdDetailIn 0.4s ease;
      }
      .td-boat-arrival-card p {
        font-size: 17px;
        line-height: 1.5;
        margin: 16px 0 24px;
      }
      .td-boat-arrival-card em {
        color: var(--red);
        display: block;
        margin-top: 8px;
      }
      .td-boat-success {
        background: var(--gold);
      }

      /* === EKAN — startknapp (i hamnen — kvar för bakåtkompatibilitet) === */
      .td-boat-launch {
        position: absolute;
        right: 4%; bottom: 15%;
        width: 14%;
        height: 18%;
        background: transparent;
        border: none;
        cursor: pointer;
        padding: 0;
        z-index: 5;
        animation: tdBoatBob 2.5s ease-in-out infinite;
      }
      @keyframes tdBoatBob {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-4px); }
      }
      .td-boat-launch-glow {
        position: absolute;
        inset: -10%;
        background: radial-gradient(
          ellipse at center,
          rgba(253, 201, 77, 0.5) 0%,
          rgba(253, 201, 77, 0) 70%
        );
        pointer-events: none;
        animation: tdValvePulse 2s ease-in-out infinite;
      }
      .td-boat-launch-tag {
        position: absolute;
        top: -25%; left: 50%;
        transform: translateX(-50%) rotate(-2deg);
        background: var(--red);
        color: var(--cream);
        border: 2.5px solid var(--ink);
        padding: 4px 14px;
        font-weight: bold;
        font-size: 14px;
        font-family: 'Georgia', serif;
        white-space: nowrap;
        box-shadow: 3px 3px 0 var(--ink);
        animation: tdTagWiggle 3s ease-in-out infinite;
      }

      /* === DIALOG MED PORTRÄTT === */
      .td-dialog-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 10px;
        padding-bottom: 10px;
        border-bottom: 2px dashed var(--ink);
      }
      .td-dialog-portrait {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        overflow: hidden;
        border: 2.5px solid var(--ink);
        flex-shrink: 0;
        box-shadow: 2px 2px 0 var(--ink);
        background: var(--paper);
      }
      .td-dialog-portrait img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
      }
      .td-dialog-name {
        font-size: 18px;
        color: var(--red);
        font-weight: bold;
        letter-spacing: 0.5px;
      }

      /* === BEFINTLIG DIALOG-BUBBLA === */
      .td-dialog-bubble {
        position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%);
        background: var(--cream);
        border: 3px solid var(--ink); border-radius: 12px;
        padding: 22px 24px 18px;
        box-shadow: 6px 6px 0 var(--ink);
        max-width: 600px; width: calc(100% - 40px);
        z-index: 60;
        animation: tdBubbleIn 0.25s ease;
      }
      .td-dialog-bubble::before {
        content: ""; position: absolute; top: -18px; left: 30px;
        width: 0; height: 0;
        border-left: 12px solid transparent;
        border-right: 12px solid transparent;
        border-bottom: 18px solid var(--ink);
      }
      .td-dialog-bubble::after {
        content: ""; position: absolute; top: -13px; left: 33px;
        width: 0; height: 0;
        border-left: 9px solid transparent;
        border-right: 9px solid transparent;
        border-bottom: 14px solid var(--cream);
      }
      @keyframes tdBubbleIn {
        from { opacity: 0; transform: translateX(-50%) translateY(20px); }
        to { opacity: 1; transform: translateX(-50%) translateY(0); }
      }
      .td-dialog-bubble p { margin: 0; font-size: 18px; line-height: 1.5; }
      .td-dialog-tip {
        margin-top: 8px; font-size: 12px;
        text-transform: uppercase; letter-spacing: 1px;
        opacity: 0.6; text-align: right;
      }

      .td-coming-soon {
        display: flex; align-items: center; justify-content: center;
        padding: 20px; height: 100%;
      }
      .td-coming-soon-card {
        background: var(--cream);
        border: 4px solid var(--ink); border-radius: 12px;
        padding: 32px; max-width: 480px; text-align: center;
        box-shadow: 10px 10px 0 var(--ink);
        transform: rotate(-1deg);
      }
      .td-coming-soon-card p { margin: 16px 0 24px; font-size: 17px; line-height: 1.5; }

      .td-detail-overlay {
        position: absolute; inset: 0;
        background: rgba(40, 30, 18, 0.85);
        display: flex; align-items: center; justify-content: center;
        z-index: 50; padding: 20px;
        animation: tdFadeIn 0.3s ease;
      }
      .td-detail-content {
        background: var(--cream);
        border: 4px solid var(--ink); border-radius: 12px;
        padding: 24px; max-width: 600px; width: 100%;
        max-height: 92vh; overflow-y: auto; text-align: center;
        box-shadow: 10px 10px 0 var(--ink);
        animation: tdDetailIn 0.4s ease;
        transform: rotate(-0.5deg);
      }
      @keyframes tdDetailIn {
        from { opacity: 0; transform: rotate(-0.5deg) scale(0.85); }
        to { opacity: 1; transform: rotate(-0.5deg) scale(1); }
      }
      .td-detail-stamp {
        display: inline-block;
        border: 2.5px solid var(--ink);
        padding: 6px 18px;
        font-size: 12px; letter-spacing: 2px;
        text-transform: uppercase; background: var(--paper);
        font-weight: bold; margin-bottom: 16px;
        box-shadow: 3px 3px 0 var(--ink);
        transform: rotate(-2deg);
      }
      .td-detail-image-wrap {
        margin: 12px 0; border: 3px solid var(--ink);
        border-radius: 4px; overflow: hidden;
        box-shadow: 4px 4px 0 var(--ink);
        display: inline-block; max-width: 100%;
      }
      .td-detail-image-wrap img {
        display: block; max-width: 100%; max-height: 50vh;
        width: auto; height: auto;
      }
      .td-detail-caption {
        font-size: 16px; line-height: 1.55;
        margin: 16px 0; font-style: italic; color: var(--ink);
      }

      .td-detail-window .td-window-frame {
        position: relative; margin: 12px auto;
        border: 4px solid var(--ink); background: var(--ink);
        overflow: hidden;
        box-shadow: 6px 6px 0 var(--ink);
        max-width: 100%; display: inline-block;
      }
      .td-window-view { display: block; }
      .td-window-view img {
        display: block; max-width: 100%; max-height: 50vh;
        width: auto; height: auto;
      }
      .td-window-shutter {
        position: absolute; top: 0; bottom: 0; width: 50%;
        background: linear-gradient(90deg,
          #6a4a28 0%, #8a6a48 20%, #6a4a28 40%,
          #8a6a48 60%, #6a4a28 80%, #4a3018 100%);
        z-index: 2; border-color: var(--ink);
      }
      .td-window-shutter-left {
        left: 0; border-right: 3px solid var(--ink);
        transform-origin: left center;
        animation: tdShutterOpenLeft 1.2s ease-out forwards;
        animation-delay: 0.3s;
        transform: rotateY(0deg);
      }
      .td-window-shutter-right {
        right: 0; border-left: 3px solid var(--ink);
        transform-origin: right center;
        animation: tdShutterOpenRight 1.2s ease-out forwards;
        animation-delay: 0.3s;
        transform: rotateY(0deg);
      }
      @keyframes tdShutterOpenLeft {
        0% { transform: perspective(800px) rotateY(0deg); }
        100% { transform: perspective(800px) rotateY(-110deg); }
      }
      @keyframes tdShutterOpenRight {
        0% { transform: perspective(800px) rotateY(0deg); }
        100% { transform: perspective(800px) rotateY(110deg); }
      }

      .td-overlay {
        position: fixed; inset: 0; z-index: 100;
        background: rgba(40, 30, 18, 0.65);
        display: flex; align-items: center; justify-content: center;
        padding: 20px; animation: fadeIn 0.2s ease;
      }
      @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      .td-overlay-card {
        background: var(--cream);
        border: 4px solid var(--ink); border-radius: 12px;
        padding: 28px; max-width: 700px; width: 100%;
        max-height: 90vh; overflow-y: auto;
        box-shadow: 10px 10px 0 var(--ink);
        animation: cardDrop 0.25s ease;
      }
      @keyframes cardDrop {
        from { transform: translateY(-30px) rotate(-2deg); opacity: 0; }
        to { transform: translateY(0) rotate(0); opacity: 1; }
      }
      .td-overlay-grand { text-align: center; }
      .td-overlay-header {
        display: flex; justify-content: space-between; align-items: center;
        margin-bottom: 18px; border-bottom: 2.5px solid var(--ink);
        padding-bottom: 14px; gap: 12px;
      }
      .td-overlay-host { display: flex; align-items: center; gap: 14px; }
      .td-overlay-host-img {
        width: 72px; height: 72px;
        border: 3px solid var(--ink); border-radius: 50%;
        overflow: hidden; flex-shrink: 0;
        box-shadow: 3px 3px 0 var(--ink); background: var(--paper);
      }
      .td-overlay-host-img img { width: 100%; height: 100%; object-fit: cover; }
      .td-overlay-host-name { font-size: 13px; font-style: italic; opacity: 0.75; margin-top: 2px; }
      .td-h2 { font-size: 28px; margin: 0; color: var(--ink); text-shadow: 2px 2px 0 var(--gold); }

      .td-mission-text {
        font-size: 18px; line-height: 1.55;
        background: var(--paper); padding: 16px;
        border-left: 5px solid var(--red);
        border-radius: 4px; margin: 0 0 20px;
      }
      .td-mission-text em { display: block; color: var(--red); font-size: 17px; margin-bottom: 8px; }

      .td-puzzle-step-label {
        font-size: 13px; text-align: center;
        text-transform: uppercase; letter-spacing: 2px;
        color: var(--ink); opacity: 0.7;
        margin: 0 0 12px; font-weight: bold;
      }

      .td-choices { display: flex; flex-direction: column; gap: 10px; }
      .td-choices-row { flex-direction: row; justify-content: center; flex-wrap: wrap; }
      .td-choice {
        background: var(--paper); border: 3px solid var(--ink);
        border-radius: 8px; padding: 14px 18px;
        font-family: inherit; font-size: 17px; font-weight: bold;
        cursor: pointer; text-align: left;
        box-shadow: 4px 4px 0 var(--ink);
        transition: transform 0.1s, box-shadow 0.1s, background 0.15s;
      }
      .td-choice:hover {
        background: var(--gold); transform: translate(-2px, -2px);
        box-shadow: 6px 6px 0 var(--ink);
      }
      .td-choice-visual, .td-choice-dot {
        display: flex; flex-direction: column; align-items: center;
        gap: 8px; text-align: center; min-width: 100px;
      }

      .td-clock { display: block; width: 180px; margin: 10px auto 20px; }
      /* Klocktornet: panel centrerad i rummet, tornbilden syns runtomkring */
      .td-clocktower-panel {
        position: absolute;
        top: 50%; left: 50%;
        transform: translate(-50%, -50%);
        width: min(440px, 90%);
        background: rgba(253, 243, 216, 0.94);
        border: 3px solid var(--ink);
        border-radius: 16px;
        box-shadow: 6px 6px 0 rgba(0,0,0,0.35);
        padding: 22px 24px;
        z-index: 10;
      }
      .td-clock-panel { text-align: center; }
      /* Papegojans gåtepanel: placerad vänster om fågeln */
      .td-parrot-panel {
        left: 30%;
        top: 50%;
        max-width: 380px;
        width: min(380px, 44%);
      }
      /* Flygande papegojan: svävar stilla, ingen svaj-animation */
      .td-parrot-fly {
        animation: none;
        bottom: auto;
        filter: drop-shadow(0 8px 12px rgba(0,0,0,0.3));
      }
      /* Urmakarens räknebara gökur */
      .td-count-clock {
        position: absolute;
        font-size: 38px;
        z-index: 8;
        filter: drop-shadow(2px 3px 3px rgba(0,0,0,0.4));
        transform: translate(-50%, -50%);
      }
      /* Leksaksmakarens minnesspel */
      .td-memory-toy {
        position: absolute;
        font-size: 46px;
        background: rgba(253,243,216,0.85);
        border: 3px solid var(--ink);
        border-radius: 14px;
        padding: 4px 8px;
        cursor: pointer;
        z-index: 9;
        transform: translate(-50%, -50%);
        transition: transform 0.15s, box-shadow 0.2s, background 0.2s;
      }
      .td-memory-toy:hover { transform: translate(-50%, -50%) scale(1.08); }
      .td-memory-toy-lit {
        background: var(--gold);
        box-shadow: 0 0 22px 6px rgba(253,201,77,0.9);
        transform: translate(-50%, -50%) scale(1.15);
      }
      .td-clock-draggable { width: 220px; touch-action: none; }

      /* === OBSERVATORIET === */
      .td-telescope-btn {
        position: absolute;
        left: 48%; top: 45%;
        transform: translate(-50%, -50%);
        width: 42%; height: 60%;
        background: transparent;
        border: none;
        cursor: pointer;
        z-index: 12;
      }
      .td-telescope-glow {
        position: absolute; inset: 0;
        border-radius: 50%;
        transition: background 0.3s ease;
      }
      .td-telescope-btn:hover .td-telescope-glow {
        background: radial-gradient(circle, rgba(255,230,150,0.28) 35%, rgba(255,230,150,0) 70%);
      }
      .td-starmap-wrap {
        position: absolute; inset: 0;
        background: #05060f;
        overflow: hidden;
      }
      .td-telescope-lens {
        position: absolute;
        left: 50%; top: 48%;
        transform: translate(-50%, -50%);
        width: min(80vh, 90%); height: min(80vh, 90%);
        max-width: 620px; max-height: 620px;
        border-radius: 50%;
        overflow: hidden;
        border: 14px solid #1a1206;
        box-shadow: 0 0 0 6px #3a2a17, 0 0 60px rgba(0,0,0,0.9) inset, 0 0 30px rgba(0,0,0,0.6);
        cursor: grab;
      }
      .td-telescope-lens:active { cursor: grabbing; }
      .td-starmap-pan {
        position: absolute;
        background-repeat: repeat;
        background-size: 1200px auto;
        background-color: #0a0c1a;
        touch-action: none;
        user-select: none;
      }
      .td-constellation-layer {
        position: absolute; inset: 0;
      }
      /* Zoom-knappar */
      .td-zoom-controls {
        position: absolute; bottom: 16px; right: 16px;
        display: flex; flex-direction: column; gap: 8px;
        z-index: 25;
      }
      .td-zoom-btn {
        width: 44px; height: 44px;
        font-size: 26px; font-weight: bold;
        background: rgba(20,24,48,0.85);
        color: #fff8d0;
        border: 2px solid var(--gold);
        border-radius: 10px;
        cursor: pointer;
        line-height: 1;
        display: flex; align-items: center; justify-content: center;
      }
      .td-zoom-btn:hover { background: rgba(40,48,90,0.95); }
      /* Stjärnfall som far diagonalt över linsen */
      .td-shooting-star {
        position: absolute;
        width: 90px; height: 2px;
        background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.95) 100%);
        border-radius: 2px;
        transform: rotate(35deg);
        z-index: 18;
        pointer-events: none;
        animation: tdShoot 1.2s ease-out forwards;
        filter: drop-shadow(0 0 4px rgba(255,255,255,0.8));
      }
      @keyframes tdShoot {
        0% { opacity: 0; transform: translate(0, 0) rotate(35deg); }
        15% { opacity: 1; }
        100% { opacity: 0; transform: translate(220px, 150px) rotate(35deg); }
      }
      .td-constellation-layer-old {
        position: absolute; inset: 0;
        width: 1000px; height: 700px;
      }
      .td-constellation { cursor: pointer; }
      .td-constellation-line {
        stroke: rgba(150,180,255,0);
        stroke-width: 2;
        transition: stroke 0.4s ease;
      }
      .td-constellation-star {
        fill: rgba(255,255,255,0.55);
        transition: fill 0.4s ease, r 0.4s ease;
      }
      .td-constellation:hover .td-constellation-star { fill: #fff; }
      .td-constellation-lit .td-constellation-line { stroke: rgba(170,200,255,0.9); }
      .td-constellation-lit .td-constellation-star {
        fill: #fff8d0;
        filter: drop-shadow(0 0 6px rgba(255,240,180,0.9));
      }
      /* Himlaobjekt: komet, planet, måne — diskreta tills man hittar dem */
      .td-sky-object { cursor: pointer; opacity: 0.5; transition: opacity 0.4s ease; }
      .td-sky-object:hover { opacity: 0.85; }
      .td-sky-object-lit { opacity: 1; }
      .td-comet-head { fill: #fff; filter: drop-shadow(0 0 5px rgba(200,220,255,0.9)); }
      .td-comet-tail { stroke: rgba(200,220,255,0.5); stroke-width: 4; stroke-linecap: round; }
      .td-sky-object-lit .td-comet-tail { stroke: rgba(210,230,255,0.95); }
      .td-planet-body { fill: #e8c98a; }
      .td-planet-ring { fill: none; stroke: #d8b878; stroke-width: 3; }
      .td-sky-object-lit .td-planet-body { filter: drop-shadow(0 0 6px rgba(232,201,138,0.9)); }
      .td-moon-body { fill: #f3efd8; }
      .td-moon-shadow { fill: #0a0c1a; }
      .td-sky-object-lit .td-moon-body { filter: drop-shadow(0 0 8px rgba(243,239,216,0.7)); }
      .td-starmap-names {
        position: absolute; top: 16px; left: 16px;
        display: flex; flex-direction: column; gap: 6px;
        z-index: 20;
      }
      .td-starmap-name {
        background: rgba(20,24,48,0.85);
        color: #fff8d0;
        border: 1px solid var(--gold);
        border-radius: 8px;
        padding: 5px 12px;
        font-family: 'Georgia', serif;
        font-size: 15px;
      }
      .td-starmap-hint { top: auto; bottom: 16px; }
      .td-starmap-back { position: absolute; top: 12px; right: 12px; z-index: 20; }
      .td-clock-locked { opacity: 0.9; }
      .td-clock-hint {
        text-align: center; font-size: 15px; color: #6b5836;
        font-style: italic; margin: 0 0 4px;
      }
      .td-clock-readout {
        text-align: center; font-size: 18px; color: var(--ink);
        margin: 0 0 14px;
      }
      .td-choice-check { font-size: 18px; }

      .td-puzzle-progress {
        display: flex; justify-content: center; gap: 10px;
        margin-bottom: 20px; flex-wrap: wrap;
      }
      .td-gear-indicator {
        width: 40px; height: 40px;
        opacity: 0.4;
        transition: opacity 0.3s, transform 0.3s;
      }
      .td-gear-indicator.active { opacity: 1; transform: scale(1.15); }
      .td-gear-indicator.solved {
        opacity: 1;
        animation: tdGearSolved 0.6s ease;
      }
      .td-gear-indicator.solved svg { animation: tdSpin 4s linear infinite; }
      @keyframes tdGearSolved {
        0% { transform: scale(0.5) rotate(0deg); }
        60% { transform: scale(1.25) rotate(60deg); }
        100% { transform: scale(1) rotate(45deg); }
      }

      .td-puzzle-sequence {
        display: flex; justify-content: center; align-items: center;
        gap: 8px; flex-wrap: wrap;
        margin: 20px 0; padding: 18px;
        background: var(--paper); border-radius: 8px;
        border: 2.5px dashed var(--ink);
      }
      .td-sequence-arrow { font-size: 16px; color: var(--ink); opacity: 0.5; }

      .td-puzzle-item {
        display: inline-block;
        border: 3px solid var(--ink);
        flex-shrink: 0;
      }
      .td-puzzle-item-mystery {
        display: inline-flex; align-items: center; justify-content: center;
        background: var(--cream);
        border: 3px dashed var(--ink);
        border-radius: 50%;
        font-weight: bold; color: var(--ink);
      }
      .td-puzzle-item-wrap, .td-puzzle-item-shape {
        display: inline-flex; align-items: center; justify-content: center;
        flex-shrink: 0;
      }

      .td-feedback {
        margin-top: 20px; padding: 16px;
        border-radius: 8px; border: 3px solid var(--ink);
        text-align: center;
      }
      .td-feedback p { font-size: 17px; margin: 0 0 10px; font-weight: bold; }
      .td-feedback-success { background: #c8e6b8; }
      .td-feedback-error { background: #fde2c8; }

      .td-puzzle-complete { text-align: center; }

      .td-end-stars { margin: 20px 0; }
      .td-end-stars .td-star { font-size: 44px; margin: 0 4px; }

      @media (max-width: 700px) {
        .td-title { font-size: 36px; }
        .td-h2 { font-size: 22px; }
        .td-hud-banner { padding: 6px 14px; gap: 10px; }
        .td-hud-text { font-size: 12px; letter-spacing: 1px; }
        .td-hover-card { min-width: 160px; padding: 8px; }
        .td-hover-character { width: 44px; height: 44px; }
        .td-overlay-card { padding: 20px 18px; }
        .td-overlay-host-img { width: 56px; height: 56px; }
        .td-mission-text { font-size: 16px; padding: 12px; }
        .td-choice { font-size: 15px; padding: 12px; }
        .td-portrait { max-width: 110px; }
        .td-portrait-name { font-size: 12px; }
        .td-interior-title-banner { font-size: 14px; padding: 4px 14px; }
        .td-dialog-bubble p { font-size: 15px; }
        .td-character-figure { height: 55%; left: 28%; }
        .td-character-bubble { width: 26px; height: 26px; font-size: 16px; }
        .td-scene-hint { font-size: 11px; }
        .td-paper-tag { font-size: 12px; padding: 3px 10px; }
        .td-tagged-primary .td-paper-tag { font-size: 13px; }
        .td-detail-content { padding: 18px; }
        .td-detail-caption { font-size: 14px; }
        .td-gear-indicator { width: 30px; height: 30px; }
        .td-puzzle-progress { gap: 6px; }
        .td-trapdoor { width: 22px; height: 22px; }
        .td-magnifier-toggle { font-size: 12px; padding: 6px 12px; }
        .td-magnifier-icon { font-size: 14px; }
      }
    `}</style>
  );
}
