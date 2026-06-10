import { createHighlighter, type Highlighter } from "shiki";

/**
 * Single shiki entry point. A warm editorial theme to match the identity rather
 * than a default neon scheme; highlighting happens at build/request time on the
 * server, so no client-side highlighter ships.
 *
 * The highlighter instance is created once and reused across calls (it's
 * expensive to spin up), with the languages and theme we actually use pinned.
 */

let highlighterPromise: Promise<Highlighter> | null = null;

const THEME = "vesper";
const LANGS = ["tsx", "ts", "bash", "json"] as const;

function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: [THEME],
      langs: [...LANGS],
    });
  }
  return highlighterPromise;
}

export async function highlight(code: string, lang = "tsx"): Promise<string> {
  const highlighter = await getHighlighter();
  const resolved = (LANGS as readonly string[]).includes(lang) ? lang : "tsx";
  return highlighter.codeToHtml(code, { lang: resolved, theme: THEME });
}
