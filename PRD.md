# Product Requirements Document (PRD)
## Cepheus Engine Character Generator (CECG)

**Version:** 1.0  
**Last Updated:** February 28, 2026  
**Status:** Planning & Funding Stage  
**Target Development Start:** January 15, 2026

---

## 1. Executive Summary

CECG is a modular, data-driven character generator for the Cepheus Engine tabletop RPG system. It separates game content (races, backgrounds, careers, equipment) from the core rules engine, enabling third-party content creators to add, remove, or override content without modifying application logic.

### Key Value Propositions
- **Non-interactive generation:** One-click character creation with optional pre-set parameters
- **Modular architecture:** Swappable content modules via JSON/JS files
- **Progressive Web App:** Works offline, responsive across all devices
- **Open ecosystem:** Third-party content support through standardized module format

---

## 2. Goals and Objectives

### Primary Goals
1. Automate Cepheus Engine character creation following streamlined Mneme CE rules
2. Provide instant character generation without step-by-step user prompts
3. Enable customization through parameter constraints rather than interactive choices
4. Support 24 distinct career paths with full rules implementation
5. Create extensible architecture for future races, careers, and settings

### Success Metrics
- Generate complete character in < 3 seconds
- Support all 24 CE careers with accurate rules
- Zero code changes required to add new content modules
- Offline functionality for all core features
- Responsive design works on mobile, tablet, and desktop

---

## 3. User Stories

### As a Player
- I want to generate a character with one click so I can start playing immediately
- I want to constrain generation (e.g., "only military careers") so I get characters fitting my campaign
- I want to see the full character history so I understand their background
- I want to export characters in printable format

### As a Game Master
- I want to batch-generate NPCs quickly so I can populate my game world
- I want to disable certain content modules so they fit my setting
- I want accurate Cepheus Engine rules so there's no discrepancy with rulebooks

### As a Content Creator
- I want to add new races/careers without touching core code
- I want standardized templates so my content works predictably
- I want validation tools to ensure my modules are error-free

---

## 4. Technical Requirements

### 4.1 Architecture
- **Frontend:** Vanilla JavaScript (ES6+) with modular ES modules
- **State Management:** Pure functions, immutable character object
- **Data Storage:** JSON modules for game content
- **Build System:** None required (vanilla JS), optional bundling for production
- **PWA:** Service Worker for offline support, manifest.json for installability

### 4.2 Browser Support
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Android)

### 4.3 Performance Requirements
- First paint: < 1.5s on 3G
- Character generation: < 500ms
- Module loading: < 200ms per module
- Memory usage: < 50MB for typical usage

---

## 5. Core Features

### 5.1 Character Generation Engine
- **2D6-based rolls** with difficulty modifiers
- **Six base characteristics:** STR, DEX, END, INT, EDU, SOC
- **Optional characteristics:** PSI, WIS, etc. (module-defined)
- **Characteristic modifiers:** `⌊(value / 3)⌋ - 2`
- **Aging mechanics:** Automated aging rolls starting Term 5
- **Anagathics support:** Cost tracking and SOC-based availability

### 5.2 Content Modules
- **Races Module:** Species definitions with prerequisites and modifiers
- **Backgrounds Module:** Homeworld types with associated skills
- **Careers Module:** 24 careers with enlistment, survival, promotion, skills, mustering
- **Events Module:** Shared event system across all careers
- **Equipment Module:** Assets and gear definitions

### 5.3 Generation Modes
- **Click-to-Generate (Default):** Single character with current parameters
- **Batch Generation:** Multiple characters using same parameters
- **Constrained Generation:** Parameter-based filtering (race, career, background lists)

### 5.4 User Interface
- **Tile-based layout:** Character sheet broken into logical sections
- **Responsive design:** 3 breakpoints (mobile, tablet, desktop)
- **Parameter panel:** Lists and checkboxes for generation constraints
- **Export options:** JSON, printable HTML, plain text

---

## 6. Data Module Specification

### 6.1 Races Module Structure
```json
{
  "race_id": {
    "name": "Human",
    "prerequisites": {},
    "modifiers": {
      "abilities": {},
      "skills": [],
      "traits": []
    },
    "enabled": true
  }
}
```

### 6.2 Careers Module Structure
```json
{
  "career_id": {
    "name": "Marine",
    "qualification": {
      "roll": "2D6",
      "target": 6,
      "dm": {"end": 1, "str": 1}
    },
    "survival": {
      "roll": "2D6",
      "target": 6,
      "dm": {"end": 2}
    },
    "advancement": {
      "roll": "2D6",
      "target": 7,
      "dm": {"edu": 1}
    },
    "skills": {
      "personal": [...],
      "service": [...],
      "specialist": [...],
      "advanced": [...]
    },
    "ranks": [...],
    "mustering": {
      "cash": [...],
      "benefits": [...]
    }
  }
}
```

