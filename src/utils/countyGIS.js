import { getCountyConfig, normalizeParcel } from '../data/countyGISConfig.js'

// Cache for fetched parcel data: { [cacheKey]: { features, fetchedAt } }
const parcelCache = new Map()

function boundsToEnvelope(bounds) {
  return {
    xmin: bounds.getWest(),
    ymin: bounds.getSouth(),
    xmax: bounds.getEast(),
    ymax: bounds.getNorth(),
    spatialReference: { wkid: 4326 },
  }
}

function getCacheKey(endpoint, envelope) {
  const precision = 4
  return `${endpoint}:${envelope.xmin.toFixed(precision)},${envelope.ymin.toFixed(precision)},${envelope.xmax.toFixed(precision)},${envelope.ymax.toFixed(precision)}`
}

/**
 * Query parcels from a county ArcGIS endpoint within the given Leaflet bounds.
 * Returns GeoJSON FeatureCollection with normalized properties.
 */
export async function fetchParcelsInBounds(countyFips, bounds) {
  const config = getCountyConfig(countyFips)
  if (!config || !config.parcelEndpoint) {
    return { type: 'FeatureCollection', features: [], error: `No parcel endpoint configured for county ${countyFips}` }
  }

  const envelope = boundsToEnvelope(bounds)
  const cacheKey = getCacheKey(config.parcelEndpoint, envelope)

  // Check cache (5 minute TTL)
  const cached = parcelCache.get(cacheKey)
  if (cached && Date.now() - cached.fetchedAt < 5 * 60 * 1000) {
    return cached.data
  }

  const params = new URLSearchParams({
    where: '1=1',
    geometry: JSON.stringify(envelope),
    geometryType: 'esriGeometryEnvelope',
    spatialRel: 'esriSpatialRelIntersects',
    outFields: config.queryFields.join(','),
    returnGeometry: 'true',
    outSR: '4326',
    f: 'geojson',
    resultRecordCount: String(config.maxRecords),
  })

  try {
    const response = await fetch(`${config.parcelEndpoint}/query?${params}`)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const geojson = await response.json()

    if (geojson.error) {
      throw new Error(geojson.error.message || 'ArcGIS query error')
    }

    // Normalize each feature's properties
    if (geojson.features) {
      geojson.features = geojson.features.map((feature) => ({
        ...feature,
        properties: {
          ...normalizeParcel(feature.properties, config.fieldMap),
          _raw: feature.properties,
        },
      }))
    }

    const result = { ...geojson, countyName: config.name }
    parcelCache.set(cacheKey, { data: result, fetchedAt: Date.now() })
    return result
  } catch (err) {
    console.error(`Failed to fetch parcels for ${config.name}:`, err)
    return {
      type: 'FeatureCollection',
      features: [],
      error: `Failed to load parcels from ${config.name}: ${err.message}`,
    }
  }
}

/**
 * Get the land use description for a given code and county.
 */
export function getLandUseDescription(countyFips, code) {
  const config = getCountyConfig(countyFips)
  if (!config || !config.landUseCodes) return code || 'Unknown'
  return config.landUseCodes[code] || code || 'Unknown'
}

/**
 * Check if a parcel is likely vacant based on land use code.
 */
export function isVacantParcel(parcel) {
  const code = parcel.landUseCode
  if (!code) return false
  // Fulton County codes 09, 10, 11 are vacant
  return ['09', '10', '11'].includes(code)
}

/**
 * Calculate opportunity score for a parcel (0-100).
 */
export function calculateOpportunityScore(parcel, preferences = {}) {
  let score = 0
  const minAcres = preferences.minAcres || 1

  // Vacant or underimproved (biggest signal)
  if (parcel.improvementRatio < 0.05) score += 30
  else if (parcel.improvementRatio < 0.20) score += 20
  else if (parcel.improvementRatio < 0.40) score += 10

  // Size meets minimum threshold
  if (parcel.acres && parcel.acres >= minAcres) score += 15

  // Long hold period
  if (parcel.lastSaleDate) {
    const yearsHeld = (Date.now() - new Date(parcel.lastSaleDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000)
    if (yearsHeld > 20) score += 15
    else if (yearsHeld > 10) score += 10
    else if (yearsHeld > 5) score += 5
  } else {
    // No sale date often means very long hold
    score += 10
  }

  // Aging structure
  if (parcel.yearBuilt && parcel.yearBuilt < 1970) score += 10
  else if (parcel.yearBuilt && parcel.yearBuilt < 1990) score += 5

  // Vacant land use code
  if (isVacantParcel(parcel)) score += 15

  // Owner pattern signals (trusts, estates, LLCs can indicate motivation)
  if (parcel.owner) {
    const ownerUpper = parcel.owner.toUpperCase()
    if (ownerUpper.includes('ESTATE') || ownerUpper.includes('TRUST') || ownerUpper.includes('HEIR')) {
      score += 10
    }
  }

  return Math.min(score, 100)
}

/**
 * Get opportunity signals as an array of { label, level, description }.
 */
export function getOpportunitySignals(parcel) {
  const signals = []

  if (isVacantParcel(parcel)) {
    signals.push({ label: 'Vacant Land', level: 'high', description: 'Land use code indicates vacant/unimproved' })
  } else if (parcel.improvementRatio < 0.20) {
    signals.push({ label: 'Underimproved', level: 'high', description: `Improvement ratio: ${(parcel.improvementRatio * 100).toFixed(0)}%` })
  } else if (parcel.improvementRatio < 0.40) {
    signals.push({ label: 'Partially Improved', level: 'medium', description: `Improvement ratio: ${(parcel.improvementRatio * 100).toFixed(0)}%` })
  }

  if (parcel.yearBuilt && parcel.yearBuilt < 1970) {
    signals.push({ label: 'Aging Structure', level: 'medium', description: `Built in ${parcel.yearBuilt}` })
  }

  if (parcel.acres && parcel.acres >= 2) {
    signals.push({ label: 'Size Threshold', level: 'info', description: `${parcel.acres.toFixed(2)} acres` })
  }

  if (parcel.owner) {
    const ownerUpper = parcel.owner.toUpperCase()
    if (ownerUpper.includes('ESTATE') || ownerUpper.includes('TRUST') || ownerUpper.includes('HEIR')) {
      signals.push({ label: 'Estate/Trust Owner', level: 'medium', description: 'Potential motivated seller' })
    }
  }

  return signals
}
