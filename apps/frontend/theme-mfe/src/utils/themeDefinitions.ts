import { type ThemeDefinition } from './themeTypes'

export const DEFAULT_THEME_DEFINITIONS: ThemeDefinition[] = [
  {
    name: 'light',
    cssVariables: {
      '--bg': '#fffaf1',
      '--surface': '#ffffff',
      '--text': '#1f2937',
      '--muted': '#6b7280',
      '--ring': '#f59e0b',
    },
  },
  {
    name: 'dark',
    cssVariables: {
      '--bg': '#0f172a',
      '--surface': '#111827',
      '--text': '#f8fafc',
      '--muted': '#cbd5e1',
      '--ring': '#38bdf8',
    },
  },
  {
    name: 'sunset',
    cssVariables: {
      '--bg': '#fff1ed',
      '--surface': '#ffe7de',
      '--text': '#7c2d12',
      '--muted': '#9a3412',
      '--ring': '#fb7185',
    },
  },
]
