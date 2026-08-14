import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { StatCard, SymbolRow } from "@/components/app/bits";
import { PriceChart } from "@/components/viz/PriceChart";
import { ScoreRing } from "@/components/viz/ScoreRing";
import { MarketStrip } from "@/components/marketing/MarketStrip";
import { SYMBOLS, series, NEWS, inr } from "@/lib/market-data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/app/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Quant Plus workspace" },
      { name: "description", content: "Your Quant Plus dashboard: market snapshot, virtual portfolio value, top signals and latest sentiment." },
      { property: "og:title", content: "Dashboard — Quant Plus workspace" },
      { property: "og:description", content: "Market snapshot, portfolio value and top AI signals at a glance." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { totalValue, cash, pnl, positions, user } = useStore();
  const top = [...SYMBOLS].sort((a, b) => b.quantScore - a.quantScore).slice(0, 6);
  const lead = top[0];

  return (
    <AppShell
      title={`Good to see you${user ? `, ${user.name.split(" ")[0]}` : ""}`}
      subtitle="A calm read on today's market, your virtual portfolio and the strongest signals."
      action={
        <Link to="/app/trade" className="rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02]">
          Place a virtual order
        </Link>
      }
    >
      <div className="space-y-3">
        <MarketStrip />

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Portfolio value" value={totalValue} delay={0.05} />
          <StatCard label="Virtual cash" value={cash} delay={0.1} />
          <StatCard label="Unrealised P&L" value={pnl} tone={pnl >= 0 ? "positive" : "negative"} delay={0.15} />
          <StatCard label="Open positions" value={positions.length} prefix="" decimals={0} delay={0.2} />
        </div>

        <div className="grid gap-3 lg:grid-cols-[1.6fr_1fr]">
          <div className="panel p-5">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-display text-lg">{lead.symbol}</div>
                <div className="text-xs text-muted-foreground">Highest Quant Score today · {lead.name}</div>
              </div>
              <Link to="/app/analyze/$symbol" params={{ symbol: lead.symbol }} className="flex items-center gap-1.5 text-xs text-mint hover:underline">
                Analyze <ArrowRight className="size-3.5" />
              </Link>
            </div>
            <PriceChart data={series(lead.symbol, 70)} positive={lead.changePct >= 0} chartKey={lead.symbol} height={260} />
          </div>
          <div className="panel flex flex-col items-center justify-center gap-4 p-5">
            <ScoreRing score={lead.quantScore} />
            <div className="text-center text-sm">
              <div className="font-medium">{lead.direction === "up" ? "Upward bias" : "Downward bias"}</div>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                Probability {lead.probability}% · confidence {lead.confidence}%. Trend and volume agree; sentiment adds
                a mild tilt. Informational only.
              </p>
            </div>
            <div className="w-full rounded-xl border border-border bg-raised/60 p-3 text-center">
              <div className="text-[11px] uppercase tracking-widest text-muted-foreground">Last price</div>
              <div className="mt-0.5 font-display text-xl tabular">{inr(lead.price)}</div>
            </div>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr]">
          <div className="panel overflow-hidden">
            <div className="border-b border-border px-4 py-3 text-sm font-medium">Top signals</div>
            {top.map((s, i) => <SymbolRow key={s.symbol} s={s} index={i} />)}
          </div>
          <div className="panel overflow-hidden">
            <div className="border-b border-border px-4 py-3 text-sm font-medium">Market sentiment feed</div>
            <div className="divide-y divide-border">
              {NEWS.map((n) => (
                <div key={n.title} className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <span className={`size-1.5 rounded-full ${n.tone === "positive" ? "bg-positive" : n.tone === "negative" ? "bg-negative" : "bg-neutral"}`} />
                    <span className="text-xs text-muted-foreground">{n.source} · {n.time}</span>
                  </div>
                  <p className="mt-1.5 text-sm leading-snug">{n.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
