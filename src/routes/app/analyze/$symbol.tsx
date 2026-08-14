import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { ChevronRight, Star } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { PriceChart } from "@/components/viz/PriceChart";
import { ScoreRing } from "@/components/viz/ScoreRing";
import { ScorePill } from "@/components/app/bits";
import { SYMBOLS, TIMEFRAMES, TF_POINTS, factorBreakdown, getSymbol, inr, series, NEWS, compact, type Timeframe } from "@/lib/market-data";
import { useStore } from "@/lib/store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/app/analyze/$symbol")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.symbol} analysis — Quant Plus` },
      { name: "description", content: `Charts, indicators, AI prediction and news sentiment for ${params.symbol} on Quant Plus.` },
      { property: "og:title", content: `${params.symbol} analysis — Quant Plus` },
      { property: "og:description", content: `Technical, model and sentiment breakdown for ${params.symbol}.` },
    ],
  }),
  component: Analyze,
});

function Analyze() {
  const { symbol } = useParams({ from: "/app/analyze/$symbol" });
  const sym = getSymbol(symbol) ?? SYMBOLS[0];
  const [tf, setTf] = useState<Timeframe>("3M");
  const [sma, setSma] = useState(true);
  const [ema, setEma] = useState(false);
  const { watchlist, toggleWatch } = useStore();
  const watched = watchlist.includes(sym.symbol);
  const factors = factorBreakdown(sym);
  const up = sym.changePct >= 0;

  return (
    <AppShell
      title={sym.symbol}
      subtitle={`${sym.name} · ${sym.sector}`}
      action={
        <div className="flex items-center gap-2">
          <button
            onClick={() => toggleWatch(sym.symbol)}
            className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm transition-all active:scale-95 ${watched ? "border-warning/30 bg-warning/10 text-warning" : "border-border text-muted-foreground hover:text-foreground"}`}
          >
            <Star className={`size-4 ${watched ? "fill-warning" : ""}`} /> {watched ? "Watching" : "Watch"}
          </button>
          <Link to="/app/trade" search={{ symbol: sym.symbol }} className="rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02]">
            Trade
          </Link>
        </div>
      }
    >
      <nav className="mb-4 flex items-center gap-1.5 text-xs text-muted-foreground">
        <Link to="/app" className="hover:text-foreground">Workspace</Link>
        <ChevronRight className="size-3" />
        <Link to="/app/analyze" className="hover:text-foreground">Analyze</Link>
        <ChevronRight className="size-3" />
        <span className="text-foreground">{sym.symbol}</span>
      </nav>

      <div className="space-y-3">
        <div className="grid gap-3 lg:grid-cols-[1.7fr_1fr]">
          <div className="panel p-5">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <div className="font-display text-3xl tabular">{inr(sym.price)}</div>
                <div className={`text-sm tabular ${up ? "text-positive" : "text-negative"}`}>
                  {up ? "+" : ""}{sym.change} ({up ? "+" : ""}{sym.changePct.toFixed(2)}%) today
                </div>
              </div>
              <div className="flex items-center gap-1 rounded-full border border-border p-1">
                {TIMEFRAMES.map((t) => (
                  <button key={t} onClick={() => setTf(t)} className={`relative rounded-full px-3 py-1 text-xs ${tf === t ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                    {tf === t && <motion.span layoutId="tf-pill" className="absolute inset-0 rounded-full bg-accent" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                    <span className="relative">{t}</span>
                  </button>
                ))}
              </div>
            </div>
            <PriceChart data={series(sym.symbol, TF_POINTS[tf])} positive={up} chartKey={`${sym.symbol}-${tf}`} overlays={{ sma, ema }} height={300} />
            <div className="mt-4 flex flex-wrap items-center gap-5 border-t border-border pt-4 text-xs text-muted-foreground">
              <label className="flex items-center gap-2"><Switch checked={sma} onCheckedChange={setSma} /> SMA 14</label>
              <label className="flex items-center gap-2"><Switch checked={ema} onCheckedChange={setEma} /> EMA 14</label>
              <span className="ml-auto">Volume {compact(sym.volume)} · ATR {sym.atr}</span>
            </div>
          </div>

          <div className="panel flex flex-col items-center gap-4 p-5">
            <ScoreRing score={sym.quantScore} />
            <div className="w-full space-y-3">
              {factors.map((f, i) => (
                <div key={f.key}>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">{f.key}</span>
                    <span className="tabular">{f.value}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                    <motion.div className="h-full rounded-full" style={{ background: "var(--gradient-signal)" }} initial={{ width: 0 }} animate={{ width: `${f.value}%` }} transition={{ duration: 0.9, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Tabs defaultValue="prediction">
          <TabsList>
            <TabsTrigger value="prediction">AI prediction</TabsTrigger>
            <TabsTrigger value="technicals">Technicals</TabsTrigger>
            <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
            <TabsTrigger value="fundamentals">Fundamentals</TabsTrigger>
          </TabsList>

          <TabsContent value="prediction">
            <div className="panel grid gap-5 p-6 md:grid-cols-3">
              {[["Direction", sym.direction === "up" ? "Upward" : "Downward"], ["Probability", `${sym.probability}%`], ["Confidence", `${sym.confidence}%`]].map(([k, v]) => (
                <div key={k}>
                  <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{k}</div>
                  <div className={`mt-1 font-display text-2xl ${k === "Direction" ? (sym.direction === "up" ? "text-positive" : "text-negative") : ""}`}>{v}</div>
                </div>
              ))}
              <p className="text-sm leading-relaxed text-muted-foreground md:col-span-3">
                The model reads {sym.symbol} as {sym.direction === "up" ? "constructive" : "defensive"} over the next
                sessions. RSI at {sym.rsi} and MACD at {sym.macd} shape the technical contribution, while news tone is{" "}
                {sym.sentiment.positive > sym.sentiment.negative ? "net positive" : "net negative"}. This is an
                informational, probabilistic view — not advice, and not a guarantee.
              </p>
            </div>
          </TabsContent>

          <TabsContent value="technicals">
            <div className="panel grid gap-5 p-6 sm:grid-cols-2 lg:grid-cols-4">
              {[["RSI (14)", sym.rsi, sym.rsi > 70 ? "Overbought" : sym.rsi < 30 ? "Oversold" : "Neutral"],
                ["MACD", sym.macd, sym.macd > 0 ? "Bullish crossover" : "Bearish crossover"],
                ["ATR", sym.atr, "Average true range"],
                ["Supertrend", up ? "Long" : "Short", "Trend regime"]].map(([k, v, note]) => (
                <div key={String(k)} className="rounded-2xl border border-border bg-raised/50 p-4">
                  <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{k}</div>
                  <div className="mt-1 font-display text-xl tabular">{v}</div>
                  <div className="mt-1 text-xs text-muted-foreground">{note}</div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="sentiment">
            <div className="panel space-y-5 p-6">
              <div className="flex h-3 overflow-hidden rounded-full">
                {([["positive", "var(--positive)"], ["neutral", "var(--neutral)"], ["negative", "var(--negative)"]] as const).map(([k, c]) => (
                  <motion.div key={k} initial={{ width: 0 }} animate={{ width: `${sym.sentiment[k]}%` }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }} style={{ background: c }} />
                ))}
              </div>
              <div className="flex gap-6 text-xs text-muted-foreground">
                <span><span className="text-positive">●</span> Positive {sym.sentiment.positive}%</span>
                <span><span className="text-neutral">●</span> Neutral {sym.sentiment.neutral}%</span>
                <span><span className="text-negative">●</span> Negative {sym.sentiment.negative}%</span>
              </div>
              <div className="divide-y divide-border border-t border-border">
                {NEWS.map((n) => (
                  <div key={n.title} className="flex items-center gap-3 py-3">
                    <span className={`size-1.5 shrink-0 rounded-full ${n.tone === "positive" ? "bg-positive" : n.tone === "negative" ? "bg-negative" : "bg-neutral"}`} />
                    <span className="flex-1 text-sm">{n.title}</span>
                    <span className="hidden text-xs text-muted-foreground sm:block">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="fundamentals">
            <div className="panel grid gap-5 p-6 sm:grid-cols-2 lg:grid-cols-4">
              {[["P/E ratio", sym.pe], ["Market cap", `₹${compact(sym.marketCap)} Cr`], ["Sector", sym.sector], ["Quant Score", <ScorePill key="s" score={sym.quantScore} />]].map(([k, v]) => (
                <div key={String(k)} className="rounded-2xl border border-border bg-raised/50 p-4">
                  <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{k}</div>
                  <div className="mt-1.5 font-display text-xl tabular">{v}</div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppShell>
  );
}
