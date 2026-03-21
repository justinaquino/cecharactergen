# CE Character Generator — Data Architecture

## Document Purpose

This document defines all JSON data table schemas, naming conventions, and the generation pipeline order for the CE Character Generator. The PRD references this as `DATA_ARCHITECTURE.md §DA-N.N`.

**Related documents:**
- `CE_Mneme_Character_Generation_mechanics.md` — game rules the schemas implement
- `PRD.md` — feature requirements that consume these schemas

---

## 1. Conventions [DA-1]

### 1.1 Naming Convention [DA-1.1]

**Use "Species" not "Race" throughout the application.**

- ✅ `species.json` (correct)
- ❌ `races.json` (deprecated naming — do not use)

This applies to: file names, JSON keys, UI labels, TypeScript types, and code comments.

### 1.2 Variant Field [DA-1.2]

Tables with CE/Mneme differences use a `variants` metadata field and top-level keys `ce_standard` and `mneme`. The `rules.json` `activeRuleset` field determines which variant the engine reads.

### 1.3 Enabled Flag [DA-1.3]

Tables with toggleable entries (careers, species) include `"enabled": true/false`. The application filters to enabled entries only during generation. Factory defaults have canonical CE entries enabled.

---

## 2. Generation Pipeline Order [DA-2]

The character generation engine reads tables in this order:

| Step | Table(s) | Purpose |
|------|----------|---------|
| 1 | `species.json` | Species selection and characteristic roll specs |
| 2 | `species.json` | Roll characteristics using species specs |
| 3 | `homeworlds.json`, `backgrounds.json` | Homeworld and background selection; background skills |
| 4 | `careers.json` | Pre-career education (if taken) |
| 5 | `careers.json`, `draft.json` | Career terms: qualification, survival, advancement, skills |
| 5a | `survival_mishaps.json`, `injury.json` | Mishap and injury handling |
| 5b | `medical_bills.json` | Medical treatment costs |
| 5c | `aging.json`, `anagathics.json` | Aging effects per term |
| 6 | `careers.json`, `retirement_pay.json` | Mustering out benefits and pension |
| 7 | `equipment.json` | Equipment assignment |
| 8 | `cultures_names.json`, `name_generation_rules.json` | Name generation |
| 9 | `soc_table.json` | Final SOC title and details |

---

## 3. JSON Table Schemas [DA-3]

### 3.1 `species.json` [DA-3.1]

Species definitions with characteristic roll specifications and traits.

```json
{
  "_metadata": {
    "version": "1.0",
    "description": "Species definitions with characteristic modifiers"
  },
  "terrestrial_human": {
    "id": "terrestrial_human",
    "name": "Terrestrial Human",
    "description": "Standard humans from Earth or high-G habitats",
    "enabled": true,
    "characteristicRolls": {
      "STR": "2d6",
      "DEX": "2d6",
      "END": "2d6",
      "INT": "2d6",
      "EDU": "2d6",
      "SOC": "2d6"
    },
    "modifiers": {},
    "startingSkills": [],
    "traits": [],
    "backgroundsAllowed": "all"
  },
  "low_g_human": {
    "id": "low_g_human",
    "name": "Low-G Human (Mneme Variant)",
    "description": "Adapted for low-G habitats (0.3–0.6G). Requires toggles.lowGHuman = true.",
    "enabled": true,
    "characteristicRolls": {
      "STR": "dis1",
      "DEX": "adv1",
      "END": "dis1",
      "INT": "2d6",
      "EDU": "2d6",
      "SOC": "2d6-1"
    },
    "modifiers": {
      "move": -1,
      "moveCondition": "0.7G+"
    },
    "startingSkills": [
      { "skill": "Zero-G", "level": 2 },
      { "skill": "Vacc Suit", "level": 1 },
      { "skill": "Survival (Habitat)", "level": 1 }
    ],
    "traits": ["half_weight", "low_gravity_adaptation"],
    "backgroundsAllowed": "space_only"
  },
  "esper": {
    "id": "esper",
    "name": "Esper",
    "description": "Humans or near-humans that have embraced commonplace psionics. Tall, slender, aloof.",
    "enabled": false,
    "characteristicRolls": {
      "STR": "2d6",
      "DEX": "2d6",
      "END": "2d6",
      "INT": "2d6",
      "EDU": "2d6",
      "SOC": "2d6"
    },
    "modifiers": {},
    "startingSkills": [],
    "traits": ["psionic", "aloof"],
    "backgroundsAllowed": "all"
  },
  "merfolk": {
    "id": "merfolk",
    "name": "Merfolk",
    "description": "Genetically modified from human stock for waterworld life. Amphibious, aquatic.",
    "enabled": false,
    "characteristicRolls": {
      "STR": "2d6",
      "DEX": "2d6",
      "END": "2d6",
      "INT": "2d6",
      "EDU": "2d6",
      "SOC": "2d6"
    },
    "modifiers": {},
    "startingSkills": [
      { "skill": "Watercraft", "level": 1 },
      { "skill": "Animals (Aquatic)", "level": 1 },
      { "skill": "Survival (Ocean)", "level": 1 }
    ],
    "traits": ["amphibious", "aquatic", "water_dependent"],
    "backgroundsAllowed": "water_world_only"
  }
}
```

