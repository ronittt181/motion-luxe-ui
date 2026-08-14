import { useMotionValue, useMotionTemplate, motion } from "motion/react";
import type { ReactNode } from "react";

/** Card wrapper with a cursor-following radial highlight on its border/surface. */
export function Spotlight({ children, className = "" }: { children: ReactNode; className?: string }) {
  const mx = useMotionValue(-200);
  const my = useMotionValue(-200);
  const bg = useMotionTemplate`radial-gradient(340px circle at ${mx}px ${my}px, color-mix(in oklab, var(--mint) 12%, transparent), transparent 70%)`;

  return (
    <motion.div
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(e.clientX - r.left);
        my.set(e.clientY - r.top);
      }}
      className={`group relative overflow-hidden ${className}`}
    >
      <motion.div
        aria-hidden
        style={{ background: bg }}
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
      />
      <div className="relative">{children}</div>
    </motion.div>
  );
}
