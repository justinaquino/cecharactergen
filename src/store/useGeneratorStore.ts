import { create } from 'zustand'
import type { CharacterData, TermSummary } from '../engine/types'
import { createCharacter, generateBaseCharacter, calculateDerived, applySpeciesModifiers, awardHeroCoins } from '../engine/character'
import { resolveTerm, musterOut, resolveReenlistment } from '../engine/careers'
import { loadSpecies, getAllCareers, getBackgrounds } from '../engine/dataLoader'
import { rollAbilities, rollExploding } from '../engine/dice'
import { random } from '../engine/rng'

export type GenerationMode = 'player' | 'random'
export type GenerationStep = 0 | 1 | 2 | 3 | 4 | 5 | 6

interface GeneratorState {
  mode: GenerationMode
  character: CharacterData | null
  currentStep: GenerationStep
  completedSteps: GenerationStep[]

  // Career term state
  activeCareerId: string | null
  lastTermResult: TermSummary | null
  reenlistmentResult: { canContinue: boolean; mandatory: boolean } | null
  careerEnded: boolean

  // Random mode
  batchCount: number
  batchProgress: number
  generatedCharacters: CharacterData[]

  // Actions
  setMode: (mode: GenerationMode) => void
  setBatchCount: (count: number) => void

  startGeneration: () => void
  resetCharacter: () => void

  setSpecies: (speciesId: string) => void
  rollCharacteristics: () => void
  rerollAbility: (ability: string) => void
  applyBackground: (backgroundId: string, skillId: string) => void
  startCareerTerm: (careerId: string) => void
  resolveCareerTerm: () => void
  chooseReenlist: () => void
  chooseChangeCareer: (careerId: string) => void
  chooseMusterOut: () => void
  resolveMustering: () => void
  setName: (name: string) => void

  completeStep: (step: GenerationStep) => void
  goToStep: (step: GenerationStep) => void
  resetFromStep: (step: GenerationStep) => void

  generateRandomCharacter: () => CharacterData
  generateBatch: () => CharacterData[]
}

function createFreshCharacter(): CharacterData {
  return createCharacter('Unnamed')
}

