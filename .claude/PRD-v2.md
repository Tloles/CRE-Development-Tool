# The 11-Step Real Estate Development Process — Product Requirements Document v2

## 1. Executive Summary

The 11-Step Real Estate Development Process is an interactive **pre-development feasibility workbench** for commercial real estate. A developer has a concept — a sector, a location, a rough scale — and needs to quickly answer: *"Is this deal worth pursuing?"* This tool helps them get to a go/no-go decision in hours instead of weeks.

Based on the framework taught in Georgia Tech's "Financial Aspects of Commercial Real Estate" course by Professor Barrington H. Branch, the tool is organized into three parts that mirror how developers actually work:

1. **Research Engine (Steps 1–5)** — The tool auto-pulls data from free public APIs (FRED, Census, BLS, FEMA, EPA, RentCast) and provides structured input fields for data the user gathers from CoStar and other sources. This is where the tool saves the most time.

2. **Development Proforma (Steps 6–10, consolidated)** — A single, connected financial projection screen where the developer inputs cost assumptions, timeline, and lease-up projections. Interactive sliders let them game out scenarios and instantly see how changes cascade through to the Developer's Spread, IRR, and exit value.

3. **Exit & Returns (Step 11)** — Waterfall structure, developer's fees, exit cap rate modeling, and final return metrics.

Underlying everything is a **continuous financial model** — the Developer's Targeted Spread Calculator, Capital Stack, and key metrics dashboard that update in real-time as any input changes across any section.

**MVP Goal:** A user defines a project (sector + location), the tool auto-researches what it can, the user fills in what it can't, and all assumptions flow through a unified financial model to a clear feasibility verdict.

---

## 2. Mission

**Mission Statement:** Compress weeks of pre-development feasibility research into hours by connecting free public data, structured CoStar-compatible inputs, and financial modeling into a single, continuously updating system.

### Core Principles

1. **Research, Don't Checklist** — Surface real data, not reminders to go find it.
2. **Free First** — Use free public APIs for everything possible. Reserve paid APIs (Anthropic, CoStar) for optional or manual-input workflows.
3. **Everything Flows Downstream** — A change in any input ripples through to the Developer's Spread, IRR, and exit value.
4. **Forward-Looking** — Every assumption projects 3–5 years ahead to the point when that phase actually occurs.
5. **Game It Out** — The proforma's scenario sliders exist so developers stress-test before spending real money.
6. **Constant Reassessment** — Budgets and proformas must be continuously updated. The tool makes iteration instant.

---

## 3. Target Users

### Primary: Graduate Real Estate Student
- Students in CRE development courses (e.g., Georgia Tech Scheller College of Business)
- Familiar with Excel-based proformas; comfortable with web apps
- Need to build defensible feasibility analyses for course projects and presentations
- Pain: gathering data is slow; hard to see how assumptions cascade

### Secondary: Early-Career Developer / Analyst
- Junior developers or analysts performing pre-development feasibility
- Need to rapidly assess if a project concept is worth pursuing
- Pain: research scattered across FRED, Census, CoStar, municipal sites, brokerage reports; no single tool connects research → financial model

---

## 4. Application Structure

The app has **7 screens** organized into three sections, replacing the original 11 separate step pages:

### Section A: Research Engine

| Screen | Name | Purpose |
|--------|------|---------|
| **Step 1** | Inception | Macro environment + sector selection + project concept definition |
| **Step 2** | Submarket Research | Deep demographic, employment, environmental, housing, and market data for target location |
| **Step 3** | Feasibility | Market study inputs (vacancy, rents, absorption, construction costs, cap rates) + Spread Calculator |
| **Step 4** | Pre-Development | Entitlement timeline, pre-leasing targets, design/engineering cost assumptions |
| **Step 5** | Financing & Incentives | Rate benchmarks, capital stack builder, Opportunity Zone check, debt/equity terms |

### Section B: Development Proforma

| Screen | Name | Purpose |
|--------|------|---------|
| **Proforma** | Development Proforma | Consolidated Steps 6–10: land costs, hard/soft costs, construction timeline, lease-up, stabilization — all on one screen with scenario sliders and cascading financial impact |

