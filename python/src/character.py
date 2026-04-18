"""Character data model and generation logic."""

import json
import os
from copy import deepcopy
from typing import Dict, List, Optional, Any

from dice import (
    roll_abilities,
    roll_supernatural,
    characteristic_modifier,
    roll_vs_target,
    roll_2d6,
    roll_d6,
)


def load_json(path: str) -> dict:
    """Load a JSON file from the data directory."""
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def data_path(*parts: str) -> str:
    """Build a path relative to the project data directory."""
    # python/src/character.py -> project root -> data/
    base = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data")
    return os.path.join(base, *parts)


class Character:
    def __init__(self, name: str = "Unnamed"):
        self.name = name
        self.species_id = "human"
        self.abilities: Dict[str, int] = {}
        self.supernatural = -15
        self.hero_coins = 0
        self.background_id = ""
        self.background_skill = ""
        self.careers: List[dict] = []
        self.skills: Dict[str, int] = {}
        self.equipment: List[dict] = []
        self.assets: List[dict] = []
        self.connections: List[dict] = []
        self.age = 18
        self.total_terms = 0
        self.derived = {}

    def to_dict(self) -> dict:
        return {
            "name": self.name,
            "species_id": self.species_id,
            "abilities": self.abilities,
            "supernatural": self.supernatural,
            "hero_coins": self.hero_coins,
            "background_id": self.background_id,
            "background_skill": self.background_skill,
            "careers": self.careers,
            "skills": self.skills,
            "equipment": self.equipment,
            "assets": self.assets,
            "connections": self.connections,
            "age": self.age,
            "total_terms": self.total_terms,
            "derived": self.derived,
        }


def get_soc_tier(soc: int) -> str:
    """Return SOC tier based on exploding 2d6 result."""
    if soc <= 7:
        return "serf"
    elif soc <= 10:
        return "commoner"
    elif soc <= 13:
        return "middle"
    elif soc <= 16:
        return "gentry"
    elif soc <= 21:
        return "minor_noble"
    elif soc <= 27:
        return "major_noble"
    elif soc <= 33:
        return "high_noble"
    elif soc <= 39:
        return "minor_royalty"
    else:
        return "true_royalty"


def select_background(soc: int) -> dict:
    """Select background based on SOC roll."""
    data = load_json(data_path("backgrounds", "index.json"))
    for bg in data["backgrounds"]:
        if bg["soc_range"]["min"] <= soc <= bg["soc_range"]["max"]:
            return bg
    return data["backgrounds"][0]


def apply_species_modifiers(character: Character, species_data: dict) -> None:
    """Apply species ability modifiers to rolled abilities."""
    for stat, mod in species_data.get("ability_modifiers", {}).items():
        character.abilities[stat] = character.abilities.get(stat, 7) + mod


def award_hero_coins(character: Character) -> None:
    """Award hero coins if total ability score (excluding SOC) is low."""
    core_stats = ["str", "dex", "end", "int", "edu"]
    total = sum(character.abilities.get(s, 7) for s in core_stats)
    if total < 36:
        character.hero_coins = 3
    elif total < 42:
        character.hero_coins = 2
    elif total < 48:
        character.hero_coins = 1
    else:
        character.hero_coins = 0


def calculate_derived(character: Character) -> None:
    """Calculate derived statistics."""
    str_mod = characteristic_modifier(character.abilities.get("str", 7))
    dex_mod = characteristic_modifier(character.abilities.get("dex", 7))
    end_mod = characteristic_modifier(character.abilities.get("end", 7))
    edu_mod = characteristic_modifier(character.abilities.get("edu", 7))
    int_val = character.abilities.get("int", 7)
    edu_val = character.abilities.get("edu", 7)

    # Hit Points: END + career modifier (simplified: base END for now)
    hp = max(1, character.abilities.get("end", 7))

    # Stamina Points: END + STR modifier
    stamina = max(1, character.abilities.get("end", 7) + str_mod)

    # Initiative: DEX modifier
    initiative = dex_mod

    # Armor Class: 8 + DEX modifier (unarmored)
    ac = 8 + dex_mod

    # Skill Maximum: INT + EDU
    skill_max = int_val + edu_val

    # Languages: EDU modifier (minimum 1)
    languages = max(1, edu_mod)

    character.derived = {
        "hit_points": hp,
        "stamina_points": stamina,
        "initiative_modifier": initiative,
        "armor_class": ac,
        "skill_maximum": skill_max,
        "languages": languages,
        "movement": 6,  # Human base; updated by species
    }


def generate_base_character(name: str = "Unnamed") -> Character:
    """Generate a fresh character through background/mustering phase."""
    char = Character(name)

    # 1. Roll abilities
    char.abilities = roll_abilities()

    # 2. Load species and apply modifiers
    species_data = load_json(data_path("species", "human.json"))
    apply_species_modifiers(char, species_data)

    # 3. Roll supernatural
    char.supernatural = roll_supernatural()

    # 4. Hero coins
    award_hero_coins(char)

    # 5. SOC tier & background
    bg = select_background(char.abilities["soc"])
    char.background_id = bg["background_id"]

    # Pick one background skill
    import random
    char.background_skill = random.choice(bg["skill_options"])
    char.skills[char.background_skill] = char.skills.get(char.background_skill, 0) + 1

    # Apply species background skill bonus (Human = +1 choice)
    bonus_skills = species_data.get("background_skill_bonus", 0)
    for _ in range(bonus_skills):
        extra = random.choice(bg["skill_options"])
        char.skills[extra] = char.skills.get(extra, 0) + 1

    # 6. Starting funds
    starting_cash = int(500 * bg["starting_funds_modifier"])
    char.assets.append({"type": "cash", "amount": starting_cash})

    # 7. Derived stats
    calculate_derived(char)
    char.derived["movement"] = species_data.get("base_speed", 6)

    return char
