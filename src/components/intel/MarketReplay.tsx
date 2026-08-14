import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { REPLAY } from "@/lib/intelligence";
import { DataStatusBadge } from "./primitives";

export function MarketReplay() {
  const [i, setI] = useState(REPLAY.length - 1);
  const m = REPLAY[i]!;
  return (
    <div className="panel p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="eyebrow text-[10px]">Market replay</div>
          <p className="mt-1.5 text-xs text-muted-foreground">Drag the timeline to see how the session developed. Playback does not start automatically.</p>
        </div>
        <DataStatusBadge status="simulated" at={m.time} />
      </div>

      <input
        type="range"
        min={0}
        max={REPLAY.length - 1}
        step={1}
        value={i}
        aria-label="Session timeline"
        onChange={(e) => setI(Number(e.target.value))}
        className="mt-5 h-11 w-full cursor-pointer accent-[var(--mint)]"
      />

      <div className="-mx-1 flex snap-x snap-mandatory gap-2 overflow-x-auto px-1 pb-1">
        {REPLAY.map((r, idx) => (
          <button
            key={r.id}
            onClick={() => setI(idx)}
            aria-current={idx === i}
            className={`min-h-[44px] shrink-0 snap-start rounded-xl border px-3 py-2 text-left text-[11px] transition-colors ${
              idx === i ? "border-mint/40 bg-mint/10 text-foreground" : "border-border text-muted-foreground hover:border-border-active"
            }`}
          >
            <span className="block tabular font-medium">{r.time}</span>
            <span className="block max-w-[170px] truncate">{r.headline}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={m.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4 rounded-xl border border-border bg-raised/50 p-4"
        >
          <div className="font-display text-sm">{m.time} — {m.headline}</div>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {[
              ["NIFTY", m.nifty.toLocaleString("en-IN", { minimumFractionDigits: 2 })],
              ["Breadth", m.breadth],
              ["Sentiment", m.sentiment],
              ["Volatility", m.volatility],
              ["Leading sector", m.leadingSector],
              ["Anomalies", m.anomaly],
            ].map(([l, v]) => (
              <div key={l} className="rounded-lg border border-border/70 bg-surface/40 p-2.5">
                <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{l}</div>
                <div className="mt-0.5 tabular text-xs">{v}</div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground">Portfolio impact: {m.portfolioImpact}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
