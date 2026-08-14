import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { MARKET_CHANGES, type MarketChange } from "@/lib/intelligence";
import { ConfidenceIndicator, EmptyState, toneText } from "./primitives";

const FILTERS = [
  { id: "all", label: "All Changes" },
  { id: "market", label: "Market" },
  { id: "portfolio", label: "Portfolio" },
  { id: "watchlist", label: "Watchlist" },
  { id: "alert", label: "Alerts" },
] as const;

export function MarketChangeCard({ c }: { c: MarketChange }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
      className="flex h-full min-w-0 flex-col rounded-xl border border-border bg-raised/50 p-4 transition-colors hover:border-border-active"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="min-w-0 text-sm font-medium leading-snug">{c.title}</span>
        <span className="shrink-0 rounded-full border border-border bg-surface/60 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{c.scope}</span>
      </div>
      {c.previousValue !== undefined && (
        <div className="mt-2 flex items-center gap-2 tabular text-sm">
          <span className="text-muted-foreground line-through decoration-border">{c.previousValue}</span>
          <span className="text-muted-foreground">→</span>
          <span className={toneText(c.impact)}>{c.currentValue}</span>
        </div>
      )}
      <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{c.description}</p>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-3 [margin-top:auto]">
        <span className="text-[11px] text-muted-foreground">Changed {c.minutesAgo} minutes ago · {c.occurredAt}</span>
        {c.confidence !== undefined && <ConfidenceIndicator value={c.confidence} compact />}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <Link to="/app/intelligence" className="min-h-[36px] rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-mint/40 hover:text-mint">Understand signal</Link>
        {c.symbol ? (
          <Link to="/app/analyze/$symbol" params={{ symbol: c.symbol }} className="min-h-[36px] rounded-lg border border-mint/30 bg-mint/10 px-3 py-1.5 text-xs text-mint">Analyze {c.symbol}</Link>
        ) : (
          <Link to="/app/markets" className="min-h-[36px] rounded-lg border border-mint/30 bg-mint/10 px-3 py-1.5 text-xs text-mint">View markets</Link>
        )}
      </div>
    </motion.article>
  );
}

export function RecentChangeFeed({ hasSession }: { hasSession: boolean }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["id"]>("all");
  const items = MARKET_CHANGES.filter((c) => {
    if (filter === "all") return true;
    if (!hasSession && (c.scope === "portfolio" || c.scope === "watchlist" || c.scope === "alert")) return false;
    return c.scope === filter;
  }).filter((c) => hasSession || c.scope === "market");

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            aria-pressed={filter === f.id}
            className={`relative min-h-[36px] rounded-full border px-3 py-1.5 text-xs transition-colors ${
              filter === f.id ? "border-mint/35 text-foreground" : "border-border text-muted-foreground hover:border-border-active hover:text-foreground"
            }`}
          >
            {filter === f.id && <motion.span layoutId="change-filter" className="absolute inset-0 rounded-full bg-mint/12" transition={{ type: "spring", stiffness: 420, damping: 36 }} />}
            <span className="relative">{f.label}</span>
          </button>
        ))}
      </div>
      {items.length === 0 ? (
        <EmptyState title="No changes in this view" body="Nothing has changed in this category since your last session. Market-wide changes are still listed under All Changes." />
      ) : (
        <div className="grid items-stretch gap-3 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">{items.map((c) => <MarketChangeCard key={c.id} c={c} />)}</AnimatePresence>
        </div>
      )}
    </div>
  );
}
