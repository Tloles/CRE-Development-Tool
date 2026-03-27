# Land Enhancement & Acceleration Platform — Product Requirements Document v3

**This document supersedes PRD-v2.** It is the source of truth for the application.

---

## 1. Executive Summary

The Land Enhancement & Acceleration Platform (LEP) is an interactive **land investment intelligence and deal management workbench**. It supports a proactive land strategy: instead of buying land and waiting for the market to catch up, we enhance and accelerate land value through assemblage, master planning, entitlement, and strategic disposition.

The platform guides users through a 9-step "Enhancement & Acceleration" model:

1. **Select** a site based on comprehensive due diligence and data-driven submarket intelligence
2. **Assemble** land through targeted parcel acquisition and assemblage tracking
3. **Reimagine** what the land could become through highest-and-best-use analysis
4. **Brand** the project with a name, identity, and market narrative
5. **Master plan** with complementary land uses, phasing, and density optimization
6. **Entitle** through rezoning, variances, and public incentive capture
7. **Identify drivers** — anchor tenants, target users, and demand sources
8. **Develop infrastructure** — horizontal improvements, utilities, phased delivery
9. **Dispose** — sell or ground lease to users and developers

Underlying the workflow is a **Land Deal Proforma** that tracks the full financial lifecycle from acquisition through disposition, and an **interactive submarket intelligence engine** powered by Census ACS demographics, county GIS parcel data, and free public APIs.

**Core Differentiator:** The platform combines tract-level demographic growth intelligence with parcel-level property data from county GIS systems, enabling users to identify land opportunities that passive data tools miss — underimproved parcels in high-growth corridors, assemblage-friendly clusters, and motivated seller signals.

---

## 2. Mission

**Mission Statement:** Empower land investors and developers to find, enhance, and accelerate strategically-located land tracts by connecting submarket intelligence, parcel-level data, and deal management into a single platform.

### Core Principles

1. **Intelligence First** — Surface real data from public APIs and county GIS systems, don't just provide input forms
2. **Free First** — Use free public APIs and open county GIS data for everything possible. Paid APIs (Regrid, Anthropic) are optional enhancements
3. **Parcel-Level Precision** — Go beyond market-level data to individual parcel analysis with opportunity scoring
4. **Everything Flows to the Proforma** — Land basis from assemblage, enhancement costs from entitlements, disposition proceeds — all cascade into the financial model
5. **Enhancement > Speculation** — The tool supports active value creation, not passive buy-and-hold. Every step adds measurable value
6. **Community-Minded Development** — Guided by a vision to develop land in a way that benefits the broader community

---

## 3. Target Users

### Primary: Land Investor / Developer

- Actively acquires and enhances land in urban and suburban growth corridors
- Needs to evaluate sites quickly using demographic, economic, and parcel-level data
- Manages multi-parcel assemblage campaigns
- Navigates entitlement processes and public incentive programs
- Disposes of enhanced land to end-users and vertical developers
- Pain: research scattered across county GIS portals, Census data, CoStar, municipal sites; no tool connects site intelligence → assemblage → entitlement → financial model

### Secondary: CRE Graduate Student / Analyst

- Students in CRE development courses (e.g., Georgia Tech Scheller College of Business)
- Learning the land development lifecycle from Professor Branch's framework
- Need to build defensible site analyses for course projects
- Pain: gathering parcel and demographic data is tedious; hard to see how site selection decisions cascade through to returns

---

## 4. Application Structure

The app has **10 screens** organized into three sections plus a proforma:

### Section A: Intelligence & Acquisition

| Screen | Name | Icon | Purpose |
|--------|------|------|---------|
| **Step 1** | Site Selection & Due Diligence | Search | Submarket intelligence: interactive census tract map, demographics, environmental, zoning, infrastructure, path of progress, parcel-level opportunity scanner |
| **Step 2** | Acquisition & Assemblage | Layers | Parcel tracker, ownership research, assemblage strategy, acquisition timeline, land basis calculator |

### Section B: Enhancement

