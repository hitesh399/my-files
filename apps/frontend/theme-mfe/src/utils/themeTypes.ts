export const THEMES = ['light', 'dark', 'sunset'] as const

export type ThemeName = (typeof THEMES)[number]

export interface ThemeDefinition {
  name: ThemeName
  cssVariables: Record<string, string>
}

export const DEFAULT_THEME: ThemeName = 'light'

export const STORAGE_KEYS = {
  theme: 'platform-theme',
} as const
