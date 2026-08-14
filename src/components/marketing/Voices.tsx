import { Reveal } from "@/components/viz/Reveal";
import { Spotlight } from "@/components/viz/Spotlight";

const voices = [
  { q: "The score is useless without the why. Quant Plus is the first tool that shows me both in the same glance.", n: "Aarav Mehta", r: "Swing trader, Mumbai" },
  { q: "I run a screen, open the name, read the sentiment, and paper-trade it — all before the market opens.", n: "Ishita Rao", r: "Analyst, Bengaluru" },
  { q: "The virtual desk changed how I test theses. Nothing goes live until the log says it worked.", n: "Karan Sethi", r: "Independent investor" },
];

export function Voices() {
  return (
    <section className="px-5 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-mint">Voices</div>
        <h2 className="mt-4 max-w-2xl font-display text-[clamp(1.7rem,3.6vw,2.6rem)] leading-[1.06]">
          Built for people who ask <span className="font-serif-accent text-gradient">why</span>.
        </h2>
        <div className="mt-12 grid gap-3 md:grid-cols-3">
          {voices.map((v, i) => (
            <Reveal key={v.n} delay={i * 0.09} from={i === 1 ? "down" : "up"}>
              <Spotlight className="panel panel-hover h-full rounded-2xl">
                <figure className="flex h-full flex-col p-7">
                  <div className="font-serif-accent text-3xl leading-none text-mint/70">&ldquo;</div>
                  <blockquote className="mt-3 text-[0.95rem] leading-relaxed">{v.q}</blockquote>
                  <figcaption className="mt-auto pt-8">
                    <div className="text-sm">{v.n}</div>
                    <div className="text-xs text-muted-foreground">{v.r}</div>
                  </figcaption>
                </figure>
              </Spotlight>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
