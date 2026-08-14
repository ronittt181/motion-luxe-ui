import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import type { DataStatus } from "@/lib/intelligence";

export function useMotionOk() {
  return !useReducedMotion();
}

export function DataStatusBadge({ status, at }: { status: DataStatus; at?: string }) {
  const map: Record<DataStatus, string> = {
    live: "text-positive border-positive/30 bg-positive/10",
    delayed: "text-warning border-warning/30 bg-warning/10",
    simulated: "text-violet border-violet/30 bg-violet/10",
  };
  const label = status === "simulated" ? "Simulated" : status === "live" ? "Live" : "Delayed";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] ${map[status]}`}>
      <span className="size-1.5 rounded-full bg-current" />
      {label}
      {at && <span className="text-muted-foreground normal-case tracking-normal">· {at}</span>}
    </span>
  );
}

export function ConfidenceIndicator({ value, compact = false }: { value: number; compact?: boolean }) {
  const ok = useMotionOk();
  return (
    <div className={`flex items-center gap-2 ${compact ? "" : "min-w-[140px]"}`}>
      <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Conf</span>
      <div className="h-1 flex-1 overflow-hidden rounded-full bg-border/70" role="meter" aria-valuenow={value} aria-valuemin={0} aria-valuemax={100} aria-label="Confidence">
        <motion.div
          className="h-full rounded-full"
          style={{ background: "linear-gradient(90deg,var(--mint),var(--signal))" }}
          initial={ok ? { width: 0 } : false}
          animate={{ width: `${value}%` }}
          transition={{ duration: ok ? 0.9 : 0, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
      <span className="tabular text-xs text-foreground/80">{value}%</span>
    </div>
  );
}

export function EvidenceList({ items, columns = 2 }: { items: Array<{ label: string; value: string }>; columns?: number }) {
  return (
    <dl className={`grid gap-x-4 gap-y-2 ${columns === 2 ? "sm:grid-cols-2" : ""}`}>
      {items.map((e) => (
        <div key={e.label} className="flex items-baseline justify-between gap-3 border-b border-border/60 pb-1.5 last:border-0">
          <dt className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{e.label}</dt>
          <dd className="tabular text-xs text-foreground/90">{e.value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function SectionHead({ eyebrow, title, sub, action }: { eyebrow: string; title: string; sub?: string; action?: ReactNode }) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div>
        <div className="eyebrow flex items-center gap-2 text-[10px]">
          <span className="size-1.5 rounded-full bg-mint" />
          {eyebrow}
        </div>
        <h2 className="mt-2 font-display text-lg md:text-xl">{title}</h2>
        {sub && <p className="mt-1 max-w-2xl text-xs leading-relaxed text-muted-foreground">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export function Skel({ className = "" }: { className?: string }) {
  return <div className={`shimmer rounded-lg bg-surface/60 ${className}`} />;
}

export function EmptyState({ title, body, children }: { title: string; body: string; children?: ReactNode }) {
  return (
    <div className="panel flex flex-col items-center gap-3 px-6 py-10 text-center">
      <div className="font-display text-sm">{title}</div>
      <p className="max-w-md text-xs leading-relaxed text-muted-foreground">{body}</p>
      {children && <div className="mt-1 flex flex-wrap justify-center gap-2">{children}</div>}
    </div>
  );
}

export const toneText = (t: "positive" | "neutral" | "negative" | "mixed") =>
  t === "positive" ? "text-positive" : t === "negative" ? "text-negative" : t === "mixed" ? "text-warning" : "text-muted-foreground";
