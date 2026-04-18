# Low-Tech Fantasy Character Generator — Restart
**Date:** 260418  
**Project:** CE Character Generator (Mneme Variant)  
**Focus:** Low-Tech Fantasy (Tech Level 0–2)  
**Status:** Restart / Planning Phase

---

## 1. Why Restart

Previous iterations accumulated scope drift across multiple tech stacks and settings:
- `cecharactergen` — Science Fiction (Jovian, Cepheus Engine Sci-Fi)
- `ce-shipgen` — Ship construction (out of scope for character gen)
- `mwg` — World generator (orthogonal to character gen)

**New rule:** One focused tool. Low-Tech Fantasy first. Everything else is stretch goals.

---

## 2. Setting Definition: Low-Tech Fantasy

| Parameter | Value |
|-----------|-------|
| **Tech Level** | 0–2 (Stone Age to Early Medieval) |
| **Gunpowder** | None |
| **Metallurgy** | Bronze, iron, crude steel |
| **Transport** | Foot, draft animal, small boat |
| **Medicine** | Herbal, crude surgery |
| **Magic** | Present (Supernatural ability, spell circles) |
| **Tone** | Gritty, lifepath-driven, career-based |

This is the **CE Fantasy** variant already defined in `260414_Fantasy Feature Requirements/CE Fantasy Feature Requirement Document.md`. We are not rewriting the rules. We are **building the generator** for these rules.

---

## 3. Core Scope (MVP)

### 3.1 Must Have
1. **PWA Shell** — Installable, offline-capable, phone-first responsive UI
2. **Species Selection** — Human, Elf, Dwarf (extensible framework)
3. **Ability Generation** — 2d6 in order or point-buy
4. **SOC Roll** — Exploding 2d6 with tier table
5. **Supernatural Roll** — 2d6–17, exploding
6. **Hero Coin Check** — Award if total stats < 48
7. **Background Skills** — Based on SOC tier
8. **Career Terms** — At least 4 core careers:
   - Warrior
   - Hunter
   - Thief
   - Cleric
   - Sorcerer
   - Merchant
   - Noble
9. **Mustering Out** — Cash + material benefits
10. **Derived Stats** — HP, Stamina, AC, Initiative
11. **Character Sheet** — View, edit, print
12. **Character Library** — Save, load, duplicate (save-as), delete, export/import JSON
13. **Reference Editor** — In-app editing of careers, equipment, skills, species, backgrounds

### 3.2 Should Have
- Career events table (simple 2d6 events)
- Mishaps table
- Aging rules (Term 5+)
- Equipment picker with encumbrance
- Import/export all reference data as JSON
- Theme toggle (dark / light)

### 3.3 Won't Have (Yet)
- Starship rules
- Science Fiction careers
- World generation
- Multiplayer / cloud sync
- Backend server (client-side only)

---

## 4. Tech Stack

| Layer | Tech | Rationale |
|-------|------|-----------|
| **Framework** | React 18 + TypeScript | Component-based UI, type safety |
| **Build Tool** | Vite 5 | Fast HMR, optimized builds, PWA plugin |
| **PWA** | `vite-plugin-pwa` | Service worker, manifest, offline cache |
| **Routing** | React Router 6 | Landing, Generator, Sheet, Library, Reference, Settings |
| **State** | Zustand | Lightweight global store |
| **Persistence** | IndexedDB (`idb`) | Characters, edited reference data, settings |
| **Styling** | Tailwind CSS | Phone-first, dark/light theme |
| **Data** | JSON files | Human-editable, version-controllable source of truth |
| **Tests** | Vitest | Fast feedback loop |
| **CLI (legacy)** | Python 3.12+ | Preserved in `python/` directory |

**Note:** Previous CLI-only approach was abandoned. The PWA is the primary interface. Python CLI remains as a secondary tool.

---

## 5. File Layout

