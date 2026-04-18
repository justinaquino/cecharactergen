import { useState } from 'react'
import { useGeneratorStore } from '../../store/useGeneratorStore'
import { getBackgrounds } from '../../engine/dataLoader'
import { getSocTier } from '../../engine/character'

export default function BackgroundStep() {
  const { character, applyBackground, completeStep } = useGeneratorStore()
  const [selectedBg, setSelectedBg] = useState('')
  const [selectedSkill, setSelectedSkill] = useState('')

  if (!character) return null

  const soc = character.abilities['soc'] || 7
  const tier = getSocTier(soc)
  const allBackgrounds = getBackgrounds()
  const defaultBg = allBackgrounds.find(b => b.soc_range.min <= soc && soc <= b.soc_range.max)
  const availableBgs = allBackgrounds.filter(b => b.soc_range.min <= soc && soc <= b.soc_range.max)

  const currentBg = allBackgrounds.find(b => b.background_id === (selectedBg || defaultBg?.background_id))

  const handleConfirm = () => {
    const bgId = selectedBg || defaultBg?.background_id || ''
    const skillId = selectedSkill || currentBg?.skill_options[0] || ''
    applyBackground(bgId, skillId)
    completeStep(2)
  }

  return (
    <div className="space-y-4">
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
        <div className="text-xs text-gray-500">Social Standing</div>
        <div className="text-lg font-bold">{soc} ({tier.replace('_', ' ')})</div>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400">
        Your SOC determines your background. Choose a background and skill.
      </p>

      <div className="space-y-2">
        <div className="text-sm font-semibold">Background</div>
        {availableBgs.map((bg) => (
          <button
            key={bg.background_id}
            onClick={() => { setSelectedBg(bg.background_id); setSelectedSkill('') }}
            className={`
              w-full p-3 rounded-lg border text-left transition
              ${(selectedBg || defaultBg?.background_id) === bg.background_id
                ? 'border-space-accent bg-space-accent/5'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
              }
            `}
          >
            <div className="font-semibold text-sm">{bg.name}</div>
            <div className="text-xs text-gray-500">SOC {bg.soc_range.min}-{bg.soc_range.max}</div>
          </button>
        ))}
      </div>

      {currentBg && (
        <div className="space-y-2">
          <div className="text-sm font-semibold">Skill</div>
          <div className="grid grid-cols-2 gap-2">
            {currentBg.skill_options.map((skill) => (
              <button
                key={skill}
                onClick={() => setSelectedSkill(skill)}
                className={`
                  p-2 rounded-lg border text-sm transition capitalize
                  ${selectedSkill === skill || (!selectedSkill && currentBg.skill_options[0] === skill)
                    ? 'border-space-accent bg-space-accent/5'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {skill}
              </button>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={handleConfirm}
        className="w-full bg-space-accent hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition"
      >
        Confirm Background
      </button>
    </div>
  )
}