### 6.3 Module Validation
- JSON Schema validation for all modules
- Error reporting for malformed modules
- Fallback to default content if module fails to load

---

## 7. UI/UX Requirements

### 7.1 Layout Specifications
- **Mobile (< 768px):** Single column, collapsible parameter panel
- **Tablet (768px - 1024px):** 2-column layout with optimized touch targets
- **Desktop (> 1024px):** 3-column layout with full feature visibility
- **Minimum touch target:** 44x44px

### 7.2 Visual Design
- Clean, high-contrast design for readability
- Monospace font for character sheet data
- Clear visual hierarchy for character stats
- Print-friendly stylesheet

### 7.3 Accessibility
- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader compatible
- Color-blind friendly palettes

---

## 8. Development Phases

### Phase 1.0: Core Character Creation (CCC) — 3 weeks
**Jan 15 - Feb 4, 2026**
- Initialize base Character Object
- Roll abilities and basic details
- Core dice rolling engine
- Basic character sheet UI

### Phase 1.1: CCC - Everything Else — 3 weeks
**Feb 5 - Feb 25, 2026**
- Name/homeworld generators
- Conditions system
- Assets stubs
- Export scaffolds

### Phase 1.2: Parameters UI — 3 weeks
**Feb 26 - Mar 18, 2026**
- Lists and checkboxes for constraints
- Race/background/career toggles
- House rules configuration
- UI polish and responsive refinements

### Phase 2: Backgrounds & Race Module — 3 weeks
**Mar 19 - Apr 8, 2026**
- Load races and backgrounds from modules
- Apply modifiers and starting skills/assets
- Module loading system
- Background skill assignment

### Phase 3: Career Path Module — 3 weeks
**Apr 9 - Apr 29, 2026**
- Enlistment system
- Survival/promotion mechanics
- Skills per term
- Career loop (reenlistment/exit)

### Phase 4: Mustering Out — 3 weeks
**Apr 30 - May 20, 2026**
- Muster roll computation
- Cash vs. benefits selection
- Asset integration
- Ship/retirement pay calculations

### Phase 5: Finalization (24 Careers) — 22 weeks
**May 21 - Oct 23, 2026**
- Implement all 24 career modules
- Data integrity validation
- Balance testing
- Documentation and examples

---

## 9. Rules Modifications (Mneme CE)

### Key Deviations from RAW Cepheus Engine
1. **Unified Roll System:** All core rolls (Qualification, Survival, Advancement) use 2D6 vs. Difficulty with simplified DM structure
2. **Automatic Re-Enlistment:** No separate re-enlistment roll; players choose freely
3. **Streamlined Aging:** 
   - Begins Term 5
   - Threshold every 4 years (T5, T9, T13...)
   - Roll: 2D6 + End DM vs. Difficulty (Terms + 1)
4. **Simplified Anagathics:** Spend 100KCr per term, max doses = (SOC - 7)
5. **Drifter Auto-Qualification:** Automatic entry, no roll required

---

## 10. Dependencies and Constraints

### External Dependencies
- None for core functionality (vanilla JS)
- Optional: Build tools for minification (webpack, rollup)
- Optional: Testing framework (Jest, Vitest)

### Constraints
- Must maintain OGL/CC BY-SA compatibility with Cepheus Engine SRD
- No server-side processing required (client-side only)
- Must function offline after initial load
- Content modules must be human-editable (JSON format)

---

## 11. Open Questions

1. **License:** Confirm OGL vs. CC BY-SA for final release
2. **Export Formats:** Priority order for export formats (PDF, JSON, plain text)
3. **Character Storage:** LocalStorage vs. IndexedDB for saved characters
4. **Module Distribution:** Built-in modules vs. external loading
5. **Name Generators:** Built-in or module-provided name lists

---

## 12. Reference Materials

- [Cepheus Engine SRD](https://www.drivethrurpg.com/en/product/187941/cepheus-engine-srd-modifiable-version)
- [Cepheus Engine: 6 Combat Career Cards](https://www.drivethrurpg.com/en/product/413465/cepheus-engine-6-combat-career-cards)
- [Cepheus Engine: 24 Career Cards](https://www.drivethrurpg.com/en/product/413475/cepheus-engine-24-career-cards)
- [Mneme CE Character Creation Wiki](https://github.com/justinaquino/cecharactergen/wiki/Mneme-Cepheus-Engine-Character-Creation)

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-28 | Auto-generated | Initial PRD based on README and wiki documentation |

---

*This document is synchronized with the wiki page "Project Requirements Document". Changes to either should be reflected in both locations.*
