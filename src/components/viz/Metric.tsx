/** Canonical numeric rendering: currency, percent and plain values always look identical. */
export function Metric({
  value,
  kind = "number",
  decimals,
  signed = false,
  tone,
  className = "",
}: {
  value: number;
  kind?: "number" | "currency" | "percent";
  decimals?: number;
  signed?: boolean;
  tone?: "auto" | "none";
  className?: string;
}) {
  const d = decimals ?? (kind === "number" ? 0 : 2);
  const abs = Math.abs(value);
  const body = abs.toLocaleString("en-IN", { minimumFractionDigits: d, maximumFractionDigits: d });
  const sign = value < 0 ? "−" : signed ? "+" : "";
  const text = kind === "currency" ? `${sign}₹${body}` : kind === "percent" ? `${sign}${body}%` : `${sign}${body}`;
  const toneClass =
    tone === "none" || tone === undefined
      ? ""
      : value > 0
        ? "text-positive"
        : value < 0
          ? "text-negative"
          : "text-muted-foreground";
  return <span className={`tabular ${toneClass} ${className}`}>{text}</span>;
}