import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus } from "lucide-react";
import { Reveal } from "@/components/viz/Reveal";

const faqs = [
  { q: "Is Quant Plus investment advice?", a: "No. Every score, probability and prediction is informational only. Quant Plus is a research and simulation workspace, not a broker or advisor." },
  { q: "Where does the market data come from?", a: "Prices, volumes, fundamentals and news coverage for tracked NSE and BSE names, normalised into one indicator and sentiment pipeline." },
  { q: "How is the Quant Score calculated?", a: "Weighted factors — technical structure, model output, news sentiment, fundamentals and participation — combined into a single 0–100 score you can take apart lens by lens." },
  { q: "Do I need a broker account?", a: "No. Trading inside Quant Plus is fully virtual: virtual cash, virtual positions, and a complete order history that never leaves the workspace." },
];

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="px-5 py-24">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <div className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-mint">FAQ</div>
          <h2 className="mt-4 font-display text-[clamp(1.7rem,3.6vw,2.6rem)] leading-[1.06]">Questions, answered plainly.</h2>
        </div>
        <div className="divide-y divide-border border-y border-border">
          {faqs.map((f, i) => {
            const on = open === i;
            return (
              <Reveal key={f.q} delay={i * 0.06}>
                <button type="button" onClick={() => setOpen(on ? null : i)} className="group flex w-full items-center gap-4 py-5 text-left">
                  <span className={`flex-1 font-display text-lg transition-colors duration-500 ${on ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"}`}>
                    {f.q}
                  </span>
                  <Plus className={`size-4 shrink-0 text-mint transition-transform duration-500 ${on ? "rotate-45" : ""}`} />
                </button>
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="max-w-xl pb-6 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
