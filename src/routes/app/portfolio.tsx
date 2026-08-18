import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "motion/react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { AppShell } from "@/components/app/AppShell";
import { Bar, EmptyState, KpiTile, Money, Panel, Segmented } from "@/components/app/kit";
import { PriceChart } from "@/components/viz/PriceChart";
import { ScorePill } from "@/components/app/bits";
import { getSymbol, inr, series } from "@/lib/market-data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/app/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — Quant Plus virtual holdings" },
      { name: "description", content: "Allocation, sector exposure, contributors and performance across your Quant Plus virtual positions." },
      { property: "og:title", content: "Portfolio — Quant Plus virtual holdings" },
      { property: "og:description", content: "Allocation, P&L and risk analytics for your virtual portfolio." },
    ],
  }),
  component: Portfolio,
});

const COLORS = ["var(--mint)", "var(--signal)", "var(--ai-violet)", "var(--warning)", "var(--positive)", "var(--negative)"];
const RANGES = [{ value: "1W", label: "1W" }, { value: "1M", label: "1M" }, { value: "ALL", label: "All" }] as const;

function Portfolio() {
  const { positions, cash, totalValue, invested, holdingsValue, pnl, orders } = useStore();
  const [range, setRange] = useState<(typeof RANGES)[number]["value"]>("1M");
  const pnlPct = invested ? (pnl / invested) * 100 : 0;
  const points = range === "1W" ? 24 : range === "1M" ? 48 : 90;

  const rows = positions
    .map((p) => {
      const s = getSymbol(p.symbol);
      const last = s?.price ?? p.avg;
      const mv = p.qty * last;
      return { ...p, s, last, mv, gain: (last - p.avg) * p.qty, gainPct: ((last - p.avg) / p.avg) * 100 };
    })
    .sort((a, b) => b.mv - a.mv);

  const alloc = rows.map((r) => ({ name: r.symbol, value: Math.round(r.mv) }));
  const sectorMap = new Map<string, number>();
  rows.forEach((r) => sectorMap.set(r.s.sector, (sectorMap.get(r.s.sector) ?? 0) + r.mv));
  const sectorRows = [...sectorMap.entries()].sort((a, b) => b[1] - a[1]);
  const best = [...rows].sort((a, b) => b.gain - a.gain)[0];
  const worst = [...rows].sort((a, b) => a.gain - b.gain)[0];

  return (
    <AppShell title="Portfolio" subtitle="Virtual holdings, allocation, exposure and performance.">
      <div className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          <KpiTile label="Account value" value={inr(totalValue)} />
          <KpiTile label="Invested" value={inr(invested)} delay={0.04} />
          <KpiTile label="Unrealised P&L" value={<Money value={pnl} tone />} delta={pnlPct} delay={0.08} />
          <KpiTile label="Cash" value={inr(cash)} sub={`${Math.round((cash / (totalValue || 1)) * 100)}% of book`} delay={0.12} />
          <KpiTile label="Positions" value={positions.length} sub={`${orders.length} orders logged`} delay={0.16} />
        </div>

        <div className="grid min-w-0 gap-3 lg:grid-cols-[1.5fr_minmax(0,1fr)]">
          <Panel
            title="Equity curve"
            eyebrow="Virtual account"
            action={<Segmented id="pf-range" size="xs" value={range} onChange={setRange} options={RANGES} />}
            flush
          >
            <div className="px-3 pb-3">
              <PriceChart data={series(`PORTFOLIO-${range}`, points)} positive={pnl >= 0} chartKey={`portfolio-${range}`} height={250} overlays={{ sma: false }} />
            </div>
          </Panel>

          <Panel title="Allocation" eyebrow="By market value">
            {alloc.length ? (
              <div className="h-[250px]">
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
              <EmptyState title="No positions yet" body="Allocation appears once you hold something." />
            )}
          </Panel>
        </div>

        <div className="grid min-w-0 gap-3 lg:grid-cols-[minmax(0,1fr)_320px]">
          <Panel title="Holdings" flush>
            {rows.length ? (
              <>
                <div className="hidden items-center gap-4 border-b border-border px-4 py-2.5 t-label text-muted-foreground sm:flex">
                  <span className="flex-1">Symbol</span>
                  <span className="w-14 text-right">Qty</span>
                  <span className="w-24 text-right">Avg</span>
                  <span className="w-24 text-right">Last</span>
                  <span className="w-16 text-right">Weight</span>
                  <span className="w-12 text-right">Score</span>
                  <span className="w-32 text-right">P&L</span>
                </div>
                {rows.map((r, i) => (
                  <motion.div key={r.symbol} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18, delay: Math.min(i * 0.03, 0.2) }} className="flex flex-wrap items-center gap-4 border-b border-border px-4 py-3.5 text-sm last:border-0 hover:bg-accent/40">
                    <Link to="/app/analyze/$symbol" params={{ symbol: r.symbol }} className="min-w-0 flex-1">
                      <div className="font-medium">{r.symbol}</div>
                      <div className="truncate text-xs text-muted-foreground">{r.s.name}</div>
                    </Link>
                    <span className="w-14 text-right tabular">{r.qty}</span>
                    <span className="w-24 text-right tabular">{inr(r.avg)}</span>
                    <span className="w-24 text-right tabular">{inr(r.last)}</span>
                    <span className="w-16 text-right tabular text-muted-foreground">{Math.round((r.mv / (holdingsValue || 1)) * 100)}%</span>
                    <span className="w-12 text-right"><ScorePill score={r.s.quantScore} /></span>
                    <span className="w-32 text-right">
                      <Money value={r.gain} tone />
                      <span className={`block text-[11px] tabular ${r.gain >= 0 ? "text-positive" : "text-negative"}`}>{r.gainPct >= 0 ? "+" : ""}{r.gainPct.toFixed(2)}%</span>
                    </span>
                  </motion.div>
                ))}
              </>
            ) : (
              <EmptyState title="No positions" body="Place a virtual order from the trade desk to start the book." action={<Link to="/app/trade" className="btn-primary mt-1 px-4 py-2 text-xs">Open trade desk</Link>} />
            )}
          </Panel>

          <div className="space-y-3">
            <Panel title="Sector exposure">
              {sectorRows.length ? (
                <div className="space-y-3">
                  {sectorRows.map(([name, v]) => (
                    <div key={name}>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">{name}</span>
                        <span className="tabular">{Math.round((v / (holdingsValue || 1)) * 100)}%</span>
                      </div>
                      <div className="mt-1.5"><Bar value={(v / (holdingsValue || 1)) * 100} /></div>
                    </div>
                  ))}
                </div>
              ) : <p className="text-sm text-muted-foreground">No exposure yet.</p>}
            </Panel>

            <Panel title="Contributors" eyebrow="Unrealised">
              {best && worst ? (
                <div className="space-y-3 text-sm">
                  <div className="rounded-xl border border-positive/25 bg-positive/8 p-3">
                    <div className="t-label text-muted-foreground">Best</div>
                    <div className="mt-1 flex items-center justify-between"><span>{best.symbol}</span><Money value={best.gain} tone /></div>
                  </div>
                  <div className="rounded-xl border border-negative/25 bg-negative/8 p-3">
                    <div className="t-label text-muted-foreground">Worst</div>
                    <div className="mt-1 flex items-center justify-between"><span>{worst.symbol}</span><Money value={worst.gain} tone /></div>
                  </div>
                  <div className="rounded-xl border border-border bg-raised/40 p-3">
                    <div className="t-label text-muted-foreground">Concentration</div>
                    <div className="mt-1 tabular">{Math.round(((rows[0]?.mv ?? 0) / (holdingsValue || 1)) * 100)}% in {rows[0]?.symbol}</div>
                  </div>
                </div>
              ) : <p className="text-sm text-muted-foreground">Contributors appear once you hold positions.</p>}
            </Panel>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
