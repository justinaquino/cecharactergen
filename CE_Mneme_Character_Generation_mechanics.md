# CE Mneme Character Generation Mechanics

## Purpose of this Document
This is the master repository for all rules, constraints, and data requirements related to character generation in the Cepheus Engine (with Mneme variants).

**Primary Goals:**
1. Serve as the single source of truth for character generation mechanics.
2. Provide context and rule definitions for AI Agents working on the application logic.
3. Act as a consolidated ledger for any key changes or house rules added to the core system.

---

## 5. DATA REQUIREMENTS

### 5.1 Naming Convention

**IMPORTANT:** Use "Species" not "Race" throughout the application.

- ✅ `species.json` (correct)
- ❌ `races.json` (deprecated naming)

### 5.2 Generation Pipeline Order

The generation flow uses tables in this order:

| Step | Table(s) Used | Purpose |
|------|---------------|---------|
| 1 | `species.json` | Species selection, characteristic modifiers |
| 2 | `species.json` | Roll characteristics with species modifiers |
| 3 | `homeworlds.json`, `backgrounds.json` | Homeworld & background selection |
| 4 | `careers.json` | Pre-career education (if applicable) |
| 5 | `careers.json`, `draft.json` | Career terms (qualification, survival, advancement) |
| 5a | `survival_mishaps.json`, `injury.json` | Mishap handling (if survival fails) |
| 5b | `medical_bills.json` | Medical treatment costs |
| 6 | `aging.json`, `anagathics.json` | Aging effects (Term 5+) |
| 7 | `careers.json`, `retirement_pay.json` | Mustering out benefits |
| 8 | `equipment.json` | Equipment assignment |
| 9 | `cultures_names.json`, `name_generation_rules.json` | Name generation |
| 10 | `soc_table.json` | Final details, SOC effects |

### 5.3 JSON Table Schemas

#### 5.3.1 `species.json`

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
    "description": "Adapted for low-G habitats (0.3-0.6G)",
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
      {"skill": "Zero-G", "level": 2},
      {"skill": "Vacc Suit", "level": 1},
      {"skill": "Survival (Habitat)", "level": 1}
    ],
    "traits": ["half_weight"],
    "backgroundsAllowed": "space_only"
  },
    "traits": ["psionic", "aloof"],
    "backgroundsAllowed": "all"
  },
    "startingSkills": [
      {"skill": "Watercraft", "level": 1},
      {"skill": "Animals (Aquatic)", "level": 1},
      {"skill": "Survival (Ocean)", "level": 1}
    ],
    "traits": ["amphibious", "aquatic", "water_dependent"],
    "backgroundsAllowed": "water_world_only"
  }
}
```

#### 5.3.2 `cultures_names.json`

```json
{
  "_metadata": {
    "version": "1.0",
    "description": "Name pools by cultural heritage (UNESCO-based)"
  },
  "cultures": {
    "english": {
      "heritage": "European",
      "male": ["James", "William", "Henry", "..."],
      "female": ["Mary", "Elizabeth", "Sarah", "..."],
      "unisex": ["Alex", "Jordan", "Taylor", "..."],
      "surnames": ["Smith", "Johnson", "Williams", "..."]
    },
    "japanese": {
      "heritage": "Asian",
      "male": ["Kenji", "Takeshi", "Hiroshi", "..."],
      "female": ["Yuki", "Sakura", "Aiko", "..."],
      "surnames": ["Tanaka", "Yamamoto", "Suzuki", "..."]
    }
  },
  "alien_species": {
    "vargr": { "...": "..." },
    "aslan": { "...": "..." }
  }
}
```

#### 5.3.3 `name_generation_rules.json`

```json
{
  "_metadata": {
    "version": "1.0",
    "description": "Rules for generating names"
  },
  "defaultCulture": "random",
  "formatPatterns": {
    "human": "{firstName} {surname}",
    "vargr": "{packName}-{givenName}"
  }
}
```

#### 5.3.4 `backgrounds.json`

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

#### 5.3.5 `character_sheet.json`

```json
{
  "_metadata": {
    "version": "1.0",
    "description": "Data model for completed and in-progress characters"
  },
  "id": "uuid-v4",
  "name": "John Smith",
  "age": 34,
  "terms": 4,
  "species": "terrestrial_human",
  "homeworld": "high_tech_world",
  "background": "orbital_habitat",
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
  "traits": ["aloof", "half_weight"],
  "skills": {
    "personal": [{"skill": "Athletics", "level": 1}],
    "service": [{"skill": "Gun Combat", "level": 2}],
    "specialist": [{"skill": "Medic", "level": 1}],
    "advanced": []
  },
  "conditions": {
    "injuries": [{"description": "Old wound (leg)", "severity": 2}],
    "medicalDebt": 15000
  },
  "assets": {
    "cash": 30000,
    "equipment": ["Laser Pistol", "Vacc Suit"],
    "benefits": ["TAS Membership", "Ship Share"]
  },
  "history": [
    {
      "term": 1,
      "career": "marine",
      "event": "Survived ground assault",
      "skillGains": ["Gun Combat 1"]
    }
  ],
  "connections": {
    "allies": ["Sgt. Major Davies"],
    "enemies": [],
    "contacts": ["Dr. Aris"]
  },
  "metadata": {
    "generationDate": "2026-03-07T10:00:00Z",
    "rulesVariant": "ce_standard"
  }
}
```

#### 5.3.6 `homeworlds.json`

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
      "skillOptions": ["Computer", "Electronics", "Medic"]
    },
    "low_tech": {
      "name": "Low Tech World",
      "skillOptions": ["Animals", "Survival", "Melee"]
    }
  },
  "mneme": {
    "high_tech": {
      "name": "High Tech World",
      "skillOptions": ["Computer", "Electronics", "Medic"],
      "economicModifier": 1.5
    }
  }
}
```

#### 5.3.6 `careers.json`

```json
{
  "_metadata": {
    "version": "1.0",
    "description": "All 24 Cepheus Engine careers",
    "totalCareers": 24
  },
  "drifter": {
    "id": "drifter",
    "name": "Drifter",
    "enabled": true,
    "category": "civilian",
    "description": "Wanderers and those on the fringes of society",

    "qualification": {
      "roll": "2d6",
      "target": 0,
      "auto": true,
      "dm": {}
    },
    "survival": {
      "roll": "2d6",
      "target": 6,
      "dm": {"END": 1}
    },
    "commission": {
      "has": false
    },
    "advancement": {
      "roll": "2d6",
      "target": 7,
      "dm": {"INT": 1}
    },
    "reenlistment": {
      "roll": "2d6",
      "target": 0,
      "automatic": true
    },

    "ranks": {
      "1": {"title": "Wanderer", "skill": null},
      "2": {"title": "Vagabond", "skill": "Streetwise 1"},
      "3": {"title": "Traveller", "skill": "Deception 1"},
      "4": {"title": "Itinerant", "skill": null},
      "5": {"title": "Wayfarer", "skill": "Jack of all Trades 1"},
      "6": {"title": "Nomad", "skill": "Survival 1"}
    },

    "benefits": {
      "material": [
        {"roll": 1, "benefit": "Contact"},
        {"roll": 2, "benefit": "Weapon"},
        {"roll": 3, "benefit": "Alliance"},
        {"roll": 4, "benefit": "Ship Share"},
        {"roll": 5, "benefit": "Ship Share"},
        {"roll": 6, "benefit": "Life Insurance"}
      ],
      "cash": [
        {"roll": 1, "amount": 1000},
        {"roll": 2, "amount": 5000},
        {"roll": 3, "amount": 10000},
        {"roll": 4, "amount": 10000},
        {"roll": 5, "amount": 20000},
        {"roll": 6, "amount": 50000}
      ]
    },

    "skillTables": {
      "personal": ["+1 STR", "+1 DEX", "+1 END", "+1 INT", "+1 EDU", "+1 SOC"],
      "service": ["Athletics", "Melee", "Recon", "Streetwise", "Survival", "Vacc Suit"],
      "advanced": ["Leadership", "Tactics", "Deception", "Persuade", "Streetwise", "Jack of all Trades"]
    }
  }
}
```

#### 5.3.7 `draft.json`

```json
{
  "_metadata": {
    "version": "1.0",
    "description": "Draft/Conscription assignments"
  },
  "draftTable": [
    {"roll": 1, "career": "navy"},
    {"roll": 2, "career": "army"},
    {"roll": 3, "career": "marine"},
    {"roll": 4, "career": "merchant"},
    {"roll": 5, "career": "scout"},
    {"roll": 6, "career": "drifter"}
  ]
}
```

#### 5.3.8 `survival_mishaps.json`

```json
{
  "_metadata": {
    "version": "1.0",
    "description": "Mishap consequences when survival fails"
  },
  "mishaps": [
    {
      "roll": 2,
      "description": "Severely injured in action",
      "effect": "injury",
      "careerEnding": true
    },
    {
      "roll": 3,
      "description": "Honorably discharged",
      "effect": "none",
      "careerEnding": true
    }
  ]
}
```

#### 5.3.9 `injury.json`

```json
{
  "_metadata": {
    "version": "1.0",
    "description": "Injury severity and effects"
  },
  "injuries": [
    {
      "roll": 1,
      "severity": "nearly_killed",
      "description": "Nearly killed",
      "characteristicDamage": {
        "STR": -2,
        "DEX": -2,
        "END": -2
      },
      "recoveryMonths": 6
    },
    {
      "roll": 2,
      "severity": "severely_injured",
      "description": "Severely injured",
      "characteristicDamage": {
        "random": -2
      },
      "recoveryMonths": 3
    }
  ]
}
```

#### 5.3.10 `medical_bills.json`

```json
{
  "_metadata": {
    "version": "1.0",
    "description": "Medical treatment costs"
  },
  "baseCostPerSeverity": {
    "minor": 5000,
    "moderate": 20000,
    "severe": 100000,
    "critical": 500000
  },
  "techLevelModifier": {
    "TL8": 1.5,
    "TL10": 1.0,
    "TL12": 0.8,
    "TL15": 0.5
  }
}
```

#### 5.3.11 `aging.json`

```json
{
  "_metadata": {
    "version": "1.0",
    "description": "Aging effects by term",
    "variants": ["ce_standard", "mneme"]
  },
  "ce_standard": {
    "startTerm": 4,
    "thresholds": [
      {"term": 4, "difficulty": 8, "effects": ["STR", "DEX", "END"]},
      {"term": 8, "difficulty": 9, "effects": ["STR", "DEX", "END", "INT"]},
      {"term": 12, "difficulty": 10, "effects": ["all"]}
    ]
  },
  "mneme": {
    "startTerm": 5,
    "rollFormula": "2d6 + END_DM vs (terms + 1)",
    "thresholdInterval": 4
  }
}
```

#### 5.3.12 `anagathics.json`

```json
{
  "_metadata": {
    "version": "1.0",
    "description": "Anti-aging drug rules",
    "variants": ["ce_standard", "mneme"]
  },
  "ce_standard": {
    "costByTL": {
      "TL12": 100000,
      "TL14": 80000,
      "TL15": 50000
    },
    "sideEffects": true,
    "sideEffectTable": [...]
  },
  "mneme": {
    "cost": 100000,
    "maxDoses": "SOC - 7",
    "minDoses": 1,
    "availability": ["Starport A", "Starport B"],
    "sideEffects": false,
    "preventsAging": true
  }
}
```

#### 5.3.13 `retirement_pay.json`

```json
{
  "_metadata": {
    "version": "1.0",
    "description": "Pension by terms served"
  },
  "pensionTable": [
    {"terms": 5, "annual": 10000},
    {"terms": 6, "annual": 12000},
    {"terms": 7, "annual": 14000},
    {"terms": 8, "annual": 16000}
  ]
}
```

#### 5.3.14 `soc_table.json`

```json
{
  "_metadata": {
    "version": "1.0",
    "description": "Social Standing effects",
    "variants": ["ce_standard", "mneme"]
  },
  "ce_standard": {
    "titles": {
      "1": "Outcast",
      "5": "Average",
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
      "formula": "Income = Base × 2^(SOC - 10)",
      "description": "Each SOC level doubles economic income"
    }
  }
}
```

#### 5.3.15 `equipment.json`

```json
{
  "_metadata": {
    "version": "1.0",
    "description": "Weapons, armor, gear, assets"
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
    }
  ],
  "armor": [...],
  "gear": [...],
  "assets": [...]
}
```

