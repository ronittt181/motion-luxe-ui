import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import type { PersonalizedInsight } from "@/lib/intelligence";
import { EmptyState } from "./primitives";

export function PersonalizedImpact({ insights }: { insights: PersonalizedInsight[] }) {
  if (insights.length === 0)
    return (
      <EmptyState
        title="Personalized intelligence is not available yet"
        body="Once you hold virtual positions or follow symbols, this section explains how each market move affects your portfolio, watchlist and alerts. Nothing is shown until there is real activity to interpret."
      >
        <Link to="/app/watchlist" className="min-h-[44px] rounded-xl border border-border px-4 py-2.5 text-xs hover:border-mint/40 hover:text-mint">Add symbols to watchlist</Link>
        <Link to="/app/trade" className="btn-primary min-h-[44px] rounded-xl px-4 py-2.5 text-xs">Make your first virtual trade</Link>
      </EmptyState>
    );

  return (
    <div className="panel p-5">
      <div className="eyebrow text-[10px]">Your market impact</div>
      <ul className="mt-4 space-y-2.5">
        {insights.map((i, idx) => (
          <motion.li
            key={i.id}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: Math.min(idx * 0.06, 0.3) }}
            className="group flex items-start gap-3 rounded-xl border border-border bg-raised/50 p-3.5 transition-colors hover:border-border-active"
          >
            <span className={`mt-1.5 size-1.5 shrink-0 rounded-full ${i.impact === "positive" ? "bg-positive" : i.impact === "negative" ? "bg-negative" : "bg-neutral"}`} />
            <div className="min-w-0 flex-1">
              <div className="text-sm">{i.title}</div>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{i.explanation}</p>
            </div>
            <Link to={i.relatedRoute} className="flex shrink-0 items-center gap-1 self-center whitespace-nowrap text-xs text-mint hover:underline">
              {i.routeLabel} <ArrowUpRight className="size-3.5" />
            </Link>
          </motion.li>
        ))}
      </ul>
      <p className="mt-4 text-[11px] text-muted-foreground">Derived from your virtual portfolio, watchlist and alerts. Simulated market data.</p>
    </div>
  );
}
