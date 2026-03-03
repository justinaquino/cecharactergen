# CECG PRD v2.0
## Cepheus Engine Character Generator - Product Requirements Document

**Version:** 2.0  
**Date:** March 3, 2026  
**Status:** Ready for M1 Implementation  
**Based On:** 
- Cepheus Engine SRD Chapter 1-5
- Mneme CE Character Creation Rules
- Lessons from CE ShipGen Project

---

## 1. EXECUTIVE SUMMARY

### 1.1 Vision Statement
Create a Progressive Web App (PWA) that implements the complete Cepheus Engine character generation system with Mneme CE rules integration. The app separates **data** (careers, races, skills, equipment) from the **Rules Engine** (characteristics, careers, aging, mustering), enabling third-party content creators to add, remove, or override content without modifying application logic.

### 1.2 Success Criteria
- [ ] Generate complete character in < 3 seconds
- [ ] Support all 24 CE careers with accurate rules
- [ ] Zero code changes required to add new content modules
- [ ] Offline-first PWA functionality
- [ ] Real-time calculations with zero errors
- [ ] Universal Character Export (JSON, Markdown, Plain Text)
- [ ] Mobile-responsive design (320px-2560px)

---

## 2. FUNCTIONAL REQUIREMENTS

### 2.1 Core Character Generator (FR-001 to FR-020)

#### FR-001: Character Generation Engine
**Priority:** Critical  
**Description:** Complete character generation following Cepheus Engine rules

**Generation Steps:**
1. **Characteristics** — Roll 2D6 for STR, DEX, END, INT, EDU, SOC (or point buy)
2. **Species/Race** — Apply racial modifiers and abilities
3. **Homeworld** — Background skills based on homeworld type
4. **Pre-Career Education** — Optional university/military academy
5. **Career Terms** — Enlistment, survival, advancement, skills per term
   - **Skill Acquisition Rule:** Character always gains at least 1 skill level per term
   - **Survival Roll Bonus:** Successfully rolling survival guarantees minimum skill gain
   - **Skill Tables:** Personal Development (6 options), Service Skills (6 options), Advanced Education (6 options)
   - **Advancement:** Rank increases may provide additional skills
   - **Detailed Career Mechanics:** See Section 11 (Career System Details) — to be fully specified in M3
6. **Aging** — Automated from Term 5 onwards
7. **Mustering Out** — Cash and benefits selection
8. **Equipment** — Procedurally generated believable gear
9. **Final Details** — Name, age, connections, wounds

**Acceptance:** User can generate characters, data persists, calculations accurate

---

#### FR-002: Real-Time Validation Engine
**Priority:** Critical  
**Description:** Instant validation of all character choices

**Hard Constraints (Block if violated):**
- Characteristic values must be 1-15 (before modifiers)
- Skills cannot exceed maximums for career/rank
- Aging effects cannot reduce characteristics below 1
- Equipment must match Tech Level

**Soft Warnings (Warn but allow):**
- Low social standing with officer careers
- Missing prerequisite skills for equipment
- Character over 70 years old

**Acceptance:** Zero calculation errors, instant feedback <100ms

---

#### FR-003: Dynamic Calculations
**Priority:** Critical  
**Description:** Auto-calculate all derived values

**Calculations:**
- Characteristic Modifiers: `⌊(value / 3)⌋ - 2`
- Aging Rolls: 2D6 + END DM vs Difficulty (Terms + 1)
- Anagathics: Cost 100KCr per term, max doses = (SOC - 7)
- Total Skills (sum of all skill levels)
- Equipment weight and value
- Cash on hand after mustering

**Acceptance:** All calculations match reference tables

---

#### FR-004: Character Data Management
**Priority:** High  
**Description:** Save, load, export character designs

**Features:**
- Local storage (IndexedDB)
- JSON export/import
- Character library with search/filter
- Duplicate character
- Delete with confirmation
- Auto-save on generation

**Acceptance:** Data persists across sessions, export/import works

---

#### FR-005: Output Generation
**Priority:** High  
**Description:** Generate character documentation

**Formats:**
1. Universal Character Description (text block)
2. Mneme Character Summary
3. JSON (full data)
4. Markdown
5. Print-friendly view
6. Campaign-ready stat block

**Acceptance:** All formats contain complete character data

---

### 2.2 User Interface (FR-006 to FR-015)

#### FR-006: Responsive Layout with Mode Toggle (CE ShipGen Pattern)
**Priority:** Critical  
**Description:** Two distinct layout modes with manual toggle — **exactly like CE ShipGen**

