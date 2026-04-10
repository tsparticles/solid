# Architecture

**Analysis Date:** 2026-04-10

## Pattern Overview

**Overall:** Monorepo workspace with a reusable library package plus a demo consumer application.

**Key Characteristics:**
- Workspace orchestration is centralized at the repository root with `pnpm` + `lerna` + `nx` in `package.json`, `pnpm-workspace.yaml`, and `nx.json`.
- The publishable Solid integration lives in `components/solid/` and exposes a small public API from `components/solid/src/index.tsx`.
- The runnable app in `apps/solid/` consumes the local workspace package `@tsparticles/solid` and demonstrates integration flow (`apps/solid/src/App.tsx`).

## Layers

**Workspace Orchestration Layer:**
- Purpose: Coordinate build execution across packages.
- Location: `package.json`, `pnpm-workspace.yaml`, `nx.json`, `lerna.json`.
- Contains: Root scripts (`build`, `build:ci`), workspace package globs, task cache defaults.
- Depends on: `pnpm`, `lerna`, `nx`.
- Used by: All subprojects under `apps/*` and `components/*`.

**Library Runtime Layer (`@tsparticles/solid`):**
- Purpose: Provide Solid component abstraction over `tsParticles` engine.
- Location: `components/solid/src/`.
- Contains: Component implementation (`components/solid/src/Particles.tsx`), public entrypoint (`components/solid/src/index.tsx`), prop contracts (`components/solid/src/IParticlesProps.ts`).
- Depends on: `solid-js`, `@tsparticles/engine`.
- Used by: Demo app `apps/solid/src/App.tsx`, external consumers through package exports in `components/solid/package.json`.

**Consumer App Layer (Demo):**
- Purpose: Demonstrate and manually validate component integration.
- Location: `apps/solid/src/` with boot HTML in `apps/solid/index.html`.
- Contains: DOM mount bootstrap (`apps/solid/src/index.tsx`), integration example and state (`apps/solid/src/App.tsx`).
- Depends on: `solid-js`, `@tsparticles/solid`, `tsparticles`, `@tsparticles/configs`.
- Used by: Local developers via Vite scripts in `apps/solid/package.json`.

**Build/Test Tooling Layer:**
- Purpose: Package outputs, lint, and run client/SSR tests.
- Location: `components/solid/tsup.config.ts`, `components/solid/vitest.config.ts`, `components/solid/.eslintrc`, `components/solid/test/*.test.tsx`.
- Contains: ESM build generation, conditional SSR test mode, lint policies, unit-style render tests.
- Depends on: `tsup-preset-solid`, `vitest`, `vite-plugin-solid`, `eslint`.
- Used by: Library package scripts in `components/solid/package.json`.

## Data Flow

**Demo Render and Engine Initialization Flow:**

1. Browser loads `apps/solid/index.html` and executes module `apps/solid/src/index.tsx`.
2. `apps/solid/src/index.tsx` validates mount node `#root` and renders `<App />`.
3. `apps/solid/src/App.tsx` calls `initParticlesEngine(loadFull)` from `@tsparticles/solid`.
4. `components/solid/src/index.tsx` invokes `tsParticles.init()` and wraps async setup in a Solid `createResource`.
5. Once init resource resolves, `<Particles id="tsparticles" options={config()} />` mounts from `apps/solid/src/App.tsx`.
6. `components/solid/src/Particles.tsx` creates a resource calling `tsParticles.load({ id, options, url })` and binds a `<canvas>` under wrapper `<div id={id}>`.
7. On container ready, callback `particlesLoaded` (if provided) runs and cleanup destroys container on teardown (`onCleanup`).

**State Management:**
- App-level reactive state uses Solid signals (`createSignal`) in `apps/solid/src/App.tsx`.
- Async lifecycle uses Solid resources (`createResource`) in `components/solid/src/index.tsx` and `components/solid/src/Particles.tsx`.
- Conditional rendering relies on `<Show>` in `apps/solid/src/App.tsx`.

## Key Abstractions

**Particles Component Abstraction:**
- Purpose: Declarative Solid wrapper around imperative `tsParticles.load`.
- Examples: `components/solid/src/Particles.tsx`, usage in `apps/solid/src/App.tsx`.
- Pattern: Props are merged with defaults (`mergeProps`) and translated to engine load params.

**Engine Bootstrapping Abstraction (`initParticlesEngine`):**
- Purpose: Isolate one-time engine initialization behind a reusable helper.
- Examples: `components/solid/src/index.tsx`, called by `apps/solid/src/App.tsx`.
- Pattern: Function returns `Resource<true>` that drives UI gating.

**Typed Props Contract (`IParticlesProps`):**
- Purpose: Define strongly typed component API boundary.
- Examples: `components/solid/src/IParticlesProps.ts`, consumed by `components/solid/src/Particles.tsx`.
- Pattern: Optional props for sizing, style, options/url source, and lifecycle callback.

**Provider-Based Optional Abstraction:**
- Purpose: Context-based engine sharing pattern for app-wide initialization.
- Examples: `components/solid/src/lib/ParticlesProvider.tsx`, documented in `components/solid/RESOURCE_PATTERN.md`.
- Pattern: `createContext` + `createResource` + hook guard (`useParticlesEngine`).

## Entry Points

**Repository Build Entry Point:**
- Location: `package.json` (root scripts).
- Triggers: `pnpm run build`, CI build scripts.
- Responsibilities: Execute monorepo builds across non-private packages using `lerna`/`nx`.

**Demo Application Entry Point:**
- Location: `apps/solid/src/index.tsx` (mounted from `apps/solid/index.html`).
- Triggers: `vite` dev server / browser load.
- Responsibilities: Root node guard + render top-level app component.

**Library Public API Entry Point:**
- Location: `components/solid/src/index.tsx` and package export map in `components/solid/package.json`.
- Triggers: Consumer import `@tsparticles/solid`.
- Responsibilities: Export default `Particles`, `initParticlesEngine`, and `IParticlesProps` type.

## Error Handling

**Strategy:** Fail fast for invalid runtime prerequisites and guard async engine setup boundaries.

**Patterns:**
- Explicit root element validation with thrown error in `apps/solid/src/index.tsx`.
- Guard clause for unresolved resources in `components/solid/src/Particles.tsx` (`if (!container) return;`).
- Provider-level try/catch with rethrow and console output in `components/solid/src/lib/ParticlesProvider.tsx`.

## Cross-Cutting Concerns

**Logging:**
- Minimal runtime logging exists in provider error handling (`console.error`) at `components/solid/src/lib/ParticlesProvider.tsx`.

**Validation:**
- Compile-time validation through strict TypeScript settings in `apps/solid/tsconfig.json` and `components/solid/tsconfig.json`.
- Runtime validation for DOM mount point in `apps/solid/src/index.tsx`.

**Authentication:**
- Not applicable in current architecture; no auth flow detected in `apps/solid/src/` or `components/solid/src/`.

---

*Architecture analysis: 2026-04-10*
