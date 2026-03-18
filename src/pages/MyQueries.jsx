import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const API = 'http://localhost:8000/api'

const STATUS_TABS = ['All', 'open', 'in-progress', 'resolved', 'closed']

const STATUS_COLORS = {
  'open':        'bg-blue-100 text-blue-700',
  'in-progress': 'bg-amber-100 text-amber-700',
  'resolved':    'bg-green-100 text-green-700',
  'closed':      'bg-slate-100 text-slate-600',
}
const PRIORITY_COLORS = {
  critical: 'bg-red-100 text-red-700',
  high:     'bg-orange-100 text-orange-700',
  medium:   'bg-amber-100 text-amber-700',
  low:      'bg-slate-100 text-slate-600',
}

export default function MyQueries() {
  const { token } = useAuth()
  const [queries, setQueries] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('All')
  const [search, setSearch] = useState('')

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

  const filtered = queries.filter(q => {
    const matchTab = activeTab === 'All' || q.status === activeTab
    const matchSearch = !search || q.title.toLowerCase().includes(search.toLowerCase()) || q.query_id.toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  })

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Query Management</h1>
        <p className="text-slate-500 text-sm mt-1">Track and resolve inquiries across all domains. Showing {filtered.length} of {queries.length} queries</p>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 flex-wrap gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1">
            {STATUS_TABS.map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-[#2463eb] text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >{tab}</button>
            ))}
          </div>
          {/* Search */}
          <div className="relative">
            <span className="material-icons-round absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
            <input
              type="text"
              placeholder="Search queries..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#2463eb] focus:ring-2 focus:ring-[#2463eb]/20 w-52"
            />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-6 h-6 border-2 border-[#2463eb] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-sm">
            <span className="material-icons-round text-4xl text-slate-200 block mb-2">inbox</span>
            No queries found.{' '}
            <Link to="/add-query" className="text-[#2463eb] hover:underline">Create one</Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  {['ID', 'Title', 'Domain', 'Priority', 'Status', 'Author', 'Date', ''].map(h => (
                    <th key={h} className="px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(q => (
                  <tr key={q.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{q.query_id}</span>
                    </td>
                    <td className="px-5 py-4 max-w-xs">
                      <p className="font-medium text-slate-900 truncate">{q.title}</p>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-slate-500">{q.domain}</td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${PRIORITY_COLORS[q.priority] || 'bg-slate-100 text-slate-600'}`}>{q.priority}</span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[q.status] || 'bg-slate-100 text-slate-600'}`}>{q.status}</span>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-slate-500">{q.author?.name || '—'}</td>
                    <td className="px-5 py-4 whitespace-nowrap text-slate-400 text-xs">{new Date(q.created_at).toLocaleDateString()}</td>
                    <td className="px-5 py-4 whitespace-nowrap text-right">
                      <Link to={`/queries/${q.id}`} className="text-[#2463eb] hover:underline text-xs font-medium">View →</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="px-5 py-3 border-t border-slate-100 text-xs text-slate-400">
              Showing 1 to {filtered.length} of {queries.length} queries
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