export const useGeneratorStore = create<GeneratorState>((set, get) => ({
  mode: 'player',
  character: null,
  currentStep: 0,
  completedSteps: [],
  activeCareerId: null,
  lastTermResult: null,
  reenlistmentResult: null,
  careerEnded: false,
  batchCount: 1,
  batchProgress: 0,
  generatedCharacters: [],

  setMode: (mode) => set({ mode }),
  setBatchCount: (batchCount) => set({ batchCount: Math.max(1, Math.min(50, batchCount)) }),

  startGeneration: () => {
    const char = createFreshCharacter()
    set({
      character: char,
      currentStep: 0,
      completedSteps: [],
      activeCareerId: null,
      lastTermResult: null,
      reenlistmentResult: null,
      careerEnded: false,
      batchProgress: 0,
      generatedCharacters: [],
    })
  },

  resetCharacter: () => {
    set({
      character: null,
      currentStep: 0,
      completedSteps: [],
      activeCareerId: null,
      lastTermResult: null,
      reenlistmentResult: null,
      careerEnded: false,
    })
  },

  setSpecies: (speciesId) => {
    const { character } = get()
    if (!character) return
    character.species_id = speciesId
    set({ character: { ...character } })
  },

  rollCharacteristics: () => {
    const { character } = get()
    if (!character) return
    character.abilities = rollAbilities()
    const species = loadSpecies(character.species_id)
    applySpeciesModifiers(character, species)
    character.supernatural = rollExploding() - 17
    awardHeroCoins(character)
    calculateDerived(character)
    character.derived['movement'] = species.base_speed
    set({ character: { ...character } })
  },

  rerollAbility: (ability) => {
    const { character } = get()
    if (!character) return
    const val = Math.floor(Math.random() * 6) + Math.floor(Math.random() * 6) + 2
    character.abilities[ability] = val
    // Re-apply species mods if it's a core stat
    const species = loadSpecies(character.species_id)
    if (species.ability_modifiers[ability]) {
      character.abilities[ability] += species.ability_modifiers[ability]
    }
    calculateDerived(character)
    character.derived['movement'] = species.base_speed
    set({ character: { ...character } })
  },

  applyBackground: (backgroundId, skillId) => {
    const { character } = get()
    if (!character) return
    const bg = getBackgrounds().find(b => b.background_id === backgroundId)
    if (!bg) return
    character.background_id = backgroundId
    character.background_skill = skillId
    character.skills[skillId] = (character.skills[skillId] || 0) + 1

    // Apply species background skill bonus
    const species = loadSpecies(character.species_id)
    const bonusSkills = species.background_skill_bonus || 0
    for (let i = 0; i < bonusSkills; i++) {
      const extra = bg.skill_options[Math.floor(random() * bg.skill_options.length)]
      character.skills[extra] = (character.skills[extra] || 0) + 1
    }

    // Starting funds
    const startingCash = Math.floor(500 * bg.starting_funds_modifier)
    character.assets.push({ type: 'cash', amount: startingCash })

    set({ character: { ...character } })
  },

  startCareerTerm: (careerId) => {
    set({ activeCareerId: careerId, lastTermResult: null, reenlistmentResult: null })
  },

  resolveCareerTerm: () => {
    const { character, activeCareerId } = get()
    if (!character || !activeCareerId) return
    const result = resolveTerm(character, activeCareerId)
    const career = getAllCareers().find(c => c.career_id === activeCareerId)
    const reenlist = career ? resolveReenlistment(career) : { canContinue: false, mandatory: false }
    set({
      character: { ...character },
      lastTermResult: result,
      reenlistmentResult: reenlist,
    })
  },

  chooseReenlist: () => {
    set({ lastTermResult: null, reenlistmentResult: null })
  },

  chooseChangeCareer: (careerId) => {
    set({ activeCareerId: careerId, lastTermResult: null, reenlistmentResult: null })
  },

  chooseMusterOut: () => {
    set({ careerEnded: true, activeCareerId: null, lastTermResult: null, reenlistmentResult: null })
  },

  resolveMustering: () => {
    const { character } = get()
    if (!character) return
    musterOut(character)
    calculateDerived(character)
    set({ character: { ...character } })
  },

  setName: (name) => {
    const { character } = get()
    if (!character) return
    character.name = name
    set({ character: { ...character } })
  },

  completeStep: (step) => {
    const { completedSteps } = get()
    if (!completedSteps.includes(step)) {
      set({ completedSteps: [...completedSteps, step], currentStep: (step + 1) as GenerationStep })
    }
  },

  goToStep: (step) => {
    set({ currentStep: step })
  },

  resetFromStep: (step) => {
    const { completedSteps, character } = get()
    const newCompleted = completedSteps.filter(s => s < step)
    // Clear downstream character data
    if (character) {
      if (step <= 1) {
        character.abilities = {}
        character.supernatural = -15
        character.hero_coins = 0
        character.derived = {}
      }
      if (step <= 2) {
        character.background_id = ''
        character.background_skill = ''
        character.skills = {}
        character.assets = []
      }
      if (step <= 3) {
        character.careers = []
        character.total_terms = 0
        character.age = 18
        character.equipment = []
      }
      if (step <= 4) {
        // Mustering out data is in assets/equipment, already cleared above
      }
    }
    set({
      completedSteps: newCompleted,
      currentStep: step,
      careerEnded: step <= 3 ? false : get().careerEnded,
      activeCareerId: step <= 3 ? null : get().activeCareerId,
      lastTermResult: null,
      reenlistmentResult: null,
    })
  },

  generateRandomCharacter: () => {
    const char = generateBaseCharacter('Random Character')
    // Random career terms (1-3 terms in one career)
    const careers = getAllCareers()
    const career = careers[Math.floor(random() * careers.length)]
    const numTerms = Math.floor(random() * 3) + 1
    for (let i = 0; i < numTerms; i++) {
      resolveTerm(char, career.career_id)
    }
    musterOut(char)
    calculateDerived(char)
    // Generate a simple name
    char.name = `Generated ${Math.floor(random() * 10000)}`
    return char
  },

  generateBatch: () => {
    const { batchCount } = get()
    const chars: CharacterData[] = []
    for (let i = 0; i < batchCount; i++) {
      set({ batchProgress: i + 1 })
      chars.push(get().generateRandomCharacter())
    }
    set({ generatedCharacters: chars, batchProgress: 0 })
    return chars
  },
}))
