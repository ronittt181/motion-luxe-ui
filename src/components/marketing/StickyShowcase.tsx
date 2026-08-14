import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Brain, Filter, LineChart, Wallet } from "lucide-react";
import { PriceChart } from "@/components/viz/PriceChart";
import { ScoreRing } from "@/components/viz/ScoreRing";
import { SplitText } from "@/components/viz/SplitText";
import { SYMBOLS, series, inr, pct } from "@/lib/market-data";

const steps = [
  {
    icon: LineChart,
    k: "Chart it",
    v: "Overlay SMA, EMA, VWAP and Supertrend on any NSE name and read structure across timeframes.",
  },
  { icon: Brain, k: "Score it", v: "A Quant Score with direction, probability and confidence — and the reasoning behind it." },
  { icon: Filter, k: "Screen it", v: "Rank the whole universe by the same factors you just interrogated on one name." },
  { icon: Wallet, k: "Trade it", v: "Place the virtual order, track the position, and keep the full decision trail." },
];

export function StickyShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 60%", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setActive(Math.min(steps.length - 1, Math.max(0, Math.floor(p * steps.length))));
  });

  const sym = SYMBOLS[active % SYMBOLS.length]!;
  const data = series(sym.symbol, 60);

  return (
    <section className="px-5 py-28">
      <div className="mx-auto max-w-6xl">
        <div className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-mint">The workflow</div>
        <SplitText
          as="h2"
          text="From a hunch to a logged decision."
          className="mt-4 block max-w-3xl font-display text-[clamp(1.9rem,4.2vw,3.1rem)] leading-[1.04]"
        />

        <div ref={ref} className="mt-14 grid gap-8 lg:grid-cols-[1fr_1.05fr]">
          {/* steps */}
          <div className="order-2 space-y-3 lg:order-1">
            {steps.map((s, i) => {
              const on = i === active;
              return (
                <button
                  key={s.k}
                  type="button"
                  onClick={() => setActive(i)}
                  className={`relative block w-full overflow-hidden rounded-2xl border p-5 text-left transition-colors duration-500 ${
                    on ? "border-border-active bg-surface" : "border-border bg-raised/40"
                  }`}
                >
                  {on && (
                    <motion.span
                      layoutId="showcase-bar"
                      className="absolute inset-y-2 left-0 w-[3px] rounded-full"
                      style={{ background: "var(--gradient-signal)" }}
                    />
                  )}
                  <div className="flex items-center gap-3 pl-3">
                    <s.icon className={`size-[1.05rem] ${on ? "text-mint" : "text-muted-foreground"}`} strokeWidth={1.5} />
                    <span className="font-display text-lg">{s.k}</span>
                    <span className="ml-auto font-mono text-[0.65rem] text-muted-foreground/70">0{i + 1}</span>
                  </div>
                  <motion.p
                    animate={{ opacity: on ? 1 : 0.55 }}
                    className="mt-2 pl-3 text-sm leading-relaxed text-muted-foreground"
                  >
                    {s.v}
                  </motion.p>
                </button>
              );
            })}
          </div>

          {/* sticky visual */}
          <div className="order-1 lg:order-2">
            <div className="panel hairline sticky top-28 overflow-hidden rounded-3xl p-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-display text-base">{sym.symbol}</div>
                  <div className="text-xs text-muted-foreground">{sym.name}</div>
                </div>
                <div className="text-right">
                  <div className="font-display text-lg tabular">{inr(sym.price)}</div>
                  <div className={`font-mono text-xs tabular ${sym.changePct >= 0 ? "text-positive" : "text-negative"}`}>
                    {pct(sym.changePct)}
                  </div>
                </div>
              </div>
              <PriceChart data={data} positive={sym.changePct >= 0} height={230} chartKey={sym.symbol} />
              <div className="mt-4 flex items-center gap-4 rounded-2xl border border-border bg-raised/50 p-4">
                <ScoreRing score={sym.quantScore} size={92} />
                <AnimatePresence mode="wait">
                  <motion.p
                    key={active}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.4 }}
                    className="text-sm leading-relaxed text-muted-foreground"
                  >
                    <span className="text-foreground">{steps[active]!.k}. </span>
                    {steps[active]!.v}
                  </motion.p>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
