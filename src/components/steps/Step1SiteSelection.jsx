import { useProject, useDispatch } from '../../state/ProjectContext.jsx'
import MacroDashboard from '../research/MacroDashboard.jsx'
import SectorResearch from '../research/SectorResearch.jsx'
import DriversOfChange from '../research/DriversOfChange.jsx'
import SpreadCalculator from '../financial/SpreadCalculator.jsx'
import AIAnalysisPanel from '../shared/AIAnalysisPanel.jsx'
import { Search, MapPin } from 'lucide-react'

export default function Step1SiteSelection() {
  const { project } = useProject()
  const dispatch = useDispatch()

  return (
    <div className="space-y-6">
      {/* Step header */}
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent-intelligence/10 flex items-center justify-center shrink-0">
          <Search className="w-5 h-5 text-accent-intelligence" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-accent-intelligence font-semibold">Step 1</span>
            <span className="text-[10px] uppercase tracking-widest text-text-muted">Intelligence</span>
          </div>
          <h2 className="text-xl font-bold text-text-primary">Site Selection & Due Diligence</h2>
          <p className="text-sm text-text-secondary mt-1">
            Define your project, assess the macro environment, analyze site fundamentals, and build your investment thesis.
          </p>
        </div>
      </div>

      {/* Project Concept */}
      <div className="bg-bg-card rounded-xl border border-border-default shadow-sm p-5">
        <h3 className="text-sm font-semibold text-text-primary mb-4">Project Concept</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-text-muted font-medium mb-1.5">
              Project Name
            </label>
            <input
              type="text"
              value={project.name}
              onChange={(e) => dispatch({ type: 'UPDATE_PROJECT', payload: { name: e.target.value } })}
              placeholder="e.g., Riverside Commerce Park"
              className="w-full bg-white border border-border-default rounded-lg px-3 py-2 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-accent-intelligence/50 focus:border-accent-intelligence/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-text-muted font-medium mb-1.5">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Location / Address</span>
            </label>
            <input
              type="text"
              value={project.location}
              onChange={(e) => dispatch({ type: 'UPDATE_PROJECT', payload: { location: e.target.value } })}
              placeholder="e.g., Peachtree Corners, GA"
              className="w-full bg-white border border-border-default rounded-lg px-3 py-2 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-accent-intelligence/50 focus:border-accent-intelligence/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-text-muted font-medium mb-1.5">
              Current Use
            </label>
            <select
              value={project.currentUse}
              onChange={(e) => dispatch({ type: 'UPDATE_PROJECT', payload: { currentUse: e.target.value } })}
              className="w-full bg-white border border-border-default rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:ring-1 focus:ring-accent-intelligence/50 focus:border-accent-intelligence/50 transition-colors"
            >
              <option value="">Select...</option>
              <option value="Vacant Land">Vacant Land</option>
              <option value="Agricultural">Agricultural</option>
              <option value="Single-Family Residential">Single-Family Residential</option>
              <option value="Commercial">Commercial</option>
              <option value="Industrial">Industrial</option>
              <option value="Mixed">Mixed</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-text-muted font-medium mb-1.5">
              Total Acreage
            </label>
            <input
              type="number"
              value={project.totalAcreage || ''}
              onChange={(e) => dispatch({ type: 'UPDATE_PROJECT', payload: { totalAcreage: e.target.value ? parseFloat(e.target.value) : null } })}
              placeholder="e.g., 42.5"
              step="0.1"
              className="w-full bg-white border border-border-default rounded-lg px-3 py-2 text-sm font-mono text-text-primary placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-accent-intelligence/50 focus:border-accent-intelligence/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-text-muted font-medium mb-1.5">
              Target Acquisition Price
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm font-mono">$</span>
              <input
                type="number"
                value={project.targetAcquisitionPrice || ''}
                onChange={(e) => dispatch({ type: 'UPDATE_PROJECT', payload: { targetAcquisitionPrice: e.target.value ? parseFloat(e.target.value) : null } })}
                placeholder="e.g., 5000000"
                className="w-full bg-white border border-border-default rounded-lg pl-7 pr-3 py-2 text-sm font-mono text-text-primary placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-accent-intelligence/50 focus:border-accent-intelligence/50 transition-colors"
              />
            </div>
          </div>
          <div className="sm:col-span-2 lg:col-span-1">
            <label className="block text-[11px] uppercase tracking-wider text-text-muted font-medium mb-1.5">
              Site Description
            </label>
            <textarea
              value={project.description}
              onChange={(e) => dispatch({ type: 'UPDATE_PROJECT', payload: { description: e.target.value } })}
              placeholder="Brief description of the site and your investment thesis..."
              rows={2}
              className="w-full bg-white border border-border-default rounded-lg px-3 py-2 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-accent-intelligence/50 focus:border-accent-intelligence/50 transition-colors resize-none"
            />
          </div>
        </div>
      </div>

      {/* Two-column layout for research content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <MacroDashboard />
          <DriversOfChange />
        </div>
        <div className="space-y-6">
          <SectorResearch />
          <SpreadCalculator />
        </div>
      </div>

      {/* AI Analysis */}
      <AIAnalysisPanel />
    </div>
  )
}
