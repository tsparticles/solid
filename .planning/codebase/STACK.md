# Technology Stack

**Analysis Date:** 2026-04-10

## Languages

**Primary:**
- TypeScript (5.x) - Primary implementation language in `components/solid/src/*.ts(x)` and `apps/solid/src/*.ts(x)` (configured in `components/solid/tsconfig.json` and `apps/solid/tsconfig.json`).

**Secondary:**
- JavaScript (ESM configs) - Build and tool config entrypoints in `components/solid/tsup.config.ts`, `components/solid/vitest.config.ts`, and `apps/solid/vite.config.ts`.
- YAML - Workspace/CI configuration in `pnpm-workspace.yaml` and `.github/workflows/nodejs.yml`.

## Runtime

**Environment:**
- Node.js 18+ for CI/build workflows (set in `.github/workflows/nodejs.yml`).
- Browser runtime for the demo app and shipped component output (entrypoint `apps/solid/src/index.tsx`, library entry `components/solid/src/index.tsx`).

**Package Manager:**
- pnpm (workspace standard) declared in `package.json` (`packageManager: pnpm@10.33.0...`).
- CI currently installs pnpm v8 in `.github/workflows/nodejs.yml`; keep local and CI aligned when changing tooling.
- Lockfile: present (`pnpm-lock.yaml`).

## Frameworks

**Core:**
- SolidJS (`solid-js`) - UI runtime for component implementation and sample app (`components/solid/src/Particles.tsx`, `apps/solid/src/App.tsx`).
- tsParticles ecosystem (`@tsparticles/engine`, `tsparticles`, `@tsparticles/configs`) - Particle engine + presets (`components/solid/src/index.tsx`, `apps/solid/src/App.tsx`).

**Testing:**
- Vitest (`vitest`) - Unit/component and SSR tests configured in `components/solid/vitest.config.ts`.
- JSDOM (`jsdom`) - Browser-like test environment configured in `components/solid/vitest.config.ts`.

**Build/Dev:**
- Vite (`vite`, `vite-plugin-solid`) - Demo app dev/build pipeline (`apps/solid/vite.config.ts`, `apps/solid/package.json`).
- tsup + `tsup-preset-solid` - Library bundling and package export generation (`components/solid/tsup.config.ts`).
- Lerna + Nx - Monorepo task orchestration (`lerna.json`, `nx.json`, root `package.json` scripts).

## Key Dependencies

**Critical:**
- `@tsparticles/engine` - Required engine contract for component API and loading (`components/solid/src/IParticlesProps.ts`, `components/solid/src/Particles.tsx`).
- `solid-js` - Required peer and runtime for component consumers (`components/solid/package.json`, `components/solid/src/index.tsx`).
- `@tsparticles/solid` (workspace link in app) - Integrates library into sample app (`apps/solid/package.json`).

**Infrastructure:**
- `typescript` - Type checking and API typing (`components/solid/package.json`, `apps/solid/package.json`).
- `eslint` + `@typescript-eslint/*` - Static analysis rules (`components/solid/.eslintrc`).
- `prettier` + `@tsparticles/prettier-config` - Formatting standard (`components/solid/package.json`).
- `husky` + `@commitlint/*` - Commit hygiene at workspace level (`package.json`).

## Configuration

**Environment:**
- No `.env*` files detected at repository root; runtime feature flags are accessed via `import.meta.env` in `apps/solid/src/index.tsx` and typed in `components/solid/env.d.ts`.
- Build behavior checks CI flags (`CI`, `GITHUB_ACTIONS`) in `components/solid/tsup.config.ts`.

**Build:**
- Workspace and package graph: `pnpm-workspace.yaml`, `lerna.json`, `nx.json`.
- App build config: `apps/solid/vite.config.ts`, `apps/solid/tsconfig.json`.
- Library build/test config: `components/solid/tsup.config.ts`, `components/solid/vitest.config.ts`, `components/solid/tsconfig.json`.

## Platform Requirements

**Development:**
- Use Node.js + pnpm workspace tooling defined by root scripts in `package.json`.
- Use Vite for local app development (`apps/solid/package.json` scripts: `dev`, `start`).

**Production:**
- Library package publishes ESM artifacts from `components/solid/dist` (`components/solid/package.json` fields: `main`, `module`, `types`, `exports`).
- Demo app outputs static assets from Vite build (`apps/solid/package.json` script `build`), suitable for static hosting.

---

*Stack analysis: 2026-04-10*
