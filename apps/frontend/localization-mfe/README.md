# Localization MFE

Global language owner for shell-wide consistency.

## Responsibilities

- Own current language state for all MFEs.
- Publish language updates on `platform-context/v1:set-language`.
- Respond to `platform-context/v1:request-context` with `platform-context/v1:context-snapshot`.

## Supported Language Values

- en
- hi

## Runtime Contract

- Channel: `platform-context/v1`
- Events consumed:
  - `platform-context/v1:request-context`
  - `platform-context/v1:set-language`
- Events produced:
  - `platform-context/v1:set-language`
  - `platform-context/v1:context-snapshot`

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```
