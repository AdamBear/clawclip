import { useState, useEffect } from 'react'
import { Search, Trash2, Download } from 'lucide-react'

interface Skill {
  name: string
  description: string
  installed: boolean
}

export default function SkillManager() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [search, setSearch] = useState('')
  const [installing, setInstalling] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/skills')
      .then(r => { if (!r.ok) throw new Error(); return r.json() })
      .then(setSkills)
      .catch(() => {})
  }, [])

  const handleInstall = async () => {
    if (!search.trim()) return
    setInstalling(search)
    try {
      const res = await fetch('/api/skills/install', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: search }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        alert(err.error || '安装失败')
        return
      }
      const result = await res.json()
      if (result.success) {
        setSearch('')
        const listRes = await fetch('/api/skills')
        if (listRes.ok) {
          setSkills(await listRes.json())
        }
      } else {
        alert(result.message || '安装失败')
      }
    } catch {
      alert('网络错误，请检查后端是否运行')
    } finally {
      setInstalling(null)
    }
  }

  const handleUninstall = async (name: string) => {
    if (!confirm(`确定要卸载 ${name} 吗？`)) return
    try {
      const res = await fetch('/api/skills/uninstall', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      const result = await res.json()
      if (result.success) {
        setSkills(skills.filter(s => s.name !== name))
      }
    } catch {
      // 网络错误，不更新 UI
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Skill 管理</h2>

      {/* 搜索安装 */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleInstall()}
            placeholder="输入 Skill 名称安装（如 web-search）"
            className="w-full bg-[#1e293b] border border-[#334155] rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-orange-500 transition-colors"
          />
        </div>
        <button
          onClick={handleInstall}
          disabled={!search.trim() || !!installing}
          className="px-6 py-3 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          {installing ? '安装中...' : '安装'}
        </button>
      </div>

      {/* 已安装列表 */}
      <div className="bg-[#1e293b] rounded-xl border border-[#334155]">
        <div className="px-6 py-4 border-b border-[#334155]">
          <h3 className="font-semibold">已安装 ({skills.length})</h3>
        </div>
        {skills.length === 0 ? (
          <div className="px-6 py-12 text-center text-slate-500">
            <p className="text-lg mb-2">暂无已安装的 Skill</p>
            <p className="text-sm">在上方搜索框输入名称安装，或去模板市场一键导入</p>
          </div>
        ) : (
          <div className="divide-y divide-[#334155]">
            {skills.map(skill => (
              <div key={skill.name} className="px-6 py-4 flex items-center justify-between hover:bg-[#0f172a] transition-colors">
                <div>
                  <div className="font-medium">{skill.name}</div>
                  <div className="text-sm text-slate-400 mt-0.5">{skill.description}</div>
                </div>
                <button
                  onClick={() => handleUninstall(skill.name)}
                  className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="卸载"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
