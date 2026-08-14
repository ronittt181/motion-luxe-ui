import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { RefreshCw, Search } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { AIMarketBriefing } from "@/components/intel/AIMarketBriefing";
import { MarketPulseMap } from "@/components/intel/MarketPulseMap";
import { MarketCauseChain } from "@/components/intel/MarketCauseChain";
import { RecentChangeFeed } from "@/components/intel/RecentChangeFeed";
import { PersonalizedImpact } from "@/components/intel/PersonalizedImpact";
import { IntelligenceFeed } from "@/components/intel/IntelligenceFeed";
import { AskQuantPlus } from "@/components/intel/AskQuantPlus";
import { MarketReplay } from "@/components/intel/MarketReplay";
import { MarketSummaryStrip } from "@/components/intel/MarketSummaryStrip";
import { DataStatusBadge, SectionHead } from "@/components/intel/primitives";
import { greeting, marketSession, nowStamp, personalizedInsights, DATA_STATUS } from "@/lib/intelligence";
import { getSymbol } from "@/lib/market-data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/app/")({
  head: () => ({
    meta: [
      { title: "Market Intelligence Command Center — Quant Plus" },
      { name: "description", content: "An AI market briefing for Indian equities: what is moving, why it is moving, what changed since your last visit and what it means for your virtual portfolio." },
      { property: "og:title", content: "Market Intelligence Command Center — Quant Plus" },
      { property: "og:description", content: "AI briefing, intelligence map, cause chain, anomalies and market replay for Indian markets." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Dashboard,
});

const Section = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => (
  <motion.section
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
  >
    {children}
  </motion.section>
);

function Dashboard() {
  const { user, positions, watchlist, alerts, totalValue } = useStore();
  const [stamp, setStamp] = useState("--:--:--");
  const [refreshing, setRefreshing] = useState(false);
  const [today, setToday] = useState("");
  const [session, setSession] = useState<{ label: string; tone: "positive" | "neutral" | "negative" }>({ label: "Market status", tone: "neutral" });
  const [hello, setHello] = useState("Welcome back");

  useEffect(() => {
    const d = new Date();
    setStamp(nowStamp());
    setToday(d.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" }));
    setSession(marketSession(d));
    setHello(greeting(d));
  }, []);

  const holdings = positions.map((p) => p.symbol);
  const finShare = useMemo(() => {
    if (!positions.length) return 0;
    const total = positions.reduce((a, p) => a + p.qty * (getSymbol(p.symbol)?.price ?? p.avg), 0);
    const fin = positions
      .filter((p) => getSymbol(p.symbol)?.sector === "Financials")
      .reduce((a, p) => a + p.qty * (getSymbol(p.symbol)?.price ?? p.avg), 0);
    return Math.round((fin / total) * 100);
  }, [positions]);

  const insights = personalizedInsights({
    holdings,
    watchlist,
    alerts: alerts.filter((a) => a.active).length,
    portfolioShareFin: finShare,
  });
  const hasSession = holdings.length > 0 || watchlist.length > 0;

  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => { setStamp(nowStamp()); setRefreshing(false); }, 700);
  };

  return (
    <AppShell
      title={`${hello}${user ? `, ${user.name.split(" ")[0]}` : ""}`}
      subtitle="Here is what the market is telling us today."
      action={
        <div className="flex flex-wrap items-center gap-2">
          <span className="flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1.5 text-xs text-muted-foreground">
            <span className={`size-1.5 rounded-full ${session.tone === "positive" ? "bg-positive" : "bg-neutral"}`} />
            {session.label} · {today} · Updated {stamp}
          </span>
          <DataStatusBadge status={DATA_STATUS} />
          <span className="hidden rounded-full border border-border bg-surface/60 px-3 py-1.5 text-xs text-muted-foreground sm:inline">
            Virtual ₹{Math.round(totalValue).toLocaleString("en-IN")}
          </span>
          <button
            onClick={refresh}
            aria-label="Refresh intelligence"
            className="flex min-h-[36px] items-center gap-1.5 rounded-xl border border-border bg-surface/60 px-3 text-xs text-muted-foreground transition-colors hover:border-mint/40 hover:text-mint"
          >
            <RefreshCw className={`size-3.5 ${refreshing ? "animate-spin" : ""}`} /> {refreshing ? "Refreshing" : "Refresh"}
          </button>
          <Link to="/app/analyze" className="flex min-h-[36px] items-center gap-1.5 rounded-xl border border-border bg-surface/60 px-3 text-xs text-muted-foreground transition-colors hover:border-mint/40 hover:text-mint">
            <Search className="size-3.5" /> Find a stock
          </Link>
        </div>
      }
    >
      <div className="space-y-10">
        <div className="grid min-w-0 gap-4 xl:grid-cols-[1.35fr_1fr] [&>*]:min-w-0">
          <AIMarketBriefing holdings={holdings} watchlist={watchlist} />
          <div className="space-y-4">
            <MarketPulseMap />
          </div>
        </div>

        <Section>
          <SectionHead eyebrow="Causal chain" title="Why the market is moving" sub="Each step is an observed change. Open a step to see the metric, its previous and current value and what it implies." />
          <MarketCauseChain />
        </Section>

        <Section>
          <SectionHead eyebrow="Delta feed" title="What changed since your last visit" sub="Ranked by recency across market, portfolio, watchlist and alert context." />
          <RecentChangeFeed hasSession={hasSession} />
        </Section>

        <Section>
          <SectionHead eyebrow="Personal" title="What this means for you" sub="Only shown when there is real activity in your virtual portfolio, watchlist or alerts." />
          <PersonalizedImpact insights={insights} />
        </Section>

        <Section>
          <SectionHead eyebrow="Intelligence feed" title="Opportunities, risks and anomalies" sub="Developing setups and conditions that require attention — evidence and confidence attached, never a recommendation." />
          <IntelligenceFeed />
        </Section>

        <Section>
          <AskQuantPlus />
        </Section>

        <Section>
          <SectionHead eyebrow="Session" title="Market replay" sub="Scrub through the session to understand how today's state was reached." />
          <MarketReplay />
        </Section>

        <Section>
          <SectionHead eyebrow="Reference" title="Market and portfolio snapshot" />
          <MarketSummaryStrip />
          <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
            Quant Plus insights are informational. Predictions are probabilistic, and all trading activity is virtual. Market data on this page is simulated for demonstration.
          </p>
        </Section>
      </div>
    </AppShell>
  );
}
