import { useEffect, useState } from "react";
import { INDICES } from "@/lib/market-data";
import { AnimatedNumber } from "@/components/viz/AnimatedNumber";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

export function MarketStrip() {
  const [data, setData] = useState(INDICES);
  const [stamp, setStamp] = useState("");

  useEffect(() => {
    const tick = () => {
      setData((d) =>
        d.map((i) => {
          const drift = (Math.random() - 0.5) * (i.value * 0.0006);
          return { ...i, value: +(i.value + drift).toFixed(2), changePct: +(i.changePct + drift / 400).toFixed(2) };
        }),
      );
      setStamp(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    };
    tick();
    const id = setInterval(tick, 3200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="panel overflow-hidden">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <span className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="relative flex size-1.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-mint opacity-70" />
            <span className="relative inline-flex size-1.5 rounded-full bg-mint" />
          </span>
          Market snapshot · simulated demo feed
        </span>
        <span className="text-xs tabular text-muted-foreground">{stamp}</span>
      </div>
      <div className="grid grid-cols-2 divide-x divide-y divide-border md:grid-cols-4 md:divide-y-0">
        {data.map((i) => {
          const up = i.changePct >= 0;
          return (
            <div key={i.symbol} className="px-4 py-3.5">
              <div className="text-[11px] uppercase tracking-widest text-muted-foreground">{i.symbol}</div>
              <div className="mt-1 font-display text-lg font-semibold">
                <AnimatedNumber value={i.value} />
              </div>
              <div className={`mt-0.5 flex items-center gap-1 text-xs ${up ? "text-positive" : "text-negative"}`}>
                {up ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
                {up ? "+" : ""}
                {i.changePct.toFixed(2)}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
