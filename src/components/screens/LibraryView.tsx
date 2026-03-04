import { useState } from 'react'
import Header from '../shared/Header'

function LibraryView() {
  const [layoutMode, setLayoutMode] = useState<'desktop' | 'phone'>('desktop')
  
  const toggleLayout = () => {
    setLayoutMode(prev => prev === 'desktop' ? 'phone' : 'desktop')
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        layoutMode={layoutMode} 
        onLayoutToggle={toggleLayout}
      />
      
      <main className="flex-1 p-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-accent-cyan mb-6">Character Library</h2>
          
          <div className="tile p-8 text-center">
            <p className="text-space-300 mb-4">
              Your saved characters will appear here
            </p>
            <p className="text-sm text-space-400">
              Generate a character first, then save it to the library
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

export default LibraryView