import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppState {
  theme: 'dark' | 'light' | 'system'
  resolvedTheme: 'dark' | 'light'
  layoutMode: 'phone' | 'desktop' | 'auto'
  resolvedLayout: 'phone' | 'desktop'
  setTheme: (theme: 'dark' | 'light' | 'system') => void
  setLayoutMode: (mode: 'phone' | 'desktop' | 'auto') => void
  resolveTheme: () => void
  resolveLayout: () => void
}

function getSystemTheme(): 'dark' | 'light' {
  if (typeof window === 'undefined') return 'dark'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

function getSystemLayout(): 'phone' | 'desktop' {
  if (typeof window === 'undefined') return 'phone'
  return window.innerWidth >= 1024 ? 'desktop' : 'phone'
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: 'system',
      resolvedTheme: getSystemTheme(),
      layoutMode: 'auto',
      resolvedLayout: getSystemLayout(),

      setTheme: (theme) => {
        set({ theme })
        get().resolveTheme()
      },

      setLayoutMode: (layoutMode) => {
        set({ layoutMode })
        get().resolveLayout()
      },

      resolveTheme: () => {
        const { theme } = get()
        const resolved = theme === 'system' ? getSystemTheme() : theme
        set({ resolvedTheme: resolved })
        if (typeof document !== 'undefined') {
          document.documentElement.classList.remove('dark', 'light')
          document.documentElement.classList.add(resolved)
        }
      },

      resolveLayout: () => {
        const { layoutMode } = get()
        const resolved = layoutMode === 'auto' ? getSystemLayout() : layoutMode
        set({ resolvedLayout: resolved })
      },
    }),
    {
      name: 'cecharactergen-settings',
      partialize: (state) => ({ theme: state.theme, layoutMode: state.layoutMode }),
    }
  )
)
