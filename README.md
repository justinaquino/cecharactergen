# **CECG: A Modular Approach for Cepheus Engine**

## **Status**

- **Stage:** Planning & funding
- **Target dev start:** **January 15, 2026**
- **Design stance:** Non‑interactive, **click‑to‑generate** characters (with optional pre‑set parameters)

---

## **Overview**

The **Cepheus Engine Character Generator (CECG)** is a modular, data‑driven character generator for Cepheus Engine. We separate **data** (races, backgrounds, careers, equipment) from the **Rules Engine** (enlistment, survival, promotions, term loop, mustering out). Races, backgrounds, and careers are shipped as **swappable modules** so third parties can add, remove, or override content without touching code.

---

## **Timeline (Tentative)**

Each phase and sub‑phase runs for **3 weeks**, except **Phase 5**, which spans **22 weeks** to cover the creation of all 24 career modules. Development starts **January 15, 2026**.

| Phase   | Milestone                                    | Duration     | Start        | End          |
| ------- | -------------------------------------------- | ------------ | ------------ | ------------ |
| **1.0** | **CCC (Core Character Creation)**            | 3 weeks      | Jan 15, 2026 | Feb 4, 2026  |
| **1.1** | **CCC – Everything Else**                    | 3 weeks      | Feb 5, 2026  | Feb 25, 2026 |
| **1.2** | **Parameters UI**                            | 3 weeks      | Feb 26, 2026 | Mar 18, 2026 |
| **2**   | **Backgrounds & Race (Module 1)**            | 3 weeks      | Mar 19, 2026 | Apr 8, 2026  |
| **3**   | **Career Path (Module 2) – Template Build**  | 3 weeks      | Apr 9, 2026  | Apr 29, 2026 |
| **4**   | **Mustering Out**                            | 3 weeks      | Apr 30, 2026 | May 20, 2026 |
| **5**   | **Finalization (24 Career Implementations)** | **22 weeks** | May 21, 2026 | Oct 23, 2026 |

---

---

## **Core Components**

### **1) Character Object**

The canonical ("living") character sheet.

- **Age** (starts at 18)
- **Race** (default: "Human")
- **Background** (string)
- **Terms** (int; 1 term = 4 years)
- **Careers** (array of `{ name, terms }`)
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

## **Milestones & Progress**

(Track implementation with a progress column.)

| Phase   | Milestone                         | Description                                                                                                                             | Progress (%) |
| ------- | --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| **1.0** | **CCC (Core Character Creation)** | Initialize base Character Object; roll abilities; basic details.                                                                        | 0%           |
| **1.1** | **CCC – Everything Else**         | Flesh out CCC utilities: name/homeworld generators, conditions, assets stubs, export scaffolds.                                         | 0%           |
| **1.2** | **Parameters UI**                 | Add **lists & checkboxes** to constrain outputs (e.g., limit races/backgrounds/careers; toggle house rules). Used by click‑to‑generate. | 0%           |
| **2**   | **Backgrounds & Race (Module 1)** | Load `races` + `backgrounds`; apply modifiers, starting skills/assets.                                                                  | 0%           |
| **3**   | **Career Path (Module 2)**        | Enlistment → Survival/Promotion/Skills (per term) → Re‑enlist/Exit loop.                                                                | 0%           |
| **4**   | **Mustering Out**                 | Compute muster rolls; apply Cash/Benefits; add assets to character.                                                                     | 0%           |
| **5**   | **Finalization (24 Careers)**     | Implement all 24 careers and finalize data integrity.                                                                                   | 0%           |

---

## **Reference Materials**

- [Cepheus Engine SRD](https://www.drivethrurpg.com/en/product/187941/cepheus-engine-srd-modifiable-version)
- [Cepheus Engine: 6 Combat Career Cards](https://www.drivethrurpg.com/en/product/413465/cepheus-engine-6-combat-career-cards)
- [Cepheus Engine: 24 Career Cards](https://www.drivethrurpg.com/en/product/413475/cepheus-engine-24-career-cards)

---

## **License**

Planned: **OGL** or **CC BY‑SA** (to be confirmed for compatibility with Cepheus Engine SRD).
