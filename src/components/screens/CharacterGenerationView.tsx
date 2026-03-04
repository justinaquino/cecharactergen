import { useState, useEffect } from 'react'
import Header from '../shared/Header'
import nameGenerator from '../../utils/nameGenerator'
import type { NameData } from '../../utils/nameGenerator'

// Character Tile Component
interface CharacterTileProps {
  title: string
  isActive: boolean
  isFocused: boolean
  onToggle: () => void
  onFocus: () => void
  children: React.ReactNode
}

function CharacterTile({ title, isActive, isFocused, onToggle, onFocus, children }: CharacterTileProps) {
  return (
    <div 
      className={`tile transition-all duration-300 ${
        isFocused ? 'fixed inset-4 z-50 overflow-auto' : ''
      } ${isActive && !isFocused ? 'ring-2 ring-accent-cyan' : ''}`}
    >
      <div 
        className="tile-header p-3 flex items-center justify-between cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center gap-2">
          <span className={`transform transition-transform ${isActive ? 'rotate-90' : ''}`}>
            ▶
          </span>
          <span className="font-semibold text-accent-cyan">{title}</span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onFocus()
          }}
          className="text-xs px-2 py-1 bg-space-700 rounded hover:bg-accent-cyan hover:text-space-900 transition-colors"
        >
          {isFocused ? 'Exit Focus' : 'Focus'}
        </button>
      </div>
      
      {(isActive || isFocused) && (
        <div className="p-4">
          {children}
        </div>
      )}
    </div>
  )
}