**UI Pattern from CE ShipGen:**
```
┌────────────────────────────────────────────────────────────┐
│ Header: [Logo] [Generate] [Library] [Settings] [Phone▼]    │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  DESKTOP MODE (Multi-Column)                               │
│  ┌──────────┐ ┌──────────────────────┐ ┌──────────────┐   │
│  │Parameters│ │  CHARACTER SHEET     │ │     Log      │   │
│  │ (20%)    │ │  (50%)               │ │   (30%)      │   │
│  │          │ │                      │ │              │   │
│  │ Career   │ │ ┌────┐ ┌────┐ ┌────┐│ │ Generation   │   │
│  │ filters  │ │ │Tile│ │Tile│ │Tile││ │ history      │   │
│  │ Species  │ │ │ 1  │ │ 2  │ │ 3  ││ │ Step-by-step │   │
│  │ TL range │ │ └────┘ └────┘ └────┘│ │              │   │
│  │          │ │                      │ │              │   │
│  └──────────┘ │ ┌────┐ ┌────┐        │ │              │   │
│                │ │Tile│ │Tile│        │ │              │   │
│                │ │ 4  │ │ 5  │        │ │              │   │
│                │ └────┘ └────┘        │ │              │   │
│                └──────────────────────┘ └──────────────┘   │
│                                                            │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│ Header: [Logo] [Generate] [Library] [Settings] [Desktop▼] │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  PHONE MODE (Vertical Stack)                               │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ [≡] Parameters (collapsed)                           │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ CHARACTER SHEET (scrollable)                         │ │
│  │                                                      │ │
│  │ ┌──────────────────────────────────────────────────┐ │ │
│  │ │ Header Tile (Name, Species, Career)              │ │ │
│  │ ├──────────────────────────────────────────────────┤ │ │
│  │ │ Characteristics Tile (STR, DEX, END, INT, EDU,  │ │ │
│  │ │ SOC with modifiers)                              │ │ │
│  │ ├──────────────────────────────────────────────────┤ │ │
│  │ │ Skills Tile (Grouped by category)                │ │ │
│  │ ├──────────────────────────────────────────────────┤ │ │
│  │ │ Career History Tile (Timeline of terms)         │ │ │
│  │ ├──────────────────────────────────────────────────┤ │ │
│  │ │ Equipment Tile (Categorized gear)               │ │ │
│  │ ├──────────────────────────────────────────────────┤ │ │
│  │ │ Connections & Background Tile                   │ │ │
│  │ └──────────────────────────────────────────────────┘ │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ Generation Log                                       │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│  [Generate Button] [Save Button]                          │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Desktop/Tablet Mode (Landscape / Multi-Column):**
- **Three columns:** Parameters (20%), Character Sheet (50%), Summary/Log (30%)
- **Character sheet tiles:** Arranged side-by-side in a grid (2-3 tiles per row)
- **Tile behavior:** Click to expand (Focus Mode), click again to collapse
- **Scroll:** Vertical scroll only if content exceeds viewport
- **Width:** Minimum 1024px for full 3-column layout, collapses to 2-column at 768px

**Phone/Mobile Mode (Portrait / Vertical Stack):**
- **Single column:** All tiles stacked vertically top-to-bottom
- **Character sheet tiles:** Full width, stacked in order:
  1. Header (Name, Species, Career)
  2. Characteristics (6 stats with DMs)
  3. Skills (grouped by category)
  4. Career History (timeline)
  5. Equipment (categorized)
  6. Connections & Background
- **Parameters panel:** Collapsible at top (starts collapsed)
- **Bottom action bar:** Generate, Save, Settings buttons fixed at bottom
- **Scroll:** Natural vertical scroll through all tiles
- **Width:** 320px to 767px

**Layout Toggle:**
- **Location:** Header bar, right side
- **Icon:** Desktop monitor 🖥️ or Phone 📱
- **Label:** "Desktop" or "Phone" (icon + text)
- **Manual toggle:** User clicks to switch modes
- **Auto-detect:** On first load, detect viewport width and set appropriate mode
- **Persistence:** Store `ce_char_layout_mode` preference in localStorage
- **Transition:** Instant switch, no page reload

**Acceptance:** 
- [ ] Desktop mode shows tiles side-by-side (multi-column)
- [ ] Phone mode shows tiles stacked vertically
- [ ] Toggle button visible in header on all views
- [ ] Clicking toggle instantly switches layout
- [ ] Layout preference persists across sessions
- [ ] No horizontal scroll on mobile
- [ ] All features accessible in both modes
- [ ] Focus mode works correctly in both layouts

---

#### FR-007: Character Sheet Tile System with Focus Mode (CE ShipGen Pattern)
**Priority:** Critical  
**Description:** Character display as tiles with expandable focus mode — **exactly like CE ShipGen**

**Tile System (Same as CE ShipGen Ship Design Tiles):**

**Tile Sections (6 tiles):**
1. **Header Tile** — Name, Species, Career Summary, Age, Terms
2. **Characteristics Tile** — STR, DEX, END, INT, EDU, SOC with modifiers (e.g., STR 7 → DM -1)
3. **Skills Tile** — Grouped by category (Personal, Service, Specialist, Advanced)
4. **Career History Tile** — Timeline of career terms with ranks and events
5. **Equipment Tile** — Categorized gear (Weapons, Armor, Tools, Personal Items)
6. **Connections & Background Tile** — Homeworld, allies, enemies, wounds

**Tile States (Same as CE ShipGen):**

**1. Inactive (Collapsed)** — Default state
```
┌─────────────────────────────────────────────────┐
│ ▶ Header                              [Focus 🔍]  │
│ Name: John Smith | Species: Human | Career: —   │
└─────────────────────────────────────────────────┘
```
- Shows summary information only
- Click header or "Focus" button to expand
- Desktop: Multiple tiles visible side-by-side
- Phone: Tiles stacked, only summaries visible

**2. Active (Expanded)** — Click to expand
```
┌─────────────────────────────────────────────────┐
│ ▼ Header                              [🔍]     │
│ Name: John Smith                                │
│ Species: Human                                  │
│ Career: Marine (2 terms)                        │
│ Rank: Lieutenant                                │
│ Age: 26                                         │
│ [Edit] [Randomize]                              │
└─────────────────────────────────────────────────┘
```
- Shows full content for that tile
- Edit controls visible
- Other tiles remain visible but inactive

**3. Focused (Full-Screen Overlay)** — Click "Focus" button or tile header
```
┌──────────────────────────────────────────────────────────────────┐
│  [Logo] CharacterGen          [Generate] [Library] [Settings]     │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐│
│  │ ▼ Header Tile (FOCUSED)                              [X]   ││
│  ├────────────────────────────────────────────────────────────┤│
│  │                                                            ││
│  │ Name:          [John Smith              ]                  ││
│  │ Species:        [Human ▼]                                  ││
│  │ Career:         [Marine ▼] (2 terms)                       ││
│  │ Rank:           [Lieutenant        ]                      ││
│  │ Age:            [26                  ]                      ││
│  │                                                            ││
│  │ [🎲 Randomize All] [💾 Save] [📋 Copy]                     ││
│  │                                                            ││
│  └────────────────────────────────────────────────────────────┘│
│                                                                  │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐             │
│  │ Character-   │ │ Skills       │ │ Career       │             │
│  │ istics       │ │ (inactive)   │ │ History      │             │
│  │ (inactive)   │ │              │ │ (inactive)   │             │
│  └──────────────┘ └──────────────┘ └──────────────┘             │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```
- Tile expands to fill available space (desktop: 70% width; phone: full screen)
- Background tiles collapse to minimal headers
- All controls for that section visible
- **Press ESC** or click "Exit Focus" (X button) to return
- **Mobile:** Swipe between tiles in focus mode (optional)

**4. Completed** — After user finishes editing
```
┌─────────────────────────────────────────────────┐
│ ✓ Header                              [Focus]   │
│ Name: John Smith | Species: Human | Career: Marine│
└─────────────────────────────────────────────────┘
```
- Green checkmark indicator
- Shows data is valid and complete

**Tile Interactions:**
- **Click tile header:** Toggle between Inactive ↔ Active
- **Click "Focus" button:** Enter Focus Mode
- **Press ESC:** Exit Focus Mode
- **Click another tile:** That tile becomes Active (previous collapses)
- **Desktop:** Multiple tiles can be Active simultaneously (side-by-side)
- **Phone:** Only one tile Active at a time (stacked view)

**Focus Mode Behavior:**
- Desktop: Focused tile expands to 70% width, others shrink to 15% (headers only)
- Phone: Focused tile goes full-screen, swipe to navigate between tiles
- Always show "Exit Focus" button (X) in top-right
- Always allow ESC key to exit

**Acceptance:** 
- [ ] All 6 tiles render correctly
- [ ] Click tile header toggles Active/Inactive
- [ ] "Focus" button enters full-screen mode
- [ ] ESC key exits focus mode
- [ ] Focus mode works on desktop (expanded tile, collapsed others)
- [ ] Focus mode works on phone (full-screen, swipe optional)
- [ ] Checkmark shows for completed/valid tiles
- [ ] All tiles accessible in both Desktop and Phone layouts

---

#### FR-008: Startup Screen & App Flow (Entry Point)
**Priority:** High  
**Description:** Entry point with navigation to three main views — **exactly like CE ShipGen**

**Startup Screen Layout:**
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
│  │   Create a new character instantly                   │ │
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
│  ┌──────────────────────────────────────────────────────┐ │
│  │  ❓ Help & About                                     │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                            │
│         Version 0.2.6-dev | M2.6: Version Control          │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

**Startup Screen Elements:**

**1. Branding Area (Top)**
- GI7B logo (upper right)
- App name: "Cepheus Engine Character Generator"
- Tagline: "Create characters instantly"

**2. Primary Action (Center)**
- **"+ GENERATE CHARACTER"** — Large, prominent button
- Color: Accent cyan (like CE ShipGen)
- Action: Navigate to `/generate`
- Description: "Create a new character instantly"

**3. Secondary Actions (Middle)**
- **"📚 Character Library"** — Left card
  - Shows saved character count (e.g., "32 characters saved")
  - Action: Navigate to `/library`
  - Description: "Browse and load saved characters"
  
- **"⚙️ Settings"** — Right card
  - Action: Navigate to `/settings`
  - Description: "Customize rules, edit careers, manage versions"

**4. PWA Install (Conditional)**
- **"📥 Install App"** — Shows only if PWA is installable
- Action: Trigger install prompt
- Hidden after install or on iOS (shows manual instructions instead)

**5. Tertiary Action**
- **"❓ Help & About"** — Link
- Action: Show help modal or navigate to about page

**6. Version Info (Bottom)**
- Current version
- Current milestone (e.g., "M2.6: Version Control")

**App Flow:**
```
┌────────────────────────────────────────────────────────────┐
│  STARTUP SCREEN (/)                                        │
│  ┌──────────────────────────────────────────────────────┐ │
│  │                                                      │ │
│  │   [ + GENERATE CHARACTER ] ───────┐                  │ │
│  │                                   │                  │ │
│  │   [📚 Library] [⚙️ Settings]      │                  │ │
│  │       │                │          │                  │ │
│  └───────┼────────────────┼──────────┼──────────────────┘ │
│          │                │          │                    │
│          ▼                ▼          ▼                    │
│  ┌───────────────┐ ┌──────────┐ ┌──────────────┐       │
│  │ /generate     │ │ /library │ │ /settings    │       │
│  │ Character     │ │Character │ │ App config   │       │
│  │ Generation    │ │ Library   │ │ Data tables  │       │
│  │ (tile-based)  │ │           │ │ Version ctrl │       │
│  └───────────────┘ └──────────┘ └──────────────┘       │
│                                                          │
└────────────────────────────────────────────────────────────┘
```

**Navigation Pattern:**

**From Startup Screen:**
1. **Click "Generate Character"** → Navigate to `/generate`
2. **Click "Character Library"** → Navigate to `/library`
3. **Click "Settings"** → Navigate to `/settings`
4. **Click "Install App"** (if shown) → Trigger PWA install

**From Any Other Screen (Header Navigation):**
```
┌────────────────────────────────────────────────────────────┐
│ [Logo]  CharacterGen   [Generate] [Library] [Settings] [📱] │
└────────────────────────────────────────────────────────────┘
         │                  │         │         │      │
         ▼                  ▼         ▼         ▼      ▼
    Return to         Character   Character  App    Layout
    Startup          Generation   Library    Config   Toggle
