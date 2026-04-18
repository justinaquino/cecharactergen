import { useGeneratorStore } from '../../store/useGeneratorStore'
import { getAllSpecies } from '../../engine/dataLoader'

export default function SpeciesStep() {
  const { character, setSpecies, completeStep } = useGeneratorStore()
  const speciesList = getAllSpecies()
  const selected = character?.species_id || 'human'

  const handleSelect = (id: string) => {
    setSpecies(id)
  }

  const handleConfirm = () => {
    completeStep(0)
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Choose your character's species. Each species has different ability modifiers and special traits.
      </p>
      <div className="grid grid-cols-1 gap-3">
        {speciesList.map((sp) => (
          <button
            key={sp.species_id}
            onClick={() => handleSelect(sp.species_id)}
            className={`
              p-4 rounded-lg border-2 text-left transition
              ${selected === sp.species_id
                ? 'border-space-accent bg-space-accent/5 dark:bg-space-accent/10'
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
              }
            `}
          >
            <div className="font-bold text-base">{sp.name}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{sp.description}</div>
            <div className="text-xs mt-2">
              {Object.entries(sp.ability_modifiers).map(([stat, mod]) => (
                <span key={stat} className={`inline-block mr-2 ${mod > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.toUpperCase()} {mod > 0 ? '+' : ''}{mod}
                </span>
              ))}
              <span className="inline-block mr-2 text-gray-500">Speed: {sp.base_speed}</span>
            </div>
          </button>
        ))}
      </div>
      <button
        onClick={handleConfirm}
        className="w-full bg-space-accent hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition"
      >
        Confirm Species
      </button>
    </div>
  )
}
