/**
 * Hero mockup — real light-theme toast markup (the same `.et-toast` the library
 * renders), one highlighted with an ember ring + a star badge, the rest dimmed
 * behind it. Decorative; the live, interactive version is the configurator below.
 */

function IconSuccess() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="10" r="10" fill="currentColor" />
      <path d="M5.9 10.4l2.6 2.6 5.6-5.9" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
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

export function HeroMock() {
  return (
    <div className="relative mx-auto w-full max-w-[400px]">
      {/* Star badge on the highlighted toast. */}
      <div className="absolute -right-3 -top-4 z-20 flex size-10 rotate-6 items-center justify-center rounded-2xl bg-ember text-[17px] text-white shadow-[0_10px_24px_-8px_rgba(232,89,12,0.6)]">
        ★
      </div>

      <div data-embertoast-toaster data-theme="light" className="relative flex flex-col gap-3.5">
        {/* Highlighted */}
        <div
          className="et-toast relative z-10"
          data-type="success"
          style={{ boxShadow: "0 0 0 1.5px rgba(232,89,12,0.45), 0 22px 48px -20px rgba(20,20,30,0.28)" }}
        >
          <span className="et-toast__icon">
            <IconSuccess />
          </span>
          <div className="et-toast__content">
            <div className="et-toast__title">Changes saved</div>
            <div className="et-toast__desc">Task updated with the recent changes.</div>
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
            <span className="et-toast__progress-fill" style={{ transform: "scaleX(0.44)" }} />
          </div>
        </div>

        {/* Dimmed behind */}
        <div className="et-toast opacity-[0.72]" data-type="error">
          <span className="et-toast__icon">
            <IconError />
          </span>
          <div className="et-toast__content">
            <div className="et-toast__title">Upload failed</div>
            <div className="et-toast__desc">Couldn’t reach the server — retry?</div>
          </div>
          <button className="et-toast__close" type="button" aria-label="Close" tabIndex={-1}>
            <Close />
          </button>
        </div>

        <div className="et-toast opacity-[0.45]" data-type="info">
          <span className="et-toast__icon">
            <IconInfo />
          </span>
          <div className="et-toast__content">
            <div className="et-toast__title">3 new comments</div>
            <div className="et-toast__desc">On “Q3 roadmap”.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
