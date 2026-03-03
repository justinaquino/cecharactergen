# **CE CharacterGen**
## Cepheus Engine Character Generator — A Progressive Web App

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

**Status:** 🎯 M1 In Progress — UI Foundation  
**Based On:** Cepheus Engine + Mneme CE Rules  
**Inspiration:** CE ShipGen Architecture

---

## **Status**

| Milestone | Scope | Status |
|-----------|-------|--------|
| **M1: UI Layout & Foundation** | Layout, tiles, PWA setup, basic character generation (characteristics) | 🎯 Current — In Progress |
| **M2: Settings & Data Tables** | JSON + table editors, **career enable/disable**, all **15+ tables** (careers, events, mishaps, draft, anagathics, skills, equipment, races, etc.), rule toggles | ⏳ Pending |
| **M2.5: Install UX & Settings System** | FR-021 (install prompt), FR-022 (auto-save), FR-023 (security), FR-024 (snapshots), FR-025 (CI/CD) | ⏳ Pending |
| **M2.6: Installed Version Control** | FR-026 — Version management, update prompts, rollback, release channels | ⏳ Pending |
| **M3: Full Career System** | All 24 careers, aging, mustering out, equipment | ⏳ Blocked on M2.6 |
| **M4: Persistence & Export** | Character library, batch generation, JSON/Markdown/Text export | ⏳ Pending |

**Design Stance:** Non-interactive, **click-to-generate** characters (with optional pre-set parameters)  
**Development Model:** Iterative with feedback loops — milestones can iterate based on testing  
**Target:** A Game Master can generate 20 characters in 10 minutes

---

## **Overview**

