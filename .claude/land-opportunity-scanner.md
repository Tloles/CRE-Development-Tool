# Land Opportunity Scanner — Data Intelligence Layer

Read `.claude/land-enhancement-overhaul.md` and `CLAUDE.md` for project context. This prompt adds a parcel-level data intelligence layer to Step 1 (Site Selection) that gives users visibility into land opportunities most investors miss.

---

## CONCEPT: The Land Opportunity Scanner

The core idea: when a user selects a location and views the census tract map, they should be able to go one layer deeper and see **individual parcels** within that area, flagged with opportunity signals. This combines our existing demographic/growth intelligence with parcel-level property data from county GIS systems.

Think of it as three layers of zoom:

1. **Market level** (existing) — Census tract map showing demographic trends, growth corridors, development signals
2. **Parcel level** (new) — Individual tax parcels within a selected tract, with property data from county GIS
3. **Opportunity flags** (new) — Algorithmic scoring that highlights parcels with assemblage potential, motivated seller signals, or redevelopment opportunity

---

## DATA SOURCES

### Source 1: County GIS ArcGIS REST APIs (FREE, no key needed)

Most Metro Atlanta counties expose parcel data through ArcGIS FeatureServer endpoints. These are public, free, and queryable via standard REST calls.

**Known endpoints to configure:**

```javascript
const COUNTY_GIS_ENDPOINTS = {
  // Fulton County (Atlanta, Sandy Springs, Roswell, Alpharetta, etc.)
  fulton: {
    parcels: 'https://gis.fultoncountyga.gov/arcgis/rest/services/Tax/TaxParcels/FeatureServer/0',
    zoning: 'https://gis.fultoncountyga.gov/arcgis/rest/services/Zoning/MapServer/0',
    name: 'Fulton County',
    fips: '13121',
  },
  // DeKalb County (Decatur, Brookhaven, Dunwoody, etc.)
  dekalb: {
    parcels: 'https://gisservices.dekalbcountyga.gov/arcgis/rest/services/Parcels/MapServer/0',
    name: 'DeKalb County',
    fips: '13089',
  },
  // Gwinnett County (Lawrenceville, Duluth, Norcross, etc.)
  gwinnett: {
    parcels: 'https://arcgis.gwinnettcounty.com/arcgis/rest/services/Parcels/MapServer/0',
    name: 'Gwinnett County',
    fips: '13135',
  },
  // Cobb County (Marietta, Smyrna, Kennesaw, etc.)
  cobb: {
    parcels: 'https://gismaps.cobbcountyga.gov/arcgis/rest/services/Parcels/MapServer/0',
    name: 'Cobb County',
    fips: '13067',
  },
}
```

**IMPORTANT:** These exact URLs may need verification at build time. The pattern for querying ArcGIS FeatureServer/MapServer is standardized:

```javascript
// Query parcels within a bounding box or polygon
async function queryCountyParcels(endpoint, geometry, outFields) {
  const params = new URLSearchParams({
    where: '1=1',
    geometry: JSON.stringify(geometry),
    geometryType: 'esriGeometryEnvelope', // or esriGeometryPolygon
    spatialRel: 'esriSpatialRelIntersects',
    outFields: outFields.join(','),
    returnGeometry: true,
    outSR: '4326', // WGS84 for Leaflet compatibility
    f: 'geojson',
    resultRecordCount: 500, // Max per page
  });

  const response = await fetch(`${endpoint}/query?${params}`);
  return await response.json();
}
```

**Typical fields available from county parcel layers:**

| Field | Description | Opportunity Signal |
|-------|-------------|-------------------|
| PARCEL_ID / PIN | Parcel identification number | Join key |
| OWNER_NAME | Current owner | Identify estate/trust/LLC patterns |
| LAND_VALUE / LAND_APPR | Assessed land value | Core metric |
| IMPR_VALUE / BLDG_APPR | Improvement (building) value | Low ratio = underimproved |
| TOTAL_VALUE / TOT_APPR | Total assessed value | |
| LAND_USE_CODE | County land use classification | Filter for vacant, residential, agricultural |
| ZONING | Current zoning designation | Identify mismatch with surroundings |
| ACRES / CALC_ACRES | Parcel acreage | Filter by minimum size |
| YEAR_BUILT | Year of primary structure | Aging structures = redevelopment signal |
| SALE_DATE / LAST_SALE | Date of last transfer | Long holds = potential motivation |
| SALE_PRICE / LAST_SALE_PR | Last recorded sale price | Basis for valuation |
| ADDRESS / SITUS_ADDR | Property street address | Display |

**NOTE:** Field names vary by county. The implementation should attempt to discover available fields by hitting the layer metadata endpoint (`/FeatureServer/0?f=json`) first, then map to standardized internal names.

