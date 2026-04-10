# tsParticles Solid v4 Modernization

## What This Is

This project modernizes the existing `@tsparticles/solid` integration and its demo app to the latest ecosystem versions, with priority on the `tsParticles` 4.0.0 beta packages under active development. It is for maintainers of the Solid wrapper and contributors who need a stable, up-to-date baseline for future feature work. The goal is to keep the current package behavior while upgrading tooling and code syntax to current standards.

## Core Value

Keep `@tsparticles/solid` fully working while upgrading the codebase to the latest compatible dependencies and modern syntax, centered on `tsParticles` 4.0.0 beta.

## Requirements

### Validated

- ✓ Solid wrapper package exists and exports a typed `Particles` API for consumers — existing (`components/solid/src/index.tsx`, `components/solid/src/IParticlesProps.ts`)
- ✓ Demo application loads and renders `tsParticles` configuration through the local workspace package — existing (`apps/solid/src/App.tsx`)
- ✓ Monorepo build/test workflow exists with pnpm + lerna/nx + vitest/vite tooling — existing (`package.json`, `components/solid/package.json`, `apps/solid/package.json`)

### Active

- [ ] Upgrade dependencies to latest compatible versions across workspace, with special focus on `tsParticles` 4.0.0 beta package alignment
- [ ] Migrate legacy code patterns to modern TypeScript/Solid syntax while preserving behavior and public API compatibility
- [ ] Update build/test/CI configuration to match upgraded dependencies and remove version drift
- [ ] Verify demo app and library tests still pass after migration

### Out of Scope

- New product features unrelated to modernization (new visual particle capabilities, new app surfaces) — focus is stabilization and migration
- Cross-framework rewrites or major architectural replacement — this effort keeps the Solid package and current monorepo structure

## Context

This is a brownfield monorepo with an existing codebase map in `.planning/codebase/`. The library package in `components/solid/` already provides a working Solid wrapper over `tsParticles`, and `apps/solid/` is a working integration demo. The main request is upgrade/migration work: move to current package versions, adopt `tsParticles` 4.0.0 beta, and modernize syntax without breaking established behavior.

## Constraints

- **Tech stack**: Keep the existing monorepo/tooling direction (pnpm workspace, lerna/nx, Vite, Vitest, TypeScript, Solid) — minimizes migration risk and leverages existing workflows
- **Compatibility**: Preserve current public behavior/API shape where possible — consumers should not need unnecessary rewrites
- **Dependency policy**: Adopt latest compatible package versions, including `tsParticles` 4.0.0 beta line — this is the explicit primary objective
- **Quality gate**: Build and test flows must remain green after migration — modernization is not complete without verification

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Prioritize dependency modernization first | User stated the primary objective is updating to latest versions and v4 beta | — Pending |
| Treat this as brownfield continuation | Existing codebase and map already exist; effort extends current package | — Pending |
| Keep planning mode in auto/YOLO with quick depth | Matches `--auto` flow and selected config for fast execution | — Pending |

---
*Last updated: 2026-04-10 after initialization*
