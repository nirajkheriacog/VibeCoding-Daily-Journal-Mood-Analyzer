import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'
import type { ChartDataPoint } from '../hooks/useMoodData'
import { MOODS } from '../constants'
import type { Mood } from '../types'

const SCORE_TO_MOOD: Record<number, string> = {
  1: 'Sad',
  2: 'Anxious',
  3: 'Neutral',
  4: 'Calm',
  5: 'Happy',
  6: 'Excited',
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

interface CustomTooltipProps {
  active?: boolean
  payload?: Array<{ payload: ChartDataPoint }>
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  const point = payload[0].payload
  const config = MOODS[point.mood as Mood]
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-3">
      <p className="text-sm text-gray-500">{formatDate(point.date)}</p>
      <p className="text-lg font-medium">
        <span aria-hidden="true">{config.emoji}</span> {config.label}
      </p>
    </div>
  )
}

interface MoodChartProps {
  data: ChartDataPoint[]
}

export default function MoodChart({ data }: MoodChartProps) {
  if (data.length < 2) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg mb-1">Not enough data to show a chart.</p>
        <p className="text-sm">Keep journaling to see your mood trends!</p>
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="date"
          tickFormatter={formatDate}
          tick={{ fontSize: 12, fill: '#6b7280' }}
        />
        <YAxis
          domain={[1, 6]}
          ticks={[1, 2, 3, 4, 5, 6]}
          tickFormatter={(v: number) => SCORE_TO_MOOD[v] ?? ''}
          tick={{ fontSize: 12, fill: '#6b7280' }}
          width={70}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="score"
          stroke="#6366f1"
          strokeWidth={2}
          dot={{ r: 5, fill: '#6366f1' }}
          activeDot={{ r: 7 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
