import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Search } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { SymbolRow } from "@/components/app/bits";
import { Chip, KpiTile, Panel, Segmented, SortHeader } from "@/components/app/kit";
import { Sparkline } from "@/components/viz/Sparkline";
import { Input } from "@/components/ui/input";
import { INDICES, SYMBOLS, compact, series } from "@/lib/market-data";

export const Route = createFileRoute("/app/markets")({
  head: () => ({
    meta: [
      { title: "Markets — Quant Plus" },
      { name: "description", content: "Indian index snapshot, sector heatmap, breadth and tracked equities with Quant Scores." },
      { property: "og:title", content: "Markets — Quant Plus" },
      { property: "og:description", content: "Index snapshot, sector heatmap and breadth for Indian equities." },
    ],
  }),
  component: Markets,
});

const sectors = ["All", ...Array.from(new Set(SYMBOLS.map((s) => s.sector)))];
type SortKey = "quantScore" | "changePct" | "volume" | "price";

function Markets() {
  const [sector, setSector] = useState("All");
  const [sort, setSort] = useState<SortKey>("quantScore");
  const [dir, setDir] = useState<"asc" | "desc">("desc");
  const [q, setQ] = useState("");
  const [view, setView] = useState<"table" | "heatmap">("table");

  const rows = useMemo(() => {
    const filtered = SYMBOLS.filter(
      (s) =>
        (sector === "All" || s.sector === sector) &&
        `${s.symbol} ${s.name}`.toLowerCase().includes(q.trim().toLowerCase()),
    );
    return filtered.sort((a, b) => (dir === "desc" ? b[sort] - a[sort] : a[sort] - b[sort]));
  }, [sector, sort, dir, q]);

  const advancers = SYMBOLS.filter((s) => s.changePct > 0).length;
  const decliners = SYMBOLS.length - advancers;
  const advPct = Math.round((advancers / SYMBOLS.length) * 100);
  const avgScore = Math.round(SYMBOLS.reduce((a, s) => a + s.quantScore, 0) / SYMBOLS.length);

  const sectorAgg = useMemo(() => {
    const map = new Map<string, { sector: string; change: number; weight: number; count: number }>();
    for (const s of SYMBOLS) {
      const cur = map.get(s.sector) ?? { sector: s.sector, change: 0, weight: 0, count: 0 };
      cur.change += s.changePct;
      cur.weight += s.volume;
      cur.count += 1;
      map.set(s.sector, cur);
    }
    return [...map.values()]
      .map((x) => ({ ...x, change: x.change / x.count }))
      .sort((a, b) => b.weight - a.weight);
  }, []);
  const maxWeight = Math.max(...sectorAgg.map((s) => s.weight));

  const toggleSort = (k: SortKey) => {
    if (k === sort) setDir((d) => (d === "desc" ? "asc" : "desc"));
    else { setSort(k); setDir("desc"); }
  };

  return (
    <AppShell title="Markets" subtitle="Index snapshot, sector rotation and tracked equities. Figures are demo data.">
      <div className="space-y-3">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {INDICES.map((idx, i) => (
            <KpiTile
              key={idx.symbol}
              label={idx.symbol}
              value={idx.value.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              delta={idx.changePct}
              delay={i * 0.04}
              sub={<span className="inline-block h-4 w-16 align-middle"><Sparkline data={series(idx.symbol, 24).map((d) => d.close)} positive={idx.changePct >= 0} /></span>}
            />
          ))}
        </div>

        <div className="grid gap-3 lg:grid-cols-[1fr_1.4fr]">
          <Panel title="Breadth" eyebrow="Advance / decline">
            <div className="flex items-baseline justify-between text-sm">
              <span className="tabular text-positive">{advancers} advancing</span>
              <span className="tabular text-negative">{decliners} declining</span>
            </div>
            <div className="mt-2 flex h-2 overflow-hidden rounded-full bg-muted">
              <motion.span className="block h-full bg-positive" initial={{ width: 0 }} animate={{ width: `${advPct}%` }} transition={{ duration: 0.5 }} />
              <span className="block h-full flex-1 bg-negative/70" />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border border-border bg-raised/40 p-3">
                <div className="t-label text-muted-foreground">Avg Quant Score</div>
                <div className="mt-1 font-display text-lg tabular">{avgScore}</div>
              </div>
              <div className="rounded-xl border border-border bg-raised/40 p-3">
                <div className="t-label text-muted-foreground">Universe</div>
                <div className="mt-1 font-display text-lg tabular">{SYMBOLS.length}</div>
              </div>
            </div>
          </Panel>

          <Panel title="Sector heatmap" eyebrow="Tile size = traded volume">
            <div className="flex flex-wrap gap-2">
              {sectorAgg.map((s) => {
                const intensity = Math.min(1, Math.abs(s.change) / 2.2);
                const color = s.change >= 0 ? "var(--positive)" : "var(--negative)";
                return (
                  <button
                    key={s.sector}
                    onClick={() => setSector(s.sector)}
                    style={{
                      flexGrow: Math.max(1, Math.round((s.weight / maxWeight) * 6)),
                      background: `color-mix(in oklab, ${color} ${8 + intensity * 26}%, transparent)`,
                      borderColor: `color-mix(in oklab, ${color} ${20 + intensity * 40}%, transparent)`,
                    }}
                    className="min-w-[128px] rounded-xl border px-3 py-3 text-left transition-transform duration-300 hover:-translate-y-0.5"
                  >
                    <div className="truncate text-xs">{s.sector}</div>
                    <div className={`mt-1 font-display text-sm tabular ${s.change >= 0 ? "text-positive" : "text-negative"}`}>
                      {s.change >= 0 ? "+" : ""}{s.change.toFixed(2)}%
                    </div>
                    <div className="mt-0.5 text-[10px] text-muted-foreground tabular">{compact(s.weight)} vol</div>
                  </button>
                );
              })}
            </div>
          </Panel>
        </div>

        <div className="grid gap-2 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
          <div className="flex min-w-0 flex-wrap items-center gap-2">
            {sectors.map((s) => (
              <Chip key={s} active={sector === s} onClick={() => setSector(s)}>{s}</Chip>
            ))}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filter symbols" className="h-9 w-44 pl-8 text-xs" />
            </div>
            <Segmented
              id="markets-view"
              size="xs"
              value={view}
              onChange={setView}
              options={[{ value: "table", label: "Table" }, { value: "heatmap", label: "Grid" }] as const}
            />
          </div>
        </div>

        {view === "table" ? (
          <div className="panel overflow-hidden">
            <div className="flex items-center gap-4 border-b border-border px-4 py-2.5">
              <span className="w-4" />
              <span className="flex-1"><SortHeader label="Symbol" /></span>
              <span className="hidden w-24 md:block t-label text-muted-foreground">Trend</span>
              <span className="hidden w-24 justify-end lg:flex"><SortHeader label="Volume" active={sort === "volume"} dir={dir} onClick={() => toggleSort("volume")} /></span>
              <span className="flex w-12 justify-end"><SortHeader label="Score" active={sort === "quantScore"} dir={dir} onClick={() => toggleSort("quantScore")} /></span>
              <span className="flex w-28 justify-end"><SortHeader label="Price" active={sort === "price" || sort === "changePct"} dir={dir} onClick={() => toggleSort(sort === "price" ? "changePct" : "price")} /></span>
            </div>
            {rows.length ? rows.map((s, i) => <SymbolRow key={s.symbol} s={s} index={i} />) : (
              <p className="px-4 py-14 text-center text-sm text-muted-foreground">Nothing matched “{q}”.</p>
            )}
          </div>
        ) : (
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {rows.map((s) => {
              const up = s.changePct >= 0;
              const color = up ? "var(--positive)" : "var(--negative)";
              return (
                <motion.a
                  key={s.symbol}
                  href={`/app/analyze/${s.symbol}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.18 }}
                  style={{ background: `color-mix(in oklab, ${color} 8%, transparent)` }}
                  className="rounded-2xl border border-border p-4 transition-transform duration-300 hover:-translate-y-0.5"
                >
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm font-medium">{s.symbol}</span>
                    <span className={`text-xs tabular ${up ? "text-positive" : "text-negative"}`}>{up ? "+" : ""}{s.changePct.toFixed(2)}%</span>
                  </div>
                  <div className="truncate text-xs text-muted-foreground">{s.name}</div>
                  <div className="mt-3 h-8"><Sparkline data={series(s.symbol, 30).map((d) => d.close)} positive={up} /></div>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground tabular">
                    <span>Score {s.quantScore}</span>
                    <span>{compact(s.volume)}</span>
                  </div>
                </motion.a>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
