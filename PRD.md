# CECG PRD v3.0
## Cepheus Engine Character Generator - Product Requirements Document

**Version:** 3.0
**Date:** March 6, 2026
**Status:** Ready for Implementation
**Based On:**
- Cepheus Engine SRD Chapter 1-5
- Mneme CE Character Creation Rules
- Lessons from CE ShipGen Project
- PRD v2.0 reorganization

---

## 1. EXECUTIVE SUMMARY

### 1.1 Vision Statement

Create a Progressive Web App (PWA) that implements the complete Cepheus Engine character generation system with Mneme CE rules integration. The app separates **data** (careers, species, skills, equipment) from the **Rules Engine** (characteristics, careers, aging, mustering), enabling third-party content creators to add, remove, or override content without modifying application logic.

### 1.2 Goals

- **Instant Generation:** Complete character creation in seconds
- **Data-Driven:** All content in editable JSON tables
- **Modular Rules:** CE vs Mneme variant toggles
- **Offline-First:** Full PWA functionality
- **Extensible:** Custom tables without code changes

### 1.3 Success Criteria

- [ ] Generate complete character in < 3 seconds
- [ ] Support all 24 CE careers with accurate rules
- [ ] Zero code changes required to add new content modules
- [ ] Offline-first PWA functionality
- [ ] Real-time calculations with zero errors
- [ ] Universal Character Export (JSON, Markdown, Plain Text)
- [ ] Mobile-responsive design (320px-2560px)

---

## 2. APP ARCHITECTURE

### 2.1 Tech Stack

| Component | Technology | Notes |
|-----------|------------|-------|
| Framework | React 18+ | Component-based architecture |
| Language | TypeScript | Type safety for calculations |
| Routing | React Router v7 | Persistent URLs, deep-linking |
| Build | Vite | Fast development, optimized builds |
| Styling | CSS Modules / Tailwind | Responsive design |
| PWA | vite-plugin-pwa | Service worker, manifest |
| Storage | IndexedDB + localStorage | Character library + settings |
| Deployment | GitHub Pages | Static hosting via gh-pages branch |

### 2.2 PWA Requirements

- Service worker for offline use
- Web App Manifest with icons
- Install prompt detection (`beforeinstallprompt`)
- Works offline after first load
- Passes Lighthouse PWA audit

### 2.3 GI7B UI Standard Reference

This app follows the **GI7B UI Standard** established by CE ShipGen:

- **Tile-based layouts** with collapsed/expanded/focused states
- **Desktop/Phone mode toggle** (manual, persisted)
- **Three-view architecture** (Generate/Library/Settings)
- **Auto-save on edit** (no explicit Save buttons in table view)
- **JSON + Table dual-view editors**
- **Version control** with user-initiated updates

### 2.4 Three-View Structure

The app is organized around three primary functional areas:

| View | URL | Purpose |
|------|-----|---------|
| **Generate** | `/generate` | Create characters with constraints |
| **Library** | `/library` | Browse, search, load saved characters |
| **Settings** | `/settings/:section` | Configure app, edit data tables, version control |

Additional routes:
| Route | Purpose |
|-------|---------|
| `/` | Startup screen (entry point) |
| `/character/:id` | View specific character |
| `/test/:section` | Development testing interface |

### 2.5 URL Routing & Navigation Map

```
/                           → StartupScreen (entry point)
│
├── /generate               → CharacterGenerationView
│   └── ?template=marine    → Pre-select career filter
│
├── /library                → LibraryView
│   └── ?career=marine      → Filter by career
│
├── /character/:id          → CharacterView (specific character)
│
├── /settings               → SettingsScreen (overview)
│   ├── /settings/layout    → Layout preferences
│   ├── /settings/rules     → Rule toggles (CE/Mneme)
│   ├── /settings/careers   → Career enable/disable
│   ├── /settings/tables    → JSON table editor
│   ├── /settings/tables-in-play → Active table selection
│   ├── /settings/data      → Import/export/reset
│   └── /settings/version   → Version control
│
└── /test                   → TestPage (development)
    ├── /test/calculations  → Calculation tests
    ├── /test/components    → Component showcase
    ├── /test/data          → Data validation
    ├── /test/routes        → Route testing
    ├── /test/performance   → Performance metrics
    └── /test/storage       → LocalStorage inspector
```

**Navigation Rules:**
- Startup screen (`/`) has NO header — clean entry point
- All other screens have persistent header navigation
- Browser back button works naturally between views
- Direct URL access works (bookmarkable)
- URL updates when switching views
- Refreshing page preserves current view

### 2.6 Data Layer Overview

| Layer | Storage | Contains | Reset Action |
|-------|---------|----------|--------------|
| Factory defaults | `data/*.json` (shipped) | Canonical tables | N/A (read-only) |
| Live working state | `localStorage` (`ce_char_live_*`) | Current tables + rules | "Reset to Defaults" |
| Named snapshots | `localStorage` (`ce_char_presets`) | Saved settings states | Delete snapshot |
| Custom tables | `localStorage` (`ce_char_tables_custom`) | User-created tables | Delete table |
| Tables in play | `localStorage` (`ce_char_tables_in_play`) | Active table per category | Reset to canonical |
| Character library | IndexedDB | Saved characters | Never auto-reset |

---

## 3. UI & NAVIGATION

### 3.1 Header

**Layout (all non-startup screens):**
```
┌────────────────────────────────────────────────────────────┐
│ [Logo]  CharacterGen   [Generate] [Library] [Settings] [📱]│
└────────────────────────────────────────────────────────────┘
```

**Elements:**
- **Logo** (`gitb_gi7b_logo.png`) → Returns to Startup (`/`)
- **"Generate"** → Navigate to `/generate`
- **"Library"** → Navigate to `/library`
- **"Settings"** → Navigate to `/settings`
- **Layout Toggle (📱/🖥️)** → Switch between Phone/Desktop mode
- **"Installed" badge** (green dot) — Shows when in standalone PWA mode

**Responsive Behavior:**
- Desktop: All buttons with text labels
- Tablet: Icons + text
- Phone: Icon-only in header

### 3.2 Layout Toggle

**Location:** Header bar, right side
**Icon:** Desktop monitor 🖥️ or Phone 📱
**Behavior:**
- Manual toggle (user clicks to switch)
- Auto-detect on first load based on viewport width
- Persists to `ce_char_layout_mode` in localStorage
- Instant switch, no page reload

**Desktop Mode (≥768px):**
- Three columns: Parameters (20%), Character Sheet (50%), Log (30%)
- Tiles arranged side-by-side in grid (2-3 per row)

**Phone Mode (<768px):**
- Single column, all tiles stacked vertically
- Parameters panel collapsible at top
- Bottom action bar: Generate, Save, Settings

### 3.3 Startup Screen

**URL:** `/`
**Purpose:** Entry point with clear navigation to three main views

```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│                    [GI7B Logo]                             │
│                                                            │
│           CEPHEUS ENGINE CHARACTER GENERATOR               │
│                                                            │
│              "Create characters instantly"                 │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │                                                      │ │
│  │   [  +  GENERATE CHARACTER  ]   ← Primary action     │ │
│  │                                                      │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ┌────────────────────┐  ┌────────────────────┐           │
│  │  📚 Character      │  │  ⚙️ Settings       │           │
│  │     Library        │  │                    │           │
│  │  (32 characters    │  │  Customize rules,  │           │
│  │   saved)           │  │  edit careers,     │           │
│  │                    │  │  manage versions   │           │
│  └────────────────────┘  └────────────────────┘           │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │  📥 Install App  ← Only shows if PWA installable     │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│         Version 0.3.0-dev | GI7B                           │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Elements:**
1. **Branding** — Logo (`gitb_gi7b_logo.png`), app name, tagline
2. **Primary Action** — "+ GENERATE CHARACTER" (large, prominent)
3. **Secondary Actions** — Library card, Settings card
4. **PWA Install** — Conditional (only if installable)
5. **Version Info** — Current version at bottom

### 3.4 Tile System

Character sheet displayed as tiles with four states:

**1. Inactive (Collapsed)** — Default state
```
┌─────────────────────────────────────────────────┐
│ ▶ Header                              [Focus 🔍] │
│ Name: John Smith | Species: Human | Career: —   │
└─────────────────────────────────────────────────┘
```

**2. Active (Expanded)** — Click header to expand
```
┌─────────────────────────────────────────────────┐
│ ▼ Header                              [🔍]      │
│ Name: John Smith                                │
│ Species: Human                                  │
│ Career: Marine (2 terms)                        │
│ Rank: Lieutenant                                │
│ Age: 26                                         │
│ [Edit] [Randomize]                              │
└─────────────────────────────────────────────────┘
```

**3. Focused (Full-Screen Overlay)** — Click Focus button
- Desktop: Tile expands to 70% width, others shrink to headers
- Phone: Tile goes full-screen
- ESC key or X button to exit

**4. Completed** — After valid data entered
```
┌─────────────────────────────────────────────────┐
│ ✓ Header                              [Focus]   │
│ Name: John Smith | Species: Human | Career: Marine│
└─────────────────────────────────────────────────┘
```
- Green checkmark indicator

**Character Sheet Tiles (6 tiles):**
1. **Header Tile** — Name, Species, Career Summary, Age, Terms
2. **Characteristics Tile** — STR, DEX, END, INT, EDU, SOC with modifiers
3. **Skills Tile** — Grouped by category (Personal, Service, Specialist, Advanced)
4. **Career History Tile** — Timeline of career terms with ranks and events
5. **Equipment Tile** — Categorized gear (Weapons, Armor, Tools, Personal)
6. **Connections & Background Tile** — Homeworld, allies, enemies, wounds

### 3.5 Generate View

**URL:** `/generate`
**Purpose:** Primary interface for creating characters

**Desktop Layout:**
```
┌──────────────┐ ┌──────────────────────┐ ┌──────────────┐
│ Parameters   │ │ CHARACTER SHEET      │ │     Log      │
│ (20%)        │ │ (50%)                │ │   (30%)      │
│              │ │                      │ │              │
│ Species      │ │ [Tiles in grid]      │ │ Generation   │
│ Career       │ │                      │ │ history      │
│ Constraints  │ │                      │ │ Roll-by-roll │
└──────────────┘ └──────────────────────┘ └──────────────┘
```

**Key Features:**
- One-click "Generate" produces complete character
- Constraints panel: species, career filters, tech level limits
- Real-time updates as generation progresses
- Focus mode for individual tiles
- "Random Everything" toggle for instant generation

### 3.6 Library View

**URL:** `/library`
**Purpose:** Browse, search, and manage saved characters

**Features:**
- Search/Filter Bar — Name, career, species, date
- Grid view (cards) and List view (table) toggle
- Sort by: Name, Date, Career, Terms, Age
- Quick actions: Load, Duplicate, Export, Delete
- Batch operations: Export multiple, delete group

### 3.7 Settings View

**URL:** `/settings` and `/settings/:section`
**Purpose:** Configure app, edit data tables, manage versions

See **Section 4** for complete Settings documentation.

---

## 4. SETTINGS — STRUCTURE & MODULARITY

### 4.1 Settings Screen Layout

```
┌────────────────────────────────────────────────────────────┐
│  [Logo]  CharacterGen     [Generate] [Library] [Settings]  │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  ┌────────────┐  ┌──────────────────────────────────────┐ │
│  │  Sidebar   │  │          Content Area                │ │
│  │            │  │                                      │ │
│  │ ○ Layout   │  │  [Active Section Content]            │ │
│  │ ○ Rules    │  │                                      │ │
│  │ ○ Careers  │  │  [Tables, Editors, Controls]         │ │
│  │ ● Tables   │  │                                      │ │
│  │ ○ In Play  │  │                                      │ │
│  │ ○ Data     │  │                                      │ │
│  │ ○ Version  │  │                                      │ │
│  └────────────┘  └──────────────────────────────────────┘ │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Sidebar Icons:**
- 📐 Layout
- 📋 Rules
- 🎖️ Careers
- 📝 Tables (JSON Editor)
- 🎲 Tables In Play
- 💾 Data
- 🔄 Version

