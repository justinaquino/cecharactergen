# Career Designer Page

## Document Information
| Field | Value |
|-------|-------|
| **Page** | Career Designer |
| **Purpose** | Visual career creation tool for GMs and Players |
| **Output** | Career JSON package |
| **Integration** | Character Generator, Settings System |

---

## 1. Overview

### 1.1 Purpose
The Career Designer Page allows Game Masters and Players to collaboratively create custom careers for CE Fantasy character generation. Careers are built through a guided form interface and exported as modular JSON packages that the Character Generator consumes.

### 1.2 Key Design Principles
| Principle | Description |
|-----------|-------------|
| **Modular** | Each career section is edited independently |
| **Portable** | Careers export as self-contained JSON packages |
| **Filterable** | TL and genre tags enable campaign-specific filtering |
| **Validated** | Real-time validation prevents incomplete careers |
| **Collaborative** | Share drafts, comment, iterate before finalizing |

### 1.3 Data Volume Strategy
A complete career JSON contains ~30-40 fields across 8 sections. Rather than one wide form row, the designer uses a **persistent sidebar + section tabs** pattern:

```
┌─────────────────────────────────────────────────────────────────┐
│ NAVIGATION BAR                                                   │
│ Character Gen | Career Designer | Settings | ...                │
├──────────┬──────────────────────────────────────────────────────┤
│          │  CAREER HEADER (always visible)                      │
│ CAREER   │  Name: [__________]  ID: [__________]               │
│ LIST     │  TL: [2 ▼]  Status: [Common ▼]  Genre: [+Add Tag]  │
│          │                                                      │
│ [+ New]  │  ┌────────┬────────┬────────┬────────┬────────┐    │
│          │  │ Basic  │ Skills │ Tables │ Ranks  │ Muster │    │
│ Farmer   │  └────────┴────────┴────────┴────────┴────────┘    │
│ Warrior  │                                                      │
│ Rogue    │  [ACTIVE SECTION CONTENT]                            │
│ Merchant │                                                      │
│          │                                                      │
│          │                                                      │
│          │  ┌──────────────────────────────────────────────┐    │
│          │  │ ACTIONS BAR                                   │    │
│          │  │ [Save Draft] [Validate] [Export JSON] [Delete]│    │
│          │  └──────────────────────────────────────────────┘    │
├──────────┴──────────────────────────────────────────────────────┤
│ STATUS BAR: Valid | 7/7 Sections Complete | Last Saved: 2m ago │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Career List Sidebar

### 2.1 Layout
```
┌──────────────────┐
│ CAREER DESIGNER  │
│    [+ New Career] │
├──────────────────┤
│ Filter: [All ▼]  │
│ TL: [Any ▼]      │
│ Tag: [Any ▼]     │
├──────────────────┤
│ ★ My Careers     │
│  Farmer          │
│  Warlord         │
│  Court Mage      │
│                  │
│ ★ Shared (GM)    │
│  Noble Knight    │
│  Street Thug     │
│                  │
│ ★ Templates      │
│  (TL 0-3 Base)   │
│  (TL 4+ Advanced)│
└──────────────────┘
```

### 2.2 Career List Item
Each career in the sidebar shows:
- **Name** (click to select/edit)
- **TL badge** (colored: 0=gray, 1=brown, 2=orange, 3=blue, 4+=purple)
- **Tags** (small pill badges: "fantasy", "scifi", "horror")
- **Status dot** (green=complete, yellow=draft, red=invalid)
- **Ownership indicator** (user icon = yours, group icon = shared)

### 2.3 Filters
| Filter | Options | Effect |
|--------|---------|--------|
| **Ownership** | All, Mine, Shared, Templates | Show only selected |
| **TL Range** | Any, 0, 1, 2, 3, 4+ | Filter by tech level |
| **Genre Tag** | Any, Fantasy, Scifi, Horror, Mystery, Custom | Filter by genre |
| **Status** | Any, Complete, Draft, Invalid | Filter by completion |

---

## 3. Career Header (Persistent)

Always visible above the section tabs. Contains the core career identity fields.

### 3.1 Header Layout
```
┌─────────────────────────────────────────────────────────────────────┐
│  Career Name: [________________________] [Auto-generate ID □]      │
│  Career ID:  [farmer________________] (used in JSON, no spaces)    │
│                                                                      │
│  Tech Level:  [2 ▼]         Status Tier: [Common ▼]                 │
│  ├─ 0 Neolithic              ├─ Serf                                │
│  ├─ 1 Bronze Age             ├─ Low                                 │
│  ├─ 2 Axial/Iron             ├─ Common     ◄── Selected            │
│  ├─ 3 Medieval               ├─ Middle                              │
│  ├─ 4 Enlightenment          └─ Upper                               │
│  └─ 5+ Industrial+                                                   │
│                                                                      │
│  Genre Tags:  [Fantasy ■] [Scifi □] [Horror □] [Mystery □] [+Custom]│
│  Description: [________________________________________________]    │
│               A peasant working the land...                         │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.2 Header Fields
| Field | Type | Required | Validation |
|-------|------|----------|------------|
| **Career Name** | Text | Yes | 1-60 chars, unique |
| **Career ID** | Text (auto) | Yes | lowercase_snake_case, unique |
| **TL** | Dropdown | Yes | 0-6 integer |
| **Status Tier** | Dropdown | Yes | Serf/Low/Common/Middle/Upper |
| **Genre Tags** | Multi-select | No | Fantasy, Scifi, Horror, Mystery, Custom |
| **Description** | Textarea | Yes | 10-500 chars |

