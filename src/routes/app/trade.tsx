import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { AppShell } from "@/components/app/AppShell";
import { EmptyState, KpiTile, Money, Panel, Segmented } from "@/components/app/kit";
import { PriceChart } from "@/components/viz/PriceChart";
import { SYMBOLS, getSymbol, inr, series } from "@/lib/market-data";
import { useStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/app/trade")({
  validateSearch: z.object({ symbol: z.string().optional() }),
  head: () => ({
    meta: [
      { title: "Trade desk — Quant Plus virtual orders" },
      { name: "description", content: "Place virtual market and limit orders with virtual cash, then track positions, P&L and the order blotter in place." },
      { property: "og:title", content: "Trade desk — Quant Plus virtual orders" },
      { property: "og:description", content: "Virtual order ticket, positions and blotter inside Quant Plus." },
    ],
  }),
  component: Trade,
});

function Trade() {
  const search = useSearch({ from: "/app/trade" });
  const { cash, positions, orders, placeOrder, holdingsValue, totalValue } = useStore();
  const [symbol, setSymbol] = useState(search.symbol ?? "RELIANCE");
  const [side, setSide] = useState<"BUY" | "SELL">("BUY");
  const [type, setType] = useState<"MARKET" | "LIMIT">("MARKET");
  const [qty, setQty] = useState(10);
  const [limit, setLimit] = useState("");
  const [confirming, setConfirming] = useState(false);
  const [filled, setFilled] = useState(false);
  const [tab, setTab] = useState<"all" | "buy" | "sell">("all");

  useEffect(() => { if (search.symbol) setSymbol(search.symbol); }, [search.symbol]);

  const sym = getSymbol(symbol);
  const price = type === "LIMIT" && Number(limit) > 0 ? Number(limit) : sym.price;
  const value = qty * price;
  const held = positions.find((p) => p.symbol === symbol)?.qty ?? 0;
  const cashAfter = side === "BUY" ? cash - value : cash + value;
  const maxQty = side === "BUY" ? Math.floor(cash / price) : held;

  const blotter = useMemo(
    () => orders.filter((o) => (tab === "all" ? true : tab === "buy" ? o.side === "BUY" : o.side === "SELL")),
    [orders, tab],
  );

  const commit = () => {
    const res = placeOrder({ symbol, side, qty, price });
    setConfirming(false);
    if (!res.ok) { toast.error(res.message); return; }
    toast.success(res.message);
    setFilled(true);
    setTimeout(() => setFilled(false), 1600);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (qty <= 0) { toast.error("Enter a quantity greater than zero."); return; }
    setConfirming(true);
  };

  return (
    <AppShell title="Trade desk" subtitle="All orders are virtual and settle instantly inside Quant Plus.">
      <div className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <KpiTile label="Virtual cash" value={inr(cash)} />
          <KpiTile label="Holdings value" value={inr(holdingsValue)} delay={0.04} />
          <KpiTile label="Account value" value={inr(totalValue)} delay={0.08} />
          <KpiTile label="Orders logged" value={orders.length} delay={0.12} sub="This session" />
        </div>

        <div className="grid min-w-0 gap-3 lg:grid-cols-[360px_minmax(0,1fr)]">
          <form onSubmit={submit} className="panel h-fit space-y-4 p-5">
            <div className="grid grid-cols-2 gap-2 rounded-xl border border-border p-1">
              {(["BUY", "SELL"] as const).map((s) => (
                <button key={s} type="button" onClick={() => setSide(s)} className={`relative rounded-lg py-2 text-sm font-medium ${side === s ? "text-foreground" : "text-muted-foreground"}`}>
                  {side === s && (
                    <motion.span
                      layoutId="side-pill"
                      className={`absolute inset-0 rounded-lg border ${s === "BUY" ? "border-positive/30 bg-positive/15" : "border-negative/30 bg-negative/15"}`}
                      transition={{ type: "spring", stiffness: 460, damping: 36 }}
                    />
                  )}
                  <span className="relative">{s === "BUY" ? "Buy" : "Sell"}</span>
                </button>
              ))}
            </div>

            <div className="space-y-1.5">
              <span className="t-label text-muted-foreground">Symbol</span>
              <Select value={symbol} onValueChange={setSymbol}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{SYMBOLS.map((s) => <SelectItem key={s.symbol} value={s.symbol}>{s.symbol} · {s.name}</SelectItem>)}</SelectContent>
              </Select>
              <div className="flex items-center justify-between pt-1 text-xs text-muted-foreground">
                <span>Last {inr(sym.price)}</span>
                <span className={sym.changePct >= 0 ? "text-positive" : "text-negative"}>{sym.changePct >= 0 ? "+" : ""}{sym.changePct.toFixed(2)}%</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="t-label text-muted-foreground">Order type</span>
              <Segmented id="order-type" value={type} onChange={setType} options={[{ value: "MARKET", label: "Market" }, { value: "LIMIT", label: "Limit" }] as const} />
            </div>

            {type === "LIMIT" && (
              <label className="block space-y-1.5">
                <span className="t-label text-muted-foreground">Limit price</span>
                <Input value={limit} onChange={(e) => setLimit(e.target.value)} inputMode="decimal" placeholder={sym.price.toFixed(2)} />
              </label>
            )}

            <div className="space-y-2">
              <span className="t-label text-muted-foreground">Quantity</span>
              <div className="flex items-center gap-2">
                <button type="button" onClick={() => setQty((q) => Math.max(0, q - 1))} className="grid size-9 shrink-0 place-items-center rounded-xl border border-border text-muted-foreground hover:text-foreground" aria-label="Decrease quantity">
                  <Minus className="size-3.5" />
                </button>
                <Input value={String(qty)} onChange={(e) => setQty(Math.max(0, Number(e.target.value.replace(/\D/g, "")) || 0))} inputMode="numeric" className="text-center tabular" />
                <button type="button" onClick={() => setQty((q) => q + 1)} className="grid size-9 shrink-0 place-items-center rounded-xl border border-border text-muted-foreground hover:text-foreground" aria-label="Increase quantity">
                  <Plus className="size-3.5" />
                </button>
              </div>
              <div className="flex gap-1.5">
                {[25, 50, 75, 100].map((p) => (
                  <button key={p} type="button" onClick={() => setQty(Math.max(0, Math.floor((maxQty * p) / 100)))} className="flex-1 rounded-lg border border-border py-1 text-[11px] text-muted-foreground transition-colors hover:border-mint/40 hover:text-mint">
                    {p}%
                  </button>
                ))}
              </div>
              <div className="text-[11px] text-muted-foreground">
                {side === "BUY" ? `Max ${maxQty} at ${inr(price)}` : `Holding ${held} ${symbol}`}
              </div>
            </div>

            <div className="space-y-1.5 rounded-xl border border-border bg-raised/40 p-3 text-xs">
              <Row k="Order value" v={inr(value)} />
              <Row k="Cash after fill" v={inr(Math.max(0, cashAfter))} tone={cashAfter < 0 ? "negative" : undefined} />
              <Row k="Position after fill" v={`${side === "BUY" ? held + qty : Math.max(0, held - qty)} qty`} />
            </div>

            <AnimatePresence mode="wait">
              {confirming ? (
                <motion.div key="confirm" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    Confirm virtual {side.toLowerCase()} of <span className="text-foreground tabular">{qty}</span> {symbol} at {inr(price)}.
                  </p>
                  <div className="flex gap-2">
                    <button type="button" onClick={commit} className="btn-primary flex-1 py-2.5 text-sm">Confirm</button>
                    <button type="button" onClick={() => setConfirming(false)} className="rounded-xl border border-border px-4 text-sm text-muted-foreground hover:text-foreground">Cancel</button>
                  </div>
                </motion.div>
              ) : (
                <motion.button key="submit" type="submit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="btn-primary relative w-full overflow-hidden py-2.5 text-sm">
                  {filled ? <span className="flex items-center justify-center gap-1.5"><Check className="size-4" /> Filled</span> : `Review ${side === "BUY" ? "buy" : "sell"} order`}
                </motion.button>
              )}
            </AnimatePresence>
          </form>

          <div className="min-w-0 space-y-3">
            <Panel title={`${sym.symbol} · ${sym.name}`} eyebrow="Reference chart" flush>
              <div className="px-3 pb-3">
                <PriceChart data={series(sym.symbol, 70)} positive={sym.changePct >= 0} chartKey={sym.symbol} height={230} />
              </div>
            </Panel>

            <Panel title="Open positions" flush>
              {positions.length ? (
                <div className="divide-y divide-border">
                  {positions.map((p) => {
                    const s = getSymbol(p.symbol);
                    const gain = (s.price - p.avg) * p.qty;
                    return (
                      <div key={p.symbol} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 text-sm">
                        <Link to="/app/analyze/$symbol" params={{ symbol: p.symbol }} className="min-w-0">
                          <div className="truncate font-medium">{p.symbol}</div>
                          <div className="text-xs text-muted-foreground tabular">{p.qty} @ {inr(p.avg)}</div>
                        </Link>
                        <div className="flex shrink-0 items-center gap-4">
                          <div className="text-right">
                            <div className="tabular">{inr(s.price)}</div>
                            <div className="text-xs"><Money value={gain} tone /></div>
                          </div>
                          <button
                            onClick={() => { const r = placeOrder({ symbol: p.symbol, side: "SELL", qty: p.qty, price: s.price }); r.ok ? toast.success(`Squared off ${p.symbol}.`) : toast.error(r.message); }}
                            className="rounded-lg border border-border px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:border-negative/40 hover:text-negative"
                          >
                            Square off
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <EmptyState title="No open positions" body="Place a virtual order from the ticket to build a position." />
              )}
            </Panel>

            <Panel
              title="Order blotter"
              flush
              action={<Segmented id="blotter" size="xs" value={tab} onChange={setTab} options={[{ value: "all", label: "All" }, { value: "buy", label: "Buys" }, { value: "sell", label: "Sells" }] as const} />}
            >
              {blotter.length ? (
                <div className="divide-y divide-border">
                  {blotter.slice(0, 25).map((o) => (
                    <motion.div key={o.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-3 text-sm">
                      <span className={`rounded-md border px-2 py-0.5 text-[11px] ${o.side === "BUY" ? "border-positive/30 bg-positive/10 text-positive" : "border-negative/30 bg-negative/10 text-negative"}`}>{o.side}</span>
                      <div className="min-w-0">
                        <div className="truncate">{o.symbol} <span className="text-muted-foreground tabular">×{o.qty}</span></div>
                        <div className="text-xs text-muted-foreground tabular">{new Date(o.at).toLocaleTimeString("en-IN")}</div>
                      </div>
                      <div className="text-right">
                        <div className="tabular">{inr(o.price)}</div>
                        <div className="text-[11px] text-positive">Filled</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <EmptyState title="Blotter is empty" body="Every virtual fill is logged here with time, price and quantity." />
              )}
            </Panel>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Row({ k, v, tone }: { k: string; v: string; tone?: "negative" | undefined }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{k}</span>
      <span className={`tabular ${tone === "negative" ? "text-negative" : ""}`}>{v}</span>
    </div>
  );
}
