import { useEffect, type ReactNode } from 'react'
import type { ThemeAdapter } from '@/themeAdapter'
import {
  exposeThemeRuntimeApi,
  getCurrentTheme,
  setTheme,
  setThemeAdapter,
  setThemeDefinitions,
  type ThemeDefinition,
  type ThemeName,
} from '@/themeManager'
import './index.css'

interface ThemeProviderProps {
  children: ReactNode
  initialTheme?: ThemeName
  adapter?: ThemeAdapter
  definitions?: ThemeDefinition[]
  exposeRuntime?: boolean
}

/**
 * Optional provider for host apps that want automatic style/theme bootstrapping.
 * Importing this provider also applies theme-mfe Tailwind/CSS tokens.
 */
export function ThemeProvider({
  children,
  initialTheme,
  adapter,
  definitions,
  exposeRuntime = true,
}: ThemeProviderProps) {
  useEffect(() => {
    if (adapter) {
      setThemeAdapter(adapter)
    }

    if (definitions?.length) {
      setThemeDefinitions(definitions)
    }

    const activeTheme = initialTheme ?? getCurrentTheme()
    setTheme(activeTheme)

    if (exposeRuntime) {
      exposeThemeRuntimeApi()
    }
  }, [adapter, definitions, exposeRuntime, initialTheme])

  return <>{children}</>
}

export default ThemeProvider
