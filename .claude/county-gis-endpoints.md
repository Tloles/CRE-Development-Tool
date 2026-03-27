# Metro Atlanta County GIS Endpoints — Reference Data

This file provides Claude Code with verified ArcGIS REST service URLs and field mappings for querying county parcel data. Use this as the authoritative reference when building the Land Opportunity Scanner.

**Last verified:** March 2026

---

## How ArcGIS REST Queries Work

All county GIS systems use Esri ArcGIS Server. The query pattern is standardized:

```
{base_url}/{layer_id}/query?where=1=1&geometry={bbox}&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects&outFields={fields}&returnGeometry=true&outSR=4326&f=geojson&resultRecordCount=2000
```

To discover available fields for any layer, hit: `{base_url}/{layer_id}?f=json`

Key parameters:
- `outSR=4326` — Returns geometry in WGS84 (lat/lng) for Leaflet compatibility
- `resultRecordCount` — Max records per page (varies by service, typically 1000-2000)
- `f=geojson` — Returns GeoJSON directly usable by Leaflet
- `geometryType=esriGeometryEnvelope` — Bounding box query
- `spatialRel=esriSpatialRelIntersects` — Return parcels that intersect the bbox

**IMPORTANT:** Many Georgia county GIS services use State Plane coordinate system (EPSG:2240 / WKID:102667) internally. Always request `outSR=4326` to get WGS84 output.

---

## Fulton County (FIPS: 13121)

**Status: ✅ VERIFIED — fields confirmed**

Covers: Atlanta (partially), Sandy Springs, Roswell, Alpharetta, Johns Creek, Milton, Chattahoochee Hills, College Park, East Point, Hapeville, Union City, Palmetto, Fairburn, South Fulton

### Tax Parcel Layer

```
Base URL: https://gismaps.fultoncountyga.gov/arcgispub2/rest/services/PropertyMapViewer/PropertyMapViewer/MapServer
Layer ID: 11
Full URL: https://gismaps.fultoncountyga.gov/arcgispub2/rest/services/PropertyMapViewer/PropertyMapViewer/MapServer/11
Query URL: https://gismaps.fultoncountyga.gov/arcgispub2/rest/services/PropertyMapViewer/PropertyMapViewer/MapServer/11/query
Max Records: 2000
Spatial Ref: 102667 (2240) — Georgia State Plane West
Supports GeoJSON: Yes
Supports Pagination: Yes
Supports Statistics: Yes
```

### Verified Fields

| Field Name | Type | Alias | Description | Opportunity Use |
|-----------|------|-------|-------------|-----------------|
| ParcelID | String(20) | ParcelID | Tax parcel identification number | Primary key |
| Address | String(150) | Address | Full site address | Display |
| AddrNumber | String(12) | AddrNumber | Street number | — |
| AddrStreet | String(60) | AddrStreet | Street name | — |
| AddrSuffix | String(12) | AddrSuffix | Street suffix (St, Ave, etc.) | — |
| Owner | String(255) | Owner | Owner name | Trust/LLC/estate pattern matching |
| OwnerAddr1 | String(255) | OwnerAddr1 | Owner mailing address line 1 | Absentee owner detection |
| OwnerAddr2 | String(255) | OwnerAddr2 | Owner mailing address line 2 | — |
| TaxDist | String(6) | TaxDist | Tax district code | — |
| TotAssess | Integer | TotAssess | Total assessed value (40% of FMV in GA) | Valuation |
| LandAssess | Integer | LandAssess | Land assessed value | Land vs improvement split |
| ImprAssess | Integer | ImprAssess | Improvement assessed value | **Key: low = underimproved** |
| TotAppr | Integer | TotAppr | Total appraised (fair market) value | Valuation |
| LandAppr | Integer | LandAppr | Land appraised value | Land value per acre calc |
| ImprAppr | Integer | ImprAppr | Improvement appraised value | **Key: ImprAppr/TotAppr = improvement ratio** |
| LUCode | String(8) | LUCode | Land use code | **Key: filter for vacant, residential, etc.** |
| ClassCode | String(8) | ClassCode | Property classification code | — |
| ExCode | String(10) | ExCode | Exemption code | Homestead = owner-occupied |
| LivUnits | SmallInt | LivUnits | Number of living units | Multi-family detection |
| LandAcres | Double | LandAcres | **Parcel acreage** | **Key: size filtering** |
| NbrHood | String(8) | Neighborhood | Neighborhood code | — |
| Subdiv | String(80) | Subdivision | Subdivision name | — |
| SubdivNum | String(10) | Subdivision Number | — | — |
| SubdivLot | String(8) | Subdivision Lot | — | — |
| SubdivBlck | String(8) | Subdivision Block | — | — |
| TaxYear | SmallInt | TaxYear | Tax year of data | — |

