import { SYMBOLS, getSymbol, type Symbol } from "./market-data";

export type DataStatus = "live" | "delayed" | "simulated";
export type MarketBias = "strong_bullish" | "bullish" | "neutral" | "bearish" | "strong_bearish";
export type SignalState = "positive" | "neutral" | "negative" | "mixed";

export interface MarketBriefing {
  bias: MarketBias;
  confidence: number;
  summary: string;
  keyDrivers: string[];
  leadingSectors: string[];
  laggingSectors: string[];
  strongestSignal: string;
  primaryRisk: string;
  updatedAt: string;
  dataStatus: DataStatus;
}

export type SignalCategory =
  | "momentum" | "breadth" | "volatility" | "sentiment"
  | "institutional_activity" | "sector_rotation" | "volume" | "anomaly";

export interface IntelligenceSignal {
  id: string;
  category: SignalCategory;
  label: string;
  state: SignalState;
  score: number;
  change: number;
  metric: string;
  explanation: string;
  affectedSectors: string[];
  affectedSymbols: string[];
  updatedAt: string;
}

export interface MarketChange {
  id: string;
  scope: "market" | "portfolio" | "watchlist" | "alert";
  title: string;
  description: string;
  previousValue?: string | number;
  currentValue?: string | number;
  symbol?: string;
  occurredAt: string;
  minutesAgo: number;
  confidence?: number;
  impact: "positive" | "neutral" | "negative";
}

export interface PersonalizedInsight {
  id: string;
  title: string;
  explanation: string;
  impact: "positive" | "neutral" | "negative";
  relatedRoute: "/app/portfolio" | "/app/watchlist" | "/app/alerts";
  relatedSymbol?: string;
  routeLabel: string;
}

export interface IntelligenceCard {
  id: string;
  type: "opportunity" | "risk" | "anomaly";
  symbol?: string;
  title: string;
  subtitle: string;
  explanation: string;
  evidence: Array<{ label: string; value: string }>;
  confidence: number;
  updatedAt: string;
}

export interface CauseStep {
  id: string;
  label: string;
  polarity: "supporting" | "opposing";
  metric: string;
  previous: string;
  current: string;
  at: string;
  related: string[];
  interpretation: string;
}

export interface ReplayMoment {
  id: string;
  time: string;
  headline: string;
  nifty: number;
  breadth: string;
  sentiment: string;
  volatility: string;
  leadingSector: string;
  anomaly: string;
  portfolioImpact: string;
}

export const DATA_STATUS: DataStatus = "simulated";

const stamp = (d = new Date()) =>
  d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });

export function nowStamp() {
  return stamp();
}

export function marketSession(d = new Date()): { label: string; tone: "positive" | "neutral" | "negative" } {
  const day = d.getDay();
  if (day === 0 || day === 6) return { label: "Market Closed · Weekend", tone: "neutral" };
  const mins = d.getHours() * 60 + d.getMinutes();
  if (mins < 9 * 60) return { label: "Pre-market", tone: "neutral" };
  if (mins < 9 * 60 + 15) return { label: "Pre-open auction", tone: "neutral" };
  if (mins <= 15 * 60 + 30) return { label: "Market Open", tone: "positive" };
  return { label: "Market Closed", tone: "neutral" };
}

