import { AnimatePresence, motion } from "motion/react";
import { Area, AreaChart, CartesianGrid, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { Candle } from "@/lib/market-data";

export function PriceChart({
  data,
  positive = true,
  height = 320,
  overlays = { sma: true, ema: false },
  chartKey,
}: {
  data: Candle[];
  positive?: boolean;
  height?: number;
  overlays?: { sma?: boolean; ema?: boolean };
  chartKey?: string;
}) {
  const stroke = positive ? "var(--positive)" : "var(--negative)";
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={chartKey}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35 }}
        style={{ height }}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="fillArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={stroke} stopOpacity={0.28} />
                <stop offset="100%" stopColor={stroke} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="var(--border)" vertical={false} />
            <XAxis dataKey="t" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} tickLine={false} axisLine={false} minTickGap={28} />
            <YAxis
              domain={["auto", "auto"]}
              tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              width={58}
            />
            <Tooltip
              contentStyle={{
                background: "var(--popover)",
                border: "1px solid var(--border-active)",
                borderRadius: 12,
                fontSize: 12,
              }}
              labelStyle={{ color: "var(--muted-foreground)" }}
            />
            <Area type="monotone" dataKey="close" stroke={stroke} strokeWidth={2} fill="url(#fillArea)" isAnimationActive />
            {overlays.sma && <Line type="monotone" dataKey="sma" stroke="var(--signal)" dot={false} strokeWidth={1.4} strokeDasharray="4 4" />}
            {overlays.ema && <Line type="monotone" dataKey="ema" stroke="var(--ai-violet)" dot={false} strokeWidth={1.4} />}
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
    </AnimatePresence>
  );
}