### 4.2 Settings Sections

#### 4.2.1 Layout Settings (`/settings/layout`)

- Desktop/Phone mode toggle
- Theme: Dark/Light/Auto
- Animation preferences
- Font size adjustments

#### 4.2.2 Rules Settings (`/settings/rules`)

**Master Toggle:** Standard CE / Mneme Variant

**Individual Rule Toggles:**
| Toggle | CE Default | Mneme Variant |
|--------|------------|---------------|
| Unified Roll System | Off | On |
| Automatic Re-Enlistment | Off | On |
| Aging Start | Term 4 | Term 5 |
| Anagathics | RAW (complex) | Simplified |
| Drifter Qualification | Roll required | Auto |
| PSI Characteristic | Disabled | Enable toggle |

**Selectable Table Variants:**
- SOC Table: CE (titles) vs Mneme (economic tiers)
- Homeworlds Table: CE vs Mneme
- Anagathics Table: CE vs Mneme

#### 4.2.3 Career Management (`/settings/careers`)

**Purpose:** Toggle which careers are active for generation

```
┌─────────────────────────────────────────────────────────┐
│ CAREER MANAGEMENT — 22 of 24 Active                     │
├─────────────────────────────────────────────────────────┤
│ [Filter: All ▼] [Search] [✓ Enable All] [✗ Disable All] │
├─────────────────────────────────────────────────────────┤
│ ☑ Drifter              [Civilian]   [🎲 Qual: Auto]     │
│ ☑ Marine               [Military]   [🎲 Qual: 6+]       │
│ ☑ Scout                [Exploration] [🎲 Qual: 5+]      │
│ ☐ Noble                [Elite]      [🎲 Qual: 10+]      │ ← Inactive
│ ☑ Pirate               [Criminal]   [🎲 Qual: 6+]       │
│ ☐ Physician            [Professional] [🎲 Qual: 8+]     │ ← Inactive
│ ...                                                      │
├─────────────────────────────────────────────────────────┤
│ [Reset to All Active] [Save]                            │
└─────────────────────────────────────────────────────────┘
```

**Key Points:**
- All 24 careers stored in ONE file: `careers.json`
- Toggle `enabled` field per career
- Disabled careers hidden from generation dropdown
- Quick actions: Enable All, Disable All, Reset

### 4.3 JSON Table Editor (`/settings/tables`)

**Dual-View Editor (like CE ShipGen):**

```
┌─────────────────────────────────────────────────────────────┐
│ Table: [careers.json ▼]                    [JSON] [Table]   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ TABLE VIEW:                                                 │
│ ┌────────┬────────────┬──────────┬───────────┬───────────┐ │
│ │ ID     │ Name       │ Category │ Qual. TN  │ Enabled   │ │
│ ├────────┼────────────┼──────────┼───────────┼───────────┤ │
│ │ drifter│ Drifter    │ Civilian │ Auto      │ ☑         │ │
│ │ marine │ Marine     │ Military │ 6+        │ ☑         │ │
│ │ scout  │ Scout      │ Explore  │ 5+        │ ☑         │ │
│ └────────┴────────────┴──────────┴───────────┴───────────┘ │
│                                                             │
│ — OR —                                                      │
│                                                             │
│ JSON VIEW:                                                  │
│ {                                                           │
│   "drifter": {                                              │
│     "id": "drifter",                                        │
│     "name": "Drifter",                                      │
│     ...                                                     │
│   }                                                         │
│ }                                                           │
│                                                             │
│ [Validate] [Apply] [Export] [Save As Custom Table]          │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- Select table from dropdown (organized by category)
- Shows ALL tables: Canonical + Custom (marked with "[Custom]" badge)
- Real-time schema validation (red squiggles on errors)
- Table view: Auto-save on cell commit
- JSON view: Explicit "Apply" button (mid-edit JSON may be invalid)
- "Save As New Custom Table" when editing canonical

### 4.4 Tables In Play (`/settings/tables-in-play`)

**Purpose:** Select which table is active per category

```
┌────────────────────────────────────────────────────────────┐
│ TABLES IN PLAY                                             │
├────────────────────────────────────────────────────────────┤
│                                                            │
│ SPECIES TABLE                                              │
│ ● Canonical Species (default)                              │
│   [Switch ▼] [Edit JSON] [Export]                          │
│                                                            │
│ CAREERS TABLE                                              │
│ ● Cepheus Engine Core Careers (canonical)                  │
│   [Switch ▼] [Edit JSON] [Export]                          │
│ ○ My Custom Campaign Careers (custom)                      │
│   [Switch ▼] [Edit JSON] [Export] [Delete]                 │
│                                                            │
│ AGING TABLE                                                │
│ ○ Canonical Aging (default)                                │
│ ● House Rule: Gentler Aging (custom)  ← Active             │
│   [Switch ▼] [Edit JSON] [Export] [Delete]                 │
│                                                            │
│ [+ Add New Custom Table]                                   │
├────────────────────────────────────────────────────────────┤
│ Legend: ● Active (used in generation)                      │
│         ○ Inactive (available but not selected)            │
└────────────────────────────────────────────────────────────┘
```

**Table Categories:**
| Category | Canonical Table | Custom Allowed |
|----------|-----------------|----------------|
| Species | `species.json` | ✅ |
| Cultures/Names | `cultures_names.json` | ✅ |
| Backgrounds | `backgrounds.json` | ✅ |
| Homeworlds | `homeworlds.json` | ✅ |
| Careers | `careers.json` | ✅ |
| Draft | `draft.json` | ✅ |
| Survival Mishaps | `survival_mishaps.json` | ✅ |
| Injury | `injury.json` | ✅ |
| Medical Bills | `medical_bills.json` | ✅ |
| Aging | `aging.json` | ✅ |
| Anagathics | `anagathics.json` | ✅ |
| Retirement Pay | `retirement_pay.json` | ✅ |
| SOC Table | `soc_table.json` | ✅ |
| Equipment | `equipment.json` | ✅ |
| Skills | `skills.json` | ✅ |
| Rules | `rules.json` | ✅ |

**Key Rule:** Each category has exactly ONE table "in play" at a time.

#### 4.4.1 Add Custom Table

**Flow:**
1. Click "+ Add New Custom Table"
2. Select category, enter name
3. Choose: Start from Blank / Duplicate Canonical / Import JSON
4. New table created with unique ID
5. Auto-switches to new table as active

#### 4.4.2 Export/Import Custom Tables

**Export:**
- Downloads as `cecg-[category]-[name]-[date].json`
- Includes metadata: category, name, created date, source version

**Import:**
- Validates JSON syntax, required fields, schema
- On success: Adds to table list

### 4.5 Data Management (`/settings/data`)

- **Export Settings Snapshot** — Save current tables + rules as named config
- **Import Settings Snapshot** — Load saved or shared configuration
- **Export All Data** — Complete backup (settings + characters + custom tables)
- **Import All Data** — Restore from backup
- **Reset to Factory Defaults** — Clear customizations, restore canonical
  - ⚠️ Confirmation required
  - Never touches character library

### 4.6 Settings Snapshots

**Concept:** Like save slots in a game. Live state is active game. Snapshots are save files.

**Storage:** `ce_char_presets` in localStorage

**Snapshot Schema:**
```json
{
  "id": "260306:143045",
  "name": "Hard Science Campaign",
  "createdAt": "2026-03-06T14:30:45Z",
  "updatedAt": "2026-03-06T14:30:45Z",
  "tables": { ... },
  "rules": { ... }
}
```

**Default name format:** `YYMMDD:HHMMSS` (editable)

**Actions:**
- Save Snapshot (captures full current state)
- Load Snapshot (replaces live state)
- Rename Snapshot
- Export Snapshot (download as JSON)
- Import Snapshot
- Delete Snapshot

**Maximum:** 50 snapshots

### 4.7 Auto-Save & Data Architecture

**Core Principle:** The app always auto-saves. No explicit Save buttons in table view.

**Auto-Save Behavior:**
- Table view: Save to localStorage on every cell commit
- JSON view: Explicit "Apply" button (handles invalid mid-edit JSON)
- Show brief "Saved" toast (1.5s) after auto-save

**Reset Live State:**
- Clears all `ce_char_live_*` keys from localStorage
- Never touches character library
- Requires confirmation

### 4.8 Version Control (`/settings/version`)

**Display:**
```
Current Version: 0.3.0 (stable)
Build: March 6, 2026 14:30 UTC
```

**Features:**
- Current version display with build date
- Update detection (check remote `version.json`)
- "Update Available" indicator (amber pill)
- Changelog preview before updating
- User-controlled update (never forced)
- Version history (last 3 versions)
- Rollback capability
- Release channel toggle (Stable/Beta)

**Version Manifest (`version.json`):**
```json
{
  "version": "0.3.0",
  "buildTimestamp": "2026-03-06T14:30:00Z",
  "channel": "stable",
  "changelog": ["Reorganized PRD v3.0", "..."],
  "minimumCompatibleVersion": "0.2.5"
}
```

**Data Preservation:**
Updates/rollbacks NEVER affect user data:
- ✅ Character library (IndexedDB)
- ✅ Settings snapshots
- ✅ Live working state
- ✅ Custom tables
- ✅ Rule preferences

### 4.9 PWA Install & Offline Behavior

**Install Prompt:**
- Detect via `beforeinstallprompt` event
- Show "Install App" button on Startup when installable
- iOS: Show manual instructions
- Suppress after install

**Running-Mode Indicator:**
- Detect standalone via `window.matchMedia('(display-mode: standalone)')`
- Show "Installed" badge (green dot) in header when standalone

**Offline Status:**
- "Offline — using local data" indicator (amber)
- Disable update check when offline
- All generation works offline

---

## 5. MILESTONE PLAN

### 5.1 Milestone Overview

| Milestone | Name | Description | Gate |
|-----------|------|-------------|------|
| **M0** | **Data Authoring** | Author all JSON data tables | **Must complete before M1 coding begins** |
| M1 | UI Foundation | Basic layout, tiles, PWA setup, deploy | Working skeleton deployed to GitHub Pages |
| M2 | Settings & Tables | JSON editors, career enable/disable, rule toggles | User can customize all data |
| M2.5 | Install UX & Snapshots | PWA install prompt, auto-save, settings snapshots | Quality of life before complex features |
| M2.6 | Version Control | Update detection, changelog, user-controlled updates | PWA lifecycle complete |
| M3 | Full Career System | All 24 careers, aging, mustering out, full generation | Complete character generation working |
| M4 | Persistence & Export | Character library, batch generation, advanced export | Full app feature set |

### 5.2 M0: Data Authoring — Prerequisite Gate

**M0 is not a code milestone. It is a content authoring milestone.** No M1 coding should begin until M0 is complete. The generation engine is entirely data-driven — without accurate data tables, the engine cannot be verified.

**Why M0 must come first:**
- Career rules (qualification targets, skill tables, rank titles, benefits) are too complex to stub and retrofit
- Incorrect data baked early causes cascading errors through the generation logic
- The JSON schemas are defined in `DATA_ARCHITECTURE.md` — authoring validates the schema design before implementation
- M3 (full 24 careers) is blocked until career data exists; doing M0 now prevents a mid-project data authoring crisis

**M0 Deliverables:** All files authored, validated against their schemas (DA-3.1 through DA-3.18), and placed in `public/data/`:

| File | Schema | Priority | Status |
|------|--------|----------|--------|
| `rules.json` | DA-3.18 | Critical | ⬜ |
| `species.json` | DA-3.1 | Critical | ⬜ |
| `homeworlds.json` | DA-3.6 | Critical | ⬜ |
| `backgrounds.json` | DA-3.4 | Critical | ⬜ |
| `careers.json` | DA-3.7 | Critical | ⬜ (all 24 careers) |
| `draft.json` | DA-3.8 | Critical | ⬜ |
| `survival_mishaps.json` | DA-3.9 | Critical | ⬜ |
| `injury.json` | DA-3.10 | Critical | ⬜ |
| `medical_bills.json` | DA-3.11 | High | ⬜ |
| `aging.json` | DA-3.12 | Critical | ⬜ |
| `anagathics.json` | DA-3.13 | High | ⬜ |
| `retirement_pay.json` | DA-3.14 | High | ⬜ |
| `soc_table.json` | DA-3.15 | Medium | ⬜ |
| `skills.json` | DA-3.17 | High | ⬜ |
| `equipment.json` | DA-3.16 | Medium | ⬜ |
| `cultures_names.json` | DA-3.2 | High | ⬜ |
| `name_generation_rules.json` | DA-3.3 | High | ⬜ |

**M0 Completion Criteria:**
- [ ] All 17 data files exist in `public/data/`
- [ ] All 24 careers fully authored in `careers.json` (not stubs)
- [ ] Each file validates against its schema (no missing required fields)
- [ ] `rules.json` correctly encodes both CE and Mneme rulesets
- [ ] `species.json` has at minimum: Terrestrial Human, Low-G Human, Esper, Merfolk
- [ ] Name pools in `cultures_names.json` are real (no placeholder arrays)
- [ ] A human review pass confirms career data matches wiki source (MECH-B)

**M0 tooling note:** Use the Test Page (`/test/data`) from FR-027 to validate all tables once M1 is deployed. Until then, validate with a JSON schema linter.

### 5.3 M1: UI Foundation

**Scope:** Basic app shell, PWA setup, character sheet display, single-button generation (characteristics only).

**Depends on:** M0 complete (data files must exist to load into the app).

**Deliverables:**
- React + Vite + TypeScript + Tailwind project initialized
- All routes from Section 2.5 rendering (stubs acceptable)
- Header and Startup Screen per Section 3.1–3.3
- Tile system (Section 3.4) — 6 tiles, collapsed/expanded/focused states
- Desktop/Phone layout toggle
- Basic characteristic roll (2D6 × 6) displayed on sheet
- PWA manifest + service worker
- Deployed to GitHub Pages at `https://xunema.github.io/cecharactergen/`
- Test page at `/test` (FR-027)