```
cecharactergen/
├── 260418-Low-Tech-Fantasy-Restart.md      (this file)
├── 260414_Fantasy Feature Requirements/    (reference rules)
├── CE_Mneme_Character_Generation_mechanics.md
├── DATA_ARCHITECTURE.md
├── PRD.md
├── PROJECT_NOTES.md
├── README.md
├── UI_REQUIREMENTS.md
├── UPDATE_LOG.md
│
├── index.html                              # Vite entry
├── vite.config.ts                          # Vite + PWA config
├── tsconfig.json
├── manifest.json                           # PWA manifest
│
├── public/                                 # Static assets, icons
│
├── src/                                    # React + TypeScript PWA source
│   ├── main.tsx
│   ├── App.tsx
│   ├── index.css
│   │
│   ├── engine/                             # Generator logic (ported from Python)
│   │   ├── dice.ts
│   │   ├── character.ts
│   │   ├── careers.ts
│   │   └── types.ts
│   │
│   ├── data/                               # Static JSON data
│   │   ├── careers/
│   │   ├── species/
│   │   ├── skills/
│   │   ├── equipment/
│   │   └── backgrounds/
│   │
│   ├── store/                              # Zustand + IndexedDB
│   │   ├── useAppStore.ts
│   │   └── db.ts
│   │
│   ├── components/                         # UI screens
│   │   ├── Layout.tsx
│   │   ├── LandingPage.tsx
│   │   ├── GeneratorWizard.tsx
│   │   ├── CharacterSheet.tsx
│   │   ├── CharacterLibrary.tsx
│   │   ├── ReferenceEditor.tsx
│   │   └── SettingsPage.tsx
│   │
│   └── hooks/
│       └── useCharacterGenerator.ts
│
├── python/                                 # Preserved Python CLI
│   ├── generate.py
│   ├── requirements.txt
│   └── src/
│       ├── __init__.py
│       ├── dice.py
│       ├── character.py
│       ├── careers.py
│       └── renderer.py
│
├── data/                                   # JSON source of truth (synced with src/data/)
│   ├── species/
│   ├── careers/
│   ├── skills/
│   ├── equipment/
│   └── backgrounds/
│
└── tests/
    ├── test_dice.py                        # Python tests (legacy)
    └── *.test.ts                           # Vitest tests
```

---

## 6. First Tasks (What to Build Now)

### Phase 1: Scaffold & Engine Port
1. **Initialize Vite + React + TS + Tailwind + `vite-plugin-pwa`**
2. **Port dice engine** — 2d6, exploding dice, advantage/disadvantage (TS)
3. **Port species module** — Load species JSON, apply modifiers (TS)
4. **Port ability roller** — Roll 2d6 × 6, apply species, calculate modifiers (TS)
5. **Port SOC roller** — Exploding 2d6 → tier → background skills (TS)
6. **Port career resolver** — One term loop (survival, advancement, skills) (TS)
7. **Port character object** — Aggregate everything into a single JSON structure (TS)
8. **Verify parity** — Seed-for-seed output matches Python CLI

### Phase 2: UI Shell
9. **Landing page** — Generate, Library, Reference, Settings buttons
10. **Layout component** — Top bar (theme toggle), bottom bar (Back/Next)
11. **Routing** — React Router for all screens
12. **Theme system** — Dark/light mode with Tailwind + localStorage

### Phase 3: Generator & Sheet
13. **Generator wizard** — Accordion stepper for character creation
14. **Character sheet** — Rich view with inline editing
15. **Character library** — Save, load, duplicate, delete, export/import
16. **IndexedDB persistence** — Characters and settings

### Phase 4: Reference Editor
17. **Reference browser** — Careers, equipment, skills, species, backgrounds
18. **In-app editing** — Modify any JSON field, save to IndexedDB
19. **Import/export** — Upload/download reference data as JSON

### Phase 5: PWA Polish
20. **Manifest & icons** — Installable PWA
21. **Service worker** — Offline caching
22. **GitHub Pages deploy** — `vite build` + `gh-pages`
23. **Update design docs** — Keep docs in sync with implementation

---

## 7. Reference Documents

| Document | Purpose |
|----------|---------|
| `260414_Fantasy Feature Requirements/CE Fantasy Feature Requirement Document.md` | Complete rules reference |
| `CE_Mneme_Character_Generation_mechanics.md` | Mneme CE mechanics |
| `DATA_ARCHITECTURE.md` | Previous data architecture notes |
| `PRD.md` | Original product requirements |

---

## 8. Notes

- The PWA is the primary interface. Python CLI is preserved but secondary.
- Keep data in JSON so non-coders can edit careers, skills, and equipment.
- Target Cepheus Engine compatibility — GMs should recognize the output.
- Low-Tech Fantasy means **no firearms careers**, **no starship skills**, **no high-tech equipment**.
- Phone-first design: 375px width baseline, accordion narrative flow.
- All reference data editable in-app; edits persist in IndexedDB and can be exported.
