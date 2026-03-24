import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Dashboard from './pages/Dashboard'
import Replay from './pages/Replay'
import Benchmark from './pages/Benchmark'
import CostMonitor from './pages/CostMonitor'
import SkillManager from './pages/SkillManager'
import TemplateMarket from './pages/TemplateMarket'
import { LayoutDashboard, Play, Trophy, DollarSign, Puzzle, Store } from 'lucide-react'
import { cn } from './lib/cn'

export type Tab = 'dashboard' | 'replay' | 'benchmark' | 'cost' | 'skills' | 'templates'

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard')
  const [sidebarHover, setSidebarHover] = useState(false)

  const tabs = [
    { id: 'dashboard' as const, name: '仪表盘', icon: LayoutDashboard },
    { id: 'replay' as const, name: '回放', icon: Play },
    { id: 'benchmark' as const, name: '评测', icon: Trophy },
    { id: 'cost' as const, name: '费用', icon: DollarSign },
    { id: 'skills' as const, name: 'Skills', icon: Puzzle },
    { id: 'templates' as const, name: '模板', icon: Store },
  ]

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white bg-mesh bg-noise">
      <header className="glass sticky top-0 z-50 px-6 py-3 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🍤</span>
            <div>
              <h1 className="text-lg font-bold tracking-tight">虾片</h1>
              <p className="text-[10px] text-slate-500 -mt-0.5">ClawClip</p>
            </div>
          </div>
          <span className="text-xs text-slate-600">v0.8.0</span>
        </div>
        <div
          className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-accent/20 via-transparent to-brand-purple/20"
          aria-hidden
        />
      </header>

      <div className="flex">
        <motion.nav
          onMouseEnter={() => setSidebarHover(true)}
          onMouseLeave={() => setSidebarHover(false)}
          animate={{ width: sidebarHover ? 224 : 64 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="glass min-h-[calc(100vh-52px)] py-4 shrink-0 overflow-hidden sticky top-[52px] relative border-r border-surface-border/60"
        >
          <ul className="space-y-1 px-2">
            {tabs.map(tab => (
              <li key={tab.id}>
                <button
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'w-full flex items-center gap-3 py-2.5 rounded-lg transition-all duration-200 text-sm border-l-2',
                    sidebarHover ? 'justify-start px-3' : 'justify-center px-2',
                    activeTab === tab.id
                      ? 'bg-accent-dim text-accent border-accent'
                      : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.03] border-transparent',
                  )}
                >
                  <tab.icon className="w-5 h-5 shrink-0" />
                  <motion.span
                    initial={false}
                    animate={{
                      opacity: sidebarHover ? 1 : 0,
                      maxWidth: sidebarHover ? 200 : 0,
                    }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="whitespace-nowrap overflow-hidden inline-block min-w-0 text-left"
                  >
                    {tab.name}
                  </motion.span>
                </button>
              </li>
            ))}
          </ul>
          <AnimatePresence>
            {sidebarHover && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="absolute bottom-4 left-0 right-0 px-4 text-center pointer-events-none"
              >
                <span className="text-[10px] text-slate-600">🍤 龙虾待命中</span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>

        <main className="flex-1 p-6 overflow-auto min-h-[calc(100vh-52px)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'dashboard' && <Dashboard onNavigate={setActiveTab} />}
              {activeTab === 'replay' && <Replay />}
              {activeTab === 'benchmark' && <Benchmark />}
              {activeTab === 'cost' && <CostMonitor />}
              {activeTab === 'skills' && <SkillManager />}
              {activeTab === 'templates' && <TemplateMarket />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

export default App
