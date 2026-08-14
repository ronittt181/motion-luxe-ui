import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { AuthLayout, Field } from "@/components/marketing/AuthLayout";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useStore } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create your Quant Plus account" },
      { name: "description", content: "Create a Quant Plus account to analyze Indian markets and trade virtually with AI-backed signals." },
      { property: "og:title", content: "Create your Quant Plus account" },
      { property: "og:description", content: "Start analyzing Indian markets with AI-backed signals and virtual trading." },
    ],
  }),
  component: SignupPage,
});

function strength(p: string) {
  let s = 0;
  if (p.length >= 8) s++;
  if (/[A-Z]/.test(p)) s++;
  if (/[0-9]/.test(p)) s++;
  if (/[^A-Za-z0-9]/.test(p)) s++;
  return s;
}
const labels = ["Too short", "Weak", "Fair", "Strong", "Excellent"];

function SignupPage() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [agree, setAgree] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useStore();
  const s = useMemo(() => strength(form.password), [form.password]);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (form.name.trim().length < 2) return setError("Tell us your name so we can personalise the workspace.");
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError("That email doesn't look right.");
    if (s < 2) return setError("Choose a stronger password — mix length, case and numbers.");
    if (form.password !== form.confirm) return setError("Passwords don't match.");
    if (!agree) return setError("Please acknowledge the educational disclaimer to continue.");
    setBusy(true);
    await new Promise((r) => setTimeout(r, 900));
    login({ name: form.name, email: form.email });
    toast.success("Account created. Welcome to Quant Plus.");
    navigate({ to: "/app" });
  };

  return (
    <AuthLayout
      title="Create account"
      subtitle="Set up your workspace in under a minute."
      footer={<>Already registered? <Link to="/login" className="text-mint hover:underline">Log in</Link></>}
    >
      <form onSubmit={submit} className="space-y-4">
        <Field label="Full name"><Input value={form.name} onChange={set("name")} placeholder="Ananya Sharma" /></Field>
        <Field label="Email"><Input value={form.email} onChange={set("email")} type="email" placeholder="you@example.com" /></Field>
        <Field label="Password"><Input value={form.password} onChange={set("password")} type="password" placeholder="••••••••" /></Field>
        {form.password && (
          <div className="space-y-1.5">
            <div className="flex gap-1">
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: i < s ? 1 : 0.18 }}
                  className={`h-1 flex-1 rounded-full ${s <= 1 ? "bg-negative" : s === 2 ? "bg-warning" : "bg-positive"}`}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">{labels[s]}</p>
          </div>
        )}
        <Field label="Confirm password"><Input value={form.confirm} onChange={set("confirm")} type="password" placeholder="••••••••" /></Field>
        <label className="flex items-start gap-2.5 text-xs leading-relaxed text-muted-foreground">
          <Checkbox checked={agree} onCheckedChange={(v) => setAgree(Boolean(v))} className="mt-0.5" />
          I understand Quant Plus insights are informational and all trading inside the product is virtual.
        </label>
        {error && <p className="rounded-lg border border-negative/30 bg-negative/10 px-3 py-2 text-xs text-negative">{error}</p>}
        <button disabled={busy} className="btn-primary btn-sheen w-full disabled:opacity-60">
          {busy && <Loader2 className="size-4 animate-spin" />} {busy ? "Creating account…" : "Create account"}
        </button>
      </form>
    </AuthLayout>
  );
}
