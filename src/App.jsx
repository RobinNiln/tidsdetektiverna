import React, { useState } from "react";

// ============================================================
// TIDSDETEKTIVERNA — v4 med riktig verkstadsinteriör
// ============================================================

const ASSETS = {
  map: "/tidsdetektiverna/map.jpg",
  tickelton: "/tidsdetektiverna/tickelton.jpg",
  mira: "/tidsdetektiverna/mira.jpg",
  klonk: "/tidsdetektiverna/klonk.jpg",
  puzzleWorkshop: "/tidsdetektiverna/pusselverkstaden.jpg",
};

const HOTSPOTS = {
  reading: {
    key: "reading", title: "Bokgränden", short: "Läs ledtråden",
    character: "mira", characterName: "Mira Murr",
    x: 22, y: 70, w: 14, h: 22,
  },
  clock: {
    key: "clock", title: "Klocktornet", short: "Lös tiden",
    character: "tickelton", characterName: "Professor Tickelton",
    x: 56, y: 50, w: 10, h: 38,
  },
  puzzle: {
    key: "puzzle", title: "Pusselverkstaden", short: "Hitta mönstret",
    character: "klonk", characterName: "Herr Klonk",
    x: 78, y: 60, w: 16, h: 25,
  },
  timemachine: {
    key: "timemachine", title: "Tidsmaskinen", short: "Öppna porten",
    character: null,
    x: 41, y: 33, w: 10, h: 18,
  },
};

// ============================================================
// HUVUDKOMPONENT
// ============================================================
export default function App() {
  const [view, setView] = useState("start");
  const [activeLocation, setActiveLocation] = useState(null);
  const [completed, setCompleted] = useState({
    reading: false, clock: false, puzzle: false,
  });
  const [feedback, setFeedback] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [foundItems, setFoundItems] = useState([]);
  const [interiorDialog, setInteriorDialog] = useState(null);

  const stars = Object.values(completed).filter(Boolean).length;
  const allDone = stars === 3;

  function enterLocation(key) {
    if (key === "timemachine") {
      if (allDone) setView("end");
      return;
    }
    setActiveLocation(key);
    setInteriorDialog(null);
    setView("interior");
  }
  function startMission() { setFeedback(null); setView("mission"); }
  function backToInterior() { setFeedback(null); setView("interior"); }
  function backToMap() {
    setActiveLocation(null); setInteriorDialog(null); setFeedback(null); setView("map");
  }
  function completeMission(key) { setCompleted((p) => ({ ...p, [key]: true })); }
  function pickUpItem(id) {
    if (!foundItems.includes(id)) setFoundItems((p) => [...p, id]);
  }
  function reset() {
    setCompleted({ reading: false, clock: false, puzzle: false });
    setFoundItems([]); setFeedback(null); setActiveLocation(null);
    setInteriorDialog(null); setView("start");
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
          onStartMission={startMission} onBack={backToMap} />
      )}

      {view === "mission" && activeLocation && (
        <MissionOverlay hotspot={HOTSPOTS[activeLocation]} onClose={backToInterior}>
          {activeLocation === "reading" && (
            <ReadingMission feedback={feedback} setFeedback={setFeedback}
              alreadyDone={completed.reading}
              onComplete={() => completeMission("reading")} onBack={backToInterior} />
          )}
          {activeLocation === "clock" && (
            <ClockMission feedback={feedback} setFeedback={setFeedback}
              alreadyDone={completed.clock}
              onComplete={() => completeMission("clock")} onBack={backToInterior} />
          )}
          {activeLocation === "puzzle" && (
            <PuzzleMission feedback={feedback} setFeedback={setFeedback}
              alreadyDone={completed.puzzle}
              onComplete={() => completeMission("puzzle")} onBack={backToInterior} />
          )}
        </MissionOverlay>
      )}

      {view === "end" && (
        <MissionOverlay grand onClose={() => setView("map")}>
          <EndScreen onReset={reset} />
        </MissionOverlay>
      )}
    </div>
  );
}