### Section C: Exit & Returns

| Screen | Name | Purpose |
|--------|------|---------|
| **Step 11** | Exit & Returns | Exit cap rate, waterfall structure, developer's fees, IRR, equity multiple, final feasibility verdict |

### Navigation

The step navigator should reflect this simplified structure:

```
[ 1. Inception ] [ 2. Submarket ] [ 3. Feasibility ] [ 4. Pre-Dev ] [ 5. Financing ] [ Proforma ] [ Exit ]
```

Steps 6–10 no longer appear as separate navigation items. They are consolidated into "Proforma."

---

## 5. Data Architecture

### Free Public APIs (automatic — no cost to user)

| API | Data | Used In | Key Required |
|-----|------|---------|-------------|
| **FRED** | Fed Rate, SOFR, CPI, Unemployment, Treasuries, Mortgage Rate, Prime | Step 1, Step 5 | Yes (free) |
| **Census ACS** | Demographics: income distribution, housing stock, population, workforce, commute patterns | Step 2 | Optional (free) |
| **Census Geocoder + Nominatim** | Convert location to FIPS codes for Census queries | Step 2 | No |
| **BLS** | Unemployment trends, employment by industry | Step 2 | Optional (free) |
| **FEMA** | Flood zone designation | Step 2 | No |
| **EPA Envirofacts** | Toxic release sites, superfund proximity | Step 2 | No |
| **Census Building Permits** | Construction permit trends (supply pipeline proxy) | Step 2 | No |
| **RentCast** | Market rents, sale listings, price trends | Step 2, Step 3, Step 11 | Yes (50 free/month) |
| **Opportunity Zone Lookup** | Census tract cross-reference against OZ designation list | Step 5 | No |

### Manual Input with Guidance (user-sourced — CoStar, brokerage reports, etc.)

| Data | Used In | Guidance Provided |
|------|---------|-------------------|
| Zoning & land use specifics | Step 2 | "Source: municipal zoning map or CoStar property detail" |
| Infrastructure & transit access | Step 2 | "Source: local transit authority, Google Maps" |
| Market vacancy, absorption, rental rate trends | Step 3 | "Source: CoStar Market Analytics, CBRE/JLL quarterly reports" |
| Construction costs per SF | Step 3, Proforma | "Source: RSMeans, local GC estimates, CoStar" |
| Cap rates by sector/submarket | Step 3, Step 11 | "Source: CBRE Cap Rate Survey, CoStar, RCA/MSCI" |
| Senior debt terms (spread, LTV, DSCR) | Step 5 | "Source: lender quotes, MBA, CBRE Lending Momentum Index" |
| Equity return expectations | Step 5 | "Source: NCREIF, Preqin, investor term sheets" |
| Mezzanine/preferred equity terms | Step 5 | "Source: capital advisors, offering memos" |
| Specific public incentive programs | Step 5 | "Source: municipal economic development office, state DCA" |
| Transaction comps (sale price, cap rate, $/unit) | Step 11 | "Source: CoStar COMPS, RCA, brokerage marketing materials" |

### Optional AI Analysis (Anthropic API — costs money per use)

The AI Analysis Panel remains available on any screen but is clearly labeled "Uses API Credits." It is never called automatically. The user must explicitly click to run it. Use cases:
- Synthesize research findings into a narrative feasibility summary
- Identify risks or opportunities the user may have missed
- Generate investor-ready language for a feasibility memo

---

## 6. Feature Specifications

### 6.1 Step 1 — Inception (Macro & Sector Research)

**Purpose:** Define the project concept and understand the macro environment.

**Components:**
- **Macro Dashboard** — FRED API: 8 indicators (Fed Rate, SOFR, CPI YoY, Unemployment, 5yr Treasury, 10yr Treasury, 30yr Mortgage, Prime Rate). One-click fetch with timestamps and trend arrows.
- **Sector Selection** — 8 CRE sectors with subtypes (per course slides 13–14)
- **Drivers of Change** — 8 drivers from course (slides 2–3) with user relevance tagging
- **Project Concept Form** — Name, location (address or city), description, approximate scale
- **Spread Calculator** — Developer's Targeted Spread with 3-scenario modeling (per slide 38)

