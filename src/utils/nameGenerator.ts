import firstNamesData from '../data/names_database.json'
import surnamesData from '../data/surnames_database.json'

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
  male_names: number
  female_names: number
  unisex_names: number
  surnames: number
}

/**
 * Cultural name generator for Cepheus Engine Character Generator.
 * 
 * Rules:
 * 1. Roll for the parents culture, first parent first
 * 2. The second parents culture is significantly more likely the same as the first parent
 * 3. This determines the Last name options of the Character - last name are rolled
 * 4. The first name is based on the gender and from either parents culture
 */
class NameGenerator {
  private cultures: string[]
  private namesByCulture: Record<string, { male: string[], female: string[], unisex: string[] }>
  private surnamesByCulture: Record<string, string[]>
  private availableCultures: string[]

  constructor() {
    this.cultures = firstNamesData.cultures
    this.namesByCulture = firstNamesData.names
    this.surnamesByCulture = surnamesData.surnames

    // Filter to only cultures that have both first names AND surnames
    this.availableCultures = this.cultures.filter(cult => {
      const hasSurnames = this.surnamesByCulture[cult] && this.surnamesByCulture[cult].length > 0
      const firstNames = this.namesByCulture[cult] || {}
      const hasFirstNames = (firstNames.male?.length > 0) || 
                           (firstNames.female?.length > 0) || 
                           (firstNames.unisex?.length > 0)
      return hasSurnames && hasFirstNames
    })
  }

  /**
   * Select cultures for both parents.
   * Parent 1: Randomly selected from available cultures
   * Parent 2: 70% chance to match Parent 1, 30% chance to be different
   */
  selectParentCultures(): [string, string] {
    // Select parent 1 culture randomly
    const parent1Culture = this.availableCultures[Math.floor(Math.random() * this.availableCultures.length)]
    
    // Parent 2 has 70% chance to match parent 1
    let parent2Culture: string
    if (Math.random() < 0.7) {
      parent2Culture = parent1Culture
    } else {
      // 30% chance: select a different culture
      const remainingCultures = this.availableCultures.filter(c => c !== parent1Culture)
      parent2Culture = remainingCultures[Math.floor(Math.random() * remainingCultures.length)]
    }
    
    return [parent1Culture, parent2Culture]
  }

  /**
   * Select a last name from either parent's culture.
   * Each parent culture has equal chance of providing the surname.
   */
  selectLastName(parent1Culture: string, parent2Culture: string): [string, string] {
    // 50/50 chance which parent's culture provides the surname
    const surnameCulture = Math.random() < 0.5 ? parent1Culture : parent2Culture
    
    const surnames = this.surnamesByCulture[surnameCulture] || []
    if (surnames.length === 0) {
      // Fallback to English if culture has no surnames
      const englishSurnames = this.surnamesByCulture['English'] || ['Smith']
      return [englishSurnames[Math.floor(Math.random() * englishSurnames.length)], 'English']
    }
    
    const surname = surnames[Math.floor(Math.random() * surnames.length)]
    return [surname, surnameCulture]
  }

  /**
   * Select a first name based on gender and parent cultures.
   * Can come from either parent's culture (equal chance).
   */
  selectFirstName(gender: string, parent1Culture: string, parent2Culture: string): [string, string] {
    // Normalize gender
    let genderKey: 'male' | 'female' | 'unisex'
    if (gender.toLowerCase() === 'm' || gender.toLowerCase() === 'male') {
      genderKey = 'male'
    } else if (gender.toLowerCase() === 'f' || gender.toLowerCase() === 'female') {
      genderKey = 'female'
    } else {
      genderKey = 'unisex'
    }
    
    // 50/50 chance which parent's culture provides the first name
    const nameCulture = Math.random() < 0.5 ? parent1Culture : parent2Culture
    
    // Get names for this culture and gender
    const cultureNames = this.namesByCulture[nameCulture] || { male: [], female: [], unisex: [] }
    let names: string[] = cultureNames[genderKey] || []
    
    // If no names of that gender, try unisex, then try other gender
    if (names.length === 0) {
      names = cultureNames.unisex || []
    }
    if (names.length === 0) {
      const otherGender = genderKey === 'male' ? 'female' : 'male'
      names = cultureNames[otherGender] || []
    }
    
    // If still no names, fallback to English
    if (names.length === 0) {
      const englishNames = this.namesByCulture['English'] || { male: [], female: [], unisex: ['Unknown'] }
      names = englishNames[genderKey] || englishNames.unisex || ['Unknown']
      const firstName = names[Math.floor(Math.random() * names.length)]
      return [firstName, 'English']
    }
    
    const firstName = names[Math.floor(Math.random() * names.length)]
    return [firstName, nameCulture]
  }

  /**
   * Generate a complete character name with cultural background.
   */
  generateName(gender: string = 'male'): NameData {
    // Select parent cultures
    const [parent1Culture, parent2Culture] = this.selectParentCultures()
    
    // Select last name
    const [lastName, surnameCulture] = this.selectLastName(parent1Culture, parent2Culture)
    
    // Select first name
    const [firstName, firstNameCulture] = this.selectFirstName(gender, parent1Culture, parent2Culture)
    
    // Combine into full name
    const fullName = `${firstName} ${lastName}`
    
    return {
      full_name: fullName,
      first_name: firstName,
      last_name: lastName,
      parent1_culture: parent1Culture,
      parent2_culture: parent2Culture,
      first_name_culture: firstNameCulture,
      surname_culture: surnameCulture,
      gender: gender
    }
  }

  /**
   * Return list of available cultures for name generation.
   */
  getAvailableCultures(): string[] {
    return [...this.availableCultures]
  }

  /**
   * Return statistics about available cultures.
   */
  getCultureStats(): Record<string, CultureStats> {
    const stats: Record<string, CultureStats> = {}
    
    for (const cult of this.availableCultures) {
      const firstNames = this.namesByCulture[cult] || { male: [], female: [], unisex: [] }
      const surnames = this.surnamesByCulture[cult] || []
      
      stats[cult] = {
        male_names: firstNames.male?.length || 0,
        female_names: firstNames.female?.length || 0,
        unisex_names: firstNames.unisex?.length || 0,
        surnames: surnames.length
      }
    }
    
    return stats
  }
}

// Create singleton instance
const nameGenerator = new NameGenerator()

export default nameGenerator
export { NameGenerator }
