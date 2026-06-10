# Contributing to embertoast

Thanks for taking the time. This is a small, deliberately-scoped library — the bar for changes is "does it make the primitive more correct, more accessible, or smaller," not "does it add a feature."

## Ground rules

- **Accessibility is not negotiable.** A change that announces a toast incorrectly, steals focus, or animates through `prefers-reduced-motion` will not be merged. If you touch the render path, read [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) §Accessibility first.
- **Zero runtime dependencies in `@embertoast/core` and `@embertoast/react`.** New `dependencies` entries in either package need a written justification in the PR and will usually be rejected. `devDependencies` are fine.
- **Size is a feature.** `size-limit` runs in CI. If your change grows the bundle, the PR must say by how much and why it's worth it.
- **Types are the contract.** No `any` without a comment explaining the escape. The public surface is strictly typed; keep it that way.

## Repository layout

```
packages/core    framework-agnostic store + toast() facade (zero dep)
packages/react   React binding: useToasts, <Toaster/>, <ToastItem/>
apps/docs        Next.js docs site + live playground (dogfoods the library)
docs/            ARCHITECTURE, DECISIONS, ROADMAP, FEATURES, API
```

Tests live beside the package they cover.

## Setup

```bash
pnpm install
pnpm build         # core + react + docs via turbo
pnpm test          # vitest unit suites
pnpm test:e2e      # playwright (swipe, animation, reflow)
pnpm typecheck
pnpm size          # size-limit gate
```

To work on the docs/playground:

```bash
pnpm docs:dev      # http://localhost:3000
# or
docker compose up  # same, containerized
```

## Workflow

1. Open an issue first for anything beyond a typo or an obvious bug fix. Scope is intentional — let's agree the change belongs before you build it.
2. Branch from `main`.
3. Make the change with tests beside it. Behavior changes without tests will be sent back.
4. **Add a changeset:** `pnpm changeset`. Pick the bump (patch/minor/major) and write a one-line, user-facing summary. Releases are automated from these.
5. Run `pnpm test`, `pnpm typecheck`, and `pnpm size` locally before pushing.
6. Open a PR. Keep it to one concern.

## Commit convention

[Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`, `perf:`, `build:`, `ci:`. Subject in the imperative mood, ≤ ~50 characters. Add a body only when the *why* isn't obvious from the diff. One concern per commit.

## What gets merged fast

- Accessibility fixes with a reproduction.
- Bundle-size reductions.
- Correctness fixes for timers, FLIP reflow, or swipe thresholds with a failing test that the fix turns green.

## What needs discussion first

- New public API surface.
- New options on `ToastOptions` or `<Toaster/>`.
- Anything touching the animation model or the queue policy.
