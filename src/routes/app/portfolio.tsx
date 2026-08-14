import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { AppShell } from "@/components/app/AppShell";
import { StatCard } from "@/components/app/bits";
import { PriceChart } from "@/components/viz/PriceChart";
import { getSymbol, inr, series } from "@/lib/market-data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/app/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — Quant Plus virtual holdings" },
      { name: "description", content: "Allocation, performance and risk views across your Quant Plus virtual positions and order history." },
      { property: "og:title", content: "Portfolio — Quant Plus virtual holdings" },
      { property: "og:description", content: "Allocation, P&L and risk analytics for your virtual portfolio." },
    ],
  }),
  component: Portfolio,
});

const COLORS = ["var(--mint)", "var(--signal)", "var(--ai-violet)", "var(--warning)", "var(--positive)", "var(--negative)"];

function Portfolio() {
  const { positions, cash, totalValue, invested, holdingsValue, pnl, orders } = useStore();
  const alloc = positions.map((p) => ({ name: p.symbol, value: Math.round(p.qty * (getSymbol(p.symbol)?.price ?? p.avg)) }));
  const pnlPct = invested ? (pnl / invested) * 100 : 0;

  return (
    <AppShell title="Portfolio" subtitle="Virtual holdings, allocation and performance.">
      <div className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total value" value={totalValue} />
          <StatCard label="Invested" value={invested} delay={0.06} />
          <StatCard label="Unrealised P&L" value={pnl} tone={pnl >= 0 ? "positive" : "negative"} sub={`${pnlPct >= 0 ? "+" : ""}${pnlPct.toFixed(2)}%`} delay={0.12} />
          <StatCard label="Cash" value={cash} delay={0.18} />
        </div>

        <div className="grid gap-3 lg:grid-cols-[1.5fr_1fr]">
          <div className="panel p-5">
            <div className="text-sm font-medium">Portfolio trajectory</div>
            <PriceChart data={series("PORTFOLIO", 70)} positive={pnl >= 0} chartKey="portfolio" height={250} overlays={{ sma: false }} />
          </div>
          <div className="panel p-5">
            <div className="text-sm font-medium">Allocation</div>
            {alloc.length ? (
              <div className="mt-2 h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={[...alloc, { name: "Cash", value: Math.round(cash) }]} dataKey="value" innerRadius={62} outerRadius={92} paddingAngle={3} stroke="none">
                      {[...alloc, { name: "Cash" }].map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} opacity={0.9} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border-active)", borderRadius: 12, fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="py-16 text-center text-sm text-muted-foreground">No positions yet.</p>
            )}
          </div>
        </div>

        <div className="panel overflow-hidden">
          <div className="border-b border-border px-4 py-3 text-sm font-medium">Positions</div>
          <div className="hidden items-center gap-4 border-b border-border px-4 py-2.5 text-[11px] uppercase tracking-widest text-muted-foreground sm:flex">
            <span className="flex-1">Symbol</span><span className="w-16 text-right">Qty</span><span className="w-28 text-right">Avg cost</span>
            <span className="w-28 text-right">Last</span><span className="w-32 text-right">P&L</span>
          </div>
          {positions.length ? positions.map((p, i) => {
            const s = getSymbol(p.symbol);
            const last = s?.price ?? p.avg;
            const gain = (last - p.avg) * p.qty;
            return (
              <motion.div key={p.symbol} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="flex flex-wrap items-center gap-4 border-b border-border px-4 py-3.5 text-sm last:border-0 hover:bg-accent/40">
                <Link to="/app/analyze/$symbol" params={{ symbol: p.symbol }} className="min-w-0 flex-1">
                  <div className="font-medium">{p.symbol}</div>
                  <div className="truncate text-xs text-muted-foreground">{s?.name}</div>
                </Link>
                <span className="w-16 text-right tabular">{p.qty}</span>
                <span className="w-28 text-right tabular">{inr(p.avg)}</span>
                <span className="w-28 text-right tabular">{inr(last)}</span>
                <span className={`w-32 text-right tabular ${gain >= 0 ? "text-positive" : "text-negative"}`}>{gain >= 0 ? "+" : "−"}{inr(Math.abs(gain))}</span>
              </motion.div>
            );
          }) : <p className="p-12 text-center text-sm text-muted-foreground">No positions. Place a virtual order from the trade desk.</p>}
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {[["Holdings value", inr(holdingsValue)], ["Orders logged", String(orders.length)], ["Concentration", alloc.length ? `${Math.round((Math.max(...alloc.map((a) => a.value)) / (holdingsValue || 1)) * 100)}% top name` : "—"]].map(([k, v], i) => (
            <motion.div key={k} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="panel p-5">
              <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{k}</div>
              <div className="mt-1.5 font-display text-xl tabular">{v}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
