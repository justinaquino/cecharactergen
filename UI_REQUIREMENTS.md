# CE CharacterGen — UI Requirements
**Document:** UI_REQUIREMENTS.md  
**Status:** Complete — all design decisions resolved  
**Feeds into:** PRD.md Section 2 (GI7B UI Standard) and FR-006 through FR-010  
**Last updated:** 2026-03-21

---

## 1. Design Principles

### 1.1 Phone-first

Every screen is designed for a 375px-wide phone screen first. Desktop is an enhancement, not the baseline. No layout, interaction, or feature may be phone-incompatible. If it can't be done well on a phone, it doesn't ship.

### 1.2 Narrative, not configurator

Character generation is a sequential story — each step causally depends on the one before it. The UI reflects this: a linear vertical accordion of steps, not a spatial dashboard of tiles. The character sheet is the *record* of that story, assembled at the end.

### 1.3 Mechanics are modular, UI is stable

Each accordion step maps to exactly one mechanics module. The UI calls the module, receives a typed result, and renders it. UI changes never require mechanics changes and vice versa. New mechanics are added via GitHub (code); new data tables are added via Settings (no code required).

### 1.4 Dark space theme

The app uses a dark space theme consistent with the GI7B Generator Suite (CE ShipGen reference). Theme can be toggled to Day (light) mode via the top bar at any time. Default on first load follows the system `prefers-color-scheme` preference.

---

## 2. Global Chrome

### 2.1 Top bar

Present on every screen **except** the Landing page.

| Element | Position | Behaviour |
|---|---|---|
| App name / logo | Left | Taps to Landing page |
| Theme toggle (Day/Night) | Right | Instant CSS switch, persists in localStorage |
| Layout toggle (Phone/Desktop) | Right, beside theme | Instant layout switch, persists in localStorage |

The top bar is minimal — three elements only. No navigation links. Navigation happens at the Landing page and via the Bottom bar.

### 2.2 Bottom bar

Present on every screen **except** the Landing page.

| Element | Position | Behaviour |
|---|---|---|
| Back | Left | Returns to previous screen or previous accordion step |
| Next | Right | Advances to next screen or next accordion step |

Next is **disabled** (grayed, non-tappable) when the current accordion step is incomplete or when there is no next screen. Back is always active unless on the first screen after Landing.

Rationale: thumbs reach the bottom of a phone. Back/Next are the most frequent interactions during generation. They must be in thumb reach at all times.

### 2.3 Layout modes

**Phone mode** (default at <1024px, or when toggle is set to Phone):
- Single column, full-width content
- Vertical scroll only
- Bottom bar Back/Next always visible
- Accordion tiles are full width

**Desktop mode** (default at ≥1024px, or when toggle is set to Desktop):
- Multi-column grid (2–3 columns depending on content)
- Wider content area, centered, max-width ~1200px
- More tiles visible simultaneously
- Bottom bar may be hidden; in-content Next/Back buttons used instead
- Accordion logic unchanged — step ordering and locking still applies

The Layout toggle persists across sessions. On first load, mode is auto-detected from viewport width.

---

## 3. Landing Page

### 3.1 Layout

No top bar. No bottom bar. Clean entry point only.

Five elements arranged vertically, centered:

1. **App name** — "CE CharacterGen" — large, prominent
2. **Tagline** — "Cepheus Engine character generation — by Game in the Brain"
3. **Generate button** — primary CTA, large, high contrast
4. **Library button** — secondary
5. **Settings button** — secondary
6. **About link** — tertiary, small text, bottom of screen

On phone: elements fill the screen with generous vertical spacing.  
On desktop: elements are centered in a max ~480px column with whitespace on both sides.

### 3.2 Footer links (small, below About link)

Per product decision: DrivethruRPG product links appear as small footer links on the Landing page.

```
[ Mneme Space Combat ]  [ CE SRD ]  [ 6 Career Cards ]  [ 24 Career Cards ]  [ gi7b.org ]
```

All links open externally. Links are small (12–13px), muted color, inline row. On phone they may wrap to two lines.

