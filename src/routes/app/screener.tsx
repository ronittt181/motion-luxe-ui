import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { RotateCcw, Star, X } from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app/AppShell";
import { SymbolRow } from "@/components/app/bits";
import { Chip, EmptyState, Panel } from "@/components/app/kit";
import { SYMBOLS } from "@/lib/market-data";
import { useStore } from "@/lib/store";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/app/screener")({
  head: () => ({
    meta: [
      { title: "Screener — Quant Plus" },
      { name: "description", content: "Combine Quant Score, RSI, P/E, change and sector filters to shortlist Indian equities worth deeper analysis." },
      { property: "og:title", content: "Screener — Quant Plus" },
      { property: "og:description", content: "Technical and fundamental filters to shortlist names fast." },
    ],
  }),
  component: Screener,
});

const sectors = ["All", ...Array.from(new Set(SYMBOLS.map((s) => s.sector)))];

type Filters = { score: number; rsi: [number, number]; pe: number; change: number; sector: string; dir: string };
const DEFAULTS: Filters = { score: 40, rsi: [0, 100], pe: 70, change: -10, sector: "All", dir: "Any" };

const PRESETS: Array<{ name: string; f: Partial<Filters> }> = [
  { name: "High conviction", f: { score: 70, dir: "Up" } },
  { name: "Oversold value", f: { rsi: [0, 40], pe: 30 } },
  { name: "Momentum leaders", f: { change: 1, score: 55 } },
  { name: "Quality large caps", f: { pe: 35, score: 60 } },
];

