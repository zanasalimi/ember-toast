# Changesets

This folder holds the unreleased change notes that drive versioning and the changelog.

Add one whenever you change `@embertoast/core` or `@embertoast/react`:

```bash
pnpm changeset
```

Pick the semver bump (patch / minor / major) and write a single, user-facing line — the same line that ends up in the changelog and the GitHub release. The two published packages are versioned together (a `fixed` group), so a bump to one bumps both.

On merge to `main`, the release workflow opens (or updates) a "Version Packages" PR. Merging that PR consumes the changesets, bumps versions, updates each `CHANGELOG.md`, and publishes to npm with provenance.

The `docs` app is in `ignore` — it never publishes.

More: https://github.com/changesets/changesets
