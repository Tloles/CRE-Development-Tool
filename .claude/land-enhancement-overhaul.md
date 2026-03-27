# Land Enhancement & Acceleration Platform — Complete Overhaul

Read `CLAUDE.md`, `.claude/PRD.md`, and `.claude/census-variables-reference.md` for existing context. This prompt reframes the entire application. **This is the new source of truth — it supersedes the old PRD.**

---

## THE PIVOT

This app is no longer a general CRE development feasibility tool. It is now a **Land Enhancement & Acceleration Platform** — purpose-built for a proactive land investment strategy.

### The Business Model We Support

We focus on assembling, master planning, entitling, incentivizing, branding, and developing strategically-located land tracts in both urban and suburban locations.

**Traditional (passive) land strategy:** Buy land in a growth corridor → put up a sign → wait 5-10 years → sell when the market matures.

**Our "Enhancement & Acceleration" model (what this tool supports):**

1. Select a site based on comprehensive due diligence analysis
2. Initiate land acquisition and assemblage
3. Start the "Reimagination Process" — reimagine what the land could be
4. Determine a project name and identity
5. Devise a master plan with complementary land uses
6. Negotiate entitlements and incentives (often major rezoning)
7. Identify primary drivers and potential users
8. Develop infrastructure when appropriate
9. Sell or ground lease to users and developers

Each step in the app maps directly to one of these phases.

---

## THEME OVERHAUL — Light + Navy

**Replace the entire dark theme with a clean, professional light theme.** This is a complete `index.css` rewrite of the `@theme` block and body styles.

### New Color System

```css
@theme {
  /* Backgrounds */
  --color-bg-primary: #F8FAFB;
  --color-bg-surface: #FFFFFF;
  --color-bg-card: #FFFFFF;
  --color-bg-card-hover: #F1F5F9;
  --color-bg-nav: #0F2440;

  /* Borders */
  --color-border-default: #E2E8F0;
  --color-border-subtle: #F1F5F9;
  --color-border-strong: #CBD5E1;

  /* Brand Colors */
  --color-navy: #0F2440;
  --color-navy-light: #1E3A5F;
  --color-navy-muted: #334766;
  --color-gold: #C5992E;
  --color-gold-dim: #A67F1A;
  --color-gold-bright: #D4A843;
  --color-blue: #2563EB;
  --color-blue-light: #3B82F6;

  /* Section Accents */
  --color-accent-intelligence: #2563EB;
  --color-accent-enhancement: #C5992E;
  --color-accent-execution: #059669;

  /* Status */
  --color-healthy: #059669;
  --color-caution: #D97706;
  --color-warning: #DC2626;

  /* Text */
  --color-text-primary: #0F172A;
  --color-text-secondary: #475569;
  --color-text-muted: #94A3B8;
  --color-text-on-navy: #F1F5F9;
  --color-text-on-navy-muted: #94A3B8;

  /* Typography */
  --font-sans: "Instrument Sans", ui-sans-serif, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;
}

body {
  margin: 0;
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
}
```

### Design Principles

- **Background:** Soft off-white (`#F8FAFB`), NOT pure white
- **Cards:** White with subtle border (`#E2E8F0`) and very light shadow (`box-shadow: 0 1px 3px rgba(0,0,0,0.06)`)
- **Header & Nav:** Dark navy (`#0F2440`) — this is the ONE dark element. White/light text on navy.
- **Active nav items:** Gold accent on navy background
- **Section color coding:** Blue (Intelligence steps 1-2), Gold (Enhancement steps 3-7), Green (Execution steps 8-9 + Proforma)
- **No gradients, no glows, no effects** — clean and flat
- **Data cards:** Light gray background (`#F8FAFB`) with navy headers
- **Input fields:** White background, `#E2E8F0` border, slight border-radius
- **Hover states:** Subtle — `#F1F5F9` background shift, not dramatic color changes
- **Charts (Recharts):** Use navy (`#0F2440`), blue (`#2563EB`), gold (`#C5992E`), and green (`#059669`) as the data palette