| Label | URL |
|---|---|
| Mneme Space Combat | https://www.drivethrurpg.com/en/product/434090/mneme-space-combat-full |
| Cepheus Engine SRD | https://www.drivethrurpg.com/en/product/186894/cepheus-engine-system-reference-document |
| 6 Career Cards | https://www.drivethrurpg.com/en/product/413465/cepheus-engine-6-combat-career-cards |
| 24 Career Cards | https://www.drivethrurpg.com/en/product/413475/cepheus-engine-24-career-cards |
| GI7B Blog | https://gi7b.org/ |

### 3.3 PWA install prompt

When the app is installable (PWA `beforeinstallprompt` event), an "Install app" button appears between Settings and About. It is hidden after installation or on iOS (replaced by "Tap Share → Add to Home Screen" instructions). This element is conditional — the layout must work without it.

---

## 4. About Page

Single scrollable page. Top bar visible (theme + layout toggles). Bottom bar Back button returns to Landing.

### 4.1 App identity section

**CE CharacterGen**  
A Progressive Web App for generating Cepheus Engine characters using the Mneme CE rules.

Part of the **GI7B Generator Suite** — open source tools for tabletop RPGs.

### 4.2 Credits section

**Game in the Brain team**  
Nicco Salonga & Justin Aquino

### 4.3 Source material section

This app implements rules and content from the following publications. All links open externally.

| Publication | Link |
|---|---|
| Mneme Space Combat (Full) | https://www.drivethrurpg.com/en/product/434090/mneme-space-combat-full |
| Cepheus Engine System Reference Document | https://www.drivethrurpg.com/en/product/186894/cepheus-engine-system-reference-document |
| Cepheus Engine 6 Combat Career Cards | https://www.drivethrurpg.com/en/product/413465/cepheus-engine-6-combat-career-cards |
| Cepheus Engine 24 Career Cards | https://www.drivethrurpg.com/en/product/413475/cepheus-engine-24-career-cards |

The Cepheus Engine SRD is the legal and mechanical foundation that makes this app — and the entire GI7B Generator Suite — possible.

### 4.4 About Game in the Brain section

Game in the Brain is an open source TTRPG initiative. The goal is to make tabletop RPG tools highly accessible, free, and deeply customizable — particularly for Cepheus Engine and Traveller-compatible games.

Blog: https://gi7b.org/

**The GI7B Generator Suite:**
- CE CharacterGen — character creation (this app)
- CE ShipGen — starship design and construction
- Mneme World Gen — planetary system generation

All generators share the same GI7B UI standard, are offline-capable PWAs, and are open source.

### 4.5 License section

Released under **GPL v3**.  
Source code, data tables, and documentation are freely available.  
Repository: https://github.com/xunema/cecharactergen

---

## 5. Generate Screen

### 5.1 Mode selection

The Generate screen opens with a mode card before the accordion starts. Two options presented side by side (phone: stacked vertically):

**Player mode**  
Step-by-step — you make choices at each stage. Species, homeworld, career, skills — all player-selected. Generation pauses at each step for input.

**Random mode**  
Fully automated generation. Optional: set weights and filters before generating. Optional: set batch count (1–N characters).

Mode selection is persistent for the session. A "Change mode" option is available at the top of the accordion.

### 5.2 Vertical tile accordion — generation steps

The accordion is the same component in both Player and Random modes. In Player mode, steps pause and show controls. In Random mode, steps auto-complete and show results only.

#### Tile step order

```
1.  Species
2.  Characteristics
3.  Homeworld / Background
4.  Career  (contains sub-tiles per term — see §5.3)
5.  Mustering out
6.  Name
7.  Character sheet (final review + save)
```

Name generation (step 6) is automatic in both modes — no player input required. It runs after mustering out and before the final character sheet.

#### Tile states

| State | Visual | Interaction |
|---|---|---|
| Locked | Dimmed, no border accent, label only | Non-interactive |
| Active | Full border accent, fully expanded, controls visible | Player input or auto-result display |
| Completed | Checkmark, summary line (e.g. "Species: Terrestrial Human") | Tappable — see Q1 below |

Only one tile is Active at a time. Completed tiles appear above the Active tile. Locked tiles appear below it. The user scrolls to see the full accordion.

Completed tiles are tappable for review and editing. Editing a completed tile triggers a cascade wipe warning — all downstream tiles are cleared and relocked. See §8 Q1 for full specification including the in-progress save model.