### 3.2 `cultures_names.json` [DA-3.2]

Name pools organized by cultural heritage. Based on UNESCO-recognized cultural groups.

> **CLARIFY — BLOCKING:** The canonical name pools need to be populated. Provide complete lists for at minimum: English, Japanese, Arabic, Spanish, Chinese, Russian, and Alien (Vargr, Aslan) cultures before implementation of FR for name generation.

```json
{
  "_metadata": {
    "version": "1.0",
    "description": "Name pools by cultural heritage"
  },
  "cultures": {
    "english": {
      "heritage": "European",
      "male": ["James", "William", "Henry"],
      "female": ["Mary", "Elizabeth", "Sarah"],
      "unisex": ["Alex", "Jordan", "Taylor"],
      "surnames": ["Smith", "Johnson", "Williams"]
    },
    "japanese": {
      "heritage": "Asian",
      "male": ["Kenji", "Takeshi", "Hiroshi"],
      "female": ["Yuki", "Sakura", "Aiko"],
      "surnames": ["Tanaka", "Yamamoto", "Suzuki"]
    }
  },
  "alien_species": {
    "vargr": { "_note": "TBD — Vargr naming conventions needed" },
    "aslan": { "_note": "TBD — Aslan naming conventions needed" }
  }
}
```

### 3.3 `name_generation_rules.json` [DA-3.3]

Format patterns and rules for constructing names.

> **CLARIFY:** Provide complete format patterns for all cultures, including alien species. Specify what happens when a culture has no unisex list (fall back to male/female?).

```json
{
  "_metadata": {
    "version": "1.0",
    "description": "Rules for generating names from cultures_names.json"
  },
  "defaultCulture": "random",
  "formatPatterns": {
    "human": "{firstName} {surname}",
    "vargr": "{packName}-{givenName}",
    "aslan": "{clanName} {personalName}"
  },
  "genderOptions": ["male", "female", "unisex", "random"]
}
```

### 3.4 `backgrounds.json` [DA-3.4]

Pre-career backgrounds and origins. Determines available background skill pools.

```json
{
  "_metadata": {
    "version": "1.0",
    "description": "Pre-career backgrounds and origins"
  },
  "backgrounds": [
    {
      "id": "high_tech_world",
      "name": "High Tech World",
      "description": "Born on a technologically advanced world",
      "category": "planetary",
      "skillOptions": ["Computer", "Electronics", "Medic"]
    },
    {
      "id": "orbital_habitat",
      "name": "Orbital Habitat",
      "description": "Raised in a space station or orbital",
      "category": "space",
      "skillOptions": ["Zero-G", "Vacc Suit", "Engineering"]
    }
  ]
}
```

### 3.5 `character_sheet.json` [DA-3.5]

