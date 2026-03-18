import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const API    = 'http://localhost:8000/api'
const ROLES   = ['user', 'manager', 'admin']
const DOMAINS = ['Events', 'Marketing', 'Corporate Relations', 'Hospitality', 'Operations', 'Design', 'Web and Tech', 'Media']

export default function AdminPanel() {
  const { token, user } = useAuth()
  const [activeTab,  setActiveTab]  = useState('users') // 'users' or 'queries'
  const [users,      setUsers]      = useState([])
  const [queries,    setQueries]    = useState([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState('')
  const [patchingId, setPatchingId] = useState(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      // Fetch users
      const uRes = await fetch(`${API}/admin/users/`, { headers: { Authorization: `Bearer ${token}` } })
      if (!uRes.ok) throw new Error('Failed to fetch users')
      const uData = await uRes.json()
      setUsers(uData)

      // Fetch all queries (Admins get everything from /api/queries/)
      const qRes = await fetch(`${API}/queries/`, { headers: { Authorization: `Bearer ${token}` } })
      if (!qRes.ok) throw new Error('Failed to fetch queries')
      const qData = await qRes.json()
      setQueries(qData)
    } catch (e) { 
      setError(e.message) 
    } finally { 
      setLoading(false) 
    }
  }, [token])

  useEffect(() => { fetchData() }, [fetchData])

  async function handleUpdateUser(userId, field, value) {
    setPatchingId(userId)
    try {
      const res = await fetch(`${API}/admin/users/${userId}/`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Update failed')
      setUsers(prev => prev.map(u => u.id === userId ? data : u))
    } catch (e) { 
      alert(e.message) 
    } finally { 
      setPatchingId(null) 
    }
  }

  const userStats = [
    { label: 'Total Users',     value: users.length,                                     icon: 'people',           color: 'text-blue-600',   bg: 'bg-blue-50' },
    { label: 'Active Users',    value: users.filter(u => u.is_active).length,            icon: 'check_circle',     color: 'text-green-600',  bg: 'bg-green-50' },
    { label: 'Domain Managers', value: users.filter(u => u.role === 'manager').length,   icon: 'manage_accounts',  color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Admins',          value: users.filter(u => u.role === 'admin').length,     icon: 'shield',           color: 'text-amber-600',  bg: 'bg-amber-50' },
  ]

  const queryStats = [
    { label: 'Total Queries', value: queries.length,                                     icon: 'assignment',     color: 'text-blue-600',   bg: 'bg-blue-50' },
    { label: 'Open',          value: queries.filter(q => q.status === 'open').length,        icon: 'pending',        color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Resolved',      value: queries.filter(q => q.status === 'resolved').length,    icon: 'task_alt',       color: 'text-green-600',  bg: 'bg-green-50' },
    { label: 'Critical',      value: queries.filter(q => q.priority === 'critical').length, icon: 'campaign',       color: 'text-red-600',    bg: 'bg-red-50' },
  ]

  if (loading) return (
    <div className="flex justify-center items-center py-32">
      <div className="w-8 h-8 border-2 border-[#2463eb] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (error) return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700 text-sm">{error}</div>
    </div>
  )

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Command Center</h1>
          <p className="text-slate-500 text-sm mt-1">Global oversight of users and community queries.</p>
        </div>
        
        {/* Tab Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
          <button 
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'users' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Users
          </button>
          <button 
            onClick={() => setActiveTab('queries')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === 'queries' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Queries
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {(activeTab === 'users' ? userStats : queryStats).map(s => (
          <div key={s.label} className="bg-white border border-slate-200 rounded-xl p-5 flex items-center gap-4">
            <div className={`w-11 h-11 rounded-xl ${s.bg} flex items-center justify-center shrink-0`}>
              <span className={`material-icons-round ${s.color} text-[22px]`}>{s.icon}</span>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">{s.label}</p>
              <p className="text-2xl font-bold text-slate-900">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {activeTab === 'users' ? (
        /* Users Table */
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
            <h2 className="font-semibold text-slate-900">Registered Users</h2>
            <span className="text-xs font-medium px-2 py-1 bg-slate-100 rounded text-slate-500">{users.length} total</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-3">User</th>
                  <th className="px-6 py-3">Role</th>
                  <th className="px-6 py-3">Portfolio</th>
                  <th className="px-6 py-3 text-center">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50/60 transition-colors relative">
                    {patchingId === u.id && (
                      <td className="absolute inset-y-0 left-0 w-1 bg-[#2463eb] animate-pulse" />
                    )}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#2463eb] text-white flex items-center justify-center font-bold text-xs shrink-0">
                          {u.name?.slice(0, 1).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 leading-tight">{u.name}</p>
                          <p className="text-xs text-slate-500 leading-tight mt-0.5">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select value={u.role} onChange={e => handleUpdateUser(u.id, 'role', e.target.value)} disabled={u.id === user?.id}
                        className={`text-[10px] font-bold uppercase rounded-md px-2 py-1 border focus:outline-none focus:ring-1 focus:ring-[#2463eb] cursor-pointer disabled:cursor-not-allowed transition-colors ${
                          u.role === 'admin'   ? 'bg-purple-50 text-purple-700 border-purple-200' :
                          u.role === 'manager' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          'bg-slate-50 text-slate-600 border-slate-200'
                        }`}>
                        {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <select value={u.domain || ''} onChange={e => handleUpdateUser(u.id, 'portfolio', e.target.value)}
                        className="text-xs text-slate-600 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-[#2463eb] focus:outline-none py-1 cursor-pointer">
                        <option value="">— None —</option>
                        {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                        u.is_active ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {u.is_active ? 'Active' : 'Blocked'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {u.id !== user?.id ? (
                        <button onClick={() => handleUpdateUser(u.id, 'is_active', !u.is_active)}
                          className={`text-xs font-bold uppercase hover:underline ${u.is_active ? 'text-red-600' : 'text-green-600'}`}>
                          {u.is_active ? 'Block' : 'Restore'}
                        </button>
                      ) : (
                        <span className="text-slate-400 italic text-[10px]">You</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Queries Table */
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
            <h2 className="font-semibold text-slate-900">Global Query Log</h2>
            <span className="text-xs font-medium px-2 py-1 bg-slate-100 rounded text-slate-500">{queries.length} total</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
                <tr>
                  <th className="px-6 py-3">ID & Title</th>
                  <th className="px-6 py-3">Author</th>
                  <th className="px-6 py-3">Portfolio</th>
                  <th className="px-6 py-3">Priority</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {queries.map(q => (
                  <tr key={q.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-50 px-1 rounded uppercase tracking-tighter">{q.query_id}</span>
                        <p className="font-semibold text-slate-900 truncate max-w-xs mt-1">{q.title}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-xs">
                      {q.author?.name || 'Unknown'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-slate-700 bg-slate-100 px-2 py-1 rounded-md">{q.domain}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold uppercase rounded px-2 py-1 border ${
                        q.priority === 'critical' ? 'bg-red-50 text-red-700 border-red-200' :
                        q.priority === 'high'     ? 'bg-orange-50 text-orange-700 border-orange-200' :
                        'bg-slate-50 text-slate-600 border-slate-200'
                      }`}>
                        {q.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        q.status === 'resolved' ? 'text-green-600' :
                        q.status === 'open'     ? 'text-orange-600' :
                        'text-slate-500'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                        q.status === 'resolved' ? 'bg-green-500' :
                        q.status === 'open'     ? 'bg-orange-500' :
                        'bg-slate-400'
                        }`} />
                        {q.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link to={`/queries/${q.id}`} className="text-xs font-bold uppercase text-blue-600 hover:underline">
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
