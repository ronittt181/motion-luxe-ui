import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { AppShell } from "@/components/app/AppShell";
import { ScorePill } from "@/components/app/bits";
import { Bar, KpiTile, Panel, Segmented } from "@/components/app/kit";
import { ScoreRing } from "@/components/viz/ScoreRing";
import { SYMBOLS, NEWS, SCORE_FACTORS, factorBreakdown, getSymbol, inr } from "@/lib/market-data";

export const Route = createFileRoute("/app/intelligence")({
  head: () => ({
    meta: [
      { title: "AI Intelligence — Quant Plus" },
      { name: "description", content: "Model direction, probability, confidence and scenario paths across tracked symbols with plain-language reasoning." },
      { property: "og:title", content: "AI Intelligence — Quant Plus" },
      { property: "og:description", content: "Ranked model conviction with explanations and scenarios for every tracked symbol." },
    ],
  }),
  component: Intelligence,
});

const REASONS: Record<string, string> = {
  Technical: "Price is holding above its short-term averages with an intact higher-low structure.",
  Model: "The ensemble leans in this direction across the last several sessions of features.",
  Sentiment: "News tone and headline volume are net supportive versus the trailing month.",
  Momentum: "Volume-weighted momentum is expanding rather than fading into the move.",
  Fundamentals: "Valuation sits inside the peer band, so the signal is not fighting the multiple.",
};

function Intelligence() {
  const ranked = [...SYMBOLS].sort((a, b) => b.confidence * b.probability - a.confidence * a.probability);
  const [selected, setSelected] = useState(ranked[0]!.symbol);
  const [horizon, setHorizon] = useState<"1W" | "1M" | "3M">("1M");
  const sym = getSymbol(selected);
  const factors = factorBreakdown(sym);
  const up = sym.direction === "up";
  const move = horizon === "1W" ? 2.4 : horizon === "1M" ? 5.8 : 11.2;

  const scenarios = [
    { name: "Bull", prob: Math.min(92, sym.probability + 12), target: sym.price * (1 + move / 100), tone: "positive" as const },
    { name: "Base", prob: sym.probability, target: sym.price * (1 + (up ? move : -move) / 300), tone: "signal" as const },
    { name: "Bear", prob: Math.max(8, 100 - sym.probability - 10), target: sym.price * (1 - move / 100), tone: "negative" as const },
  ];

  return (
    <AppShell
      title="AI Intelligence"
      subtitle="Model conviction across tracked symbols. Probabilistic and informational — never a guarantee."
      action={<Segmented id="intel-horizon" size="xs" value={horizon} onChange={setHorizon} options={[{ value: "1W", label: "1W" }, { value: "1M", label: "1M" }, { value: "3M", label: "3M" }] as const} />}
    >
      <div className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <KpiTile label="Signal" value={up ? "Upward" : "Downward"} tone={up ? "positive" : "negative"} sub={`${sym.symbol} · ${horizon}`} />
          <KpiTile label="Probability" value={`${sym.probability}%`} delay={0.04} sub="Directional hit rate" />
          <KpiTile label="Confidence" value={`${sym.confidence}%`} delay={0.08} sub="Model agreement" />
          <KpiTile label="Quant Score" value={sym.quantScore} delay={0.12} sub="Composite of five lenses" />
        </div>

        <div className="grid min-w-0 gap-3 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="min-w-0 space-y-3">
            <Panel title={`${sym.symbol} · ${sym.name}`} eyebrow="Signal report">
              <div className="grid gap-5 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-center">
                <div className="grid place-items-center"><ScoreRing score={sym.quantScore} size={130} /></div>
                <div className="min-w-0 space-y-3">
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    The model leans <span className={up ? "text-positive" : "text-negative"}>{up ? "upward" : "downward"}</span> on {sym.symbol} over the next {horizon.toLowerCase()},
                    with {sym.probability}% directional probability and {sym.confidence}% confidence. Last traded at {inr(sym.price)}.
                  </p>
                  <div className="space-y-2.5">
                    {factors.map((f) => (
                      <div key={f.key}>
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">{f.key}</span>
                          <span className="tabular">{Math.round(f.value)}</span>
                        </div>
                        <div className="mt-1.5"><Bar value={f.value} /></div>
                        <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{REASONS[f.key] ?? "Contributing factor in the composite score."}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Panel>

            <div className="grid gap-3 sm:grid-cols-3">
              {scenarios.map((s, i) => (
                <motion.div key={s.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18, delay: i * 0.05 }} className="panel panel-hover p-4">
                  <div className="flex items-center justify-between">
                    <span className="t-label text-muted-foreground">{s.name} case</span>
                    <span className="text-xs tabular">{s.prob}%</span>
                  </div>
                  <div className={`mt-2 font-display text-lg tabular ${s.tone === "positive" ? "text-positive" : s.tone === "negative" ? "text-negative" : ""}`}>
                    {inr(s.target)}
                  </div>
                  <div className="mt-2"><Bar value={s.prob} tone={s.tone} /></div>
                </motion.div>
              ))}
            </div>

            <Panel title="Conviction ranking" flush>
              <div className="flex items-center gap-4 border-b border-border px-4 py-2.5 t-label text-muted-foreground">
                <span className="flex-1">Symbol</span><span className="w-20 text-right">Direction</span>
                <span className="w-16 text-right">Prob.</span><span className="w-24 text-right">Confidence</span><span className="w-12 text-right">Score</span>
              </div>
              {ranked.map((s, i) => (
                <button
                  key={s.symbol}
                  onClick={() => setSelected(s.symbol)}
                  className={`flex w-full items-center gap-4 border-b border-border px-4 py-3 text-left text-sm transition-colors last:border-0 hover:bg-accent/40 ${selected === s.symbol ? "bg-accent/40" : ""}`}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium">{s.symbol}</span>
                    <span className="block truncate text-xs text-muted-foreground">{s.name}</span>
                  </span>
                  <span className={`w-20 text-right text-xs ${s.direction === "up" ? "text-positive" : "text-negative"}`}>{s.direction === "up" ? "▲ Up" : "▼ Down"}</span>
                  <span className="w-16 text-right tabular">{s.probability}%</span>
                  <span className="w-24"><Bar value={s.confidence} /></span>
                  <span className="w-12 text-right"><ScorePill score={s.quantScore} /></span>
                </button>
              ))}
            </Panel>
          </div>

          <div className="space-y-3">
            <Panel title="Factor weights" eyebrow="How the score is built">
              <div className="space-y-3">
                {SCORE_FACTORS.map((f) => (
                  <div key={f.key}>
                    <div className="flex justify-between text-xs"><span className="text-muted-foreground">{f.key}</span><span className="tabular">{f.weight}%</span></div>
                    <div className="mt-1.5"><Bar value={f.weight * 4} /></div>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="Evidence stream" eyebrow="Timestamped inputs" flush>
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
            </Panel>

            <Panel title="Go deeper">
              <Link to="/app/analyze/$symbol" params={{ symbol: sym.symbol }} className="btn-primary inline-flex px-4 py-2 text-xs">
                Open {sym.symbol} analysis
              </Link>
              <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
                Model outputs shown here are generated from demonstration data for this build.
              </p>
            </Panel>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
