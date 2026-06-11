"use client";

/**
 * Display cards — a skewed, layered stack (adapted from a 21st.dev pattern).
 * Themed to embertoast: dark surfaces, hairline borders, status-colored icon
 * chips. The back cards are desaturated and lift + colorize on hover; the front
 * card stays live. Used as the hero spectacle, each card a toast.
 */

import type { ReactNode } from "react";
import { Check, Upload, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface DisplayCardProps {
  className?: string;
  icon?: ReactNode;
  title?: string;
  description?: string;
  date?: string;
  /** Accent color for the icon chip + title (a CSS color). */
  accent?: string;
}

function DisplayCard({
  className,
  icon = <Sparkles className="size-4 text-white" />,
  title = "Featured",
  description = "Discover amazing content",
  date = "Just now",
  accent = "#FF6A1F",
}: DisplayCardProps) {
  return (
    <div
      className={cn(
        "relative flex h-36 w-[19rem] -skew-y-[8deg] select-none flex-col justify-between rounded-2xl border border-rule bg-paper/80 px-4 py-3.5 backdrop-blur-md shadow-[0_30px_70px_-34px_rgba(0,0,0,0.85)] transition-all duration-700 after:absolute after:-right-1 after:top-[-5%] after:h-[110%] after:w-[18rem] after:bg-gradient-to-l after:from-base after:to-transparent after:content-[''] hover:border-ember/40 hover:bg-surface sm:w-[22rem] [&>*]:flex [&>*]:items-center [&>*]:gap-2.5",
        className,
      )}
    >
      <div>
        <span
          className="relative inline-flex size-7 items-center justify-center rounded-full"
          style={{ background: accent }}
        >
          {icon}
        </span>
        <p className="text-[15px] font-semibold tracking-tight" style={{ color: accent }}>
          {title}
        </p>
      </div>
      <p className="whitespace-nowrap text-[15px] text-ink/85">{description}</p>
      <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-faint">{date}</p>
    </div>
  );
}

const STACK =
  "[grid-area:stack] before:absolute before:left-0 before:top-0 before:h-full before:w-full before:rounded-2xl before:bg-base/55 before:outline before:outline-1 before:-outline-offset-1 before:outline-rule before:transition-opacity before:duration-700 before:content-[''] grayscale-[0.75] hover:grayscale-0 hover:before:opacity-0";

const defaultCards: DisplayCardProps[] = [
  // Back + middle: desaturated, offset down-right, colorize and lift on hover.
  {
    icon: <Check className="size-4 text-white" />,
    title: "Changes saved",
    description: "Task updated with the recent changes.",
    date: "just now",
    accent: "#2FCE6A",
    className: cn(STACK, "translate-x-28 translate-y-[5.5rem] hover:translate-y-16"),
  },
  {
    icon: <Upload className="size-4 text-white" />,
    title: "Uploading report.pdf",
    description: "68% · 2.4 MB",
    date: "in progress",
    accent: "#3B82F6",
    className: cn(STACK, "translate-x-14 translate-y-11 hover:translate-y-6"),
  },
  // Front: full color, front-left, fully visible.
  {
    icon: <Sparkles className="size-4 text-white" />,
    title: "Task completed",
    description: "The result is ready to review.",
    date: "today",
    accent: "#FF6A1F",
    className: "[grid-area:stack] hover:-translate-y-2",
  },
];

export default function DisplayCards({ cards }: { cards?: DisplayCardProps[] }) {
  const displayCards = cards ?? defaultCards;
  return (
    <div className="grid place-items-center [grid-template-areas:'stack']">
      {displayCards.map((cardProps, index) => (
        <DisplayCard key={index} {...cardProps} />
      ))}
    </div>
  );
}
