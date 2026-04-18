# Feature Requirement Document — CE CharacterGen

**Target Version:** 260418.2.0  
**Phase:** 3 of 6  
**Theme:** Generator Wizard & Character Sheet  
**Status:** Ready for implementation

---

## Overview

The app currently has a working engine and a UI shell. The next milestone is to make the **Generate** page functional — a step-by-step character generation wizard with an accordion interface, plus a rich character sheet view. This is the core user-facing feature.

---

## FR-001: Generate Page — Mode Selection

**Priority:** High  
**Route:** `/generate`

Before the accordion starts, present a mode selection card:

### Player Mode
- Step-by-step interactive generation
- Player makes choices at each stage
- Dice rolls are shown with animation/delay
- Each step pauses for confirmation before advancing

### Random Mode
- Fully automated generation
- Optional: batch count (1–50, default 1)
- Optional filters (species, career type, min/max terms)
- Progress indicator during generation
- Results saved to Library automatically

**UI:** Two large cards side-by-side (phone: stacked). Selected mode persists in Zustand store for the session.

---

## FR-002: Accordion Stepper — Generation Steps

**Priority:** High  
**Route:** `/generate` (Player mode) or `/generate/player`

Vertical accordion with 7 steps. Only one step is **Active** at a time. Completed steps show above, locked steps below.

### Step States

| State | Visual | Interaction |
|-------|--------|-------------|
| Locked | Dimmed, label only, no border accent | Non-interactive |
| Active | Full border accent, expanded, controls visible | Player input or auto-result |
| Completed | Checkmark, summary line | Tappable to review/edit |

### Step Order

```
1. Species Selection
2. Characteristics (Ability Rolls)
3. Background & Skills
4. Career Terms
5. Mustering Out
6. Name
7. Character Sheet (final review + save)
```

### Step 1: Species Selection

**Player input:** Dropdown or card grid (Human, Elf, Dwarf)  
**Random mode:** Weighted random selection  
**Output:** `species_id` written to character  
**Summary:** "Species: Human"

### Step 2: Characteristics

**Mechanics:** Roll 2d6 for each of STR, DEX, END, INT, EDU, SOC. Apply species modifiers.  
**Player input:** Show rolled values. Allow **one** re-roll of any single ability (consumes the re-roll).  
**Random mode:** Auto-roll, no re-roll.  
**Output:** `abilities` map  
**Summary:** "STR 7, DEX 9, END 5, INT 8, EDU 6, SOC 4"

### Step 3: Background & Skills

**Mechanics:** Roll SOC (exploding 2d6) → determine SOC tier → select background from tier. Background grants 1 skill. Hero coins awarded if total ability scores are low.  
**Player input:** Background is auto-selected based on SOC, but player can pick a different background in the same tier. Skill choice from background options.  
**Output:** `background_id`, `background_skill`, `hero_coins`  
**Summary:** "Background: Townsfolk — Skill: Streetwise"

### Step 4: Career Terms

**This is the most complex step.** See FR-003 for full specification.

### Step 5: Mustering Out

**Mechanics:** Roll on cash table (1d6 + DM per career) and benefits table (1 roll per 3 terms, +1 if rank 4+).  
**Player input:** Choose cash vs benefits for each roll.  
**Output:** `assets` (cash + material benefits)  
**Summary:** "Cash: 8,000 cr · Benefits: Sword, Contact"

### Step 6: Name

**Mechanics:** Auto-generated from species/culture tables (not yet implemented — placeholder names acceptable).  
**Player input:** Editable text field.  
**Output:** `name`  
**Summary:** "Name: Aldric Stonehand"

### Step 7: Character Sheet

**Mechanics:** Calculate derived stats (HP, Stamina, AC, Initiative, Skill Max, Languages).  
**Player input:** Review entire character. Edit any field inline. Save to Library.  
**Output:** Complete `CharacterData` with `status: 'complete'`  
**Summary:** Full character summary

---

## FR-003: Career Terms — Sub-Tile System

**Priority:** High  
**Parent:** Step 4 of accordion

The Career step is a single top-level accordion tile containing collapsible sub-tiles per term.

### Sub-Tile Structure

```
▼ Career  [Warrior — 2 terms]
   ✓ Term 1  Warrior  Survival: pass  Rank: Corporal  Skills: Melee 1
   ✓ Term 2  Warrior  Survival: pass  Rank: Sergeant  Skills: Athletics 1
   ▼ Term 3  [active — rolling now]
     [Survival roll: 8 vs 6 → PASS]
     [Advancement roll: 9 vs 7 → PROMOTED to Lieutenant]
     [Skills gained: Tactics 1]
     [Event: Won a tournament — +1 SOC]
     
     [Re-enlist / Change Career / Muster Out]
```

### End-of-Term Choices

| Choice | Effect |
|--------|--------|
| Re-enlist | Start next term in same career. Check re-enlistment roll. |
| Change Career | Select new career, go through qualification. If fail, can choose Draft or stop. |
| Muster Out | End career phase. Unlock Mustering Out step. |