---

## 4. Section Tabs

Five section tabs divide the career data into manageable chunks:

### 4.1 Tab Navigation
```
┌──────────┬──────────┬──────────┬──────────┬──────────┐
│  Basic   │  Skills  │  Tables  │  Ranks   │ Muster   │
│  Setup   │ & Abils  │  & Rolls │  & Titles│  Out     │
│  [✓]     │  [✓]     │  [✗]     │  [✓]     │  [✗]     │
└──────────┴──────────┴──────────┴──────────┴──────────┘
     ▲
  checkmark = complete  ✗ = incomplete
```

---

## 5. Tab 1: Basic Setup

Contains qualification, survival, advancement, and SOC requirements.

### 5.1 Layout
```
┌───────────────────────────────────────────────────────────────┐
│ SOC REQUIREMENTS                                               │
│                                                                │
│  Minimum SOC:  [ 2 ▲▼]  [x] No minimum (auto 0)              │
│  Maximum SOC:  [— ▲▼]  [x] No maximum                        │
│                                                                │
│  SOC Description: [Peasants and common folk______________]    │
├───────────────────────────────────────────────────────────────┤
│ QUALIFICATION                                                 │
│                                                                │
│  Type: [●] Automatic    [ ] Stat Minimum    [ ] Stat Test     │
│                                                                │
│  ┌─ Automatic selected ───────────────────────────────┐       │
│  │ Anyone can enter this career.                     │       │
│  │ Override message: [Optional custom description___] │       │
│  └────────────────────────────────────────────────────┘       │
│                                                                │
│  ┌─ Stat Minimum selected ────────────────────────────┐       │
│  │ Stat: [STR ▼]  Minimum Value: [ 7 ▲▼]             │       │
│  │ Message: Requires STR 7+                          │       │
│  └────────────────────────────────────────────────────┘       │
│                                                                │
│  ┌─ Stat Test selected ───────────────────────────────┐       │
│  │ Stat: [DEX ▼]  Target Number: [ 6 ▲▼]             │       │
│  │ Roll: 2d6 + DEX mod vs 6                          │       │
│  └────────────────────────────────────────────────────┘       │
│                                                                │
│  [ ] Also requires SOC minimum: [__] (optional add-on)        │
├───────────────────────────────────────────────────────────────┤
│ SURVIVAL                                                      │
│                                                                │
│  Target Number: [ 5 ▲▼]                                      │
│  Key Stat: [END ▼]  (modifier applied to roll)                │
│  Description: [Physical endurance in dangerous situations]    │
├───────────────────────────────────────────────────────────────┤
│ ADVANCEMENT                                                   │
│                                                                │
│  Method: [●] Effect Threshold    [ ] Separate Roll            │
│                                                                │
│  Effect Threshold: [ 4 ▲▼] (Survival Effect must be ≥ this)   │
│  Key Stat: [EDU ▼]  (bonus DM on advancement checks)          │
│                                                                │
│  [x] Even ranks increase SOC by 1                             │
└───────────────────────────────────────────────────────────────┘
```

