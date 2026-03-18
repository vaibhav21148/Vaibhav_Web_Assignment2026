import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const API = 'http://localhost:8000/api'

const STATUS_COLORS = {
  'open':        'bg-blue-100 text-blue-700 border-blue-200',
  'in-progress': 'bg-amber-100 text-amber-700 border-amber-200',
  'resolved':    'bg-green-100 text-green-700 border-green-200',
  'closed':      'bg-slate-100 text-slate-600 border-slate-200',
}
const PRIORITY_COLORS = {
  critical: 'bg-red-100 text-red-700',
  high:     'bg-orange-100 text-orange-700',
  medium:   'bg-amber-100 text-amber-700',
  low:      'bg-slate-100 text-slate-600',
}

function Avatar({ name, size = 8 }) {
  return (
    <div className={`w-${size} h-${size} rounded-full bg-[#2463eb]/10 text-[#2463eb] flex items-center justify-center font-bold text-xs uppercase shrink-0`}>
      {name?.slice(0, 1).toUpperCase() || '?'}
    </div>
  )
}

export default function QueryDetail() {
  const { id } = useParams()
  const { token, user } = useAuth()

  const [query,    setQuery]    = useState(null)
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')
  const [comment,  setComment]  = useState('')
  const [internal, setInternal] = useState(false)
  const [posting,  setPosting]  = useState(false)
  const [patching, setPatching] = useState(false)

  const isManagerOrAdmin = user?.role === 'manager' || user?.role === 'admin'

  const fetchQuery = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API}/queries/${id}/`, { headers: { Authorization: `Bearer ${token}` } })
      if (!res.ok) {
        if (res.status === 403) throw new Error('You do not have access to this query.')
        if (res.status === 404) throw new Error('Query not found.')
        throw new Error('Failed to load query.')
      }
      setQuery(await res.json())
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [id, token])

  useEffect(() => { fetchQuery() }, [fetchQuery])

  async function handlePatch(field, value) {
    setPatching(true)
    try {
      const res = await fetch(`${API}/queries/${id}/`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: value }),
      })
      if (!res.ok) throw new Error('Update failed')
      setQuery(await res.json())
    } catch (e) { alert(e.message) } finally { setPatching(false) }
  }

  async function handlePostComment(e) {
    e.preventDefault()
    if (!comment.trim()) return
    setPosting(true)
    try {
      const res = await fetch(`${API}/queries/${id}/comments/`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: comment, is_internal_note: internal }),
      })
      if (!res.ok) throw new Error('Failed to post comment')
      setQuery(await res.json())
      setComment('')
      setInternal(false)
    } catch (e) { alert(e.message) } finally { setPosting(false) }
  }

  if (loading) return (
    <div className="flex justify-center items-center py-32">
      <div className="w-8 h-8 border-2 border-[#2463eb] border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (error) return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 flex items-start gap-4">
        <span className="material-icons-round text-red-500">error</span>
        <div>
          <p className="font-semibold text-red-800 mb-1">Access Denied or Not Found</p>
          <p className="text-red-700 text-sm">{error}</p>
          <Link to="/my-queries" className="inline-flex items-center gap-1 text-[#2463eb] text-sm font-medium mt-3 hover:underline">
            <span className="material-icons-round text-[16px]">arrow_back</span> Back to Queries
          </Link>
        </div>
      </div>
    </div>
  )

  if (!query) return null

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <Link to="/my-queries" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-6">
        <span className="material-icons-round text-[16px]">arrow_back</span>
        Back to Queries
      </Link>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Panel */}
        <div className="flex-1 space-y-5">
          {/* Header Card */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">{query.query_id}</span>
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${STATUS_COLORS[query.status] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>{query.status}</span>
                <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full capitalize ${PRIORITY_COLORS[query.priority] || 'bg-slate-100 text-slate-600'}`}>{query.priority}</span>
                <span className="text-xs text-slate-400">· {query.domain}</span>
              </div>
              <h1 className="text-xl font-bold text-slate-900 mb-2">{query.title}</h1>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Avatar name={query.author?.name} size={6} />
                <span className="font-medium text-slate-700">{query.author?.name || 'Unknown'}</span>
                <span>reported on</span>
                <span>{new Date(query.created_at).toLocaleString()}</span>
              </div>
            </div>
            <div className="p-6 bg-slate-50/50">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Description</h3>
              <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">{query.description}</p>
            </div>

            {/* Attachments */}
            {query.attachments?.length > 0 && (
              <div className="px-6 pb-6">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Attachments ({query.attachments.length})</h3>
                <div className="flex flex-wrap gap-2">
                  {query.attachments.map(att => (
                    <a key={att.id} href={`http://localhost:8000/media/${att.file_path}`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg hover:border-[#2463eb] hover:shadow-sm transition-all group text-sm">
                      <span className="material-icons-round text-slate-400 group-hover:text-[#2463eb] text-[18px]">attachment</span>
                      <span className="font-medium text-slate-700 group-hover:text-[#2463eb]">{att.file_name}</span>
                      <span className="text-xs text-slate-400">({Math.round(att.file_size / 1024)} KB)</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Discussion */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
            <h2 className="font-semibold text-slate-900">Discussion</h2>

            {query.comments?.length === 0 && (
              <p className="text-sm text-slate-400 italic">No comments yet. Start the discussion below.</p>
            )}
            {query.comments?.map(c => (
              <div key={c.id} className={`p-4 rounded-xl border text-sm ${c.is_internal_note ? 'bg-amber-50/60 border-amber-200' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Avatar name={c.author?.name} size={7} />
                    <span className="font-semibold text-slate-900">{c.author?.name || 'Unknown'}</span>
                    <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{c.author?.role}</span>
                    {c.is_internal_note && (
                      <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded">
                        <span className="material-icons-round text-[11px]">visibility_off</span> Internal Note
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400">{new Date(c.created_at).toLocaleDateString()}</span>
                </div>
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{c.text}</p>
              </div>
            ))}

            {/* Reply Box */}
            {query.status !== 'Closed' && (
              <form onSubmit={handlePostComment} className="border border-slate-200 rounded-xl overflow-hidden">
                <textarea
                  rows={3}
                  className="w-full px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none resize-y bg-white"
                  placeholder="Write a reply…"
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  disabled={posting}
                />
                <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-t border-slate-100">
                  {isManagerOrAdmin ? (
                    <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                      <input type="checkbox" checked={internal} onChange={e => setInternal(e.target.checked)} className="rounded border-slate-300" disabled={posting} />
                      <span>Make this an internal note</span>
                    </label>
                  ) : <div />}
                  <button type="submit" disabled={posting || !comment.trim()}
                    className="flex items-center gap-2 px-4 py-2 bg-[#2463eb] text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
                    {posting ? 'Posting…' : <><span className="material-icons-round text-[16px]">send</span>Post Reply</>}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Sidebar Panel */}
        <div className="w-full lg:w-72 space-y-4 shrink-0">
          <div className="bg-white border border-slate-200 rounded-xl p-5 relative">
            {patching && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
                <div className="w-5 h-5 border-2 border-[#2463eb] border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            <h3 className="text-sm font-semibold text-slate-900 mb-4 pb-3 border-b border-slate-100">Query Details</h3>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Status</p>
                {isManagerOrAdmin ? (
                  <select value={query.status} onChange={e => handlePatch('status', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold focus:outline-none focus:border-[#2463eb]">
                    {['open', 'in-progress', 'resolved', 'closed'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                  </select>
                ) : <span className="font-semibold text-slate-700">{query.status}</span>}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Priority</p>
                {isManagerOrAdmin ? (
                  <select value={query.priority} onChange={e => handlePatch('priority', e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm font-semibold capitalize focus:outline-none focus:border-[#2463eb]">
                    {['low', 'medium', 'high', 'critical'].map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
                  </select>
                ) : <span className="font-semibold text-slate-700 capitalize">{query.priority}</span>}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Assignee</p>
                {isManagerOrAdmin ? (
                  <input type="text" placeholder="User ID…" defaultValue={query.assignee?.id || ''}
                    onBlur={e => handlePatch('assignee_id', e.target.value || null)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#2463eb]" />
                ) : (
                  query.assignee
                    ? <span className="font-semibold text-[#2463eb] bg-blue-50 px-2 py-0.5 rounded text-xs">{query.assignee.name}</span>
                    : <span className="text-slate-400 italic">Unassigned</span>
                )}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Domain</p>
                <span className="text-slate-700 font-medium">{query.domain}</span>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Category</p>
                <span className="text-slate-700 font-medium">{query.category || '—'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
