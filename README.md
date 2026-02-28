# **CECG: A Modular Approach for Cepheus Engine**

## **Status**

- **Current Stage:** **Stage 1: UI Foundation** (In Progress)
- **Next Stage:** **Stage 2: Pre-Career Character Creation** (Characteristics, Homeworld, Background Skills)
- **Target dev start:** **February 28, 2026**
- **Design stance:** Non‑interactive, **click‑to‑generate** characters (with optional pre‑set parameters)
- **Stage Duration:** **2 weeks per stage** (accelerated timeline)

---

## **Overview**

### **Table of Contents**
- [Status](#status)
- [Overview](#overview)
- [Timeline](#timeline-accelerated---2-weeks-per-stage)
- [Core Components](#core-components)
- [Generation Modes](#generation-modes)
- [Career System](#career-system)
- [Character Export & Batch Generation](#character-export--batch-generation)
- [Procedural Generation](#procedural-generation)
- [Milestones & Progress](#milestones--progress)
- [Disclaimer](#disclaimer)
- [Reference Materials](#reference-materials)
- [License](#license)
- [Beginner Guide: GitHub, JS & HTML](./github_js_html_for_beginners.md)



The **Cepheus Engine Character Generator (CECG)** is a modular, data‑driven character generator for Cepheus Engine. We separate **data** (races, backgrounds, careers, equipment) from the **Rules Engine** (enlistment, survival, promotions, term loop, mustering out). Races, backgrounds, and careers are shipped as **swappable modules** so third parties can add, remove, or override content without touching code.

---

## **Timeline (Accelerated - 2 Weeks Per Stage)**

Each stage runs for **2 weeks** for rapid iteration and testing. Priority is given to core UI, pre-career steps, settings, and essential "fringe" careers that define the gritty Traveller universe.

| Stage | Milestone | Duration | Start | End | Focus Area |
|-------|-----------|----------|-------|-----|------------|
| **1.0** | **UI Foundation** | **2 weeks** | Feb 28, 2026 | Mar 13, 2026 | Tile system, focus workflow, Mobile/Desktop toggle, responsive layout |
| **2.0** | **Pre-Career: Characteristics** | **2 weeks** | Mar 14, 2026 | Mar 27, 2026 | Step 1: Name (datetime default), Gender toggle, 6 Stats with DMs, 2D6 rolling |
| **2.1** | **Pre-Career: Homeworld & Background** | **2 weeks** | Mar 28, 2026 | Apr 10, 2026 | Step 2: Random/Select homeworld, Background skills (3+EDU), trade codes |
| **3.0** | **Opening Settings Page** | **2 weeks** | Apr 11, 2026 | Apr 24, 2026 | Species toggle (Human default), TL9 default, SOC range, Career filters |
| **3.1** | **First 7 Careers: Fringe & Criminal** | **2 weeks** | Apr 25, 2026 | May 8, 2026 | **Drifter, Barbarian, Belter, Pirate, Rogue, Mercenary, Colonist** |
| **4.0** | **Character Export** | **2 weeks** | May 9, 2026 | May 22, 2026 | Text export with full career history, all rolls, character sheet format |
| **4.1** | **Batch Generation & CSV** | **2 weeks** | May 23, 2026 | Jun 5, 2026 | Generate N characters, CSV export with stats, careers, skills |
| **5.0** | **Random Name Generator** | **2 weeks** | Jun 6, 2026 | Jun 19, 2026 | Historical & current cultures database, ethnicity-aware naming |
| **5.1** | **Procedural Appearance** | **2 weeks** | Jun 20, 2026 | Jul 3, 2026 | Generate appearance based on culture, gender, ethnicity, description text |
| **5.2** | **Integration Testing** | **2 weeks** | Jul 4, 2026 | Jul 17, 2026 | Test name, ethnic, gender, description with batch character system |
| **6.0** | **Remaining 17 Careers** | **6 weeks** | Jul 18, 2026 | Aug 28, 2026 | Aerospace Forces, Marine, Navy, Scout, Merchant, Agent, Army, Diplomat, Entertainer, Hunter, Maritime, Noble, Physician, Scientist, Technician, Surface Forces, System Defense |
| **6.1** | **Events & Mishaps** | **2 weeks** | Aug 29, 2026 | Sep 11, 2026 | Random events during careers, shared event tables |
| **6.2** | **Mustering Out** | **2 weeks** | Sep 12, 2026 | Sep 25, 2026 | Benefits rolling, cash vs. material, retirement pay |
| **7.0** | **Finalization & Polish** | **2 weeks** | Sep 26, 2026 | Oct 9, 2026 | PWA polish, performance optimization, final testing, documentation |

---

## **Core Components**

### **1) Character Object**

The canonical ("living") character sheet.

- **Name** (string with procedurally generated or user-specified name)
- **Age** (starts at 18)
- **Gender** (Male/Female/Other)
- **Appearance** (procedurally generated description)
- **Race/Species** (default: "Human")
- **Background** (string)
- **Terms** (int; 1 term = 4 years)
- **Careers** (array of `{ name, terms, rank, history }`) – tracks career history including service length and military/civil **Rank** (e.g., Lieutenant, Captain, General)
- **Status** (string) – denotes noble or social titles derived from high SOC (e.g., Knight, Duke, King, Taipan, Patriarch)
- **Abilities** `{ Str, Dex, End, Int, Edu, Soc }` (+ optional: Psi, Wis, etc.)
- **Skills** (array like `"Gunnery-1"`)
- **Assets** (array)
- **Conditions** (array; e.g., "Wounded")
- **Roll History** (array of all dice rolls for transparency)

### **2) Rules Engine**

Pure logic. Executes CCC setup, background/race effects, enlistment/survival/promotion, term loop, mustering out, and finalization. **No embedded content.** Pulls from modules at runtime.

### **3) Data Modules (JSON/JS)**

- **Races Module** (e.g., `races.json`): each race defined independently; can enable/disable per build.
- **Backgrounds Module** (e.g., `backgrounds.json`): list of backgrounds with prerequisites/effects.
- **Careers Module** (e.g., `careers.json`): enlistment, survival, promotion, skills, draft, muster tables.
- **Equipment Module** (optional): item definitions for assets/muster results.
- **Names Module** (e.g., `names.json`): culturally-appropriate name databases by ethnicity/culture.
- **Appearance Module** (e.g., `appearance.json`): procedural description templates.

> **Modular Races:** Each race is its own record with tags, prerequisites, and effects. This lets setting authors add alien races without changing application logic.

---

## **Generation Modes**

- **Click‑to‑Generate (default):** One‑click build using current parameters; no step‑by‑step user prompts.
- **Batch Generation:** Generate N characters using the same parameters. Export as CSV or individual text files.

---

## **Career System**

### **Career JSON Structure**

Each career is defined in a modular JSON format that can be individually enabled/disabled:

```json
{
  "career_id": "drifter",
  "name": "Drifter",
  "category": "fringe",
  "description": "Wanderer surviving by odd jobs, salvage, or luck across the stars.",
  "enabled": true,
  "qualification": {
    "automatic": true,
    "target": 0,
    "dm": {}
  },
  "survival": {
    "target": 6,
    "dm": { "end": 1 },
    "failure_effect": "lose_job"
  },
  "advancement": {
    "automatic": false,
    "target": 7,
    "dm": { "int": 1 },
    "auto_advance_on_survival_effect": 4
  },
  "ranks": [
    { "rank": 0, "title": "Drifter", "bonus_skill": null },
    { "rank": 1, "title": "Streetwise", "bonus_skill": "Streetwise" },
    { "rank": 2, "title": "Scavenger", "bonus_skill": null },
    { "rank": 3, "title": "Nomad", "bonus_skill": null },
    { "rank": 4, "title": "Survivor", "bonus_skill": null },
    { "rank": 5, "title": "Wasteland Elder", "bonus_skill": null }
  ],
  "skills": {
    "personal": ["Strength", "Dexterity", "Endurance", "Intelligence", "Education", "Social Standing"],
    "service": ["Streetwise", "Survival", "Melee Combat", "Recon", "Stealth", "Athletics"],
    "specialist": ["Mechanic", "Gambler", "Bribery", "Carousing", "Deception", "Persuade"],
    "advanced": ["Pilot", "Navigation", "Engineer", "Medic", "Admin", "Leadership"]
  },
  "mustering": {
    "cash": [1000, 2000, 5000, 10000, 20000, 50000],
    "benefits": [
      { "type": "skill", "value": "Streetwise" },
      { "type": "skill", "value": "Survival" },
      { "type": "item", "value": "Basic Gear" },
      { "type": "weapon", "value": "Improvised Weapon" }
    ],
    "no_retirement": true
  },
  "mishaps": [
    "Severely injured. Roll on Injury table.",
    "Betrayed by a fellow drifter. Lose all cash.",
    "Arrested by authorities. Lose 1 SOC.",
    "Robbed by rival gang. Lose equipment.",
    "Starving and desperate. Start next term with END -1."
  ],
  "events": [
    { "roll": 2, "event": "Disaster! Roll on Mishap table but stay in career." },
    { "roll": 3, "event": "Caught in a gang war." },
    { "roll": 4, "event": "Find a valuable cache of supplies." },
    { "roll": 5, "event": "Befriend a local crime boss." },
    { "roll": 6, "event": "Survive a harsh winter." },
    { "roll": 7, "event": "Life event. Roll on Life Events table." },
    { "roll": 8, "event": "Win a high-stakes gamble." },
    { "roll": 9, "event": "Recruited for a smuggling run." },
    { "roll": 10, "event": "Make contacts in the underworld." },
    { "roll": 11, "event": "Gain respect among drifters." },
    { "roll": 12, "event": "Advanced training. Roll on any Skill table." }
  ]
}
```

### **First 7 Careers: Fringe & Criminal Focus**

These careers define the gritty, dangerous edge of the Traveller universe:

| Career | Category | Description |
|--------|----------|-------------|
| **Drifter** | Fringe | Wanderers, vagrants, survivors on the edges of society |
| **Barbarian** | Fringe | Primitive world warriors, tribal cultures |
| **Belter** | Fringe | Asteroid miners, space-based independent operators |
| **Pirate** | Criminal | Raiders, hijackers, criminals of the spaceways |
| **Rogue** | Criminal | Con artists, thieves, fixers, underworld operators |
| **Mercenary** | Combat | Guns for hire, corporate soldiers, free company troops |
| **Colonist** | Civilian | Frontier settlers, terraformers, agricultural pioneers |

**Why These First:** These careers represent the "default" Traveller experience — characters from the rough edges of civilization who take to the stars out of desperation, greed, or survival. They have the most interesting survival/mishap tables and require the least complex rank structures.

---

## **Character Export & Batch Generation**

### **Text Export with Full History**

Export a complete character as formatted text including:

```
══════════════════════════════════════════════════════════════════
                    CHARACTER SHEET
══════════════════════════════════════════════════════════════════

Name: Zara Okafor                    Age: 34 (Born: 2092)
Gender: Female                       Species: Human
Homeworld: Agricultural (Earth-like)

APPEARANCE
Zara is a tall woman with dark skin, short braided hair dyed with 
traditional red earth pigments. She has a scar across her left 
cheek and wears practical, weather-beaten clothing. Her eyes are 
hazel and carry the wary look of someone who's seen too much.

CHARACTERISTICS                    MODIFIERS
STR:  7  [+]                       DM:  0
DEX:  9  [+]                       DM: +1
END:  6  [ ]                       DM: -1
INT: 10  [+]                       DM: +1
EDU:  8  [ ]                       DM: +0
SOC:  5  [ ]                       DM: -1

SKILLS
Animals-1, Farming-0, Survival-2, Streetwise-1, Carousing-0,
Melee Combat-1, Recon-1, Pilot (Small Craft)-0

CAREER HISTORY
══════════════════════════════════════════════════════════════════

Term 1 (Age 18-22): COLONIST
  Homesteading on New Kenya Agricultural Colony
  
  Roll History:
  - Qualification: Automatic (first career)
  - Survival: Rolled 2D6+1=8 vs 6+ → SUCCESS (Effect +2)
  - Advancement: Effect 4+ → Promoted to Rank 1 (Settler)
  - Skill Roll (Service): Animals
  - Second Skill (Advancement): Survival
  - Event: Rolled 7 → Life Event: Made a powerful contact
  
  Result: Survived, Promoted to Settler, Gained Animals-0, 
          Survival-1, Contact: Local Administrator

Term 2 (Age 22-26): COLONIST
  Continuing settlement work...
  
  Roll History:
  - Survival: Rolled 2D6+1=11 vs 6+ → SUCCESS (Effect +5)
  - Advancement: Effect 4+ → Promoted to Rank 2 (Colonial Rep)
  - Skill Roll (Specialist): Survival (increased to Survival-2)
  - Event: Rolled 9 → Recruited for colony defense militia
  
  Result: Survived, Promoted to Colonial Rep, Survival-2,
          Melee Combat-0

Term 3 (Age 26-30): DRIFTER
  After colony failed, took to the spacelanes...
  
  Roll History:
  - Qualification: Automatic
  - Survival: Rolled 2D6-1=3 vs 6+ → FAILURE (Effect -3)
  - Mishap: Rolled 3 → Betrayed by fellow drifter, lost all cash
  
  Result: FAILED SURVIVAL, Injured (scar), Ejected from career,
          Lost all accumulated cash, Gained Streetwise-1

[Additional terms...]

MUSTERING OUT
══════════════════════════════════════════════════════════════════

Career Benefits:
  Colonist (3 terms, Rank 2): 3 benefit rolls
    - Roll 1: Cash Cr10,000
    - Roll 2: Skill: Carousing
    - Roll 3: Equipment: ATV

FINAL ASSETS
Cash: Cr8,500 (after medical debt)
Equipment: ATV, Survival Gear, Basic Weapons
Ship Shares: 0

CONTACTS & ALLIES
- Administrator Chen (Colonial Authority)
- "Spike" Morrison (Underworld Fixer, questionable loyalty)
- Dr. Yuki Tanaka (Ship's Surgeon, owes favor)

ENEMIES & RIVAlS
- Red Jack (Pirate who betrayed Term 3)
- Colonial Revenue Service (tax investigation pending)

══════════════════════════════════════════════════════════════════
Generated: 2026-02-28 14:30:22 UTC
Seed: 8f3d9a2e1b4c
══════════════════════════════════════════════════════════════════
```

### **CSV Batch Generation**

Generate N characters and export as CSV:

```csv
Name,Gender,Age,Species,Homeworld,STR,DEX,END,INT,EDU,SOC,Careers,Terms,Skills,Cash,Notes
"Zara Okafor","Female",34,"Human","Agricultural",7,9,6,10,8,5,"Colonist (3), Drifter (1)",4,"Animals-1, Survival-2...",8500,"Scar on cheek"
"James "Jimbo" Callahan","Male",42,"Human","Industrial",9,7,8,7,6,4,"Drifter (2), Rogue (3), Pirate (2)",7,"Streetwise-2, Melee-1...",1200,"Missing left eye"
"Wei Zhang","Other",26,"Human","High Tech",8,10,7,11,10,8,"Merchant (2)",2,"Admin-1, Broker-1...",25000,"Clean record"
```

**CSV Columns:**
- Basic Info: Name, Gender, Age, Species, Homeworld
- Stats: STR, DEX, END, INT, EDU, SOC
- Career Summary: Career list with terms, Total terms
- Skills: Comma-separated skill list
- Assets: Cash, Ship Shares, Notable Equipment
- Notes: Appearance summary, scars, notable features

**Batch Options:**
- Generate 1-1000 characters
- Filter by career type, TL, species
- Sort by various criteria
- Export as CSV or JSON

---

## **Procedural Generation**

### **Random Name Generator**

**Cultural Databases Included:**

| Culture/Ethnicity | Region | Naming Style |
|-------------------|--------|--------------|
| **English** | Western | First + Last |
| **Chinese** | East Asia | Family + Given |
| **Nigerian (Yoruba)** | West Africa | Meaning-based names |
| **Indian (Hindi)** | South Asia | Traditional + Modern |
| **Arabic** | Middle East | Given + Patronymic |
| **Japanese** | East Asia | Family + Given |
| **Russian** | Eastern Europe | Given + Patronymic + Family |
| **Spanish** | Mediterranean | First + Middle + Two Surnames |
| **Scandinavian** | Northern Europe | Old Norse influence |
| **Celtic** | British Isles | Traditional Gaelic |
| **Polynesian** | Pacific Islands | Hawaiian, Maori, Samoan |
| **Ethiopian** | Horn of Africa | Amharic naming |
| **Korean** | East Asia | Family + Given |
| **Vietnamese** | Southeast Asia | Family + Middle + Given |
| **Greek** | Mediterranean | Classical + Modern |
| **Turkish** | Central Asia/West Asia | Traditional + Modern |
| **Slavic (Polish/Czech)** | Central Europe | Traditional |
| **Indigenous (N. American)** | Americas | Tribal databases |
| **Swahili** | East Africa | Coastal Bantu |
| **Persian** | Middle East | Iranian naming |

**Name JSON Structure:**

```json
{
  "culture": "nigerian_yoruba",
  "region": "West Africa",
  "naming_convention": "meaning_based",
  "male_given": ["Adebowale", "Oluwaseun", "Ifeanyi", "Chukwuemeka", "Olumide"],
  "female_given": ["Adebola", "Oluwatosin", "Chinwe", "Ngozi", "Folake"],
  "family_names": ["Adeyemi", "Okafor", "Nwosu", "Balogun", "Eze"],
  "honorifics": ["Chief", "Elder"],
  "nicknames": ["Baba", "Nna", "Dele"],
  "generation_markers": ["Junior", "II", "III"],
  "patterns": [
    "{given}",
    "{given} {family}",
    "{nickname} {given}",
    "{given} '{nickname}' {family}"
  ]
}
```

**Generation Features:**
- Weighted by modern global population distributions
- Species-specific names (Aslan, Vargr, etc.)
- Nickname generation
- Honorifics based on SOC and career
- Gender-neutral options
- Phonetic variation within cultures

### **Procedural Appearance Generator**

Generates physical description based on:
- **Culture/Ethnicity** → Skin tone range, hair texture, typical features
- **Gender** → Body type distribution, hairstyle conventions
- **Age** → Aging markers, wrinkles, posture
- **Career** → Scars, tattoos, clothing style, physical conditioning
- **Homeworld** → Tan/pale (star type), body modifications (low/high grav)
- **Random variation** → Height, build, distinguishing marks

**Appearance JSON Templates:**

```json
{
  "ethnicity": "west_african",
  "gender": "female",
  "age_range": "30-40",
  "templates": [
    "{height} {build} {gender} with {skin_tone} skin, {hair_style}, and {eye_color} eyes. {distinguishing_feature}.",
    "A {build} figure with {skin_tone} complexion and {hair_description}. {scar_or_mark}. {clothing_style}."
  ],
  "components": {
    "height": ["tall", "average height", "short", "very tall"],
    "build": ["slender", "athletic", "heavyset", "wiry", "muscular"],
    "skin_tone": ["deep brown", "dark brown", "brown", "warm brown"],
    "hair_style": ["short braided hair", "close-cropped curls", "long dreadlocks", "shaved head with patterns"],
    "eye_color": ["dark brown", "hazel", "amber", "dark"],
    "distinguishing_feature": [
      "A scar across the left cheek",
      "Tribal markings on the temples",
      "Piercing amber eyes",
      "Weather-beaten hands"
    ],
    "scar_or_mark": [
      "Has a noticeable scar on the {body_part}",
      "Bears traditional scarification marks",
      "Missing {body_part} from an old injury"
    ],
    "clothing_style": [
      "Wears practical, weather-beaten clothing",
      "Dressed in colorful traditional fabrics",
      "Wears functional spacer gear",
      "Clad in patched and repaired armor"
    ]
  },
  "career_modifiers": {
    "marine": { "build_weight": "muscular", "scar_probability": 0.7 },
    "drifter": { "clothing": "worn", "scar_probability": 0.4 },
    "noble": { "clothing": "fine", "jewelry": true }
  }
}
```

**Sample Outputs:**

```
Gender: Female, Career: Drifter, Age: 34, Culture: West African
→ "Zara is a tall, wiry woman with deep brown skin and short braided 
   hair dyed with traditional red earth pigments. She has a scar across 
   her left cheek and wears practical, weather-beaten clothing. Her 
   eyes are hazel and carry the wary look of someone who's seen too much."

Gender: Male, Career: Marine, Age: 26, Culture: East Asian  
→ "Corporal Wei is a muscular man of average height with tan skin 
   and a close-cropped military haircut. He has a cybernetic replacement 
   for his right eye and wears a faded Marine dress uniform with visible 
   combat patches. His posture is rigid and disciplined."

Gender: Other, Career: Scientist, Age: 45, Culture: Nordic
→ "Dr. Svensson is a slender, pale person with long silver-white hair 
   tied in a practical bun. They have laugh lines around blue eyes and 
   wear a pristine lab coat over utilitarian ship's clothing. A small 
   tattoo of a molecular structure is visible on their left wrist."
```

### **Integration Testing**

**Stage 5.2: Testing Name, Ethnic, Gender, Description with Batch System**

Test scenarios:
1. **Generate 100 characters** with random cultures/genders
2. **Verify name-gender-culture consistency** (e.g., no male names for female characters)
3. **Check appearance matches culture** (skin tone appropriate to ethnicity)
4. **Validate career-description fit** (Marines should look tough, Nobles well-dressed)
5. **Edge case testing:** Mixed heritage, gender-neutral options, scarred veterans
6. **Statistical distribution:** Ensure all cultures represented fairly
7. **CSV export verification:** All fields populated correctly

**Test Output Example:**
```
Batch Test Results (n=100):
✓ Names: 98% culturally appropriate
✓ Gender match: 100%
✓ Appearance-culture fit: 96%
✓ Career-description consistency: 94%
⚠ 2 characters had mismatched scar descriptions
⚠ 2 nobles had 'worn clothing' (should be fine)
```

---

## **Milestones & Progress**

| Stage | Milestone | Description | Progress (%) |
|-------|-------------|-------------|--------------|
| **1.0** | **UI Foundation** | Tile system with focus workflow, Mobile/Desktop toggle, responsive layout, PWA support | 0% |
| **2.0** | **Pre-Career: Characteristics** | Step 1: Name (datetime default), Gender toggle, 6 Stats with DMs, 2D6 rolling | 0% |
| **2.1** | **Pre-Career: Homeworld** | Step 2: Random/Select homeworld, Background skills (3+EDU), trade codes | 0% |
| **3.0** | **Settings Page** | Species toggle, TL9 default, SOC range, Career filters, Opening Settings UI | 0% |
| **3.1** | **First 7 Careers** | Drifter, Barbarian, Belter, Pirate, Rogue, Mercenary, Colonist | 0% |
| **4.0** | **Character Export** | Text export with full career history, all rolls, character sheet format | 0% |
| **4.1** | **Batch & CSV** | Generate N characters, CSV export, batch configuration | 0% |
| **5.0** | **Name Generator** | Cultural name databases (20+ cultures), ethnicity-aware, gender options | 0% |
| **5.1** | **Appearance Generator** | Procedural descriptions based on culture/gender/career/ethnicity | 0% |
| **5.2** | **Integration Testing** | Test name/ethnic/gender/description with batch system, fix inconsistencies | 0% |
| **6.0** | **Remaining 17 Careers** | All military, civilian, service careers (17 remaining) | 0% |
| **6.1** | **Events & Mishaps** | Random events during careers, shared tables, career-specific events | 0% |
| **6.2** | **Mustering Out** | Benefits rolling, cash vs. material, retirement pay | 0% |
| **7.0** | **Finalization** | PWA polish, performance optimization, final testing, documentation | 0% |

---

## **Opening Settings: World & Character Configuration**

The **Opening Settings** panel appears when starting character generation, allowing players to configure the **default parameters** for their campaign world.

> **Purpose:** These toggles allow the generator to create characters from **more worlds and cultures** by adjusting the baseline assumptions. Default settings represent a standard interstellar civilization (TL9, Human-majority, full career spectrum).

### **Settings Categories**

```
┌─────────────────────────────────────────────────────────────┐
│ ⚙️ Opening Settings                                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 👤 SPECIES                                                  │
│ Default: Human (JSON)                                       │
│ [✓] Human        [ ] Aslan      [ ] Vargr                  │
│ [ ] Droyne       [ ] Hiver      [ ] Custom...              │
│                                                             │
│ 🔧 TECHNOLOGY LEVEL (TL)                                    │
│ Default: TL9 (Lowest Interstellar)                         │
│ [TL0] [TL1] [TL2] [TL3] [TL4] [TL5] [TL6] [TL7] [TL8]     │
│ [TL9●] [TL10] [TL11] [TL12] [TL13] [TL14] [TL15]          │
│                                                             │
│ 👑 SOCIAL STANDING (SOC) RANGE                            │
│ Min SOC: [0] ─────────────── Max SOC: [15]                │
│ [✓] Generate Nobles (SOC 10+)                             │
│                                                             │
│ 💼 CAREERS AVAILABLE                                        │
│ [✓] Enable All  [ ] Disable All  [Filter by Group ▼]      │
│                                                             │
│ Combat:        [✓] Marine    [✓] Navy     [✓] Army        │
│ Civilian:      [✓] Merchant  [✓] Scout    [✓] Diplomat   │
│ Criminal:      [ ] Pirate    [ ] Rogue    [ ] Smuggler   │
│ Fringe:        [✓] Drifter   [✓] Belter   [ ] Barbarian   │
│                                                             │
│ ─────────────────────────────────────────────────────────── │
│ [💾 Download Current Settings]  [📥 Import World Config]   │
│ [🔄 Reset to Traveller Defaults]                            │
└─────────────────────────────────────────────────────────────┘
```

### **1. Species Toggle**

**Default:** `Human` (loaded from `species/human.json`)

Each species is defined in a modular JSON file:

```json
{
  "species_id": "human",
  "name": "Human",
  "default": true,
  "enabled": true,
  "characteristics": {
    "str": { "min": 1, "max": 15, "default": 7 },
    "dex": { "min": 1, "max": 15, "default": 7 },
    "end": { "min": 1, "max": 15, "default": 7 },
    "int": { "min": 1, "max": 15, "default": 7 },
    "edu": { "min": 1, "max": 15, "default": 7 },
    "soc": { "min": 1, "max": 15, "default": 7 }
  },
  "modifiers": {
    "str": 0, "dex": 0, "end": 0,
    "int": 0, "edu": 0, "soc": 0
  },
  "traits": [],
  "skills": [],
  "homeworlds": ["any"],
  "career_restrictions": [],
  "aging": {
    "start_term": 5,
    "rate": "standard"
  }
}
```

### **2. Technology Level (TL) Toggle**

**Default:** `TL9` (Lowest interstellar civilization)

| TL | Era | Description |
|----|-----|-------------|
| **TL9** | **Interstellar** | **Jump drive** (DEFAULT) |
| TL10-11 | Advanced | Improved tech |
| TL12-15 | Frontier | Maximum tech |

### **3. Social Standing (SOC) Range**

- **Min SOC slider:** 0-10
- **Max SOC slider:** 5-18
- **Generate Nobles toggle:** Enable/disable SOC 10+ characters

### **Configuration Management**

- **Download Settings:** Export as JSON
- **Import World Config:** Load saved configurations  
- **Reset to Defaults:** Restore Traveller defaults

---

### Disclaimer

This character creation process uses the **Mneme Cepheus Engine (CE) Character Generation System**, which introduces **quality-of-life improvements** and **streamlined mechanics** compared to the Rules-As-Written (RAW) from the Cepheus Engine SRD.

These adjustments maintain compatibility with core Cepheus Engine gameplay while improving pacing, reducing redundancy, and simplifying bookkeeping.

#### Summary of Key Changes

* **Rolls Simplified:**

  * All core rolls (Qualification, Survival, Advancement) use a unified 2D6 vs. Difficulty system.
  * Separate DM modifiers per roll are replaced by a simplified modifier structure.

* **Re-Enlistment Simplified:**

  * No longer requires a separate Re-Enlistment roll.
  * Players may choose to re-enlist freely between terms, subject to story or referee approval.

* **Aging and Anagathics Streamlined:**

  * Aging begins at Term 5, with thresholds every 4 years (T5, T9, T13, etc.).
  * Simplified aging roll: 2D6 + Endurance DM vs. Difficulty Terms+1.
  * Anagathics is Simple - just spend 100KCr if Status Allowed (Can get Anagathics SOC-7 times). 

* **Drifter Career Adjustments:**

  * Drifter automatically Qualifies

For detailed rule text and conversion notes, refer to the **[Mneme CE Wiki: Character Generation](https://github.com/justinaquino/cecharactergen/wiki/Mneme-Cepheus-Engine-Character-Creation)** section.

## **Reference Materials**

- [Cepheus Engine SRD](https://www.drivethrurpg.com/en/product/187941/cepheus-engine-srd-modifiable-version)
- [Cepheus Engine: 6 Combat Career Cards](https://www.drivethrurpg.com/en/product/413465/cepheus-engine-6-combat-career-cards)
- [Cepheus Engine: 24 Career Cards](https://www.drivethrurpg.com/en/product/413475/cepheus-engine-24-career-cards)

---

## **License**

Planned: **OGL** or **CC BY‑SA** (to be confirmed for compatibility with Cepheus Engine SRD).
