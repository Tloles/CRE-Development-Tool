import { useState } from 'react'
import { useProject, useDispatch } from '../../state/ProjectContext.jsx'
import { sectors } from '../../data/sectors.js'
import { callAnthropic } from '../../utils/api.js'
import { sectorTrendsPrompt } from '../../utils/researchPrompts.js'
import ResearchCard from '../shared/ResearchCard.jsx'
import { Building, ChevronDown } from 'lucide-react'

export default function SectorResearch() {
  const { sector } = useProject()
  const dispatch = useDispatch()
  const [sectorOpen, setSectorOpen] = useState(false)

  const selectedSector = sectors.find(s => s.id === sector.selected)

  function handleSectorSelect(sectorId, subtype) {
    dispatch({
      type: 'SET_SECTOR',
      payload: { sector: sectorId, subtype },
    })
    setSectorOpen(false)
  }

  async function researchTrends() {
    if (!selectedSector) return
    dispatch({ type: 'SET_SECTOR_LOADING', payload: true })
    try {
      const result = await callAnthropic({
        prompt: sectorTrendsPrompt(selectedSector.name, sector.subtype),
        systemPrompt: 'You are a CRE sector research analyst. Provide specific, data-backed trends. Be concise but thorough.',
        useWebSearch: true,
      })
      dispatch({ type: 'SET_SECTOR_TRENDS', payload: result })
    } catch (err) {
      dispatch({ type: 'SET_SECTOR_LOADING', payload: false })
    }
  }

  return (
    <ResearchCard
      title="Sector Selection"
      icon={Building}
      loading={sector.loading}
      onResearch={selectedSector ? researchTrends : undefined}
      researchLabel="Research Trends"
    >
      {/* Sector grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
        {sectors.map((s) => (
          <button
            key={s.id}
            onClick={() => {
              if (sector.selected === s.id) {
                setSectorOpen(!sectorOpen)
              } else {
                handleSectorSelect(s.id, null)
                setSectorOpen(true)
              }
            }}
            className={`
              px-3 py-2.5 rounded-lg text-xs font-medium text-left transition-all border
              ${sector.selected === s.id
                ? 'bg-gold/10 border-gold/30 text-gold'
                : 'bg-bg-primary border-border-default text-text-secondary hover:border-border-strong hover:text-text-primary'
              }
            `}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* Subtype selector */}
      {selectedSector && sectorOpen && (
        <div className="mb-4 p-3 rounded-lg bg-bg-primary border border-border-default">
          <p className="text-[11px] uppercase tracking-wider text-text-muted font-medium mb-2">
            {selectedSector.name} Subtypes
          </p>
          <div className="flex flex-wrap gap-1.5">
            {selectedSector.subtypes.map((sub) => (
              <button
                key={sub}
                onClick={() => handleSectorSelect(selectedSector.id, sub)}
                className={`
                  px-2.5 py-1.5 rounded-md text-xs transition-colors
                  ${sector.subtype === sub
                    ? 'bg-gold text-white font-semibold'
                    : 'bg-white text-text-secondary hover:text-text-primary hover:bg-bg-card-hover border border-border-default'
                  }
                `}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selected display */}
      {selectedSector && (
        <div className="flex items-center gap-2 text-xs text-text-secondary">
          <span className="font-medium text-text-primary">{selectedSector.name}</span>
          {sector.subtype && (
            <>
              <ChevronDown className="w-3 h-3 text-text-muted rotate-[-90deg]" />
              <span className="text-gold font-medium">{sector.subtype}</span>
            </>
          )}
        </div>
      )}

      {/* Trend results */}
      {sector.trends && (
        <div className="mt-4 p-4 rounded-lg bg-bg-primary border border-border-default">
          <p className="text-xs font-medium text-accent-intelligence mb-2">Sector Trend Analysis</p>
          <div className="text-xs text-text-secondary leading-relaxed whitespace-pre-wrap">
            {sector.trends}
          </div>
        </div>
      )}
    </ResearchCard>
  )
}