### 6.2 Step 2 — Submarket Research (Deep Demographics & Site Profile)

**Purpose:** Build a comprehensive data profile of the target location.

**Components:**

**Demographics Panel (tabbed — 5 tabs, all from Census ACS):**

| Tab | Key Data Points |
|-----|----------------|
| **Overview** | Population, median income, median age, home value, rent, vacancy, unemployment, education |
| **Income** | Income distribution brackets ($25K increments), per capita income, % earning $100K+, $200K+, wealth pocket analysis |
| **Housing** | Owner/renter split, unit type breakdown (SF, 2-4, 5-19, 20+, mobile), median year built, cost burden (% paying 30%+ on housing) |
| **Population** | Age brackets (highlighting 25-44 prime renter demo), household size, family vs nonfamily, migration (moved in last year, from where) |
| **Workforce** | Commute mode (drive, transit, WFH %), mean commute time, industry mix, vehicles per household |

Each tab displays tract-level and city-level data side by side. Contextual notes explain what data means for development ("X% cost-burdened = strong demand signal").

**Employment Panel** — BLS API: state/county unemployment rate with 12-month trend chart

**Environmental Panel** — FEMA flood zones + EPA toxic release sites

**Supply Pipeline Panel** — Census building permits trend

**Market Data Panel** — RentCast: rents, listings, price trends (with 50/month usage counter)

**Manual Input Cards:**
- Zoning & Land Use (category, density, height, parking, overlays)
- Infrastructure & Access (transit, highway, utilities)

### 6.3 Step 3 — Feasibility (Market Study & Spread Analysis)

**Purpose:** Establish the market assumptions that drive the financial model.

**Components:**
- **Market Study Inputs** (manual with guidance tooltips):
  - Current vacancy rate for sector/submarket
  - Asking rents (per SF or per unit, depending on sector)
  - Absorption rate (units or SF per month/quarter)
  - Supply pipeline (competing projects under construction or planned)
  - Market cycle position assessment (expansion, hypersupply, recession, recovery)
- **Construction Cost Inputs** (manual with guidance):
  - Hard costs per SF (by product type)
  - Soft costs estimate
  - Land cost estimate or range
  - Contingency percentage
  - Annual escalation assumption
- **Cap Rate Inputs** (manual with guidance):
  - Current market cap rate by asset class (A/B/C)
  - Cap rate trend direction
  - Cap rate spread over 10yr Treasury (historical context)
- **Developer's Targeted Spread Calculator** — existing component, now fed by inputs above
  - Three-scenario modeling (Strong / Base / Stress)
  - Traffic light health indicators
  - Sensitivity table showing spread at different NOI / Cap Rate combinations

### 6.4 Step 4 — Pre-Development (Contracts & Entitlements)

**Purpose:** Model pre-development timeline and cost assumptions before committing capital.

**Components (scenario sliders + manual inputs):**
- Pre-leasing target at closing (0% → 60%) — with note on how this affects financing terms
- Entitlement/permitting timeline (3 → 24 months)
- Design & engineering cost budget
- GC procurement timeline and approach
- Pre-development carry cost calculator (auto-calculated from timeline + rate assumptions)

### 6.5 Step 5 — Financing & Incentives

**Purpose:** Build the capital stack and identify available incentive programs.

**Components:**
- **Rate Benchmarks Panel** — FRED API: current SOFR, Prime, Treasuries + derived CRE spread ranges
- **Opportunity Zone Check** — auto-lookup via Census geocoder + OZ tract database
- **Capital Stack Builder** — interactive component for modeling:
  - Senior debt (amount, rate as spread over SOFR, LTV, term, I/O period)
  - Mezzanine / preferred equity (amount, preferred return, term)
  - JV equity (amount, promote structure)
  - Developer equity (amount)
  - Shows total sources = total uses validation
