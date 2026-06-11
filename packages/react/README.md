# @embertoast/react

Headless-first toast primitive for React. Accessible, promise-aware, swipe-dismissable, zero runtime dependencies. Bring your own markup, or use the polished default.

```bash
npm i @embertoast/react
```

```tsx
import { toast, Toaster } from "@embertoast/react";
import "@embertoast/react/styles.css"; // omit if you render headless

function App() {
  return (
    <>
      <button onClick={() => toast.success("Saved")}>Save</button>
      <Toaster position="bottom-right" />
    </>
  );
}
```

`toast()` is a standalone function backed by an external store — call it from anywhere. `<Toaster/>` is the single subscriber that renders. Full API, options, and the accessibility model are in the [repository docs](https://github.com/zanasalimi/ember-toast/blob/main/docs/API.md).
