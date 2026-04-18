import { Link } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'

export default function TopBar() {
  const { resolvedTheme, setTheme, theme, resolvedLayout, setLayoutMode, layoutMode } = useAppStore()

  const cycleTheme = () => {
    const order: Array<'dark' | 'light' | 'system'> = ['dark', 'light', 'system']
    const next = order[(order.indexOf(theme) + 1) % order.length]
    setTheme(next)
  }

  const cycleLayout = () => {
    const order: Array<'phone' | 'desktop' | 'auto'> = ['auto', 'phone', 'desktop']
    const next = order[(order.indexOf(layoutMode) + 1) % order.length]
    setLayoutMode(next)
  }

  const themeLabel = theme === 'system' ? (resolvedTheme === 'dark' ? '🌙' : '☀️') : theme === 'dark' ? '🌙' : '☀️'
  const layoutLabel = layoutMode === 'auto' ? (resolvedLayout === 'desktop' ? '🖥️' : '📱') : layoutMode === 'desktop' ? '🖥️' : '📱'

  return (
    <header className="sticky top-0 z-50 bg-white/80 dark:bg-space-dark/80 backdrop-blur border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 h-12 flex items-center justify-between">
        <Link to="/" className="font-bold text-lg text-space-accent hover:opacity-80 transition">
          CE CharacterGen
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={cycleLayout}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition text-sm"
            title={`Layout: ${layoutMode} (${resolvedLayout})`}
          >
            {layoutLabel}
          </button>
          <button
            onClick={cycleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition text-sm"
            title={`Theme: ${theme} (${resolvedTheme})`}
          >
            {themeLabel}
          </button>
        </div>
      </div>
    </header>
  )
}
