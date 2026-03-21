# CE Mneme Character Generation Mechanics

## Document Purpose & Index Guide

**This document is the single source of truth for all character generation rules, constraints, and dice mechanics for the Cepheus Engine (CE) with Mneme variant rules.**

**Primary roles:**
1. Provide rule definitions for AI Agents implementing the application logic.
2. Serve as the authoritative rule reference the PRD cites by anchor (e.g., `[MECH-4.2]`).
3. Record Mneme house rules and deviations from CE RAW.

**How to use anchors:** Every section heading includes an anchor in brackets (e.g., `[MECH-4.2]`). The PRD and code comments should cite rules as `MECH-4.2` rather than repeating the rule text. When a rule conflicts between CE Standard and Mneme, the Mneme Quick Fix (Section 2) overrides CE RAW unless the active ruleset is `ce_standard`.

**Sources:**
- Cepheus Engine SRD (CE RAW) — https://wiki.gi7b.org/index.php/Mneme_CE_Chapter_1_Character_Creation
- Mneme Quick Fix Rules — https://wiki.gi7b.org/index.php/Character_Creation
- Mneme Variant Dice Mechanics — https://wiki.gi7b.org/index.php/Mneme_CE_Combat_Rules/Dice_Mechanics

---

## 1. Overview [MECH-1]

Cepheus Engine characters are rarely beginners. All characters begin at the age of majority (typically 18). Having generated characteristic scores and background skills, the character serves terms in their chosen career. Each 4-year term gives more experience (skills). At end of service, characters muster out receiving benefits, then begin adventuring.

This system generates twenty-four distinct career paths. The process is probabilistic — career outcomes (survival, advancement, aging) are determined by dice rolls with characteristic-based modifiers.

**Active Ruleset:** Set in `rules.json`. Valid values: `ce_standard` or `mneme`. Section 2 documents all divergences.

---

## 2. Rule Sources & Variants [MECH-2]

### 2.1 CE Standard (RAW) [MECH-2.1]

The baseline Cepheus Engine rules as published in the SRD. Used when `activeRuleset = "ce_standard"`.

### 2.2 Mneme Quick Fix Rules [MECH-2.2]

The Mneme system applies streamlined rules that replace CE RAW mechanics. Used when `activeRuleset = "mneme"`. These changes are **cumulative** — all apply together.

| Rule Area | CE Standard (RAW) | Mneme Quick Fix |
|-----------|-------------------|-----------------|
| **Task Resolution** | Roll 2D6 + DM vs. static 8 | Roll 2D6 + DM vs. **Variable Difficulty** |
| **Commission/Advancement** | Separate rolls for Commission and Advancement | **Survival Effect 4+ = Advancement** (no separate rolls) |
| **Re-enlistment** | Roll required; natural 12 = forced re-enlist | **Automatic success** if choosing to re-enlist; **no forced re-enlist** |
| **Anagathics** | Declare before Survival; triggers second Survival roll | **Simplified:** Spend Cr100,000 per use; no aging roll; limit = SOC−7 uses |
| **Aging** | Roll 2D6 − Terms | Use **Core Task Resolution:** 2D6 + END DM vs. (Terms + 1) Difficulty |
| **Drifter Career** | Must roll to qualify; failing loops draft/drifter | **Automatic qualification;** failing Survival = lose job (not ejected from career) |
| **Benefits** | Roll after every career change | **Track per career; roll all at mustering out** |
| **Draft Options** | Government conscription: Aerospace, Marine, Maritime, Navy, Scout, Surface Defense | **Force/drag careers:** Barbarian, Belter, Colonist, Mercenary, Pirate, Rogue |
| **Drifter/Belter/Barbarian** | Can retire normally | **No retirement** for these three careers |
| **Athlete, Entertainer, Hunter, Scout** | No advancement (auto-gain 2nd skill instead) | **All careers now have advancement** |

### 2.3 Career-Specific Quick Fixes [MECH-2.3]

| Career | CE Standard | Mneme Quick Fix |
|--------|-------------|-----------------|
| Scout | Survival END 7+ | **Survival END 6+** |
| Hunter | Survival STR 8+ | **Survival INT 6+** |
| Noble | Qualification SOC 4+, Survival SOC 4+ | **Qualification SOC 12+, Survival SOC 6+;** SOC reflects rank when advancing |

---

## 3. Core Resolution Mechanics [MECH-3]

### 3.1 Task Resolution Formula [MECH-3.1]

**CE Standard:** `2D6 + Characteristic DM + Skill ≥ 8`

**Mneme Variant:** `2D6 + Characteristic DM + Skill ≥ Difficulty`

The characteristic used depends on the task. Career rolls (qualification, survival, advancement) specify the characteristic in the career data.

### 3.2 Difficulty Table [MECH-3.2]

Used by Mneme variant only. Career rolls have fixed difficulties derived from the career data.

| Description | Difficulty | Equivalent DM |
|-------------|------------|---------------|
| Easy | 4 | +4 |
| Routine | 6 | +2 |
| Average | 8 | +0 |
| Difficult | 10 | −2 |
| Very Difficult | 12 | −4 |
| Formidable | 14 | −6 |

### 3.3 Effect [MECH-3.3]

Effect = Roll Total − Difficulty. Used in Mneme advancement rule (Effect 4+ = advancement).

### 3.4 Dice Mechanics [MECH-3.4]

#### 3.4.1 Standard Roll [MECH-3.4.1]

Roll 2D6 (two six-sided dice). Result: 2–12.

#### 3.4.2 Advantage Roll (AdvX) — Mneme Variant [MECH-3.4.2]

