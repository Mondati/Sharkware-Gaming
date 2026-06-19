import { createContext, use, useState, useEffect } from 'react'

const ThemeContext = createContext(null)

const THEMES = ['dark', 'retro']
const STORAGE_KEY = 'sw_theme'

const readInitial = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (THEMES.includes(saved)) return saved
  } catch { /* localStorage no disponible */ }
  return 'dark'
}

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(readInitial)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try { localStorage.setItem(STORAGE_KEY, theme) } catch { /* ignore */ }
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
