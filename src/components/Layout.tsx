import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useAppStore } from '../store/useAppStore'
import TopBar from './TopBar'
import BottomBar from './BottomBar'

const NO_CHROME_ROUTES = ['/']

export default function Layout() {
  const { resolveTheme, resolveLayout } = useAppStore()
  const location = useLocation()
  const showChrome = !NO_CHROME_ROUTES.includes(location.pathname)

  useEffect(() => {
    resolveTheme()
    resolveLayout()

    const onResize = () => resolveLayout()
    const onThemeChange = () => {
      const state = useAppStore.getState()
      if (state.theme === 'system') state.resolveTheme()
    }

    window.addEventListener('resize', onResize)
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    mql.addEventListener?.('change', onThemeChange)

    return () => {
      window.removeEventListener('resize', onResize)
      mql.removeEventListener?.('change', onThemeChange)
    }
  }, [resolveTheme, resolveLayout])

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-space-dark text-gray-900 dark:text-gray-100">
      {showChrome && <TopBar />}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto w-full">
          <Outlet />
        </div>
      </main>
      {showChrome && <BottomBar backTo="/" />}
    </div>
  )
}