- **Public Incentives** (manual inputs with guidance):
  - TIF/TAD districts
  - Tax abatements
  - LIHTC (if affordable component)
  - NMTC
  - State-specific programs
- **Financing Terms** (manual inputs with guidance):
  - Construction loan terms
  - Permanent loan terms
  - Equity return expectations by risk profile

### 6.6 Development Proforma (Consolidated Steps 6–10)

**Purpose:** A single connected screen for projecting all costs from closing through stabilization. The developer inputs assumptions, adjusts scenario sliders, and watches the financial model update in real-time.

**Layout:** Organized in sections that flow top-to-bottom, matching the chronological order of a development project:

**Section 1: Land & Closing (was Step 6)**
- Land/acquisition purchase price
- Closing costs (% of purchase price)
- Legal and due diligence fees
- Closing timeline (months from commitment)

**Section 2: Development Budget (was Step 7)**
- Hard costs breakdown (construction, site work, FF&E)
- Soft costs breakdown (A&E, legal, permits, insurance, marketing)
- Contingency (% of hard + soft)
- Developer fee (% of TCD or fixed amount)
- Construction duration (slider: 12 → 42 months)
- Hard cost escalation (slider: 0% → 10% annual)
- Change order allowance (slider: 0% → 15% of hard costs)

**Section 3: Financing Costs**
- Construction loan interest (auto-calculated from: loan amount × rate × duration)
- Loan origination fees
- Interest reserve
- Rate movement during construction (slider: -50 BP → +200 BP)
- Total carry cost during construction (auto-calculated)

**Section 4: Lease-Up & Stabilization (was Steps 8–10)**
- Opening occupancy at CO (slider: 20% → 70%)
- Free rent concessions (slider: 0 → 9 months)
- Monthly absorption rate (slider: 1% → 10%)
- Stabilization threshold (slider: 85% → 97%)
- Time to stabilization (auto-calculated from opening occupancy + absorption rate)
- Effective rent vs asking rent (slider: 85% → 100%)
- Operating expense ratio (slider: 25% → 50%)
- Management fee (slider: 2% → 5% of EGI)
- Carry cost during lease-up (auto-calculated)

**Section 5: Total Cost of Development (TCD) Summary**
- Auto-summed from all sections above:

| Category | Source |
|----------|--------|
| Land & Closing | Section 1 inputs |
| Hard Costs | Section 2 inputs (with escalation applied) |
| Soft Costs | Section 2 inputs |
| Financing Costs | Section 3 (auto-calculated) |
| Carry During Construction | Section 3 (auto-calculated) |
| Carry During Lease-Up | Section 4 (auto-calculated) |
| Developer Fee | Section 2 input |
| Contingency | Section 2 input |
| **Total Cost of Development** | **Sum of all above** |

**Section 6: NOI at Stabilization**
- Gross Potential Revenue (total rentable area × stabilized rent)
- Less: Vacancy & Credit Loss (based on stabilization threshold)
- Effective Gross Income
- Less: Operating Expenses (from OpEx ratio)
- Less: Management Fee
- **Net Operating Income at Stabilization**

**Scenario Impact Panel (always visible on this screen):**
Every slider adjustment instantly recalculates and displays:
- Total Cost of Development change
- NOI at Stabilization change
- Developer's Yield on TCD
- Developer's Spread (vs exit cap)
- Additional carry cost from delays
- Time to exit change

### 6.7 Step 11 — Exit & Returns

**Purpose:** Model the exit and calculate final developer returns.

**Components:**
- **Exit Strategy Selector** — 100% sale, refinance + retain, partial sale
- **Exit Cap Rate** (manual input with guidance from CoStar/CBRE research)
- **Implied Sales Price** — NOI at Stabilization ÷ Exit Cap Rate (auto-calculated)
- **Gross Profit/Loss** — Sales Price − TCD (auto-calculated)
- **Developer's Targeted Spread** — Final calculation with traffic light
- **Waterfall Structure Builder** — Customizable tiers:
  - Return of capital
  - Preferred return (LP/investor)
  - Promote splits above hurdle rates
  - Developer's promote/carried interest
