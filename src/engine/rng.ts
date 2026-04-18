/** Seedable random number generator for reproducible testing.
 *  Uses a simple LCG to match Python's random.seed() behavior approximately.
 *  In production, Math.random is used. For tests, call setSeed().
 */

let useSeeded = false
let seed = 12345
const a = 1664525
const c = 1013904223
const m = 4294967296

export function setSeed(newSeed: number): void {
  seed = newSeed >>> 0
  useSeeded = true
}

export function clearSeed(): void {
  useSeeded = false
}

export function random(): number {
  if (!useSeeded) {
    return Math.random()
  }
  seed = (a * seed + c) % m
  return seed / m
}

export function randInt(min: number, max: number): number {
  return Math.floor(random() * (max - min + 1)) + min
}
