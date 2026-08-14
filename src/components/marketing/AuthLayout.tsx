import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import { Logo } from "@/components/viz/Logo";

export function AuthLayout({ title, subtitle, children, footer }: { title: string; subtitle: string; children: ReactNode; footer?: ReactNode }) {
  return (
    <div className="noise relative grid min-h-screen bg-void lg:grid-cols-[1.05fr_1fr]">
      <div className="relative hidden overflow-hidden border-r border-border lg:block">
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div className="absolute inset-0 grid-lines opacity-40 [mask-image:radial-gradient(80%_70%_at_30%_20%,black,transparent)]" />
        <div className="absolute -left-20 top-1/3 aurora size-[30rem] rounded-full opacity-25 blur-3xl"
          style={{ background: "conic-gradient(from 180deg, color-mix(in oklab, var(--mint) 55%, transparent), color-mix(in oklab, var(--ai-violet) 45%, transparent), transparent 70%)" }} />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Link to="/"><Logo /></Link>
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-md font-display text-[2.7rem] leading-[1.04]"
            >
              See the signal <span className="font-serif-accent text-gradient">behind the market.</span>
            </motion.h2>
            <p className="mt-5 max-w-sm text-sm leading-[1.7] text-muted-foreground">
              Technicals, AI prediction, sentiment and native virtual trading in one calm workspace.
            </p>
            <div className="mt-9 grid max-w-sm grid-cols-3 gap-3">
              {[["Symbols", "180+"], ["Indicators", "24"], ["Virtual cash", "₹10L"]].map(([k, v], i) => (
                <motion.div
                  key={k}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.3 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                  className="glass rounded-xl px-3 py-2.5"
                >
                  <div className="text-[0.6rem] uppercase tracking-[0.16em] text-muted-foreground">{k}</div>
                  <div className="mt-0.5 font-display text-sm tabular">{v}</div>
                </motion.div>
              ))}
            </div>
          </div>
          <p className="max-w-sm text-xs leading-relaxed text-muted-foreground">
            Quant Plus insights are informational and simulated trading is virtual.
          </p>
        </div>
      </div>

      <div className="relative flex items-center justify-center px-5 py-16">
        <div className="pointer-events-none absolute inset-0 lg:hidden" style={{ background: "var(--gradient-hero)", opacity: 0.6 }} />
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-sm"
        >
          <div className="lg:hidden"><Link to="/"><Logo /></Link></div>
          <h1 className="mt-8 font-display text-[1.7rem] leading-tight lg:mt-0">{title}</h1>
          <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-7 border-t border-border pt-5 text-sm text-muted-foreground">{footer}</div>}
        </motion.div>
      </div>
    </div>
  );
}

export function Field({ label, children, error }: { label: string; children: ReactNode; error?: string }) {
  return (
    <label className="block space-y-2">
      <span className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted-foreground">{label}</span>
      {children}
      {error && <span className="block text-xs text-negative">{error}</span>}
    </label>
  );
}