### Component-Level Updates

Every component currently using dark theme classes needs updating. Key patterns to find-and-replace:

| Old Pattern | New Pattern |
|-------------|-------------|
| `bg-bg-primary` (dark `#0B0F1A`) | `bg-bg-primary` (now `#F8FAFB`) |
| `bg-bg-surface` (dark) | `bg-bg-surface` (now white) |
| `bg-bg-card` (dark) | `bg-bg-card` (now white) + add `shadow-sm border border-border-default` |
| `text-text-primary` (light text) | `text-text-primary` (now dark `#0F172A`) |
| `text-text-secondary` | `text-text-secondary` (now `#475569`) |
| `text-text-muted` | `text-text-muted` (now `#94A3B8`) |
| `text-gold` | `text-gold` (still works, now `#C5992E`) |
| `border-border-default` (dark) | `border-border-default` (now `#E2E8F0`) |
| `bg-gold/10` | `bg-gold/10` (still works on light) |
| `bg-blue/10` | `bg-blue/10` (still works on light) |

**Header specifically:** Keep it dark navy. The header should use `bg-navy` with `text-text-on-navy`.

**Cards pattern:** All card containers should be: `bg-bg-card rounded-xl border border-border-default shadow-sm p-5`

**Scrollbar:** Update to light theme:
```css
::-webkit-scrollbar-track { background: var(--color-bg-primary); }
::-webkit-scrollbar-thumb { background: var(--color-border-strong); border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: var(--color-text-muted); }
```

---

## NEW NAVIGATION STRUCTURE

Replace the old 11-step navigator with this structure:

### Steps

| # | Name | Section | Accent Color | Icon (lucide) |
|---|------|---------|-------------|----------------|
| 1 | Site Selection | Intelligence | Blue | `Search` |
| 2 | Assemblage | Intelligence | Blue | `Layers` |
| 3 | Reimagination | Enhancement | Gold | `Sparkles` |
| 4 | Identity | Enhancement | Gold | `Fingerprint` |
| 5 | Master Plan | Enhancement | Gold | `LayoutDashboard` |
| 6 | Entitlements | Enhancement | Gold | `Scale` |
| 7 | Drivers & Users | Enhancement | Gold | `Users` |
| 8 | Infrastructure | Execution | Green | `Hammer` |
| 9 | Disposition | Execution | Green | `ArrowRightLeft` |
| P | Proforma | Execution | Green | `Calculator` |

### Navigator UI

The navigator should be a horizontal bar with the dark navy background (same as header, or slightly lighter navy). Each step is a clickable button showing its number and name.

```
[ 1 Site Selection ] [ 2 Assemblage ] [ 3 Reimagination ] [ 4 Identity ] [ 5 Master Plan ] [ 6 Entitlements ] [ 7 Drivers ] [ 8 Infrastructure ] [ 9 Disposition ] [ Proforma ]
```

- **Active step:** Section accent color background (blue/gold/green) with white text
- **Inactive steps:** Transparent with `text-text-on-navy-muted`, hover shows slight lighten
- **Step number badge:** Small circle with the number, filled with accent color when active
- **Section dividers:** Subtle vertical line or extra gap between sections (after step 2, after step 7)

### App.jsx Updates

- Replace all 11 step imports with the new 10 components (Steps 1-9 + Proforma)
- Update `stepComponents` mapping
- Keep the `ProjectProvider` wrapper, `Header`, `StepNavigator`, `FinancialModelPanel` structure

### StepNavigator.jsx Updates

Replace the `steps` array entirely. Use the new step definitions. Replace `layerColors` with three sections:
```javascript
const sectionColors = {
  intelligence: 'accent-intelligence',  // blue
  enhancement: 'accent-enhancement',    // gold
  execution: 'accent-execution',        // green
}
```

---

## STEP 1: SITE SELECTION & DUE DILIGENCE

**This is the highest priority screen.** It inherits and significantly reworks the existing submarket intelligence features, reframed through a land investor's lens.

