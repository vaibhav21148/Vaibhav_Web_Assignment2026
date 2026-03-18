import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const API = 'http://localhost:8000/api'

const DOMAINS     = ['Events', 'Marketing', 'Corporate Relations', 'Hospitality', 'Operations', 'Design', 'Web and Tech', 'Media']
const PRIORITIES  = ['low', 'medium', 'high', 'critical']
const CATEGORIES  = ['General', 'Registration', 'Payment', 'Technical', 'Events', 'Incubation', 'Other']

export default function AddQuery() {
  const { token } = useAuth()
  const navigate  = useNavigate()
  const fileRef   = useRef()

  const [form, setForm] = useState({ title: '', description: '', domain: '', priority: 'medium', category: 'General' })
  const [files,      setFiles]      = useState([])
  const [dragging,   setDragging]   = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error,      setError]      = useState('')

  const set = field => e => setForm(f => ({ ...f, [field]: e.target.value }))

  function addFiles(newFiles) {
    const valid = [...newFiles].filter(f => f.size <= 10 * 1024 * 1024)
    setFiles(prev => [...prev, ...valid])
  }
  function removeFile(idx) { setFiles(f => f.filter((_, i) => i !== idx)) }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.domain) { setError('Please select a domain.'); return }
    setError('')
    setSubmitting(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      files.forEach(f => fd.append('files', f))
      const res = await fetch(`${API}/queries/`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || JSON.stringify(data))
      navigate(`/queries/${data.query.id}`, { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const labelClass = "block text-sm font-medium text-slate-700 mb-1.5"
  const inputClass = "w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#2463eb] focus:ring-2 focus:ring-[#2463eb]/20 transition-all text-sm"

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Create New Query</h1>
        <p className="text-slate-500 text-sm mt-1">Submit your detailed request to the administrative team.</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          <span className="material-icons-round text-red-500 text-base">error</span>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
          <h2 className="font-semibold text-slate-900 text-base border-b border-slate-100 pb-4">Query Details</h2>

          <div>
            <label className={labelClass}>Query Title *</label>
            <input type="text" required value={form.title} onChange={set('title')} placeholder="Brief one-line summary of the issue" className={inputClass} />
          </div>

          <div>
            <label className={labelClass}>Description *</label>
            <textarea required rows={5} value={form.description} onChange={set('description')}
              placeholder="Describe your issue in detail. Include steps to reproduce, expected vs actual behaviour, and any error messages."
              className={inputClass + ' resize-y'} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Domain *</label>
              <select required value={form.domain} onChange={set('domain')} className={inputClass}>
                <option value="">Select domain…</option>
                {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Priority</label>
              <select value={form.priority} onChange={set('priority')} className={inputClass}>
                {PRIORITIES.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Category</label>
              <select value={form.category} onChange={set('category')} className={inputClass}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Attachments Card */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
          <h2 className="font-semibold text-slate-900 text-base border-b border-slate-100 pb-4">Attachments</h2>

          {/* Drop Zone */}
          <div
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); addFiles(e.dataTransfer.files) }}
            onClick={() => fileRef.current.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${dragging ? 'border-[#2463eb] bg-blue-50' : 'border-slate-200 hover:border-[#2463eb]/40 hover:bg-slate-50'}`}
          >
            <span className="material-icons-round text-3xl text-slate-300 block mb-2">cloud_upload</span>
            <p className="text-sm font-medium text-slate-700">Drag and drop files here or <span className="text-[#2463eb]">browse</span></p>
            <p className="text-xs text-slate-400 mt-1">Supported formats: PDF, DOCX, PNG, JPG (Max 10MB)</p>
            <input ref={fileRef} type="file" multiple className="hidden" onChange={e => addFiles(e.target.files)} />
          </div>

          {/* File List */}
          {files.length > 0 && (
            <ul className="space-y-2">
              {files.map((f, i) => (
                <li key={i} className="flex items-center gap-3 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                  <span className="material-icons-round text-slate-400 text-[18px]">attachment</span>
                  <span className="flex-1 text-sm font-medium text-slate-700 truncate">{f.name}</span>
                  <span className="text-xs text-slate-400">{(f.size / 1024).toFixed(0)} KB</span>
                  <button type="button" onClick={() => removeFile(i)} className="text-slate-400 hover:text-red-500 transition-colors">
                    <span className="material-icons-round text-[18px]">close</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-400">By submitting, you agree to our Terms of Service and Privacy Policy.</p>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => navigate(-1)} className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
            <button type="submit" disabled={submitting}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#2463eb] text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60">
              {submitting ? (
                <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />Submitting…</>
              ) : (
                <><span className="material-icons-round text-[18px]">send</span>Submit Query</>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
