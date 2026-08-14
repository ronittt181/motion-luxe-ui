import { Link } from "@tanstack/react-router";
import { INDICES } from "@/lib/market-data";
import { useStore } from "@/lib/store";

function Cell({ label, value, delta, tone }: { label: string; value: string; delta?: string; tone?: "positive" | "negative" }) {
  return (
    <div className="flex min-w-[150px] flex-1 items-baseline justify-between gap-3 px-4 py-2.5">
      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{label}</span>
      <span className="text-right">
        <span className="tabular text-sm">{value}</span>
        {delta && <span className={`ml-2 tabular text-[11px] ${tone === "negative" ? "text-negative" : "text-positive"}`}>{delta}</span>}
      </span>
    </div>
  );
}

export function MarketSummaryStrip() {
  const { totalValue, cash, pnl, alerts } = useStore();
  const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");
  return (
    <div className="panel flex flex-wrap divide-x divide-border/70 overflow-hidden rounded-2xl">
      {INDICES.map((i) => (
        <Cell key={i.symbol} label={i.symbol} value={i.value.toLocaleString("en-IN", { minimumFractionDigits: 2 })} delta={`${i.changePct >= 0 ? "+" : ""}${i.changePct}%`} tone={i.changePct >= 0 ? "positive" : "negative"} />
      ))}
      <Cell label="Virtual value" value={inr(totalValue)} />
      <Cell label="Today's P&L" value={inr(pnl)} tone={pnl >= 0 ? "positive" : "negative"} delta={pnl >= 0 ? "▲" : "▼"} />
      <Cell label="Virtual cash" value={inr(cash)} />
      <Link to="/app/alerts" className="flex min-w-[150px] flex-1 items-baseline justify-between gap-3 px-4 py-2.5 hover:bg-accent/40">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Active alerts</span>
        <span className="tabular text-sm">{alerts.filter((a) => a.active).length}</span>
      </Link>
    </div>
  );
}
