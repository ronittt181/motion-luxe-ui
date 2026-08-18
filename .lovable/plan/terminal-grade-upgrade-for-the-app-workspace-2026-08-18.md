# Terminal-grade upgrade for the app workspace

Goal: make every authenticated page feel like a professional trading terminal — dense, fast, keyboard-driven, explainable — while keeping the current black + ice-blue design language.

## Shared foundation (applies to all pages)

- **Workspace primitives** in a new `src/components/app/kit.tsx`: `PageHeader` (title, live clock, market-open pill, page actions), `Panel` (header row + toolbar + body slots), `Toolbar` (segmented filters, sort, density toggle), `DataTable` (sticky header, sortable columns, row hover crosshair, keyboard row focus), `EmptyState`, `Skeleton`, `KpiTile`.
- **Loading states**: skeleton shimmer for every table/chart instead of blank panels.
- **Density toggle** (comfortable / compact) persisted in local storage, applied to tables and tiles.
- **Keyboard layer**: `g` + key page jumps, `/` focus search, `j/k` row navigation, `Enter` opens analysis, `b`/`s` open buy/sell ticket. Shortcut hint sheet on `?`.
- **Motion discipline**: entrance reveals capped at ~180 ms, no layout-shifting animation on data updates, number changes flash tint (green/red) then settle, all gated behind `prefers-reduced-motion`.

## Per-page work

**Dashboard (`/app`)** — tighten the intelligence command center into a 12-column grid: top KPI rail (portfolio value, day P&L, exposure, cash, breadth), briefing + pulse map as the hero row, cause chain and change feed side by side, intelligence feed and Ask Quant Plus as a two-column base, replay as a slim footer strip. Equal-height panels, consistent panel headers, no orphan whitespace.

**Markets** — index strip with sparkline + range bar, sector heatmap tiles (size = weight, colour = change), advance/decline breadth bar, then the sortable table with column sorting, inline search, and a right-side quick-look drawer on row select.

**Analysis (`/app/analyze`)** — chart-first layout: timeframe + indicator toolbar, larger chart with crosshair readout and volume subpanel, right rail of factor breakdown, key levels, and stats; a bottom tab set for news, technicals and trade log. Symbol switcher pinned in the header.

**AI Intelligence** — narrative report layout: confidence header, factor contribution bars with plain-language reasons, scenario cards (bull/base/bear with probability), evidence list with timestamps, and an inline "ask about this signal" box.

**Screener** — real filter rail (score range, change %, volume, sector, signal), active filter chips with clear-all, saved presets, result count, sortable dense table, and bulk actions (add all to watchlist).

**Trade** — proper order ticket: buy/sell toggle, market/limit, quantity stepper with % of cash shortcuts, live order value, margin/cash impact, and a confirm step. Right side shows open positions with inline square-off plus an order blotter (working/filled/rejected tabs).

**Portfolio** — allocation donut and sector exposure bars, equity curve with day/week/all toggle, holdings table with unrealised P&L, weight and score columns, plus realised P&L summary and best/worst contributors.

**Watchlist** — multi-list support (tabs), drag-to-reorder rows, inline sparkline + score + alert bell, quick-add search bar, and a richer empty state.

**Alerts** — split into Active / Triggered / History, alert cards showing condition, distance-to-trigger progress bar, and a create-alert form (price, % move, score crossing) with validation.

**Settings** — sectioned layout with sticky sub-nav: profile, appearance (density, reduced motion, accent), trading defaults (order size, confirmations), notifications, data & reset virtual account, with save confirmation toasts.

## Technical notes

- All state stays client-side in the existing `src/lib/store.tsx` and `src/lib/market-data.ts`; extend types where new fields are needed (watchlist groups, alerts, order status, presets).
- New shared kit lives in `src/components/app/kit.tsx`; pages are refactored to consume it so styling stays consistent.
- No new colour literals — tokens and utilities in `src/styles.css` only; add a couple of utilities (heatmap tile, flash-up/flash-down) there.
- Verification: typecheck plus a Playwright pass over all ten routes at desktop and mobile widths, checking for console errors and overflow.

Delivered in waves: shared kit first, then dashboard/markets/analysis, then screener/trade/portfolio, then watchlist/alerts/settings.