### Fulton County Land Use Codes (LUCode)

Common codes (verify against county documentation):
- `01` — Residential (Single Family)
- `02` — Residential (Multi-Family)
- `03` — Residential (Condo)
- `04` — Commercial
- `05` — Industrial
- `06` — Agricultural/Forest
- `07` — Exempt (Government/Church/Nonprofit)
- `08` — Utility
- `09` — Vacant Land (Residential)
- `10` — Vacant Land (Commercial)
- `11` — Vacant Land (Industrial)

**NOTE:** These codes need verification. Query a sample of parcels and cross-reference LUCode values with known properties. The county may use different coding.

### Additional Fulton County Layers (same MapServer)

| Layer | ID | Use Case |
|-------|-----|----------|
| Zoning | 34 | Current zoning designation overlay |
| TAD (Tax Allocation Districts) | 37 | Incentive district identification |
| CID (Community Improvement Districts) | 36 | Special district identification |
| Census Tracts | 29 | Cross-reference with demographic data |
| Census Block Groups | 27 | Finer geographic resolution |
| Elementary School Zones | 21 | School quality context |
| Subdivisions | 19 | Neighborhood identification |
| 2035 Future Land Use | 33 | **Valuable: shows planned use vs current** |
| Elevation Contours | 25 | Topography assessment |

### Proxy Config

```javascript
// vite.config.js
'/api/gis-fulton': {
  target: 'https://gismaps.fultoncountyga.gov',
  changeOrigin: true,
  rewrite: (path) => path.replace(/^\/api\/gis-fulton/, ''),
}
```

Internal query URL becomes:
```
/api/gis-fulton/arcgispub2/rest/services/PropertyMapViewer/PropertyMapViewer/MapServer/11/query?...
```

---

## DeKalb County (FIPS: 13089)

**Status: ⚠️ ENDPOINT FOUND — fields need discovery**

Covers: Decatur, Brookhaven, Dunwoody, Chamblee, Clarkston, Stone Mountain, Tucker, Stonecrest, Lithonia

### Tax Parcel Layer

```
Base URL: https://gis.dekalbcountyga.gov/arcgis/rest/services/Parcels/MapServer
Layer ID: 0
Full URL: https://gis.dekalbcountyga.gov/arcgis/rest/services/Parcels/MapServer/0
Query URL: https://gis.dekalbcountyga.gov/arcgis/rest/services/Parcels/MapServer/0/query
Display Field: PARCELID
Spatial Ref: 102100 (3857) — Web Mercator
```

**Alternative endpoint (more detailed, from iasWorld/Tyler CAMA system):**
```
Base URL: https://gis.dekalbcountyga.gov/arcgis/rest/services/iasWorld/TylerParcel/MapServer
Display Field: CNVYNAME (likely conveyance/owner name)
```

### Field Discovery Required

Hit this URL to get the full field list:
```
https://gis.dekalbcountyga.gov/arcgis/rest/services/Parcels/MapServer/0?f=json
```

**Expected fields** (based on typical Georgia county patterns — verify):
- `PARCELID` — Parcel ID
- Owner name field (check: `OWNER`, `OWNERNAME`, `CNVYNAME`)
- Assessed value fields (check: `TOTALVALUE`, `LANDVALUE`, `IMPRVALUE`, `TOTALAPPR`)
- `LANDUSE` or `USECODE` — Land use code
- Acreage field (check: `ACRES`, `ACREAGE`, `CALCACRES`)
- Address fields

### Proxy Config

```javascript
'/api/gis-dekalb': {
  target: 'https://gis.dekalbcountyga.gov',
  changeOrigin: true,
  rewrite: (path) => path.replace(/^\/api\/gis-dekalb/, ''),
}
```

**NOTE:** DeKalb's SSL certificate was expired as of March 2026. The Vite proxy should handle this with `secure: false`:
```javascript
'/api/gis-dekalb': {
  target: 'https://gis.dekalbcountyga.gov',
  changeOrigin: true,
  secure: false, // SSL cert issue
  rewrite: (path) => path.replace(/^\/api\/gis-dekalb/, ''),
}
```

