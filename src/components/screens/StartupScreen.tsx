import { useNavigate } from 'react-router-dom'

function StartupScreen() {
  const navigate = useNavigate()
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8 bg-gradient-to-br from-space-900 via-space-800 to-space-700">
      {/* Logo Area */}
      <div className="mb-8 text-center">
        <div className="text-5xl mb-4">🎲</div>
        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
          Cepheus Engine
        </h1>
        <h2 className="text-xl sm:text-2xl text-accent-cyan">
          Character Generator
        </h2>
        <p className="text-space-300 mt-2 text-sm sm:text-base">
          Create characters instantly
        </p>
      </div>
      
      {/* Primary Action */}
      <button
        onClick={() => navigate('/generate')}
        className="btn-primary text-lg sm:text-xl px-8 py-4 rounded-lg mb-8 flex items-center gap-3 shadow-lg hover:shadow-accent-cyan/50 transition-all"
      >
        <span>+</span>
        <span>GENERATE CHARACTER</span>
      </button>
      
      {/* Secondary Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-md mb-8">
        <button
          onClick={() => navigate('/library')}
          className="tile p-4 text-left hover:border-accent-cyan transition-colors"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">📚</span>
            <span className="font-semibold text-accent-cyan">Character Library</span>
          </div>
          <p className="text-sm text-space-300">
            Browse and load saved characters
          </p>
          <p className="text-xs text-space-400 mt-1">
            0 characters saved
          </p>
        </button>
        
        <button
          onClick={() => navigate('/settings')}
          className="tile p-4 text-left hover:border-accent-cyan transition-colors"
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">⚙️</span>
            <span className="font-semibold text-accent-cyan">Settings</span>
          </div>
          <p className="text-sm text-space-300">
            Customize rules, edit careers
          </p>
          <p className="text-xs text-space-400 mt-1">
            Manage versions & data tables
          </p>
        </button>
      </div>
      
      {/* Tertiary Actions */}
      <div className="flex flex-col items-center gap-3 w-full max-w-md">
        <button
          className="w-full py-3 px-4 border border-space-600 rounded-lg text-space-300 hover:border-accent-cyan hover:text-accent-cyan transition-colors text-sm"
        >
          <span>❓ Help & About</span>
        </button>
      </div>
      
      {/* Footer Links */}
      <div className="mt-auto pt-8 pb-4 text-center">
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-space-400">
          <a 
            href="https://github.com/xunema/cecharactergen" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-accent-cyan transition-colors"
          >
            📖 Source
          </a>
          <span className="text-space-600">|</span>
          <a 
            href="https://www.drivethrurpg.com/en/publisher/17858/game-in-the-brain" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-accent-cyan transition-colors"
          >
            📚 Our Books
          </a>
          <span className="text-space-600">|</span>
          <a 
            href="https://gi7b.org/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-accent-cyan transition-colors"
          >
            🌐 Blog
          </a>
          <span className="text-space-600">|</span>
          <a 
            href="https://wiki.gi7b.org/index.php/Main_Page" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-accent-cyan transition-colors"
          >
            📖 Wiki
          </a>
        </div>
      </div>
      
      {/* Version Info */}
      <div className="pt-4 text-center text-xs text-space-500">
        <p>Version 0.1.0-dev | M1: UI Foundation</p>
        <p className="mt-1">Built with React + Vite + Tailwind</p>
      </div>
    </div>
  )
}

export default StartupScreen