### 5.2 Basic Setup Fields
| Section | Field | Type | Required |
|---------|-------|------|----------|
| SOC | Minimum SOC | Number (0-40+) | No |
| SOC | Maximum SOC | Number (0-40+) | No |
| Qualification | Type | Radio: automatic/stat_min/stat_test | Yes |
| Qualification | Stat | Dropdown (STR/DEX/END/INT/EDU) | If stat-based |
| Qualification | Target/Min | Number (2-14) | If stat-based |
| Survival | Target | Number (4-12) | Yes |
| Survival | Key Stat | Dropdown | Yes |
| Advancement | Method | Radio: effect_threshold/separate_roll | Yes |
| Advancement | Effect Threshold | Number (0-6) | Yes |
| Advancement | Key Stat | Dropdown | Yes |
| Advancement | SOC on Even Ranks | Checkbox | No |

---

## 6. Tab 2: Skills & Abilities

Contains all four skill tables and traits/capabilities granted.

### 6.1 Layout
```
┌───────────────────────────────────────────────────────────────┐
│ SKILL TABLES                                                   │
│                                                                │
│  ┌─ SERVICE SKILLS (6 required) ──────────────────────────┐   │
│  │ Career core skills gained at Skill-0 on entry.         │   │
│  │                                                        │   │
│  │ 1. [Melee Combat       ▼]  [x]                        │   │
│  │ 2. [Archery            ▼]  [x]                        │   │
│  │ 3. [Athletics          ▼]  [x]                        │   │
│  │ 4. [Tactics            ▼]  [x]                        │   │
│  │ 5. [Leadership         ▼]  [x]                        │   │
│  │ 6. [Survival           ▼]  [x]                        │   │
│  │                                                        │   │
│  │ [+ Add 7th Service Skill] (optional)                   │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌─ PERSONAL DEVELOPMENT (6 required) ────────────────────┐   │
│  │ Mix of stat boosts and personal skills.                │   │
│  │                                                        │   │
│  │ 1. [STR +1             ▼]  [x]                        │   │
│  │ 2. [DEX +1             ▼]  [x]                        │   │
│  │ 3. [END +1             ▼]  [x]                        │   │
│  │ 4. [Gambling           ▼]  [x]                        │   │
│  │ 5. [Melee Combat       ▼]  [x]                        │   │
│  │ 6. [Athletics          ▼]  [x]                        │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌─ ADVANCED EDUCATION (6 required, EDU 8+ to access) ────┐   │
│  │ 1. [Strategy           ▼]  [x]                        │   │
│  │ 2. [Navigation         ▼]  [x]                        │   │
│  │ 3. [Medicine           ▼]  [x]                        │   │
│  │ 4. [Siege Engineering  ▼]  [x]                        │   │
│  │ 5. [Diplomacy          ▼]  [x]                        │   │
│  │ 6. [Recon              ▼]  [x]                        │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                │
│  ┌─ SPECIAL TABLE (optional, career-specific) ────────────┐   │
│  │ 1. [Weapon Specializat.▼]  [x]                        │   │
│  │ 2. [Armor Training     ▼]  [x]                        │   │
│  │ 3. [Military Discipline▼]  [x]                        │   │
│  │ 4. [—                  ▼]  [ ]                        │   │
│  │ 5. [—                  ▼]  [ ]                        │   │
│  │ 6. [—                  ▼]  [ ]                        │   │
│  │                                                        │   │
│  │ Table Name: [Warrior Training______]                   │   │
│  │ EDU Requirement: [ 8 ▲▼] to access this table          │   │
│  └────────────────────────────────────────────────────────┘   │
├───────────────────────────────────────────────────────────────┤
│ GRANTED TRAITS & CAPABILITIES                                  │
│                                                                │
│  Traits Granted by Career:                                     │
│  [Military Bearing ■] [Battle-Hardened □] [+ Add Trait]       │
│                                                                │
│  Capabilities Granted by Career:                               │
│  [Weapon Proficiency ■] [Armor Training □] [+ Add Capability] │
└───────────────────────────────────────────────────────────────┘
```

