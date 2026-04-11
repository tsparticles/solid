# Pitfalls Research

**Domain:** Migration of `@tsparticles/solid` wrapper + demo app to latest dependencies and `tsParticles` v4 beta
**Researched:** 2026-04-10
**Confidence:** HIGH

## Critical Pitfalls

### Pitfall 1: Engine Version Skew Across Workspace Packages

**What goes wrong:**
The wrapper, demo app, and transitive tsParticles packages resolve to different major/beta lines, so behavior differs by package and environment.

**Why it happens:**
Dependency updates are done incrementally per package (or via broad `^` ranges) without enforcing a single coordinated compatibility matrix.

**How to avoid:**
Create a dependency alignment phase that pins/normalizes all tsParticles packages across workspace (`apps/solid`, `components/solid`, root). Add a lockfile sanity check in CI to detect duplicate majors/betas and fail on drift.

**Warning signs:**
`pnpm why` shows multiple `@tsparticles/*` major lines; demo renders differently than tests; type mismatches appear only in one package.

**Phase to address:**
Phase 1 - Dependency Alignment and Compatibility Matrix

---

### Pitfall 2: Wrapper API Drift During Syntax Modernization

**What goes wrong:**
Public props/callback names unintentionally change (or docs and types diverge), causing silent no-ops in consumer apps.

**Why it happens:**
Modernizing Solid/TypeScript syntax is treated as refactor-only work without contract tests; existing docs already show drift (`particlesloaded` vs `particlesLoaded`, `className` vs `class`).

**How to avoid:**
Freeze public API contract up front: define canonical prop names from `IParticlesProps`, add API snapshot/type tests, and update docs in the same PR as code changes. Mark renamed/deprecated aliases explicitly if introduced.

**Warning signs:**
Support issues mention callbacks not firing; demo works but external consumers break; README examples no longer type-check.

**Phase to address:**
Phase 2 - API Contract Lock + Syntax Refactor

---

### Pitfall 3: Lifecycle Regression from Async Init Refactors

**What goes wrong:**
Container initialization and cleanup ordering breaks (double init, missed destroy, callback timing regressions), leading to leaks or flaky behavior.

**Why it happens:**
The current `onMount` + `createResource` + `createEffect(on(...))` chain is fragile; refactors can subtly alter mount/unmount semantics.

**How to avoid:**
Before refactor, add lifecycle tests for mount, unmount, `particlesLoaded` ordering, and `container.destroy()` execution. Keep cleanup semantics explicit and verify with jsdom + SSR tests.

**Warning signs:**
Intermittent test failures around callbacks; memory growth after repeated mount/unmount; canvas remnants after navigation.

**Phase to address:**
Phase 3 - Lifecycle Hardening and Regression Tests

---

### Pitfall 4: CI Toolchain Drift Masks Local Failures

**What goes wrong:**
Local builds pass while CI fails (or vice versa) due to mismatched Node/pnpm majors and deprecated workflow syntax.

**Why it happens:**
Migration focuses on package code first and postpones CI modernization; existing workflow uses outdated patterns and versions.

**How to avoid:**
Update CI in the same modernization stream: align Node/pnpm with workspace policy, replace deprecated GitHub Actions output syntax, and run both library and demo verification jobs.

**Warning signs:**
"Works locally" reports increase; CI-only install errors; lockfile or build artifacts differ by environment.

**Phase to address:**
Phase 4 - CI/Build Pipeline Modernization

---

### Pitfall 5: Beta Adoption Without Compatibility Guardrails

**What goes wrong:**
A beta patch release introduces subtle runtime/type changes that break wrapper assumptions unexpectedly.

**Why it happens:**
Teams treat beta updates as routine semver-safe upgrades and skip dedicated release-note checks and smoke tests.

**How to avoid:**
For every beta bump, require: (1) changelog scan, (2) targeted smoke run in demo, (3) wrapper API regression tests, (4) explicit update note in migration log. Keep beta ranges constrained and deliberate.

**Warning signs:**
Breakages appear after lockfile refresh without direct code edits; only some environments fail due to transitive beta movement.

**Phase to address:**
Phase 1 and ongoing in every dependency bump PR

---

### Pitfall 6: Export Surface Inconsistency (Provider Pattern Stays Internal)

**What goes wrong:**
The codebase modernizes internals but still does not export provider primitives, so consumers continue expensive per-instance initialization patterns.

**Why it happens:**
Migration scope is interpreted as "dependency and syntax only," leaving known API export gaps unresolved.

**How to avoid:**
Treat provider exports as modernization-critical, not feature work: export `ParticlesProvider` and `useParticlesEngine`, add usage docs, and integration tests validating package-level imports.

**Warning signs:**
Consumer examples repeat engine init in each component; performance issues scale with particle instance count.

**Phase to address:**
Phase 2 - Public API Consolidation

---

### Pitfall 7: Demo-Only Success Interpreted as Migration Complete

**What goes wrong:**
Migration is marked done after demo rendering works, while key failure paths (SSR, remote URL errors, cleanup, callback sequencing) remain unvalidated.

**Why it happens:**
Current test suite is minimal and mostly synchronous markup checks; no integration/error-path coverage exists.

**How to avoid:**
Define "done" gates that require client + SSR + async/error-path tests, plus a scripted demo smoke run. Block merge until all gates pass.

