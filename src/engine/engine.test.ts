import { describe, it, expect } from 'vitest'
import { setSeed } from './dice'
import { generateBaseCharacter } from './character'
import { resolveTerm, musterOut } from './careers'

describe('Character Generator Engine', () => {
  it('generates a base character', () => {
    const char = generateBaseCharacter('Test')
    expect(char.name).toBe('Test')
    expect(char.abilities['str']).toBeGreaterThanOrEqual(2)
    expect(char.abilities['str']).toBeLessThanOrEqual(12)
    expect(char.age).toBe(18)
    expect(char.total_terms).toBe(0)
  })

  it('resolves a warrior career term', () => {
    setSeed(123)
    const char = generateBaseCharacter('Warrior Test')
    const term = resolveTerm(char, 'warrior')
    expect(term.career_id).toBe('warrior')
    expect(term.term).toBe(1)
    expect(char.age).toBe(22)
    expect(char.total_terms).toBe(1)
  })

  it('musters out after terms', () => {
    const char = generateBaseCharacter('Muster Test')
    resolveTerm(char, 'warrior')
    resolveTerm(char, 'warrior')
    const benefits = musterOut(char)
    expect(benefits.cashTotal).toBeGreaterThanOrEqual(0)
    expect(char.assets.length).toBeGreaterThan(0)
  })

  it('produces deterministic output with same seed', () => {
    setSeed(42)
    const char1 = generateBaseCharacter('Seed Test')
    resolveTerm(char1, 'warrior')

    setSeed(42)
    const char2 = generateBaseCharacter('Seed Test')
    resolveTerm(char2, 'warrior')

    expect(char1.abilities).toEqual(char2.abilities)
    expect(char1.skills).toEqual(char2.skills)
  })
})