Roll (2+X) d6, keep the **highest 2** dice. Sum those two. Result: 2–12 (weighted high).

- `adv1` = Roll 3d6, keep highest 2
- `adv2` = Roll 4d6, keep highest 2

Used for: Low-G Human DEX (`adv1`), other species with notable characteristics.

#### 3.4.3 Disadvantage Roll (DisX) — Mneme Variant [MECH-3.4.3]

Roll (2+X) d6, keep the **lowest 2** dice. Sum those two. Result: 2–12 (weighted low).

- `dis1` = Roll 3d6, keep lowest 2
- `dis2` = Roll 4d6, keep lowest 2

Used for: Low-G Human STR (`dis1`), END (`dis1`), other species with weak characteristics.

#### 3.4.4 Modified Rolls [MECH-3.4.4]

Characteristic roll specifications such as `"2d6-1"` or `"2d6+2"` apply the modifier after rolling 2D6. Minimum result after modification is 1.

---

## 4. Characteristics [MECH-4]

### 4.1 The Six Characteristics [MECH-4.1]

All characters have six primary characteristics:

| Characteristic | Abbreviation | Description |
|----------------|-------------|-------------|
| Strength | STR | Physical strength, fitness, forcefulness |
| Dexterity | DEX | Coordination, agility, reflexes |
| Endurance | END | Stamina, damage sustaining ability |
| Intelligence | INT | Intellect, quickness of mind |
| Education | EDU | Learning, experience, academic knowledge |
| Social Standing | SOC | Place in society; economic and political influence |

**Physical characteristics:** STR, DEX, END. Affected by injuries and aging.
**Mental characteristics:** INT, EDU, SOC. Rarely affected except by mental trauma.

**Limits:** Player characters: characteristic score may not exceed 15, nor drop permanently below 1 (except under special circumstances).

**Initial Generation:** Roll 2D6 per characteristic, in order STR→DEX→END→INT→EDU→SOC. Some species use advantage/disadvantage rolls (see MECH-4.5).

**Optional:** With Referee approval, roll 2D6 six times and assign results to characteristics based on character concept.

### 4.2 Characteristic Modifier (DM) [MECH-4.2]

Formula: `DM = floor(value / 3) − 2`

This means an average characteristic score of 7 has DM+0.

| Score Range | Pseudo-Hex | Modifier |
|-------------|-----------|---------|
| 0–2 | 0–2 | −2 |
| 3–5 | 3–5 | −1 |
| 6–8 | 6–8 | +0 |
| 9–11 | 9–B | +1 |
| 12–14 | C–E | +2 |
| 15–17 | F–H | +3 |
| 18–20 | J–L | +4 |
| 21–23 | M–P | +5 |
| 24–26 | Q–S | +6 |
| 27–29 | T–V | +7 |
| 30–32 | W–Y | +8 |
| 33+ | Z | +9 |

*Note: Scores above 15 are rare during character creation; the extended table supports alien species and special traits.*

### 4.3 Universal Persona Profile (UPP) [MECH-4.3]

The UPP is a compact six-digit (seven for psionic) string representing characteristic scores in pseudo-hexadecimal order: STR–DEX–END–INT–EDU–SOC (–PSI).

**Pseudo-hex encoding:** 0–9 are as normal; 10=A, 11=B, 12=C, 13=D, 14=E, 15=F, etc.

**Example:** STR 6, DEX 8, END 7, INT 11, EDU 9, SOC 12 → UPP: `687B9C`
If PSI 4: `687B9C-4`

**Universal Character Format:**
```
[Name, rank/title if any] [UPP] Age [Age]
[Career(s), terms in parentheses] Cr[funds]
[Skill list alphabetically with levels]
[Species traits if non-human]
[Significant equipment]
```

### 4.4 Psionic Strength [MECH-4.4]

PSI is a seventh characteristic, only present if the character learns psionics (Referee permission required). PSI cannot be rolled or bought during character creation without Referee approval. See Chapter 3: Psionics for full rules.

PSI generation (when permitted): `2D6 − terms served`.

### 4.5 Species Characteristic Roll Specifications [MECH-4.5]

Each species defines roll specifications per characteristic. Standard notation:

| Notation | Meaning |
|----------|---------|
| `2d6` | Roll 2D6 normally |
| `adv1` | Roll 3d6, keep highest 2 (MECH-3.4.2) |
| `dis1` | Roll 3d6, keep lowest 2 (MECH-3.4.3) |
| `2d6-1` | Roll 2D6, subtract 1 |
| `2d6+2` | Roll 2D6, add 2 |

**Terrestrial Human** (standard):
- All characteristics: `2d6`

**Low-G Human** (Mneme variant, requires `toggles.lowGHuman = true`):
- STR: `dis1`, DEX: `adv1`, END: `dis1`
- INT: `2d6`, EDU: `2d6`, SOC: `2d6-1`
- Special: Move −1 in 0.7G+ environments; half effective weight

Full species data is defined in `species.json` (see DATA_ARCHITECTURE.md §DA-3.1).

### 4.6 Alien Species Traits [MECH-4.6]

Species may possess traits that modify generation rules. The following traits are defined in the system:

| Trait | Effect |
|-------|--------|
| **Amphibious** | Can breathe underwater; DEX halved on land |
| **Anti-Psionic** | PSI always 0; immune to psionic effects; cannot have Psionic trait |
| **Aquatic** | Can breathe underwater; cannot operate out of water without aid (unless also Amphibious) |
| **Armored** | 1 point natural armor |
| **Atmospheric Requirements** | Requires unusual atmosphere; needs artificial aid in most environments |
| **Bad First Impression** | Most races start Unfriendly; overcomes after brief interaction |
| **Caste** | Replaces Social Standing with Caste; social DMs (+ or −) halved when dealing with SOC-using races |
| **Cold-Blooded** | DM−2 initiative in extreme cold; 1D6 damage per 10 minutes exposure |
| **Engineered** | Medical treatment by facility below creation TL receives negative DM equal to difference |
| **Fast Metabolism** | Life support doubled; +2 initiative in combat; END halved for fatigue |
| **Feral** | Roll EDU on 1D6 only |
| **Flyer** | Can fly; must spend minor action per round on movement while aloft |
| **Great Leaper** | Athletics 0; can jump extra squares per Athletics check Effect |
| **Half Weight** | Effective carry weight halved (Low-G Human trait) |
| **Heat Endurance** | No damage from hot weather exposure |
| **Heavy Gravity Adaptation** | No acclimatization needed in high-G environments |
| **Hive Mentality** | Must make INT check to avoid self-risk when group benefit is involved |
| **Large** | STR/END 3d6 or 4d6; DEX 1d6; life support doubled |
| **Low Gravity Adaptation** | No acclimatization needed in low-G environments |
| **Low-Light Vision** | Sees twice as far in poor light; retains color/detail |
| **Natural Pilot** | DM+2 to Piloting and Navigation checks |
| **Natural Swimmer** | DM+2 to swimming-related checks |
| **Natural Weapon** | Has claw/bite/stinger; +1 damage; Natural Weapons 0 |
| **Naturally Curious** | Must make INT check to avoid acting on curiosity |
| **No Fine Manipulators** | Cannot easily pick up objects or press small controls |
| **Notable (Characteristic)** | +2 DM when rolling that characteristic; racial maximum +2 |
| **Psionic** | All members are psionic; determine PSI at start of generation |
| **Slow Speed** | Movement rate reduced |
| **Small** | STR/END 1D6; DEX 3D6 |
| **Weak (Characteristic)** | −2 DM (or other specified penalty) when rolling that characteristic; racial maximum −2 |
| **Water Dependent** | Must immerse regularly; risks dehydration without water access |

### 4.7 Social Standing & Noble Titles [MECH-4.7]

In universes where nobles exist, SOC values correspond to titles. Noble titles represent economic scale, not just social rank.

**CE Standard Titles (SOC 10–15):**

| SOC | Title |
|-----|-------|
| 1–9 | No title |
| 10 | Lord/Lady |
| 11 | Knight/Dame |
| 12 | Baron/Baroness |
| 13 | Marquis/Marquessa |
| 14 | Count/Countess |
| 15 | Duke/Duchess |

**Mneme Extended SOC Scale** (for settings with higher SOC ceilings):
Each SOC point above 9 roughly doubles annual resource flow. Formula: `Income ≈ Base × 2^(SOC − 10)`.

**Alien Social Standing:** Some species use Caste or Charisma instead of SOC. When dealing across such a divide, all SOC DMs (positive or negative) are halved.

---

## 5. Background Skills [MECH-5]

### 5.1 Background Skill Allotment [MECH-5.1]

Before careers begin, characters receive background skills at Level 0. Total skills = `3 + EDU DM` (minimum 1, maximum 5 with EDU 14+).

- First two skills must come from the Homeworld Skills list (MECH-5.2), chosen based on homeworld trade codes or law level.
- Remaining skills come from Primary Education (MECH-5.3).

### 5.2 Homeworld Skills by Description & Trade Code [MECH-5.2]

**By Law Level:**

| Law Level | Skill |
|-----------|-------|
| No Law | Gun Combat-0 |
| Low Law | Gun Combat-0 |
| Medium Law | Gun Combat-0 |
| High Law | Melee Combat-0 |

**By Trade Code:**

| Trade Code | Skill |
|------------|-------|
| Agricultural | Animals-0 |
| Asteroid | Zero-G-0 |
| Desert | Survival-0 |
| Fluid Oceans | Watercraft-0 |
| Garden | Animals-0 |
| High Technology | Computer-0 |
| High Population | Streetwise-0 |
| Ice-Capped | Zero-G-0 |
| Industrial | Broker-0 |
| Low Technology | Survival-0 |
| Poor | Animals-0 |
| Rich | Carousing-0 |
| Water World | Watercraft-0 |
| Vacuum | Zero-G-0 |

### 5.3 Primary Education Skills [MECH-5.3]

Any character may choose from this list for remaining background skill slots:

Admin-0, Advocate-0, Animals-0, Carousing-0, Comms-0, Computer-0, Electronics-0, Engineering-0, Life Sciences-0, Linguistics-0, Mechanics-0, Medicine-0, Physical Sciences-0, Social Sciences-0, Space Sciences-0.

---

## 6. Careers [MECH-6]

### 6.1 The Twenty-Four Careers [MECH-6.1]

