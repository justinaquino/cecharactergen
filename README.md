# CE CharacterGen — Low-Tech Fantasy

**A Progressive Web App for generating Cepheus Engine Fantasy characters using the Mneme CE rules.**

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Status](https://img.shields.io/badge/Status-Restart%20260418-yellow)](https://github.com/Game-in-the-Brain/cecharactergen)
[![Version](https://img.shields.io/badge/Version-260418.0.0-blue)](./VERSION.md)
[![PWA](https://img.shields.io/badge/PWA-Not%20Yet%20Deployed-lightgrey)]()

**Source Material:** Cepheus Engine SRD + Mneme CE Rules
**Focus:** Low-Tech Fantasy (Tech Level 0–2) — Stone Age to Early Medieval

> **260418 Restart:** The previous React/Vite UI accumulated scope drift across sci-fi and fantasy settings. This restart strips the project to its core and rebuilds as a focused Low-Tech Fantasy PWA. The Python CLI generator is preserved as a secondary tool.

---

## 📋 Documentation State

| Document | Purpose | Status |
|----------|---------|--------|
| [VERSION.md](./VERSION.md) | Version history, bug tracking, release roadmap | ✅ Current |
| [260418-Low-Tech-Fantasy-Restart.md](./260418-Low-Tech-Fantasy-Restart.md) | Restart plan, tech stack, file layout, phased tasks | ✅ Current |
| [PRD.md](./PRD.md) | Product Requirements — FRs, milestones, data schemas, GI7B UI Standard | ✅ Current |
| [DATA_ARCHITECTURE.md](./DATA_ARCHITECTURE.md) | All JSON table schemas, DA-N.N references, naming conventions | ✅ Current |
| [UI_REQUIREMENTS.md](./UI_REQUIREMENTS.md) | UI design decisions — phone-first, accordion UX, tile system | ✅ Current |
| [UPDATE_LOG.md](./UPDATE_LOG.md) | Justin's working log — pre-coding gate status, in-progress and pending work | ✅ Current |
| [260321 jovian_subspecies_cepheus.md](./260321%20jovian_subspecies_cepheus.md) | Source material — Jovian subspecies (2300AD setting) | ✅ Reference |
| [CE_Mneme_Character_Generation_mechanics.md](./CE_Mneme_Character_Generation_mechanics.md) | Mneme CE game rules | ✅ Reference |
| [CE ShipGen](https://github.com/Game-in-the-Brain/ce-shipgen) | Canonical GI7B UI Standard reference | ✅ Reference |

---

## 🛣️ Milestones (260418 Restart)

| Phase | Scope | Status |
|-------|-------|--------|
| **Phase 1: Engine** | Port Python generator to TypeScript, verify parity | 🔄 In Progress |
| **Phase 2: UI Shell** | Landing, layout, routing, theme, phone-first design | ⏳ Pending |
| **Phase 3: Generator** | Accordion wizard: species → abilities → SOC → background → careers → mustering | ⏳ Pending |
| **Phase 4: Library** | Save, load, duplicate, delete, export/import characters | ⏳ Pending |
| **Phase 5: Reference** | In-app editing of careers, equipment, skills, species, backgrounds | ⏳ Pending |
| **Phase 6: PWA Polish** | Manifest, service worker, offline caching, GitHub Pages deploy | ⏳ Pending |

**Current Careers:** Warrior, Cleric, Thief, Hunter, Sorcerer, Merchant, Noble
**Current Species:** Human, Elf, Dwarf
**Current Equipment:** 10 weapons, 11 armors

---

## 🎯 GI7B Generator Suite

| Generator | Repo | Status |
|-----------|------|--------|
| **CE ShipGen** | [Game-in-the-Brain/ce-shipgen](https://github.com/Game-in-the-Brain/ce-shipgen) | ✅ Active |
| **CE CharacterGen** _(this repo)_ | [Game-in-the-Brain/cecharactergen](https://github.com/Game-in-the-Brain/cecharactergen) | 🔄 Restarting |
| **Mneme World Gen** | [Game-in-the-Brain/mneme-world-generator-pwa](https://github.com/Game-in-the-Brain/mneme-world-generator-pwa) | 🔄 Active |

---

## 🚀 Tech Stack

- **React 18** + TypeScript + Vite 5
- **Tailwind CSS** (dark/light theme)
- **React Router DOM**
- **Zustand** (state management)
- **IndexedDB** (`idb` library) for persistence
- **`vite-plugin-pwa`** (service worker, manifest, offline cache)
- **Node.js 18+** / npm

**Legacy CLI:** Python 3.12+ (preserved in `python/` directory)

---

## 🛠️ Development

### PWA (Primary)
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # Production build
npm run preview  # Preview production build
```

### Python CLI (Secondary)
```bash
cd python
python3 generate.py --name "Test" --career warrior --terms 2
```

---

## 🧭 Project Structure

```
cecharactergen/
├── README.md                ← START HERE
├── 260418-Low-Tech-Fantasy-Restart.md  ← Restart plan & tech stack
├── PRD.md                   ← Product requirements
├── DATA_ARCHITECTURE.md     ← JSON schemas
├── UI_REQUIREMENTS.md       ← Phone-first UI design
├── UPDATE_LOG.md            ← Working log
├── CE_Mneme_Character_Generation_mechanics.md ← Game rules
├── data/                    ← JSON source of truth
│   ├── careers/
│   ├── species/
│   ├── skills/
│   ├── equipment/
│   └── backgrounds/
│
├── src/                     ← React + TypeScript PWA
│   ├── engine/              ← Generator logic (ported from Python)
│   ├── data/                ← Runtime copies of JSON data
│   ├── store/               ← Zustand + IndexedDB
│   ├── components/          ← UI screens
│   └── hooks/
│
├── python/                  ← Preserved Python CLI
│   ├── generate.py
│   └── src/
│
└── tests/
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
