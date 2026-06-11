"use client";

/**
 * Hero visual — the display-cards pattern (skewed `[grid-area:stack]`, desaturated
 * back cards that colorize + lift on hover) but each card is a REAL embertoast
 * toast (the same `.et-toast` markup the library renders, light theme). Front card
 * is highlighted with an ember ring + a star badge.
 */

import { cn } from "@/lib/utils";

function IconSuccess() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="10" fill="currentColor" />
      <path d="M5.9 10.4l2.6 2.6 5.6-5.9" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconInfo() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="10" fill="currentColor" />
      <circle cx="10" cy="6.1" r="1.05" fill="#fff" />
      <path d="M10 9.2v5.1" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}
function IconError() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="10" fill="currentColor" />
      <path d="M10 5.3v5.4" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="10" cy="14" r="1.05" fill="#fff" />
    </svg>
  );
}
function Close() {
  return (
    <svg viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M3.5 3.5l7 7M10.5 3.5l-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

const SKEW = "w-[19rem] -skew-y-[7deg] [grid-area:stack] transition-all duration-700 sm:w-[21rem]";
const BACK = "grayscale-[0.85] hover:grayscale-0";

export function HeroToastStack() {
  return (
    <div className="relative mx-auto w-fit lg:mx-0 lg:ml-auto">
      {/* Star badge on the highlighted (front) toast. */}
      <div className="absolute -right-3 top-4 z-30 flex size-10 rotate-6 items-center justify-center rounded-2xl bg-ember text-[17px] text-white shadow-[0_10px_24px_-8px_rgba(232,89,12,0.6)]">
        ★
      </div>

      <div
        data-embertoast-toaster
        data-theme="light"
        className="grid place-items-center [grid-template-areas:'stack']"
      >
        {/* Back — error, desaturated, offset down-right. */}
        <div className={cn(SKEW, BACK, "translate-x-24 translate-y-[5.5rem] hover:translate-y-16")}>
          <div className="et-toast" data-type="error">
            <span className="et-toast__icon"><IconError /></span>
            <div className="et-toast__content">
              <div className="et-toast__title">Upload failed</div>
              <div className="et-toast__desc">Couldn’t reach the server — retry?</div>
            </div>
            <button className="et-toast__close" type="button" aria-label="Close" tabIndex={-1}><Close /></button>
          </div>
        </div>

        {/* Middle — upload with determinate bar, desaturated. */}
        <div className={cn(SKEW, BACK, "translate-x-12 translate-y-11 hover:translate-y-6")}>
          <div className="et-toast" data-type="info">
            <span className="et-toast__icon"><IconInfo /></span>
            <div className="et-toast__content">
              <div className="et-toast__title">Uploading report.pdf</div>
              <div className="et-toast__desc">68% · 2.4 MB</div>
            </div>
            <button className="et-toast__close" type="button" aria-label="Close" tabIndex={-1}><Close /></button>
            <div className="et-toast__progress" aria-hidden>
              <span className="et-toast__progress-fill" data-mode="determinate" style={{ width: "68%" }} />
            </div>
          </div>
        </div>

        {/* Front — success, full color, highlighted. */}
        <div className={cn(SKEW, "z-10 hover:-translate-y-2")}>
          <div
            className="et-toast"
            data-type="success"
            style={{ boxShadow: "0 0 0 1.5px rgba(232,89,12,0.45), 0 24px 50px -22px rgba(20,20,30,0.3)" }}
          >
            <span className="et-toast__icon"><IconSuccess /></span>
            <div className="et-toast__content">
              <div className="et-toast__title">Changes saved</div>
              <div className="et-toast__desc">Task updated with the recent changes.</div>
              <div className="et-toast__actions">
                <button className="et-toast__btn" type="button" tabIndex={-1}>Undo</button>
              </div>
            </div>
            <button className="et-toast__close" type="button" aria-label="Close" tabIndex={-1}><Close /></button>
            <div className="et-toast__progress" aria-hidden>
              <span className="et-toast__progress-fill" style={{ transform: "scaleX(0.46)" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
