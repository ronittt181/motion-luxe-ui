import type { ReactNode } from "react";
import { motion } from "motion/react";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import { ScrollProgress } from "@/components/viz/ScrollProgress";

export function MarketingPage({ eyebrow, title, lede, children }: { eyebrow: string; title: ReactNode; lede: string; children: ReactNode }) {
  return (
    <div className="noise min-h-screen bg-void">
      <ScrollProgress />
      <SiteHeader />
      <section className="relative overflow-hidden px-5 pb-12 pt-36 md:pt-44">
        <div className="pointer-events-none absolute inset-0" style={{ background: "var(--gradient-hero)", opacity: 0.75 }} />
        <div className="pointer-events-none absolute -top-44 left-1/2 aurora size-[36rem] -translate-x-1/2 rounded-full opacity-25 blur-3xl"
          style={{ background: "conic-gradient(from 200deg, color-mix(in oklab, var(--mint) 50%, transparent), color-mix(in oklab, var(--ai-violet) 45%, transparent), transparent 70%)" }} />
        <div className="pointer-events-none absolute inset-0 grid-lines opacity-50 [mask-image:radial-gradient(60%_60%_at_50%_0%,black,transparent)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_0%,transparent_45%,var(--void)_100%)]" />
        <motion.div
          initial={{ opacity: 0, y: 22, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto max-w-6xl"
        >
          <div className="eyebrow flex items-center gap-2.5">
            <span className="size-1 rounded-full bg-mint" />
            {eyebrow}
          </div>
          <h1 className="mt-5 max-w-3xl font-display text-[clamp(2.3rem,5.8vw,3.9rem)] leading-[1.02]">{title}</h1>
          <p className="mt-6 max-w-xl text-[1.02rem] leading-[1.7] text-muted-foreground">{lede}</p>
          <div className="rule-glow mt-10 w-full opacity-70" />
        </motion.div>
      </section>
      <main className="relative mx-auto max-w-6xl px-5 pb-28">{children}</main>
      <SiteFooter />
    </div>
  );
}
