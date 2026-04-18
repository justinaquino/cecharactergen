import { useState } from 'react'
import { useGeneratorStore } from '../../store/useGeneratorStore'
import { characteristicModifier } from '../../engine/dice'
import { loadSpecies, getBackgrounds } from '../../engine/dataLoader'
import ExportPanel from './ExportPanel'

const ABILITIES = [
  { key: 'str', name: 'Strength' },
  { key: 'dex', name: 'Dexterity' },
  { key: 'end', name: 'Endurance' },
  { key: 'int', name: 'Intelligence' },
  { key: 'edu', name: 'Education' },
  { key: 'soc', name: 'Social Standing' },
]

export default function CharacterSheet() {
  const { character, completeStep } = useGeneratorStore()
  const [editField, setEditField] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')

  if (!character) return null

  const species = loadSpecies(character.species_id)
  const bg = getBackgrounds().find(b => b.background_id === character.background_id)

  const handleInlineEdit = (field: string, value: string | number) => {
    setEditField(field)
    setEditValue(String(value))
  }

  const handleSaveEdit = () => {
    if (!editField || !character) return
    if (editField.startsWith('abilities.')) {
      const stat = editField.split('.')[1]
      character.abilities[stat] = parseInt(editValue) || 0
    } else if (editField === 'name') {
      character.name = editValue
    } else if (editField.startsWith('skills.')) {
      const skill = editField.split('.')[1]
      character.skills[skill] = parseInt(editValue) || 0
    }
    setEditField(null)
  }

  const handleComplete = () => {
    completeStep(6)
  }

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 font-semibold text-sm">
        {title}
      </div>
      <div className="p-4">{children}</div>
    </div>
  )

  const Editable = ({ field, value, label }: { field: string; value: string | number; label?: string }) => {
    const isEditing = editField === field
    return (
      <div className="flex items-center justify-between">
        {label && <span className="text-xs text-gray-500">{label}</span>}
        {isEditing ? (
          <div className="flex gap-2">
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-20 px-2 py-1 text-sm border rounded"
              autoFocus
            />
            <button onClick={handleSaveEdit} className="text-green-600 text-sm">✓</button>
            <button onClick={() => setEditField(null)} className="text-red-600 text-sm">✗</button>
          </div>
        ) : (
          <button
            onClick={() => handleInlineEdit(field, value)}
            className="font-mono text-sm hover:bg-gray-100 dark:hover:bg-gray-700 px-2 py-0.5 rounded transition"
          >
            {value}
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <ExportPanel character={character} />

      <Section title="Identity">
        <div className="space-y-1">
          <Editable field="name" value={character.name} label="Name" />
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Species</span>
            <span>{species.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Age</span>
            <span>{character.age}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Background</span>
            <span>{bg?.name || '—'}</span>
          </div>
        </div>
      </Section>

      <Section title="Characteristics">
        <div className="grid grid-cols-3 gap-2">
          {ABILITIES.map((ab) => {
            const val = character.abilities[ab.key] || 0
            const mod = characteristicModifier(val)
            return (
              <div key={ab.key} className="text-center">
                <div className="text-xs text-gray-500">{ab.name}</div>
                <Editable field={`abilities.${ab.key}`} value={val} />
                <div className={`text-xs ${mod >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {mod >= 0 ? '+' : ''}{mod}
                </div>
              </div>
            )
          })}
        </div>
        <div className="mt-2 text-sm">
          <span className="text-gray-500">Supernatural: </span>
          <span className="font-mono">{character.supernatural}</span>
        </div>
      </Section>

      <Section title="Derived">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div><span className="text-gray-500">HP:</span> {character.derived['hit_points']}</div>
          <div><span className="text-gray-500">Stamina:</span> {character.derived['stamina_points']}</div>
          <div><span className="text-gray-500">AC:</span> {character.derived['armor_class']}</div>
          <div><span className="text-gray-500">Initiative:</span> {character.derived['initiative_modifier'] >= 0 ? '+' : ''}{character.derived['initiative_modifier']}</div>
          <div><span className="text-gray-500">Skill Max:</span> {character.derived['skill_maximum']}</div>
          <div><span className="text-gray-500">Languages:</span> {character.derived['languages']}</div>
          <div><span className="text-gray-500">Movement:</span> {character.derived['movement']}</div>
        </div>
      </Section>

      <Section title="Skills">
        {Object.entries(character.skills).length === 0 ? (
          <div className="text-sm text-gray-500">No skills</div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {Object.entries(character.skills).map(([skill, level]) => (
              <div key={skill} className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm capitalize">
                <Editable field={`skills.${skill}`} value={level} label={skill} />
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section title="Career History">
        {character.careers.length === 0 ? (
          <div className="text-sm text-gray-500">No career history</div>
        ) : (
          <div className="space-y-2">
            {character.careers.map((term, i) => (
              <div key={i} className="text-sm border-l-2 border-gray-300 dark:border-gray-600 pl-2">
                <div className="font-semibold capitalize">{term.career_id} — Term {term.term}</div>
                <div className="text-gray-500 text-xs">
                  {term.survived ? 'Survived' : `Mishap: ${term.mishap}`}
                  {term.rank > 0 && ` · Rank ${term.rank}`}
                </div>
                {term.skills_gained.length > 0 && (
                  <div className="text-xs">Skills: {term.skills_gained.join(', ')}</div>
                )}
                {term.event && <div className="text-xs text-gray-400">{term.event}</div>}
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section title="Assets & Equipment">
        <div className="space-y-1 text-sm">
          {character.assets.map((asset, i) => (
            <div key={i}>
              {asset.type === 'cash' ? `${asset.amount?.toLocaleString()} cr` : `${asset.type}${asset.description ? ` — ${asset.description}` : ''}`}
            </div>
          ))}
          {character.equipment.map((item, i) => (
            <div key={`eq-${i}`} className="capitalize">{item.id} ({item.condition})</div>
          ))}
        </div>
      </Section>

      <button
        onClick={handleComplete}
        className="w-full bg-space-accent hover:bg-red-600 text-white font-semibold py-3 px-4 rounded-lg transition"
      >
        ✓ Generation Complete
      </button>
    </div>
  )
}