Data model for completed and in-progress characters stored in IndexedDB. This is the canonical character object shape — all generation steps accumulate into this structure.

```json
{
  "_metadata": {
    "version": "1.0",
    "description": "Data model for completed and in-progress characters"
  },
  "id": "uuid-v4",
  "name": "John Smith",
  "age": 34,
  "species": "terrestrial_human",
  "homeworld": "high_tech_world",
  "background": "orbital_habitat",
  "upp": "787A9C",
  "terms": 4,
  "abilities": {
    "characteristics": {
      "STR": 7,
      "DEX": 8,
      "END": 9,
      "INT": 10,
      "EDU": 11,
      "SOC": 6,
      "PSI": null
    },
    "speciesFeatures": []
  },
  "traits": [],
  "skills": {
    "background": [{ "skill": "Computer", "level": 0 }],
    "career": [{ "skill": "Gun Combat", "level": 2 }]
  },
  "careerHistory": [
    {
      "term": 1,
      "career": "marine",
      "rank": 1,
      "rankTitle": "Lieutenant",
      "survived": true,
      "advanced": true,
      "skillGains": ["Gun Combat 1"],
      "eventDescription": "Survived ground assault",
      "benefitRolls": 1
    }
  ],
  "conditions": {
    "injuries": [{ "description": "Old wound (leg)", "severity": 2, "characteristicLost": "END", "pointsLost": 1 }],
    "medicalDebt": 15000
  },
  "assets": {
    "cash": 30000,
    "equipment": ["Laser Pistol", "Vacc Suit"],
    "benefits": ["TAS Membership", "Ship Share"],
    "annualPension": 10000
  },
  "connections": {
    "allies": ["Sgt. Major Davies"],
    "enemies": [],
    "contacts": ["Dr. Aris"]
  },
  "metadata": {
    "generationDate": "2026-03-07T10:00:00Z",
    "rulesVariant": "mneme",
    "generationVersion": "1.0"
  }
}
```

### 3.6 `homeworlds.json` [DA-3.6]

World types with associated background skills. Supports CE and Mneme variants.

```json
{
  "_metadata": {
    "version": "1.0",
    "description": "World types with background skills",
    "variants": ["ce_standard", "mneme"]
  },
  "ce_standard": {
    "high_tech": {
      "name": "High Tech World",
      "tradeCodes": ["Ht"],
      "skillOptions": ["Computer", "Electronics", "Medic"]
    },
    "low_tech": {
      "name": "Low Tech World",
      "tradeCodes": ["Lt"],
      "skillOptions": ["Animals", "Survival", "Melee"]
    },
    "asteroid": {
      "name": "Asteroid Belt",
      "tradeCodes": ["As"],
      "skillOptions": ["Zero-G", "Vacc Suit", "Prospecting"]
    },
    "agricultural": {
      "name": "Agricultural World",
      "tradeCodes": ["Ag"],
      "skillOptions": ["Animals", "Farming", "Survival"]
    },
    "water_world": {
      "name": "Water World",
      "tradeCodes": ["Wa"],
      "skillOptions": ["Watercraft", "Survival", "Animals"]
    }
  },
  "mneme": {
    "high_tech": {
      "name": "High Tech World",
      "tradeCodes": ["Ht"],
      "skillOptions": ["Computer", "Electronics", "Medic"],
      "economicModifier": 1.5
    }
  }
}
```

### 3.7 `careers.json` [DA-3.7]

All 24 Cepheus Engine careers in a single file. Each career has qualification, survival, advancement, rank structure, skill tables, and benefits. See MECH-6 for the rules governing these fields.

> **NOTE:** M2 starts with 3 complete careers (Drifter, Marine, Scout). M3 adds all 24. All 24 must be present in the file before M3 generation can begin — stub entries with `"enabled": false` are acceptable.