### 5.4 M2: Settings & Data Tables

**Scope:** All settings screens, JSON/Table dual-view editors, career enable/disable, rule toggles.

**Depends on:** M1 complete.

**Deliverables:**
- Settings sidebar with all 7 sections (Section 4)
- JSON Table Editor with dual-view (FR-011)
- Career Management toggle UI (FR-014)
- Rules toggle (CE/Mneme) (FR-013)
- Tables In Play selector (FR-015)
- Auto-save to localStorage
- All data tables loadable and editable in the editor

### 5.5 M2.5: Install UX & Snapshots

**Scope:** FR-016 through FR-019 — PWA install, auto-save workflow, settings snapshots.

**Depends on:** M2 complete.

### 5.6 M2.6: Version Control

**Scope:** FR-026 — version.json, update detection, user-controlled updates.

**Depends on:** M2.5 complete.

### 5.7 M3: Full Career System

**Scope:** Complete character generation — all 24 careers, career term loop, aging, mustering out, name generation.

**Depends on:** M2.6 complete AND M0 complete (all 24 careers authored).

### 5.8 M4: Persistence & Export

**Scope:** IndexedDB character library, batch generation, JSON/Markdown/Text export, import, search/filter.

**Depends on:** M3 complete.

---

## 6. USER INTERFACE FLOW

### 6.1 First-Time User Flow

```
[User arrives at app URL]
        │
        ▼
┌─────────────────┐
│  Startup (/)    │  ← No header
│  Logo + tagline │
│  [GENERATE] btn │
│  [Install App]  │  ← PWA install prompt if available
└────────┬────────┘
         │  Click "GENERATE CHARACTER"
         ▼
┌─────────────────────────────────────────────────────────┐
│  Generate View (/generate)                               │
│                                                          │
│  ┌──────────────┐  ┌──────────────────┐  ┌───────────┐  │
│  │ Parameters   │  │  Character Sheet  │  │    Log    │  │
│  │              │  │  (tiles: blank)   │  │  (empty)  │  │
│  │ Species: All │  │                  │  │           │  │
│  │ Career: Any  │  │  [click Generate] │  │           │  │
│  └──────────────┘  └──────────────────┘  └───────────┘  │
└──────────────────────────┬──────────────────────────────┘
                           │  Click "Generate"
                           ▼
┌─────────────────────────────────────────────────────────┐
│  Generation in progress (step-by-step log fills right)  │
│  Tiles populate as each step completes                   │
│  (Characteristics → Background → Career → Muster Out)   │
└──────────────────────────┬──────────────────────────────┘
                           │  Generation complete
                           ▼
┌─────────────────────────────────────────────────────────┐
│  Complete Character Sheet displayed in tiles             │
│  [Save to Library]  [Export]  [Re-generate]              │
└─────────────────────────────────────────────────────────┘
         │  Click "Save"
         ▼
    Character auto-saved to library
    Toast: "Saved to Library"
```

### 6.2 Return User Flow

```
[User opens installed PWA]
        │
        ▼
┌─────────────────┐
│  Startup (/)    │
│  Library: N     │  ← Live character count
│  [GENERATE]     │
│  [Library →]    │
└────────┬────────┘
         │  Click "Library"
         ▼
┌─────────────────────────────────────────────────────────┐
│  Library (/library)                                      │
│  Search: ____________  [Grid] [List]  Sort: [Date ▼]    │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐               │
│  │ Smith    │  │ Tanaka   │  │ Williams │               │
│  │ Marine-3 │  │ Scout-2  │  │ Drifter  │               │
│  │ [Load]   │  │ [Load]   │  │ [Load]   │               │
│  └──────────┘  └──────────┘  └──────────┘               │
└──────────────────────────┬──────────────────────────────┘
                           │  Click "Load"
                           ▼
┌─────────────────────────────────────────────────────────┐
│  Generate View — character loaded into sheet             │
│  All tiles populated; can export or re-generate          │
└─────────────────────────────────────────────────────────┘
```

### 6.3 Settings Customization Flow

```
[User wants to restrict careers for their campaign]
        │
        ▼
  Header → [Settings]
        │
        ▼
┌─────────────────────────────────────────────────────────┐
│  Settings (/settings)  ← Overview landing               │
│  Sidebar: Layout / Rules / Careers / Tables / ...        │
└────────┬────────────────────────────────────────────────┘
         │  Click "Careers" in sidebar
         ▼
┌─────────────────────────────────────────────────────────┐
│  Career Management (/settings/careers)                   │
│  Toggle careers on/off; changes auto-save                │
└────────┬────────────────────────────────────────────────┘
         │  OR Click "Rules" in sidebar
         ▼
┌─────────────────────────────────────────────────────────┐
│  Rules (/settings/rules)                                 │
│  Master toggle: CE Standard / Mneme Variant              │
│  Individual toggles: anagathics, aging start, etc.       │
│  Changes take effect immediately on next generation      │
└─────────────────────────────────────────────────────────┘
         │  OR Click "Tables" in sidebar
         ▼
┌─────────────────────────────────────────────────────────┐
│  JSON Table Editor (/settings/tables)                    │
│  Select table → Edit in Table or JSON view → Auto-save  │
│  "Save As Custom Table" to preserve canonical            │
└─────────────────────────────────────────────────────────┘
         │  User clicks Generate from header
         ▼
    New character generated using updated settings
```

### 6.4 Character Generation — UI Step by Step

This describes what the user **sees** as the engine runs MECH-11. The generation log (right panel) fills in real time; tiles update as each step completes.

| Step | User Sees | Tile Updated |
|------|-----------|-------------|
| 1 | "Species: Terrestrial Human" in log | Header Tile |
| 2 | STR/DEX/END/INT/EDU/SOC rolled with DM | Characteristics Tile |
| 3 | Homeworld: High Tech World; Background: Computer-0 | Connections Tile |
| 4 | Pre-career education: skipped (or University) | Header Tile |
| 5 | "Term 1: Marine — Qualified (roll 8 vs 6+)" | Career History Tile |
| 5 | "Survival: Passed (roll 9 vs 6+)" | Career History Tile |
| 5 | "Advanced to Rank 1: Lieutenant" | Header Tile |
| 5 | "Skills: Gun Combat 1" | Skills Tile |
| 5 | "Term 2: Marine — Re-enlisted..." | Career History Tile |
| 5a | (if mishap) "Mishap: Honorably discharged" | Career History Tile |
| 6 | "Aging: Term 4 — No effect (roll 8 vs 6)" | Characteristics Tile |
| 7 | "Mustering Out: 2 rolls — Cr15,000, Weapon" | Equipment Tile |
| 8 | "Equipment: Laser Pistol" | Equipment Tile |
| 9 | "Name: John Smith" | Header Tile |
| 10 | Character complete — all tiles populated | All Tiles |

**Log format:** Each entry shows: step name, relevant roll (2D6 result + DM + TN), and outcome in plain language.

### 6.5 Offline Behavior

```
[User is offline]
        │
        ▼
┌─────────────────┐
│  Amber banner:  │
│  "Offline —     │
│   local data"   │
└────────┬────────┘
         │
         ▼
  All generation works (data is local)
  Library read/write works (IndexedDB)
  Update check disabled (no network)
  Version badge: "Offline" instead of channel
```

---

## 7. DATA DIRECTORY STRUCTURE

The `public/data/` directory contains all factory-default JSON files shipped with the app. These are read-only at runtime — user edits are stored in `localStorage` as live state.

