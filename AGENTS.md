# Repository Guidelines

## Project Structure & Module Organization
Core app code lives in `src/`. Routing is centralized in `src/route.ts`, with page modules under `src/pages/` split by area (`clients/`, `admins/`). Shared layout components are in `src/layouts/`, reusable UI in `src/components/`, and static assets in `src/assets/`. Public static files (served as-is) are in `public/`.

Use feature-oriented paths for new pages, for example: `src/pages/clients/booking/BookingPage.tsx`.

## Build, Test, and Development Commands
- `npm install`: install dependencies.
- `npm run dev`: start the Vite dev server with HMR.
- `npm run build`: run TypeScript project build (`tsc -b`) then create a production bundle via Vite.
- `npm run preview`: preview the built app locally.
- `npm run lint`: run ESLint across the repository.

Run `npm run lint && npm run build` before opening a PR.

## Coding Style & Naming Conventions
This repository uses TypeScript + React function components and ESLint (`eslint.config.js`).
- Indentation: 2 spaces.
- Strings: double quotes; keep semicolons.
- Components/layouts/pages: `PascalCase` filenames and exports (for example, `ClientAppLayout.tsx`).
- Variables/functions/hooks: `camelCase`.
- Keep route definitions explicit in `src/route.ts` and group related routes together.

Tailwind CSS + DaisyUI are enabled; prefer utility classes and existing component patterns over custom one-off CSS.

## Testing Guidelines
There is currently no test runner configured and no `tests/` directory yet. For now, treat lint + build as required quality gates.

When adding tests, prefer colocated `*.test.ts(x)` files near the module under test (or a mirrored `src/tests/` structure for cross-feature flows). Focus first on route-level behavior, layout interactions, and critical data flows.

## Commit & Pull Request Guidelines
Git history is minimal (`first commit`), so no strict convention is established yet. Use clear, imperative commit subjects and keep each commit scoped to one change (example: `Add admin dashboard route guard`).

For pull requests:
- Describe what changed and why.
- Link related issue/task IDs.
- Include screenshots or short recordings for UI changes.
- Note validation steps run locally (`npm run lint`, `npm run build`).
