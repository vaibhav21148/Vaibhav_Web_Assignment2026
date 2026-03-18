import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const API = 'http://localhost:8000/api'

const STAT_CARDS = [
  { label: 'Open Queries',  key: 'open',        icon: 'inbox',          color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-200' },
  { label: 'In Progress',   key: 'in-progress', icon: 'sync',           color: 'text-amber-600',  bg: 'bg-amber-50',  border: 'border-amber-200' },
  { label: 'Resolved',      value: 'resolved',  key: 'resolved',     icon: 'check_circle',   color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-200' },
  { label: 'Closed',        key: 'closed',      icon: 'lock',           color: 'text-slate-600',  bg: 'bg-slate-100', border: 'border-slate-200' },
]

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

const PRIORITY_COLORS = {
  critical: 'bg-red-100 text-red-700',
  high:     'bg-orange-100 text-orange-700',
  medium:   'bg-amber-100 text-amber-700',
  low:      'bg-slate-100 text-slate-600',
}
const STATUS_COLORS = {
  'open':        'bg-blue-100 text-blue-700',
  'in-progress': 'bg-amber-100 text-amber-700',
  'resolved':    'bg-green-100 text-green-700',
  'closed':      'bg-slate-100 text-slate-600',
}

export default function Dashboard() {
  const { user, token } = useAuth()
  const [queries, setQueries] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchQueries = useCallback(async () => {
    try {
      const res = await fetch(`${API}/queries/`, { headers: { Authorization: `Bearer ${token}` } })
      if (!res.ok) return
      setQueries(await res.json())
    } catch { /* ignore */ } finally {
      setLoading(false)
    }
  }, [token])

  useEffect(() => { fetchQueries() }, [fetchQueries])

  const countBy = key => queries.filter(q => q.status === key).length
  const recent   = [...queries].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5)
  const now      = new Date()
  const dateStr  = now.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{getGreeting()}, {user?.name?.split(' ')[0] || 'there'} 👋</h1>
          <p className="text-slate-500 text-sm mt-1">{dateStr}{user?.domain ? ` • Domain: ${user.domain}` : ''}</p>
        </div>
        <Link to="/add-query"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#2463eb] text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors">
          <span className="material-icons-round text-[18px]">add</span>
          New Query
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map(s => (
          <div key={s.key} className={`bg-white rounded-xl border ${s.border} p-5 flex items-center gap-4`}>
            <div className={`w-11 h-11 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>
              <span className={`material-icons-round ${s.color} text-[22px]`}>{s.icon}</span>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">{s.label}</p>
              <p className="text-2xl font-bold text-slate-900">{loading ? '—' : countBy(s.key)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Queries */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900">Recent Queries</h2>
          <Link to="/my-queries" className="text-sm text-[#2463eb] font-medium hover:underline flex items-center gap-1">
            View all <span className="material-icons-round text-[16px]">arrow_forward</span>
          </Link>
        </div>
        {loading ? (
          <div className="p-10 flex justify-center">
            <div className="w-6 h-6 border-2 border-[#2463eb] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : recent.length === 0 ? (
          <div className="p-10 text-center text-slate-400 text-sm">No queries yet. <Link to="/add-query" className="text-[#2463eb] hover:underline">Create one.</Link></div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recent.map(q => (
              <Link key={q.id} to={`/queries/${q.id}`} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50/80 transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{q.query_id}</span>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${STATUS_COLORS[q.status] || 'bg-slate-100 text-slate-600'}`}>{q.status}</span>
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full capitalize ${PRIORITY_COLORS[q.priority] || 'bg-slate-100 text-slate-600'}`}>{q.priority}</span>
                  </div>
                  <p className="text-sm font-medium text-slate-900 truncate">{q.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{q.domain} · {new Date(q.created_at).toLocaleDateString()}</p>
                </div>
                <span className="material-icons-round text-slate-300 text-[18px]">chevron_right</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
