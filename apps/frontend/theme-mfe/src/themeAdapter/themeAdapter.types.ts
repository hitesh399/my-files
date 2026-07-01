import type { ThemeName } from '@/utils/themeTypes'

export interface ThemeAdapter {
  readTheme: () => ThemeName | null
  writeTheme: (theme: ThemeName) => void
}
