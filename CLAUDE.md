# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

An interactive commercial real estate development feasibility workbench built on the 11-Step Development Process framework from Georgia Tech's "Financial Aspects of Commercial Real Estate" course (Prof. Barrington H. Branch). The tool combines AI-powered research, scenario simulation, and financial modeling into a single connected workflow.

**Full PRD:** See `.claude/PRD.md` for complete product requirements, architecture, and implementation phases.

## Architecture: Three Integrated Layers

1. **Research Engine (Steps 1, 2, 3, 5, 11)** — AI-powered data gathering via Anthropic API + web search. Surfaces macro indicators, demographics, comps, zoning, financing terms, public incentives, and exit transaction data.

2. **Scenario Simulator (Steps 4, 6, 7, 8, 9, 10)** — Interactive spectrum sliders where users game out timelines, costs, and lease-up scenarios. Every adjustment instantly shows downstream financial impact (carry costs, spread, IRR, exit value).

3. **Financial Model (Continuous)** — Always-visible panel with Developer's Targeted Spread, TCD buildup, Capital Stack, Waterfall, and key metrics. Updates in real-time from any input across any step.

**Critical design principle:** Changes in any step must cascade through the financial model. A construction delay in Step 7 should immediately update carry costs, TCD, Developer's Spread, IRR, and exit value.

## Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Lint
npm run lint
```

## Tech Stack

- **Framework:** React 18 + Vite 5
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Excel Export:** SheetJS (xlsx)
- **Icons:** lucide-react
- **AI/Research:** Anthropic Claude API with web search tool
- **State Management:** React Context + Reducer (centralized project state)

## Key Configuration

- API key stored in `.env` as `VITE_ANTHROPIC_API_KEY` (never commit this file)
- All API calls go to `https://api.anthropic.com/v1/messages`
- Web search enabled via `tools: [{ type: "web_search_20250305", name: "web_search" }]`
- Use model `claude-sonnet-4-20250514` for all API calls within the app

## Project Structure

```
src/
├── components/
│   ├── layout/          # Header, StepNavigator, FinancialModelPanel, Footer
│   ├── research/        # AI research modules (macro, demographics, comps, zoning, financing, exit)
│   ├── scenarios/       # Scenario sliders + impact displays (construction, lease-up, etc.)
│   ├── financial/       # Spread calculator, TCD builder, capital stack, waterfall, IRR
│   ├── steps/           # Step 1-11 page containers
│   ├── timeline/        # Critical path Gantt + financing stage overlay
│   └── shared/          # AI analysis panel, research cards, export, traffic lights
├── state/               # ProjectContext, projectReducer, initialState
├── data/                # Static data (sectors, drivers, scenario defaults, macro indicators)
├── hooks/               # useProjectState, useResearch, useScenarioCalc, useFinancialModel, useExcelExport
└── utils/               # calculations.js, formatters.js, researchPrompts.js, api.js
```

## Key Financial Concepts

These formulas are central to the application and must be accurate:

| Formula | Calculation |
|---------|-------------|
| Developer's Yield on TCD | NOI at Stabilization ÷ Total Cost of Development |
| Developer's Targeted Spread | Developer's Yield − Exit Cap Rate (in basis points) |
| Implied Sales Price | NOI at Stabilization ÷ Exit Cap Rate |
| Gross Profit/Loss | Sales Price − TCD |
| Monthly Carry Cost | Outstanding Loan Balance × (Annual Rate ÷ 12) |
| Time to Stabilization | (Stabilization Threshold − Opening Occupancy) ÷ Monthly Absorption Rate |
| Equity Multiple | Total Distributions ÷ Total Equity Invested |

**Validation benchmark (from course slide 38):**
- $100M TCD, $8M NOI, 6.5% exit cap → +150 BP spread, $123M sales price, $23M profit ✓
- $110M TCD, $6M NOI, 7.0% exit cap → −155 BP spread, $86M sales price, $24M loss ✓
- $95M TCD, $8M NOI, 5.5% exit cap → +292 BP spread, $145.5M sales price, $50.5M profit ✓

## Implementation Phases

- **Phase 1 ✅** — Foundation: Vite/React scaffold, macro dashboard, sector selection, spread calculator, AI analysis
- **Phase 2** — Research engine expansion (Steps 2, 3, 5, 11 research modules)
- **Phase 3** — Scenario simulator (Steps 4, 6-10 sliders with downstream impact)
- **Phase 4** — Financial model & capital stack (persistent panel, waterfall, IRR)
- **Phase 5** — Critical path timeline & integration testing
- **Phase 6** — Excel export & polish

## Design Guidelines

- **Dark theme** — Background: `#0B0F1A`, Surface: `#111827`, Cards: `#151d2e`
- **Accent color** — Gold: `#D4A843` (primary), Blue: `#3B82F6` (secondary)
- **Typography** — Instrument Sans (body), JetBrains Mono (data/numbers)
- **Traffic lights** — Green: `#10B981` (healthy), Yellow/Gold: `#F59E0B` (caution), Red: `#EF4444` (warning)
- **Scenario sliders** — Always show: range (min/max), base case marker, current value, and downstream impact panel

## Important Notes

- The PRD in `.claude/PRD.md` is the source of truth for what to build
- All research modules use the Anthropic API with web search — research prompts should be specific to the user's sector, location, and project details
- Scenario sliders must cascade: input change → time impact → cost impact → TCD → spread → IRR → exit value
- The financial model panel should be persistent/always-visible (sidebar or bottom bar)
- Excel exports should produce multi-tab workbooks covering all research, scenarios, and financials
