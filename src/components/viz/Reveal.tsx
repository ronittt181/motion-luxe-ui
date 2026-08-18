import { motion, useReducedMotion, type Variants } from "motion/react";
import type { ReactNode } from "react";

const dirs: Record<string, { x?: number; y?: number }> = {
  up: { y: 24 },
  down: { y: -24 },
  left: { x: 28 },
  right: { x: -28 },
  none: {},
};

export function Reveal({
  children,
  delay = 0,
  from = "up",
  className,
  blur = false,
}: {
  children: ReactNode;
  delay?: number;
  from?: keyof typeof dirs | string;
  className?: string;
  blur?: boolean;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, ...(blur ? { filter: "blur(6px)" } : null), ...dirs[from] }}
      whileInView={{ opacity: 1, x: 0, y: 0, ...(blur ? { filter: "blur(0px)" } : null) }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: blur ? 0.7 : 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

export const item: Variants = {
  hidden: { opacity: 0, y: 18, filter: "blur(6px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] } },
};