- **Developer's Fees Summary** — Development fee, asset management fee, leasing fee, disposition fee
- **Key Return Metrics Dashboard:**

| Metric | Calculation | Health Threshold |
|--------|-------------|-----------------|
| Developer's Spread | Yield on TCD − Exit Cap | ≥150 BP (green), 100-149 (yellow), <100 (red) |
| Leveraged IRR | Full cash flow with debt service | ≥18% (green), 14-17% (yellow), <14% (red) |
| Unleveraged IRR | Cash flows without debt | ≥12% (green), 9-11% (yellow), <9% (red) |
| Equity Multiple | Total distributions ÷ Total equity | ≥2.0x (green), 1.5-1.9x (yellow), <1.5x (red) |
| Profit/Loss | Sales Price − TCD | Positive (green), Marginal (yellow), Negative (red) |
| Total Timeline | Inception → Exit | Benchmark vs 5-year target |

- **Permanent Financing Benchmarks** — FRED API for long-term rate context
- **RentCast Market Data** — Exit market intelligence (if calls available)

---

## 7. Persistent Financial Model

The financial model is the connective tissue. It is always visible (collapsible sidebar or bottom panel) and updates in real-time from any screen.

**Always displayed:**
- Developer's Targeted Spread (BP) with traffic light
- Total Cost of Development
- NOI at Stabilization
- Implied Sales Price
- Gross Profit/Loss
- Total Project Timeline (months)

**Expandable:**
- Capital Stack summary
- TCD breakdown by category
- Key return metrics (IRR, Multiple)

---

## 8. Technology Stack

### Frontend
| Component | Technology |
|-----------|------------|
| Framework | React 18 + Vite 5 |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Excel Export | SheetJS (xlsx) |
| Icons | lucide-react |

### Free Public APIs
| API | Purpose |
|-----|---------|
| FRED | Macro indicators, rate benchmarks |
| Census ACS | Demographics (5 tabs of deep data) |
| Census Geocoder + Nominatim | Location → FIPS codes |
| BLS | Employment trends |
| FEMA | Flood zones |
| EPA Envirofacts | Environmental hazards |
| Census Building Permits | Supply pipeline proxy |
| RentCast | Market rents, listings (50 free/month) |

### Optional Paid
| Service | Purpose |
|---------|---------|
| Anthropic Claude API | Optional AI analysis (user-triggered only) |

### Environment Variables (.env)
```
VITE_FRED_API_KEY=required
VITE_RENTCAST_API_KEY=optional_50_free_monthly
VITE_CENSUS_API_KEY=optional_higher_rate_limits
VITE_BLS_API_KEY=optional_higher_rate_limits
VITE_ANTHROPIC_API_KEY=optional_ai_analysis_only
```

---

## 9. Implementation Phases

### Phase 1: Foundation ✅
- Vite + React + Tailwind scaffold
- Step navigation, basic macro dashboard, sector selection, spread calculator
- Light theme

### Phase 2: Research Engine (Current)
- FRED integration for macro dashboard
- Census deep demographics (5-tab panel)
- BLS employment, FEMA flood zones, EPA environmental
- RentCast market data
- Geocoding (Census + Nominatim fallback)
- OZ lookup
- Manual input cards with guidance tooltips

### Phase 3: Feasibility + Pre-Development + Financing
- Step 3: Market study manual inputs + Spread Calculator integration
- Step 4: Pre-development scenario inputs
- Step 5: Capital Stack Builder + FRED rate benchmarks + OZ check
- Centralized state: all inputs flow into financial model

### Phase 4: Development Proforma
- Consolidated Steps 6–10 into single proforma screen
- TCD buildup from all inputs
- Scenario sliders with instant downstream impact
- NOI at stabilization calculator
- Carry cost calculations (construction + lease-up)

### Phase 5: Exit & Returns
- Step 11: Exit modeling, waterfall builder, developer fees
- IRR calculator (leveraged + unleveraged)
- Equity multiple
- Final return metrics dashboard with traffic lights
- Persistent financial model panel

