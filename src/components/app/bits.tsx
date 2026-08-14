import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Star } from "lucide-react";
import type { ReactNode } from "react";
import { AnimatedNumber } from "@/components/viz/AnimatedNumber";
import { Sparkline } from "@/components/viz/Sparkline";
import { series, type Symbol, inr, compact } from "@/lib/market-data";
import { useStore } from "@/lib/store";

export function StatCard({ label, value, sub, tone = "default", delay = 0, decimals = 2, prefix = "₹" }: {
  label: string; value: number; sub?: ReactNode; tone?: "default" | "positive" | "negative"; delay?: number; decimals?: number; prefix?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      className="panel panel-hover group relative overflow-hidden p-5"
    >
      <div className="pointer-events-none absolute -right-10 -top-10 size-24 rounded-full opacity-0 blur-2xl transition-opacity duration-700 group-hover:opacity-40"
        style={{ background: "var(--gradient-signal)" }} />
      <div className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
      <div className={`mt-2.5 font-display text-2xl tabular ${tone === "positive" ? "text-positive" : tone === "negative" ? "text-negative" : ""}`}>
        <AnimatedNumber value={value} prefix={prefix} decimals={decimals} />
      </div>
      {sub && <div className="mt-2 text-xs text-muted-foreground">{sub}</div>}
    </motion.div>
  );
}

export function ScorePill({ score }: { score: number }) {
  const tone = score >= 65 ? "text-positive border-positive/30 bg-positive/10" : score >= 40 ? "text-warning border-warning/30 bg-warning/10" : "text-negative border-negative/30 bg-negative/10";
  return <span className={`rounded-full border px-2 py-0.5 text-xs tabular ${tone}`}>{score}</span>;
}

export function SymbolRow({ s, index = 0 }: { s: Symbol; index?: number }) {
  const { watchlist, toggleWatch } = useStore();
  const watched = watchlist.includes(s.symbol);
  const up = s.changePct >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.035, 0.4) }}
      className="group relative flex items-center gap-4 border-b border-border px-4 py-3.5 transition-colors duration-300 last:border-0 hover:bg-accent/40"
    >
      <span className="absolute inset-y-0 left-0 w-px origin-top scale-y-0 bg-mint transition-transform duration-500 group-hover:scale-y-100" />
      <button onClick={() => toggleWatch(s.symbol)} aria-label="Toggle watchlist" className="shrink-0">
        <Star className={`size-4 transition-all active:scale-90 ${watched ? "fill-warning text-warning" : "text-muted-foreground hover:text-foreground"}`} />
      </button>
      <Link to="/app/analyze/$symbol" params={{ symbol: s.symbol }} className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium">{s.symbol}</div>
        <div className="truncate text-xs text-muted-foreground">{s.name}</div>
      </Link>
      <div className="hidden w-24 md:block"><Sparkline data={series(s.symbol, 24).map((d) => d.close)} positive={up} /></div>
      <div className="hidden w-24 text-right text-xs text-muted-foreground tabular lg:block">{compact(s.volume)}</div>
      <div className="w-12 text-right"><ScorePill score={s.quantScore} /></div>
      <div className="w-28 text-right">
        <div className="text-sm tabular">{inr(s.price)}</div>
        <div className={`text-xs tabular ${up ? "text-positive" : "text-negative"}`}>{up ? "+" : ""}{s.changePct.toFixed(2)}%</div>
      </div>
    </motion.div>
  );
}
