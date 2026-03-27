import { Sparkles } from 'lucide-react'

export default function Step3Reimagination() {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent-enhancement/10 flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5 text-accent-enhancement" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-accent-enhancement font-semibold">Step 3</span>
            <span className="text-[10px] uppercase tracking-widest text-text-muted">Enhancement</span>
          </div>
          <h2 className="text-xl font-bold text-text-primary">Reimagination</h2>
          <p className="text-sm text-text-secondary mt-1">
            The creative visioning step — reimagine what this land could become.
          </p>
        </div>
      </div>
      <div className="bg-bg-card rounded-xl border border-border-default shadow-sm p-8 text-center">
        <Sparkles className="w-10 h-10 text-text-muted mx-auto mb-3" />
        <p className="text-base font-semibold text-text-primary mb-1">Coming Soon</p>
        <p className="text-sm text-text-secondary max-w-md mx-auto">
          Comp analysis, highest & best use exploration, concept development.
        </p>
      </div>
    </div>
  )
}
