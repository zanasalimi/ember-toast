import { codeToHtml } from "shiki";

/**
 * Single shiki entry point. A warm editorial theme to match the identity rather
 * than a default neon scheme; highlighting happens at build/request time on the
 * server, so no client-side highlighter ships.
 *
 * TODO(M6): cache the highlighter instance; pin a custom theme to the ember palette.
 */
export async function highlight(code: string, lang = "tsx"): Promise<string> {
  return codeToHtml(code, {
    lang,
    theme: "vesper",
  });
}
