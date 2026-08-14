import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { AuthLayout, Field } from "@/components/marketing/AuthLayout";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useStore } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Log in — Quant Plus" },
      { name: "description", content: "Log in to your Quant Plus workspace for market intelligence and virtual trading." },
      { property: "og:title", content: "Log in — Quant Plus" },
      { property: "og:description", content: "Access your Quant Plus market intelligence workspace." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useStore();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Enter a valid email address.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    setBusy(true);
    await new Promise((r) => setTimeout(r, 850));
    login({ name: email.split("@")[0] ?? "Analyst", email });
    toast.success("Welcome back to Quant Plus.");
    navigate({ to: "/app" });
  };

  return (
    <AuthLayout
      title="Log in"
      subtitle="Pick up where you left off in your workspace."
      footer={<>New here? <Link to="/signup" className="text-mint hover:underline">Create an account</Link></>}
    >
      <form onSubmit={submit} className="space-y-4">
        <Field label="Email">
          <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@example.com" autoComplete="email" />
        </Field>
        <Field label="Password">
          <div className="relative">
            <Input value={password} onChange={(e) => setPassword(e.target.value)} type={show ? "text" : "password"} placeholder="••••••••" autoComplete="current-password" />
            <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label="Toggle password visibility">
              {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </Field>
        {error && <p className="rounded-lg border border-negative/30 bg-negative/10 px-3 py-2 text-xs text-negative">{error}</p>}
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-muted-foreground">
            <Checkbox defaultChecked /> Keep me signed in
          </label>
          <Link to="/forgot-password" className="text-mint hover:underline">Forgot password?</Link>
        </div>
        <button disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.01] disabled:opacity-60">
          {busy && <Loader2 className="size-4 animate-spin" />} {busy ? "Signing in…" : "Log in"}
        </button>
        <p className="text-center text-xs text-muted-foreground">Demo authentication — no real credentials are stored.</p>
      </form>
    </AuthLayout>
  );
}
