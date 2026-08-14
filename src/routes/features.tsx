import { createFileRoute, Link } from "@tanstack/react-router";
import { Activity, Bell, Brain, Briefcase, Filter, LineChart, Newspaper, Star } from "lucide-react";
import { MarketingPage } from "@/components/marketing/MarketingPage";
import { Reveal } from "@/components/viz/Reveal";
import { Spotlight } from "@/components/viz/Spotlight";
import { Magnetic } from "@/components/viz/Magnetic";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Features — Quant Plus market workspace" },
      { name: "description", content: "Charts, indicators, AI prediction, sentiment, screening, virtual trading, portfolio analytics, watchlists and alerts in one workspace." },
      { property: "og:title", content: "Features — Quant Plus market workspace" },
      { property: "og:description", content: "Everything Quant Plus brings together for Indian market analysis and virtual trading." },
    ],
  }),
  component: Features,
});

const features = [
  { icon: LineChart, t: "Charts and overlays", d: "Timeframes from intraday to multi-year with SMA, EMA, Bollinger Bands, VWAP and Supertrend overlays that stay readable." },
  { icon: Activity, t: "Indicator stack", d: "RSI, MACD and ATR computed consistently, presented with the context needed to read them rather than raw numbers." },
  { icon: Brain, t: "AI prediction", d: "Direction, probability and confidence, each accompanied by an explanation of the factors that moved the view." },
  { icon: Newspaper, t: "News sentiment", d: "FinBERT-style tone distribution across positive, neutral and negative coverage, with the headlines behind it." },
  { icon: Filter, t: "Quantitative screener", d: "Stack technical and fundamental filters, sort by Quant Score, and jump straight into deep analysis." },
  { icon: Briefcase, t: "Portfolio analytics", d: "Allocation, performance and risk views built on your native virtual positions and order history." },
  { icon: Star, t: "Persistent watchlists", d: "Track what matters across sessions, with score and sentiment visible at a glance." },
  { icon: Bell, t: "Native alerts", d: "Price, indicator, score, sentiment and unusual-volume alerts with clear confirmation states." },
];

function Features() {
  return (
    <MarketingPage
      eyebrow="Features"
      title={<>Everything you need to read a move — <span className="text-gradient">and act on it.</span></>}
      lede="Quant Plus is one workspace. Analysis, intelligence, screening and virtual execution share the same data, the same language and the same score."
    >
      <div className="grid gap-3 md:grid-cols-2">
        {features.map((f, i) => (
          <Reveal key={f.t} delay={i * 0.05} from={i % 2 ? "right" : "left"}>
            <Spotlight className="panel panel-hover group h-full rounded-2xl">
              <div className="flex h-full flex-col p-7">
                <div className="flex items-start justify-between">
                  <span className="grid size-10 place-items-center rounded-xl border border-border bg-surface-elevated/60">
                    <f.icon className="size-[1.05rem] text-mint" strokeWidth={1.5} />
                  </span>
                  <span className="font-mono text-[0.65rem] text-muted-foreground/60">0{i + 1}</span>
                </div>
                <div className="mt-8 font-display text-lg">{f.t}</div>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.d}</p>
                <div className="mt-6 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-mint/70 to-transparent transition-transform duration-700 group-hover:scale-x-100" />
              </div>
            </Spotlight>
          </Reveal>
        ))}
      </div>
      <Reveal delay={0.1}>
        <div className="panel hairline relative mt-6 flex flex-wrap items-center justify-between gap-4 overflow-hidden p-8 md:p-10">
          <div className="pointer-events-none absolute inset-0" style={{ background: "var(--gradient-hero)", opacity: 0.55 }} />
          <div className="relative">
            <div className="font-display text-2xl">Ready to look inside the workspace?</div>
            <p className="mt-1.5 text-sm text-muted-foreground">Open the demo environment — no setup required.</p>
          </div>
          <Magnetic className="relative">
            <Link to="/app" className="btn-primary btn-sheen">Launch Quant Plus</Link>
          </Magnetic>
        </div>
      </Reveal>
    </MarketingPage>
  );
}
