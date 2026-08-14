import { useEffect, useMemo, useState } from "react";
import { motion } from "motion/react";
import { INDICES } from "@/lib/market-data";
import { AnimatedNumber } from "@/components/viz/AnimatedNumber";
import { Sparkline } from "@/components/viz/Sparkline";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

function seedSeries(seed: number, n = 28) {
  let v = 100;
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    v += Math.sin((i + seed) * 0.7) * 1.1 + (((i * seed) % 7) - 3) * 0.35;
    out.push(v);
  }
  return out;
}

export function MarketStrip() {
  const [data, setData] = useState(INDICES);
  const [stamp, setStamp] = useState("");
  const sparks = useMemo(() => INDICES.map((_, i) => seedSeries(i + 2)), []);

  useEffect(() => {
    const tick = () => {
      setData((d) =>
        d.map((i) => {
          const drift = (Math.random() - 0.5) * (i.value * 0.0006);
          return { ...i, value: +(i.value + drift).toFixed(2), changePct: +(i.changePct + drift / 400).toFixed(2) };
        }),
      );
      setStamp(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    };
    tick();
    const id = setInterval(tick, 3200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="panel hairline overflow-hidden rounded-2xl">
      <div className="flex items-center justify-between border-b border-border/70 px-4 py-2.5">
        <span className="flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.16em] text-muted-foreground">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-mint opacity-70" />
            <span className="relative inline-flex size-1.5 rounded-full bg-mint" />
          </span>
          Live market snapshot
        </span>
        <span className="font-mono text-[0.7rem] tabular text-muted-foreground">{stamp}</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4">
        {data.map((i, idx) => {
          const up = i.changePct >= 0;
          return (
            <motion.div
              key={i.symbol}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * idx, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="group relative border-b border-border/70 px-4 py-4 last:border-b-0 md:border-b-0 md:[&:not(:last-child)]:border-r"
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: `linear-gradient(180deg, color-mix(in oklab, var(--${up ? "positive" : "negative"}) 7%, transparent), transparent 70%)` }}
              />
              <div className="relative">
                <div className="text-[0.65rem] uppercase tracking-[0.18em] text-muted-foreground">{i.symbol}</div>
                <div className="mt-1.5 font-display text-[1.35rem] leading-none tabular">
                  <AnimatedNumber value={i.value} />
                </div>
                <div className="mt-2.5 flex items-end justify-between gap-2">
                  <span className={`flex items-center gap-1 font-mono text-xs tabular ${up ? "text-positive" : "text-negative"}`}>
                    {up ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
                    {up ? "+" : ""}
                    {i.changePct.toFixed(2)}%
                  </span>
                  <Sparkline data={sparks[idx] ?? []} positive={up} width={72} height={26} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
