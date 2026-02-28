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
- [Timeline](#timeline-tentative)
- [Core Components](#core-components)
- [Generation Modes](#generation-modes)
- [Career System](#career-system)
- [Milestones & Progress](#milestones--progress)
- [Disclaimer](#disclaimer)
- [Reference Materials](#reference-materials)
- [License](#license)
- [Beginner Guide: GitHub, JS & HTML](./github_js_html_for_beginners.md)



The **Cepheus Engine Character Generator (CECG)** is a modular, data‑driven character generator for Cepheus Engine. We separate **data** (races, backgrounds, careers, equipment) from the **Rules Engine** (enlistment, survival, promotions, term loop, mustering out). Races, backgrounds, and careers are shipped as **swappable modules** so third parties can add, remove, or override content without touching code.

---

## **Timeline (Accelerated - 2 Weeks Per Stage)**

Each stage runs for **2 weeks** for rapid iteration and testing. Career implementation is modular with JSON-based career definitions that can be individually toggled.

| Stage   | Milestone                                    | Duration     | Start        | End          | Focus Area |
| ------- | -------------------------------------------- | ------------ | ------------ | ------------ |------------|
| **1.0** | **UI Foundation**                            | **2 weeks**  | Feb 28, 2026 | Mar 13, 2026 | **Tile system, focus workflow, layout toggle** |
| **1.1** | **Pre-Career: Characteristics & Details**    | **2 weeks**  | Mar 14, 2026 | Mar 27, 2026 | **Step 1: Name (datetime default), Gender toggle, 6 Stats with DMs** |
| **1.2** | **Pre-Career: Homeworld & Background**       | **2 weeks**  | Mar 28, 2026 | Apr 10, 2026 | **Step 2: Random/Select homeworld, Background skills** |
| **2.0** | **Career System: Core Engine**               | **2 weeks**  | Apr 11, 2026 | Apr 24, 2026 | **Career JSON structure, qualification, survival** |
| **2.1** | **Career System: Toggle & Settings**         | **2 weeks**  | Apr 25, 2026 | May 8, 2026  | **Career toggle UI, JSON download, Opening Settings** |
| **2.2** | **Career System: First 6 Careers**           | **2 weeks**  | May 9, 2026  | May 22, 2026 | **Aerospace Forces, Marine, Navy, Scout, Mercenary, Merchant** |
| **3.0** | **Career System: Next 6 Careers**            | **2 weeks**  | May 23, 2026 | Jun 5, 2026  | **Agent, Army, Barbarian, Belter, Colonist, Diplomat** |
| **3.1** | **Career System: Next 6 Careers**            | **2 weeks**  | Jun 6, 2026  | Jun 19, 2026 | **Drifter, Entertainer, Hunter, Marine, Maritime, Noble** |
| **3.2** | **Career System: Final 6 Careers**           | **2 weeks**  | Jun 20, 2026 | Jul 3, 2026  | **Physician, Pirate, Rogue, Scientist, Technician, Surface Forces** |
| **4.0** | **Events & Mishaps**                         | **2 weeks**  | Jul 4, 2026  | Jul 17, 2026 | **Random events during careers** |
| **4.1** | **Mustering Out**                            | **2 weeks**  | Jul 18, 2026 | Jul 31, 2026 | **Benefits, cash, equipment, ships** |
| **5.0** | **Finalization & Polish**                    | **2 weeks**  | Aug 1, 2026  | Aug 14, 2026 | **Export, import, PWA polish, testing** |

---

## **Core Components**

### **1) Character Object**

The canonical ("living") character sheet.

- **Age** (starts at 18)
- **Race** (default: "Human")
- **Background** (string)
- **Terms** (int; 1 term = 4 years)
- **Careers** (array of `{ name, terms, rank }`) – tracks career history including service length and military/civil **Rank** (e.g., Lieutenant, Captain, General)
- **Status** (string) – denotes noble or social titles derived from high SOC (e.g., Knight, Duke, King, Taipan, Patriarch)
- **Abilities** `{ Str, Dex, End, Int, Edu, Soc }` (+ optional: Psi, Wis, etc.)
- **Skills** (array like `"Gunnery-1"`)
- **Assets** (array)
- **Conditions** (array; e.g., "Wounded")

### **2) Rules Engine**

Pure logic. Executes CCC setup, background/race effects, enlistment/survival/promotion, term loop, mustering out, and finalization. **No embedded content.** Pulls from modules at runtime.

### **3) Data Modules (JSON/JS)**

- **Races Module** (e.g., `races.json`): each race defined independently; can enable/disable per build.
- **Backgrounds Module** (e.g., `backgrounds.json`): list of backgrounds with prerequisites/effects.
- **Careers Module** (e.g., `careers.json`): enlistment, survival, promotion, skills, draft, muster tables.
- **Equipment Module** (optional): item definitions for assets/muster results.

> **Modular Races:** Each race is its own record with tags, prerequisites, and effects. This lets setting authors add alien races without changing application logic.

---

## **Generation Modes**

- **Click‑to‑Generate (default):** One‑click build using current parameters; no step‑by‑step user prompts.
- **Batch Generation (optional):** Generate N characters using the same parameters.

---

## **Career System**

### **Career JSON Structure**

Each career is defined in a modular JSON format that can be individually enabled/disabled:

```json
{
  "career_id": "marine",
  "name": "Marine",
  "description": "Elite soldier trained for zero-g and planetary assault operations.",
  "enabled": true,
  "qualification": {
    "target": 6,
    "dm": { "end": 1, "str": 1 }
  },
  "survival": {
    "target": 6,
    "dm": { "end": 2 }
  },
  "advancement": {
    "target": 7,
    "dm": { "edu": 1 },
    "auto_advance_on_survival_effect": 4
  },
  "ranks": [
    { "rank": 0, "title": "Private", "bonus_skill": null },
    { "rank": 1, "title": "Lieutenant", "bonus_skill": "Leadership" },
    { "rank": 2, "title": "Captain", "bonus_skill": null },
    { "rank": 3, "title": "Force Commander", "bonus_skill": null },
    { "rank": 4, "title": "Colonel", "bonus_skill": null },
    { "rank": 5, "title": "General", "bonus_skill": null }
  ],
  "skills": {
    "personal": ["Strength", "Dexterity", "Endurance", "Intelligence", "Education", "Social Standing"],
    "service": ["Zero-G", "Vacc Suit", "Athletics", "Gun Combat", "Melee Combat", "Recon"],
    "specialist": ["Battle Dress", "Heavy Weapons", "Tactics", "Leadership", "Explosives", "Comms"],
    "advanced": ["Medic", "Survival", "Pilot", "Navigation", "Engineer", "Admin"]
  },
  "mustering": {
    "cash": [2000, 5000, 10000, 20000, 50000, 100000],
    "benefits": [
      { "type": "skill", "value": "Gun Combat" },
      { "type": "skill", "value": "Leadership" },
      { "type": "item", "value": "Armour" },
      { "type": "item", "value": "Weapon" },
      { "type": "pension", "value": "retirement_pay" }
    ]
  },
  "mishaps": [
    "Severely injured in action. Roll on Injury table.",
    "Betrayed by a commanding officer. Lose 1 SOC.",
    "Discharged for misconduct. Lose all benefits.",
    "Your unit is wiped out. You alone survive.",
    "Injured. Roll on Injury table."
  ],
  "events": [
    { "roll": 2, "event": "Disaster! Roll on Mishap table but stay in career." },
    { "roll": 3, "event": "Political upheaval renders your unit obsolete." },
    { "roll": 4, "event": "Assigned to an elite special forces unit." },
    { "roll": 5, "event": "Serve as bodyguard to a diplomat." },
    { "roll": 6, "event": "Assigned to a combat zone." },
    { "roll": 7, "event": "Life event. Roll on Life Events table." },
    { "roll": 8, "event": "Win a medal for bravery." },
    { "roll": 9, "event": "Promoted for valor." },
    { "roll": 10, "event": "Assigned to peacekeeping mission." },
    { "roll": 11, "event": "Selected for officer training." },
    { "roll": 12, "event": "Advanced training. Roll on any Skill table." }
  ]
}
```

### **Opening Settings: Career Management**

The **Opening Settings** panel provides career configuration options:

#### **Career Toggle Interface**
- **All 24 careers** listed with checkboxes
- **Enable/Disable** individual careers
- **Career groups** (Combat, Civilian, Criminal, etc.) with group toggle
- **Filter by**: Tech Level, Danger Level, Specialization
- **Search** by career name or keyword

#### **Career JSON Download**
- **Download All Careers**: Export complete `careers.json` file
- **Download Selected**: Export only enabled careers
- **Download Individual**: Export single career JSON
- **Import Careers**: Upload custom career JSON files
- **Reset to Default**: Restore original 24 careers

#### **Settings Location**
```
┌─────────────────────────────────────────┐
│ ⚙️ Opening Settings                    │
├─────────────────────────────────────────┤
│ 📁 Career Management                    │
│   [ ] Enable All  [ ] Disable All        │
│   [✓] Aerospace Forces    [✓] Marine    │
│   [✓] Navy                [✓] Scout     │
│   [✓] Mercenary           [ ] Pirate    │
│   ... (24 total)                        │
│                                         │
│ [💾 Download All Careers]               │
│ [📥 Import Custom Career]               │
│ [🔄 Reset to Default]                   │
└─────────────────────────────────────────┘
```

### **Pre-Career Steps (Before Careers Begin)**

Before entering any career, the character goes through:

#### **Step 1: Characteristics**
- **Name**: Auto-defaults to datetime (e.g., "2026-02-28-143022")
- **Gender**: Toggleable selector (Male/Female/Other/Random)
- **6 Stats**: STR, DEX, END, INT, EDU, SOC
  - Rolled with 2D6
  - DMs (modifiers) displayed: ⌊stat/3⌋-1
  - Real-time calculation
- **Validation**: No stat below 1 or above 15

#### **Step 2: Homeworld & Background**
- **Random Homeworld Toggle**: Checkbox for random selection
- **Homeworld Selection**: Choose from 16 homeworld types
- **Background Skills**: 3 + EDU modifier skills at Level 0
  - First 2 from homeworld trade codes
  - Remainder from Primary Education Skills list

---

## **Milestones & Progress**

(Track implementation with a progress column.)

| Stage   | Milestone                         | Description                                                                                                                             | Progress (%) |
| ------- | --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| **1.0** | **UI Foundation**                 | Tile system with focus workflow, Mobile/Desktop toggle, responsive layout, PWA support.                                                  | 0%           |
| **1.1** | **Pre-Career: Characteristics**     | Step 1: Name (datetime default), Gender toggle, 6 Stats with DMs, 2D6 rolling, validation.                                              | 0%           |
| **1.2** | **Pre-Career: Homeworld**         | Step 2: Random homeworld toggle, homeworld selection, background skills (3+EDU), trade code skills.                                    | 0%           |
| **2.0** | **Career System: Core Engine**    | Career JSON structure, qualification rolls, survival checks, advancement logic, term loop.                                                | 0%           |
| **2.1** | **Career System: Settings UI**    | Career toggle interface, Opening Settings panel, JSON download/import, enable/disable careers.                                           | 0%           |
| **2.2** | **Career System: First 6 Careers**| Implement: Aerospace Forces, Marine, Navy, Scout, Mercenary, Merchant.                                                                  | 0%           |
| **3.0** | **Careers 7-12**                   | Implement: Agent, Army, Barbarian, Belter, Colonist, Diplomat.                                                                            | 0%           |
| **3.1** | **Careers 13-18**                  | Implement: Drifter, Entertainer, Hunter, Maritime, Noble, Physician.                                                                    | 0%           |
| **3.2** | **Careers 19-24**                  | Implement: Pirate, Rogue, Scientist, Technician, Surface Forces, System Defense.                                                       | 0%           |
| **4.0** | **Events & Mishaps**               | Random events during careers, shared event tables, career-specific events.                                                              | 0%           |
| **4.1** | **Mustering Out**                  | Benefits rolling, cash vs. material benefits, retirement pay, equipment purchase.                                                        | 0%           |
| **5.0** | **Finalization**                   | Character export (JSON, text, PDF), batch generation, PWA polish, full testing.                                                        | 0%           |

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
  * Simplified aging roll: 2D6 + Endurance DM vs. Difficulty Terms+1. (first Aging roll is 5+1 or Difficulty 6, gets harder every term.).
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
