# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start development server (Vite)
npm run build      # Type-check + production build
npm run lint       # Run ESLint
npm run preview    # Preview production build locally
```

No test runner is configured — there are no test files or test scripts.

## Tech Stack

- **React 19** with TypeScript, built with **Vite**
- **React Router v7** (`createBrowserRouter`) for client-side routing
- **TanStack React Query v5** for server state / data fetching
- **Zustand** for client-side state
- **Axios** for HTTP requests
- **TanStack React Table v8** for table UI
- **Tailwind CSS v4** + **DaisyUI v5** for styling
- **Lucide React** for icons, **date-fns** for date utilities
- React Compiler enabled via Babel (automatic memoization)

## Architecture

### Route Structure (`src/route.ts`)
Routes are defined using `createBrowserRouter`. Currently two top-level sections share `ClientAppLayout`:
- `/` → `HomePage` (client-facing)
- `/admin` → `DashboardPage` (admin section)

Add new routes in `src/route.ts` and nest them under the appropriate layout.

### Layout (`src/layouts/ClientAppLayout.tsx`)
DaisyUI drawer-based layout with a collapsible sidebar and top navbar. Page content renders via `<Outlet />`.

### Code Organization
```
src/
├── pages/
│   ├── clients/     # Client-facing pages
│   └── admins/      # Admin pages
├── components/      # Shared/reusable components
├── layouts/         # Layout wrappers
├── hooks/           # Custom React hooks
├── assets/          # SVGs and static assets
├── route.ts         # Router config
└── App.tsx          # Root component (wraps QueryClientProvider, RouterProvider)
```

### Data Fetching Pattern
Use React Query hooks (`useQuery`, `useMutation`) for all server data. Axios is the HTTP client — centralize API calls (e.g., in a `src/api/` directory or per-feature service file) rather than calling `axios` directly in components.

### Styling
Use Tailwind utility classes and DaisyUI component classes. DaisyUI v5 component syntax may differ from v4 — check current DaisyUI docs if components behave unexpectedly.
