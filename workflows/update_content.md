# Workflow: Opdatér kundeindhold

## Formål
Opdatér tekst, priser, kontaktinfo eller menu på Lykkebo Grills hjemmeside.

## Regel
**Redigér kun indhold.json — aldrig direkte i HTML.**
Al tekst på siden hentes dynamisk fra denne fil via content-loader.js.

## Inputs
- Hvad skal ændres (felt og ny værdi)
- Bekræftelse fra kunden hvis det er prisændringer

## Trin

1. **Identificér feltet i indhold.json**
   - `restaurant.*` — navn, tagline, beskrivelse, statistikker, billeder
   - `kontakt.*` — adresse, telefon, email
   - `aabningstider[]` — åbningstider (array af dage + tid)
   - `kategorier[]` — menukategorier (key + label)
   - `menu[]` — individuelle menupunkter (navn, beskrivelse, pris, kategori, tag)
   - `tilbud.*` — aktiv/inaktiv tilbudssektion

2. **Redigér indhold.json**
   - Brug Edit-værktøjet til præcise ændringer
   - Pris 0 = "Kontakt for pris" vises automatisk
   - `frokost_tekst` adskilles med `|` for punktliste

3. **Verificér på http://localhost:3000**
   - Start server: `node server.js` fra projektmappen
   - Tjek at ændringen vises korrekt
   - Tjek både forside, menyside og kontaktside

## Edge cases
- **Billeder:** Brug Unsplash-URL'er med `?w=800&auto=format&fit=crop` — kunden leverer egne billeder senere
- **Pris 0:** Skriv `"pris": 0` — vises som "Kontakt for pris", ikke "0 kr."
- **Tom email:** Lad feltet være tomt streng `""` — vises ikke i footer
