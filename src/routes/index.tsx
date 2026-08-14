import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";
import { ArrowRight, Brain, Filter, LineChart, Newspaper, Sparkles, Wallet, Gauge, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { MarketStrip } from "@/components/marketing/MarketStrip";
import { Reveal, item, stagger } from "@/components/viz/Reveal";
import { ScoreRing } from "@/components/viz/ScoreRing";
import { PriceChart } from "@/components/viz/PriceChart";
import { Sparkline } from "@/components/viz/Sparkline";
import { SYMBOLS, series, inr } from "@/lib/market-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Quant Plus — Make sense of every market move" },
      { name: "description", content: "AI-powered market intelligence for Indian markets: technical analysis, prediction, news sentiment, screening and native virtual trading in one workspace." },
      { property: "og:title", content: "Quant Plus — Make sense of every market move" },
      { property: "og:description", content: "Technicals, AI prediction, sentiment, screening and virtual trading, together in one calm workspace." },
    ],
  }),
  component: Landing,
});

const capabilities = [
  { icon: LineChart, title: "Analyze", copy: "Interactive charts with SMA, EMA, RSI, MACD, Bollinger, VWAP, ATR and Supertrend overlays.", accent: "text-mint" },
  { icon: Brain, title: "Intelligence", copy: "Direction, probability and confidence with a plain-language explanation of what drove it.", accent: "text-violet" },
  { icon: Filter, title: "Screener", copy: "Combine technical and fundamental filters to shortlist the names worth your attention.", accent: "text-signal" },
  { icon: Wallet, title: "Trade", copy: "Native virtual orders, positions, order history and realised P&L — no broker required.", accent: "text-warning" },
];

const lenses = [
  { icon: Gauge, k: "Technicals", v: "Trend, momentum and volatility structure read across timeframes." },
  { icon: Brain, k: "AI prediction", v: "A directional view with calibrated probability and confidence." },
  { icon: Newspaper, k: "Sentiment", v: "FinBERT-style tone distribution across the latest coverage." },
  { icon: Sparkles, k: "Fundamentals", v: "Valuation and quality context so signals are never read alone." },
  { icon: ShieldCheck, k: "Momentum & volume", v: "Participation checks that confirm or question a move." },
];

const pipeline = [
  { step: "01", k: "Ingest", v: "Prices, volumes, fundamentals and news for tracked Indian equities." },
  { step: "02", k: "Compute", v: "Indicator stack and feature engineering across every timeframe." },
  { step: "03", k: "Predict", v: "Model output as direction, probability and confidence — never a promise." },
  { step: "04", k: "Explain", v: "Weighted factors combine into one Quant Score you can interrogate." },
];