| Career | Category | Description |
|--------|----------|-------------|
| Aerospace System Defense | Military | Planetary air force — operates in atmosphere and close orbit |
| Agent | Intelligence | Spy or intelligence operative, collects/reports on enemies |
| Athlete | Civilian | Celebrity athlete, proficiency in sports |
| Barbarian | Frontier | Individual from primitive world (TL4 or less) |
| Belter | Frontier | Explores asteroid belts for mineral/salvage profit |
| Bureaucrat | Government | Official in government department, follows administrative process |
| Colonist | Civilian | Moves to or settles in a new planetary colony |
| Diplomat | Government | Conducts official negotiations between polities |
| Drifter | Civilian | No fixed home or job; always open as fallback career |
| Entertainer | Civilian | Celebrity entertainer |
| Hunter | Civilian | Kills/traps large game for meat, trophy, or sport |
| Marine | Military | Interstellar armed forces, carried aboard starships |
| Maritime System Defense | Military | Planetary wet navy — operates on world oceans |
| Mercenary | Military | Professional soldier hired for specific actions |
| Merchant | Civilian | Interstellar wholesale trade |
| Navy | Military | Interplanetary/interstellar military, space navy |
| Noble | Elite | Aristocracy, high social/political status |
| Physician | Professional | Skilled in medicine, trained and licensed to treat patients |
| Pirate | Criminal | Attacks and steals from space ships |
| Rogue | Criminal | Makes living through illicit means |
| Scientist | Professional | Expert in biological or physical science |
| Scout | Exploration | Interplanetary exploratory service, surveys unfamiliar space |
| Surface System Defense | Military | Planetary army — operates on non-hydrographic surface |
| Technician | Professional | Skilled in mechanical/industrial/technical fields |

**Note on data:** Career qualifications, survival targets, advancement targets, skill tables, rank titles, and benefit tables are stored in `careers.json` (see DATA_ARCHITECTURE.md §DA-3.7). This section defines the mechanics that apply to all careers uniformly.

### 6.2 Qualifying & the Draft [MECH-6.2]

The Qualification check determines if the character can enter their chosen career. Military careers call this "Enlistment."

- On failure: must submit to the **Draft** or take the Drifter career for that term.
- **DM penalty:** −2 per previous career entered.
- A career cannot be re-entered once left, **except:** Drifter is always available; Draft can reassign a previously-held career.
- **Mneme exception:** Drifter is auto-qualify; no roll needed.

**CE Standard Draft Table** (roll 1D6):

| Roll | Career |
|------|--------|
| 1 | Aerospace System Defense |
| 2 | Marine |
| 3 | Maritime System Defense |
| 4 | Navy |
| 5 | Scout |
| 6 | Surface System Defense |

**Mneme Draft Table** (force/drag careers — fringe not military):

| Roll | Career |
|------|--------|
| 1 | Barbarian |
| 2 | Belter |
| 3 | Colonist |
| 4 | Mercenary |
| 5 | Pirate |
| 6 | Rogue |

The draft may be entered only once.

### 6.3 Terms of Service [MECH-6.3]

Each career term = approximately 4 years. Character age increases by 4 per term. Maximum character creation terms: 7 total (CE RAW). No maximum in Mneme (Referee option).

A character with 7+ total terms must retire (CE RAW only; Mneme has no forced retirement except by choice).

### 6.4 Basic Training [MECH-6.4]

- **First career, first term:** Gain all skills in the Service Skills table at Level 0.
- **Subsequent careers, first term:** Pick any one skill from the Service Skills table at Level 0.

### 6.5 Survival [MECH-6.5]

Each term requires a survival roll. Format: `Characteristic N+` (e.g., END 6+).

**CE Standard failure:** Character is dead. Optionally (Referee approval): roll on Survival Mishaps table instead; lose this term's benefit roll; forced out of career after half a term (2 years).

**Mneme Drifter exception:** Failing survival = loses job but is not ejected. May re-enter Drifter next term.

A natural 2 is always a failure.

**Survival Mishaps Table** (roll 1D6):

| Roll | Mishap |
|------|--------|
| 1 | Injured in action. Roll twice on Injury table (MECH-7.1); take lower result. |
| 2 | Honorably discharged from service. |
| 3 | Honorably discharged after long legal battle. Legal debt of Cr10,000. |
| 4 | Dishonorably discharged. Lose all benefits. |
| 5 | Dishonorably discharged after 4 years in prison for a crime. Lose all benefits. |
| 6 | Medically discharged. Roll on Injury table (MECH-7.1). |

### 6.6 Commission & Advancement [MECH-6.6]

**Commission:** Opportunity to join the commissioned officer ranks (military) or gain a position in the career hierarchy (civilian). On success: become Rank 1, gain one extra skill roll. Attempt once per term, optional. Draftees cannot attempt Commission in their first term.

**Advancement:** If Rank 1+, may attempt once per term. On success: increase rank by 1, gain one extra skill roll, gain rank bonus skills. Can attempt in same term as Commission.

**Careers without Commission or Advancement (CE Standard):**
Athlete, Barbarian, Belter, Drifter, Entertainer, Hunter, Scout.
These careers give **two skill rolls per term** instead.

**Mneme change:** All careers now have advancement (MECH-2.2). Advancement is determined by Survival Effect 4+, not a separate roll.

### 6.7 Skills & Training [MECH-6.7]

Each career has four skill tables: Personal Development, Service Skills, Specialist Skills, Advanced Education.

Per term: pick one table, roll 1D6 to determine which skill you gain.

- **Advanced Education** requires EDU 8+ to roll on.
- If you gain a skill you don't have: gain it at Level 1.
- If you already have the skill: increase by 1.
- If you gain a characteristic improvement: apply immediately.
- Careers without Commission/Advancement: roll twice per term (CE Standard only; in Mneme all careers advance so this is moot).

#### Cascade Skills [MECH-6.7.1]

Cascade skills have specializations. When gaining a cascade skill, immediately choose a specialization. All other specializations of that cascade skill default to Level 0. A character may hold multiple specializations at different levels (e.g., Melee Combat: Natural Weapons-2 and Melee Combat: Slashing Weapons-1).

### 6.8 Re-enlistment & Retirement [MECH-6.8]

At end of each term, character decides to re-enlist or muster out.

**CE Standard:** Must make a re-enlistment roll. Failure = must leave. Natural 12 = cannot leave (forced another term). Seven total terms = must retire.

**Mneme:** Re-enlistment is automatic if the character chooses to continue. No forced re-enlistment on natural 12.

