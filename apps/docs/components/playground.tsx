"use client";

/**
 * The live playground — the hero of the docs. Buttons fire REAL toasts from the
 * library; switches/selects drive the mounted <Toaster/> props live. This is the
 * dogfood and the proof in one component: every control mutates the same store the
 * page renders from.
 *
 * The <Toaster/> portals to document.body, so toasts span the whole page (you can
 * see them land in any corner) rather than being trapped inside this panel.
 */

import { useState } from "react";
import * as Select from "@radix-ui/react-select";
import * as Switch from "@radix-ui/react-switch";
import { toast, Toaster } from "@embertoast/react";
import type { Position } from "@embertoast/react";

const POSITIONS: Position[] = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
];

const THEMES = ["system", "light", "dark"] as const;
type Theme = (typeof THEMES)[number];

/** A staged, determinate upload: progress is patched to 100%, then it morphs to "complete". */
function runUpload() {
  const id = toast.info("0% · 2.4 MB", {
    title: "Uploading report.pdf",
    duration: Infinity,
    progress: 0,
  });
  let p = 0;
  const tick = setInterval(() => {
    p = Math.min(1, p + 0.07);
    toast.update(id, { message: `${Math.round(p * 100)}% · 2.4 MB`, progress: p });
    if (p >= 1) {
      clearInterval(tick);
      // Let the bar settle at 100%, then morph in place to the success state —
      // the icon, bar color, and content all crossfade rather than snapping.
      setTimeout(() => {
        toast.success("report.pdf · 2.4 MB", {
          id,
          title: "Upload complete",
          progress: undefined,
          timestamp: Date.now(),
          duration: 4000,
          timerBar: true,
        });
      }, 440);
    }
  }, 200);
}

export function Playground() {
  const [position, setPosition] = useState<Position>("bottom-right");
  const [theme, setTheme] = useState<Theme>("dark");
  const [closeButton, setCloseButton] = useState(true);
  const [visibleToasts, setVisibleToasts] = useState(3);
  const [withActions, setWithActions] = useState(true);
  const [durationSec, setDurationSec] = useState(4);

  const duration = durationSec * 1000;

  // CTAs are optional — included only when the "actions" control is on. This
  // spreads `{ actions: [...] }` or nothing, so a toast can have zero CTAs.
  const acts = (labels: string[]) =>
    withActions
      ? { actions: labels.map((label) => ({ label, onClick: () => toast(label) })) }
      : {};

  const triggers: { label: string; run: () => void }[] = [
    {
      label: "Context",
      run: () =>
        toast.info(
          "I've added new information to your current session. Future responses will take this context into account.",
          {
            title: "Context updated",
            timestamp: Date.now(),
            duration,
            ...acts(["View context", "Manage memory"]),
          },
        ),
    },
    {
      label: "Needs info",
      run: () =>
        toast.warning(
          "I don't have enough context to give a reliable answer. Adding more details will improve accuracy and relevance.",
          {
            title: "More information needed",
            timestamp: Date.now(),
            duration,
            ...acts(["Add details", "See what's missing"]),
          },
        ),
    },
    {
      label: "Completed",
      run: () =>
        toast.success(
          "I've finished generating the result based on your instructions. You can review, refine, or continue from here.",
          {
            title: "Task completed",
            timestamp: Date.now(),
            duration,
            ...acts(["Review output", "Refine result"]),
          },
        ),
    },
    {
      label: "Unable",
      run: () =>
        toast.error(
          "I couldn't complete this request due to missing access, unsupported input, or a temporary issue. Please try again or adjust your request.",
          {
            title: "Unable to complete request",
            timestamp: Date.now(),
            duration,
            ...acts(["Try again", "Learn why this happened"]),
          },
        ),
    },
    {
      label: "Saved + timer",
      run: () =>
        toast.success("Task has been updated with the recent changes.", {
          title: "Changes saved",
          duration,
          timerBar: true,
          footer: `This message will close in ${durationSec} seconds. Hover to stop.`,
          actions: [
            { label: "Undo", variant: "button", onClick: () => toast("Reverted the change.") },
          ],
        }),
    },
    { label: "Upload ▴", run: runUpload },
    {
      label: "Loading",
      run: () => toast.loading("Crunching the numbers.", { title: "Working…" }),
    },
    {
      label: "Promise",
      run: () =>
        toast.promise(
          new Promise((res) => setTimeout(() => res({ name: "report.pdf" }), 1600)),
          {
            loading: "Uploading report…",
            success: (r) => `Uploaded ${(r as { name: string }).name}`,
            error: "Upload failed",
          },
        ),
    },
  ];

  return (
    <div
      className="min-w-0 rounded-[16px] border border-rule bg-white/[0.035] p-5 shadow-[0_1px_0_rgba(255,255,255,0.05)_inset,0_30px_80px_-40px_rgba(0,0,0,0.8)] backdrop-blur-xl"
      aria-label="Live toast playground"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted">
          live playground
        </span>
        <span className="flex items-center gap-1.5 font-mono text-[11px] text-muted">
          <span className="h-2 w-2 rounded-full bg-ember" aria-hidden />
          dogfooding @embertoast/react
        </span>
      </div>

      {/* Triggers — every button fires a real toast from the library. */}
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {triggers.map(({ label, run }) => (
          <button
            key={label}
            type="button"
            onClick={run}
            className="rounded-md border border-rule bg-paper px-3 py-2 text-sm font-medium text-ink transition hover:border-ember hover:text-ember active:translate-y-px"
          >
            {label}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={() => toast.dismiss()}
        className="mt-2 w-full rounded-md border border-dashed border-rule px-3 py-1.5 text-xs font-medium text-muted transition hover:border-ember hover:text-ember"
      >
        Dismiss all
      </button>

      {/* Settings rail — these mutate the mounted <Toaster/> (and the fired toasts) live. */}
      <div className="mt-5 space-y-3 border-t border-rule pt-4">
        <Field label="position">
          <PositionSelect value={position} onChange={setPosition} />
        </Field>
        <Field label="theme">
          <ThemeSelect value={theme} onChange={setTheme} />
        </Field>
        <Field label="visibleToasts">
          <Segmented
            options={[1, 2, 3, 5]}
            value={visibleToasts}
            onChange={setVisibleToasts}
          />
        </Field>
        <Field label="duration (s)">
          <Segmented
            options={[2, 4, 8]}
            value={durationSec}
            onChange={setDurationSec}
          />
        </Field>
        <Field label="actions (cta)">
          <Toggle checked={withActions} onChange={setWithActions} />
        </Field>
        <Field label="closeButton">
          <Toggle checked={closeButton} onChange={setCloseButton} />
        </Field>
      </div>

      {/* Generated config — mirrors the live props, reads as a spec. */}
      <p className="mt-4 overflow-x-auto whitespace-nowrap font-mono text-[11px] leading-relaxed text-muted">
        {`<Toaster position="${position}" theme="${theme}" visibleToasts={${visibleToasts}}`}
        {closeButton ? " closeButton" : ""}
        {" />"}
      </p>

      {/* The single, live-driven renderer — portals to <body>, so toasts span the page. */}
      <Toaster
        position={position}
        theme={theme}
        closeButton={closeButton}
        visibleToasts={visibleToasts}
      />
    </div>
  );
}

/* ---- Editorial control primitives ---------------------------------------- */

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="font-mono text-[12px] text-muted">{label}</span>
      {children}
    </div>
  );
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <Switch.Root
      checked={checked}
      onCheckedChange={onChange}
      className="relative h-[22px] w-[38px] rounded-full border border-rule bg-paper transition data-[state=checked]:border-ember data-[state=checked]:bg-ember"
    >
      <Switch.Thumb className="block h-[16px] w-[16px] translate-x-[2px] rounded-full bg-ink/40 transition-transform will-change-transform data-[state=checked]:translate-x-[18px] data-[state=checked]:bg-white" />
    </Switch.Root>
  );
}

