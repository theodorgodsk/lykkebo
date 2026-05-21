"""
Opretter en ny kundehjemmeside baseret på Lykkebo Grill-templaten.

Brug:
    python tools/new_customer.py "kundenavn"

Eksempel:
    python tools/new_customer.py "hansen-slagter"

Scriptet:
    1. Finder projektets rodmappe
    2. Kopierer hele mappen til ../kundenavn
    3. Fjerner node_modules (geninstalleres med npm install)
    4. Printer næste trin
"""

import sys
import shutil
import os
from pathlib import Path


def create_customer(customer_name: str) -> Path:
    # Ryd navn: lowercase, mellemrum → bindestreg
    slug = customer_name.lower().strip().replace(" ", "-")

    root = Path(__file__).parent.parent
    source = root
    target = root.parent / slug

    if target.exists():
        print(f"Fejl: Mappen '{target}' eksisterer allerede.")
        sys.exit(1)

    print(f"Kopierer template til: {target}")
    shutil.copytree(source, target, ignore=shutil.ignore_patterns(
        "node_modules", ".git", "*.pyc", "__pycache__", ".tmp"
    ))

    # Fjern gammel CLAUDE.md så den kan skrives til den nye kunde
    claude_md = target / "CLAUDE.md"
    if claude_md.exists():
        claude_md.unlink()

    print(f"\n✓ Mappe oprettet: {target}")
    print("\nNæste trin:")
    print(f"  1. cd {target}")
    print(f"  2. npm install")
    print(f"  3. Opdatér indhold.json med kundedata")
    print(f"  4. node server.js")
    print(f"  5. Verificér på http://localhost:3000")

    return target


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Brug: python tools/new_customer.py 'kundenavn'")
        sys.exit(1)

    create_customer(sys.argv[1])