```json
{
  "_metadata": {
    "version": "1.0",
    "description": "All 24 Cepheus Engine careers",
    "totalCareers": 24,
    "careersList": [
      { "id": "drifter", "name": "Drifter", "category": "Civilian", "enabled": true },
      { "id": "marine", "name": "Marine", "category": "Military", "enabled": true },
      { "id": "scout", "name": "Scout", "category": "Exploration", "enabled": true },
      { "id": "noble", "name": "Noble", "category": "Elite", "enabled": false }
    ]
  },
  "drifter": {
    "id": "drifter",
    "name": "Drifter",
    "enabled": true,
    "category": "civilian",
    "description": "Wanderers and those on the fringes of society without a fixed home or career.",
    "qualification": {
      "roll": "2d6",
      "target": 0,
      "auto": true,
      "dm": {},
      "description": "Automatic entry"
    },
    "survival": {
      "roll": "2d6",
      "target": 6,
      "dm": { "END": 1 },
      "description": "Roll 2D6 + END DM vs 6"
    },
    "commission": { "has": false },
    "advancement": {
      "roll": "2d6",
      "target": 7,
      "dm": { "INT": 1 },
      "description": "Roll 2D6 + INT DM vs 7"
    },
    "reenlistment": {
      "roll": "2d6",
      "target": 0,
      "automatic": true
    },
    "ranks": {
      "0": { "title": "Wanderer", "skill": null },
      "1": { "title": "Vagabond", "skill": "Streetwise 1" },
      "2": { "title": "Traveller", "skill": "Deception 1" },
      "3": { "title": "Itinerant", "skill": null },
      "4": { "title": "Wayfarer", "skill": null },
      "5": { "title": "Nomad", "skill": "Jack of all Trades 1" },
      "6": { "title": "Wayfarer Senior", "skill": "Survival 1" }
    },
    "skillTables": {
      "personal": ["+1 STR", "+1 DEX", "+1 END", "+1 INT", "+1 EDU", "+1 SOC"],
      "service": ["Athletics", "Melee", "Recon", "Streetwise", "Survival", "Vacc Suit"],
      "specialist": ["Engineer", "Gun Combat", "Melee", "Recon", "Stealth", "Survival"],
      "advanced": ["Leadership", "Tactics", "Deception", "Persuade", "Streetwise", "Jack of all Trades"]
    },
    "benefits": {
      "material": [
        { "roll": 1, "benefit": "Contact" },
        { "roll": 2, "benefit": "Weapon" },
        { "roll": 3, "benefit": "Alliance" },
        { "roll": 4, "benefit": "Ship Share" },
        { "roll": 5, "benefit": "Ship Share" },
        { "roll": 6, "benefit": "Life Insurance" },
        { "roll": 7, "benefit": "Life Insurance +2" }
      ],
      "cash": [
        { "roll": 1, "amount": 1000 },
        { "roll": 2, "amount": 5000 },
        { "roll": 3, "amount": 10000 },
        { "roll": 4, "amount": 10000 },
        { "roll": 5, "amount": 20000 },
        { "roll": 6, "amount": 50000 },
        { "roll": 7, "amount": 100000 }
      ]
    },
    "events": [
      { "roll": 2, "event": "Disaster!", "description": "Roll on the mishap table but you are not ejected from this career." },
      { "roll": 3, "event": "Street Contacts", "description": "Gain Streetwise 1 and a contact." }
    ],
    "mishaps": [
      { "roll": 1, "mishap": "Injury", "description": "Severely injured. Roll twice on Injury table and take lower result." },
      { "roll": 2, "mishap": "Discharged", "description": "Honorably discharged." }
    ],
    "noRetirement": true
  }
}
```

### 3.8 `draft.json` [DA-3.8]

Draft/conscription assignment tables for both CE Standard and Mneme variants.

