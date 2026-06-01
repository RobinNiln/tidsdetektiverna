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
};

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
    reading: false, clock: false, puzzle: false,
  });
  const [hovered, setHovered] = useState(null);
  const [foundItems, setFoundItems] = useState([]);
  const [interiorDialog, setInteriorDialog] = useState(null);
  const [detailView, setDetailView] = useState(null);

  const stars = Object.values(completed).filter(Boolean).length;
  const allDone = stars === 3;

  function enterLocation(key) {
    if (key === "timemachine") { if (allDone) setView("end"); return; }
    setActiveLocation(key); setInteriorDialog(null); setDetailView(null);
    setView("interior");
  }
  function startMission() {
    if (activeLocation === "harbor") setView("boatgame");
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
    setCompleted({ reading: false, clock: false, puzzle: false });
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
      {view === "end" && (
        <MissionOverlay grand onClose={() => setView("map")}>
          <EndScreen onReset={reset} />
        </MissionOverlay>
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
  const visibleHotspots = ["reading", "clock", "puzzle", "harbor"];
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
        >
          <span className="td-magnifier-icon">🔍</span>
          <span className="td-magnifier-label">
            {magnifierOn ? "Stäng glaset" : "Förstoringsglas"}
          </span>
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
  return (
    <div className="td-hover-card"
      style={{ left: `${hotspot.x + hotspot.w + 1}%`, top: `${Math.max(8, hotspot.y - 2)}%` }}>
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
        <div className="td-dialog-bubble"
             onClick={typeof dialog === "object" && dialog.action ? null : () => setDialog(null)}>
          {typeof dialog === "object" ? (
            <>
              <div className="td-dialog-header">
                {dialog.portrait && (
                  <div className="td-dialog-portrait">
                    <img src={dialog.portrait} alt={dialog.name || ""} />
                  </div>
                )}
                {dialog.name && <strong className="td-dialog-name">{dialog.name}</strong>}
              </div>
              <p>{dialog.text}</p>
              {dialog.action ? (
                <button className="td-btn td-btn-gold"
                        onClick={(e) => {
                          e.stopPropagation();
                          dialog.action.onClick();
                        }}>
                  {dialog.action.label}
                </button>
              ) : (
                <div className="td-dialog-tip">Klicka för att stänga</div>
              )}
            </>
          ) : (
            <>
              <p>{dialog}</p>
              <div className="td-dialog-tip">Klicka för att stänga</div>
            </>
          )}
        </div>
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
    initial: "Pssst! Du där! Vill du köpa en KARTA till piratskatten? Bara tre guldmynt! Helt äkta, det lovar jag! ...okej okej, två mynt. Men då får du också en pyttesmå burk med 'magisk' sand. Helt äkta! Det lovar jag!",
    second: "Vill du köpa en hatt? Den är mycket fin. Bara fyra mynt. ...okej tre. Den ramlade av en sjökapten igår. Eller jo, helt äkta är den ju.",
    third: "Du verkar smart. Vill du köpa en TIDSMASKIN-RITNING? Helt äkta! Jag hittade den i havet. Hav är pålitliga. ...nej? Okej.",
  },
  berit: {
    portrait: "berit",
    name: "Berit",
    initial: "Hej hej! Jag är Berit, jag jobbar i hamnen. Lyfter lådor, knyter knopar, allt sånt. Om du vill veta något i den här hamnen — fråga mig. Jag ser allt och hör mer. Falk är en god man förresten. Och håll dig borta från Lasse, han säljer skräp.",
    second: "Visste du att fyrvaktaren bara väntar brev från Falk en gång om året? Något viktigt på gång där.",
    third: "Mina armar är trötta. Femton lådor idag. Men det är klart, någon måste göra jobbet!",
  },
  framling: {
    portrait: "framling",
    name: "Den mystiska främlingen",
    initial: "*Främlingen tittar upp från sin bok och ler svagt.* Vägar korsas där sjön möter himlen. Jag har sett tre stjärnor falla över denna stad. Snart blir det fyra. Den som söker tiden ska först förstå vattnet.",
    second: "*Hen bläddrar i sin bok.* Stockarna i viken... de driver inte slumpmässigt. Tiden själv har glömt åt vilket håll de ska.",
    third: "*Främlingen tystnar och pekar mot horisonten utan att säga något.*",
  },
};

function HarborScene({ foundItems, setDialog, onPickUpItem, onStartMission }) {
  // Räkna hur många gånger varje karaktär klickats (för progressiva dialoger)
  const clickCounts = useRef({ lasse: 0, berit: 0, framling: 0 });
  const [missionAccepted, setMissionAccepted] = useState(false);
  const harborKeyFound = foundItems.includes("harbor:key");

  function talkTo(charKey) {
    const data = HARBOR_DIALOGS[charKey];
    let text;
    let action;
    if (charKey === "falk") {
      if (harborKeyFound) {
        text = data.completed;
      } else if (missionAccepted) {
        text = data.accepted;
        action = { label: "▸ Ge dig av igen!", onClick: () => { setDialog(null); onStartMission(); } };
      } else {
        text = data.initial;
        action = { label: "▸ Jag tar uppdraget!", onClick: startBoatGame };
      }
    } else {
      // Lasse, Berit, Främling — cykla genom dialoger
      const count = clickCounts.current[charKey];
      if (count === 0) text = data.initial;
      else if (count === 1) text = data.second;
      else text = data.third;
      clickCounts.current[charKey] = Math.min(count + 1, 2);
    }
    setDialog({
      portrait: ASSETS[data.portrait],
      name: data.name,
      text,
      action,
    });
  }

  function startBoatGame() {
    setMissionAccepted(true);
    setDialog(null);
    onStartMission();
  }

  return (
    <div className="td-scene-image"
         style={{ backgroundImage: `url(${ASSETS.hamn})` }}>

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

      {/* Falk — huvudpersonen, längst fram och störst, central */}
      <HarborCharacter
        style={{ left: "42%", bottom: "4%", height: "56%", aspectRatio: "793 / 1983" }}
        image={ASSETS.falkFull}
        label="Kapten Falk"
        onClick={() => talkTo("falk")}
        primary
        smoking
      />

      {/* Berit — spegelvänd så hon lutar mot kajens befintliga lådor */}
      <HarborCharacter
        style={{ left: "60%", bottom: "4%", height: "50%", aspectRatio: "887 / 1774" }}
        image={ASSETS.beritFull}
        label="Berit"
        onClick={() => talkTo("berit")}
        mirror
      />

      {/* Lasse — vid huset, mindre och lite tillbaka (perspektiv) */}
      <HarborCharacter
        style={{ left: "7%", bottom: "6%", height: "46%", aspectRatio: "793 / 1983" }}
        image={ASSETS.lasseFull}
        label="???"
        onClick={() => talkTo("lasse")}
        suspicious
      />

      {/* Främlingen — längst tillbaka, minst (perspektiv = djup) */}
      <HarborCharacter
        style={{ left: "22%", bottom: "9%", height: "40%", aspectRatio: "793 / 1983" }}
        image={ASSETS.framlingFull}
        label="?"
        onClick={() => talkTo("framling")}
        mystery
      />

      {/* === EKAN — Falks dialog startar båtspelet === */}

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
  harbor: { x: 48, y: 88, r: 5 },
};

const BOAT_WHIRLPOOL = { x: 42, y: 32, r: 9, pull: 10, spin: 90 };

const BOAT_OBSTACLES = [
  // === Större öar i mitten ===
  { x: 23, y: 38, r: 9, msg: "AJ! En ö i vägen!" },
  { x: 62, y: 55, r: 9, msg: "AJ! Pang i ön!" },

  // === Rev (mörkare områden i vattnet) ===
  { x: 35, y: 25, r: 5, msg: "AJ! Ett rev!" },
  { x: 48, y: 22, r: 4, msg: "AJ! Stenar under ytan!" },
  { x: 75, y: 30, r: 4, msg: "AJ! Rev!" },
  { x: 32, y: 55, r: 5, msg: "AJ! Grunt vatten!" },
  { x: 78, y: 42, r: 4, msg: "AJ! Rev!" },
  { x: 30, y: 78, r: 5, msg: "AJ! Stenar!" },
  { x: 42, y: 75, r: 4, msg: "AJ! Rev under båten!" },
  { x: 55, y: 70, r: 4, msg: "AJ! Vass sten!" },
  { x: 75, y: 70, r: 5, msg: "AJ! Klippor!" },

  // === Flytande stockar ===
  { x: 43, y: 28, r: 2.5, msg: "AJ! En flytande stock!" },
  { x: 62, y: 38, r: 2.5, msg: "AJ! En stock!" },
  { x: 75, y: 42, r: 2.5, msg: "AJ! En stock!" },
  { x: 50, y: 55, r: 2.5, msg: "AJ! En stock!" },
  { x: 43, y: 62, r: 2.5, msg: "AJ! En stock!" },

  // === Vänster strand (uppifrån ner) ===
  { x: 7, y: 12, r: 5, msg: "AJ! Stranden!" },
  { x: 6, y: 22, r: 4, msg: "AJ! Klippor vid stranden!" },
  { x: 6, y: 32, r: 4, msg: "AJ! Stranden!" },
  { x: 6, y: 45, r: 4, msg: "AJ! Stenig strand!" },
  { x: 8, y: 58, r: 4, msg: "AJ! Stranden!" },
  { x: 6, y: 70, r: 4, msg: "AJ! Stranden!" },
  { x: 9, y: 82, r: 4, msg: "AJ! Strandkanten!" },

  // === Höger strand ===
  { x: 92, y: 25, r: 4, msg: "AJ! Klippor!" },
  { x: 93, y: 35, r: 4, msg: "AJ! Stranden!" },
  { x: 92, y: 48, r: 4, msg: "AJ! Stranden!" },
  { x: 93, y: 60, r: 4, msg: "AJ! Stranden!" },
  { x: 92, y: 72, r: 4, msg: "AJ! Stranden!" },
  { x: 91, y: 84, r: 4, msg: "AJ! Strandkanten!" },

  // === Övre strand (utöver fyrön) ===
  { x: 14, y: 4, r: 4, msg: "AJ! Stranden!" },
  { x: 28, y: 3, r: 4, msg: "AJ! Stranden!" },
  { x: 45, y: 4, r: 4, msg: "AJ! Stranden!" },
  { x: 60, y: 3, r: 4, msg: "AJ! Stranden!" },

  // === Nedre strand (utöver bryggan) ===
  { x: 18, y: 92, r: 4, msg: "AJ! Stranden!" },
  { x: 30, y: 93, r: 4, msg: "AJ! Stranden!" },
  { x: 65, y: 93, r: 4, msg: "AJ! Stranden!" },
  { x: 80, y: 92, r: 4, msg: "AJ! Stranden!" },

  // === Bryggan i hamnen — hindrar att köra in i sidorna av bryggan ===
  // (men hamn-målet vid (48, 88) ligger framför bryggan så man kan nå det)
  { x: 38, y: 91, r: 3, msg: "AJ! Bryggan!" },
  { x: 58, y: 91, r: 3, msg: "AJ! Bryggan!" },
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
          const maxSpeed = 6; // procent/sek (puttrande gammal eka)
          const aimedOk = Math.abs(diff) < 60;
          if (aimedOk) {
            d.speed = Math.min(maxSpeed, d.speed + 4 * dt);
          } else {
            d.speed = Math.max(0, d.speed - 3 * dt);
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
          const push = obs.r - odist + 1.2;
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
  const [feedback, setFeedback] = useState(null);
  const choices = [
    { id: "a", text: "13:30", correct: false },
    { id: "b", text: "14:30", correct: true },
    { id: "c", text: "15:00", correct: false },
  ];
  function pick(c) {
    if (c.correct) {
      setFeedback({ type: "success", text: "Snyggt jobbat, detektiv! Klockan är rätt." });
      if (!alreadyDone) onComplete();
    } else {
      setFeedback({ type: "error", text: "Inte riktigt. Ledtråd: halv tre betyder 30 minuter innan tre." });
    }
  }
  return (
    <>
      <p className="td-mission-text">
        <em>"Mina klockor är i oordning!"</em> Professor Tickelton viftar med
        sin maskin: Ugglan säger att tåget går <strong>halv tre</strong>. Vilken
        tid är det?
      </p>
      <AnalogClock hour={14} minute={30} />
      <div className="td-choices">
        {choices.map((c) => (
          <button key={c.id} className="td-choice" onClick={() => pick(c)}>{c.text}</button>
        ))}
      </div>
      <Feedback feedback={feedback} done={alreadyDone || feedback?.type === "success"} onBack={onBack} />
    </>
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
        position: absolute;
        top: 16px; right: 16px;
        background: var(--cream);
        border: 3px solid var(--ink);
        border-radius: 30px;
        padding: 8px 16px;
        font-family: 'Georgia', serif;
        font-weight: bold;
        font-size: 14px;
        color: var(--ink);
        cursor: pointer;
        box-shadow: 4px 4px 0 var(--ink);
        z-index: 11;
        display: flex; align-items: center; gap: 8px;
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
      .td-magnifier-icon { font-size: 18px; }
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

      /* Namnskylt under karaktären */
      .td-harbor-character-tag {
        position: absolute;
        bottom: -28px;
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
        width: 5.5%;
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
        padding: 18px 24px;
        box-shadow: 6px 6px 0 var(--ink);
        max-width: 600px; width: calc(100% - 40px);
        cursor: pointer; z-index: 10;
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