```

**Header Navigation (All non-startup screens):**
- **Logo** → Returns to Startup (`/`)
- **"Generate"** → Navigate to `/generate`
- **"Library"** → Navigate to `/library`
- **"Settings"** → Navigate to `/settings`
- **Layout Toggle (📱/🖥️)** → Switch between Phone/Desktop mode
- **"Installed" badge** (if in standalone mode)

**URL Routing:**
| Route | View | Description | Accessible From |
|-------|------|-------------|-----------------|
| `/` | `StartupScreen` | Entry point, app branding, navigation | Initial load, Logo click |
| `/generate` | `CharacterGenerationView` | Main generation interface | "Generate" button |
| `/library` | `LibraryView` | Character library, search/filter | "Library" button |
| `/character/:id` | `CharacterView` | View specific character details | Library selection |
| `/settings` | `SettingsScreen` | App config, data table editing | "Settings" button |
| `/settings/:section` | `SettingsScreen` | Deep link to settings section | Direct URL |

**Navigation Rules:**
- **Startup screen** (`/`) has **NO header** — clean entry point
- **All other screens** have persistent **header navigation**
- **Browser back button** works naturally between views
- **Direct URL access** works (e.g., bookmark `/library`)
- **URL updates** when switching views via navigation
- **Refreshing page** preserves current view (thanks to React Router)

**Responsive Behavior:**
- **Desktop:** All navigation buttons visible with text labels
- **Tablet:** Buttons with icons + text
- **Phone:** Icon-only buttons in header, full buttons on Startup

**Acceptance:** 
- [ ] Startup screen shows three main navigation options (Generate, Library, Settings)
- [ ] "Generate Character" is primary/ prominent button
- [ ] Install prompt shows conditionally (FR-021)
- [ ] Header navigation appears on all non-startup screens
- [ ] Logo in header returns to Startup
- [ ] All routes accessible via navigation
- [ ] URL changes reflect current view
- [ ] Browser back/forward works correctly
- [ ] Mobile navigation adapts (icon-only in header)
- Direct URL access to any route (e.g., bookmark /library)
- URL updates when switching views
- Refreshing page preserves current view

**Acceptance:** All routes accessible, URL changes reflect view state, browser navigation works, mobile-friendly

---

#### FR-008b: Three-Core View Architecture
**Priority:** High  
**Description:** The app is organized around three primary functional areas: Character Generation, Library, and Settings

**Core Philosophy:** Like CE ShipGen, the app separates concerns into three distinct views, each with persistent URLs:

### 1. Character Generation (`/generate`)
**Purpose:** The primary interface for creating characters

**Components:**
- Parameter Panel (left/top) — Generation constraints, career filters
- Character Sheet (center) — Real-time display of generated character
- Generation Log (right/bottom) — History of rolls and decisions

**Key Features:**
- One-click "Generate" button produces complete character
- Constraints panel: species, career types, tech level limits
- Real-time updates as generation progresses
- Focus mode for individual tiles (characteristics, skills, equipment)

**URL Integration:**
- `/generate` — Standard generation view
- `/generate?template=marine` — Pre-select Marine career filter
- Query params persist constraint selections

### 2. Character Library (`/library`)
**Purpose:** Browse, search, and manage saved characters

**Components:**
- Search/Filter Bar — Name, career, species, date generated
- Character Grid/List — Thumbnails with key stats
- Character Detail Panel — Full character view on selection
- Batch Actions — Export multiple, delete group

**Key Features:**
- Grid view (cards) and List view (table) toggle
- Sort by: Name, Date, Career, Terms, Age
- Filter by: Species, Career type, Alive/Dead, Has Equipment
- Quick actions: Load, Duplicate, Export, Delete
- Batch generation results appear here automatically

**URL Integration:**
- `/library` — Full library view
- `/library?career=marine` — Filtered to Marines
- `/character/:id` — Direct link to specific character

### 3. Settings (`/settings`)
**Purpose:** Configure app, edit data tables, manage versions

**Sections:**
- **Rules** — Toggle CE/Mneme, individual rule options
- **JSON Editor** — Edit careers, skills, equipment tables
- **Data Management** — Import/export settings, reset to defaults
- **Version Control** — Update prompts, rollback, release channels
- **About** — Version info, credits, links

**Key Features:**
- Auto-save on all edits (no "Save" button in table view)
- Settings snapshots for named configurations
- Version history with rollback capability
- Release channel selection (stable/beta)

**URL Integration:**
- `/settings` — Overview/settings landing
- `/settings/rules` — Deep link to rules section
- `/settings/json` — JSON editor open
- `/settings/version` — Version control section

**Navigation Between Views:**
```
┌─────────────────────────────────────────────────────────┐
│  [Logo]  CharacterGen              [Generate] [Library] [Settings]  │
└─────────────────────────────────────────────────────────┘
│                                                         │
│  VIEW: Character Generation                             │
│  ┌────────────┐  ┌──────────────────┐  ┌──────────┐  │
│  │ Parameters │  │ Character Sheet  │  │   Log    │  │
│  │            │  │  (Tiles)         │  │          │  │
│  └────────────┘  └──────────────────┘  └──────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  [Logo]  CharacterGen              [Generate] [Library] [Settings]  │
└─────────────────────────────────────────────────────────┘
│                                                         │
│  VIEW: Library                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │ [Search] [Filter ▼] [Sort ▼]  [Grid/List ▼]     │   │
│  ├─────────────────────────────────────────────────┤   │
│  │ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐        │   │
│  │ │Char1│ │Char2│ │Char3│ │Char4│ │Char5│ ...    │   │
│  │ └─────┘ └─────┘ └─────┘ └─────┘ └─────┘        │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  [Logo]  CharacterGen              [Generate] [Library] [Settings]  │
└─────────────────────────────────────────────────────────┘
│                                                         │
│  VIEW: Settings                                         │
│  ┌────────────┐  ┌──────────────────────────────────┐   │
│  │  Sidebar   │  │          Content Area            │   │
│  │            │  │                                  │   │
│  │ ○ Rules    │  │  [Active Section Content]       │   │
│  │ ● JSON     │  │                                  │   │
│  │ ○ Data     │  │  [Tables, Editors, Controls]    │   │
│  │ ○ Version  │  │                                  │   │
│  │            │  │                                  │   │
│  └────────────┘  └──────────────────────────────────┘   │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Acceptance:** Three views clearly defined, each with distinct purpose, persistent URLs, smooth navigation between them

---

#### FR-009: Settings Screen with JSON Editor
**Priority:** High  
**Description:** Pre-generation configuration with editable data tables and version control

**URL:** `/settings` or `/settings/:section`

**Sections:**

**1. Layout Settings** (`/settings/layout`)
- Desktop/Phone mode toggle
- Theme: Dark/Light/Auto
- Animation preferences
- Font size adjustments

**2. Rule Settings** (`/settings/rules`)
- Master toggle: Cepheus / Mneme / Custom
- Individual rule options:
  - Unified Roll System (on/off)
  - Automatic Re-Enlistment (on/off)
  - Aging mechanics (Term 5 start / RAW)
  - Anagathics complexity (Simplified / RAW)
- Custom rule import (for house rules)

**3. Career Management** (`/settings/careers`) — NEW in M2
**Purpose:** Select which careers from `careers.json` are "active" (available for generation)

**How It Works:**
- All 24 careers are stored in ONE file: `careers.json`
- Career Management UI lets GM toggle `enabled` field per career
- Only "active" (enabled) careers appear in `/generate` dropdown
- Disabled careers are excluded from random generation

**Career Selection UI:**
- **Master List:** Shows all careers from `careers.json` with checkboxes
- **Active Indicator:** Green dot for enabled, gray for disabled
- **Filter by Category:** Military, Civilian, Criminal, Elite, etc.
- **Quick Actions:**
  - "Enable All" — Activate all careers
  - "Disable All" — Deactivate all careers  
  - "Reset to Default" — Restore canonical active list
- **Visual Indicators:**
  - Enabled: Full color, selectable in generation
  - Disabled: Grayed out, tooltip shows "Disabled in settings"

**GM Workflow:**
1. Open Career Management (`/settings/careers`)
2. See complete list of all 24 careers from `careers.json`
3. Uncheck careers not in their setting (e.g., disable "Noble" for frontier campaign)
4. Changes saved to `careers.json` `enabled` fields
5. Only checked careers appear in generation dropdown

