import { LayoutDashboard } from 'lucide-react'

export default function Step5MasterPlan() {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent-enhancement/10 flex items-center justify-center shrink-0">
          <LayoutDashboard className="w-5 h-5 text-accent-enhancement" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-accent-enhancement font-semibold">Step 5</span>
            <span className="text-[10px] uppercase tracking-widest text-text-muted">Enhancement</span>
          </div>
          <h2 className="text-xl font-bold text-text-primary">Master Plan</h2>
          <p className="text-sm text-text-secondary mt-1">
            Develop the comprehensive land use plan with complementary uses and phasing.
          </p>
        </div>
      </div>
      <div className="bg-bg-card rounded-xl border border-border-default shadow-sm p-8 text-center">
        <LayoutDashboard className="w-10 h-10 text-text-muted mx-auto mb-3" />
        <p className="text-base font-semibold text-text-primary mb-1">Coming Soon</p>
        <p className="text-sm text-text-secondary max-w-md mx-auto">
          Land use plan with complementary uses, phasing strategy, density/FAR analysis, site plan inputs, parking, open space, and amenities.
        </p>
      </div>
    </div>
  )
}
