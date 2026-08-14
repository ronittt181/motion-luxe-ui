import { useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { CornerDownLeft, RefreshCw, Sparkles } from "lucide-react";
import { askQuantPlus, SUGGESTED_QUESTIONS, type AiAnswer } from "@/lib/intelligence";
import { ConfidenceIndicator, DataStatusBadge, Skel, useMotionOk } from "./primitives";

export function AIAnswerPanel({ a }: { a: AiAnswer }) {
  const ok = useMotionOk();
  return (
    <motion.div
      initial={ok ? { opacity: 0, y: 10 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-2xl border border-border bg-raised/50 p-4"
      aria-live="polite"
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground">“{a.question}”</span>
        <DataStatusBadge status={a.dataStatus} at={a.updatedAt} />
      </div>
      <p className="mt-3 text-sm leading-relaxed text-foreground/90">{a.answer}</p>
      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {a.metrics.map((m) => (
          <div key={m.label} className="rounded-xl border border-border bg-surface/40 p-3">
            <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{m.label}</div>
            <div className="mt-1 tabular text-sm">{m.value}</div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-1.5">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Related</span>
        {a.relatedSymbols.map((s) => (
          <Link key={s} to="/app/analyze/$symbol" params={{ symbol: s }} className="rounded-full border border-mint/25 bg-mint/10 px-2 py-0.5 text-[11px] text-mint hover:bg-mint/20">{s}</Link>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-3">
        <span className="text-[11px] text-muted-foreground">Based on: {a.factors.join(", ")}</span>
        <ConfidenceIndicator value={a.confidence} />
      </div>
    </motion.div>
  );
}

export function AskQuantPlus() {
  const [q, setQ] = useState("");
  const [answer, setAnswer] = useState<AiAnswer | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "error">("idle");
  const lastQ = useRef("");

  async function run(question: string) {
    const text = question.trim();
    if (!text) return;
    lastQ.current = text;
    setState("loading");
    try {
      const a = await askQuantPlus(text);
      setAnswer(a);
      setState("idle");
    } catch {
      setState("error");
    }
  }

  return (
    <div className="panel relative overflow-hidden p-5">
      <div className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full opacity-30 blur-[80px]" style={{ background: "color-mix(in oklab, var(--ai-violet) 60%, transparent)" }} />
      <div className="relative flex items-center gap-2">
        <Sparkles className="size-4 text-violet" />
        <h3 className="font-display text-lg">Ask Quant Plus about today’s market</h3>
      </div>
      <form
        className="relative mt-4 flex flex-col gap-2 sm:flex-row"
        onSubmit={(e) => { e.preventDefault(); void run(q); }}
      >
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Why is NIFTY rising today?"
          aria-label="Ask a market question"
          className="min-h-[44px] flex-1 rounded-xl border border-border bg-surface/60 px-4 text-sm outline-none transition-colors focus:border-mint/45"
        />
        <button type="submit" disabled={state === "loading"} className="btn-primary flex min-h-[44px] items-center justify-center gap-2 rounded-xl px-4 text-sm disabled:opacity-60">
          {state === "loading" ? "Thinking…" : <>Ask <CornerDownLeft className="size-3.5" /></>}
        </button>
      </form>

      <div className="relative mt-3 flex flex-wrap gap-1.5">
        {SUGGESTED_QUESTIONS.map((s) => (
          <button key={s} onClick={() => { setQ(s); void run(s); }} className="min-h-[36px] rounded-full border border-border px-3 py-1.5 text-[11px] text-muted-foreground transition-colors hover:border-mint/40 hover:text-mint">
            {s}
          </button>
        ))}
      </div>

      <div className="relative mt-4">
        <AnimatePresence mode="wait">
          {state === "loading" && (
            <motion.div key="load" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
              <Skel className="h-4 w-3/4" /><Skel className="h-4 w-full" /><Skel className="h-4 w-2/3" />
            </motion.div>
          )}
          {state === "error" && (
            <motion.div key="err" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-negative/30 bg-negative/10 p-4">
              <span className="text-xs text-negative">The intelligence service did not respond. No answer was generated.</span>
              <button onClick={() => void run(lastQ.current)} className="flex min-h-[36px] items-center gap-1.5 rounded-lg border border-border px-3 text-xs hover:text-mint">
                <RefreshCw className="size-3.5" /> Retry
              </button>
            </motion.div>
          )}
          {state === "idle" && answer && (
            <motion.div key={answer.question + answer.updatedAt}>
              <AIAnswerPanel a={answer} />
              <div className="mt-3 flex flex-wrap gap-1.5">
                <span className="self-center font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Follow up</span>
                {answer.followUps.map((f) => (
                  <button key={f} onClick={() => { setQ(f); void run(f); }} className="min-h-[36px] rounded-full border border-border px-3 py-1.5 text-[11px] text-muted-foreground hover:border-mint/40 hover:text-mint">{f}</button>
                ))}
              </div>
            </motion.div>
          )}
          {state === "idle" && !answer && (
            <motion.p key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-muted-foreground">
              Ask a question or pick a suggestion. Answers come from a simulated intelligence adapter and are clearly marked as such.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