### Layout

Full-width page with these panels stacked vertically:

```
┌─────────────────────────────────────────────────────────┐
│ Project Concept (name, location, description, site size)│
├─────────────────────────────────────────────────────────┤
│ Interactive Census Tract Map (full width, 450px tall)   │
│ Color-by dropdown + legend                              │
├──────────────────────────┬──────────────────────────────┤
│ Demographics Tabs        │ Path of Progress             │
│ (existing 5-tab panel)   │ (new panel)                  │
├──────────────────────────┼──────────────────────────────┤
│ Environmental & Geotech  │ Zoning Snapshot              │
│ (expanded from existing) │ (new panel)                  │
├──────────────────────────┼──────────────────────────────┤
│ Infrastructure & Access  │ Development Activity         │
│ (new panel)              │ (reworked Supply Pipeline)    │
├─────────────────────────────────────────────────────────┤
│ Macro Dashboard (collapsible, secondary)                │
├─────────────────────────────────────────────────────────┤
│ AI Analysis Panel (optional, user-triggered)            │
└─────────────────────────────────────────────────────────┘
```

### What to keep and rework:

**1. Interactive Census Tract Map** — Keep Leaflet + CartoDB Positron + clickable tract polygons. Regroup the color-by metrics for land investors:

**Growth Corridors (primary — this is what land investors look at first):**
- Population Growth % (5yr)
- Income Growth % (5yr)
- Home Value Growth % (5yr)
- Rent Growth % (5yr)
- Building Permit Velocity

**Current Snapshot:**
- Median Income, Home Value, Median Rent, Vacancy Rate, Population Density, Renter %, Median Age

**Development Signals:**
- Cost-Burdened Renters %, Housing Stock Age (median year built), WFH %, Professional Degree %, Gini Index, Poverty Rate

Keep the diverging red-white-green scale for growth metrics. Use a navy-to-gold sequential scale for snapshot/signal metrics instead of the old gold-to-navy.

**2. Demographics Tabs** — Keep the 5-tab structure (Overview, Income, Housing, Population, Workforce) with tract vs. comparison columns. Update all styling to light theme.

**3. Environmental Panel** — Keep FEMA + EPA. Expand with manual input fields:
- Phase I ESA Status (dropdown: Not Started / Ordered / Clean / RECs Identified / Phase II Needed)
- Geotechnical Status (dropdown: Not Started / Ordered / Favorable / Concerns Identified)
- Wetlands/Waters (text input, guidance: "Source: USACE, National Wetlands Inventory")
- Topography Notes (text area)

**4. Supply Pipeline → "Development Activity"** — Keep building permits + manual competing projects tracker. Rename panel.

**5. Macro Dashboard** — Keep FRED indicators but make collapsible/accordion. Not the primary view for land deals.

### What to add (new panels):

**6. Path of Progress** (critical for land strategy):
A table/list where the user logs growth indicators they've researched:

| Field | Type | Options |
|-------|------|---------|
| Description | Text | "e.g., Peachtree Corners Town Center — $200M mixed-use" |
| Category | Dropdown | Major Development, Infrastructure, Employer, Institutional, Municipal Action, Other |
| Investment/Scale | Text | "e.g., $200M, 500 units, 2,000 jobs" |
| Distance from Site | Text | "e.g., 1.2 miles" |
| Status | Dropdown | Announced, Under Construction, Completed, Planned |
| Impact | Dropdown | Low, Medium, High |
| Source | Text | "e.g., Atlanta Business Chronicle, 2/15/2026" |

Each entry is a row in a table. Add/edit/delete functionality. Store in ProjectContext as `pathOfProgress: []`.

**7. Zoning Snapshot:**
Manual input card for current zoning context:
- Current Zoning (text: "e.g., R-140, C-2, M-1")
- Permitted Uses (text area)
- Max Density/FAR (number)
- Max Height (number + unit toggle: feet/stories)
- Setbacks (4 number fields: front, rear, side, side)
- Overlay Districts (text)
- Minimum Lot Size (number + unit)
- Source note: small gray text "Source: municipal zoning map, county GIS"
- Contextual note: "This is what you CAN do today. Step 6 (Entitlements) is where you plan what you WANT to do."

