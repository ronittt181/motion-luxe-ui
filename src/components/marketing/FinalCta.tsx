import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight } from "lucide-react";
import { Magnetic } from "@/components/viz/Magnetic";
import { SplitText } from "@/components/viz/SplitText";

export function FinalCta() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [70, -70]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.96, 1]);

  return (
    <section ref={ref} className="relative overflow-hidden px-5 py-32">
      <motion.div style={{ y }} className="pointer-events-none absolute inset-0" >
        <div
          className="aurora absolute left-1/2 top-1/3 size-[36rem] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
          style={{ background: "conic-gradient(from 140deg, color-mix(in oklab, var(--mint) 55%, transparent), color-mix(in oklab, var(--ai-violet) 45%, transparent), transparent 70%)" }}
        />
      </motion.div>
      <div className="pointer-events-none absolute inset-0 grid-lines opacity-30 [mask-image:radial-gradient(60%_60%_at_50%_50%,black,transparent)]" />

      <motion.div style={{ scale }} className="relative mx-auto max-w-3xl text-center">
        <SplitText
          as="h2"
          text="Start reading the market like a quant."
          className="block font-display text-[clamp(2.1rem,5.5vw,4rem)] leading-[1.02]"
        />
        <p className="mx-auto mt-6 max-w-lg leading-relaxed text-muted-foreground">
          Open the workspace, pick a name, and see every lens behind the score. Virtual capital is already waiting.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Magnetic>
            <Link to="/app" className="btn-sheen group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground">
              Launch Quant Plus <ArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
            </Link>
          </Magnetic>
          <Link to="/how-it-works" className="glass inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm">
            See how it works
          </Link>
        </div>
        <p className="mt-8 text-xs text-muted-foreground">Informational only · Not investment advice · Virtual trading</p>
      </motion.div>
    </section>
  );
}
