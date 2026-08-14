import { createFileRoute, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { AppShell } from "@/components/app/AppShell";
import { StatCard } from "@/components/app/bits";
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
      { name: "description", content: "Place native virtual market orders with virtual cash, then watch positions and P&L update in place." },
      { property: "og:title", content: "Trade desk — Quant Plus virtual orders" },
      { property: "og:description", content: "Virtual buy and sell orders, positions and full order history inside Quant Plus." },
    ],
  }),
  component: Trade,
});

function Trade() {
  const search = useSearch({ from: "/app/trade" });
  const { cash, positions, orders, placeOrder, holdingsValue } = useStore();
  const [symbol, setSymbol] = useState(search.symbol ?? "RELIANCE");
  const [side, setSide] = useState<"BUY" | "SELL">("BUY");
  const [qty, setQty] = useState("10");
  const [filled, setFilled] = useState(false);

  useEffect(() => { if (search.symbol) setSymbol(search.symbol); }, [search.symbol]);

  const sym = getSymbol(symbol) ?? SYMBOLS[0];
  const quantity = Number(qty) || 0;
  const value = quantity * sym.price;
  const held = positions.find((p) => p.symbol === symbol)?.qty ?? 0;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = placeOrder({ symbol, side, qty: quantity, price: sym.price });
    if (!res.ok) return toast.error(res.message);
    toast.success(res.message);
    setFilled(true);
    setTimeout(() => setFilled(false), 1800);
  };

  return (
    <AppShell title="Trade desk" subtitle="All orders are virtual and settle instantly inside Quant Plus.">
      <div className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-3">
          <StatCard label="Virtual cash" value={cash} />
          <StatCard label="Holdings value" value={holdingsValue} delay={0.06} />
          <StatCard label="Orders placed" value={orders.length} prefix="" decimals={0} delay={0.12} />
        </div>

        <div className="grid gap-3 lg:grid-cols-[360px_1fr]">
          <form onSubmit={submit} className="panel h-fit space-y-4 p-5">
            <div className="grid grid-cols-2 gap-2 rounded-xl border border-border p-1">
              {(["BUY", "SELL"] as const).map((s) => (
                <button key={s} type="button" onClick={() => setSide(s)} className={`relative rounded-lg py-2 text-sm font-medium ${side === s ? "text-foreground" : "text-muted-foreground"}`}>
                  {side === s && <motion.span layoutId="side-pill" className={`absolute inset-0 rounded-lg ${s === "BUY" ? "bg-positive/15 border border-positive/30" : "bg-negative/15 border border-negative/30"}`} transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                  <span className="relative">{s === "BUY" ? "Buy" : "Sell"}</span>
                </button>
              ))}
            </div>
            <div className="space-y-1.5">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">Symbol</span>
              <Select value={symbol} onValueChange={setSymbol}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{SYMBOLS.map((s) => <SelectItem key={s.symbol} value={s.symbol}>{s.symbol} · {s.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">Quantity</span>
              <Input value={qty} onChange={(e) => setQty(e.target.value.replace(/\D/g, ""))} inputMode="numeric" />
            </div>
            <div className="space-y-2 rounded-xl border border-border bg-raised/60 p-4 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Market price</span><span className="tabular">{inr(sym.price)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Order value</span><span className="tabular">{inr(value)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">You hold</span><span className="tabular">{held}</span></div>
            </div>
            <button className="relative w-full overflow-hidden rounded-xl bg-primary py-3 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.01]">
              <AnimatePresence mode="wait">
                {filled ? (
                  <motion.span key="ok" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center justify-center gap-2">
                    <Check className="size-4" /> Order filled
                  </motion.span>
                ) : (
                  <motion.span key="idle" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="block">
                    {side === "BUY" ? "Place virtual buy" : "Place virtual sell"}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            <p className="text-center text-xs text-muted-foreground">Virtual execution only. No real money or broker is involved.</p>
          </form>

          <div className="space-y-3">
            <div className="panel p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-display text-lg">{sym.symbol}</div>
                  <div className="text-xs text-muted-foreground">{sym.name}</div>
                </div>
                <div className={`text-sm tabular ${sym.changePct >= 0 ? "text-positive" : "text-negative"}`}>
                  {sym.changePct >= 0 ? "+" : ""}{sym.changePct.toFixed(2)}%
                </div>
              </div>
              <PriceChart data={series(sym.symbol, 60)} positive={sym.changePct >= 0} chartKey={sym.symbol} height={220} />
            </div>

            <div className="panel overflow-hidden">
              <div className="border-b border-border px-4 py-3 text-sm font-medium">Order history</div>
              <AnimatePresence initial={false}>
                {orders.length === 0 ? (
                  <p className="p-10 text-center text-sm text-muted-foreground">No virtual orders yet.</p>
                ) : (
                  orders.slice(0, 10).map((o) => (
                    <motion.div key={o.id} layout initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 border-b border-border px-4 py-3 text-sm last:border-0">
                      <span className={`rounded-full border px-2 py-0.5 text-[11px] ${o.side === "BUY" ? "border-positive/30 bg-positive/10 text-positive" : "border-negative/30 bg-negative/10 text-negative"}`}>{o.side}</span>
                      <span className="font-medium">{o.symbol}</span>
                      <span className="text-muted-foreground tabular">{o.qty} @ {inr(o.price)}</span>
                      <span className="ml-auto text-xs text-muted-foreground">{new Date(o.at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
