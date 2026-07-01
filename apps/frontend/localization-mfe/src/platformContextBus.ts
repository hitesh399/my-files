const CHANNEL = 'platform-context/v1'

const PLATFORM_CONTEXT_REQUEST_EVENT = `${CHANNEL}:request-context`
const PLATFORM_CONTEXT_SNAPSHOT_EVENT = `${CHANNEL}:context-snapshot`
const PLATFORM_CONTEXT_SET_LANGUAGE_EVENT = `${CHANNEL}:set-language`

export const APP_ID = 'localization-mfe'

export const LOCALES = ['en', 'hi'] as const
export type LocaleName = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: LocaleName = 'en'

const THEMES = ['light', 'dark', 'sunset'] as const
type ThemeName = (typeof THEMES)[number]
const DEFAULT_THEME: ThemeName = 'light'

const STORAGE_KEYS = {
  theme: 'platform-theme',
  language: 'platform-language',
} as const

interface BaseDetail {
  source: string
}

interface ContextRequestDetail extends BaseDetail {}

interface LanguageDetail extends BaseDetail {
  language: LocaleName
}

interface ContextSnapshotDetail extends BaseDetail {
  theme: ThemeName
  language: LocaleName
}

function hasWindow(): boolean {
  return typeof window !== 'undefined'
}

export function persistLanguage(language: LocaleName): void {
  if (!hasWindow()) {
    return
  }

  window.localStorage.setItem(STORAGE_KEYS.language, language)
}

export function getPersistedLocale(): LocaleName | null {
  if (!hasWindow()) {
    return null
  }

  const stored = window.localStorage.getItem(STORAGE_KEYS.language)
  if (!stored || !LOCALES.includes(stored as LocaleName)) {
    return null
  }

  return stored as LocaleName
}

export function readPersistedTheme(): ThemeName {
  if (!hasWindow()) {
    return DEFAULT_THEME
  }

  const stored = window.localStorage.getItem(STORAGE_KEYS.theme)
  if (stored && THEMES.includes(stored as ThemeName)) {
    return stored as ThemeName
  }

  return DEFAULT_THEME
}

export function publishLanguageChange(detail: LanguageDetail): void {
  if (!hasWindow()) {
    return
  }

  window.dispatchEvent(
    new CustomEvent<LanguageDetail>(PLATFORM_CONTEXT_SET_LANGUAGE_EVENT, {
      detail,
    }),
  )
}

export function publishContextSnapshot(detail: ContextSnapshotDetail): void {
  if (!hasWindow()) {
    return
  }

  window.dispatchEvent(
    new CustomEvent<ContextSnapshotDetail>(PLATFORM_CONTEXT_SNAPSHOT_EVENT, {
      detail,
    }),
  )
}

export function onLanguageChange(callback: (detail: LanguageDetail) => void): () => void {
  if (!hasWindow()) {
    return () => undefined
  }

  const handler = (event: Event) => {
    const customEvent = event as CustomEvent<LanguageDetail>
    callback(customEvent.detail)
  }

  window.addEventListener(PLATFORM_CONTEXT_SET_LANGUAGE_EVENT, handler)

  return () => {
    window.removeEventListener(PLATFORM_CONTEXT_SET_LANGUAGE_EVENT, handler)
  }
}

export function onContextRequest(callback: (detail: ContextRequestDetail) => void): () => void {
  if (!hasWindow()) {
    return () => undefined
  }

  const handler = (event: Event) => {
    const customEvent = event as CustomEvent<ContextRequestDetail>
    callback(customEvent.detail)
  }

  window.addEventListener(PLATFORM_CONTEXT_REQUEST_EVENT, handler)

  return () => {
    window.removeEventListener(PLATFORM_CONTEXT_REQUEST_EVENT, handler)
  }
}