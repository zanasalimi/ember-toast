"use client";

import { useState } from "react";
import { toast } from "@embertoast/react";

/**
 * Copy-to-clipboard control for a code block. Dogfoods the library: a successful
 * copy fires `toast.success` (rendered by the playground's <Toaster/> on the home
 * page), with a local label swap as the always-visible fallback.
 */
export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 1400);
    } catch {
      toast.error("Couldn't copy");
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label="Copy code"
      className="rounded-md border border-white/15 px-2 py-1 font-mono text-[11px] text-white/60 transition hover:border-ember hover:text-ember"
    >
      {copied ? "copied" : "copy"}
    </button>
  );
}
