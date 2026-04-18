import { useState } from 'react'
import { useGeneratorStore } from '../store/useGeneratorStore'
import AccordionStep from '../components/generator/AccordionStep'
import SpeciesStep from '../components/generator/SpeciesStep'
import CharacteristicsStep from '../components/generator/CharacteristicsStep'
import BackgroundStep from '../components/generator/BackgroundStep'
import CareerStep from '../components/generator/CareerStep'
import MusteringStep from '../components/generator/MusteringStep'
import NameStep from '../components/generator/NameStep'
import CharacterSheet from '../components/generator/CharacterSheet'

const STEPS = [
  { title: 'Species', summary: (c: any) => `Species: ${c.species_id}` },
  { title: 'Characteristics', summary: (c: any) => `STR ${c.abilities.str || 0} DEX ${c.abilities.dex || 0} END ${c.abilities.end || 0}` },
  { title: 'Background', summary: (c: any) => `Background: ${c.background_id || '—'}` },
  { title: 'Career', summary: (c: any) => `${c.total_terms} term${c.total_terms !== 1 ? 's' : ''}` },
  { title: 'Mustering Out', summary: (c: any) => `${c.assets.filter((a: any) => a.type === 'cash').reduce((s: number, a: any) => s + (a.amount || 0), 0).toLocaleString()} cr` },
  { title: 'Name', summary: (c: any) => c.name },
  { title: 'Character Sheet', summary: () => 'Review & Export' },
]

export default function GeneratePage() {
  const {
    mode,
    character,
    currentStep,
    completedSteps,
    setMode,
    startGeneration,
    resetCharacter,
    goToStep,

    batchCount,
    setBatchCount,
    generateBatch,
    generatedCharacters,
  } = useGeneratorStore()

  const [showModeSelect, setShowModeSelect] = useState(true)
  const [batchRunning, setBatchRunning] = useState(false)

  const handleStartPlayer = () => {
    setMode('player')
    startGeneration()
    setShowModeSelect(false)
  }

  const handleStartRandom = () => {
    setMode('random')
    startGeneration()
    setShowModeSelect(false)
  }

  const handleRunBatch = async () => {
    setBatchRunning(true)
    await new Promise(r => setTimeout(r, 100))
    generateBatch()
    setBatchRunning(false)
  }

  const handleRestart = () => {
    resetCharacter()
    setShowModeSelect(true)
  }

  const getStepState = (stepIndex: number): 'locked' | 'active' | 'completed' => {
    if (completedSteps.includes(stepIndex as any)) return 'completed'
    if (currentStep === stepIndex) return 'active'
    return 'locked'
  }

  const handleStepClick = (stepIndex: number) => {
    const state = getStepState(stepIndex)
    if (state === 'completed') {
      // Allow review, and if they make changes, cascade reset
      goToStep(stepIndex as any)
    }
  }

  const renderStepContent = (stepIndex: number) => {
    switch (stepIndex) {
      case 0: return <SpeciesStep />
      case 1: return <CharacteristicsStep />
      case 2: return <BackgroundStep />
      case 3: return <CareerStep />
      case 4: return <MusteringStep />
      case 5: return <NameStep />
      case 6: return <CharacterSheet />
      default: return null
    }
  }

  // Mode selection screen
  if (showModeSelect) {
    return (
      <div className="p-6 max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-center">Generate Character</h1>

        <div className="space-y-4">
          <button
            onClick={handleStartPlayer}
            className="w-full p-6 rounded-xl border-2 border-space-accent bg-space-accent/5 dark:bg-space-accent/10 hover:bg-space-accent/10 transition text-left"
          >
            <div className="text-xl font-bold mb-1">🎮 Player Mode</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Step-by-step interactive generation. You make choices at each stage.
            </div>
          </button>

          <div className="relative">
            <button
              onClick={handleStartRandom}
              className="w-full p-6 rounded-xl border-2 border-gray-300 dark:border-gray-600 hover:border-space-accent transition text-left"
            >
              <div className="text-xl font-bold mb-1">🎲 Random Mode</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Fully automated generation. Optional batch creation.
              </div>
            </button>

            <div className="mt-3 flex items-center gap-2">
              <label className="text-sm text-gray-500">Batch count:</label>
              <input
                type="number"
                min={1}
                max={50}
                value={batchCount}
                onChange={(e) => setBatchCount(parseInt(e.target.value) || 1)}
                className="w-16 px-2 py-1 text-sm border rounded bg-white dark:bg-gray-800"
              />
              <button
                onClick={handleRunBatch}
                disabled={batchRunning}
                className="bg-space-accent hover:bg-red-600 disabled:opacity-50 text-white text-sm font-semibold py-1 px-3 rounded transition"
              >
                {batchRunning ? 'Generating...' : 'Generate Batch'}
              </button>
            </div>

            {generatedCharacters.length > 0 && (
              <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-sm text-green-700 dark:text-green-400">
                  ✓ Generated {generatedCharacters.length} characters
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {generatedCharacters.map((c, i) => (
                    <div key={i}>{c.name} — {c.species_id}, {c.total_terms} terms</div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // Random mode single character result
  if (mode === 'random' && character) {
    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">Random Character</h1>
          <button
            onClick={handleRestart}
            className="text-sm text-space-accent hover:underline"
          >
            Start Over
          </button>
        </div>
        <CharacterSheet />
      </div>
    )
  }

  // Player mode accordion wizard
  return (
    <div className="p-4 max-w-2xl mx-auto pb-24">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Character Generation</h1>
        <button
          onClick={handleRestart}
          className="text-xs text-gray-500 hover:text-space-accent transition"
        >
          Reset
        </button>
      </div>

      <div className="space-y-3">
        {STEPS.map((step, i) => {
          const state = getStepState(i)
          const summary = character && state === 'completed' ? step.summary(character) : undefined
          return (
            <AccordionStep
              key={i}
              stepNumber={i}
              title={step.title}
              summary={summary}
              state={state}
              onClick={() => handleStepClick(i)}
            >
              {renderStepContent(i)}
            </AccordionStep>
          )
        })}
      </div>
    </div>
  )
}
