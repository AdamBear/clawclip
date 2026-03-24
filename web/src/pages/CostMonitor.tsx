import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, TrendingDown, Minus, AlertTriangle } from 'lucide-react'

interface DailyData {
  date: string
  cost: number
  totalTokens: number
}

interface CostSummary {
  totalCost: number
  totalTokens: number
  inputTokens: number
  outputTokens: number
  trend: 'up' | 'down' | 'stable'
  comparedToLastMonth: number
  budget: { isAlert: boolean; percentage: number; message: string }
  topTasks: { taskId: string; taskName: string; cost: number; tokens: number }[]
}

export default function CostMonitor() {
  const [daily, setDaily] = useState<DailyData[]>([])
  const [summary, setSummary] = useState<CostSummary | null>(null)
  const [days, setDays] = useState(7)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    const safeFetch = async (url: string) => {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      return res.json()
    }

    Promise.all([
      safeFetch(`/api/cost/daily?days=${days}`),
      safeFetch(`/api/cost/summary?days=${days}`),
    ]).then(([d, s]) => {
      setDaily(d)
      setSummary(s)
    }).catch(() => {
      setError('获取费用数据失败，请检查后端是否运行')
    }).finally(() => {
      setLoading(false)
    })
  }, [days])

  const TrendIcon = summary?.trend === 'up' ? TrendingUp : summary?.trend === 'down' ? TrendingDown : Minus
  const trendColor = summary?.trend === 'up' ? 'text-red-400' : summary?.trend === 'down' ? 'text-green-400' : 'text-slate-400'

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">费用监控</h2>
        <div className="flex gap-2">
          {[7, 14, 30].map(d => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                days === d ? 'bg-orange-500 text-white' : 'bg-[#1e293b] text-slate-400 hover:text-white'
              }`}
            >
              {d}天
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12 text-slate-500">
          <span className="text-lg">加载中...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 text-red-300 text-sm">
          {error}
        </div>
      )}

      {/* 预算告警 */}
      {!loading && summary?.budget?.isAlert && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
          <span className="text-red-300 text-sm">{summary.budget.message}</span>
        </div>
      )}

      {/* 统计卡片 */}
      {!loading && (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-[#1e293b] rounded-xl p-5 border border-[#334155]">
          <span className="text-sm text-slate-400">总费用</span>
          <div className="text-2xl font-bold text-orange-400 mt-1">
            ¥{summary?.totalCost?.toFixed(2) || '0.00'}
          </div>
          <div className={`flex items-center gap-1 mt-1 text-xs ${trendColor}`}>
            <TrendIcon className="w-3 h-3" />
            <span>{summary?.comparedToLastMonth?.toFixed(1) || 0}% 环比</span>
          </div>
        </div>
        <div className="bg-[#1e293b] rounded-xl p-5 border border-[#334155]">
          <span className="text-sm text-slate-400">Token 消耗</span>
          <div className="text-2xl font-bold text-blue-400 mt-1">
            {summary?.totalTokens?.toLocaleString() || '0'}
          </div>
          <div className="text-xs text-slate-500 mt-1">
            输入 {summary?.inputTokens?.toLocaleString() || 0} / 输出 {summary?.outputTokens?.toLocaleString() || 0}
          </div>
        </div>
        <div className="bg-[#1e293b] rounded-xl p-5 border border-[#334155]">
          <span className="text-sm text-slate-400">预算使用</span>
          <div className="text-2xl font-bold text-purple-400 mt-1">
            {summary?.budget?.percentage?.toFixed(1) || '0'}%
          </div>
          <div className="w-full bg-[#334155] rounded-full h-2 mt-2">
            <div
              className={`h-2 rounded-full transition-all ${
                (summary?.budget?.percentage || 0) > 80 ? 'bg-red-500' : 'bg-purple-500'
              }`}
              style={{ width: `${Math.min(summary?.budget?.percentage || 0, 100)}%` }}
            />
          </div>
        </div>
      </div>
      )}

      {/* 趋势图 */}
      {!loading && (
      <div className="bg-[#1e293b] rounded-xl p-6 border border-[#334155] mb-6">
        <h3 className="text-lg font-semibold mb-4">费用趋势</h3>
        {summary && summary.totalCost === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500">
            <span className="text-4xl mb-3">📉</span>
            <p className="text-lg mb-1">暂无费用数据</p>
            <p className="text-sm">启动 OpenClaw 并使用一段时间后，这里会显示费用趋势图</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={daily}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 12 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ background: '#1e293b', border: '1px solid #334155', borderRadius: 8 }}
                labelStyle={{ color: '#94a3b8' }}
              />
              <Line type="monotone" dataKey="cost" stroke="#f97316" strokeWidth={2} dot={false} name="费用 (¥)" />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
      )}

      {/* TOP 消耗任务 */}
      {!loading && summary?.topTasks && summary.topTasks.length > 0 && (
        <div className="bg-[#1e293b] rounded-xl p-6 border border-[#334155]">
          <h3 className="text-lg font-semibold mb-4">高消耗任务 TOP 5</h3>
          <div className="space-y-3">
            {summary.topTasks.slice(0, 5).map((task, i) => (
              <div key={task.taskId} className="flex items-center justify-between py-2 border-b border-[#334155] last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-slate-500 text-sm w-6">{i + 1}.</span>
                  <span className="text-sm truncate max-w-[300px]">{task.taskName}</span>
                </div>
                <div className="text-right">
                  <span className="text-orange-400 font-medium">¥{task.cost.toFixed(4)}</span>
                  <span className="text-xs text-slate-500 ml-2">{task.tokens.toLocaleString()} tokens</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
