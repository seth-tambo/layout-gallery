# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start Vite dev server with HMR
npm run build      # TypeScript check + Vite production build
npm run lint       # ESLint (flat config, ESLint 9+)
npm run preview    # Preview production build locally
```

## Architecture

**Layout pattern gallery** — a showcase of self-contained, interactive layout patterns built with React 19 + TypeScript + Tailwind CSS + Vite.

### Routing

Two routes via React Router:
- `/` → `Gallery` — grid of all layouts organized by category
- `/layouts/:slug` → `LayoutPage` — renders a single layout by slug

### Layout Registry (`src/layouts/registry.ts`)

Central registry that defines all available layouts. Each entry has a slug, name, description, category, and a `React.lazy()` component reference for code-splitting. To add a new layout:
1. Create a directory under `src/layouts/` (e.g., `blueprint-003/`)
2. Add the component file and optional CSS
3. Register it in `registry.ts` with metadata and a lazy import

### Layout Categories

- **Multi-Column** — fixed-viewport structures with independent scroll regions
- **Slide & Overlay** — panels/drawers that slide over content
- **Infinite Canvas** — pannable, zoomable workspaces with floating elements

### Component Structure

```
src/
├── gallery/          # Landing page grid
├── layouts/          # All layout implementations + registry
│   ├── registry.ts   # Central metadata + lazy imports
│   ├── LayoutPage.tsx # Route handler with Suspense boundary
│   └── <slug>/       # Each layout is self-contained (component + CSS)
├── shared/           # Reusable components (BackToGallery, etc.)
├── router.tsx        # Route definitions
└── main.tsx          # Entry point
```

## Conventions

### Styling

- Tailwind CSS with heavy use of arbitrary values for a dark blueprint aesthetic
- Core palette: deep blues (`#0a1628`, `#0b1a30`), cyan accents (`#7eb8da`, `#4a90c4`), borders (`#1e3a5f`)
- Monospace font (`font-mono`) throughout
- Layout-specific CSS files for custom scrollbars, grid backgrounds, and decorative effects
- Full-viewport layouts use `h-dvh` (dynamic viewport height)

### State & Interactions

- Local React hooks only — no external state management library
- Canvas interactions (pan, zoom, drag) are self-contained per layout component
- Mobile responsiveness via `lg:` breakpoint with progressive disclosure (`<details>`, `<select>`)

### TypeScript

- Strict mode enabled with `noUnusedLocals` and `noUnusedParameters`
- Interfaces defined for complex state shapes (`Panel`, `BeatPad`, `LayoutEntry`, etc.)