**8. Infrastructure & Access:**
Manual input card:
- Interstate/Highway Proximity (distance + name)
- Nearest Transit (distance + type dropdown: Bus / Rail / BRT / None)
- Road Frontage (number, feet)
- ADT — Average Daily Traffic (number, with source field)
- Ingress/Egress Points (number + description)
- Utility Availability (checklist, each utility is a dropdown):
  - Water: Available at Site / Available Nearby / Not Available / Unknown
  - Sewer: same options
  - Electric: same options
  - Natural Gas: same options
  - Fiber: same options

Store all in ProjectContext.

### Project Concept Updates

Update the project definition card at the top. Change fields to:
- Project Name (text)
- Location / Address (text — feeds geocoder)
- Site Description (text area — "Brief description of the site and your investment thesis")
- Total Acreage (number)
- Target Acquisition Price (currency input)
- Current Use (dropdown: Vacant Land, Agricultural, Single-Family Residential, Commercial, Industrial, Mixed, Other)

---

## STEP 2: ACQUISITION & ASSEMBLAGE

A new screen for tracking the land assemblage process.

### Layout

```
┌─────────────────────────────────────────────────────────┐
│ Assemblage Summary (total parcels, total acres, total $)│
├─────────────────────────────────────────────────────────┤
│ Parcel Tracker Table                                    │
│ [ + Add Parcel ]                                        │
│                                                         │
│ | Parcel ID | Owner | Acres | Zoning | Ask $ | Status | │
│ | 15-001    | Smith | 4.2   | R-140  | $1.2M | LOI    | │
│ | 15-002    | Jones | 2.8   | R-140  | $890K | Under  | │
│ |           |       |       |        |       | Contract│ │
├──────────────────────────┬──────────────────────────────┤
│ Acquisition Timeline     │ Land Basis Calculator        │
│ (Gantt-style or          │                              │
│  milestone tracker)      │ Total Land Cost: $X          │
│                          │ Closing Costs: $X            │
│                          │ Carry During Assemblage: $X  │
│                          │ Total Land Basis: $X         │
│                          │ Price Per Acre: $X           │
│                          │ Price Per SF: $X             │
└──────────────────────────┴──────────────────────────────┘
```

### Parcel Tracker

Each parcel entry has:
| Field | Type | Notes |
|-------|------|-------|
| Parcel ID | Text | County tax parcel number |
| Owner | Text | Current owner name |
| Acreage | Number | |
| Current Zoning | Text | |
| Current Use | Dropdown | Same options as project concept |
| Asking Price | Currency | |
| Offer Price | Currency | |
| Status | Dropdown | Identified / Contacted / Negotiating / LOI / Under Contract / Closed / Declined |
| Due Diligence Deadline | Date | |
| Closing Date | Date | |
| Notes | Text area | |

Auto-calculate from parcel data:
- Total parcels by status
- Total acreage (all parcels vs. closed/under contract)
- Total cost (closed + under contract)
- Weighted average price per acre

### Land Basis Calculator

Auto-populated from parcel data + manual inputs:
- Total Land Acquisition Cost (sum of closed parcel prices)
- Estimated Closing Costs (% input, default 2%)
- Carry Cost During Assemblage (monthly rate × months × outstanding balance)
- Demolition/Site Clearing Estimate (manual currency input)
- **Total Land Basis** (sum of above)
- **Price Per Acre** (total basis ÷ total acres)
- **Price Per Buildable SF** (total basis ÷ buildable SF — requires FAR input from Step 5)

This total land basis feeds directly into the Proforma.

### State Shape

