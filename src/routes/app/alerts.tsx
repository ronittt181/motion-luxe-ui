import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BellRing, Check, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app/AppShell";
import { Bar, EmptyState, KpiTile, Panel, Segmented } from "@/components/app/kit";
import { SYMBOLS, getSymbol, inr } from "@/lib/market-data";
import { useStore, type Alert } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/app/alerts")({
  head: () => ({
    meta: [
      { title: "Alerts — Quant Plus" },
      { name: "description", content: "Create price, indicator, score, sentiment and unusual-volume alerts and track distance to trigger." },
      { property: "og:title", content: "Alerts — Quant Plus" },
      { property: "og:description", content: "Native alerts with live distance-to-trigger tracking." },
    ],
  }),
  component: Alerts,
});

const types: Alert["type"][] = ["Price", "Quant Score", "RSI", "Sentiment", "Unusual volume"];
const TABS = [{ value: "active", label: "Active" }, { value: "triggered", label: "Triggered" }, { value: "paused", label: "Paused" }] as const;

function currentValue(a: Alert) {
  const s = getSymbol(a.symbol);
  if (a.type === "Price") return s.price;
  if (a.type === "Quant Score") return s.quantScore;
  if (a.type === "RSI") return s.rsi;
  if (a.type === "Sentiment") return s.sentiment.positive;
  return Math.round(s.volume / 100000);
}

function isTriggered(a: Alert) {
  const v = currentValue(a);
  return a.condition === "above" ? v >= a.value : v <= a.value;
}

function Alerts() {
  const { alerts, addAlert, removeAlert, toggleAlert } = useStore();
  const [symbol, setSymbol] = useState("RELIANCE");
  const [type, setType] = useState<Alert["type"]>("Price");
  const [condition, setCondition] = useState<"above" | "below">("above");
  const [value, setValue] = useState("3000");
  const [tab, setTab] = useState<(typeof TABS)[number]["value"]>("active");

  const enriched = useMemo(
    () => alerts.map((a) => ({ a, current: currentValue(a), triggered: isTriggered(a) })),
    [alerts],
  );

  const shown = enriched.filter(({ a, triggered }) =>
    tab === "paused" ? !a.active : tab === "triggered" ? a.active && triggered : a.active && !triggered,
  );

  const create = (e: React.FormEvent) => {
    e.preventDefault();
    const n = Number(value);
    if (!n || n <= 0) { toast.error("Enter a threshold greater than zero."); return; }
    addAlert({ symbol, type, condition, value: n });
    toast.success(`Alert armed: ${symbol} ${type.toLowerCase()} ${condition} ${n}.`);
  };

  const activeCount = enriched.filter((e) => e.a.active && !e.triggered).length;
  const triggeredCount = enriched.filter((e) => e.a.active && e.triggered).length;

  return (
    <AppShell title="Alerts" subtitle="Native alerts across price, score, indicators, sentiment and volume.">
      <div className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-3">
          <KpiTile label="Armed" value={activeCount} />
          <KpiTile label="Triggered" value={triggeredCount} tone={triggeredCount ? "positive" : undefined} delay={0.04} />
          <KpiTile label="Paused" value={enriched.filter((e) => !e.a.active).length} delay={0.08} />
        </div>

        <div className="grid min-w-0 gap-3 lg:grid-cols-[360px_minmax(0,1fr)]">
          <form onSubmit={create} className="panel h-fit space-y-4 p-5">
            <div className="font-display text-base">New alert</div>
            <div className="space-y-1.5">
              <span className="t-label text-muted-foreground">Symbol</span>
              <Select value={symbol} onValueChange={setSymbol}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{SYMBOLS.map((s) => <SelectItem key={s.symbol} value={s.symbol}>{s.symbol}</SelectItem>)}</SelectContent>
              </Select>
              <p className="pt-1 text-[11px] text-muted-foreground tabular">Last {inr(getSymbol(symbol).price)} · Score {getSymbol(symbol).quantScore} · RSI {getSymbol(symbol).rsi}</p>
            </div>
            <div className="space-y-1.5">
              <span className="t-label text-muted-foreground">Trigger</span>
              <Select value={type} onValueChange={(v) => setType(v as Alert["type"])}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{types.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <span className="t-label text-muted-foreground">Condition</span>
                <Select value={condition} onValueChange={(v) => setCondition(v as "above" | "below")}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="above">Above</SelectItem><SelectItem value="below">Below</SelectItem></SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <span className="t-label text-muted-foreground">Threshold</span>
                <Input value={value} onChange={(e) => setValue(e.target.value)} inputMode="decimal" />
              </div>
            </div>
            <button className="btn-primary w-full py-2.5 text-sm">Arm alert</button>
            <p className="text-[11px] leading-relaxed text-muted-foreground">
              Alerts evaluate against demo market data in this build — nothing is sent externally.
            </p>
          </form>

          <Panel
            title="Your alerts"
            flush
            action={<Segmented id="alert-tabs" size="xs" value={tab} onChange={setTab} options={TABS} />}
          >
            <AnimatePresence mode="popLayout">
              {shown.length ? (
                <div className="divide-y divide-border">
                  {shown.map(({ a, current, triggered }) => {
                    const distance = a.value === 0 ? 0 : Math.min(100, (Math.min(current, a.value) / Math.max(current, a.value)) * 100);
                    return (
                      <motion.div key={a.id} layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -8 }} className="px-4 py-4">
                        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{a.symbol}</span>
                              {triggered && a.active && (
                                <span className="flex items-center gap-1 rounded-full border border-positive/30 bg-positive/10 px-2 py-0.5 text-[11px] text-positive">
                                  <Check className="size-3" /> Triggered
                                </span>
                              )}
                            </div>
                            <div className="mt-0.5 text-xs text-muted-foreground">
                              {a.type} {a.condition} <span className="tabular text-foreground">{a.value}</span> · now <span className="tabular">{typeof current === "number" ? current.toFixed(2) : current}</span>
                            </div>
                          </div>
                          <div className="flex shrink-0 items-center gap-2">
                            <Switch checked={a.active} onCheckedChange={() => toggleAlert(a.id)} aria-label="Toggle alert" />
                            <button onClick={() => { removeAlert(a.id); toast("Alert removed."); }} className="rounded-lg border border-border p-1.5 text-muted-foreground transition-colors hover:border-negative/40 hover:text-negative" aria-label="Delete alert">
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </div>
                        <div className="mt-3">
                          <div className="mb-1 flex justify-between text-[11px] text-muted-foreground">
                            <span>Distance to trigger</span>
                            <span className="tabular">{Math.round(100 - distance)}%</span>
                          </div>
                          <Bar value={distance} tone={triggered ? "positive" : "signal"} />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <EmptyState key="empty" icon={<BellRing className="size-6" />} title={`No ${tab} alerts`} body="Arm an alert from the form to watch a level, score or indicator." />
              )}
            </AnimatePresence>
          </Panel>
        </div>
      </div>
    </AppShell>
  );
}
