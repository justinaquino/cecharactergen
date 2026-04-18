import { useState } from 'react'
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx'
import { saveAs } from 'file-saver'
import type { CharacterData } from '../../engine/types'
import { characteristicModifier } from '../../engine/dice'
import { loadSpecies, getBackgrounds } from '../../engine/dataLoader'

interface ExportPanelProps {
  character: CharacterData
}

export default function ExportPanel({ character }: ExportPanelProps) {
  const [open, setOpen] = useState(false)

  const filename = character.name.replace(/\s+/g, '_').toLowerCase() || 'character'

  const exportJSON = () => {
    const data = {
      format: 'ce-char-1',
      created: new Date().toISOString().slice(0, 10).replace(/-/g, ''),
      character,
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    saveAs(blob, `${filename}.json`)
  }

  const exportCSV = () => {
    const species = loadSpecies(character.species_id)
    const bg = getBackgrounds().find(b => b.background_id === character.background_id)

    const rows = [
      ['Field', 'Value'],
      ['Name', character.name],
      ['Species', species.name],
      ['Age', String(character.age)],
      ['Background', bg?.name || ''],
      ['STR', String(character.abilities['str'] || 0)],
      ['DEX', String(character.abilities['dex'] || 0)],
      ['END', String(character.abilities['end'] || 0)],
      ['INT', String(character.abilities['int'] || 0)],
      ['EDU', String(character.abilities['edu'] || 0)],
      ['SOC', String(character.abilities['soc'] || 0)],
      ['Supernatural', String(character.supernatural)],
      ['HP', String(character.derived['hit_points'] || 0)],
      ['Stamina', String(character.derived['stamina_points'] || 0)],
      ['AC', String(character.derived['armor_class'] || 0)],
      ['Initiative', String(character.derived['initiative_modifier'] || 0)],
      ['Skill Max', String(character.derived['skill_maximum'] || 0)],
      ['Languages', String(character.derived['languages'] || 0)],
      ['Hero Coins', String(character.hero_coins)],
      ['Total Terms', String(character.total_terms)],
      ['Skills', Object.entries(character.skills).map(([k, v]) => `${k} ${v}`).join(', ')],
      ['Careers', character.careers.map(c => `${c.career_id} term ${c.term}`).join('; ')],
      ['Assets', character.assets.map(a => a.type === 'cash' ? `${a.amount}cr` : a.type).join(', ')],
    ]

    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    saveAs(blob, `${filename}.csv`)
  }

  const exportTXT = () => {
    const species = loadSpecies(character.species_id)
    const bg = getBackgrounds().find(b => b.background_id === character.background_id)

    const lines: string[] = []
    lines.push(`╔══════════════════════════════════════════════════════════════╗`)
    lines.push(`║           CE CHARACTERGEN — CHARACTER SHEET                  ║`)
    lines.push(`╠══════════════════════════════════════════════════════════════╝`)
    lines.push(``)
    lines.push(`NAME:        ${character.name}`)
    lines.push(`SPECIES:     ${species.name}`)
    lines.push(`AGE:         ${character.age}`)
    lines.push(`BACKGROUND:  ${bg?.name || '—'}`)
    lines.push(``)
    lines.push(`CHARACTERISTICS`)
    lines.push(`─────────────────────────────────`)
    const stats = ['str', 'dex', 'end', 'int', 'edu', 'soc']
    stats.forEach(s => {
      const val = character.abilities[s] || 0
      const mod = characteristicModifier(val)
      lines.push(`  ${s.toUpperCase().padEnd(4)} ${String(val).padStart(2)}  (${mod >= 0 ? '+' : ''}${mod})`)
    })
    lines.push(`  SUP  ${character.supernatural}`)
    lines.push(``)
    lines.push(`DERIVED`)
    lines.push(`─────────────────────────────────`)
    lines.push(`  HP:        ${character.derived['hit_points']}`)
    lines.push(`  Stamina:   ${character.derived['stamina_points']}`)
    lines.push(`  AC:        ${character.derived['armor_class']}`)
    lines.push(`  Initiative: ${character.derived['initiative_modifier'] >= 0 ? '+' : ''}${character.derived['initiative_modifier']}`)
    lines.push(`  Skill Max: ${character.derived['skill_maximum']}`)
    lines.push(`  Languages: ${character.derived['languages']}`)
    lines.push(``)
    lines.push(`SKILLS`)
    lines.push(`─────────────────────────────────`)
    Object.entries(character.skills).forEach(([k, v]) => {
      lines.push(`  ${k.padEnd(20)} ${v}`)
    })
    lines.push(``)
    lines.push(`CAREER HISTORY (${character.total_terms} terms)`)
    lines.push(`─────────────────────────────────`)
    character.careers.forEach(term => {
      lines.push(`  ${term.career_id.toUpperCase()} Term ${term.term} — ${term.survived ? 'Survived' : 'FAILED'}${term.rank > 0 ? `, Rank ${term.rank}` : ''}`)
    })
    lines.push(``)
    lines.push(`ASSETS`)
    lines.push(`─────────────────────────────────`)
    character.assets.forEach(a => {
      lines.push(`  ${a.type === 'cash' ? `${a.amount?.toLocaleString()} cr` : a.type}${a.description ? ` — ${a.description}` : ''}`)
    })
    character.equipment.forEach(e => {
      lines.push(`  ${e.id} (${e.condition})`)
    })
    lines.push(``)
    lines.push(`Generated by CE CharacterGen — https://game-in-the-brain.github.io/cecharactergen/`)

    const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
    saveAs(blob, `${filename}.txt`)
  }

  const exportDOCX = async () => {
    const species = loadSpecies(character.species_id)
    const bg = getBackgrounds().find(b => b.background_id === character.background_id)

    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            text: character.name,
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({
            text: `${species.name} · Age ${character.age} · ${bg?.name || 'No background'}`,
            alignment: AlignmentType.CENTER,
          }),
          new Paragraph({ text: '' }),
          new Paragraph({ text: 'Characteristics', heading: HeadingLevel.HEADING_2 }),
          ...['str', 'dex', 'end', 'int', 'edu', 'soc'].map(s => {
            const val = character.abilities[s] || 0
            const mod = characteristicModifier(val)
            return new Paragraph({
              children: [
                new TextRun({ text: `${s.toUpperCase()}: `, bold: true }),
                new TextRun({ text: `${val} (${mod >= 0 ? '+' : ''}${mod})` }),
              ],
            })
          }),
          new Paragraph({
            children: [
              new TextRun({ text: 'Supernatural: ', bold: true }),
              new TextRun({ text: String(character.supernatural) }),
            ],
          }),
          new Paragraph({ text: '' }),
          new Paragraph({ text: 'Derived Statistics', heading: HeadingLevel.HEADING_2 }),
          new Paragraph({ children: [new TextRun({ text: 'HP: ', bold: true }), new TextRun({ text: String(character.derived['hit_points']) })] }),
          new Paragraph({ children: [new TextRun({ text: 'Stamina: ', bold: true }), new TextRun({ text: String(character.derived['stamina_points']) })] }),
          new Paragraph({ children: [new TextRun({ text: 'AC: ', bold: true }), new TextRun({ text: String(character.derived['armor_class']) })] }),
          new Paragraph({ children: [new TextRun({ text: 'Initiative: ', bold: true }), new TextRun({ text: String(character.derived['initiative_modifier']) })] }),
          new Paragraph({ children: [new TextRun({ text: 'Skill Max: ', bold: true }), new TextRun({ text: String(character.derived['skill_maximum']) })] }),
          new Paragraph({ children: [new TextRun({ text: 'Languages: ', bold: true }), new TextRun({ text: String(character.derived['languages']) })] }),
          new Paragraph({ text: '' }),
          new Paragraph({ text: 'Skills', heading: HeadingLevel.HEADING_2 }),
          ...Object.entries(character.skills).map(([k, v]) =>
            new Paragraph({ text: `${k}: ${v}` })
          ),
          new Paragraph({ text: '' }),
          new Paragraph({ text: 'Career History', heading: HeadingLevel.HEADING_2 }),
          ...character.careers.map(term =>
            new Paragraph({
              text: `${term.career_id} Term ${term.term} — ${term.survived ? 'Survived' : 'Failed'}${term.rank > 0 ? `, Rank ${term.rank}` : ''}`,
            })
          ),
          new Paragraph({ text: '' }),
          new Paragraph({ text: 'Assets', heading: HeadingLevel.HEADING_2 }),
          ...character.assets.map(a =>
            new Paragraph({ text: a.type === 'cash' ? `${a.amount?.toLocaleString()} cr` : a.type })
          ),
          ...character.equipment.map(e =>
            new Paragraph({ text: `${e.id} (${e.condition})` })
          ),
        ],
      }],
    })

    const blob = await Packer.toBlob(doc)
    saveAs(blob, `${filename}.docx`)
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-3 flex items-center justify-between text-left font-semibold text-sm"
      >
        <span>📤 Export Character</span>
        <span>{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="px-4 pb-4 grid grid-cols-2 gap-2">
          <button onClick={exportJSON} className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-3 rounded-lg transition">
            JSON
          </button>
          <button onClick={exportCSV} className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-2 px-3 rounded-lg transition">
            CSV
          </button>
          <button onClick={exportTXT} className="bg-gray-600 hover:bg-gray-700 text-white text-sm font-semibold py-2 px-3 rounded-lg transition">
            TXT
          </button>
          <button onClick={exportDOCX} className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold py-2 px-3 rounded-lg transition">
            DOCX
          </button>
        </div>
      )}
    </div>
  )
}
