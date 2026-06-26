import { createContext, use, useState, useEffect, useRef } from 'react'

const ThemeContext = createContext(null)

const THEMES = ['dark', 'retro']
const STORAGE_KEY = 'sw_theme'

const readInitial = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (THEMES.includes(saved)) return saved
    // Sin preferencia guardada: respetar el SO (light → retro beige, dark → oscuro)
    if (window.matchMedia?.('(prefers-color-scheme: light)').matches) return 'retro'
  } catch { /* localStorage no disponible */ }
  return 'dark'
}

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(readInitial)
  const firstRun = useRef(true)

  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = theme
    try { localStorage.setItem(STORAGE_KEY, theme) } catch { /* ignore */ }

    // No animar en el primer paint (el script anti-FOUC ya pintó el tema correcto).
    if (firstRun.current) { firstRun.current = false; return }
    // Habilita la transición solo durante el cambio para evitar jank permanente.
    root.classList.add('sw-theme-transition')
    const t = setTimeout(() => root.classList.remove('sw-theme-transition'), 260)
    return () => clearTimeout(t)
  }, [theme])

  const setTheme = (next) => { if (THEMES.includes(next)) setThemeState(next) }
  const toggleTheme = () => setThemeState((t) => (t === 'dark' ? 'retro' : 'dark'))

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => use(ThemeContext)
