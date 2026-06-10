import { highlight } from "@/lib/shiki";
import { CopyButton } from "./copy-button";

/**
 * Server component code block with shiki syntax highlighting. Editorial code
 * presentation: a hairline-framed dark surface with an optional filename tab and a
 * copy island. Highlighting runs on the server, so no highlighter ships to the
 * client.
 */
export async function CodeBlock({
  code,
  lang = "tsx",
  filename,
}: {
  code: string;
  lang?: string;
  filename?: string;
}) {
  const html = await highlight(code, lang);

  return (
    <figure className="overflow-hidden rounded-[12px] border border-rule bg-[#101010] text-sm">
      <figcaption className="flex items-center justify-between border-b border-white/10 px-4 py-2">
        <span className="font-mono text-[11px] text-white/45">
          {filename ?? lang}
        </span>
        <CopyButton text={code} />
      </figcaption>
      <div
        className="overflow-x-auto p-5 [&_pre]:!bg-transparent [&_pre]:font-mono"
        // shiki returns trusted, server-generated markup
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </figure>
  );
}