function Segmented<T extends number>({
  options,
  value,
  onChange,
}: {
  options: T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex overflow-hidden rounded-md border border-rule">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          aria-pressed={value === opt}
          className={`px-2.5 py-1 font-mono text-[12px] transition ${
            value === opt
              ? "bg-ember text-white"
              : "bg-paper text-muted hover:text-ink"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function PositionSelect({
  value,
  onChange,
}: {
  value: Position;
  onChange: (v: Position) => void;
}) {
  return (
    <BaseSelect value={value} onChange={(v) => onChange(v as Position)}>
      {POSITIONS.map((p) => (
        <Option key={p} value={p}>
          {p}
        </Option>
      ))}
    </BaseSelect>
  );
}

function ThemeSelect({
  value,
  onChange,
}: {
  value: Theme;
  onChange: (v: Theme) => void;
}) {
  return (
    <BaseSelect value={value} onChange={(v) => onChange(v as Theme)}>
      {THEMES.map((t) => (
        <Option key={t} value={t}>
          {t}
        </Option>
      ))}
    </BaseSelect>
  );
}

function BaseSelect({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <Select.Root value={value} onValueChange={onChange}>
      <Select.Trigger className="inline-flex min-w-[140px] items-center justify-between gap-2 rounded-md border border-rule bg-paper px-2.5 py-1 font-mono text-[12px] text-ink transition hover:border-ember data-[state=open]:border-ember">
        <Select.Value />
        <Select.Icon className="text-muted">▾</Select.Icon>
      </Select.Trigger>
      <Select.Portal>
        <Select.Content
          position="popper"
          sideOffset={6}
          className="z-[1000000] overflow-hidden rounded-md border border-rule bg-paper shadow-[0_18px_40px_-24px_rgba(10,10,10,0.4)]"
        >
          <Select.Viewport className="p-1">{children}</Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
}

function Option({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) {
  return (
    <Select.Item
      value={value}
      className="cursor-pointer rounded px-2.5 py-1 font-mono text-[12px] text-ink outline-none data-[highlighted]:bg-ember-soft data-[state=checked]:text-ember"
    >
      <Select.ItemText>{children}</Select.ItemText>
    </Select.Item>
  );
}
