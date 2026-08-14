import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { getSymbol } from "./market-data";

export type Position = { symbol: string; qty: number; avg: number };
export type Order = {
  id: string;
  symbol: string;
  side: "BUY" | "SELL";
  qty: number;
  price: number;
  at: string;
};
export type Alert = {
  id: string;
  symbol: string;
  type: "Price" | "Quant Score" | "RSI" | "Sentiment" | "Unusual volume";
  condition: "above" | "below";
  value: number;
  active: boolean;
};
export type User = { name: string; email: string } | null;

type State = {
  user: User;
  cash: number;
  positions: Position[];
  orders: Order[];
  watchlist: string[];
  alerts: Alert[];
};

const START_CASH = 1_000_000;

const initial: State = {
  user: null,
  cash: START_CASH,
  positions: [
    { symbol: "RELIANCE", qty: 40, avg: 2790.4 },
    { symbol: "INFY", qty: 60, avg: 1548.2 },
    { symbol: "HDFCBANK", qty: 75, avg: 1712.9 },
  ],
  orders: [],
  watchlist: ["RELIANCE", "TCS", "HDFCBANK", "TATAMOTORS", "LT"],
  alerts: [
    { id: "a1", symbol: "RELIANCE", type: "Price", condition: "above", value: 3000, active: true },
    { id: "a2", symbol: "INFY", type: "Quant Score", condition: "above", value: 75, active: true },
  ],
};

type Ctx = State & {
  invested: number;
  holdingsValue: number;
  totalValue: number;
  pnl: number;
  login: (u: NonNullable<User>) => void;
  logout: () => void;
  toggleWatch: (s: string) => void;
  placeOrder: (o: { symbol: string; side: "BUY" | "SELL"; qty: number; price: number }) => { ok: boolean; message: string };
  addAlert: (a: Omit<Alert, "id" | "active">) => void;
  removeAlert: (id: string) => void;
  toggleAlert: (id: string) => void;
  reset: () => void;
};

const StoreContext = createContext<Ctx | null>(null);
const KEY = "quantplus.state.v1";

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(initial);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setState({ ...initial, ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);

  const value = useMemo<Ctx>(() => {
    const holdingsValue = state.positions.reduce(
      (a, p) => a + p.qty * (getSymbol(p.symbol)?.price ?? p.avg),
      0,
    );
    const invested = state.positions.reduce((a, p) => a + p.qty * p.avg, 0);
    return {
      ...state,
      invested,
      holdingsValue,
      totalValue: holdingsValue + state.cash,
      pnl: holdingsValue - invested,
      login: (u) => setState((s) => ({ ...s, user: u })),
      logout: () => setState((s) => ({ ...s, user: null })),
      toggleWatch: (sym) =>
        setState((s) => ({
          ...s,
          watchlist: s.watchlist.includes(sym) ? s.watchlist.filter((x) => x !== sym) : [...s.watchlist, sym],
        })),
      placeOrder: ({ symbol, side, qty, price }) => {
        if (qty <= 0) return { ok: false, message: "Enter a quantity greater than zero." };
        const cost = qty * price;
        const pos = state.positions.find((p) => p.symbol === symbol);
        if (side === "BUY" && cost > state.cash)
          return { ok: false, message: "Not enough virtual cash for this order." };
        if (side === "SELL" && (!pos || pos.qty < qty))
          return { ok: false, message: "You don't hold enough quantity to sell." };
        setState((s) => {
          const positions = [...s.positions];
          const idx = positions.findIndex((p) => p.symbol === symbol);
          if (side === "BUY") {
            if (idx >= 0) {
              const p = positions[idx]!;
              positions[idx] = { ...p, qty: p.qty + qty, avg: (p.avg * p.qty + cost) / (p.qty + qty) };
            } else positions.push({ symbol, qty, avg: price });
          } else {
            const p = positions[idx]!;
            if (p.qty === qty) positions.splice(idx, 1);
            else positions[idx] = { ...p, qty: p.qty - qty };
          }
          return {
            ...s,
            positions,
            cash: side === "BUY" ? s.cash - cost : s.cash + cost,
            orders: [
              { id: crypto.randomUUID(), symbol, side, qty, price, at: new Date().toISOString() },
              ...s.orders,
            ],
          };
        });
        return { ok: true, message: `Virtual ${side.toLowerCase()} of ${qty} ${symbol} filled at ₹${price.toFixed(2)}.` };
      },
      addAlert: (a) => setState((s) => ({ ...s, alerts: [{ ...a, id: crypto.randomUUID(), active: true }, ...s.alerts] })),
      removeAlert: (id) => setState((s) => ({ ...s, alerts: s.alerts.filter((a) => a.id !== id) })),
      toggleAlert: (id) =>
        setState((s) => ({ ...s, alerts: s.alerts.map((a) => (a.id === id ? { ...a, active: !a.active } : a)) })),
      reset: () => setState(initial),
    };
  }, [state]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
