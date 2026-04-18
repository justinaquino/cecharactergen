import { useState } from 'react'
import { useGeneratorStore } from '../../store/useGeneratorStore'

export default function NameStep() {
  const { character, setName, completeStep } = useGeneratorStore()
  const [localName, setLocalName] = useState(character?.name || '')

  if (!character) return null

  const handleConfirm = () => {
    setName(localName || 'Unnamed')
    completeStep(5)
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Give your character a name.
      </p>

      <input
        type="text"
        value={localName}
        onChange={(e) => setLocalName(e.target.value)}
        placeholder="Character name"
        className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:border-space-accent focus:outline-none"
      />

      <button
        onClick={handleConfirm}
        className="w-full bg-space-accent hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition"
      >
        Confirm Name
      </button>
    </div>
  )
}
