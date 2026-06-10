# @embertoast/core

Framework-agnostic toast store and the imperative `toast()` facade. Zero runtime dependencies.

This is the engine: a tiny pub/sub store (queue, ids, timers, pause/resume) plus the `toast()` callable that mutates it. It carries no rendering and no React. Most apps should install [`@embertoast/react`](https://www.npmjs.com/package/@embertoast/react), which re-exports `toast` and provides `<Toaster/>`.

Install this package directly only to build an alternative renderer (vanilla, Vue, Svelte) against the shared store.

```ts
import { createToastStore, toast } from "@embertoast/core";

const id = toast.success("Saved");
toast.dismiss(id);
```

See the [repository README](../../README.md) for the full API and architecture.