**Retirement:** A character with 5+ terms in a single career receives an annual pension (see MECH-9.4).

**Drifter/Belter/Barbarian (Mneme):** No retirement pension for these three careers.

---

## 7. Injuries & Medical Care [MECH-7]

### 7.1 Injury Table [MECH-7.1]

Roll 1D6 when a character is wounded in combat or accidents during character creation:

| Roll | Injury |
|------|--------|
| 1 | **Nearly killed.** Reduce one physical characteristic by 1D6; reduce both other physical characteristics by 2 (or one of them by 4). |
| 2 | **Severely injured.** Reduce one physical characteristic by 1D6. |
| 3 | **Missing eye or limb.** Reduce STR or DEX by 2. |
| 4 | **Scarred.** Reduce any one physical characteristic by 2. |
| 5 | **Injured.** Reduce any physical characteristic by 1. |
| 6 | **Lightly injured.** No permanent effect. |

### 7.2 Injury Crisis [MECH-7.2]

If any characteristic is reduced to 0 by injury: character dies unless they can pay 1D6×10,000 Credits for emergency medical care (restores any reduced characteristics to 1). After an injury crisis, the character automatically fails all future Qualification checks — must remain in current career or become a Drifter.

### 7.3 Medical Bills [MECH-7.3]

If injured while in service, the career patron may cover a portion of medical care. Roll 2D6, add Rank as DM. Result determines what percentage the employer covers:

| Career Group | Roll 4+ | Roll 8+ | Roll 12+ |
|-------------|---------|---------|---------|
| Aerospace System Defense, Marine, Maritime System Defense, Navy, Scout, Surface System Defense | 75% | 100% | 100% |
| Agent, Athlete, Bureaucrat, Diplomat, Entertainer, Hunter, Mercenary, Merchant, Noble, Physician, Pirate, Scientist, Technician | 50% | 75% | 100% |
| Barbarian, Belter, Colonist, Drifter, Rogue | 0% | 50% | 75% |

Restoration of a lost characteristic point costs Cr5,000 per point.

### 7.4 Medical Debt [MECH-7.4]

Any outstanding costs from medical care or anagathic drugs are paid out of mustering-out Benefits before anything else. If the character cannot pay, they go into debt.

---

## 8. Aging & Anagathics [MECH-8]

### 8.1 Aging (CE Standard) [MECH-8.1]

Aging begins when a character reaches age 34 (end of Term 4). At end of Term 4 and every term thereafter, roll 2D6 on the Aging Table. Apply **total terms served as a negative DM**.

**CE Standard Aging Table:**

| 2D6 (modified) | Effects |
|----------------|---------|
| −6 or less | Reduce three physical characteristics by 2; reduce one mental characteristic by 1 |
| −5 | Reduce three physical characteristics by 2 |
| −4 | Reduce two physical characteristics by 2; reduce one physical characteristic by 1 |
| −3 | Reduce one physical characteristic by 2; reduce two physical characteristics by 1 |
| −2 | Reduce three physical characteristics by 1 |
| −1 | Reduce two physical characteristics by 1 |
| 0 | Reduce one physical characteristic by 1 |
| 1+ | No effect |

*Example: Term 6, roll 2D6 = 9, apply −6 DM (terms), result = 3. Result row is −3: reduce one physical by 2, two physical by 1.*

### 8.2 Aging (Mneme Variant) [MECH-8.2]

Uses Core Task Resolution (MECH-3.1): `2D6 + END DM vs. (Terms + 1)`.

- Aging starts at Term 5 (age 38), not Term 4.
- Difficulty = current term count + 1.
- On failure: reduce one physical characteristic by 1 (Referee discretion on which).
- The increasing difficulty captures the same progressive aging effect as CE's negative DM.

### 8.3 Aging Crisis [MECH-8.3]

If any characteristic is reduced to 0 by aging: character dies unless they can pay 1D6×10,000 Credits for emergency medical care (restores characteristics to 1). After an aging crisis, the character automatically fails all Qualification checks.

### 8.4 Anagathics (CE Standard) [MECH-8.4]

Anti-aging drugs that prevent characteristic loss from aging.

**Usage:** Must be declared before the Survival roll for that term.

**Effect while using:** Add terms since anagathics started as a **positive DM** to aging rolls (effectively delays the aging threshold rather than bypassing it).

**Second Survival check:** In any term anagathics are used, if the character passes their first Survival check, they must make a **second Survival check**. If either Survival check fails, the character suffers a mishap and is ejected from the career.

**Stopping anagathics:** If a character stops, roll on the Aging table immediately to simulate the shock of resumed aging (no positive DM from the drugs).

**Cost:** 1D6×2,500 Credits per term used. Paid from mustering-out cash. If cannot pay, character goes into debt.

### 8.5 Anagathics (Mneme Simplified) [MECH-8.5]

**Effect:** If the character spends Cr100,000 for a term, they skip the aging roll entirely for that term. No second Survival check required.

**Limit:** Maximum uses = SOC − 7 (minimum 1). A character with SOC 7 gets 1 use lifetime; SOC 10 gets 3 uses; etc.

**Availability:** Starport A or Starport B only.

**Cost:** Flat Cr100,000 per term. Paid from mustering-out Benefits before other expenses.

---

## 9. Mustering Out & Benefits [MECH-9]

### 9.1 Benefit Roll Calculation [MECH-9.1]

When leaving a career (or at end of all careers in Mneme), a character receives benefit rolls:

**Base:** 1 benefit roll per full term served (terms in which benefits were not lost due to mishap).