function Landing() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.15]);
  const data = series("RELIANCE", 60);
  const headline = ["Make sense of", "every market move."];

  return (
    <div className="min-h-screen bg-void">
      <SiteHeader />

      <section ref={heroRef} className="relative overflow-hidden px-5 pb-16 pt-32 md:pt-40">
        <div className="pointer-events-none absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div className="pointer-events-none absolute inset-0 grid-lines opacity-60 [mask-image:radial-gradient(70%_60%_at_50%_0%,black,transparent)]" />
        <motion.div style={{ y, opacity }} className="relative mx-auto max-w-6xl">
          <motion.div initial="hidden" animate="show" variants={stagger}>
            <motion.div variants={item} className="inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3.5 py-1.5 text-xs text-muted-foreground backdrop-blur">
              <span className="size-1.5 rounded-full bg-mint" />
              AI-powered market intelligence for Indian markets
            </motion.div>
            <h1 className="mt-6 font-display text-[clamp(2.6rem,7vw,5rem)] font-semibold leading-[1.02]">
              {headline.map((line, i) => (
                <span key={line} className="block overflow-hidden">
                  <motion.span
                    className="block"
                    initial={{ y: "110%" }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.9, delay: 0.15 + i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {i === 1 ? <span className="text-gradient">{line}</span> : line}
                  </motion.span>
                </span>
              ))}
            </h1>
            <motion.p variants={item} className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              Quant Plus brings technical analysis, AI prediction, news sentiment, quantitative screening and native
              virtual trading into a single workspace built for NSE and BSE names.
            </motion.p>
            <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/app"
                className="group inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02] active:scale-[0.99]"
              >
                Launch Quant Plus
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/intelligence"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-surface/60 px-5 py-3 text-sm text-foreground transition-colors hover:border-border-active"
              >
                Explore the intelligence
              </Link>
            </motion.div>
          </motion.div>

          <motion.div variants={item} initial="hidden" animate="show" className="mt-12">
            <MarketStrip />
          </motion.div>

          {/* Product preview */}
          <motion.div
            initial={{ opacity: 0, y: 40, rotateX: 8 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="panel mt-6 grid gap-4 p-4 lg:grid-cols-[1.6fr_1fr]"
          >
            <div className="rounded-2xl border border-border bg-raised/60 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-display text-base font-semibold">RELIANCE</div>
                  <div className="text-xs text-muted-foreground">Reliance Industries · NSE</div>
                </div>
                <div className="text-right">
                  <div className="font-display text-lg tabular">{inr(SYMBOLS[0]!.price)}</div>
                  <div className="text-xs text-positive tabular">+1.24% today</div>
                </div>
              </div>
              <PriceChart data={data} height={220} chartKey="hero" />
            </div>
            <div className="grid gap-4">
              <div className="flex items-center gap-4 rounded-2xl border border-border bg-raised/60 p-4">
                <ScoreRing score={78} size={116} />
                <div className="space-y-1.5 text-sm">
                  <div className="font-medium">Constructive</div>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Trend and volume agree; sentiment is mildly supportive. Probability 68%, confidence 74%.
                  </p>
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-raised/60 p-4">
                <div className="text-xs uppercase tracking-widest text-muted-foreground">Virtual portfolio</div>
                <div className="mt-1 font-display text-2xl tabular">₹12,48,320</div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-positive tabular">+₹48,320 · +4.03%</span>
                  <Sparkline data={data.slice(-24).map((d) => d.close)} />
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Lenses */}
      <section className="relative px-5 py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <h2 className="max-w-2xl font-display text-[clamp(1.8rem,4vw,2.8rem)] font-semibold leading-tight">
              One signal, many lenses.
            </h2>
            <p className="mt-3 max-w-xl text-muted-foreground">
              A single score is only useful if you can take it apart. Quant Plus shows every lens it looked through.
            </p>
          </Reveal>
          <div className="mt-10 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {lenses.map((l, i) => (
              <Reveal key={l.k} delay={i * 0.06} from={i % 2 ? "left" : "up"}>
                <div className="panel panel-hover h-full p-5">
                  <l.icon className="size-5 text-mint" />
                  <div className="mt-4 font-display text-lg font-medium">{l.k}</div>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{l.v}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="px-5 py-16">
        <div className="mx-auto grid max-w-6xl gap-3 md:grid-cols-2">
          {capabilities.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.07} from={i % 2 ? "right" : "left"}>
              <Link to="/app" className="panel panel-hover group block h-full overflow-hidden p-6">
                <div className="flex items-start justify-between">
                  <c.icon className={`size-6 ${c.accent}`} />
                  <ArrowRight className="size-4 -translate-x-1 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                </div>
                <div className="mt-6 font-display text-xl font-medium">{c.title}</div>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">{c.copy}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Pipeline */}
      <section className="px-5 py-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <h2 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] font-semibold">How Quant Plus thinks.</h2>
            <p className="mt-3 max-w-xl text-muted-foreground">From raw market data to an explainable Quant Score.</p>
          </Reveal>
          <div className="mt-10 grid gap-3 md:grid-cols-4">
            {pipeline.map((p, i) => (
              <Reveal key={p.step} delay={i * 0.09}>
                <div className="panel h-full p-5">
                  <div className="font-mono text-xs text-mint">{p.step}</div>
                  <div className="mt-3 font-display text-lg">{p.k}</div>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{p.v}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Virtual trading */}
      <section className="px-5 pb-24">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="panel relative overflow-hidden p-8 md:p-12">
              <div className="pointer-events-none absolute inset-0" style={{ background: "var(--gradient-hero)", opacity: 0.7 }} />
              <div className="relative grid gap-8 lg:grid-cols-2 lg:items-center">
                <div>
                  <h2 className="font-display text-[clamp(1.6rem,3.4vw,2.4rem)] font-semibold leading-tight">
                    Simulate the decision before you live with it.
                  </h2>
                  <p className="mt-4 max-w-md leading-relaxed text-muted-foreground">
                    Virtual cash, market orders, positions and P&L all live natively inside Quant Plus. Test a thesis,
                    watch it play out, and keep a full order history — nothing leaves the workspace.
                  </p>
                  <Link to="/app/trade" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02]">
                    Open the trade desk <ArrowRight className="size-4" />
                  </Link>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    ["Virtual cash", "₹10,00,000"],
                    ["Open positions", "3"],
                    ["Realised P&L", "+₹18,420"],
                    ["Order history", "Full log"],
                  ].map(([k, v]) => (
                    <div key={k} className="rounded-2xl border border-border bg-raised/70 p-5">
                      <div className="text-xs uppercase tracking-widest text-muted-foreground">{k}</div>
                      <div className="mt-1.5 font-display text-xl tabular">{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