### 6.2 Skill Selection Dropdown
Each skill dropdown contains categories:
```
┌──────────────────────────────┐
│ Search: [____________]       │
├──────────────────────────────┤
│  STAT BOOSTS                 │
│    STR +1                    │
│    DEX +1                    │
│    END +1                    │
│    INT +1                    │
│    EDU +1                    │
│    SOC +1                    │
├──────────────────────────────┤
│  COMBAT SKILLS               │
│    Melee Combat              │
│    Archery                   │
│    Dodge                     │
│    Tactics                   │
├──────────────────────────────┤
│  MAGIC SKILLS                │
│    Sorcery                   │
│    Divination                │
│    ...                       │
├──────────────────────────────┤
│  PROFESSIONAL SKILLS         │
│    Craft                     │
│    Medicine                  │
│    ...                       │
└──────────────────────────────┘
```

---

## 7. Tab 3: Tables & Rolls

Contains the Events table, Mishaps table, and optional special rolls.

### 7.1 Layout
```
┌───────────────────────────────────────────────────────────────┐
│ EVENTS TABLE (2d6)                                            │
│                                                                │
│  Roll  │ Event Name           │ Effect Type  │ Details       │
│  ──────┼──────────────────────┼──────────────┼───────────────│
│   2    │ [Disaster           ▼]│ [Mishap    ▼]│ [__________] │
│  3-4   │ [War Injury         ▼]│ [Aging Roll▼]│ [__________] │
│   5    │ [Routine Service    ▼]│ [None      ▼]│ [__________] │
│   6    │ [Boredom            ▼]│ [None      ▼]│ [__________] │
│   7    │ [Life Event         ▼]│ [Life Table▼]│ [__________] │
│   8    │ [Good Assignment    ▼]│ [Skill Roll▼]│ [__________] │
│   9    │ [Training           ▼]│ [Skill Roll▼]│ [__________] │
│  10    │ [Heroic Action      ▼]│ [Adv. DM+2 ▼]│ [__________] │
│  11    │ [Promoted by Noble  ▼]│ [Adv. DM+1 ▼]│ [__________] │
│  12    │ [Legendary Deed     ▼]│ [Auto-Adv+Sk▼]│ [__________]│
│                                                                │
│  [Preview Roll Distribution Chart ▤]                          │
├───────────────────────────────────────────────────────────────┤
│ MISHAPS TABLE (1d6)                                           │
│                                                                │
│  [x] Use Mishaps (if unchecked, survival failure = death)     │
│                                                                │
│  Roll  │ Mishap                                               │
│  ──────┼───────────────────────────────────────────────────────│
│   1    │ [Severely injured in combat______________________]   │
│   2    │ [Discharged for misconduct________________________]   │
│   3    │ [Political purge victim___________________________]   │
│   4    │ [Captured and imprisoned__________________________]   │
│   5    │ [Witnessed war crime - now targeted_______________]   │
│   6    │ [Betrayed by trusted comrade______________________]   │
│                                                                │
│  [+ Add Custom Mishap]                                         │
├───────────────────────────────────────────────────────────────┤
│ OPTIONAL SPECIAL ROLLS                                         │
│                                                                │
│  [x] Draft Table  (for failed qualification)                   │
│    ├─ Rolls on: [Commoner ▼] [Vagabond ▼] [Worker ▼]          │
│                                                                │
│  [ ] Anagathics (anti-aging, cost: [100000] gp/use)           │
│                                                                │
│  [ ] Commission (separate officer track)                       │
│    └─ Commission Target: [ 8 ▲▼] on [SOC ▼]                   │
└───────────────────────────────────────────────────────────────┘
```

