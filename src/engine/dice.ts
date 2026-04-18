/** Dice engine for Cepheus Engine / Mneme variant. */

import { randInt, setSeed as setRngSeed } from './rng'

export function rollD6(): number {
  return randInt(1, 6)
}

export function roll2d6(): number {
  return rollD6() + rollD6()
}

export function rollExploding(): number {
  let total = 0
  for (let i = 0; i < 2; i++) {
    let die = rollD6()
    total += die
    while (die === 6) {
      die = rollD6()
      total += die
    }
  }
  return total
}

export function rollAdvantage(level: number = 1): number {
  const dice: number[] = []
  for (let i = 0; i < 2 + level; i++) {
    dice.push(rollD6())
  }
  dice.sort((a, b) => b - a)
  return dice[0] + dice[1]
}

export function rollDisadvantage(level: number = 1): number {
  const dice: number[] = []
  for (let i = 0; i < 2 + level; i++) {
    dice.push(rollD6())
  }
  dice.sort((a, b) => a - b)
  return dice[0] + dice[1]
}

export function characteristicModifier(score: number): number {
  return Math.floor(score / 3) - 2
}

export function rollAbility(): number {
  return roll2d6()
}

export function rollAbilities(): Record<string, number> {
  return {
    str: rollAbility(),
    dex: rollAbility(),
    end: rollAbility(),
    int: rollAbility(),
    edu: rollAbility(),
    soc: rollExploding(),
  }
}

export function rollSupernatural(): number {
  let total = 0
  for (let i = 0; i < 2; i++) {
    let die = rollD6()
    total += die
    while (die === 6) {
      die = rollD6()
      total += die
    }
  }
  return total - 17
}

export interface RollResult {
  roll: number
  total: number
  success: boolean
  effect: number
}

export function rollVsTarget(target: number, dm: number = 0): RollResult {
  const roll = roll2d6()
  const total = roll + dm
  const success = total >= target
  const effect = total - target
  return { roll, total, success, effect }
}

export function setSeed(seed: number): void {
  setRngSeed(seed)
}
