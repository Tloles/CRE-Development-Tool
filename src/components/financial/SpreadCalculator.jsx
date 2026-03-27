import { useProject, useDispatch } from '../../state/ProjectContext.jsx'
import { getSpreadHealth } from '../../utils/calculations.js'
import { formatCurrency, formatCurrencyCompact, formatPercent, formatBP } from '../../utils/formatters.js'
import TrafficLight from '../shared/TrafficLight.jsx'
import { Calculator, Info } from 'lucide-react'

export default function SpreadCalculator() {
  const { financial } = useProject()
  const dispatch = useDispatch()
  const health = getSpreadHealth(financial.developerSpread)

  function updateField(field, rawValue) {
    const value = parseFloat(rawValue)
    if (isNaN(value)) return
    dispatch({ type: 'UPDATE_FINANCIAL', payload: { [field]: value } })
  }

  return (
    <div className="bg-bg-card rounded-xl border border-border-default shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-5 py-3 border-b border-border-default">
        <Calculator className="w-4 h-4 text-gold" />
        <h3 className="text-sm font-semibold text-text-primary">Developer's Targeted Spread</h3>
        <TrafficLight status={health.color} label={health.label} />
      </div>

      <div className="p-5">
        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <InputField
            label="NOI at Stabilization"
            value={financial.noi}
            onChange={(v) => updateField('noi', v)}
            prefix="$"
            format={formatCurrencyCompact}
          />
          <InputField
            label="Total Cost of Development"
            value={financial.tcd}
            onChange={(v) => updateField('tcd', v)}
            prefix="$"
            format={formatCurrencyCompact}
          />
          <InputField
            label="Exit Cap Rate"
            value={financial.exitCapRate}
            onChange={(v) => updateField('exitCapRate', v)}
            suffix="%"
            step="0.1"
          />
        </div>

        {/* Results */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <ResultBox
            label="Developer's Yield"
            value={formatPercent(financial.developerYield)}
          />
          <ResultBox
            label="Developer's Spread"
            value={formatBP(financial.developerSpread)}
            health={health}
          />
          <ResultBox
            label="Implied Sale Price"
            value={formatCurrencyCompact(financial.impliedSalesPrice)}
          />
          <ResultBox
            label="Gross Profit/Loss"
            value={formatCurrencyCompact(financial.grossProfit)}
            health={financial.grossProfit >= 0 ? { color: 'healthy' } : { color: 'warning' }}
          />
        </div>

        {/* Benchmark reference */}
        <div className="p-3 rounded-lg bg-bg-primary border border-border-default">
          <div className="flex items-center gap-1.5 mb-2">
            <Info className="w-3 h-3 text-text-muted" />
            <span className="text-[10px] uppercase tracking-wider text-text-muted font-medium">
              Slide 38 Benchmarks
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <BenchmarkRow tcd="$100M" noi="$8M" cap="6.5%" spread="+150 BP" profit="$23M" status="healthy" />
            <BenchmarkRow tcd="$110M" noi="$6M" cap="7.0%" spread="-155 BP" profit="-$24M" status="warning" />
            <BenchmarkRow tcd="$95M" noi="$8M" cap="5.5%" spread="+292 BP" profit="$50.5M" status="healthy" />
          </div>
        </div>
      </div>
    </div>
  )
}

function InputField({ label, value, onChange, prefix, suffix, step = '1', format }) {
  return (
    <div>
      <label className="block text-[11px] uppercase tracking-wider text-text-muted font-medium mb-1.5">
        {label}
      </label>
      <div className="relative">
        {prefix && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted text-sm font-mono">{prefix}</span>
        )}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          step={step}
          className={`
            w-full bg-white border border-border-default rounded-lg px-3 py-2 text-sm font-mono text-text-primary
            focus:outline-none focus:ring-1 focus:ring-gold/50 focus:border-gold/50 transition-colors
            ${prefix ? 'pl-7' : ''} ${suffix ? 'pr-7' : ''}
          `}
        />
        {suffix && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted text-sm font-mono">{suffix}</span>
        )}
      </div>
      {format && (
        <p className="mt-1 text-[10px] text-text-muted font-mono">{format(value)}</p>
      )}
    </div>
  )
}

function ResultBox({ label, value, health }) {
  const colors = {
    healthy: 'text-healthy',
    caution: 'text-caution',
    warning: 'text-warning',
  }

  return (
    <div className="bg-bg-primary rounded-lg p-3 border border-border-default text-center">
      <p className="text-[10px] uppercase tracking-wider text-text-muted font-medium mb-1">{label}</p>
      <p className={`text-lg font-mono font-bold ${health ? colors[health.color] : 'text-text-primary'}`}>
        {value}
      </p>
    </div>
  )
}

function BenchmarkRow({ tcd, noi, cap, spread, profit, status }) {
  return (
    <div className="flex items-center justify-between text-[11px] font-mono bg-white rounded px-2 py-1.5 border border-border-subtle">
      <span className="text-text-muted">{tcd} TCD, {noi} NOI, {cap} cap</span>
      <span className={status === 'healthy' ? 'text-healthy font-medium' : 'text-warning font-medium'}>
        {spread}
      </span>
    </div>
  )
}
