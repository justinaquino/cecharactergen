import { useState } from 'react'
import { useGeneratorStore } from '../../store/useGeneratorStore'
import { getAllCareers } from '../../engine/dataLoader'
import type { TermSummary } from '../../engine/types'

export default function CareerStep() {
  const {
    character,
    activeCareerId,
    lastTermResult,
    reenlistmentResult,
    careerEnded,
    startCareerTerm,
    resolveCareerTerm,
    chooseReenlist,
    chooseChangeCareer,
    chooseMusterOut,
    completeStep,
  } = useGeneratorStore()

  const [showCareerSelect, setShowCareerSelect] = useState(false)
  const [rolling, setRolling] = useState(false)

  if (!character) return null

  const careers = getAllCareers()
  const currentCareer = careers.find(c => c.career_id === activeCareerId)

  const handleStartCareer = (careerId: string) => {
    startCareerTerm(careerId)
    setShowCareerSelect(false)
  }

  const handleRollTerm = async () => {
    setRolling(true)
    // Small delay for "rolling" feel
    await new Promise(r => setTimeout(r, 400))
    resolveCareerTerm()
    setRolling(false)
  }

  const handleMusterOut = () => {
    chooseMusterOut()
  }

  const handleComplete = () => {
    completeStep(3)
  }

  // Summary of past terms
  const careerGroups: Record<string, TermSummary[]> = {}
  for (const term of character.careers) {
    if (!careerGroups[term.career_id]) careerGroups[term.career_id] = []
    careerGroups[term.career_id].push(term)
  }

  if (careerEnded) {
    return (
      <div className="space-y-4">
        <div className="text-green-600 font-semibold">✓ Career phase complete</div>
        <div className="text-sm text-gray-500">
          Served {character.total_terms} term{character.total_terms !== 1 ? 's' : ''} across {Object.keys(careerGroups).length} career{Object.keys(careerGroups).length !== 1 ? 's' : ''}.
        </div>
        <button
          onClick={handleComplete}
          className="w-full bg-space-accent hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          Proceed to Mustering Out
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Past terms summary */}
      {character.careers.length > 0 && (
        <div className="space-y-2">
          {Object.entries(careerGroups).map(([cid, terms]) => {
            const career = careers.find(c => c.career_id === cid)
            return (
              <div key={cid} className="bg-gray-50 dark:bg-gray-900 rounded-lg p-2 text-sm">
                <div className="font-semibold">{career?.name} — {terms.length} term{terms.length !== 1 ? 's' : ''}</div>
                <div className="text-xs text-gray-500 space-y-1 mt-1">
                  {terms.map((t, i) => (
                    <div key={i} className="flex gap-2">
                      <span>Term {t.term}:</span>
                      <span>{t.survived ? '✓ Survived' : '✗ ' + t.mishap}</span>
                      {t.rank > 0 && <span>Rank {t.rank}</span>}
                      {t.skills_gained.length > 0 && <span>Skills: {t.skills_gained.join(', ')}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Active career / term resolution */}
      {!activeCareerId && !showCareerSelect && (
        <button
          onClick={() => setShowCareerSelect(true)}
          className="w-full bg-space-accent hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          {character.careers.length === 0 ? 'Choose First Career' : 'Choose Next Career'}
        </button>
      )}

      {showCareerSelect && (
        <div className="space-y-2">
          <div className="text-sm font-semibold">Select Career</div>
          {careers.map((c) => (
            <button
              key={c.career_id}
              onClick={() => handleStartCareer(c.career_id)}
              className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-space-accent text-left transition"
            >
              <div className="font-semibold text-sm">{c.name}</div>
              <div className="text-xs text-gray-500">Qualify: {c.qualification.stat.toUpperCase()} {c.qualification.target}+</div>
            </button>
          ))}
        </div>
      )}

      {currentCareer && !lastTermResult && (
        <div className="space-y-3">
          <div className="text-sm font-semibold">{currentCareer.name} — Term {character.careers.filter(c => c.career_id === activeCareerId).length + 1}</div>
          <button
            onClick={handleRollTerm}
            disabled={rolling}
            className="w-full bg-space-accent hover:bg-red-600 disabled:opacity-50 text-white font-semibold py-2 px-4 rounded-lg transition"
          >
            {rolling ? '🎲 Rolling...' : '🎲 Resolve Term'}
          </button>
        </div>
      )}

      {lastTermResult && (
        <div className="space-y-3">
          <div className={`p-3 rounded-lg ${lastTermResult.survived ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
            <div className="font-semibold text-sm">
              {lastTermResult.survived ? '✓ Term Survived' : '✗ Term Failed'}
            </div>
            {!lastTermResult.survived && (
              <div className="text-xs text-red-600">{lastTermResult.mishap}</div>
            )}
            {lastTermResult.survived && (
              <>
                <div className="text-xs mt-1">
                  Rank: {lastTermResult.rank} {lastTermResult.advanced && '(Promoted)'}
                </div>
                {lastTermResult.skills_gained.length > 0 && (
                  <div className="text-xs">Skills: {lastTermResult.skills_gained.join(', ')}</div>
                )}
                {lastTermResult.event && (
                  <div className="text-xs text-gray-500 mt-1">{lastTermResult.event}</div>
                )}
              </>
            )}
          </div>

          {lastTermResult.survived && reenlistmentResult && (
            <div className="space-y-2">
              {reenlistmentResult.mandatory && (
                <div className="text-sm text-orange-600 font-semibold">Mandatory re-enlistment!</div>
              )}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={chooseReenlist}
                  className="bg-space-accent hover:bg-red-600 text-white font-semibold py-2 px-3 rounded-lg text-sm transition"
                >
                  Re-enlist
                </button>
                <button
                  onClick={() => { chooseChangeCareer(''); setShowCareerSelect(true) }}
                  className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold py-2 px-3 rounded-lg text-sm transition"
                >
                  Change Career
                </button>
              </div>
              <button
                onClick={handleMusterOut}
                className="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                Muster Out
              </button>
            </div>
          )}

          {!lastTermResult.survived && (
            <div className="space-y-2">
              <div className="text-sm text-red-600">Career ended due to mishap.</div>
              <button
                onClick={() => { chooseChangeCareer(''); setShowCareerSelect(true) }}
                className="w-full bg-space-accent hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                Choose New Career
              </button>
              <button
                onClick={handleMusterOut}
                className="w-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold py-2 px-4 rounded-lg transition"
              >
                Muster Out
              </button>
            </div>
          )}
        </div>
      )}

      {/* Always allow muster out if they have at least 1 term */}
      {character.careers.length > 0 && !lastTermResult && !careerEnded && (
        <button
          onClick={handleMusterOut}
          className="w-full border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold py-2 px-4 rounded-lg transition"
        >
          Muster Out Now
        </button>
      )}
    </div>
  )
}
