# QA Status — CE CharacterGen

**Last updated:** 260418  
**Version:** 260418.1.0  
**Test command:** `npx vitest run`

---

## Test Coverage

| Suite | Status | Count | Notes |
|-------|--------|-------|-------|
| Engine unit tests | ✅ Pass | 4/4 | `src/engine/engine.test.ts` |
| Component tests | ❌ None | 0 | No React component tests yet |
| E2E tests | ❌ None | 0 | No Playwright/Cypress yet |
| Build verification | ✅ Pass | — | `npm run build` succeeds, no TS errors |
| Python CLI parity | ✅ Pass | — | Same RNG seed produces identical output |

### Engine Tests (`src/engine/engine.test.ts`)

1. `generates a base character` — verifies ability rolls in range [2,12], age 18, terms 0
2. `resolves a warrior career term` — deterministic with seed 123; verifies career_id, term=1, age=22, total_terms=1
3. `musters out after terms` — 2 warrior terms, verifies cashTotal ≥ 0, assets.length > 0
4. `produces deterministic output with same seed` — seed 42, verifies abilities and skills match between two runs

---

## Known Issues

### Open Bugs

| ID | Severity | Description | File | Repro |
|----|----------|-------------|------|-------|
| BUG-001 | Medium | Mustering benefits resolve to strings ("weapon", "armor") instead of actual equipment items | `src/engine/careers.ts` `musterOut()` | Run `musterOut()` on any character with material benefits |
| BUG-002 | Low | Event auto-advancement on first term doesn't update rank in term summary (cosmetic — skill is still granted) | `src/engine/careers.ts` `resolveEvent()` | Warrior first term with event that auto-promotes |
| BUG-003 | Low | No cash consolidation in renderer — starting cash and mustering cash shown separately | `python/src/renderer.py` | Generate any character with 2+ terms |
| BUG-004 | Medium | Career qualification DM penalty (-2 per previous career) applies even to first career | `src/engine/careers.ts` `resolveQualification()` | Check DM calc when `uniqueCareers.size === 0` — should be 0 penalty, verify it is |

### Fixed

| ID | Description | Fixed In |
|----|-------------|----------|
| BUG-005 | `total_terms` not incrementing on survival failure (mishap) | 260418.1.0 — added `character.total_terms += 1` before early return |

---

## Data Quality

| Check | Status | Notes |
|-------|--------|-------|
| Career JSON schema | ⚠️ Manual | No JSON Schema validation yet; format is consistent across 7 careers |
| Skill references | ⚠️ Manual | Skills referenced in careers must exist in `src/data/skills.json` |
| Equipment references | ⚠️ Manual | Benefits referencing "weapon"/"armor" don't map to actual items yet |
| Species balance | ⚠️ Unverified | Human (no mods), Elf (+2 DEX, -2 END), Dwarf (+2 STR, -2 DEX) — needs playtesting |
| Background SOC ranges | ⚠️ Unverified | 7 backgrounds cover SOC 2–12, but distribution hasn't been validated |

---

## UI/UX Gaps

| Area | Gap | Impact |
|------|-----|--------|
| Generate page | Placeholder only — no actual generation wizard | High |
| Library page | Placeholder only — no IndexedDB integration | High |
| Reference page | Placeholder only — no data browser/editor | Medium |
| Settings page | Placeholder only — no mechanics toggles | Medium |
| 404 handling | No catch-all for React Router deep links | Low |
| PWA icons | `icon-192.png` and `icon-512.png` referenced in manifest but don't exist | Medium — install prompt may fail |
| Accessibility | No ARIA labels, no focus management, no reduced-motion | Medium |

---

## Build / Deploy

| Check | Status |
|-------|--------|
| `npm run dev` | ✅ Works locally |
| `npm run build` | ✅ Clean, no warnings |
| `npm run test` | ✅ 4/4 engine tests pass |
| GitHub Actions | ✅ Workflow file present, triggers on push to main |
| GitHub Pages | ✅ Deployed at `https://game-in-the-brain.github.io/cecharactergen/` |
| PWA install | ⚠️ Missing icon assets; service worker registers |

---

## How to Add a Test

Engine tests go in `src/engine/engine.test.ts` using vitest:

```ts
import { describe, it, expect } from 'vitest'
import { setSeed } from './dice'
import { generateBaseCharacter } from './character'

it('does something', () => {
  setSeed(123)
  const char = generateBaseCharacter('Test')
  expect(char.age).toBe(18)
})
```

Component tests should go in `src/components/**/*.test.tsx` using `@testing-library/react` (not installed yet).

---

## Regression Checklist (run before each release)

- [ ] `npm run build` succeeds with zero errors
- [ ] `npx vitest run` passes all tests
- [ ] Python CLI still works: `cd python && python3 generate.py --name "Test" --terms 2`
- [ ] Landing page loads at `/`
- [ ] Navigation to `/generate`, `/library`, `/reference`, `/settings`, `/about` works
- [ ] Theme toggle cycles dark → light → system
- [ ] Layout toggle cycles auto → phone → desktop
- [ ] GitHub Pages deployment succeeds (check Actions tab)
