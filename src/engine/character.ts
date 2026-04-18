import type { CharacterData, SpeciesData, BackgroundData } from './types'
import { rollAbilities, rollSupernatural, characteristicModifier } from './dice'
import { loadSpecies, getBackgrounds } from './dataLoader'
import { random } from './rng'

export function getSocTier(soc: number): string {
  if (soc <= 7) return 'serf'
  if (soc <= 10) return 'commoner'
  if (soc <= 13) return 'middle'
  if (soc <= 16) return 'gentry'
  if (soc <= 21) return 'minor_noble'
  if (soc <= 27) return 'major_noble'
  if (soc <= 33) return 'high_noble'
  if (soc <= 39) return 'minor_royalty'
  return 'true_royalty'
}

export function selectBackground(soc: number): BackgroundData {
  const bgs = getBackgrounds()
  for (const bg of bgs) {
    if (bg.soc_range.min <= soc && soc <= bg.soc_range.max) {
      return bg
    }
  }
  return bgs[0]
}

export function applySpeciesModifiers(character: CharacterData, speciesData: SpeciesData): void {
  for (const [stat, mod] of Object.entries(speciesData.ability_modifiers)) {
    character.abilities[stat] = (character.abilities[stat] || 7) + mod
  }
}

export function awardHeroCoins(character: CharacterData): void {
  const coreStats = ['str', 'dex', 'end', 'int', 'edu']
  const total = coreStats.reduce((sum, s) => sum + (character.abilities[s] || 7), 0)
  if (total < 36) {
    character.hero_coins = 3
  } else if (total < 42) {
    character.hero_coins = 2
  } else if (total < 48) {
    character.hero_coins = 1
  } else {
    character.hero_coins = 0
  }
}

export function calculateDerived(character: CharacterData): void {
  const strMod = characteristicModifier(character.abilities['str'] || 7)
  const dexMod = characteristicModifier(character.abilities['dex'] || 7)
  const eduMod = characteristicModifier(character.abilities['edu'] || 7)
  const intVal = character.abilities['int'] || 7
  const eduVal = character.abilities['edu'] || 7

  const hp = Math.max(1, character.abilities['end'] || 7)
  const stamina = Math.max(1, (character.abilities['end'] || 7) + strMod)
  const initiative = dexMod
  const ac = 8 + dexMod
  const skillMax = intVal + eduVal
  const languages = Math.max(1, eduMod)

  character.derived = {
    hit_points: hp,
    stamina_points: stamina,
    initiative_modifier: initiative,
    armor_class: ac,
    skill_maximum: skillMax,
    languages: languages,
    movement: 6,
  }
}

export function createCharacter(name: string = 'Unnamed'): CharacterData {
  return {
    name,
    species_id: 'human',
    abilities: {},
    supernatural: -15,
    hero_coins: 0,
    background_id: '',
    background_skill: '',
    careers: [],
    skills: {},
    equipment: [],
    assets: [],
    connections: [],
    age: 18,
    total_terms: 0,
    derived: {},
  }
}

export function generateBaseCharacter(name: string = 'Unnamed'): CharacterData {
  const char = createCharacter(name)

  // 1. Roll abilities
  char.abilities = rollAbilities()

  // 2. Load species and apply modifiers
  const speciesData = loadSpecies('human')
  applySpeciesModifiers(char, speciesData)

  // 3. Roll supernatural
  char.supernatural = rollSupernatural()

  // 4. Hero coins
  awardHeroCoins(char)

  // 5. SOC tier & background
  const bg = selectBackground(char.abilities['soc'])
  char.background_id = bg.background_id

  // Pick one background skill
  char.background_skill = bg.skill_options[Math.floor(random() * bg.skill_options.length)]
  char.skills[char.background_skill] = (char.skills[char.background_skill] || 0) + 1

  // Apply species background skill bonus (Human = +1 choice)
  const bonusSkills = speciesData.background_skill_bonus || 0
  for (let i = 0; i < bonusSkills; i++) {
    const extra = bg.skill_options[Math.floor(random() * bg.skill_options.length)]
    char.skills[extra] = (char.skills[extra] || 0) + 1
  }

  // 6. Starting funds
  const startingCash = Math.floor(500 * bg.starting_funds_modifier)
  char.assets.push({ type: 'cash', amount: startingCash })

  // 7. Derived stats
  calculateDerived(char)
  char.derived['movement'] = speciesData.base_speed

  return char
}
