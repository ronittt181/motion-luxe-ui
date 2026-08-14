import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import type { ReactNode } from "react";
import { Logo } from "@/components/viz/Logo";

export function AuthLayout({ title, subtitle, children, footer }: { title: string; subtitle: string; children: ReactNode; footer?: ReactNode }) {
  return (
    <div className="relative grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      <div className="relative hidden overflow-hidden border-r border-border lg:block">
        <div className="absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
        <div className="absolute inset-0 grid-lines opacity-60" />
        <div className="relative flex h-full flex-col justify-between p-12">
          <Link to="/"><Logo /></Link>
          <div>
            <motion.h2
              initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-md font-display text-4xl font-semibold leading-tight"
            >
              See the signal <span className="text-gradient">behind the market.</span>
            </motion.h2>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Technicals, AI prediction, sentiment and native virtual trading in one calm workspace.
            </p>
          </div>
          <p className="max-w-sm text-xs leading-relaxed text-muted-foreground">
            Quant Plus insights are informational and simulated trading is virtual.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center px-5 py-16">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-sm"
        >
          <div className="lg:hidden"><Link to="/"><Logo /></Link></div>
          <h1 className="mt-8 font-display text-2xl font-semibold lg:mt-0">{title}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-6 text-sm text-muted-foreground">{footer}</div>}
        </motion.div>
      </div>
    </div>
  );
}

export function Field({ label, children, error }: { label: string; children: ReactNode; error?: string }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</span>
      {children}
      {error && <span className="block text-xs text-negative">{error}</span>}
    </label>
  );
}
