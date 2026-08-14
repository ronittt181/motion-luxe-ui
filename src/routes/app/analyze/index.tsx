import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { SymbolRow } from "@/components/app/bits";
import { SYMBOLS } from "@/lib/market-data";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/app/analyze/")({
  head: () => ({
    meta: [
      { title: "Analyze — pick a symbol | Quant Plus" },
      { name: "description", content: "Search tracked Indian equities and open a full technical, model and sentiment breakdown." },
      { property: "og:title", content: "Analyze — pick a symbol | Quant Plus" },
      { property: "og:description", content: "Search a symbol and open the full Quant Plus analysis." },
    ],
  }),
  component: AnalyzeIndex,
});

function AnalyzeIndex() {
  const [q, setQ] = useState("");
  const rows = SYMBOLS.filter((s) => `${s.symbol} ${s.name}`.toLowerCase().includes(q.toLowerCase()));
  return (
    <AppShell title="Analyze" subtitle="Choose a symbol to open charts, indicators, prediction and sentiment.">
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search symbol or company…" className="h-12 pl-10" />
        </div>
        <div className="panel overflow-hidden">
          {rows.length ? rows.map((s, i) => <SymbolRow key={s.symbol} s={s} index={i} />) : (
            <p className="p-12 text-center text-sm text-muted-foreground">No symbol matches “{q}”.</p>
          )}
        </div>
      </div>
    </AppShell>
  );
}