**Per-Career Overrides (Advanced):**
- Override qualification target
- Override survival target  
- Custom skill tables

**Active Careers Display:**
```
┌─────────────────────────────────────────────────────────┐
│ CAREER MANAGEMENT — 22 of 24 Active                     │
├─────────────────────────────────────────────────────────┤
│ [Filter: All ▼] [Search] [✓ Enable All] [✗ Disable All] │
├─────────────────────────────────────────────────────────┤
│ ☑ Drifter              [Civilian]   [🎲 Qual: Auto]     │
│ ☑ Marine               [Military]   [🎲 Qual: 6+]       │
│ ☑ Scout                [Exploration] [🎲 Qual: 5+]        │
│ ☐ Noble                [Elite]      [🎲 Qual: 10+]      │ ← Inactive
│ ☑ Pirate               [Criminal]   [🎲 Qual: 6+]       │
│ ☐ Physician            [Professional] [🎲 Qual: 8+]       │ ← Inactive
│ ☑ Colonist             [Civilian]   [🎲 Qual: 5+]       │
│ ... (18 more from careers.json)                         │
├─────────────────────────────────────────────────────────┤
│ Legend: ☑ Active (appears in generation)                │
│         ☐ Inactive (hidden from generation)               │
├─────────────────────────────────────────────────────────┤
│ [Reset to All Active] [Save to careers.json]            │
└─────────────────────────────────────────────────────────┘
```
  
**Career JSON Schema (careers.json):**
```json
{
  "_metadata": {
    "version": "1.0",
    "description": "Cepheus Engine Core Rulebook - All 24 careers",
    "source": "Cepheus Engine SRD",
    "totalCareers": 24,
    "activeCareers": 22,
    "lastUpdated": "2026-03-03",
    "careersList": [
      {"id": "drifter", "name": "Drifter", "category": "Civilian", "enabled": true},
      {"id": "marine", "name": "Marine", "category": "Military", "enabled": true},
      {"id": "scout", "name": "Scout", "category": "Exploration", "enabled": true},
      {"id": "noble", "name": "Noble", "category": "Elite", "enabled": false}
    ]
  },
  "drifter": {
    "id": "drifter",
    "name": "Drifter",
    "enabled": true,
    "category": "civilian",
    "description": "Wanderers, travellers, and those who live on the fringes of society without a fixed home or career.",
    
    "qualification": {
      "roll": "2D6",
      "target": 0,
      "dm": {},
      "auto": true,
      "description": "Automatic entry - anyone can be a drifter"
    },
    "survival": {
      "roll": "2D6",
      "target": 6,
      "dm": {"end": 1},
      "description": "Roll 2D6 + END DM vs 6"
    },
    "commission": {
      "has": false
    },
    "advancement": {
      "roll": "2D6",
      "target": 7,
      "dm": {"int": 1},
      "description": "Roll 2D6 + INT DM vs 7"
    },
    "reenlistment": {
      "roll": "2D6",
      "target": 0,
      "automatic": true,
      "description": "Automatic re-enlistment allowed"
    },
    
    "rank1": {"title": "Wanderer", "skill": null},
    "rank2": {"title": "Vagabond", "skill": "Streetwise 1"},
    "rank3": {"title": "Traveller", "skill": "Deception 1"},
    "rank4": {"title": "Itinerant", "skill": null},
    "rank5": {"title": "Wayfarer", "skill": "Jack of all Trades 1"},
    "rank6": {"title": "Nomad", "skill": "Survival 1"},
    
    "material_benefit1": {"roll": 1, "benefit": "Contact", "description": "Gain a contact in the underworld"},
    "material_benefit2": {"roll": 2, "benefit": "Weapon", "description": "Any personal weapon"},
    "material_benefit3": {"roll": 3, "benefit": "Alliance", "description": "Gain an ally in a criminal organization"},
    "material_benefit4": {"roll": 4, "benefit": "Ship Share", "description": "One share in a ship"},
    "material_benefit5": {"roll": 5, "benefit": "Ship Share", "description": "One share in a ship"},
    "material_benefit6": {"roll": 6, "benefit": "Life Insurance", "description": "Insurance pays to next of kin"},
    
    "cash_benefit1": {"roll": 1, "amount": 1000},
    "cash_benefit2": {"roll": 2, "amount": 5000},
    "cash_benefit3": {"roll": 3, "amount": 10000},
    "cash_benefit4": {"roll": 4, "amount": 10000},
    "cash_benefit5": {"roll": 5, "amount": 20000},
    "cash_benefit6": {"roll": 6, "amount": 50000},
    
    "personal_skill1": "+1 STR",
    "personal_skill2": "+1 DEX",
    "personal_skill3": "+1 END",
    "personal_skill4": "+1 INT",
    "personal_skill5": "+1 EDU",
    "personal_skill6": "+1 SOC",
    
    "service_skill1": "Athletics",
    "service_skill2": "Melee",
    "service_skill3": "Recon",
    "service_skill4": "Streetwise",
    "service_skill5": "Survival",
    "service_skill6": "Vacc Suit",
    
    "advanced_skill1": "Leadership",
    "advanced_skill2": "Tactics",
    "advanced_skill3": "Deception",
    "advanced_skill4": "Persuade",
    "advanced_skill5": "Streetwise",
    "advanced_skill6": "Jack of all Trades"
  },
  "marine": { /* Same structure for all 24 careers */ },
  "scout": { /* Same structure */ }
}
```

**Key Points:**
- ONE file contains ALL 24 careers
- `_metadata` header describes file contents
- Each career has `enabled` boolean for active/inactive state
- **Career Fields:** name (PK), description, qualification, survival, commission, advancement, reenlistment
- **Ranks & Skills:** 6 fields (rank1-rank6 with title and skill)
- **Benefits:** 6 material benefit fields + 6 cash benefit fields
- **Skills & Training:** 6 personal + 6 service + 6 advanced education fields
- **Skill Mechanics:** Character always gains at least 1 skill level per term (minimum guarantee on survival)
- GM can toggle `enabled` field via Career Management UI

**Note on Career Mechanics:** The detailed algorithms for career generation (enlistment rolls, survival outcomes, skill selection, advancement probabilities, re-enlistment, and aging) will be fully specified in Section 11 during M3 development. Current PRD documents data structure; procedural logic to follow.

**4. JSON Table Editor** (`/settings/json` or `/settings/tables`)
- Select table from dropdown (organized by category):

**Global Character Tables:**
  - `draft.json` — Draft/Conscription assignments
  - `survival_mishaps.json` — Survival failure consequences
  - `injury.json` — Injury severity and effects
  - `medical_bills.json` — Medical treatment costs
  - `aging.json` — Characteristic loss by age
  - `anagathics.json` — Anti-aging drugs (CE and Mneme variants)
  - `retirement_pay.json` — Pension by terms served

**Career Table:**
  - `careers.json` — All 24 careers with full rules data

**Character Components:**
  - `races.json` — Species definitions and modifiers
  - `skills.json` — Skill definitions and categories
  - `equipment.json` — Weapons, armor, gear, assets
  - `homeworlds.json` — World types with background skills
  - `names.json` — Name generators by culture/species

**Settings:**
  - `rules.json` — Rule variants and house rules
  - `_summary.json` — Data catalog and index

- Inline JSON editor with syntax highlighting
- Real-time schema validation (red squiggles on errors)
- Preview changes before applying
- Auto-save on edit (no Save button for table view)
- Explicit "Apply" button for JSON view (handles invalid mid-edit)
- Export individual tables as JSON files

**5. Data Management** (`/settings/data`)
- Export Settings Snapshot — Save current tables + rules as named configuration
- Import Settings Snapshot — Load previously saved or shared configuration
- Export All Data — Complete backup (settings + characters)
- Import All Data — Restore from backup
- Reset to Factory Defaults — Clear all customizations, restore canonical data
  - ⚠️ Confirmation: "Reset all tables and rules to factory defaults? Your saved characters will not be affected."

**6. Version Control** (`/settings/version`)
- Current Version Display — Version number, build date, channel (stable/beta)
- Update Status — "Up to date" or "Update Available: X.Y.Z"
- Changelog Preview — What's new in available update
- Update Now — User-controlled update (never forced)
- Version History — Last 3 versions with Rollback buttons
- Release Channel Toggle — Stable / Beta
- Last Checked — Timestamp of last update check