### 7.2 Event Effect Types
| Effect Type | Description | Configuration |
|-------------|-------------|---------------|
| **None** | No mechanical effect | — |
| **Mishap** | Roll on mishap table | — |
| **Aging Roll** | Immediate aging check | — |
| **Skill Roll** | Bonus skill table roll | Which table: [___] |
| **Life Event** | Roll on life events table | — |
| **Advancement DM+** | Bonus to next advancement | Amount: [__] |
| **Auto-Advancement** | Automatic rank + skill | — |
| **Contact** | Gain contact/ally | Type: [___] |
| **Enemy** | Gain enemy | Type: [___] |
| **Custom** | Free text effect | Description: [___] |

---

## 8. Tab 4: Ranks & Titles

Contains the rank progression table with associated skills.

### 8.1 Layout
```
┌───────────────────────────────────────────────────────────────┐
│ RANK PROGRESSION                                               │
│                                                                │
│  [x] Has Rank Progression (some careers have no ranks)        │
│                                                                │
│  Rank │ Title              │ Granted Skill          │ Remove  │
│  ─────┼────────────────────┼────────────────────────┼─────────│
│   0   │ [Recruit________]  │ [None                ▼]│  [🗑]  │
│   1   │ [Private________]  │ [Melee Combat +1     ▼]│  [🗑]  │
│   2   │ [Corporal_______]  │ [Leadership +1       ▼]│  [🗑]  │
│   3   │ [Sergeant_______]  │ [Tactics +1          ▼]│  [🗑]  │
│   4   │ [Lieutenant_____]  │ [Strategy +1         ▼]│  [🗑]  │
│   5   │ [Captain________]  │ [Leadership +1       ▼]│  [🗑]  │
│   6   │ [Major__________]  │ [Strategy +1         ▼]│  [🗑]  │
│   7   │ [_________________]  │ [None                ▼]│  [🗑]  │
│                                                                │
│  [+ Add Rank]                                                  │
│                                                                │
│  Maximum Ranks: 7 (standard) or [Custom ▲▼]                   │
│                                                                │
│  [x] SOC increases on even ranks (Noble/Military tradition)   │
│  [x] Rank 5+ grants mustering DM+1                            │
│  [x] Rank 6 grants mustering DM+2                             │
└───────────────────────────────────────────────────────────────┘
```

### 8.2 Rank Fields
| Field | Type | Required |
|-------|------|----------|
| **Rank Number** | Auto (0-based) | Yes |
| **Title** | Text | Yes |
| **Granted Skill** | Dropdown (skill + level) | No |
| **SOC Bonus** | Checkbox auto | No |
| **Mustering DM** | Auto based on rank | No |

---

## 9. Tab 5: Mustering Out

Contains cash benefits table, material benefits table, and starting equipment.