| Screen | Name | Icon | Purpose |
|--------|------|------|---------|
| **Step 3** | Reimagination | Sparkles | Highest & best use analysis, comp site research, concept development, use case scenarios |
| **Step 4** | Project Identity | Fingerprint | Project naming, branding direction, narrative/story, positioning statement, market messaging |
| **Step 5** | Master Plan | LayoutDashboard | Land use plan, complementary uses, phasing, density/FAR, site plan inputs, parking, open space, amenities |
| **Step 6** | Entitlements & Incentives | Scale | Rezoning tracker, variance applications, public hearing timeline, community engagement. Incentives: TIF/TAD, tax abatements, OZ, LIHTC, NMTC |
| **Step 7** | Drivers & Users | Users | Anchor tenant identification, target user profiles, demand drivers, LOI tracker, pre-lease/pre-sale pipeline |

### Section C: Execution & Exit

| Screen | Name | Icon | Purpose |
|--------|------|------|---------|
| **Step 8** | Infrastructure & Development | Hammer | Horizontal improvements, utilities, roads, grading. Vertical construction scope. Phased delivery timeline |
| **Step 9** | Disposition | ArrowRightLeft | Sale/ground lease strategy, buyer/developer pipeline, deal structure, exit timing, marketing |

### Financial Model

| Screen | Name | Icon | Purpose |
|--------|------|------|---------|
| **Proforma** | Land Deal Proforma | Calculator | Full lifecycle financial model: land basis → enhancement costs → infrastructure → disposition proceeds → IRR/equity multiple |

### Navigation

```
[ 1. Site Selection ] [ 2. Assemblage ] | [ 3. Reimagination ] [ 4. Identity ] [ 5. Master Plan ] [ 6. Entitlements ] [ 7. Drivers ] | [ 8. Infrastructure ] [ 9. Disposition ] [ Proforma ]
```

Color coding by section:
- **Intelligence (Steps 1-2):** Blue accent (`#2563EB`)
- **Enhancement (Steps 3-7):** Gold accent (`#C5992E`)
- **Execution (Steps 8-9 + Proforma):** Green accent (`#059669`)

---

## 5. Data Architecture

### Automated Data Sources (free, no cost to user)

| Source | Data | Used In | Key Required |
|--------|------|---------|-------------|
| **Census ACS 2024** | Demographics: income, housing, population, workforce, commute patterns | Step 1 | Optional (free) |
| **Census ACS 2020** | Historical baseline for 5-year growth calculations (post-redistricting GEOIDs) | Step 1 | Optional (free) |
| **Photon Geocoder** | Address → coordinates for map centering | Step 1 | No |
| **Census Geocoder** | Address → FIPS codes (state, county, tract) for Census API queries | Step 1 | No |
| **County GIS ArcGIS REST** | Tax parcels: boundaries, ownership, assessed values, land use, acreage, zoning | Steps 1-2 | No |
| **FRED** | Fed Rate, SOFR, CPI, Unemployment, Treasuries, Mortgage, Prime | Proforma | Yes (free) |
| **FEMA** | Flood zone designation | Step 1 | No |
| **EPA Envirofacts** | Toxic release sites, superfund proximity | Step 1 | No |
| **Census Building Permits** | County-level construction permit trends (development activity proxy) | Step 1 | No |
| **Opportunity Zone Lookup** | Census tract cross-reference against OZ designation list | Step 6 | No (static data) |

### Optional Paid Data Sources

| Source | Data | Key |
|--------|------|-----|
| **RentCast** | Market rents, listings, price trends (50 free calls/month) | `VITE_RENTCAST_API_KEY` |
| **Regrid** | Nationwide standardized parcel data (for counties without open GIS) | `VITE_REGRID_API_KEY` |
| **Anthropic Claude** | Optional AI analysis — user-triggered only, labeled "Uses API Credits" | `VITE_ANTHROPIC_API_KEY` |

### County GIS Parcel Data (Key Innovation)

