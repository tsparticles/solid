# Codebase Structure

**Analysis Date:** 2026-04-10

## Directory Layout

```text
solid/
├── apps/                          # Runnable applications and demos
│   └── solid/                     # Solid + Vite demo consumer for @tsparticles/solid
├── components/                    # Publishable component packages
│   └── solid/                     # @tsparticles/solid library source, tests, build config
├── .planning/codebase/            # Generated architecture/quality/stack mapping docs
├── package.json                   # Workspace-level scripts and tooling dependencies
├── pnpm-workspace.yaml            # Workspace package boundaries (apps/*, components/*)
├── nx.json                        # Nx task caching defaults
├── lerna.json                     # Lerna workspace orchestration config
└── pnpm-lock.yaml                 # Dependency lockfile
```

## Directory Purposes

**`apps/solid/`:**
- Purpose: Host a concrete Solid application that consumes `@tsparticles/solid`.
- Contains: App entry HTML, Vite config, TypeScript config, app source (`src/`), generated outputs (`dist/`, `build/`).
- Key files: `apps/solid/src/index.tsx`, `apps/solid/src/App.tsx`, `apps/solid/vite.config.ts`, `apps/solid/package.json`.

**`components/solid/`:**
- Purpose: Implement and package the `@tsparticles/solid` library.
- Contains: Runtime source (`src/`), tests (`test/`), package config/build scripts, generated `dist/` output.
- Key files: `components/solid/src/index.tsx`, `components/solid/src/Particles.tsx`, `components/solid/src/IParticlesProps.ts`, `components/solid/tsup.config.ts`, `components/solid/package.json`.

**`components/solid/src/lib/`:**
- Purpose: Contain optional higher-level library helpers beyond core component export.
- Contains: Provider/context helper (`ParticlesProvider.tsx`).
- Key files: `components/solid/src/lib/ParticlesProvider.tsx`.

**`components/solid/test/`:**
- Purpose: Validate component rendering for client and SSR modes.
- Contains: Vitest suites.
- Key files: `components/solid/test/index.test.tsx`, `components/solid/test/server.test.tsx`.

**Root config/files:**
- Purpose: Define workspace orchestration and shared tooling behavior.
- Contains: Monorepo manifests and build command entrypoints.
- Key files: `package.json`, `pnpm-workspace.yaml`, `nx.json`, `lerna.json`.

## Key File Locations

**Entry Points:**
- `apps/solid/index.html`: Browser entry HTML that mounts the demo app on `#root` and loads `/src/index.tsx`.
- `apps/solid/src/index.tsx`: Demo runtime bootstrap (`render(() => <App />, root!)`).
- `components/solid/src/index.tsx`: Library API entrypoint exporting component and init helper.
- `components/solid/package.json`: Declares package export conditions (`import`, `development`, `solid`).

**Configuration:**
- `apps/solid/vite.config.ts`: Demo dev/build server configuration.
- `apps/solid/tsconfig.json`: Demo TypeScript compiler settings.
- `components/solid/tsconfig.json`: Library TypeScript strict settings and excludes.
- `components/solid/vitest.config.ts`: Test-mode switching for browser vs SSR suites.
- `components/solid/tsup.config.ts`: Library build pipeline and package export writing.
- `components/solid/.eslintrc`: Library lint behavior.

**Core Logic:**
- `components/solid/src/Particles.tsx`: Wrapper that creates particle container and cleanup lifecycle.
- `components/solid/src/IParticlesProps.ts`: Typed props contract for component API.
- `components/solid/src/lib/ParticlesProvider.tsx`: Context-based optional engine sharing abstraction.
- `apps/solid/src/App.tsx`: Demo composition using `initParticlesEngine` and `<Particles />`.

**Testing:**
- `components/solid/test/index.test.tsx`: Client-side rendering expectations.
- `components/solid/test/server.test.tsx`: SSR rendering expectations.

## Naming Conventions

**Files:**
- Components and interfaces use PascalCase filenames for exported symbols: `components/solid/src/Particles.tsx`, `components/solid/src/IParticlesProps.ts`.
- App bootstrap files use framework-conventional names: `apps/solid/src/index.tsx`, `apps/solid/src/App.tsx`.
- Config files keep tool-default names: `components/solid/vitest.config.ts`, `apps/solid/vite.config.ts`.

**Directories:**
- Top-level directories are workspace-role based and pluralized: `apps/`, `components/`.
- Package directory under each top-level bucket uses framework/name slug: `apps/solid/`, `components/solid/`.
- Subdirectories are semantic and lowercase: `src/`, `test/`, `dist/`, `lib/`.

## Where to Add New Code

**New Feature:**
- Primary code: Add library behavior in `components/solid/src/` (for exported API) and demo usage in `apps/solid/src/` (for integration proof).
- Tests: Add Vitest coverage in `components/solid/test/` matching file behavior (client and/or SSR).

**New Component/Module:**
- Implementation: Add `.tsx` module in `components/solid/src/` and export it via `components/solid/src/index.tsx` when part of public API.

**Utilities:**
- Shared helpers: Place helper modules under `components/solid/src/lib/` when they are library-internal abstractions (pattern established by `components/solid/src/lib/ParticlesProvider.tsx`).

## Special Directories

**`apps/solid/dist/`:**
- Purpose: Vite production output for the demo app.
- Generated: Yes.
- Committed: Yes (currently present in repository tree).

**`apps/solid/build/`:**
- Purpose: Additional built static artifacts for the demo app.
- Generated: Yes.
- Committed: Yes (currently present in repository tree).

**`components/solid/dist/`:**
- Purpose: Publishable library artifacts (`index.js`, `index.jsx`, `dev.js`, type declarations).
- Generated: Yes.
- Committed: Yes (included in package `files` and present in repository tree).

**`node_modules/` (root and package-local):**
- Purpose: Installed dependencies.
- Generated: Yes.
- Committed: No (tooling artifact; present locally).

---

*Structure analysis: 2026-04-10*
