export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <span className="relative grid size-8 place-items-center rounded-[10px] border border-border bg-raised">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M2 13.5L6 8.5L9.5 11L16 3.5" stroke="url(#lg)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="9.5" cy="11" r="1.6" fill="var(--mint)" />
          <defs>
            <linearGradient id="lg" x1="2" y1="13" x2="16" y2="3">
              <stop stopColor="var(--mint)" />
              <stop offset="1" stopColor="var(--ai-violet)" />
            </linearGradient>
          </defs>
        </svg>
      </span>
      {!compact && (
        <span className="font-display text-[15px] font-semibold tracking-[0.14em] text-foreground">
          QUANT<span className="text-mint">&nbsp;PLUS</span>
        </span>
      )}
    </span>
  );
}
