import { Activity, DollarSign, Puzzle, Wifi, WifiOff, ArrowRight, Sparkles, Cloud } from 'lucide-react'
import { useState, useEffect } from 'react'
import type { Tab } from '../App'
import WordCloud, { type KeywordItem } from '../components/WordCloud'

interface StatusData {
  running: boolean
  version: string
  skillCount: number
  channels: string[]
}

interface CostSummary {
  totalCost: number
  totalTokens: number
  trend: 'up' | 'down' | 'stable'
}

interface SessionMeta {
  id: string
  agentName: string
  startTime: string
  endTime: string
  durationMs: number
  totalCost: number
  totalTokens: number
  modelUsed: string[]
  stepCount: number
  summary: string
}

interface Props {
  onNavigate: (tab: Tab) => void
}

function formatRelativeTime(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const min = Math.floor(diff / 60000)
  if (min < 1) return '刚刚'
  if (min < 60) return `${min}分钟前`
  const hours = Math.floor(min / 60)
  if (hours < 24) return `${hours}小时前`
  const days = Math.floor(hours / 24)
  if (days === 1) return '昨天'
  if (days < 30) return `${days}天前`
  return new Date(dateStr).toLocaleDateString('zh-CN')
}

function truncateSummary(s: string, max: number): string {
  const t = s.trim()
  if (t.length <= max) return t
  return `${t.slice(0, max)}…`
}

const STAGGER_DELAYS = ['animate-delay-100', 'animate-delay-200', 'animate-delay-300', 'animate-delay-400'] as const

