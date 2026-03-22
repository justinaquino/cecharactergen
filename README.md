# CE CharacterGen

**A Progressive Web App for generating Cepheus Engine characters using the Mneme CE rules.**

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Status](https://img.shields.io/badge/Status-M2%20In%20Progress-yellow)](https://github.com/xunema/cecharactergen)
[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live-brightgreen)](https://xunema.github.io/cecharactergen/)

**Live Demo:** https://xunema.github.io/cecharactergen/
**Source Material:** Cepheus Engine SRD + Mneme CE Rules

---

## 📋 Documentation State

| Document | Purpose | Status |
|----------|---------|--------|
| [PRD.md](./PRD.md) | Product Requirements — FRs, milestones, data schemas, GI7B UI Standard | ✅ Current |
| [PROJECT_NOTES.md](./PROJECT_NOTES.md) | Dev log, GI7B UI Standard, architecture decisions, problems & solutions | ✅ Current |
| [CE ShipGen](https://github.com/xunema/ce-shipgen) | Canonical GI7B UI Standard reference | ✅ Reference |
| [UI Requirements](https://github.com/xunema/ce-shipgen) | UI  Requirements| ✅ Reference |

---

## 🛣️ Milestones

| Milestone | Scope | Status |
|-----------|-------|--------|
| **M1: UI Foundation** | Layout, tiles, PWA setup, React Router, all views | ✅ Complete |
| **M2: Data Tables** | JSON editors (dual JSON/Table view), 15+ tables, rule toggles | 🔄 In Progress |
| **M2.5: Install UX** | PWA install prompt, auto-save, settings snapshots, CI/CD | ⏳ Pending |
| **M2.6: Version Control** | Update prompts, version display, changelog, user-controlled updates | ⏳ Pending |
| **M2.7: Tables In Play** | Active table list, switch tables per category, add/edit custom tables, export/import | ⏳ Pending |
| **M2.8: Culture & Name Data** | Flat `cultures_names.json` (Excel/Sheets-editable); discrete `name_generation_rules.json` | ✅ Complete |
| **M3: Full Careers** | All 24 careers, aging, mustering, advX/disX dice, Low-G Human, CE/Mneme career toggle | ⏳ Blocked on M2.7 |
| **M4: Library** | Character library, batch generation, advanced export | ⏳ Pending |

---

## 🎯 GI7B Generator Suite

This app is part of the GI7B Generator Suite. All three generators share the same navigation structure and UI standard:

| Generator | Repo | Status |
|-----------|------|--------|
| **CE ShipGen** _(canonical UI reference)_ | [xunema/ce-shipgen](https://github.com/xunema/ce-shipgen) | ✅ M2 Complete |
| **CE CharacterGen** _(this repo)_ | [xunema/cecharactergen](https://github.com/xunema/cecharactergen) | 🔄 M2 In Progress |
| **Mneme World Gen** | [xunema/mneme-world-generator-pwa](https://github.com/xunema/mneme-world-generator-pwa) | 🔄 M3 In Progress |

---

## 🚀 Tech Stack

- **React 19** + TypeScript + Vite
- **Tailwind CSS** (space theme)
- **React Router DOM**
- **Zustand** (state management)
- **Node.js 18+** / npm

---

## 🛠️ Development

### Setup
```bash
npm install
npm run dev      # http://localhost:5173
```

### Build
```bash
npm run build
npm run preview
```

---

## 🧭 Project Structure

```
cecharactergen/
├── README.md                ← START HERE — milestones, docs state
├── PRD.md                   ← Product requirements & GI7B UI Standard
├── PROJECT_NOTES.md         ← Dev log, GI7B Standard, decisions, problems
├── data/                    ← JSON data tables (canonical/factory defaults)
│   ├── cultures_names.json  ← Flat name array (culture/heritage/gender/name)
│   ├── name_generation_rules.json ← Swappable generation mechanism
│   ├── careers.json         ← All 24 careers in one file
│   ├── races.json
│   ├── skills.json
│   └── ...                  ← 15+ tables total
└── src/
    ├── components/
    ├── pages/
    ├── utils/
    └── data/                ← Runtime copies of data tables
```

---

## 🧭 GI7B UI Standard (Navigation Tree)

```
Landing Page (/)
│
├── 🌙/☀️ Theme Toggle      [header — always visible]
├── 🖥️/📱 Layout Toggle     [header — always visible]
│
├── ✨ Generate Now (/generate)
│   └── Character generation — tile-based
│
├── 📚 Library (/library)
│   └── Saved characters — search, filter, export
│
└── ⚙️ Settings (/settings)
    ├── 📄 JSON Tables        (/settings/tables)
    ├── 🧩 Mechanics Modules  (/settings/mechanics)
    ├── 🎲 Generation Options (/settings/options)
    └── 🔧 Other Settings     (/settings/other)
```

### Tile System
| State | Description |
|-------|-------------|
| **Collapsed** | Summary only |
| **Expanded** | Full content |
| **Focused** | Full-screen overlay — ESC to exit |

---

## 📚 Troubleshooting

| Issue | Fix |
|-------|-----|
| Site not showing latest | Hard refresh `Ctrl+F5` / `Cmd+Shift+R` or try incognito |
| 404 on assets | Check `vite.config.ts` has `base: '/cecharactergen/'` |
| Deployment issues | See [PROJECT_NOTES.md](./PROJECT_NOTES.md) — Problems & Solutions |

---

## 👤 Credits

**Steven Tiu** — Original Author
**Justin Cesar Aquino** — Project Sponsor, Rules Author

---

## 📝 License

GPL v3 — See [LICENSE](./LICENSE)
