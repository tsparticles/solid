# Coding Conventions

**Analysis Date:** 2026-04-10

## Naming Patterns

**Files:**
- Use PascalCase for component and type files in `components/solid/src/` (for example `components/solid/src/Particles.tsx`, `components/solid/src/IParticlesProps.ts`, `components/solid/src/lib/ParticlesProvider.tsx`).
- Use lowercase entry filenames for package boundaries (for example `components/solid/src/index.tsx`, `apps/solid/src/index.tsx`).
- Use `*.test.tsx` for tests in `components/solid/test/` (for example `components/solid/test/index.test.tsx`, `components/solid/test/server.test.tsx`).

**Functions:**
- Use camelCase for functions and callbacks (for example `initParticlesEngine` in `components/solid/src/index.tsx`, `useParticlesEngine` in `components/solid/src/lib/ParticlesProvider.tsx`).
- Use PascalCase for Solid components (for example `Particles` in `components/solid/src/Particles.tsx`, `App` in `apps/solid/src/App.tsx`).

**Variables:**
- Use camelCase for local constants and signals (for example `config` in `components/solid/src/Particles.tsx`, `root` in `apps/solid/src/index.tsx`, `parsed_options` in `components/solid/tsup.config.ts`).
- Prefix intentionally ignored values with `_` to satisfy lint rules (`@typescript-eslint/no-unused-vars` configured in `components/solid/.eslintrc`).

**Types:**
- Use `I`-prefixed interface names for public props (for example `IParticlesProps` in `components/solid/src/IParticlesProps.ts`).
- Use explicit return types on exported APIs when possible (for example `Resource<true>` in `components/solid/src/index.tsx`, `ParticlesContextValue` in `components/solid/src/lib/ParticlesProvider.tsx`).

## Code Style

**Formatting:**
- Tool used: Prettier (`prettier` and `@tsparticles/prettier-config` in `components/solid/package.json`).
- Key settings: project editor defaults are 2 spaces, LF, UTF-8, and final newline (`components/solid/.editorconfig`).
- Preserve intentional formatting with inline directives only when required (`// prettier-ignore` in `components/solid/src/index.tsx` and `components/solid/src/IParticlesProps.ts`).
- Keep style consistent per package: `components/solid/src/*` currently uses double quotes and semicolons, while `apps/solid/src/*` currently uses single quotes and semicolons.

**Linting:**
- Tool used: ESLint with TypeScript parser (`components/solid/.eslintrc`).
- Key rules from `components/solid/.eslintrc`:
  - `prefer-const`: warn
  - `no-console`: warn
  - `no-debugger`: warn
  - `@typescript-eslint/no-unused-vars`: warn with `_` ignore patterns
  - `@typescript-eslint/no-unnecessary-type-assertion`: warn
  - `@typescript-eslint/no-unnecessary-condition`: warn
  - `@typescript-eslint/no-useless-empty-export`: warn
  - `no-only-tests/no-only-tests`: warn
  - `eslint-comments/no-unused-disable`: warn
- Enforce lint in package lifecycle via scripts (`lint`, `lint:ci`, `lint:code` in `components/solid/package.json`).

## Import Organization

**Order:**
1. External runtime packages first (for example `@tsparticles/engine`, `solid-js`, `vitest` in `components/solid/src/Particles.tsx` and `components/solid/test/index.test.tsx`).
2. Type-only imports next to related runtime imports using `import type` (for example `import type { IParticlesProps }` in `components/solid/src/index.tsx`).
3. Relative local modules last (for example `./Particles` in `components/solid/src/index.tsx`, `../src` in `components/solid/test/server.test.tsx`).

**Path Aliases:**
- Not detected in tsconfig path mappings (`components/solid/tsconfig.json`, `apps/solid/tsconfig.json`).
- Workspace package import is used as package boundary (`@tsparticles/solid` in `apps/solid/src/App.tsx`).

## Error Handling

**Patterns:**
- Throw explicit errors for invalid runtime prerequisites (for example missing root element guard in `apps/solid/src/index.tsx`).
- Guard context-dependent hooks and fail fast (for example `useParticlesEngine` throws when provider is missing in `components/solid/src/lib/ParticlesProvider.tsx`).
- Wrap async initialization in `try/catch` and rethrow after logging (`components/solid/src/lib/ParticlesProvider.tsx`).
- Use early return guard clauses in reactive effects (for example `if (!container) return;` in `components/solid/src/Particles.tsx`).

## Logging

**Framework:** console

**Patterns:**
- Use `console.error` for initialization failure paths only (`components/solid/src/lib/ParticlesProvider.tsx`).
- Use `console.log` in build tooling for local diagnostics (`components/solid/tsup.config.ts`).
- Keep runtime UI code mostly log-free (`components/solid/src/Particles.tsx`, `apps/solid/src/App.tsx`).

## Comments

**When to Comment:**
- Add targeted comments for framework constraints and mode-specific behavior (`components/solid/vitest.config.ts`).
- Document build-side side effects and options (`components/solid/tsup.config.ts`).

**JSDoc/TSDoc:**
- Use concise block comments for exported component/hook contracts (for example JSDoc above `Particles` in `components/solid/src/Particles.tsx` and `useParticlesEngine` in `components/solid/src/lib/ParticlesProvider.tsx`).

## Function Design

**Size:**
- Keep UI components and exported helpers short and focused (for example `initParticlesEngine` in `components/solid/src/index.tsx`, `Particles` in `components/solid/src/Particles.tsx`).

**Parameters:**
- Prefer single typed props object for components (`props: IParticlesProps` in `components/solid/src/Particles.tsx`).
- Prefer callback injection for extensibility (`cb` in `initParticlesEngine` at `components/solid/src/index.tsx`, `particlesInit` in `components/solid/src/lib/ParticlesProvider.tsx`).

**Return Values:**
- Return Solid resources/signals directly for reactivity-driven flow (`Resource<true>` in `components/solid/src/index.tsx`, `engine` resource in `components/solid/src/lib/ParticlesProvider.tsx`).
- Return JSX from components and keep rendering pure (`components/solid/src/Particles.tsx`, `apps/solid/src/App.tsx`).

## Module Design

**Exports:**
- Use default export for primary component plus named exports for helpers/types (`components/solid/src/index.tsx`, `components/solid/src/Particles.tsx`).
- Expose minimal public API from package root (`components/solid/src/index.tsx`).

**Barrel Files:**
- Use package-level barrel entry (`components/solid/src/index.tsx`) as the canonical import surface.
- Avoid deep imports from consumers; import from `@tsparticles/solid` (`apps/solid/src/App.tsx`).

---

*Convention analysis: 2026-04-10*