### Phase 6: Export & Polish
- Excel export (multi-tab workbook)
- Critical path timeline visualization
- Loading states, error handling
- Performance optimization
- README and documentation

---

## 10. Success Criteria

The MVP is successful when a user can:
1. Define a project (sector + location) and see auto-researched macro, demographic, and market data
2. Enter market study assumptions and see the Developer's Spread calculate automatically
3. Build a capital stack informed by current rate benchmarks and OZ eligibility
4. Input development cost and timeline assumptions on the proforma and see TCD, NOI, and Spread update in real-time
5. Adjust scenario sliders and instantly see cascading financial impact
6. Model the exit with a waterfall structure and see final IRR, equity multiple, and profit/loss
7. Export everything to a professional Excel workbook
8. Complete a feasibility analysis in hours instead of weeks

---

## 11. Key Financial Formulas

| Formula | Calculation |
|---------|-------------|
| Developer's Yield on TCD | NOI at Stabilization ÷ Total Cost of Development |
| Developer's Targeted Spread | Developer's Yield − Exit Cap Rate (in BP) |
| Implied Sales Price | NOI at Stabilization ÷ Exit Cap Rate |
| Gross Profit/Loss | Sales Price − TCD |
| Monthly Carry Cost | Outstanding Loan Balance × (Annual Rate ÷ 12) |
| Time to Stabilization | (Stabilization % − Opening Occupancy %) ÷ Monthly Absorption Rate |
| NOI | EGI − Operating Expenses − Management Fee |
| EGI | Gross Potential Revenue − Vacancy & Credit Loss |
| Equity Multiple | Total Distributions ÷ Total Equity Invested |
| Cost Burden % | Households Paying 30%+ of Income on Housing ÷ Total Households |

**Validation Benchmarks (from course slide 38):**
- $100M TCD, $8M NOI, 6.5% exit cap → +150 BP spread, $123M sales price, $23M profit
- $110M TCD, $6M NOI, 7.0% exit cap → −155 BP spread, $86M sales price, $24M loss
- $95M TCD, $8M NOI, 5.5% exit cap → +292 BP spread, $145.5M sales price, $50.5M profit

---

## 12. Course References

| Slides | Topic | Tool Integration |
|--------|-------|-----------------|
| 2–3 | 8 Drivers of Change | Step 1: Driver selection |
| 4–12 | Economic changes, macro charts | Step 1: Macro Dashboard (FRED) |
| 13–14 | CRE sectors and subtypes | Step 1: Sector selection |
| 15–17 | Developer requirements, complexity | Cross-cutting guidance |
| 18 | The 11-Step Process | Core framework |
| 19–29 | Detailed Steps 1–11 | Steps 1–5, Proforma, Exit |
| 30–31 | 3–4 Stages of Financing | Step 5: Capital Stack |
| 32–35 | Equity, budgets, proformas, Critical Path | Proforma + Timeline |
| 36–38 | Key Metrics, Developer's Spread | Financial Model |
| 39–43 | Waterfall Structures, Developer's Fees | Step 11: Exit |

---

## 13. Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Free API data gaps | Manual input fields with CoStar/brokerage guidance for everything APIs can't cover |
| Census tract data too granular or noisy | Show city-level alongside tract-level; note small sample sizes |
| RentCast 50 call limit | Cache aggressively; show usage counter; prioritize which calls to make |
| Financial model errors | Validate against slide 38 benchmarks; unit test cascading calculations |
| CORS / proxy issues | Vite dev server proxy for all external APIs |
| User overwhelm | Clean tabbed interfaces; progressive disclosure; don't show everything at once |
| Scope creep | Strict phase boundaries; defer to post-MVP |

---

## 14. Future Considerations

- CoStar CSV import for bulk comp data entry
- GIS/mapping with demographic overlay
- Multi-project comparison (side-by-side feasibility)
- Monte Carlo simulation across scenario variables
- PDF feasibility report generation
- Multi-user collaboration
- Template library by sector/market tier
- RSMeans construction cost database integration
- Tax modeling (depreciation, 1031, cost segregation, OZ benefits)
