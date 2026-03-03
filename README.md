# CE CharacterGen

**Cepheus Engine Character Generator** — A Progressive Web App for generating characters

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-brightgreen)](https://xunema.github.io/cecharactergen/)
[![Status](https://img.shields.io/badge/Status-M1%20In%20Progress-yellow)](https://github.com/xunema/cecharactergen)

**Live Demo:** https://xunema.github.io/cecharactergen/

---

## 🎯 Overview

A React-based Progressive Web App (PWA) for generating Cepheus Engine tabletop RPG characters. Built following the successful patterns from [CE ShipGen](https://github.com/xunema/ce-shipgen).

### Current Status: M1 — UI Foundation

- ✅ React 18 + TypeScript + Vite
- ✅ Tailwind CSS with space theme
- ✅ Three-view architecture (Startup/Generate/Library/Settings)
- ✅ Tile-based UI with focus mode
- ✅ Desktop/Phone layout toggle
- ✅ React Router with URL routing
- ✅ Basic data files (races, careers, skills)

---

## 🛣️ Milestones

| Milestone | Scope | Status |
|-----------|-------|--------|
| **M1: UI Foundation** | Layout, tiles, PWA setup, basic structure | 🎯 In Progress |
| **M2: Data Tables** | JSON editors, career enable/disable, 15+ tables | ⏳ Pending |
| **M2.5: Install UX** | PWA install, auto-save, snapshots | ⏳ Pending |
| **M2.6: Version Control** | Update prompts, rollback | ⏳ Pending |
| **M3: Full Careers** | All 24 careers, aging, mustering | ⏳ Blocked |
| **M4: Library** | Character library, batch export | ⏳ Pending |

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
├── data/                    # JSON data tables
│   ├── races.json          # Species definitions
│   ├── careers.json        # Career paths (3 examples)
│   └── skills.json         # Skill definitions
├── public/                 # Static assets
│   └── manifest.json       # PWA manifest
├── src/
│   ├── components/
│   │   ├── screens/        # Main views
│   │   │   ├── StartupScreen.tsx
│   │   │   ├── CharacterGenerationView.tsx
│   │   │   ├── LibraryView.tsx
│   │   │   └── SettingsScreen.tsx
│   │   └── shared/         # Shared components
│   │       └── Header.tsx   # Navigation + layout toggle
│   ├── App.tsx             # Router setup
│   └── index.css           # Tailwind styles
├── tailwind.config.js      # Space theme colors
├── vite.config.ts          # Build config
└── package.json
```

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

---

## 📚 Documentation

- [PRD.md](./PRD.md) — Product Requirements Document
- [PROJECT_NOTES.md](./PROJECT_NOTES.md) — Development log and lessons learned

---

## 📝 License

GPL v3 — See [LICENSE](./LICENSE)

---

**Built with:** React + TypeScript + Vite + Tailwind CSS

**Inspired by:** [CE ShipGen](https://github.com/xunema/ce-shipgen)