import { motion } from "motion/react";

export function ScoreRing({ score, size = 148, label = "Quant Score" }: { score: number; size?: number; label?: string }) {
  const r = size / 2 - 10;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--mint)" />
            <stop offset="55%" stopColor="var(--signal)" />
            <stop offset="100%" stopColor="var(--ai-violet)" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} strokeWidth={8} className="stroke-border" fill="none" />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          strokeWidth={8}
          strokeLinecap="round"
          fill="none"
          stroke="url(#ringGrad)"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          whileInView={{ strokeDashoffset: c - (c * score) / 100 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <div className="absolute text-center leading-none" style={{ width: size - 26 }}>
        <div
          className="font-display font-semibold tabular leading-none"
          style={{ fontSize: Math.max(16, size * 0.24) }}
        >
          {score}
        </div>
        {size >= 110 && (
          <div className="mt-1 text-[9px] uppercase tracking-[0.14em] text-muted-foreground">{label}</div>
        )}
      </div>
    </div>
  );
}
