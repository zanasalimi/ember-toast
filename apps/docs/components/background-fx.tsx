/**
 * Fixed, non-interactive atmosphere for the dark canvas: a deep radial vignette,
 * a pulsing ember focal glow, a masked technical grid, and fine film grain.
 * Purely decorative — sits behind everything at z-0 and never catches pointers.
 */
export function BackgroundFX() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Deep vignette from a graphite top toward near-black. */}
      <div className="absolute inset-0 bg-[radial-gradient(130%_90%_at_72%_-10%,#17171C_0%,#0B0B0E_45%,#08080A_100%)]" />
      {/* Ember focal glow, top-right, slowly breathing. */}
      <div className="absolute -top-[18%] right-[2%] h-[62vh] w-[58vw] rounded-full bg-ember/25 blur-[140px] animate-glow-pulse" />
      {/* A cooler counter-glow low-left for depth. */}
      <div className="absolute bottom-[-20%] left-[-8%] h-[48vh] w-[42vw] rounded-full bg-[#1b3a5e]/20 blur-[150px]" />
      {/* Faint technical grid, masked so it fades into the dark. */}
      <div className="tech-grid absolute inset-0" />
      {/* Film grain. */}
      <div className="grain" />
    </div>
  );
}
