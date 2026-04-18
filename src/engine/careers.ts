import type { CharacterData, CareerData, TermSummary } from './types'
import { roll2d6, rollD6, rollVsTarget, characteristicModifier } from './dice'
import { loadCareer } from './dataLoader'
import { random } from './rng'

export function getStatDm(character: CharacterData, stat: string): number {
  const val = character.abilities[stat] || 7
  return characteristicModifier(val)
}

export function resolveQualification(character: CharacterData, career: CareerData): boolean {
  const qual = career.qualification
  const stat = qual.stat || 'end'
  let dm = (qual.dm || 0) + getStatDm(character, stat)
  // Apply -2 DM per previous career
  const uniqueCareers = new Set(character.careers.map(c => c.career_id))
  dm -= 2 * uniqueCareers.size

  const target = qual.target
  const { success } = rollVsTarget(target, dm)
  return success
}

export function gainSkill(character: CharacterData, skillId: string): void {
  if (skillId in character.abilities) {
    // Personal development stat increase
    const current = character.abilities[skillId] || 7
    if (current < 15) {
      character.abilities[skillId] = current + 1
    }
    return
  }

  const skillMax = character.derived['skill_maximum'] || 14
  const current = character.skills[skillId] || 0
  if (current < skillMax) {
    character.skills[skillId] = current + 1
  }
}

export function rollSkillTable(character: CharacterData, career: CareerData): string {
  const roll = rollD6()
  const skills = career.skills

  let table: string[]
  if (roll <= 2) {
    table = skills.personal
  } else if (roll <= 4) {
    table = skills.service
  } else if (roll === 5) {
    const edu = character.abilities['edu'] || 7
    if (edu >= 8) {
      table = skills.advanced || skills.service
    } else {
      table = skills.service
    }
  } else {
    table = skills.special || skills.service
  }

  return table[Math.floor(random() * table.length)]
}

export function resolveBasicTraining(character: CharacterData, career: CareerData): void {
  for (const skillId of career.skills.service) {
    if (!character.skills[skillId] && !(skillId in character.abilities)) {
      character.skills[skillId] = 0
    }
  }
}

export function resolveSkillRolls(character: CharacterData, career: CareerData, rolls: number = 1): void {
  for (let i = 0; i < rolls; i++) {
    const skillId = rollSkillTable(character, career)
    gainSkill(character, skillId)
  }
}

export function resolveSurvival(character: CharacterData, career: CareerData, term: number): { success: boolean; effect: number } {
  const surv = career.survival
  const stat = surv.stat || 'end'
  let dm = getStatDm(character, stat)

  const dmModifier = surv.dm_modifier || ''
  if (dmModifier === 'terms_served') {
    dm -= term - 1
  }

  const target = surv.target
  const { success, effect } = rollVsTarget(target, dm)
  return { success, effect }
}

export function resolveAdvancement(character: CharacterData, career: CareerData, effect: number): { advanced: boolean; newRank: number } {
  const adv = career.advancement
  const threshold = adv.effect_threshold || 4

  const currentCareerTerms = character.careers.filter(c => c.career_id === career.career_id)
  const currentRank = currentCareerTerms.length > 0 ? currentCareerTerms[currentCareerTerms.length - 1].rank : 0

  if (effect >= threshold && currentRank < career.ranks.length - 1) {
    const newRank = currentRank + 1
    const rankData = career.ranks[newRank]
    if (rankData.skill) {
      gainSkill(character, rankData.skill)
    }
    // Even ranks increase SOC by 1
    if (newRank % 2 === 0) {
      character.abilities['soc'] = (character.abilities['soc'] || 7) + 1
    }
    return { advanced: true, newRank }
  }
  return { advanced: false, newRank: currentRank }
}