**Rank bonuses:**
- Rank 1–2: +1 roll
- Rank 3–4: +2 rolls
- Rank 5–6: +3 rolls

**Mneme:** Track benefit rolls per career; roll all at final mustering out.

### 9.2 Cash Benefits [MECH-9.2]

Maximum 3 rolls on the Cash table (across all careers combined).

**Bonus on Cash rolls:**
- +1 DM if character has Gambling skill.
- +1 DM if character has retired (5+ terms in one career).

Each career's cash table lists amounts for roll results 1–7 (1D6 roll, or 1D6+1 with DM).

### 9.3 Material Benefits [MECH-9.3]

All non-cash benefit rolls use the Material table. Possible results include:

- Characteristic improvements (+1 STR, +1 INT, etc.)
- Passages (Low, Mid, or High)
- Ship Shares (worth ~Cr2,000,000 each toward ship purchase)
- Weapons (subsequent weapon results can be taken as skill instead)
- Armour
- TAS/Explorers' Society membership (once only)
- Courier Vessel (Scout career: 100-ton TL9, on detached duty basis)
- Research Vessel (Scientist: 200-ton TL9, patron-owned)

**Rank bonus:** Characters of Rank 5–6 gain +1 DM on Material rolls.

### 9.4 Retirement Pay [MECH-9.4]

A character who has served 5+ terms **in a single career** receives an annual pension:

| Terms in Single Career | Annual Pay |
|----------------------|-----------|
| 5 | Cr10,000 |
| 6 | Cr12,000 |
| 7 | Cr14,000 |
| 8 | Cr16,000 |
| 9+ | Cr16,000 + Cr2,000 per term beyond 8 |

**Mneme exception:** Drifter, Belter, and Barbarian careers do not qualify for retirement pay.

---

## 10. Final Details [MECH-10]

After all career terms and mustering out, complete the character with:

- **Name:** Choose or generate based on culture/species (see `cultures_names.json`).
- **Gender:** Player choice; some species have non-binary or multi-gender options.
- **Appearance:** Height, weight, hair, notable features (narrative, no mechanical effect).
- **Connections:** Allies, contacts, and enemies gained from career events.
- **Personal Goals:** Long-term goals that inform character motivation.
- **Age:** Starting age 18 + (4 × total terms). Add 4 years if Pre-Career Education taken.

---

## 11. Character Generation Flow [MECH-11]

This section is the canonical algorithm for character generation. Each step references the mechanics section above. UI layout decisions are **not** part of this specification.

### 11.1 Flow Overview [MECH-11.1]

```
Step 1:  Species Selection
Step 2:  Roll Characteristics      → MECH-4.1, MECH-4.5
Step 3:  Homeworld & Background    → MECH-5
Step 4:  Pre-Career Education (optional)
Step 5:  Career Terms (loop)       → MECH-6
  Step 5a: Mishap Handling         → MECH-6.5, MECH-7
  Step 5b: Medical Bills           → MECH-7.3
  Step 5c: Aging (per term)        → MECH-8
Step 6:  Mustering Out             → MECH-9
Step 7:  Final Details             → MECH-10
```

### 11.2 Step 1: Species Selection [MECH-11.2]

Select species from the active `species.json` table. Species determines characteristic roll specifications (MECH-4.5) and starting traits.

Enabled species are determined by `rules.json` toggles (e.g., `toggles.lowGHuman`). Default: Terrestrial Human only.

**Output:** Species ID with characteristic roll specs.

### 11.3 Step 2: Roll Characteristics [MECH-11.3]

For each of the six characteristics, apply the species roll specification (MECH-4.5):
1. Roll per specification (2d6, adv1, dis1, 2d6-1, etc.) using mechanisms in MECH-3.4.
2. Apply minimum of 1 to each result.
3. Calculate DM for each using MECH-4.2.
4. Record UPP string (MECH-4.3).

**Output:** Six characteristic values, six DMs, UPP string.

### 11.4 Step 3: Homeworld & Background [MECH-11.4]

1. Select homeworld type from `homeworlds.json` (or random).
2. Determine background skill allotment: `3 + EDU DM` (MECH-5.1).
3. First two background skills from Homeworld Skills (MECH-5.2) matching homeworld trade codes/law level.
4. Remaining skills from Primary Education list (MECH-5.3).
5. Apply species background restrictions if any (e.g., Low-G Human: space backgrounds only).

**Output:** Homeworld, background skills at Level 0.

### 11.5 Step 4: Pre-Career Education (Optional) [MECH-11.5]

Optional 4-year pre-career period (does not count as a career term but adds 4 years to age):
- **University:** Requires EDU 8+. Grants degree-related skills.
- **Military Academy:** Requires specific characteristics. Grants commission and career entry.
- **Skip:** Proceed directly to careers.

**Output:** Optional skills, age +4 if taken.

### 11.6 Step 5: Career Terms Loop [MECH-11.6]

Repeat for each term until the character mustera out, dies, or reaches term limit:

