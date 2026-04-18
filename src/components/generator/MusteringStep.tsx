import { useGeneratorStore } from '../../store/useGeneratorStore'

export default function MusteringStep() {
  const { character, resolveMustering, completeStep } = useGeneratorStore()

  if (!character) return null

  const handleResolve = () => {
    resolveMustering()
  }

  const handleConfirm = () => {
    completeStep(4)
  }

  const cashAssets = character.assets.filter(a => a.type === 'cash')
  const totalCash = cashAssets.reduce((sum, a) => sum + (a.amount || 0), 0)

  const equipmentItems = character.equipment
  const otherAssets = character.assets.filter(a => a.type !== 'cash')

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600 dark:text-gray-400">
        Resolve mustering out benefits from your career service.
      </p>

      {totalCash === 0 && equipmentItems.length === 0 && otherAssets.length === 0 && (
        <button
          onClick={handleResolve}
          className="w-full bg-space-accent hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          🎲 Roll Benefits
        </button>
      )}

      {(totalCash > 0 || equipmentItems.length > 0 || otherAssets.length > 0) && (
        <>
          <div className="space-y-2">
            {totalCash > 0 && (
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                <div className="text-xs text-gray-500">Cash</div>
                <div className="text-lg font-bold text-green-700 dark:text-green-400">{totalCash.toLocaleString()} cr</div>
              </div>
            )}

            {equipmentItems.length > 0 && (
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                <div className="text-xs text-gray-500">Equipment</div>
                <div className="text-sm">
                  {equipmentItems.map((item, i) => (
                    <div key={i} className="capitalize">{item.id} ({item.condition})</div>
                  ))}
                </div>
              </div>
            )}

            {otherAssets.length > 0 && (
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3">
                <div className="text-xs text-gray-500">Other Benefits</div>
                <div className="text-sm">
                  {otherAssets.map((asset, i) => (
                    <div key={i}>{asset.type}{asset.description ? `: ${asset.description}` : ''}</div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleConfirm}
            className="w-full bg-space-accent hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            Confirm Benefits
          </button>
        </>
      )}
    </div>
  )
}
