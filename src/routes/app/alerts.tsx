import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { BellRing, Check, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app/AppShell";
import { SYMBOLS } from "@/lib/market-data";
import { useStore, type Alert } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/app/alerts")({
  head: () => ({
    meta: [
      { title: "Alerts — Quant Plus" },
      { name: "description", content: "Create native price, indicator, score, sentiment and unusual-volume alerts inside Quant Plus." },
      { property: "og:title", content: "Alerts — Quant Plus" },
      { property: "og:description", content: "Native alerts for price, score, indicators, sentiment and volume." },
    ],
  }),
  component: Alerts,
});

const types: Alert["type"][] = ["Price", "Quant Score", "RSI", "Sentiment", "Unusual volume"];

function Alerts() {
  const { alerts, addAlert, removeAlert, toggleAlert } = useStore();
  const [symbol, setSymbol] = useState("RELIANCE");
  const [type, setType] = useState<Alert["type"]>("Price");
  const [condition, setCondition] = useState<"above" | "below">("above");
  const [value, setValue] = useState("3000");
  const [justAdded, setJustAdded] = useState(false);

  const create = (e: React.FormEvent) => {
    e.preventDefault();
    const n = Number(value);
    if (!n || n <= 0) return toast.error("Enter a threshold greater than zero.");
    addAlert({ symbol, type, condition, value: n });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1600);
    toast.success(`Alert armed: ${symbol} ${type.toLowerCase()} ${condition} ${n}.`);
  };

  return (
    <AppShell title="Alerts" subtitle="Native alerts across price, score, indicators, sentiment and volume.">
      <div className="grid gap-3 lg:grid-cols-[380px_1fr]">
        <form onSubmit={create} className="panel h-fit space-y-4 p-5">
          <div className="font-display text-lg">New alert</div>
          <div className="space-y-1.5">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Symbol</span>
            <Select value={symbol} onValueChange={setSymbol}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{SYMBOLS.map((s) => <SelectItem key={s.symbol} value={s.symbol}>{s.symbol}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Trigger</span>
            <Select value={type} onValueChange={(v) => setType(v as Alert["type"])}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{types.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">Condition</span>
              <Select value={condition} onValueChange={(v) => setCondition(v as "above" | "below")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="above">Above</SelectItem><SelectItem value="below">Below</SelectItem></SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">Threshold</span>
              <Input value={value} onChange={(e) => setValue(e.target.value)} inputMode="decimal" />
            </div>
          </div>
          <button className="relative w-full overflow-hidden rounded-xl bg-primary py-3 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.01]">
            <AnimatePresence mode="wait">
              {justAdded ? (
                <motion.span key="ok" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="flex items-center justify-center gap-2">
                  <Check className="size-4" /> Alert armed
                </motion.span>
              ) : (
                <motion.span key="idle" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="block">
                  Create alert
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </form>

        <div className="panel overflow-hidden">
          <div className="border-b border-border px-4 py-3 text-sm font-medium">Active alerts</div>
          <AnimatePresence initial={false}>
            {alerts.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid place-items-center gap-2 p-14 text-center">
                <BellRing className="size-6 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">No alerts yet. Arm one on the left.</p>
              </motion.div>
            )}
            {alerts.map((a) => (
              <motion.div
                key={a.id}
                layout
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 12, height: 0 }}
                className="flex items-center gap-4 border-b border-border px-4 py-3.5 last:border-0"
              >
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium">{a.symbol}</div>
                  <div className="text-xs text-muted-foreground">
                    {a.type} {a.condition} <span className="tabular">{a.value}</span>
                  </div>
                </div>
                <span className={`rounded-full border px-2.5 py-0.5 text-[11px] ${a.active ? "border-mint/30 bg-mint/10 text-mint" : "border-border text-muted-foreground"}`}>
                  {a.active ? "Armed" : "Paused"}
                </span>
                <Switch checked={a.active} onCheckedChange={() => toggleAlert(a.id)} />
                <button onClick={() => { removeAlert(a.id); toast("Alert removed."); }} className="text-muted-foreground hover:text-negative" aria-label="Delete alert">
                  <Trash2 className="size-4" />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </AppShell>
  );
}
