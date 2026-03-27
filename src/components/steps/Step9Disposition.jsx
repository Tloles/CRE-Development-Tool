import { ArrowRightLeft } from 'lucide-react'

export default function Step9Disposition() {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent-execution/10 flex items-center justify-center shrink-0">
          <ArrowRightLeft className="w-5 h-5 text-accent-execution" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-accent-execution font-semibold">Step 9</span>
            <span className="text-[10px] uppercase tracking-widest text-text-muted">Execution</span>
          </div>
          <h2 className="text-xl font-bold text-text-primary">Disposition</h2>
          <p className="text-sm text-text-secondary mt-1">
            Execute the exit strategy — sell or ground lease to end users and developers.
          </p>
        </div>
      </div>
      <div className="bg-bg-card rounded-xl border border-border-default shadow-sm p-8 text-center">
        <ArrowRightLeft className="w-10 h-10 text-text-muted mx-auto mb-3" />
        <p className="text-base font-semibold text-text-primary mb-1">Coming Soon</p>
        <p className="text-sm text-text-secondary max-w-md mx-auto">
          Sale and ground lease strategy, buyer/developer pipeline, deal structuring, exit timing, and marketing approach.
        </p>
      </div>
    </div>
  )
}
