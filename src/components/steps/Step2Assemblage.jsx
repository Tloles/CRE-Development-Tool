import { Layers } from 'lucide-react'

export default function Step2Assemblage() {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent-intelligence/10 flex items-center justify-center shrink-0">
          <Layers className="w-5 h-5 text-accent-intelligence" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-accent-intelligence font-semibold">Step 2</span>
            <span className="text-[10px] uppercase tracking-widest text-text-muted">Intelligence</span>
          </div>
          <h2 className="text-xl font-bold text-text-primary">Acquisition & Assemblage</h2>
          <p className="text-sm text-text-secondary mt-1">
            Track individual parcel acquisitions, manage the assemblage process, and calculate total land basis.
          </p>
        </div>
      </div>
      <div className="bg-bg-card rounded-xl border border-border-default shadow-sm p-8 text-center">
        <Layers className="w-10 h-10 text-text-muted mx-auto mb-3" />
        <p className="text-base font-semibold text-text-primary mb-1">Coming Soon</p>
        <p className="text-sm text-text-secondary max-w-md mx-auto">
          Parcel tracker, land basis calculator, acquisition timeline, and assemblage cost analysis.
        </p>
      </div>
    </div>
  )
}
