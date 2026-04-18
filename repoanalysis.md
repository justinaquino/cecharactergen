# Repo Analysis — CE CharacterGen

**For:** AI coding agents  
**Project:** Cepheus Engine Low-Tech Fantasy Character Generator PWA  
**Stack:** Vite 5 + React 18 + TypeScript + Tailwind CSS  
**Repo:** https://github.com/Game-in-the-Brain/cecharactergen

---

## Quick Start

```bash
cd /home/justin/opencode260220/cecharactergen
npm install        # if node_modules missing
npm run dev        # local dev server
npm run build      # production build → dist/
npx vitest run     # run tests
```

Python CLI (preserved):
```bash
cd python && python3 generate.py --name "Test" --terms 2
```

---

## Directory Structure

```
cecharactergen/
├── .github/workflows/deploy.yml   # GitHub Actions → GitHub Pages
├── data/                          # Canonical JSON data (source of truth)
│   ├── backgrounds/
│   ├── careers/                   # 7 careers: warrior, cleric, thief, hunter, sorcerer, merchant, noble
│   ├── equipment/                 # weapons.json, armor.json
│   ├── skills/index.json          # 36 skills
│   └── species/                   # human.json, elf.json, dwarf.json
├── python/                        # Original Python CLI (preserved, runnable)
│   ├── generate.py                # Entry point
│   ├── src/                       # character.py, careers.py, dice.py, renderer.py
│   └── tests/test_dice.py
├── src/
│   ├── App.tsx                    # Router setup; Landing outside Layout, rest inside
│   ├── main.tsx                   # React root, BrowserRouter with basename /cecharactergen/
│   ├── index.css                  # Tailwind directives + CSS vars for space theme
│   ├── vite-env.d.ts             # Vite client types
│   ├── components/
│   │   ├── LandingPage.tsx        # Entry point, 4 nav buttons + footer links
│   │   ├── Layout.tsx             # Wraps pages: TopBar + <Outlet> + BottomBar
│   │   ├── TopBar.tsx             # App name link, layout toggle, theme toggle
│   │   └── BottomBar.tsx          # Back/Next navigation
│   ├── data/                      # COPIES of data/ JSON for Vite static import
│   │                              # (Vite can't import from ../data/ in src/)
│   ├── engine/                    # Character generation logic — NO React here
│   │   ├── types.ts               # All TypeScript interfaces
│   │   ├── dice.ts                # 2d6, exploding, advantage/disadvantage, vs target
│   │   ├── rng.ts                 # Seeded PRNG (for test parity with Python)
│   │   ├── character.ts           # generateBaseCharacter, calculateDerived, species mods
│   │   ├── careers.ts             # resolveTerm, musterOut, qualification, survival, etc.
│   │   ├── dataLoader.ts          # loadCareer() — uses Vite's import.meta.glob
│   │   └── engine.test.ts         # 4 vitest tests
│   ├── pages/                     # Route page shells (mostly placeholders)
│   │   ├── GeneratePage.tsx
│   │   ├── LibraryPage.tsx
│   │   ├── ReferencePage.tsx
│   │   ├── SettingsPage.tsx
│   │   └── AboutPage.tsx
│   └── store/
│       └── useAppStore.ts         # Zustand: theme, layoutMode, persist to localStorage
├── vite.config.ts                 # base: '/cecharactergen/', PWA manifest
├── tailwind.config.js             # darkMode: 'class', space-dark/space-accent colors
└── [config files]                 # tsconfig.json, postcss.config.js, package.json
```

---

## Key Conventions

### Dark Mode
- Tailwind `darkMode: 'class'` in `tailwind.config.js`
- `html` element gets `.dark` or `.light` class via Zustand store
- CSS vars in `src/index.css`: `--bg-dark: #1a1a2e`, `--accent: #e94560`
- Components use `dark:` prefixes: `bg-gray-50 dark:bg-space-dark`

