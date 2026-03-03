Read CLAUDE.md for context. Fix the Supply Pipeline panel and add a manual competing projects tracker.

## 1. Fix Census Building Permits — County Level

The current Supply Pipeline shows national-level data. Fix it to show county-level data. The Census Building Permits Survey API supports county-level queries.

The correct endpoint format:
https://api.census.gov/data/timeseries/bps/hunit?get=PERMITS,UNITS&for=county:COUNTY_CODE&in=state:STATE_CODE&time=2025&category_code=TOTAL

If that exact format doesn't work, try these alternatives:
- https://api.census.gov/data/timeseries/eits/bps?get=PERMITS&for=county:COUNTY_CODE&in=state:STATE_CODE&time=from+2023-01&category_code=TOTAL
- Check the Census BPS API documentation at https://api.census.gov/data/timeseries/bps.html for the correct parameters

We need:
- Total residential permits by month for the county (last 12-24 months)
- Breakdown: single-family (1 unit) vs multi-family (2+ units, ideally 5+ units)
- Use category_code values: TOTAL, 1-UNIT, 2-UNITS, 3-4 UNITS, 5+ UNITS

Display as:
- A line chart showing monthly permit trends (total, single-family, multi-family as separate lines)
- Current month headline: "DeKalb County: 142 residential permits (last month)"
- YoY change: "↑ 12% vs same month last year"
- Ratio callout: "62% single-family / 38% multi-family" — this ratio matters for understanding what the market is building

If county-level fails, fall back to CBSA/metro level, then state level. Always show what geography level the data represents.

## 2. Add Manual Competing Projects Tracker

Below the permit trends, add a "Competing Developments" section where users can manually log projects they've found from CoStar, brokerage reports, or driving the market.

### UI Layout

```
Competing Developments                          [ + Add Project ]

Guidance: Log nearby competing projects from CoStar, brokerage
reports, or local market knowledge.

| Name         | Type        | Units | Status          | Delivery |
|--------------|-------------|-------|-----------------|----------|
| Broadstone   | Multifamily | 280   | Under Constr.   | Q3 2026  |
| Solis Decatur| Multifamily | 350   | Lease-Up        | Q1 2026  |

Pipeline Summary:
Total competing units: 630  |  Under Construction: 280
In Lease-Up: 350            |  Planned/Proposed: 0
```

### Add Project Form

Clicking "+ Add Project" opens an inline form (not a modal) with these fields:

| Field | Type | Options/Placeholder |
|-------|------|-------------------|
| Project Name | Text input | "e.g., Broadstone at Lilburn" |
| Property Type | Dropdown | Multifamily, Office, Industrial, Retail, Mixed-Use, Other |
| Total Units/SF | Number input | "Units or square footage" |
| Status | Dropdown | Proposed, Entitled, Under Construction, Lease-Up/Stabilizing, Delivered |
| Estimated Delivery | Text input | "e.g., Q3 2026" |
| Distance from Site | Text input | "e.g., 1.2 miles" |
| Notes | Text area (optional) | "e.g., Class A, asking $2,100/mo, 40% pre-leased" |

### Pipeline Summary

Auto-calculated from the entered projects:
- Total competing units/SF
- Breakdown by status (how many proposed, under construction, lease-up, delivered)
- Total units under construction within the submarket — this is a key supply pressure metric

### Data Storage

Save all competing projects in ProjectContext state so they persist across navigation and can flow into the feasibility analysis later. Structure:

```javascript
competingProjects: [
  {
    id: 'uuid',
    name: 'Broadstone at Lilburn',
    propertyType: 'Multifamily',
    units: 280,
    status: 'Under Construction',
    delivery: 'Q3 2026',
    distance: '1.2 miles',
    notes: 'Class A, asking $2,100/mo'
  }
]
```

### Edit and Delete

Each row should have a small edit (pencil) and delete (trash) icon on hover. Edit opens the form inline pre-populated with that project's data. Delete asks for confirmation.

## 3. Make Supply Pipeline Full Width

Since Employment was removed and Demographics is full width, make the Supply Pipeline panel full width too. Move Environmental to full width as well — stack them vertically:

```
[ Demographics Deep Dive (full width) ]
[ Environmental (full width) ]
[ Supply Pipeline (full width) ]
[ Market Data - Rents & Sales (full width) ]
```

This gives each panel room to breathe and keeps the layout consistent.

Build this now. Start with fixing the Census permits endpoint, then add the manual projects tracker.
