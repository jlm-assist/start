import { getMetricColor, formatMetric } from '@/lib/utils'

interface MetricCardProps {
  label: string
  value?: number
  unit?: string
  description?: string
  trend?: 'up' | 'down' | 'stable'
  trendValue?: number
}

export function MetricCard({
  label,
  value,
  unit,
  description,
  trend,
  trendValue,
}: MetricCardProps) {
  const color = getMetricColor(value)
  const colorClass = {
    green: 'bg-green-50 border-green-200 text-green-700',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    red: 'bg-red-50 border-red-200 text-red-700',
    gray: 'bg-gray-50 border-gray-200 text-gray-700',
  }[color]

  const trendIcon = {
    up: '↑',
    down: '↓',
    stable: '→',
  }[trend || 'stable']

  return (
    <div className={`card ${colorClass} p-6`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{label}</p>
          <p className="text-3xl font-bold mb-2">{formatMetric(value, unit)}</p>
          {description && <p className="text-xs text-gray-500">{description}</p>}
        </div>
        {trend && (
          <div className="text-right">
            <p className="text-xl">{trendIcon}</p>
            {trendValue !== undefined && (
              <p className="text-xs text-gray-600">{trendValue > 0 ? '+' : ''}{trendValue.toFixed(1)}%</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
