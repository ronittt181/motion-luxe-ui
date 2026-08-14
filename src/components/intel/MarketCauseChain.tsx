import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { ChevronDown, Minus, Plus } from "lucide-react";
import { CAUSE_CHAIN, CAUSE_CONCLUSION } from "@/lib/intelligence";
import { DataStatusBadge } from "./primitives";

export function MarketCauseChain() {
  const [open, setOpen] = useState<string | null>(CAUSE_CHAIN[0]!.id);
  return (
    <div className="panel p-5">
      <ol className="relative space-y-2 pl-6">
        <span className="absolute left-[7px] top-2 bottom-8 w-px bg-gradient-to-b from-mint/50 via-signal/40 to-negative/40" />
        {CAUSE_CHAIN.map((c, i) => {
          const isOpen = open === c.id;
          const supporting = c.polarity === "supporting";
          return (
            <li key={c.id} className="relative">
              <span className={`absolute -left-6 top-3 grid size-3.5 place-items-center rounded-full border ${supporting ? "border-positive/60 bg-positive/25" : "border-negative/60 bg-negative/25"}`}>
                {supporting ? <Plus className="size-2 text-positive" /> : <Minus className="size-2 text-negative" />}
              </span>
              <button
                onClick={() => setOpen(isOpen ? null : c.id)}
                aria-expanded={isOpen}
                className="flex min-h-[44px] w-full items-center justify-between gap-3 rounded-xl border border-border bg-raised/50 px-3.5 py-2.5 text-left transition-colors hover:border-border-active hover:bg-accent/40"
              >
                <span className="flex items-center gap-2.5">
                  <span className="font-mono text-[10px] text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                  <span className="text-sm">{c.label}</span>
                </span>
                <ChevronDown className={`size-4 shrink-0 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="mt-2 rounded-xl border border-border/70 bg-surface/40 p-3.5">
                      <div className="grid gap-2 sm:grid-cols-3">
                        <Meta label="Metric" value={c.metric} />
                        <Meta label="Previous → Current" value={`${c.previous} → ${c.current}`} />
                        <Meta label="Changed at" value={c.at} />
                      </div>
                      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{c.interpretation}</p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {c.related.map((r) => (
                          <Link key={r} to="/app/analyze/$symbol" params={{ symbol: r }} className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground hover:border-mint/40 hover:text-mint">{r}</Link>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </li>
          );
        })}
      </ol>
      <div className="mt-5 rounded-xl border border-warning/25 bg-warning/8 p-4">
        <div className="eyebrow text-[10px] text-warning">Conclusion · signals conflict</div>
        <p className="mt-2 text-sm leading-relaxed text-foreground/85">{CAUSE_CONCLUSION}</p>
        <div className="mt-3"><DataStatusBadge status="simulated" at="11:22" /></div>
      </div>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{label}</div>
      <div className="mt-0.5 tabular text-xs">{value}</div>
    </div>
  );
}