**Section Navigation:**
- Sidebar with icons: 📐 Layout, 📋 Rules, 🎖️ Careers, 📝 Tables, 💾 Data, 🔄 Version
- Active section highlighted
- URL updates when switching sections (deep-linkable)

**Acceptance:** 
- [ ] All 6 sections accessible via sidebar
- [ ] URL reflects current section (`/settings/careers`, `/settings/json`, `/settings/version`)
- [ ] Career enable/disable works in generation (disabled careers hidden)
- [ ] JSON editor validates schema, shows errors
- [ ] Table edits auto-save with "Saved" toast
- [ ] "Reset to Factory Defaults" works with confirmation
- [ ] Version section shows current version and update status
- [ ] Settings persist across sessions (localStorage)
- [ ] Import/export works for snapshots and full data

---

#### FR-010: Rules Toggle (CE vs Mneme Variant)
**Priority:** Medium  
**Description:** Switch between Standard Cepheus Engine and Mneme Variant rules

**Master Toggle:** Standard CE / Mneme Variant

**When Mneme Variant is Active:**

**1. Unified Roll System**
- All core rolls (Qualification, Survival, Advancement) use 2D6 vs Difficulty
- Simplified DM structure

**2. Automatic Re-Enlistment**
- No separate re-enlistment roll required
- Players choose freely whether to continue or muster out

**3. Streamlined Aging**
- Aging begins Term 5 (not Term 4)
- Threshold every 4 years (T5, T9, T13...)
- Roll: 2D6 + End DM vs Difficulty (Terms + 1)

**4. Simplified Anagathics (Anti-Aging Drugs)**
- **Cost:** Fixed 100KCr per term (regardless of TL)
- **Maximum Doses:** (SOC - 7), minimum 1
- **Availability:** Starport A or B only
- **Aging Prevention:** Completely prevents all aging effects for that term
- **Side Effects:** None in simplified variant (RAW has side effect table)
- **Detection:** Automatically detected at Class A starports
- **Reference:** `MNEME_SPACE_COMBAT_SUMMARY.md` (Section 2.3 - Anagathics)

**5. Drifter Auto-Qualification**
- Drifter career has no qualification requirement
- Automatic entry for all characters

**6. Additional Mneme Rules (from reference docs):**
- **Combat:** "Only Players Roll" system (NPCs use static numbers)
- **Superiority System:** Tactics-based initiative (from Mneme Space Combat)
- **MAC:** Multiple Attack Consolidation for faster combat

**Document References:**
- Primary: `MNEME_SPACE_COMBAT_SUMMARY.md` — Complete Mneme rules summary
- Source: `ce-shipgen/PROJECT_NOTES.md` — Implementation lessons from CE ShipGen Mneme integration
- Wiki: https://wiki.gi7b.org/Mneme_Space_Combat — Original Mneme rules

**Acceptance Criteria:**
- [ ] Toggle switches all relevant calculations
- [ ] Anagathics costs, availability, and effects use Mneme variant rules when active
- [ ] Aging mechanics use Mneme variant (Term 5 start)
- [ ] UI indicates "Mneme Rules Active" when variant is selected
- [ ] All document references are accurate and accessible

---

#### FR-011: URL Routing & Navigation
**Priority:** Critical  
**Description:** React Router integration with persistent URLs for all views

**Core Views:**
The app has three primary functional areas:
1. **Character Generation** (`/generate`) — The main generation interface
2. **Character Library** (`/library`) — Browse, search, load saved characters
3. **Settings** (`/settings`) — Configure app, edit data tables, manage versions

**Route Structure:**
| Route | Component | Purpose | Params |
|-------|-----------|---------|--------|
| `/` | `StartupScreen` | Entry point, app launch | — |
| `/generate` | `CharacterGenerationView` | Main generation interface | — |
| `/library` | `LibraryView` | Character library, list view | — |
| `/character/:id` | `CharacterView` | View specific character | `id` — character ID |
| `/settings` | `SettingsScreen` | Settings overview | — |
| `/settings/:section` | `SettingsScreen` | Deep link to section | `section` — rules/json/data/version |
| `/test` | `TestPage` | Development testing interface | — |
| `/test/:section` | `TestPage` | Test section (deep link) | `section` — calculations/components/data/routes/performance/storage |

**Navigation UX:**
- **Header Bar:** Persistent navigation on all non-startup screens
  - Logo → Returns to Startup (`/`)
  - "Generate" button → `/generate`
  - "Library" button → `/library`
  - "Settings" button → `/settings`
  - "Installed" badge (when in standalone mode)
  - Layout toggle (Desktop/Phone)
- **Browser Integration:**
  - URL updates when user navigates between views
  - Browser back/forward buttons work correctly
  - Refreshing page preserves current view
  - Direct URL access works (bookmark any page)
- **Mobile:**
  - Bottom navigation bar in phone mode
  - Swipe gestures for view switching (optional)

**URL Examples:**
- `https://xunema.github.io/cecharactergen/` — Startup
- `https://xunema.github.io/cecharactergen/generate` — Generate character
- `https://xunema.github.io/cecharactergen/library` — Character library
- `https://xunema.github.io/cecharactergen/settings/json` — Settings, JSON editor open
- `https://xunema.github.io/cecharactergen/settings/version` — Settings, version control open

**Technical Implementation:**
- React Router v7 (same as CE ShipGen)
- `BrowserRouter` with basename `/cecharactergen/`
- `useNavigate()` for programmatic navigation
- `useParams()` for route parameters
- `useLocation()` for current path detection

**Acceptance Criteria:**
- [ ] All 6+ routes render correct components
- [ ] URL updates when switching views
- [ ] Browser back button returns to previous view
- [ ] Direct URL access works (no 404 on refresh)
- [ ] Header navigation visible on all non-startup screens
- [ ] Mobile navigation adapts to small screens
- [ ] Settings sections have deep-linkable URLs

---

### 2.3 Technical Requirements (FR-016 to FR-025)

#### FR-016: Progressive Web App
**Priority:** Critical  
**Requirements:**
- Service worker for offline use
- Web App Manifest
- Install prompt
- Works offline after first load
- Background sync (optional)

**Acceptance:** Passes Lighthouse PWA audit

---

#### FR-017: Performance
**Priority:** Critical  
**Targets:**
- First paint: <2s on 4G
- Time to interactive: <5s
- Character generation: <3s
- Calculation updates: <100ms
- Bundle size: <500KB (gzipped, excluding data)

**Acceptance:** Lighthouse Performance score >90

---

#### FR-018: Data Storage
**Priority:** High  
**Requirements:**
- IndexedDB for character library
- LocalStorage for preferences and settings
- Data never sent to server (privacy)
- Export all data function
- Import with validation

**Acceptance:** 100+ characters can be stored locally

---

#### FR-019: Accessibility
**Priority:** High  
**Requirements:**
- WCAG 2.1 AA compliance
- Keyboard navigation
- Screen reader compatible
- Color-blind friendly (not just color)
- Focus indicators
- Alt text for icons

**Acceptance:** Passes axe-core audit

---

#### FR-020: Browser Support
**Priority:** High  
**Requirements:**
- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Android)

**Graceful Degradation:** Core functions work on older browsers

---

#### FR-027: Test Page for Development and Debugging
**Priority:** High  
**Milestone:** M1  
**Description:** Dedicated testing interface for calculations, components, data validation, and debugging

**Rationale:** Accelerates development by providing isolated testing environment. Catches calculation errors and UI bugs early. Serves as regression test suite.

**URL:** `/test` (accessible in both development and production; production version shows confirmation dialog)

**Sections:**

**1. Calculation Tests** (`/test/calculations`)
- Characteristic modifier calculations
- Aging roll simulations
- Career qualification/survival/advancement rolls
- Skill accumulation verification
- Mustering out benefit calculations
- Equipment assignment logic

**Display format:**
```
✓ Characteristic Modifiers (12/12 tests passed)
  STR 7 → DM -1 ✓
  STR 8 → DM 0 ✓
  ...
  
✓ Aging Rolls (50/50 simulations passed)
  Average: 8.2 vs TN 6 (87% pass rate) ✓
  
⚠ Career Qualification (23/24 tests passed)
  Marine, STR 7, END 8 → Qualified ✓
  Scout, INT 5 → Not qualified ✓
  Physician, EDU 9 → FAILED (expected qualified) ✗
```

**2. Component Showcase** (`/test/components`)
- CharacteristicTile (all states: empty, filled, focused)
- SkillRow (levels 0-6, with/without specialty)
- CareerHistoryEntry (single term, multi-term)
- EquipmentCard (weapon, armor, gear)
- LoadingSpinner, ErrorBoundary
- Empty states