### 5.3 Career tile — sub-tile structure for terms

**Decision: Sub-tiles inside one Career section.** See §8 Q2 for full sub-tile state specification.

Career terms are displayed as sub-tiles within a single top-level Career accordion tile. The Career tile header summarises all terms served. Each term is a collapsible sub-row. At the end of each term, the player chooses: Re-enlist, Change career, or Muster out. Only the Muster out choice advances the accordion to the Mustering Out tile.

### 5.4 Random mode — weights and batch count

Before triggering Random generation, the user sees a compact options panel:

**Filters / weights** — toggles and sliders per category:
- Species: All / Terrestrial Human only / Low-G Human only
- Career type: All / Military / Civilian / Criminal / Elite (multi-select)
- Terms: Min 1, Max N (slider)

**Batch count** — a number input (1–50). Default 1.

A "Generate" button triggers the run. Progress is shown (e.g. "Generating character 3 of 10...").

### 5.5 Batch results landing

**Decision: Auto-named Character File in the `Generated` folder.** See §8 Q3 for full specification including folder behaviour and post-generation actions.

---

## 6. Library

### 6.1 Data hierarchy

```
Library
└── Folder  (groups character files by campaign/setting)
    └── Character File  (holds multiple characters, e.g. "Alpha Squad.cef")
        └── Character  (one row — the character data)
            └── Sections  (Characteristics, Skills, Career History, Equipment, Background)
```

### 6.2 Library screen layout

**Phone view — folder/file browser:**  
Folders displayed as collapsible rows. Tapping a folder reveals its character files. Tapping a character file opens the character view.

**Desktop view — sidebar + content:**  
Folder tree in a left sidebar. Character file contents (table view) in the main panel.

### 6.3 Character file — phone view

Opening a character file on phone shows one character at a time as a **vertical long-form character sheet**. The sheet sections are stacked vertically in the same order as the generation accordion:

1. Identity (name, species, age, homeworld)
2. Characteristics (with modifiers)
3. Skills
4. Career history (timeline of terms)
5. Equipment
6. Background & connections

**Swipe left/right** moves between characters in the same file. A position indicator (dot row or "2 of 5") shows current position.

Each section is a collapsible card. By default, all sections are expanded on first open.

An **Edit** button at the top right opens the character in the generation accordion for editing.

### 6.4 Character file — desktop view

Opening a character file on desktop shows all characters as a **spreadsheet-style table**:
- Each row = one character
- Column groups = sheet sections (Identity | Characteristics | Skills | Career | Equipment | Background)
- Column groups can be collapsed to a summary column to reduce horizontal width
- Rows are selectable; selecting a row shows the full character in a side panel

### 6.5 File and folder actions

**Folder actions** (via long-press or context menu on phone; right-click or menu button on desktop):
- New folder
- Rename
- Delete (requires confirmation if folder contains files)

**Character file actions:**
- Open
- Save (saves current state)
- Save As (creates a copy with a new name)
- Import — loads a `.cef` JSON file and adds it as a new character file
- Export — downloads the file as `.cef` JSON
- Delete (requires confirmation)

**Character (row) actions:**
- Edit (opens in generation accordion)
- Duplicate
- Delete (requires confirmation)

### 6.6 Import / export format

Character files are exported as `.cef` (Character Export Format) — a JSON file. The format is documented and human-readable so that groups can share files via messaging or email without requiring cloud sync.

---

## 7. Settings

Settings has two independent sections accessed via a tab bar or sidebar: **Tables** and **Mechanics**.

### 7.1 Settings — Tables

A list of all available character creation data tables, grouped by category.

**Categories:**
- Species
- Names & cultures
- Backgrounds & homeworlds
- Careers
- Skills
- Equipment
- Career events (survival mishaps, injuries, medical)
- Aging & anagathics
- Mustering out
- Social standing
- Rules & meta

**Per-table display:**

Each table entry shows:
- Table name
- Status badge: `Active` (green) or `Inactive` (gray)
- Source badge: `Canonical` or `Custom`
- Last modified date (for custom tables)

**Per-table actions** (via action row or menu):