---

## Gwinnett County (FIPS: 13135)

**Status: ⚠️ ENDPOINT NEEDS DISCOVERY — open data portal confirmed**

Covers: Lawrenceville, Duluth, Norcross, Suwanee, Buford (partial), Snellville, Lilburn, Dacula, Grayson, Loganville (partial), Peachtree Corners, Sugar Hill, Auburn

### Known Resources

- Open Data Portal: `https://gcgis-gwinnettcountyga.hub.arcgis.com/`
- GIS Data Browser: `https://gis.gwinnettcounty.com/GISDataBrowser/`
- Property & Tax Table dataset exists on the open data portal

### Endpoint Discovery Steps

1. Check the ArcGIS REST services directory:
   ```
   https://gis.gwinnettcounty.com/arcgis/rest/services
   ```
2. Look for a Parcels or Tax service
3. Hit the layer metadata (`?f=json`) to get field names
4. Alternative: check the Open Data Portal for a hosted FeatureServer URL via:
   ```
   https://gcgis-gwinnettcountyga.hub.arcgis.com/datasets/
   ```
   Search for "parcels" or "tax" — the dataset page will show the REST endpoint

### Proxy Config (update URL once discovered)

```javascript
'/api/gis-gwinnett': {
  target: 'https://gis.gwinnettcounty.com',
  changeOrigin: true,
  rewrite: (path) => path.replace(/^\/api\/gis-gwinnett/, ''),
}
```

---

## Cobb County (FIPS: 13067)

**Status: ⚠️ ENDPOINT NEEDS DISCOVERY — GIS portal confirmed**

Covers: Marietta, Smyrna, Kennesaw, Acworth, Austell, Powder Springs, Mableton, Vinings

### Known Resources

- GIS Hub: `https://geo-cobbcountyga.hub.arcgis.com/`
- Open Data: `https://geo-cobbcountyga.opendata.arcgis.com/`
- Property Search: `https://gis.cobbcounty.org/PropertySearch.html`
- Parcel Viewer: `https://www.arcgis.com/apps/webappviewer/index.html?id=e22d8c597b4e4762bcd2caa6127696e4`

### Endpoint Discovery Steps

1. Check: `https://gis.cobbcounty.org/arcgis/rest/services`
2. Or check the ArcGIS Portal: `https://gis.cobbcounty.org/portal/sharing/rest/search?q=parcels&f=json`
3. The Parcel Viewer app (above) makes REST calls — inspect its network traffic to find the service URL

### Proxy Config (update URL once discovered)

```javascript
'/api/gis-cobb': {
  target: 'https://gis.cobbcounty.org',
  changeOrigin: true,
  rewrite: (path) => path.replace(/^\/api\/gis-cobb/, ''),
}
```

---

## Standardized Field Mapping

Since field names differ by county, the application should use a mapping config. Here's the template:

```javascript
// src/data/countyGISConfig.js

export const COUNTY_GIS_CONFIG = {
  '13121': { // Fulton
    name: 'Fulton County',
    parcelEndpoint: '/api/gis-fulton/arcgispub2/rest/services/PropertyMapViewer/PropertyMapViewer/MapServer/11',
    zoningEndpoint: '/api/gis-fulton/arcgispub2/rest/services/PropertyMapViewer/PropertyMapViewer/MapServer/34',
    futureLandUseEndpoint: '/api/gis-fulton/arcgispub2/rest/services/PropertyMapViewer/PropertyMapViewer/MapServer/33',
    tadEndpoint: '/api/gis-fulton/arcgispub2/rest/services/PropertyMapViewer/PropertyMapViewer/MapServer/37',
    maxRecords: 2000,
    nativeSR: 102667,
    fieldMap: {
      parcelId: 'ParcelID',
      address: 'Address',
      owner: 'Owner',
      ownerAddress: 'OwnerAddr1',
      totalAssessed: 'TotAssess',
      landAssessed: 'LandAssess',
      improvementAssessed: 'ImprAssess',
      totalAppraised: 'TotAppr',
      landAppraised: 'LandAppr',
      improvementAppraised: 'ImprAppr',
      landUseCode: 'LUCode',
      classCode: 'ClassCode',
      exemptionCode: 'ExCode',
      livingUnits: 'LivUnits',
      acres: 'LandAcres',
      neighborhood: 'NbrHood',
      subdivision: 'Subdiv',
      taxYear: 'TaxYear',
      // Fields NOT available in Fulton (set null):
      yearBuilt: null,
      lastSaleDate: null,
      lastSalePrice: null,
      zoning: null, // Available via separate layer (ID 34)
    },
    // Which fields to request (avoid * for performance)
    queryFields: [
      'ParcelID', 'Address', 'Owner', 'OwnerAddr1',
      'TotAppr', 'LandAppr', 'ImprAppr',
      'TotAssess', 'LandAssess', 'ImprAssess',
      'LUCode', 'ClassCode', 'ExCode',
      'LivUnits', 'LandAcres', 'Subdiv', 'TaxYear'
    ],
  },

  '13089': { // DeKalb — UPDATE AFTER FIELD DISCOVERY
    name: 'DeKalb County',
    parcelEndpoint: '/api/gis-dekalb/arcgis/rest/services/Parcels/MapServer/0',
    maxRecords: 1000, // verify
    nativeSR: 102100,
    fieldMap: {
      parcelId: 'PARCELID',  // confirmed from search results
      address: null,          // discover
      owner: null,            // discover — might be CNVYNAME on Tyler endpoint
      totalAppraised: null,   // discover
      landAppraised: null,    // discover
      improvementAppraised: null,
      landUseCode: null,
      acres: null,
      yearBuilt: null,
      lastSaleDate: null,
      lastSalePrice: null,
      zoning: null,
    },
    queryFields: ['*'], // Use * until fields are discovered, then optimize
  },

  '13135': { // Gwinnett — ENDPOINT AND FIELDS TBD
    name: 'Gwinnett County',
    parcelEndpoint: null, // NEEDS DISCOVERY
    maxRecords: 1000,
    nativeSR: null,
    fieldMap: {},
    queryFields: ['*'],
  },

  '13067': { // Cobb — ENDPOINT AND FIELDS TBD
    name: 'Cobb County',
    parcelEndpoint: null, // NEEDS DISCOVERY
    maxRecords: 1000,
    nativeSR: null,
    fieldMap: {},
    queryFields: ['*'],
  },
};

// Helper to get config by county FIPS
export function getCountyConfig(countyFips) {
  return COUNTY_GIS_CONFIG[countyFips] || null;
}

// Helper to normalize a raw parcel record using the field map
export function normalizeParcel(raw, fieldMap) {
  const get = (key) => {
    const field = fieldMap[key];
    return field ? raw[field] : null;
  };

  const totalAppraised = get('totalAppraised') || 0;
  const imprAppraised = get('improvementAppraised') || 0;
  const improvementRatio = totalAppraised > 0 ? imprAppraised / totalAppraised : 0;

  return {
    parcelId: get('parcelId'),
    address: get('address'),
    owner: get('owner'),
    ownerAddress: get('ownerAddress'),
    totalAssessed: get('totalAssessed'),
    landAssessed: get('landAssessed'),
    improvementAssessed: get('improvementAssessed'),
    totalAppraised,
    landAppraised: get('landAppraised'),
    improvementAppraised: imprAppraised,
    improvementRatio,
    landUseCode: get('landUseCode'),
    classCode: get('classCode'),
    exemptionCode: get('exemptionCode'),
    livingUnits: get('livingUnits'),
    acres: get('acres'),
    yearBuilt: get('yearBuilt'),
    lastSaleDate: get('lastSaleDate'),
    lastSalePrice: get('lastSalePrice'),
    subdivision: get('subdivision'),
    neighborhood: get('neighborhood'),
    zoning: get('zoning'),
    taxYear: get('taxYear'),
  };
}
```

---

## Discovery Instructions for Claude Code

When implementing the scanner, **start with Fulton County** (fully verified). For other counties:

1. Hit `{base_url}?f=json` to get the service metadata and confirm it's alive
2. Hit `{base_url}/{layer_id}?f=json` to get the field definitions
3. Run a sample query: `{base_url}/{layer_id}/query?where=1=1&resultRecordCount=5&outFields=*&f=json`
4. Map the returned field names to our standardized schema
5. Update the `COUNTY_GIS_CONFIG` object
6. Test with a bounding box query near a known address

If a county endpoint is unreachable or doesn't support GeoJSON output, fall back gracefully:
- Show a message: "Parcel data not available for [County Name]"
- The user can still manually add parcels in Step 2 (Assemblage)
