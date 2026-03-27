/**
 * Geocode an address using the US Census Geocoder (proxied).
 * Returns { state, county, tract, lat, lng, geoid } or null.
 */
export async function geocodeLocation(address) {
  const encoded = encodeURIComponent(address)
  const url = `/api/geocoder/geocoder/geographies/onelineaddress?address=${encoded}&benchmark=Public_AR_Current&vintage=Census2020_Current&format=json`

  try {
    const response = await fetch(url)
    const data = await response.json()
    const match = data.result?.addressMatches?.[0]
    if (match) {
      const tract = match.geographies?.['Census Tracts']?.[0]
      return {
        state: tract?.STATE,
        county: tract?.COUNTY,
        tract: tract?.TRACT,
        lat: match.coordinates?.y,
        lng: match.coordinates?.x,
        geoid: tract?.GEOID,
        matchedAddress: match.matchedAddress,
      }
    }
    return null
  } catch (err) {
    console.error('Geocoding failed:', err)
    return null
  }
}

/**
 * Fetch FRED economic data series (proxied).
 */
export async function fetchFredSeries(seriesId, limit = 1) {
  const apiKey = import.meta.env.VITE_FRED_API_KEY
  if (!apiKey) return null

  const url = `/api/fred/fred/series/observations?series_id=${seriesId}&api_key=${apiKey}&file_type=json&sort_order=desc&limit=${limit}`
  const response = await fetch(url)
  const data = await response.json()
  return data.observations
}

/**
 * Fetch FEMA flood zone for a point (proxied).
 */
export async function fetchFloodZone(lat, lng) {
  const url = `/api/fema/gis/nfhl/rest/services/public/NFHL/MapServer/28/query?geometry=${lng},${lat}&geometryType=esriGeometryPoint&inSR=4326&spatialRel=esriSpatialRelIntersects&outFields=FLD_ZONE,ZONE_SUBTY,SFHA_TF&returnGeometry=false&f=json`

  try {
    const response = await fetch(url)
    const data = await response.json()
    return data.features?.[0]?.attributes || null
  } catch {
    return null
  }
}
