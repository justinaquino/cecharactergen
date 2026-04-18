#!/usr/bin/env python3
"""CLI entry point for Low-Tech Fantasy Character Generator."""

import argparse
import random
import sys
import json

import sys
import os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

from character import generate_base_character, Character, calculate_derived
from careers import resolve_term, muster_out
from renderer import render_character_sheet


def main():
    parser = argparse.ArgumentParser(description="CE Low-Tech Fantasy Character Generator")
    parser.add_argument("--name", "-n", default="Unnamed", help="Character name")
    parser.add_argument("--species", "-s", default="human", choices=["human", "elf", "dwarf"], help="Species")
    parser.add_argument("--career", "-c", default="warrior", choices=[
        "warrior", "cleric", "thief", "hunter", "sorcerer", "merchant", "noble"
    ], help="Primary career")
    parser.add_argument("--terms", "-t", type=int, default=2, help="Number of terms to serve")
    parser.add_argument("--seed", type=int, help="Random seed for reproducible generation")
    parser.add_argument("--json", action="store_true", help="Output raw JSON instead of text sheet")
    parser.add_argument("--multi-career", action="store_true", help="Allow switching careers after mishaps")
    args = parser.parse_args()

    if args.seed is not None:
        random.seed(args.seed)

    # Generate base character with chosen species
    char = generate_base_character(args.name)
    char.species_id = args.species

    # Re-apply species modifiers if non-human
    if args.species != "human":
        from src.character import load_json, data_path, apply_species_modifiers
        species_data = load_json(data_path("species", f"{args.species}.json"))
        apply_species_modifiers(char, species_data)
        char.derived["movement"] = species_data.get("base_speed", 6)

    # Serve career terms
    current_career = args.career
    for term_num in range(args.terms):
        term = resolve_term(char, current_career)
        if not term["survived"]:
            print(f"[Term {term['term']}: Career ended — {term['mishap']}]")
            if args.multi_career:
                # Pick a fallback career
                fallback = random.choice(["warrior", "thief", "hunter", "vagabond"])
                print(f"[Falling back to {fallback} career]")
                current_career = fallback
            else:
                break

    # Muster out
    muster_out(char)

    # Recalculate derived stats after aging and career
    calculate_derived(char)
    if args.species != "human":
        from src.character import load_json, data_path
        species_data = load_json(data_path("species", f"{args.species}.json"))
        char.derived["movement"] = species_data.get("base_speed", 6)

    # Output
    if args.json:
        print(json.dumps(char.to_dict(), indent=2))
    else:
        print(render_character_sheet(char))


if __name__ == "__main__":
    main()