// ============================================================
// STARTSKÄRM
// ============================================================
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
// KARTAN
// ============================================================
function MapView({ completed, stars, allDone, hovered, setHovered, onPick, onReset }) {
  const visibleHotspots = ["reading", "clock", "puzzle"];
  return (
    <div className="td-map-wrap td-fade-in">
      <div className="td-map" style={{ backgroundImage: `url(${ASSETS.map})` }}>
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
          aria-label="Tidsmaskinen" disabled={!allDone} />

        {hovered && (
          <HoverLabel hotspot={HOTSPOTS[hovered]} done={completed[hovered]} allDone={allDone} />
        )}
      </div>
    </div>
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

// ============================================================
// INTERIÖR-VY
// ============================================================
function InteriorView({ locationKey, completed, foundItems, dialog, setDialog,
                        onPickUpItem, onStartMission, onBack }) {
  const hotspot = HOTSPOTS[locationKey];

  let scene;
  if (locationKey === "puzzle") {
    scene = (
      <PuzzleWorkshopScene completed={completed} foundItems={foundItems}
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
        <div className="td-dialog-bubble" onClick={() => setDialog(null)}>
          <p>{dialog}</p>
          <div className="td-dialog-tip">Klicka för att stänga</div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// PUSSELVERKSTADENS SCEN
// ============================================================
function PuzzleWorkshopScene({ completed, foundItems, setDialog, onPickUpItem, onStartMission }) {
  const gearFound = foundItems.includes("puzzle:gear");

  return (
    <div className="td-scene-image" style={{ backgroundImage: `url(${ASSETS.puzzleWorkshop})` }}>
      {/* Maskinen */}
      <button
        className="td-scene-hotspot td-scene-hotspot-big"
        style={{ left: "57%", top: "10%", width: "34%", height: "65%" }}
        onClick={onStartMission}
        aria-label="Den stora maskinen"
      >
        <span className="td-scene-label">
          {completed ? "✓ Maskinen är lagad" : "Starta pusslet"}
        </span>
      </button>

      {/* Verktygsväggen */}
      <button
        className="td-scene-hotspot"
        style={{ left: "1%", top: "26%", width: "32%", height: "40%" }}
        onClick={() =>
          setDialog(
            "På verktygsväggen hänger skiftnycklar, tänger och en gammal karta. Konstigt — det ser ut som en karta över stadens kloaker. Vem har ritat den?"
          )
        }
        aria-label="Verktygsväggen"
      >
        <span className="td-scene-label">Verktygsväggen</span>
      </button>

      {/* Fönstret */}
      <button
        className="td-scene-hotspot"
        style={{ left: "10%", top: "4%", width: "22%", height: "20%" }}
        onClick={() =>
          setDialog(
            "Genom fönstret ser du stadens tak. Solen står ovanligt högt för att vara så här tidigt. Något är fel med tiden..."
          )
        }
        aria-label="Fönstret"
      >
        <span className="td-scene-label">Fönstret</span>
      </button>

      {/* Det glittrande kugghjulet */}
      {!gearFound && (
        <button
          className="td-scene-hotspot td-scene-hotspot-glow"
          style={{ left: "78%", top: "80%", width: "8%", height: "12%" }}
          onClick={() => {
            onPickUpItem("puzzle:gear");
            setDialog("Du hittade ett glittrande kugghjul på arbetsbänken! Det glömmer du inte i första taget.");
          }}
          aria-label="Glittrande kugghjul"
        />
      )}

      {/* Herr Klonk */}
      <button
        className="td-scene-character"
        onClick={() =>
          setDialog(
            "Bra dag för att skruva! Tack att du kom. Min maskin har glömt sitt mönster. Kan du hjälpa den minnas?"
          )
        }
        aria-label="Prata med Herr Klonk"
      >
        <img src={ASSETS.klonk} alt="Herr Klonk" />
        <span className="td-character-indicator">!</span>
      </button>

      <div className="td-scene-hint">
        Klicka runt i verkstaden för att utforska. Maskinen är huvudpusslet.
      </div>
    </div>
  );
}

// ============================================================
// Platshållarscen
// ============================================================
function ComingSoonScene({ title, onStartMission }) {
  return (
    <div className="td-coming-soon">
      <div className="td-coming-soon-card">
        <div className="td-stamp">På väg...</div>
        <h2 className="td-h2">{title}</h2>
        <p>
          Interiören för den här platsen håller på att byggas. Du kan starta
          uppdraget direkt så länge.
        </p>
        <button className="td-btn td-btn-big" onClick={onStartMission}>
          ▸ Starta uppdraget
        </button>
      </div>
    </div>
  );
}

// ============================================================
// UPPDRAGS-OVERLAY
// ============================================================
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

// ============================================================
// UPPDRAG
// ============================================================
function ReadingMission({ feedback, setFeedback, alreadyDone, onComplete, onBack }) {
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

function ClockMission({ feedback, setFeedback, alreadyDone, onComplete, onBack }) {
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

function PuzzleMission({ feedback, setFeedback, alreadyDone, onComplete, onBack }) {
  const choices = [
    { id: "a", color: "red", label: "röd", correct: true },
    { id: "b", color: "green", label: "grön", correct: false },
    { id: "c", color: "blue", label: "blå", correct: false },
  ];
  function pick(c) {
    if (c.correct) {
      setFeedback({ type: "success", text: "Du hittade ledtråden! Maskinen surrar igång." });
      if (!alreadyDone) onComplete();
    } else {
      setFeedback({ type: "error", text: "Bra försök! Ledtråd: färgerna turas om." });
    }
  }
  return (
    <>
      <p className="td-mission-text">
        <em>"Maskinen behöver rätt kugghjul!"</em> Herr Klonk torkar händerna
        på förklädet: Vilken färg fortsätter mönstret?
      </p>
      <div className="td-pattern">
        <Dot color="red" /><Dot color="blue" /><Dot color="red" /><Dot color="blue" /><Dot color="mystery" />
      </div>
      <div className="td-choices td-choices-row">
        {choices.map((c) => (
          <button key={c.id} className="td-choice td-choice-dot" onClick={() => pick(c)}>
            <Dot color={c.color} small /><span>{c.label}</span>
          </button>
        ))}
      </div>
      <Feedback feedback={feedback} done={alreadyDone || feedback?.type === "success"} onBack={onBack} />
    </>
  );
}

function Dot({ color, small }) {
  const colors = { red: "#d94c3d", blue: "#3a6ea8", green: "#5fa860", mystery: "#fdf3d8" };
  return (
    <span className={`td-dot ${small ? "td-dot-small" : ""}`}
      style={{ background: colors[color], borderStyle: color === "mystery" ? "dashed" : "solid" }}>
      {color === "mystery" ? "?" : ""}
    </span>
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
      <p className="td-intro">
        Fantastiskt! Du hittade alla tre stjärnor och lagade stadens första tidsmaskin.
      </p>
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

// ============================================================
// CSS
// ============================================================
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
        color: var(--ink);
        min-height: 100vh;
        background: #2a1f12;
        overflow: hidden;
      }

      .td-fade-in { animation: tdFadeIn 0.5s ease; }
      @keyframes tdFadeIn { from { opacity: 0; } to { opacity: 1; } }

      /* === STARTSKÄRM === */
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

      /* === KNAPPAR === */
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
        background-size: cover; background-position: center; background-repeat: no-repeat;
      }
      .td-hud {
        position: absolute; top: 12px; left: 50%;
        transform: translateX(-50%); z-index: 10;
        display: flex; gap: 12px; align-items: center;
      }
      .td-hud-banner {
        background: var(--cream); border: 3px solid var(--ink);
        border-radius: 8px; padding: 8px 22px;
        box-shadow: 4px 4px 0 var(--ink);
        display: flex; align-items: center; gap: 16px;
      }
      .td-hud-text {
        font-weight: bold; font-size: 16px;
        text-transform: uppercase; letter-spacing: 1.5px;
      }
      .td-hud-reset { background: var(--paper); }

      .td-star-row { display: inline-flex; gap: 4px; }
      .td-star {
        font-size: 22px; color: #c0a878;
        text-shadow: 1px 1px 0 var(--ink); line-height: 1;
      }
      .td-star-filled { color: var(--gold); animation: starPop 0.4s ease; }
      @keyframes starPop {
        0% { transform: scale(0); }
        60% { transform: scale(1.4); }
        100% { transform: scale(1); }
      }

      .td-hotspot {
        position: absolute; background: transparent;
        border: 3px dashed transparent; border-radius: 14px;
        cursor: pointer; transition: all 0.2s ease; padding: 0;
      }
      .td-hotspot:hover, .td-hotspot-hover {
        background: rgba(253, 201, 77, 0.25); border-color: var(--ink);
        box-shadow: 0 0 0 4px rgba(253, 201, 77, 0.4), 0 0 30px rgba(253, 201, 77, 0.6);
        transform: scale(1.04);
      }
      .td-hotspot-done {
        background: rgba(95, 168, 96, 0.18);
        border: 3px solid rgba(58, 42, 23, 0.4);
      }
      .td-hotspot-done:hover { background: rgba(95, 168, 96, 0.3); }
      .td-hotspot-star {
        position: absolute; top: -16px; right: -10px;
        font-size: 36px; color: var(--gold);
        text-shadow: 2px 2px 0 var(--ink), -1px -1px 0 var(--ink);
        animation: starPop 0.5s ease;
      }
      .td-hotspot-finale-locked {
        cursor: not-allowed; background: rgba(40, 30, 18, 0.4);
        border: 3px solid rgba(40, 30, 18, 0.6);
      }
      .td-hotspot-finale-locked:hover {
        background: rgba(40, 30, 18, 0.4); transform: none; box-shadow: none;
      }
      .td-hotspot-finale-active {
        background: rgba(253, 201, 77, 0.3); border: 3px solid var(--ink);
        animation: pulseGold 1.4s ease-in-out infinite;
      }
      @keyframes pulseGold {
        0%, 100% { box-shadow: 0 0 0 4px rgba(253, 201, 77, 0.4), 0 0 30px rgba(253, 201, 77, 0.7); }
        50% { box-shadow: 0 0 0 10px rgba(253, 201, 77, 0.2), 0 0 60px rgba(253, 201, 77, 0.9); }
      }

      .td-hover-card {
        position: absolute; z-index: 5;
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

      /* === INTERIÖR-VY === */
      .td-interior {
        position: fixed; inset: 0; background: #1a1208;
        display: flex; flex-direction: column;
      }
      .td-interior-topbar {
        background: var(--cream);
        border-bottom: 3px solid var(--ink);
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
        position: relative;
        width: 100%; height: 100%;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        background-color: #1a1208;
      }

      .td-scene-hotspot {
        position: absolute;
        background: rgba(253, 201, 77, 0.05);
        border: 3px dashed transparent;
        border-radius: 12px;
        cursor: pointer; padding: 0;
        transition: all 0.2s ease;
      }
      .td-scene-hotspot:hover {
        background: rgba(253, 201, 77, 0.22);
        border-color: var(--ink);
        box-shadow: 0 0 0 3px rgba(253, 201, 77, 0.4), 0 0 25px rgba(253, 201, 77, 0.6);
        transform: scale(1.02);
      }
      .td-scene-hotspot-big:hover { transform: scale(1.01); }

      .td-scene-label {
        position: absolute;
        bottom: 8px; left: 50%; transform: translateX(-50%);
        background: var(--cream);
        border: 2.5px solid var(--ink);
        border-radius: 6px;
        padding: 4px 12px;
        font-size: 13px; font-weight: bold;
        white-space: nowrap;
        box-shadow: 3px 3px 0 var(--ink);
        opacity: 0; transition: opacity 0.2s;
        pointer-events: none;
      }
      .td-scene-hotspot:hover .td-scene-label { opacity: 1; }

      .td-scene-hotspot-glow {
        background: radial-gradient(circle, rgba(253, 201, 77, 0.4) 0%, rgba(253, 201, 77, 0) 70%);
        border-color: transparent;
        animation: tdGlow 1.5s ease-in-out infinite;
      }
      @keyframes tdGlow {
        0%, 100% {
          box-shadow: 0 0 10px rgba(253, 201, 77, 0.5), 0 0 20px rgba(253, 201, 77, 0.3);
          background: radial-gradient(circle, rgba(253, 201, 77, 0.4) 0%, rgba(253, 201, 77, 0) 70%);
        }
        50% {
          box-shadow: 0 0 25px rgba(253, 201, 77, 1), 0 0 50px rgba(253, 201, 77, 0.5);
          background: radial-gradient(circle, rgba(253, 201, 77, 0.7) 0%, rgba(253, 201, 77, 0) 70%);
        }
      }

      .td-scene-character {
        position: absolute;
        bottom: 4%; left: 36%;
        width: 14%; max-width: 180px; min-width: 100px;
        aspect-ratio: 1 / 1;
        background: var(--paper);
        border: 4px solid var(--ink);
        border-radius: 50%;
        overflow: hidden;
        cursor: pointer; padding: 0;
        box-shadow: 6px 6px 0 var(--ink), 0 0 0 4px var(--cream);
        transition: transform 0.2s;
        animation: tdCharBob 3s ease-in-out infinite;
      }
      @keyframes tdCharBob {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-6px); }
      }
      .td-scene-character:hover {
        transform: scale(1.08);
        box-shadow: 8px 8px 0 var(--ink), 0 0 0 4px var(--cream),
                    0 0 30px rgba(253, 201, 77, 0.8);
      }
      .td-scene-character img {
        width: 100%; height: 100%; object-fit: cover; display: block;
      }
      .td-character-indicator {
        position: absolute;
        top: -8px; right: -8px;
        width: 32px; height: 32px;
        background: var(--gold);
        border: 3px solid var(--ink);
        border-radius: 50%;
        display: flex; align-items: center; justify-content: center;
        font-size: 18px; font-weight: 900; color: var(--ink);
        animation: tdBlink 1.2s ease-in-out infinite;
      }
      @keyframes tdBlink {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.18); }
      }

      .td-scene-hint {
        position: absolute;
        bottom: 12px; left: 50%; transform: translateX(-50%);
        background: rgba(40, 30, 18, 0.7);
        color: var(--cream);
        padding: 6px 18px;
        border-radius: 20px;
        font-style: italic; font-size: 13px;
        pointer-events: none; white-space: nowrap;
      }

      .td-dialog-bubble {
        position: absolute;
        bottom: 30px; left: 50%; transform: translateX(-50%);
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

      /* === OVERLAY === */
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
        padding: 28px; max-width: 560px; width: 100%;
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
      .td-choice-dot {
        display: flex; flex-direction: column; align-items: center;
        gap: 6px; text-align: center; min-width: 90px;
      }

      .td-clock { display: block; width: 180px; margin: 10px auto 20px; }

      .td-pattern {
        display: flex; justify-content: center; align-items: center;
        gap: 12px; margin: 20px 0; padding: 16px;
        background: var(--paper); border-radius: 8px;
        border: 2.5px dashed var(--ink);
      }
      .td-dot {
        width: 46px; height: 46px; border-radius: 50%;
        border: 3px solid var(--ink); display: flex;
        align-items: center; justify-content: center;
        font-weight: bold; font-size: 22px;
      }
      .td-dot-small { width: 32px; height: 32px; }

      .td-feedback {
        margin-top: 20px; padding: 16px;
        border-radius: 8px; border: 3px solid var(--ink);
        text-align: center;
      }
      .td-feedback p { font-size: 17px; margin: 0 0 10px; font-weight: bold; }
      .td-feedback-success { background: #c8e6b8; }
      .td-feedback-error { background: #fde2c8; }

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
        .td-scene-character { width: 20%; min-width: 80px; }
        .td-character-indicator { width: 24px; height: 24px; font-size: 14px; }
        .td-scene-hint { font-size: 11px; }
      }
    `}</style>
  );
}
