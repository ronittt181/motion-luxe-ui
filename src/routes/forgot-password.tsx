import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Loader2, MailCheck } from "lucide-react";
import { AuthLayout, Field } from "@/components/marketing/AuthLayout";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset your password — Quant Plus" },
      { name: "description", content: "Request a password reset link for your Quant Plus workspace." },
      { property: "og:title", content: "Reset your password — Quant Plus" },
      { property: "og:description", content: "Request a secure reset link for your Quant Plus account." },
    ],
  }),
  component: Forgot,
});

function Forgot() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Enter the email you registered with.");
    setBusy(true);
    await new Promise((r) => setTimeout(r, 300));
    setBusy(false);
    setSent(true);
  };

  return (
    <AuthLayout
      title="Reset password"
      subtitle="We'll email you a secure link to set a new password."
      footer={<>Remembered it? <Link to="/login" className="text-mint hover:underline">Back to log in</Link></>}
    >
      <AnimatePresence mode="wait">
        {sent ? (
          <motion.div key="sent" initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="panel p-6 text-center">
            <MailCheck className="mx-auto size-8 text-mint" />
            <p className="mt-4 text-sm">Reset link sent to <span className="text-foreground">{email}</span>.</p>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
              The link expires in 30 minutes. Check your spam folder if it hasn't arrived in a few minutes.
            </p>
          </motion.div>
        ) : (
          <motion.form key="form" onSubmit={submit} className="space-y-4" exit={{ opacity: 0 }}>
            <Field label="Email"><Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@example.com" /></Field>
            {error && <p className="rounded-lg border border-negative/30 bg-negative/10 px-3 py-2 text-xs text-negative">{error}</p>}
            <button disabled={busy} className="btn-primary btn-sheen w-full disabled:opacity-60">
              {busy && <Loader2 className="size-4 animate-spin" />} Send reset link
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </AuthLayout>
  );
}