export function resolveEvent(character: CharacterData, career: CareerData, currentRank: number): { description: string; newRank: number } {
  const roll = roll2d6()
  const events = career.events

  // Handle ranges like "3-4"
  let eventKey = String(roll)
  if (!events[eventKey]) {
    for (const key of Object.keys(events)) {
      if (key.includes('-')) {
        const [low, high] = key.split('-').map(Number)
        if (low <= roll && roll <= high) {
          eventKey = key
          break
        }
      }
    }
  }

  const event = events[eventKey] || { description: 'Uneventful term', effect: 'none' }
  const effect = event.effect
  let newRank = currentRank

  if (effect === 'skill_roll') {
    resolveSkillRolls(character, career, 1)
  } else if (effect === 'advancement_dm_plus_2') {
    resolveSkillRolls(character, career, 1)
  } else if (effect === 'automatic_advancement_plus_skill') {
    if (currentRank < career.ranks.length - 1) {
      newRank = currentRank + 1
      const rankData = career.ranks[newRank]
      if (rankData.skill) {
        gainSkill(character, rankData.skill)
      }
      character.abilities['soc'] = (character.abilities['soc'] || 7) + 1
    }
    resolveSkillRolls(character, career, 1)
  } else if (effect === 'aging_roll') {
    const stats = ['str', 'dex', 'end']
    const stat = stats[Math.floor(random() * stats.length)]
    character.abilities[stat] = Math.max(1, (character.abilities[stat] || 7) - 1)
  } else if (effect === 'mishap') {
    const mishapRoll = rollD6()
    const mishaps = career.mishaps
    const mishapDesc = mishaps[String(mishapRoll)] || 'Unknown mishap'
    return { description: `${event.description}: ${mishapDesc} (career ends)`, newRank: currentRank }
  }

  return { description: event.description, newRank }
}

export function resolveMishap(character: CharacterData, career: CareerData): string {
  const roll = rollD6()
  const mishaps = career.mishaps
  const desc = mishaps[String(roll)] || 'Unknown mishap'

  if (roll === 1) {
    const stats = ['str', 'dex', 'end']
    const stat = stats[Math.floor(random() * stats.length)]
    character.abilities[stat] = Math.max(1, (character.abilities[stat] || 7) - Math.floor(random() * 3) - 1)
  } else if (roll === 3) {
    character.abilities['soc'] = Math.max(2, (character.abilities['soc'] || 7) - 1)
  }

  return desc
}

export function resolveAging(character: CharacterData, term: number): boolean {
  if (term < 5) return true

  const endDm = getStatDm(character, 'end')
  const difficulty = term + 1
  const { success, effect } = rollVsTarget(difficulty, endDm)

  if (!success) {
    const stats = ['str', 'dex', 'end']
    const stat = stats[Math.floor(random() * stats.length)]
    character.abilities[stat] = Math.max(1, (character.abilities[stat] || 7) - 1)
    if (effect <= -6) {
      const stats2 = stats.filter(s => s !== stat)
      const stat2 = stats2[Math.floor(random() * stats2.length)]
      character.abilities[stat2] = Math.max(1, (character.abilities[stat2] || 7) - 1)
    }
  }
  return true
}

export function resolveReenlistment(career: CareerData): { canContinue: boolean; mandatory: boolean } {
  const target = career.reenlistment_target || 7
  const roll = roll2d6()
  if (roll === 12) {
    return { canContinue: true, mandatory: true }
  }
  return { canContinue: roll >= target, mandatory: false }
}

