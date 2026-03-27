import { useProject, useDispatch } from '../../state/ProjectContext.jsx'
import { drivers } from '../../data/drivers.js'
import ResearchCard from '../shared/ResearchCard.jsx'
import {
  TrendingUp, Landmark, Users, Cpu, DollarSign, Heart, Leaf, Globe, Zap
} from 'lucide-react'

const iconMap = {
  TrendingUp, Landmark, Users, Cpu, DollarSign, Heart, Leaf, Globe,
}

export default function DriversOfChange() {
  const { drivers: driverState } = useProject()
  const dispatch = useDispatch()

  return (
    <ResearchCard title="8 Drivers of Change" icon={Zap}>
      <p className="text-xs text-text-muted mb-4">
        Select the macro forces most relevant to your project. These shape the development environment.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {drivers.map((driver) => {
          const Icon = iconMap[driver.icon] || Globe
          const isSelected = driverState.selected.includes(driver.id)

          return (
            <button
              key={driver.id}
              onClick={() => dispatch({ type: 'TOGGLE_DRIVER', payload: driver.id })}
              className={`
                flex items-start gap-3 p-3 rounded-lg text-left transition-all border
                ${isSelected
                  ? 'bg-gold/8 border-gold/25 ring-1 ring-gold/15'
                  : 'bg-bg-primary border-border-default hover:border-border-strong hover:bg-bg-card-hover'
                }
              `}
            >
              <div className={`
                w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5
                ${isSelected ? 'bg-gold/15 text-gold' : 'bg-white text-text-muted border border-border-default'}
              `}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <p className={`text-xs font-semibold ${isSelected ? 'text-gold' : 'text-text-primary'}`}>
                  {driver.name}
                </p>
                <p className="text-[11px] text-text-muted mt-0.5 leading-relaxed">
                  {driver.description}
                </p>
              </div>
            </button>
          )
        })}
      </div>
      {driverState.selected.length > 0 && (
        <p className="mt-3 text-xs text-text-muted">
          {driverState.selected.length} driver{driverState.selected.length !== 1 ? 's' : ''} selected
        </p>
      )}
    </ResearchCard>
  )
}
