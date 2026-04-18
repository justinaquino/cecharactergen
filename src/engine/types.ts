export interface CharacterData {
  name: string
  species_id: string
  abilities: Record<string, number>
  supernatural: number
  hero_coins: number
  background_id: string
  background_skill: string
  careers: TermSummary[]
  skills: Record<string, number>
  equipment: Array<{ id: string; condition?: string; quantity?: number }>
  assets: Array<{ type: string; amount?: number; description?: string }>
  connections: Array<{ type: string; id: string; description?: string }>
  age: number
  total_terms: number
  derived: Record<string, number>
}

export interface TermSummary {
  career_id: string
  term: number
  start_age: number
  survived: boolean
  mishap: string | null
  advanced: boolean
  rank: number
  event: string
  skills_gained: string[]
}

export interface SpeciesData {
  species_id: string
  name: string
  description: string
  ability_modifiers: Record<string, number>
  base_speed: number
  lifespan_multiplier: number
  special_abilities: string[]
  starting_skills: string[]
  career_restrictions: string[]
  supernatural_bonus: number
  background_skill_bonus: number
}

export interface CareerData {
  career_id: string
  name: string
  description: string
  status_tier: string
  qualification: {
    target: number
    stat: string
    dm: number
  }
  survival: {
    target: number
    stat: string
    dm_modifier: string
  }
  advancement: {
    target: number
    stat: string
    effect_threshold: number
  }
  skills: {
    personal: string[]
    service: string[]
    advanced: string[]
    special?: string[]
  }
  ranks: Array<{
    rank: number
    title: string
    skill: string | null
  }>
  reenlistment_target?: number
  mustering: {
    cash: number[]
    benefits: string[]
  }
  events: Record<string, { description: string; effect: string }>
  mishaps: Record<string, string>
}

export interface BackgroundData {
  background_id: string
  name: string
  soc_range: { min: number; max: number }
  skill_options: string[]
  starting_equipment: string[]
  starting_funds_modifier: number
}

export interface SkillData {
  name: string
  category: string
  stat_dependency: string
  description: string
}

export interface WeaponData {
  id: string
  name: string
  category: string
  subcategory: string
  cost: number
  weight: number
  tech_level: number
  required_skill: string
  damage: string
  properties: string[]
}

export interface ArmorData {
  id: string
  name: string
  category: string
  subcategory: string
  cost: number
  weight: number
  tech_level: number
  armor_bonus: number
  properties: string[]
}