#### 5.3.16 `skills.json`

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
      "category": "service",
      "description": "Bureaucratic and administrative tasks",
      "cascade": false
    },
    {
      "id": "gun_combat",
      "name": "Gun Combat",
      "category": "combat",
      "description": "Use of ranged weapons",
      "cascade": true,
      "specialties": ["Pistol", "Rifle", "Shotgun", "Energy"]
    }
  ]
}
```

#### 5.3.17 `rules.json`

```json
{
  "_metadata": {
    "version": "1.0",
    "description": "Rule variant definitions"
  },
  "activeRuleset": "ce_standard",
  "rulesets": {
    "ce_standard": {
      "name": "Cepheus Engine Standard",
      "unifiedRolls": false,
      "autoReenlist": false,
      "agingStart": 4,
      "drifterAutoQual": false
    },
    "mneme": {
      "name": "Mneme Variant",
      "unifiedRolls": true,
      "autoReenlist": true,
      "agingStart": 5,
      "drifterAutoQual": true
    }
  },
  "toggles": {
    "psionics": false,
    "lowGHuman": true,
  "tables": [
    {"file": "species.json", "category": "character", "entries": 4},
    {"file": "careers.json", "category": "career", "entries": 24},
    {"file": "skills.json", "category": "character", "entries": 50}
  ],
  "totalEntries": 400
}
```

---

## 6. MECHANISMS

This section defines all dice roll and calculation mechanics used throughout character generation. Section 7 (Generation Flow) references these by name.

### 6.1 Basic Dice Rolls

#### 6.1.1 d6 Roll (Single Die)

**Input:** None
**Output:** Integer 1-6
**Usage:** Individual die in multi-die rolls

```javascript
function rollD6() {
  return Math.floor(Math.random() * 6) + 1;
}
```

#### 6.1.2 2d6 Roll (Standard)

**Input:** None
**Output:** Integer 2-12
**Usage:** Most Cepheus Engine mechanics

```javascript
function roll2D6() {
  return rollD6() + rollD6();
}
```

#### 6.1.3 2d6 vs TN Roll (Target Number)

**Input:** Target number (TN), optional DM
**Output:** { roll, total, success }
**Usage:** Qualification, survival, advancement

```javascript
function roll2D6vsTN(targetNumber, dm = 0) {
  const roll = roll2D6();
  const total = roll + dm;
  return {
    roll: roll,
    total: total,
    success: total >= targetNumber
  };
}
```

### 6.2 Advantage/Disadvantage Rolls

#### 6.2.1 Advantage Roll (AdvX)

**Input:** X (number of extra dice, typically 1-3)
**Output:** Integer 2-12 (sum of highest 2 dice)
**Formula:** Roll (2+X) d6, keep highest 2
**Usage:** Low-G Human DEX (`adv1`)

```javascript
function rollAdvX(x) {
  const dice = [];
  for (let i = 0; i < 2 + x; i++) {
    dice.push(rollD6());
  }
  dice.sort((a, b) => b - a); // Descending
  return dice[0] + dice[1];   // Highest 2
}
```

**Examples:**
- `adv1` = Roll 3d6, keep highest 2
- `adv2` = Roll 4d6, keep highest 2
- `adv3` = Roll 5d6, keep highest 2

#### 6.2.2 Disadvantage Roll (DisX)

**Input:** X (number of extra dice, typically 1-3)
**Output:** Integer 2-12 (sum of lowest 2 dice)
**Formula:** Roll (2+X) d6, keep lowest 2
**Usage:** Low-G Human STR (`dis1`), END (`dis1`)

```javascript
function rollDisX(x) {
  const dice = [];
  for (let i = 0; i < 2 + x; i++) {
    dice.push(rollD6());
  }
  dice.sort((a, b) => a - b); // Ascending
  return dice[0] + dice[1];   // Lowest 2
}
```

**Examples:**
- `dis1` = Roll 3d6, keep lowest 2
- `dis2` = Roll 4d6, keep lowest 2
- `dis3` = Roll 5d6, keep lowest 2

### 6.3 Characteristic Mechanics

#### 6.3.1 Characteristic Stat Roll

**Input:** Roll specification from species (e.g., "2d6", "adv1", "dis1", "2d6-1")
**Output:** Integer (typically 2-12, modified)
**Usage:** Initial characteristic generation

```javascript
function rollCharacteristic(spec) {
  let value;

  if (spec === "2d6") {
    value = roll2D6();
  } else if (spec.startsWith("adv")) {
    const x = parseInt(spec.slice(3));
    value = rollAdvX(x);
  } else if (spec.startsWith("dis")) {
    const x = parseInt(spec.slice(3));
    value = rollDisX(x);
  } else if (spec.includes("-")) {
    const [roll, mod] = spec.split("-");
    value = roll2D6() - parseInt(mod);
  } else if (spec.includes("+")) {
    const [roll, mod] = spec.split("+");
    value = roll2D6() + parseInt(mod);
  }

  return Math.max(1, value); // Minimum 1
}
```

#### 6.3.2 Characteristic Modifier (DM) Calculation

**Input:** Characteristic value (1-15)
**Output:** Dice Modifier (-2 to +3)
**Formula:** `⌊value / 3⌋ - 2`

```javascript
function getCharacteristicDM(value) {
  return Math.floor(value / 3) - 2;
}
```

**Reference Table:**
| Value | DM |
|-------|-----|
| 1-2 | -2 |
| 3-5 | -1 |
| 6-8 | +0 |
| 9-11 | +1 |
| 12-14 | +2 |
| 15+ | +3 |

### 6.4 Career Mechanics

#### 6.4.1 Random Career Selection

**Input:** List of enabled careers
**Output:** Career ID
**Usage:** Random character generation

```javascript
function selectRandomCareer(enabledCareers) {
  const index = Math.floor(Math.random() * enabledCareers.length);
  return enabledCareers[index];
}
```

#### 6.4.2 Qualification Roll

**Input:** Career qualification data, character characteristics
**Output:** { roll, dm, total, qualified }
**Special:** Some careers have `auto: true` (always qualify)

```javascript
function rollQualification(career, characteristics) {
  if (career.qualification.auto) {
    return { roll: 0, dm: 0, total: 0, qualified: true };
  }

  let dm = 0;
  for (const [char, bonus] of Object.entries(career.qualification.dm)) {
    dm += getCharacteristicDM(characteristics[char.toUpperCase()]) * bonus;
  }

  const roll = roll2D6();
  const total = roll + dm;

  return {
    roll: roll,
    dm: dm,
    total: total,
    qualified: total >= career.qualification.target
  };
}
```

#### 6.4.3 Survival Roll

**Input:** Career survival data, character characteristics
**Output:** { roll, dm, total, survived }
**Effect:** Failure triggers mishap (career-ending)

```javascript
function rollSurvival(career, characteristics) {
  let dm = 0;
  for (const [char, bonus] of Object.entries(career.survival.dm)) {
    dm += getCharacteristicDM(characteristics[char.toUpperCase()]) * bonus;
  }

  const roll = roll2D6();
  const total = roll + dm;

  return {
    roll: roll,
    dm: dm,
    total: total,
    survived: total >= career.survival.target
  };
}
```

#### 6.4.4 Event Roll

**Input:** None
**Output:** Event from table (2d6 result)
**Usage:** Career events during term

```javascript
function rollEvent(eventTable) {
  const roll = roll2D6();
  return eventTable.find(e => e.roll === roll);
}
```

#### 6.4.5 Mishap Roll

**Input:** Mishap table
**Output:** Mishap consequence
**Effect:** Career-ending, may cause injury

```javascript
function rollMishap(mishapTable) {
  const roll = roll2D6();
  return mishapTable.find(m => m.roll === roll);
}
```

#### 6.4.6 Commission Roll

**Input:** Career commission data (if career has commissions)
**Output:** { roll, total, commissioned }

```javascript
function rollCommission(career, characteristics) {
  if (!career.commission.has) {
    return { commissioned: false };
  }

  let dm = 0;
  for (const [char, bonus] of Object.entries(career.commission.dm || {})) {
    dm += getCharacteristicDM(characteristics[char.toUpperCase()]) * bonus;
  }

  const roll = roll2D6();
  return {
    roll: roll,
    total: roll + dm,
    commissioned: (roll + dm) >= career.commission.target
  };
}
```

#### 6.4.7 Advancement Roll

**Input:** Career advancement data, character characteristics
**Output:** { roll, dm, total, advanced }

```javascript
function rollAdvancement(career, characteristics) {
  let dm = 0;
  for (const [char, bonus] of Object.entries(career.advancement.dm)) {
    dm += getCharacteristicDM(characteristics[char.toUpperCase()]) * bonus;
  }

  const roll = roll2D6();
  return {
    roll: roll,
    dm: dm,
    total: roll + dm,
    advanced: (roll + dm) >= career.advancement.target
  };
}
```

### 6.5 Benefits Mechanics

#### 6.5.1 Benefits Roll

**Input:** Number of benefit rolls, cash/material preference
**Output:** List of benefits

**Rolls Per Term:**
- 1 benefit roll per term served
- +1 if rank 1-2
- +2 if rank 3-4
- +3 if rank 5-6

```javascript
function calculateBenefitRolls(terms, finalRank) {
  let rolls = terms;
  if (finalRank >= 5) rolls += 3;
  else if (finalRank >= 3) rolls += 2;
  else if (finalRank >= 1) rolls += 1;
  return rolls;
}
```

#### 6.5.2 Cash Benefit Roll

**Input:** Career cash table
**Output:** Credits amount
**Limit:** Maximum 3 cash rolls total

```javascript
function rollCashBenefit(career) {
  const roll = rollD6();
  return career.benefits.cash.find(c => c.roll === roll).amount;
}
```

#### 6.5.3 Material Benefit Roll

**Input:** Career material table, current rank
**Output:** Benefit item
**Bonus:** +1 to roll if rank 5+

```javascript
function rollMaterialBenefit(career, rank) {
  let roll = rollD6();
  if (rank >= 5) roll += 1;
  roll = Math.min(roll, 6); // Cap at 6
  return career.benefits.material.find(m => m.roll === roll).benefit;
}
```

### 6.6 Mustering Out

#### 6.6.1 Mustering Out Process

**Input:** Total terms, final rank, career history
**Output:** { cash, benefits, pension }

1. Calculate total benefit rolls
2. Choose cash vs material for each roll (max 3 cash)
3. Calculate retirement pay if eligible

#### 6.6.2 Retirement Pay Calculation

**Input:** Total terms served
**Output:** Annual pension (Cr)
**Eligibility:** 5+ terms

```javascript
function calculatePension(terms, pensionTable) {
  if (terms < 5) return 0;
  const entry = pensionTable.find(p => p.terms === Math.min(terms, 8));
  return entry ? entry.annual : 0;
}
```

### 6.7 Aging Mechanics

#### 6.7.1 Aging Roll (CE Standard)

**Input:** Current term, END DM
**Output:** { roll, passed, effects }
**Start:** Term 4

```javascript
function rollAging_CE(term, endDM) {
  if (term < 4) return { effects: [] };

  const difficulty = getDifficulty_CE(term);
  const roll = roll2D6();
  const total = roll + endDM;

  if (total >= difficulty) {
    return { roll, passed: true, effects: [] };
  }

  return {
    roll,
    passed: false,
    effects: getAgingEffects_CE(term)
  };
}
```

#### 6.7.2 Aging Roll (Mneme Variant)

**Input:** Current term, END DM
**Output:** { roll, passed, effects }
**Start:** Term 5
**Formula:** 2d6 + END DM vs (terms + 1)

```javascript
function rollAging_Mneme(term, endDM) {
  if (term < 5) return { effects: [] };

  const difficulty = term + 1;
  const roll = roll2D6();
  const total = roll + endDM;

  return {
    roll,
    difficulty,
    passed: total >= difficulty,
    effects: total < difficulty ? ["reduce_physical"] : []
  };
}
```

#### 6.7.3 Anagathics (Mneme Simplified)

**Input:** SOC, credits available
**Output:** { canAfford, dosesTaken, agingPrevented }

```javascript
function applyAnagathics_Mneme(soc, credits) {
  const maxDoses = Math.max(1, soc - 7);
  const costPerTerm = 100000;

  if (credits < costPerTerm) {
    return { canAfford: false, dosesTaken: 0, agingPrevented: false };
  }

  return {
    canAfford: true,
    dosesTaken: 1,
    cost: costPerTerm,
    agingPrevented: true
  };
}
```

---

## 7. CHARACTER GENERATION FLOW

This section describes the step-by-step character generation process. Each step references mechanisms from Section 6 by name.

### 7.1 Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    GENERATION FLOW                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Step 1: Species Selection                                  │
│      ↓                                                      │
│  Step 2: Roll Characteristics  (uses: Characteristic Roll)  │
│      ↓                                                      │
│  Step 3: Homeworld & Background                             │
│      ↓                                                      │
│  Step 4: Pre-Career Education (optional)                    │
│      ↓                                                      │
│  Step 5: Career Terms (loop)   (uses: Qualification,        │
│      │                          Survival, Advancement)      │
│      ├── 5a: Mishap handling   (uses: Mishap Roll)          │
│      └── 5b: Medical bills                                  │
│      ↓                                                      │
│  Step 6: Aging                 (uses: Aging Roll)           │
│      ↓                                                      │
│  Step 7: Mustering Out         (uses: Benefits Roll)        │
│      ↓                                                      │
│  Step 8: Equipment                                          │
│      ↓                                                      │
│  Step 9: Name Generation                                    │
│      ↓                                                      │
│  Step 10: Final Details                                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 7.2 Step 1: Species Selection

**Tables Used:** `species.json`
**UI:** Species selection dropdown with toggles

**Options:**
| Species | Default | Toggle Required |
|---------|---------|-----------------|
| Terrestrial Human | ✅ | None |
| Low-G Human | ✅ | Rules → Use Low-G Human |

**Output:** Selected species with characteristic roll specifications

**"Random Everything" Toggle:**
- If enabled, randomly select species and proceed through all steps automatically

### 7.3 Step 2: Roll Characteristics

**Tables Used:** `species.json` (characteristic roll specs)
**Mechanism Used:** Characteristic Stat Roll (6.3.1)

**Standard Human:**
- STR: `2d6`
- DEX: `2d6`
- END: `2d6`
- INT: `2d6`
- EDU: `2d6`
- SOC: `2d6`

**Low-G Human:**
- STR: `dis1` (roll 3d6, keep lowest 2)
- DEX: `adv1` (roll 3d6, keep highest 2)
- END: `dis1` (roll 3d6, keep lowest 2)
- INT: `2d6`
- EDU: `2d6`
- SOC: `2d6-1`

**Output:** Six characteristic values (1-15 each)

**UI Display:**
```
┌────────────────────────────────────────────────────────────┐
│ CHARACTERISTICS                                            │
├────────────────────────────────────────────────────────────┤
│ STR: 7 (DM +0)   DEX: 9 (DM +1)   END: 5 (DM -1)          │
│ INT: 8 (DM +0)   EDU: 10 (DM +1)  SOC: 6 (DM +0)          │
└────────────────────────────────────────────────────────────┘
```

### 7.4 Step 3: Homeworld & Background

**Tables Used:** `homeworlds.json`, `backgrounds.json`
**Mechanism Used:** Random selection or user choice

**Process:**
1. Select homeworld type (or random)
2. Homeworld determines available backgrounds
3. Select background (or random from available)
4. Gain background skill (Level 0 or 1)

**Species Restrictions:**
- Low-G Human: Space backgrounds only
- Terrestrial Human: All backgrounds available

**Output:** Homeworld, background, 1 starting skill

### 7.5 Step 4: Pre-Career Education (Optional)

**Tables Used:** `careers.json` (education entries)

**Options:**
- **University** — Requires EDU 8+, grants degree skills
- **Military Academy** — Requires specific characteristics, grants commission
- **Skip** — Proceed directly to careers

**Duration:** 4 years (1 term equivalent, but not a career term)

**Output:** Optional education benefits, age +4 if taken

### 7.6 Step 5: Career Terms (Loop)

**Tables Used:** `careers.json`, `draft.json`, `survival_mishaps.json`
**Mechanisms Used:** Qualification (6.4.2), Survival (6.4.3), Advancement (6.4.7)

**Term Loop:**
```
FOR each term:
  1. Career Selection
     - First term: Attempt qualification
     - Subsequent: Re-enlist or change career

  2. Qualification Roll (if new career)
     - Success: Enter career
     - Failure: Draft or Drifter

  3. Survival Roll
     - Success: Continue term
     - Failure: Mishap (exit loop)

  4. Event Roll (optional)

  5. Commission Roll (if applicable)

  6. Advancement Roll
     - Success: Increase rank, gain skill

  7. Skill Acquisition
     - Minimum 1 skill per term guaranteed

  8. Re-enlistment Decision
     - CE: Roll required
     - Mneme: Automatic if desired

  9. Age +4 years

  10. Check aging (Term 4/5+)
```

**Minimum Skills Rule:** Character always gains at least 1 skill level per term

**Career Change Rules:**
| Ruleset | Rejoining Same Career | New Career |
|---------|----------------------|------------|
| CE RAW | Qualification roll required | Qualification roll |
| Mneme | Automatic (no roll) | Qualification roll |

**Draft (on qualification failure):**
- Roll 1d6 on draft table
- Assigned to drafted career
- No further qualification needed for that career

### 7.7 Step 5a: Mishap Handling

**Tables Used:** `survival_mishaps.json`, `injury.json`
**Mechanism Used:** Mishap Roll (6.4.5)

**Trigger:** Failed survival roll

**Process:**
1. Roll on mishap table (2d6)
2. Apply mishap effects
3. If injury: Roll on injury table
4. Career ends (forced mustering out)

**Output:** Mishap description, any injuries, career ended

### 7.8 Step 5b: Medical Bills

**Tables Used:** `medical_bills.json`

**Trigger:** Injury from mishap

**Process:**
1. Determine injury severity
2. Calculate medical costs based on TL
3. Deduct from available funds (or create debt)

### 7.9 Step 6: Aging

**Tables Used:** `aging.json`, `anagathics.json`
**Mechanisms Used:** Aging Roll (6.7.1 or 6.7.2), Anagathics (6.7.3)

**CE Standard:**
- Starts: Term 4
- Difficulty: Increases with age
- Effects: Physical characteristic reduction

**Mneme Variant:**
- Starts: Term 5
- Formula: 2d6 + END DM vs (terms + 1)
- Anagathics: 100KCr, max (SOC-7) doses, prevents aging

**Process:**
1. Check if aging applies (term threshold)
2. Offer anagathics (if available/affordable)
3. If no anagathics: Roll aging
4. Apply characteristic reductions if failed

**Death from Aging:**
- If any physical characteristic reaches 0: Character dies
- Generation ends, note cause of death

### 7.10 Step 7: Mustering Out

**Tables Used:** `careers.json`, `retirement_pay.json`
**Mechanisms Used:** Benefits Roll (6.5.1), Cash/Material (6.5.2-3), Pension (6.6.2)

**Process:**
1. Calculate total benefit rolls
2. For each roll, choose cash or material (max 3 cash)
3. Apply rank bonus to material rolls
4. Calculate pension (if 5+ terms)

**Output:** Credits, equipment/benefits, annual pension

### 7.11 Step 8: Equipment

**Tables Used:** `equipment.json`

**Process:**
1. Review benefits received (weapons, armor, etc.)
2. Optionally purchase additional equipment with cash
3. Procedurally assign "believable" gear based on career

**Career-Based Suggestions:**
- Marine: Combat armor, rifle, blade
- Scout: Vacc suit, survival kit, sidearm
- Merchant: Communicator, trade goods, personal weapon

### 7.12 Step 9: Name Generation

**Tables Used:** `cultures_names.json`, `name_generation_rules.json`

**Process:**
1. Select culture (or random)
2. Select gender (or random)
3. Generate name from culture's name pool
4. Apply format pattern

**Output:** Full character name

### 7.13 Step 10: Final Details

**Finalization:**
- Confirm name
- Add connections (allies, contacts, enemies from career events)
- Record wounds/injuries
- Calculate final age
- Generate character summary

**Character Complete:**
- Auto-save to library
- Display full character sheet
- Enable export options

---



## APPENDIX: GI7B Wiki Mechanics Reference



=== SOURCE: https://wiki.gi7b.org/index.php?title=Mneme_CE_Character_Creation&action=raw ===

= Mneme CE Character Creation =

Complete character creation system for the Mneme Cepheus Engine tabletop RPG. This index provides navigation to all character creation resources, from core rules to variant combat mechanics.

----

== Core Character Creation Chapters ==

=== [[Mneme CE Chapter 1 Character Creation|Chapter 1: Character Creation]] ===

The foundation of character generation covering the 12-step creation process:

* '''Characteristics (Step 1)''' — Roll 2D6 for Strength, Dexterity, Endurance, Intelligence, Education, and Social Standing
* '''Homeworld & Background Skills (Step 2)''' — Determine homeworld trade codes and gain 3 + EDU modifier skills at Level 0
* '''Career Selection (Step 3)''' — Choose from 24 distinct careers; qualify with variable difficulty rolls
* '''Basic Training (Step 4)''' — Gain service skills at Level 0 for first term; one skill for subsequent careers
* '''Survival Rolls (Step 5)''' — Roll to survive each term; failure means mishaps or death
* '''Commission & Advancement (Steps 6-7)''' — Progress through ranks, gain extra skills and benefits
* '''Aging (Step 8)''' — Physical decline begins at age 34; anagathics can delay aging
* '''Re-enlistment (Step 9)''' — Continue career or muster out; forced re-enlistment on natural 12
* '''Benefits & Mustering Out (Step 10)''' — Cash, weapons, armor, and other career benefits
* '''Equipment Purchase (Step 11)''' — Buy starting gear and possibly a starship
* '''24 Complete Careers''' — Aerospace Forces, Agent, Athlete, Barbarian, Belter, Bureaucrat, Colonist, Diplomat, Drifter, Entertainer, Hunter, Marine, Maritime Forces, Merchant, Mercenary, Navy, Noble, Physician, Pirate, Rogue, Scientist, Scout, Surface Defense, Technician

=== [[Mneme CE Chapter 2 Skills|Chapter 2: Skills]] ===

Comprehensive skill system covering all abilities available to characters:

* '''Task Resolution''' — Core mechanic: 2D6 + Skill + Characteristic DM + Difficulty vs. Target Number
* '''Skill Checks''' — Formal and informal task descriptions, time frames, difficulty modifiers
* '''Skill Tables by Career''' — Personal Development, Service Skills, Specialist Skills, Advanced Education for all 24 careers
* '''Skill Descriptions''' — Full details on all skills: Admin, Advocate, Animals, Athletics, Broker, Carousing, Comms, Computer, Deception, Diplomat, Drive, Engineering, Electronics, Gun Combat, Heavy Weapons, Investigate, Jack of All Trades, Language, Leadership, Life Sciences, Mechanics, Medicine, Melee Combat, Navigation, Persuade, Pilot, Physical Sciences, Recon, Remote Operations, Sensors, Social Sciences, Space Sciences, Stealth, Steward, Streetwise, Survival, Tactics, Trade, Vacc Suit, Zero-G
* '''Skill Cascades & Specialties''' — Breaking down broad skills into specific applications (e.g., Gun Combat into Energy Rifle, Slug Pistol, etc.)
* '''Zero-Level Skills (Skill-0)''' — Basic competency without bonus; untrained attempts suffer -3 DM

=== [[Mneme CE Chapter 3 Psionics|Chapter 3: Psionics]] ===

Optional mental powers and paranormal abilities (requires Referee permission):

* '''Psionic Strength (Psi)''' — Characteristic powering all psionic talents; determined by 2D6 minus terms served
* '''Psionic Training''' — 4-month training period costing Cr100,000; learning talents with Psionic Strength checks
* '''Five Psionic Talents:'''
** '''Awareness''' — Control over own body: Suspended Animation, Enhanced Awareness, Psionic Shield
** '''Clairvoyance''' — Sense distant events: Sense, Clairvoyance, Telempathy, Awareness Sense
** '''Telekinesis''' — Move objects with mind: Telekinesis, Pyrokinesis, Remote Manipulation
** '''Telepathy''' — Mental communication: Read Surface Thoughts, Send Thoughts, Probe, Assault
** '''Teleportation''' — Instant travel: Teleport Self, Teleport Other, Teleport Object
* '''Psionic Combat''' — Mental combat resolution using Psionic Strength
* '''Power Points''' — Psionic Strength decreases with use; recovers 1 point per hour after 3-hour rest

=== [[Mneme CE Chapter 4 Equipment|Chapter 4: Equipment]] ===

Complete equipment catalog organized by technology level:

* '''Technology Levels (TL 0-15)''' — From primitive stone tools to advanced grav vehicles and energy weapons
* '''Armor''' — Ballistic cloth, flak jackets, combat armor, vacc suits, reflective suits, combat environment suits
* '''Weapons'''
** '''Melee:''' Blades, clubs, polearms, natural weapons
** '''Slug Weapons:''' Pistols, rifles, shotguns, machine guns, designators
** '''Energy Weapons:''' Laser pistols/rifles, stunners
** '''Heavy Weapons:''' Rocket launchers, plasma guns, fusion guns
** '''Explosives:''' Grenades, detonators, plastic explosive
* '''Vehicles'''
** '''Ground:''' Wheeled, tracked, walkers
** '''Water:''' Small watercraft, large watercraft, submarines
** '''Air:''' Rotorcraft, fixed-wing, airships
** '''Space:''' Spacecraft, small craft
* '''General Equipment''' — Computers, communicators, sensors, medical supplies, survival gear, tools
* '''Services & Animals''' — Passage costs, animals for riding and labor

----

== Quick Fix Rules Changes ==

=== [[Mneme Career Cards Quick Fix|Character Creation Quick Fix]] ===

Streamlined mechanics that replace standard Cepheus Engine rules with unified task resolution. '''See the detailed [[Mneme Career Cards Quick Fix|Quick Fix page]] for complete rules.'''

'''Summary of Changes:'''

{| class="wikitable" style="width:100%"
! Mechanic !! Change
|-
| '''Task Resolution''' || Variable Difficulty instead of static 8
|-
| '''Advancement''' || Survival Effect 4+ = automatic rank progression (no separate Commission/Advancement rolls)
|-
| '''Re-enlistment''' || Automatic success; no forced re-enlistment on natural 12
|-
| '''Anagathics''' || Spend 100,000Cr per use; skip aging; limit = SOC−7 uses
|-
| '''Aging''' || 2D6 + END DM vs. (Terms + 1) Difficulty (Core Task Resolution)
|-
| '''Drifter Career''' || Auto-qualify; failing Survival = lose job (not ejected)
|-
| '''Benefits''' || Track per career; roll all at mustering out
|-
| '''Draft Options''' || Barbarian, Belter, Colonist, Mercenary, Pirate, Rogue (forced careers, not military conscription)
|-
| '''Retirement''' || Drifter/Belter/Barbarian have no retirement safety net
|-
| '''All Careers Advance''' || Even Athlete, Entertainer, Hunter, Scout now have ranks and advancement
|}

'''Career-Specific Quick Fixes:'''
* Scout: Survival END 6+ (was 7+)
* Hunter: Survival INT 6+ (was STR 8+)
* Noble: Qualification SOC 12+, Survival SOC 6+ (was SOC 4+), SOC reflects rank

'''Complete Quick Fix Rules:''' 
* '''[[Mneme Career Cards Quick Fix|Detailed Quick Fix Reference]]''' — Full breakdown of all rule changes with tables
* '''[file:221015_MNEME_24_CAREER_CARDS.pdf Mneme 24 Career Cards PDF]''' — Printable quick reference cards

----

== Combat Character Options ==

=== Character Creation Options from Mneme Combat ===

Variant rules for characters designed for streamlined combat:

* '''One Roll Per Turn System''' — Single player roll determines both PC success and adversary response
* '''Variable Difficulty Table:'''
** Easy (4), Routine (6), Average (8), Difficult (10), Very Difficult (12), Formidable (14)
* '''Character Points (CP) System''' — Alternative quick generation method:
** 50 CP starting pool for characteristics, skills, equipment
** HP = STR + DEX + END
** Wounded/Seriously Wounded/Critically Wounded/Dying thresholds
** Quick skill assignment: Unskilled (-3), Skill-0 (0 DM), Skill-1 (+1), Skill-2 (+2), Skill-3+ (+3)
* '''Character Templates'''
** Warrior: Combat-focused (STR 9, DEX 7, END 8, HP 24)
** Specialist: Technical operative (STR 7, DEX 9, END 6, HP 22)
** Leader: Higher INT/SOC with Tactics
** Minion: Lower stats for cannon fodder

=== [[Mneme CE Combat Rules/Quick Characters|Chapter 10: Quick Characters]] ===

Complete NPC generation system with:

* '''Character Point allocation''' for rapid stat generation
* '''Equipment budgets by TL''' (100-10,000 Cr ranges)
* '''Sample NPCs''' with full stat blocks (Yeoman, Under-Enforcer)
* '''NPC Stat Block Format''' for quick reference
* '''Initiative calculation''' and combat stats
* '''Encounter framework''' examples

=== [[Mneme CE Space Combat/Chapter 3 Crew Functions|Space Combat: Crew Functions]] ===

Character roles in starship combat:

* '''Pilot''' — Maneuvering, evasion, positioning
* '''Navigator/Astrogator''' — Jump calculations, sensor interpretation
* '''Engineer''' — Power management, damage control
* '''Gunner''' — Weapon targeting, fire control
* '''Commander/Captain''' — Tactics, command decisions, leadership bonuses
* '''Sensor Operator''' — Electronic warfare, detection
* '''Medic''' — Casualty treatment during combat

----

== Getting Started ==

=== For New Players ===

# Begin with '''[[Mneme CE Chapter 1 Character Creation|Chapter 1]]''' for complete 12-step walkthrough
# Review '''Quick Fix Rules''' above for streamlined Mneme variant
# Reference '''[[Mneme CE Chapter 2 Skills|Chapter 2]]''' for skill details and career tables
# Use '''[[Mneme CE Chapter 4 Equipment|Chapter 4]]''' for starting equipment selection

=== For Referees (GMs) ===

# Use '''[[Mneme CE Combat Rules/Quick Characters|Quick Characters]]''' for rapid NPC/adversary generation
# Apply '''Quick Fix Rules''' to simplify standard CE for your group
# Reference '''[[Mneme CE Chapter 3 Psionics|Chapter 3]]''' if allowing psionic characters
# All chapters provide complete player options for campaign planning

----

== Related Resources ==

* '''[[Character Creation]]''' — Comprehensive master index with all chapters, Quick Fixes, and combat rules
* '''[[Mneme Cepheus Engine Rules]]''' — Core rules overview
* '''[[Mneme CE Combat Rules]]''' — Complete streamlined combat system
* '''[[CE Exploration of the World]]''' — Travel, trade, exploration chapters
* '''[[Mneme World Generator]]''' — Create homeworlds for your characters
* '''[[Mneme CE Chapter 8 Ship Design]]''' — Starship construction
* '''[[SOC Scale Economic Implications]]''' — Understanding Social Standing and economics

----

[[Category:Mneme]]
[[Category:Character Creation]]
[[Category:Index]]
[[Category:Rules]]
[[Category:Cepheus Engine]]

=== SOURCE: https://wiki.gi7b.org/index.php?title=Mneme_CE_Chapter_1_Character_Creation&action=raw ===

= CHAPTER 1: CHARACTER CREATION =

''Extracted from Cepheus Engine Core Rules''

----

== Overview ==

Cepheus Engine characters are rarely beginners fresh from the farm. There is no reason not to play a young and inexperienced character if you like, but since a broad range of skills is important to success in the game most players will want their character to be a little more experienced in the world.

All characters begin at the age of majority, typically 18. Having generated characteristic scores and background skills, the character should begin serving terms in his or her chosen career. Each 4-year term spent in a career gives the character more experience in the universe, generally in the form of skills. Generate the results of each term before proceeding to the next. At the end of a period of service, characters roll for benefits gained upon "mustering out" (i.e. leaving the service). They may then begin adventuring.

This chapter provides complete instructions for the generation of twenty-four distinct career paths.

== Character Creation Checklist ==

The character creation process follows these 12 steps:

== Character Creation Process ==

=== Step 1: Characteristics ===

: a) Roll your six characteristics using 2D6, and place them in order on your character sheet.
: b) Determine characteristic modifiers.

=== Step 2: Homeworld (Optional) ===

: a) Determine homeworld.
: b) Gain background skills. Character gains a number of background skills at Level 0 equal to 3 + their Education modifier. The first two have to be taken from your homeworld (based on the world's trade codes or law level); the rest are taken from the education list.

=== Step 3: Career ===

: a) Choose a career. You cannot choose a career you've already left except Drifter.
: b) Roll to qualify for that career, as indicated in the description of the career. If this is not your first career, you suffer a –2 DM for every previous career in which you have served.
: c) If you qualify for this career, go to step 4.
: d) If you do not qualify for that career, you can enter the Drifter career or submit to the draft. You may only enter the draft once.

=== Step 4: Basic Training ===

: For your first term in your first career, you get every skill in the service skills table at level 0.
: For your first term in subsequent careers, you may pick any one skill from the service skills table at level 0.

=== Step 5: Survival ===

: Roll for survival, as indicated in the description of the career.

:: If you succeed, go to step 8.
:: If you did not succeed, you have died. Alternately, events have forced you from this career. Roll on the mishap table and go to step 10 (you do not receive a benefit roll for this term.)

=== Step 6: Commission and Advancement ===

: a) You begin as a Rank 0 character.
: b) If your career offers a Commission check and you are Rank 0, you can choose to roll for Commission. If you are successful, you are now Rank 1 in your chosen career. Choose one of the skills and training tables and roll on it for an extra skill. Take any bonus skills from the ranks table for this career.
: c) If your career offers an Advancement check and you are Rank 1 or higher, you can choose to roll for Advancement. If you are successful, your Rank improves by one in your chosen career. Choose one of the skills and training tables and roll on it for an extra skill. Take any bonus skills from the ranks table for this career. You can roll for Advancement in the same term that you succeed in a Commission roll.

=== Step 7: Skills and Training ===

: a) Choose one of the Skills and Training tables for this career and roll on it. If you gain a characteristic improvement as a result, apply the change to your characteristic score immediately. If you gain a skill as a result and you do not already have levels in that skill, take it at level 1. If you already have the skill, increase your skill by one level.
: b) If your career does not have a Commission or Advancement check, you may roll a second time, choose one of the Skills and Training tables for this career (which may be the same or different from the first table chosen for this term.)

=== Step 8: Aging ===

: a) Increase your age by 4 years.
: b) If your character is 34 or older, roll for aging.

=== Step 9: Re-enlistment ===

: a) Roll for re-enlistment. If you fail, you must leave this career. If you roll a natural 12, you cannot leave this career and must continue for another term, go to step 5.
: b) If you have served a total of seven terms or more in character creation, then you must retire, go to step 10.
: c) If you wish to continue in this career, go to step 5.
: d) If you wish to leave this career, go to step 10.

=== Step 10: Benefits ===

: If you are leaving the career, roll for benefits. A character gets one Benefit Roll for every full term served in that career. You also get extra benefit rolls if you reached a higher rank.

=== Step 11: Next Career ===

: If you're leaving your current career and your total number of terms in character creation is less than seven, you may go to step 3 to choose a new career or to step 12 if you wish to finish your character.

=== Step 12: Buy Starting Equipment ===

: Purchase your starting equipment and, if you can afford it, possibly a starship.

----

== Characteristics ==

Characteristics measure a character's most basic abilities: how strong, dexterous, educated or intelligent he is. Characteristic scores influence almost everything your character does. Stronger characters can lift greater weights, more dexterous characters have better balance, and so forth.

Characters have six abilities: Strength (Str), Dexterity (Dex), Endurance (End), Intelligence (Int), Education (Edu), and Social Standing (Soc). Strength, Dexterity, and Endurance are called physical abilities, whereas Intelligence, Education, and Social Standing are loosely termed mental abilities. Each above-average ability score provides a bonus on certain die rolls; while below average abilities apply a penalty to some die rolls.

=== The Six Characteristics ===

; Strength (Str)
: A character's physical strength, fitness and forcefulness.

; Dexterity (Dex)
: Physical co-ordination and agility, reflexes.

; Endurance (End)
: A character's ability to sustain damage, stamina and determination.

; Intelligence (Int)
: A character's intellect and quickness of mind.

; Education (Edu)
: A measure of a character's learning and experience.

; Social Standing (Soc)
: A character's place in society.

== Social Standing and Noble Titles ==

In a Cepheus Engine universe where characters of sufficiently high Social Standing characteristic scores are considered nobility, specific values of Social Standing are often associated with specific titles of nobility. Unlike traditional feudal systems, noble titles in the Cepheus Engine reflect the massive economic scale of interstellar civilization.

=== Understanding Noble Rank Through Economic Scale ===

The following table shows how noble titles map to the SOC Scale, demonstrating the staggering economic power represented by each rank:

{| class="wikitable"
|-
! Noble Title
! SOC Level
! Annual Resource Flow
! Economic Equivalent
! Context
|-
| Lord / Lady
| SOC 10
| $256,000
| Wealthy professional
| Senior doctor, lawyer, or successful professional
|-
| Knight / Dame
| SOC 11-12
| $512K - $1.02M
| Millionaire income
| '''SOC 12: The "Millionaire" threshold''' - C-Suite executive level
|-
| Baron / Baroness
| SOC 13-18
| $2M - $65.5M
| Multi-millionaire to Billionaire
| '''SOC 18: The "Billionaire" threshold''' - Top 100 richest globally (current day)
|-
| Marquis / Marchioness
| SOC 19-27
| $131M - $33.5B
| Multi-billionaire to Small Nation Budget
| Controls resources equivalent to micro-nations (Tuvalu, Fiji) to mid-size economies (Oman, Uruguay)
|-
| Count / Countess
| SOC 28-34
| $67.1B - $4.29T
| Developed Nation to Economic Juggernaut
| '''Middle titles range''' - Controls resources equivalent to Switzerland (SOC 30), Russia, Saudi Arabia (SOC 31), up to Germany/China level (SOC 34)
|-
| Duke / Duchess
| SOC 35-50
| $8.58T - $282 Quadrillion
| Global Superpower to Interstellar Power
| '''SOC 35: Current USA budget''' - At SOC 50, controls resources of first interstellar expeditionary fleets
|-
| Archduke / Archduchess
| SOC 42-47
| $1.10Q - $35.2 Quadrillion
| Earth Economics Limit to Total System GDP
| Controls quadrillion-level resources - Jovian Heavy Industries, Antimatter monopolies (SOC 44-47)
|-
| Crown Prince / Princess
| SOC 48-55
| $70.4Q - $9.00 Quintillion
| Dyson Swarm to Multi-System Economy
| Stellar-level infrastructure, multi-system banking clans
|-
| Emperor / Empress
| SOC 56-58+
| $18.0Q - $72.0+ Quintillion
| Galactic Scale
| '''SOC 58: $72 Quintillion''' - Controls combined multi-system GDP of both Sol and Alpha Centauri. The absolute limit of human economic power in the early interstellar era.
|}

=== Key Insight: The Scale of Nobility ===

The gap between a '''Knight (SOC 12, $1M)''' and an '''Emperor (SOC 58, $72 Quintillion)''' represents a '''72 quadrillion-fold''' difference in annual resource control. This is not merely social prestige—it's the difference between a successful professional and someone who controls the economic output of multiple star systems.

In the 300-year timeline of the Mneme Cepheus Engine:
* A '''Baron (SOC 18, $65.5M)''' is a billionaire by modern standards
* A '''Duke (SOC 50, $282Q)''' controls resources exceeding all current Earth governments combined
* An '''Emperor (SOC 58+)''' sits at the pinnacle of a multi-stellar civilization

''Note: Actual title values may vary from universe to universe. The female equivalents are provided in parentheses.''

=== Psionic Strength, the Seventh Characteristic ===

Within the Cepheus Engine, characters can sometimes have a seventh characteristic score. When a character learns psionics, they generate a Psionic Strength characteristic (abbreviation Psi), which powers their psionic talents. This characteristic cannot be rolled or bought during character creation without the Referee's permission. For more information on this topic, see [[Mneme CE Chapter 3 Psionics|Chapter 3: Psionics]].

=== Generating Characteristic Scores ===

Generating characteristics scores is fairly straightforward. Roll your six characteristics using 2D6, and record them in the standard order: Strength (Str), Dexterity (Dex), Endurance (End), Intelligence (Int), Education (Edu), and Social Standing (Soc).

; Optional Rule
: With the Referee's approval, roll 2D6 six times, and assign the results to the six different characteristic scores based on a particular character concept. For example, if you picture your character as a highly-educated researcher, then you might assign your highest result to Education, and assign your second highest to Intelligence.

; Characteristic Score Limits
: For player characters, a characteristic score may not typically exceed a maximum of 15, nor may a score drop permanently below 1 except under certain circumstances.

=== Characteristic Modifiers ===

Once you have assigned your characteristic scores, you can determine your characteristic modifiers. These modifiers are applied to any check when you do something related to that characteristic. An ability score modifier is calculated by dividing the ability score by three, dropping all fractions, and then subtracting one, so that the average characteristic score of 7 has a DM+0. Thus, a characteristic value of 2 or less has a modifier of DM-2, characteristic values of 3 to 5 have a modifier of DM-1, and so on. The Characteristic Modifier by Score Range table provides a synopsis of these modifiers, already calculated for you.

=== Table: Characteristic Modifier by Score Range ===

{| class="wikitable"
|-
| Score Range
| PseudoHex
| Characteristic Modifier
|-
| 0 through 2
| 0-2
| -2
|-
| 3 through 5
| 3-5
| -1
|-
| 6 through 8
| 6-8
| +0
|-
| 9 through 11
| 9-B
| +1
|-
| 12 through 14
| C-E
| +2
|-
| 15 through 17
| F-H
| +3
|-
| 18 through 20
| J-L
| +4
|-
| 21 through 23
| M-P
| +5
|-
| 24 through 26
| Q-S
| +6
|-
| 27 through 29
| T-V
| +7
|-
| 30 through 32
| W-Y
| +8
|-
| 33 or higher
| Z
| +9
|}

=== Altering Characteristic Scores ===

Over the course of play, your character's characteristic scores may change for the following reasons:

* Aging can permanently lower physical characteristic scores.
* Physical damage, such as from combat, falling, disease or poison, temporarily lowers physical characteristic scores.
* Mental trauma, such as head injuries and psionic attack, temporarily lowers mental characteristic scores.
* Certain medications, psionic enhancements, and other scenarios can temporarily or permanently enhance specific characteristic scores.

Whenever a characteristic score changes, you will need to determine the new characteristic modifier.

=== On Gender and Race ===

The core Cepheus Engine rules make no distinctions between different members of the same species, regardless of gender or race. In the realm of classic science fiction literature, heroes came in many different flavors and capacities, and were generally unhindered by their gender or the color of their skin.

Alien species may have additional gender choices that can impact a character's characteristic scores and grant specific abilities or traits based on gender selection. For example, if an insectoid species has four genders (queen, soldier, worker and drone), each might grant different characteristic bonuses or penalties that impact character creation. The definition of alien species lies in the realm of the Referee's powers of creativity, as befits the nature of their campaign and universe.

=== On Alien Species and Social Standing ===

Alien species may have different criteria for Social Standing: Caste or Charisma. When dealing with a race that has a different concept of Social Standing, all DMs from Social Standing or its alien equivalent – whether positive or negative – are halved.

=== The Universal Persona Profile (UPP) ===

The Cepheus Engine utilizes a concise format to encapsulate data on an individual character's characteristic scores in a manner that, with a little practice, can be quickly and easily read. The specifics of the Universal Persona Profile can be found below:

: 123456, or 123456-7 for psionic characters

; The Explanation
: The numbers represent the position of a pseudo-hexadecimal notation of an individual's characteristic scores. These scores are, in order:

* Strength (Str)
* Dexterity (Dex)
* Endurance (End)
* Intelligence (Int)
* Education (Edu)
* Social Standing (Soc)
* Psionic Strength (Psi)

For example, if a character has the following characteristic scores:

: Strength 6, Dexterity 8, Endurance 7, Intelligence 11, Education 9, Social Standing 12

Then the character's UPP would be '''687B9C'''. If the character later tested for Psionics, and ended up with a Psionic Strength of 4, the UPP would then become '''687B9C-4'''.

=== Universal Character Format ===

The following format is used to represent a character's basic game statistics in the Cepheus Engine rules.

: [Character Name, with rank and/or noble title, if appropriate][Character UPP]Age [Character Age]
: [Character Careers, with terms listed in parentheses]Cr[Character Funds]
: [Character Skill List, in alphabetical order, with skill levels listed after skill names]
: [Species Traits, if not human; optional]
: [Character Equipment, if available; list only significant property]

Here is an example of a system-wide human celebrity that has been entertaining his holovid fans for almost two decades with his heroic action movies:

: '''Bruce Ayala''' '''786A9A''' Age 38
: Entertainer (5 terms) Cr70,000
: Athletics-1, Admin-1, Advocate-1, Bribery-1, Carousing-3, Computer-2, Gambling-0, Grav Vehicle-0, Liaison-2, Linguistics-0, Streetwise-0
: High passage (x2)

----

== Background Skills ==

Before embarking on your careers, you get a number of background skills equal to 3 + your Education DM (1 to 5, depending on your Education score).

=== Homeworld Skills ===

Growing up on your homeworld gave you skills that depend on the planet's nature. You can select any skill that matches your homeworld's planetary description and trade codes. If you came from a planet already established in the Referee's universe, then consult those sources for the planet's description.

=== Table: Homeworld Skills by Planetary Description ===

{| class="wikitable"
|-
| Descriptor
| Skill
|-
| No Law
| Gun Combat-0
|-
| Low Law
| Gun Combat-0
|-
| Medium Law
| Gun Combat-0
|-
| High Law
| Melee Combat-0
|}

=== Table: Homeworld Skills by Trade Code ===

{| class="wikitable"
|-
| Trade Code
| Skill
|-
| Agricultural
| Animals-0
|-
| Asteroid
| Zero-G-0
|-
| Desert
| Survival-0
|-
| Fluid Oceans
| Watercraft-0
|-
| Garden
| Animals-0
|-
| High Technology
| Computer-0
|-
| High Population
| Streetwise-0
|-
| Ice-Capped
| Zero-G-0
|-
| Industrial
| Broker-0
|-
| Low Technology
| Survival-0
|-
| Poor
| Animals-0
|-
| Rich
| Carousing-0
|-
| Water World
| Watercraft-0
|-
| Vacuum
| Zero-G-0
|}

=== Primary Education Skills ===

A formal education gives you a basic level of competence in various sciences and academic disciplines. Any character may choose from the following list:

: Admin-0, Advocate-0, Animals-0, Carousing-0, Comms-0, Computer-0, Electronics-0, Engineering-0, Life Sciences-0, Linguistics-0, Mechanics-0, Medicine-0, Physical Sciences-0, Social Sciences-0, Space Sciences-0.

----

== Careers ==

Characters in the Cepheus Engine do not start at the age of majority and jump immediately into play with only their background skills. Instead, characters gain experience by pursuing one of twenty-four different careers. The random nature of career paths (also known as prior history or prior careers) leads to characters of all levels of experience, and from all walks of life. A character gains more skills the longer they stay in character creation, but not without risk of aging. Player choices will have great impact on the final disposition of a character.

At many points during a career, a character will have to make a throw of some sort. Most of these throws are characteristic throws – roll 2D6, add the DM from the listed characteristic, and try to get a total higher than the listed value. A throw of Int 8+ means 'roll 2D6, add your Intelligence DM, and you succeed if you roll an 8 or more'. A few throws are skill checks, where you add any levels in that skill and the DM from an appropriate characteristic, if specified. For example, a throw of Gambling 8+ would mean 'roll 2D6, add your Gambling skill and the DM from an appropriate characteristic such as Dexterity, if specified, and get over 8'.

=== Career Descriptions ===

The following twenty-four career paths are detailed at the end of this chapter:

; Aerospace System Defense
: Member of a planetary armed military force operating within a world's atmosphere and close orbit. Also known as the "planetary air force".

; Agent
: Individual that secretly collects and reports information on the activities, movements and plans of a political or corporate enemy or competitor. Also known as a spy or intelligence operative.

; Athlete
: Individual that has achieved celebrity status for their proficiency in sports and other forms of physical exercise.

; Barbarian
: Individual from a primitive world (TL4 or less) capable of surviving on their world without support from a technologically advanced civilization.

; Belter
: Individual that explores asteroid belts in search of mineral deposits and salvageable material for profit.

; Bureaucrat
: Official in a government department, charged with following the details of administrative process.

; Colonist
: Individual that moves to a new world or settles in a new planetary colony.

; Diplomat
: Individual that is appointed by a planetary or interstellar government to conduct official negotiations and maintain political, economic and social relations with another polity or polities.

; Drifter
: Individual that continually moves from place to place, without any fixed home or job.

; Entertainer
: Individual that has achieved celebrity status for their proficiency in publicly entertaining others.

; Hunter
: Individual that kills or traps large game, almost always large terrestrial mammals, for meat, other animal by-products (such as horn or bone), trophy or sport.

; Marine
: Member of an interstellar armed military force trained to serve in a variety of environments, often carried on board starships as an adjunct to an interstellar navy. Also known as the "space marines".

; Maritime System Defense
: Member of a planetary armed military force operating within and on the surface of a world's oceans. Also known as the "planetary wet navy".

; Mercenary
: Professional soldier hired to serve in a foreign military force or perform a specific military action.

; Merchant
: Individual involved in wholesale interstellar trade, particularly between individual worlds or polities.

; Navy
: Member of an interstellar armed military force that conducts military operations in interplanetary or interstellar space. Also known as the "space navy".

; Noble
: Member of an elite upper class, having high social or political status.

; Physician
: Individual that is skilled in the science of medicine and is trained and licensed to treat sick and injured people.

; Pirate
: Individual that attacks and steals from interplanetary and interstellar ships in space.

; Rogue
: Individual that makes their living through illicit means.

; Scientist
: Individual that is engaged in and has expert knowledge of a science, especially a biological or physical science.

; Scout
: Member of an interplanetary exploratory service, surveying unfamiliar territory in space.

; Surface System Defense
: Member of a planetary armed military force operating on the non-hydrographic surface of a world. Also known as the "planetary army".

; Technician
: Individual that is skilled in mechanical or industrial techniques or in a particular technical field.

=== Qualifying and the Draft ===

The Qualification check determines if you can successfully enter into your chosen career. Military careers use Enlistment as the description for this roll instead of qualification. If you fail this check then you cannot enter your chosen career this term. You must either submit to the Draft or take the Drifter career for this term. You suffer a DM–2 to qualification rolls for each previous career you have entered. Once you leave a career you cannot return to it. The Draft and the Drifter career are exceptions to this rule – you can be Drafted into a career you were previously in but got ejected from, and the Drifter career is always open.

=== Table: The Draft ===

{| class="wikitable"
|-
| Roll
| Draft Career
|-
| 1
| Aerospace System Defense (Planetary Air Force)
|-
| 2
| Marine
|-
| 3
| Maritime System Defense (Planetary Navy)
|-
| 4
| Navy
|-
| 5
| Scout
|-
| 6
| Surface System Defense (Planetary Army)
|}

=== Terms of Service ===

Each step through the cycle of resolving your career path, you will go through a term of service that lasts approximately four years long. This adds four years to the character's age. Each time the character reenlists, or enters into a new career, it is for another term, or four additional years of service.

=== Basic Training ===

On the first term of a new career, you gain Basic Training as you learn the basics for your chosen career. For your first career only, you get all the skills listed in the Service Skills table at Level 0 as your basic training. For any subsequent careers, you may pick any one skill listed in the Service Skills table at Level 0 as your basic training.

=== Survival ===

Each career has a survival roll. If you fail this roll, your character is dead, and you must create a new one. A natural 2 is always a failure.

; Optional Rule
: With the Referee's approval, you can keep the character that fails a survival roll and roll on the Survival Mishaps table instead. This mishap is always enough to force you to leave the service after half a term, or two years of service. You lose the benefit roll for the current term only.

=== Table: Survival Mishaps ===

{| class="wikitable"
|-
| 1D6
| Mishap
|-
| 1
| Injured in action. (This is the same as a result of 2 on the Injury table.) Alternatively, roll twice on the Injury table and take the lower result.
|-
| 2
| Honorably discharged from the service.
|-
| 3
| Honorably discharged from the service after a long legal battle. Legal issues create a debt of Cr10,000.
|-
| 4
| Dishonorably discharged from the service. Lose all benefits.
|-
| 5
| Dishonorably discharged from the service after serving an extra 4 years in prison for a crime. Lose all benefits.
|-
| 6
| Medically discharged from the service. Roll on the Injury table.
|}

=== Commission and Advancement ===

Within military careers, a Commission check represents an opportunity to join the ranks of the commissioned officers. In non-military careers, the Commission check represents an opportunity to gain a position within the hierarchy common to your chosen career. Some careers do not have an established hierarchy, as such, and so do not offer Commission checks. A character that succeeds at a Commission roll becomes a Rank 1 officer in that career, and uses the officer Rank table from then on. In addition, you gain an extra roll on any of the Skills and Training Tables for this career. A character may attempt a Commission roll once per term, and trying for commission is optional. A draftee may not attempt a Commission check in the first term of service.

Each career that has a commission check also has an Advancement roll, representing your character's ability to advance with the ranks of your chosen career's hierarchy. If you are Rank 1 or higher, you may attempt an Advancement roll each term. If you are successful, then you move to the next rank and gain an extra roll on any of the Skills and Training Tables for this career. You also get any benefits listed for your new rank. You may only attempt to advance once per term, and you may attempt to advance in the same term in which you are commissioned.

Commissions and advancement are not available in the Athlete, Barbarian, Belter, Drifter, Entertainer, Hunter and Scout careers.

=== Skills and Training ===

Each career has skill tables associated with it – Personal Development, Service Skills, Specialist Skills and Advanced Education. In each term you spend in a career, pick one of these tables and roll 1D6 to see which skill you increase. You may only roll on the Advanced Education table if your character has Education 8+.

Because the Athlete, Barbarian, Belter, Drifter, Entertainer, Hunter and Scout careers do not have commission or advancement checks, characters get to make two rolls for skills instead of one every term.

=== Cascade Skills ===

Some skills are "cascade skills" meaning that they have specializations – specialized forms of that skill. When a cascade skill is selected, the character must immediately decide on a specialization. Each cascade skill will list one or more specializations that may be chosen from. Upon taking a level in a cascade skill specialization, all other specializations of that skill without skill levels are treated as Zero-level skills. A character may have multiple specializations in a skill, such as Natural Weapons-2 and Slashing Weapons-1, under Melee Combat.

----

== Injuries ==

Characters that are wounded in combat or accidents during character creation must roll on the Injury table.

=== Table: Injury Table ===

{| class="wikitable"
|-
| 1D6
| Injury
|-
| 1
| Nearly killed. Reduce one physical characteristic by 1D6, reduce both other physical characteristics by 2 (or one of them by 4).
|-
| 2
| Severely injured. Reduce one physical characteristic by 1D6.
|-
| 3
| Missing eye or limb. Reduce Strength or Dexterity by 2.
|-
| 4
| Scarred. You are scarred and injured. Reduce any one physical characteristic by 2.
|-
| 5
| Injured. Reduce any physical characteristic by 1.
|-
| 6
| Lightly injured. No permanent effect.
|}

=== Injury Crisis ===

If any characteristic is reduced to 0, then the character suffers an injury crisis. The character dies unless he can pay 1D6x10,000 Credits for medical care, which will bring any characteristics back up to 1. The character automatically fails any Qualification checks from now on – he must either continue in the career he is in or become a Drifter if he wishes to take any more terms.

=== Medical Care ===

If your character has been injured, then medical care may be able to undo the effects of damage. The restoration of a lost characteristic costs Cr5,000 per point.

If your character was injured in the service of a patron or organization, then a portion of his medical care may be paid for by that patron. Roll 2D6 on the table below, adding your Rank as a DM. The result is how much of his medical care is paid for by his employer.

=== Table: Medical Bills ===

{| class="wikitable"
|-
| Career
| Roll of 4+
| Roll of 8+
| Roll of 12+
|-
| Aerospace System Defense, Marine, Maritime System Defense, Navy, Scout, Surface System Defense
| 75%
| 100%
| 100%
|-
| Agent, Athlete, Bureaucrat, Diplomat, Entertainer, Hunter, Mercenary, Merchant, Noble, Physician, Pirate, Scientist, Technician
| 50%
| 75%
| 100%
|-
| Barbarian, Belter, Colonist, Drifter, Rogue
| 0%
| 50%
| 75%
|}

=== Medical Debt ===

During finishing touches, you must pay any outstanding costs from medical care or anagathic drugs out of your Benefits before anything else.

----

== Aging ==

The effects of aging begin when a character reaches 34 years of age. At the end of the fourth term, and at the end of every term thereafter, the character must roll 2D6 on the Aging Table. Apply the character's total number of terms as a negative Dice Modifier on this table.

=== Table: Aging Table ===

{| class="wikitable"
|-
| 2D6
| Effects of Aging
|-
| –6
| Reduce three physical characteristics by 2, reduce one mental characteristic by 1
|-
| –5
| Reduce three physical characteristics by 2.
|-
| –4
| Reduce two physical characteristics by 2, reduce one physical characteristic by 1
|-
| –3
| Reduce one physical characteristic by 2, reduce two physical characteristic by 1
|-
| –2
| Reduce three physical characteristics by 1
|-
| –1
| Reduce two physical characteristics by 1
|-
| 0
| Reduce one physical characteristic by 1
|-
| 1+
| No effect
|}

=== Aging Crisis ===

If any characteristic is reduced to 0 by aging, then the character suffers an aging crisis. The character dies unless he can pay 1D6x10,000 Credits for medical care, which will bring any characteristics back up to 1. The character automatically fails any Qualification checks from now on – he must either continue in the career he is in or become a Drifter if he wishes to take any more terms.

=== Anagathics ===

While using anagathic drugs, the character effectively does not age – add the number of terms since the character started taking anagathics as a positive Dice Modifier to rolls on the aging table. If a character stops taking anagathics, then he must roll immediately on the aging table to simulate the shock that comes from his system beginning to age again.

The risk of trying to obtain a reliable supply and the disruption to the character's biochemistry means the character must make a second Survival check if he passes his first Survival check in a term. If either check is failed, the character suffers a mishap and is ejected from the career.

The drugs cost 1D6x2,500 Credits for each term that the character uses the drugs. These costs are paid out of the character's eventual mustering-out cash benefits. If the character cannot pay these bills, he goes into debt.

----

== Reenlistment and Retirement ==

At the end of each term, the character must decide that they wish to continue on their career path or if they wish to muster out. If continuation is desired, the character must make a successful Reenlistment check as listed for their current profession or service. If the character rolls a natural 12, they cannot leave their current career and must continue for another term. If the check is not successful, then they cannot reenlist and the character must leave their current career.

A character that has served 7 or more terms in character creation must retire and cannot undertake any more prior experience, unless they roll a natural 12 during Reenlistment and must serve another term of service.

; Optional Rule
: The Referee may want to change the maximum number of terms spent in character creation from 7 to something else. For example, the Referee may feel that characters built up to a maximum of 3 or even 4 terms are in the prime of their life, but not so experienced that they won't take up adventuring opportunities as they are presented.

; Optional Rule
: In some universes, the Referee may elect to totally remove the maximum number of terms spent in character creation.

A character who has served 5 or more terms in a single service receives a yearly retirement pension, even if he or she later becomes an adventurer.

=== Table: Retirement Pay by Terms Served ===

{| class="wikitable"
|-
| Terms
| Annual Retirement Pay
|-
| 5
| Cr10,000
|-
| 6
| Cr12,000
|-
| 7
| Cr14,000
|-
| 8
| Cr16,000
|-
| 9+
| +Cr2,000 per term beyond 8
|}

----

== Mustering Out Benefits ==

Characters who end their careers receive one benefit per term served in which they did not lose benefits. An additional benefit is gained if the character held rank O4, and two for rank O5. A character with rank O6 gains three extra benefits.

=== Cash Benefits ===

Up to 3 benefit rolls can be taken on the Cash table. All others must be taken in material benefits. Characters with Gambling skill or who have retired gain +1 on Cash Benefit rolls.

=== Material Benefits ===

Material benefits may be characteristics alterations, passages or ship shares. Membership in the Explorers' Society is possible, and subsequent receipts of weapon benefits may be taken as skill levels instead. Note that characters of rank O5 or O6 gain +1 on Material Benefit rolls.

; Courier Vessel
: The character considered to be on detached duty with the scout exploration service, and has been granted the use of a surplus 100-ton TL9 Courier starship on a reserve basis. The scout exploration service also provides free maintenance and fuel at any scout base. All other ship expenses are the responsibility of the character. While the character is at liberty to use the vessel as they see fit, the vessel still belongs to the scout exploration service, and thus cannot be abandoned or sold without consequences. In exchange for the use of the ship, the character and the ship are both considered to be available to return to active duty at a moment's notice, should the scout exploration service have need.

; Explorers' Society
: The character is a member of the prestigious Explorers' Society. The Explorers' Society will provide members with a free high passage ticket every two months, plus access to the Society's information network and Society-run resorts. This benefit can only be received once; any further receipt of this has no additional benefit. After character creation, characters may purchase membership into the Explorers' Society. A successful application for lifetime membership requires a Routine (-2) Admin check modified by the character's Social Standing, and if accepted, a payment of Cr1,000,000. Failure on the application process indicates the character has been black listed. If a character has been black listed, the Explorers' Society will no longer accept membership applications from them. Membership is non-refundable and non-transferrable.

; Passage
: The character has a single ticket of the type named (low, mid, high) for travel on a starship. It is good for one Jump to any destination.

; Research Vessel
: A scientific foundation, an interstellar corporation or some other equally affluent patron has granted the character the use of a 200-ton TL9 Research Vessel. All ship expenses, other than annual maintenance, are the responsibility of the character. This ship still belongs to the patron, and therefore cannot be sold or abandoned without consequences.

; Ship Shares
: Ship shares may be received as benefits. Each ship share is worth approximately Cr2,000,000 toward the purchase of a vessel. A starship can be purchased for one-fifth of its base value with a 40-year loan attached to it. For every one-fifth of its base value that is paid to the bank in either ship shares or cash, the period of the loan is reduced by ten years. Ship shares may not be redeemed for cash.

; Weapon
: The character leaves the service with an appropriate weapon (gun or blade). Once a weapon is taken as a benefit, additional receipts of the weapon may be taken as skill in that weapon instead. An individual is always free to take additional physical examples of the weapons instead of skill levels, if so desired.

----

== Career Tables ==

''Note: Career tables continue in the original document format. Refer to the full chapter for complete career tables including Qualifications, Survival, Commission, Advancement, Re-enlistment, Ranks and Skills, Material Benefits, Cash Benefits, and Skills and Training tables for all 24 careers.''

[[Category:Mneme Cepheus Engine]]
[[Category:Rules]]
[[Category:Chapter 1]]
| 3 | Weapon | Weapon | +1 Int | Weapon | Weapon | +1 Int |
| 4 | High  Passage | Mid  Passage | Mid  Passage | Mid  Passage | Mid  Passage | Mid  Passage |
| 5 | +1 Soc | Weapon | +1 Soc | Explorers' Society | Weapon | Mid  Passage |
| 6 | High Passage | High Passage | High Passage | Courier Vessel | High Passage | High Passage |
| 7 | 1D6  Ship Shares | +1 Soc | Research Vessel | -- | +1 Soc | +1 Soc |
| Cash Benefits |  |  |  |  |  |  |
| 1 | 1000 | 1000 | 1000 | 1000 | 1000 | 1000 |
| 2 | 5000 | 5000 | 5000 | 5000 | 5000 | 5000 |
| 3 | 10000 | 5000 | 10000 | 10000 | 10000 | 10000 |
| 4 | 20000 | 5000 | 10000 | 10000 | 10000 | 10000 |
| 5 | 20000 | 10000 | 20000 | 20000 | 20000 | 20000 |
| 6 | 50000 | 20000 | 50000 | 50000 | 50000 | 50000 |
| 7 | 100000 | 50000 | 50000 | 50000 | 50000 | 50000 |

| Career | Pirate | Rogue | Scientist | Scout | Surface Defense | Technician |
|---|---|---|---|---|---|---|
| Skills and Training | Personal Development | Personal Development | Personal Development | Personal Development | Personal Development | Personal Development |
| 1 | +1 Str | +1 Str | +1 Str | +1 Str | +1 Str | +1 Str |
| 2 | +1 Dex | +1 Dex | +1 Dex | +1 Dex | +1 Dex | +1 Dex |
| 3 | +1 End | +1 End | +1 End | +1 End | +1 End | +1 End |
| 4 | Melee Combat | Melee Combat | +1 Int | Jack o’ Trades | Athletics | +1 Int |
| 5 | Bribery | Bribery | +1 Edu | +1 Edu | Melee Combat | +1 Edu |
| 6 | Gambling | Gambling | Gun Combat | Melee Combat | Vehicle | Gun Combat |
|  | Service Skills | Service Skills | Service Skills | Service Skills | Service Skills | Service Skills |
| 1 | Streetwise | Streetwise | Admin | Comms | Mechanics | Admin |
| 2 | Electronics | Mechanics | Computer | Electronics | Gun Combat | Computer |
| 3 | Gun Combat | Gun Combat | Electronics | Gun Combat | Gunnery | Mechanics |
| 4 | Melee Combat | Melee Combat | Medicine | Gunnery | Melee Combat | Medicine |
| 5 | Recon | Recon | Bribery | Recon | Recon | Electronics |
| 6 | Vehicle | Vehicle | Sciences | Piloting | Battle Dress | Sciences |
|  | Specialist | Specialist | Specialist | Specialist | Specialist | Specialist |
| 1 | Zero-G | Computer | Navigation | Engineering | Comms | Computer |
| 2 | Comms | Electronics | Admin | Gunnery | Demolitions | Electronics |
| 3 | Engineering | Bribery | Sciences | Demolitions | Gun Combat | Gravitics |
| 4 | Gunnery | Broker | Sciences | Navigation | Melee Combat | Linguistics |
| 5 | Navigation | Recon | Animals | Medicine | Survival | Engineering |
| 6 | Piloting | Vehicle | Vehicle | Vehicle | Vehicle | Animals |
|  | Adv Education | Adv Education | Adv Education | Adv Education | Adv Education | Adv Education |
| 1 | Computer | Computer | Advocate | Advocate | Advocate | Advocate |
| 2 | Gravitics | Gravitics | Computer | Computer | Computer | Computer |
| 3 | Jack o’ Trades | Jack o’ Trades | Jack o’ Trades | Linguistics | Jack o’ Trades | Jack o’ Trades |
| 4 | Medicine | Medicine | Linguistics | Medicine | Medicine | Linguistics |
| 5 | Advocate | Advocate | Medicine | Navigation | Leadership | Medicine |
| 6 | Tactics | Tactics | Sciences | Tactics | Tactics | Sciences |

Final Details

It takes more than a set of characteristic scores and skill levels to create a fun character. By adding some final details at the end of character creation, you might find the experience of playing the character far more rewarding.

Name

At the very least, every character needs a name, preferably one that fits the style of your gaming group and the Referee’s universe. Consider choosing a name based on actual “real world” names, on fictional characters or one you’ve simply made up entirely. If you are stuck, try choosing two of your favorite science fiction characters, and taking parts of each of their names to create a unique name for your character.

Gender

In most games, that means choosing either male or female, but some Referees or universes may offer other options. There’s nothing that says you have to play a character of your own gender. Many consider it a roleplaying challenge to try to portray a different gender in a realistic manner.

Appearance

Choosing details such as your character’s height, weight, hair color, wardrobe preferences and so forth make it easier to describe your character, which helps everyone visualize your character in their minds as they play. Distinctive features often give your character a way of standing out.

Personal Goals

Time and experience has shown that characters with personal goals are far more rewarding to play in the long run. A personal goal should be something that takes more than a single adventure to resolve. Good examples might include learning the secrets of ancient civilizations, mastering the psionic arts, or securing political power. Personal goals often provide the Referee with an opportunity to develop story arcs based on that character, because the goals inform the Referee about what the character (and presumably the player) is interested in pursuing. It’s okay if the character’s goals change over time. In fact, that’s a great sign of character growth and development.

On Alien Species

Humans are assumed to be the standard species defined in these rules, and thus have no special abilities or disadvantages to distinguish themselves as a species from the basic rules assumptions for characters.

The definition of alien species lies in the realm of the Referee’s powers of creativity, as befits the nature of their campaign and universe. This System Reference Document offers the following examples of alien species in an effort to demonstrate common archetypes found in many forms of classic science fiction. Some universes only have humans, while others have hundreds of alien species that characters can encounter. Your Referee is the final arbiter on whether these or any other alien species are present in your campaign.

More specific information on the creation of alien species can be found in Flynn's Guide to Alien Creation, a supplement published by Samardan Press.

Avians

Descended from Omnivore/Hunter flyers, Avians are a small winged sentient race capable of flight on smaller worlds. Avians are a homeothermic, bi-gendered species averaging 1.2 meters in height with a wingspan over 2.5 meters long from wingtip to wingtip, and have a typical mass of around 35 kilograms. The natural aptitude of the Avian race toward exceptional spatial awareness, both conceptually and physically, immediately lends itself to Piloting and Navigation.

Game Mechanics

Avians have Weak Strength (1D6), Notable Dexterity (3D6) and Weak Endurance (1D6). Avians also have the Flyer (9m), Low Gravity Adaptation, Natural Pilot, Slow Speed (4.5m) and Small traits. This winged race reaches maturity at 22, starts aging at 46, stands 105+(2D6x2) centimeters tall, and have a mass of 20+(2D6x2) kilograms.

Insectans

Descended from Carnivore/Chaser stock, the Insectans are an insectoid race that is hard for most other races to understand. Averaging 1.8 meters in height, and massing around 90 kilograms, the poikilothermic Insectans are very community-conscious, putting the needs of the “colony” before the needs of the individual. They have a very limited ability of individual identity, and more often consider themselves as an extension of the “queen.” With improved nutrition impacting intelligence, as well as exposure to other cultures, a growing minority of Insectans have begun to establish a stronger sense of a personal Self, but remain heavily influenced by their communal instincts. Insectans often serve the greater whole of interstellar society in service-oriented roles, depending on their particular gender, those being “worker” (sterile female), “soldier” (sterile female), “drone” (fertile male), or “queen” (fertile female). While there is little in the way of gross anatomical differences between the genders, carapace coloration and bearing help non-Insectans distinguish one from another.

Game Mechanics

Insectans have Notable Dexterity (2D6+2). Insectans also have the Armored, Bad First Impression, Caste, Cold-blooded, Fast Speed (9m), Great Leaper and Hive Mentality traits. Insectans reach maturity at 18 and start aging at 34 (much like humans), stand 160+(2D6x5) centimeters tall, and have a mass of 60+(2D6x5) kilograms.

NOTE: Insectans have a different characteristic score called Caste, which replaces Social Standing. Caste is generated in the same manner as Social Standing. All modifications to Social Standing referenced in the character creation process impacts Caste equally.

Reptilians

Bearing a strong saurian appearance, the Reptilians descend from homeothermic carnivorous chaser stock. Their scales tend to be brilliantly patterned, particularly among the males of the species. Standing approximately 1.9 meters tall, with a mass of 85 kilograms, the Reptilians still bear many of the features of their saurian ancestors. Reptilians are driven by a strong sense of territoriality and a primal need to hunt. After discovering Jump Drive, the Reptilians found themselves with entire new worlds to claim.

Game Mechanics

Reptilians have Notable Strength (2D6+1), Notable Dexterity (2d+1) and Weak Endurance (2D6-2). Reptilians also possess the Anti-Psionic, Fast Speed (9m), Heat Endurance, Low-Light Vision, Natural Weapon (teeth) and Low Gravity Adaptation traits. Reptilians reach maturity at 22, start aging at 42, stand 155+(2D6x5) centimeters tall, and have a mass of 50+(2D6x5) kilograms.

Alien Species Trait Descriptions

Many of the races in this section possess unusual racial traits, which are described below.

Amphibious: A member of this species is adapted to life underwater as well as on land. It can breathe underwater, or hold its breath for a long period (Endurancex10 minutes on average). Its Dexterity is halved on land.

Anti-Psionic: Members of this species are innately anti-psionic. The character’s Psionic Strength rating always equals zero, and they cannot be trained in psionics. In addition, the character cannot suffer the mental effects of psionics, including telepathy and psionic assault. A species cannot have this alien trait if they already have the Psionic alien trait.

Aquatic: The alien is adapted to life underwater. It can breathe underwater, or hold its breath for a long period (Endurancex10 minutes on average). If amphibious, its Dexterity is halved on land. If the species is not amphibious, then it cannot operate out of water without mechanical aid or telepresence.

Armored: The alien possess thick fur, scales, a bony exoskeleton or other natural protection that gives it one point of natural armor.

Atmospheric Requirements: The species requires an unusual combination of gasses to breathe, and cannot survive in most atmospheres without artificial aid.

Bad First Impression: Members of this species possess an almost universally unpleasant appearance or physical trait that invokes an instinctive reaction in races other than their own. Most races will automatically have an Unfriendly attitude towards these characters, although this is overcome after an individual has interacted with the character for a few minutes, based on the character’s personality and the circumstances of their interaction.

Caste: Members of this species have a genetic structure for social hierarchy. When dealing with races that use Social Standing or Charisma, all social attribute DMs, whether positive or negative, are halved.

Cold-Blooded: Members of this species are sensitive to cold climates. If exposed to extreme cold without protective equipment, the character suffers a DM–2 to initiative. The character suffers 1D6 damage for every ten minutes of exposure.

Engineered: The species has been altered by some external factor to adapt to changed circumstances or a different environment. Medical treatment of Engineered species by a facility of a lower Technology Level than that at which the species was created receives a negative DM equal to the difference.

Fast Metabolism: Creatures with a fast metabolism require more food than most species, and their life support costs are doubled. In combat, fast-metabolism creatures gain a +2 initiative bonus. Fast-metabolism creatures halve their Endurance for the purposes of determining fatigue.

Feral: Feral species are uncivilised, regardless of their technological knowledge. Feral species roll Education on 1d6 only.

Flyer: This species can fly using wings. Characters of this species gain the Athletics skill at Level 0 and can travel at a speed noted in their description. Flying creatures that are aloft must spend one minor action every round on movement or stall and fall out of the air. Winged flight is tiring and can only be sustained for a number of hours equal to the creature’s Endurance before requiring a like amount of rest.

Great Leaper: Members of this species can jump great distances. As a significant action, a member of this species may make an Athletics skill check. If successful, it jumps four squares, plus a number of squares equal to the Effect of the skill check. In addition, members of this species are treated as having the Athletics skill at level 0.

Heat Endurance: Members of this species do not suffer hourly damage from the effects of hot weather and exposure.

Heavy Gravity Adaptation: Members of this species evolved on a world with a higher gravity and do not have to acclimatize to high-gravity environments.

Hive Mentality: Members of this species are driven by a hive mentality, and often pursue actions that support the greater good of their current identified family group, even at the risk of their own personal safety. Characters must make an Intelligence check to avoid risking their own safety when doing so would help their family group. The difficulty of the Intelligence check varies based on the degree of perceived benefit to the family group (this is usually an Average task (DM+0), although circumstances can arise where the difficulty ranges from Routine (DM+2) to Difficult (DM–2).)

Large: The species is considerably larger than the average for sophonts. Large creatures generally have a Strength and Endurance of 3d6 or even 4d6, and a Dexterity of 1d6. Life support requirements for Large creatures are doubled. Some Large creatures are described as Huge. Attacks against Huge creatures receive a +1 DM to hit.

Low Gravity Adaptation: Members of this species evolved on a world with a lower gravity and do not have to acclimatize to low-gravity environments.

Low-Light Vision: Members of this species can see twice as far as a human in starlight, moonlight, torchlight, and similar conditions of poor illumination. They retain the ability to distinguish color and detail under these conditions.

Natural Pilot: Members of this species have an innate understanding of multi-dimensional space, and so receive a DM+2 to their Piloting and Navigation checks.

Natural Swimmer: Members of this species are natural swimmers and gain a +2 DM on all skill checks related to swimming.

Natural Weapon: The species has a natural weapon, such as claws, a strong bite or a poisonous stinger. Such weapons are usable at Personal range and deal +1 damage. The creature gains Natural Weapons at level 0.

Naturally Curious: Members of this species are driven by a natural sense of curiosity, and are easily dragged into any adventure. They have to check out everything and always want to know what’s behind a potential mystery. Characters must make an Intelligence check to avoid acting on their curious impulses. The difficulty of the Intelligence check varies based on the degree of perceived mystery (this is usually an Average task (DM+0), although circumstances can arise where the difficulty ranges from Routine (DM+2) to Difficult (DM–2).)

No Fine Manipulators: The species has no fingers or other prehensile appendages, preventing them from easily picking things up, pushing small buttons, reaching into tight spaces, and so on.

Notable (Characteristic): Some species are notably dexterous, intelligent, tough or strong. Characters from such races have a positive Dice Modifier when rolling for that characteristic (+2 unless otherwise specified), and their racial maximum for that characteristic is increased by the same amount.

Psionic: All members of the species are Psionic, and may determine their Psionic Strength and talents at the start of character generation.

Small: Small species generally have a Strength and Endurance of only 1D6, and a Dexterity of 3D6. The minimum size for a sophont is about half that of a human.

Slow Metabolism: Creatures with a slow metabolism require less food than most species, and their life support costs are halved. In combat, slow-metabolism creatures suffer a –2 initiative penalty.

Uplifted: This species was originally non-sentient, but has been raised to a higher intelligence by another species. Uplifted races generally become client species of their patron. Two common uplifted animals are apes and dolphins:

Uplifted apes have Notable Strength and Endurance (+2) but all other characteristics are Weak (–2). They have the Uplifted trait.

Uplifted dolphins have Notable Strength (+4) and Notable Endurance (+2) but Weak Intelligence, Education and Social Standing (–2). They have the Uplifted, Aquatic (fully aquatic, air-breathers) and No Fine Manipulators traits.

Water Dependent: Although members of this species are amphibious, they can only survive out of the water for 1 hour per 2 points of Endurance (after that, refer to the drowning rules).

Weak (Characteristic): The opposite of Notable (Characteristic), some species are weaker, less resilient or less well educated than others. Characters from such races have a negative Dice Modifier when rolling for that characteristic (–2 unless otherwise specified), and their racial maximum for that characteristic is decreased by the same amount.

=== SOURCE: https://wiki.gi7b.org/index.php?title=Mneme_CE_Chapter_2_Skills&action=raw ===

= CHAPTER 2: SKILLS =

''Extracted from Cepheus Engine Core Rules''

----

== Overview ==

Characters in Cepheus Engine games engage in a variety of activities, using their various skills to accomplish the challenges that confront them. Skills and their usage are described in this chapter.

== Skill Checks ==

Skill checks use the core task resolution system for the Cepheus Engine to resolve actions. Whenever your character attempts any action with a chance of failure, roll 2D6, add any skill levels, the appropriate characteristic score modifier, and your difficulty DM. If the result equals or exceeds 8, the action succeeds. If the result is lower than 8, the action fails. The basics of the task resolution system can be found in the Introduction chapter, under Die Rolls.

== Task Description Format ==

Task descriptions can be formally written in a specific format, as follows.

; Task Format
: '''Task Description:''' Required Skill, Characteristic, Time Increment, Difficulty.

; Task Description
: Describes the action of the task itself. In print, this is often italicized to help it stand out.

; Required Skill
: The skill required for the task. Skill levels are added as a positive DM to the check. Unskilled characters suffer a -3 DM if they do not have this skill.

; Characteristic
: The characteristic modifier that is added to the check.

; Time Increment
: The time range required to perform the task.

== Informal Skill Check Descriptions ==

Skill checks are also informally written by Difficulty followed by Required Skill throughout this System Reference Document. For example, repairing damage on a starship in mid-combat might be a Very Difficult (–4) Engineering task. When listed in this manner, the Referee gets to choose an appropriate Characteristic to modify the skill check, as well as the time increment involved, if it is not already obvious from context.

== Untrained and Zero-Level Skills ==

Characters can perform some tasks without any training in a skill, using only raw talent (defined by their characteristic scores), but skilled characters tend to be better at such things. Unless the Referee says you cannot, you can always attempt tasks involving that skill even if you have no training in it.

If a character has no level in a skill, then he is untrained and will suffer a –3 Dice Modifier when trying to use that skill.

If a character has zero level in a skill (Skill 0), then he is competent in using that skill, but has little experience. He does not get any bonus from his skill ranks when using that skill but at least he avoids the penalty for being untrained.

== Going Faster or Slower ==

You can choose, before you roll, to move up or down one or two rows on the Time Frames table. Moving up (reducing the time increment) gives you a –1 DM for every row you move; moving down and increasing the time taken gives you a +1 DM for every row you move. Your Referee will help adjudicate any issues that might arise from a change in the time frame.

=== Table: Time Frames ===

{| class="wikitable"
|-
| Time Frame
| Base Increment
|-
| 1D6 seconds
| One second
|-
| 1D6 rounds
| One personal combat round (6 seconds)
|-
| 1D6 minutes
| One minute (60 seconds, or 10 personal combat rounds)
|-
| 1D6 kiloseconds
| One kilosecond (~16.67 minutes, or one space combat turn)
|-
| 1D6 hours
| One hour (60 minutes)
|-
| 1D6 days
| One day (24 hours)
|-
| 1D6 weeks
| One week (7 days)
|-
| 1D6 months
| One common month (30-31 days)
|-
| 1D6 quarter
| One quarter (3 common months)
|}

== Multiple Actions ==

A character can try to do two or more things at once, like firing a spacecraft's weapons while also flying, or disarming a bomb while hiding from guards. For every extra thing that the character is doing, he suffers a –2 DM to all skill checks.

== Local Law Level ==

Some tasks are impacted by a world's local Law Level, as presented in the Universal World Profile. For tasks that are impacted by the local laws, rules and regulations, the usual difficulty for tasks can be found in the Base Difficulty by Law Level table.

=== Table: Base Difficulty by Law Level ===

{| class="wikitable"
|-
| Law Level
| Difficulty
|-
| 0
| Routine (DM+2)
|-
| 1-3
| Average (DM+0)
|-
| 4-6
| Difficult (DM-2)
|-
| 7-9
| Very Difficult (DM-4)
|-
| 10+
| Formidable (DM-6)
|}

== Available Skills List ==

The following is a list of the available skills used in the core Cepheus Engine rules. Referees may add other skills as needed to better fit the universe they have created.

=== Table: Available Skills ===

{| class="wikitable"
|-
| Basic Skills
| Weapon Skills
| Transport Skills
|-
| Admin
| Gun Combat (Cascade Skill)
| Vehicle (Cascade Skill)
|-
| Advocate
| Archery
| Aircraft (Cascade Skill)
|-
| Animals (Cascade Skill)
| Energy Pistol
| Grav Vehicle
|-
| Farming
| Energy Rifle
| Rotor Aircraft
|-
| Riding
| Shotgun
| Winged Aircraft
|-
| Survival
| Slug Pistol
| Mole
|-
| Veterinary Medicine
| Slug Rifle
| Tracked Vehicle
|-
| Athletics
| Gunnery (Cascade Skill)
| Watercraft (Cascade Skill)
|-
| Battle Dress
| Bay Weapons
| Motorboats
|-
| Bribery
| Heavy Weapons
| Ocean Ships
|-
| Broker
| Screens
| Sailing Ships
|-
| Carousing
| Spinal Mounts
| Submarine
|-
| Comms
| Turret Weapons
| Wheeled Vehicle
|-
| Computer
| Melee Combat (Cascade Skill)
| 
|-
| Demolitions
| Bludgeoning Weapons
| 
|-
| Electronics
| Natural Weapons
| 
|-
| Engineering
| Piercing Weapons
| 
|-
| Gambling
| Slashing Weapons
| 
|-
| Gravitics
| 
| 
|-
| Jack-of-All-Trades (Jack o' Trades)
| 
| 
|-
| Leadership
| 
| 
|-
| Linguistics
| 
| 
|-
| Liaison
| 
| 
|-
| Mechanics
| 
| 
|-
| Medicine
| 
| 
|-
| Navigation
| 
| 
|-
| Piloting
| 
| 
|-
| Recon
| 
| 
|-
| Sciences (Cascade Skill)
| 
| 
|-
| Life Sciences
| 
| 
|-
| Physical Sciences
| 
| 
|-
| Social Sciences
| 
| 
|-
| Space Sciences
| 
| 
|-
| Steward
| 
| 
|-
| Streetwise
| 
| 
|-
| Tactics
| 
| 
|-
| Zero-G
| 
| 
|}

----

== Skill Descriptions ==

This section describes each skill found in the Cepheus Engine, including its common uses. You may be able to use skills for tasks other than those given here. The Referee sets the Difficulty and decides the results in all cases.

=== Admin ===

The character has experience with bureaucratic agencies, and understands the requirements of dealing with and managing them. When attempting tasks like avoiding police harassment, ensuring the prompt issuance of licenses, approval of applications, avoidance of close inspection of papers, etc., a successful Admin skill check (with a Difficulty based on Base Difficulty by Law Level table), will provide a positive outcome to the situation.

; Bureaucrats and Administrators
: Dealing with administrators and bureaucrats is always a time consuming and tedious chore, which somehow seems to play a common part in Cepheus Engine adventures. No special skills are needed to deal with bureaucrats, but characters with the Admin (or Advocate) skill will be familiar with their ways and find the task much smoother and easier.

: The offer of a bribe and a Bribery skill check may also be attempted in place of an ability or Admin or Advocate skill check. See the Bribery skill description for more information.

=== Advocate ===

The character is familiar with the general laws and regulations that govern interstellar travel, commerce and relations. This skill does not impart knowledge of the myriad of laws on each individual world, nor does it allow the person to act as an attorney.

; Ship Inspections
: Typically, when a ship arrives at a new world, it will be inspected by the port authorities to check for compliance with all applicable laws and regulations. It is also not uncommon for patrol ships to stop and board merchant and other ships while in deep space. When such an inspection does occur, the character may make an Advocate check (with a Difficulty based on Base Difficulty by Law Level table) to be found in compliance and pass inspection. If there is anything illegal on board, the character suffers a -2 DM to the check.

=== Aircraft (Cascade Skill) ===

The various specialties of this skill cover different types of flying vehicles. When this skill is received, the character must immediately select one of the following: Grav Vehicle, Rotor Aircraft or Winged Aircraft.

=== Animals (Cascade Skill) ===

The various specialties of this skill cover different aspects of animal handling. When this skill is received, the character must immediately select one of the following: Farming, Riding, Survival, or Veterinary Medicine.

=== Archery ===

The character is skilled at using bows and crossbows for hunting or in combat.

=== Athletics ===

This skill covers physical fitness and training, similar to that of a trained athlete. This includes acts requiring physical coordination, such as climbing, juggling or throwing; acts of endurance, such as long-distance running or hiking; and acts of strength, such as weight-lifting or bodybuilding.

; Aliens with Wings
: For alien species with wings, this skill is also used to reflect their ability to fly.

=== Battle Dress ===

This skill permits the character to operate advanced battle armor, a powered form of combat armor that enhances the wearer's capabilities in various ways. Ground-based military forces, and numerous mercenaries, are often trained in the basics of battle dress operation. This skill also covers the ability to operate vehicles designed as mechanical exoskeletons.

=== Bay Weapons ===

The character is skilled at operating bay weapons on board a ship.

=== Bludgeoning Weapons ===

The character is skilled at using bludgeoning weapons, such as clubs, staffs and really big wrenches, in personal combat.

=== Bribery ===

The character has experience in bribing petty and not-so petty officials in order to circumvent regulations or ignore cumbersome laws. The amount of a bribe is often based on the level of offense, as outlined in the Bribery Checks By Offense table.

=== Table: Bribery Checks By Offense ===

{| class="wikitable"
|-
| Offense
| DM
| Minimum Bribe
|-
| Petty Crime or Infraction
| +2
| 1D6xCr10
|-
| Misdemeanor, Minor Infraction
| +0
| 1D6xCr50
|-
| Serious Crime or Infraction
| -2
| 1D6xCr100
|-
| Capital Crime or Infraction
| -4
| 1D6xCr500
|}

If the bribe is less than the minimum bribe required, the attempt will automatically fail. Characters may offer more than the minimum bribe required and receive a +1 DM for each multiple of the bribe offered. If the first offer is refused, a character may make a second attempt at twice the previous value of the bribe. If both attempts are refused (failed), the Referee should have the character make a Social Standing check, with a Difficulty based on Base Difficulty by Law Level table. If this also fails, the character will be brought up on charges of attempted bribery.

For example, a character trying to bribe an official to ignore a minor smuggling infraction would have to offer a minimum bribe of Cr200. If the character offered Cr400 instead the character could gain a +1 DM on the check. If Cr600 were offered, the character could gain a +2 DM, etc.

=== Broker ===

A broker is skilled in locating suppliers and buyers, and facilitating the purchase and resale of commercial goods, as per the Trade and Commerce rules.

=== Carousing ===

This skill reflects the interpersonal art of interacting and socializing with others. The character is skilled in the art of small talk and making others feel at ease in their presence in almost any social situation, such as a party, ball, inauguration, bar hopping, etc.

=== Comms ===

The character is trained in the use, repair, and maintenance of communications and sensor devices. While anyone can press the button and make a communicator function, this skill is necessary to understand why the device does not work, or how to use the device for purposes other than open transmission. When using sensors, this skill allows the character to interpret the long-range data of a ship's sensors and scanners. Skilled characters can boost an incoming or outgoing signal, create or break a secure channel, detect signals and anomalies, hide or piggyback on another signal, jam local communications, locate and assess potential threats, and analyze complex sensor data.

=== Computer ===

The character is skilled in the programming and operation of electronic and fiber optic computers, both ground and shipboard models. Computers can be found on any world with a TL of 8 or higher, becoming exponentially more common at higher technology levels.

A character without at least some computer training might find himself at disadvantage in the highly technical universe of science fiction. Anyone with Computer-0 or better can perform the following without a skill check: Log on to a Datanet, send and receive messages, search for non-classified information, and retrieve data and files. More skilled users can create or break data encryption; mine data effectively; create or break data and network security protocols; and perform other general programming tasks.

=== Demolitions ===

This skill covers the use of demolition charges and other explosive devices, including assembling or disarming bombs.

=== Electronics ===

The character is practiced in installing, using, maintaining, repairing and/or creating electronic devices and equipment. The character can practice a trade and make a decent living, earning a paycheck for every week of dedicated work. The character knows how to use the tools of the trade, how to perform routine tasks, how to supervise untrained helpers, and how to handle common problems.

; Disabling Devices
: The character is skilled at disarming alarm systems, picking electronic locks, disabling a malfunctioning robot, or similar tasks involving electronic devices.

=== Energy Pistol ===

The character is skilled at using advanced pistol-style energy weapons like laser pistols and stunners.

=== Energy Rifle ===

The character is skilled at using advanced energy weapons like laser rifles or plasma rifles.

=== Engineering ===

The character is skilled in the operation and maintenance of starship maneuver drives, Jump drives, and power plants. The character can practice a trade and make a decent living, earning a paycheck for every week of dedicated work. The character knows how to use the tools of the trade, how to perform routine tasks, how to supervise untrained helpers, and how to handle common problems. Engineering is particularly important in diverting power to the Jump Drives for a successful transition into Jump space.

=== Farming ===

The character can grow and harvest crops and raise animals. This also covers hydroponic farming and clone harvesting for food production, at sufficiently high tech levels.

=== Gambling ===

The individual is well informed on games of chance, and wise in their play. He or she has an advantage over non-experts, and is generally capable of winning when engaged in such games. Gambling, however, should not be confused with general risk-taking.

; Non-Competitive Games
: These are games such as Slots, Roulette, Blackjack, Keno, etc. These games are played strictly against the house and the odds are pretty much constant, as are the payoff values. The character chooses a game by its odds of winning (high, average, low, small or remote) and places a bet. The Referee determines if the game is rigged. The character then rolls their Gambling score. On a success, the character receives the payoff amount based on the amount of their initial bet. House always wins on a natural 2.

=== Table: Gambling by Odds of Winning ===

{| class="wikitable"
|-
| Odds of Winning
| DM
| Payoff
| Maximum Bet
|-
| Rigged
| -8
| Varies
| Varies
|-
| Remote
| -6
| 1:10
| Cr5,000
|-
| Small
| -4
| 1:8
| Cr1,000
|-
| Low
| -2
| 1:4
| Cr500
|-
| Average
| +0
| 1:2
| Cr100
|-
| High
| +2
| 2:3
| Cr50
|}

; Competitive Games
: If playing against a group of other players, each member of the game will make their Gambling skill check with the highest roll taking the pot. A character may attempt to cheat during a game at any time by stating his or her intent to cheat and making an extra Gambling check. If any other player in the game makes a successful opposing Gambling check against the character's attempt at cheating they are caught red-handed. Otherwise the player has successfully cheated and takes the pot. If more than one person attempts to cheat during the same round of play, the person with the highest roll wins the pot.

=== Grav Vehicle ===

This skill grants the ability to properly maneuver and perform basic, routine maintenance on air/rafts and other vehicles that use gravitic technology. Grav vehicles have theoretically perfect maneuverability and can hover, but skill checks may be necessary when performing high-speed aerobatics.

=== Gravitics ===

The character is practiced in installing, maintaining, repairing and/or creating gravitic devices and equipment. Such items include air/raft lift modules, grav belts, grav sleds, grav tanks, etc. Gravitics skill deals with the technical details of such vehicles; Grav Vehicle skill is required to actually pilot or drive them. The character can practice a trade and make a decent living, earning a paycheck for every week of dedicated work. The character knows how to use the tools of the trade, how to perform routine tasks, how to supervise untrained helpers, and how to handle common problems.

=== Gun Combat (Cascade Skill) ===

The various specialties of this skill cover different types of ranged personal weapons. When this skill is received, the character must immediately select one of the following: Archery, Energy Pistol, Energy Rifle, Shotgun, Slug Pistol, or Slug Rifle.

=== Gunnery (Cascade Skill) ===

The various specialties of this skill cover different types of devastating weapons commonly used against vehicles, spaceships and ground installations. When this skill is received, the character must immediately select one of the following: Bay Weapons, Heavy Weapons, Screens, Spinal Mounts, or Turret Weapons.

=== Heavy Weapons ===

The Heavy Weapons skill covers man-portable and larger weapons that cause extreme property damage, such as rocket launchers, artillery and plasma weapons.

=== Jack-of-All-Trades (Jack o' Trades or JoT) ===

The Jack of All Trades skill works differently to other skills. It reduces the unskilled penalty a character receives for not having the appropriate skill by one for every level of Jack of All Trades. Jack of All Trades cannot grant a skill bonus at higher levels.

=== Leadership ===

The character possesses the ability to rally, inspire, organize and direct team efforts to ensure the best cooperation and productivity possible.

; Coordinating Effort
: Whenever a task requires one or more characters to combine their efforts (i.e. Teamwork; each makes a skill or ability check towards a common goal), the character gains a pool of points equal to the Effect of the skill check (minimum of 1), which can be distributed by the leader to individual team members as DMs (grant a +1 DM per point) on skill or ability checks made toward the common goal.

; Improving Initiative
: The Leadership skill can be used to increase another character's Initiative. The character with Leadership makes a Leadership check, and the target character's Initiative is increased by the Effect of the check. Making a Leadership skill check is a significant action.

=== Linguistics ===

The character can read and write a different language for every level of Linguistics they possess. All characters can speak and read their native language without needing the Linguistics skill, and automated computer translator programs mean that the Linguistics skill are not always needed on other worlds. Having Linguistics-0 implies that the character has a smattering of simple phrases in many languages. In addition, Linguistics can be used to attempt to decipher the general meaning of a preserved specimen of language, such as an inscription or a recorded message.

=== Liaison ===

The character is trained in the art of dealing with others, including knowledge of proper protocols, manners of address, codes of conduct and other information needed when dealing with a wide range of societal types. Such a character is quite useful when attempting to negotiate a particularly edgy deal, to convince the Duke's secretary to admit the party into the Duke's presence, help settle a dispute between two opposing groups, or other acts of negotiation and diplomacy.

; Influencing Others
: The character can change others' attitudes with a successful check. In negotiations, participants roll opposed Liaison checks to see who gains the advantage. Opposed checks also resolve cases when two diplomats are engaged in negotiations.

=== Life Sciences ===

This skill represents theoretical and practical knowledge derived from the scientific study of living organisms. This covers a wide range of related fields, such as biochemistry, biology, botany, cybernetics, genetics, physiology and psionocology.

=== Mechanics ===

The character is practiced in installing, using, maintaining, repairing and/or creating mechanical devices and equipment. The character can practice a trade and make a decent living, earning a paycheck for every week of dedicated work. The character knows how to use the tools of the trade, how to perform routine tasks, how to supervise untrained helpers, and how to handle common problems.

; Disabling Devices
: The character is skilled at disabling mechanical alarm systems, picking mechanical locks, or similar tasks involving mechanical devices.

=== Medicine ===

The individual has training and skill in the medical arts and sciences, from diagnosis and triage to surgery and other corrective treatments. This skill represents a character's ability to provide emergency care, short term care, long-term care, and specialized treatment for diseases, poisons and debilitating injuries. When treating a patient of a race other than their own, the character suffers a -2 DM.

=== Melee Combat (Cascade Skill) ===

The various specialties of this skill cover different types of personal melee combat weapons. When this skill is received, the character must immediately select one of the following: Natural Weapons, Bludgeoning Weapons, Piercing Weapons or Slashing Weapons.

=== Mole ===

This skill grants the ability to properly maneuver and perform basic, routine maintenance on vehicles that move through solid matter using drills or other earth-moving technologies, like plasma torches or cavitation.

=== Motorboats ===

This skill grants the ability to properly maneuver and perform basic, routine maintenance on small motorized watercraft.

=== Natural Weapons ===

The character is skilled at using their natural weapons in personal combat. Among humans, this includes brawling, martial arts and wrestling.

=== Navigation ===

The character is trained in the science of normal and Jump space navigation. The Navigator on a starship plots the course and ensures that the astrogational information required by the pilot and other crewmembers is available when it is needed. This skill includes the ability to determine a ship's new location after a Jump ends, plotting a standard course through normal space, and plotting a Jump route through Jump space. A starship cannot make a Jump safely without a Jump route.

=== Ocean Ships ===

This skill grants the ability to properly maneuver and perform basic, routine maintenance on large motorized sea-going ships.

=== Physical Sciences ===

This skill represents theoretical and practical knowledge derived from the scientific study of the nature and properties of energy and non-living matter. This covers a wide range of related fields, such as chemistry, electronics, geology and physics.

=== Piercing Weapons ===

The character is skilled at using piercing and thrusting weapons, such as spears and polearms, in personal combat.

=== Piloting ===

The individual has training and experience in the operation of interplanetary and interstellar spacecraft. Piloting expertise is necessary to handle such craft, though a check is usually only made when circumstances become challenging, such as due to rough atmospheric conditions or hostile action.

=== Recon ===

This skill represents the ability to scout out dangers and spot threats, unusual objects or out of place people. Characters skilled in Recon are adept at staying unseen and unheard.

=== Riding ===

This skill grants the ability to properly maneuver and provide basic, routine care for horses and other living creatures that are trained to bear a rider.

=== Rotor Aircraft ===

This skill grants the ability to properly maneuver and perform basic, routine maintenance on helicopters, hovercraft and other similar craft. Rotor aircraft can hover but may require skill checks to keep steady in the face of adverse environmental conditions.

=== Sciences (Cascade Skill) ===

The various specialties of this skill cover different types of scientific disciplines. When this skill is received, the character must immediately select one of the following: Life Sciences, Physical Sciences, Social Sciences, or Space Sciences.

=== Sailing Ships ===

This skill grants the ability to properly maneuver and perform basic, routine maintenance on wind-driven watercraft.

=== Screens ===

The character is skilled at activating and using a ship's energy screens like nuclear dampers or meson screens.

=== Shotgun ===

The character is skilled at using shotguns.

=== Slashing Weapons ===

The character is skilled at using cutting and slashing weapons, such as swords and axes, in personal combat.

=== Slug Pistol ===

The character is skilled at using projectile-based pistols like the body pistol or snub pistol.

=== Slug Rifle ===

The character is skilled at using projectile-based rifle weapons such as the autorifle or gauss rifle.

=== Social Sciences ===

This skill represents theoretical and practical knowledge derived from the scientific study of sophont society and social relationships. This covers a wide range of related fields, such as archeology, economics, history, philosophy, psychology and sophontology.

=== Space Sciences ===

This skill represents theoretical and practical knowledge derived from several scientific disciplines that study phenomena occurring in interplanetary and interstellar space, and the celestial bodies that exist within that space. This covers a wide range of related fields, such as astronomy, cosmology, planetology and xenology.

=== Spinal Mounts ===

The character is skilled at operating bay or spinal mount weapons on board a ship. These weapons can be used against other ships or for planetary bombardment or attacks on stationary targets.

=== Steward ===

The Steward skill allows the character to serve and care for nobles and high-class passengers. This includes knowledge of concierge duties, housekeeping services, meal preparation and presentation, personal grooming assistance and valet service, and proper social etiquette.

=== Streetwise ===

A character with the Streetwise skill understands the urban environment and the power structures in society. A skilled character knows where to go for information, how to handle strangers without offending them, and who can handle activities bordering on the fringe of legality.

=== Submarine ===

This skill grants the ability to properly maneuver and perform basic, routine maintenance on vehicles that travel underwater.

=== Survival ===

The character is skilled in the art of survival in the wild, including hunting or trapping animals, avoiding exposure, locating sources of food and fresh water (if available), producing fires (where possible), finding shelter, avoiding dangerous flora and fauna, avoiding getting lost, and dealing with the dangers of hazardous climates (arctic, desert, etc.).

=== Tactics ===

This skill covers tactical planning and decision making, from board games to squad level combat to fleet engagements.

=== Tracked Vehicle ===

This skill grants the ability to properly maneuver and perform basic, routine maintenance on tanks and other vehicles that move on tracks.

=== Turret Weapons ===

The character is skilled at operating turret-mounted weapons on board a ship.

=== Vehicle (Cascade Skill) ===

The various specialties of this skill cover different types of planetary transportation. When this skill is received, the character must immediately select one of the following: Aircraft, Mole, Tracked Vehicle, Watercraft, or Wheeled Vehicle.

=== Veterinary Medicine ===

The individual has training and skill in the medical care and treatment of animals. This skill represents the character's ability to provide animals with emergency care, short term care, long-term care, and specialized treatment for diseases, poisons and debilitating injuries.

=== Watercraft (Cascade Skill) ===

The various specialties of this skill cover different types of watercraft and ocean travel. When this skill is received, the character must immediately select one of the following: Motorboats, Ocean Ships, Sailing Ships or Submarine.

=== Wheeled Vehicle ===

This skill grants the ability to properly maneuver and perform basic, routine maintenance on automobiles and similar wheeled vehicles.

=== Winged Aircraft ===

This skill grants the ability to properly maneuver and perform basic, routine maintenance on jets and other airplanes using a lifting body. Winged aircraft must keep moving forwards or they will stall and fall out of the sky.

=== Zero-G ===

The character is acclimated to working and living in micro-gravity environments and freefall. The character is trained and familiar with the use of weapons and combat in such environments. In addition, the individual has been trained in the wearing, care, and maintenance of all types of Vacuum Suits and Combat Armor commonly used in these conditions.

----

== Space Combat Skills ==

The Mneme Space Combat system uses standard Cepheus Engine skills for shipboard crew positions. The following clarifications explain how standard skills apply to Space Combat crew functions:

=== Crew Functions and Required Skills ===

{| class="wikitable"
! Crew Function
! Primary Skill
! Description
|-
| Captain
| Leadership
| Manages the crew, provides tactical direction, and coordinates ship operations
|-
| NavComm
| Comms
| Operates sensors, handles electronic transmissions, jamming, and sensor locks
|-
| Engineer
| Engineering
| Maintains ship systems, performs repairs, optimizes performance
|-
| Pilot
| Piloting
| Flies the ship, performs evasive maneuvers, manages thrust
|-
| Gunner
| Gunnery (Cascade)
| Operates ship weapons, controls missiles and drones
|}

=== Captain (Leadership Skill) ===

The Captain uses the '''Leadership''' skill to manage the crew and coordinate ship operations.

; Command : Outline immediate plans for the crew. Success grants DM+1 to crew actions following the plan.

; Coordinate : Distribute leadership Effect as DM bonuses to crew members.

; Inspire : Restore crew morale after failed morale checks.

; Rush : Use Tactics skill to increase ship initiative.

; Crew Management : Can effectively manage up to 5 crew without penalty. For every additional 5 crew, -1 penalty to management rolls. Captain's Assistants can mitigate this penalty.

=== NavComm (Comms Skill) ===

The NavComm uses the '''Comms''' skill for sensors and electronic transmissions.

; Sensor Operations : Make Comms rolls for sensor scans, target locks, and detecting hidden ships.

; Jamming : Jam enemy communications and sensors. Opposed Comms roll against target's computer rating.

; Break Target Lock : Opposed roll to remove enemy sensor locks.

; Disable Missile/Drone : Jamming action to disable smart missiles or drones.

; Plot Jump Point : Calculate jump coordinates for FTL travel.

; Directed Scan : Detailed sensor analysis of targets.

; Hack System : Use Intrusion Software to compromise enemy systems (requires Electronics or Computer skill check with DM-4 for rushed analysis).

; Communicate : Transmit data and sensor locks to allies.

; Comms Black-out : Shut down electronics to hide from sensors.

=== Engineer (Engineering Skill) ===

The Engineer uses the '''Engineering''' skill to maintain and repair ship systems.

; Activate Jump : Engage FTL jump drives (with penalty if jump point not plotted).

; Jury Rig : Make damaged systems temporarily functional until end of next turn.

; Go Dark : Eject fuel and shut down power to hide from sensors (requires coordination with NavComm).

; Start Up : Restart powered-down systems.

; Optimize : Grant DM+1 to NavComm, Pilot, or Gunner through successful Engineering roll.

; Red Line : Use spare parts to boost system performance by up to 100%.

; Repair : Standard Engineering roll to fix damaged systems.

=== Pilot (Piloting Skill) ===

The Pilot uses the '''Piloting''' skill to control the ship's movement.

; Evade : Make Pilot roll to increase Target Number (TN) to hit the ship, or bonus to Dodge.

; Attack : Ramming maneuvers (opposed Pilot roll with DM-2 per Thrust Point spent beyond base).

; Dock/Land : Maneuver to dock with stations or land on planets.

; Full Burn : Use compressed fuel for maneuvering when drives are disabled.

; Maneuver : Move ship spaces equal to Thrust rating.

; Ballistic Trajectory : When without power, ship continues on last heading at 1 space per turn.

=== Gunner (Gunnery Skill) ===

The Gunner uses the '''Gunnery''' cascade skill to operate ship weapons.

; Direct Attack : Gunnery roll against target's TN or opposed roll against Pilot's Dodge or Gunnery (for sand defense).

; Attack Group : Target multiple ships using lowest TN with Superiority modifier.

; Control Missile/Drone : Manual control of smart missiles or drones.

; Launch Missiles : Deploy missile salvos and control their movement.

; Go Ballistic : Turn off missile thrust to hide it (moves 1 space per turn in last direction).

; Missile Attack Group : Target group of enemies with missiles.

; Proximity Explosion : Detonate missile near target (opposed roll against Point Defense, Sand, or Dodge).

; Missile Ram : High-damage ramming attack (damage multiplied by TP+1, but DM-2 per TP spent).

; Aid Gunner : Assist another gunner's roll.

=== Assistant Functions ===

Assistant crew positions support Major Functions without requiring skill checks:

; Captain's Assistant : Must have Leadership 0. Helps manage larger crews.

; Copilot : Assists Pilot function.

; NavComm Assistant : Assists NavComm function.

; Automated Functions : Computer programs (Expert/Agent) can fill positions with effective Characteristic 8, DM+0, Skill 0.

----

== Gaining New Skill Levels during Game Play ==

A character's Skill Total is calculated by summing the levels of each skill (level zero skills count as zero). A character with Mechanics 1 and Slug Pistol 2 would have a Skill Total of 3.

To increase a skill, a character must train for a number of weeks equal to his current Skill Total plus the desired level of the skill. So, to advance from Piloting 2 to Piloting 3 with a current Skill Total of 3 would take (three, plus three) six weeks. A character may only train one skill in a given week.

; Important Note
: The Jack of all Trades skill cannot be learned.

[[Category:Mneme Cepheus Engine]]
[[Category:Rules]]
[[Category:Chapter 2]]

=== SOURCE: https://wiki.gi7b.org/index.php?title=Mneme_CE_Chapter_4_Equipment&action=raw ===

= CHAPTER 4: EQUIPMENT =

''Extracted from Cepheus Engine Core Rules''

---

The following section lists examples of common equipment that adventurers may want. Aside from armor and weapons, each listing notes the object's name and a basic description. The technological level indicates local technology required to manufacture something with the capabilities listed. Price and weight are for an item manufactured by an interstellar society of tech level 10-15; items produced at lower tech levels will probably be bulkier and more expensive. An item with no weight or size given can be carried or worn without difficulty. Additional lines of explanation are given where considered necessary.

Technology Level Overview

Technology Level, also known as Tech Level or TL, is a measure of the scientific and production capacity of a world and the complexity and effectiveness of a piece of equipment.


=== Table: Technology Level Overview ===

{| class="wikitable"
|-
| TL
| Descriptor
| Notable Characteristics
|-
| 0
| Primitive
| No technology.
|-
| 1
| Primitive
| Roughly on a par with Bronze or Iron age technology.
|-
| 2
| Primitive
| Renaissance technology.
|-
| 3
| Primitive
| Mass production allows for product standardization, bringing the germ of industrial revolution and steam power.
|-
| 4
| Industrial
| Transition to industrial revolution is complete, bringing plastics, radio and other such inventions.
|-
| 5
| Industrial
| Widespread electrification, tele-communications and internal combustion.
|-
| 6
| Industrial
| Development of fission power and more advanced computing.
|-
| 7
| Pre-Stellar
| Can reach orbit reliably and has telecommunications satellites.
|-
| 8
| Pre-Stellar
| Possible to reach other worlds in the same system, although terraforming or full colonization is not within the culture’s capacity.
|-
| 9
| Pre-Stellar
| Development of gravity manipulation, which makes space travel vastly safer and faster; first steps into Jump Drive technology.
|-
| 10 (A)
| Early Stellar
| With the advent of Jump, nearby systems are opened up.
|-
| 11 (B)
| Early Stellar
| The first primitive (non-creative) artificial intelligences become possible in the form of “low autonomous” interfaces, as computers begin to model synaptic networks.
|-
| 12 (C)
| Average Stellar
| Weather control revolutionizes terraforming and agriculture.
|-
| 13 (D)
| Average Stellar
| The battle dress appears on the battlefield in response to the new weapons. “High autonomous” interfaces allow computers to become self-actuating and self-teaching.
|-
| 14 (E)
| Average Stellar
| Fusion weapons become man-portable.
|-
| 15 (F)
| High Stellar
| Black globe generators suggest a new direction for defensive technologies, while the development of synthetic anagathics means that the human lifespan is now vastly increased.
|}


Higher Technology Levels exist and may appear in some Cepheus Engine universes.

Currency

The Credit (Cr) is the standard unit of currency in Cepheus Engine. Larger denominations include the KiloCredit (KCr; 1,000 Credits) and the MegaCredit (MCr; 1,000,000 Credits).

Armor

Armor reduces the amount of damage a character takes from a hit, based on the type of armor worn. The armor rating for a set of armor is equal to the amount of damage reduced by the armor when you are hit in combat. A hit with Effect 6+ always inflicts at least one point of damage, regardless of the target’s armor.

Unless otherwise noted, only one type of armor can be worn at a time. Resolve damage from the outside in – damage that gets through the outer layer of armor is next applied to the inner layer.

TL: The earliest tech level at which this item first becomes available.

Armor Rating (AR): The amount of damage reduced by the armor when an attack strikes the character. When two values are listed separated by a slash, the number to the left of the slash represents the armor rating against all attacks except lasers, while the number to the right of the slash represents the armor rating against laser attacks.

Cost: The cost of the item in Credits (Cr).

Weight: The weight of the item in kilograms.

Skill Required: Some armors have a required skill. A character suffers the usual unskilled penalty when using armor without levels in the required skill.


=== Table: Common Personal Armor ===

{| class="wikitable"
|-
| Armor
| TL
| AR
| Cost
| Wgt
| Skill Required
|-
| Ablat
| 9
| 3/8*
| Cr75
| 2kg
| --
|-
| Battle Dress
| 13
| 18
| Cr200,000
| 60kg
| Battle Dress
|-
| Cloth
| 6
| 9
| Cr250
| 2kg
| --
|-
| Combat Armor
| 11
| 11
| Cr20,000
| 18kg
| Zero-G
|-
| Hostile Env Vacc Suit
| 12
| 8
| Cr18,000
| 40kg
| Zero-G
|-
| Jack
| 1
| 3
| Cr50
| 1kg
| --
|-
| Mesh
| 7
| 5
| Cr150
| 2kg
| --
|-
| Reflec
| 10
| 0/14
| Cr1500
| 1kg
| --
|-
| Vacc Suit
| 9
| 6
| Cr9000
| 8kg
| Zero-G
|}


Armor Descriptions

Ablat (TL 9): A cheap alternative to Reflec, ablat armor is made from a material that ablates (vaporizes) when hit by laser fire. Each laser hit on ablat reduces its armor value (versus lasers) by one, but the armor is cheap and easily replaceable.

Battle Dress (TL 13): The ultimate personal armor, battle dress is a powered form of combat armor. The servomotors vastly increase the user's speed and strength, boosting his Strength and Dexterity by +4 while wearing the armor. Damage to the wearer's characteristics is calculated as normal, but the values from the armor are used for all other purposes such as hand to hand damage or skill checks. The suit has a built-in Model 2 computer running an Expert Tactics-2 program to give tactical advice and updates and is commonly outfitted with numerous upgrades. The suit is fully enclosed, with a six-hour air supply and gives full protection against environmental hazards – including NBC shielding – as if it was an HEV suit.

Cloth (TL 7): A heavy duty body suit tailored from ballistic cloth. The fabric absorbs impact energy and spreads it over the body, which can result in bruising. However, cloth armor is highly useful and versatile – it can be effectively concealed under normal clothing although observers making an Investigate or Recon check at 8+ will notice something unusual.

Combat Armor (TL 11): This full-body suit is used by the military and not generally available on the open market, although those with military or criminal contacts can obtain it without much difficulty. It is issued to troop units and mercenary battalions. Combat armor protects from hard vacuum in the same way as a vacc suit and provides life support for six hours.

Hostile Environment Vacc Suit (TL 8): Hostile environment suits are designed for conditions where a normal vacc suit would be insufficient, such as deep underwater, worlds shrouded in toxic or corrosive gases, extremes of radiation or temperature, or other locales that offer serious physical danger as well as the lack of a breathable atmosphere. HEV suits provide all the life support offered by a normal vacc suit (for six hours) but are also impervious to flames, intense radiation such as that found at nuclear blast sites (decreasing radiation exposure by 180 rads), and high pressure environments like undersea trenches.

Jack (TL 1): A natural or synthetic leather jacket or body suit covering the torso and upper arms and legs.

Mesh (TL 6): A jacket or body suit lined with a flexible metal or plastic mesh that gives it added protection against bullets.

Reflec (TL 10): Reflec armor is a flexible plastic suit with layers of reflective material and heat-dispersing gel. It is highly effective against lasers, but provides no protection against other attacks. Reflec can be worn with other armor.

Vacc Suit (TL 8): The vacc suit or space suit is the spacer's best friend, providing life support and protection when in space. A vacc suit provides a breathable atmosphere and protection from the extremes of temperature, low pressure and radiation typically found in a hard vacuum (decreasing exposure by up to 40 rads), for six hours.

Communicators

Characters separated by physical location often have a need to maintain communications. These examples of communications equipment fulfill that need. Routine use of these devices does not require a skill check. When attempting to overcome interference or use these devices for other purposes, the Comms skill check is used.


=== Table: Communications Equipment ===

{| class="wikitable"
|-
| Communicator
| TL
| Cost
| Wgt
| Range
|-
| Long Range Communicator
| 6
| Cr500
| 15 kg
| 500 km
|-
| Medium Range Communicator
| 5
| Cr200
| 10 kg
| 30 km
|-
| Short Range Communicator
| 5
| Cr100
| 5 kg
| 10 km
|-
| Personal Communicator
| 8
| Cr250
| 0.3 kg
| Special
|}


Long Range Communicator: Back-pack mounted radio capable of ranges up to 500 km and contact with ships in orbit. Ten separate channels. At tech level 7 reduce the weight to 1.5 kg and it becomes belt or sling mounted.

Medium Range Communicator: Belt-mounted or sling carried radio set capable of up to 30 km range, and contact with official radio channels. Five separate channels. At tech level 7, reduce the weight to 500 grams.

Short Range Communicator: Belt-mounted radio capable of 10 km range (much shorter underground or underwater). Three separate channels. At tech level 7 reduce the weight to 300 grams and it becomes hand-held.

Personal Communicator: A hand-held, single channel communication device. On world with a tech level of 8 or higher a personal communicator is able to tap into the world's satellite communication network and with the proper address, contact any other communicator in the world (for a fee). The channel is private, but not secure and may be monitored on some worlds. Usually network access can be arranged at the local starport for a small fee. On worlds with a tech level of 7 or less, personal communicators will not work.

Computers

The power of a computer is given by its rating (Model 1, Model 2 and so forth), which measures the complexity of the programs it can run. (Storage space is effectively unlimited at TL 9 and above.) Programs are rated by the computer rating they require. A system can run a number of programs up to its rating.

The computers listed here are laptop size. Battery life is two hours at TL 7, eight hours at TL 8, and effectively unlimited at TL 9 and above. Desktop computers offer a slightly greater amount of processing power for the same cost but not enough to make a difference in-game. Desktops become obsolete during TL 8.


=== Table: Computers by TL ===

{| class="wikitable"
|-
| Optimum TL
| Computer Power
| Mass (kg)
| Cost (Cr)
|-
| TL 7
| Model 0
| 10
| 50
|-
| TL 8
| Model 1
| 5
| 100
|-
| TL 9
| Model 1
| 5
| 250
|-
| TL 10
| Model 2
| 1
| 350
|-
| TL 11
| Model 2
| 1
| 500
|-
| TL 12
| Model 3
| 0.5
| 1,000
|-
| TL 13
| Model 4
| 0.5
| 1,500
|-
| TL 14
| Model 5
| 0.5
| 5,000
|}


Computer Terminal (TL 7): This is a ‘dumb terminal’, with only limited processing power. It serves as an interface to a more powerful computer such as a ship’s computer or planetary network. Terminals range in size depending on their control method – a holographic display terminal can be much smaller than one with a physical keyboard and screen. A computer terminal has Model 0, and costs Cr200.

Hand Computer (TL 7): A hand computer is a portable computer system with considerable processing power. It is more powerful than a computer terminal, and can be used without access to a network. A hand computer costs twice as much as a normal computer of the same TL but can he held in one hand and operated with the other.

Computer Options

Data Display/Recorder (TL 13): This headpiece worn over one or both eyes provides a continuous heads-up display for the user, allowing him to view computer data from any linked system. Because of the transparent screen vision is not obscured while using a DD/R headset. DD/Rs can display data from any system, not just computers – they can display vacc suit oxygen reserves, grav belt status, neural activity scanner results and so forth. Cr5,000.

Data Wafer (TL 10): The principle medium of information storage is the standard data wafer, a rectangle of hardened plastic about the size of a credit card. A TL 10 data wafer is memory diamond, with information encoded in structures of carbon atoms; more advanced wafers use more exotic means of data storage. Cr5.

Specialized Computer: A computer can be designed for a specific purpose, which gives it a Rating of 1 or 2 higher for that program only. The navigation computer on a starship might be only a Model 1, but it could run the Expert Navigation/3 program because it is specially designed for that task. A specialized computer costs 25% more per added Rating. In addition, when working out how many programs the computer can run simultaneously, the program that the computer is specialized for does not count against that total.

Computer Software

A character can use any high-rating software at a lower rating, to a minimum of the lowest rating shown.

Programs above Rating/1 cannot be copied easily, as they require a non-trivial amount of bandwidth to transfer.


=== Table: Computer Software ===

{| class="wikitable"
|-
| Software
| Rating
| TL
| Cost
| Description
|-
| Database
| -
| 7
| Cr10 to Cr10,000
| A database is a large store of information on a topic that can be searched with a Computer check or using an Agent.
|-
| Interface
| 0
| 7
| Included
| Displays data. Using a computer without an interface is a Formidable (–6 DM) task.
|-
| Security
| 0
| 7
| Included
| Security programs defend against intrusion. Rating 0 is Average (+0 DM).
|-
| 
| 1
| 9
| Cr200
| Difficult (–2 DM) difficulty
|-
| 
| 2
| 11
| Cr1,000
| Very Difficult (–4 DM) difficulty
|-
| 
| 3
| 12
| Cr20,000
| Formidable (–6 DM) difficulty
|-
| Translator
| 0
| 9
| Cr50
| Translators are specialized Expert systems that only have Language skills. Provides a near-real-time translation.
|-
| 
| 1
| 10
| Cr500
| Works in real-time and has a much better understanding of the nuances of language.
|-
| Intrusion
| 1
| 10
| Cr1,000
| Intrusion programs aid hacking attempts, giving a bonus equal to their Rating. Intrusion software is often illegal.
|-
| 
| 2
| 11
| Cr10,000
| 
|-
| 
| 3
| 13
| Cr100,000
| 
|-
| 
| 4
| 15
| N/A
| 
|-
| Intelligent Interface
| 1
| 11
| Cr100
| “Low autonomous” artificial intelligence allows voice control and displays data intelligently. Required for using Expert programs.
|-
| 
| 2
| 13
| Cr1,000
| “High autonomous” artificial intelligence allows a primitive artificial intelligence to self-initiate and learn on its own.
|-
| 
| 3
| 17
| Cr10,000
| True artificial intelligence capable of independent creative thought.
|-
| Expert
| 1
| 11
| Cr1,000
| Expert programs mimic skills. A character using an expert system may make a skill check as if he had the skill at the program’s Rating –1. Only Intelligence and Education-based checks can be attempted. If the character already has the skill at a higher level, then an Expert program grants a +1 DM instead.
|-
| 
| 2
| 12
| Cr10,000
| 
|-
| 
| 3
| 13
| Cr100,000
| 
|-
| Agent
| 0
| 11
| Cr500
| Agent programs have a Computer skill equal to their Rating, and can carry out tasks assigned to them with a modicum of intelligence. For example, an agent program might be commanded to hack into an enemy computer system and steal a particular data file. They are effectively specialized combinations of Computer Expert and Intellect programs.
|-
| 
| 1
| 12
| Cr2,000
| 
|-
| 
| 2
| 13
| Cr100,000
| 
|-
| 
| 3
| 14
| Cr250,000
| 
|-
| Intellect
| 1
| 12
| Cr2,000
| Intellects are improved agents, who can use Expert systems. For example, a robot doctor might be running Intellect/1 and Expert Medic/3, giving it a Medic skill of 2. An Intellect program can use a number of skills simultaneously equal to its Rating.
|-
| 
| 2
| 13
| Cr50,000
| 
|-
| 
| 3+
| 14
| -
| 
|}


Drugs

Medications often supplement the direct medical attention of a trained health professional. The following drugs are commonly encountered in Cepheus Engine campaigns.


=== Table: Drugs ===

{| class="wikitable"
|-
| Description
| TL
| Cost
|-
| Medicinal Drugs
| 5
| Cr5+
|-
| Anti-Radiation Drugs
| 8
| Cr1,000
|-
| Panaceas
| 8
| Cr200
|-
| Stim Drugs
| 8
| Cr50
|-
| Combat Drug
| 10
| Cr1,000
|-
| Fast Drug
| 10
| Cr200
|-
| Metabolic Accelerator
| 10
| Cr500
|-
| Medicinal Slow Drug
| 11
| Cr500
|-
| Anagathics
| 15
| Cr2,000
|}


Anagathics: Slow the user’s aging process. Synthetic anagathics become possible at TL 15, but there are natural spices and other rare compounds that have comparable effects at all Technology Levels. Anagathics are illegal or heavily controlled on many worlds. One dose must be taken each month to maintain the anti-aging effect – if the character taking anagathics misses a dose they must make an immediate roll on the aging table as their body reacts badly to the interrupted supply.

Anti-Radiation Drugs: Must be administered before or immediately after (within ten minutes) radiation exposure. They absorb up to 100 rads per dose. A character may only use anti-rad drugs once per day – taking any more causes permanent Endurance damage of 1D6 per dose.

Combat Drug: This drug increases reaction time and improves the body’s ability to cope with trauma, aiding the user in combat. A character using a combat drug adds +4 to his initiative total at the start of combat (or whenever the drug takes effect). He may also dodge once each round with no effect on his initiative score and reduces all damage suffered by two points. The drug kicks in twenty seconds (four rounds) after injection, and lasts around ten minutes. When the drug wears off, the user is fatigued.

Fast Drug: Also known as 'Hibernation', this drug puts the user into a state akin to suspended animation, slowing his metabolic rate down to a ratio of 60 to 1 – a subjective day for the user is actually two months. Fast drug is normally used to prolong life support reserves or as a cheap substitute for a cryoberth.

Medicinal Drugs: These medications include vaccines, antitoxins and antibiotics. They range in cost from Cr5 to 1D6x1,000 Credits, depending on the rarity and complexity of the drug. Medicinal drugs require the Medic skill to use properly – using the wrong drug can be worse than doing nothing. With a successful Medic check the correct drug can counteract most poisons or diseases, or at the very least give a positive DM towards resisting them. If the wrong drug is administered, treat it as a Difficult (–2 DM) poison with a damage of 1D6.

Medicinal Slow: A variant of the slow drug. It can only be applied safely in a medical facility where life-support and cryo-technology is available as it increases the metabolism to around thirty times normal, allowing a patient to undergo a month of healing in a single day.

Metabolic Accelerator: Also known as 'Slow Drug', this drug boosts the user’s reaction time to superhuman levels. A character using slow drug in combat adds +8 to his initiative total at the start of combat (or whenever the drug takes effect). He may also dodge up to twice each round with no effect on his initiative score. The drug kicks in 45 seconds (eight rounds) after ingestion or injection and lasts for around ten minutes. When the drug wears off, the user’s system crashes. He suffers 2D6 points of damage and is exhausted.

Panaceas: Wide-spectrum medicinal drugs that are specifically designed not to interact harmfully. They can therefore be used on any wound or illness and are guaranteed not to make things worse. A character using panaceas may make a Medic check as if he had Medic 0 when treating an infection or disease.

Stim Drugs: Removes fatigue, at a cost. A character who uses stim may remove the effects of fatigue but suffers one point of damage. If stims are used to remove fatigue again without an intervening period of sleep, the character suffers two points of damage the second time, three points the third time, and so on.

Explosives

The Demolitions skill is used with explosives – the Effect of the Demolitions skill check multiplies the damage, with a minimum of x1 damage for an Effect of 0 or 1. Explosives are not legally available on any world with a Law Level of 1 or greater.


=== Table: Explosives ===

{| class="wikitable"
|-
| Weapon
| TL
| Damage
| Radius
| Cost (Cr)
|-
| Plastic
| 6
| 3D6
| 2D6 meters
| 200
|-
| Pocket Nuke
| 12
| 2D6 x 20
| 15D6 meters
| 20,000
|-
| TDX
| 12
| 4D6
| 4D6 meters
| 1,000
|}


Plastic: This generic, multi-purpose plastic explosive is a favorite of military units, terrorists, demolition teams and adventurers across known space.

Pocket Nuke: Hideously illegal on many worlds, the pocket nuke is actually the size of a briefcase and so is too large to fit into a grenade launcher.

TDX: An advanced gravity-polarized explosive, TDX explodes only along the horizontal axis.

Personal Devices

Characters often possess any of a number of personal devices, such as those described in this section.


=== Table: Personal Devices ===

{| class="wikitable"
|-
| Description
| TL
| Cost
| Wgt
|-
| Magnetic Compass
| 3
| Cr10
| --
|-
| Wrist Watch
| 4
| Cr100
| --
|-
| Radiation Counter
| 5
| Cr250
| 1
|-
| Metal Detector
| 6
| Cr300
| 1
|-
| Hand Calculator
| 7
| Cr10
| 0.1
|-
| Inertial Locator
| 9
| Cr1,200
| 1.5
|-
| Electromagnetic Probe
| 10
| Cr1,000
| --
|-
| Hand Computer
| 11
| Cr1,000
| 0.5
|-
| Holographic Projector
| 11
| Cr1,000
| 1
|-
| Densitometer
| 14
| Cr20,000
| 5
|-
| Bioscanner
| 15
| Cr350,000
| 3.5
|-
| Neural Activity Sensor
| 15
| Cr35,000
| 10
|}


Bioscanner: The bioscanner 'sniffs' for organic molecules and tests chemical samples, analysing the make-up of whatever it is focussed on. It can be used to detect poisons or bacteria, analyse organic matter, search for life signs and classify unfamiliar organisms. The data from a bioscanner can be interpreted using the Comms or the Life Sciences skill.

Densitometer: The remote densitometer uses an object’s natural gravity to measure its density, building up a three-dimensional image of the inside and outside of an object.

Electromagnetic Probe: This handy device detects the electromagnetic emissions of technological devices, and can be used as a diagnostic tool when examining equipment (+1 DM to work out what’s wrong with it) or when searching for hidden bugs or devices. The Comms skill can be used to sweep a room for bugs.

Hand Calculator: Allows the user to perform mathematical calculations quickly.

Hand Computer: The ‘handcomp' provides services of a small computer, plus serves as a computer terminal when linked (by its integral radio, network interface jack, or by other circuit) to a standard computer.

Holographic Projector: A holographic projector is a toaster-sized box that, when activated, creates a three-dimensional image in the space around it or nearby – the range is approximately three meters in all directions. The image can be given pre-programmed animations within a limited range and the projector includes speakers for making sound. The projected holograms are obviously not real so this device is mostly used for communication. The TL 12 version can produce holograms real enough to fool anyone who fails an Intelligence check (made upon first seeing the hologram), at double the cost, and the TL 13 version can produce holograms that are true-to-life images, at ten times the cost.

Inertial Locator: Indicates direction and distance traveled from the starting location.

Magnetic Compass: Indicates direction of magnetic north, if any exists.

Metal Detector: Indicates presence of metal within a 3 meter radius (including underground), with the indicating signal growing stronger as it gets closer to the source.

Neural Activity Sensor (NAS): This device consists of a backpack and detachable handheld unit, and can detect neural activity up to 500 meters away. The device can also give a rough estimation of the intelligence level of organisms based on brainwave patterns. The data from a neural activity scanner can be interpreted using the Comms, the Life Sciences or the Social Sciences skills.

Radiation Counter: Indicates presence and intensity of radioactivity within a 30-meter radius. The indicating signal will grow stronger as it gets closer to the source.

Wrist Watch: Allows the user to tell time. At teck level 9, can be configured to multiple worlds, as well as standard time, and allows the user to configure alarms based on specific times.

Robots and Drones

Robots are iconic to science fiction. This section describes the robots and drones commonly available in a Cepheus Engine campaign. A robot has an Intellect program running, allowing it to make decisions independently, while drones are remote-controlled by a character with the Comms skill.

Robots and drones operate in combat like characters but take damage as if they were vehicles. They have Hull and Structure characteristics instead of an Endurance characteristic, and an Endurance DM of 0. Any robot running an Intellect program has an Intelligence and Education score. Drones have neither. A robot’s Education characteristic is representative of the information programmed into it and even low-end robots can have high Education scores. Most robots have Social Standing characteristics of 0 as they are not social creations but there are some exceptions, usually high-end models running advanced Intellect programs. Drones do not have Social Standing but in cases where they are used to engage in diplomacy or other social intercourse the operator can use his own Social Standing score.

Cargo Robot (TL 11): These simple, heavy-duty robots are found in starport docks and on board cargo ships. Cargo drones can be constructed as low as Technology Level 9 but their utility is extremely limited until the invention of Intellect programs.

Strength 30 (+8), Dexterity 9 (+1), Hull 2, Structure 2

Intelligence 3 (–1), Education 5 (–1), Social Standing 0 (–3)

Traits: Armor 8, Huge, Specialized Model 1 computer (running Intellect/1 and Expert (appropriate skill)/1)

Weapons: Crushing Strength (Natural Weapons, 3D6 damage)

Price: Cr75,000

Repair Robot (TL 11): Shipboard repair robots are small crab-shaped machines that carry a variety of welding and cutting tools. Specialized repair robots may run Expert Engineering rather than Expert Mechanics.

Strength 6 (+0), Dexterity 7 (+0), Hull 1, Structure 1

Intelligence 5 (–1), Education 6 (+0), Social Standing 0 (–3)

Traits: Integral System (mechanical toolkit), Specialized Model 1 computer (running Intellect/1 and Expert Mechanics/2)

Weapons: Tools (Natural Weapons, 1D6 damage)

Price: Cr10,000

Personal Drone (TL 11): This is a small floating globe about thirty centimeters in diameter. It is equipped with holographic projectors which can display the image of a person, allowing a character to have a virtual presence over a great distance.

Strength 2 (–2), Dexterity 7 (+0), Hull 1, Structure 1

Traits: Tiny, Integral System (comm, audio/visual), Integral System (grav floater), Integral System (TL 11 holographic projector)

Price: Cr2,000

Probe Drone (TL 11): A probe drone is a hardened version of a personal remote, armored and carrying more sensor packages. They have an operating range of five hundred kilometers, and can fly at a speed of 300 kph.

Strength 3 (–1), Dexterity 7 (+0), Hull 3, Structure 3

Traits: Armor 5, Integral System (comm, audio/visual), Integral System (grav belt), Integral System (TL 11 holographic projector), Integral System (every sensor available at TL 11 and below)

Price: Cr15,000

Autodoc (TL 12): An autodoc is a specialized, immobile medical robot, which is often installed inside vehicles or spacecraft.

Strength 6 (+0), Dexterity 15 (+3), Hull 1, Structure 1

Intelligence 9 (+1), Education 12 (+2), Social Standing 0 (–3)

Traits: Integral System (TL 12 medikit), Specialized Model 1 computer (running Intellect/1 and Medicine/2)

Weapons: Surgical Tools (Slashing Weapons, 1D6 damage)

Price: Cr40,000

Combat Drone (TL 12): Combat drones are little more than flying guns mated to a grav floater and a computer system. The drones must be piloted with the Remote Operations skill but attacks are made using the appropriate weapon skill. Combat drones loaded with Intellect and combat Expert programs (making them autonomous combat robots) are illegal on many worlds.

Strength 12 (+2), Dexterity 10 (+1), Hull 4, Structure 4

Traits: Armor 9, Integral System (grav floater), Integral Weapon (any)

Weapons: Any gun

Price: Cr90,000, plus the cost of the weapon (the Integral Weapon upgrade is included)

Servitor (TL 13): Servitor robots are expensive humanoid robots who are programmed to act as butlers or servants to the nobility. Some servitor owners reprogram their robots with Expert Carousing or Expert Gambling to better suit their lifestyle.

Strength 7 (+0), Dexterity 9 (+1), Hull 2, Structure 2

Intelligence 9 (+1), Education 12 (+2), Social Standing 7 (+0)

Traits: Computer/3 (running Intellect/1 and Expert Steward/2 – servitors also have Expert Liaison/2 and Translator/1 available should they be necessary)

Weapons: Robot Punch (Natural Weapons, 1D6 damage)

Price: Cr120,000

Robot and Drone Options

Armor: Armor can be increased by 5, which increases the drone or robot’s cost by 25%.

Integral System: Certain devices can be built into drones or robots by increasing the cost of the device by +50%. Popular choices include toolkits of different kinds, various sensors, or mobility upgrades like thruster packs or grav floaters.

Integral Weapon: Any suitable weapon can be added to a drone or robot, at the cost of Cr10,000 + the cost of the weapon.

Sensory Aids

The following aids provide enhance a character’s physical senses.


=== Table: Sensory Aids ===

{| class="wikitable"
|-
| Description
| TL
| Cost
| Wgt
|-
| Torch
| 1
| Cr1
| 0.25
|-
| Lamp Oil
| 2
| Cr2
| --
|-
| Oil Lamp
| 2
| Cr10
| 0.5
|-
| Binoculars
| 3
| Cr75
| 1
|-
| Electric Torch
| 5
| Cr10
| 0.5
|-
| Cold Light Lantern
| 6
| Cr20
| 0.25
|-
| Infrared Goggles
| 6
| Cr500
| --
|-
| Light Intensifier Goggles
| 7
| Cr500
| --
|}


Binoculars: Allows the user to see further. At TL 8 electronic enhancement allows images to be captured; light-intensification allows them to be used in the dark. Cr750. At TL 12 PRIS (Portable Radiation Imaging System) allows the user to observe a large section of the EM-spectrum, from infrared to gamma rays. Cr3,500.

Cold Light Lantern: A fuel cell powered version of the electric torch, but will last 3 days with continuous use. Produces a wide cone of light up to 18 meters away with a radius of 6 meters at the end of the beam. Also capable of producing a tight beam of light up to 36 meters away with a 1 meter radius or be used to illuminate a 10 meter radius.

Electric Torch: The common flashlight. It is battery powered and will last for about 6 hours of continuous use. A torch produces a wide cone of light up to 18 meters long with a radius of 6 meters at the end of the beam. Later TL models have adjustable beams allowing them to also produce a tight beam of light up to 36 meters long, with a 1 meter radius, or be used to illuminate a circle of 10 meter radius.

Infrared Goggles: Permits the user to see exothermic (heat-emitting) sources in the dark.

Light Intensifier Goggles: Permits the user to see normally in anything less than total darkness by electronically intensifying any available light.

Oil Lamp: A lamp clearly illuminates a 4.5 meter radius, provides shadowy illumination out to a 9 meter radius, and burns for 6 hours on a pint of oil. You can carry a lamp in one hand.

Torch: A torch burns for 1 hour, clearly illuminating a 6 meter radius and providing shadowy illumination out to a 12 meter radius.

Shelters

Whenever characters are not indulging in the creature comforts of civilization, they need shelter, such as the items described in this section.


=== Table: Shelters ===

{| class="wikitable"
|-
| Description
| TL
| Cost
| Wgt
|-
| Tarpaulin
| 1
| Cr10
| 2
|-
| Tent
| 2
| Cr200
| 3
|-
| Pre-Fabricated Cabin
| 6
| Cr10,000
| 4,000
|-
| Basic Life Support Supplies
| 7
| Cr100
| 2
|-
| Pressure Tent
| 7
| Cr2,000
| 25
|-
| Advanced Base
| 8
| Cr50,000
| 6,000
|}


Advanced Base: Modular pressurized quarters for 6 persons and capable of withstanding anything less than hurricane force winds. Offers excellent shelter from precipitation and all but the most extreme of temperature ranges. Requires 12 man-hours to erect or dismantle. There are 16 modules, each, 1.5m wide by 1.5m long by 2m high that can be organized into any layout required. Dismantled and ready for shipment, the advanced base weighs 6 tons. The cost includes life-support for six people for 7 days.

Basic Life Support Supplies: Basic life support supplies (waste reclamation chemicals, oxygen supply, CO2 scrubbers, etc.) necessary to support one person for one day in an enclosed, pressurized environment, such as a pressure tent or an advanced base.

Pre-Fabricated Cabin: Modular unpressurized quarters for 6 persons and capable of withstanding light to severe winds. Offers excellent shelter from precipitation, storms, and temperatures down to -10º Celsius. Requires 8 man-hours to erect or dismantle. There are 16 modules, each, 1.5m wide by 1.5m long by 2m high that can be organized into any layout required. Dismantled and ready for shipment, the cabin weighs 4 tons.

Pressure Tent: Basic pressurized shelter for two persons, providing standard atmosphere and conditions, along with protection from precipitation, storms, and up to strong winds. There is no airlock: the tent must be depressurized to enter or leave it.

Tarpaulin: A heavy hard-wearing waterproof fabric made of canvas or similar, for outdoor use as a temporary shelter or protective covering against moisture. Measures 4 meters long by 2 meters wide.

Tent: Basic shelter for two persons offering protection from precipitation, storms, and temperatures down to 0º Celsius, and withstanding light to moderate winds. Larger, more elaborate tents capable of sheltering more people, higher winds or colder temperatures weigh and cost more.

Survival Equipment

Survival equipment helps the character stay physically alive and able to take action, even in the most unusual of environments.


=== Table: Survival Equipment ===

{| class="wikitable"
|-
| Description
| TL
| Cost
| Wgt
|-
| Cold Weather Clothing
| 1
| Cr200
| 2
|-
| Filter Mask
| 3
| Cr10
| --
|-
| Swimming Equipment
| 3
| Cr200
| 1
|-
| Combination Mask
| 5
| Cr150
| --
|-
| Oxygen Tanks
| 5
| Cr500
| 5
|-
| Respirator
| 5
| Cr100
| --
|-
| Underwater Air Tanks
| 5
| Cr800
| 5
|-
| Artificial Gill
| 8
| Cr4,000
| 4
|-
| Environment Suit
| 8
| Cr500
| --
|-
| Rescue Bubble
| 9
| Cr600
| 3
|-
| Thruster Pack
| 9
| Cr2,000
| 5
|-
| Portable Generator
| 10
| Cr500,000
| 15
|}


Artificial Gill: Extracts oxygen from water to allowing the wearer to breathe for an unlimited time while submerged under water. Functions only on worlds with thin, standard, or dense (type 4 through 9) atmospheres.

Cold Weather Clothing: Protects against frigid weather (-20º Celsius or below). Adds a DM+2 to all Endurance checks made to resist the effects of cold weather exposure. Reduce the weight by 1kg for every 5 TL.

Combination Mask: A combination of both filter mask and respirator, which allows breathing of very thin, tainted atmospheres (type 2), plus all atmospheres listed under filter and respirator masks.

Environment Suit: Designed to protect the wearer from extreme cold or heat, the environment suit has a hood, gloves and boots but leaves the face exposed in normal operations.

Filter Mask: A filter set that allows an individual to breathe tainted atmospheres (types 4, 7, and 9). Also protects against the inhalation of heavy smoke or dust.

Oxygen Tanks: A complete set of compressed oxygen tanks, which allow independent breathing in smoke, dust, gas, or exotic (type A) atmosphere. Two tanks last 6 hours. Refill of proper atmospheric mixture for race cost Cr20.

Portable Generator: This is a heavy-duty portable fusion generator, capable of recharging weapons and other equipment for up to one month of use.

Rescue Bubble: A large (2m diameter) pressurized plastic bubble. Piezoelectric layers in the bubble wall translate the user's movements into electricity to recharge the bubble's batteries and power its distress beacon, and a small oxygen tank both inflates the bubble and provides two person/hours of life support. A self-repairing plastic seal serves as an emergency airlock. Rescue bubbles are found on both space vessels and water craft as emergency lifeboats.

Respirator: A small compressor that allows an individual to breathe in very thin atmospheres (type 3).

Swimming Equipment: Includes swim fins, wet suit, face mask. Protects against the effects of cold (5º Celsius or below), along with improving speed and maneuverability underwater; add DM +1 to all Athletics skill checks in these situations when wearing proper swimming equipment.

Thruster Pack: A simple thruster pack gives the user the ability to maneuver in zero-gravity. A Zero-G check is required to use a thruster pack accurately. Thruster packs can only be used in microgravity environments and are only practical for journeys between spacecraft at Adjacent range.

Underwater Air Tanks: Equivalent to oxygen tanks but designed for use underwater. Two tanks last 6 hours. Refill of proper atmospheric mixture for race and expected depth cost Cr20.

Tools

Technical skills require specialist tools of various kinds.


=== Table: Tools ===

{| class="wikitable"
|-
| Description
| TL
| Cost
| Wgt
|-
| Mechanical Toolkit
| 4
| 1,000
| 12
|-
| Electronics Toolkit
| 5
| 1,000
| 12
|-
| Lock Pick Set
| 5
| 10
| --
|-
| Medical Kit
| 7
| 1,000
| 10
|-
| Forensics Toolkit
| 8
| 1,000
| 12
|-
| Engineering Toolkit
| 9
| 1,000
| 12
|-
| Scientific Toolkit
| 9
| 1,000
| 12
|-
| Surveying Toolkit
| 9
| 1,000
| 12
|}


Electronics Toolkit: Required for electrical repairs and installations. This kit contains diagnostic sensors, hand tools, computer analysis programs (at appropriate tech levels) and spare parts.

Engineering Toolkit: Required for performing repairs and installing new equipment. This kit contains diagnostic sensors, hand tools, computer analysis programs (at appropriate tech levels) and spare parts.

Forensics Toolkit: Required for investigating crime scenes and testing samples. This kit contains diagnostic sensors, hand tools, computer analysis programs (at appropriate tech levels) and spare parts.

Lock Pick Set: Allows picking of ordinary mechanical locks. Lock pick sets are illegal on worlds of law level 8+; on such worlds the cost rises to Cr100 or more.

Mechanical Toolkit: Required for repairs and construction. This kit contains diagnostic sensors, hand tools, computer analysis programs (at appropriate tech levels) and spare parts.

Medical Kit: This medical kit contains diagnostic devices and scanners, surgical tools and a plethora of drugs and antibiotics, allowing a medic to practice his art in the field.

Scientific Toolkit: Required for scientific testing and analysis. This kit contains diagnostic sensors, hand tools, computer analysis programs (at appropriate tech levels) and spare parts.

Surveying Toolkit: Required for planetary surveys or mapping. This kit contains diagnostic sensors, hand tools, computer analysis programs (at appropriate tech levels) and spare parts.

Vehicles

In classic science fiction, characters rarely travel on foot. Vehicles play a big role in Cepheus Engine games. All vehicles have the following traits:

TL: The lowest Technology Level that the vehicle is available at.

Skill: The skill used to drive or pilot the vehicle.

Agility (Agi): How easy the vehicle is to drive, expressed as a DM to the pilot’s skill check.

Speed (Spd): The vehicle’s maximum speed.

Crew and Passengers (C&P): How many people the vehicle can carry.

Open/Closed (O/C): If the vehicle is open or closed.

Armor: How much armor the vehicle has. Damage sustained by a vehicle is reduced by its armor.

Hull: The number of hits the vehicle can sustain to its Hull before being disabled.

Structure (Struc): The number of hits the vehicle can sustain to its Structure before being destroyed.

Weapons (Wpns): What weapons the vehicle has, if any, and what fire arcs they are in.

Cost: How much the vehicle costs.


=== Table: Common Vehicles ===

{| class="wikitable"
|-
| Vehicle
| TL
| Skill
| Agi
| Spd
| C&P
| O/C
| Armor
| Hull
| Struc
| Wpns
| Cost (KCr)
|-
| Steamship
| 4
| Ocean Ships
| -3
| 30 kph
| 5 crew, 10 psgr
| Closed
| 2
| 40
| 40
| None
| 720
|-
| Biplane
| 5
| Winged Aircraft
| +1
| 250 kph
| 1 pilot, 1 psgr
| Closed
| 2
| 1
| 1
| None
| 46
|-
| Ground Car
| 5
| Wheeled Vehicle
| +0
| 150 kph
| 1 driver, 3 psgr
| Closed
| 6
| 3
| 2
| None
| 6
|-
| Motor Boat
| 5
| Motorboats
| -3
| 120 kph
| 5 crew, 10 psgr
| Closed
| 3
| 16
| 17
| None
| 530
|-
| Helicopter
| 6
| Rotor Aircraft
| +1
| 100 kph
| 1 pilot, 7 psgr
| Closed
| 3
| 2
| 3
| None
| 250
|-
| Submersible
| 6
| Submarine
| -4
| 40 kph
| 5 crew, 10 psgr
| Closed
| 3
| 85
| 85
| None
| 1,700
|-
| Twin Jet Aircraft
| 6
| Winged Aircraft
| +1
| 600 kph
| 2 pilots, 6 psgr
| Closed
| 3
| 5
| 5
| None
| 480
|-
| Hovercraft
| 7
| Rotor Aircraft
| +1
| 150 kph
| 1 pilot, 15 psgr
| Closed
| 3
| 7
| 8
| None
| 880
|-
| Air/Raft
| 8
| Grav Vehicle
| +0
| 400 kph
| 1 pilot, 3 psgr
| Open
| 6
| 2
| 2
| None
| 275
|-
| Speeder
| 8
| Grav Vehicle
| +2
| 1500 kph
| 1 pilot, 1 psgr
| Closed
| 3
| 1
| 2
| None
| 890
|-
| Destroyer
| 9
| Ocean Ships
| -5
| 40 kph
| 10 crew, 8 gunners, 12 psgr
| Closed
| 8
| 63
| 63
| None
| 4,800
|-
| Grav Floater
| 11
| Grav Vehicle
| –2
| 40 kph
| 1 rider
| Open
| -
| -
| 1
| None
| 0.5
|-
| AFV
| 12
| Tracked Vehicle
| +0
| 80 kph
| 1 driver, 9 psgr
| Closed
| 18
| 5
| 5
| Triple Laser (turret)
| 65
|-
| ATV
| 12
| Tracked Vehicle
| +0
| 100 kph
| 1 driver, 15 psgr
| Closed
| 12
| 5
| 5
| None
| 50
|-
| Grav Belt
| 12
| Zero-G
| +2
| 300 kph
| 1 wearer
| Open
| -
| -
| -
| None
| 100
|-
| G/Carrier
| 15
| Grav Vehicle
| +0
| 620 kph
| 1 driver, 1 gunner, 14 psgr
| Closed
| 25
| 8
| 8
| Fusion Gun (turret)
| 150
|}


AFV: A heavily armored ATV, known as an Armored Fighting Vehicle, equipped with a triple laser turret. The lasers use the Energy Rifle skill, do 4D6 damage each using the Ranged (rifle) range modifiers, and one, two or three may be fired at the same target with one attack action.

Air/Raft: An open-topped vehicle supported by anti-gravity technology. Air/rafts can even reach orbit (taking a number of hours equal to the world’s Size code) but passengers at that altitude must wear vacc suits. They are ubiquitous, remarkably reliable and flexible vehicles.

ATV: An enclosed, pressurized all-terrain ground vehicle. The vehicle is capable of floating on calm water, and has a suite of built-in sensors and communications equipment (usually a laser transceiver) making it ideal for exploration. An ATV has a hardpoint for a turret, but does not come with a weapon normally.

Biplane Aircraft: A primitive form of aircraft with two pairs of wings, one above the other. This vehicle can only transport 100kg of cargo.

Destroyer A fast maneuverable long-endurance watercraft built for military action, intended to escort larger watercraft in a fleet, convoy or battle group and defend them against smaller powerful short-range attackers. Powered by a fusion power plant, the destroyer carries deck-mounted turrets capable of firing major. Cargo capacity is limited to 40 tons, mostly used to carry ammunition.

G/Carrier: A grav carrier is effectively a flying tank, and is the standard fighting vehicle of many military forces. The turret-mounted fusion gun is a vehicle-mounted version of the TL 15 FGMP and uses the same ‘serious firepower’ rules. Advanced containment systems mean that it does not leak radiation with each shot in the same way as the man-portable version. Like the air/raft, the G/Carrier can reach orbit (taking a number of hours equal to the world’s Size code).

Grav Belt: A grav belt resembles a parachute harness, and is fitted with artificial gravity modules allowing the wearer to fly. The internal battery can operate for a maximum of four hours before needing to be recharged. At TL 15, the battery can operate for 12 hours before charging. Options cannot be added to the grav belt.

Grav Floater: A grav floater is a forerunner of the grav belt, a platform upon which a single person can stand and be carried along. It cannot achieve any great speed but can, like an air/raft, achieve any altitude up to orbit (taking a number of hours equal to the world’s Size code).

Ground Car: A ground car is a conventional wheeled automobile.

Helicopter: An aircraft that derives both lift and propulsion from one or more sets of horizontally revolving overhead rotors. It is capable of moving vertically and horizontally, the direction of motion being controlled by the pitch of the rotor blades. The helicopter can carry 500 kg of cargo.

Hovercraft: A vehicle that travels over land or water on a cushion of air provided by a downward blast, the hovercraft is only usable on words with a Thin atmosphere or thicker. The hovercraft has 3 tons of cargo space.

Motor Boat: Watercraft using hydrofoils to achieve exceptional speed and performance. The hold of the vehicle can accommodate 10 tons of cargo.

Small Steamship: A watercraft that is propelled by a steam engine. The steamship has a cargo capacity of 50 tons.

Speeder: Capable of high speed transit across a planetary surface, the speeder is a streamlined grav vehicle with a limited cargo capacity of 100kg. This vehicle only takes an hour to reach orbit.

Submersible: A watercraft designed to operate under an ocean’s surface. Submersibles are often used as transport between domed cities on waterworlds and other planets with large fluid oceans. The submersible can carry 30 tons of cargo.

Twin Jet Aircraft: A fixed-wing aircraft propelled by jet engines, often used to transport cargo. The hold has a cargo capacity of 5 tons.

Vehicle Options

With the exception of on-board computer, each of these options can only be taken once on a given vehicle.

Autopilot (TL 11): An autopilot has a Model 1 computer specialized to run Intellect/1 and an Expert/1 in an appropriate skill and specialty. This will be in addition to any other computers installed. An autopilot is often mandatory on cheaper commercial models. In many areas (primarily urban) they are required to be in use. Higher Law Level polities may require a slave modification to the autopilot for centralized and/or emergency traffic control. Cr3,000.

Enclosed: This modification turns an open vehicle into a closed one. It costs 10% of the base cost of the vehicle, reduces Agility by 1 and top speed by 10%.

Extended Life Support: A vehicle which is sealed can be equipped for extended life support, which increases the duration to 18 hours per person. Costs another 10% of the base cost of the vehicle.

Heavy Armor: Increasing the armor of a vehicle by 5 adds 25% to the cost of the vehicle.

High Performance: A vehicle can be made into a high-performance vehicle, increasing its top speed by 20%. The vehicle costs 50% more.

On-board Computer: Adding an on-board computer costs the same as a hand computer.

Sealed: This option can be added to any closed vehicle (it is included in the ATV, AFV, G/Carrier and Speeder). The vehicle can be sealed and provides life support for its passengers and crew for two hours per person. This option adds 20% to the cost of the vehicle.

Style: Allows a vehicle to be customized to the buyer’s wishes. Costs Cr200 to Cr2,000.

Weapons

A small selection of the weaponry available in a Cepheus Engine campaign can be found in the tables below. The Law Level of a world will limit the availability of certain weapons.

Melee Weapons

A number of melee weapons are described in the Common Personal Melee Weapons table. Each column is described as follows:

Cost: Price in Credits (Cr) or 1000s of Credits (KCr).

TL: The minimum tech level required to manufacture such an item.

Wgt: Weight in grams (g) or kilograms (kg).

Range: The range category for this weapon.

Damage: The damage a weapon inflicts.

Type: Type of damage inflicted – (B)ludgeoning, (E)nergy, (P)iercing or (S)lashing.

LL: The Law Level where the weapon first becomes illegal.


=== Table: Common Melee Personal Weapons ===

{| class="wikitable"
|-
| Weapon
| TL
| Cost
| Wgt
| Range
| Damage
| Type
| LL
|-
| Unarmed Strike
| --
| --
| --
| melee (close quarters)
| 1D6
| B
| --
|-
| Cudgel
| 0
| Cr10
| 1kg
| melee (close quarters)
| 3D6
| B
| 9
|-
| Dagger
| 0
| Cr10
| 250g
| melee (close quarters) or ranged (thrown)
| 1D6
| P
| 5
|-
| Spear
| 0
| Cr10
| 1500g
| melee (extended reach) or ranged (thrown)
| 3D6
| P
| 8
|-
| Pike
| 1
| Cr40
| 8kg
| melee (extended reach)
| 4D6
| P
| 8
|-
| Sword
| 1
| Cr150
| 1kg
| melee (extended reach)
| 3D6
| P/S
| 8
|-
| Broadsword
| 2
| Cr300
| 3kg
| melee (extended reach)
| 4D6
| S
| 8
|-
| Halberd
| 2
| Cr75
| 3kg
| melee (extended reach)
| 4D6
| S
| 8
|-
| Bayonet
| 3
| Cr10
| 250g
| melee (close quarters)
| 1D6
| P
| 5
|-
| Blade
| 3
| Crr50
| 350g
| melee (extended reach)
| 2D6
| P
| 8
|-
| Cutlass
| 3
| Cr100
| 1250g
| melee (extended reach)
| 3D6
| S
| 8
|-
| Foil
| 3
| Cr100
| 500g
| melee (extended reach)
| 3D6
| P
| 8
|}


Bayonet: A small knife-like weapon similar to a dagger, frequently attached to a rifle. When not attached to a rifle, the bayonet performs as a dagger.

Blade: A hybrid knife weapon with a heavy, flat two-edged blade nearly 300mm in length, and (often, but not always) a semi-basket handguard. Because of the bulk of the handguard, it is generally carried in a belt scabbard. Blades are as much survival tools as weapons, and are often found in emergency kits, lifeboats etc.

Broadsword: The largest of the sword weapons, also called the two-handed sword because it requires both hands to swing. The blade is extremely heavy, two-edged, and about 1000 to 1200mm in length. The hilt is relatively simple, generally a cross-piece only, with little basketwork or protection. When carried, the broadsword is worn in a metal scabbard attached to the belt; less frequently, the scabbard is worn on the back, and the broadsword is drawn over the shoulder.

Cudgel: A basic stick used as a weapon. Easily obtained from standing trees or through the use of an unloaded long gun such as a rifle or carbine (laser weapons are too delicate to be used as cudgels). Length: 1000 to 2000mm.

Cutlass: A heavy, flat-bladed, single-edged weapon featuring a full basket hilt to protect the hand. The cutlass is the standard shipboard blade weapon and sometimes kept in lockers on the bulkhead near important locations; when worn, a belt scabbard is used. Blade length varies from 600 to 900mm.

Dagger: A small knife weapon with a flat, two-edged blade approximately 200mm in length. Daggers are usually carried in a belt sheath, or less frequently concealed in a boot sheath or strapped to the forearm. Daggers are usually as much a tool as a last-resort weapon of defense, and worn constantly. Each weighs 250 grams; that weight, however, does not count against the weight load of the character as the weapon is worn constantly and comfortably.

Foil: Also known as the rapier, this weapon is a light, sword-like weapon with a pointed, edged blade 800mm in length, and a basket or cup hilt to protect the hand. Foils are worn in scabbards attached to the belt.

Halberd: A two-handed pole weapon having an axe-like blade and a steel spike mounted on the end of a long shaft. Length: 2500mm.

Pike: A two-handed weapon with a pointed steel or iron head on a long wooden shaft. Length: 3000 to 4000mm.

Spear: A weapon with a long shaft and a pointed tip, typically of metal, used for thrusting or throwing. Length: 3000mm.

Sword: The standard long-edged weapon, featuring a flat, two-edged blade. It may or may not have a basket hilt or hand protector. A scabbard to carry the sword may be attached to the belt, or to straps (or a sash) over the shoulder. Blade length may vary from 700 to 950mm.

Ranged Weapons

The Common Ranged Weapons table lists the ranged weapons commonly available in a Cepheus Engine campaign. Each column is described as follows:

Cost: Price in Credits (Cr) or 1000s of Credits (KCr).

TL: The minimum tech level required to manufacture such an item.

Wgt: Weight in grams (g) or kilograms (kg).

RoF: Rate of Fire. The number of rounds that may be fired during a significant action in the format: Single Shot / Burst Shot / Automatic Fire.

Range: The range category for this weapon.

Dmg: The damage a weapon inflicts.

Type: Type of damage inflicted – (B)ludgeoning, (E)nergy, (P)iercing or (S)lashing.

Recoil: Lists if the weapon has recoil when fired.

LL: The Law Level where the weapon first becomes illegal.

The Common Ranged Ammunition table describes the cost of ammunitions and power packs for certain ranged weapons. Each column is described as follows:

Cost: The cost of a full magazine of standard ammunition or power pack for a weapon.

TL: The minimum tech level required to manufacture such an item.

Wgt: The weight of a full magazine or power pack for a weapon.

Rounds: The number of rounds the weapon may fire before it must be reloaded or recharged.


=== Table: Common Personal Ranged Weapons ===

{| class="wikitable"
|-
| Weapon
| TL
| Cost
| Wgt
| RoF
| Range
| Dmg
| Type
| Recoil
| LL
|-
| Bow
| 1
| Cr60
| 1kg
| 1
| ranged (assault weapon)
| 2D6
| P
| Yes
| 6
|-
| Crossbow
| 2
| Cr75
| 3kg
| 1
| ranged (rifle)
| 2D6
| P
| Yes
| 6
|-
| Revolver
| 4
| Cr150
| 900g
| 1
| ranged (pistol)
| 2D6
| P
| Yes
| 6
|-
| Auto Pistol
| 5
| Cr200
| 750g
| 1
| ranged (pistol)
| 2D6
| P
| Yes
| 6
|-
| Carbine
| 5
| Cr200
| 3kg
| 1
| ranged (shotgun)
| 2D6
| P
| Yes
| 6
|-
| Rifle
| 5
| Cr200
| 4kg
| 1
| ranged (rifle)
| 3D6
| P
| Yes
| 6
|-
| Shotgun
| 5
| Cr150
| 3750g
| 1
| ranged (shotgun)
| 4D6
| P
| Yes
| 7
|-
| Submachinegun
| 5
| Cr500
| 2500g
| 0/4
| ranged (assault weapon)
| 2D6
| P
| Yes
| 4
|-
| Auto Rifle
| 6
| Cr1000
| 5kg
| 1/4
| ranged (rifle)
| 3D6
| P
| Yes
| 6
|-
| Assault Rifle
| 7
| Cr300
| 3kg
| 1/4
| ranged (assault weapon)
| 3D6
| P
| Yes
| 4
|-
| Body Pistol
| 7
| Cr500
| 250g
| 1
| ranged (pistol)
| 2D6
| P
| Yes
| 1
|-
| Laser Carbine
| 8
| Cr2500
| 5kg
| 1
| ranged (pistol)
| 4D6
| E
| No
| 2
|-
| Snub Pistol
| 8
| Cr150
| 250g
| 1
| ranged (pistol)
| 2D6
| P
| No
| 6
|-
| Accelerator Rifle
| 9
| Cr900
| 2500g
| 1/3
| ranged (rifle)
| 3D6
| P
| No
| 6
|-
| Laser Rifle
| 9
| Cr3500
| 6kg
| 1
| ranged (rifle)
| 5D6
| E
| No
| 2
|-
| Advanced Combat Rifle
| 10
| Cr1000
| 3500g
| 1/4
| ranged (rifle)
| 3D6
| P
| Yes
| 6
|-
| Gauss Rifle
| 12
| Cr1500
| 3500g
| 1/4/10
| ranged (rifle)
| 4D6
| P
| No
| 6
|-
| Laser Pistol
| 12
| Cr1000
| 1200g
| 1
| ranged (pistol)
| 4D6
| E
| No
| 2
|}



=== Table: Common Ranged Ammunition ===

{| class="wikitable"
|-
| Weapon
| TL
| Cost
| Wgt
| Rounds
|-
| Bow
| 1
| Cr1
| 25g
| 1
|-
| Crossbow
| 2
| Cr2
| 20g
| 1
|-
| Revolver
| 4
| Cr5
| 100g
| 6
|-
| Auto Pistol
| 5
| Cr10
| 250g
| 15
|-
| Body Pistol
| 7
| Cr20
| 50g
| 6
|-
| Snub Pistol
| 8
| Cr10
| 30g
| 6/15
|-
| Shotgun
| 5
| Cr10
| 750g
| 10
|-
| Rifle
| 5
| Cr20
| 500g
| 10
|-
| Carbine
| 5
| Cr10
| 125g
| 20
|-
| Auto Rifle
| 6
| Cr20
| 500g
| 20
|-
| Assault Rifle
| 7
| Cr20
| 330g
| 30
|-
| Accelerator Rifle
| 9
| Cr25
| 500g
| 15
|-
| Advanced Combat Rifle
| 10
| Cr15
| 500g
| 20
|-
| Gauss Rifle
| 12
| Cr30
| 400g
| 40
|-
| Submachinegun
| 5
| Cr20
| 500g
| 30
|-
| Laser Pistol
| 12
| Cr100
| 500g
| 25
|-
| Laser Carbine
| 8
| Cr200
| 3kg
| 50
|-
| Laser Rifle
| 9
| Cr300
| 4kg
| 100
|}


Accelerator Rifle: Designed specifically for zero-g combat, the accelerator rifle fires a specially designed round which upon leaving the barrel is accelerated by a secondary propelling charge. Normally the rifle fires bursts of three rounds per pull of the trigger, but may be adjusted to fire single rounds.

Advanced Combat Rifle (ACR): A progressive development of the assault rifle.

Assault Rifle: A lighter and less expensive version of the automatic rifle.

Automatic Rifle: A highly refined and tuned version of the rifle, capable of full automatic fire as well as semi-automatic shots. Normally, the automatic rifle fires bursts of four bullets for each pull of the trigger. It may be switched to semi-automatic fire at the end of a combat round, after all firing, in which case it is treated as a rifle until switched back to burst mode. Ammunition and magazines are identical to those used for the rifle.

Auto Pistol: Also referred to as a Semi-Automatic Pistol, Automatic Pistol or just a Pistol, the auto pistol is a basic repeating handgun. One cartridge is fired for each pull of the trigger. Auto pistol ammunition is interchangeable with submachinegun ammunition (although magazines are not). Preloaded magazines may be inserted into an empty pistol, but require a reload action to complete.

Body Pistol: A small, non-metallic semiautomatic pistol designed to evade detection by most weapon detectors. One cartridge is fired for each pull of the trigger. Pre-loaded magazines may be inserted into the pistol when it is empty, requiring a reload action to do so. Body pistol ammunition is not interchangeable with the ammunition for any other types of guns.

Bow: A stout but supple piece of wood carved to a specific shape and strung with a piece of cord, string or gut to increase tension. The string is pulled back and released to hurl an arrow long distances with surprising force. At higher technology levels, bows are modified with additional strings and pulley systems to add accuracy and power.

Carbine: A short type of rifle firing a small caliber round. A magazine containing ten rounds is inserted into the underside of the carbine ahead of the trigger guard or behind the handgrip (this configuration is referred to as “Bullpup”, and in some localities carbines may be referred to as Bullpups), and one round is fired with each pull of the trigger. Replacement of an empty magazine takes a reload action. Carbine ammunition is not interchangeable with any other type of ammunition. In essence, a carbine is a short rifle, firing a cartridge of smaller, lighter caliber. A sling usually allows the carbine to be carried on the shoulder, out of the way.

Crossbow: A horizontal bow set into a mechanical firing mechanism and stronger-than-normal pull, crossbows are very powerful weapons that are very time consuming to reload. At higher technology levels, crossbows are built with crank and pulley systems that make the weapons easier to reload, even self-loading at TL9. Reloading a TL2 crossbow takes 6 minor actions, at TL4 this is reduced to 3 minor actions.

Gauss Rifle: The ultimate development of the slug thrower, the gauss rifle generates an electromagnetic field along the length of the barrel which accelerates a bullet to high velocities. The round itself consists of a dense armor piercing core surrounded by a softer metal covering, ending in a hollow point, giving the round excellent stopping power and good armor penetration.

Laser Carbine: A lightweight version of the laser rifle, firing high energy bolts using current from a backpack battery/power pack. The laser carbine fires a 2mm beam of energy, aimed by integrated optic sights. The power pack is capable of producing 50 shots before it requires recharging. Recharging requires at least eight hours connected to a high-energy source. The laser carbine is connected to the power pack by a heavy-duty cable.

Laser Pistol: A pistol equivalent of the laser carbine, though still dependent on an external power pack.

Laser Rifle: The standard high energy weapon, firing energy bolts in the same manner as the laser carbine. Heavier, the laser rifle is also capable of longer sustained action, and is somewhat sturdier. The power pack can provide 100 shots before recharging. As in the laser carbine, the laser rifle is connected to the power pack by a heavy-duty cable. Power packs are not interchangeable between the two weapons, however.

Revolver: An early handgun, the revolver fires 9mm bullets with characteristics similar to those used by the automatic pistol  but not interchangeable with them. No magazine is used: six cartridges are inserted into the revolver individually. Reloading takes two combat rounds, or one combat round if the individual foregoes the benefit of evasion.

Rifle: The standard military arm, firing a 7mm, 10 gram bullet at a velocity of approximately 900 meters per second. Longer and heavier than a carbine, it is also more effective. Standard equipment includes provisions for attaching a bayonet and telescopic sights, and a shoulder sling. A twenty-round magazine is attached to the front of the trigger guard, and one round is fired with each pull of the trigger. Replacement of the empty magazine requires a reload action. Rifle ammunition may also be used in automatic rifles; rifle and auto rifle magazines are interchangeable, and weigh the same.

Shotgun: The basic weapon for maximum shock effect without regard to accuracy. The shotgun has an 18mm diameter barrel and fires shells containing either six 7mm bullets, or one hundred and thirty 3mm pellets. In each case, the projectiles weigh a total of 30 grams. Velocity for the projectiles is about 350 meters per second. A cylindrical magazine containing 10 shells is inserted under the barrel and parallel to it; cartridges are then fed automatically into the shotgun for firing. Reloading consists of replacing the cylindrical magazine and takes two combat rounds. One shot is fired for each pull of the trigger. Magazines measure approximately 350mm long by 20mm in diameter and are quite clumsy to carry. Shotguns are equipped with a sling for carrying.

Snub Pistol: A low velocity revolver designed for use shipboard and in zero-g environments.

Submachinegun (SMG): A small automatic weapon designed to fire pistol ammunition. Magazines holding 30 cartridges are inserted into the weapon forward of the trigger guard or in the pistol grip, depending on the design. The gun fires a burst of four rounds per pull of the trigger. Replacement of an empty magazine requires one combat round. Submachinegun ammunition (but not magazines) is interchangeable with autopistol ammunition. Most submachineguns are equipped with slings for ease of carrying. Some are small enough to be carried in a shoulder or hip holster.

Ranged Weapon Options

The following options are generally available for certain ranged weapons.

Folding Stocks: Carbines, rifles, and shotguns can be equipped with folding stocks which make it possible to reduce the overall length of the weapon by 300mm.

Grenade Launcher: An underslung RAM grenade launcher can be added to any rifle. This grenade launcher has a magazine of one grenade, cannot fire on automatic and takes four minor actions to reload.

Gyrostabilizer: Stabilizers can be added to any weapon with recoil, reducing the recoil penalty by one point (to DM-1).

Intelligent Weapon: This adds a Model/ 0 computer to any weapon. The TL 13 upgrade adds Model /1 to any weapon, for Cr5,000.

Laser Sight: Integrated optics and laser sights give an extra +1 DM bonus to any attack that has been aimed. At TL 10, x-ray lasers and improved display technology removes the tell-tale ‘red dot’ of a vislight laser. Cr200.

Laser Telescopic Sights: Electronic sights combining the capabilities of both electronic and telescopic sights. They are still rather fragile.

Secure Weapon: A secure weapon requires authentication in some fashion (scanning the user’s DNA or iris patterns, entering a password, transmission of an unlocking code from a comm) before it can be fired.

Shoulder Stocks: It is possible to produce a shoulder stock which may be attached temporarily to a pistol or revolver, resulting in a crude carbine arrangement and some greater accuracy at longer ranges. When firing a pistol or revolver equipped with such a stock, treat the weapon as ranged (shotgun). The overall length of the pistol is increased by the length of the stock, and the pistol cannot be holstered. Attaching the stock (or detaching it) requires five combat rounds.

Silencer: A silencer can be added to any slug thrower with ROF 4 or less, masking the sound produced by firing. (–4 DM to detect.)

Telescopic Sights: High-quality telescopic sights for attachment to weapons, for increasing their accuracy, especially at longer ranges. A weapon equipped with such sights gains an extra +1 DM bonus to any attack that has been aimed. Telescopic sights are delicate, however, and may be jarred out of alignment by any violent action (such as being left untended in a moving truck, a close explosion, or being dropped) on an 8+ on 2D6. When the sights go out of adjustment, the firer will always miss.


=== Table: Ranged Weapon Accessories ===

{| class="wikitable"
|-
| Accessory
| TL
| Cost
| Wgt (kg)
|-
| Shoulder Stocks
| 5
| Cr75
| 1
|-
| Folding Stocks
| 6
| Cr100
| 0.5
|-
| Telescopic Sights
| 6
| Cr200
| 0.8
|-
| Grenade Launcher
| 8
| Cr1000
| --
|-
| Laser Sights
| 8
| Cr100
| 1.5
|-
| Silencer
| 8
| Cr250
| --
|-
| Gyrostabilizer
| 9
| Cr300
| --
|-
| Laser Telescopic Sights
| 9
| Cr3000
| 1.8
|-
| Secure Weapon
| 10
| Cr100
| --
|-
| Intelligent Weapon
| 11
| Cr1000
| --
|}


Grenades

A grenade is a small explosive device designed to be thrown by hand (treat as Ranged (thrown) for Difficulty by range) or launched from a grenade launcher (treat as Ranged (shotgun) for Difficulty by range). A number of grenades are described in the Common Grenades table. Each column is described as follows:

Cost: Price in Credits (Cr) for a case of six grenades.

TL: The minimum tech level required to manufacture such an item.

Wgt: Weight per grenade in grams (g) or kilograms (kg).

Damage: The damage a weapon inflicts.

LL: The Law Level where the weapon first becomes illegal.


=== Table: Common Grenades ===

{| class="wikitable"
|-
| Weapon
| TL
| Cost per Case
| Wgt
| Damage
| LL
|-
| Frag
| 6
| 180
| 0.5
| 5D6/3D6/1D6; see description
| 1
|-
| Smoke
| 6
| 90
| 0.5
| Special; see description
| 1
|-
| Aerosol
| 9
| 90
| 0.5
| Special; see description
| 1
|-
| Stun
| 9
| 180
| 0.5
| 3D6 stun; see description
| 1
|}


Aerosol: Aerosol grenades create a fine mist six meters in radius that diffuses lasers but does not block normal vision. Any laser attack made through the mist has its damage reduced by 10. Laser communications through the mist are completely blocked. The mist dissipates in 1D6x3 rounds, although high winds and other extreme weather can sharply reduce this time.

Frag: The damage from fragmentation grenades decreases with distance from the blast:


=== Table: Frag Grenade Damage by Distance ===

{| class="wikitable"
|-
| Distance
| Damage
|-
| 3 meters
| 5D6
|-
| 6 meters
| 3D6
|-
| 9 meters
| 1D6
|}


Smoke: Smoke grenades create a thick cloud of smoke six meters in radius, centered on the location of the grenade. This smoke imposes a –2 DM on all attacks within or through the cloud (doubled for laser weapons). Smoke dissipates in 1D6x3 rounds, although high winds and other extreme weather can sharply reduce this time.

Stun: Stun weapons, such as stun grenades, are non-lethal and do not inflict normal damage. A character within six meters of a stun grenade detonation must make an Endurance check with a negative DM equal to the damage (after armor is subtracted). If this Endurance check is failed the character is knocked unconscious. If the Endurance check is successful, the character is unaffected by the weapon and the stun damage is ignored.

Heavy Weapons

Heavy weapons are man-portable and larger weapons that cause extreme property damage. Common Heavy Weapons table lists the heavy weapons commonly available in a Cepheus Engine campaign. Each column is described as follows:

Cost: Price in Credits (Cr) or 1000s of Credits (KCr).

TL: The minimum tech level required to manufacture such an item.

Wgt: Weight in grams (g) or kilograms (kg).

RoF: Rate of Fire. The number of rounds that may be fired during a significant action in the format: Single Shot / Auto

Range: The range category for this weapon.

Damage: The damage a weapon inflicts.

Recoil: Lists if the weapon has recoil when fired.

LL: The Law Level where the weapon first becomes illegal.

The Common Heavy Weapons Ammunition table describes the cost of ammunitions and power packs for certain heavy weapons. Each column is described as follows:

Cost: The cost of a full magazine of standard ammunition or power pack for a weapon

TL: The minimum tech level required to manufacture such an item.

Wgt: The weight of a full magazine or power pack for a weapon.

Rounds: The number of rounds the weapon may fire before it must be reloaded or recharged.


=== Table: Common Heavy Weapons ===

{| class="wikitable"
|-
| Weapon
| TL
| Cost
| Wgt
| RoF
| Range
| Damage
| Recoil
| LL
|-
| Grenade Launcher
| 7
| 400
| 6
| 1
| ranged (shotgun)
| By grenade
| Yes
| 3
|-
| Rocket Launcher
| 7
| 2,000
| 6
| 1
| ranged (rocket)
| 4D6
| No
| 3
|-
| RAM Grenade Launcher
| 8
| 800
| 6
| 1/3
| ranged (assault weapon)
| By grenade
| Yes
| 3
|-
| PGMP
| 12
| 20,000
| 10
| 1/4
| ranged (rifle)
| 10D6
| Yes
| 2
|-
| FGMP
| 14
| 100,000
| 12
| 1/4
| ranged (rifle)
| 16D6
| Yes
| 2
|}



=== Table: Common Heavy Weapon Ammunition ===

{| class="wikitable"
|-
| Weapon
| TL
| Cost
| Wgt
| Rounds
|-
| Grenade Launcher
| 7
| 180
| 0.5
| 6
|-
| Rocket Launcher
| 7
| 300
| 1
| 1
|-
| RAM Grenade Launcher
| 8
| 180
| 0.5
| 6
|-
| PGMP
| 12
| 2,500
| 6
| 40
|-
| FGMP
| 14
| 65,000
| 9
| 40
|}


FGMP (Fusion Gun, Man-Portable): It includes a gravity suspension system to reduce its inertia, making it easier to use than the PGMP (minimum Strength 9) and fires what amounts to a directed nuclear explosion. Those without radiation protection who are nearby when a FGMP is fired will suffer a lethal dose of radiation – each firing of an FGMP emits 2D6 x 20 rads, which will affect everyone within the immediate vicinity.

Grenade Launcher: Grenade launchers are used to fire grenades over long distances. Grenades for a grenade launcher are not interchangeable with handheld grenades.

PGMP (Plasma Gun, Man-Portable): It is so heavy and bulky that it can only be used easily by a trooper with a Strength of 12 or more – usually attained by wearing battle dress. Every point by which a user’s Strength falls short is a –1 DM on any attack rolls made with it.

RAM Grenade Launcher: Rocket Assisted Multi-purpose grenade launchers have a longer range and are capable of firing up to three grenades with a single attack. This uses the rules for firing on full auto; unlike other automatic weapons, a RAM grenade launcher cannot fire in burst mode. It takes two minor actions to reload a RAM grenade launcher. Grenades for a RAM grenade launcher are not interchangeable with handheld grenades.

Rocket Launcher: To counteract the recoil of the weapon, a rocket launcher channels exhaust backwards in an explosive back blast. Anyone up to 1.5 meters behind a rocket launcher when it fires takes 3D6 damage from the burning gasses. Vehicle-mounted rocket launchers lose this side-effect as a vehicle is a more stable firing platform than a person. It takes three minor actions to reload a rocket launcher.

The rockets presented are high-explosive models. Do not add the Effect of the attack roll to their damage but apply that damage to everything within six meters of the impact point. A rocket that misses has a 50% chance (4+ on 1D6) of detonating upon impact with the ground (6 – Effect meters away in a random direction). Otherwise it will miss completely and leave the battlefield without striking anything or detonating.

{| class="wikitable"
|-
| Software
| Description
| TL
| Rating
| BaseCost (Cr)
|-
| Security
| Access control and vulnerability patching
| TL7+
| 1-5
| 200
|-
| Intrusion
| Vulnerability detection and exploitation
| TL8+
| 1+
| 1,000+
|-
| Intelligent Interface
| Advanced user interaction
| TL8+
| 2+
| 1,000+
|-
| Agent Programs
| Comprehensive task performance
| TL8+
| 3+
| 5,000+
|-
| Expert Programs
| Skill emulation
| TL9+
| 2+
| 1,000
|-
| Translator
| Language translation and context management
| TL8+
| 1-2
| 200
|}