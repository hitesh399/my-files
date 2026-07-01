import { localStorageThemeAdapter, type ThemeAdapter } from '@/themeAdapter'
import { applyThemeToDocument } from '@/utils/domTheme'
import { DEFAULT_THEME_DEFINITIONS } from '@/utils/themeDefinitions'
import { isThemeName } from '@/utils/themeGuards'
import {
  DEFAULT_THEME,
  THEMES,
  type ThemeDefinition,
  type ThemeName,
} from '@/utils/themeTypes'

let persistenceAdapter: ThemeAdapter = localStorageThemeAdapter
let themeDefinitions: ThemeDefinition[] = DEFAULT_THEME_DEFINITIONS

export { THEMES }
export type { ThemeName, ThemeDefinition }

function getThemeDefinition(theme: ThemeName): ThemeDefinition {
  const definition = themeDefinitions.find((entry) => entry.name === theme)
  return definition ?? DEFAULT_THEME_DEFINITIONS[0]
}

export function setThemeAdapter(adapter: ThemeAdapter): void {
  persistenceAdapter = adapter
}

export function setThemeDefinitions(definitions: ThemeDefinition[]): void {
  if (!definitions.length) {
    return
  }

  const normalized = definitions.filter((entry) => isThemeName(entry.name))
  if (!normalized.length) {
    return
  }

  themeDefinitions = normalized
}

export function getCurrentTheme(): ThemeName {
  return persistenceAdapter.readTheme() ?? DEFAULT_THEME
}

export function setTheme(theme: ThemeName): void {
  if (!isThemeName(theme)) {
    return
  }

  const definition = getThemeDefinition(theme)
  applyThemeToDocument(theme, definition)
  persistenceAdapter.writeTheme(theme)
}

export interface ThemeRuntimeApi {
  getCurrentTheme: () => ThemeName
  setTheme: (theme: ThemeName) => void
}

declare global {
  interface Window {
    themeRuntime?: ThemeRuntimeApi
  }
}

export function exposeThemeRuntimeApi(): void {
  if (typeof window === 'undefined') {
    return
  }

  window.themeRuntime = {
    getCurrentTheme,
    setTheme,
  }
}