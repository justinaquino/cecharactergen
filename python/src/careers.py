"""Career term resolution and mustering out."""

import random
from typing import Dict, List, Optional

from dice import roll_2d6, roll_d6, roll_vs_target, characteristic_modifier
from character import Character, load_json, data_path


def load_career(career_id: str) -> dict:
    """Load a single career JSON file."""
    return load_json(data_path("careers", f"{career_id}.json"))


def get_stat_dm(character: Character, stat: str) -> int:
    """Get the DM for a characteristic."""
    val = character.abilities.get(stat, 7)
    return characteristic_modifier(val)


def resolve_qualification(character: Character, career: dict) -> bool:
    """Attempt to qualify for a career. Returns True on success."""
    qual = career["qualification"]
    stat = qual.get("stat", "end")
    dm = qual.get("dm", 0) + get_stat_dm(character, stat)
    # Apply -2 DM per previous career
    dm -= 2 * len({c["career_id"] for c in character.careers})

    target = qual["target"]
    roll, total, success, effect = roll_vs_target(target, dm)
    return success


def gain_skill(character: Character, skill_id: str) -> None:
    """Increase a skill by one level, respecting skill maximum."""
    if skill_id in character.abilities:
        # Personal development stat increase
        stat = skill_id
        current = character.abilities.get(stat, 7)
        if current < 15:
            character.abilities[stat] = current + 1
        return

    skill_max = character.derived.get("skill_maximum", 14)
    current = character.skills.get(skill_id, 0)
    if current < skill_max:
        character.skills[skill_id] = current + 1


def roll_skill_table(character: Character, career: dict) -> str:
    """Roll on a career's skill table and return the skill gained."""
    roll = roll_d6()
    skills = career["skills"]

    if roll <= 2:
        table = skills["personal"]
    elif roll <= 4:
        table = skills["service"]
    elif roll == 5:
        edu = character.abilities.get("edu", 7)
        if edu >= 8:
            table = skills.get("advanced", skills["service"])
        else:
            table = skills["service"]
    else:
        # Roll 6: special or fallback to service
        table = skills.get("special", skills["service"])

    return random.choice(table)


def resolve_basic_training(character: Character, career: dict) -> None:
    """Gain all service skills at Level 0."""
    for skill_id in career["skills"]["service"]:
        if skill_id not in character.skills and skill_id not in character.abilities:
            character.skills[skill_id] = 0


def resolve_skill_rolls(character: Character, career: dict, rolls: int = 1) -> None:
    """Roll for skills the given number of times."""
    for _ in range(rolls):
        skill_id = roll_skill_table(character, career)
        gain_skill(character, skill_id)


def resolve_survival(character: Character, career: dict, term: int) -> tuple:
    """Roll survival. Returns (success, effect)."""
    surv = career["survival"]
    stat = surv.get("stat", "end")
    dm = get_stat_dm(character, stat)

    # terms_served penalty if applicable
    dm_modifier = surv.get("dm_modifier", "")
    if dm_modifier == "terms_served":
        dm -= term - 1  # penalty increases each term

    target = surv["target"]
    roll, total, success, effect = roll_vs_target(target, dm)
    return success, effect


def resolve_advancement(character: Character, career: dict, effect: int) -> tuple:
    """Check advancement based on survival effect. Returns (advanced, new_rank)."""
    adv = career["advancement"]
    threshold = adv.get("effect_threshold", 4)

    current_career_terms = [c for c in character.careers if c["career_id"] == career["career_id"]]
    current_rank = current_career_terms[-1]["rank"] if current_career_terms else 0

    if effect >= threshold and current_rank < len(career["ranks"]) - 1:
        new_rank = current_rank + 1
        rank_data = career["ranks"][new_rank]
        if rank_data.get("skill"):
            gain_skill(character, rank_data["skill"])
        # Even ranks increase SOC by 1
        if new_rank % 2 == 0:
            character.abilities["soc"] = character.abilities.get("soc", 7) + 1
        return True, new_rank
    return False, current_rank