function Screener() {
  const [f, setF] = useState<Filters>(DEFAULTS);
  const { watchlist, toggleWatch } = useStore();

  const set = <K extends keyof Filters>(k: K, v: Filters[K]) => setF((p) => ({ ...p, [k]: v }));

  const rows = useMemo(
    () =>
      SYMBOLS.filter(
        (s) =>
          s.quantScore >= f.score &&
          s.rsi >= f.rsi[0] && s.rsi <= f.rsi[1] &&
          s.pe <= f.pe &&
          s.changePct >= f.change &&
          (f.sector === "All" || s.sector === f.sector) &&
          (f.dir === "Any" || (f.dir === "Up" ? s.direction === "up" : s.direction === "down")),
      ).sort((a, b) => b.quantScore - a.quantScore),
    [f],
  );

  const active: Array<{ label: string; clear: () => void }> = [];
  if (f.score !== DEFAULTS.score) active.push({ label: `Score ≥ ${f.score}`, clear: () => set("score", DEFAULTS.score) });
  if (f.rsi[0] !== 0 || f.rsi[1] !== 100) active.push({ label: `RSI ${f.rsi[0]}–${f.rsi[1]}`, clear: () => set("rsi", DEFAULTS.rsi) });
  if (f.pe !== DEFAULTS.pe) active.push({ label: `P/E ≤ ${f.pe}`, clear: () => set("pe", DEFAULTS.pe) });
  if (f.change !== DEFAULTS.change) active.push({ label: `Change ≥ ${f.change}%`, clear: () => set("change", DEFAULTS.change) });
  if (f.sector !== "All") active.push({ label: f.sector, clear: () => set("sector", "All") });
  if (f.dir !== "Any") active.push({ label: `Model ${f.dir}`, clear: () => set("dir", "Any") });

  const addAll = () => {
    const missing = rows.filter((r) => !watchlist.includes(r.symbol));
    missing.forEach((r) => toggleWatch(r.symbol));
    toast.success(missing.length ? `Added ${missing.length} symbol${missing.length === 1 ? "" : "s"} to your watchlist.` : "All results are already on your watchlist.");
  };

  return (
    <AppShell title="Screener" subtitle="Stack technical and fundamental filters to find candidates.">
      <div className="grid min-w-0 gap-3 lg:grid-cols-[300px_minmax(0,1fr)]">
        <div className="space-y-3">
          <Panel
            title="Filters"
            action={
              <button onClick={() => setF(DEFAULTS)} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
                <RotateCcw className="size-3.5" /> Reset
              </button>
            }
          >
            <div className="space-y-6">
              <Range label="Min Quant Score" display={String(f.score)} value={[f.score]} onChange={(v) => set("score", v[0]!)} min={0} max={100} />
              <Range label="RSI range" display={`${f.rsi[0]}–${f.rsi[1]}`} value={f.rsi} onChange={(v) => set("rsi", [v[0]!, v[1]!])} min={0} max={100} />
              <Range label="Max P/E" display={String(f.pe)} value={[f.pe]} onChange={(v) => set("pe", v[0]!)} min={5} max={70} />
              <Range label="Min change %" display={`${f.change}%`} value={[f.change]} onChange={(v) => set("change", v[0]!)} min={-10} max={5} />
              <div className="space-y-2">
                <span className="t-label text-muted-foreground">Sector</span>
                <Select value={f.sector} onValueChange={(v) => set("sector", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{sectors.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <span className="t-label text-muted-foreground">Model direction</span>
                <Select value={f.dir} onValueChange={(v) => set("dir", v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="Any">Any</SelectItem><SelectItem value="Up">Upward</SelectItem><SelectItem value="Down">Downward</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
          </Panel>

          <Panel title="Presets" eyebrow="One-click screens">
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <Chip key={p.name} onClick={() => setF({ ...DEFAULTS, ...p.f })}>{p.name}</Chip>
              ))}
            </div>
          </Panel>
        </div>

        <div className="min-w-0 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <AnimatePresence initial={false}>
              {active.map((a) => (
                <motion.button
                  key={a.label}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  onClick={a.clear}
                  className="flex items-center gap-1.5 rounded-full border border-mint/25 bg-mint/10 px-3 py-1 text-xs"
                >
                  {a.label} <X className="size-3" />
                </motion.button>
              ))}
            </AnimatePresence>
            {active.length > 0 && (
              <button onClick={() => setF(DEFAULTS)} className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
                Clear all
              </button>
            )}
            <div className="ml-auto flex items-center gap-2">
              <motion.span key={rows.length} initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-muted-foreground tabular">
                {rows.length} match{rows.length === 1 ? "" : "es"}
              </motion.span>
              <button
                onClick={addAll}
                disabled={!rows.length}
                className="flex items-center gap-1.5 rounded-xl border border-border bg-surface/60 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-mint/40 hover:text-mint disabled:opacity-40"
              >
                <Star className="size-3.5" /> Add all to watchlist
              </button>
            </div>
          </div>

          <div className="panel overflow-hidden">
            <div className="flex items-center gap-4 border-b border-border px-4 py-2.5 t-label text-muted-foreground">
              <span className="w-4" /><span className="flex-1">Symbol</span>
              <span className="hidden w-24 md:block">Trend</span>
              <span className="hidden w-24 text-right lg:block">Volume</span>
              <span className="w-12 text-right">Score</span>
              <span className="w-28 text-right">Price</span>
            </div>
            <AnimatePresence mode="popLayout">
              {rows.length ? rows.map((s, i) => <SymbolRow key={s.symbol} s={s} index={i} />) : (
                <EmptyState key="none" title="No symbols pass these filters" body="Loosen a constraint or start from a preset to widen the net." action={<button onClick={() => setF(DEFAULTS)} className="mt-1 rounded-xl border border-border px-3 py-1.5 text-xs hover:border-border-active">Reset filters</button>} />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Range({ label, display, value, onChange, min, max }: { label: string; display: string; value: number[]; onChange: (v: number[]) => void; min: number; max: number }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between text-xs">
        <span className="t-label text-muted-foreground">{label}</span>
        <span className="tabular">{display}</span>
      </div>
      <Slider value={value} onValueChange={onChange} min={min} max={max} step={1} />
    </div>
  );
}
