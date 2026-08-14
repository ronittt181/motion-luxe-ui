import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app/AppShell";
import { useStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/app/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Quant Plus" },
      { name: "description", content: "Manage your Quant Plus profile, display density, alert preferences and virtual trading reset." },
      { property: "og:title", content: "Settings — Quant Plus" },
      { property: "og:description", content: "Profile, preferences and virtual account controls." },
    ],
  }),
  component: Settings,
});

function Settings() {
  const { user, login, reset } = useStore();
  const [name, setName] = useState(user?.name ?? "Guest analyst");
  const [email, setEmail] = useState(user?.email ?? "guest@quantplus.app");
  const [compactMode, setCompactMode] = useState(false);
  const [emailAlerts, setEmailAlerts] = useState(true);

  return (
    <AppShell title="Settings" subtitle="Profile, preferences and virtual account controls.">
      <div className="grid gap-3 lg:grid-cols-2">
        <div className="panel space-y-4 p-5">
          <div className="font-display text-lg">Profile</div>
          <label className="block space-y-1.5">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Name</span>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Email</span>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
          </label>
          <button
            onClick={() => { login({ name, email }); toast.success("Profile updated."); }}
            className="rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02]"
          >
            Save profile
          </button>
        </div>

        <div className="panel space-y-5 p-5">
          <div className="font-display text-lg">Preferences</div>
          <label className="flex items-center justify-between gap-4">
            <span><span className="block text-sm">Compact density</span><span className="text-xs text-muted-foreground">Tighter rows in data tables.</span></span>
            <Switch checked={compactMode} onCheckedChange={(v) => { setCompactMode(v); toast(`Density set to ${v ? "compact" : "comfortable"}.`); }} />
          </label>
          <label className="flex items-center justify-between gap-4">
            <span><span className="block text-sm">Alert emails</span><span className="text-xs text-muted-foreground">Send a summary when an alert triggers.</span></span>
            <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
          </label>
        </div>

        <div className="panel space-y-3 p-5 lg:col-span-2">
          <div className="font-display text-lg">Virtual account</div>
          <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
            Resetting restores ₹10,00,000 of virtual cash, clears positions, orders and alerts, and returns the demo
            watchlist to its defaults. Nothing here affects real money.
          </p>
          <button
            onClick={() => { reset(); toast.success("Virtual account reset."); }}
            className="rounded-xl border border-negative/30 bg-negative/10 px-4 py-2.5 text-sm font-medium text-negative transition-colors hover:bg-negative/20"
          >
            Reset virtual account
          </button>
        </div>
      </div>
    </AppShell>
  );
}