### 9.1 Layout
```
┌───────────────────────────────────────────────────────────────┐
│ CASH BENEFITS TABLE                                            │
│                                                                │
│  Max Rolls: [3 ▲▼] (standard)                                 │
│                                                                │
│  Roll │ Cash Amount │ DM Modifier Notes                       │
│  ─────┼─────────────┼─────────────────────────────────────────│
│   1   │ [  1000 gp ▼]│ Gambling skill, Rank bonus            │
│   2   │ [  2000 gp ▼]│                                         │
│   3   │ [  5000 gp ▼]│                                         │
│   4   │ [ 10000 gp ▼]│                                         │
│   5   │ [ 20000 gp ▼]│                                         │
│   6   │ [ 50000 gp ▼]│                                         │
│   7   │ [100000 gp ▼]│ (if extended table enabled)           │
│                                                                │
│  [x] Extended Table (7 entries instead of 6)                  │
│  DM Sources: [x] Gambling skill  [x] Rank 4+  [x] Rank 5+     │
├───────────────────────────────────────────────────────────────┤
│ MATERIAL BENEFITS TABLE                                        │
│                                                                │
│  Roll │ Benefit Type   │ Specific Item      │ Description     │
│  ─────┼────────────────┼────────────────────┼─────────────────│
│   1   │ [Equipment   ▼]│ [Weapon________ ▼]│ Quality weapon  │
│   2   │ [Equipment   ▼]│ [Armor_________ ▼]│ Quality armor   │
│   3   │ [Contact     ▼]│ [Veteran Ally__ ▼]│ Old comrade     │
│   4   │ [Contact     ▼]│ [Military Cntct▼]│ Network access  │
│   5   │ [Animal      ▼]│ [Warhorse______ ▼]│ Trained mount   │
│   6   │ [Asset       ▼]│ [Small Fief____ ▼]│ Land grant      │
│                                                                │
│  DM Sources: [x] Rank 4+ (+1 DM)  [x] Rank 5+ (+2 DM)         │
│                                                                │
│  [+ Add Custom Benefit]                                        │
├───────────────────────────────────────────────────────────────┤
│ STARTING EQUIPMENT (auto-assigned from career)                 │
│                                                                │
│  Career starting gear:                                         │
│  [x] Basic clothing                                           │
│  [x] Service weapon (career-appropriate)                      │
│  [x] Service armor (if applicable)                            │
│  [ ] Pack and bedroll                                         │
│  [ ] 1 week rations                                           │
│                                                                │
│  [+ Add Custom Starting Item]                                  │
└───────────────────────────────────────────────────────────────┘
```

### 9.2 Benefit Types
| Type | Description | Configuration |
|------|-------------|---------------|
| **Equipment** | Specific item | Select from equipment DB |
| **Weapon** | Weapon item | Select weapon + quality |
| **Armor** | Armor item | Select armor + quality |
| **Contact** | NPC relationship | Define contact type |
| **Ally** | Loyal NPC | Define ally template |
| **Animal** | Mount or companion | Select beast |
| **Asset** | Non-portable property | Define property |
| **Spell** | Learned spell | Select spell from DB |
| **Custom** | Free text | Write description |

---

## 10. Validation & Status

### 10.1 Validation Rules
| Section | Required Fields | Validation |
|---------|----------------|------------|
| Header | Name, ID, TL, Status, Description | Unique ID, non-empty |
| Basic Setup | Qualification, Survival, Advancement | Target numbers in range |
| Skills | Service Skills (6), Personal Dev (6) | All slots filled |
| Tables | Events table (all 10 entries) | No gaps in 2-12 range |
| Ranks | At least 1 rank defined | Titles non-empty |
| Mustering | Cash table (6 entries), Benefits (6) | All amounts > 0 |

### 10.2 Status Indicator
```
┌────────────────────────────────────────┐
│ Overall Status: [● COMPLETE]           │
│                                        │
│ Sections:                              │
│   [✓] Basic Setup    - All required   │
│   [✓] Skills         - All required   │
│   [✓] Tables         - All required   │
│   [✓] Ranks          - All required   │
│   [✗] Mustering      - Cash incomplete│
│                                        │
│ Issues:                                │
│   ! Cash table entry 4 is empty       │
│   ! No genre tags selected            │
└────────────────────────────────────────┘
```

---

## 11. Save, Export & Share

### 11.1 Save Options
```
┌────────────────────────────────────────┐
│ [💾 Save Draft]  [📤 Export JSON]      │
│ [🔗 Share Link]  [🗑 Delete]           │
└────────────────────────────────────────┘
```

### 11.2 Save Draft
- Saves to browser localStorage
- Allows resuming later
- Auto-saves every 30 seconds
- Shows "last saved" timestamp

### 11.3 Export JSON
Exports the complete career as a self-contained JSON file:

