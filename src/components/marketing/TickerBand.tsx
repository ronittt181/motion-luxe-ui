import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { SYMBOLS, pct } from "@/lib/market-data";

/** Scroll-linked marquee of tracked names — moves as the section passes the viewport. */
export function TickerBand() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x1 = useTransform(scrollYProgress, [0, 1], ["2%", "-22%"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["-22%", "2%"]);
  const row = [...SYMBOLS, ...SYMBOLS];

  return (
    <div ref={ref} className="relative overflow-hidden border-y border-border/70 py-6">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-void to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-void to-transparent" />
      {[x1, x2].map((x, r) => (
        <motion.div key={r} style={{ x }} className={`flex w-max gap-3 ${r === 1 ? "mt-3" : ""}`}>
          {row.map((s, i) => (
            <span
              key={`${r}-${s.symbol}-${i}`}
              className="flex shrink-0 items-center gap-2.5 rounded-full border border-border bg-raised/50 px-4 py-2"
            >
              <span className="font-mono text-xs tracking-[0.08em]">{s.symbol}</span>
              <span className={`font-mono text-xs tabular ${s.changePct >= 0 ? "text-positive" : "text-negative"}`}>
                {pct(s.changePct)}
              </span>
            </span>
          ))}
        </motion.div>
      ))}
    </div>
  );
}
