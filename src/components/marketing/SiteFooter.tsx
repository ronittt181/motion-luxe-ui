import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/viz/Logo";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-raised/40">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-12 md:flex-row md:items-start md:justify-between">
        <div className="max-w-sm space-y-3">
          <Logo />
          <p className="text-sm leading-relaxed text-muted-foreground">
            AI-powered market intelligence for clearer decisions in Indian markets.
          </p>
        </div>
        <div className="flex gap-12 text-sm">
          <div className="space-y-2.5">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Product</div>
            <Link to="/features" className="block text-muted-foreground hover:text-foreground">Features</Link>
            <Link to="/intelligence" className="block text-muted-foreground hover:text-foreground">Intelligence</Link>
            <Link to="/how-it-works" className="block text-muted-foreground hover:text-foreground">How it works</Link>
          </div>
          <div className="space-y-2.5">
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Access</div>
            <Link to="/login" className="block text-muted-foreground hover:text-foreground">Log in</Link>
            <Link to="/signup" className="block text-muted-foreground hover:text-foreground">Create account</Link>
            <Link to="/app" className="block text-muted-foreground hover:text-foreground">Open workspace</Link>
          </div>
        </div>
      </div>
      <div className="border-t border-border px-5 py-5">
        <p className="mx-auto max-w-6xl text-xs leading-relaxed text-muted-foreground">
          Quant Plus insights are informational and simulated trading is virtual. Market figures shown are demo data for
          product demonstration and are not live exchange feeds. © {new Date().getFullYear()} Quant Plus.
        </p>
      </div>
    </footer>
  );
}