### **Table of Contents**
- [Status](#status)
- [Overview](#overview)
- [Why This Structure?](#why-this-structure)
- [Definition of Done](#definition-of-done)
- [M2.6: Installed Version Control](#m26-installed-version-control-new-milestone)
- [Core Components](#core-components)
- [Development Model](#development-model-iterative-with-feedback)
- [Timeline](#timeline-accelerated---2-weeks-per-stage--1-week-review)
- [Core Components](#core-components)
- [Generation Modes](#generation-modes)
- [Career System](#career-system)
- [Character Export & Batch Generation](#character-export--batch-generation)
- [Procedural Generation](#procedural-generation)
- [Mustering Out System](#mustering-out-system)
- [Equipment & Item Database](#equipment--item-database)
- [Milestones & Progress](#milestones--progress)
- [Disclaimer](#disclaimer)
- [Reference Materials](#reference-materials)
- [License](#license)



The **Cepheus Engine Character Generator (CECG)** is a modular, data‑driven character generator for Cepheus Engine. We separate **data** (races, backgrounds, careers, equipment) from the **Rules Engine** (enlistment, survival, promotions, term loop, mustering out). Races, backgrounds, and careers are shipped as **swappable modules** so third parties can add, remove, or override content without touching code.

---

## **Why This Structure?**

This project adopts the **CE ShipGen milestone pattern** (M1 → M2 → M2.5 → M2.6 → M3 → M4) because it successfully separates:

1. **M1-M2:** Core functionality (character generation, data editing)
2. **M2.5:** Quality of life (install prompts, auto-save, CI/CD)
3. **M2.6:** Version control for installed PWAs (user controls updates)
4. **M3-M4:** Advanced features (complete careers, persistence)

**Key Insight from CE ShipGen:** Users with installed PWAs need agency over when updates apply. A broken release could disrupt an active campaign mid-session. Version rollback is essential.

---

## **M2.6: Installed Version Control (New Milestone)**

**Problem:** Users with the PWA installed locally have no control over when updates are applied. While the "Installed" badge shows the app is running standalone, users cannot:
- See which version they have installed
- Choose when to apply updates (updates apply automatically on page reload)
- Roll back to previous versions if a new version has issues
- Opt into beta/release channels for early access

**Solution:** Version control system for installed PWA instances.

**Features:**
- **Version Display** — Show current version in Settings screen with build timestamp
- **Update Prompt** — When new version available, show "Update Available" badge with changelog preview
- **Update on Demand** — User controls when to update (not forced)
- **Version History** — Keep last 3 versions cached, allow rollback if new version has issues
- **Release Channels** — "Stable" (default) / "Beta" (early access) toggle in Settings
- **Offline Version Cache** — Download new version in background, apply on next launch

**Benefits:**
- Users stay in control of their local instance
- Campaign GMs can lock to specific version for consistency
- Beta testers can opt into early releases
- Broken releases can be rolled back without re-install

---

## **Definition of Done**

### **The Ultimate Success Criteria**

> **A Game Master or Player can generate 20 characters in 10 minutes and immediately use them in a game session.**

> **A Game Master or Player can generate 20 characters in 10 minutes and immediately use them in a game session.**

### **What "Ready to Run" Means**

Each generated character must be **immediately playable** without additional preparation:

#### **✅ Speed Requirement**
- **Batch Generate:** 20 characters in ≤10 minutes
- **Single Character:** <30 seconds from click to completion
- **Performance:** No lag, no loading screens, instant results

#### **✅ Character Depth - "Just Run With This"**
Each character includes:

**1. Complete Identity**
- Full name (culturally appropriate)
- Physical description (height, weight, build, appearance)
- Gender, age, species
- Believable background story implied by career choices

**2. Complete Statistics**
- All 6 characteristics with modifiers
- Full skill list with levels
- Career history (terms, ranks, promotions)
- Aging effects, scars, injuries

**3. **🎒 Detailed Equipment (Procedurally Generated & Believable)** ⭐**

This is **critical** - characters must have **ready-to-use equipment**:

**Personal Equipment (Always Included):**
- **Clothing:** Appropriate to career and tech level (vacc suit for spacers, tactical gear for military, worn clothes for drifters)
- **Personal Weapons:** If career-appropriate (pistol for scouts, rifle for marines, knife for rogues)
- **Tools:** Career-specific (engineering kit for technicians, medical kit for physicians, navigation tools for scouts)
- **Survival Gear:** Appropriate to homeworld/career
- **Communications:** Basic comm unit (TL-appropriate)
- **Personal Items:** 2-3 procedurally generated personal items (locket, journal, lucky charm, family photo, etc.)

**Mustering Benefits (If Applicable):**
- Cash on hand (realistic amount for career/terms)
- Ship shares (if rolled)
- **Significant Equipment:** ATV for colonists, vacc suit for belters, armor for marines, medical equipment for physicians
- **Weapons:** Quality appropriate to career (military weapons for combat careers, civilian models for others)
- **Special Items:** Tools of the trade, trade goods, contact networks

**Equipment Believability Rules:**
- Equipment must make sense for the **career** (Marines don't get trade goods, Merchants don't get battle dress)
- Equipment must match **tech level** (TL9 character shouldn't have TL12 gear)
- Equipment must be **usable** - not just a list, but items with game stats
- Equipment must be **consistent** - if they have Vacc Suit skill, they should have a vacc suit

**Example - Believable Equipment Set:**
```
Drifter (3 terms, just mustered out):
- Worn civilian clothing (TL9, patched)
- Emergency vacc suit (1-hour life support, found/stolen)
- Survival knife
- Bedroll and pack
- Cr250 in mixed currency (mostly spent)
- Locket with photo (personal item)
- Cheap pistol (unreliable, 3 magazines)
- Portable comm unit (damaged, intermittent)
- Street contacts (not equipment, but resource)
```

**Example - Wrong Equipment (NOT Acceptable):**
```
Drifter (3 terms):
- Battle Dress (TL12) ❌ (Too high tech, wrong career)
- 1,000,000 Cr ❌ (Drifters don't save money)
- Starship ❌ (Not a mustering benefit for drifters)
- No vacc suit despite Belter background ❌ (Inconsistent)
```

**4. Social Connections**
- Contacts (NPCs they know)
- Allies (friends who will help)
- Enemies (rivals, problems)
- Patrons (if applicable)

**5. Complete History**
- Every dice roll shown (transparency)
- Career progression (why they have those skills)
- Events that shaped them
- Reason for adventuring (mustering out motivation)

#### **✅ GM Utility**
The GM can:
- **Print character sheets** and hand them to players
- **Use as NPCs** with zero prep
- **See at a glance:** What this character can do, what they have, who they know
- **Improvise:** Equipment list suggests story hooks ("Why do they have a stolen marine helmet?")

#### **✅ Batch Usability**
When generating 20 characters:
- **Diverse:** Mix of careers, backgrounds, skill sets
- **Balanced:** Not all combat monsters or all useless
- **Interesting:** Some have debts, some have ship shares, some have enemies
- **Instant Plot Seeds:** Equipment and contacts suggest adventures

### **Testing the Definition of Done**

**The 10-Minute Test:**
1. Open the character generator
2. Set parameters (TL9, Human, 7 careers enabled)
3. Click "Generate 20 Characters"
4. Wait for completion
5. Review all 20 character sheets

**Pass Criteria:**
- [ ] Completed in ≤10 minutes
- [ ] All 20 characters have believable equipment
- [ ] All 20 have usable skill sets
- [ ] GM could run a game with these 20 as NPCs immediately
- [ ] No character requires the GM to "fix" their equipment

**Example Scenario - "The Bar on Startown"**
The GM needs 20 patrons for a bar scene. Generates batch. Gets:
- 3 Drifters (looking for work, minimal gear)
- 2 Merchants (negotiating deals, nice clothes, comm units)
- 1 Marine (on leave, military gear, disciplined)
- 2 Scouts (explorers, vacc suits, survival gear)
- 1 Rogue (con artist, nice clothes, hidden pistol)
- 1 Belter (miner, vacc suit, zero-g tools)
- 1 Pirate (nervous, mismatched gear, stolen items)
- 1 Colonist (farmer, practical clothes, seeds/tools)
- 1 Mercenary (professional gear, weapons)
- 1 Barbarian (primitive gear, confused by high tech)
- 6 Other varied careers

**Result:** GM can immediately roleplay this bar. Each character's equipment suggests what they're doing there. No prep needed.

---

## **Development Model: Iterative with Feedback**

### **Stage → Review → Feedback → Iterate → Proceed**

This project uses an **iterative development model** where each stage includes a mandatory review and feedback period:

```
Stage N Development (2 weeks)
        ↓
Stage N Review & Internal Testing (3-5 days)
        ↓
Feedback Collection (GitHub Issues, user testing)
        ↓
┌───────────────────┐
│ Issues Found?     │
│ [Yes] → Iterate   │──→ Back to Stage N Development
│ [No]  → Proceed   │──→ Move to Stage N+1
└───────────────────┘
```

### **Key Principles**

1. **Stages Can Move Backward:** If testing reveals critical issues, we return to the previous stage rather than patching forward
2. **Feedback-Driven:** Justin and community testing determines when a stage is "done"
3. **No Stage is Immutable:** Previous stages can be reopened based on new requirements
4. **Buffer Time:** 1 week between stages for review and course correction

### **Review Checklist for Each Stage**

Before proceeding to the next stage, the following must be true:
- [ ] Feature complete according to stage definition
- [ ] Justin has tested on target devices
- [ ] No critical bugs in GitHub Issues
- [ ] Feedback from at least 2 test users (if available)
- [ ] Documentation updated in wiki

---

## **Timeline (Accelerated - 2 Weeks Per Stage + 1 Week Review)**

Each stage runs for **2 weeks** development + **3-5 days review**. The timeline shows primary flow; **arrows indicate possible iteration back to previous stages** based on feedback.

| Stage | Milestone | Duration | Focus Area | Testing Priority |
|-------|-----------|----------|------------|------------------|
| **1.0** | **UI Foundation** | 2 weeks | Tile system, focus workflow, Mobile/Desktop toggle, responsive layout | Device testing (phone/tablet/desktop) |
| **↩️ 1.R** | **UI Review** | 3-5 days | Feedback collection, bug fixes, iteration | Layout stability |
| **2.0** | **Pre-Career: Characteristics** | 2 weeks | Step 1: Name (datetime default), Gender toggle, 6 Stats with DMs | Dice roll accuracy, stat validation |
| **2.1** | **Pre-Career: Homeworld** | 2 weeks | Step 2: Random/Select homeworld, Background skills (3+EDU), trade codes | Skill calculation, homeworld logic |
| **↩️ 2.R** | **Pre-Career Review** | 3-5 days | Integration testing Steps 1-2, iteration | End-to-end pre-career flow |
| **3.0** | **Settings Page** | 2 weeks | Species toggle (Human default), TL9 default, SOC range, **Career cut-off settings**, **Term minimums** | Settings persistence, toggles |
| **3.1** | **First 7 Careers** | 2 weeks | **Drifter, Barbarian, Belter, Pirate, Rogue, Mercenary, Colonist** | Career logic, survival rolls |
| **↩️ 3.R** | **Career Review** | 3-5 days | **Test career cut-off**, **term minimums**, iteration | Career constraints working |
| **4.0** | **Character Export** | 2 weeks | Text export with full career history, all rolls, character sheet format | Export completeness |
| **4.1** | **Batch Generation & CSV** | 2 weeks | Generate N characters, CSV export with stats, careers, skills | Batch accuracy, CSV format |
| **↩️ 4.R** | **Export Review** | 3-5 days | Test exported characters match generated data | Data integrity |
| **5.0** | **Random Name Generator** | 2 weeks | **20+ cultures**, height/weight/build database, ethnicity-aware naming | Cultural accuracy |
| **5.1** | **Procedural Appearance** | 2 weeks | Generate appearance: **height, weight, build**, culture, gender, ethnicity, description | Description variety |
| **5.2** | **Integration Testing** | 2 weeks | Test name, ethnic, gender, **height/weight/build**, description with batch system | Consistency checks |
| **↩️ 5.R** | **Generator Review** | 3-5 days | Fix inconsistencies in name-appearance matching | Polish |
| **6.0** | **Mustering Out: Core** | 2 weeks | **Benefits rolling**, cash vs. material, **clear benefit rules** | Mustering calculation |
| **6.1** | **Mustering Out: Testing** | 2 weeks | **Test mustering calculations** (complex), edge cases, benefit tables | Calculation accuracy |
| **↩️ 6.R** | **Mustering Review** | 3-5 days | Verify all mustering scenarios work correctly | Rules compliance |
| **7.0** | **Item Database** | 2 weeks | **Systematize items**, wiki database, keywords (weapon, tool, armor), **Vacc Suit system**, **Lifepod system** | Item consistency |
| **7.1** | **Item Testing** | 2 weeks | Test Vacc Suit mechanics, Lifepod systems, habitat consistency | Sci-fi accuracy |
| **↩️ 7.R** | **Item Review** | 3-5 days | Verify all equipment integrates with careers | Equipment integration |
| **8.0** | **Remaining 17 Careers** | 6 weeks | Aerospace Forces, Marine, Navy, Scout, Merchant, Agent, Army, Diplomat, Entertainer, Hunter, Maritime, Noble, Physician, Scientist, Technician, Surface Forces, System Defense | Full career set |
| **8.1** | **Events & Mishaps** | 2 weeks | Random events during careers, shared event tables | Event variety |
| **9.0** | **Finalization & Polish** | 2 weeks | PWA polish, performance optimization, final testing, documentation | Release ready |

---

## **Core Components**

### **1) Character Object**

The canonical ("living") character sheet.

- **Name** (string with procedurally generated or user-specified name)
- **Age** (starts at 18)
- **Gender** (Male/Female/Other)
- **Physical Attributes** (height, weight, build — procedurally generated)
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
- **Equipment Module** (e.g., `equipment.json`): item definitions with keywords for filtering.
- **Names Module** (e.g., `names.json`): culturally-appropriate name databases by ethnicity/culture.
- **Appearance Module** (e.g., `appearance.json`): procedural description templates with height/weight/build.
- **Mustering Module** (e.g., `mustering.json`): benefit tables, cash tables, retirement calculations.

---

## **Generation Modes**

- **Click‑to‑Generate (default):** One‑click build using current parameters; no step‑by‑step user prompts.
- **Batch Generation:** Generate N characters using the same parameters. Export as CSV or individual text files.

---

## **Career System**

### **First 7 Careers: Fringe & Criminal Focus**

These careers define the gritty, dangerous edge of the Traveller universe. They are implemented first to establish the core survival/mishap mechanics:

| Career | Category | Key Mechanic | Why First |
|--------|----------|--------------|-----------|
| **Drifter** | Fringe | Automatic qualification, lose job on survival failure (not ejected) | Simplest career, tests basic survival loop |
| **Barbarian** | Fringe | Primitive tech focus, STR-based survival | Tests low-TL careers |
| **Belter** | Fringe | Zero-G skills, independent operators | Tests space-based fringe careers |
| **Pirate** | Criminal | Illegal operations, high risk/high reward | Tests criminal career mechanics |
| **Rogue** | Criminal | Social skills, deception, underworld contacts | Tests social-focused criminal careers |
| **Mercenary** | Combat | Combat-heavy, military structure without official rank | Tests combat careers before Navy/Marines |
| **Colonist** | Civilian | Settlement, agriculture, frontier survival | Tests non-combat, non-criminal careers |

#### **Why These 7 First: Establishing the Pattern**

These 7 careers serve as the **pilot implementation** to validate the Career JSON structure. Once these work correctly:

1. **The JSON pattern is proven** - We know the structure works for Drifter, Pirate, Mercenary, etc.
2. **Draft classes are tested** - The 6 draft careers (Barbarian, Belter, Colonist, Mercenary, Pirate, Rogue) all function correctly
3. **Mustering rules validated** - Benefits, cash, equipment generation works
4. **Equipment integration confirmed** - Each career gets appropriate gear

**Only then** do we build the remaining 17 careers using the **same proven JSON pattern**:

```
Stage 3.1: First 7 Careers (Pilot/Pattern Phase)
├── Drifter, Barbarian, Belter, Pirate, Rogue, Mercenary, Colonist
├── Validate JSON structure
├── Test mustering benefits
├── Confirm equipment generation
└── Pattern ESTABLISHED ✓

Stage 8.0: Remaining 17 Careers (Production Phase)
├── Aerospace Forces, Marine, Navy, Scout, Merchant, Agent, Army
├── Diplomat, Entertainer, Hunter, Maritime, Noble, Physician
├── Scientist, Technician, Surface Forces, System Defense
└── Use proven JSON pattern from Stage 3.1
```

**Draft Career Validation:**
The Mneme quick fixes change the draft table to: Barbarian, Belter, Colonist, Mercenary, Pirate, Rogue. All 6 of these draft careers are in our first 7, ensuring the draft mechanic works before building the rest.

The Opening Settings page includes career constraint controls:

```
┌─────────────────────────────────────────────────────────────┐
│ ⚙️ CAREER CONSTRAINTS                                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ CAREER CUT-OFF (Maximum Terms Allowed)                       │
│ [ ] No Cut-Off (Default)                                   │
│ [✓] Enable Cut-Off: Max [ 5 ] terms                        │
│                                                             │
│   Effect: Characters cannot serve more than 5 total terms.   │
│   Use case: Younger campaign, less experienced PCs.         │
│                                                             │
│ CAREER TERM MINIMUMS (Minimum Terms Required)               │
│ [ ] No Minimum (Default)                                   │
│ [✓] Require Minimum Terms: [ 2 ]                           │
│                                                             │
│   Effect: Characters must serve at least 2 terms before    │
│   mustering out. Use case: More experienced starting PCs.   │
│                                                             │
│ CAREER LOCK-OUT RULES                                      │
│ [ ] Allow re-entering careers (Default)                    │
│ [✓] One career only (no switching)                         │
│ [✓] No Drifters after first career                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Testing Career Constraints:**
- Generate batch of 100 characters with cut-off enabled
- Verify no character exceeds max terms
- Verify minimum terms enforced (reject characters with fewer)
- Test lock-out rules prevent illegal career combinations

---

## **Character Export & Batch Generation**

### **Character Export with Full History**

Export includes every dice roll, decision point, and calculation:

```
══════════════════════════════════════════════════════════════════
                    CHARACTER SHEET
══════════════════════════════════════════════════════════════════

Name: Zara Okafor                    Age: 34 (Born: 2092)
Gender: Female                       Species: Human
Homeworld: Agricultural (Earth-like)

PHYSICAL ATTRIBUTES
Height: 175cm (5'9")                 Weight: 68kg (150 lbs)
Build: Wiry/Lean                     

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

══════════════════════════════════════════════════════════════════
                    COMPLETE ROLL HISTORY
══════════════════════════════════════════════════════════════════

[Step 1: Characteristics Generation]
- Name generated: "Zara Okafor" (Nigerian_Yoruba culture seed: 8f3d9a2e)
- Gender: Female (random selection)
- Height generated: 175cm (base 165cm + 2D6cm roll: 10)
- Weight generated: 68kg (base 55kg + build modifier + random variation)
- Appearance generated: West African template, Drifter career modifications applied

- STR roll: 2D6 = 7
- DEX roll: 2D6 = 9  
- END roll: 2D6 = 6
- INT roll: 2D6 = 10
- EDU roll: 2D6 = 8
- SOC roll: 2D6 = 5

[Step 2: Homeworld Selection]
- Homeworld rolled: Agricultural (3D6 = 7)
- Background skills calculation: 3 + EDU DM (0) = 3 skills
- Skill 1 (homeworld): Animals-0
- Skill 2 (homeworld): Farming-0
- Skill 3 (education): Carousing-0

[Career History]

Term 1 (Age 18-22): COLONIST
  - Qualification: Automatic (first career)
  - Survival: Rolled 2D6+1=8 vs Difficulty 6+ → SUCCESS (Effect +2)
    * Calculation: 2D6 roll = 7, +1 END DM = 8
    * Difficulty: 6 (Career default)
    * Effect: 8 - 6 = +2
  - Advancement Check: Effect 4+ → PROMOTED to Rank 1 (Settler)
  - Skill Roll (Service Table): Rolled 1D6 = 3 → Animals (now Animals-1)
  - Advancement Skill: Rolled 1D6 = 5 → Survival (now Survival-1)
  - Event: Rolled 2D6 = 7 → Life Event: Made powerful contact
  - Contact generated: "Administrator Chen" (Chinese, Colonial Authority)
  - Aging: Age 22, no aging roll required

Term 2 (Age 22-26): COLONIST
  - Survival: Rolled 2D6+1=11 vs Difficulty 6+ → SUCCESS (Effect +5)
  - Advancement Check: Effect 4+ → PROMOTED to Rank 2 (Colonial Rep)
    * SOC increase: Even rank (2) → SOC +1 (now SOC 6)
  - Skill Roll (Specialist): Rolled 1D6 = 1 → Survival (now Survival-2)
  - Event: Rolled 2D6 = 9 → Recruited for colony defense militia
  - Skill gained: Melee Combat-0 (militia training)
  - Aging: Age 26, no aging roll required

Term 3 (Age 26-30): DRIFTER
  - Career Change: Colonist career ended (colony failed - Mishap)
  - Qualification: Automatic (Drifter)
  - Survival: Rolled 2D6-1=3 vs Difficulty 6+ → FAILURE (Effect -3)
    * Calculation: 2D6 roll = 4, -1 END DM = 3
    * Effect: 3 - 6 = -3
  - Mishap: Rolled 1D6 = 2 → Betrayed by fellow drifter, lost all cash
  - Result: FAILED SURVIVAL, Ejected from career
  - Injury: Scar generated (appearance modified)
  - Cash lost: All accumulated cash (Cr15,000 lost)
  - Skill gained despite failure: Streetwise-1 (learned from failure)
  - Aging: Age 30, no aging roll required

[Mustering Out]
Career: Colonist
  - Terms served: 2
  - Rank achieved: 2 (Colonial Rep)
  - Benefit rolls calculation: 2 (terms) + 1 (rank 2-3) = 3 rolls
  
  Roll 1 (Cash Table): 1D6 = 4 → Cr10,000
  Roll 2 (Benefits Table): 1D6 = 2 → Skill: Carousing
  Roll 3 (Benefits Table): 1D6 = 6 → Equipment: ATV

Career: Drifter
  - Terms served: 1 (incomplete)
  - No benefit rolls (did not complete term)
  - No retirement (Drifter has no retirement benefits per Mneme Quick Fix)

FINAL ASSETS
Cash: Cr8,500 (Cr10,000 - medical debt of Cr1,500 for scar treatment)
Equipment: ATV, Survival Gear, Basic Weapons
Ship Shares: 0
Retirement Pay: 0 (not eligible - only 3 total terms, minimum 5 for retirement)

CONTACTS & ALLIES
- Administrator Chen (Colonial Authority, owes favor)
- "Spike" Morrison (Underworld Fixer, questionable loyalty)

ENEMIES & RIVALS
- Red Jack (Drifter who betrayed Term 3)
- Colonial Revenue Service (tax investigation pending)

══════════════════════════════════════════════════════════════════
Generated: 2026-02-28 14:30:22 UTC
Seed: 8f3d9a2e1b4c
Rules Version: Mneme Quick Fixes v2.0
══════════════════════════════════════════════════════════════════
```

### **CSV Batch Generation**

```csv
Name,Gender,Age,Height_cm,Weight_kg,Build,Species,Homeworld,STR,DEX,END,INT,EDU,SOC,Careers,Terms,Skills,Cash,Equipment,Scars,Contacts
"Zara Okafor","Female",34,175,68,"Wiry","Human","Agricultural",7,9,6,10,8,6,"Colonist (2), Drifter (1)",3,"Animals-1, Survival-2...",8500,"ATV, Survival Gear","Left cheek scar","Administrator Chen, Spike Morrison"
"James Callahan","Male",42,180,85,"Heavyset","Human","Industrial",9,7,8,7,6,4,"Drifter (2), Rogue (3), Pirate (2)",7,"Streetwise-2, Melee-1...",1200,"Pistol, Knife","Missing left eye","None"
```

---

## **Procedural Generation**

### **Physical Attributes: Height, Weight, Build**

Generated based on culture, gender, career, and random variation:

```json
{
  "ethnicity": "west_african",
  "gender": "female",
  "career": "drifter",
  "age": 34,
  "physical_base": {
    "height_cm": { "min": 160, "max": 175, "mean": 165 },
    "weight_kg": { "min": 55, "max": 80, "mean": 65 },
    "build_types": ["slender", "athletic", "heavyset", "wiry"]
  },
  "modifiers": {
    "gender": { "female": -5, "male": +5, "other": 0 },
    "career": {
      "marine": { "height": 0, "weight": +5, "build_weight": "muscular" },
      "drifter": { "height": 0, "weight": -3, "build_weight": "wiry" },
      "noble": { "height": 0, "weight": +2, "build_weight": "average" }
    },
    "age": {
      "20-30": { "height": 0, "weight": 0 },
      "30-40": { "height": -0.5, "weight": +2 },
      "40-50": { "height": -1, "weight": +3 }
    }
  },
  "calculation": "Base + 2D6cm height variation + career modifiers + age modifiers"
}
```

**Sample Generation:**

```
Culture: West African, Gender: Female, Career: Drifter, Age: 34

Base Height: 165cm
+ Gender modifier: 0 (female average)
+ 2D6 roll: 10cm
+ Career (Drifter): 0
+ Age (34): -0.5cm
= Final Height: 175cm (5'9")

Base Weight: 65kg
+ Gender modifier: -2kg
+ Career (Drifter/wiry): -5kg
+ Random variation: 2D6 = 10kg
= Final Weight: 68kg (150 lbs)

Build: Wiry (career override + random selection)
```

### **Appearance Generator**

Incorporates physical stats into description:

```
Zara is a tall (175cm), wiry woman weighing 68kg with deep brown 
skin and short braided hair dyed with traditional red earth pigments. 
She has a scar across her left cheek and wears practical, weather-
beaten clothing that hangs loosely on her lean frame. Her hazel eyes 
carry the wary look of someone who's survived by their wits.
```

---

## **Mustering Out System**

### **Clear Rules for Mustering Benefits**

#### **When Can You Muster?**
1. **Voluntary:** After completing any term (age 22+)
2. **Forced:** After failing Survival roll (ejected from career)
3. **Retirement:** After 7+ terms (mandatory at 7, optional after)
4. **Career Change:** When switching to different career

#### **Benefit Roll Calculation**

```
Total Benefit Rolls = (Terms Served in Career) + (Rank Bonus)

Rank Bonus:
- Rank 1-2: +1 roll
- Rank 3-4: +2 rolls
- Rank 5-6: +3 rolls
```

#### **Cash vs. Benefits Choice**

For each roll, choose:
- **Cash Table:** Roll 1D6, get credits
- **Benefits Table:** Roll 1D6, get skill, item, or other benefit

**Cash Table Example (Colonist):**
| Roll | Cash |
|------|------|
| 1 | Cr1,000 |
| 2 | Cr5,000 |
| 3 | Cr10,000 |
| 4 | Cr20,000 |
| 5 | Cr50,000 |
| 6 | Cr100,000 |

#### **Retirement Pay Eligibility**

```
Eligible for Retirement Pay IF:
- 5+ total terms served
- Career provides retirement (not Drifter/Belter/Barbarian)
- Must roll on Cash table at least once in that career

Retirement Pay = Cr1,000 × (Terms in Career) per year
```

#### **Special Cases**

| Situation | Rule |
|-----------|------|
| **Failed Survival** | No benefit roll for that term |
| **Drifter/Belter/Barbarian** | No retirement pay ever |
| **Medical Debt** | Deduct from final cash (can go negative) |
| **Anagathics Debt** | Deduct Cr100,000 per use from final cash |
| **Criminal Careers** | May have "Heat" (legal problems) instead of benefits |

#### **Mustering Testing Checklist**

- [ ] Verify benefit roll count matches (terms + rank)
- [ ] Test cash calculations match tables
- [ ] Test benefit items populate to equipment
- [ ] Verify retirement pay only for eligible careers
- [ ] Test medical debt deduction
- [ ] Test anagathics debt deduction
- [ ] Verify failed survival = no benefit roll
- [ ] Generate 100 characters, verify no mustering errors

---

## **Equipment & Item Database**

### **Systematized Items with Keywords**

All equipment stored in wiki-based JSON database with keyword tagging:

```json
{
  "item_id": "vacc_suit_std",
  "name": "Standard Vacc Suit",
  "category": "armor",
  "keywords": ["vacc_suit", "armor", "space", "environmental", "standard"],
  "tech_level": 8,
  "cost": 10000,
  "weight_kg": 10,
  "description": "Standard vacc suit provides 8 hours of life support in vacuum.",
  "vacc_suit_system": {
    "type": "standard",
    "life_support_hours": 8,
    "armor_rating": 2,
    "mobility": "normal",
    "rad_rating": 0,
    "special_features": []
  },
  "availability": ["marine", "navy", "merchant", "scout", "belter"],
  "requires_training": true,
  "skill_required": "Vacc Suit"
}
```

### **Vacc Suit System (Mneme Detailed)**

Vacc suits are critical for consistent sci-fi habitat mechanics:

```json
{
  "vacc_suit_types": {
    "emergency": {
      "life_support_hours": 1,
      "armor": 0,
      "mobility": "impaired",
      "cost": 500,
      "use_case": "Emergency only, survival situations"
    },
    "standard": {
      "life_support_hours": 8,
      "armor": 2,
      "mobility": "normal",
      "cost": 10000,
      "use_case": "Daily operations, merchant crews"
    },
    "combat": {
      "life_support_hours": 6,
      "armor": 5,
      "mobility": "slightly_impaired",
      "cost": 30000,
      "use_case": "Military operations, marine boarding actions"
    },
    "heavy": {
      "life_support_hours": 4,
      "armor": 8,
      "mobility": "impaired",
      "cost": 75000,
      "use_case": "EVA construction, hazardous environments"
    }
  },
  "lifepod_integration": {
    "standard_suit_fits": true,
    "combat_suit_fits": false,
    "emergency_suit_fits": true,
    "lifepod_capacity": "2 suits per pod (standard size)"
  }
}
```

### **Lifepod System (Mneme)**

For consistent habitat and emergency procedures:

```json
{
  "lifepod_types": {
    "personal": {
      "capacity": 1,
      "duration_hours": 168,
      "comfort": "cramped",
      "features": ["basic_life_support", "emergency_beacon", "vacc_suit_storage:1"],
      "typical_location": "Personal quarters, small craft"
    },
    "standard": {
      "capacity": 2,
      "duration_hours": 720,
      "comfort": "basic",
      "features": ["extended_life_support", "emergency_beacon", "vacc_suit_storage:2", "basic_supplies"],
      "typical_location": "Ship corridors, work areas"
    },
    "bulk": {
      "capacity": 10,
      "duration_hours": 240,
      "comfort": "crowded",
      "features": ["basic_life_support", "emergency_beacon", "vacc_suit_storage:6", "group_supplies"],
      "typical_location": "Cargo areas, passenger sections"
    }
  },
  "occupancy_rules": {
    "suit_requirement": "Vacuum exposure requires vacc suit before entering lifepod",
    "capacity_strict": true,
    "overcrowding_penalty": "Life support duration halved per person over capacity"
  }
}
```

### **Item Keywords for Filtering**

| Keyword | Use Case |
|---------|----------|
| `weapon` | All weapons (ranged, melee, heavy) |
| `ranged_weapon` | Guns, bows, energy weapons |
| `melee_weapon` | Swords, knives, clubs |
| `armor` | All protective gear |
| `vacc_suit` | Space suits, environmental protection |
| `tool` | Technical equipment, repair kits |
| `medical` | Medkits, drugs, surgical equipment |
| `vehicle` | Ground cars, ATVs, spacecraft |
| `communication` | Radios, communicators |
| `computer` | Portable computers, data devices |
| `survival` | Wilderness gear, emergency supplies |
| `luxury` | High-end non-essential items |

### **Career-Specific Equipment**

Careers automatically grant relevant equipment based on keywords:

```javascript
// Marine mustering benefit: Weapon + Armor
if (career === 'marine' && benefitType === 'weapon') {
  return itemDatabase.filter(item => 
    item.keywords.includes('weapon') && 
    item.tech_level <= character.tech_level
  );
}

// Scout mustering: Survival gear + Vacc Suit
if (career === 'scout' && benefitType === 'equipment') {
  return itemDatabase.filter(item =>
    item.keywords.includes('survival') ||
    item.keywords.includes('vacc_suit')
  );
}
```

---

## **Milestones & Progress**

### Current Milestone: M1 — UI Foundation

**M1 Scope:**
- [ ] Responsive layout (desktop/phone toggle)
- [ ] Character sheet tile system with focus mode
- [ ] Startup screen with navigation
- [ ] Basic character generation (roll 2D6 for 6 characteristics)
- [ ] PWA manifest and service worker
- [ ] GitHub Pages deployment

**Target Completion:** March 10, 2026

---

### Milestone Roadmap

| Milestone | Key Deliverables | User Value |
|-----------|-----------------|------------|
| **M1** | UI layout, tiles, basic generation | See characters generated instantly |
| **M2** | Settings, JSON editors, all data tables | Customize careers, skills, equipment |
| **M2.5** | Install prompts, auto-save, snapshots | Install locally, save custom settings |
| **M2.6** | Version control, update prompts, rollback | Control when to update, rollback if broken |
| **M3** | All 24 careers, aging, mustering | Complete character generation |
| **M4** | Character library, batch export, persistence | Generate 20 NPCs in 10 minutes |

---

### Data Table Management (From M2)

Just like CE ShipGen's ship component tables, CECG uses JSON data tables for:

| Table | Contents | User Can |
|-------|----------|----------|
| **Core Data** |
| `races.json` | Species definitions (Human default) | Create custom races |
| `careers.json` | 24 career paths | Edit, disable/enable, add custom careers |
| **Career Simulation** |
| `events.json` | Career events (promotions, windfalls) | Modify event outcomes |
| `mishaps.json` | Career mishaps (injuries, scandals) | Adjust disaster severity |
| `draft.json` | Draft/conscription table | Edit draft targets |
| `anagathics.json` | Anti-aging drug costs & effects | Modify availability |
| **Character Components** |
| `skills.json` | All skills and categories | Modify skill definitions |
| `equipment.json` | Weapons, armor, gear | Add custom equipment |
| `benefits.json` | Mustering out rewards | Adjust cash/material benefits |
| `conditions.json` | Wounds, injuries, aging | Modify medical outcomes |
| **World & Background** |
| `homeworlds.json` | World types and background skills | Add setting-specific worlds |
| `names.json` | Name generators by culture | Add custom name lists |

**Total:** 15+ editable tables covering every aspect of character generation

**Data Management Pattern (from CE ShipGen):**
- Factory defaults shipped in `data/*.json` (read-only)
- User edits stored in localStorage (auto-save)
- Settings snapshots for named configurations
- Export/import for sharing custom content

---

## **Opening Settings: World & Character Configuration**

### **Career Constraints in Settings**

```
┌─────────────────────────────────────────────────────────────┐
│ ⚙️ Opening Settings                                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ 👤 SPECIES                                                  │
│ [✓] Human (Default)                                        │
│                                                             │
│ 🔧 TECHNOLOGY LEVEL                                        │
│ [TL9●] (Interstellar - Default)                           │
│                                                             │
│ 👑 SOCIAL STANDING                                         │
│ Min: [0] Max: [15]                                         │
│ [✓] Generate Nobles                                        │
│                                                             │
│ 💼 CAREERS                                                  │
│ [✓] Enable All (24 careers)                               │
│                                                             │
│ ⛔ CAREER CONSTRAINTS                                       │
│ Cut-Off: Max [ 7 ] terms (0 = no limit)                   │
│ Minimum: [ 0 ] terms required                             │
│ [ ] One career only (no switching)                        │
│ [ ] No Drifters after first career                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## **Disclaimer**

This character creation process uses the **Mneme Cepheus Engine (CE) Character Generation System**, which introduces **quality-of-life improvements** and **streamlined mechanics** compared to the Rules-As-Written (RAW) from the Cepheus Engine SRD.

For detailed rule text and conversion notes, refer to the **[Mneme CE Wiki: Character Generation](https://github.com/justinaquino/cecharactergen/wiki/Mneme-Cepheus-Engine-Character-Creation)** section.

## **Reference Materials**

- [Cepheus Engine SRD](https://www.drivethrurpg.com/en/product/187941/cepheus-engine-srd-modifiable-version)
- [Cepheus Engine: 6 Combat Career Cards](https://www.drivethrurpg.com/en/product/413465/cepheus-engine-6-combat-career-cards)
- [Cepheus Engine: 24 Career Cards](https://www.drivethrurpg.com/en/product/413475/cepheus-engine-24-career-cards)

---

## **License**

Planned: **OGL** or **CC BY‑SA** (to be confirmed for compatibility with Cepheus Engine SRD).