```
public/
  data/
    rules.json               ← Active ruleset + variant toggles (DA-3.18)
    species.json             ← 4+ species definitions (DA-3.1)
    homeworlds.json          ← World types by trade code (DA-3.6)
    backgrounds.json         ← Pre-career backgrounds (DA-3.4)
    careers.json             ← All 24 careers (DA-3.7)
    draft.json               ← CE and Mneme draft tables (DA-3.8)
    survival_mishaps.json    ← 1D6 mishap table (DA-3.9)
    injury.json              ← 1D6 injury table (DA-3.10)
    medical_bills.json       ← Employer coverage by career (DA-3.11)
    aging.json               ← CE and Mneme aging rules (DA-3.12)
    anagathics.json          ← CE and Mneme anagathic drug rules (DA-3.13)
    retirement_pay.json      ← Pension table (DA-3.14)
    soc_table.json           ← SOC titles and economic tiers (DA-3.15)
    equipment.json           ← Weapons, armor, gear (DA-3.16)
    skills.json              ← All skills with cascade info (DA-3.17)
    cultures_names.json      ← Name pools by culture (DA-3.2)
    name_generation_rules.json ← Name format patterns (DA-3.3)
  version.json               ← Generated at build time (prebuild script)
```

**Loading strategy:** The app fetches each JSON file on first use, stores in localStorage as `ce_char_live_<filename>`. Subsequent loads use localStorage. "Reset to Defaults" re-fetches from `public/data/`.

---

## 8. FUNCTIONAL REQUIREMENTS REGISTRY

Each FR follows this format: ID, milestone, priority, dependencies, description, acceptance criteria, and (where needed) clarification blocks for the author to fill in.

---

## M0: DATA AUTHORING REQUIREMENTS

> **GATE:** All FR-M0 items must be checked off before M1 coding begins. These are content authoring tasks, not code tasks.

---

### FR-M0-01: Author `careers.json` — All 24 Careers
**Milestone:** M0 | **Priority:** Critical | **Depends On:** DATA_ARCHITECTURE.md §DA-3.7, MECH-6

**Description:** Populate `careers.json` with complete data for all 24 CE careers. Each entry must include: id, name, enabled, category, description, qualification (target + DM + auto flag), survival (target + DM), commission (has flag + target + DM), advancement (target + DM), reenlistment, ranks (0–6 with title and bonus skill), skillTables (personal/service/specialist/advanced), benefits (material 1–7 and cash 1–7), events, mishaps.

**Source:** MECH-6.1 career list; wiki source MECH-B (Chapter 1); Mneme Career Cards PDF.

**Acceptance Criteria:**
- [ ] All 24 careers present by id (see MECH-6.1 for full list)
- [ ] Drifter, Marine, Scout fully complete (these are M1 generation targets)
- [ ] Remaining 21 careers fully complete (not stubs) before M3
- [ ] Mneme Quick Fix values applied where applicable (MECH-2.2, MECH-2.3)
- [ ] `_metadata.careersList` array lists all 24 careers
- [ ] Validates against DA-3.7 schema

---

### FR-M0-02: Author `species.json`
**Milestone:** M0 | **Priority:** Critical | **Depends On:** DATA_ARCHITECTURE.md §DA-3.1, MECH-4.5

**Description:** Populate `species.json` with at minimum 4 species: Terrestrial Human (enabled), Low-G Human (enabled, toggle-gated), Esper (disabled by default), Merfolk (disabled by default).

**Acceptance Criteria:**
- [ ] Terrestrial Human: all characteristics `2d6`, no modifiers, enabled
- [ ] Low-G Human: STR `dis1`, DEX `adv1`, END `dis1`, SOC `2d6-1`, enabled, `backgroundsAllowed: "space_only"`
- [ ] Esper: psionic trait, enabled false
- [ ] Merfolk: amphibious/aquatic/water_dependent traits, enabled false
- [ ] All roll specs use notation defined in MECH-4.5

---

### FR-M0-03: Author `rules.json`
**Milestone:** M0 | **Priority:** Critical | **Depends On:** DATA_ARCHITECTURE.md §DA-3.18, MECH-2

**Description:** Author `rules.json` with both `ce_standard` and `mneme` rulesets fully defined, plus all toggles.

**Acceptance Criteria:**
- [ ] `activeRuleset` defaults to `"mneme"`
- [ ] Both rulesets have all fields from DA-3.18 schema
- [ ] All toggles present: psionics, lowGHuman, preCareerEducation, allowDeath, maxTerms
- [ ] Mneme Quick Fix values correctly encoded (MECH-2.2)

---

### FR-M0-04: Author `homeworlds.json`, `backgrounds.json`
**Milestone:** M0 | **Priority:** Critical | **Depends On:** DA-3.6, DA-3.4, MECH-5

**Description:** Populate world types and background entries with homeworld skill mappings per MECH-5.2.

**Acceptance Criteria:**
- [ ] `homeworlds.json`: at minimum 5 world types with trade codes and skill options for both CE and Mneme variants
- [ ] `backgrounds.json`: at minimum 5 background entries covering planetary and space categories
- [ ] All homeworld trade codes from MECH-5.2 represented

---

### FR-M0-05: Author Mechanics Tables (`injury.json`, `survival_mishaps.json`, `aging.json`, `anagathics.json`, `retirement_pay.json`, `medical_bills.json`)
**Milestone:** M0 | **Priority:** Critical | **Depends On:** DA-3.9–DA-3.14, MECH-6.5, MECH-7, MECH-8, MECH-9

**Description:** Author all mechanic lookup tables. These are small, well-defined tables from the rules.

**Acceptance Criteria:**
- [ ] `survival_mishaps.json`: 6 entries (roll 1–6) matching MECH-6.5 mishap table exactly
- [ ] `injury.json`: 6 entries (roll 1–6) matching MECH-7.1 exactly; crisis rules included
- [ ] `aging.json`: CE aging table (8 result rows) and Mneme formula both present per MECH-8.1/8.2
- [ ] `anagathics.json`: CE and Mneme rules per MECH-8.4/8.5
- [ ] `retirement_pay.json`: 4 table entries (terms 5–8) plus `beyondEightTerms` field per MECH-9.4
- [ ] `medical_bills.json`: 3 career groups with roll thresholds per MECH-7.3
- [ ] `draft.json`: both CE and Mneme draft tables per MECH-6.2

---

### FR-M0-06: Author `skills.json`
**Milestone:** M0 | **Priority:** High | **Depends On:** DA-3.17

**Description:** Populate `skills.json` with all CE skills, their categories, and cascade specialties.

**Acceptance Criteria:**
- [ ] All skills referenced in careers.json skillTables are present
- [ ] Cascade skills include specialties list
- [ ] At minimum all skills from MECH-6.7 and MECH-5.3 are present

---

### FR-M0-07: Author `soc_table.json`, `equipment.json`
**Milestone:** M0 | **Priority:** Medium | **Depends On:** DA-3.15, DA-3.16

**Description:** Populate SOC title table and core equipment catalog.

**Acceptance Criteria:**
- [ ] `soc_table.json`: CE titles for SOC 1–15, Mneme economic tier formula
- [ ] `equipment.json`: at minimum all weapons that appear as career benefits (Laser Pistol, Dagger, Blade, Shotgun, Rifle), one armor (Vacc Suit), basic gear

---

### FR-M0-08: Author `cultures_names.json`, `name_generation_rules.json`
**Milestone:** M0 | **Priority:** High | **Depends On:** DA-3.2, DA-3.3

**Description:** Populate name pools for at minimum 4 cultures plus alien name patterns.

**Acceptance Criteria:**
- [ ] At minimum 4 cultures with real name lists (not placeholder arrays): English, Japanese, and 2 others
- [ ] Each culture has: male, female, surnames; unisex optional
- [ ] `name_generation_rules.json` has format patterns for human and at least 1 alien species
- [ ] No `"..."` placeholder entries in any name array

---

### FR-001: React Router Setup
**Milestone:** M1 | **Priority:** Critical | **Depends On:** None

**Description:** Set up React Router v7 with all routes from Section 2.5.

**Acceptance Criteria:**
- [ ] All routes from Section 2.5 render a component (stub is fine for M1)
- [ ] Browser back/forward works between views
- [ ] Direct URL access works (bookmarkable)
- [ ] Refreshing page preserves current view
- [ ] Unknown routes show 404 or redirect to `/`

> **CLARIFY:** Does `/test` render an index page listing sub-routes, or redirect to a default sub-route (e.g., `/test/calculations`)?

---

### FR-002: Header Navigation
**Milestone:** M1 | **Priority:** Critical | **Depends On:** FR-001

**Description:** Persistent header bar on all non-startup screens per Section 3.1.

**Acceptance Criteria:**
- [ ] Logo (`gitb_gi7b_logo.png`) links to `/` (Startup)
- [ ] Generate, Library, Settings nav links with active state indicator
- [ ] Layout toggle icon (phone/desktop) on right side
- [ ] "Installed" badge when running as standalone PWA
- [ ] Responsive: text labels on desktop, icons on phone

> **CLARIFY:** What does the "active" nav state look like? (underline, color, bold?)
> **CLARIFY:** Where exactly does the "Installed" green dot appear? (next to logo? in nav area? standalone indicator?)
> **CLARIFY:** Which icons represent Generate, Library, Settings in phone mode?

---

### FR-003: Startup Screen
**Milestone:** M1 | **Priority:** Critical | **Depends On:** FR-001

**Description:** Entry point at `/` per Section 3.3 mockup (lines 192-222). No header. Branding, primary Generate action, Library/Settings cards, PWA install, version string.

**Acceptance Criteria:**
- [ ] No header bar on this screen
- [ ] "+ GENERATE CHARACTER" primary action navigates to `/generate`
- [ ] Library card shows live character count from IndexedDB
- [ ] Settings card navigates to `/settings`
- [ ] PWA install button shown only when `beforeinstallprompt` fires
- [ ] Version string at bottom from `version.json`

> **CLARIFY:** Library card — what text when zero characters? "No characters yet" or "0 characters saved"?
> **CLARIFY:** iOS install — what manual instructions are shown? Modal? Inline text? Provide the copy text.

---

### FR-004: Tile System
**Milestone:** M1 | **Priority:** Critical | **Depends On:** None

**Description:** Character sheet tile component with 4 states (Inactive/Active/Focused/Completed) per Section 3.4.

**Acceptance Criteria:**
- [ ] Collapsed state shows header + one-line summary
- [ ] Click header toggles expanded/collapsed
- [ ] Focus button enters full-screen overlay (desktop: 70% width, phone: full-screen)
- [ ] ESC or X button exits focus mode
- [ ] Completed state shows green checkmark
- [ ] 6 tile types: Header, Characteristics, Skills, Career History, Equipment, Connections

> **CLARIFY:** Can multiple tiles be expanded simultaneously, or does expanding one collapse others?
> **CLARIFY:** In focus mode, "others shrink to headers" — collapsed with summary line, or header-only (no summary)?
> **CLARIFY:** Are transitions animated? If so, what duration?
> **CLARIFY:** On initial generation, which tiles start expanded? All collapsed? First one expanded?
> **CLARIFY:** What fields appear in the collapsed summary line for each of the 6 tile types? (Only the Header tile summary is shown in the mockup.)

---

### FR-005: Character Sheet Data Model
**Milestone:** M1 | **Priority:** Critical | **Depends On:** None

**Description:** Implement the central Character Sheet data structure that holds all generated character information for use in the Library and active generation. Designed per DATA_ARCHITECTURE.md §DA-3.5 (Character Sheet Schema).