The platform queries county ArcGIS REST services to pull individual tax parcel data with boundaries, ownership, and valuation. This enables the Land Opportunity Scanner feature in Step 1.

**Verified Metro Atlanta endpoints:**
- **Fulton County** (FIPS 13121) — Fully verified with complete field schema
- **DeKalb County** (FIPS 13089) — Endpoint confirmed, fields need mapping
- **Gwinnett County** (FIPS 13135) — Open data portal confirmed
- **Cobb County** (FIPS 13067) — GIS hub confirmed

See `.claude/county-gis-endpoints.md` for complete endpoint documentation, field mappings, and query patterns.

For counties without open GIS endpoints, the Regrid API provides standardized nationwide parcel data as a paid fallback.

### Manual Input with Guidance

| Data | Used In | Guidance |
|------|---------|----------|
| Path of Progress entries | Step 1 | "Log nearby developments, infrastructure projects, employer moves" |
| Zoning details | Step 1 | "Source: municipal zoning map, county GIS portal" |
| Infrastructure & access | Step 1 | "Source: local transit authority, Google Maps, DOT traffic counts" |
| Environmental due diligence | Step 1 | "Source: Phase I ESA, USACE, National Wetlands Inventory" |
| Parcel acquisition details | Step 2 | Owner contacts, offer prices, DD deadlines, closing dates |
| Competing projects | Step 1 | "Source: CoStar, brokerage reports, driving the market" |
| Market rents, vacancy, absorption | Proforma | "Source: CoStar Market Analytics, CBRE/JLL quarterly reports" |
| Construction costs | Proforma | "Source: RSMeans, local GC estimates" |
| Entitlement timeline & costs | Step 6 | "Source: municipal planning department, zoning attorney" |
| Disposition pricing | Step 9 | "Source: comparable land sales, broker opinions of value" |

---

## 6. Feature Specifications

### 6.1 Step 1 — Site Selection & Due Diligence

**Purpose:** Comprehensive data-driven site analysis combining submarket intelligence with parcel-level opportunity identification. This is the highest-priority and largest screen.

**Components:**

**Project Concept Card:**
- Project Name (text)
- Location / Address (text — feeds geocoder)
- Site Description (text area — investment thesis)
- Total Acreage (number)
- Target Acquisition Price (currency)
- Current Use (dropdown: Vacant Land, Agricultural, Single-Family Residential, Commercial, Industrial, Mixed, Other)

**Interactive Census Tract Map (full width, 450px):**
- CartoDB Positron base tiles
- Clickable census tract polygons with color-coding by selectable metric
- Metric categories grouped for land investors:
  - *Growth Corridors:* Population Growth %, Income Growth %, Home Value Growth %, Rent Growth %, Building Permit Velocity
  - *Current Snapshot:* Median Income, Home Value, Median Rent, Vacancy Rate, Population Density, Renter %, Median Age
  - *Development Signals:* Cost-Burdened Renters %, Housing Stock Age, WFH %, Professional Degree %, Gini Index, Poverty Rate
- Color scales: diverging red-white-green for growth; sequential navy-to-gold for snapshot/signals
- At zoom level 14+: **Land Opportunity Scanner** activates — parcel polygons from county GIS overlay on top of tract data, colored by opportunity score

**Land Opportunity Scanner (zoom 14+):**
- Queries county ArcGIS REST API for parcels within viewport
- Parcel polygons colored by: Improvement Ratio, Assessed Value/Acre, Year Built, Opportunity Score
- Click a parcel → detail panel with: ownership, valuation, land use, acreage, opportunity signals
- Opportunity signals: 🟢 Underimproved, 🟢 Vacant, 🟡 Aging Structure, 🟡 Long Hold, 🔵 Size Threshold, 🟠 Assemblage Adjacent
- Composite Opportunity Score (0-100) combining parcel signals + tract growth data
- "Add to Assemblage" button pre-populates Step 2 parcel form
- Sortable/filterable parcel list below map

