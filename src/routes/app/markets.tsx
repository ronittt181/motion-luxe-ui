import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/app/AppShell";
import { SymbolRow } from "@/components/app/bits";
import { MarketStrip } from "@/components/marketing/MarketStrip";
import { SYMBOLS } from "@/lib/market-data";
import { motion } from "motion/react";

export const Route = createFileRoute("/app/markets")({
  head: () => ({
    meta: [
      { title: "Markets — Quant Plus" },
      { name: "description", content: "Indian index snapshot and tracked equities with Quant Scores, volume and price change." },
      { property: "og:title", content: "Markets — Quant Plus" },
      { property: "og:description", content: "Index snapshot and tracked equities with live-style Quant Scores." },
    ],
  }),
  component: Markets,
});

const sectors = ["All", ...Array.from(new Set(SYMBOLS.map((s) => s.sector)))];
const sorts = { score: "Quant Score", change: "Change %", volume: "Volume", price: "Price" } as const;

function Markets() {
  const [sector, setSector] = useState("All");
  const [sort, setSort] = useState<keyof typeof sorts>("score");

  const rows = SYMBOLS.filter((s) => sector === "All" || s.sector === sector).sort((a, b) =>
    sort === "score" ? b.quantScore - a.quantScore : sort === "change" ? b.changePct - a.changePct : sort === "volume" ? b.volume - a.volume : b.price - a.price,
  );

  return (
    <AppShell title="Markets" subtitle="Index snapshot and tracked equities. Figures are demo data.">
      <div className="space-y-3">
        <MarketStrip />
        <div className="flex flex-wrap items-center gap-2">
          {sectors.map((s) => (
            <button
              key={s}
              onClick={() => setSector(s)}
              className={`relative rounded-full border px-3.5 py-1.5 text-xs transition-colors ${
                sector === s ? "border-mint/30 text-foreground" : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {sector === s && <motion.span layoutId="sector-pill" className="absolute inset-0 rounded-full bg-mint/12" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
              <span className="relative">{s}</span>
            </button>
          ))}
          <div className="ml-auto flex items-center gap-1 rounded-full border border-border p-1">
            {(Object.keys(sorts) as Array<keyof typeof sorts>).map((k) => (
              <button
                key={k}
                onClick={() => setSort(k)}
                className={`relative rounded-full px-3 py-1 text-xs transition-colors ${sort === k ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
              >
                {sort === k && <motion.span layoutId="sort-pill" className="absolute inset-0 rounded-full bg-accent" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
                <span className="relative">{sorts[k]}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="panel overflow-hidden">
          <div className="flex items-center gap-4 border-b border-border px-4 py-2.5 text-[11px] uppercase tracking-widest text-muted-foreground">
            <span className="w-4" />
            <span className="flex-1">Symbol</span>
            <span className="hidden w-24 md:block">Trend</span>
            <span className="hidden w-24 text-right lg:block">Volume</span>
            <span className="w-12 text-right">Score</span>
            <span className="w-28 text-right">Price</span>
          </div>
          {rows.map((s, i) => <SymbolRow key={s.symbol} s={s} index={i} />)}
        </div>
      </div>
    </AppShell>
  );
}
