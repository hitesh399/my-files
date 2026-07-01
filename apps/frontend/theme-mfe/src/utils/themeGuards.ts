import { THEMES, type ThemeName } from './themeTypes'

export function isThemeName(value: string): value is ThemeName {
  return THEMES.includes(value as ThemeName)
}
