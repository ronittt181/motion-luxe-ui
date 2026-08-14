import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingPage } from "@/components/marketing/MarketingPage";
import { Reveal } from "@/components/viz/Reveal";
import { Spotlight } from "@/components/viz/Spotlight";
import { Magnetic } from "@/components/viz/Magnetic";
import { ScoreRing } from "@/components/viz/ScoreRing";
import { SCORE_FACTORS, NEWS } from "@/lib/market-data";
import { motion } from "motion/react";

export const Route = createFileRoute("/intelligence")({
  head: () => ({
    meta: [
      { title: "Intelligence — how the Quant Score is built" },
      { name: "description", content: "See how technicals, model output, sentiment, momentum, volume and fundamentals combine into an explainable Quant Score." },
      { property: "og:title", content: "Intelligence — how the Quant Score is built" },
      { property: "og:description", content: "An explainable score, not a black box: every factor and weight is visible." },
    ],
  }),
  component: Intelligence,
});

function Intelligence() {
  return (
    <MarketingPage
      eyebrow="Intelligence"
      title={<>An explainable score, <span className="text-gradient">not a black box.</span></>}
      lede="The Quant Score is a weighted blend of six factor families. Every weight, every contribution and every headline behind the sentiment is visible."
    >
      <div className="grid gap-3 lg:grid-cols-[380px_1fr]">
        <Reveal>
          <Spotlight className="panel relative h-full overflow-hidden rounded-2xl">
            <div className="pointer-events-none absolute inset-0" style={{ background: "var(--gradient-hero)", opacity: 0.5 }} />
            <div className="relative flex h-full flex-col items-center justify-center gap-6 p-8">
              <ScoreRing score={74} size={190} />
              <p className="max-w-xs text-center text-sm leading-relaxed text-muted-foreground">
                A score above 65 leans constructive, 35–65 is mixed, below 35 leans defensive. Always read it alongside the factors.
              </p>
            </div>
          </Spotlight>
        </Reveal>
        <Reveal delay={0.08} from="right">
          <div className="panel h-full p-6 md:p-7">
            <div className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-muted-foreground">Factor weights</div>
            <div className="mt-5 space-y-4">
              {SCORE_FACTORS.map((f, i) => (
                <div key={f.key}>
                  <div className="flex items-center justify-between text-sm">
                    <span>{f.key}</span>
                    <span className="tabular text-muted-foreground">{f.weight}%</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: "var(--gradient-signal)" }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${f.weight * 4}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      <Reveal delay={0.05}>
        <div className="panel mt-3 p-6 md:p-7">
          <div className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-muted-foreground">Sentiment input · demo headlines</div>
          <div className="mt-4 divide-y divide-border">
            {NEWS.map((n) => (
              <div key={n.title} className="group flex items-center gap-4 rounded-lg py-3.5 transition-colors duration-300 hover:bg-accent/30">
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-[11px] capitalize ${
                    n.tone === "positive" ? "border-positive/30 bg-positive/10 text-positive"
                    : n.tone === "negative" ? "border-negative/30 bg-negative/10 text-negative"
                    : "border-border bg-muted text-muted-foreground"
                  }`}
                >
                  {n.tone}
                </span>
                <span className="flex-1 text-sm">{n.title}</span>
                <span className="hidden text-xs text-muted-foreground sm:block">{n.source} · {n.time}</span>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <div className="panel hairline relative mt-3 flex flex-wrap items-center justify-between gap-4 overflow-hidden p-8 md:p-10">
          <div className="pointer-events-none absolute inset-0" style={{ background: "var(--gradient-hero)", opacity: 0.55 }} />
          <p className="relative max-w-md text-sm leading-relaxed text-muted-foreground">
            Model outputs are probabilistic and informational. Quant Plus never promises returns and all trading in the
            product is virtual.
          </p>
          <Magnetic className="relative">
            <Link to="/app/intelligence" className="btn-primary btn-sheen">Open AI Intelligence</Link>
          </Magnetic>
        </div>
      </Reveal>
    </MarketingPage>
  );
}