```json
{
  "_metadata": {
    "version": "1.0",
    "description": "Draft assignment tables — CE and Mneme variants"
  },
  "ce_standard": [
    { "roll": 1, "career": "aerospace_defense" },
    { "roll": 2, "career": "marine" },
    { "roll": 3, "career": "maritime_defense" },
    { "roll": 4, "career": "navy" },
    { "roll": 5, "career": "scout" },
    { "roll": 6, "career": "surface_defense" }
  ],
  "mneme": [
    { "roll": 1, "career": "barbarian" },
    { "roll": 2, "career": "belter" },
    { "roll": 3, "career": "colonist" },
    { "roll": 4, "career": "mercenary" },
    { "roll": 5, "career": "pirate" },
    { "roll": 6, "career": "rogue" }
  ]
}
```

### 3.9 `survival_mishaps.json` [DA-3.9]

Mishap consequences when a survival roll fails. Roll 1D6.

```json
{
  "_metadata": {
    "version": "1.0",
    "description": "Mishap table — roll 1D6 on survival failure"
  },
  "mishaps": [
    {
      "roll": 1,
      "description": "Injured in action. Roll twice on the Injury table and take the lower result.",
      "effect": "injury_double",
      "careerEnding": true,
      "losesBenefits": false
    },
    {
      "roll": 2,
      "description": "Honorably discharged from the service.",
      "effect": "none",
      "careerEnding": true,
      "losesBenefits": false
    },
    {
      "roll": 3,
      "description": "Honorably discharged after a long legal battle. Legal debt of Cr10,000.",
      "effect": "debt_10000",
      "careerEnding": true,
      "losesBenefits": false
    },
    {
      "roll": 4,
      "description": "Dishonorably discharged. Lose all benefits.",
      "effect": "none",
      "careerEnding": true,
      "losesBenefits": true
    },
    {
      "roll": 5,
      "description": "Dishonorably discharged after 4 years in prison. Lose all benefits.",
      "effect": "none",
      "careerEnding": true,
      "losesBenefits": true
    },
    {
      "roll": 6,
      "description": "Medically discharged. Roll on the Injury table.",
      "effect": "injury_single",
      "careerEnding": true,
      "losesBenefits": false
    }
  ]
}
```

### 3.10 `injury.json` [DA-3.10]

Injury severity and characteristic effects. Roll 1D6.

```json
{
  "_metadata": {
    "version": "1.0",
    "description": "Injury table — roll 1D6"
  },
  "injuries": [
    {
      "roll": 1,
      "severity": "nearly_killed",
      "description": "Nearly killed. Reduce one physical characteristic by 1D6; reduce both other physical characteristics by 2 (or one by 4).",
      "effect": "physical_major"
    },
    {
      "roll": 2,
      "severity": "severely_injured",
      "description": "Severely injured. Reduce one physical characteristic by 1D6.",
      "effect": "physical_1d6"
    },
    {
      "roll": 3,
      "severity": "missing_part",
      "description": "Missing eye or limb. Reduce STR or DEX by 2.",
      "effect": "str_or_dex_minus2"
    },
    {
      "roll": 4,
      "severity": "scarred",
      "description": "Scarred. Reduce any one physical characteristic by 2.",
      "effect": "physical_minus2"
    },
    {
      "roll": 5,
      "severity": "injured",
      "description": "Injured. Reduce any physical characteristic by 1.",
      "effect": "physical_minus1"
    },
    {
      "roll": 6,
      "severity": "light",
      "description": "Lightly injured. No permanent effect.",
      "effect": "none"
    }
  ],
  "crisis": {
    "trigger": "any_characteristic_reaches_0",
    "cost": "1d6_x_10000",
    "description": "If any characteristic reaches 0, character dies unless Cr(1D6×10,000) paid for emergency care. All future Qualification rolls automatically fail.",
    "restoredCharacteristicValue": 1
  },
  "medicalCostPerPoint": 5000
}
```

### 3.11 `medical_bills.json` [DA-3.11]

Employer coverage of medical care costs, by career group. Roll 2D6 + Rank DM.