| Action | Behaviour |
|---|---|
| Edit | Opens inline editor (dual view: structured table or raw JSON) |
| Save | Saves current edits to this table |
| Save As | Creates a copy with a new name (becomes a Custom table) |
| Import | Loads a `.json` file as a new table entry in this category |
| Load / Activate | Makes this table the one used in generation. Deactivates the previous active table in this category. Only one table per category may be Active. |

**Dual editor view:**  
The editor has two tabs — Table view (spreadsheet-style, accessible to non-technical users) and JSON view (raw JSON for power users). Both views stay in sync. Switching between them while mid-edit is allowed; invalid JSON blocks the switch and shows an error.

Auto-save applies in Table view (saves on each cell commit). JSON view has an explicit "Apply" button because mid-edit JSON is often temporarily invalid.

**Reset to canonical:**  
Each table has a "Reset to canonical" option that replaces the current content with the factory default. Requires confirmation. Does not affect other tables or the character library.

### 7.2 Settings — Mechanics

A list of toggleable rule modules. Each entry shows:
- Mechanic name
- One-line description
- Toggle (ON/OFF) or selector (for multi-option mechanics like CE/Mneme rule set)
- Source label ("Cepheus Engine SRD" or "Mneme CE")

Active mechanics affect the generation flow. Toggling a mechanic OFF removes its step or rule from character creation entirely. For example:
- Aging OFF → aging check is skipped during career terms
- Psionics OFF → PSI characteristic and psionic careers are hidden
- Low-G Human OFF → species selection shows Terrestrial Human only

**Extensibility note:** New mechanics cannot be added through the Settings UI. They require a code contribution to the GitHub repository. The Mechanics screen shows a small "Contribute a mechanic →" link pointing to the repo. This is the explicit extensibility boundary: data (tables) is user-editable; logic (mechanics) requires code.

**Mechanic list (initial set):**

| Mechanic | Type | Default |
|---|---|---|
| Rule set | Selector: CE / Mneme CE | Mneme CE |
| Advantage / Disadvantage dice (advX / disX) | Toggle | ON |
| Low-G Human variant | Toggle | ON |
| Aging system | Toggle | ON |
| Anagathics | Toggle | ON |
| Automatic re-enlistment | Toggle | ON |
| Psionics | Toggle | OFF |
| Draft on failed qualification | Toggle | ON |

---

## 8. Design Decisions — Resolved

The following three decisions were resolved during the UI requirements session (2026-03-21). They are documented here for PRD traceability.

---

### Q1 — Re-editing completed steps

**Decision: Warn + cascade wipe, with in-progress save model**

#### In-progress save model

A character being created is a **live save file** — a partial character record written to the library as generation progresses. Each accordion step, when completed, writes its results into the character's save fields. The character file exists and is accessible in the Library from the moment generation begins, with completed fields populated and incomplete fields empty/null.

This means:
- A player can close the app mid-generation and resume later
- The partially complete character appears in the Library with a "In progress" badge
- The save file format is identical for in-progress and completed characters — completed characters simply have all fields populated

#### Re-editing behaviour

Completed tiles are tappable and expand for review. If the player makes a **change** (not just reviews) and taps Next or confirms the edit:

1. A confirmation dialog appears:  
   *"Editing [Step Name] will wipe [Step X], [Step X+1]... and all steps after it. This cannot be undone. Continue?"*

2. On confirm:
   - The edited step's new value is written to the save file
   - All downstream step fields are **cleared/nulled** in the save file
   - All downstream tiles return to **Locked** state
   - The accordion scrolls to the now-Active edited step, ready to proceed forward

3. On cancel: no changes are made, tile collapses back to its completed summary

If the player only **reviews** a completed tile (opens it, reads it, closes it without changing anything) — no warning, no wipe. The warning only triggers on an actual value change.

#### Accordion state machine summary

```
Locked  →  Active (step reached)
Active  →  Completed (step submitted)
Completed  →  Active (player edits — triggers cascade wipe warning)
```

#### Save file field structure (implication for data model)

Each step maps to one or more fields in the character save file:

| Accordion step | Save file fields written |
|---|---|
| Species | `species`, `speciesRollMethod` |
| Characteristics | `str`, `dex`, `end`, `int`, `edu`, `soc`, `characteristicRolls` |
| Homeworld / Background | `homeworld`, `backgroundSkills` |
| Career (per term) | `career[n].name`, `career[n].survival`, `career[n].rank`, `career[n].skills`, `career[n].events` |
| Mustering out | `cashBenefits`, `materialBenefits` |
| Name | `firstName`, `lastName`, `parentCulture1`, `parentCulture2` |
| Character sheet | `status: complete` |

Clearing a step nulls its fields and all fields of steps below it in this table.

---

### Q2 — Career term display in the accordion

**Decision: Sub-tiles inside one Career section (compact)**

The Career step is a single top-level accordion tile. Inside it, each term is a collapsible sub-tile. The Career tile header shows a running summary: "Marine — 3 terms" or "Marine (2) · Scout (1)".

#### Sub-tile structure

```
▼ Career  [Marine — 2 terms · Scout — 1 term]
   ✓ Term 1  Marine  Survival: pass  Rank: Lt  Skills: Gun Combat 1
   ✓ Term 2  Marine  Survival: pass  Rank: Cpt  Skills: Leadership 1
   ▼ Term 3  Scout   [active — rolling now]
   [ + Re-enlist / Change career / Muster out ]
```

- Completed terms show as collapsed summary rows (single line, checkmark)
- The active term is expanded, showing all rolls and controls
- At the end of each term, three options are offered: Re-enlist (same career), Change career (new career, goes through qualification), or Muster out (ends career phase, advances to Mustering Out tile)
- A character can only muster out from within the Career tile — the Mustering Out tile unlocks only after this choice is made

#### Sub-tile states mirror the top-level tile states

| State | Visual |
|---|---|
| Completed term | Collapsed, checkmark, one-line summary |
| Active term | Expanded, full controls visible |
| Not yet started | Hidden — only appears when the previous term is completed and Re-enlist is chosen |

---

### Q3 — Batch generation results destination

**Decision: Auto-named Character File in a default folder, with move option**

After batch generation completes, a new Character File is created automatically:

- **File name:** `YYMMDD-HHMMSS` (timestamp of generation run, e.g. `260321-143022`)
- **Location:** A system default folder called `Generated` (created automatically on first batch run if it doesn't exist)
- **Contents:** All N generated characters as rows in the file

The player is immediately shown the new file open in the Library view, so they can review and act on the results right away.

#### Post-generation actions available on the file

- **Rename** the file (change from timestamp to a meaningful name)
- **Move to folder** — a folder picker allows moving the file to any existing folder, or creating a new folder on the spot
- **Delete characters** — individual characters can be deleted from the file before or after moving
- **Export** — the file can be exported as `.cef` immediately

#### Default folder behaviour

The `Generated` folder is a system folder — it always exists and cannot be deleted. It acts as the inbox for all batch results. Players are expected to organise files out of `Generated` into campaign-specific folders. This keeps the library clean without requiring the player to name or place anything before they can review their characters.

---

## 9. Screen inventory (complete)

| Screen | Route | Top bar | Bottom bar | Notes |
|---|---|---|---|---|
| Landing | `/` | None | None | Entry point only |
| About | `/about` | Yes | Back only | Static content + links |
| Generate — mode select | `/generate` | Yes | Back / Next | First thing seen in Generate |
| Generate — accordion | `/generate/player` or `/generate/random` | Yes | Back / Next | Core generation flow |
| Batch results | `/generate/results` | Yes | Back / Save | Pending Q3 |
| Library — browser | `/library` | Yes | Back | Folder/file tree |
| Library — character view (phone) | `/library/:fileId/:charId` | Yes | Back / Edit | Swipeable character sheet |
| Library — file view (desktop) | `/library/:fileId` | Yes | Back | Table view |
| Settings | `/settings` | Yes | Back | Tab/sidebar: Tables + Mechanics |
| Settings — Tables | `/settings/tables` | Yes | Back | Table editor |
| Settings — Mechanics | `/settings/mechanics` | Yes | Back | Toggle list |

---

*End of UI_REQUIREMENTS.md*  
*Three design decisions (Q1–Q3) must be answered before FR-005 (Generate), FR-007 (Tile System), and FR-008 (Batch results) can be finalised in the PRD.*
