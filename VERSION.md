# CE CharacterGen — Version History

**Current Version:** `260418.1.0`  
**Branch:** `main`  
**Repository:** https://github.com/Game-in-the-Brain/cecharactergen

---

## Versioning Scheme

```
260418.0.0
│      │ │
│      │ └── Patch: bug fixes, minor tweaks
│      └──── Minor: new features, careers, data tables
└─────────── Date prefix: YYMMDD of restart or major milestone
```

**Date prefix** changes only on major architectural resets or milestone releases.  
**Minor** increments when adding features, careers, species, or UI screens.  
**Patch** increments for bug fixes, text corrections, or balance tweaks.

---

## Release History

### `260418.1.0` — PWA Scaffold & Engine Port (Current)
**Date:** 260418  
**Status:** In Development

#### Major Changes
- **Phase 1 Complete:** Vite + React 18 + TypeScript + Tailwind CSS scaffold
- **Phase 2 In Progress:** UI Shell (Layout, TopBar, BottomBar, Routes, Zustand store)
- **PWA Configured:** vite-plugin-pwa with auto-updating service worker

#### Features Added
- [x] Python engine ported to TypeScript (dice, character, careers, types)
- [x] Data JSON files for 7 careers, 3 species, skills, equipment, backgrounds
- [x] Tests: 4/4 passing (seed-for-seed parity with Python CLI)
- [x] React Router setup: Landing, Generate, Library, Reference, Settings, About
- [x] Layout component with top bar (theme/layout toggle) and bottom bar (Back)
- [x] Dark/light theme with system preference + localStorage persistence
- [x] Phone/desktop layout mode with auto-detection + localStorage persistence
- [x] Zustand store with persist middleware
- [x] Landing page with footer links to DriveThruRPG products
- [x] About page with credits, source material, license

#### Bug Fixes
- [x] Fixed `total_terms` not incrementing on survival failure

---

### `260418.0.0` — Low-Tech Fantasy Restart
**Date:** 260418  
**Status:** Archived

#### Major Changes
- **Architecture:** Full reset from React/Vite sci-fi project to Low-Tech Fantasy PWA
- **Primary Interface:** React 18 + TypeScript + Vite PWA (replaces CLI-only approach)
- **Legacy Preserved:** Python CLI generator moved to `python/` directory
- **Design Docs Updated:** `README.md` and `260418-Low-Tech-Fantasy-Restart.md` rewritten for PWA

#### Features Added
- [x] Python CLI character generator (7 careers, 3 species, 36 skills)
- [x] JSON data architecture for careers, species, equipment, skills, backgrounds
- [x] Dice engine: 2d6, exploding dice, advantage/disadvantage
- [x] Career term resolver: qualification, survival, advancement, events, mishaps, aging
- [x] Mustering out with cash and material benefits
- [x] Derived statistics (HP, Stamina, AC, Initiative, Languages)
- [x] Text-based character sheet renderer

#### Content Added
- [x] **Careers (7):** Warrior, Cleric, Thief, Hunter, Sorcerer, Merchant, Noble
- [x] **Species (3):** Human, Elf, Dwarf
- [x] **Skills (36):** Combat, magic, professional, social, survival, knowledge
- [x] **Weapons (10):** Dagger to crossbow
- [x] **Armors (11):** Padded to full plate
- [x] **Backgrounds (7):** Serf to Major House

#### Known Issues / TODO
- [ ] No web UI yet (PWA scaffold not started)
- [ ] No save/load persistence for characters
- [ ] No import/export functionality
- [ ] No reference editor for in-app data modification
- [ ] No PWA manifest or service worker
- [ ] Career events beyond Warrior need playtesting balance
- [ ] Equipment benefits in mustering resolve to strings, not actual items
- [ ] No spell/magic system data for Sorcerer and Cleric

---

## Planned Versions

### `260418.1.0` — PWA Scaffold & Engine Port
**Target:** Phase 1–2 completion

#### Planned Features
- [ ] Vite + React 18 + TypeScript + Tailwind scaffold
- [ ] `vite-plugin-pwa` with manifest and service worker
- [ ] Port Python dice engine to TypeScript
- [ ] Port Python character module to TypeScript
- [ ] Port Python careers module to TypeScript
- [ ] Seed-for-seed parity verification with Python CLI
- [ ] React Router setup: Landing, Generate, Sheet, Library, Reference, Settings
- [ ] Layout component with top bar (theme toggle) and bottom bar (Back/Next)
- [ ] Dark/light theme with localStorage persistence

---

### `260418.2.0` — Generator Wizard & Character Sheet
**Target:** Phase 3 completion

#### Planned Features
- [ ] Accordion stepper for character generation
  - Step 1: Name & Species selection
  - Step 2: Ability rolls (2d6) with re-roll option
  - Step 3: SOC roll (exploding 2d6)
  - Step 4: Background & skills
  - Step 5: Career terms (qualify → survive → advance → event)
  - Step 6: Mustering out
  - Step 7: Derived stats & final sheet
- [ ] Rich character sheet view
- [ ] Inline editing of any character field
- [ ] Phone-first responsive design (375px baseline)

---

### `260418.3.0` — Character Library & Persistence
**Target:** Phase 4 completion

#### Planned Features
- [ ] IndexedDB persistence for characters
- [ ] Character Library screen: list all saved characters
- [ ] Load character into sheet
- [ ] Duplicate character (save-as)
- [ ] Delete character
- [ ] Export single character as JSON file
- [ ] Export all characters as JSON/ZIP
- [ ] Import characters from JSON file

---

### `260418.4.0` — Reference Editor
**Target:** Phase 5 completion

#### Planned Features
- [ ] Reference browser: careers, equipment, skills, species, backgrounds
- [ ] In-place editing of any JSON field with form validation
- [ ] Save edits to IndexedDB (overrides static JSON)
- [ ] Reset reference data to factory defaults
- [ ] Export reference data as JSON
- [ ] Import reference data from JSON

---

### `260418.5.0` — PWA Polish & Deploy
**Target:** Phase 6 completion

#### Planned Features
- [ ] PWA install prompt and icons
- [ ] Full offline caching via service worker
- [ ] GitHub Pages auto-deployment
- [ ] Update prompt when new version is available
- [ ] Settings: theme, layout, data reset
- [ ] Playtesting and balance review of all 7 careers

---

## Bug Tracking

| ID | Version Found | Description | Status | Fixed In |
|----|--------------|-------------|--------|----------|
| BUG-001 | 260418.0.0 | Mustering benefits resolve to strings ("weapon", "armor") instead of actual equipment items | Open | — |
| BUG-002 | 260418.0.0 | Event auto-advancement on first term doesn't update rank in term summary (cosmetic — skill is still granted) | Open | — |
| BUG-003 | 260418.0.0 | No cash consolidation in renderer — starting cash and mustering cash shown separately | Open | — |
| BUG-004 | 260418.0.0 | Career qualification DM penalty (-2 per previous career) applies even to first career | Open | — |

---

## How to Update This File

When making changes:

1. **Bug fix?** Increment patch (`260418.0.0` → `260418.0.1`) and move the bug to "Fixed In"
2. **New feature?** Increment minor (`260418.0.0` → `260418.1.0`) and add to release history
3. **Major reset?** Change date prefix (`260418` → `260501`) and start fresh

Update the **Current Version** badge at the top of this file with every commit that changes functionality.
