# Lykkebo Grill — Agent Instructions

Du arbejder på **Lykkebo Grills hjemmeside** efter WAT-arkitekturen (Workflows, Agents, Tools).

## Projektstruktur

```
lykkebo-grill/
  index.html          # Forsiden
  menu.html           # Pakker & priser
  kontakt.html        # Kontaktside
  style.css           # Alt styling
  script.js           # Navigation, scroll, animationer
  content-loader.js   # Henter indhold fra API og renderer dynamisk
  indhold.json        # Alt kundeindhold — ENESTE fil kunden redigerer
  server.js           # Express-server (API + statiske filer)
  workflows/          # SOPs for hvad der skal gøres og hvordan
  tools/              # Python-scripts til deterministisk udførelse
```

## Kerneprincipper

**indhold.json er sandheden.** Al tekst, priser, åbningstider og kontaktinfo styres herfra. Redigér aldrig tekst direkte i HTML-filer — brug altid indhold.json.

**style.css er designsystemet.** Farver, typografi og layout defineres via CSS-variabler øverst i filen. Ændrer du en farve, gør det i `:root` — ikke spredt i filen.

**content-loader.js renderer alt dynamisk.** Den henter fra `/api/indhold`, populerer `data-content`-attributter og bygger menu- og åbningstidssektioner. Forstå den før du redigerer HTML-strukturen.

## Designbeslutninger (bevar disse)

- **Font:** Playfair Display (headings) + Inter (body) via Google Fonts
- **CTA-farve:** #FFA500 — bruges på ALLE knapper, labels, priser og accenter
- **Hero:** Mørk full-bleed med billedoverlay — resten af siden er lys
- **Ikoner:** Kun inline SVG — ingen emojis, ingen ikonbiblioteker
- **Loader:** CSS spinner — ingen emoji

## Hvordan du opererer

1. **Læs relevant workflow** før du starter en opgave
2. **Tjek tools/** — brug eksisterende scripts frem for at gøre det manuelt
3. **Opdatér workflows** når du lærer noget nyt om systemet
4. **Start altid serveren** med `node server.js` fra projektmappen og verificér på http://localhost:3000

## Kundeinfo

- **Virksomhed:** Lykkebo Grill
- **Ejer:** Preben Davidsen (uddannet slagter)
- **Telefon:** 30 70 85 12
- **Email:** prebendavidsen76@gmail.com
- **FindSmiley:** https://www.findsmiley.dk/647613
- **Domæne:** Registreret hos Bricksite — peg DNS til ekstern host ved deployment
