# Tidsdetektiverna

Ett litet webbaserat lärspel på svenska för barn runt 8 år. Spelaren är en ung
detektiv som hjälper stadens invånare att laga tiden genom att lösa tre uppdrag:

- **Bokgränden** — träna läsning med Mira Murr
- **Klocktornet** — träna klockan med Professor Tickelton
- **Pusselverkstaden** — träna mönster och logik med Herr Klonk

När alla tre stjärnor är samlade lyser tidsmaskinen i Tidsstaden upp och kan
öppnas. Då är spelet klart.

## Komma igång

Du behöver [Node.js](https://nodejs.org/) installerat (välj den nyaste LTS-versionen).

I projektmappen, öppna en terminal och kör:

```bash
npm install
npm run dev
```

Öppna sedan adressen som visas i terminalen (oftast `http://localhost:5173`).

## Bygga en publicerbar version

```bash
npm run build
```

Det skapar en mapp `dist/` med alla statiska filer. Den mappen kan laddas upp
till vilken statisk webbhost som helst — t.ex. Vercel, Netlify eller GitHub Pages.

## Projektstruktur

```
tidsdetektiverna/
├── index.html              # ingången som Vite läser
├── package.json            # projektets beroenden och kommandon
├── vite.config.js          # konfiguration för byggverktyget
├── public/                 # filer som kopieras rakt av till sajten
│   ├── map.jpg
│   ├── tickelton.jpg
│   ├── mira.jpg
│   ├── klonk.jpg
│   └── favicon.svg
└── src/
    ├── main.jsx            # React-startpunkt
    └── App.jsx             # hela spelets kod
```

All spel-logik och styling finns i `src/App.jsx`. Det är en enda fil med
tydliga rubriker — leta efter `// === STARTSKÄRM ===` osv.

## Bygga vidare

Idéer för nästa steg:

- Fler uppdrag — lägg till en plats i `HOTSPOTS` och bygg en ny mission-komponent.
- Fler frågor per uppdrag — gör om `choices` till en array av frågor.
- Spara framsteg mellan besök — använd `localStorage`.
- Ljud — `new Audio('/ding.mp3').play()` när barnet svarar rätt.
- Animera in stjärnor när de samlas in.

## Licens

Personligt familjeprojekt. Använd som du vill.
