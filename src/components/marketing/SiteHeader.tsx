import { Link } from "@tanstack/react-router";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/viz/Logo";

const links = [
  { to: "/features", label: "Features" },
  { to: "/intelligence", label: "Intelligence" },
  { to: "/how-it-works", label: "How it works" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24));

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-x-0 top-0 z-50 px-4 pt-3"
    >
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between rounded-2xl border px-4 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          scrolled
            ? "h-13 border-border bg-raised/70 py-2 shadow-[0_20px_50px_-30px_oklch(0_0_0/90%)] backdrop-blur-2xl backdrop-saturate-150"
            : "h-16 border-transparent bg-transparent py-3"
        }`}
      >
        <Link to="/" className="shrink-0">
          <Logo />
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
              activeProps={{ className: "text-foreground bg-accent/60" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Link to="/login" className="rounded-xl px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
            Log in
          </Link>
          <Link
            to="/signup"
            className="rounded-xl border border-mint/30 bg-mint/12 px-3.5 py-2 text-sm font-medium text-mint transition-all hover:border-mint/60 hover:bg-mint/20"
          >
            Create account
          </Link>
        </div>
        <button className="md:hidden" onClick={() => setOpen((o) => !o)} aria-label="Menu">
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mt-2 max-w-6xl rounded-2xl border border-border bg-raised/95 p-3 backdrop-blur-xl md:hidden"
        >
          {[...links, { to: "/login", label: "Log in" }, { to: "/signup", label: "Create account" }].map((l) => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-accent/60 hover:text-foreground">
              {l.label}
            </Link>
          ))}
        </motion.div>
      )}
    </motion.header>
  );
}
