"""Text-based character sheet renderer."""

from character import Character
from dice import characteristic_modifier


def render_abilities(character: Character) -> str:
    lines = ["## Abilities"]
    for stat in ["str", "dex", "end", "int", "edu", "soc"]:
        val = character.abilities.get(stat, 7)
        mod = characteristic_modifier(val)
        sign = "+" if mod >= 0 else ""
        lines.append(f"  {stat.upper():>3}: {val:2} ({sign}{mod})")
    return "\n".join(lines)


def render_supernatural(character: Character) -> str:
    val = character.supernatural
    mod = characteristic_modifier(val)
    sign = "+" if mod >= 0 else ""
    return f"Supernatural: {val} ({sign}{mod})  |  Hero Coins: {character.hero_coins}"


def render_careers(character: Character) -> str:
    if not character.careers:
        return "Careers: None"

    lines = ["## Career History"]
    for term in character.careers:
        rank_title = ""
        if term["rank"] > 0:
            # Load career to get rank title
            from careers import load_career
            try:
                career = load_career(term["career_id"])
                rank_title = f" ({career['ranks'][term['rank']]['title']})"
            except Exception:
                pass

        status = "SURVIVED" if term["survived"] else "MISHAP"
        adv = " [Promoted]" if term["advanced"] else ""
        lines.append(
            f"  Term {term['term']} — {term['career_id']}{rank_title}: {status}{adv}"
        )
        lines.append(f"    Event: {term['event']}")
        if term["mishap"]:
            lines.append(f"    Mishap: {term['mishap']}")
    return "\n".join(lines)


def render_skills(character: Character) -> str:
    if not character.skills:
        return "Skills: None"

    lines = ["## Skills"]
    # Sort by level descending, then name
    sorted_skills = sorted(character.skills.items(), key=lambda x: (-x[1], x[0]))
    for skill_id, level in sorted_skills:
        lines.append(f"  {skill_id}: {level}")
    return "\n".join(lines)


def render_equipment(character: Character) -> str:
    lines = []
    if character.equipment:
        lines.append("## Equipment")
        for item in character.equipment:
            lines.append(f"  {item['id']} ({item.get('condition', 'good')})")

    if character.assets:
        lines.append("## Assets")
        total_cash = 0
        non_cash_assets = []
        for asset in character.assets:
            if asset.get("type") == "cash":
                total_cash += asset.get("amount", 0)
            else:
                non_cash_assets.append(asset)
        if total_cash > 0:
            lines.append(f"  Cash: {total_cash} cr")
        for asset in non_cash_assets:
            lines.append(f"  {asset.get('type', 'asset')}: {asset.get('description', '')}")

    return "\n".join(lines) if lines else "Equipment: None"


def render_derived(character: Character) -> str:
    d = character.derived
    lines = ["## Derived Statistics"]
    lines.append(f"  Hit Points:     {d.get('hit_points', '?')}")
    lines.append(f"  Stamina:        {d.get('stamina_points', '?')}")
    lines.append(f"  Armor Class:    {d.get('armor_class', '?')}")
    lines.append(f"  Initiative:     {d.get('initiative_modifier', '?')}")
    lines.append(f"  Movement:       {d.get('movement', '?')} m")
    lines.append(f"  Skill Maximum:  {d.get('skill_maximum', '?')}")
    lines.append(f"  Languages:      {d.get('languages', '?')}")
    return "\n".join(lines)


def render_character_sheet(character: Character) -> str:
    """Return a complete text character sheet."""
    lines = [
        "=" * 50,
        f"  {character.name}",
        f"  {character.species_id.title()} | Age {character.age} | {character.background_id.replace('_', ' ').title()}",
        "=" * 50,
        "",
        render_abilities(character),
        "",
        render_supernatural(character),
        "",
        f"Background Skill: {character.background_skill}",
        "",
        render_careers(character),
        "",
        render_skills(character),
        "",
        render_equipment(character),
        "",
        render_derived(character),
        "",
        "=" * 50,
    ]
    return "\n".join(lines)
