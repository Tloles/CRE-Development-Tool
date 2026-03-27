import { useProject, useDispatch } from '../../state/ProjectContext.jsx'
import { macroIndicators } from '../../data/macroIndicators.js'
import { callAnthropic } from '../../utils/api.js'
import { macroResearchPrompt } from '../../utils/researchPrompts.js'
import ResearchCard from '../shared/ResearchCard.jsx'
import {
  Landmark, Building2, TrendingUp, Users, FileText, Clock, AlertCircle
} from 'lucide-react'

const iconMap = {
  Landmark, Building2, TrendingUp, Users, FileText,
}

export default function MacroDashboard() {
  const { macro } = useProject()
  const dispatch = useDispatch()

  async function fetchMacroData() {
    dispatch({ type: 'SET_MACRO_LOADING' })
    try {
      const result = await callAnthropic({
        prompt: macroResearchPrompt(),
        systemPrompt: 'You are a financial data research assistant. Return precise, current data. Be concise.',
        useWebSearch: true,
      })
      dispatch({
        type: 'SET_MACRO_DATA',
        payload: { rawAnalysis: result },
      })
    } catch (err) {
      dispatch({ type: 'SET_MACRO_ERROR', payload: err.message })
    }
  }

  return (
    <ResearchCard
      title="Macro Environment"
      icon={TrendingUp}
      loading={macro.loading}
      onResearch={fetchMacroData}
      researchLabel="Fetch Live Data"
    >
      {macro.error && (
        <div className="mb-4 flex items-start gap-2 p-3 rounded-lg bg-warning/10 text-warning text-xs">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Unable to fetch live data</p>
            <p className="text-warning/70 mt-0.5">{macro.error}</p>
          </div>
        </div>
      )}

      {/* Indicator grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {macroIndicators.map((indicator) => {
          const Icon = iconMap[indicator.icon] || FileText
          const liveValue = macro.indicators[indicator.id]

          return (
            <div
              key={indicator.id}
              className="bg-bg-primary rounded-lg p-3 border border-border-default"
            >
              <div className="flex items-center gap-1.5 mb-2">
                <Icon className="w-3.5 h-3.5 text-text-muted" />
                <span className="text-[11px] text-text-muted font-medium">{indicator.name}</span>
              </div>
              <div className="font-mono text-lg font-bold text-text-primary mb-1">
                {liveValue || indicator.courseReference}
              </div>
              <div className="text-[10px] text-text-muted">
                {liveValue ? 'Live' : 'Course ref'} · {indicator.source}
              </div>
            </div>
          )
        })}
      </div>

      {/* Live analysis display */}
      {macro.indicators.rawAnalysis && (
        <div className="mt-4 p-4 rounded-lg bg-bg-primary border border-border-default">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-3.5 h-3.5 text-accent-intelligence" />
            <span className="text-xs font-medium text-accent-intelligence">Live Research Results</span>
            {macro.lastFetched && (
              <span className="text-[10px] text-text-muted ml-auto">
                {new Date(macro.lastFetched).toLocaleString()}
              </span>
            )}
          </div>
          <div className="text-xs text-text-secondary leading-relaxed whitespace-pre-wrap">
            {macro.indicators.rawAnalysis}
          </div>
        </div>
      )}

      {!macro.indicators.rawAnalysis && !macro.loading && (
        <p className="mt-3 text-xs text-text-muted text-center">
          Click "Fetch Live Data" to research current macro indicators via AI web search.
          Course reference values shown as fallback.
        </p>
      )}
    </ResearchCard>
  )
}