export default function Dashboard({ onNavigate }: Props) {
  const [status, setStatus] = useState<StatusData | null>(null)
  const [cost, setCost] = useState<CostSummary | null>(null)
  const [loading, setLoading] = useState(true)
  const [keywords, setKeywords] = useState<KeywordItem[]>([])
  const [kwLoading, setKwLoading] = useState(true)
  const [kwError, setKwError] = useState<string | null>(null)
  const [recentSessions, setRecentSessions] = useState<SessionMeta[]>([])
  const [recentLoading, setRecentLoading] = useState(true)

  useEffect(() => {
    const safeFetch = async (url: string) => {
      try {
        const res = await fetch(url)
        if (!res.ok) return null
        return await res.json()
      } catch {
        return null
      }
    }

    Promise.all([safeFetch('/api/status'), safeFetch('/api/cost/summary?days=30')])
      .then(([s, c]) => {
        setStatus(s)
        setCost(c)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    let cancelled = false
    setKwLoading(true)
    setKwError(null)
    fetch('/api/analytics/keywords?days=30&limit=40')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json() as Promise<{ keywords?: KeywordItem[] }>
      })
      .then(data => {
        if (cancelled) return
        setKeywords(Array.isArray(data.keywords) ? data.keywords : [])
      })
      .catch(() => {
        if (!cancelled) {
          setKwError('关键词加载失败')
          setKeywords([])
        }
      })
      .finally(() => {
        if (!cancelled) setKwLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    setRecentLoading(true)
    fetch('/api/replay/sessions?limit=3')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        return res.json() as Promise<unknown>
      })
      .then(data => {
        if (cancelled) return
        setRecentSessions(Array.isArray(data) ? (data as SessionMeta[]) : [])
      })
      .catch(() => {
        if (!cancelled) setRecentSessions([])
      })
      .finally(() => {
        if (!cancelled) setRecentLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const hour = new Date().getHours()
  const greeting = hour < 6 ? '夜深了' : hour < 12 ? '早上好' : hour < 18 ? '下午好' : '晚上好'
  const isNightGreeting = hour >= 18 || hour < 6

  const cards = [
    {
      title: 'OpenClaw 状态',
      value: loading ? '检测中...' : status?.running ? '运行中' : '未连接',
      icon: status?.running ? Wifi : WifiOff,
      color: status?.running ? 'text-green-400' : 'text-slate-500',
      bg: status?.running ? 'bg-green-500/10' : 'bg-slate-500/10',
      sub: status?.version && status.version !== 'unknown' ? `v${status.version}` : '',
    },
    {
      title: '本月费用',
      value: cost ? `¥${cost.totalCost.toFixed(2)}` : '¥0.00',
      icon: DollarSign,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
      sub: cost ? `${cost.totalTokens.toLocaleString()} tokens` : '',
    },
    {
      title: '已装 Skills',
      value: status?.skillCount?.toString() || '0',
      icon: Puzzle,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      sub: '个技能',
    },
    {
      title: '已连接平台',
      value: status?.channels?.length?.toString() || '0',
      icon: Activity,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      sub: status?.channels?.length ? status.channels.join(', ') : '无',
    },
  ]

  return (
    <div>
      {/* 欢迎区 */}
      <div className="bg-gradient-to-r from-orange-500/10 via-purple-500/5 to-blue-500/10 rounded-2xl p-6 mb-6 border border-orange-500/20 animate-fade-in-up">
        <div className="flex items-center gap-4">
          <div className="text-5xl">🦞</div>
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2 flex-wrap">
              {greeting}，主人
              {isNightGreeting && (
                <span className="inline-block text-xl animate-pulse" title="晚安好梦">
                  ✨
                </span>
              )}
            </h2>
            <p className="text-slate-400 mt-1">
              {status?.running
                ? `你的龙虾正在工作中，已装备 ${status.skillCount} 个技能`
                : '你的龙虾还没上线，启动 OpenClaw 后我就能帮你干活了'}
            </p>
          </div>
        </div>
      </div>

      {/* 状态卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {cards.map((card, i) => (
          <div
            key={card.title}
            className={`card-glow bg-[#1e293b] rounded-xl p-5 border border-[#334155] animate-fade-in-up ${STAGGER_DELAYS[i] ?? 'animate-delay-400'}`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-slate-400">{card.title}</span>
              <div className={`p-2 rounded-lg ${card.bg}`}>
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
            </div>
            <div
              key={`${card.title}-${loading}-${card.value}`}
              className={`text-2xl font-bold ${card.color} animate-count-up`}
            >
              {card.value}
            </div>
            {card.sub && <div className="text-xs text-slate-500 mt-1">{card.sub}</div>}
          </div>
        ))}
      </div>

      {/* 快捷操作 - 大卡片 */}
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-orange-400" />
        让龙虾帮你做点什么？
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <button
          type="button"
          onClick={() => onNavigate('replay')}
          className="group card-glow bg-gradient-to-br from-orange-500/20 to-yellow-500/10 rounded-xl p-6 border border-orange-500/20 hover:border-orange-500/50 transition-all transition-transform group-hover:scale-105 text-left"
        >
          <div className="text-4xl mb-3">🎬</div>
          <h4 className="font-semibold text-lg mb-1">会话回放</h4>
          <p className="text-sm text-slate-400 mb-3">看看龙虾每一步都在干什么，思考了什么，花了多少钱</p>
          <span className="text-orange-400 text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
            查看回放 <ArrowRight className="w-4 h-4" />
          </span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('cost')}
          className="group card-glow bg-gradient-to-br from-blue-500/20 to-cyan-500/10 rounded-xl p-6 border border-blue-500/20 hover:border-blue-500/50 transition-all transition-transform group-hover:scale-105 text-left"
        >
          <div className="text-4xl mb-3">📊</div>
          <h4 className="font-semibold text-lg mb-1">费用监控</h4>
          <p className="text-sm text-slate-400 mb-3">看看龙虾花了多少钱，哪个模型最烧钱，预算还剩多少</p>
          <span className="text-blue-400 text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
            查看详情 <ArrowRight className="w-4 h-4" />
          </span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('skills')}
          className="group card-glow bg-gradient-to-br from-purple-500/20 to-pink-500/10 rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/50 transition-all transition-transform group-hover:scale-105 text-left"
        >
          <div className="text-4xl mb-3">🧩</div>
          <h4 className="font-semibold text-lg mb-1">技能管理</h4>
          <p className="text-sm text-slate-400 mb-3">给龙虾装备新技能，或者卸掉不需要的，让它更专注</p>
          <span className="text-purple-400 text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
            管理技能 <ArrowRight className="w-4 h-4" />
          </span>
        </button>
      </div>

      {/* 词云 - 龙虾最近都在忙什么 */}
      <div className="bg-[#1e293b] rounded-xl p-6 border border-[#334155] mb-6">
        <h4 className="font-semibold mb-4 text-slate-300 flex items-center gap-2">
          <Cloud className="w-5 h-5 text-orange-400" />
          龙虾最近都在忙什么
        </h4>
        {kwLoading && (
          <div className="relative min-h-[220px] flex flex-wrap items-center justify-center gap-3 p-4 content-center">
            <div className="skeleton h-10 w-24 rounded-full" />
            <div className="skeleton h-14 w-32 rounded-lg" />
            <div className="skeleton h-8 w-20 rounded-full" />
            <div className="skeleton h-12 w-28 rounded-xl" />
            <div className="skeleton h-16 w-36 rounded-2xl" />
            <div className="skeleton h-9 w-16 rounded-full" />
            <div className="skeleton h-11 w-40 rounded-lg" />
            <div className="skeleton h-7 w-28 rounded-md" />
            <div className="skeleton h-[3.25rem] w-24 rounded-full opacity-80" />
          </div>
        )}
        {!kwLoading && kwError && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-sm text-red-300">{kwError}</div>
        )}
        {!kwLoading && !kwError && (
          <WordCloud
            keywords={keywords}
            onWordClick={word => {
              console.log('replay search (reserved):', word)
              onNavigate('replay')
            }}
          />
        )}
      </div>

      {/* 最近活动 */}
      <div className="rounded-xl border border-[#334155] bg-[#1e293b]/80 p-6">
        <h4 className="font-semibold mb-4 text-slate-200">最近的龙虾活动</h4>
        {recentLoading && (
          <div className="grid gap-3 md:grid-cols-3">
            <div className="skeleton h-24 rounded-xl" />
            <div className="skeleton h-24 rounded-xl" />
            <div className="skeleton h-24 rounded-xl" />
          </div>
        )}
        {!recentLoading && recentSessions.length === 0 && (
          <p className="text-sm text-slate-500">暂无会话记录，去回放页导入或等待新会话吧。</p>
        )}
        {!recentLoading && recentSessions.length > 0 && (
          <div className="grid gap-3 md:grid-cols-3">
            {recentSessions.map(s => (
              <button
                key={s.id}
                type="button"
                onClick={() => onNavigate('replay')}
                className="card-glow text-left rounded-xl border border-[#334155] bg-[#0f172a]/60 p-4 transition-colors hover:border-orange-500/40 hover:bg-[#0f172a]"
              >
                <p className="text-sm text-slate-200 line-clamp-2 mb-2">{truncateSummary(s.summary || '（无摘要）', 50)}</p>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
                  <span className="text-orange-400/90 font-medium">{s.agentName || 'Agent'}</span>
                  <span>·</span>
                  <span>{formatRelativeTime(s.startTime)}</span>
                  <span>·</span>
                  <span className="text-orange-300">¥{s.totalCost.toFixed(4)}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