**Demographics Tabs (5 tabs, Census ACS 2024 + 2020 comparison):**
- Overview: Population, median income, age, home value, rent, vacancy, Gini, poverty rate, professional degree %
- Income: Distribution brackets, per capita, $100K+ and $200K+ households
- Housing: Rent brackets (B25063), home value brackets (B25075), housing stock age (B25034), bedroom mix (B25041), owner/renter split, cost burden
- Population: Age brackets, household size, migration (in-movers from different county/state/abroad)
- Workforce: Commute mode (drive, transit, WFH %), mean commute time, industry mix

Each tab shows tract-level vs. city/county comparison columns.

**Path of Progress Panel:**
- Manual entry table: Description, Category (Major Development / Infrastructure / Employer / Institutional / Municipal Action / Other), Investment/Scale, Distance, Status, Impact (Low/Med/High), Source
- Stored in ProjectContext

**Environmental & Geotechnical Panel:**
- FEMA flood zones (auto from API)
- EPA toxic release sites (auto from API)
- Phase I ESA Status (dropdown)
- Geotechnical Status (dropdown)
- Wetlands/Waters (text input)
- Topography Notes (text area)

**Zoning Snapshot Panel:**
- Current zoning, permitted uses, max density/FAR, max height, setbacks, overlay districts, min lot size
- Note: "This is what you CAN do today. Step 6 is where you plan what you WANT to do."

**Infrastructure & Access Panel:**
- Highway proximity, nearest transit, road frontage, ADT, ingress/egress
- Utility checklist: Water, Sewer, Electric, Gas, Fiber (each: Available at Site / Nearby / Not Available / Unknown)

**Development Activity Panel:**
- Census building permits trend chart
- Manual competing projects tracker (name, type, units, status, delivery, distance, notes)

**Macro Dashboard (collapsible):**
- FRED indicators: Fed Rate, SOFR, CPI, Unemployment, Treasuries, Mortgage, Prime

**AI Analysis Panel (optional, user-triggered):**
- Synthesize research findings into a narrative
- Clearly labeled "Uses API Credits"

### 6.2 Step 2 — Acquisition & Assemblage

**Purpose:** Track the land assemblage process from identification through closing.

**Components:**

**Assemblage Summary Dashboard:**
- Total parcels by status (identified / negotiating / under contract / closed)
- Total acreage (all vs. secured)
- Total cost (closed + under contract)
- Weighted average price per acre

**Parcel Tracker Table:**
- Fields: Parcel ID, Owner, Acreage, Current Zoning, Current Use, Asking Price, Offer Price, Status (Identified / Contacted / Negotiating / LOI / Under Contract / Closed / Declined), DD Deadline, Closing Date, Notes
- Add/edit/delete with inline forms
- Parcels can be pre-populated from Step 1's "Add to Assemblage" flow

**Land Basis Calculator:**
- Total Land Acquisition Cost (sum of closed parcels)
- Closing Costs (% input, default 2%)
- Carry Cost During Assemblage (rate × months × outstanding)
- Demolition/Site Clearing Estimate
- **Total Land Basis** → feeds directly into Proforma
- Price Per Acre, Price Per Buildable SF

**Acquisition Timeline:**
- Milestone tracker or Gantt-style view of parcel statuses and key dates

### 6.3 Steps 3-9 — Enhancement & Execution

These steps are currently placeholder screens with descriptions of what they will contain. Each shows the step name, a brief purpose statement, and a "Coming Soon" indicator with consistent light theme styling.

**Step 3 — Reimagination:** Highest & best use analysis, comp site research, concept development, use case scenarios.

**Step 4 — Project Identity:** Project naming, branding direction, narrative development, positioning statement, market story.

**Step 5 — Master Plan:** Land use plan with complementary uses, phasing strategy, density/FAR analysis, site plan inputs, parking, open space, amenities.

**Step 6 — Entitlements & Incentives:** Rezoning/variance tracker, public hearing timeline, community engagement strategy. Incentive programs: TIF/TAD, tax abatements, Opportunity Zones, LIHTC, NMTC, state programs. Includes existing OZ lookup functionality.