### Mandatory Retirement
- Age 34+ (after term where age hits 34): aging penalties apply
- Age 50+: muster out is forced after any term
- Re-enlistment roll of 12: mandatory continued service

---

## FR-004: Character Sheet View

**Priority:** High  
**Route:** Inline in Step 7, and standalone `/sheet/:id` (future)

### Layout (Phone-first)

Single column, collapsible sections:

```
┌─ Identity ───────────────┐
│ Name: Aldric Stonehand   │
│ Species: Human · Age 26  │
│ SOC: 4 (Commoner)        │
└──────────────────────────┘
┌─ Characteristics ────────┐
│ STR 7 (+1)  DEX 9 (+2)   │
│ END 5 (+0)  INT 8 (+1)   │
│ EDU 6 (+0)  SOC 4 (+0)   │
│ Supernatural: 0          │
└──────────────────────────┘
┌─ Derived ────────────────┐
│ HP: 5  Stamina: 6  AC: 10│
│ Initiative: +2  Languages: 1│
└──────────────────────────┘
┌─ Skills ─────────────────┐
│ Melee 1, Athletics 1...  │
└──────────────────────────┘
┌─ Career History ─────────┐
│ Warrior (2 terms)        │
│   Rank: Sergeant         │
│   Skills: Melee, Athletics│
└──────────────────────────┘
┌─ Equipment & Assets ─────┐
│ Starting: Dagger, Padded │
│ Mustering: 4,000 cr, Sword│
└──────────────────────────┘
┌─ Background ─────────────┐
│ Townsfolk — Streetwise   │
│ Hero Coins: 1            │
└──────────────────────────┘
```

### Inline Editing

Every field is editable:
- Click/tap a value → inline input or dropdown
- On change: update character state immediately
- Show "edited" indicator (subtle dot or color change)

---

## FR-005: Random Mode — Batch Generation

**Priority:** Medium  
**Route:** `/generate/random`

### Pre-Generation Options

```
Species:     [x] All  [ ] Human only  [ ] Elf only  [ ] Dwarf only
Career Type: [x] All  [x] Military  [x] Civilian  [x] Criminal  [x] Elite
Terms:       Min [1]  Max [7]
Batch Count: [1–50]
```

### Progress Display

"Generating character 3 of 10..." with a progress bar.

### Results

- Auto-saved to Library in a folder named `Generated`
- File name: `YYMMDD-HHMMSS` (timestamp)
- Immediately open the file in Library view after generation

---

## FR-006: Save to Library

**Priority:** High  
**Trigger:** "Save" button on Character Sheet step

### Behavior

1. Prompt for character name (pre-filled with generated name)
2. Prompt for file name (default: character name)
3. Prompt for folder (default: `Generated` or last-used folder)
4. Save to IndexedDB
5. Show success toast: "Saved to Library"

### Data Format

Saved as a `.cef` (Character Export Format) JSON structure:

```json
{
  "format": "ce-char-1",
  "created": "260418",
  "character": { /* full CharacterData */ }
}
```

---

## UI Specifications

### Phone (< 768px)
- Single column, full width
- Accordion tiles span full width
- Bottom bar always visible
- Character sheet sections are full-width cards

### Tablet/Desktop (≥ 768px)
- Centered content, max-width 768px for accordion
- Character sheet: 2-column grid for Characteristics + Skills
- Bottom bar may be hidden; in-content navigation buttons used instead

### Animations
- Step completion: subtle checkmark fade-in (200ms)
- Dice rolls: number cycling animation (300ms)
- Accordion expand/collapse: height transition (200ms ease)

---

## Data Requirements

No new JSON data files needed for this phase. All data exists in `src/data/`.

Potential additions (optional):
- Name generation tables by species/culture
- More career events and mishaps for variety

---

## Testing Requirements

| Test | Type | Description |
|------|------|-------------|
| Accordion state machine | Unit | Locked → Active → Completed → Active (edit) |
| Step completion cascade | Unit | Editing step N clears steps N+1 |
| Career term flow | Integration | Full warrior career, 2 terms, muster out |
| Character sheet render | Component | Renders all sections with mock data |
| Random mode batch | Integration | Generate 5 characters, verify all complete |
| Save to Library | E2E | Save character, verify in IndexedDB |

---

## Acceptance Criteria

- [ ] Player can generate a complete character step-by-step
- [ ] Each accordion step shows correct mechanics results
- [ ] Career terms allow re-enlist, change career, or muster out
- [ ] Character sheet displays all data in readable format
- [ ] Character can be saved to Library
- [ ] Random mode generates N characters and saves them
- [ ] All existing engine tests still pass
- [ ] Build succeeds with zero errors
- [ ] Works on 375px phone screen

---

## Out of Scope (Future Phases)

- Library browser/viewer (Phase 4)
- Reference data editor (Phase 5)
- PWA install prompts and offline polish (Phase 6)
- Import/export `.cef` files (Phase 4)
- Spell/magic system UI (future expansion)
