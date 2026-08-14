import { Reveal } from "@/components/viz/Reveal";
import { CountUp } from "@/components/viz/CountUp";

const stats = [
  { k: "NSE & BSE names tracked", to: 240, prefix: "", suffix: "+" },
  { k: "Indicators computed", to: 18, prefix: "", suffix: "" },
  { k: "Signal refresh", to: 3, prefix: "", suffix: " min" },
  { k: "Virtual capital per desk", to: 10, prefix: "₹", suffix: "L" },
];

export function StatsBand() {
  return (
    <section className="px-5 py-20">
      <div className="mx-auto grid max-w-6xl gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={s.k} delay={i * 0.08}>
            <div className="panel panel-hover h-full rounded-2xl p-6">
              <div className="font-display text-[clamp(1.9rem,3.4vw,2.6rem)] leading-none text-gradient">
                <CountUp to={s.to} prefix={s.prefix ?? ""} suffix={s.suffix} />
              </div>
              <div className="mt-3 text-xs uppercase tracking-[0.16em] text-muted-foreground">{s.k}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
