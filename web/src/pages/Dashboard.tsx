import { Activity, DollarSign, Puzzle, Wifi, WifiOff, ArrowRight, Sparkles, Cloud } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import type { Tab } from '../App'
import WordCloud, { type KeywordItem } from '../components/WordCloud'
import FadeIn from '../components/ui/FadeIn'
import GlowCard from '../components/ui/GlowCard'
import AnimatedCounter from '../components/ui/AnimatedCounter'
import GradientText from '../components/ui/GradientText'

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

  const costTotal = cost?.totalCost ?? 0
  const skillCount = status?.skillCount ?? 0
  const channelCount = status?.channels?.length ?? 0

  return (
    <div>
      {/* 欢迎区 */}
      <FadeIn delay={0} duration={0.45} className="mb-6">
        <GlowCard
          className="bg-gradient-to-r from-accent-dim via-brand-purple/5 to-brand-blue/10 border-accent/20"
          glowColor="rgba(168,85,247,0.12)"
        >
          <div className="p-6 flex items-center gap-4">
            <motion.div
              className="text-5xl shrink-0"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            >
              🦞
            </motion.div>
            <div className="min-w-0">
              <h2 className="text-2xl font-bold flex items-center gap-2 flex-wrap">
                <GradientText>
                  {greeting}，主人
                </GradientText>
                {isNightGreeting && (
                  <span className="inline-block text-xl animate-pulse" title="晚安好梦">
                    ✨
                  </span>
                )}
              </h2>
              <FadeIn delay={0.1} duration={0.4} direction="none" className="mt-1">
                <p className="text-slate-400">
                  {status?.running
                    ? `你的龙虾正在工作中，已装备 ${status.skillCount} 个技能`
                    : '你的龙虾还没上线，启动 OpenClaw 后我就能帮你干活了'}
                </p>
              </FadeIn>
            </div>
          </div>
        </GlowCard>
      </FadeIn>

      {/* 状态卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <FadeIn delay={0} duration={0.4}>
          <GlowCard
            className="p-5"
            glowColor={status?.running ? 'rgba(34,197,94,0.15)' : 'rgba(148,163,184,0.12)'}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-slate-400">OpenClaw 状态</span>
              <div
                className={`p-2 rounded-lg ${status?.running ? 'bg-brand-green/10' : 'bg-slate-500/10'}`}
              >
                {status?.running ? (
                  <Wifi className="w-5 h-5 text-brand-green" />
                ) : (
                  <WifiOff className="w-5 h-5 text-slate-500" />
                )}
              </div>
            </div>
            <div
              key={`status-${loading}-${status?.running}`}
              className={`text-2xl font-bold ${status?.running ? 'text-brand-green' : 'text-slate-500'}`}
            >
              {loading ? '检测中...' : status?.running ? '运行中' : '未连接'}
            </div>
            {status?.version && status.version !== 'unknown' && (
              <div className="text-xs text-slate-500 mt-1">v{status.version}</div>
            )}
          </GlowCard>
        </FadeIn>

        <FadeIn delay={0.1} duration={0.4}>
          <GlowCard className="p-5" glowColor="rgba(249,115,22,0.18)">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-slate-400">本月费用</span>
              <div className="p-2 rounded-lg bg-accent-dim">
                <DollarSign className="w-5 h-5 text-accent" />
              </div>
            </div>
            <div className="text-2xl font-bold text-accent tabular-nums">
              <AnimatedCounter value={loading ? 0 : costTotal} prefix="¥" decimals={2} duration={900} />
            </div>
            {cost && (
              <div className="text-xs text-slate-500 mt-1">{cost.totalTokens.toLocaleString()} tokens</div>
            )}
          </GlowCard>
        </FadeIn>

        <FadeIn delay={0.2} duration={0.4}>
          <GlowCard className="p-5" glowColor="rgba(59,130,246,0.15)">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-slate-400">已装 Skills</span>
              <div className="p-2 rounded-lg bg-brand-blue/10">
                <Puzzle className="w-5 h-5 text-brand-blue" />
              </div>
            </div>
            <div className="text-2xl font-bold text-brand-blue tabular-nums">
              <AnimatedCounter value={loading ? 0 : skillCount} duration={900} />
            </div>
            <div className="text-xs text-slate-500 mt-1">个技能</div>
          </GlowCard>
        </FadeIn>

        <FadeIn delay={0.3} duration={0.4}>
          <GlowCard className="p-5" glowColor="rgba(168,85,247,0.15)">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-slate-400">已连接平台</span>
              <div className="p-2 rounded-lg bg-brand-purple/10">
                <Activity className="w-5 h-5 text-brand-purple" />
              </div>
            </div>
            <div className="text-2xl font-bold text-brand-purple tabular-nums">
              <AnimatedCounter value={loading ? 0 : channelCount} duration={900} />
            </div>
            <div className="text-xs text-slate-500 mt-1 line-clamp-2">
              {status?.channels?.length ? status.channels.join(', ') : '无'}
            </div>
          </GlowCard>
        </FadeIn>
      </div>

      {/* 快捷操作 */}
      <FadeIn delay={0.05} duration={0.4}>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent" />
          让龙虾帮你做点什么？
        </h3>
      </FadeIn>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <FadeIn delay={0} duration={0.4}>
          <GlowCard
            glowColor="rgba(249,115,22,0.2)"
            className="group transition-transform duration-200 hover:scale-[1.02] border-orange-500/20 bg-gradient-to-br from-accent-dim to-yellow-500/5"
          >
            <button
              type="button"
              onClick={() => onNavigate('replay')}
              className="w-full text-left p-6 rounded-xl"
            >
              <div className="text-4xl mb-3">🎬</div>
              <h4 className="font-semibold text-lg mb-1">会话回放</h4>
              <p className="text-sm text-slate-400 mb-3">看看龙虾每一步都在干什么，思考了什么，花了多少钱</p>
              <span className="text-accent text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                查看回放 <ArrowRight className="w-4 h-4" />
              </span>
            </button>
          </GlowCard>
        </FadeIn>

        <FadeIn delay={0.1} duration={0.4}>
          <GlowCard
            glowColor="rgba(59,130,246,0.18)"
            className="group transition-transform duration-200 hover:scale-[1.02] border-brand-blue/20 bg-gradient-to-br from-brand-blue/15 to-cyan-500/10"
          >
            <button
              type="button"
              onClick={() => onNavigate('cost')}
              className="w-full text-left p-6 rounded-xl"
            >
              <div className="text-4xl mb-3">📊</div>
              <h4 className="font-semibold text-lg mb-1">费用监控</h4>
              <p className="text-sm text-slate-400 mb-3">看看龙虾花了多少钱，哪个模型最烧钱，预算还剩多少</p>
              <span className="text-brand-blue text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                查看详情 <ArrowRight className="w-4 h-4" />
              </span>
            </button>
          </GlowCard>
        </FadeIn>

        <FadeIn delay={0.2} duration={0.4}>
          <GlowCard
            glowColor="rgba(168,85,247,0.18)"
            className="group transition-transform duration-200 hover:scale-[1.02] border-brand-purple/20 bg-gradient-to-br from-brand-purple/15 to-brand-pink/10"
          >
            <button
              type="button"
              onClick={() => onNavigate('skills')}
              className="w-full text-left p-6 rounded-xl"
            >
              <div className="text-4xl mb-3">🧩</div>
              <h4 className="font-semibold text-lg mb-1">技能管理</h4>
              <p className="text-sm text-slate-400 mb-3">给龙虾装备新技能，或者卸掉不需要的，让它更专注</p>
              <span className="text-brand-purple text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                管理技能 <ArrowRight className="w-4 h-4" />
              </span>
            </button>
          </GlowCard>
        </FadeIn>
      </div>

      {/* 词云 */}
      <FadeIn delay={0.05} duration={0.45} className="mb-6">
        <div className="glass-raised rounded-xl p-6 border border-surface-border">
          <h4 className="font-semibold mb-4 text-slate-300 flex items-center gap-2">
            <Cloud className="w-5 h-5 text-accent" />
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
      </FadeIn>

      {/* 最近活动 */}
      <FadeIn delay={0.1} duration={0.45}>
        <div className="rounded-xl border border-surface-border glass-raised p-6">
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
              {recentSessions.map((s, i) => (
                <FadeIn key={s.id} delay={0.05 * i} duration={0.35} direction="up">
                  <GlowCard
                    glowColor="rgba(249,115,22,0.12)"
                    className="border-surface-border hover:border-accent/30 transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => onNavigate('replay')}
                      className="w-full text-left p-4 rounded-xl bg-surface/40 hover:bg-surface/60"
                    >
                      <p className="text-sm text-slate-200 line-clamp-2 mb-2">
                        {truncateSummary(s.summary || '（无摘要）', 50)}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
                        <span className="text-accent/90 font-medium">{s.agentName || 'Agent'}</span>
                        <span>·</span>
                        <span>{formatRelativeTime(s.startTime)}</span>
                        <span>·</span>
                        <span className="text-orange-300">¥{s.totalCost.toFixed(4)}</span>
                      </div>
                    </button>
                  </GlowCard>
                </FadeIn>
              ))}
            </div>
          )}
        </div>
      </FadeIn>
    </div>
  )
}
