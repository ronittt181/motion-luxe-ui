import { motion, useReducedMotion } from "motion/react";
import { useRouterState } from "@tanstack/react-router";
import type { ReactNode } from "react";

/** Shared fade/rise between routes, and a thin route-change progress bar. */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const reduce = useReducedMotion();
  if (reduce) return <>{children}</>;
  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function RouteProgress() {
  const isLoading = useRouterState({ select: (s) => s.status === "pending" });
  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-0 z-[70] h-[2px] overflow-hidden">
      <motion.div
        className="h-full"
        style={{ background: "var(--gradient-signal)", transformOrigin: "left center" }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={isLoading ? { scaleX: 0.85, opacity: 1 } : { scaleX: 1, opacity: 0 }}
        transition={{ duration: isLoading ? 0.9 : 0.3, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}