**Acceptance Criteria:**
- [ ] Data model holds: basic info (Name, Age), Abilities (Characteristics, Psionics, Species features), Traits, Conditions (Injuries).
- [ ] Data model holds: Assets/Liabilities, Benefits, and History (logged events from character creation).
- [ ] Can be serialized to/from JSON for Library storage and import/export.
- [ ] Serves as the single source of truth for the active character being generated.

---

### FR-006: Desktop/Phone Layout Toggle
**Milestone:** M1 | **Priority:** High | **Depends On:** FR-002

**Description:** Manual layout toggle per Section 3.2. Auto-detect on first load, persist to `ce_char_layout_mode`.

**Acceptance Criteria:**
- [ ] Toggle in header switches between desktop and phone layouts instantly
- [ ] Auto-detect on first load based on viewport width
- [ ] Persists to localStorage key `ce_char_layout_mode`
- [ ] Desktop: multi-column layouts; Phone: single-column stacked

> **CLARIFY:** Auto-detect breakpoint — is it 768px (same as the mode behavior threshold)?
> **CLARIFY:** Does resizing the browser trigger auto-switch, or is it first-load only then manual?
> **CLARIFY:** Section 3.2 mentions "Phone mode: Bottom action bar: Generate, Save, Settings" — is this in addition to the header? Does the header disappear in phone mode? This contradicts Section 3.1 which says header is on all non-startup screens.

---

### FR-010: Settings Sidebar Navigation
**Milestone:** M2 | **Priority:** High | **Depends On:** FR-001, FR-002

**Description:** Settings screen with sidebar navigation per Section 4.1. 7 sections with icons.

**Acceptance Criteria:**
- [ ] Sidebar with 7 items: Layout, Rules, Careers, Tables, In Play, Data, Version
- [ ] Clicking item loads content in main area and updates URL to `/settings/:section`
- [ ] Active item highlighted in sidebar

> **CLARIFY:** Phone mode — does the sidebar become a horizontal tab bar, hamburger menu, or dropdown?

---

### FR-011: Layout Settings Section
**Milestone:** M2 | **Priority:** Medium | **Depends On:** FR-010

**Description:** Layout settings at `/settings/layout` per Section 4.2.1: Desktop/Phone toggle, Theme, Animation preferences, Font size.

**Acceptance Criteria:**
- [ ] Desktop/Phone toggle (same as header toggle, synced)
- [ ] Theme selector: Dark / Light / Auto
- [ ] Animation preference control
- [ ] Font size adjustment

> **CLARIFY:** Theme — provide color tokens or a design system reference. What does Dark look like? Light? Is there a GI7B UI Standard doc with colors?
> **CLARIFY:** Animation preferences — on/off toggle? Or per-animation granularity? What animations exist in the app?
> **CLARIFY:** Font size — a slider? Preset sizes (S/M/L/XL)? What's the range? Which elements scale?

---

### FR-012: Rules Settings with CE/Mneme Toggles
**Milestone:** M2 | **Priority:** High | **Depends On:** FR-010

**Description:** Rules settings at `/settings/rules` per Section 4.2.2. Master CE/Mneme toggle plus individual rule toggles.

**Acceptance Criteria:**
- [ ] Master toggle: CE Standard / Mneme Variant
- [ ] Individual toggles per Section 4.2.2 table (Unified Rolls, Auto Re-Enlistment, Aging Start, Anagathics, Drifter Qual, PSI)
- [ ] Selectable table variants: SOC Table, Homeworlds, Anagathics
- [ ] Changes persist to localStorage

> **CLARIFY:** Does flipping the master toggle auto-set all individual toggles to that variant's defaults? Or is it a preset that can be customized? If customized, does master show "Custom"?
> **CLARIFY:** "Selectable Table Variants" (SOC, Homeworlds, Anagathics) — are these the same mechanism as Tables In Play (FR-015)? Or separate dropdowns within the Rules section? Clarify the overlap.

---

### FR-013: Career Enable/Disable Management
**Milestone:** M2 | **Priority:** High | **Depends On:** FR-010, FR-021

**Description:** Career management at `/settings/careers` per Section 4.2.3 mockup. Toggle individual careers on/off.

**Acceptance Criteria:**
- [ ] List all 24 careers with checkbox, category badge, qualification info
- [ ] Filter dropdown by category
- [ ] Search by name
- [ ] Enable All / Disable All / Reset buttons
- [ ] Active count shown in header ("22 of 24 Active")
- [ ] Disabled careers hidden from generation dropdown

> **CLARIFY:** Does toggling `enabled` modify the career entry in the live working state table (`ce_char_live_careers`)? Or is there a separate `ce_char_careers_enabled` registry? Section 2.6 data layer doesn't have a dedicated key for this.

---

### FR-014: JSON Table Editor (Dual View)
**Milestone:** M2 | **Priority:** High | **Depends On:** FR-010

**Description:** JSON + Table dual-view editor at `/settings/tables` per Section 4.3. Auto-save in table view, explicit Apply in JSON view.

**Acceptance Criteria:**
- [ ] Dropdown to select table (organized by category)
- [ ] Shows canonical + custom tables (custom marked with badge)
- [ ] Table view: editable cells, auto-save on cell commit, "Saved" toast (1.5s)
- [ ] JSON view: raw editor, "Apply" button (validates before saving)
- [ ] Schema validation with error indicators
- [ ] "Save As New Custom Table" when editing a canonical table

> **CLARIFY:** Schema validation — what defines the schema? JSON Schema files per table? Zod types? Hardcoded rules? An agent needs to know what to validate against.
> **CLARIFY:** "Save As New Custom Table" — what's the flow? Modal for name input? Auto-name from canonical + "Copy"? Stored under which localStorage key structure?
> **CLARIFY:** "Organized by category" — what are the dropdown group headers? The 16 categories from Section 4.4?
> **CLARIFY:** Which tables are editable? All 16 from Section 4.4? Also `rules.json`? Also `_summary.json`?

---

### FR-015: Tables In Play
**Milestone:** M2.7 | **Priority:** High | **Depends On:** FR-014

**Description:** Active table selection per category at `/settings/tables-in-play` per Section 4.4. Each category has exactly one active table.

**Acceptance Criteria:**
- [ ] One row per table category showing active table
- [ ] Switch active table via selection control
- [ ] Custom tables shown with delete option
- [ ] "+ Add New Custom Table" with flow: select category, name, source (blank/duplicate/import)
- [ ] Export/Import per custom table
- [ ] Reset All returns every category to canonical

> **CLARIFY:** The mockup shows radio buttons (lines 473-474) AND "[Switch dropdown]" (line 465). Which is the actual selection mechanism?
> **CLARIFY:** "Auto-switches to new table as active" (line 513) — is this always desired? What if user wants to create a table without activating it?
> **CLARIFY:** Confirm the exact number of table categories. Section 4.4 lists 16. Is that the final count?

---

### FR-016: Settings Snapshots
**Milestone:** M2.5 | **Priority:** High | **Depends On:** FR-010

**Description:** Save/load named settings snapshots per Section 4.6. Max 50.

**Acceptance Criteria:**
- [ ] Save snapshot captures full current state (tables + rules)
- [ ] Load snapshot replaces live state
- [ ] Rename, export (download JSON), import, delete
- [ ] Default name: `YYMMDD:HHMMSS` (editable)
- [ ] Max 50 snapshots
- [ ] Stored in `ce_char_presets`

> **CLARIFY:** Does a snapshot also capture the Tables In Play active table mapping? Section 4.6 schema shows `tables` and `rules` but doesn't explicitly mention the active table registry.

---

### FR-017: Data Management
**Milestone:** M2.5 | **Priority:** High | **Depends On:** FR-010

**Description:** Data import/export/reset at `/settings/data` per Section 4.5.

**Acceptance Criteria:**
- [ ] Export Settings Snapshot (same as FR-016 save)
- [ ] Import Settings Snapshot
- [ ] Export All Data (settings + characters + custom tables)
- [ ] Import All Data (restore from backup)
- [ ] Reset to Factory Defaults with confirmation dialog
- [ ] Reset never touches character library

> **CLARIFY:** "Export All Data" — what format? Single JSON file or zip? What's the structure? How are IndexedDB characters bundled with localStorage settings?
> **CLARIFY:** "Import All Data" — merge or replace? If a character with same ID exists, overwrite or skip? Conflict handling for rules vs custom tables?
> **CLARIFY:** "Reset to Factory Defaults" — does it preserve snapshots? Or wipe them too?

---

### FR-018: Version Control
**Milestone:** M2.6 | **Priority:** High | **Depends On:** FR-010

**Description:** Version display and update mechanism at `/settings/version` per Section 4.8.

**Acceptance Criteria:**
- [ ] Current version + build date display
- [ ] Check remote `version.json` for updates
- [ ] "Update Available" amber pill indicator
- [ ] Changelog preview before update
- [ ] User-controlled update (never forced)
- [ ] Updates never affect user data

> **CLARIFY:** "Rollback capability" — rollback to what? PWA service workers don't natively support rollback. Is this storing previous app versions? Feasible or aspirational? If feasible, describe the mechanism.
> **CLARIFY:** "Release channel toggle (Stable/Beta)" — where do beta builds come from? Different `version.json` URL? Different branch deployment? Provide the infrastructure details.
> **CLARIFY:** "Version history (last 3 versions)" — stored where? `version.json` only has the current version. Is there a `version-history.json` endpoint? Or is this locally tracked?

---

### FR-019: PWA Install & Offline Indicators
**Milestone:** M2.5 | **Priority:** High | **Depends On:** FR-002, FR-003

**Description:** PWA install prompt and offline status indicators per Section 4.9.

**Acceptance Criteria:**
- [ ] Detect `beforeinstallprompt`, show install button on Startup
- [ ] iOS: show manual install instructions
- [ ] Suppress install prompt after install
- [ ] Standalone detection via `display-mode: standalone` media query
- [ ] "Offline" amber indicator when navigator.onLine is false
- [ ] Disable update check when offline

> **CLARIFY:** iOS manual instructions — provide the exact UI design and copy text. Modal? Inline expandable? What does it say?
> **CLARIFY:** "Suppress after install" — mechanism? localStorage flag? Or rely on `display-mode: standalone` detection? What if user uninstalls and revisits in browser — show prompt again?
> **CLARIFY:** Offline indicator location — header bar? Floating toast? Persistent banner below header?

---

### FR-020: species.json Data Table
**Milestone:** M2 | **Priority:** High | **Depends On:** None

**Description:** Create `species.json` with all species per DATA_ARCHITECTURE.md §DA-3.1.

**Acceptance Criteria:**
- [ ] Contains all enabled and disabled species with full schemas
- [ ] Each species has: id, name, description, enabled, characteristicRolls, modifiers, startingSkills, traits, backgroundsAllowed
- [ ] Matches example in DATA_ARCHITECTURE.md §DA-3.1 (4 species: Terrestrial Human, Low-G Human, Esper, Merfolk)

*(This FR is clear — no clarification needed.)*

---

### FR-021: careers.json Data Table (All 24 Careers)
**Milestone:** M2 | **Priority:** Critical | **Depends On:** None

**Description:** Create `careers.json` with all 24 Cepheus Engine careers per DATA_ARCHITECTURE.md §DA-3.7 schema.

**Acceptance Criteria:**
- [ ] All 24 careers with full data per the Drifter example schema
- [ ] Each career has: id, name, enabled, category, qualification, survival, commission, advancement, reenlistment, ranks (0-6), benefits (cash + material), skillTables (personal, service, advanced)

