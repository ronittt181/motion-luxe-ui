import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, X } from "lucide-react";
import { SIGNALS, type IntelligenceSignal } from "@/lib/intelligence";
import { ConfidenceIndicator, DataStatusBadge, toneText, useMotionOk } from "./primitives";

const stroke = (s: IntelligenceSignal) =>
  s.state === "positive" ? "var(--positive)" : s.state === "negative" ? "var(--negative)" : s.state === "mixed" ? "var(--warning)" : "var(--neutral)";

export function IntelligenceNode({ s, active, onSelect }: { s: IntelligenceSignal; active: boolean; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      aria-pressed={active}
      className={`group w-full min-h-[44px] rounded-xl border px-3 py-2.5 text-left transition-colors ${
        active ? "border-mint/40 bg-mint/10" : "border-border bg-raised/60 hover:border-border-active hover:bg-accent/40"
      } focus-visible:outline focus-visible:outline-2 focus-visible:outline-mint`}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="truncate text-xs font-medium">{s.label}</span>
        <span className="tabular text-[11px]" style={{ color: stroke(s) }}>{s.score}</span>
      </div>
      <div className="mt-1 flex items-center justify-between gap-2">
        <span className={`text-[11px] capitalize ${toneText(s.state)}`}>{s.state}</span>
        <span className={`tabular text-[11px] ${s.change >= 0 ? "text-positive" : "text-negative"}`}>{s.change >= 0 ? "+" : ""}{s.change}%</span>
      </div>
    </button>
  );
}

function Orbit({ selected, onSelect }: { selected: string | null; onSelect: (id: string) => void }) {
  const ok = useMotionOk();
  const size = 460;
  const cx = size / 2;
  const cy = size / 2;
  const R = 170;
  const pts = SIGNALS.map((s, i) => {
    const a = (i / SIGNALS.length) * Math.PI * 2 - Math.PI / 2;
    return { s, x: cx + Math.cos(a) * R, y: cy + Math.sin(a) * R };
  });
  return (
    <div className="relative mx-auto" style={{ width: size, height: size, maxWidth: "100%" }}>
      <svg viewBox={`0 0 ${size} ${size}`} className="absolute inset-0 size-full" aria-hidden>
        <circle cx={cx} cy={cy} r={R} fill="none" stroke="var(--border)" strokeDasharray="3 7" />
        {pts.map(({ s, x, y }) => {
          const reinforcing = s.state === "positive";
          return (
            <motion.line
              key={s.id}
              x1={cx} y1={cy} x2={x} y2={y}
              stroke={stroke(s)}
              strokeWidth={selected === s.id ? 1.8 : 1}
              strokeDasharray={reinforcing ? undefined : "4 5"}
              initial={ok ? { pathLength: 0, opacity: 0 } : false}
              animate={{ pathLength: 1, opacity: selected && selected !== s.id ? 0.2 : 0.6 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            />
          );
        })}
      </svg>
      <div className="absolute left-1/2 top-1/2 w-44 -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-mint/25 bg-raised/85 p-4 text-center backdrop-blur-xl">
        <div className="eyebrow text-[9px]">Market Pulse</div>
        <div className="mt-2 font-display text-base leading-tight">Moderately Bullish</div>
        <div className="mt-1 tabular text-xs text-mint">74% confidence</div>
      </div>
      {pts.map(({ s, x, y }) => (
        <button
          key={s.id}
          onClick={() => onSelect(s.id)}
          aria-pressed={selected === s.id}
          className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-xl border px-2.5 py-1.5 text-[11px] backdrop-blur-md transition-transform hover:scale-[1.06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-mint ${
            selected === s.id ? "border-mint/50 bg-mint/15" : "border-border bg-raised/85"
          }`}
          style={{ left: (x / size) * 100 + "%", top: (y / size) * 100 + "%" }}
        >
          <span className="block font-medium">{s.label}</span>
          <span className="tabular" style={{ color: stroke(s) }}>{s.score}</span>
        </button>
      ))}
    </div>
  );
}

export function SignalDetailDrawer({ s, onClose }: { s: IntelligenceSignal; onClose: () => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
      className="panel relative p-5"
      role="region"
      aria-label={`${s.label} detail`}
    >
      <button onClick={onClose} aria-label="Close signal detail" className="absolute right-3 top-3 grid size-9 place-items-center rounded-lg text-muted-foreground hover:text-foreground">
        <X className="size-4" />
      </button>
      <div className="eyebrow text-[10px]">{s.category.replace("_", " ")}</div>
      <h3 className="mt-2 font-display text-lg">{s.label}</h3>
      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
        <span className={toneText(s.state)}>{s.metric}</span>
        <span className={`tabular ${s.change >= 0 ? "text-positive" : "text-negative"}`}>{s.change >= 0 ? "+" : ""}{s.change}% change</span>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.explanation}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {s.affectedSectors.map((x) => <span key={x} className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground">{x}</span>)}
        {s.affectedSymbols.map((x) => (
          <Link key={x} to="/app/analyze/$symbol" params={{ symbol: x }} className="rounded-full border border-mint/25 bg-mint/10 px-2 py-0.5 text-[11px] text-mint hover:bg-mint/20">{x}</Link>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border/70 pt-3">
        <div className="flex items-center gap-3">
          <DataStatusBadge status="simulated" at={s.updatedAt} />
          <ConfidenceIndicator value={s.score} compact />
        </div>
        <Link to="/app/intelligence" className="flex items-center gap-1.5 text-xs text-mint hover:underline">
          View full analysis <ArrowUpRight className="size-3.5" />
        </Link>
      </div>
    </motion.div>
  );
}

export function MarketPulseMap() {
  const [selected, setSelected] = useState<string | null>(null);
  const sig = SIGNALS.find((s) => s.id === selected) ?? null;
  const toggle = (id: string) => setSelected((c) => (c === id ? null : id));

  return (
    <div className="space-y-4">
      <div className="panel relative overflow-hidden p-5">
        <div className="pointer-events-none absolute inset-0 opacity-40" style={{ background: "radial-gradient(60% 60% at 50% 45%, color-mix(in oklab, var(--signal) 12%, transparent), transparent)" }} />
        <div className="relative hidden md:block"><Orbit selected={selected} onSelect={toggle} /></div>
        <div className="relative md:hidden">
          <div className="rounded-2xl border border-mint/25 bg-raised/70 p-4 text-center">
            <div className="eyebrow text-[9px]">Market Pulse</div>
            <div className="mt-2 font-display text-base">Moderately Bullish</div>
            <div className="mt-1 tabular text-xs text-mint">74% confidence</div>
          </div>
          <div className="-mx-1 mt-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-1 pb-2">
            {SIGNALS.map((s) => (
              <div key={s.id} className="w-40 shrink-0 snap-start">
                <IntelligenceNode s={s} active={selected === s.id} onSelect={() => toggle(s.id)} />
              </div>
            ))}
          </div>
        </div>
        <p className="relative mt-4 text-[11px] text-muted-foreground">
          Solid connections reinforce the market pulse; dashed connections contradict it.
        </p>
      </div>
      <AnimatePresence mode="wait">
        {sig && <SignalDetailDrawer key={sig.id} s={sig} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  );
}