def resolve_event(character: Character, career: dict, current_rank: int = 0) -> tuple:
    """Roll a career event and apply effects. Returns (description, new_rank)."""
    roll = roll_2d6()
    event_key = str(roll)
    events = career.get("events", {})

    # Handle ranges like "3-4"
    if event_key not in events:
        for key in events:
            if "-" in key:
                low, high = key.split("-")
                if int(low) <= roll <= int(high):
                    event_key = key
                    break

    event = events.get(event_key, {"description": "Uneventful term", "effect": "none"})
    effect = event.get("effect", "none")
    new_rank = current_rank

    if effect == "skill_roll":
        resolve_skill_rolls(character, career, 1)
    elif effect == "advancement_dm_plus_2":
        # For next term only; simplified: just grant an extra skill
        resolve_skill_rolls(character, career, 1)
    elif effect == "automatic_advancement_plus_skill":
        # Auto-advance if possible
        if current_rank < len(career["ranks"]) - 1:
            new_rank = current_rank + 1
            rank_data = career["ranks"][new_rank]
            if rank_data.get("skill"):
                gain_skill(character, rank_data["skill"])
            character.abilities["soc"] = character.abilities.get("soc", 7) + 1
        resolve_skill_rolls(character, career, 1)
    elif effect == "aging_roll":
        # Simplified: lose 1 from STR, DEX, or END
        stat = random.choice(["str", "dex", "end"])
        character.abilities[stat] = max(1, character.abilities.get(stat, 7) - 1)
    elif effect == "mishap":
        # Roll mishap and eject from career
        mishap_roll = roll_d6()
        mishaps = career.get("mishaps", {})
        mishap_desc = mishaps.get(str(mishap_roll), "Unknown mishap")
        return f"{event['description']}: {mishap_desc} (career ends)", current_rank

    return event["description"], new_rank


def resolve_mishap(character: Character, career: dict) -> str:
    """Roll on mishap table. Returns description."""
    roll = roll_d6()
    mishaps = career.get("mishaps", {})
    desc = mishaps.get(str(roll), "Unknown mishap")

    if roll == 1:
        # Severely injured
        stat = random.choice(["str", "dex", "end"])
        character.abilities[stat] = max(1, character.abilities.get(stat, 7) - random.randint(1, 3))
    elif roll == 3:
        character.abilities["soc"] = max(2, character.abilities.get("soc", 7) - 1)

    return desc


def resolve_aging(character: Character, term: int) -> bool:
    """Resolve aging for term 5+ (age 34+). Returns True if survived aging."""
    if term < 5:
        return True

    end_dm = get_stat_dm(character, "end")
    difficulty = term + 1  # Terms served + 1
    roll, total, success, effect = roll_vs_target(difficulty, end_dm)

    if not success:
        # Lose 1 point from STR, DEX, or END
        stat = random.choice(["str", "dex", "end"])
        character.abilities[stat] = max(1, character.abilities.get(stat, 7) - 1)
        if effect <= -6:
            # Critical failure: lose from two abilities
            stat2 = random.choice([s for s in ["str", "dex", "end"] if s != stat])
            character.abilities[stat2] = max(1, character.abilities.get(stat2, 7) - 1)
    return True


def resolve_reenlistment(career: dict) -> tuple:
    """Roll re-enlistment. Returns (can_continue, mandatory)."""
    # Default re-enlistment target is 7 for most careers
    target = career.get("reenlistment_target", 7)
    roll = roll_2d6()
    if roll == 12:
        return True, True  # Mandatory continuation
    return roll >= target, False


