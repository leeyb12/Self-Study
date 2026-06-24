import { useState } from 'react'
import { applyTheme, getInitialTheme, type Theme } from '../theme'

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme)

  function toggle() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    applyTheme(next)
    setTheme(next)
  }

  return (
    <button
      className="theme-toggle"
      onClick={toggle}
      title={theme === 'dark' ? '라이트 모드로' : '다크 모드로'}
      aria-label="테마 전환"
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  )
}
