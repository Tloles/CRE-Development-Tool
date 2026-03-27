import { useState, useEffect, useCallback, useRef } from 'react'
import { MapContainer, TileLayer, GeoJSON, useMap, useMapEvents } from 'react-leaflet'
import { useProject, useDispatch } from '../../state/ProjectContext.jsx'
import { fetchParcelsInBounds } from '../../utils/countyGIS.js'
import { getCountyByStateFips } from '../../data/countyGISConfig.js'
import ParcelDetailPanel from './ParcelDetailPanel.jsx'
import { Loader2, Layers, MapPin } from 'lucide-react'
import 'leaflet/dist/leaflet.css'

const PARCEL_ZOOM_THRESHOLD = 14
const DEBOUNCE_MS = 600

// Color scales for parcel metrics
const PARCEL_COLOR_METRICS = [
  { id: 'improvementRatio', label: 'Improvement Ratio', description: 'Low = opportunity' },
  { id: 'assessedPerAcre', label: 'Assessed Value / Acre', description: 'Relative land value' },
  { id: 'acreage', label: 'Parcel Acreage', description: 'Highlights larger parcels' },
  { id: 'opportunityScore', label: 'Opportunity Score', description: 'Composite signal score' },
]

function getParcelColor(feature, metric) {
  const p = feature.properties
  switch (metric) {
    case 'improvementRatio': {
      const ratio = p.improvementRatio || 0
      if (ratio < 0.05) return '#059669' // green — essentially vacant
      if (ratio < 0.20) return '#10B981'
      if (ratio < 0.40) return '#D97706' // yellow
      return '#94A3B8' // gray — improved
    }
    case 'assessedPerAcre': {
      const acres = p.acres || 1
      const value = (p.totalAppraised || 0) / acres
      if (value < 50000) return '#0F2440'
      if (value < 150000) return '#1E3A5F'
      if (value < 300000) return '#2563EB'
      if (value < 500000) return '#C5992E'
      return '#D4A843'
    }
    case 'acreage': {
      const acres = p.acres || 0
      if (acres >= 10) return '#0F2440'
      if (acres >= 5) return '#1E3A5F'
      if (acres >= 2) return '#2563EB'
      if (acres >= 1) return '#3B82F6'
      return '#CBD5E1'
    }
    case 'opportunityScore': {
      const score = p._opportunityScore || 0
      if (score >= 70) return '#059669'
      if (score >= 50) return '#10B981'
      if (score >= 30) return '#D97706'
      return '#94A3B8'
    }
    default:
      return '#2563EB'
  }
}

function MapEventHandler({ onBoundsChange, onZoomChange }) {
  const map = useMapEvents({
    moveend: () => {
      onBoundsChange(map.getBounds())
      onZoomChange(map.getZoom())
    },
    zoomend: () => {
      onBoundsChange(map.getBounds())
      onZoomChange(map.getZoom())
    },
  })
  return null
}

function FlyToLocation({ lat, lng, zoom }) {
  const map = useMap()
  useEffect(() => {
    if (lat && lng) {
      map.flyTo([lat, lng], zoom || 15, { duration: 1.5 })
    }
  }, [lat, lng, zoom, map])
  return null
}

