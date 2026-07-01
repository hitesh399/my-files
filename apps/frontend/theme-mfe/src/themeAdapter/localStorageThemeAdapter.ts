import { isThemeName } from '@/utils/themeGuards'
import { STORAGE_KEYS, type ThemeName } from '@/utils/themeTypes'
import type { ThemeAdapter } from './themeAdapter.types'

export const localStorageThemeAdapter: ThemeAdapter = {
  readTheme: () => {
    if (typeof window === 'undefined') {
      return null
    }

    const value = window.localStorage.getItem(STORAGE_KEYS.theme)
    if (!value || !isThemeName(value)) {
      return null
    }

    return value as ThemeName
  },
  writeTheme: (theme) => {
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem(STORAGE_KEYS.theme, theme)
  },
}
