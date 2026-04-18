import { useState } from 'react'
import { useGeneratorStore } from '../../store/useGeneratorStore'
import { characteristicModifier } from '../../engine/dice'

const ABILITIES = [
  { key: 'str', name: 'Strength', desc: 'Physical power and melee damage' },
  { key: 'dex', name: 'Dexterity', desc: 'Agility, reflexes, and ranged attacks' },
  { key: 'end', name: 'Endurance', desc: 'Health, stamina, and resistance' },
  { key: 'int', name: 'Intelligence', desc: 'Reasoning, learning, and skill maximum' },
  { key: 'edu', name: 'Education', desc: 'Formal training and languages' },
  { key: 'soc', name: 'Social Standing', desc: 'Birth rank and influence' },
]

export default function CharacteristicsStep() {
  const { character, rollCharacteristics, rerollAbility, completeStep } = useGeneratorStore()
  const [hasRolled, setHasRolled] = useState(false)
  const [rerollUsed, setRerollUsed] = useState(false)

  const handleRoll = () => {
    rollCharacteristics()
    setHasRolled(true)
  }

  const handleReroll = (ability: string) => {
    if (rerollUsed) return
    rerollAbility(ability)
    setRerollUsed(true)
  }

  const handleConfirm = () => {
    completeStep(1)
  }

  if (!character) return null

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Roll 2d6 for each ability. You may re-roll <strong>one</strong> ability of your choice.
      </p>

      {!hasRolled ? (
        <button
          onClick={handleRoll}
          className="w-full bg-space-accent hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg transition"
        >
          🎲 Roll All Abilities
        </button>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-2">
            {ABILITIES.map((ab) => {
              const val = character.abilities[ab.key] || 0
              const mod = characteristicModifier(val)
              return (
                <div key={ab.key} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 text-center">
                  <div className="text-xs text-gray-500 dark:text-gray-400 uppercase">{ab.name}</div>
                  <div className="text-2xl font-bold">{val || '—'}</div>
                  <div className={`text-xs font-mono ${mod >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {mod >= 0 ? '+' : ''}{mod}
                  </div>
                  {!rerollUsed && val > 0 && (
                    <button
                      onClick={() => handleReroll(ab.key)}
                      className="text-xs text-space-accent hover:underline mt-1"
                    >
                      Re-roll
                    </button>
                  )}
                </div>
              )
            })}
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
            <div className="text-xs text-gray-500">Supernatural</div>
            <div className="text-lg font-bold">{character.supernatural}</div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
            <div className="text-xs text-gray-500">Hero Coins</div>
            <div className="text-lg font-bold">{character.hero_coins}</div>
            <div className="text-xs text-gray-400">Spend to re-roll failed checks</div>
          </div>

          <button
            onClick={handleConfirm}
            className="w-full bg-space-accent hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Confirm Characteristics
          </button>
        </>
      )}
    </div>
  )
}
