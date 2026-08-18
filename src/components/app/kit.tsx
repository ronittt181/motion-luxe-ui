import { motion } from "motion/react";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import type { ReactNode } from "react";
import { inr } from "@/lib/market-data";

/* ---------------- Panel ---------------- */

export function Panel({
  title,
  eyebrow,
  action,
  children,
  className = "",
  bodyClassName = "",
  flush = false,
}: {
  title?: ReactNode;
  eyebrow?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  flush?: boolean;
}) {
  return (
    <section className={`panel flex min-w-0 flex-col overflow-hidden ${className}`}>
      {(title || action) && (
        <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border px-4 py-3">
          <div className="min-w-0">
            {eyebrow && <div className="t-label text-muted-foreground">{eyebrow}</div>}
            {title && <div className="truncate text-sm font-medium">{title}</div>}
          </div>
          {action && <div className="flex shrink-0 items-center gap-2">{action}</div>}
        </header>
      )}
      <div className={`${flush ? "" : "p-4"} min-w-0 flex-1 ${bodyClassName}`}>{children}</div>
    </section>
  );
}

/* ---------------- KPI tile ---------------- */

export function KpiTile({
  label,
  value,
  delta,
  sub,
  tone,
  delay = 0,
}: {
  label: string;
  value: ReactNode;
  delta?: number | undefined;
  sub?: ReactNode;
  tone?: "positive" | "negative" | undefined;
  delay?: number | undefined;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18, delay: Math.min(delay, 0.24), ease: [0.16, 1, 0.3, 1] }}
      className="panel panel-hover min-w-0 px-4 py-3"
    >
      <div className="t-label truncate text-muted-foreground">{label}</div>
      <div
        className={`mt-1.5 truncate font-display text-lg tabular ${
          tone === "positive" ? "text-positive" : tone === "negative" ? "text-negative" : ""
        }`}
      >
        {value}
      </div>
      <div className="mt-1 flex items-center gap-2 text-[11px] text-muted-foreground">
        {typeof delta === "number" && <Delta value={delta} />}
        {sub && <span className="truncate">{sub}</span>}
      </div>
    </motion.div>
  );
}

export function Delta({ value, suffix = "%" }: { value: number; suffix?: string }) {
  const up = value >= 0;
  return (
    <span className={`inline-flex items-center gap-0.5 tabular ${up ? "text-positive" : "text-negative"}`}>
      {up ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />}
      {Math.abs(value).toFixed(2)}
      {suffix}
    </span>
  );
}

export function Money({ value, tone }: { value: number; tone?: boolean }) {
  const cls = !tone ? "" : value >= 0 ? "text-positive" : "text-negative";
  return <span className={`tabular ${cls}`}>{value < 0 ? "−" : ""}{inr(Math.abs(value))}</span>;
}

/* ---------------- Segmented control ---------------- */

export function Segmented<T extends string>({
  value,
  onChange,
  options,
  id,
  size = "sm",
}: {
  value: T;
  onChange: (v: T) => void;
  options: ReadonlyArray<{ value: T; label: string }>;
  id: string;
  size?: "sm" | "xs";
}) {
  return (
    <div className="flex shrink-0 items-center gap-0.5 rounded-full border border-border bg-surface/50 p-0.5">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={`relative rounded-full ${size === "xs" ? "px-2.5 py-1 text-[11px]" : "px-3 py-1.5 text-xs"} transition-colors ${
            value === o.value ? "text-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {value === o.value && (
            <motion.span
              layoutId={`seg-${id}`}
              className="absolute inset-0 rounded-full border border-mint/25 bg-mint/12"
              transition={{ type: "spring", stiffness: 480, damping: 38 }}
            />
          )}
          <span className="relative whitespace-nowrap">{o.label}</span>
        </button>
      ))}
    </div>
  );
}

export function Chip({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs transition-colors ${
        active
          ? "border-mint/30 bg-mint/10 text-foreground"
          : "border-border text-muted-foreground hover:border-border-active hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

/* ---------------- Table primitives ---------------- */

export function SortHeader({
  label,
  active,
  dir,
  onClick,
  className = "",
}: {
  label: string;
  active?: boolean;
  dir?: "asc" | "desc";
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1 t-label transition-colors ${
        active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
      } ${className}`}
    >
      {label}
      {active ? (
        dir === "asc" ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />
      ) : (
        <ChevronsUpDown className="size-3 opacity-40" />
      )}
    </button>
  );
}

export function Bar({ value, max = 100, tone = "signal" }: { value: number; max?: number; tone?: "signal" | "positive" | "negative" | "warning" }) {
  const pctW = Math.max(2, Math.min(100, (value / max) * 100));
  const bg =
    tone === "positive" ? "var(--positive)" : tone === "negative" ? "var(--negative)" : tone === "warning" ? "var(--warning)" : "var(--gradient-signal)";
  return (
    <span className="block h-1.5 w-full overflow-hidden rounded-full bg-muted">
      <motion.span
        className="block h-full rounded-full"
        style={{ background: bg }}
        initial={{ width: 0 }}
        animate={{ width: `${pctW}%` }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      />
    </span>
  );
}

export function EmptyState({ icon, title, body, action }: { icon?: ReactNode; title: string; body?: string; action?: ReactNode }) {
  return (
    <div className="grid place-items-center gap-2.5 px-6 py-14 text-center">
      {icon && <div className="text-muted-foreground">{icon}</div>}
      <div className="font-display text-base">{title}</div>
      {body && <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">{body}</p>}
      {action}
    </div>
  );
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded-lg bg-muted/60 ${className}`} />;
}