export default function InteractiveMap() {
  const { siteSelection } = useProject()
  const dispatch = useDispatch()
  const geocoded = siteSelection.geocoded

  const [zoom, setZoom] = useState(12)
  const [parcels, setParcels] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedParcel, setSelectedParcel] = useState(null)
  const [colorMetric, setColorMetric] = useState('improvementRatio')
  const debounceRef = useRef(null)
  const [countyConfig, setCountyConfig] = useState(null)

  // Determine county config from geocoded data
  useEffect(() => {
    if (geocoded?.state && geocoded?.county) {
      const config = getCountyByStateFips(geocoded.state, geocoded.county)
      setCountyConfig(config)
    }
  }, [geocoded?.state, geocoded?.county])

  const countyFips = countyConfig?.fips || (geocoded ? `${geocoded.state}${geocoded.county}` : null)

  const loadParcels = useCallback(async (bounds) => {
    if (!countyFips) return

    setLoading(true)
    setError(null)
    try {
      const result = await fetchParcelsInBounds(countyFips, bounds)
      if (result.error) {
        setError(result.error)
      }
      setParcels(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [countyFips])

  const handleBoundsChange = useCallback((bounds) => {
    if (zoom >= PARCEL_ZOOM_THRESHOLD && countyFips) {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => loadParcels(bounds), DEBOUNCE_MS)
    }
  }, [zoom, countyFips, loadParcels])

  const handleZoomChange = useCallback((newZoom) => {
    setZoom(newZoom)
    if (newZoom < PARCEL_ZOOM_THRESHOLD) {
      setParcels(null)
      setSelectedParcel(null)
    }
  }, [])

  const parcelStyle = useCallback((feature) => ({
    fillColor: getParcelColor(feature, colorMetric),
    weight: 1,
    opacity: 0.8,
    color: '#0F2440',
    fillOpacity: 0.35,
  }), [colorMetric])

  const onEachParcel = useCallback((feature, layer) => {
    layer.on('click', () => {
      setSelectedParcel(feature)
    })
    layer.on('mouseover', () => {
      layer.setStyle({ fillOpacity: 0.6, weight: 2 })
    })
    layer.on('mouseout', () => {
      layer.setStyle({ fillOpacity: 0.35, weight: 1 })
    })
  }, [])

  const mapCenter = geocoded ? [geocoded.lat, geocoded.lng] : [33.749, -84.388] // Default: Atlanta
  const showParcels = zoom >= PARCEL_ZOOM_THRESHOLD && parcels?.features?.length > 0

  return (
    <div className="bg-bg-card rounded-xl border border-border-default shadow-sm overflow-hidden">
      {/* Map toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border-default bg-bg-primary">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-accent-intelligence" />
          <span className="text-xs font-semibold text-text-primary">Interactive Map</span>
          {geocoded && (
            <span className="text-xs text-text-muted ml-2">
              {geocoded.matchedAddress || `${geocoded.lat?.toFixed(4)}, ${geocoded.lng?.toFixed(4)}`}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {zoom >= PARCEL_ZOOM_THRESHOLD && (
            <div className="flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-text-muted" />
              <select
                value={colorMetric}
                onChange={(e) => setColorMetric(e.target.value)}
                className="bg-white border border-border-default rounded px-2 py-1 text-xs text-text-primary"
              >
                {PARCEL_COLOR_METRICS.map((m) => (
                  <option key={m.id} value={m.id}>{m.label}</option>
                ))}
              </select>
            </div>
          )}
          {loading && (
            <div className="flex items-center gap-1 text-xs text-accent-intelligence">
              <Loader2 className="w-3 h-3 animate-spin" />
              Loading parcels...
            </div>
          )}
          <span className="text-[10px] text-text-muted">
            Zoom: {zoom} {zoom < PARCEL_ZOOM_THRESHOLD && '(zoom to 14+ for parcels)'}
          </span>
        </div>
      </div>

      {/* Map container */}
      <div className="relative" style={{ height: 450 }}>
        <MapContainer
          center={mapCenter}
          zoom={geocoded ? 15 : 12}
          style={{ height: '100%', width: '100%' }}
          zoomControl={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />

          <MapEventHandler
            onBoundsChange={handleBoundsChange}
            onZoomChange={handleZoomChange}
          />

          {geocoded && (
            <FlyToLocation lat={geocoded.lat} lng={geocoded.lng} zoom={15} />
          )}

          {showParcels && (
            <GeoJSON
              key={`parcels-${parcels.features.length}-${colorMetric}`}
              data={parcels}
              style={parcelStyle}
              onEachFeature={onEachParcel}
            />
          )}
        </MapContainer>

        {/* Zoom hint overlay */}
        {!geocoded && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-white/90 rounded-lg px-4 py-3 shadow-sm text-center">
              <MapPin className="w-6 h-6 text-text-muted mx-auto mb-1" />
              <p className="text-sm text-text-secondary">Enter a location above to center the map</p>
            </div>
          </div>
        )}

        {/* County not supported overlay */}
        {zoom >= PARCEL_ZOOM_THRESHOLD && countyFips && !countyConfig?.parcelEndpoint && (
          <div className="absolute bottom-3 left-3 right-3">
            <div className="bg-white/95 rounded-lg px-3 py-2 shadow-sm border border-border-default text-xs text-text-secondary">
              Parcel data not available for this county. You can manually add parcels in Step 2 (Assemblage).
            </div>
          </div>
        )}

        {/* Error overlay */}
        {error && (
          <div className="absolute bottom-3 left-3 right-3">
            <div className="bg-warning/10 rounded-lg px-3 py-2 border border-warning/20 text-xs text-warning">
              {error}
            </div>
          </div>
        )}

        {/* Parcel count indicator */}
        {showParcels && (
          <div className="absolute top-3 right-3">
            <div className="bg-white/95 rounded-lg px-3 py-1.5 shadow-sm border border-border-default text-xs font-medium text-text-primary">
              {parcels.features.length} parcels loaded
              {parcels.countyName && ` — ${parcels.countyName}`}
            </div>
          </div>
        )}
      </div>

      {/* Color legend */}
      {showParcels && (
        <div className="px-4 py-2 border-t border-border-default bg-bg-primary">
          <ParcelLegend metric={colorMetric} />
        </div>
      )}

      {/* Parcel detail panel */}
      {selectedParcel && (
        <ParcelDetailPanel
          feature={selectedParcel}
          countyFips={countyFips}
          onClose={() => setSelectedParcel(null)}
        />
      )}
    </div>
  )
}

function ParcelLegend({ metric }) {
  const legends = {
    improvementRatio: [
      { color: '#059669', label: '< 5% (Vacant)' },
      { color: '#10B981', label: '5-20% (Underimproved)' },
      { color: '#D97706', label: '20-40% (Partial)' },
      { color: '#94A3B8', label: '> 40% (Improved)' },
    ],
    assessedPerAcre: [
      { color: '#0F2440', label: '< $50K/ac' },
      { color: '#1E3A5F', label: '$50-150K/ac' },
      { color: '#2563EB', label: '$150-300K/ac' },
      { color: '#C5992E', label: '$300-500K/ac' },
      { color: '#D4A843', label: '> $500K/ac' },
    ],
    acreage: [
      { color: '#CBD5E1', label: '< 1 acre' },
      { color: '#3B82F6', label: '1-2 acres' },
      { color: '#2563EB', label: '2-5 acres' },
      { color: '#1E3A5F', label: '5-10 acres' },
      { color: '#0F2440', label: '10+ acres' },
    ],
    opportunityScore: [
      { color: '#059669', label: '70+ (High)' },
      { color: '#10B981', label: '50-70 (Good)' },
      { color: '#D97706', label: '30-50 (Moderate)' },
      { color: '#94A3B8', label: '< 30 (Low)' },
    ],
  }

  const items = legends[metric] || []

  return (
    <div className="flex items-center gap-4 text-[10px] text-text-muted">
      <span className="font-medium text-text-secondary">
        {PARCEL_COLOR_METRICS.find(m => m.id === metric)?.label}:
      </span>
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }} />
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  )
}