```json
{
  "export_version": "1.0",
  "export_type": "career_package",
  "exported_at": "2026-04-18T10:30:00Z",
  "career": {
    "career_id": "warrior",
    "name": "Warrior",
    "description": "Professional soldier or military retainer",
    "tl": 2,
    "status_tier": "common",
    "genre_tags": ["fantasy", "mystery"],
    "soc_requirement": {"minimum": 4, "maximum": null},
    "qualification": {...},
    "survival": {...},
    "advancement": {...},
    "skills": {...},
    "ranks": [...],
    "events": {...},
    "mishaps": {...},
    "mustering": {...},
    "traits_granted": ["military_bearing"],
    "capabilities_granted": ["weapon_proficiency"]
  }
}
```

**Filename convention**: `ce-career-{career_id}-tl{tl}-{date}.json`

### 11.4 Share Link
- Generates a shareable URL with encoded career data
- Others can view, comment, or fork
- GM can approve/deny submitted careers

### 11.5 Career Package (Multiple Careers)
Users can bundle multiple careers into a single package:

```
Export Options:
  [●] This career only
  [ ] Selected careers: [Farmer ■] [Warrior ■] [Rogue □]
  [ ] All my careers
  [ ] All careers in campaign
```

Package format:
```json
{
  "export_version": "1.0",
  "export_type": "career_bundle",
  "name": "Medieval Fantasy Careers",
  "description": "12 careers for TL 2-3 fantasy campaigns",
  "campaign_tl_range": {"min": 1, "max": 3},
  "careers": [
    {"career_id": "farmer", ...},
    {"career_id": "warrior", ...},
    {"career_id": "rogue", ...}
  ]
}
```

---

## 12. Import Careers

### 12.1 Import Interface
```
┌────────────────────────────────────────┐
│ IMPORT CAREERS                         │
│                                        │
│ Drop JSON file here                    │
│ or click to browse                     │
│                                        │
│ [Import from URL: ________________]   │
│ [Import from Clipboard]               │
│                                        │
│ Validation Results:                    │
│   ✓ 3 careers found                    │
│   ✓ Schema version compatible          │
│   ⚠ Career "warrior" ID already exists │
│                                        │
│ Import Options:                        │
│   (●) Import all as new               │
│   ( ) Skip duplicates                 │
│   ( ) Overwrite existing              │
│   ( ) Rename duplicates (_2, _3)      │
│                                        │
│ [Preview Careers] [Import Selected]   │
└────────────────────────────────────────┘
```

---

## 13. Integration with Character Generator

### 13.1 How Careers Flow to Character Gen
```
Career Designer              Character Generator
     │                              │
     │ 1. Create/Edit Career        │
     │ 2. Validate                  │
     │ 3. Export JSON               │
     ├─────────────────────────────→│
     │                              │
     │                              │ 4. Import to Career DB
     │                              │ 5. Filter by Campaign TL
     │                              │ 6. Present to Player
     │                              │ 7. Player selects career
     │                              │ 8. Resolve career term(s)
```

### 13.2 Character Generator API
```http
GET /api/careers/available
  ?campaign_tl=3
  &genre=fantasy
  &character_soc=8
  &settings_id=uuid

Response:
{
  "campaign_tl": 3,
  "available_careers": [
    {
      "career_id": "warrior",
      "name": "Warrior",
      "tl": 2,
      "status_tier": "common",
      "soc_requirement": {"min": 4},
      "qualified": true,
      "qualification_roll": null
    }
  ],
  "unavailable": [
    {
      "career_id": "courtier",
      "reason": "soc_requirement_not_met",
      "required": 23,
      "current": 8
    }
  ]
}
```

---

## 14. Responsive Behavior

### 14.1 Desktop (1200px+)
Full 2-column layout: sidebar + main content

### 14.2 Tablet (768px-1199px)
Collapsible sidebar, full-width tabs

### 14.3 Mobile (<768px)
```
┌──────────────────────────┐
│ ≡ Careers  [+New]        │
├──────────────────────────┤
│ Career: Warrior  [Edit▼] │
├──────────────────────────┤
│ < Basic | Skills | Tab > │
│ (swipeable tabs)         │
├──────────────────────────┤
│                          │
│ [Section content]        │
│                          │
├──────────────────────────┤
│ [💾 Save] [📤 Export]    │
└──────────────────────────┘
```

---

*Career Designer Page v1.0*
