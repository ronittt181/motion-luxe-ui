import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { AppShell } from "@/components/app/AppShell";
import { ScorePill } from "@/components/app/bits";
import { SYMBOLS, NEWS, SCORE_FACTORS } from "@/lib/market-data";

export const Route = createFileRoute("/app/intelligence")({
  head: () => ({
    meta: [
      { title: "AI Intelligence — Quant Plus" },
      { name: "description", content: "Model direction, probability and confidence across tracked symbols, with sentiment distribution and factor weights." },
      { property: "og:title", content: "AI Intelligence — Quant Plus" },
      { property: "og:description", content: "Ranked model conviction with explanations for every tracked symbol." },
    ],
  }),
  component: Intelligence,
});

function Intelligence() {
  const ranked = [...SYMBOLS].sort((a, b) => b.confidence * b.probability - a.confidence * a.probability);

  return (
    <AppShell title="AI Intelligence" subtitle="Model conviction across tracked symbols. Probabilistic and informational — never a guarantee.">
      <div className="grid gap-3 lg:grid-cols-[1.5fr_1fr]">
        <div className="panel overflow-hidden">
          <div className="flex items-center gap-4 border-b border-border px-4 py-2.5 text-[11px] uppercase tracking-widest text-muted-foreground">
            <span className="flex-1">Symbol</span><span className="w-20 text-right">Direction</span>
            <span className="w-20 text-right">Prob.</span><span className="w-24 text-right">Confidence</span><span className="w-12 text-right">Score</span>
          </div>
          {ranked.map((s, i) => (
            <motion.div key={s.symbol} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <Link to="/app/analyze/$symbol" params={{ symbol: s.symbol }} className="flex items-center gap-4 border-b border-border px-4 py-3.5 text-sm transition-colors last:border-0 hover:bg-accent/40">
                <div className="min-w-0 flex-1">
                  <div className="font-medium">{s.symbol}</div>
                  <div className="truncate text-xs text-muted-foreground">{s.name}</div>
                </div>
                <span className={`w-20 text-right text-xs ${s.direction === "up" ? "text-positive" : "text-negative"}`}>
                  {s.direction === "up" ? "▲ Up" : "▼ Down"}
                </span>
                <span className="w-20 text-right tabular">{s.probability}%</span>
                <span className="w-24 text-right">
                  <span className="inline-block h-1.5 w-14 overflow-hidden rounded-full bg-muted align-middle">
                    <motion.span className="block h-full rounded-full" style={{ background: "var(--gradient-signal)" }} initial={{ width: 0 }} animate={{ width: `${s.confidence}%` }} transition={{ duration: 0.8, delay: i * 0.03 }} />
                  </span>
                </span>
                <span className="w-12 text-right"><ScorePill score={s.quantScore} /></span>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="space-y-3">
          <div className="panel p-5">
            <div className="text-sm font-medium">Factor weights</div>
            <div className="mt-4 space-y-3">
              {SCORE_FACTORS.map((f, i) => (
                <div key={f.key}>
                  <div className="flex justify-between text-xs"><span className="text-muted-foreground">{f.key}</span><span className="tabular">{f.weight}%</span></div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                    <motion.div className="h-full rounded-full" style={{ background: "var(--gradient-signal)" }} initial={{ width: 0 }} animate={{ width: `${f.weight * 4}%` }} transition={{ duration: 0.9, delay: i * 0.06 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="panel overflow-hidden">
            <div className="border-b border-border px-4 py-3 text-sm font-medium">Sentiment stream</div>
            <div className="divide-y divide-border">
              {NEWS.map((n) => (
                <div key={n.title} className="px-4 py-3.5">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className={`size-1.5 rounded-full ${n.tone === "positive" ? "bg-positive" : n.tone === "negative" ? "bg-negative" : "bg-neutral"}`} />
                    {n.source} · {n.time}
                  </div>
                  <p className="mt-1.5 text-sm leading-snug">{n.title}</p>
                </div>
              ))}
            </div>
          </div>
          <p className="px-1 text-xs leading-relaxed text-muted-foreground">
            Model outputs shown here are generated from demonstration data for this build.
          </p>
        </div>
      </div>
    </AppShell>
  );
}
