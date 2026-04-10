# Testing Patterns

**Analysis Date:** 2026-04-10

## Test Framework

**Runner:**
- Vitest `^1.6.0` (`components/solid/package.json`).
- Config: `components/solid/vitest.config.ts`.

**Assertion Library:**
- Vitest built-in assertions (`expect`) used in `components/solid/test/index.test.tsx` and `components/solid/test/server.test.tsx`.

**Run Commands:**
```bash
pnpm --filter @tsparticles/solid test          # Run configured test tasks (client + ssr script entry)
pnpm --filter @tsparticles/solid test:client   # Run client tests via Vitest (jsdom)
pnpm --filter @tsparticles/solid test:ssr      # Run SSR tests (node mode)
```

## Test File Organization

**Location:**
- Separate test directory per package: `components/solid/test/`.

**Naming:**
- Use `*.test.tsx` naming (for example `components/solid/test/index.test.tsx`, `components/solid/test/server.test.tsx`).

**Structure:**
```
components/solid/
├── src/
└── test/
    ├── index.test.tsx
    └── server.test.tsx
```

## Test Structure

**Suite Organization:**
```typescript
describe("environment", () => {
    it("runs on client", () => {
        expect(typeof window).toBe("object");
        expect(isServer).toBe(false);
    });
});

describe("Particles", () => {
    it("renders a Particles-component", () => {
        createRoot(() => {
            const container = (<Particles />) as HTMLDivElement;
            expect(container.outerHTML).toBe('<div id="tsparticles"><canvas></canvas></div>');
        });
    });
});
```
Source: `components/solid/test/index.test.tsx`.

**Patterns:**
- Setup pattern: rely on environment from `vitest.config.ts` mode (`jsdom` for client, `node` for SSR).
- Teardown pattern: no explicit hooks currently; tests depend on Solid root scoping (`createRoot` in `components/solid/test/index.test.tsx`).
- Assertion pattern: deterministic string equality checks for rendered markup (`outerHTML` and `renderToString` expectations in both test files).

## Mocking

**Framework:** Vitest mocking API available, but not used in current tests.

**Patterns:**
```typescript
// Not detected in current codebase:
// vi.mock("module", () => ({ ... }))
```

**What to Mock:**
- Mock external engine-loading boundaries when adding unit tests for async init paths (`import("@tsparticles/engine")` in `components/solid/src/lib/ParticlesProvider.tsx`).

**What NOT to Mock:**
- Do not mock Solid rendering primitives for baseline component rendering checks; current tests validate real JSX output (`components/solid/test/index.test.tsx`, `components/solid/test/server.test.tsx`).

## Fixtures and Factories

**Test Data:**
```typescript
const string = renderToString(() => <Particles />);
expect(string).toBe('<div id="tsparticles"><canvas style=""></canvas></div>');
```
Source: `components/solid/test/server.test.tsx`.

**Location:**
- Inline literals inside test files in `components/solid/test/`; no shared fixtures/factories detected.

## Coverage

**Requirements:** None enforced in current Vitest config (`components/solid/vitest.config.ts` has no `coverage` block).

**View Coverage:**
```bash
Not configured in repository scripts or vitest config
```

## Test Types

**Unit Tests:**
- Component render and environment-flag tests for package entry behavior (`components/solid/test/index.test.tsx`, `components/solid/test/server.test.tsx`).

**Integration Tests:**
- Not detected (no tests validating real `tsParticles.load` integration or async initialization flow in `components/solid/src/Particles.tsx` / `components/solid/src/lib/ParticlesProvider.tsx`).

**E2E Tests:**
- Not used (no Playwright/Cypress/Webdriver configuration detected in repository root).

## Common Patterns

**Async Testing:**
```typescript
// Current tests are synchronous render checks.
// Async pattern is not present in `components/solid/test/*.test.tsx`.
```

**Error Testing:**
```typescript
// Not detected in current tests.
// Candidate error path exists in source:
// throw new Error("useParticlesEngine must be used within a ParticlesProvider")
// in `components/solid/src/lib/ParticlesProvider.tsx`.
```

---

*Testing analysis: 2026-04-10*
