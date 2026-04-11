# Feature Research

**Domain:** Library modernization and tsParticles v4 beta migration
**Researched:** 2026-04-10
**Confidence:** MEDIUM

## Feature Landscape

### Table Stakes (Users Expect These)

Features maintainers and consumers assume in a successful migration. Missing these = migration is not production-ready.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Dependency and version alignment across workspace | Modernization work is expected to remove version skew and drift | MEDIUM | Align `@tsparticles/*` v4 beta line and toolchain versions across app/package/CI; blocks most downstream validation |
| Public API compatibility with explicit stability guarantees | Consumers expect upgrades to avoid unnecessary rewrites | HIGH | Keep current `Particles` behavior and prop contract stable; only intentional breaks with migration notes |
| Build/test/CI parity on current toolchain | A migration is expected to be verifiably green locally and in CI | MEDIUM | Update CI from deprecated patterns and match workspace Node/pnpm/tooling versions |
| Regression coverage for lifecycle and integration-critical paths | Maintainers expect known fragile areas to be protected before release | HIGH | Add tests for mount/unmount cleanup, callback ordering, URL/error paths, and provider usage |
| Documentation and typed API parity | Library users expect docs/examples to match exported types and runtime behavior | LOW | Resolve prop naming drift and ensure README/examples align with `IParticlesProps` and package exports |
| Release readiness checks for beta adoption | Beta migration must still ship with predictable quality gates | MEDIUM | Require changelog, migration notes, semver intent, and prepublish validation |

### Differentiators (Competitive Advantage)

Capabilities that accelerate maintainer confidence and adoption quality beyond baseline migration success.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| First-class shared engine API export (`ParticlesProvider`, `useParticlesEngine`) | Enables scalable multi-instance usage with less duplicate init cost | MEDIUM | Existing implementation already present; differentiation is making it official, tested, and documented |
| Compatibility matrix with automated smoke validation | Reduces upgrade uncertainty for consumers across Node/Solid/tsParticles combinations | HIGH | Matrix CI for supported versions and demo smoke tests improves trust in beta line |
| Consumer-focused migration guide with before/after snippets | Speeds adoption and lowers support load during v4 beta transition | LOW | Include changed defaults, deprecated patterns, and recommended migration path |
| Guardrails for risky runtime inputs (remote URL config) | Improves safe adoption posture without heavy framework changes | MEDIUM | Document allowlist policy, optional validator hook, and safe local-options-first patterns |
| Package metadata stability checks in CI | Prevents accidental publish drift from local build side effects | MEDIUM | Assert `package.json`/exports determinism after build to avoid release-time surprises |

### Anti-Features (Commonly Requested, Often Problematic)

Changes that appear attractive during migration but increase risk or violate milestone intent.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|-----------------|-------------|
| Net-new particle capability work during migration | Feels efficient to bundle feature work with upgrade | Expands scope and obscures regression root causes | Freeze net-new behavior; ship modernization first, feature work later |
| Cross-framework or monorepo architecture rewrite | Seen as a chance to "clean slate" | High risk, delayed migration, unnecessary breakage | Preserve current structure; do focused compatibility/tooling updates |
| Silent API renames without compatibility layer | Simplifies internal cleanup | Breaks consumers and increases support burden | Maintain aliases/deprecation notices or document explicit break with migration guidance |
| Permissive remote config handling by default | Makes demos easier quickly | Raises security and reliability risks in consumer apps | Default to local options patterns and optional URL validation hooks |

## Feature Dependencies

```text
Dependency and version alignment
    └──requires──> Build/test/CI parity
                           └──requires──> Regression coverage for lifecycle/integration
                                                  └──requires──> Release readiness checks

Documentation and typed API parity
    └──requires──> Public API compatibility with explicit stability guarantees

First-class shared engine API export
    └──enhances──> Public API compatibility with explicit stability guarantees
    └──enhances──> Regression coverage for lifecycle/integration

Compatibility matrix with automated smoke validation
    └──enhances──> Release readiness checks

Net-new particle capability work during migration
    └──conflicts──> Regression coverage and release readiness focus
```

### Dependency Notes

- **Release readiness requires regression coverage:** without validated lifecycle/integration tests, beta migration quality cannot be asserted.
- **API stability depends on docs/type parity:** consumers only experience stability when docs, types, and runtime behavior stay aligned.
- **Version alignment precedes meaningful testing:** if app/package/CI toolchains diverge, test results are not trustworthy.
- **Shared engine export is a quality accelerator:** it is not strictly required to migrate, but materially improves performance and maintainability outcomes.

## MVP Definition

### Launch With (Milestone-MVP)

- [ ] Dependency and version alignment across workspace and CI — core modernization outcome
- [ ] Public API compatibility plus docs/type parity — protects downstream consumers
- [ ] Green build/test/CI with added lifecycle/integration regression coverage — quality gate for beta migration

### Add After Validation (Post-MVP hardening)

- [ ] First-class shared engine API export + docs/examples — after baseline migration is stable
- [ ] Guardrails for risky runtime inputs and environment-aware logging — after compatibility baseline is proven

### Future Consideration (Next milestones)

- [ ] Expanded compatibility matrix breadth (more versions/platforms) — after real adopter feedback
- [ ] Additional tooling automation around release telemetry/support diagnostics — after initial v4 beta adoption

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Dependency and version alignment across workspace | HIGH | MEDIUM | P1 |
| Public API compatibility with explicit stability guarantees | HIGH | HIGH | P1 |
| Build/test/CI parity on current toolchain | HIGH | MEDIUM | P1 |
| Regression coverage for lifecycle and integration-critical paths | HIGH | HIGH | P1 |
| Documentation and typed API parity | HIGH | LOW | P1 |
| Release readiness checks for beta adoption | HIGH | MEDIUM | P1 |
| First-class shared engine API export | MEDIUM | MEDIUM | P2 |
| Compatibility matrix with automated smoke validation | MEDIUM | HIGH | P2 |
| Migration guide with before/after snippets | MEDIUM | LOW | P2 |
| Guardrails for risky runtime inputs | MEDIUM | MEDIUM | P2 |
| Package metadata stability checks in CI | MEDIUM | MEDIUM | P2 |

**Priority key:**
- P1: Must have for modernization milestone completion
- P2: Should have quality accelerators for adoption confidence
- P3: Defer to later milestones

## Sources

- `.planning/PROJECT.md`
- `.planning/codebase/CONCERNS.md`
- `.planning/codebase/CONVENTIONS.md`

---
*Feature research for: tsParticles Solid v4 modernization/migration milestone*
*Researched: 2026-04-10*
