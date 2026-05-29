# Komma igång – steg för steg

Den här guiden tar dig från noll till spelet körandes på din dator, och sedan
publicerat på en riktig URL via GitHub. Inga kommandoradskommandon krävs
utöver två — och de visas exakt här.

## Innan du börjar

Installera dessa två gratisprogram:

1. **Node.js** – från https://nodejs.org/ (välj "LTS"). Det här är vad som
   kör React-koden lokalt.
2. **GitHub Desktop** – från https://desktop.github.com/. En visuell app som
   gör att du slipper kommandoraden för Git.

Skapa också ett gratis konto på https://github.com om du inte redan har ett.

---

## Steg 1: Få spelet att köra på din dator

1. Packa upp den här mappen någonstans du hittar den, t.ex. på skrivbordet.
2. Öppna en terminal i mappen:
   - **Mac:** Högerklicka på mappen i Finder → "Nya terminalfönstret i mappen"
     (om du inte ser det alternativet: öppna Terminal-appen och skriv `cd `
     följt av att dra in mappen, och tryck Enter).
   - **Windows:** Öppna mappen i Utforskaren → klicka i adressfältet upptill →
     skriv `cmd` och tryck Enter.
3. I terminalen, skriv detta och tryck Enter:

   ```
   npm install
   ```

   Det här laddar ner allt React behöver. Tar 1–3 minuter första gången.
   Du kommer se en hel del text scrolla förbi — det är normalt.

4. När det är klart, skriv:

   ```
   npm run dev
   ```

   Du får upp en rad som säger något i stil med:

   ```
   ➜  Local:   http://localhost:5173/
   ```

5. Öppna den adressen i din webbläsare. Spelet ska nu köra!

För att stoppa servern: gå tillbaka till terminalen och tryck `Ctrl + C`.
För att starta igen: skriv `npm run dev` på nytt.

---

## Steg 2: Lägg projektet på GitHub

1. Öppna GitHub Desktop och logga in med ditt GitHub-konto.
2. Gå till **File → Add Local Repository**.
3. Välj projektmappen (`tidsdetektiverna`).
4. Om appen säger "this directory does not appear to be a Git repository",
   klicka på länken **"create a repository"**.
5. Fyll i:
   - **Name:** `tidsdetektiverna`
   - **Description:** ett valfritt kort beskrivande sammanfattande mening
   - **Git Ignore:** lämna tom (vi har redan en `.gitignore`-fil)
6. Klicka **Create Repository**.
7. Längst ner till vänster, skriv ett kort meddelande som "Första versionen"
   och klicka **Commit to main**.
8. Klicka **Publish repository** uppe till höger. Bocka av "Keep this code
   private" om du vill att vem som helst ska kunna se koden (rekommenderas
   för det här projektet — det är inget hemligt i det). Klicka **Publish**.

Nu finns ditt projekt på GitHub. Du kan se det på
`https://github.com/<ditt-användarnamn>/tidsdetektiverna`.

---

## Steg 3: Publicera spelet på en riktig URL (gratis)

Det enklaste sättet är **Vercel**:

1. Gå till https://vercel.com och välj **"Sign up with GitHub"**.
2. Klicka **Add New → Project**.
3. Hitta `tidsdetektiverna` i listan, klicka **Import**.
4. Behåll alla standardinställningar (Vercel känner igen Vite automatiskt)
   och klicka **Deploy**.
5. Efter någon minut får du en URL som
   `https://tidsdetektiverna-xxx.vercel.app` — dela den med vem du vill!

Bonus: varje gång du gör en ändring via GitHub Desktop och klickar
"Push origin" så uppdateras sajten automatiskt inom en minut.

---

## Vanliga problem

**"npm: command not found"** – Node.js är inte installerat eller terminalen
behöver startas om efter installationen.

**"Cannot find module..."** – Du glömde köra `npm install` först.

**Spelet visas men bilderna saknas** – Kontrollera att alla fyra bilder ligger
direkt i `public/`-mappen (inte i en underkatalog).

**"Port 5173 is in use"** – En annan dev-server kör redan. Stäng den eller
acceptera den nya porten Vite föreslår.

---

## Att ändra spelet

Allt finns i `src/App.jsx`. Några nyttiga ställen:

- Vill du ändra texten på startskärmen? Sök efter `StartScreen` i filen.
- Vill du flytta hotspotsen på kartan? Leta upp `HOTSPOTS` högst upp.
  Värdena är i procent av kartans bredd/höjd.
- Vill du ändra färgerna? Leta upp `:root` i CSS-delen längst ned —
  där ligger alla färger som CSS-variabler.

När du gör ändringar och har servern igång (`npm run dev`) uppdateras
webbläsaren automatiskt så fort du sparar filen. Trevlig hackning!
