export type Symbol = {
  symbol: string;
  name: string;
  sector: string;
  price: number;
  change: number;
  changePct: number;
  volume: number;
  marketCap: number;
  pe: number;
  quantScore: number;
  direction: "up" | "down";
  probability: number;
  confidence: number;
  sentiment: { positive: number; neutral: number; negative: number };
  rsi: number;
  macd: number;
  atr: number;
};

function rand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const base: Array<[string, string, string, number, number, number, number]> = [
  ["RELIANCE", "Reliance Industries", "Energy", 2914.5, 1.24, 8_940_000, 24.1],
  ["TCS", "Tata Consultancy Services", "IT", 4128.9, -0.62, 2_310_000, 30.4],
  ["HDFCBANK", "HDFC Bank", "Financials", 1687.35, 0.88, 11_420_000, 19.2],
  ["INFY", "Infosys", "IT", 1622.1, 1.91, 6_150_000, 27.6],
  ["ICICIBANK", "ICICI Bank", "Financials", 1189.7, 0.34, 9_870_000, 18.4],
  ["BHARTIARTL", "Bharti Airtel", "Telecom", 1456.2, -1.12, 4_020_000, 62.7],
  ["ITC", "ITC Limited", "FMCG", 438.6, 0.21, 13_500_000, 26.3],
  ["LT", "Larsen & Toubro", "Infrastructure", 3611.4, 2.34, 1_980_000, 35.8],
  ["SBIN", "State Bank of India", "Financials", 824.15, -0.47, 15_600_000, 11.6],
  ["TATAMOTORS", "Tata Motors", "Auto", 978.3, 3.06, 18_900_000, 14.9],
  ["ASIANPAINT", "Asian Paints", "FMCG", 2871.05, -1.84, 1_120_000, 52.1],
  ["SUNPHARMA", "Sun Pharmaceutical", "Pharma", 1743.8, 0.95, 2_640_000, 38.2],
];

export const SYMBOLS: Symbol[] = base.map(([symbol, name, sector, price, changePct, volume, pe], i) => {
  const r = rand(i * 37 + 11);
  const score = Math.round(38 + r() * 56);
  return {
    symbol,
    name,
    sector,
    price,
    change: +(price * (changePct / 100)).toFixed(2),
    changePct,
    volume,
    marketCap: Math.round(price * (r() * 900 + 200)),
    pe,
    quantScore: score,
    direction: score >= 55 ? "up" : "down",
    probability: Math.round(52 + r() * 26),
    confidence: Math.round(48 + r() * 44),
    sentiment: (() => {
      const p = Math.round(25 + r() * 45);
      const n = Math.round(10 + r() * 25);
      return { positive: p, neutral: Math.max(0, 100 - p - n), negative: n };
    })(),
    rsi: Math.round(30 + r() * 45),
    macd: +(r() * 6 - 3).toFixed(2),
    atr: +(price * 0.018).toFixed(2),
  };
});

export const INDICES = [
  { symbol: "NIFTY 50", value: 24_612.35, changePct: 0.62 },
  { symbol: "BANK NIFTY", value: 52_184.9, changePct: 0.94 },
  { symbol: "SENSEX", value: 80_745.2, changePct: 0.48 },
  { symbol: "INDIA VIX", value: 13.42, changePct: -2.31 },
];

export function getSymbol(s: string) {
  return SYMBOLS.find((x) => x.symbol === s.toUpperCase());
}

export type Candle = { t: string; close: number; sma: number; ema: number; volume: number };

export function series(symbol: string, points = 90): Candle[] {
  const sym = getSymbol(symbol) ?? SYMBOLS[0];
  const r = rand(symbol.length * 97 + points);
  const out: Candle[] = [];
  let price = sym.price * 0.86;
  const closes: number[] = [];
  for (let i = 0; i < points; i++) {
    price = price * (1 + (r() - 0.47) * 0.022);
    closes.push(price);
    const win = closes.slice(-14);
    const sma = win.reduce((a, b) => a + b, 0) / win.length;
    const d = new Date();
    d.setDate(d.getDate() - (points - i));
    out.push({
      t: d.toISOString().slice(5, 10),
      close: +price.toFixed(2),
      sma: +sma.toFixed(2),
      ema: +(sma * 1.004).toFixed(2),
      volume: Math.round(sym.volume * (0.5 + r())),
    });
  }
  const factor = sym.price / out[out.length - 1].close;
  return out.map((c) => ({ ...c, close: +(c.close * factor).toFixed(2), sma: +(c.sma * factor).toFixed(2), ema: +(c.ema * factor).toFixed(2) }));
}

export const TIMEFRAMES = ["1D", "1W", "1M", "3M", "1Y", "MAX"] as const;
export type Timeframe = (typeof TIMEFRAMES)[number];
export const TF_POINTS: Record<Timeframe, number> = { "1D": 26, "1W": 35, "1M": 44, "3M": 66, "1Y": 90, MAX: 120 };

export const NEWS = [
  { title: "Index heavyweights lift benchmarks in late-session buying", source: "Market Wire", tone: "positive" as const, time: "18m ago" },
  { title: "IT majors guide cautiously on discretionary spend recovery", source: "Business Daily", tone: "neutral" as const, time: "52m ago" },
  { title: "Crude uptick pressures oil marketing margins", source: "Commodity Desk", tone: "negative" as const, time: "1h ago" },
  { title: "Domestic institutions extend buying streak to nine sessions", source: "Flow Tracker", tone: "positive" as const, time: "2h ago" },
  { title: "Rate path unchanged; policy tone stays neutral", source: "Policy Watch", tone: "neutral" as const, time: "3h ago" },
];

export const SCORE_FACTORS = [
  { key: "Technical", weight: 25 },
  { key: "Model", weight: 25 },
  { key: "Sentiment", weight: 15 },
  { key: "Momentum", weight: 15 },
  { key: "Volume", weight: 10 },
  { key: "Fundamental", weight: 10 },
];

export function factorBreakdown(sym: Symbol) {
  const r = rand(sym.symbol.length * 13 + Math.round(sym.price));
  return SCORE_FACTORS.map((f) => ({ ...f, value: Math.round(Math.min(98, Math.max(12, sym.quantScore + (r() - 0.5) * 34))) }));
}

export const inr = (n: number, d = 2) =>
  "₹" + n.toLocaleString("en-IN", { minimumFractionDigits: d, maximumFractionDigits: d });
export const pct = (n: number) => `${n > 0 ? "+" : ""}${n.toFixed(2)}%`;
export const compact = (n: number) => new Intl.NumberFormat("en-IN", { notation: "compact", maximumFractionDigits: 1 }).format(n);