> **CLARIFY — BLOCKING:** Only 1 career (Drifter) is fully defined. Provide the complete dataset for all 24 careers, or provide access to the source material (Cepheus Engine SRD career tables, GI7B Career Cards). An agent cannot invent game-accurate career stats. Needed per career:
> - Career ID, name, category
> - Qualification target number + DM characteristic
> - Survival target number + DM characteristic
> - Commission: has/target/DM (if applicable)
> - Advancement target number + DM characteristic
> - Re-enlistment target number
> - Rank titles (0-6) with rank skills
> - Skill tables: personal (6), service (6), advanced (6)
> - Benefits: cash table (6 entries), material table (6 entries)
>
> **CLARIFY:** List all 24 career IDs and names with categories.

---

### FR-022: cultures_names.json + name_generation_rules.json
**Milestone:** M2 | **Priority:** High | **Depends On:** None

**Description:** Create name pool tables per Sections 5.3.2 and 5.3.3.

**Acceptance Criteria:**
- [ ] Multiple cultures with male, female, unisex, and surname arrays
- [ ] Alien species name pools (if applicable)
- [ ] Name generation rules with format patterns

> **CLARIFY — BLOCKING:** DATA_ARCHITECTURE.md §DA-3.2 shows placeholder arrays (`["James", "William", "Henry", "..."]`). Provide:
> - How many cultures to include? Which ones? (English, Japanese, ... what else?)
> - How many names per culture per gender? (50? 100? 200?)
> - Alien species: are Vargr and Aslan in scope? If so, provide their name pools or generation rules.
> - `name_generation_rules.json` (DATA_ARCHITECTURE.md §DA-3.3) is a fragment — provide the complete format patterns and rules.

---

### FR-023: homeworlds.json + backgrounds.json
**Milestone:** M2 | **Priority:** High | **Depends On:** None

**Description:** Create homeworld and background tables per Sections 5.3.4 and 5.3.5.

**Acceptance Criteria:**
- [ ] `homeworlds.json` with CE standard + Mneme variants
- [ ] `backgrounds.json` with all backgrounds and skill options
- [ ] Species restrictions work (Low-G → space only, Merfolk → water only)

> **CLARIFY:** `homeworlds.json` shows 2 CE entries and 1 Mneme entry. How many total homeworld types? Provide the complete list.
> **CLARIFY:** `backgrounds.json` shows 2 entries. How many total? Provide the complete list with categories and skill options.
> **CLARIFY:** Species restriction mechanism — is `category` field sufficient for filtering (e.g., `"space"` matches `backgroundsAllowed: "space_only"`)? Or does a background need an explicit `speciesRestrictions` array?

---

### FR-024: Combat Tables (survival_mishaps, injury, medical_bills)
**Milestone:** M2 | **Priority:** High | **Depends On:** None

**Description:** Create mishap, injury, and medical bill tables per Sections 5.3.8-5.3.10.

**Acceptance Criteria:**
- [ ] `survival_mishaps.json` with full 2d6 table (rolls 2-12, 11 entries)
- [ ] `injury.json` with full severity table
- [ ] `medical_bills.json` with cost-by-severity and TL modifiers

> **CLARIFY:** `survival_mishaps.json` shows rolls 2 and 3 only. Provide the full 2d6 table (rolls 2-12) with descriptions, effects, and careerEnding flags.
> **CLARIFY:** `injury.json` shows rolls 1 and 2 only. Provide the full table. How many entries? What roll range (1d6? 2d6?)?

---

### FR-025: Progression Tables (aging, anagathics, retirement_pay)
**Milestone:** M2 | **Priority:** High | **Depends On:** None

**Description:** Create aging, anagathics, and retirement tables per Sections 5.3.11-5.3.13.

**Acceptance Criteria:**
- [ ] `aging.json` with CE standard + Mneme variant thresholds
- [ ] `anagathics.json` with CE standard + Mneme rules
- [ ] `retirement_pay.json` with pension table

> **CLARIFY:** `aging.json` CE variant shows difficulty at terms 4, 8, 12. What difficulty applies at terms 5-7? Same as term 4 (difficulty 8)? Provide the full term-by-term breakdown or the interpolation rule.
> **CLARIFY:** `anagathics.json` CE variant has `"sideEffectTable": [...]` — provide the actual side effect entries.
> **CLARIFY:** `retirement_pay.json` shows terms 5-8. What about 9+ terms? Linear extrapolation (+2000/term)? Capped at term 8 value? Provide the rule.

---

### FR-026: Reference Tables (soc_table, equipment, skills, rules)
**Milestone:** M2 | **Priority:** High | **Depends On:** None

**Description:** Create SOC, equipment, skills, and rules tables per Sections 5.3.14-5.3.17.

**Acceptance Criteria:**
- [ ] `soc_table.json` with CE titles + Mneme economic tiers
- [ ] `equipment.json` with weapons, armor, gear, assets
- [ ] `skills.json` with all skills, categories, cascade/specialties
- [ ] `rules.json` with CE + Mneme rulesets and toggles

> **CLARIFY:** `equipment.json` shows 1 weapon (Dagger). Provide the complete equipment list or source reference. How many items per category (weapons, armor, gear, assets)?
> **CLARIFY:** `skills.json` shows 2 skills. `_summary.json` mentions "50 entries." Provide the complete skill list with categories and cascade/specialty info, or point to the CE SRD skill list.

---

### FR-030: Dice Engine
**Milestone:** M3 | **Priority:** Critical | **Depends On:** None

**Description:** Implement all dice roll functions per Sections 6.1 and 6.2: d6, 2d6, 2d6vsTN, AdvX, DisX.

**Acceptance Criteria:**
- [ ] `rollD6()` returns 1-6
- [ ] `roll2D6()` returns 2-12
- [ ] `roll2D6vsTN(tn, dm)` returns { roll, total, success }
- [ ] `rollAdvX(x)` rolls (2+x)d6, keeps highest 2
- [ ] `rollDisX(x)` rolls (2+x)d6, keeps lowest 2

*(This FR is clear — algorithm in MECH-A.1.)*

---

### FR-031: Characteristic Roll + DM Calculation
**Milestone:** M3 | **Priority:** Critical | **Depends On:** FR-030

**Description:** Implement characteristic generation and DM lookup per Sections 6.3.1 and 6.3.2.

**Acceptance Criteria:**
- [ ] `rollCharacteristic(spec)` handles "2d6", "advX", "disX", "2d6+N", "2d6-N"
- [ ] Minimum value is 1
- [ ] `getCharacteristicDM(value)` returns correct DM per reference table

*(This FR is clear — algorithm in MECH-A.4 and table in MECH-4.2)*

---

### FR-032: Career Qualification + Survival + Advancement Rolls
**Milestone:** M3 | **Priority:** Critical | **Depends On:** FR-030, FR-031

**Description:** Implement career roll functions per Sections 6.4.2, 6.4.3, 6.4.7.

**Acceptance Criteria:**
- [ ] `rollQualification()` handles auto-qualify careers and DM bonuses
- [ ] `rollSurvival()` returns survived boolean with DM
- [ ] `rollAdvancement()` returns advanced boolean with DM

*(This FR is clear — algorithms in MECH-A.5)*

---

### FR-033: Commission + Event + Mishap Rolls
**Milestone:** M3 | **Priority:** Critical | **Depends On:** FR-030, FR-024

**Description:** Implement commission, event, and mishap roll functions per Sections 6.4.4-6.4.6.

**Acceptance Criteria:**
- [ ] `rollCommission()` handles careers with/without commissions
- [ ] `rollEvent(eventTable)` returns event for 2d6 result
- [ ] `rollMishap(mishapTable)` returns mishap consequence

> **CLARIFY — BLOCKING:** Event roll (6.4.4) references an `eventTable` parameter, but **no event table or `events.json` schema exists anywhere in Section 5**. Are events per-career? Generic? Provide:
> - Is there an `events.json` data table? If so, provide the schema and content.
> - Or are events embedded in `careers.json` per career? If so, add an `events` field to the career schema in DATA_ARCHITECTURE.md §DA-3.7.
> - Or are events out of scope for v1 and the roll is a stub?

---

### FR-034: Benefits + Mustering Out + Pension
**Milestone:** M3 | **Priority:** High | **Depends On:** FR-030, FR-021, FR-025

**Description:** Implement benefits and mustering out per Sections 6.5 and 6.6.

**Acceptance Criteria:**
- [ ] `calculateBenefitRolls(terms, rank)` returns correct count
- [ ] `rollCashBenefit()` returns credits, max 3 cash rolls enforced
- [ ] `rollMaterialBenefit()` applies rank bonus
- [ ] `calculatePension(terms)` returns annual pension or 0

> **CLARIFY:** Pension table (DATA_ARCHITECTURE.md §DA-3.14) only goes to 8 terms — **RESOLVED:** 9+ terms add +Cr2,000 per term beyond 8 per MECH-9.4
> **CLARIFY:** In auto-generation ("Random Everything"), what's the decision logic for cash vs material rolls? Random 50/50? Maximize cash first (up to 3)? Weighted by remaining funds?

---

### FR-035: Aging Engine (CE + Mneme)
**Milestone:** M3 | **Priority:** High | **Depends On:** FR-030, FR-031, FR-025

**Description:** Implement aging rolls for both CE and Mneme variants per MECH-8.

**Acceptance Criteria:**
- [ ] CE: Aging check starts at term 4, difficulty increases with age
- [ ] Mneme: Aging check starts at term 5, difficulty = terms + 1
- [ ] Physical characteristic reductions applied on failure
- [ ] Death if any physical characteristic reaches 0

> **CLARIFY — BLOCKING:** CE aging code (6.7.1) calls `getDifficulty_CE(term)` and `getAgingEffects_CE(term)` — **neither function is defined**. Provide:
> - `getDifficulty_CE(term)`: What difficulty for terms 4-7? Is it 8 for all of them? Then 9 for 8-11? Then 10 for 12+? Spell out the rule.
> - `getAgingEffects_CE(term)`: What characteristic reductions? Which characteristics affected at each tier? By how much (-1 each? -1 to one random?)?
>
> **CLARIFY:** Mneme aging failure returns `effects: ["reduce_physical"]` — which physical characteristic is reduced? All three (STR, DEX, END) by -1 each? One random by -1? Specify.

---

### FR-036: Anagathics Engine (CE + Mneme)
**Milestone:** M3 | **Priority:** Medium | **Depends On:** FR-035

**Description:** Implement anagathics (anti-aging drugs) for both variants per Sections 5.3.12 and 6.7.3.

**Acceptance Criteria:**
- [ ] Mneme: Cost 100KCr, max (SOC-7) doses, prevents aging for term
- [ ] CE: Cost by TL, side effects possible
- [ ] Integrated into aging step — offered before aging roll

> **CLARIFY — BLOCKING:** Section 6 provides code only for Mneme anagathics (`applyAnagathics_Mneme`). **No CE anagathics code exists.** Provide:
> - CE anagathics logic: MECH-8.4 documents CE anagathics: cost = 1D6×2,500 Cr per term; requires second Survival check; stopping causes immediate aging roll. DATA_ARCHITECTURE.md §DA-3.13.
> - CE anagathics availability: not explicitly restricted by starport — available wherever character can obtain supply (Referee discretion).

---