**3. Data Validation** (`/test/data`)
Schema validation for all data tables:
- `careers.json` — 24 careers, all required fields present
- `skills.json` — All skills categorized
- `equipment.json` — All items have weight/cost/TL
- `races.json` — All races have modifiers
- `homeworlds.json` — All worlds have background skills

**4. Route Testing** (`/test/routes`)
Verify all routes render correctly:
```
/                    → StartupScreen ✓
/generate            → CharacterGenerationView ✓
/library             → LibraryView ✓
/character/demo-id   → CharacterView ✓
/settings            → SettingsScreen ✓
/settings/rules      → SettingsScreen (Rules section) ✓
/settings/json       → SettingsScreen (JSON section) ✓
/settings/version    → SettingsScreen (Version section) ✓
/test                → TestPage ✓ (self-referential!)
```

**5. Performance Metrics** (`/test/performance`)
Real-time timing data:
- First paint
- Time to interactive
- Character generation average time
- JSON table load times
- Bundle size breakdown

**6. LocalStorage Inspector** (`/test/storage`)
View and manage localStorage:
- List all keys and their sizes
- View values (collapsible JSON)
- Edit values inline
- Delete individual keys
- Clear all storage
- Export storage as JSON
- Import storage from JSON

**Security Note:** LocalStorage inspector in production requires confirmation: "This will show all your saved data. Continue?"

**Navigation:**
- Sidebar with section icons
- "Run All Tests" button at top
- Export test results as JSON

**Acceptance Criteria:**
- [ ] Test page accessible at `/test`
- [ ] All core calculation functions have passing tests
- [ ] Component showcase displays all major UI components
- [ ] Data validation checks schema for all JSON tables
- [ ] Route testing verifies all defined routes
- [ ] Performance metrics display actual timing data
- [ ] LocalStorage inspector shows current storage state
- [ ] "Run All Tests" button executes all suites
- [ ] Test results can be exported as JSON

**Benefits:**
- Early bug detection in calculations
- Visual regression testing
- Data validation before releases
- Performance baseline tracking
- Debugging aid for user issues

---

## 3. DATA REQUIREMENTS

### 3.1 Embedded Data

**Core JSON Data Tables (M2 Deliverables):**

These files are created and populated with canonical data during **M2: Settings & Data Tables** milestone:

**Global Character Tables (Shared Across All Careers):**

1. **`draft.json`** — Draft/Conscription Table
   - Characters drafted if they fail career qualification
   - Draft assignment by roll (which career they get drafted into)
   - Draft-specific survival DMs

2. **`survival_mishaps.json`** — Survival Mishaps Table
   - What happens when a character fails survival roll
   - Mishap descriptions and consequences
   - Career-ending events

3. **`injury.json`** — Injury Table
   - Injury severity levels (1-6 scale)
   - Characteristic damage by injury type
   - Recovery times and medical care needed
   - Permanent effects

4. **`medical_bills.json`** — Medical Bills Table
   - Cost per injury severity level
   - Cost by tech level available
   - Starport class impact on pricing

5. **`aging.json`** — Aging Table
   - Characteristic loss by age bracket
   - Aging roll thresholds
   - Anagathics interaction
   - Death from aging rules

6. **`anagathics.json`** — Anagathics (Anti-Aging Drugs) Table
   - **Standard CE Rules:**
     - Cost by tech level (100KCr at TL 12+)
     - Side effects table
     - Availability by starport
   - **Mneme Variant Rules (Simplified):**
     - Fixed cost: 100KCr per term
     - Max doses: (SOC - 7)
     - Available at Class A/B starports
     - No side effects
   - **Reference:** `MNEME_SPACE_COMBAT_SUMMARY.md` Section 2.3

7. **`retirement_pay.json`** — Retirement Pay by Terms Served Table
   - Annual pension amount by total terms served
   - Multi-career retirement calculation
   - Pension modifiers by rank achieved

**Career Table:**

7. **`careers.json`** — ALL 24 Careers in ONE File
   - **M2 Content:** Single comprehensive JSON file with metadata header
   - **Structure:**
     - `_metadata` header describing all careers in file
     - Each career object with ID as key
   
   **Per-Career Fields:**
   
   **Basic Info:**
   - `name` — Career name (string, primary key/identifier)
   - `description` — Full career description (text)
   - `enabled` — Boolean (active/inactive for generation)
   - `category` — Military, Civilian, Criminal, Elite, etc.
   
   **Core Rolls:**
   - `qualification` — { roll: "2D6", target: number, dm: {}, auto: boolean }
   - `survival` — { roll: "2D6", target: number, dm: {} }
   - `commission` — { roll: "2D6", target: number, dm: {} } (if applicable)
   - `advancement` — { roll: "2D6", target: number, dm: {} }
   - `reenlistment` — { roll: "2D6", target: number, automatic: boolean }
   
   **Ranks & Skills (6 fields):**
   - `rank1` — { title: string, skill: string | null }
   - `rank2` — { title: string, skill: string | null }
   - `rank3` — { title: string, skill: string | null }
   - `rank4` — { title: string, skill: string | null }
   - `rank5` — { title: string, skill: string | null }
   - `rank6` — { title: string, skill: string | null }
   
   **Material Benefits (6 columns):**
   - `material_benefit1` — { roll: number, benefit: string, description: string }
   - `material_benefit2` — { roll: number, benefit: string, description: string }
   - `material_benefit3` — { roll: number, benefit: string, description: string }
   - `material_benefit4` — { roll: number, benefit: string, description: string }
   - `material_benefit5` — { roll: number, benefit: string, description: string }
   - `material_benefit6` — { roll: number, benefit: string, description: string }
   
   **Cash Benefits (6 columns):**
   - `cash_benefit1` — { roll: number, amount: number }
   - `cash_benefit2` — { roll: number, amount: number }
   - `cash_benefit3` — { roll: number, amount: number }
   - `cash_benefit4` — { roll: number, amount: number }
   - `cash_benefit5` — { roll: number, amount: number }
   - `cash_benefit6` — { roll: number, amount: number }
   
   **Skills & Training - Personal Development (6 fields):**
   - `personal_skill1` — Skill name or "+1 STR/DEX/END/INT/EDU/SOC"
   - `personal_skill2` — Skill name
   - `personal_skill3` — Skill name
   - `personal_skill4` — Skill name
   - `personal_skill5` — Skill name
   - `personal_skill6` — Skill name
   
   **Skills & Training - Service Skills (6 fields):**
   - `service_skill1` — Skill name
   - `service_skill2` — Skill name
   - `service_skill3` — Skill name
   - `service_skill4` — Skill name
   - `service_skill5` — Skill name
   - `service_skill6` — Skill name
   
   **Skills & Training - Advanced Education (6 fields):**
   - `advanced_skill1` — Skill name
   - `advanced_skill2` — Skill name
   - `advanced_skill3` — Skill name
   - `advanced_skill4` — Skill name
   - `advanced_skill5` — Skill name
   - `advanced_skill6` — Skill name

**Character Components:**

8. **`races.json`** — Species definitions with modifiers
   - Default Human species (canonical CE definition)
   - Structure: `id`, `name`, `modifiers` (characteristics), `traits`, `enabled` (boolean)

9. **`skills.json`** — Skill definitions and categories
   - All skills with descriptions
   - Skill categories (Personal, Service, Specialist, Advanced)
   - Cascade skills (Gun Combat → specific weapons)

10. **`equipment.json`** — Weapons, armor, gear, assets
    - Weapons: damage, range, cost, TL, mass
    - Armor: protection, cost, TL
    - Gear: tools, survival equipment, medical
    - Assets: ship shares, property

11. **`homeworlds.json`** — World types with background skills
    - World classifications (High Tech, Low Tech, etc.)
    - Background skill options per world type

12. **`names.json`** — Name generators by culture/species
    - Name tables for human cultures
    - Alien species naming conventions

**Settings & Configuration:**

13. **`rules.json`** — Rule variants and house rules
    - CE vs Mneme rule differences
    - Optional rules toggles
    - Custom rule definitions

14. **`_summary.json`** — Data catalog and schema index
    - Master list of all tables
    - Cross-references between tables

**Total:** 15 core JSON tables with 300+ data entries

### 3.2 Data Schema

See `MASTER_RULES_CONSOLIDATION.md` for complete schemas

Key entities:
- Character (main object)
- Characteristics, Skills, Career History
- Equipment[], Connections

