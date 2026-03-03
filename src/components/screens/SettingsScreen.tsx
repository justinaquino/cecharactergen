import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Header from '../shared/Header'

function SettingsScreen() {
  const { section } = useParams()
  const navigate = useNavigate()
  const [layoutMode, setLayoutMode] = useState<'desktop' | 'phone'>('desktop')
  const [activeSection, setActiveSection] = useState(section || 'layout')
  
  const toggleLayout = () => {
    setLayoutMode(prev => prev === 'desktop' ? 'phone' : 'desktop')
  }
  
  const sections = [
    { id: 'layout', label: 'Layout', icon: '📐' },
    { id: 'rules', label: 'Rules', icon: '📋' },
    { id: 'careers', label: 'Careers', icon: '🎖️' },
    { id: 'tables', label: 'Tables', icon: '📝' },
    { id: 'data', label: 'Data', icon: '💾' },
    { id: 'version', label: 'Version', icon: '🔄' },
  ]
  
  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId)
    navigate(`/settings/${sectionId}`)
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        layoutMode={layoutMode} 
        onLayoutToggle={toggleLayout}
      />
      
      <main className="flex-1 p-4">
        <div className="max-w-6xl mx-auto flex gap-4">
          {/* Sidebar */}
          <div className="w-48 flex-shrink-0">
            <div className="tile sticky top-0">
              {sections.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => handleSectionClick(sec.id)}
                  className={`w-full p-3 text-left flex items-center gap-2 transition-colors ${
                    activeSection === sec.id 
                      ? 'bg-space-700 text-accent-cyan border-l-2 border-accent-cyan' 
                      : 'hover:bg-space-800'
                  }`}
                >
                  <span>{sec.icon}</span>
                  <span>{sec.label}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Content */}
          <div className="flex-1">
            <div className="tile p-6">
              <h2 className="text-xl font-bold text-accent-cyan mb-4">
                {sections.find(s => s.id === activeSection)?.label} Settings
              </h2>
              
              {activeSection === 'layout' && (
                <div className="space-y-4">
                  <p className="text-space-300">Layout preferences will be configured here</p>
                  <div className="p-4 bg-space-800 rounded">
                    <p className="text-sm text-space-400">Current layout: {layoutMode}</p>
                  </div>
                </div>
              )}
              
              {activeSection === 'rules' && (
                <div className="space-y-4">
                  <p className="text-space-300">Rule toggles (CE vs Mneme) will be configured here</p>
                </div>
              )}
              
              {activeSection === 'careers' && (
                <div className="space-y-4">
                  <p className="text-space-300">Career enable/disable management will appear here</p>
                  <p className="text-sm text-space-400">
                    GMs can toggle which careers are available in their campaign
                  </p>
                </div>
              )}
              
              {activeSection === 'tables' && (
                <div className="space-y-4">
                  <p className="text-space-300">JSON table editor will appear here</p>
                  <p className="text-sm text-space-400">
                    Edit careers.json, skills.json, equipment.json, etc.
                  </p>
                </div>
              )}
              
              {activeSection === 'data' && (
                <div className="space-y-4">
                  <p className="text-space-300">Data management options will appear here</p>
                  <p className="text-sm text-space-400">
                    Export, import, reset to defaults
                  </p>
                </div>
              )}
              
              {activeSection === 'version' && (
                <div className="space-y-4">
                  <p className="text-space-300">Version control will appear here</p>
                  <p className="text-sm text-space-400">
                    Update prompts, rollback, release channels
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default SettingsScreen