import { Link } from "@tanstack/react-router";
import { INDICES } from "@/lib/market-data";
import { useStore } from "@/lib/store";

function Cell({ label, value, delta, tone }: { label: string; value: string; delta?: string; tone?: "positive" | "negative" }) {
  return (
    <div className="min-w-0 px-4 py-3">
      <div className="truncate font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{label}</div>
      <div className="mt-1 flex items-baseline gap-2">
        <span className="tabular text-sm">{value}</span>
        {delta && <span className={`tabular text-[11px] ${tone === "negative" ? "text-negative" : "text-positive"}`}>{delta}</span>}
      </div>
    </div>
  );
}

export function MarketSummaryStrip() {
  const { totalValue, cash, pnl, alerts } = useStore();
  const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");
  return (
    <div className="panel grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-border/50 sm:grid-cols-4 xl:grid-cols-8 [&>*]:bg-surface/60">
      {INDICES.map((i) => (
        <Cell key={i.symbol} label={i.symbol} value={i.value.toLocaleString("en-IN", { minimumFractionDigits: 2 })} delta={`${i.changePct >= 0 ? "+" : ""}${i.changePct}%`} tone={i.changePct >= 0 ? "positive" : "negative"} />
      ))}
      <Cell label="Virtual value" value={inr(totalValue)} />
      <Cell label="Today's P&L" value={inr(pnl)} tone={pnl >= 0 ? "positive" : "negative"} delta={pnl >= 0 ? "▲" : "▼"} />
      <Cell label="Virtual cash" value={inr(cash)} />
      <Link to="/app/alerts" className="min-w-0 px-4 py-3 transition-colors hover:bg-accent/40">
        <div className="truncate font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Active alerts</div>
        <div className="mt-1 tabular text-sm">{alerts.filter((a) => a.active).length}</div>
      </Link>
    </div>
  );
}