### 3.3 Calculation Engine

**Must implement:**
- Characteristic modifiers
- Career qualification/survival/advancement
- Aging mechanics
- Skill accumulation
- Equipment assignment
- Mustering out rolls

---

## 4. USER STORIES

### 4.1 Primary Use Cases

**US-001: New Player Generates First Character**
1. Opens app on phone
2. Clicks "Generate Character"
3. Sees complete character instantly
4. Reviews career history and equipment
5. Saves to library
6. Exports to JSON for game

**US-002: GM Creates NPCs**
1. Opens app on laptop
2. Switches to "Batch Mode"
3. Sets constraints ("military careers only")
4. Generates 20 NPCs
5. Reviews and exports as group
6. Uses in game session

**US-003: Player Customizes Content**
1. Opens Settings
2. Edits careers.json to add house rule careers
3. Imports custom equipment module
4. Generates character with new content
5. Exports custom module to share

**US-004: Campaign Group Shares Content**
1. GM exports settings snapshot with custom careers
2. Shares file via messaging
3. Players import to their local copy
4. Everyone uses same custom rules

---

## 5. NON-FUNCTIONAL REQUIREMENTS

### 5.1 Security
- No server-side processing (pure client-side)
- No personal data collection
- No cookies for tracking
- All calculations local

### 5.2 Privacy
- Characters stored locally only
- No cloud sync required
- Export/import under user control
- Clear data deletion option

### 5.3 Maintainability
- Component-based architecture
- TypeScript for type safety (recommended)
- Unit tests for calculations
- E2E tests for critical paths

---

## 6. OUT OF SCOPE (Future Releases)

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

## 7. ACCEPTANCE CRITERIA

### 7.1 MVP Complete When:
- [ ] Character generation functional (all 9 steps)
- [ ] 200+ data entries correctly loaded
- [ ] Real-time calculations accurate
- [ ] Validation works (hard/soft constraints)
- [ ] Character library functional
- [ ] Export to JSON and text
- [ ] PWA installable
- [ ] Works offline
- [ ] Mobile responsive
- [ ] Zero calculation errors

### 7.2 Quality Gates:
- [ ] Unit tests: >80% coverage
- [ ] E2E tests: All critical paths
- [ ] Performance: Lighthouse >90
- [ ] Accessibility: WCAG AA
- [ ] Browser testing: All supported

---

## 8. RISKS AND MITIGATION

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| Complex career rule errors | Medium | High | Extensive unit tests, reference validation |
| Performance on low-end devices | Medium | Medium | Optimize bundle, lazy loading |
| Browser compatibility issues | Low | Medium | Feature detection, graceful degradation |
| Data migration complexity | Low | Medium | Version tagging, migration scripts |
| Scope creep | High | Medium | Strict MVP definition, future versions list |

---

## 9. GLOSSARY

- **CE:** Cepheus Engine
- **Mneme:** Mneme CE Character Creation Rules
- **PWA:** Progressive Web App
- **DM:** Dice Modifier
- **2D6:** Two six-sided dice
- **TL:** Tech Level
- **Cr:** Credits
- **KCr:** Thousand Credits
- **MCr:** Million Credits
- **Term:** 4-year career period

---

## 10. REFERENCES

1. Cepheus Engine SRD Chapter 1-5
2. Mneme CE Character Creation Wiki
3. CE ShipGen PRD (structural reference)
4. GI7B Career Cards (24 careers reference)

---

---

## 11. ADDENDUM — Session Requirements (Post-Initial PRD)

### 11.1 PWA Install Prompt & Install-State Indicator (FR-021)

**Priority:** High  
**Milestone:** M2.5  
**Based on:** CE ShipGen FR-021

**Problem Statement:**
Users visiting the web version have no clear signal that the app can be saved to their desktop/home screen, nor any indication of which mode they are currently running in (web vs. installed PWA).

**Requirements:**

**FR-021a: Install Prompt**
- Detect PWA installability via `beforeinstallprompt` event
- Show prominent "Install App" button on Startup screen when installable
- iOS: Show manual instructions "Tap Share → Add to Home Screen"
- After install, suppress prompt (store `install_prompted` flag)

**FR-021b: Running-Mode Indicator**
- Detect standalone mode via `window.matchMedia('(display-mode: standalone)')`
- Show persistent "Installed" badge (green dot) in header when in standalone mode
- Show "Install for offline use" link in web/browser mode

**FR-021c: Offline Status**
- Display status indicator when offline
- Offline: "Offline — using local data" (amber)
- Online: no indicator (default)

---

### 11.2 Auto-Save & Settings Workflow (FR-022)

**Priority:** High  
**Milestone:** M2.5  
**Based on:** CE ShipGen FR-022

**Core Principle:** The app always auto-saves. The canonical `data/*.json` files are read-only factory defaults. User's personal layer lives in localStorage on top of those defaults.

**Data Architecture:**

| Layer | Storage | Contains | User action to reset |
|-------|---------|----------|---------------------|
| Factory defaults | `data/*.json` (shipped) | Canonical tables | N/A — read-only |
| Live working state | `localStorage` (`ce_char_live_*`) | Current tables + rules | "Reset to Defaults" |
| Named snapshots | `localStorage` (`ce_char_presets`) | Saved settings states | Delete snapshot |
| Character library | IndexedDB | Saved characters | Never auto-reset |

**FR-022a: Auto-Save on Edit**
- Table view: save to localStorage on every cell commit — no Save button
- JSON view: keep explicit "Apply" button (mid-edit JSON may be invalid)
- Show brief "Saved" toast (1.5s) after auto-save

**FR-022b: Reset Live State to Factory Defaults**
- In Settings → Data Management: "Reset All to Defaults" button
- Clears all `ce_char_live_*` keys and `ce_char_rules` from localStorage
- **Never touches character library**
- Confirmation: "Reset all tables and rules to factory defaults? Your saved characters will not be affected."

---

### 11.3 Input Security — Editable Tables (FR-023)

**Priority:** High  
**Milestone:** M2.5  
**Based on:** CE ShipGen FR-023

**Threat Model:**

| Threat | Vector | Risk Level | Mitigation |
|--------|--------|------------|------------|
| Stored XSS | Inject `<script>` into table fields | Low | React/vanilla JS text rendering (never use innerHTML) |
| Schema confusion | Wrong type in numeric field | Medium | Schema validation on import + type coercion on load |
| Malicious JSON import | Shared corrupted module | Medium | Schema validation, reject if >10% rows fail |

**Requirements:**

**FR-023a: Schema Validation on Import**
- Validate imported JSON against expected schema for that table
- Check: required fields present, types correct
- Reject import if >10% of rows fail validation

**FR-023b: Type Coercion on Load**
- When reading from localStorage, coerce to expected types
- Numeric: `Number(value)` with NaN fallback to 0
- String: `String(value).slice(0, 500)` (max 500 chars)
- Boolean: explicit true/false check

**FR-023c: No innerHTML with Table Data**
- Hard constraint: never use `innerHTML` or `dangerouslySetInnerHTML` with table data
- Always use textContent or React's JSX text rendering

---

### 11.4 Settings Snapshots (FR-024)

**Priority:** High  
**Milestone:** M2.5  
**Based on:** CE ShipGen FR-024

**Problem Statement:** Users need ability to name and preserve distinct settings configurations — e.g., "Hard Science" variant, "Pirate Campaign" variant, "Standard CE" baseline.

**Concept:** Think save slots in a game. Live working state is active game. Snapshots are save files.

**FR-024a: Snapshot Storage Structure**

All snapshots stored under single localStorage key:
```
ce_char_presets → Array of Preset objects
```

Preset object schema:
```json
{
  "id": "260303:143045",
  "name": "260303:143045",
  "createdAt": "2026-03-03T14:30:45Z",
  "updatedAt": "2026-03-03T14:30:45Z",
  "tables": {
    "careers": [ ... ],
    "skills": [ ... ],
    "equipment": [ ... ],
    "races": [ ... ],
    "homeworlds": [ ... ]
  },
  "rules": {
    "ruleSet": "cepheus",
    "unifiedRolls": true,
    "autoReenlist": false,
    "...": "full RuleSet object"
  }
}
```

**Default name format:** `YYMMDD:HHMMSS`

**FR-024b: Save Snapshot**
- Button: "Save Snapshot" in Settings → Data Management
- Default name pre-filled as `YYMMDD:HHMMSS` (editable inline)
- Captures full current state: all live tables + rule preferences
- Maximum 50 snapshots (warning when approaching limit)

