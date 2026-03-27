import { useProject, useDispatch } from '../../state/ProjectContext.jsx'
import {
  Search, Layers, Sparkles, Fingerprint, LayoutDashboard,
  Scale, Users, Hammer, ArrowRightLeft, Calculator
} from 'lucide-react'

const steps = [
  { num: 1, name: 'Site Selection', icon: Search, section: 'intelligence' },
  { num: 2, name: 'Assemblage', icon: Layers, section: 'intelligence' },
  { num: 3, name: 'Reimagination', icon: Sparkles, section: 'enhancement' },
  { num: 4, name: 'Identity', icon: Fingerprint, section: 'enhancement' },
  { num: 5, name: 'Master Plan', icon: LayoutDashboard, section: 'enhancement' },
  { num: 6, name: 'Entitlements', icon: Scale, section: 'enhancement' },
  { num: 7, name: 'Drivers & Users', icon: Users, section: 'enhancement' },
  { num: 8, name: 'Infrastructure', icon: Hammer, section: 'execution' },
  { num: 9, name: 'Disposition', icon: ArrowRightLeft, section: 'execution' },
  { num: 10, name: 'Proforma', icon: Calculator, section: 'execution', label: 'P' },
]

const sectionAccents = {
  intelligence: { bg: 'bg-accent-intelligence', text: 'text-accent-intelligence' },
  enhancement: { bg: 'bg-accent-enhancement', text: 'text-accent-enhancement' },
  execution: { bg: 'bg-accent-execution', text: 'text-accent-execution' },
}

export default function StepNavigator() {
  const { currentStep } = useProject()
  const dispatch = useDispatch()

  return (
    <nav className="bg-navy">
      <div className="max-w-[1600px] mx-auto px-6">
        <div className="flex gap-0.5 overflow-x-auto py-2 scrollbar-hide">
          {steps.map((step, idx) => {
            const Icon = step.icon
            const isActive = currentStep === step.num
            const accent = sectionAccents[step.section]
            const prevStep = steps[idx - 1]
            const showDivider = prevStep && prevStep.section !== step.section

            return (
              <div key={step.num} className="flex items-center">
                {showDivider && (
                  <div className="w-px h-6 bg-text-on-navy-muted/20 mx-1.5 shrink-0" />
                )}
                <button
                  onClick={() => dispatch({ type: 'SET_STEP', payload: step.num })}
                  className={`
                    flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium whitespace-nowrap transition-all
                    ${isActive
                      ? `${accent.bg} text-white`
                      : 'text-text-on-navy-muted hover:bg-navy-light hover:text-text-on-navy'
                    }
                  `}
                >
                  <span className={`
                    w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0
                    ${isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-navy-light text-text-on-navy-muted'
                    }
                  `}>
                    {step.label || step.num}
                  </span>
                  <Icon className="w-3.5 h-3.5 shrink-0 hidden sm:block" />
                  <span className="hidden md:inline">{step.name}</span>
                </button>
              </div>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
