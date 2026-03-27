import { useProject } from '../../state/ProjectContext.jsx'
import { getSpreadHealth } from '../../utils/calculations.js'
import { formatCurrencyCompact, formatPercent, formatBP } from '../../utils/formatters.js'
import { TrendingUp, DollarSign, Target, ChevronUp, ChevronDown } from 'lucide-react'
import { useState } from 'react'

export default function FinancialModelPanel() {
  const { financial } = useProject()
  const [expanded, setExpanded] = useState(true)
  const health = getSpreadHealth(financial.developerSpread)

  const healthColors = {
    healthy: 'text-healthy',
    caution: 'text-caution',
    warning: 'text-warning',
  }

  const healthBg = {
    healthy: 'bg-healthy/10',
    caution: 'bg-caution/10',
    warning: 'bg-warning/10',
  }

  return (
    <div className="border-t border-border-default bg-white">
      <div className="max-w-[1600px] mx-auto px-6">
        {/* Toggle bar */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between py-3 text-left"
        >
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-gold" />
              <span className="text-sm font-semibold text-text-primary">Financial Model</span>
            </div>
            <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${healthBg[health.color]} ${healthColors[health.color]}`}>
              {formatBP(financial.developerSpread)} — {health.label}
            </span>
          </div>
          {expanded ? <ChevronDown className="w-4 h-4 text-text-muted" /> : <ChevronUp className="w-4 h-4 text-text-muted" />}
        </button>

        {/* Expanded metrics */}
        {expanded && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 pb-4">
            <MetricCard
              label="Developer's Yield"
              value={formatPercent(financial.developerYield)}
              icon={TrendingUp}
            />
            <MetricCard
              label="Exit Cap Rate"
              value={formatPercent(financial.exitCapRate)}
              icon={Target}
            />
            <MetricCard
              label="Developer's Spread"
              value={formatBP(financial.developerSpread)}
              health={health}
              icon={TrendingUp}
            />
            <MetricCard
              label="NOI at Stabilization"
              value={formatCurrencyCompact(financial.noi)}
              icon={DollarSign}
            />
            <MetricCard
              label="Implied Sale Price"
              value={formatCurrencyCompact(financial.impliedSalesPrice)}
              icon={DollarSign}
            />
            <MetricCard
              label="Gross Profit/Loss"
              value={formatCurrencyCompact(financial.grossProfit)}
              health={financial.grossProfit >= 0 ? { color: 'healthy' } : { color: 'warning' }}
              icon={DollarSign}
            />
          </div>
        )}
      </div>
    </div>
  )
}

function MetricCard({ label, value, health, icon: Icon }) {
  const healthColors = {
    healthy: 'text-healthy',
    caution: 'text-caution',
    warning: 'text-warning',
  }

  return (
    <div className="bg-bg-primary rounded-lg px-3 py-2.5 border border-border-default">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className="w-3 h-3 text-text-muted" />
        <span className="text-[10px] uppercase tracking-wider text-text-muted font-medium">{label}</span>
      </div>
      <span className={`text-lg font-mono font-bold ${health ? healthColors[health.color] : 'text-text-primary'}`}>
        {value}
      </span>
    </div>
  )
}