```javascript
assemblage: {
  parcels: [
    {
      id: 'uuid',
      parcelId: '15-001',
      owner: 'Smith Family Trust',
      acreage: 4.2,
      currentZoning: 'R-140',
      currentUse: 'Single-Family Residential',
      askingPrice: 1200000,
      offerPrice: 1050000,
      status: 'LOI',
      ddDeadline: '2026-06-15',
      closingDate: null,
      notes: 'Motivated seller, estate sale'
    }
  ],
  closingCostPercent: 2,
  carryRate: 6.5,
  demolitionEstimate: 0,
}
```

---

## STEPS 3-9: PLACEHOLDER SCREENS

For Steps 3 through 9, create simple placeholder components. Each should display:
- The step name and number as a header
- A brief description of what this step will contain (from the business model above)
- A "Coming Soon" indicator
- Consistent card styling with the new light theme

This lets us get the navigation and structure working before building out each step's full functionality.

### Step 3: Reimagination
"The creative visioning step — reimagine what this land could become. Comp analysis, highest & best use exploration, concept development."

### Step 4: Project Identity
"Project naming, branding direction, narrative development, positioning statement, and market story."

### Step 5: Master Plan
"Land use plan with complementary uses, phasing strategy, density/FAR analysis, site plan inputs, parking, open space, and amenities."

### Step 6: Entitlements & Incentives
"Zoning/rezoning tracker, variance applications, public hearing timeline, community engagement strategy. Incentive programs: TIF/TAD, tax abatements, Opportunity Zones, LIHTC, NMTC, state programs."

### Step 7: Drivers & Users
"Identify anchor tenants, target user profiles, demand drivers, LOI tracker, and pre-leasing/pre-sale pipeline."

### Step 8: Infrastructure & Development
"Horizontal improvements scope, utilities, roads, grading. Vertical construction considerations. Phased delivery timeline and budget."

### Step 9: Disposition
"Sale and ground lease strategy, buyer/developer pipeline, deal structuring, exit timing, and marketing approach."

---

## PROFORMA: LAND DEAL FINANCIAL MODEL

Keep the existing proforma concept but reframe it for land deals specifically. The financial model should track:

**Sources:**
- Equity (developer + JV/LP)
- Debt (acquisition loan, development loan)
- Incentive proceeds

**Uses:**
- Land Acquisition (flows from Step 2 assemblage data)
- Closing & Carry Costs
- Entitlement & Soft Costs (legal, design, engineering, consulting)
- Infrastructure / Horizontal Development
- Vertical Construction (if applicable)
- Marketing & Disposition Costs
- Contingency
- Financing Costs (interest carry)

**Returns:**
- Gross Disposition Proceeds (total sale/lease value)
- Net Proceeds (after disposition costs)
- Profit (net proceeds − total costs)
- IRR (time-weighted based on cash flow timeline)
- Equity Multiple
- Hold Period (months from first acquisition to final disposition)

For now, keep the existing Proforma components and restyle them to light theme. We will refactor the actual financial model in a future prompt once the structure and first two steps are solid.

---

## STATE MANAGEMENT UPDATES

### New initialState.js

Replace the current state shape. Keep `macro`, `financial`, `aiAnalysis`, and `research` sections. Add new sections:

```javascript
export const initialState = {
  currentStep: 1,

  // Project definition (updated fields)
  project: {
    name: '',
    location: '',
    description: '',
    totalAcreage: null,
    targetAcquisitionPrice: null,
    currentUse: '',
  },

  // Step 1: Site Selection data
  siteSelection: {
    // Geocoded location data
    geocoded: null, // { state, county, tract, lat, lng, geoid }

    // Path of Progress entries
    pathOfProgress: [],

    // Zoning Snapshot
    zoning: {
      currentZoning: '',
      permittedUses: '',
      maxDensityFAR: null,
      maxHeight: null,
      heightUnit: 'feet',
      setbacks: { front: null, rear: null, sideLeft: null, sideRight: null },
      overlayDistricts: '',
      minLotSize: null,
      source: '',
    },

    // Infrastructure & Access
    infrastructure: {
      highwayProximity: { distance: '', name: '' },
      nearestTransit: { distance: '', type: '' },
      roadFrontage: null,
      adt: null,
      adtSource: '',
      ingressEgress: { count: null, description: '' },
      utilities: {
        water: 'Unknown',
        sewer: 'Unknown',
        electric: 'Unknown',
        gas: 'Unknown',
        fiber: 'Unknown',
      },
    },

    // Environmental (expanded)
    environmental: {
      phaseIStatus: 'Not Started',
      geotechStatus: 'Not Started',
      wetlands: '',
      topographyNotes: '',
      // FEMA + EPA data stored in research cache
    },
  },

  // Step 2: Assemblage
  assemblage: {
    parcels: [],
    closingCostPercent: 2,
    carryRate: 6.5,
    demolitionEstimate: 0,
  },

  // Keep existing sections
  macro: { /* same as current */ },
  financial: { /* same as current — will be refactored later */ },
  aiAnalysis: { /* same as current */ },
  research: { /* same as current */ },

  // Supply pipeline / development activity
  competingProjects: [], // already exists, keep it

  // Steps 3-9 state (placeholder — will be expanded later)
  reimagination: {},
  identity: {},
  masterPlan: {},
  entitlements: {},
  driversAndUsers: {},
  infrastructure: {},
  disposition: {},
}
```

### New Reducer Actions

Add these to `projectReducer.js`:

```javascript
// Site Selection
case 'SET_GEOCODED': // payload: { state, county, tract, lat, lng, geoid }
case 'ADD_PATH_OF_PROGRESS': // payload: entry object
case 'UPDATE_PATH_OF_PROGRESS': // payload: { id, ...updates }
case 'REMOVE_PATH_OF_PROGRESS': // payload: id
case 'UPDATE_ZONING': // payload: partial zoning object
case 'UPDATE_INFRASTRUCTURE': // payload: partial infrastructure object
case 'UPDATE_ENVIRONMENTAL': // payload: partial environmental object

// Assemblage
case 'ADD_PARCEL': // payload: parcel object
case 'UPDATE_PARCEL': // payload: { id, ...updates }
case 'REMOVE_PARCEL': // payload: id
case 'UPDATE_ASSEMBLAGE_SETTINGS': // payload: { closingCostPercent?, carryRate?, demolitionEstimate? }
```

---

## HEADER UPDATE

Update the header text:
- App name: **"Land Enhancement Platform"** (or shorter: **"LEP"**)
- Subtitle/tagline: "Enhancement & Acceleration Model"
- Keep the project name display if one is entered
- Navy background with white text, gold accent for the app name

---

## IMPLEMENTATION ORDER

**Do this in sequence. Complete each phase before moving to the next.**

### Phase 1: Theme + Navigation (do first)
1. Rewrite `index.css` with the new light + navy color system
2. Rewrite `StepNavigator.jsx` with the 10 new steps
3. Update `Header.jsx` with new app name and navy styling
4. Update `App.jsx` with new step component mapping (use placeholders for steps 3-9)
5. Update all existing card/panel components to use light theme patterns (white cards, subtle shadows, dark text)

### Phase 2: Step 1 — Site Selection (highest priority)
1. Create `Step1SiteSelection.jsx` — the main page container with the layout above
2. Rework the project concept card with new fields (acreage, acquisition price, current use)
3. Move and restyle the interactive tract map, demographics tabs, environmental panel, and development activity panel
4. Build the new Path of Progress panel
5. Build the new Zoning Snapshot panel
6. Build the new Infrastructure & Access panel
7. Make the Macro Dashboard collapsible

### Phase 3: Step 2 — Assemblage
1. Create `Step2Assemblage.jsx`
2. Build the Parcel Tracker table with add/edit/delete
3. Build the Land Basis Calculator
4. Wire up the assemblage state and reducer actions

### Phase 4: Placeholders + Proforma
1. Create placeholder components for Steps 3-9
2. Restyle the existing Proforma and Exit components to light theme
3. Ensure the FinancialModelPanel works with the new state shape

**Build Phase 1 now. Then stop and I'll review before Phase 2.**