// Characteristics Tile Content
function CharacteristicsContent() {
  const characteristics = [
    { name: 'STR', value: 7, mod: -1 },
    { name: 'DEX', value: 8, mod: 0 },
    { name: 'END', value: 9, mod: 1 },
    { name: 'INT', value: 10, mod: 1 },
    { name: 'EDU', value: 7, mod: -1 },
    { name: 'SOC', value: 8, mod: 0 },
  ]
  
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {characteristics.map((stat) => (
        <div key={stat.name} className="bg-space-800 p-3 rounded border border-space-600">
          <div className="text-xs text-space-400 mb-1">{stat.name}</div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white">{stat.value}</span>
            <span className={`text-sm font-mono ${stat.mod >= 0 ? 'text-accent-green' : 'text-accent-red'}`}>
              {stat.mod >= 0 ? `+${stat.mod}` : stat.mod}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

function CharacterGenerationView() {
  const [layoutMode, setLayoutMode] = useState<'desktop' | 'phone'>('desktop')
  const [activeTiles, setActiveTiles] = useState<Set<string>>(new Set(['header']))
  const [focusedTile, setFocusedTile] = useState<string | null>(null)
  const [gender, setGender] = useState<'male' | 'female'>('male')
  const [characterName, setCharacterName] = useState<NameData | null>(null)
  
  // Generate a new random name
  const generateNewName = () => {
    const newName = nameGenerator.generateName(gender)
    setCharacterName(newName)
  }
  
  // Generate initial name on component mount
  useEffect(() => {
    generateNewName()
  }, [])
  
  const toggleLayout = () => {
    setLayoutMode(prev => prev === 'desktop' ? 'phone' : 'desktop')
  }
  
  const toggleTile = (tileId: string) => {
    setActiveTiles(prev => {
      const newSet = new Set(prev)
      if (newSet.has(tileId)) {
        newSet.delete(tileId)
      } else {
        newSet.add(tileId)
      }
      return newSet
    })
  }
  
  const focusTile = (tileId: string) => {
    if (focusedTile === tileId) {
      setFocusedTile(null)
    } else {
      setFocusedTile(tileId)
    }
  }
  
  // Handle ESC key to exit focus mode
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && focusedTile) {
      setFocusedTile(null)
    }
  }
  
  return (
    <div 
      className="min-h-screen flex flex-col"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      <Header 
        layoutMode={layoutMode} 
        onLayoutToggle={toggleLayout}
      />
      
      <main className="flex-1 p-4 overflow-auto">
        {layoutMode === 'desktop' ? (
          // Desktop Layout: Three columns
          <div className="flex gap-4 h-full">
            {/* Parameters Panel */}
            <div className="w-1/5 min-w-[200px]">
              <div className="tile p-4 sticky top-0">
                <h3 className="text-accent-cyan font-semibold mb-4">Parameters</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-space-300 block mb-1">Gender</label>
                    <select 
                      className="w-full"
                      value={gender}
                      onChange={(e) => setGender(e.target.value as 'male' | 'female')}
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-space-300 block mb-1">Species</label>
                    <select className="w-full">
                      <option>Human</option>
                      <option>Vargr</option>
                      <option>Aslan</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-space-300 block mb-1">Career</label>
                    <select className="w-full">
                      <option>Any</option>
                      <option>Navy</option>
                      <option>Marines</option>
                      <option>Army</option>
                      <option>Scouts</option>
                      <option>Merchants</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-space-300 block mb-1">Max Terms</label>
                    <input type="number" defaultValue={7} min={1} max={12} className="w-full" />
                  </div>
                  <button 
                    className="btn-primary w-full mt-4"
                    onClick={generateNewName}
                  >
                    Generate Name
                  </button>
                  <button className="btn-primary w-full">
                    Generate Character
                  </button>
                </div>
              </div>
            </div>
            
            {/* Character Sheet Tiles */}
            <div className="flex-1 grid grid-cols-2 gap-4 content-start">
              <CharacterTile
                title="Header"
                isActive={activeTiles.has('header')}
                isFocused={focusedTile === 'header'}
                onToggle={() => toggleTile('header')}
                onFocus={() => focusTile('header')}
              >
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-space-400">Name</label>
                    <input 
                      type="text" 
                      value={characterName?.full_name || ''} 
                      className="w-full mt-1 font-semibold"
                      readOnly 
                    />
                  </div>
                  {characterName && (
                    <div className="text-xs text-space-400 bg-space-800 p-2 rounded">
                      <div className="mb-1">
                        <span className="text-accent-cyan">Parents:</span> {characterName.parent1_culture} + {characterName.parent2_culture}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-accent-cyan">First:</span> {characterName.first_name_culture}
                        </div>
                        <div>
                          <span className="text-accent-cyan">Surname:</span> {characterName.surname_culture}
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-sm text-space-400">Species</label>
                      <input type="text" defaultValue="Human" className="w-full mt-1" readOnly />
                    </div>
                    <div>
                      <label className="text-sm text-space-400">Career</label>
                      <input type="text" defaultValue="Drifter (2 terms)" className="w-full mt-1" readOnly />
                    </div>
                  </div>
                </div>
              </CharacterTile>
              
              <CharacterTile
                title="Characteristics"
                isActive={activeTiles.has('characteristics')}
                isFocused={focusedTile === 'characteristics'}
                onToggle={() => toggleTile('characteristics')}
                onFocus={() => focusTile('characteristics')}
              >
                <CharacteristicsContent />
              </CharacterTile>
              
              <CharacterTile
                title="Skills"
                isActive={activeTiles.has('skills')}
                isFocused={focusedTile === 'skills'}
                onToggle={() => toggleTile('skills')}
                onFocus={() => focusTile('skills')}
              >
                <div className="text-space-400 text-sm">
                  Skills will appear here after generation
                </div>
              </CharacterTile>
              
              <CharacterTile
                title="Career History"
                isActive={activeTiles.has('career')}
                isFocused={focusedTile === 'career'}
                onToggle={() => toggleTile('career')}
                onFocus={() => focusTile('career')}
              >
                <div className="text-space-400 text-sm">
                  Career timeline will appear here after generation
                </div>
              </CharacterTile>
              
              <CharacterTile
                title="Equipment"
                isActive={activeTiles.has('equipment')}
                isFocused={focusedTile === 'equipment'}
                onToggle={() => toggleTile('equipment')}
                onFocus={() => focusTile('equipment')}
              >
                <div className="text-space-400 text-sm">
                  Equipment list will appear here after generation
                </div>
              </CharacterTile>
              
              <CharacterTile
                title="Connections"
                isActive={activeTiles.has('connections')}
                isFocused={focusedTile === 'connections'}
                onToggle={() => toggleTile('connections')}
                onFocus={() => focusTile('connections')}
              >
                <div className="text-space-400 text-sm">
                  Allies, enemies, and background will appear here
                </div>
              </CharacterTile>
            </div>
            
            {/* Log Panel */}
            <div className="w-1/5 min-w-[200px]">
              <div className="tile p-4 sticky top-0">
                <h3 className="text-accent-cyan font-semibold mb-4">Generation Log</h3>
                <div className="text-sm text-space-300 space-y-2">
                  <p>Character generation steps will appear here...</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Phone Layout: Vertical stack
          <div className="flex flex-col gap-4">
            {/* Parameters - Collapsible */}
            <details className="tile">
              <summary className="p-4 cursor-pointer font-semibold text-accent-cyan">
                ⚙️ Parameters
              </summary>
              <div className="p-4 space-y-4">
                <div>
                  <label className="text-sm text-space-300 block mb-1">Gender</label>
                  <select 
                    className="w-full"
                    value={gender}
                    onChange={(e) => setGender(e.target.value as 'male' | 'female')}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-space-300 block mb-1">Species</label>
                  <select className="w-full">
                    <option>Human</option>
                    <option>Vargr</option>
                    <option>Aslan</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-space-300 block mb-1">Career</label>
                  <select className="w-full">
                    <option>Any</option>
                    <option>Navy</option>
                    <option>Marines</option>
                    <option>Army</option>
                    <option>Scouts</option>
                    <option>Merchants</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-space-300 block mb-1">Max Terms</label>
                  <input type="number" defaultValue={7} min={1} max={12} className="w-full" />
                </div>
              </div>
            </details>
            
            {/* Generate Button */}
            <button 
              className="btn-primary w-full py-3"
              onClick={generateNewName}
            >
              Generate Name
            </button>
            <button className="btn-primary w-full py-4 text-lg">
              + Generate Character
            </button>
            
            {/* Character Tiles - Stacked */}
            <div className="space-y-4">
              <CharacterTile
                title="Header"
                isActive={activeTiles.has('header')}
                isFocused={focusedTile === 'header'}
                onToggle={() => toggleTile('header')}
                onFocus={() => focusTile('header')}
              >
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-space-400">Name</label>
                    <input 
                      type="text" 
                      value={characterName?.full_name || ''} 
                      className="w-full mt-1 font-semibold"
                      readOnly 
                    />
                  </div>
                  {characterName && (
                    <div className="text-xs text-space-400 bg-space-800 p-2 rounded">
                      <div className="mb-1">
                        <span className="text-accent-cyan">Parents:</span> {characterName.parent1_culture} + {characterName.parent2_culture}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-accent-cyan">First:</span> {characterName.first_name_culture}
                        </div>
                        <div>
                          <span className="text-accent-cyan">Surname:</span> {characterName.surname_culture}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CharacterTile>
              
              <CharacterTile
                title="Characteristics"
                isActive={activeTiles.has('characteristics')}
                isFocused={focusedTile === 'characteristics'}
                onToggle={() => toggleTile('characteristics')}
                onFocus={() => focusTile('characteristics')}
              >
                <CharacteristicsContent />
              </CharacterTile>
              
              <CharacterTile
                title="Skills"
                isActive={activeTiles.has('skills')}
                isFocused={focusedTile === 'skills'}
                onToggle={() => toggleTile('skills')}
                onFocus={() => focusTile('skills')}
              >
                <div className="text-space-400 text-sm">
                  Skills will appear here after generation
                </div>
              </CharacterTile>
              
              <CharacterTile
                title="Career History"
                isActive={activeTiles.has('career')}
                isFocused={focusedTile === 'career'}
                onToggle={() => toggleTile('career')}
                onFocus={() => focusTile('career')}
              >
                <div className="text-space-400 text-sm">
                  Career timeline will appear here
                </div>
              </CharacterTile>
              
              <CharacterTile
                title="Equipment"
                isActive={activeTiles.has('equipment')}
                isFocused={focusedTile === 'equipment'}
                onToggle={() => toggleTile('equipment')}
                onFocus={() => focusTile('equipment')}
              >
                <div className="text-space-400 text-sm">
                  Equipment list will appear here
                </div>
              </CharacterTile>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default CharacterGenerationView