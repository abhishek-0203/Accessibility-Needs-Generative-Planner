import { createContext, useState, useEffect, useCallback } from 'react'

export const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved ? JSON.parse(saved) : false
  })

  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem('fontSize') || 'normal'
  })

  const [highContrast, setHighContrast] = useState(() => {
    const saved = localStorage.getItem('highContrast')
    return saved ? JSON.parse(saved) : false
  })

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', darkMode)
    localStorage.setItem('darkMode', JSON.stringify(darkMode))
  }, [darkMode])

  useEffect(() => {
    localStorage.setItem('fontSize', fontSize)
    const root = document.documentElement
    root.classList.remove('text-base', 'text-lg', 'text-xl')
    if (fontSize === 'large') root.classList.add('text-lg')
    else if (fontSize === 'extra-large') root.classList.add('text-xl')
    else root.classList.add('text-base')
  }, [fontSize])

  useEffect(() => {
    const root = document.documentElement
    root.classList.toggle('high-contrast', highContrast)
    localStorage.setItem('highContrast', JSON.stringify(highContrast))
  }, [highContrast])

  const toggleDarkMode = useCallback(() => setDarkMode(prev => !prev), [])
  const toggleHighContrast = useCallback(() => setHighContrast(prev => !prev), [])
  const changeFontSize = useCallback((size) => setFontSize(size), [])

  return (
    <ThemeContext.Provider
      value={{
        darkMode,
        fontSize,
        highContrast,
        toggleDarkMode,
        toggleHighContrast,
        changeFontSize,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}
