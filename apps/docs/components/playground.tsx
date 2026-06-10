"use client";

/**
 * The live playground — the hero of the docs. Buttons fire REAL toasts from the
 * library; switches/selects drive the mounted <Toaster/> props live. This is the
 * dogfood and the proof in one component: every control mutates the same store the
 * page renders from.
 *
 * Editorial control panel, not a centered demo card: a labeled board with a fired
 * triggers row, a settings rail, and a generated-code line that mirrors the live
 * <Toaster/> config so the panel reads like a spec, not a toy.
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

/** A fake upload that resolves or rejects after a beat — for the promise demo. */
function fakeUpload(shouldReject: boolean): Promise<{ name: string }> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldReject) reject(new Error("network lost"));
      else resolve({ name: "report.pdf" });
    }, 1600);
  });
}

export function Playground() {
  const [position, setPosition] = useState<Position>("bottom-right");
  const [theme, setTheme] = useState<Theme>("light");
  const [richColors, setRichColors] = useState(true);
  const [closeButton, setCloseButton] = useState(true);
  const [visibleToasts, setVisibleToasts] = useState(3);

  const triggers: { label: string; run: () => void }[] = [
    { label: "Default", run: () => toast("Heads up — something happened.") },
    { label: "Success", run: () => toast.success("Profile saved.") },
    { label: "Error", run: () => toast.error("Upload failed.") },
    { label: "Info", run: () => toast.info("3 new comments.") },
    {
      label: "Loading",
      run: () => toast.loading("Crunching numbers…"),
    },
    {
      label: "Action",
      run: () =>
        toast("Message archived.", {
          action: { label: "Undo", onClick: () => toast.success("Restored.") },
        }),
    },
    {
      label: "Promise ✓",
      run: () =>
        toast.promise(fakeUpload(false), {
          loading: "Uploading report…",
          success: (r: { name: string }) => `Uploaded ${r.name}`,
          error: "Upload failed",
        }),
    },
    {
      label: "Promise ✕",
      run: () =>
        toast.promise(fakeUpload(true), {
          loading: "Uploading report…",
          success: (r: { name: string }) => `Uploaded ${r.name}`,
          error: (e: unknown) => `Failed: ${(e as Error).message}`,
        }),
    },
  ];

  return (
    <div
      className="rounded-[14px] border border-rule bg-white/70 p-5 shadow-[0_1px_0_rgba(10,10,10,0.04),0_18px_40px_-24px_rgba(10,10,10,0.25)] backdrop-blur-sm"
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

      {/* Settings rail — these mutate the mounted <Toaster/> props live. */}
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
        <Field label="richColors">
          <Toggle checked={richColors} onChange={setRichColors} />
        </Field>
        <Field label="closeButton">
          <Toggle checked={closeButton} onChange={setCloseButton} />
        </Field>
      </div>

      {/* Generated config — mirrors the live props, reads as a spec. */}
      <p className="mt-4 overflow-x-auto whitespace-nowrap font-mono text-[11px] leading-relaxed text-muted">
        {`<Toaster position="${position}" theme="${theme}" visibleToasts={${visibleToasts}}`}
        {richColors ? " richColors" : ""}
        {closeButton ? " closeButton" : ""}
        {" />"}
      </p>

      {/* The single, live-driven renderer. */}
      <Toaster
        position={position}
        theme={theme}
        richColors={richColors}
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
