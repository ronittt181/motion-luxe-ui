import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/app/AppShell";
import { Panel } from "@/components/app/kit";
import { useStore } from "@/lib/store";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const Route = createFileRoute("/app/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Quant Plus" },
      { name: "description", content: "Manage your Quant Plus profile, appearance, trading defaults, notifications and virtual account reset." },
      { property: "og:title", content: "Settings — Quant Plus" },
      { property: "og:description", content: "Profile, preferences and virtual account controls." },
    ],
  }),
  component: Settings,
});

const SECTIONS = [
  { id: "profile", label: "Profile" },
  { id: "appearance", label: "Appearance" },
  { id: "trading", label: "Trading defaults" },
  { id: "notifications", label: "Notifications" },
  { id: "account", label: "Virtual account" },
];

function Settings() {
  const { user, login, reset } = useStore();
  const [name, setName] = useState(user?.name ?? "Guest analyst");
  const [email, setEmail] = useState(user?.email ?? "guest@quantplus.app");
  const [density, setDensity] = useState("comfortable");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [defaultQty, setDefaultQty] = useState("10");
  const [confirmOrders, setConfirmOrders] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [digest, setDigest] = useState(false);

  return (
    <AppShell title="Settings" subtitle="Profile, preferences and virtual account controls.">
      <div className="grid min-w-0 gap-3 lg:grid-cols-[200px_minmax(0,1fr)]">
        <nav className="hidden h-fit lg:sticky lg:top-20 lg:block">
          <div className="panel p-2">
            {SECTIONS.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="block rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent/40 hover:text-foreground">
                {s.label}
              </a>
            ))}
          </div>
        </nav>

        <div className="min-w-0 space-y-3">
          <section id="profile" className="scroll-mt-24">
            <Panel title="Profile" eyebrow="Your identity in the workspace">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-1.5">
                  <span className="t-label text-muted-foreground">Name</span>
                  <Input value={name} onChange={(e) => setName(e.target.value)} />
                </label>
                <label className="block space-y-1.5">
                  <span className="t-label text-muted-foreground">Email</span>
                  <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
                </label>
              </div>
              <button onClick={() => { login({ name, email }); toast.success("Profile updated."); }} className="btn-primary mt-4 px-4 py-2.5 text-sm">
                Save profile
              </button>
            </Panel>
          </section>

          <section id="appearance" className="scroll-mt-24">
            <Panel title="Appearance" eyebrow="Density and motion">
              <div className="space-y-4">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
                  <div className="min-w-0">
                    <div className="text-sm">Table density</div>
                    <div className="text-xs text-muted-foreground">Row height across data tables.</div>
                  </div>
                  <Select value={density} onValueChange={(v) => { setDensity(v); toast(`Density set to ${v}.`); }}>
                    <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="comfortable">Comfortable</SelectItem><SelectItem value="compact">Compact</SelectItem></SelectContent>
                  </Select>
                </div>
                <Toggle label="Reduced motion" hint="Minimise transitions and chart animation." checked={reducedMotion} onChange={setReducedMotion} />
              </div>
            </Panel>
          </section>

          <section id="trading" className="scroll-mt-24">
            <Panel title="Trading defaults" eyebrow="Order ticket">
              <div className="space-y-4">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
                  <div className="min-w-0">
                    <div className="text-sm">Default quantity</div>
                    <div className="text-xs text-muted-foreground">Pre-filled on the trade desk ticket.</div>
                  </div>
                  <Input value={defaultQty} onChange={(e) => setDefaultQty(e.target.value)} inputMode="numeric" className="w-24 text-center tabular" />
                </div>
                <Toggle label="Confirm before filling" hint="Show a review step before a virtual order is placed." checked={confirmOrders} onChange={setConfirmOrders} />
              </div>
            </Panel>
          </section>

          <section id="notifications" className="scroll-mt-24">
            <Panel title="Notifications" eyebrow="Alerts and summaries">
              <div className="space-y-4">
                <Toggle label="Alert emails" hint="Send a summary when an alert triggers." checked={emailAlerts} onChange={setEmailAlerts} />
                <Toggle label="Morning briefing" hint="A pre-open digest of scores and overnight moves." checked={digest} onChange={setDigest} />
              </div>
            </Panel>
          </section>

          <section id="account" className="scroll-mt-24">
            <Panel title="Virtual account" eyebrow="Danger zone">
              <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
                Resetting restores ₹10,00,000 of virtual cash, clears positions, orders and alerts, and returns the demo
                watchlist to its defaults. Nothing here affects real money.
              </p>
              <button
                onClick={() => { reset(); toast.success("Virtual account reset."); }}
                className="mt-4 rounded-xl border border-negative/30 bg-negative/10 px-4 py-2.5 text-sm font-medium text-negative transition-colors hover:bg-negative/20"
              >
                Reset virtual account
              </button>
            </Panel>
          </section>
        </div>
      </div>
    </AppShell>
  );
}

function Toggle({ label, hint, checked, onChange }: { label: string; hint: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4">
      <span className="min-w-0">
        <span className="block text-sm">{label}</span>
        <span className="block text-xs text-muted-foreground">{hint}</span>
      </span>
      <Switch checked={checked} onCheckedChange={onChange} />
    </label>
  );
}
