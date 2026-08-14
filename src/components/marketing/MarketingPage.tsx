import type { ReactNode } from "react";
import { motion } from "motion/react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";

export function MarketingPage({ eyebrow, title, lede, children }: { eyebrow: string; title: ReactNode; lede: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-void">
      <SiteHeader />
      <section className="relative overflow-hidden px-5 pb-10 pt-36">
        <div className="pointer-events-none absolute inset-0" style={{ background: "var(--gradient-hero)", opacity: 0.75 }} />
        <div className="pointer-events-none absolute inset-0 grid-lines opacity-50 [mask-image:radial-gradient(60%_60%_at_50%_0%,black,transparent)]" />
        <motion.div
          initial={{ opacity: 0, y: 22, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto max-w-6xl"
        >
          <div className="text-xs uppercase tracking-[0.2em] text-mint">{eyebrow}</div>
          <h1 className="mt-4 max-w-3xl font-display text-[clamp(2.2rem,5.5vw,3.6rem)] font-semibold leading-[1.05]">{title}</h1>
          <p className="mt-5 max-w-xl leading-relaxed text-muted-foreground">{lede}</p>
        </motion.div>
      </section>
      <main className="mx-auto max-w-6xl px-5 pb-24">{children}</main>
      <SiteFooter />
    </div>
  );
}