export function greeting(d = new Date()) {
  const h = d.getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export const BIAS_LABEL: Record<MarketBias, string> = {
  strong_bullish: "Strong Bullish",
  bullish: "Moderately Bullish",
  neutral: "Neutral",
  bearish: "Moderately Bearish",
  strong_bearish: "Strong Bearish",
};

export type BriefingMode = "quick" | "detailed" | "since_open" | "since_visit" | "portfolio";

export const BRIEFING_MODES: Array<{ id: BriefingMode; label: string }> = [
  { id: "quick", label: "Quick Summary" },
  { id: "detailed", label: "Detailed Briefing" },
  { id: "since_open", label: "Since Market Open" },
  { id: "since_visit", label: "Since Last Visit" },
  { id: "portfolio", label: "Portfolio Impact" },
];

const advancing = SYMBOLS.filter((s) => s.changePct >= 0).length;

export function getBriefing(mode: BriefingMode, ctx?: { holdings: string[]; watchlist: string[] }): MarketBriefing {
  const base: MarketBriefing = {
    bias: "bullish",
    confidence: 74,
    summary:
      "Indian markets are moderately bullish. Banking and energy are leading, while IT remains under pressure. Market breadth is positive, with 34 of 50 NIFTY stocks advancing. Volatility has declined by 4.2%, suggesting improving risk appetite.",
    keyDrivers: [
      "Breadth positive · 34/50 NIFTY constituents advancing",
      "BANK NIFTY +0.94% on 1.8× average volume",
      "INDIA VIX −2.31%, risk appetite improving",
      "IT relative strength −1.2% versus NIFTY",
    ],
    leadingSectors: ["Financials", "Energy", "Auto"],
    laggingSectors: ["IT", "FMCG"],
    strongestSignal: "Unusual buying volume in large-cap banking stocks",
    primaryRisk: "Momentum is decelerating into the afternoon session while volume confirmation stays limited",
    updatedAt: stamp(),
    dataStatus: DATA_STATUS,
  };
  if (mode === "detailed")
    return {
      ...base,
      summary:
        "Indian markets are moderately bullish with a broad, financials-led advance. BANK NIFTY cleared its intraday resistance on 1.8× average volume and is dragging the wider index higher; energy is a secondary contributor. IT stays the clearest drag as relative strength slips −1.2% with 3 advancing against 7 declining names. Breadth is constructive at " +
        `${advancing}/${SYMBOLS.length} tracked large-caps advancing, and INDIA VIX easing 2.31% points to improving risk appetite. Momentum, however, is flattening versus the opening hour, so the trend is positive but not accelerating.`,
    };
  if (mode === "since_open")
    return {
      ...base,
      summary:
        "Since the 09:15 open the market has improved steadily. The index started mildly positive, banking volume accelerated by 09:48, BANK NIFTY crossed resistance at 10:12, and breadth improved at 10:36. The single deterioration was IT sentiment weakening after 11:05.",
      keyDrivers: [
        "09:48 · Banking volume accelerated to 1.6× average",
        "10:12 · BANK NIFTY crossed intraday resistance",
        "10:36 · Advance/decline improved to 34/50",
        "11:05 · IT sentiment turned negative",
      ],
    };
  if (mode === "since_visit")
    return {
      ...base,
      summary:
        "Since your last visit the market bias has held bullish while the composition changed. Financials extended leadership, RELIANCE was upgraded from a Quant Score of 68 to 81 on a sentiment and volume shift, and SBIN printed unusual activity at 2.8× its 20-day average volume. IT weakened further.",
      keyDrivers: [
        "RELIANCE Quant Score 68 → 81",
        "SBIN volume 2.8× 20-day average",
        "IT sector sentiment: Neutral → Deteriorating",
      ],
    };
  const holds = ctx?.holdings ?? [];
  return {
    ...base,
    summary: holds.length
      ? `Today's move is net positive for your virtual portfolio. Financial and energy strength supports ${holds
          .slice(0, 3)
          .join(", ")}, while IT weakness is the main drag. Your portfolio's realised volatility is running below NIFTY's, so the position mix is currently defensive relative to the index.`
      : "You do not hold any virtual positions yet, so there is no portfolio impact to report. Add symbols to your watchlist or place a virtual trade and this mode will explain how each market move affects you.",
  };
}

export const SIGNALS: IntelligenceSignal[] = [
  { id: "momentum", category: "momentum", label: "Momentum", state: "mixed", score: 58, change: -6.4, metric: "Index momentum score 58/100", explanation: "Momentum expanded in the first hour and has since flattened. Advancing names are still leading, but the rate of change has slowed, which usually precedes consolidation rather than reversal.", affectedSectors: ["Financials", "Auto"], affectedSymbols: ["HDFCBANK", "TATAMOTORS"], updatedAt: "10:42" },
  { id: "breadth", category: "breadth", label: "Market Breadth", state: "positive", score: 71, change: 8.2, metric: "34 advancing / 16 declining", explanation: "Participation is broad rather than concentrated in a few heavyweights, which makes the current advance more durable than a narrow index-led move.", affectedSectors: ["Financials", "Energy", "Auto"], affectedSymbols: ["ICICIBANK", "SBIN", "RELIANCE"], updatedAt: "10:41" },
  { id: "volatility", category: "volatility", label: "Volatility", state: "positive", score: 66, change: -4.2, metric: "INDIA VIX 13.42 (−2.31%)", explanation: "Implied volatility is compressing while the index rises — a combination that typically reflects improving risk appetite rather than complacency at these absolute levels.", affectedSectors: ["Index"], affectedSymbols: [], updatedAt: "10:40" },
  { id: "sentiment", category: "sentiment", label: "News Sentiment", state: "positive", score: 64, change: 5.1, metric: "Net sentiment +0.31", explanation: "Sentiment on banking and energy headlines is net positive across tracked sources. IT coverage remains cautious on discretionary spending.", affectedSectors: ["Financials", "IT"], affectedSymbols: ["HDFCBANK", "INFY"], updatedAt: "10:39" },
  { id: "institutional_activity", category: "institutional_activity", label: "Institutional Activity", state: "positive", score: 69, change: 3.7, metric: "DII net buying, 9th session", explanation: "Domestic institutions have extended their buying streak. Large-cap banking absorbs most of the flow, consistent with the volume signature seen intraday.", affectedSectors: ["Financials"], affectedSymbols: ["HDFCBANK", "ICICIBANK", "SBIN"], updatedAt: "10:38" },
  { id: "sector_rotation", category: "sector_rotation", label: "Sector Rotation", state: "mixed", score: 55, change: 1.9, metric: "Rotation out of IT into Financials", explanation: "Capital is rotating from defensives and IT into financials and energy. Rotation is orderly, not defensive — but it narrows the set of sectors carrying the index.", affectedSectors: ["IT", "Financials", "Energy"], affectedSymbols: ["TCS", "INFY", "RELIANCE"], updatedAt: "10:37" },
  { id: "volume", category: "volume", label: "Volume", state: "mixed", score: 52, change: -2.1, metric: "Index volume 0.94× 20-day average", explanation: "Banking volume is well above average, but index-wide turnover is slightly below normal. Confirmation is therefore sector-specific rather than market-wide.", affectedSectors: ["Financials"], affectedSymbols: ["SBIN", "HDFCBANK"], updatedAt: "10:36" },
  { id: "anomaly", category: "anomaly", label: "Market Anomalies", state: "negative", score: 41, change: 12.5, metric: "2 active anomalies", explanation: "SBIN is trading at 2.8× its 20-day average volume with a move well beyond expected volatility. ASIANPAINT shows a divergence between price and sentiment.", affectedSectors: ["Financials", "FMCG"], affectedSymbols: ["SBIN", "ASIANPAINT"], updatedAt: "10:35" },
];

export const CAUSE_CHAIN: CauseStep[] = [
  { id: "c1", label: "Positive banking sentiment", polarity: "supporting", metric: "Banking net sentiment", previous: "+0.08", current: "+0.34", at: "09:32", related: ["HDFCBANK", "ICICIBANK"], interpretation: "Headlines on credit growth and asset quality turned constructive before the volume shift appeared." },
  { id: "c2", label: "Higher banking volume", polarity: "supporting", metric: "BANK NIFTY volume vs 20-day avg", previous: "1.0×", current: "1.8×", at: "09:48", related: ["SBIN", "HDFCBANK"], interpretation: "Volume expanded ahead of the price breakout, which is the ordering you want to see for a genuine move." },
  { id: "c3", label: "BANK NIFTY breakout", polarity: "supporting", metric: "BANK NIFTY", previous: "51,690", current: "52,184.90", at: "10:12", related: ["ICICIBANK", "SBIN"], interpretation: "The index cleared its intraday resistance band and has held above it since." },
  { id: "c4", label: "Improved market breadth", polarity: "supporting", metric: "Advance / decline", previous: "26 / 24", current: "34 / 16", at: "10:36", related: ["RELIANCE", "TATAMOTORS"], interpretation: "The advance widened beyond financials, reducing the chance this is a single-sector distortion." },
  { id: "c5", label: "Momentum is weakening", polarity: "opposing", metric: "Momentum score", previous: "64", current: "58", at: "11:14", related: ["TCS", "INFY"], interpretation: "Rate of change has slowed since the opening hour, so the trend is intact but no longer accelerating." },
  { id: "c6", label: "Volume confirmation is limited", polarity: "opposing", metric: "Index volume vs 20-day avg", previous: "1.06×", current: "0.94×", at: "11:22", related: ["ITC", "ASIANPAINT"], interpretation: "Away from banking, turnover is below normal, so market-wide conviction is only partial." },
];

export const CAUSE_CONCLUSION =
  "The broader trend is positive and breadth supports it, but weakening momentum and thin market-wide volume raise short-term pullback risk. Treat the bias as constructive, not confirmed.";

export const MARKET_CHANGES: MarketChange[] = [
  { id: "m1", scope: "watchlist", symbol: "RELIANCE", title: "RELIANCE · Quant Score upgraded", description: "News sentiment turned positive. Volume increased to 2.4× its 20-day average. Price moved above the EMA 50.", previousValue: 68, currentValue: 81, occurredAt: "10:24", minutesAgo: 18, confidence: 76, impact: "positive" },
  { id: "m2", scope: "market", title: "Sector leadership changed", description: "Financials overtook Energy as the strongest sector on relative strength and flow.", previousValue: "Energy", currentValue: "Financials", occurredAt: "10:12", minutesAgo: 30, confidence: 71, impact: "positive" },
  { id: "m3", scope: "market", symbol: "SBIN", title: "SBIN · Unusual volume detected", description: "Turnover reached 2.8× the 20-day average with a +2.3% move against 1.1% expected volatility.", previousValue: "1.0×", currentValue: "2.8×", occurredAt: "10:05", minutesAgo: 37, confidence: 87, impact: "neutral" },
  { id: "m4", scope: "alert", symbol: "INFY", title: "INFY · Price alert approaching", description: "Price is within 1.4% of your alert threshold and sector sentiment is deteriorating.", previousValue: "₹1,598.20", currentValue: "₹1,622.10", occurredAt: "09:58", minutesAgo: 44, confidence: 64, impact: "negative" },
  { id: "m5", scope: "portfolio", title: "Portfolio risk decreased", description: "Realised portfolio volatility fell below NIFTY volatility as banking exposure stabilised.", previousValue: "1.28%", currentValue: "1.02%", occurredAt: "09:51", minutesAgo: 51, confidence: 69, impact: "positive" },
  { id: "m6", scope: "market", symbol: "TCS", title: "TCS · Technical breakdown", description: "Price lost the EMA 20 with declining participation across IT constituents.", previousValue: "₹4,154.60", currentValue: "₹4,128.90", occurredAt: "09:44", minutesAgo: 58, confidence: 72, impact: "negative" },
  { id: "m7", scope: "watchlist", symbol: "TATAMOTORS", title: "TATAMOTORS · Sentiment improved", description: "Sentiment moved from Neutral to Positive on volume expansion.", previousValue: "Neutral", currentValue: "Positive", occurredAt: "09:36", minutesAgo: 66, confidence: 66, impact: "positive" },
];

export function personalizedInsights(ctx: { holdings: string[]; watchlist: string[]; alerts: number; portfolioShareFin: number }): PersonalizedInsight[] {
  const out: PersonalizedInsight[] = [];
  if (ctx.holdings.length) {
    out.push({
      id: "p1",
      title: `Banking strength positively affects ${ctx.portfolioShareFin}% of your virtual portfolio`,
      explanation: "Financials are the strongest sector today and carry the largest weight in your virtual holdings.",
      impact: "positive",
      relatedRoute: "/app/portfolio",
      routeLabel: "View portfolio",
    });
    out.push({
      id: "p4",
      title: "Your portfolio volatility is lower than NIFTY volatility today",
      explanation: "Realised volatility across your positions is 1.02% against 1.31% for the index.",
      impact: "positive",
      relatedRoute: "/app/portfolio",
      routeLabel: "View portfolio",
    });
  }
  const upgraded = ctx.watchlist.filter((s) => ["RELIANCE", "TATAMOTORS"].includes(s));
  if (upgraded.length) {
    out.push({
      id: "p2",
      title: `${upgraded.length} watchlist ${upgraded.length === 1 ? "stock" : "stocks"} received Quant Score upgrades`,
      explanation: `${upgraded.join(", ")} improved on sentiment and volume expansion in the last hour.`,
      impact: "positive",
      relatedRoute: "/app/watchlist",
      routeLabel: "View watchlist",
      relatedSymbol: upgraded[0],
    });
  }
  if (ctx.alerts > 0) {
    out.push({
      id: "p3",
      title: "INFY is approaching your price alert",
      explanation: "Price is within 1.4% of your threshold while IT sentiment deteriorates.",
      impact: "negative",
      relatedRoute: "/app/alerts",
      routeLabel: "Review alerts",
      relatedSymbol: "INFY",
    });
  }
  return out;
}

export const INTEL_CARDS: IntelligenceCard[] = [
  { id: "o1", type: "opportunity", symbol: "RELIANCE", title: "RELIANCE · Momentum strengthening", subtitle: "Developing setup", explanation: "Price momentum, sentiment and volume are reinforcing one another, and the move is happening with the sector rather than against it.", evidence: [{ label: "Quant Score", value: "81/100" }, { label: "Volume", value: "2.4× average" }, { label: "Sentiment", value: "Positive" }, { label: "AI direction", value: "Bullish" }], confidence: 74, updatedAt: "10:42" },
  { id: "o2", type: "opportunity", symbol: "HDFCBANK", title: "HDFCBANK · Signal strengthening", subtitle: "Sector-led participation", explanation: "Institutional flow and breadth in financials both support this name; the technical structure has not yet extended.", evidence: [{ label: "Quant Score", value: "76/100" }, { label: "Relative strength", value: "+1.4%" }, { label: "Flow", value: "DII net buying" }], confidence: 68, updatedAt: "10:40" },
  { id: "o3", type: "opportunity", symbol: "TATAMOTORS", title: "TATAMOTORS · Breadth confirmation", subtitle: "Developing setup", explanation: "Auto is the third contributing sector today and this name leads it on both price and turnover.", evidence: [{ label: "Change", value: "+3.06%" }, { label: "Volume", value: "1.7× average" }, { label: "Sentiment", value: "Improving" }], confidence: 63, updatedAt: "10:37" },
  { id: "r1", type: "risk", title: "IT SECTOR · Momentum weakening", subtitle: "Requires attention", explanation: "The sector remains above support, but participation is weakening and sentiment continues to deteriorate.", evidence: [{ label: "Relative strength", value: "−1.2%" }, { label: "Breadth", value: "3 advancing / 7 declining" }, { label: "Sentiment trend", value: "Deteriorating" }], confidence: 70, updatedAt: "10:41" },
  { id: "r2", type: "risk", title: "Index-wide volume confirmation is limited", subtitle: "Requires attention", explanation: "Turnover away from banking is below the 20-day average, so the advance rests on a narrow flow base.", evidence: [{ label: "Index volume", value: "0.94× average" }, { label: "Momentum", value: "58/100, falling" }], confidence: 66, updatedAt: "10:39" },
  { id: "r3", type: "risk", symbol: "ASIANPAINT", title: "ASIANPAINT · Price and sentiment diverging", subtitle: "Signal conflict", explanation: "Price is declining while sentiment readings stay neutral; one of the two is likely to resolve toward the other.", evidence: [{ label: "Change", value: "−1.84%" }, { label: "Sentiment", value: "Neutral" }, { label: "Quant Score", value: "44/100" }], confidence: 58, updatedAt: "10:33" },
  { id: "a1", type: "anomaly", symbol: "SBIN", title: "SBIN · Unusual activity", subtitle: "Anomaly score 87/100", explanation: "Turnover and realised move are both far outside the expected distribution for this session.", evidence: [{ label: "Volume", value: "2.8× 20-day average" }, { label: "Price movement", value: "+2.3%" }, { label: "Expected volatility", value: "1.1%" }, { label: "Anomaly score", value: "87/100" }], confidence: 87, updatedAt: "10:34" },
  { id: "a2", type: "anomaly", symbol: "LT", title: "LT · Volume spike without news", subtitle: "Anomaly score 61/100", explanation: "Turnover expanded sharply with no corresponding sentiment event in tracked sources.", evidence: [{ label: "Volume", value: "1.9× average" }, { label: "News events", value: "0 tracked" }, { label: "Anomaly score", value: "61/100" }], confidence: 61, updatedAt: "10:29" },
];

export const REPLAY: ReplayMoment[] = [
  { id: "t1", time: "09:15", headline: "Market opened mildly positive", nifty: 24_468.1, breadth: "26 advancing / 24 declining", sentiment: "Neutral", volatility: "VIX 13.74", leadingSector: "Energy", anomaly: "None", portfolioImpact: "Flat at open" },
  { id: "t2", time: "09:48", headline: "Banking volume accelerated", nifty: 24_512.4, breadth: "28 advancing / 22 declining", sentiment: "Improving", volatility: "VIX 13.66", leadingSector: "Financials", anomaly: "SBIN turnover 1.9× average", portfolioImpact: "Banking exposure turns positive" },
  { id: "t3", time: "10:12", headline: "BANK NIFTY crossed resistance", nifty: 24_559.8, breadth: "31 advancing / 19 declining", sentiment: "Positive", volatility: "VIX 13.55", leadingSector: "Financials", anomaly: "SBIN turnover 2.4× average", portfolioImpact: "Unrealised P&L improves" },
  { id: "t4", time: "10:36", headline: "Market breadth improved", nifty: 24_588.6, breadth: "34 advancing / 16 declining", sentiment: "Positive", volatility: "VIX 13.48", leadingSector: "Financials", anomaly: "SBIN turnover 2.8× average", portfolioImpact: "Broad support across holdings" },
  { id: "t5", time: "11:05", headline: "IT sentiment weakened", nifty: 24_601.2, breadth: "33 advancing / 17 declining", sentiment: "Mixed", volatility: "VIX 13.44", leadingSector: "Financials", anomaly: "ASIANPAINT price/sentiment divergence", portfolioImpact: "IT holdings drag modestly" },
  { id: "t6", time: "11:32", headline: "Advance held, momentum flattened", nifty: 24_612.35, breadth: "34 advancing / 16 declining", sentiment: "Positive", volatility: "VIX 13.42", leadingSector: "Financials", anomaly: "2 active anomalies", portfolioImpact: "Net positive, volatility below index" },
];

export interface AiAnswer {
  question: string;
  answer: string;
  metrics: Array<{ label: string; value: string }>;
  relatedSymbols: string[];
  factors: string[];
  confidence: number;
  updatedAt: string;
  dataStatus: DataStatus;
  followUps: string[];
}

export const SUGGESTED_QUESTIONS = [
  "Why is NIFTY moving today?",
  "Which sectors are gaining momentum?",
  "What changed in my portfolio?",
  "Show stocks with improving sentiment and volume.",
  "Why did RELIANCE's Quant Score increase?",
  "What are today's biggest market risks?",
  "Compare Banking and IT.",
  "Summarize the market since open.",
];

/** Typed demo adapter. Replace with a real endpoint later — responses are clearly marked simulated. */
export async function askQuantPlus(question: string, signal?: AbortSignal): Promise<AiAnswer> {
  await new Promise((res, rej) => {
    const id = setTimeout(res, 650);
    signal?.addEventListener("abort", () => { clearTimeout(id); rej(new DOMException("aborted", "AbortError")); });
  });
  if (/fail|error/i.test(question)) throw new Error("The intelligence service did not respond.");
  const q = question.toLowerCase();
  const common = { confidence: 72, updatedAt: stamp(), dataStatus: DATA_STATUS as DataStatus };
  if (q.includes("portfolio"))
    return { question, answer: "Your virtual portfolio is net positive today. Financial holdings contribute most of the gain as banking leads the market, while IT exposure is the main drag. Realised portfolio volatility is running below the index, so the current mix is defensive relative to NIFTY.", metrics: [{ label: "Portfolio volatility", value: "1.02% vs 1.31% index" }, { label: "Leading contributor", value: "HDFCBANK" }, { label: "Main drag", value: "INFY" }], relatedSymbols: ["HDFCBANK", "RELIANCE", "INFY"], factors: ["Sector exposure", "Breadth", "Realised volatility"], followUps: ["What are today's biggest market risks?", "Which sectors are gaining momentum?"], ...common };
  if (q.includes("reliance"))
    return { question, answer: "RELIANCE moved from a Quant Score of 68 to 81 because three inputs improved together: news sentiment turned positive, turnover expanded to 2.4× its 20-day average, and price reclaimed the EMA 50. When sentiment, volume and technicals align in the same direction, the composite score reweights upward rather than adding them linearly.", metrics: [{ label: "Quant Score", value: "68 → 81" }, { label: "Volume", value: "2.4× average" }, { label: "Sentiment", value: "Neutral → Positive" }], relatedSymbols: ["RELIANCE"], factors: ["Sentiment", "Volume", "Technicals"], followUps: ["Show stocks with improving sentiment and volume.", "Why is NIFTY moving today?"], ...common, confidence: 76 };
  if (q.includes("risk"))
    return { question, answer: "Two risks dominate. First, index-wide volume is 0.94× the 20-day average, so conviction outside banking is thin. Second, momentum has fallen from 64 to 58 since the opening hour while price keeps rising — a divergence that historically precedes consolidation. IT weakness is a third, sector-specific risk.", metrics: [{ label: "Index volume", value: "0.94× average" }, { label: "Momentum", value: "64 → 58" }, { label: "IT breadth", value: "3 up / 7 down" }], relatedSymbols: ["TCS", "INFY", "ASIANPAINT"], factors: ["Volume", "Momentum", "Sector breadth"], followUps: ["Compare Banking and IT.", "Summarize the market since open."], ...common, confidence: 69 };
  if (q.includes("compare") || (q.includes("bank") && q.includes("it")))
    return { question, answer: "Banking is the strongest sector today and IT is the weakest. Banking shows +1.4% relative strength, 1.8× average volume and positive sentiment with institutional buying. IT shows −1.2% relative strength, 3 advancing against 7 declining names and deteriorating sentiment on discretionary spend commentary. The rotation runs from IT into financials.", metrics: [{ label: "Banking RS", value: "+1.4%" }, { label: "IT RS", value: "−1.2%" }, { label: "Rotation", value: "IT → Financials" }], relatedSymbols: ["HDFCBANK", "ICICIBANK", "TCS", "INFY"], factors: ["Relative strength", "Breadth", "Sentiment"], followUps: ["Which sectors are gaining momentum?", "What are today's biggest market risks?"], ...common };
  if (q.includes("sector") || q.includes("momentum"))
    return { question, answer: "Financials lead on relative strength, volume and institutional flow, with energy second and auto third. IT and FMCG lag. The rotation is orderly rather than defensive, but it does narrow the set of sectors carrying the index.", metrics: [{ label: "Leaders", value: "Financials, Energy, Auto" }, { label: "Laggards", value: "IT, FMCG" }, { label: "Rotation score", value: "55/100" }], relatedSymbols: ["HDFCBANK", "RELIANCE", "TATAMOTORS"], factors: ["Relative strength", "Flow", "Volume"], followUps: ["Compare Banking and IT.", "What changed in my portfolio?"], ...common };
  if (q.includes("sentiment") && q.includes("volume"))
    return { question, answer: "Three tracked names currently show sentiment and volume improving together: RELIANCE, HDFCBANK and TATAMOTORS. In each case turnover is above the 20-day average and net sentiment has shifted upward within the session, which is the combination the Quant Score weights most heavily.", metrics: [{ label: "Matches", value: "3 of 12 tracked" }, { label: "Volume filter", value: ">1.5× average" }, { label: "Sentiment filter", value: "Improving" }], relatedSymbols: ["RELIANCE", "HDFCBANK", "TATAMOTORS"], factors: ["Sentiment", "Volume"], followUps: ["Why did RELIANCE's Quant Score increase?", "Which sectors are gaining momentum?"], ...common };
  if (q.includes("since open") || q.includes("summar"))
    return { question, answer: "The session opened mildly positive, banking volume accelerated by 09:48, BANK NIFTY cleared resistance at 10:12, and breadth widened to 34/16 by 10:36. IT sentiment weakened after 11:05 and momentum has since flattened, leaving the market higher but no longer accelerating.", metrics: [{ label: "NIFTY", value: "24,468 → 24,612" }, { label: "Breadth", value: "26/24 → 34/16" }, { label: "VIX", value: "13.74 → 13.42" }], relatedSymbols: ["SBIN", "HDFCBANK", "TCS"], factors: ["Breadth", "Volume", "Volatility"], followUps: ["What are today's biggest market risks?", "What changed in my portfolio?"], ...common };
  return { question, answer: "NIFTY is higher because financials are leading on both flow and volume while breadth has widened to 34 advancing against 16 declining. Falling implied volatility supports the move. The qualifier is that index-wide turnover sits slightly below average, so the advance is sector-led rather than broad-based in flow terms.", metrics: [{ label: "NIFTY 50", value: "24,612.35 (+0.62%)" }, { label: "Breadth", value: "34 / 16" }, { label: "INDIA VIX", value: "13.42 (−2.31%)" }], relatedSymbols: ["HDFCBANK", "RELIANCE", "SBIN"], factors: ["Breadth", "Volume", "Volatility", "Sentiment"], followUps: ["Which sectors are gaining momentum?", "What are today's biggest market risks?"], ...common };
}

export function symbolOf(s: string): Symbol {
  return getSymbol(s);
}
