import culturesNamesData from '../data/cultures_names.json'
import rulesData from '../data/name_generation_rules.json'

export interface NameRow {
  culture: string
  heritage: string
  type: 'first' | 'surname'
  gender: 'male' | 'female' | 'unisex' | 'any'
  name: string
}

export interface NameGenerationRules {
  id: string
  name: string
  description: string
  parent2_same_culture_probability: number
  surname_from_parent1_probability: number
  firstname_from_parent1_probability: number
  fallback_culture: string
}

export interface NameData {
  full_name: string
  first_name: string
  last_name: string
  parent1_culture: string
  parent2_culture: string
  first_name_culture: string
  surname_culture: string
  gender: string
}

export interface CultureStats {
  heritage: string
  male_names: number
  female_names: number
  unisex_names: number
  surnames: number
}

class NameGenerator {
  private rows: NameRow[]
  private availableCultures: string[]
  // Indexed lookups built once from the flat array
  private firstNames: Record<string, Record<string, string[]>>   // culture -> gender -> names[]
  private surnames: Record<string, string[]>                     // culture -> names[]
  private rules: NameGenerationRules
  private heritageMap: Record<string, string>

  constructor() {
    this.rows = culturesNamesData.names as NameRow[]

    // Build indexes
    this.firstNames = {}
    this.surnames = {}
    this.heritageMap = {}

    for (const row of this.rows) {
      this.heritageMap[row.culture] = row.heritage
      if (row.type === 'first') {
        if (!this.firstNames[row.culture]) this.firstNames[row.culture] = {}
        if (!this.firstNames[row.culture][row.gender]) this.firstNames[row.culture][row.gender] = []
        this.firstNames[row.culture][row.gender].push(row.name)
      } else {
        if (!this.surnames[row.culture]) this.surnames[row.culture] = []
        this.surnames[row.culture].push(row.name)
      }
    }

    // Only use cultures that have both first names AND surnames
    const allCultures = new Set([
      ...Object.keys(this.firstNames),
      ...Object.keys(this.surnames),
    ])
    this.availableCultures = [...allCultures].filter(c =>
      this.surnames[c]?.length > 0 &&
      (this.firstNames[c]?.male?.length > 0 ||
       this.firstNames[c]?.female?.length > 0 ||
       this.firstNames[c]?.unisex?.length > 0)
    )

    // Load active rules
    this.rules = this._loadRules()
  }

  private _loadRules(): NameGenerationRules {
    const activeId = rulesData.active
    const found = rulesData.rules.find(r => r.id === activeId)
    return (found ?? rulesData.rules[0]) as NameGenerationRules
  }

  /** Swap the active rule set by id. Persists for the session. */
  setRules(ruleId: string): boolean {
    const found = rulesData.rules.find(r => r.id === ruleId)
    if (!found) return false
    this.rules = found as NameGenerationRules
    return true
  }

  /** Return all available rule sets. */
  getAvailableRules(): NameGenerationRules[] {
    return rulesData.rules as NameGenerationRules[]
  }

  /** Return the currently active rules. */
  getActiveRules(): NameGenerationRules {
    return this.rules
  }

  private _pickRandom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)]
  }

  private _selectParentCultures(): [string, string] {
    const p1 = this._pickRandom(this.availableCultures)
    const p2 = Math.random() < this.rules.parent2_same_culture_probability
      ? p1
      : this._pickRandom(this.availableCultures.filter(c => c !== p1))
    return [p1, p2]
  }

  private _selectLastName(p1: string, p2: string): [string, string] {
    const culture = Math.random() < this.rules.surname_from_parent1_probability ? p1 : p2
    const pool = this.surnames[culture]
    if (pool?.length) return [this._pickRandom(pool), culture]
    // Fallback
    const fb = this.surnames[this.rules.fallback_culture] ?? ['Smith']
    return [this._pickRandom(fb), this.rules.fallback_culture]
  }

  private _selectFirstName(gender: string, p1: string, p2: string): [string, string] {
    const gKey = gender === 'male' || gender === 'm' ? 'male'
               : gender === 'female' || gender === 'f' ? 'female'
               : 'unisex'

    const culture = Math.random() < this.rules.firstname_from_parent1_probability ? p1 : p2
    const cultureNames = this.firstNames[culture] ?? {}

    const pool = cultureNames[gKey]?.length ? cultureNames[gKey]
               : cultureNames['unisex']?.length ? cultureNames['unisex']
               : gKey === 'male' ? (cultureNames['female'] ?? [])
               : (cultureNames['male'] ?? [])

    if (pool.length) return [this._pickRandom(pool), culture]

    // Fallback culture
    const fbNames = this.firstNames[this.rules.fallback_culture] ?? {}
    const fbPool = fbNames[gKey] ?? fbNames['unisex'] ?? ['Unknown']
    return [this._pickRandom(fbPool), this.rules.fallback_culture]
  }

  /** Generate a complete character name with cultural background. */
  generateName(gender: string = 'male'): NameData {
    const [p1, p2] = this._selectParentCultures()
    const [lastName, surnameCulture] = this._selectLastName(p1, p2)
    const [firstName, firstNameCulture] = this._selectFirstName(gender, p1, p2)

    return {
      full_name: `${firstName} ${lastName}`,
      first_name: firstName,
      last_name: lastName,
      parent1_culture: p1,
      parent2_culture: p2,
      first_name_culture: firstNameCulture,
      surname_culture: surnameCulture,
      gender,
    }
  }

  /** Return list of available cultures (those with both first names and surnames). */
  getAvailableCultures(): string[] {
    return [...this.availableCultures]
  }

  /** Return statistics about available cultures. */
  getCultureStats(): Record<string, CultureStats> {
    const stats: Record<string, CultureStats> = {}
    for (const culture of this.availableCultures) {
      const fn = this.firstNames[culture] ?? {}
      stats[culture] = {
        heritage: this.heritageMap[culture] ?? 'Other',
        male_names: fn['male']?.length ?? 0,
        female_names: fn['female']?.length ?? 0,
        unisex_names: fn['unisex']?.length ?? 0,
        surnames: this.surnames[culture]?.length ?? 0,
      }
    }
    return stats
  }
}

// Singleton instance
const nameGenerator = new NameGenerator()

export default nameGenerator
export { NameGenerator }