```json
{
  "_metadata": {
    "version": "1.0",
    "description": "Medical bill employer coverage by career — MECH-7.3"
  },
  "careerGroups": {
    "military": {
      "careers": ["aerospace_defense", "marine", "maritime_defense", "navy", "scout", "surface_defense"],
      "coverage": { "roll_4": 0.75, "roll_8": 1.0, "roll_12": 1.0 }
    },
    "professional": {
      "careers": ["agent", "athlete", "bureaucrat", "diplomat", "entertainer", "hunter", "mercenary", "merchant", "noble", "physician", "pirate", "scientist", "technician"],
      "coverage": { "roll_4": 0.50, "roll_8": 0.75, "roll_12": 1.0 }
    },
    "fringe": {
      "careers": ["barbarian", "belter", "colonist", "drifter", "rogue"],
      "coverage": { "roll_4": 0.0, "roll_8": 0.50, "roll_12": 0.75 }
    }
  },
  "restorationCostPerPoint": 5000
}
```

### 3.12 `aging.json` [DA-3.12]

Aging effects by term and ruleset variant.

```json
{
  "_metadata": {
    "version": "1.0",
    "description": "Aging effects — CE Standard and Mneme variant",
    "variants": ["ce_standard", "mneme"]
  },
  "ce_standard": {
    "startTerm": 4,
    "mechanic": "2d6_minus_terms",
    "agingTable": [
      { "result_or_less": -6, "effects": ["physical_minus2_x3", "mental_minus1_x1"] },
      { "result": -5, "effects": ["physical_minus2_x3"] },
      { "result": -4, "effects": ["physical_minus2_x2", "physical_minus1_x1"] },
      { "result": -3, "effects": ["physical_minus2_x1", "physical_minus1_x2"] },
      { "result": -2, "effects": ["physical_minus1_x3"] },
      { "result": -1, "effects": ["physical_minus1_x2"] },
      { "result": 0, "effects": ["physical_minus1_x1"] },
      { "result_or_more": 1, "effects": [] }
    ]
  },
  "mneme": {
    "startTerm": 5,
    "mechanic": "core_task_resolution",
    "formula": "2d6 + END_DM vs (terms + 1)",
    "onFailure": "physical_minus1_x1"
  },
  "crisis": {
    "trigger": "any_characteristic_reaches_0",
    "description": "Aging crisis — same rules as injury crisis (MECH-8.3)"
  }
}
```

### 3.13 `anagathics.json` [DA-3.13]

Anti-aging drug rules for both variants.

```json
{
  "_metadata": {
    "version": "1.0",
    "description": "Anagathics (anti-aging drugs) — CE Standard and Mneme",
    "variants": ["ce_standard", "mneme"]
  },
  "ce_standard": {
    "mechanic": "declare_before_survival",
    "effect": "add_terms_since_start_as_positive_dm_to_aging",
    "secondSurvivalCheck": true,
    "costFormula": "1d6_x_2500_per_term",
    "paidFrom": "mustering_out_cash",
    "stopping": "roll_aging_immediately_on_cessation",
    "availability": "unspecified"
  },
  "mneme": {
    "mechanic": "spend_to_skip",
    "cost": 100000,
    "effect": "skip_aging_roll_entirely",
    "secondSurvivalCheck": false,
    "maxUses": "SOC - 7",
    "minUses": 1,
    "availability": ["Starport A", "Starport B"],
    "paidFrom": "mustering_out_benefits_first"
  }
}
```

### 3.14 `retirement_pay.json` [DA-3.14]

Annual pension by terms served in a single career. Minimum 5 terms. See MECH-9.4.

```json
{
  "_metadata": {
    "version": "1.0",
    "description": "Retirement pay — 5+ terms in single career. MECH-9.4."
  },
  "pensionTable": [
    { "terms": 5, "annual": 10000 },
    { "terms": 6, "annual": 12000 },
    { "terms": 7, "annual": 14000 },
    { "terms": 8, "annual": 16000 }
  ],
  "beyondEightTerms": "+2000 per term beyond 8",
  "noRetirementCareers": ["drifter", "belter", "barbarian"],
  "note": "noRetirementCareers applies in Mneme ruleset only (MECH-2.2)"
}
```

### 3.15 `soc_table.json` [DA-3.15]

