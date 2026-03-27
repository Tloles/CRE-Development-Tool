import { useProject } from '../../state/ProjectContext.jsx'
import { Landmark, Download } from 'lucide-react'

export default function Header() {
  const { project } = useProject()

  return (
    <header className="bg-navy sticky top-0 z-50">
      <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gold/15 flex items-center justify-center">
            <Landmark className="w-5 h-5 text-gold" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-text-on-navy leading-tight">
              <span className="text-gold">Land Enhancement</span> Platform
            </h1>
            <p className="text-xs text-text-on-navy-muted leading-tight">
              Enhancement & Acceleration Model
              {project.name && (
                <span className="text-text-on-navy ml-2">
                  &mdash; {project.name}
                </span>
              )}
            </p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium text-text-on-navy-muted hover:text-text-on-navy hover:bg-navy-light transition-colors">
          <Download className="w-3.5 h-3.5" />
          Export
        </button>
      </div>
    </header>
  )
}
