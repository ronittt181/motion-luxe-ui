import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { RotateCcw } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { SymbolRow } from "@/components/app/bits";
import { SYMBOLS } from "@/lib/market-data";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/app/screener")({
  head: () => ({
    meta: [
      { title: "Screener — Quant Plus" },
      { name: "description", content: "Combine Quant Score, RSI, P/E and sector filters to shortlist Indian equities worth deeper analysis." },
      { property: "og:title", content: "Screener — Quant Plus" },
      { property: "og:description", content: "Technical and fundamental filters to shortlist names fast." },
    ],
  }),
  component: Screener,
});

const sectors = ["All", ...Array.from(new Set(SYMBOLS.map((s) => s.sector)))];

function Screener() {
  const [score, setScore] = useState([40]);
  const [rsi, setRsi] = useState([0, 100]);
  const [pe, setPe] = useState([70]);
  const [sector, setSector] = useState("All");
  const [dir, setDir] = useState("Any");

  const rows = SYMBOLS.filter(
    (s) =>
      s.quantScore >= score[0] &&
      s.rsi >= rsi[0] && s.rsi <= rsi[1] &&
      s.pe <= pe[0] &&
      (sector === "All" || s.sector === sector) &&
      (dir === "Any" || (dir === "Up" ? s.direction === "up" : s.direction === "down")),
  ).sort((a, b) => b.quantScore - a.quantScore);

  const reset = () => { setScore([40]); setRsi([0, 100]); setPe([70]); setSector("All"); setDir("Any"); };

  return (
    <AppShell title="Screener" subtitle="Stack technical and fundamental filters to find candidates.">
      <div className="grid gap-3 lg:grid-cols-[300px_1fr]">
        <div className="panel h-fit space-y-6 p-5">
          <div className="flex items-center justify-between">
            <span className="font-display text-lg">Filters</span>
            <button onClick={reset} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
              <RotateCcw className="size-3.5" /> Reset
            </button>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-xs"><span className="uppercase tracking-widest text-muted-foreground">Min Quant Score</span><span className="tabular">{score[0]}</span></div>
            <Slider value={score} onValueChange={setScore} min={0} max={100} step={1} />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-xs"><span className="uppercase tracking-widest text-muted-foreground">RSI range</span><span className="tabular">{rsi[0]}–{rsi[1]}</span></div>
            <Slider value={rsi} onValueChange={setRsi} min={0} max={100} step={1} />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-xs"><span className="uppercase tracking-widest text-muted-foreground">Max P/E</span><span className="tabular">{pe[0]}</span></div>
            <Slider value={pe} onValueChange={setPe} min={5} max={70} step={1} />
          </div>
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Sector</span>
            <Select value={sector} onValueChange={setSector}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{sectors.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Model direction</span>
            <Select value={dir} onValueChange={setDir}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="Any">Any</SelectItem><SelectItem value="Up">Upward</SelectItem><SelectItem value="Down">Downward</SelectItem></SelectContent>
            </Select>
          </div>
        </div>

        <div className="panel overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-4 py-3 text-sm">
            <span className="font-medium">Results</span>
            <motion.span key={rows.length} initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-muted-foreground tabular">
              {rows.length} match{rows.length === 1 ? "" : "es"}
            </motion.span>
          </div>
          <AnimatePresence mode="popLayout">
            {rows.length ? rows.map((s, i) => <SymbolRow key={s.symbol} s={s} index={i} />) : (
              <motion.p key="none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-14 text-center text-sm text-muted-foreground">
                No symbols pass these filters. Loosen a constraint to widen the net.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </AppShell>
  );
}
