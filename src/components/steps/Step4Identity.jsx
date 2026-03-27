import { Fingerprint } from 'lucide-react'

export default function Step4Identity() {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-accent-enhancement/10 flex items-center justify-center shrink-0">
          <Fingerprint className="w-5 h-5 text-accent-enhancement" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-accent-enhancement font-semibold">Step 4</span>
            <span className="text-[10px] uppercase tracking-widest text-text-muted">Enhancement</span>
          </div>
          <h2 className="text-xl font-bold text-text-primary">Project Identity</h2>
          <p className="text-sm text-text-secondary mt-1">
            Establish the project's unique identity and market positioning.
          </p>
        </div>
      </div>
      <div className="bg-bg-card rounded-xl border border-border-default shadow-sm p-8 text-center">
        <Fingerprint className="w-10 h-10 text-text-muted mx-auto mb-3" />
        <p className="text-base font-semibold text-text-primary mb-1">Coming Soon</p>
        <p className="text-sm text-text-secondary max-w-md mx-auto">
          Project naming, branding direction, narrative development, positioning statement, and market story.
        </p>
      </div>
    </div>
  )
}
