import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/viz/Logo";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-border bg-raised/40">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-mint/40 to-transparent" />
      <div className="pointer-events-none absolute -bottom-40 left-1/2 size-[34rem] -translate-x-1/2 rounded-full opacity-[0.12] blur-3xl"
        style={{ background: "var(--gradient-signal)" }} />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-5 py-14 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm space-y-3">
          <Logo />
          <p className="text-sm leading-relaxed text-muted-foreground">
            AI-powered market intelligence for clearer decisions in Indian markets.
          </p>
          <div className="flex items-center gap-2 pt-1 text-xs text-muted-foreground">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-mint opacity-70" />
              <span className="relative inline-flex size-1.5 rounded-full bg-mint" />
            </span>
            NSE · BSE coverage · demo data
          </div>
        </div>
        <div className="flex gap-14 text-sm">
          <div className="space-y-3">
            <div className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-muted-foreground/70">Product</div>
            <Link to="/features" className="block text-muted-foreground transition-colors duration-300 hover:text-mint">Features</Link>
            <Link to="/intelligence" className="block text-muted-foreground transition-colors duration-300 hover:text-mint">Intelligence</Link>
            <Link to="/how-it-works" className="block text-muted-foreground transition-colors duration-300 hover:text-mint">How it works</Link>
          </div>
          <div className="space-y-3">
            <div className="font-mono text-[0.62rem] uppercase tracking-[0.2em] text-muted-foreground/70">Access</div>
            <Link to="/login" className="block text-muted-foreground transition-colors duration-300 hover:text-mint">Log in</Link>
            <Link to="/signup" className="block text-muted-foreground transition-colors duration-300 hover:text-mint">Create account</Link>
            <Link to="/app" className="block text-muted-foreground transition-colors duration-300 hover:text-mint">Open workspace</Link>
          </div>
        </div>
      </div>
      <div className="relative border-t border-border px-5 py-5">
        <p className="mx-auto max-w-6xl text-xs leading-relaxed text-muted-foreground">
          Quant Plus insights are informational and simulated trading is virtual. Market figures shown are demo data for
          product demonstration and are not live exchange feeds. © {new Date().getFullYear()} Quant Plus.
        </p>
      </div>
    </footer>
  );
}
