# High-Level Architecture

## Monorepo Layout

```text
my-files/
├── apps/
│   ├── frontend/
│   │   ├── shell/
│   │   ├── theme-mfe/
│   │   ├── localization-mfe/
│   │   ├── auth-mfe/
│   │   ├── documents-mfe/
│   │   └── shared-ui/
│   └── api/
│       └── src/
│           ├── modules/
│           │   ├── auth/
│           │   ├── documents/
│           │   ├── storage/
│           │   └── cache/
│           ├── common/
│           ├── config/
│           ├── app.module.ts
│           └── main.ts
└── docs/
└── infrastructure/
	 ├── concourse
	 ├── aws
	 ├── docker
	 └── localstack	 
└── docker-compose.yml
└── nginx
	 ├── default.conf
```

## Frontend Micro Frontend Strategy

- `shell` hosts navigation and can orchestrate cross-MFE concerns.
- `theme-mfe` is the shared runtime source for global theme.
- `localization-mfe` is the shared runtime source for global language.
- `auth-mfe` owns authentication UI and auth session bootstrap.
- `documents-mfe` owns document domain flows.
- `shared-ui` is optional for design primitives, not the source of global runtime context.

See theme architecture rationale: `docs/Theme-MFE-Architecture.md`.

## Auth MFE Layered Structure

`auth-mfe` now follows a feature-oriented layout:

```text
src/
├── app/
│   ├── routes/
│   │   └── AppRoutes.tsx
│   ├── providers/
│   │   ├── AppProviders.tsx
│   │   ├── I18nProvider.tsx
│   │   ├── StoreProvider.tsx
│   │   └── ThemeProvider.tsx
│   └── config/
│       ├── env.ts
│       └── i18n/
│           ├── i18n.ts
│           └── locales/
│               ├── en/common.json
│               └── hi/common.json
├── pages/
│   ├── LoginPage.tsx
│   └── ProfilePage.tsx
├── components/
│   ├── LanguageSwitcher.tsx
│   ├── LoginForm.tsx
│   ├── ProfileCard.tsx
│   └── ThemeSwitcher.tsx
├── services/
│   └── authService.ts
├── hooks/
│   └── useLogin.ts
├── store/
│   ├── authStore.ts
│   ├── hooks.ts
│   └── slices/
│       └── authSlice.ts
├── context/
│   └── LoginUiContext.tsx
├── constants/
│   ├── locales.ts
│   ├── storageKeys.ts
│   └── themes.ts
├── utils/
│   └── storage.ts
├── assets/
├── App.tsx
└── main.tsx
```

## State Management Boundary

- Global application state uses Redux Toolkit:
	- auth user/session status
	- login async status/error
- Component-level transient state uses React Context:
	- login form UI preference (`rememberMe`)

This boundary keeps business-critical state centralized while avoiding Redux boilerplate for local UI behavior.

## Theming and Localization

- Theme support: `light`, `dark`, `sunset`
	- theme-mfe is source of truth
	- each MFE keeps local fallback persistence for standalone mode
	- runtime theme applied via `data-theme` + Tailwind `dark` class toggle
- Localization support: `en`, `hi`
	- localization-mfe is source of truth
	- each MFE keeps local fallback persistence for standalone mode
	- `i18next` + `react-i18next`

## Platform Context Contract

- Contract channel: `platform-context/v1`
- Event model:
	- `platform-context/v1:request-context`
	- `platform-context/v1:context-snapshot`
	- `platform-context/v1:set-theme`
	- `platform-context/v1:set-language`
- Payloads include `source` to prevent feedback loops.

See the detailed contract in `docs/Frontend-Platform-Context.md`.

## Navigation Flow

- `/login`: public route with language/theme controls and login form
- `/profile`: protected route that requires valid cookie-backed session
- unauthenticated profile access redirects to `/login`

## Secure Authentication Strategy

- Auth session uses secure HttpOnly cookies only.
- Frontend never stores tokens in localStorage/sessionStorage.
- App bootstraps by validating session from backend (`/auth/me`) with `credentials: 'include'`.

## Replication Path for Documents MFE

To replicate this architecture in `documents-mfe`:

1. Copy the same `app/providers`, `app/config`, and constants/utilities patterns.
2. Replace auth domain files (`authService`, `authSlice`, login/profile pages) with document-domain counterparts.
3. Keep the same global-vs-local state boundary and i18n/theme conventions.