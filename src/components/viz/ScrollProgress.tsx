import { motion, useScroll, useSpring } from "motion/react";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const x = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.35 });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX: x, transformOrigin: "left center", background: "var(--gradient-signal)" }}
      className="fixed inset-x-0 top-0 z-[60] h-[2px]"
    />
  );
}
