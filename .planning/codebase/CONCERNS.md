# Codebase Concerns

**Analysis Date:** 2026-04-10

## Tech Debt

**Public API split between implemented and exported features:**
- Issue: Provider-based engine sharing exists but is not exported from the package entrypoint, so consumers cannot use the documented shared-engine pattern.
- Files: `components/solid/src/lib/ParticlesProvider.tsx`, `components/solid/src/index.tsx`, `components/solid/RESOURCE_PATTERN.md`
- Impact: Duplicate initialization patterns remain in downstream apps, increasing setup complexity and inconsistent usage paths.
- Fix approach: Export `ParticlesProvider` and `useParticlesEngine` from `components/solid/src/index.tsx` and add integration tests proving package-level access.

**API surface drift between docs and implementation:**
- Issue: README documents `init`, `className`, `canvasClassName`, and lowercase `particlesloaded`, while runtime props use `particlesLoaded`, `class`, and `canvasClass`.
- Files: `components/solid/README.md`, `README.md`, `components/solid/src/IParticlesProps.ts`, `components/solid/src/Particles.tsx`
- Impact: Consumers implement incorrect props, causing silent no-op behavior and support burden.
- Fix approach: Align docs to `IParticlesProps` exactly and add a docs-validation checklist tied to release flow.

**CI/workflow implementation debt:**
- Issue: GitHub Actions workflow uses deprecated `::set-output` syntax and hardcodes old toolchain versions.
- Files: `.github/workflows/nodejs.yml`, `package.json`
- Impact: Future CI instability and inconsistent local-vs-CI behavior (workspace uses `pnpm@10`, CI installs `pnpm@8`).
- Fix approach: Replace with `$GITHUB_OUTPUT`, align CI pnpm/node versions with workspace constraints, and run matrix builds if legacy support is required.

## Known Bugs

**`container` prop is declared but never populated:**
- Symptoms: Passing `container={{ current }}` receives no assigned container instance after load.
- Files: `components/solid/src/IParticlesProps.ts`, `components/solid/src/Particles.tsx`
- Trigger: Render `<Particles container={refObj} ... />` and inspect `refObj.current` after `particlesLoaded`.
- Workaround: Use `particlesLoaded` callback to capture the container manually.

**Demo app creates unmanaged timer side effect:**
- Symptoms: Timer continues after component unmount and can attempt signal updates on disposed scope.
- Files: `apps/solid/src/App.tsx`
- Trigger: Mount/unmount app quickly or navigate away before timeout fires.
- Workaround: Move `setTimeout` into `onMount` and clear it with `onCleanup`.

## Security Considerations

**Remote config URL is accepted without guardrails:**
- Risk: Arbitrary remote JSON can be loaded when `url` is passed, increasing exposure to untrusted content/config supply risks.
- Files: `components/solid/src/Particles.tsx`, `components/solid/src/IParticlesProps.ts`, `components/solid/README.md`
- Current mitigation: None in wrapper; validation and allowlisting are delegated entirely to consumer code.
- Recommendations: Document allowlist requirement, support optional URL validator hook, and provide safe examples that prefer local `options` objects.

**Error logging may leak internals in production consumers:**
- Risk: Provider logs raw initialization errors to console, which can expose integration details in client logs.
- Files: `components/solid/src/lib/ParticlesProvider.tsx`
- Current mitigation: None at source level beyond generic message prefix.
- Recommendations: Gate logs by environment or allow injectable logger so consumers can redact sensitive error payloads.

## Performance Bottlenecks

**Per-component engine/container initialization path:**
- Problem: Each `<Particles>` mount calls `tsParticles.load(...)` via `createResource`, leading to repeated init work per instance.
- Files: `components/solid/src/Particles.tsx`, `components/solid/src/index.tsx`, `components/solid/src/lib/ParticlesProvider.tsx`
- Cause: Shared provider pattern exists but is disconnected from default component implementation and package exports.
- Improvement path: Wire component to optional context engine, export provider primitives, and document multi-instance best practices as default.