### Source 2: County Tax Delinquent Records (scraping — Phase 2)

Counties publish tax delinquent property lists, typically as PDFs or HTML pages. These are public records. Cross-referencing these with the parcel data identifies motivated sellers.

**Do NOT build this in Phase 1.** Flag it as a future data source. The UI should have a placeholder indicating "Tax Delinquency Status: Data coming soon" in the parcel detail view.

### Source 3: Planning Commission / Rezoning Activity (scraping — Phase 2)

County planning commissions post agendas with rezoning applications, variance requests, and DRI filings. These are leading indicators of development pressure.

**Do NOT build this in Phase 1.** But design the UI to accommodate it. The "Path of Progress" panel from the overhaul prompt can include a "Rezoning Activity" sub-section that's initially manual input, later auto-populated.

---

## IMPLEMENTATION

### Phase 1: Parcel Overlay on Map (build this now)

#### 1.1 New Component: `ParcelOverlay.jsx`

A Leaflet layer that renders parcel polygons on top of the existing census tract map. This activates when the user zooms in past a certain threshold (e.g., zoom level 14+) so we don't try to load thousands of parcels at the county level.

**Behavior:**
- At zoom levels 10-13: Census tract polygons are visible (existing behavior)
- At zoom level 14+: Parcel polygons appear on top. Census tracts fade to a subtle outline.
- Parcels load dynamically based on the current map viewport (bounding box query to county GIS)
- Each parcel polygon is colored by a selectable metric (see 1.3)
- Clicking a parcel opens a detail sidebar/panel

**Technical approach:**
```javascript
// In the map component, listen for zoom and moveend events
map.on('zoomend moveend', () => {
  if (map.getZoom() >= 14) {
    const bounds = map.getBounds();
    const envelope = {
      xmin: bounds.getWest(),
      ymin: bounds.getSouth(),
      xmax: bounds.getEast(),
      ymax: bounds.getNorth(),
      spatialReference: { wkid: 4326 }
    };
    loadParcels(countyEndpoint, envelope);
  }
});
```

**Caching:** Cache fetched parcels by bounding box hash in a Map or object. Don't re-fetch if the viewport hasn't changed significantly. Use `resultRecordCount` pagination if needed (some ArcGIS services cap at 1000 records per request).

#### 1.2 Parcel Detail Panel

When a user clicks a parcel, show a detail panel (either a right sidebar or a slide-up panel on mobile) with:

**Header:**
- Parcel ID
- Address
- Owner Name
- Acreage

**Valuation:**
- Land Value
- Improvement Value
- Total Assessed Value
- **Improvement Ratio** = Improvement Value / Total Value (calculated)
  - < 20% flagged green: "Underimproved — potential redevelopment candidate"
  - 20-50% flagged yellow: "Partially improved"
  - > 50% flagged gray: "Improved property"

**Property Details:**
- Current Zoning
- Land Use Code (translated to human-readable)
- Year Built (if structure exists)
- Last Sale Date
- Last Sale Price

**Opportunity Signals** (auto-calculated):
- 🟢 **Underimproved:** Improvement ratio < 20%
- 🟢 **Vacant Land:** Land use code indicates vacant/unimproved
- 🟡 **Aging Structure:** Year built before 1970
- 🟡 **Long Hold:** Last sale date > 15 years ago
- 🔵 **Size Threshold:** Acreage > user's minimum (configurable)
- 🟠 **Assemblage Adjacent:** Shares a boundary with another flagged parcel (computed from geometry)

**Actions:**
- "Add to Assemblage" button → adds parcel to Step 2 Assemblage tracker with pre-populated data
- "Add to Watchlist" → saves to a local watchlist (ProjectContext state)

#### 1.3 Parcel Color-By Dropdown

When parcel view is active (zoom 14+), add a second dropdown (or change the existing one) for parcel-level coloring:

| Metric | Color Logic |
|--------|-------------|
| Improvement Ratio | Low (green) → High (gray). Low = opportunity |
| Assessed Value / Acre | Sequential navy → gold. Shows relative land value |
| Year Built | Old (warm/red) → New (cool/blue). Old = redevelopment |
| Last Sale Date | Long ago (green) → Recent (gray). Long hold = potential motivation |
| Acreage | Small (light) → Large (dark). Highlights bigger parcels |
| Opportunity Score | Composite of signals above. High (green) → Low (gray) |

#### 1.4 Opportunity Score Algorithm

Calculate a simple composite score for each parcel (0-100):