### Routing
- `BrowserRouter` with `basename="/cecharactergen"` (matches repo name for GitHub Pages)
- Landing page (`/`) is **outside** `Layout` → no top/bottom bars
- All other routes are **inside** `Layout` → get chrome
- `Layout.tsx` uses `<Outlet>` from react-router-dom

### State Management
- **Global UI state:** Zustand (`useAppStore`) — theme, layout mode
- **No character state store yet** — that comes in Phase 3/4
- Zustand `persist` middleware saves to `localStorage` key `cecharactergen-settings`

### Data Flow
1. Static JSON lives in `src/data/` (copies from `data/`)
2. `dataLoader.ts` uses `import.meta.glob` to load career JSONs at build time
3. Engine functions (`character.ts`, `careers.ts`) consume loaded `CareerData` objects
4. Engine returns plain objects (`CharacterData`, `TermSummary`) — no classes

### Engine Architecture
- **Pure functions** where possible — input `CharacterData`, output modified `CharacterData`
- `CharacterData` is mutated in place (not immutable) for simplicity
- Dice use a seeded PRNG in `rng.ts` for test determinism
- `setSeed(n)` before generation makes output reproducible

---

## Adding a New Career

1. Create `data/careers/<career_id>.json` following the schema in `src/engine/types.ts` (`CareerData`)
2. Copy it to `src/data/careers/<career_id>.json`
3. Add a test in `src/engine/engine.test.ts`
4. Run `npx vitest run` to verify

Career JSON structure:
```json
{
  "career_id": "warrior",
  "name": "Warrior",
  "status_tier": "common",
  "qualification": { "target": 5, "stat": "str", "dm": 0 },
  "survival": { "target": 6, "stat": "end", "dm_modifier": "+1 if STR 9+" },
  "advancement": { "target": 7, "stat": "edu", "effect_threshold": 3 },
  "skills": {
    "personal": ["str", "dex", "end", "int", "edu", "soc"],
    "service": ["melee", "athletics", ...],
    "advanced": ["tactics", "leadership", ...]
  },
  "ranks": [...],
  "mustering": { "cash": [1000, ...], "benefits": ["weapon", "armor", ...] },
  "events": { "2": { "description": "...", "effect": "..." }, ... },
  "mishaps": { "1": "...", ... }
}
```

---

## Common Pitfalls

1. **Don't import from `../data/` in `src/`** — Vite restricts imports outside src. Use `src/data/` copies.
2. **Don't forget `base: '/cecharactergen/'` in `vite.config.ts`** — Required for GitHub Pages asset paths.
3. **Theme changes need `document.documentElement.classList`** — handled in store, but don't bypass it.
4. **Engine tests need `setSeed()`** — Without a seed, dice are random and assertions will flake.
5. **Python CLI imports are absolute** — `from character import ...` not `from .character import ...` because it's run directly.
6. **node_modules must NOT be committed** — `.gitignore` has `node_modules/`. If it slips in, use `git rm -rf --cached node_modules`.

---

## Tech Stack Details

| Layer | Package | Version | Purpose |
|-------|---------|---------|---------|
| Build | Vite | 5.4.x | Dev server + bundler |
| Framework | React | 18.3.x | UI |
| Router | react-router-dom | 6.28.x | Client-side routing |
| Styling | Tailwind CSS | 3.4.x | Utility CSS |
| State | Zustand | 5.0.x | Global store |
| PWA | vite-plugin-pwa | 0.21.x | Manifest + service worker |
| Testing | vitest | 2.1.x | Unit tests |
| Types | TypeScript | 5.6.x | Type checking |

---

## Deployment

- **Trigger:** Push to `main` branch
- **Workflow:** `.github/workflows/deploy.yml`
- **Target:** GitHub Pages
- **URL:** `https://game-in-the-brain.github.io/cecharactergen/`
- **Build output:** `dist/` folder uploaded as artifact

To manually trigger: GitHub repo → Actions → "Deploy to GitHub Pages" → Run workflow.
