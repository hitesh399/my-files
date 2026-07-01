import { type ThemeDefinition, type ThemeName } from './themeTypes'

export function applyThemeToDocument(theme: ThemeName, definition: ThemeDefinition): void {
  if (typeof document === 'undefined') {
    return
  }

  document.documentElement.dataset.theme = theme
  document.documentElement.classList.toggle('dark', theme === 'dark')

  Object.entries(definition.cssVariables).forEach(([name, value]) => {
    document.documentElement.style.setProperty(name, value)
  })
}
