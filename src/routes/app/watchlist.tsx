import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Plus, Star } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { SymbolRow } from "@/components/app/bits";
import { Chip, EmptyState, KpiTile, Segmented } from "@/components/app/kit";
import { Input } from "@/components/ui/input";
import { SYMBOLS, getSymbol } from "@/lib/market-data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/app/watchlist")({
  head: () => ({
    meta: [
      { title: "Watchlist — Quant Plus" },
      { name: "description", content: "Your persistent Quant Plus watchlist with scores, price change, movers view and quick access to analysis." },
      { property: "og:title", content: "Watchlist — Quant Plus" },
      { property: "og:description", content: "Track the names that matter with score and sentiment at a glance." },
    ],
  }),
  component: Watchlist,
});

const VIEWS = [
  { value: "all", label: "All" },
  { value: "gainers", label: "Gainers" },
  { value: "losers", label: "Losers" },
  { value: "score", label: "Top score" },
] as const;

function Watchlist() {
  const { watchlist, toggleWatch } = useStore();
  const [view, setView] = useState<(typeof VIEWS)[number]["value"]>("all");
  const [q, setQ] = useState("");

  const tracked = useMemo(() => watchlist.map((w) => getSymbol(w)).filter(Boolean), [watchlist]);
  const rows = useMemo(() => {
    const base = [...tracked];
    if (view === "gainers") return base.filter((s) => s.changePct >= 0).sort((a, b) => b.changePct - a.changePct);
    if (view === "losers") return base.filter((s) => s.changePct < 0).sort((a, b) => a.changePct - b.changePct);
    if (view === "score") return base.sort((a, b) => b.quantScore - a.quantScore);
    return base;
  }, [tracked, view]);

  const suggestions = SYMBOLS.filter(
    (s) => !watchlist.includes(s.symbol) && `${s.symbol} ${s.name}`.toLowerCase().includes(q.trim().toLowerCase()),
  ).slice(0, 5);

  const up = tracked.filter((s) => s.changePct >= 0).length;
  const avgScore = tracked.length ? Math.round(tracked.reduce((a, s) => a + s.quantScore, 0) / tracked.length) : 0;
  const bestMover = [...tracked].sort((a, b) => Math.abs(b.changePct) - Math.abs(a.changePct))[0];

  return (
    <AppShell
      title="Watchlist"
      subtitle={`${tracked.length} symbol${tracked.length === 1 ? "" : "s"} tracked across sessions.`}
      action={
        <div className="relative">
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Add a symbol…" className="h-9 w-52 text-xs" />
          <AnimatePresence>
            {q && suggestions.length > 0 && (
              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute right-0 top-11 z-30 w-64 overflow-hidden rounded-xl border border-border bg-popover shadow-lift">
                {suggestions.map((s) => (
                  <button key={s.symbol} onClick={() => { toggleWatch(s.symbol); setQ(""); }} className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs hover:bg-accent/50">
                    <Plus className="size-3.5 text-mint" />
                    <span className="font-medium">{s.symbol}</span>
                    <span className="truncate text-muted-foreground">{s.name}</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      }
    >
      <div className="space-y-3">
        {tracked.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <KpiTile label="Tracked" value={tracked.length} />
            <KpiTile label="Advancing" value={`${up}/${tracked.length}`} delay={0.04} />
            <KpiTile label="Avg Quant Score" value={avgScore} delay={0.08} />
            <KpiTile label="Biggest move" value={bestMover?.symbol ?? "—"} delta={bestMover?.changePct} delay={0.12} />
          </div>
        )}

        {tracked.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <Segmented id="watch-view" value={view} onChange={setView} options={VIEWS} />
            <div className="ml-auto flex flex-wrap gap-1.5">
              {tracked.slice(0, 6).map((s) => (
                <Chip key={s.symbol} onClick={() => toggleWatch(s.symbol)}>{s.symbol} ×</Chip>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence mode="popLayout">
          {rows.length ? (
            <motion.div key={view} layout className="panel overflow-hidden">
              <div className="flex items-center gap-4 border-b border-border px-4 py-2.5 t-label text-muted-foreground">
                <span className="w-4" /><span className="flex-1">Symbol</span>
                <span className="hidden w-24 md:block">Trend</span>
                <span className="hidden w-24 text-right lg:block">Volume</span>
                <span className="w-12 text-right">Score</span>
                <span className="w-28 text-right">Price</span>
              </div>
              {rows.map((s, i) => <SymbolRow key={s.symbol} s={s} index={i} />)}
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{ opacity: 0, scale: 0.99 }} animate={{ opacity: 1, scale: 1 }} className="panel">
              <EmptyState
                icon={<Star className="size-7" />}
                title={tracked.length ? "Nothing in this view" : "Nothing tracked yet"}
                body={tracked.length ? "Switch views or clear the filter to see the rest of your list." : "Star a symbol from Markets or Screener, or search above to add one."}
                action={<Link to="/app/markets" className="btn-primary mt-1 px-4 py-2 text-xs">Browse markets</Link>}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppShell>
  );
}