**Warning signs:**
Post-merge regressions in real consumer apps despite green baseline tests; bugs cluster in async and edge-case scenarios.

**Phase to address:**
Phase 5 - Verification Gates and Release Readiness

---

## Technical Debt Patterns

Shortcuts that seem reasonable but create long-term problems.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Bumping only top-level deps and trusting transitive resolution | Fast upgrade PR | Hidden version skew and non-reproducible failures | Never for beta-line migrations |
| Refactoring syntax without contract tests | Quick modernization velocity | Silent API breakage and consumer trust erosion | Only for internal-only modules with no public surface |
| Leaving CI updates for "later" | Smaller first PR | Persistent local-vs-CI drift and flaky release pipeline | Acceptable only for draft spikes, not merge-to-main work |

## Integration Gotchas

Common mistakes when connecting to external services.

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| `@tsparticles/*` package family | Mixing beta and stable majors across wrapper/app | Align to one compatibility matrix and verify lockfile uniqueness |
| Solid wrapper public API | Relying on README examples not backed by `IParticlesProps` | Treat exported types as source of truth; docs must be generated/validated against types |
| Remote config via `url` | Loading arbitrary remote JSON in demos and examples | Prefer local `options`; if `url` is used, document allowlist/validation requirement |

## Performance Traps

Patterns that work at small scale but fail as usage grows.

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Per-component `tsParticles.load(...)` initialization | CPU spikes and slower startup with more particle widgets | Export/provider-first shared engine pattern; document as default | Multi-instance pages (2+ complex configs) |
| Demo auto-transition timers mutating config | Extra redraw churn and lifecycle leaks on navigation | Move timer into managed lifecycle with cleanup or user-triggered transitions | Any route-mount/unmount navigation scenario |
| No regression tests for async init paths | Late discovery of runtime regressions | Add targeted integration tests for init failure/success and callback timing | First non-trivial dependency bump after migration |

## Security Mistakes

Domain-specific security issues beyond general web security.

| Mistake | Risk | Prevention |
|---------|------|------------|
| Accepting unvalidated remote `url` config sources | Untrusted config ingestion and behavior manipulation | Add docs + optional validator hook + safe local-options examples |
| Logging raw initialization errors in production | Internal details leaking to client logs | Gate logs by environment or use injectable/redacting logger |
| Treating demo defaults as production-safe guidance | Consumers copy insecure patterns | Label demo-only behaviors and add production-safe snippets |

## UX Pitfalls

Common user experience mistakes in this domain.

| Pitfall | User Impact | Better Approach |
|---------|-------------|-----------------|
| Silent prop mismatch due to API/docs drift | Developers think library is broken; callbacks appear random | Runtime dev warnings for unknown/deprecated props + docs parity checks |
| Async load state not surfaced clearly | Perceived blank/frozen UI while particles initialize | Expose clear loading/failure hooks and include robust examples |
| Breaking legacy usage patterns without migration notes | Upgrade friction and churn for maintainers | Publish concise migration guide with before/after snippets |

## "Looks Done But Isn't" Checklist

Things that appear complete but are missing critical pieces.

- [ ] **Dependency upgrade:** All `@tsparticles/*` lines aligned across workspace and lockfile checked for duplicate majors/betas.
- [ ] **API modernization:** Public props/callbacks are contract-tested and docs match `IParticlesProps` exactly.
- [ ] **Lifecycle safety:** Unmount path verifies `container.destroy()` and no timer/resource leaks remain.
- [ ] **CI parity:** Node/pnpm versions and workflow syntax match local toolchain, with no deprecated actions patterns.
- [ ] **Verification depth:** Client + SSR + async/error integration tests pass, not just static markup checks.

## Recovery Strategies

When pitfalls occur despite prevention, how to recover.

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| Version skew introduced after bump | MEDIUM | Freeze versions, regenerate lockfile, add dedupe guard, rerun full matrix |
| Public API drift shipped | HIGH | Reintroduce backward-compatible aliases or patch release, update docs/tests, publish migration note |
| Lifecycle cleanup regression | MEDIUM | Add failing lifecycle tests first, fix ordering/cleanup, validate repeated mount/unmount scenarios |

## Pitfall-to-Phase Mapping

How roadmap phases should address these pitfalls.

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| Engine version skew across workspace packages | Phase 1 - Dependency Alignment | Lockfile has single compatible major/beta line per tsParticles package family |
| Wrapper API drift during modernization | Phase 2 - API Contract Lock | Contract/type tests pass and docs parity checklist is green |
| Lifecycle regression from async init refactors | Phase 3 - Lifecycle Hardening | Mount/unmount + callback-order tests pass consistently |
| CI toolchain drift masks failures | Phase 4 - CI Modernization | Same Node/pnpm in CI and local; pipeline stable across reruns |
| Demo-only success interpreted as done | Phase 5 - Release Readiness Gates | Full verification suite (client/SSR/integration/demo smoke) required for completion |

## Sources

- `.planning/PROJECT.md`
- `.planning/codebase/CONCERNS.md`
- `.planning/codebase/TESTING.md`

---
*Pitfalls research for: `@tsparticles/solid` v4-beta modernization*
*Researched: 2026-04-10*
