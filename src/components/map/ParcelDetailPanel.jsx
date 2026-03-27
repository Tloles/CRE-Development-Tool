import { useDispatch, useProject } from '../../state/ProjectContext.jsx'
import { getLandUseDescription, calculateOpportunityScore, getOpportunitySignals } from '../../utils/countyGIS.js'
import { formatCurrency, formatNumber } from '../../utils/formatters.js'
import { X, Plus, Eye, MapPin, DollarSign, Home, User, AlertTriangle } from 'lucide-react'
import { useState } from 'react'

export default function ParcelDetailPanel({ feature, countyFips, onClose }) {
  const dispatch = useDispatch()
  const { assemblage } = useProject()
  const [addedToAssemblage, setAddedToAssemblage] = useState(false)

  const p = feature.properties
  const score = calculateOpportunityScore(p)
  const signals = getOpportunitySignals(p)
  const landUse = getLandUseDescription(countyFips, p.landUseCode)

  const isAlreadyInAssemblage = assemblage.parcels.some(
    (parcel) => parcel.parcelId === p.parcelId
  )

  function handleAddToAssemblage() {
    dispatch({
      type: 'ADD_PARCEL',
      payload: {
        id: crypto.randomUUID(),
        parcelId: p.parcelId || '',
        owner: p.owner || '',
        acreage: p.acres || 0,
        currentZoning: p.zoning || '',
        currentUse: landUse,
        askingPrice: null,
        offerPrice: null,
        status: 'Identified',
        ddDeadline: null,
        closingDate: null,
        notes: `Auto-added from parcel scanner. Assessed value: ${formatCurrency(p.totalAppraised)}. Address: ${p.address || 'N/A'}`,
      },
    })
    setAddedToAssemblage(true)
  }

  // Score color
  const scoreColor = score >= 70 ? 'text-healthy' : score >= 50 ? 'text-accent-execution' : score >= 30 ? 'text-caution' : 'text-text-muted'
  const scoreBg = score >= 70 ? 'bg-healthy/10' : score >= 50 ? 'bg-accent-execution/10' : score >= 30 ? 'bg-caution/10' : 'bg-bg-primary'

  // Improvement ratio analysis
  let improvementLabel = 'Improved property'
  let improvementColor = 'text-text-muted'
  if (p.improvementRatio < 0.05) {
    improvementLabel = 'Essentially vacant — strong redevelopment candidate'
    improvementColor = 'text-healthy'
  } else if (p.improvementRatio < 0.20) {
    improvementLabel = 'Underimproved — potential redevelopment candidate'
    improvementColor = 'text-healthy'
  } else if (p.improvementRatio < 0.50) {
    improvementLabel = 'Partially improved'
    improvementColor = 'text-caution'
  }

  return (
    <div className="border-t border-border-default bg-white">
      <div className="max-w-[1600px] mx-auto">
        <div className="px-5 py-4">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-text-muted">{p.parcelId || 'No ID'}</span>
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${scoreBg} ${scoreColor}`}>
                  Score: {score}
                </span>
              </div>
              <h4 className="text-sm font-semibold text-text-primary">
                {p.address || 'Address not available'}
              </h4>
              {p.owner && (
                <p className="text-xs text-text-secondary flex items-center gap-1 mt-0.5">
                  <User className="w-3 h-3" /> {p.owner}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {!isAlreadyInAssemblage && !addedToAssemblage ? (
                <button
                  onClick={handleAddToAssemblage}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-accent-intelligence text-white hover:bg-blue-light transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add to Assemblage
                </button>
              ) : (
                <span className="text-xs text-healthy font-medium">
                  {addedToAssemblage ? 'Added!' : 'In Assemblage'}
                </span>
              )}
              <button
                onClick={onClose}
                className="p-1.5 rounded-md hover:bg-bg-card-hover transition-colors"
              >
                <X className="w-4 h-4 text-text-muted" />
              </button>
            </div>
          </div>

          {/* Main content grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Valuation */}
            <div className="bg-bg-primary rounded-lg p-3 border border-border-default">
              <div className="flex items-center gap-1.5 mb-2">
                <DollarSign className="w-3.5 h-3.5 text-text-muted" />
                <span className="text-[10px] uppercase tracking-wider text-text-muted font-medium">Valuation</span>
              </div>
              <div className="space-y-1.5">
                <ValRow label="Total Appraised" value={formatCurrency(p.totalAppraised)} />
                <ValRow label="Land Value" value={formatCurrency(p.landAppraised)} />
                <ValRow label="Improvement Value" value={formatCurrency(p.improvementAppraised)} />
                <div className="pt-1.5 border-t border-border-subtle">
                  <div className="flex justify-between text-xs">
                    <span className="text-text-muted">Improvement Ratio</span>
                    <span className={`font-mono font-bold ${improvementColor}`}>
                      {(p.improvementRatio * 100).toFixed(0)}%
                    </span>
                  </div>
                  <p className={`text-[10px] mt-0.5 ${improvementColor}`}>{improvementLabel}</p>
                </div>
              </div>
            </div>

            {/* Property Details */}
            <div className="bg-bg-primary rounded-lg p-3 border border-border-default">
              <div className="flex items-center gap-1.5 mb-2">
                <Home className="w-3.5 h-3.5 text-text-muted" />
                <span className="text-[10px] uppercase tracking-wider text-text-muted font-medium">Property Details</span>
              </div>
              <div className="space-y-1.5">
                <ValRow label="Acreage" value={p.acres ? `${p.acres.toFixed(2)} ac` : 'N/A'} />
                <ValRow label="Land Use" value={landUse} />
                <ValRow label="Zoning" value={p.zoning || 'See zoning layer'} />
                <ValRow label="Year Built" value={p.yearBuilt || 'N/A'} />
                <ValRow label="Last Sale" value={p.lastSaleDate || 'N/A'} />
                <ValRow label="Living Units" value={p.livingUnits ?? 'N/A'} />
                <ValRow label="Subdivision" value={p.subdivision || '—'} />
              </div>
            </div>

            {/* Opportunity Signals */}
            <div className="bg-bg-primary rounded-lg p-3 border border-border-default">
              <div className="flex items-center gap-1.5 mb-2">
                <AlertTriangle className="w-3.5 h-3.5 text-text-muted" />
                <span className="text-[10px] uppercase tracking-wider text-text-muted font-medium">Opportunity Signals</span>
              </div>
              {signals.length > 0 ? (
                <div className="space-y-2">
                  {signals.map((signal, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className={`w-2 h-2 rounded-full mt-1 shrink-0 ${
                        signal.level === 'high' ? 'bg-healthy' :
                        signal.level === 'medium' ? 'bg-caution' :
                        'bg-accent-intelligence'
                      }`} />
                      <div>
                        <p className="text-xs font-medium text-text-primary">{signal.label}</p>
                        <p className="text-[10px] text-text-muted">{signal.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-text-muted">No strong signals detected</p>
              )}

              {/* Tax delinquency placeholder */}
              <div className="mt-3 pt-2 border-t border-border-subtle">
                <p className="text-[10px] text-text-muted italic">
                  Tax Delinquency Status: Data coming soon
                </p>
              </div>
            </div>
          </div>

          {/* Assemblage context */}
          {assemblage.parcels.length > 0 && (
            <div className="mt-3 text-xs text-text-muted">
              {assemblage.parcels.length} parcel{assemblage.parcels.length !== 1 ? 's' : ''} tracked in Assemblage
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function ValRow({ label, value }) {
  return (
    <div className="flex justify-between text-xs">
      <span className="text-text-muted">{label}</span>
      <span className="text-text-primary font-mono">{value}</span>
    </div>
  )
}