export function resolveTerm(character: CharacterData, careerId: string): TermSummary {
  const career = loadCareer(careerId)
  const termNum = character.careers.filter(c => c.career_id === careerId).length + 1

  const isFirstTermInCareer = termNum === 1
  const isFirstCareer = character.careers.length === 0

  const termSummary: TermSummary = {
    career_id: careerId,
    term: termNum,
    start_age: character.age,
    survived: true,
    mishap: null,
    advanced: false,
    rank: 0,
    event: '',
    skills_gained: [],
  }

  if (isFirstTermInCareer) {
    if (!isFirstCareer) {
      const qualified = resolveQualification(character, career)
      if (!qualified) {
        termSummary.survived = false
        termSummary.mishap = 'Failed qualification'
        return termSummary
      }
    }

    resolveBasicTraining(character, career)
  }

  // Skill rolls
  let skillRolls = 1
  if (isFirstTermInCareer) {
    skillRolls = 2
  }

  // Survival
  const { success, effect } = resolveSurvival(character, career, termNum)
  if (!success) {
    const mishapDesc = resolveMishap(character, career)
    termSummary.survived = false
    termSummary.mishap = mishapDesc
    character.age += 4
    character.total_terms += 1
    return termSummary
  }

  // Advancement
  const { advanced, newRank } = resolveAdvancement(character, career, effect)
  termSummary.advanced = advanced
  termSummary.rank = newRank
  if (advanced) {
    skillRolls += 1
  }

  // Apply skill rolls
  for (let i = 0; i < skillRolls; i++) {
    const skillId = rollSkillTable(character, career)
    gainSkill(character, skillId)
    termSummary.skills_gained.push(skillId)
  }

  // Event
  const { description: eventDesc, newRank: eventRank } = resolveEvent(character, career, newRank)
  termSummary.event = eventDesc
  if (eventRank > termSummary.rank) {
    termSummary.rank = eventRank
    termSummary.advanced = true
  }

  // Aging
  const totalTerms = character.total_terms + 1
  resolveAging(character, totalTerms)

  // Update character state
  character.age += 4
  character.total_terms = totalTerms
  character.careers.push(termSummary)

  return termSummary
}

export function musterOut(character: CharacterData): { cashTotal: number; benefits: string[] } {
  const benefits: { cashRolls: number[]; cashTotal: number; benefitRolls: number[]; benefitsGained: string[] } = {
    cashRolls: [],
    cashTotal: 0,
    benefitRolls: [],
    benefitsGained: [],
  }

  const careerSummary: Record<string, { terms: number; rank: number }> = {}
  for (const term of character.careers) {
    const cid = term.career_id
    if (!careerSummary[cid]) {
      careerSummary[cid] = { terms: 0, rank: 0 }
    }
    careerSummary[cid].terms += 1
    careerSummary[cid].rank = Math.max(careerSummary[cid].rank, term.rank)
  }

  for (const [cid, summary] of Object.entries(careerSummary)) {
    const career = loadCareer(cid)
    const rank = summary.rank
    const terms = summary.terms

    // Cash rolls
    let cashDm = rank
    if (character.skills['gambling']) {
      cashDm += Math.floor(character.skills['gambling'] / 2)
    }

    const maxCashRolls = Math.min(3 - benefits.cashRolls.length, terms)
    for (let i = 0; i < maxCashRolls; i++) {
      let roll = rollD6() + cashDm
      roll = Math.max(1, Math.min(roll, career.mustering.cash.length))
      const cashAmount = career.mustering.cash[roll - 1]
      benefits.cashRolls.push(roll)
      benefits.cashTotal += cashAmount
    }

    // Benefit rolls
    const benefitDm = rank
    for (let i = 0; i < terms; i++) {
      let roll = rollD6() + benefitDm
      roll = Math.max(1, Math.min(roll, career.mustering.benefits.length))
      const benefit = career.mustering.benefits[roll - 1]
      benefits.benefitRolls.push(roll)
      benefits.benefitsGained.push(benefit)
    }
  }

  if (benefits.cashTotal > 0) {
    character.assets.push({ type: 'cash', amount: benefits.cashTotal })
  }

  const careerIds = Object.keys(careerSummary)
  for (let i = 0; i < benefits.benefitsGained.length; i++) {
    const benefit = benefits.benefitsGained[i]
    const sourceCareer = careerIds[i % careerIds.length] || 'unknown'
    if (benefit === 'weapon' || benefit === 'armor') {
      character.equipment.push({ id: benefit, condition: 'good' })
    } else {
      character.assets.push({ type: benefit, description: `Gained from ${sourceCareer}` })
    }
  }

  return { cashTotal: benefits.cashTotal, benefits: benefits.benefitsGained }
}
