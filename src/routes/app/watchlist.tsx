import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { Star } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { SymbolRow } from "@/components/app/bits";
import { SYMBOLS } from "@/lib/market-data";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/app/watchlist")({
  head: () => ({
    meta: [
      { title: "Watchlist — Quant Plus" },
      { name: "description", content: "Your persistent Quant Plus watchlist with scores, price change and quick access to analysis." },
      { property: "og:title", content: "Watchlist — Quant Plus" },
      { property: "og:description", content: "Track the names that matter with score and sentiment at a glance." },
    ],
  }),
  component: Watchlist,
});

function Watchlist() {
  const { watchlist } = useStore();
  const rows = SYMBOLS.filter((s) => watchlist.includes(s.symbol));

  return (
    <AppShell title="Watchlist" subtitle={`${rows.length} symbol${rows.length === 1 ? "" : "s"} tracked across sessions.`}>
      <AnimatePresence mode="popLayout">
        {rows.length ? (
          <motion.div key="list" layout className="panel overflow-hidden">
            {rows.map((s, i) => <SymbolRow key={s.symbol} s={s} index={i} />)}
          </motion.div>
        ) : (
          <motion.div key="empty" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="panel grid place-items-center gap-3 p-16 text-center">
            <Star className="size-7 text-muted-foreground" />
            <div className="font-display text-lg">Nothing tracked yet</div>
            <p className="max-w-xs text-sm text-muted-foreground">Star a symbol from Markets or Screener and it will appear here.</p>
            <Link to="/app/markets" className="mt-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground">Browse markets</Link>
          </motion.div>
        )}
      </AnimatePresence>
    </AppShell>
  );
}
