import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { INTEL_CARDS, type IntelligenceCard } from "@/lib/intelligence";
import { ConfidenceIndicator, DataStatusBadge, EmptyState, EvidenceList } from "./primitives";

const TABS = [
  { id: "opportunity", label: "Opportunities" },
  { id: "risk", label: "Risks" },
  { id: "anomaly", label: "Anomalies" },
] as const;

function Actions({ c }: { c: IntelligenceCard }) {
  const btn = "min-h-[36px] rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-mint/40 hover:text-mint";
  if (c.type === "opportunity")
    return (
      <>
        <Link to="/app/intelligence" className={btn}>Understand signal</Link>
        {c.symbol && <Link to="/app/analyze/$symbol" params={{ symbol: c.symbol }} className={btn}>Analyze</Link>}
        <Link to="/app/trade" className="min-h-[36px] rounded-lg border border-mint/30 bg-mint/10 px-3 py-1.5 text-xs text-mint">Simulate trade</Link>
      </>
    );
  if (c.type === "risk")
    return (
      <>
        <Link to="/app/markets" className={btn}>View sector</Link>
        <Link to="/app/portfolio" className={btn}>Affected holdings</Link>
      </>
    );
  return (
    <>
      <Link to="/app/intelligence" className={btn}>Investigate</Link>
      {c.symbol && <Link to="/app/analyze/$symbol" params={{ symbol: c.symbol }} className={btn}>Analyze {c.symbol}</Link>}
      <Link to="/app/alerts" className="min-h-[36px] rounded-lg border border-mint/30 bg-mint/10 px-3 py-1.5 text-xs text-mint">Create alert</Link>
    </>
  );
}

export function IntelligenceCardView({ c }: { c: IntelligenceCard }) {
  const accent = c.type === "opportunity" ? "border-positive/25" : c.type === "risk" ? "border-warning/25" : "border-violet/25";
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
      className={`flex h-full min-w-0 flex-col rounded-2xl border bg-raised/50 p-4 transition-colors hover:border-border-active ${accent}`}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0 truncate font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{c.subtitle}</div>
        <DataStatusBadge status="simulated" at={c.updatedAt} />
      </div>
      <h3 className="mt-2 text-sm font-medium leading-snug">{c.title}</h3>
      <div className="mt-3"><EvidenceList items={c.evidence} columns={1} /></div>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{c.explanation}</p>
      <div className="mt-auto pt-4">
        <div className="border-t border-border/60 pt-3"><ConfidenceIndicator value={c.confidence} /></div>
        <div className="mt-3 flex flex-wrap gap-2"><Actions c={c} /></div>
      </div>
    </motion.article>
  );
}

export function IntelligenceFeed() {
  const [tab, setTab] = useState<(typeof TABS)[number]["id"]>("opportunity");
  const items = INTEL_CARDS.filter((c) => c.type === tab);
  return (
    <div className="space-y-3">
      <div role="tablist" aria-label="Intelligence feed" className="flex flex-wrap gap-1.5">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`relative min-h-[36px] rounded-full border px-3.5 py-1.5 text-xs transition-colors ${
              tab === t.id ? "border-mint/35 text-foreground" : "border-border text-muted-foreground hover:border-border-active hover:text-foreground"
            }`}
          >
            {tab === t.id && <motion.span layoutId="feed-tab" className="absolute inset-0 rounded-full bg-mint/12" transition={{ type: "spring", stiffness: 420, damping: 36 }} />}
            <span className="relative">{t.label}</span>
          </button>
        ))}
      </div>
      {items.length === 0 ? (
        <EmptyState title="Nothing flagged" body="No signals in this category currently meet the evidence threshold." />
      ) : (
        <div className="grid items-stretch gap-3 md:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence mode="popLayout">{items.map((c) => <IntelligenceCardView key={c.id} c={c} />)}</AnimatePresence>
        </div>
      )}
    </div>
  );
}
