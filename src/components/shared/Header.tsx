import { useNavigate, useLocation } from 'react-router-dom'

interface HeaderProps {
  layoutMode: 'desktop' | 'phone'
  onLayoutToggle: () => void
  isStandalone?: boolean
}

function Header({ layoutMode, onLayoutToggle, isStandalone = false }: HeaderProps) {
  const navigate = useNavigate()
  const location = useLocation()
  
  const isActive = (path: string) => location.pathname === path
  
  return (
    <header className="app-header sticky top-0 z-50 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <span className="text-xl font-bold text-accent-cyan">CE CharacterGen</span>
        </button>
        
        {isStandalone && (
          <span className="badge-installed hidden sm:inline">
            ● Installed
          </span>
        )}
      </div>
      
      <nav className="flex items-center gap-2 sm:gap-4">
        <button
          onClick={() => navigate('/generate')}
          className={`nav-link px-3 py-2 rounded transition-all ${
            isActive('/generate') ? 'active bg-space-700' : ''
          }`}
        >
          <span className="hidden sm:inline">Generate</span>
          <span className="sm:hidden">⚡</span>
        </button>
        
        <button
          onClick={() => navigate('/library')}
          className={`nav-link px-3 py-2 rounded transition-all ${
            isActive('/library') ? 'active bg-space-700' : ''
          }`}
        >
          <span className="hidden sm:inline">Library</span>
          <span className="sm:hidden">📚</span>
        </button>
        
        <button
          onClick={() => navigate('/settings')}
          className={`nav-link px-3 py-2 rounded transition-all ${
            isActive('/settings') || location.pathname.startsWith('/settings') 
              ? 'active bg-space-700' : ''
          }`}
        >
          <span className="hidden sm:inline">Settings</span>
          <span className="sm:hidden">⚙️</span>
        </button>
        
        <div className="w-px h-6 bg-space-600 mx-2 hidden sm:block" />
        
        <button
          onClick={onLayoutToggle}
          className="p-2 rounded hover:bg-space-700 transition-colors"
          title={`Switch to ${layoutMode === 'desktop' ? 'Phone' : 'Desktop'} layout`}
        >
          {layoutMode === 'desktop' ? (
            <span>🖥️</span>
          ) : (
            <span>📱</span>
          )}
        </button>
      </nav>
    </header>
  )
}

export default Header