**FR-024c: Snapshots List**
- Display as card list in Settings → Data Management
- Each entry shows: Name (editable), Created timestamp, Active indicator
- Actions: **Load**, **Rename**, **Export**, **Delete**

**FR-024d: Load Snapshot**
- Replaces all `ce_char_live_*` keys and `ce_char_rules` in localStorage
- Toast: "Loaded '[name]'"

**FR-024e: Export/Import Snapshot**
- Export: Downloads snapshot as `.json` file
- Filename: `ce-char-[name]-[YYMMDD].json`
- Import: Accepts Preset format JSON, adds to list without auto-loading

---

### 11.5 CI/CD Pipeline (FR-025)

**Priority:** High  
**Milestone:** M2.5  
**Based on:** CE ShipGen FR-025

**Problem:** Manual deployment is fragile and error-prone.

**Solution:** GitHub Actions Workflow

**File:** `.github/workflows/deploy.yml`

**Pipeline stages:**
1. Checkout `main`
2. Setup Node 20
3. `npm ci` (reproducible install)
4. `npm run build` (type-check gate)
5. Deploy to `gh-pages` (only on push to main, not PRs)

**PR behavior:** PRs trigger steps 1-4 only (build check, no deploy)

**Benefits:**
- Zero manual deploy steps after `git push`
- Build failures block deploy
- PRs validated in CI before merge

---

## 12. ADDENDUM — M2.6 Installed Version Control (FR-026)

**Added:** March 3, 2026  
**Priority:** Critical — After M2.5  
**Milestone:** M2.6 — Must complete before M3  
**Based on:** CE ShipGen M2.6

### 12.1 Problem Statement

Users with the PWA installed locally have no control over when updates are applied. While the "Installed" badge (FR-021b) detects when the app runs as a standalone PWA, users currently cannot:
- See which version they have installed
- Choose when to apply updates
- Roll back to previous versions if a new version has issues
- Opt into beta/release channels for early access

**Impact:** A broken release could disrupt active campaigns. Users need agency over their local instance.

### 12.2 Solution Overview

A version control system that treats the installed PWA like a package manager:
- Version is visible and tracked
- Updates are detected but not forced
- User controls when to update
- Previous versions remain available for rollback
- Multiple release channels (stable/beta)

### 12.3 Requirements

#### FR-026a: Version Manifest

**Storage:** `version.json` generated at build time:
```json
{
  "version": "0.2.6",
  "buildTimestamp": "2026-03-03T14:30:00Z",
  "channel": "stable",
  "changelog": ["Added version control", "Fixed table view race condition"],
  "minimumCompatibleVersion": "0.2.5"
}
```

**Location:** `/cecharactergen/version.json`

#### FR-026b: Current Version Display

**Location:** Settings → About section

**Display:**
```
Current Version: 0.2.6 (stable)
Build: March 3, 2026 14:30 UTC
```

#### FR-026c: Update Detection

**Mechanism:** Fetch remote `version.json` with cache-busting on startup and every 30 minutes.

**Indicators:**
- Startup screen: "Update Available" pill button (amber)
- Settings icon: Subtle dot indicator when update available
- Settings → About: Prominent banner with changelog preview

#### FR-026d: Changelog Display

**Modal dialog:** Shows current → new version, full changelog, breaking changes highlighted.

**Buttons:** "Update Now" / "Later"

#### FR-026e: User-Controlled Update

**Core Principle:** User initiates update, never forced.

**Update flow:**
1. User clicks "Update Now"
2. Confirmation: "Update to version 0.2.7? Your current version will be saved for rollback."
3. Save current version to `ce_char_version_history` in localStorage
4. Reload page to load new version

#### FR-026f: Version History & Rollback

**Storage:** `ce_char_version_history` — Array of last 3 versions

**Settings UI:** Settings → Version History table
| Version | Build Date | Last Used | Status | Actions |
|---------|-----------|-----------|--------|---------|
| 0.2.7 | Mar 4 | — | Current | — |
| 0.2.6 | Mar 3 | 2h ago | Available | [Rollback] |

**Rollback:** Save current to history, set rollback target, reload page.

**Safety:** User data (characters, settings, snapshots) NEVER touched by version changes.

#### FR-026g: Release Channels

**Settings toggle:** Settings → About → Release Channel

**Options:**
- **Stable** (default) — Production releases
- **Beta** — Early access

**Channel mechanics:**
- Stored in `ce_char_release_channel`
- Affects which version.json is checked (stable vs version-beta.json)

#### FR-026h: Offline Behavior

**Offline:** Cannot fetch remote version.json. Show "Offline — version check unavailable". Disable update button.

**Reconnection:** Auto-check for updates when connection restored.

#### FR-026i: Service Worker Integration

**Current:** autoUpdate mode

**New:** Manual update control — only skip waiting when user clicks "Update Now"

### 12.4 Data Preservation Rules

**CRITICAL:** Version changes must NEVER affect user data

**Preserved across updates/rollbacks:**
- ✅ Character library (IndexedDB)
- ✅ Settings snapshots (localStorage)
- ✅ Live working state (localStorage)
- ✅ Rule preferences (localStorage)
- ✅ Release channel preference
- ✅ Version history

### 12.5 Acceptance Criteria

- [ ] version.json generated on every build
- [ ] Current version displays in Settings → About
- [ ] Update detection works (compares local vs remote)
- [ ] "Update Available" indicator appears appropriately
- [ ] Changelog viewable before updating
- [ ] User can manually trigger update
- [ ] Previous version saved to history before updating
- [ ] Version History shows last 3 versions with rollback
- [ ] Rollback restores previous version without data loss
- [ ] Release channel toggle works
- [ ] Offline behavior graceful
- [ ] Service worker uses manual update mode
- [ ] All user data survives updates/rollbacks

---

---

### 12.6 Updated Milestone Plan

| Milestone | Scope | Status |
|-----------|-------|--------|
| M1: UI Layout & Foundation | Layout, tiles, PWA setup, basic generation, **FR-027 Test Page** | 🎯 Current — In Progress |
| M2: Settings & Data Tables | JSON + table editors, **career enable/disable**, all 10+ tables, rule toggles | ⏳ Pending |
| M2.5: Install UX & Settings System | FR-021 (install), FR-022 (auto-save), FR-023 (security), FR-024 (snapshots), FR-025 (CI/CD) | ⏳ Pending |
| M2.6: Installed Version Control | FR-026 — Version management, update prompts, rollback, release channels | ⏳ Pending |
| M3: Full Career System | All 24 careers, aging, mustering out, equipment | ⏳ Pending |
| M4: Persistence & Export | Character library, batch generation, advanced export | ⏳ Pending |

---

## 13. APP ARCHITECTURE SUMMARY

**Three-Core View Structure (FR-011):**

The CECG app is built around three primary functional views, each with dedicated URLs:

| View | URL | Purpose |
|------|-----|---------|
| **Character Generation** | `/generate` | Create characters with constraints |
| **Character Library** | `/library` | Browse, search, load saved characters |
| **Settings** | `/settings/:section` | Configure app, edit data tables, version control |
| **Test Page** | `/test/:section` | Development testing, debugging, data validation |

**Navigation Pattern:**
- **Startup Screen** (`/`) — Entry point with navigation buttons
- **Header Navigation** — Persistent on all non-startup screens
  - Logo (returns to startup)
  - Generate | Library | Settings buttons
  - Layout toggle (Desktop/Phone)
  - "Installed" badge (when in standalone mode)

**URL Routing Benefits:**
- Users can bookmark any view
- Browser back/forward works naturally
- Direct links to specific settings sections (`/settings/version`)
- Share links to character library filtered by career type
- Deep-link into generation with pre-selected constraints

**Data Flow:**
1. **Startup** → User selects view
2. **Generate** → Character generated, auto-saved to Library
3. **Library** → User views/exports characters, loads for editing
4. **Settings** → User customizes data tables, manages versions
5. **All views** → Auto-save persists state, never lose work

**From CE ShipGen:**
- Same routing philosophy (`/generate`, `/library`, `/settings`)
- Same three-view separation (Design/Library/Settings)
- Same URL persistence pattern
- Same header navigation structure
- Version control integrated into Settings view

---

**PRD Status:** LIVING DOCUMENT — updated per session  
**Last updated:** March 3, 2026 — M2.5/M2.6 requirements added; FR-011 routing and three-view architecture defined  
**Next implementation target:** M1 — Complete UI Foundation with React Router setup