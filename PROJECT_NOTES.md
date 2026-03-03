# CECG Project Notes
## Cepheus Engine Character Generator — Development Log

**Project:** CECG (Cepheus Engine Character Generator)  
**Date Started:** March 3, 2026  
**Status:** M1 In Progress — UI Foundation  
**Repository:** https://github.com/xunema/cecharactergen  
**Deployed URL:** (pending)

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Milestone Status](#milestone-status)
3. [Session Log](#session-log)
4. [Technical Decisions](#technical-decisions)
5. [Issues Encountered & Solutions](#issues-encountered--solutions)
6. [File Structure](#file-structure)
7. [Next Steps](#next-steps)

---

## Project Overview

**Goal:** Create a Progressive Web App (PWA) for generating Cepheus Engine characters, adopting the successful patterns from CE ShipGen project.

**Key Lessons from CE ShipGen Applied:**
- Milestone-based development (M1, M2, M2.5, M2.6, M3)
- Living PRD with session-based addendums
- Comprehensive project notes for continuity
- PWA with version control (M2.6 pattern)
- JSON data management with edit/view/import/export capabilities
- Auto-save with factory defaults preservation
- Settings snapshots for variant rules

**Technology Stack (Proposed):**
- React 18 + TypeScript (adopt from CE ShipGen success)
- Vite (fast HMR, optimized builds)
- Tailwind CSS (consistent with CE ShipGen)
- Zustand (lightweight state management)
- React Router (persistent URLs)
- IndexedDB + localStorage (offline-first)

**Differentiation from CE ShipGen:**
- Character-focused vs Ship-focused
- Career simulation (terms, aging, mustering) vs Construction steps
- Equipment procedurally generated vs Component assembly

---

## Milestone Status

### M1: UI Layout & Foundation ⏳ IN PROGRESS
**Scope:** Basic layout, tiles, PWA setup, simple character generation

**Deliverables:**
- [ ] Responsive layout (desktop/phone toggle)
- [ ] Character sheet tile system
- [ ] Startup screen with navigation
- [ ] Basic character generation (characteristics only)
- [ ] PWA manifest and service worker
- [ ] GitHub Pages deployment

**Target Completion:** March 10, 2026

---

### M2: Settings & Data Tables ⏳ PENDING
**Scope:** JSON editors, all data tables, **career enable/disable**, rule toggles

**Deliverables:**
- [ ] **data/ directory setup** — Create folder structure for JSON files

**Core Character Data (M2 Priority):**
- [ ] **races.json** — Species definitions with modifiers
  - Default Human species (canonical CE definition)
  - Structure: `id`, `name`, `modifiers` (characteristics), `traits`, `enabled`
  
- [ ] **careers.json** — First 6-8 careers converted to JSON:
  - Drifter, Marine, Scout, Pirate, Rogue, Colonist, etc.
  - Each career has: `id`, `name`, `qualification`, `survival`, `advancement`, `skills`, `ranks`, `mustering`, `enabled` (boolean)
  - **Enable/Disable Feature:** GM can toggle careers on/off per campaign

**Career Simulation Tables (M2 - Character Events):**
- [ ] **events.json** — Career events by career type
  - Random events during terms (promotions, discoveries, windfalls)
  - Event text, skill gains/losses, connections
  
- [ ] **mishaps.json** — Career mishaps and disasters
  - Negative events (injuries, dismissal, scandal, death)
  - Injury severity, career-ending events
  
- [ ] **draft.json** — Draft/Conscription table
  - Draft targets by career type (when qualification fails)
  - Draft-specific survival and skills
  
- [ ] **anagathics.json** — Anagathics (anti-aging drugs)
  - Cost per term by tech level
  - Availability by starport, side effects
  - Aging prevention mechanics

**Character Components:**
- [ ] **skills.json** — Skill definitions and categories
  - All skills with descriptions, categories, cascade skills
  
- [ ] **equipment.json** — Weapons, armor, gear, assets
  - Weapons: damage, range, cost, TL, mass
  - Armor: protection levels, cost, TL
  - Gear: tools, survival, medical equipment
  
- [ ] **benefits.json** — Mustering out tables
  - Cash benefits per career and roll
  - Material benefits (weapons, armor, ship shares)
  
- [ ] **conditions.json** — Wounds, injuries, aging effects
  - Injury tables, medical care, recovery
  - Aging characteristic loss (Term 5+)

**World & Background:**
- [ ] **homeworlds.json** — World types with background skills
- [ ] **names.json** — Name generators by culture/species

**Settings:**
- [ ] **rules.json** — Rule variants (CE vs Mneme differences)
- [ ] **settings.json** — Career enable/disable preferences
- [ ] **_summary.json** — Data catalog

**UI Components:**
- [ ] **Settings screen with JSON editor** — Edit all 15+ tables inline
  - Organized by category (Core, Simulation, Components, World, Settings)
  - Dual JSON/Table view (like CE ShipGen)
  - Schema validation
  
- [ ] **Career Management section** (`/settings/careers`):
  - Checkbox list of all careers with enable/disable
  - "Enable All" / "Disable All" buttons
  - Filter by category (Military/Civilian/Criminal/Elite)
  - Visual indicator of disabled careers (grayed out)
  
- [ ] **Rule toggles** — CE vs Mneme selection
- [ ] **Auto-save** — Edits persist to localStorage
- [ ] **Reset to defaults** — Restore canonical data

**JSON Schema Example (careers.json):**
```json
{
  "drifter": {
    "id": "drifter",
    "name": "Drifter",
    "enabled": true,
    "category": "civilian",
    "qualification": {
      "roll": "2D6",
      "target": 0,
      "dm": {},
      "auto": true
    },
    "survival": {
      "roll": "2D6",
      "target": 6,
      "dm": {"end": 1}
    },
    "advancement": {
      "roll": "2D6", 
      "target": 7,
      "dm": {"int": 1}
    },
    "skills": {
      "personal": ["+1 STR", "+1 DEX", "+1 END", "+1 INT", "+1 EDU", "+1 SOC"],
      "service": ["Athletics", "Melee", "Recon", "Streetwise", "Survival", "Vacc Suit"],
      "specialist": ["Engineer", "Gun Combat", "Melee", "Recon", "Stealth", "Survival"],
      "advanced": ["Leadership", "Tactics", "Deception", "Persuade", "Streetwise", "Jack of all Trades"]
    },
    "ranks": [
      {"level": 0, "title": "Wanderer", "skill": null},
      {"level": 1, "title": "Vagabond", "skill": "Streetwise 1"},
      {"level": 2, "title": "Traveller", "skill": "Deception 1"}
    ],
    "mustering": {
      "cash": [1000, 5000, 10000, 10000, 20000, 50000, 100000],
      "benefits": [
        {"roll": 1, "benefit": "Contact"},
        {"roll": 2, "benefit": "Weapon"},
        {"roll": 3, "benefit": "Alliance"},
        {"roll": 4, "benefit": "Ship Share"},
        {"roll": 5, "benefit": "Ship Share"},
        {"roll": 6, "benefit": "Life Insurance"},
        {"roll": 7, "benefit": "Life Insurance +2"}
      ]
    }
  }
}
```

**Career Enable/Disable UI:**
```
┌─────────────────────────────────────────────────────────┐
│ CAREER MANAGEMENT                                       │
├─────────────────────────────────────────────────────────┤
│ [Filter: All ▼] [🔍 Search]  [Enable All] [Disable All] │
├─────────────────────────────────────────────────────────┤
│ ☑ Drifter                    [Civilian]   [Edit JSON]   │
│ ☑ Marine                     [Military]   [Edit JSON]   │
│ ☑ Scout                      [Military]   [Edit JSON]   │
│ ☐ Noble                      [Elite]      [Edit JSON]   │  ← Disabled
│ ☑ Pirate                     [Criminal]   [Edit JSON]   │
│ ☐ Physican                   [Professional] [Edit JSON] │  ← Disabled
│ ☑ Colonist                   [Civilian]   [Edit JSON]   │
│ ... (18 more)                                           │
├─────────────────────────────────────────────────────────┤
│ 22 of 24 careers enabled                                │
│ [Reset to All Enabled]                                  │
└─────────────────────────────────────────────────────────┘
```

**Target Start:** March 11, 2026

---

### M2.5: Install UX & Settings System ⏳ PENDING
**Scope:** FR-021 through FR-025 from PRD

**Deliverables:**
- [ ] FR-021: Install prompt and "Installed" badge
- [ ] FR-022: Auto-save workflow
- [ ] FR-023: Input security
- [ ] FR-024: Settings snapshots
- [ ] FR-025: CI/CD pipeline

**Target Start:** After M2 completion

---

### M2.6: Installed Version Control ⏳ PENDING
**Scope:** FR-026 — Version management for PWA

**Deliverables:**
- [ ] version.json generation
- [ ] Update detection
- [ ] Changelog display
- [ ] User-controlled updates
- [ ] Version history with rollback
- [ ] Release channels (stable/beta)

**Target Start:** After M2.5 completion

---

### M3: Full Career System ⏳ PENDING
**Scope:** All 24 careers, aging, mustering out, equipment

**Deliverables:**
- [ ] Complete career data for all 24 careers
- [ ] Enlistment/survival/advancement mechanics
- [ ] Aging system (Term 5+)
- [ ] Mustering out (cash + benefits)
- [ ] Equipment assignment

**Blocked on:** M2.6 completion

---

### M4: Persistence & Export ⏳ PENDING
**Scope:** Character library, batch generation, advanced export

**Deliverables:**
- [ ] IndexedDB character library
- [ ] Batch generation mode
- [ ] JSON/Markdown/Text export
- [ ] Import functionality
- [ ] Search and filter

---

## Session Log

### Session 1 — March 3, 2026: Project Initialization

**Goals:**
1. Adopt CE ShipGen structure (milestones, PRD, notes)
2. Rewrite PRD with M1-M4 milestone structure
3. Create PROJECT_NOTES.md
4. Update README with milestone table

**Completed:**
- ✅ Analyzed CE ShipGen PRD structure (Sections 11-12)
- ✅ Updated PRD.md with FR-021 through FR-026
- ✅ Created this PROJECT_NOTES.md
- ✅ Defined milestone boundaries

**Lessons Applied from CE ShipGen:**
| CE ShipGen Lesson | CECG Application |
|-------------------|------------------|
| M2.6 version control | Direct adoption as M2.6 |
| FR-021 install prompt | Direct adoption as FR-021 |
| FR-024 settings snapshots | Direct adoption as FR-024 |
| Auto-save pattern | Apply to character data + settings |
| Data table editors | Apply to careers, skills, equipment |
| CI/CD pipeline | Same GitHub Actions approach |
| URL routing (/settings/:section) | Same deep-linking pattern |
| Three-view architecture | Generate/Library/Settings |

**Key Insight:** The architecture patterns from CE ShipGen (data tables, version control, settings snapshots) translate directly to character generation. Both apps share:
- JSON data that users want to customize
- PWA installability concerns
- Need for variant rules/house rules
- Version management for installed users

**Next Session Goals:**
- Initialize React + Vite + TypeScript project
- Set up Tailwind CSS with space theme (consistent with CE ShipGen)
- Create basic layout components
- Deploy initial version to GitHub Pages

---

## Lessons Learned from CE ShipGen

### Critical Technical Lessons

#### 1. Vite Base Path Configuration
**Problem:** GitHub Pages serves from `/ce-shipgen/` subdirectory, but Vite defaults to root `/`  
**Impact:** White page after deployment, assets fail to load (404)  
**Solution:** Add `base: '/ce-shipgen/'` to `vite.config.ts`  
**CECG Application:** `base: '/cecharactergen/'` required before first deployment

#### 2. GitHub Pages Source vs Built Files
**Problem:** First deployment set Pages to use "main" branch, but built files are in "gh-pages"  
**Impact:** Site shows README instead of app  
**Solution:** Change Settings → Pages → Source to "gh-pages" branch  
**CECG Application:** Document deployment setup clearly, use GitHub Actions (FR-025)

#### 3. Node Modules in Deployment Branch
**Problem:** First deploy script included node_modules (2.7GB, push failed)  
**Impact:** Deployment failure, timeout  
**Solution:** Clean separation — deploy only `dist/` contents, never node_modules  
**CECG Application:** Use `peaceiris/actions-gh-pages@v3` which handles this correctly

#### 4. TypeScript Strict Mode
**Problem:** TS6133 errors — unused imports caught by strict mode  
**Impact:** Build failures during prototyping  
**Solution:** Either disable strict mode for prototyping or clean up imports immediately  
**CECG Application:** Start with strict mode off, enable before M3

#### 5. JSON/Table View State Sync
**Problem:** Dual JSON/Table views got out of sync (parsed array vs string)  
**Impact:** User edits in one view not reflected in other  
**Solution:** 
- `parsedData` state for table view
- `jsonContent` state for JSON view  
- `handleTableDataChange` converts between formats  
- Validation before view switching  
**CECG Application:** Reuse CE ShipGen's `TableDataEditor.tsx` pattern

#### 6. Data Loading Race Conditions
**Problem:** JSON editor showed "Loading..." or empty on first load  
**Impact:** Users see broken UI on initial visit  
**Solution:**
- `isLoading` state with spinner
- Default to `[]` not undefined  
- Error boundaries for fetch failures  
- Retry logic for failed fetches  
**CECG Application:** Implement proper loading states from M1

#### 7. Brace Balance in Large Files
**Problem:** `TS1128: Declaration or statement expected` — unbalanced braces  
**Impact:** Build failure, hard to debug  
**Solution:** Use `awk` or editor to count braces, rewrite file with correct structure  
**CECG Application:** Use ESLint with brace matching, TypeScript strict

#### 8. PWA Install Flow Complexity
**Problem:** Users didn't know app was installable, no "Installed" indicator  
**Impact:** Users miss offline capability  
**Solution:** FR-021 — Install prompt, "Installed" badge, offline indicator  
**CECG Application:** Implement FR-021 in M2.5 before M3

#### 9. Data Migration and Reset
**Problem:** Users wanted to "revert to web version" but unclear what that meant  
**Impact:** Confusion about localStorage vs canonical data  
**Solution:** FR-022 — Clear separation of "Factory defaults" vs "My version"  
**CECG Application:** Same data architecture layer (factory → live → snapshots → library)

#### 10. Milestone Checkpoints Prevent Rework
**Observation:** Human testing at M2.5 found issues before M3  
**Impact:** Saved time by catching bugs early  
**Solution:** Strict milestone completion criteria before proceeding  
**CECG Application:** M2.5 must pass all tests before starting M3

### What Worked Well (Carry Forward)

✅ **Modular Architecture** — 29 testable modules made development manageable  
✅ **Milestone Checkpoints** — Human testing before proceeding prevented major rework  
✅ **Documentation First** — Having consolidated rules made implementation clearer  
✅ **Vite + PWA** — Fast builds, easy deployment, offline capability  
✅ **Zustand** — Simple state management without Redux complexity  
✅ **Tailwind** — Rapid styling with custom space theme  
✅ **Table Editor** — Dual JSON/Table view provides flexibility for different user preferences

### Tooling Decisions

| Tool | CE ShipGen Status | CECG Decision |
|------|-------------------|---------------|
| Vite | ✅ Excellent | Use same |
| React 18 + TS | ✅ Good | Use same |
| Zustand | ✅ Excellent | Use same |
| React Router v7 | ✅ Works well | Use same |
| Tailwind | ✅ Excellent | Use same theme |
| GitHub Actions | ✅ Automated | Use same workflow |
| TypeScript Strict | ⚠️ Annoying during prototyping | Start loose, tighten at M3 |
| vitest | ⏳ Added late | Add from M1 |

---

## Test Page Requirements

### FR-027: Test Page for Development and Debugging

**Priority:** High — M1 Implementation  
**Rationale:** CE ShipGen lacked a dedicated test page, making debugging calculation errors and UI issues difficult. A test page accelerates development and provides regression testing.

**URL:** `/test` (development only, hidden in production or password-protected)

**Purpose:** 
- Unit test display for calculation functions
- Component isolation testing
- Data table validation
- UI element showcase
- Performance metrics
- Route testing

**Sections:**

**1. Calculation Tests** (`/test/calculations`)
Display results of core calculation functions:
```
Characteristic Modifier Tests:
  STR 7 → DM -1 ✓
  STR 8 → DM 0 ✓
  DEX 12 → DM +2 ✓
  
Aging Roll Tests:
  Term 5, END 8 (DM +0) → Roll 8 vs TN 6 ✓ PASS
  
Career Qualification Tests:
  Marine, STR 7, END 8 → Roll 7 + 1 (END DM) = 8 vs 6 ✓ QUALIFIED
```

**2. Component Showcase** (`/test/components`)
Isolated display of all UI components:
- CharacteristicTile (all states)
- SkillRow (various levels)
- CareerHistoryEntry
- EquipmentCard
- Loading states
- Error states

**3. Data Validation** (`/test/data`)
Validate all JSON data tables:
```
Careers Table:
  ✓ 24 careers loaded
  ✓ All have required fields (name, qualification, survival, advancement)
  ✓ All skill tables defined
  ⚠️ Drifter: missing description field
  
Equipment Table:
  ✓ 150 items loaded
  ✓ All have weight and cost
  ⚠️ 3 items missing tech level
```

**4. Route Testing** (`/test/routes`)
Test all URL routes:
```
/              → StartupScreen ✓
/generate      → CharacterGenerationView ✓
/library       → LibraryView ✓
/settings      → SettingsScreen ✓
/settings/json → SettingsScreen (JSON section) ✓
/test          → TestPage ✓ (meta!)
```

**5. Performance Metrics** (`/test/performance`)
Display timing data:
```
First Paint: 1.2s
Time to Interactive: 2.8s
Character Generation: 0.3s average
Bundle Size: 245KB gzipped
```

**6. LocalStorage Inspector** (`/test/storage`)
View and edit localStorage contents:
```
ce_char_live_careers    → [object] 24 items
ce_char_rules            → [object] {ruleSet: "mneme"}
ce_char_presets          → [array] 3 snapshots
ce_char_version_history  → [array] 2 versions
[Clear All] [Export] [Import]
```

**UI Layout:**
- Sidebar: Test sections (Calculations, Components, Data, Routes, Performance, Storage)
- Main area: Results display
- "Run All Tests" button at top
- Export test results as JSON

**Acceptance Criteria:**
- [ ] Test page accessible at `/test` in development
- [ ] Calculation tests show pass/fail for all core functions
- [ ] Component showcase displays all major UI components
- [ ] Data validation checks all JSON tables
- [ ] Route testing verifies all defined routes
- [ ] Performance metrics display actual timing data
- [ ] LocalStorage inspector shows current storage state
- [ ] "Run All Tests" button executes all test suites
- [ ] Export function downloads test results as JSON

**Benefits:**
- Catch calculation bugs immediately (aging, skills, etc.)
- Visual regression testing for UI components
- Data validation before releases
- Performance baseline tracking
- Easier debugging with localStorage visibility

---

## Next Steps

### Immediate (This Week)

1. **Initialize React Project**
   - Run `npm create vite@latest . -- --template react-ts`
   - Install dependencies (Tailwind, Zustand, React Router)
   - Configure Tailwind with CE ShipGen theme

2. **Create Branch Strategy**
   - `git checkout -b v1-vanilla` (preserve current)
   - `git checkout -b main-react` (new work)

3. **Port Basic Components**
   - StartupScreen (adapt from CE ShipGen)
   - Basic layout (Header, LayoutToggle)
   - PWA manifest and service worker

4. **Deploy M0.5**
   - Basic "Hello World" React app
   - Verify GitHub Pages deployment works
   - Test PWA installability

### M1 Scope (Week of March 3-10)

1. **Layout System**
   - Desktop/Phone toggle
   - Character sheet tile grid
   - Focus mode for tiles

2. **Basic Character Generation**
   - Roll 2D6 for 6 characteristics
   - Calculate modifiers
   - Display basic character sheet

3. **PWA Setup**
   - Manifest
   - Service worker
   - Install prompt (FR-021a)
   - "Installed" badge (FR-021b)

4. **Data Structure**
   - Create initial data/ directory
   - Basic races.json and careers.json stubs

### M2 Preparation

- Plan data table editor components
- Design settings screen layout
- Prepare schema validation utilities

---

## Cross-Reference to CE ShipGen

| CECG Component | CE ShipGen Reference |
|----------------|----------------------|
| StartupScreen.tsx | `/src/components/screens/StartupScreen.tsx` |
| SettingsScreen.tsx | `/src/components/screens/SettingsScreen.tsx` |
| LayoutToggle | `Header` component in App.tsx |
| TableDataEditor | `/src/components/settings/TableDataEditor.tsx` |
| SettingsSnapshots | `/src/components/settings/SettingsSnapshots.tsx` |
| tailwind.config.js | Copy from CE ShipGen |
| vite.config.ts | Adapt from CE ShipGen (change base path) |
| deploy.yml | Copy from CE ShipGen |

---

## Resources

- **CE ShipGen Repository:** `/home/justin/opencode260220/ce-shipgen/`
- **PRD:** `PRD.md` (Sections 11-12 for FR-021 to FR-026)
- **Project Notes:** `PROJECT_NOTES.md` (process reference)
- **Wiki:** https://github.com/justinaquino/cecharactergen/wiki

---

**Notes Status:** Living document — updated per session  
**Last Updated:** March 3, 2026 (Session 1)  
**Next Update:** After M1 deployment