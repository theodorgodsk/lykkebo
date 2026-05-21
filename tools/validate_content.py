"""
Validerer indhold.json — tjekker at alle påkrævede felter findes og ikke er tomme.

Brug:
    python tools/validate_content.py

Output:
    Liste over manglende eller tomme felter, og en samlet status.
"""

import json
from pathlib import Path

ROOT = Path(__file__).parent.parent
INDHOLD = ROOT / "indhold.json"

REQUIRED_FIELDS = [
    ("restaurant.navn",          "Virksomhedens navn"),
    ("restaurant.tagline",       "Kort slagord til hero"),
    ("restaurant.beskrivelse",   "Beskrivelse til hero"),
    ("restaurant.om_os_titel",   "Om os-overskrift"),
    ("restaurant.om_os_tekst",   "Om os-brødtekst"),
    ("kontakt.telefon",          "Telefonnummer"),
    ("kontakt.email",            "E-mailadresse"),
]

WARN_IF_EMPTY = [
    ("restaurant.hero_billede",  "Hero-billede URL"),
    ("restaurant.om_os_billede", "Om os-billede URL"),
    ("kontakt.adresse",          "Adresse"),
    ("kontakt.by",               "By og postnummer"),
]


def get_value(data: dict, path: str):
    keys = path.split(".")
    val = data
    for k in keys:
        if not isinstance(val, dict) or k not in val:
            return None
        val = val[k]
    return val


def validate():
    if not INDHOLD.exists():
        print("Fejl: indhold.json ikke fundet.")
        return

    with open(INDHOLD, encoding="utf-8") as f:
        data = json.load(f)

    errors = []
    warnings = []

    for path, label in REQUIRED_FIELDS:
        val = get_value(data, path)
        if val is None or str(val).strip() == "":
            errors.append(f"  MANGLER  {label} ({path})")

    for path, label in WARN_IF_EMPTY:
        val = get_value(data, path)
        if val is None or str(val).strip() == "":
            warnings.append(f"  ADVARSEL  {label} ({path})")

    # Tjek menu
    menu = data.get("menu", [])
    if not menu:
        errors.append("  MANGLER  Mindst ét menupunkt (menu[])")
    else:
        no_price = [i["navn"] for i in menu if i.get("pris", 0) == 0]
        if no_price:
            warnings.append(f"  ADVARSEL  {len(no_price)} pakker uden pris (viser 'Kontakt for pris'): {', '.join(no_price[:3])}{'...' if len(no_price) > 3 else ''}")

    # Åbningstider
    if not data.get("aabningstider"):
        warnings.append("  ADVARSEL  Ingen åbningstider defineret")

    # Resultat
    print(f"\nValiderer: {INDHOLD}\n")

    if errors:
        print("FEJL (skal rettes):")
        for e in errors:
            print(e)
        print()

    if warnings:
        print("ADVARSLER (bør udfyldes):")
        for w in warnings:
            print(w)
        print()

    if not errors and not warnings:
        print("Alt ser godt ud — indhold.json er komplet.")
    elif not errors:
        print("Ingen kritiske fejl. Siden kan køre, men ovenstående bør udfyldes.")
    else:
        print("Ret fejlene ovenfor før siden vises til kunden.")


if __name__ == "__main__":
    validate()
