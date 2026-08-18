import { motion, useReducedMotion } from "motion/react";

export function Sparkline({ data, positive = true, width = 96, height = 32 }: { data: number[]; positive?: boolean; width?: number; height?: number }) {
  const reduce = useReducedMotion();
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const pt = (v: number, i: number) => ({
    x: (i / (data.length - 1 || 1)) * width,
    y: height - ((v - min) / span) * (height - 4) - 2,
  });
  const d = data.map((v, i) => `${i === 0 ? "M" : "L"}${pt(v, i).x},${pt(v, i).y}`).join(" ");
  const color = positive ? "var(--positive)" : "var(--negative)";
  const last = pt(data[data.length - 1] ?? min, data.length - 1);
  const hiIdx = data.indexOf(max);
  const loIdx = data.indexOf(min);
  const hi = pt(max, hiIdx);
  const lo = pt(min, loIdx);
  return (
    <svg width={width} height={height} className="overflow-visible">
      <path d={`${d} L${width},${height} L0,${height} Z`} fill={color} opacity={0.1} />
      <motion.path
        d={d}
        fill="none"
        strokeWidth={1.75}
        strokeLinecap="round"
        stroke={color}
        initial={reduce ? false : { pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: reduce ? 0 : 1.1, ease: [0.16, 1, 0.3, 1] }}
      />
      <circle cx={hi.x} cy={hi.y} r={1.6} fill="var(--muted-foreground)" opacity={0.7} />
      <circle cx={lo.x} cy={lo.y} r={1.6} fill="var(--muted-foreground)" opacity={0.7} />
      <circle cx={last.x} cy={last.y} r={4} fill={color} opacity={0.22} className={reduce ? "" : "pulse-dot"} style={{ transformOrigin: `${last.x}px ${last.y}px` }} />
      <circle cx={last.x} cy={last.y} r={2} fill={color} />
    </svg>
  );
}
