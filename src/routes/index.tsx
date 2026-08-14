import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform, useSpring } from "motion/react";
import { useEffect, useRef } from "react";
import { ArrowRight, ArrowUpRight, Brain, Filter, LineChart, Newspaper, Sparkles, Wallet, Gauge, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/marketing/SiteHeader";
import { SiteFooter } from "@/components/marketing/SiteFooter";
import { MarketStrip } from "@/components/marketing/MarketStrip";
import { Reveal, item, stagger } from "@/components/viz/Reveal";
import { SplitText } from "@/components/viz/SplitText";
import { Magnetic } from "@/components/viz/Magnetic";
import { Spotlight } from "@/components/viz/Spotlight";
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

const factors = [
  { k: "Technical", v: 82 },
  { k: "Model", v: 74 },
  { k: "Sentiment", v: 61 },
  { k: "Momentum", v: 88 },
];

const pipeline = [
  { step: "01", k: "Ingest", v: "Prices, volumes, fundamentals and news for tracked Indian equities." },
  { step: "02", k: "Compute", v: "Indicator stack and feature engineering across every timeframe." },
  { step: "03", k: "Predict", v: "Model output as direction, probability and confidence — never a promise." },
  { step: "04", k: "Explain", v: "Weighted factors combine into one Quant Score you can interrogate." },
];

/** GSAP ScrollTrigger: subtle scrub-driven depth on the pipeline rail. */
function usePipelineScroll(scope: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    let ctx: { revert: () => void } | undefined;
    let cancelled = false;
    (async () => {
      const [{ default: gsap }, { ScrollTrigger }] = await Promise.all([import("gsap"), import("gsap/ScrollTrigger")]);
      if (cancelled || !scope.current) return;
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        gsap.fromTo(
          ".pipe-card",
          { y: 40, opacity: 0, filter: "blur(10px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            ease: "expo.out",
            duration: 1,
            stagger: 0.12,
            scrollTrigger: { trigger: scope.current, start: "top 82%", once: true },
          },
        );
        gsap.fromTo(
          ".pipe-line",
          { scaleX: 0 },
          {
            scaleX: 1,
            transformOrigin: "left center",
            ease: "none",
            scrollTrigger: { trigger: scope.current, start: "top 78%", end: "bottom 60%", scrub: 0.6 },
          },
        );
      }, scope.current);
    })();
    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [scope]);
}

