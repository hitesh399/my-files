# Frontend Platform Context Contract

## Purpose

Define a deployable platform context contract that can be consumed by all business MFEs (auth, documents, future MFEs) even when they live in separate repositories and deployment destinations.

## Ownership Model

- Theme MFE is the authority for global theme state.
- Localization MFE is the authority for global language state.
- Shell requests and applies platform context at startup.
- Business MFEs subscribe to context events and update local providers.
- Every MFE supports standalone fallback mode when platform is unavailable.

## Contract Version

- Channel: `platform-context/v1`
- All event names are versioned.
- Breaking changes require a new version (`v2`) to avoid runtime coupling issues.

## Event Bus API

### Request Context Snapshot

- Event: `platform-context/v1:request-context`
- Detail:

```json
{
  "source": "auth-mfe"
}
```

### Context Snapshot Response

- Event: `platform-context/v1:context-snapshot`
- Detail:

```json
{
  "source": "theme-mfe | localization-mfe",
  "theme": "light",
  "language": "en"
}
```

### Theme Change

- Event: `platform-context/v1:set-theme`
- Detail:

```json
{
  "source": "shell",
  "theme": "dark"
}
```

### Language Change

- Event: `platform-context/v1:set-language`
- Detail:

```json
{
  "source": "shell",
  "language": "hi"
}
```

## Supported Values

- Themes: `light`, `dark`, `sunset`
- Languages: `en`, `hi`

These enums must stay identical across shell, platform MFE, and all business MFEs.

## Bootstrap Lifecycle

1. Host mounts shell.
2. Shell requests context snapshot from theme-mfe and localization-mfe.
3. Platform replies with current `theme` and `language`.
4. Shell broadcasts context events.
5. Business MFEs consume snapshot/events and rehydrate local providers.
6. User changes theme/language from shell controls.
7. Theme/localization remotes emit updates to all MFEs.

## Failure and Fallback Rules

- If theme or localization MFE is unavailable at startup:
  - MFE uses local fallback persisted values.
  - MFE keeps listening for later snapshot/events.
- If an event payload is invalid:
  - ignore it and keep current local value.
- Never block business MFE render on platform availability.

## Security and Isolation

- Event payloads must contain non-sensitive UX state only.
- Authentication/session data must never be sent in this channel.
- Auth remains cookie-based HttpOnly and server-validated.

## Integration Checklist

1. Add event listeners in theme and i18n providers.
2. Ignore events emitted by the same `source`.
3. Validate enum values before applying.
4. Keep local persistence as fallback only.
5. Document contract version in each MFE README.
