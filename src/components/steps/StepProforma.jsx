import SpreadCalculator from '../financial/SpreadCalculator.jsx'
import { Calculator } from 'lucide-react'

export default function StepProforma() {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent-execution/10 flex items-center justify-center shrink-0">
          <Calculator className="w-5 h-5 text-accent-execution" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-accent-execution font-semibold">Proforma</span>
            <span className="text-[10px] uppercase tracking-widest text-text-muted">Execution</span>
          </div>
          <h2 className="text-xl font-bold text-text-primary">Land Deal Financial Model</h2>
          <p className="text-sm text-text-secondary mt-1">
            Sources & uses, return analysis, and deal structuring for the land enhancement strategy.
          </p>
        </div>
      </div>

      {/* Existing spread calculator */}
      <SpreadCalculator />

      {/* Future proforma sections */}
      <div className="bg-bg-card rounded-xl border border-border-default shadow-sm p-8 text-center">
        <Calculator className="w-10 h-10 text-text-muted mx-auto mb-3" />
        <p className="text-base font-semibold text-text-primary mb-1">Full Proforma — Coming Soon</p>
        <p className="text-sm text-text-secondary max-w-md mx-auto">
          Sources & uses breakdown, IRR/equity multiple analysis, disposition proceeds modeling, and hold period cash flow projections.
        </p>
      </div>
    </div>
  )
}