function Landing() {
  const heroRef = useRef<HTMLDivElement>(null);
  const pipeRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const y = useSpring(useTransform(scrollYProgress, [0, 1], [0, 110]), { stiffness: 120, damping: 26, mass: 0.5 });
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.08]);
  const previewY = useSpring(useTransform(scrollYProgress, [0, 1], [0, -40]), { stiffness: 110, damping: 24 });
  const data = series("RELIANCE", 60);
  usePipelineScroll(pipeRef);

  return (
    <div className="noise min-h-screen bg-void">
      <SiteHeader />

      <section ref={heroRef} className="relative overflow-hidden px-5 pb-20 pt-36 md:pt-44">
        <div className="pointer-events-none absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div className="pointer-events-none absolute -top-40 left-1/2 aurora size-[42rem] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
          style={{ background: "conic-gradient(from 210deg, color-mix(in oklab, var(--mint) 55%, transparent), color-mix(in oklab, var(--ai-violet) 45%, transparent), transparent 70%)" }} />
        <div className="pointer-events-none absolute inset-0 grid-lines opacity-40 [mask-image:radial-gradient(70%_55%_at_50%_0%,black,transparent)]" />

        <motion.div style={{ y, opacity }} className="relative mx-auto max-w-6xl">
          <motion.div initial="hidden" animate="show" variants={stagger}>
            <motion.div variants={item} className="glass inline-flex items-center gap-2.5 rounded-full px-3.5 py-1.5 text-xs tracking-tight text-muted-foreground">
              <span className="relative flex size-1.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-mint opacity-70" />
                <span className="relative inline-flex size-1.5 rounded-full bg-mint" />
              </span>
              AI-powered market intelligence for Indian markets
            </motion.div>

            <h1 className="mt-7 max-w-4xl font-display text-[clamp(2.7rem,7.4vw,5.4rem)] font-medium leading-[0.98]">
              <span className="block overflow-hidden">
                <motion.span className="block" initial={{ y: "112%" }} animate={{ y: 0 }} transition={{ duration: 1.1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}>
                  Make sense of
                </motion.span>
              </span>
              <span className="block overflow-hidden">
                <motion.span className="block" initial={{ y: "112%" }} animate={{ y: 0 }} transition={{ duration: 1.1, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}>
                  every <span className="font-serif-accent text-gradient">market move.</span>
                </motion.span>
              </span>
            </h1>

            <motion.p variants={item} className="mt-7 max-w-lg text-[0.98rem] leading-relaxed text-muted-foreground">
              Technical analysis, AI prediction, news sentiment, quantitative screening and native virtual trading —
              one calm workspace for NSE and BSE names.
            </motion.p>

            <motion.div variants={item} className="mt-9 flex flex-wrap items-center gap-3">
              <Magnetic>
                <Link to="/app" className="btn-sheen group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground">
                  Launch Quant Plus
                  <ArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
                </Link>
              </Magnetic>
              <Magnetic strength={0.18}>
                <Link to="/intelligence" className="glass inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm text-foreground transition-colors duration-500 hover:border-border-active">
                  Explore the intelligence
                  <ArrowUpRight className="size-4 text-muted-foreground" />
                </Link>
              </Magnetic>
            </motion.div>
          </motion.div>

          <motion.div variants={item} initial="hidden" animate="show" className="mt-14">
            <MarketStrip />
          </motion.div>

          {/* Product preview */}
          <motion.div
            style={{ y: previewY }}
            initial={{ opacity: 0, y: 56, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6"
          >
            <Spotlight className="panel hairline rounded-3xl">
              {/* window chrome */}
              <div className="flex items-center gap-3 border-b border-border/70 px-4 py-3">
                <div className="flex gap-1.5">
                  <span className="size-2.5 rounded-full bg-negative/60" />
                  <span className="size-2.5 rounded-full bg-warning/60" />
                  <span className="size-2.5 rounded-full bg-positive/60" />
                </div>
                <div className="ml-2 hidden items-center gap-1 sm:flex">
                  {["Analyze", "Intelligence", "Trade"].map((t, i) => (
                    <span
                      key={t}
                      className={`rounded-lg px-2.5 py-1 text-xs transition-colors ${i === 0 ? "bg-accent/70 text-foreground" : "text-muted-foreground"}`}
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <div className="ml-auto glass rounded-lg px-2.5 py-1 font-mono text-[0.68rem] tabular text-muted-foreground">
                  NSE · 1D
                </div>
              </div>

              <div className="grid gap-4 p-4 lg:grid-cols-[1.65fr_1fr]">
                <div className="rounded-2xl border border-border bg-raised/50 p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display text-base">RELIANCE</span>
                        <span className="rounded-md bg-positive/12 px-1.5 py-0.5 font-mono text-[0.6rem] uppercase tracking-wider text-positive">
                          Bullish
                        </span>
                      </div>
                      <div className="mt-0.5 text-xs text-muted-foreground">Reliance Industries · NSE</div>
                    </div>
                    <div className="text-right">
                      <div className="font-display text-xl tabular">{inr(SYMBOLS[0]!.price)}</div>
                      <div className="font-mono text-xs text-positive tabular">+1.24% today</div>
                    </div>
                  </div>
                  <PriceChart data={data} height={214} chartKey="hero" />
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {[["RSI", "58.4"], ["MACD", "+3.1"], ["ATR", "42.8"], ["VWAP", "2,901"]].map(([k, v]) => (
                      <span key={k} className="rounded-lg border border-border bg-surface/60 px-2 py-1 font-mono text-[0.65rem] text-muted-foreground">
                        {k} <span className="text-foreground">{v}</span>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="rounded-2xl border border-border bg-raised/50 p-4">
                    <div className="flex items-center gap-4">
                      <ScoreRing score={78} size={104} />
                      <div className="space-y-1">
                        <div className="text-sm font-medium">Constructive</div>
                        <p className="text-xs leading-relaxed text-muted-foreground">
                          Probability 68% · confidence 74%.
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2.5">
                      {factors.map((f, i) => (
                        <div key={f.k}>
                          <div className="flex items-center justify-between text-[0.68rem] text-muted-foreground">
                            <span>{f.k}</span>
                            <span className="font-mono tabular text-foreground">{f.v}</span>
                          </div>
                          <div className="mt-1 h-1 overflow-hidden rounded-full bg-border">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ background: "var(--gradient-signal)" }}
                              initial={{ width: 0 }}
                              whileInView={{ width: `${f.v}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1.1, delay: 0.15 * i, ease: [0.16, 1, 0.3, 1] }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-border bg-raised/50 p-4">
                    <div className="text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">Virtual portfolio</div>
                    <div className="mt-1.5 font-display text-2xl tabular">₹12,48,320</div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="font-mono text-xs text-positive tabular">+₹48,320 · +4.03%</span>
                      <Sparkline data={data.slice(-24).map((d) => d.close)} />
                    </div>
                  </div>
                </div>
              </div>
            </Spotlight>
          </motion.div>
        </motion.div>
      </section>

      {/* Lenses */}
      <section className="relative px-5 py-28">
        <div className="mx-auto max-w-6xl">
          <SplitText
            as="h2"
            text="One signal, many lenses."
            className="block max-w-2xl font-display text-[clamp(1.9rem,4.2vw,3rem)] leading-[1.06]"
          />
          <Reveal delay={0.1}>
            <p className="mt-4 max-w-lg text-muted-foreground">
              A single score is only useful if you can take it apart. Quant Plus shows every lens it looked through.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {lenses.map((l, i) => (
              <Reveal key={l.k} delay={i * 0.07} from="up">
                <Spotlight className="panel panel-hover h-full rounded-2xl">
                  <div className="p-6">
                    <l.icon className="size-5 text-mint" strokeWidth={1.5} />
                    <div className="mt-6 font-display text-lg">{l.k}</div>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{l.v}</p>
                  </div>
                </Spotlight>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="px-5 pb-8">
        <div className="mx-auto grid max-w-6xl gap-3 md:grid-cols-2">
          {capabilities.map((c, i) => (
            <Reveal key={c.title} delay={i * 0.08}>
              <Spotlight className="panel panel-hover h-full rounded-2xl">
                <Link to="/app" className="group block h-full p-7">
                  <div className="flex items-start justify-between">
                    <c.icon className={`size-6 ${c.accent}`} strokeWidth={1.4} />
                    <ArrowUpRight className="size-4 -translate-x-1 translate-y-1 text-muted-foreground opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" />
                  </div>
                  <div className="mt-8 font-display text-xl">{c.title}</div>
                  <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">{c.copy}</p>
                </Link>
              </Spotlight>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Pipeline */}
      <section className="px-5 py-28">
        <div ref={pipeRef} className="mx-auto max-w-6xl">
          <SplitText as="h2" text="How Quant Plus thinks." className="block font-display text-[clamp(1.9rem,4.2vw,3rem)] leading-[1.06]" />
          <Reveal delay={0.1}>
            <p className="mt-4 max-w-lg text-muted-foreground">From raw market data to an explainable Quant Score.</p>
          </Reveal>
          <div className="pipe-line mt-12 h-px w-full bg-gradient-to-r from-mint/50 via-signal/40 to-transparent" />
          <div className="mt-6 grid gap-3 md:grid-cols-4">
            {pipeline.map((p) => (
              <div key={p.step} className="pipe-card panel h-full rounded-2xl p-6 opacity-0">
                <div className="font-mono text-xs tracking-widest text-mint">{p.step}</div>
                <div className="mt-4 font-display text-lg">{p.k}</div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Virtual trading */}
      <section className="px-5 pb-28">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="panel hairline relative overflow-hidden rounded-3xl p-8 md:p-14">
              <div className="pointer-events-none absolute inset-0" style={{ background: "var(--gradient-hero)", opacity: 0.6 }} />
              <div className="relative grid gap-10 lg:grid-cols-2 lg:items-center">
                <div>
                  <h2 className="max-w-md font-display text-[clamp(1.7rem,3.6vw,2.6rem)] leading-[1.06]">
                    Simulate the decision <span className="font-serif-accent text-gradient">before</span> you live with it.
                  </h2>
                  <p className="mt-5 max-w-md leading-relaxed text-muted-foreground">
                    Virtual cash, market orders, positions and P&L all live natively inside Quant Plus. Test a thesis,
                    watch it play out, and keep a full order history — nothing leaves the workspace.
                  </p>
                  <Magnetic className="mt-8 w-fit">
                    <Link to="/app/trade" className="btn-sheen inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-medium text-primary-foreground">
                      Open the trade desk <ArrowRight className="size-4" />
                    </Link>
                  </Magnetic>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {([
                    ["Virtual cash", "₹10,00,000"],
                    ["Open positions", "3"],
                    ["Realised P&L", "+₹18,420"],
                    ["Order history", "Full log"],
                  ] as const).map(([k, v], i) => (
                    <Reveal key={k} delay={0.08 * i}>
                      <div className="rounded-2xl border border-border bg-raised/60 p-6">
                        <div className="text-[0.68rem] uppercase tracking-[0.18em] text-muted-foreground">{k}</div>
                        <div className="mt-2 font-display text-xl tabular">{v}</div>
                      </div>
                    </Reveal>
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
