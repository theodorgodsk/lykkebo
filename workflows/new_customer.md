# Workflow: Opret ny kundehjemmeside

## Formål
Byg en ny hjemmeside til en ny kunde baseret på Lykkebo Grill-templaten.

## Inputs
- Kundenavn (til mappenavn)
- Kundens nuværende hjemmeside (hvis den findes)
- Virksomhedsnavn, telefon, email, adresse
- Branche/produkt (hvad sælger de?)

## Trin

1. **Kør new_customer.py**
   ```
   python tools/new_customer.py "kundenavn"
   ```
   Scriptet kopierer mappen og returnerer stien til den nye mappe.

2. **Research kunden**
   - Besøg kundens nuværende hjemmeside med WebFetch
   - Udtræk: navn, tagline, beskrivelse, kontaktinfo, produkter/priser, åbningstider
   - Notér hvad der mangler (skal indhentes fra kunden)

3. **Opdatér indhold.json**
   Følg `workflows/update_content.md`
   Fokus:
   - `restaurant.navn` — virksomhedens navn
   - `restaurant.tagline` — kort, slagkraftigt udsagn
   - `restaurant.beskrivelse` — 1-2 sætninger til hero
   - `kontakt.*` — alle kontaktoplysninger
   - `kategorier[]` og `menu[]` — tilpasset til branchen
   - `aabningstider[]` — eller fjern sektionen hvis ikke relevant

4. **Tilpas ikoner i index.html**
   Erstat de 3 feature-ikoner (SVG) så de passer til branchen.
   Brug Heroicons/Feather-stil: `stroke="currentColor"`, stroke-width 1.75.

5. **Opdatér hero-billedet**
   Find relevant Unsplash-billede til `.hero-bg` i style.css:
   ```css
   background-image: url('https://images.unsplash.com/photo-XXXXX?w=1400&auto=format&fit=crop');
   ```

6. **Verificér alle tre sider**
   - Start server: `node server.js`
   - Gennemgå index.html, menu.html, kontakt.html
   - Tjek at ingen pizza/pattegris-referencer er tilbage

7. **Opdatér CLAUDE.md**
   Ret kundeinfo-sektionen til den nye kunde.

## Hvad der IKKE er i templaten (indhentes fra kunden)
- Rigtige produktbilleder
- Præcis adresse (hvis ikke på hjemmesiden)
- Priser (hvis ikke offentlige)
- Logo (til evt. fremtidig brug)

## Edge cases
- **Ingen eksisterende hjemmeside:** Spørg kunden direkte om de 5 vigtigste felter
- **Ikke en restaurant:** Omdøb "menu.html" og sektioner så de passer til branchen
- **Domæne hos tredjepart:** Bricksite og lignende tillader ikke direkte HTML-upload — host på Render/Vercel og peg DNS