```
FOR each term:

  A. Career Selection
     - First term: Attempt Qualification (MECH-6.2)
     - Subsequent terms: Re-enlist (MECH-6.8) or attempt new career

  B. Qualification Roll (if entering new career)
     - Use career qualification target and characteristic DM from careers.json
     - Apply −2 DM per previous career already served
     - On failure: go to Draft (MECH-6.2) or enter Drifter
     - Mneme: Drifter is auto-qualify

  C. Basic Training (first term of this career only)
     - First career ever: all Service Skills at Level 0 (MECH-6.4)
     - Subsequent careers: choose one Service Skill at Level 0

  D. Survival Roll
     - Use career survival target and characteristic DM from careers.json
     - On failure: go to Step 5a (Mishap)
     - Natural 2 always fails
     - Mneme Drifter: failure = lose job, not ejected

  E. Event Roll (optional)
     - Roll 2D6 on career event table; apply event result

  F. Commission Roll (CE, if career has it, character is Rank 0, optional)
     - On success: Rank = 1, gain one extra skill roll

  G. Advancement Check
     - CE: Roll on career advancement target with characteristic DM
     - Mneme: Check if Survival Effect ≥ 4
     - On success: Rank +1, gain one extra skill roll, gain rank bonus skills if any

  H. Skills & Training
     - Roll on one skill table (Personal, Service, Specialist, or Advanced if EDU 8+)
     - Careers without Commission/Advancement (CE only): roll twice
     - Apply skill gains (new skill = Level 1; existing skill = +1 level)
     - Apply characteristic improvements immediately

  I. Re-enlistment / Muster Out Decision
     - CE: Roll re-enlistment; natural 12 = forced continue; 7+ total terms = forced retire
     - Mneme: Automatic success; player chooses; no forced re-enlist
     - On muster out: go to Step 6

  J. Age +4 years

  K. Aging Check (if applicable)
     - CE: Term 4+ → roll aging (MECH-8.1)
     - Mneme: Term 5+ → roll aging (MECH-8.2)
     - Optionally apply anagathics before rolling (MECH-8.4 or MECH-8.5)
     - On aging failure: reduce physical characteristics per table
     - If any characteristic = 0: aging crisis (MECH-8.3)

  LOOP BACK TO A unless mustering out
```

**Minimum skills guarantee:** Every term, character gains at least 1 skill level regardless of other rolls.

### 11.7 Step 5a: Mishap Handling [MECH-11.7]

Triggered by failed Survival roll:
1. Roll 1D6 on Survival Mishaps Table (MECH-6.5).
2. Apply mishap effects.
3. If mishap result is Injury: roll 1D6 on Injury Table (MECH-7.1); apply characteristic reductions.
4. Career ends (forced mustering out, no benefit roll for this term).
5. Proceed to medical bills (MECH-11.8) if injured.

### 11.8 Step 5b: Medical Bills [MECH-11.8]

Triggered if injured:
1. Determine total characteristic points lost from injury.
2. Calculate restoration cost: Cr5,000 per characteristic point.
3. Roll 2D6 + Rank DM on Medical Bills table (MECH-7.3) to determine employer coverage.
4. Apply remaining cost: deducted from eventual mustering-out cash, or create debt if insufficient funds.

### 11.9 Step 6: Mustering Out [MECH-11.9]

After all career terms:
1. Calculate total benefit rolls per career using MECH-9.1.
2. For each roll: choose Cash or Material (max 3 Cash total across all careers).
3. Apply +1 DM on Cash rolls if Gambling skill or retired (MECH-9.2).
4. Apply +1 DM on Material rolls if Rank 5–6 (MECH-9.3).
5. Calculate pension if eligible (MECH-9.4).
6. Pay medical debt and anagathic costs from Benefits before anything else (MECH-7.4).

**Output:** Credits, equipment/benefits list, annual pension amount.

### 11.10 Step 7: Equipment [MECH-11.10]

1. Inventory benefits received (weapons, armor, passages, ship shares, etc.).
2. Optionally purchase additional equipment from `equipment.json` with remaining Credits.
3. Apply career-based equipment suggestions (Career-specific data in `careers.json`).

### 11.11 Step 8: Name Generation [MECH-11.11]

1. Select culture from `cultures_names.json` (or random).
2. Select gender (or random).
3. Generate given name and surname from culture's name pools.
4. Apply format pattern from `name_generation_rules.json`.

**Output:** Full character name.

### 11.12 Step 9: Final Details [MECH-11.12]

1. Confirm name (MECH-10).
2. Record connections (allies, contacts, enemies from career events).
3. Record injuries and medical status.
4. Calculate final age: 18 + (4 × total terms) + 4 if Pre-Career Education taken.
5. Generate character summary and UPP.
6. Character complete — ready for library storage.

---

## Appendix A: Algorithm Implementations [MECH-A]

Reference implementations in JavaScript for all dice mechanics and calculations. These are authoritative for implementation — use these exact algorithms.

### A.1 Basic Dice [MECH-A.1]

```javascript
function rollD6() {
  return Math.floor(Math.random() * 6) + 1;
}

function roll2D6() {
  return rollD6() + rollD6();
}

// Target Number check
function roll2D6vsTN(targetNumber, dm = 0) {
  const roll = roll2D6();
  const total = roll + dm;
  return { roll, total, success: total >= targetNumber, effect: total - targetNumber };
}
```

### A.2 Advantage / Disadvantage [MECH-A.2]

```javascript
// Roll (2+x)d6, keep highest 2
function rollAdvX(x) {
  const dice = Array.from({ length: 2 + x }, rollD6);
  dice.sort((a, b) => b - a);
  return dice[0] + dice[1];
}

// Roll (2+x)d6, keep lowest 2
function rollDisX(x) {
  const dice = Array.from({ length: 2 + x }, rollD6);
  dice.sort((a, b) => a - b);
  return dice[0] + dice[1];
}
```

### A.3 Characteristic Roll from Spec [MECH-A.3]

```javascript
function rollCharacteristic(spec) {
  let value;
  if (spec === '2d6') {
    value = roll2D6();
  } else if (spec.startsWith('adv')) {
    value = rollAdvX(parseInt(spec.slice(3)));
  } else if (spec.startsWith('dis')) {
    value = rollDisX(parseInt(spec.slice(3)));
  } else if (spec.includes('-')) {
    const [, mod] = spec.split('-');
    value = roll2D6() - parseInt(mod);
  } else if (spec.includes('+')) {
    const [, mod] = spec.split('+');
    value = roll2D6() + parseInt(mod);
  } else {
    value = roll2D6(); // fallback
  }
  return Math.max(1, value);
}
```

