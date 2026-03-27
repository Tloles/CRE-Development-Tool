import { Loader2 } from 'lucide-react'

export default function ResearchCard({ title, icon: Icon, children, loading, onResearch, researchLabel = 'Research' }) {
  return (
    <div className="bg-bg-card rounded-xl border border-border-default shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-border-default">
        <div className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-gold" />}
          <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
        </div>
        {onResearch && (
          <button
            onClick={onResearch}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-gold/10 text-gold hover:bg-gold/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin" />
                Researching...
              </>
            ) : (
              researchLabel
            )}
          </button>
        )}
      </div>
      <div className="p-5">
        {children}
      </div>
    </div>
  )
}