```javascript
function calculateOpportunityScore(parcel, userPrefs) {
  let score = 0;

  // Vacant or underimproved (biggest signal for land investors)
  const improvementRatio = parcel.improvementValue / parcel.totalValue;
  if (improvementRatio < 0.05) score += 30;      // Essentially vacant
  else if (improvementRatio < 0.20) score += 20;  // Underimproved
  else if (improvementRatio < 0.40) score += 10;  // Partially improved

  // Size meets minimum threshold
  if (parcel.acres >= (userPrefs.minAcres || 1)) score += 15;

  // Long hold period (owner may be ready to sell)
  const yearsHeld = yearsSince(parcel.lastSaleDate);
  if (yearsHeld > 20) score += 15;
  else if (yearsHeld > 10) score += 10;
  else if (yearsHeld > 5) score += 5;

  // Aging structure (redevelopment candidate)
  if (parcel.yearBuilt && parcel.yearBuilt < 1970) score += 10;
  else if (parcel.yearBuilt && parcel.yearBuilt < 1990) score += 5;

  // In a high-growth census tract (cross-reference with existing tract data)
  if (parcel.tractGrowthScore > 0.7) score += 15; // top 30% growth
  else if (parcel.tractGrowthScore > 0.5) score += 10;

  // Zoning mismatch (e.g., residential zoning in area trending commercial)
  // This is harder to compute — placeholder for now
  // if (parcel.zoningMismatch) score += 10;

  return Math.min(score, 100);
}
```

The user can configure `minAcres` and other preferences in a small filter panel above the parcel list.

#### 1.5 Parcel List View

Below the map (or in a toggleable panel), show a sortable table of parcels currently visible on the map:

```
Parcels in View (47 found)                    [ Filter ] [ Export CSV ]

| Score | Address        | Acres | Owner          | Value   | Impr% | Signals          |
|-------|----------------|-------|----------------|---------|-------|------------------|
| 85    | 1234 Main St   | 3.4   | Smith Trust    | $420K   | 8%    | 🟢 Vacant 🟡 Long |
| 72    | 5678 Oak Ave   | 1.8   | Jones LLC      | $280K   | 12%   | 🟢 Under 🔵 Size  |
| 65    | 910 Pine Rd    | 5.1   | Davis Family   | $890K   | 35%   | 🟡 Aging 🔵 Size   |
```

Clicking a row highlights the parcel on the map and opens the detail panel. Sortable by any column.

**Filter options:**
- Minimum acreage
- Maximum assessed value
- Minimum opportunity score
- Vacant only toggle
- Land use type (multi-select)
- Zoning designation (multi-select)

#### 1.6 "Add to Assemblage" Flow

When the user clicks "Add to Assemblage" on a parcel:

1. Pre-populate the Step 2 parcel form with data from the GIS query:
   - Parcel ID → parcelId
   - Owner Name → owner
   - Acreage → acreage
   - Zoning → currentZoning
   - Last Sale Price → reference price (informational, not the offer)
   - Land Use → currentUse

2. Dispatch `ADD_PARCEL` to ProjectContext

3. Show a toast notification: "Added to Assemblage — 3 parcels tracked"

4. The user can then go to Step 2 to fill in offer price, status, dates, and notes

---

### Phase 2: Enhanced Data Sources (future — do NOT build now)

These are placeholders in the architecture. Design the UI to accommodate them but don't implement the data fetching yet.

#### 2.1 Tax Delinquency Overlay

- Source: County tax collector websites (scraping)
- Display: Red border/hatch pattern on delinquent parcels
- Detail panel: Shows delinquent amount, years delinquent
- Implementation: Requires a backend/serverless function to periodically scrape and cache delinquent lists, cross-referenced by parcel ID

#### 2.2 Rezoning & Permit Activity Feed

- Source: County planning commission agendas and meeting minutes
- Display: Blue pins on parcels with active rezoning applications
- Detail: Application type, requested change, hearing date, status
- Implementation: Either manual input initially (the Path of Progress panel already supports this) or automated scraping of municipal agenda PDFs

#### 2.3 Ownership Network Analysis

- Source: County property records + Secretary of State LLC filings
- Display: Highlight parcels owned by the same entity/individual
- Use case: If one owner holds 5 adjacent parcels, they may be more motivated to sell as a package — or they may be assembling themselves (competitor intelligence)
- Implementation: String matching + entity resolution on owner names

#### 2.4 Listing Aggregation

- Source: LandWatch, LoopNet, Crexi, Land.com (scraping — review terms of service)
- Display: Green border on parcels that are actively listed for sale
- Detail: Listing price, listing date, broker, days on market
- Implementation: Apify scrapers or custom scraping, matched to parcels by address/geocoding

---

## STATE MANAGEMENT

Add to ProjectContext's initialState:

```javascript
// In siteSelection or as a top-level section:
parcelIntelligence: {
  // Cached parcel data by county
  cache: {},  // { [countyFips]: { parcels: [], fetchedAt: timestamp, bounds: {} } }

  // User preferences for opportunity scoring
  preferences: {
    minAcres: 1,
    maxAssessedValue: null,
    minOpportunityScore: 0,
    landUseFilter: [],   // empty = show all
    zoningFilter: [],     // empty = show all
    vacantOnly: false,
  },

  // Watchlist (parcels the user wants to track but hasn't added to assemblage)
  watchlist: [],  // array of parcel IDs with county reference

  // County GIS endpoint configuration (can be extended by user)
  countyEndpoints: COUNTY_GIS_ENDPOINTS, // from config
},
```

New reducer actions:

```javascript
case 'SET_PARCEL_CACHE':      // payload: { countyFips, parcels, bounds }
case 'UPDATE_PARCEL_PREFS':   // payload: partial preferences object
case 'ADD_TO_WATCHLIST':      // payload: { parcelId, countyFips, data }
case 'REMOVE_FROM_WATCHLIST': // payload: parcelId
```

---

## PROXY CONFIGURATION

The county GIS endpoints are external APIs that will hit CORS restrictions. Add them to `vite.config.js`:

```javascript
// Add to existing proxy config
'/api/gis-fulton': {
  target: 'https://gis.fultoncountyga.gov',
  changeOrigin: true,
  rewrite: (path) => path.replace(/^\/api\/gis-fulton/, ''),
},
'/api/gis-dekalb': {
  target: 'https://gisservices.dekalbcountyga.gov',
  changeOrigin: true,
  rewrite: (path) => path.replace(/^\/api\/gis-dekalb/, ''),
},
'/api/gis-gwinnett': {
  target: 'https://arcgis.gwinnettcounty.com',
  changeOrigin: true,
  rewrite: (path) => path.replace(/^\/api\/gis-gwinnett/, ''),
},
'/api/gis-cobb': {
  target: 'https://gismaps.cobbcountyga.gov',
  changeOrigin: true,
  rewrite: (path) => path.replace(/^\/api\/gis-cobb/, ''),
},
```

---

## UI INTEGRATION WITH EXISTING MAP

The parcel layer integrates into the existing Leaflet map in Step 1. Key integration points:

1. **Zoom-level toggle:** At zoom 14+, show a small indicator: "Parcel data available — loading [County Name] parcels..."
2. **Color-by dropdown:** When parcels are visible, the dropdown should switch from tract metrics to parcel metrics. Or add a second dropdown that appears only at parcel zoom level.
3. **Split interaction:** At tract zoom, clicking selects a tract (existing). At parcel zoom, clicking selects a parcel (new). The demographics tabs continue to show tract-level data for context.
4. **Legend:** Update the color legend to reflect parcel-level metric when in parcel view.

---

## IMPLEMENTATION ORDER

1. **Endpoint discovery:** Hit each county's ArcGIS REST endpoint to verify URLs and discover available fields. Log the field names. Build a field mapping config.
2. **Parcel fetch utility:** Build `src/utils/countyGIS.js` with functions to query parcel data by bounding box, handle pagination, and normalize field names.
3. **Vite proxy config:** Add proxy entries for each county endpoint.
4. **ParcelOverlay component:** Leaflet GeoJSON layer that renders parcel polygons, colored by selected metric.
5. **Parcel detail panel:** Slide-out or sidebar showing parcel info + opportunity signals.
6. **Opportunity score calculator:** Implement the scoring algorithm in a utility function.
7. **Parcel list view:** Sortable/filterable table below the map.
8. **Add to Assemblage flow:** Wire up the button to dispatch parcels to Step 2 state.
9. **Cache + performance:** Implement bounding box caching and pagination.

**Build steps 1-5 now. Steps 6-9 can follow in a subsequent prompt.**

---

## IMPORTANT NOTES

- **ArcGIS endpoint URLs will need verification.** The URLs listed above are educated guesses based on common Georgia county patterns. The first task is to hit each endpoint's metadata URL (`?f=json`) and confirm it returns layer info. If a URL is wrong, search for the county's ArcGIS REST services directory (usually at `https://gis.[county].gov/arcgis/rest/services/`).

- **Field names vary by county.** Fulton might call it `OWNER_NAME`, DeKalb might call it `OWNER`. The implementation must handle this with a field mapping config per county.

- **Record limits.** ArcGIS services typically cap at 1000-2000 records per query. For dense urban areas at high zoom, you may need to paginate using `resultOffset` and `resultRecordCount`.

- **Rate limiting.** These are public services. Don't hammer them. Cache aggressively. Only fetch when the viewport changes meaningfully (debounce map move events, ~500ms).

- **Start with Fulton County.** It has the most complete open data portal. Get it working for Fulton first, then extend to other counties.

- **Graceful degradation.** If a county endpoint is unavailable or doesn't exist for the user's location, show: "Parcel data not available for [County Name]. You can manually add parcels in Step 2 (Assemblage)."
