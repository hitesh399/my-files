# Theme MFE Architecture Decision

## Summary

`theme-mfe` is a runtime platform module that centralizes theme behavior for all frontend micro frontends.

It owns:
- active theme lifecycle (`getCurrentTheme`, `setTheme`)
- theme token application (`data-theme`, CSS variables, Tailwind dark class)
- optional provider bootstrap (`ThemeProvider`)
- pluggable persistence strategy (adapter pattern)

## Why We Chose This Structure

We need consistent global theme behavior across independently deployable MFEs.
A dedicated runtime remote avoids duplicated logic and drift between teams/apps.

## Benefits

1. Centralized runtime contract:
- one place for theme lifecycle and APIs
- one place for token application rules

2. Independent release velocity:
- theme behavior can be released without touching every MFE

3. Better consistency:
- avoids slight implementation differences across MFEs

4. Future persistence flexibility:
- adapters make migration to backend preference APIs straightforward

5. Better host DX:
- `ThemeProvider` can auto-apply theme styles/settings for consuming MFEs

## Negative Points / Costs

1. Federation operational overhead:
- remote URL/version management
- remote availability concerns

2. Additional failure modes:
- host must handle remote load errors and fallbacks

3. Build-time styling remains local:
- Tailwind class generation is per-MFE build
- each MFE still needs minimal Tailwind/PostCSS setup

4. Cross-boundary debugging complexity:
- remote-host integration can be harder to trace than monolithic code

## Practical Rule

- Keep runtime theme logic in `theme-mfe`.
- Keep minimal Tailwind build wiring per MFE.
- Centralize Tailwind design tokens/rules via shared preset/package to minimize duplication.

## When Not To Use Theme MFE

If app count is low, releases are synchronized, and runtime theme changes are rare,
a shared package can be simpler and cheaper to maintain.