**Step 7 — Drivers & Users:** Anchor tenant identification, target user profiles, demand drivers, LOI tracker, pre-leasing/pre-sale pipeline.

**Step 8 — Infrastructure & Development:** Horizontal improvements scope (utilities, roads, grading), vertical construction considerations, phased delivery timeline and budget.

**Step 9 — Disposition:** Sale and ground lease strategy, buyer/developer pipeline, deal structuring, exit timing, marketing approach.

### 6.4 Proforma — Land Deal Financial Model

**Purpose:** Track the full financial lifecycle of a land enhancement deal.

**Sources:**
- Equity (developer + JV/LP)
- Debt (acquisition loan, development loan)
- Incentive proceeds

**Uses:**
- Land Acquisition (auto from Step 2 assemblage data)
- Closing & Carry Costs
- Entitlement & Soft Costs (legal, design, engineering, consulting)
- Infrastructure / Horizontal Development
- Vertical Construction (if applicable)
- Marketing & Disposition Costs
- Contingency
- Financing Costs (interest carry)

**Returns:**
- Gross Disposition Proceeds
- Net Proceeds (after disposition costs)
- Profit (net proceeds − total costs)
- IRR (time-weighted based on cash flow timeline)
- Equity Multiple
- Hold Period (months from first acquisition to final disposition)

**Key Financial Formulas:**

| Formula | Calculation |
|---------|-------------|
| Total Land Basis | Sum of parcel costs + closing + carry + demolition |
| Total Enhancement Cost | Entitlement + soft costs + infrastructure + contingency |
| Total Cost of Development (TCD) | Land Basis + Enhancement Cost + Financing Costs |
| Developer's Yield on TCD | NOI or Disposition Proceeds ÷ TCD |
| Implied Disposition Value | Based on per-acre/per-unit comps or cap rate |
| Gross Profit/Loss | Disposition Value − TCD |
| Equity Multiple | Total Distributions ÷ Total Equity Invested |
| Hold Period | First closing → final disposition (months) |

---

## 7. Persistent Financial Model

The financial model panel is always visible (collapsible bottom bar) and updates in real-time from any screen.

**Always displayed:**
- Total Land Basis (from Step 2)
- Total Enhancement Cost
- Total Cost of Development
- Projected Disposition Value
- Gross Profit/Loss
- Hold Period (months)

**Expandable:**
- Capital stack summary
- Cost breakdown by category
- Key return metrics (IRR, Equity Multiple)
- Traffic light health indicators

---

## 8. Technology Stack

### Frontend

| Component | Technology |
|-----------|------------|
| Framework | React 18 + Vite 5 |
| Styling | Tailwind CSS |
| Charts | Recharts |
| Mapping | React-Leaflet + CartoDB Positron tiles |
| Excel Export | SheetJS (xlsx) |
| Icons | lucide-react |
| State | React Context + Reducer (ProjectContext) |

### Environment Variables (.env)

```
VITE_FRED_API_KEY=required
VITE_CENSUS_API_KEY=optional_higher_rate_limits
VITE_BLS_API_KEY=optional_higher_rate_limits
VITE_RENTCAST_API_KEY=optional_50_free_monthly
VITE_REGRID_API_KEY=optional_nationwide_parcels
VITE_ANTHROPIC_API_KEY=optional_ai_analysis_only
```

---

## 9. Design System

### Theme: Light + Navy

- **Background:** Off-white `#F8FAFB` (not pure white)
- **Cards:** White `#FFFFFF` with border `#E2E8F0` and subtle shadow
- **Header & Nav:** Dark navy `#0F2440` — the one dark element
- **Text:** Primary `#0F172A`, Secondary `#475569`, Muted `#94A3B8`
- **Brand:** Navy `#0F2440`, Gold `#C5992E`, Blue `#2563EB`
- **Section accents:** Blue (Intelligence), Gold (Enhancement), Green (Execution)
- **Status:** Green `#059669`, Orange `#D97706`, Red `#DC2626`
- **Typography:** Instrument Sans (body), JetBrains Mono (data/numbers)
- **No gradients, no glows** — clean and flat
- **Charts:** Navy, blue, gold, green as data palette

