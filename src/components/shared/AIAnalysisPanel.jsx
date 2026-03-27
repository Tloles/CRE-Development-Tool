import { useState } from 'react'
import { useProject, useDispatch } from '../../state/ProjectContext.jsx'
import { callAnthropic } from '../../utils/api.js'
import { aiAnalysisPrompt } from '../../utils/researchPrompts.js'
import { BrainCircuit, Loader2, AlertCircle, Send } from 'lucide-react'

export default function AIAnalysisPanel() {
  const { project, sector, macro, aiAnalysis } = useProject()
  const dispatch = useDispatch()
  const [customPrompt, setCustomPrompt] = useState('')

  const sectorName = sector.selected
    ? `${sector.selected}${sector.subtype ? ` — ${sector.subtype}` : ''}`
    : null

  async function runAnalysis() {
    dispatch({ type: 'SET_AI_LOADING' })
    try {
      const prompt = customPrompt.trim() || aiAnalysisPrompt(sectorName, project.location, macro.indicators)
      const result = await callAnthropic({
        prompt,
        systemPrompt: 'You are a senior land investment and CRE development advisor with 20+ years of experience. Provide concise, actionable analysis focused on land enhancement and acceleration strategies.',
        useWebSearch: true,
      })
      dispatch({
        type: 'ADD_AI_RESULT',
        payload: {
          id: Date.now(),
          query: customPrompt.trim() || 'Site Assessment',
          response: result,
          timestamp: new Date().toISOString(),
        },
      })
      setCustomPrompt('')
    } catch (err) {
      dispatch({ type: 'SET_AI_ERROR', payload: err.message })
    }
  }

  return (
    <div className="bg-bg-card rounded-xl border border-border-default shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3 border-b border-border-default">
        <BrainCircuit className="w-4 h-4 text-accent-intelligence" />
        <h3 className="text-sm font-semibold text-text-primary">AI Analysis</h3>
      </div>

      <div className="p-5">
        {/* Input */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !aiAnalysis.loading && runAnalysis()}
            placeholder="Ask about site potential, risks, market conditions, path of progress..."
            className="flex-1 bg-white border border-border-default rounded-lg px-3 py-2 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-accent-intelligence/50 focus:border-accent-intelligence/50 transition-colors"
          />
          <button
            onClick={runAnalysis}
            disabled={aiAnalysis.loading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium bg-accent-intelligence text-white hover:bg-blue-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {aiAnalysis.loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            Analyze
          </button>
        </div>

        {/* Error */}
        {aiAnalysis.error && (
          <div className="mb-4 flex items-start gap-2 p-3 rounded-lg bg-warning/10 text-warning text-xs">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <p>{aiAnalysis.error}</p>
          </div>
        )}

        {/* Results */}
        {aiAnalysis.results.length > 0 ? (
          <div className="space-y-3">
            {aiAnalysis.results.map((result) => (
              <div key={result.id} className="p-4 rounded-lg bg-bg-primary border border-border-default">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-accent-intelligence">{result.query}</span>
                  <span className="text-[10px] text-text-muted">
                    {new Date(result.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="text-xs text-text-secondary leading-relaxed whitespace-pre-wrap">
                  {result.response}
                </div>
              </div>
            ))}
          </div>
        ) : (
          !aiAnalysis.loading && (
            <p className="text-xs text-text-muted text-center py-4">
              Run AI analysis to get a site assessment based on your project parameters.
              {!sectorName && ' Select a sector first for more targeted analysis.'}
            </p>
          )
        )}
      </div>
    </div>
  )
}