### FR-040: Generate View Layout
**Milestone:** M3 | **Priority:** Critical | **Depends On:** FR-004, FR-005

**Description:** Generate view at `/generate` per Section 3.5. Desktop: three-column layout (Parameters 20%, Character Sheet 50%, Log 30%). Phone: single column.

**Acceptance Criteria:**
- [ ] Desktop: Three-column layout with parameters, character sheet (tiles), and log
- [ ] Phone: Single-column responsive layout
- [ ] "Generate" button produces a complete character
- [ ] Log panel shows roll-by-roll generation history
- [ ] Constraints panel filters species and career options

> **CLARIFY:** Phone layout — what order? Parameters on top (collapsible), then sheet, then log? Or is the log hidden by default on phone?
> **CLARIFY:** Constraints panel — what specific constraint fields exist? Enumerate them. (Species filter, career filter, tech level limit, max terms, min/max age, number of careers, ... ?)
> **CLARIFY:** "Real-time updates as generation progresses" vs "< 3 seconds" performance target — is generation animated step-by-step in the UI? Or does it complete instantly and the log shows the history afterward? Or is it an animated replay of completed generation?

---

### FR-041: Species Selection Step
**Milestone:** M3 | **Priority:** Critical | **Depends On:** FR-020, FR-031

**Description:** Generation Step 1 per MECH-11.2. Species selection with toggle gating.

**Acceptance Criteria:**
- [ ] Dropdown shows only enabled species
- [ ] Species gated by rule toggles (Esper requires Psionics toggle, etc.)
- [ ] "Random" option selects from enabled species
- [ ] Selected species determines characteristic roll specs

*(This FR is clear.)*

---

### FR-042: Characteristic Generation Step
**Milestone:** M3 | **Priority:** Critical | **Depends On:** FR-031, FR-041

**Description:** Generation Step 2 per MECH-11.3. Roll characteristics using species specs.

**Acceptance Criteria:**
- [ ] Roll all 6 (or 7 with PSI) characteristics per species spec
- [ ] Display values with DMs in Characteristics tile
- [ ] Log each roll detail

*(This FR is clear — code and UI mockup provided.)*

---

### FR-043: Homeworld & Background Step
**Milestone:** M3 | **Priority:** High | **Depends On:** FR-023, FR-041

**Description:** Generation Step 3 per MECH-11.4. Select homeworld and background, gain starting skill.

**Acceptance Criteria:**
- [ ] Homeworld selection (random or user choice)
- [ ] Background filtered by homeworld + species restrictions
- [ ] 1 starting skill gained from background
- [ ] Species restrictions enforced (Low-G → space only, Merfolk → water only)

> **CLARIFY:** What's the homeworld selection UI? Dropdown? Cards? Random button?
> **CLARIFY:** Filtering logic — how does `backgroundsAllowed: "space_only"` match against background entries? By `category` field? By explicit mapping?
> **CLARIFY:** Starting skill — is it always Level 0, always Level 1, or variable? What determines the level?

---

### FR-044: Career Term Loop
**Milestone:** M3 | **Priority:** Critical | **Depends On:** FR-021, FR-032, FR-033, FR-024

**Description:** Generation Step 5 per MECH-11.6. Full career term loop: qualification, survival, events, commission, advancement, skills, re-enlistment, aging.

**Acceptance Criteria:**
- [ ] First term: qualification roll (failure → draft or drifter)
- [ ] Each term: survival → event → commission → advancement → skill → re-enlist → age
- [ ] Mishap on survival failure ends career
- [ ] Draft table used on qualification failure
- [ ] Career change between terms supported
- [ ] Minimum 1 skill per term guaranteed
- [ ] Aging applied per FR-035

> **CLARIFY — BLOCKING:** Auto-generation stopping condition — what determines when the character stops serving terms? Without a rule, the loop could run indefinitely. Options:
> - Fixed max terms (e.g., 7)?
> - Random chance to leave each term?
> - Leave after failed re-enlistment roll?
> - Weighted by age/terms served?
> Specify the algorithm.
>
> **CLARIFY:** Skill acquisition (step 7) — in auto-mode, which skill table is chosen? Random from personal/service/advanced? Weighted? Always personal first term?
> **CLARIFY:** Career change — in auto-mode, when does the generator decide to switch careers vs re-enlist? Random chance? After advancement failure? Never (stay in first career)?
> **CLARIFY:** Events — depends on FR-033 event table which is currently undefined. See FR-033 CLARIFY block.

---

### FR-045: Mustering Out + Equipment Assignment
**Milestone:** M3 | **Priority:** High | **Depends On:** FR-034, FR-026

**Description:** Generation Steps 7-8 per Sections 7.10 and 7.11.

**Acceptance Criteria:**
- [ ] Calculate benefit rolls from terms + rank
- [ ] Roll cash and material benefits (max 3 cash)
- [ ] Calculate pension if 5+ terms
- [ ] Assign equipment based on benefits + career

> **CLARIFY:** Equipment assignment (MECH-11.10) says "Procedurally assign 'believable' gear based on career." This is subjective. Provide:
> - The algorithm or heuristic for auto-assigning gear
> - Budget for additional equipment purchases (from cash benefits? Fixed amount?)
> - Career-to-gear mapping for all 24 careers (only Marine, Scout, Merchant shown in MECH-11.10)

---

### FR-046: Name Generation Step
**Milestone:** M3 | **Priority:** Medium | **Depends On:** FR-022

**Description:** Generation Step 9 per MECH-11.11.

**Acceptance Criteria:**
- [ ] Select culture (random or user choice)
- [ ] Select gender
- [ ] Generate name from culture pool
- [ ] Apply format pattern from `name_generation_rules.json`

> **CLARIFY:** Gender options — male, female, unisex only? Or also non-binary/other? When "random" is selected, does it pick from male+female equally and sometimes use unisex pool, or is unisex a third equal option?
> **CLARIFY:** Depends on FR-022 data which needs complete name pools (see FR-022 CLARIFY block).

---

### FR-047: "Random Everything" One-Click Generation
**Milestone:** M3 | **Priority:** High | **Depends On:** FR-041 through FR-046

**Description:** One-click full random character generation per MECH-11 and PRD §3.5.

**Acceptance Criteria:**
- [ ] Single button press generates a complete character with all random choices
- [ ] Uses all generation steps (FR-041 through FR-046) with random selections
- [ ] Result saved to library automatically
- [ ] Log shows full generation history

> **CLARIFY:** Decision weights for "random" — specify for each choice point:
> - Species: Equal probability across enabled species? Or weighted (e.g., 70% Terrestrial Human)?
> - Career: Equal probability? Weighted by category?
> - Number of terms: What distribution? Uniform 1-7? Weighted toward 3-5?
> - Cash vs material benefits: Random per roll? Prefer cash until 3 used?
> - Equipment purchases: Auto-buy sensible gear? Skip entirely?
> - Culture/gender for names: Equal distribution?
>
> Or state: "all choices are uniformly random from valid options" if that's the intent.

---

### FR-050: Library View
**Milestone:** M4 | **Priority:** High | **Depends On:** FR-001, FR-051

**Description:** Library view at `/library` per Section 3.6. Browse, search, manage saved characters.

**Acceptance Criteria:**
- [ ] Grid view (cards) and List view (table) toggle
- [ ] Search/filter by name, career, species, date
- [ ] Sort by: Name, Date, Career, Terms, Age
- [ ] Quick actions per character: Load, Duplicate, Export, Delete
- [ ] Batch operations: export multiple, delete group

> **CLARIFY:** Grid card layout — provide a mockup or list the fields shown on a card (Name, career, age, species? Portrait placeholder?).
> **CLARIFY:** List/table view — which columns?
> **CLARIFY:** Batch selection UI — checkboxes per item? Long-press? Select mode toggle?
> **CLARIFY:** "Load" action — load where? Into the Generate view for editing? Into the Character view (FR-054)?

---

### FR-051: Character Save to IndexedDB
**Milestone:** M4 | **Priority:** Critical | **Depends On:** None (interface definition only; storage used by FR-044+)

**Description:** IndexedDB storage for character library.

**Acceptance Criteria:**
- [ ] Save complete character object to IndexedDB
- [ ] Retrieve by ID
- [ ] List all characters with metadata
- [ ] Delete by ID
- [ ] Data persists across sessions and app updates

> **CLARIFY — BLOCKING:** Provide the complete character object schema/interface. Section 7 describes what a character contains across 10 steps, but there is no unified `Character` TypeScript interface. Specify all fields: characteristics, skills, career history, benefits, equipment, name, age, species, homeworld, background, connections, wounds, pension, cash, etc.
> **CLARIFY:** IndexedDB database name, object store name, and version number.
> **CLARIFY:** Auto-save timing — save immediately on generation completion? Or after user reviews and confirms?

---

### FR-052: Character Export Formats
**Milestone:** M4 | **Priority:** High | **Depends On:** FR-051

**Description:** Export characters in multiple formats per Section 8.3 (original).

**Acceptance Criteria:**
- [ ] JSON export (full data)
- [ ] Markdown export (formatted document)
- [ ] Universal Character Description (text block)
- [ ] Mneme Character Summary (Mneme-specific format)
- [ ] Print-friendly view
- [ ] Campaign-ready stat block

> **CLARIFY:** Provide example output for each format:
> - **Universal Character Description** — what does this text block look like? Provide a sample.
> - **Mneme Character Summary** — what's the Mneme-specific format? Provide a sample.
> - **Campaign-ready stat block** — what fields, what layout? Provide a sample.
> - **Print-friendly view** — is this a separate route? A CSS print stylesheet? A generated PDF?
>
> JSON and Markdown can be inferred, but the other 4 need concrete examples.

---

### FR-053: Batch Generation
**Milestone:** M4 | **Priority:** Medium | **Depends On:** FR-047

**Description:** Generate multiple characters at once (referenced in US-002, line 2117: "Generates 20 NPCs via batch").

**Acceptance Criteria:**
- [ ] User specifies count of characters to generate
- [ ] Constraints applied to entire batch
- [ ] Progress indicator during generation
- [ ] All characters saved to library
- [ ] Batch export option

> **CLARIFY — BLOCKING:** This feature is mentioned only in a user story. No section describes it. Provide:
> - Where is the batch UI? In the Generate view? A separate mode/tab? A modal?
> - Can each NPC have different constraints, or same constraints for all?
> - Output: individual saves to library + combined export? Or combined export only?
> - Max batch size?
> - Is this in scope for v1, or should it be moved to Section 12 (Out of Scope)?

---

### FR-054: Character View Page
**Milestone:** M4 | **Priority:** Medium | **Depends On:** FR-004, FR-051

**Description:** Individual character view at `/character/:id` (listed in route map, Section 2.5 line 103).

**Acceptance Criteria:**
- [ ] Display full character using tile system (FR-004)
- [ ] Actions: Export, Duplicate, Delete
- [ ] Accessible from Library view

> **CLARIFY:** Is this view read-only, or does it support editing?
> **CLARIFY:** How does the user navigate here? Only from Library? Or also after generation completes?
> **CLARIFY:** Is the layout the same as the Generate view's character sheet (tiles), or a different presentation?

---

### FR-060: Real-Time Validation Engine
**Milestone:** M3 | **Priority:** Critical | **Depends On:** FR-031

**Description:** Validate character data in real-time during generation and editing.