**Demo app forces config mutation on timer:**
- Problem: Unconditional delayed switch from `configs.basic` to `configs.absorbers` triggers extra workload and redraw churn.
- Files: `apps/solid/src/App.tsx`
- Cause: `setTimeout` is used as a demo transition without lifecycle management.
- Improvement path: Make transition user-driven or optional, and clean up timer on unmount.

## Fragile Areas

**Lifecycle coupling in `Particles` mount/effect chain:**
- Files: `components/solid/src/Particles.tsx`
- Why fragile: `createResource` is created inside `onMount`, then observed in `createEffect(on(...))`; future edits can break cleanup ordering or callback timing.
- Safe modification: Preserve `onCleanup(() => container.destroy())` semantics and add tests for mount/unmount plus callback invocation ordering.
- Test coverage: No test currently asserts container destruction or callback lifecycle in `components/solid/test/*.test.tsx`.

**Build script mutates package metadata in non-CI runs:**
- Files: `components/solid/tsup.config.ts`, `components/solid/package.json`
- Why fragile: `preset.writePackageJson(...)` rewrites exports during local builds, causing potential dirty working tree and accidental publish drift.
- Safe modification: Keep generated export fields deterministic and add CI check that `package.json` stays unchanged after build.
- Test coverage: No automated guard currently verifies metadata stability.

## Scaling Limits

**Multi-instance particle usage scales linearly with container count:**
- Current capacity: Not benchmarked in CI; scaling behavior inferred from per-instance `tsParticles.load(...)` usage.
- Limit: Pages with many particle surfaces can incur cumulative CPU/memory costs and longer startup time.
- Scaling path: Prefer one shared engine context (`components/solid/src/lib/ParticlesProvider.tsx`) and reduce duplicate high-cost configs.

## Dependencies at Risk

**Version skew across engine and tooling:**
- Risk: App/demo uses `@tsparticles/engine@^3.9.1` while component dev dependency is `^4.0.0-beta.11`; CI toolchain pins Node 18 and pnpm 8 while workspace declares pnpm 10.
- Impact: Inconsistent behavior between local development, demo app, and CI; elevated risk of subtle compatibility regressions.
- Migration plan: Align engine versions across `apps/solid/package.json` and `components/solid/package.json`, then update `.github/workflows/nodejs.yml` to the same major runtime/package-manager versions used locally.

## Missing Critical Features

**No runtime validation or warnings for mutually problematic props:**
- Problem: Invalid combinations (e.g., malformed `url`, empty `options`, incompatible callbacks) are forwarded without wrapper-level diagnostics.
- Blocks: Faster troubleshooting and safer adoption in consumer applications.

**No first-class exported provider API despite existing implementation:**
- Problem: Shared-engine architecture is implemented in source but not part of public exports.
- Blocks: Efficient multi-instance usage and standardized app-level initialization flows.

## Test Coverage Gaps

**Lifecycle and cleanup behavior untested:**
- What's not tested: `container.destroy()` execution on unmount and callback sequencing for `particlesLoaded`.
- Files: `components/solid/src/Particles.tsx`, `components/solid/test/index.test.tsx`, `components/solid/test/server.test.tsx`
- Risk: Memory leaks or regression in cleanup semantics can ship unnoticed.
- Priority: High

**Public API contract and docs parity untested:**
- What's not tested: Prop name parity between docs and exported types; provider export availability.
- Files: `components/solid/README.md`, `README.md`, `components/solid/src/IParticlesProps.ts`, `components/solid/src/index.tsx`
- Risk: Breaking developer experience without compile/test failures.
- Priority: High

**Integration behavior (URL loading and error paths) untested:**
- What's not tested: Failures from remote `url`, engine init errors in provider, and recovery behavior.
- Files: `components/solid/src/Particles.tsx`, `components/solid/src/lib/ParticlesProvider.tsx`, `components/solid/test/*.test.tsx`
- Risk: Runtime-only failures in production environments.
- Priority: Medium

---

*Concerns audit: 2026-04-10*
