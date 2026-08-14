import { motion } from "motion/react";

export function Sparkline({ data, positive = true, width = 96, height = 32 }: { data: number[]; positive?: boolean; width?: number; height?: number }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const d = data
    .map((v, i) => `${i === 0 ? "M" : "L"}${(i / (data.length - 1)) * width},${height - ((v - min) / span) * (height - 4) - 2}`)
    .join(" ");
  return (
    <svg width={width} height={height} className="overflow-visible">
      <motion.path
        d={d}
        fill="none"
        strokeWidth={1.75}
        strokeLinecap="round"
        stroke={positive ? "var(--positive)" : "var(--negative)"}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
      />
    </svg>
  );
}
