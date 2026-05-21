# Workflow: Redigér design

## Formål
Ændre farver, typografi, layout eller komponenter på siden.

## Regel
**Brug altid CSS-variabler i `:root` — undgå hardkodede værdier spredt i filen.**

## Inputs
- Hvad skal ændres (komponent, farve, størrelse)
- Reference-screenshot eller beskrivelse fra kunden

## Trin

### Farveændring
1. Find variablen i `:root` øverst i style.css
2. Vigtigste variabler:
   - `--cta: #FFA500` — ALLE knapper, labels, priser, accenter
   - `--bg: #faf9f6` — sidens baggrund
   - `--surface: #f4f0e8` — kortbaggrunde, alt-sektioner
   - `--text: #1c1917` — primær tekstfarve
   - `--dark-bg: #1c1917` — footer og hours-sektion
3. Ændr kun i `:root` — virker automatisk overalt

### Komponentændring
1. Find komponenten i style.css via klassens navn
2. Redigér med Edit-værktøjet
3. Tjek på alle tre sider (index, menu, kontakt)

### Ny sektion
1. Tilføj HTML i den relevante fil
2. Brug eksisterende klasser (`section`, `section-alt`, `fade-up`, `section-label`, `section-title`)
3. Tilføj kun ny CSS hvis eksisterende klasser ikke dækker behovet

## Designsystem (bevar)
- **Hero:** Mørk full-bleed (.hero-bg + gradient overlay) — lys resten
- **Ikoner:** Kun inline SVG med `stroke="currentColor"`, stroke-width 1.75
- **Knapper:** border-radius 50px, aldrig skarpe hjørner
- **Kort:** white baggrund, border 1px solid var(--border), box-shadow var(--shadow-sm)
- **Hover:** translateY(-2 til -6px) + stærkere shadow — konsistent løft-effekt

## Edge cases
- **Legacy aliases:** `--red`, `--off-white`, `--gray` etc. er aliaser der peger på de nye variabler — bruges i dynamisk genereret HTML fra content-loader.js. Slet dem ikke.
- **Responsivt:** Tjek altid mobilvisning (< 700px breakpoint) efter layoutændringer
