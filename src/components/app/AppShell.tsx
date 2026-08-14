import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import {
  Activity, BarChart3, Bell, Brain, Briefcase, ChevronLeft, Filter, LayoutDashboard,
  LineChart, Search, Settings, Star, User2, LogOut,
} from "lucide-react";
import { Logo } from "@/components/viz/Logo";
import { useStore } from "@/lib/store";
import { SYMBOLS } from "@/lib/market-data";
import {
  CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from "@/components/ui/command";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const nav = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard },
  { to: "/app/markets", label: "Markets", icon: BarChart3 },
  { to: "/app/analyze", label: "Analyze", icon: LineChart },
  { to: "/app/intelligence", label: "AI Intelligence", icon: Brain },
  { to: "/app/screener", label: "Screener", icon: Filter },
  { to: "/app/trade", label: "Trade", icon: Activity },
  { to: "/app/portfolio", label: "Portfolio", icon: Briefcase },
  { to: "/app/watchlist", label: "Watchlist", icon: Star },
  { to: "/app/alerts", label: "Alerts", icon: Bell },
];

export function AppShell({ title, subtitle, children, action }: { title: string; subtitle?: string; children: ReactNode; action?: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useStore();
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, []);

  return (
    <div className="noise min-h-screen bg-void">
      <aside
        className={`fixed inset-y-0 left-0 z-40 hidden flex-col border-r border-border bg-raised/55 backdrop-blur-2xl backdrop-saturate-150 transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] md:flex ${
          collapsed ? "w-[72px]" : "w-[236px]"
        }`}
      >
        <div className="pointer-events-none absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-mint/20 to-transparent" />
        <div className="flex h-16 items-center justify-between px-4">
          <Link to="/"><Logo compact={collapsed} /></Link>
          {!collapsed && (
            <button onClick={() => setCollapsed(true)} className="text-muted-foreground hover:text-foreground" aria-label="Collapse sidebar">
              <ChevronLeft className="size-4" />
            </button>
          )}
        </div>
        {collapsed && (
          <button onClick={() => setCollapsed(false)} className="mx-auto mb-2 rotate-180 text-muted-foreground hover:text-foreground" aria-label="Expand sidebar">
            <ChevronLeft className="size-4" />
          </button>
        )}
        <nav className="flex-1 space-y-1 px-3 py-2">
          {nav.map((n) => {
            const active = n.to === "/app" ? path === "/app" : path.startsWith(n.to);
            return (
              <Link key={n.to} to={n.to} className="group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-colors duration-300 hover:text-foreground">
                <span className="absolute inset-0 rounded-xl bg-accent/0 transition-colors duration-300 group-hover:bg-accent/40" />
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-xl border border-mint/25 bg-mint/12 shadow-[0_10px_30px_-18px_color-mix(in_oklab,var(--mint)_90%,transparent)]"
                    transition={{ type: "spring", stiffness: 400, damping: 34 }}
                  />
                )}
                <n.icon className={`relative size-[18px] shrink-0 transition-transform duration-300 group-hover:scale-110 ${active ? "text-mint" : ""}`} />
                {!collapsed && <span className={`relative truncate ${active ? "font-medium text-foreground" : ""}`}>{n.label}</span>}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border p-3">
          <Link to="/app/settings" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground">
            <Settings className="size-[18px]" />
            {!collapsed && "Settings"}
          </Link>
        </div>
      </aside>

      <div className={`transition-all duration-500 ${collapsed ? "md:pl-[72px]" : "md:pl-[236px]"}`}>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-void/70 px-4 backdrop-blur-2xl backdrop-saturate-150 md:px-6">
          <button
            onClick={() => setOpen(true)}
            className="flex flex-1 items-center gap-2 rounded-xl border border-border bg-surface/70 px-3 py-2 text-sm text-muted-foreground transition-all duration-300 hover:border-border-active hover:bg-surface md:max-w-sm"
          >
            <Search className="size-4" />
            Search symbols…
            <kbd className="ml-auto hidden rounded-md border border-border px-1.5 py-0.5 text-[10px] md:inline">⌘K</kbd>
          </button>
          <span className="ml-auto hidden items-center gap-2 rounded-full border border-border bg-surface/70 px-3 py-1.5 text-xs text-muted-foreground sm:flex">
            <span className="size-1.5 rounded-full bg-positive" /> Market open · demo data
          </span>
          <Link to="/app/alerts" className="rounded-xl border border-border bg-surface/70 p-2 text-muted-foreground transition-colors duration-300 hover:border-border-active hover:text-foreground" aria-label="Alerts">
            <Bell className="size-4" />
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger className="grid size-9 place-items-center rounded-xl border border-border bg-surface/70 text-muted-foreground transition-colors duration-300 hover:border-border-active hover:text-foreground">
              <User2 className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel className="truncate">{user?.name ?? "Guest analyst"}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate({ to: "/app/settings" })}>Settings</DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate({ to: "/app/portfolio" })}>Portfolio</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => { logout(); navigate({ to: "/" }); }}>
                <LogOut className="mr-2 size-4" /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <motion.main
          key={path}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto max-w-7xl px-4 pb-28 pt-6 md:px-6 md:pb-12"
        >
          <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="font-display text-2xl md:text-[30px]">{title}</h1>
              {subtitle && <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{subtitle}</p>}
            </div>
            {action}
          </div>
          <div className="rule-glow mb-7 opacity-50" />
          {children}
        </motion.main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-border bg-raised/85 px-2 py-2 backdrop-blur-2xl md:hidden">
        {nav.slice(0, 5).map((n) => {
          const active = n.to === "/app" ? path === "/app" : path.startsWith(n.to);
          return (
            <Link key={n.to} to={n.to} className={`flex flex-col items-center gap-1 rounded-lg px-3 py-1.5 text-[10px] transition-colors duration-300 ${active ? "text-mint" : "text-muted-foreground"}`}>
              <n.icon className="size-[18px]" />
              {n.label}
            </Link>
          );
        })}
      </nav>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search NSE symbols…" />
        <CommandList>
          <CommandEmpty>No symbol found.</CommandEmpty>
          <CommandGroup heading="Symbols">
            {SYMBOLS.map((s) => (
              <CommandItem
                key={s.symbol}
                value={`${s.symbol} ${s.name}`}
                onSelect={() => {
                  setOpen(false);
                  navigate({ to: "/app/analyze/$symbol", params: { symbol: s.symbol } });
                }}
              >
                <span className="font-medium">{s.symbol}</span>
                <span className="ml-2 truncate text-muted-foreground">{s.name}</span>
                <span className={`ml-auto tabular ${s.changePct >= 0 ? "text-positive" : "text-negative"}`}>
                  {s.changePct >= 0 ? "+" : ""}{s.changePct}%
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
}