---

## 10. Implementation Phases

### Phase 1: Foundation & Theme ✅ (in progress)
- Light + navy theme overhaul
- New 10-step navigation structure
- Placeholder screens for steps 3-9
- Header update with new app name

### Phase 2: Step 1 — Site Selection (highest priority)
- Project concept card with new fields
- Interactive tract map (reworked for land investor metrics)
- Demographics tabs (existing, restyled)
- New panels: Path of Progress, Zoning Snapshot, Infrastructure & Access
- Expanded Environmental panel
- Collapsible Macro Dashboard
- Development Activity panel

### Phase 3: Land Opportunity Scanner
- County GIS parcel overlay (zoom 14+)
- Parcel detail panel with opportunity signals
- Opportunity Score algorithm
- Parcel list view with filtering
- "Add to Assemblage" flow
- Vite proxy config for county endpoints

### Phase 4: Step 2 — Assemblage
- Parcel Tracker table with CRUD
- Land Basis Calculator
- Assemblage summary dashboard
- Acquisition timeline view
- Wire assemblage state to proforma

### Phase 5: Proforma (Land Deal Model)
- Rework financial model for land deal lifecycle
- Sources & Uses structure
- Auto-populate from assemblage data
- Disposition modeling
- IRR and equity multiple calculations

### Phase 6: Enhancement Steps (3-7)
- Build out each step's full functionality based on user feedback
- Priority order: Step 6 (Entitlements) → Step 5 (Master Plan) → Step 7 (Drivers) → Step 3 (Reimagination) → Step 4 (Identity)

### Phase 7: Execution Steps (8-9) & Polish
- Step 8: Infrastructure scope and budget
- Step 9: Disposition strategy and pipeline
- Excel export (multi-tab workbook)
- Performance optimization
- Error handling and loading states

---

## 11. Success Criteria

The MVP is successful when a user can:

1. Enter a location and instantly see tract-level demographic intelligence with growth corridor analysis
2. Zoom into a submarket and identify individual parcels with opportunity signals from county GIS data
3. Add flagged parcels to an assemblage tracker with pre-populated data
4. Track multi-parcel acquisition campaigns with status, pricing, and timelines
5. See the total land basis auto-calculate and flow into the proforma
6. Log Path of Progress entries, zoning context, and environmental due diligence
7. View a persistent financial model showing deal economics across all steps
8. Complete a site analysis and assemblage strategy in hours instead of weeks

---

## 12. Key Reference Files

| File | Purpose |
|------|---------|
| `.claude/PRD-v3.md` | This document — source of truth |
| `.claude/land-enhancement-overhaul.md` | Detailed overhaul prompt for Claude Code (theme, nav, Steps 1-2) |
| `.claude/land-opportunity-scanner.md` | Parcel intelligence layer spec |
| `.claude/county-gis-endpoints.md` | Verified ArcGIS REST endpoints and field mappings |
| `.claude/census-variables-reference.md` | Census ACS variable codes for demographics |
| `CLAUDE.md` | Claude Code operating instructions (to be updated) |

---

## 13. Important Rules

1. **This PRD is source of truth** — supersedes all previous versions
2. **No automatic Anthropic API calls** — AI analysis is optional and user-triggered only
3. **Free data first** — Census, county GIS, FRED, FEMA, EPA before any paid source
4. **County GIS parcel data is the key differentiator** — prioritize getting this right
5. **Everything cascades to the proforma** — land basis, enhancement costs, disposition proceeds
6. **Cache API results** — store in ProjectContext; don't re-fetch on navigation
7. **Start with Fulton County** — fully verified endpoint; extend to other counties incrementally
8. **Graceful degradation** — if a county GIS endpoint is unavailable, show manual input fallback
9. **Regrid is the paid fallback** — for counties without open GIS data
10. **2020 ACS for historical baseline** — not 2019, due to post-2020 Census redistricting
