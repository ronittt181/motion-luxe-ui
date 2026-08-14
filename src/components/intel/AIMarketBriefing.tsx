import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUpRight, ShieldAlert, Sparkles, Zap } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { BRIEFING_MODES, BIAS_LABEL, getBriefing, type BriefingMode } from "@/lib/intelligence";
import { ConfidenceIndicator, DataStatusBadge, useMotionOk } from "./primitives";

export function BriefingModeSelector({ mode, onChange }: { mode: BriefingMode; onChange: (m: BriefingMode) => void }) {
  return (
    <div role="tablist" aria-label="Briefing mode" className="flex flex-wrap gap-1.5">
      {BRIEFING_MODES.map((m) => {
        const active = m.id === mode;
        return (
          <button
            key={m.id}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(m.id)}
            className={`relative min-h-[36px] rounded-full border px-3 py-1.5 text-xs transition-colors ${
              active ? "border-mint/35 text-foreground" : "border-border text-muted-foreground hover:border-border-active hover:text-foreground"
            }`}
          >
            {active && <motion.span layoutId="briefing-mode" className="absolute inset-0 rounded-full bg-mint/12" transition={{ type: "spring", stiffness: 420, damping: 36 }} />}
            <span className="relative">{m.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function AIMarketBriefing({ holdings, watchlist }: { holdings: string[]; watchlist: string[] }) {
  const [mode, setMode] = useState<BriefingMode>("quick");
  const ok = useMotionOk();
  const b = useMemo(() => getBriefing(mode, { holdings, watchlist }), [mode, holdings, watchlist]);

  return (
    <section aria-labelledby="briefing-title" className="panel hairline relative overflow-hidden p-5 md:p-7">
      <div className="pointer-events-none absolute -left-24 -top-28 size-72 rounded-full opacity-40 blur-[90px]" style={{ background: "var(--gradient-signal, radial-gradient(circle,var(--mint),transparent))" }} />
      {ok && (
        <svg className="pointer-events-none absolute inset-x-0 top-0 h-24 w-full opacity-25" preserveAspectRatio="none" viewBox="0 0 400 100" aria-hidden>
          {[0, 1, 2].map((i) => (
            <motion.path
              key={i}
              d={`M0 ${30 + i * 18} C 90 ${10 + i * 20}, 180 ${60 - i * 12}, 400 ${25 + i * 16}`}
              fill="none"
              stroke={i === 0 ? "var(--mint)" : i === 1 ? "var(--signal)" : "var(--ai-violet)"}
              strokeWidth="0.7"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.7 }}
              transition={{ duration: 2.4 + i * 0.6, delay: i * 0.25, ease: [0.16, 1, 0.3, 1] }}
            />
          ))}
        </svg>
      )}

      <div className="relative flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="eyebrow flex items-center gap-2 text-[10px]">
            <Sparkles className="size-3 text-mint" /> Market Intelligence
          </div>
          <h2 id="briefing-title" className="mt-3 font-display text-2xl leading-tight md:text-[34px]">
            Indian markets are <span className="text-gradient">{BIAS_LABEL[b.bias].toLowerCase()}</span>.
          </h2>
        </div>
        <div className="flex flex-col items-end gap-2">
          <DataStatusBadge status={b.dataStatus} at={b.updatedAt} />
          <ConfidenceIndicator value={b.confidence} />
        </div>
      </div>

      <div className="relative mt-5"><BriefingModeSelector mode={mode} onChange={setMode} /></div>

      <div className="relative mt-5 min-h-[128px]">
        <AnimatePresence mode="wait">
          <motion.p
            key={mode}
            initial={ok ? { opacity: 0, y: 8 } : false}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: ok ? -6 : 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl text-[15px] leading-relaxed text-foreground/85 md:text-base"
          >
            {b.summary}
          </motion.p>
        </AnimatePresence>
      </div>

      <div className="relative mt-5 grid gap-3 lg:grid-cols-3">
        <div className="rounded-xl border border-border bg-raised/50 p-4">
          <div className="flex items-center gap-2 text-xs font-medium"><Zap className="size-3.5 text-mint" /> Strongest signal</div>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{b.strongestSignal}</p>
        </div>
        <div className="rounded-xl border border-border bg-raised/50 p-4">
          <div className="flex items-center gap-2 text-xs font-medium"><ShieldAlert className="size-3.5 text-warning" /> Primary risk</div>
          <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{b.primaryRisk}</p>
        </div>
        <div className="rounded-xl border border-border bg-raised/50 p-4">
          <div className="text-xs font-medium">Sector leadership</div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {b.leadingSectors.map((s) => <span key={s} className="rounded-full border border-positive/25 bg-positive/10 px-2 py-0.5 text-[11px] text-positive">{s}</span>)}
            {b.laggingSectors.map((s) => <span key={s} className="rounded-full border border-negative/25 bg-negative/10 px-2 py-0.5 text-[11px] text-negative">{s}</span>)}
          </div>
        </div>
      </div>

      <ul className="relative mt-4 grid gap-2 sm:grid-cols-2">
        {b.keyDrivers.map((d, i) => (
          <motion.li
            key={d}
            initial={ok ? { opacity: 0, x: -8 } : false}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: Math.min(i * 0.05, 0.3) }}
            className="flex items-start gap-2 text-xs text-muted-foreground"
          >
            <span className="mt-1.5 size-1 shrink-0 rounded-full bg-signal" />
            {d}
          </motion.li>
        ))}
      </ul>

      <div className="relative mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border/70 pt-4">
        <p className="max-w-xl text-[11px] leading-relaxed text-muted-foreground">
          Based on breadth, volume, technicals and sentiment. Quant Plus insights are informational. Predictions are probabilistic, and all trading activity is virtual.
        </p>
        <Link to="/app/intelligence" className="flex items-center gap-1.5 text-xs text-mint hover:underline">
          Full intelligence view <ArrowUpRight className="size-3.5" />
        </Link>
      </div>
    </section>
  );
}
