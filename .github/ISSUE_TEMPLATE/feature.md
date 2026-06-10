---
name: Feature request
about: Propose a change to the API or behavior
title: "feat: "
labels: enhancement
---

## The problem

What can't you do today, or what's awkward? Lead with the use case, not the solution.

## Proposed API

If it touches the public surface, show the call site you'd want:

```tsx
toast.something("…", { /* … */ });
// or
<Toaster newProp />
```

## Why it belongs in the core

This library is deliberately small and zero-dependency. Make the case that this is a primitive concern, not something a consumer can compose on top.

## Tradeoffs you can see

Bundle size, accessibility implications, new options on `ToastOptions`, anything that complicates the mental model.

## Alternatives

What you've tried, or how other libraries handle it.
