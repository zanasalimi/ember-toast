import { highlight } from "@/lib/shiki";

/**
 * Server component code block with shiki syntax highlighting. Editorial code
 * presentation: a hairline-framed surface, mono type, no traffic-light chrome.
 *
 * TODO(M6): copy button (client island), filename tab, line highlighting.
 */
export async function CodeBlock({
  code,
  lang = "tsx",
}: {
  code: string;
  lang?: string;
}) {
  const html = await highlight(code, lang);

  return (
    <figure className="overflow-hidden rounded-[12px] border border-rule bg-[#1a1714] text-sm">
      <div
        className="overflow-x-auto p-5 [&_pre]:!bg-transparent [&_pre]:font-mono"
        // shiki returns trusted, server-generated markup
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </figure>
  );
}
