# CE CharacterGen

**Cepheus Engine Character Generator** — A Progressive Web App for generating characters

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-brightgreen)](https://xunema.github.io/cecharactergen/)
[![Status](https://img.shields.io/badge/Status-M2%20In%20Progress-yellow)](https://github.com/xunema/cecharactergen)

**Live Demo:** https://xunema.github.io/cecharactergen/

---

## 🎯 Overview

A React-based Progressive Web App (PWA) for generating Cepheus Engine tabletop RPG characters. Built following the successful patterns from [CE ShipGen](https://github.com/xunema/ce-shipgen).

### Current Status: M2 — Data Tables + Name Generator (In Progress)

- ✅ React 19 + TypeScript + Vite
- ✅ Tailwind CSS with space theme
- ✅ Three-view architecture (Startup/Generate/Library/Settings)
- ✅ Tile-based UI with focus mode
- ✅ Desktop/Phone layout toggle
- ✅ React Router with URL routing
- ✅ **NEW: Cultural Name Generator** (Behind The Name dataset)
  - 20,505 first names from 84+ cultures
  - Parent heritage system (70% same-culture probability)
  - Surnames from 100+ cultures
  - Gender-specific name generation
- ✅ Basic data files (names, surnames, races, careers, skills)
- 🎯 **M2: JSON Table Editor** (like CE ShipGen) — dual JSON/Table view
- 🎯 **M2.7: Tables In Play** — Select active tables, add custom tables

**Coming Soon:**
- Add and edit custom tables (house rules, alternate careers)
- "Tables In Play" view to select which table drives each generation step
- Export/import custom tables to share with other players
- 15+ data tables (draft, survival mishaps, injury, medical bills, aging, anagathics, retirement pay, careers, skills, equipment, etc.)
- **M3: Character Generation**
  - "Random Everything" toggle for instant character generation
  - Species: Regular Human and Low-G Human (Mneme Variant with advX/disX rolls)
  - Career rule toggle: CE Rules As Written vs Mneme (auto-rejoin, Drifter auto-qualify)
  - Career dropdown selection with 24 careers

---

## 🛣️ Milestones

| Milestone | Scope | Status |
|-----------|-------|--------|
| **M1: UI Foundation** | Layout, tiles, PWA setup, React Router, all views | ✅ **Complete** |
| **M2: Data Tables** | JSON editors (dual JSON/Table view like CE ShipGen), **15+ tables**, rule toggles | 🎯 **In Progress** |
| **M2.5: Install UX** | PWA install prompt, auto-save, settings snapshots, CI/CD | ⏳ Pending |
| **M2.6: Version Control** | Update prompts, version display, changelog, user-controlled updates | ⏳ Pending |
| **M2.7: Tables In Play** | **List of active tables**, switch tables per category, **add/edit custom tables**, export/import | ⏳ Pending |
| **M2.8: Culture & Name Data** | Flat `cultures_names.json` (downloadable, Excel/Sheets-editable); discrete `name_generation_rules.json` (swappable mechanism); export/import both | ✅ **Complete** |
| **M3: Full Careers** | All 24 careers, aging, mustering, **advX/disX dice**, **Low-G Human**, **career rule toggle (CE/Mneme)**, **"Random Everything" toggle** | ⏳ Blocked on M2.8 |
| **M4: Library** | Character library, batch generation, advanced export | ⏳ Pending |

---

## 🚀 Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup
```bash
npm install
npm run dev
```

### Build
```bash
npm run build
```

---

## 📁 Project Structure

```
cecharactergen/
├── data/                    # JSON data tables (canonical/factory defaults)
│   ├── races.json          # Species definitions
│   ├── careers.json        # ALL 24 careers in ONE file with metadata header
│   └── skills.json         # Skill definitions
│   └── ...                 # 15+ total tables (draft, survival_mishaps, injury, etc.)
└── Custom Tables (stored in localStorage):
    ├── careers_custom_mycampaign.json
    ├── aging_custom_gentler.json
    └── ...                 # User-created custom tables
```

**Data Table Architecture:**
- **Canonical Tables:** Factory defaults in `data/*.json` (read-only reference)
- **Custom Tables:** User-created tables stored in localStorage
- **Tables In Play:** User selects which table (canonical or custom) drives each generation step
- **Share Tables:** Export custom tables as JSON files to share with other players

---

## 🎨 UI Pattern (from CE ShipGen)

### Three Views
1. **Startup** (`/`) — Entry point with 3 navigation options
2. **Generate** (`/generate`) — Character generation with tile layout
3. **Library** (`/library`) — Character library
4. **Settings** (`/settings`) — App configuration

### Tile System
- **Collapsed** — Summary only
- **Expanded** — Full content
- **Focused** — Full-screen overlay
- **ESC** to exit focus mode

### Layout Modes
- **Desktop** — Multi-column (Parameters | Tiles | Log)
- **Phone** — Vertical stack with collapsible parameters

### Tables In Play (M2.7 Feature — Coming Soon)
Like CE ShipGen, users can create **custom tables** and select which ones are "in play" for character generation.

**How It Works:**
1. **Canonical Tables** — Factory defaults (Cepheus Engine core rules)
2. **Custom Tables** — User-created (house rules, alternate careers, homebrew)
3. **Tables In Play View** — See which table drives each generation step
4. **Switch Tables** — Select canonical OR custom table per category
5. **Export/Import** — Share custom tables with other players

**Example Use Cases:**
- GM creates custom careers for their specific campaign setting
- Group agrees on gentler aging mechanics → switch to custom aging table
- Community shares career packs via JSON files

**Table Categories (all swappable):**
- Draft, Survival Mishaps, Injury, Medical Bills, Aging, Anagathics, Retirement Pay, SOC Table
- Careers, Races, Backgrounds, Skills, Equipment, Homeworlds, Names

### Character Generation (M3 — Coming Soon)

**Three-Phase Generation:**

**Phase 1: Pre-Career**
- **"Random Everything" Toggle** — Instantly randomize all options
- **Species Selection:** Regular Human (Terra/High-G) or Low-G Human (Mneme Variant)
  - Low-G Humans: STR dis1, DEX adv1, END dis1, Zero-G skill, adapted for space
- **Characteristic Rolls:** 2D6, with advX/disX for special species
- **Name Generator:** Cultural names from UNESCO heritage, grouped by gender
- **Background & Homeworld:** CE or Mneme variant tables

**Phase 2: Career**
- **Career Rules Toggle:** CE Rules As Written vs Mneme Variant
  - CE: Rejoining requires qualification roll
  - Mneme: Rejoining automatic (no roll needed)
  - Drifter: Auto-qualification in both modes
- **Career Dropdown:** Select from enabled careers
- **Full Career System:** Enlistment, survival, advancement, skills, aging

**Phase 3: Post-Career**
- Mustering out (benefits & cash)
- Equipment assignment
- Final details and export

---

## 🔗 Links

- [📖 **Source Code**](https://github.com/xunema/cecharactergen) — GitHub Repository
- [📚 **Our Books**](https://www.drivethrurpg.com/en/publisher/17858/game-in-the-brain) — Game in the Brain on DriveThruRPG
- [🌐 **Blog**](https://gi7b.org/) — Game in the Brain Blog
- [📖 **Wiki**](https://wiki.gi7b.org/index.php/Main_Page) — Game in the Brain Wiki

---

## 🛠️ Troubleshooting

**Site not showing latest version?**
- Hard refresh: `Ctrl+F5` (Windows/Linux) or `Cmd+Shift+R` (Mac)
- Try Incognito/Private mode
- Wait 5-10 minutes for GitHub Pages to propagate

**404 errors on assets?**
- Check `vite.config.ts` has `base: '/cecharactergen/'`
- Verify GitHub Pages settings use `gh-pages` branch

**Deployment issues?**
- See [PROJECT_NOTES.md](./PROJECT_NOTES.md) Section 6: "Problems Faced & Solutions"

---

## 📚 Documentation

| Document | Purpose | Status |
|----------|---------|--------|
| [PRD.md](./PRD.md) | Product Requirements Document — full FR specs, milestones, data schemas | ✅ Current |
| [PROJECT_NOTES.md](./PROJECT_NOTES.md) | Development log, lessons learned, troubleshooting | ✅ Current |
| [CE ShipGen](https://github.com/xunema/ce-shipgen) | Reference implementation — GI7B UI Standard | ✅ Reference |

> **UI Alignment Note:** This project's UI layout currently diverges from the [GI7B Generator UI Standard](https://github.com/xunema/ce-shipgen/blob/main/PROJECT_NOTES.md#gi7b-generator-ui-standard) defined by CE ShipGen. Settings sections (JSON Tables, Mechanics Modules, Generation Options, Other Settings) and the header toggles (Layout, Theme) are planned for alignment in a future milestone. See PRD for details.

---

## 📝 License

GPL v3 — See [LICENSE](./LICENSE)

---

**Built with:** React + TypeScript + Vite + Tailwind CSS

**Inspired by:** [CE ShipGen](https://github.com/xunema/ce-shipgen)