Social Standing titles and economic tier information.

```json
{
  "_metadata": {
    "version": "1.0",
    "description": "Social Standing titles and economic tiers",
    "variants": ["ce_standard", "mneme"]
  },
  "ce_standard": {
    "titles": {
      "1": "Outcast",
      "2": "Outcast",
      "3": "Serf",
      "4": "Peasant",
      "5": "Average",
      "6": "Average",
      "7": "Average",
      "8": "Merchant Class",
      "9": "Gentry",
      "10": "Lord/Lady",
      "11": "Knight/Dame",
      "12": "Baron/Baroness",
      "13": "Marquis/Marquessa",
      "14": "Count/Countess",
      "15": "Duke/Duchess"
    }
  },
  "mneme": {
    "economicTiers": {
      "formula": "Income = Base × 2^(SOC − 10)",
      "description": "Each SOC level above 9 roughly doubles annual resource flow",
      "note": "SOC can exceed 15 in Mneme for interstellar nobility"
    }
  }
}
```

### 3.16 `equipment.json` [DA-3.16]

Weapons, armor, gear, and assets available for purchase or as benefits.

```json
{
  "_metadata": {
    "version": "1.0",
    "description": "Equipment catalog — weapons, armor, gear, assets"
  },
  "weapons": [
    {
      "id": "dagger",
      "name": "Dagger",
      "type": "melee",
      "damage": "1d6",
      "mass": 0.25,
      "cost": 10,
      "tl": 1
    },
    {
      "id": "laser_pistol",
      "name": "Laser Pistol",
      "type": "energy",
      "damage": "3d6",
      "mass": 0.5,
      "cost": 2000,
      "tl": 9
    }
  ],
  "armor": [
    {
      "id": "vacc_suit",
      "name": "Vacc Suit",
      "protection": 4,
      "mass": 4,
      "cost": 10000,
      "tl": 9
    }
  ],
  "gear": [],
  "assets": []
}
```

### 3.17 `skills.json` [DA-3.17]

Skill definitions, categories, and cascade specialties.

```json
{
  "_metadata": {
    "version": "1.0",
    "description": "Skill definitions and categories"
  },
  "skills": [
    {
      "id": "admin",
      "name": "Admin",
      "category": "academic",
      "description": "Bureaucratic and administrative tasks",
      "cascade": false
    },
    {
      "id": "gun_combat",
      "name": "Gun Combat",
      "category": "combat",
      "description": "Use of ranged weapons",
      "cascade": true,
      "specialties": ["Pistol", "Rifle", "Shotgun", "Energy", "Slug", "Auto"]
    },
    {
      "id": "melee_combat",
      "name": "Melee Combat",
      "category": "combat",
      "description": "Hand-to-hand fighting",
      "cascade": true,
      "specialties": ["Unarmed", "Blade", "Bludgeon", "Natural Weapons", "Slashing Weapons"]
    }
  ]
}
```

### 3.18 `rules.json` [DA-3.18]

Active ruleset selection and variant toggles.

```json
{
  "_metadata": {
    "version": "1.0",
    "description": "Rule variant configuration — activeRuleset controls which variant is used"
  },
  "activeRuleset": "mneme",
  "rulesets": {
    "ce_standard": {
      "name": "Cepheus Engine Standard",
      "description": "CE SRD rules as written",
      "agingStartTerm": 4,
      "drifterAutoQual": false,
      "autoReenlist": false,
      "mnemeAdvancement": false,
      "mnemeDraft": false
    },
    "mneme": {
      "name": "Mneme Quick Fix",
      "description": "Streamlined Mneme variant rules (MECH-2.2)",
      "agingStartTerm": 5,
      "drifterAutoQual": true,
      "autoReenlist": true,
      "mnemeAdvancement": true,
      "mnemeDraft": true
    }
  },
  "toggles": {
    "psionics": false,
    "lowGHuman": true,
    "preCareerEducation": true,
    "allowDeath": true,
    "maxTerms": 7,
    "maxTermsOverride": null
  }
}
```