def resolve_term(character: Character, career_id: str) -> dict:
    """Resolve a single career term. Returns term summary."""
    career = load_career(career_id)
    term_num = len([c for c in character.careers if c["career_id"] == career_id]) + 1

    # Check if this is first term in this career
    is_first_term_in_career = term_num == 1
    is_first_career = len(character.careers) == 0

    term_summary = {
        "career_id": career_id,
        "term": term_num,
        "start_age": character.age,
        "survived": True,
        "mishap": None,
        "advanced": False,
        "rank": 0,
        "event": "",
        "skills_gained": [],
    }

    if is_first_term_in_career:
        # Qualification (skip if first career and auto-qualify)
        if not is_first_career:
            qualified = resolve_qualification(character, career)
            if not qualified:
                term_summary["survived"] = False
                term_summary["mishap"] = "Failed qualification"
                return term_summary

        # Basic training
        resolve_basic_training(character, career)

    # Skill rolls: 1 per term, +1 if first term and no advancement
    skill_rolls = 1
    if is_first_term_in_career:
        skill_rolls = 2  # Simplified: 2 rolls first term

    # Survival
    survived, effect = resolve_survival(character, career, term_num)
    if not survived:
        mishap_desc = resolve_mishap(character, career)
        term_summary["survived"] = False
        term_summary["mishap"] = mishap_desc
        character.age += 4
        character.total_terms += 1
        character.careers.append(term_summary)
        return term_summary

    # Advancement (Mneme: Effect 4+ on survival)
    advanced, new_rank = resolve_advancement(character, career, effect)
    term_summary["advanced"] = advanced
    term_summary["rank"] = new_rank
    if advanced:
        skill_rolls += 1

    # Apply skill rolls
    for _ in range(skill_rolls):
        skill_id = roll_skill_table(character, career)
        gain_skill(character, skill_id)
        term_summary["skills_gained"].append(skill_id)

    # Event
    event_desc, event_rank = resolve_event(character, career, new_rank)
    term_summary["event"] = event_desc

    # Update rank if event caused automatic advancement
    if event_rank > term_summary["rank"]:
        term_summary["rank"] = event_rank
        term_summary["advanced"] = True

    # Aging
    total_terms = character.total_terms + 1
    resolve_aging(character, total_terms)

    # Update character state
    character.age += 4
    character.total_terms = total_terms
    character.careers.append(term_summary)

    return term_summary


def muster_out(character: Character) -> dict:
    """Resolve mustering out benefits for all completed careers."""
    benefits = {
        "cash_rolls": [],
        "cash_total": 0,
        "benefit_rolls": [],
        "benefits_gained": [],
    }

    # Group careers by career_id to find best term count per career
    career_summary: Dict[str, dict] = {}
    for term in character.careers:
        cid = term["career_id"]
        if cid not in career_summary:
            career_summary[cid] = {"terms": 0, "rank": 0}
        career_summary[cid]["terms"] += 1
        career_summary[cid]["rank"] = max(career_summary[cid]["rank"], term["rank"])

    for cid, summary in career_summary.items():
        career = load_career(cid)
        rank = summary["rank"]
        terms = summary["terms"]

        # Cash rolls: up to 3 across all careers
        cash_dm = rank
        if "gambling" in character.skills:
            cash_dm += character.skills["gambling"] // 2

        max_cash_rolls = min(3 - len(benefits["cash_rolls"]), terms)
        for _ in range(max_cash_rolls):
            roll = roll_d6() + cash_dm
            roll = max(1, min(roll, len(career["mustering"]["cash"])))
            cash_amount = career["mustering"]["cash"][roll - 1]
            benefits["cash_rolls"].append(roll)
            benefits["cash_total"] += cash_amount

        # Benefit rolls: 1 per term
        benefit_dm = rank
        for _ in range(terms):
            roll = roll_d6() + benefit_dm
            roll = max(1, min(roll, len(career["mustering"]["benefits"])))
            benefit = career["mustering"]["benefits"][roll - 1]
            benefits["benefit_rolls"].append(roll)
            benefits["benefits_gained"].append(benefit)

    # Add cash to assets
    if benefits["cash_total"] > 0:
        character.assets.append({"type": "cash", "amount": benefits["cash_total"]})

    # Add material benefits as assets/equipment
    career_ids = list(career_summary.keys())
    for idx, benefit in enumerate(benefits["benefits_gained"]):
        source_career = career_ids[idx % len(career_ids)] if career_ids else "unknown"
        if benefit in ["weapon", "armor"]:
            character.equipment.append({"id": benefit, "condition": "good"})
        else:
            character.assets.append({"type": benefit, "description": f"Gained from {source_career}"})

    character.derived.update(benefits)
    return benefits