### A.4 Characteristic DM [MECH-A.4]

```javascript
// Implements MECH-4.2: floor(value/3) - 2
function getCharacteristicDM(value) {
  return Math.floor(value / 3) - 2;
}
```

### A.5 Career Rolls [MECH-A.5]

```javascript
function rollQualification(career, characteristics) {
  if (career.qualification.auto) {
    return { qualified: true, roll: 0, dm: 0, total: 0 };
  }
  let dm = 0;
  for (const [char, bonus] of Object.entries(career.qualification.dm)) {
    dm += getCharacteristicDM(characteristics[char.toUpperCase()]) * bonus;
  }
  const roll = roll2D6();
  const total = roll + dm;
  return { roll, dm, total, qualified: total >= career.qualification.target };
}

function rollSurvival(career, characteristics) {
  let dm = 0;
  for (const [char, bonus] of Object.entries(career.survival.dm)) {
    dm += getCharacteristicDM(characteristics[char.toUpperCase()]) * bonus;
  }
  const roll = roll2D6();
  const total = roll + dm;
  return { roll, dm, total, survived: total >= career.survival.target, effect: total - career.survival.target };
}

function rollAdvancement(career, characteristics) {
  let dm = 0;
  for (const [char, bonus] of Object.entries(career.advancement.dm)) {
    dm += getCharacteristicDM(characteristics[char.toUpperCase()]) * bonus;
  }
  const roll = roll2D6();
  const total = roll + dm;
  return { roll, dm, total, advanced: total >= career.advancement.target };
}

// Mneme: advancement via Survival Effect
function checkMnemeAdvancement(survivalResult) {
  return survivalResult.effect >= 4;
}
```

### A.6 Benefit Roll Calculations [MECH-A.6]

```javascript
function calculateBenefitRolls(terms, finalRank) {
  let rolls = terms;
  if (finalRank >= 5) rolls += 3;
  else if (finalRank >= 3) rolls += 2;
  else if (finalRank >= 1) rolls += 1;
  return rolls;
}

function rollCashBenefit(career) {
  const roll = rollD6();
  return career.benefits.cash.find(c => c.roll === roll)?.amount ?? 0;
}

function rollMaterialBenefit(career, rank) {
  let roll = rollD6();
  if (rank >= 5) roll = Math.min(roll + 1, 7);
  return career.benefits.material.find(m => m.roll === roll)?.benefit ?? null;
}
```

### A.7 Retirement Pay [MECH-A.7]

```javascript
// Implements MECH-9.4 including 9+ terms
function calculatePension(termsInCareer) {
  if (termsInCareer < 5) return 0;
  if (termsInCareer <= 8) {
    const base = [0, 0, 0, 0, 0, 10000, 12000, 14000, 16000];
    return base[termsInCareer];
  }
  return 16000 + (termsInCareer - 8) * 2000;
}
```

### A.8 Aging Rolls [MECH-A.8]

```javascript
// CE Standard — MECH-8.1
function rollAging_CE(term, endDM) {
  if (term < 4) return { roll: 0, passed: true, effects: [] };
  const roll = roll2D6();
  const modified = roll - term; // negative DM of total terms
  return {
    roll,
    modified,
    passed: modified >= 1,
    effects: modified < 1 ? getAgingEffects_CE(modified) : []
  };
}

// Mneme Variant — MECH-8.2
function rollAging_Mneme(term, endDM) {
  if (term < 5) return { effects: [] };
  const difficulty = term + 1;
  const roll = roll2D6();
  const total = roll + endDM;
  return {
    roll, difficulty, total,
    passed: total >= difficulty,
    effects: total < difficulty ? ['reduce_physical_1'] : []
  };
}

// Mneme Anagathics — MECH-8.5
function applyAnagathics_Mneme(soc, credits) {
  const maxDoses = Math.max(1, soc - 7);
  if (credits < 100000) return { canAfford: false, agingPrevented: false };
  return { canAfford: true, cost: 100000, agingPrevented: true, maxDoses };
}
```

---

## Appendix B: Source References [MECH-B]

These pages are the canonical rule sources. When this document and a source conflict, investigate the discrepancy.

| Source | URL | Coverage |
|--------|-----|----------|
| Mneme CE Chapter 1 | https://wiki.gi7b.org/index.php/Mneme_CE_Chapter_1_Character_Creation | Full CE character creation (this document's primary source) |
| Mneme Character Creation Index | https://wiki.gi7b.org/index.php/Character_Creation | Quick Fix rules, variant combat options |
| Mneme Quick Fix (Career Cards) | file:221015_MNEME_24_CAREER_CARDS.pdf | Printable quick reference cards |
| Mneme CE Chapter 2 Skills | https://wiki.gi7b.org/index.php/Mneme_CE_Chapter_2_Skills | Full skill descriptions and career tables |
| Mneme CE Chapter 3 Psionics | https://wiki.gi7b.org/index.php/Mneme_CE_Chapter_3_Psionics | Psionic talents, training, combat |
| Mneme CE Chapter 4 Equipment | https://wiki.gi7b.org/index.php/Mneme_CE_Chapter_4_Equipment | Weapons, armor, gear, TL catalog |
| Mneme Combat Dice Mechanics | https://wiki.gi7b.org/index.php/Mneme_CE_Combat_Rules/Dice_Mechanics | Advantage/Disadvantage, Effect, Variable Difficulty |
