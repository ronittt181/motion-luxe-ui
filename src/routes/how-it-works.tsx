import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingPage } from "@/components/marketing/MarketingPage";
import { Reveal } from "@/components/viz/Reveal";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How it works — Quant Plus methodology" },
      { name: "description", content: "From market data ingestion to indicators, model inference, sentiment and native virtual execution — the Quant Plus pipeline explained." },
      { property: "og:title", content: "How it works — Quant Plus methodology" },
      { property: "og:description", content: "The pipeline from raw market data to an explainable score and a virtual order." },
    ],
  }),
  component: HowItWorks,
});

const steps = [
  { n: "01", t: "Ingest market data", d: "Prices, volumes, corporate fundamentals and news coverage for tracked Indian equities and indices are normalised into one schema." },
  { n: "02", t: "Compute the indicator stack", d: "SMA, EMA, RSI, MACD, Bollinger Bands, VWAP, ATR and Supertrend are computed per timeframe and cached as model features." },
  { n: "03", t: "Run model inference", d: "A directional classifier returns probability and confidence. Outputs are calibrated and always surfaced with their uncertainty." },
  { n: "04", t: "Score the news", d: "A FinBERT-style classifier labels each headline positive, neutral or negative and aggregates a rolling tone distribution." },
  { n: "05", t: "Blend the Quant Score", d: "Technical, model, sentiment, momentum, volume and fundamental factors combine under fixed weights into one 0–100 score." },
  { n: "06", t: "Act natively", d: "Place a virtual market order inside Quant Plus. Cash, positions, P&L and history update in place — nothing is routed anywhere." },
];

function HowItWorks() {
  return (
    <MarketingPage
      eyebrow="How it works"
      title={<>From raw ticks to a decision <span className="text-gradient">you can defend.</span></>}
      lede="Six stages, each inspectable. The methodology is deliberately transparent so the output is something you can reason about rather than trust blindly."
    >
      <div className="relative">
        <div className="absolute left-[15px] top-2 hidden h-[calc(100%-1rem)] w-px bg-border md:block" />
        <div className="space-y-3">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.06} from="left">
              <div className="flex gap-5">
                <div className="hidden size-8 shrink-0 place-items-center rounded-full border border-border bg-raised font-mono text-[11px] text-mint md:grid">
                  {s.n}
                </div>
                <div className="panel panel-hover flex-1 p-6">
                  <div className="font-mono text-xs text-mint md:hidden">{s.n}</div>
                  <div className="mt-1 font-display text-lg md:mt-0">{s.t}</div>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{s.d}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
      <Reveal delay={0.1}>
        <div className="panel mt-6 flex flex-wrap items-center justify-between gap-4 p-8">
          <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
            Demonstration data powers this build. Live exchange feeds slot in behind the same typed contract.
          </p>
          <Link to="/signup" className="rounded-xl bg-primary px-5 py-3 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02]">
            Create your account
          </Link>
        </div>
      </Reveal>
    </MarketingPage>
  );
}
