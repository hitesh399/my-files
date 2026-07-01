import type { ThemeAdapter } from './themeAdapter.types'
import { isThemeName } from '@/utils/themeGuards'
import { DEFAULT_THEME, STORAGE_KEYS, type ThemeName } from '@/utils/themeTypes'

export interface ApiThemeAdapterOptions {
  endpoint: string
  storageKey?: string
  fetchImpl?: typeof fetch
}

/**
 * Hybrid adapter for future server persistence.
 *
 * - readTheme() stays synchronous by reading local cache.
 * - writeTheme() updates local cache first, then syncs to API in background.
 */
export function createApiThemeAdapter(
  options: ApiThemeAdapterOptions,
): ThemeAdapter {
  const storageKey = options.storageKey ?? STORAGE_KEYS.theme

  const readTheme = (): ThemeName | null => {
    if (typeof window === 'undefined') {
      return DEFAULT_THEME
    }

    const raw = window.localStorage.getItem(storageKey)
    return raw && isThemeName(raw) ? raw : null
  }

  const writeTheme = (theme: ThemeName): void => {
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem(storageKey, theme)

    const requestInit: RequestInit = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ theme }),
      credentials: 'include',
    }

    const fetcher = options.fetchImpl ?? fetch

    void fetcher(options.endpoint, requestInit).catch(() => {
      // Intentionally ignored: local cache remains source of truth for runtime continuity.
    })
  }

  return {
    readTheme,
    writeTheme,
  }
}
