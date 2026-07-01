# Theme MFE

Tailwind-driven theme runtime remote.

## Responsibilities

- Own current theme state.
- Persist selected theme in localStorage.
- Expose imperative APIs:
  - `setTheme(theme)`
  - `getCurrentTheme()`
- Expose optional React provider for auto setup:
  - `ThemeProvider`
- Apply theme to document root using:
  - `data-theme`
  - `dark` class

## Why This Structure

This project uses a dedicated `theme-mfe` to centralize runtime theming behavior across micro frontends.

### Benefits

- Single runtime source of truth for theme state and theme change API.
- Independent deployments for theme behavior without waiting for every MFE release.
- Consistent token application (`data-theme`, CSS vars, `dark` class) across apps.
- Optional `ThemeProvider` enables automatic style and theme bootstrapping in hosts.
- Adapter pattern allows future migration from local storage to server-backed preference APIs.

### Trade-offs / Negative Points

- Adds module federation complexity (remote availability, version compatibility, startup ordering).
- Tailwind utility generation is still build-time per MFE; each MFE keeps minimal Tailwind config.
- Host app resilience is required if remote is unavailable (fallback behavior and error handling).
- Additional debugging surface across remote-host boundaries.

### Decision Boundary

- Use this structure when multiple MFEs require shared, evolving runtime theme behavior.
- For small single-team apps, a shared package can be simpler than a runtime remote.

## Project Structure

```text
src/
├── themeAdapter/
│   ├── index.ts
│   ├── localStorageThemeAdapter.ts
│   └── themeAdapter.types.ts
├── utils/
│   ├── domTheme.ts
│   ├── themeDefinitions.ts
│   ├── themeGuards.ts
│   └── themeTypes.ts
├── ThemeProvider.tsx
├── themeManager.ts
├── App.tsx
├── index.css
└── main.tsx
```

- `utils/` contains focused utilities and types.
- `themeAdapter/` contains persistence adapters (local now, API/server later).
- `themeManager.ts` orchestrates theme state, definitions, runtime API exposure.

## Theme API

In browser runtime, API is exposed on `window.themeRuntime`:

```ts
window.themeRuntime?.setTheme('dark')
const theme = window.themeRuntime?.getCurrentTheme()
```

## Persistence Strategy

- Current default adapter uses localStorage (`platform-theme`).
- Adapter is swappable via `setThemeAdapter(...)`.
- This keeps migration to server-backed storage straightforward later.

### Example: API-backed Adapter

```ts
import { createApiThemeAdapter } from '@/themeAdapter'
import { setThemeAdapter } from '@/themeManager'

setThemeAdapter(
  createApiThemeAdapter({
    endpoint: '/api/v1/users/theme',
  }),
)
```

This adapter reads synchronously from local cache and writes to server in the background,
which keeps the existing `setTheme/getCurrentTheme` flow unchanged.

## Future API-driven Theme Settings

- Theme names and CSS variable maps are managed as `ThemeDefinition`.
- At runtime, future API response can call `setThemeDefinitions(...)`.
- Existing UI and `setTheme(...)` continue working without refactor.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Module Federation

Theme MFE is exposed as a remote using Vite Module Federation.

- Remote name: `theme_mfe`
- Remote entry: `/assets/remoteEntry.js`
- Exposed module: `./themeRuntime`
- Exposed module: `./ThemeProvider`

### Exposed API from `./themeRuntime`

- `setTheme(theme)`
- `getCurrentTheme()`
- `setThemeAdapter(adapter)`
- `setThemeDefinitions(definitions)`
- `THEMES`

### Exposed Provider from `./ThemeProvider`

- `ThemeProvider`

The provider imports theme-mfe styles and applies theme settings automatically on mount.

### Host Example (Vite)

```ts
// host vite.config.ts
import federation from '@originjs/vite-plugin-federation'

federation({
  remotes: {
    theme_mfe: 'http://localhost:4174/assets/remoteEntry.js',
  },
})
```

For remote testing, serve `theme-mfe` in preview mode so `remoteEntry.js` is available:

```bash
npm run build
npm run preview
```

With current config, remote entry is served from `http://localhost:4174/assets/remoteEntry.js`.

```ts
// host usage
const themeRuntime = await import('theme_mfe/themeRuntime')
themeRuntime.setTheme('dark')
```

```tsx
// host usage with provider
import { ThemeProvider } from 'theme_mfe/ThemeProvider'

export function AppRoot() {
  return (
    <ThemeProvider>
      <App />
    </ThemeProvider>
  )
}
```
