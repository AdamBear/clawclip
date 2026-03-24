import { useState, useEffect } from 'react'
import { Check, ArrowRight } from 'lucide-react'

interface Template {
  id: string
  name: string
  description: string
  category: string
  icon: string
  skills: string[]
}

const CATEGORIES = ['全部', '效率', '创作', '开发', '客服']

export default function TemplateMarket() {
  const [templates, setTemplates] = useState<Template[]>([])
  const [category, setCategory] = useState('全部')
  const [applied, setApplied] = useState<Set<string>>(new Set())
  const [applying, setApplying] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/templates')
      .then(r => { if (!r.ok) throw new Error(); return r.json() })
      .then(setTemplates)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = category === '全部' ? templates : templates.filter(t => t.category === category)

  const handleApply = async (id: string) => {
    setApplying(id)
    try {
      const res = await fetch('/api/templates/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (!res.ok) {
        alert('导入失败，请重试')
        return
      }
      const result = await res.json()
      if (result.success) {
        setApplied(prev => new Set(prev).add(id))
      } else {
        alert(result.message || '导入失败')
      }
    } catch {
      alert('网络错误，请检查后端是否运行')
    } finally {
      setApplying(null)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">场景模板</h2>
      <p className="text-slate-400 text-sm mb-6">预设的中文工作流，一键导入到你的龙虾</p>

      {/* 分类筛选 */}
      <div className="flex gap-2 mb-6">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              category === cat ? 'bg-orange-500 text-white' : 'bg-[#1e293b] text-slate-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 模板卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {!loading && filtered.map(template => (
          <div key={template.id} className="bg-[#1e293b] rounded-xl p-6 border border-[#334155] hover:border-orange-500/30 transition-colors">
            <div className="flex items-start justify-between mb-3">
              <span className="text-3xl">{template.icon}</span>
              <span className="text-xs px-2 py-1 bg-[#334155] rounded-full text-slate-400">{template.category}</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">{template.name}</h3>
            <p className="text-sm text-slate-400 mb-4 leading-relaxed">{template.description}</p>
            <div className="flex flex-wrap gap-1 mb-4">
              {template.skills.map(s => (
                <span key={s} className="text-xs px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded">{s}</span>
              ))}
            </div>
            <button
              onClick={() => handleApply(template.id)}
              disabled={applied.has(template.id) || applying === template.id}
              className={`w-full py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                applied.has(template.id)
                  ? 'bg-green-500/10 text-green-400 cursor-default'
                  : 'bg-orange-500 hover:bg-orange-600 text-white'
              }`}
            >
              {applied.has(template.id) ? (
                <><Check className="w-4 h-4" /> 已导入</>
              ) : applying === template.id ? (
                '导入中...'
              ) : (
                <><ArrowRight className="w-4 h-4" /> 一键导入</>
              )}
            </button>
          </div>
        ))}
      </div>

      {!loading && filtered.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          <p>该分类暂无模板</p>
        </div>
      )}
      {loading && (
        <div className="text-center py-12 text-slate-500">
          <p>加载中...</p>
        </div>
      )}
    </div>
  )
}
