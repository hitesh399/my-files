# Auth Micro Frontend

This project implements the authentication micro frontend with:

- React + TypeScript + Vite
- Redux Toolkit for global auth state
- React Context for component-level local UI state
- React Router for page-level navigation
- Tailwind CSS for UI styling

## Source Layout

```text
src/
├── app/
│   ├── routes/
│   ├── providers/
│   └── config/
├── pages/
├── components/
├── services/
├── hooks/
├── store/
├── context/
├── App.tsx
└── main.tsx
```

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Environment

Set API base URL in `.env`:

```bash
VITE_API_BASE_URL=http://localhost:3000
```

## Routing

- `/login`: login form
- `/profile`: protected route (requires valid cookie-backed session)