**Acceptance Criteria:**
- [ ] Hard constraints block invalid state (characteristics 1-15, skill maximums, aging floors, TL match)
- [ ] Soft warnings displayed but allowed (low SOC + officer, missing prereq skills, age > 70)
- [ ] Validation feedback < 100ms

*(This FR is clear from the original Section 8.1.)*

---

### FR-070: Test Page & Dev Tools
**Milestone:** M2 | **Priority:** High | **Depends On:** FR-001

**Description:** Development test page at `/test` with sub-routes per the original Section 8.4.

**Acceptance Criteria:**
- [ ] `/test/calculations` — Characteristic, aging, career, skill, benefits calculation tests
- [ ] `/test/components` — UI component showcase in all states
- [ ] `/test/data` — Schema validation for all JSON tables
- [ ] `/test/routes` — All routes render correctly
- [ ] `/test/performance` — First paint, TTI, generation time, bundle size
- [ ] `/test/storage` — LocalStorage inspector with view/edit/delete/export

*(This FR is clear from the original Section 8.4.)*

---

## 9. NON-FUNCTIONAL REQUIREMENTS

### 9.1 Performance Targets

| Metric | Target |
|--------|--------|
| First paint | <2s on 4G |
| Time to interactive | <5s |
| Character generation | <3s |
| Calculation updates | <100ms |
| Bundle size (gzipped) | <500KB |
| Lighthouse Performance | >90 |

### 9.2 Accessibility (WCAG AA)

- Keyboard navigation
- Screen reader compatible
- Color-blind friendly (not color-only indicators)
- Focus indicators
- Alt text for icons
- Minimum contrast ratios

**Acceptance:** Passes axe-core audit

### 9.3 Security & Privacy

**Security:**
- No server-side processing (pure client-side)
- Never use `innerHTML` with table data
- Schema validation on import
- Type coercion on load

**Privacy:**
- Characters stored locally only
- No personal data collection
- No cookies for tracking
- No cloud sync required
- Export/import under user control
- Clear data deletion option

### 9.4 Browser Support

**Required:**
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- Mobile: iOS Safari, Chrome Android

**Graceful Degradation:** Core functions work on older browsers

---

## 10. USER STORIES

### US-001: New Player Generates First Character

1. Opens app on phone
2. Clicks "Generate Character"
3. Sees complete character instantly
4. Reviews career history and equipment
5. Saves to library
6. Exports to JSON for game

### US-002: GM Creates NPCs

1. Opens app on laptop
2. Sets constraints ("military careers only")
3. Generates 20 NPCs via batch
4. Reviews and exports as group
5. Uses in game session

### US-003: Player Customizes Content

1. Opens Settings → Tables In Play
2. Creates custom careers table
3. Edits careers for house rules
4. Generates character with new content
5. Exports custom table to share

### US-004: Campaign Group Shares Content

1. GM exports settings snapshot with custom careers
2. Shares file via messaging
3. Players import to their local copy
4. Everyone uses same custom rules

### US-005: GM Switches Rule Variants

1. Opens Settings → Rules
2. Toggles from CE to Mneme variant
3. Aging now starts at Term 5
4. Anagathics use simplified rules
5. Generates character with Mneme rules

---

## 11. TTRPG GAME RULES (Reference Appendix)

This section provides reference material for the Cepheus Engine rules implemented in the app.

### 11.1 Dice Mechanics

**2D6 System:**
- Most rolls use 2d6 (sum of two six-sided dice)
- Result range: 2-12
- Average: 7

**Target Number (TN):**
- Roll 2d6 + modifiers ≥ TN to succeed
- Common TNs: 6+ (easy), 8+ (average), 10+ (difficult)

**Dice Modifiers (DM):**
- Added to or subtracted from the roll
- Derived from characteristics, skills, circumstances

### 11.2 Characteristics

**Six Core Characteristics:**
| Abbr | Name | Description |
|------|------|-------------|
| STR | Strength | Physical strength, fitness |
| DEX | Dexterity | Coordination, agility, reflexes |
| END | Endurance | Stamina, ability to sustain damage |
| INT | Intelligence | Intellect, quickness of mind |
| EDU | Education | Learning and experience |
| SOC | Social Standing | Place in society |

**Optional (with Psionics toggle):**
| Abbr | Name | Description |
|------|------|-------------|
| PSI | Psionic Strength | Mental power for psionics |

**Value Range:** 1-15 (typically 2-12 from generation)

**Characteristic DM Table:**
| Value | DM |
|-------|-----|
| 0 | -3 |
| 1-2 | -2 |
| 3-5 | -1 |
| 6-8 | +0 |
| 9-11 | +1 |
| 12-14 | +2 |
| 15+ | +3 |

### 11.3 Career System Rules

**Career Terms:**
- Each term = 4 years
- Characters start at age 18
- Multiple terms possible (4+ typical)

**Career Progression:**
1. **Qualification** — Roll to enter career
2. **Basic Training** — First term skills
3. **Survival** — Roll to survive term
4. **Events** — Career events occur
5. **Advancement** — Roll for promotion
6. **Skills** — Gain skills from tables
7. **Re-enlistment** — Continue or leave

**Ranks:**
- Rank 0-6 scale for most careers
- Higher ranks provide benefits
- Commission required for officer ranks (some careers)

### 11.4 Aging Rules

**CE Standard:**
- Aging starts: Term 4 (age 34)
- Physical characteristics may reduce
- Anagathics can prevent/reduce effects

**Mneme Variant:**
- Aging starts: Term 5 (age 38)
- Roll: 2d6 + END DM vs (terms + 1)
- Simplified anagathics rules

### 11.5 Anagathics Rules

**CE Standard:**
- Cost varies by Tech Level
- Side effects possible
- Complex availability

**Mneme Simplified:**
- Cost: 100,000 Cr per term (fixed)
- Max doses: (SOC - 7), minimum 1
- Available: Starport A or B only
- Effect: Completely prevents aging for term
- No side effects

### 11.6 Mustering Out Rules

**Benefits:**
- 1 roll per term served
- +1-3 rolls based on final rank
- Choose cash or material per roll
- Maximum 3 cash rolls total

**Retirement Pay:**
- Requires 5+ terms
- Annual pension based on terms served
- Paid regardless of other income

### 11.7 Mneme CE Variant Summary

**Key Differences from Standard CE:**

| Rule | CE Standard | Mneme Variant |
|------|-------------|---------------|
| Aging Start | Term 4 | Term 5 |
| Re-enlistment | Roll required | Automatic |
| Drifter Entry | Roll required | Automatic |
| Anagathics | Complex | Simplified |
| SOC Table | Titles | Economic tiers |

**References:**
- Mneme CE Character Creation: https://wiki.gi7b.org/index.php/Mneme_CE_Chapter_1_Character_Creation
- Mneme Space Combat: https://wiki.gi7b.org/Mneme_Space_Combat

---

## 12. OUT OF SCOPE / FUTURE RELEASES

### Version 2.x (Future)

- **Character Portraits** — AI-generated or uploaded images
- **Campaign Integration** — Link characters to ship crew (CE ShipGen)
- **Equipment Builder** — Custom gear creation
- **NPC Personality** — Traits, motivations, quirks
- **PDF Export** — Form-fillable character sheets

### Version 3.x (Future)

- Cloud sync (optional)
- Character sharing marketplace
- Advanced career events with choices
- Multi-system campaign support

---

## 13. RISKS & MITIGATION

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Complex career rule errors | Medium | High | Extensive unit tests, reference validation |
| Performance on low-end devices | Medium | Medium | Optimize bundle, lazy loading |
| Browser compatibility issues | Low | Medium | Feature detection, graceful degradation |
| Data migration complexity | Low | Medium | Version tagging, migration scripts |
| Scope creep | High | Medium | Strict MVP definition, future versions list |

---

## 14. GLOSSARY & REFERENCES

### 14.1 Glossary

| Term | Definition |
|------|------------|
| **CE** | Cepheus Engine |
| **Mneme** | Mneme CE Character Creation Rules variant |
| **PWA** | Progressive Web App |
| **DM** | Dice Modifier |
| **2D6** | Two six-sided dice |
| **AdvX** | Advantage roll (roll 2+X d6, keep highest 2) |
| **DisX** | Disadvantage roll (roll 2+X d6, keep lowest 2) |
| **TL** | Tech Level |
| **TN** | Target Number |
| **Cr** | Credits (currency) |
| **KCr** | Thousand Credits |
| **MCr** | Million Credits |
| **Term** | 4-year career period |
| **SOC** | Social Standing characteristic |
| **PSI** | Psionic Strength characteristic |

### 14.2 References

1. Cepheus Engine SRD Chapter 1-5
2. Mneme CE Character Creation Wiki: https://wiki.gi7b.org/index.php/Mneme_CE_Chapter_1_Character_Creation
3. CE ShipGen PRD (structural reference)
4. GI7B Career Cards (24 careers reference)
5. CE ShipGen PROJECT_NOTES.md (implementation lessons)

---

## APPENDIX A: MILESTONE PLAN

### Milestone Summary

| Milestone | Scope | Status |
|-----------|-------|--------|
| **M1: UI Layout & Foundation** | Layout, tiles, PWA setup, React Router, Header, StartupScreen | ✅ Complete |
| **M2: Settings & Data Tables** | JSON + table editors, 15+ tables, rule toggles | 🎯 Current |
| **M2.5: Install UX & Settings** | Install prompt, auto-save, security, snapshots, CI/CD | ⏳ Pending |
| **M2.6: Version Control** | Version management, update prompts, rollback, channels | ⏳ Pending |
| **M2.7: Tables In Play** | Active table selection per category, custom tables | ⏳ Pending |
| **M3: Full Career System** | All 24 careers, aging, mustering, equipment, Low-G Human | ⏳ Blocked on M2.7 |
| **M4: Persistence & Export** | Character library, batch generation, advanced export | ⏳ Pending |

### FR-to-Milestone Mapping

| Milestone | FRs |
|-----------|-----|
| **M1** | FR-001, FR-002, FR-003, FR-004, FR-005 |
| **M2** | FR-010, FR-011, FR-012, FR-013, FR-014, FR-020, FR-021, FR-022, FR-023, FR-024, FR-025, FR-026, FR-070 |
| **M2.5** | FR-016, FR-017, FR-019 |
| **M2.6** | FR-018 |
| **M2.7** | FR-015 |
| **M3** | FR-030, FR-031, FR-032, FR-033, FR-034, FR-035, FR-036, FR-040, FR-041, FR-042, FR-043, FR-044, FR-045, FR-046, FR-047, FR-060 |
| **M4** | FR-050, FR-051, FR-052, FR-053, FR-054 |

---

## APPENDIX B: CI/CD PIPELINE

**File:** `.github/workflows/deploy.yml`

**Pipeline:**
1. Checkout `main`
2. Setup Node 20
3. `npm ci`
4. `npm run build` (type-check gate)
5. Deploy to `gh-pages` (only on push to main)

**GitHub Pages Configuration:**
- Use `gh-pages` branch or GitHub Actions
- `vite.config.ts` must have `base: '/cecharactergen/'`

---

**PRD Status:** LIVING DOCUMENT
**Version:** 3.0
**Last Updated:** March 6, 2026
**Structure:** 14 sections, modular design
**Next Target:** M2 completion, then M2.5-M2.7 sequence
