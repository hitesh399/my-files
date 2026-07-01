declare module 'theme_mfe/ThemeProvider' {
  import type { ReactNode } from 'react'

  export interface ThemeProviderProps {
    children: ReactNode
  }

  export const ThemeProvider: (props: ThemeProviderProps) => ReactNode
}
