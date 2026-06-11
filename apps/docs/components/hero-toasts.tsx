/**
 * The hero spectacle: a static stack of REAL toast markup (the same `.et-toast`
 * classes the library renders), so the product's polish is on screen before the
 * visitor touches anything. Decorative only — the live, interactive version lives
 * in the playground below. Wrapped in `data-embertoast-toaster` so the `--et-*`
 * design tokens cascade; positioned in-flow (not fixed) via the hero-stack scope.
 */

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
function Close() {
  return (
    <svg viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M3.5 3.5l7 7M10.5 3.5l-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function HeroToasts() {
  return (
    <div className="hero-stack relative isolate mx-auto w-full max-w-[416px] animate-float lg:mx-0 lg:ml-auto">
      {/* Glow bed behind the stack. */}
      <div
        aria-hidden
        className="absolute -inset-10 -z-10 rounded-[40px] bg-ember/15 blur-[90px]"
      />

      <div
        data-embertoast-toaster
        data-theme="dark"
        className="flex flex-col gap-3.5"
      >
        {/* 1 — success + Undo + depleting timer bar */}
        <div className="et-toast" data-type="success">
          <span className="et-toast__icon">
            <IconSuccess />
          </span>
          <div className="et-toast__content">
            <div className="et-toast__title">Changes saved</div>
            <div className="et-toast__desc">Task has been updated with the recent changes.</div>
            <div className="et-toast__actions">
              <button className="et-toast__btn" type="button" tabIndex={-1}>
                Undo
              </button>
            </div>
          </div>
          <button className="et-toast__close" type="button" aria-label="Close" tabIndex={-1}>
            <Close />
          </button>
          <div className="et-toast__progress" aria-hidden>
            <span className="et-toast__progress-fill" style={{ transform: "scaleX(0.42)" }} />
          </div>
        </div>

        {/* 2 — determinate upload */}
        <div className="et-toast" data-type="info">
          <span className="et-toast__icon">
            <IconInfo />
          </span>
          <div className="et-toast__content">
            <div className="et-toast__title">Uploading report.pdf</div>
            <div className="et-toast__desc">68% · 2.4 MB</div>
          </div>
          <button className="et-toast__close" type="button" aria-label="Close" tabIndex={-1}>
            <Close />
          </button>
          <div className="et-toast__progress" aria-hidden>
            <span
              className="et-toast__progress-fill"
              data-mode="determinate"
              style={{ width: "68%" }}
            />
          </div>
        </div>

        {/* 3 — info with timestamp + links */}
        <div className="et-toast" data-type="success">
          <span className="et-toast__icon">
            <IconSuccess />
          </span>
          <div className="et-toast__content">
            <div className="et-toast__title">Task completed</div>
            <div className="et-toast__desc">
              The result is ready. Review, refine, or continue from here.
            </div>
            <div className="et-toast__time">just now</div>
            <div className="et-toast__actions">
              <button className="et-toast__link" type="button" tabIndex={-1}>
                Review output
              </button>
              <button className="et-toast__link" type="button" tabIndex={-1}>
                Refine result
              </button>
            </div>
          </div>
          <button className="et-toast__close" type="button" aria-label="Close" tabIndex={-1}>
            <Close />
          </button>
        </div>
      </div>
    </div>
  );
}
