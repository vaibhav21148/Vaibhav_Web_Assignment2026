import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const PORTFOLIO_OPTIONS = ['Events', 'Marketing', 'Corporate Relations', 'Hospitality', 'Operations', 'Design', 'Web and Tech', 'Media']
const ROLE_OPTIONS      = ['user', 'manager', 'admin']

export default function RegisterPage() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user', domain: '' })
  const [submitting, setSubmitting] = useState(false)
  const [localError, setLocalError] = useState('')

  const set = field => e => setForm(f => ({ ...f, [field]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setLocalError('')
    setSubmitting(true)
    const result = await register(form.name, form.email, form.password, form.role, form.domain || null)
    setSubmitting(false)
    if (result.success) navigate('/', { replace: true })
    else setLocalError(result.message)
  }

  const inputClass = "w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#2463eb] focus:ring-2 focus:ring-[#2463eb]/20 transition-all text-sm"
  const labelClass = "block text-sm font-medium text-slate-700 mb-1.5"

  return (
    <div className="min-h-screen flex">
      {/* Left — Branding Panel */}
      <div className="hidden lg:flex flex-col justify-between w-[480px] shrink-0 bg-[#1e3a5f] p-10 text-white">
        <div>
          <div className="flex items-center gap-3 mb-12">
            <img src="/ecell_white.png" alt="E-Cell IIT Bombay" className="h-[84px] object-contain" />
            <span className="font-bold text-3xl tracking-tight text-[#60a5fa]">ResolvIT</span>
          </div>
          <h1 className="text-2xl font-bold leading-tight mb-4 text-[#60a5fa]">Centralised Issue and Query Management Portal</h1>
          <p className="text-[#60a5fa] text-base leading-relaxed">
            Turning informal queries into structured resolutions for the E-Cell IIT Bombay ecosystem.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          {[
            { icon: 'groups', label: 'Role-Based Access', sub: 'User, Manager, and Admin roles' },
            { icon: 'domain', label: 'Domain Assignment', sub: 'Align with your team\'s domain' },
            { icon: 'lock', label: 'Secure Authentication', sub: 'JWT-protected sessions' },
          ].map(f => (
            <div key={f.label} className="flex items-center gap-4 bg-white/10 rounded-xl px-4 py-3">
              <span className="material-icons-round text-[#60a5fa] text-2xl">{f.icon}</span>
              <div>
                <p className="font-semibold text-sm">{f.label}</p>
                <p className="text-xs text-blue-200">{f.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right — Register Form */}
      <div className="flex-1 flex items-center justify-center bg-slate-50 p-8">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <img src="/ecell_black.png" alt="E-Cell IIT Bombay" className="h-[49px] object-contain" />
            <span className="font-bold text-xl text-slate-900">ResolvIT</span>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-1">Create Account</h2>
            <p className="text-slate-500 text-sm mb-6">Fill in the details below to get started.</p>

            {localError && (
              <div className="mb-4 flex items-center gap-2 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                <span className="material-icons-round text-red-500 text-base">error</span>
                {localError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={labelClass}>Full Name</label>
                <input type="text" id="register-name" required value={form.name} onChange={set('name')} className={inputClass} placeholder="Alex Riverstone" />
              </div>
              <div>
                <label className={labelClass}>Email Address</label>
                <input type="email" id="register-email" required value={form.email} onChange={set('email')} className={inputClass} placeholder="username@domain.com" />
              </div>
              <div>
                <label className={labelClass}>Password</label>
                <input type="password" id="register-password" required minLength={6} value={form.password} onChange={set('password')} className={inputClass} placeholder="Min. 6 characters" />
              </div>
              {/* Role — always shown first */}
              <div>
                <label className={labelClass}>Role</label>
                <select id="register-role" value={form.role} onChange={set('role')} className={inputClass}>
                  {ROLE_OPTIONS.map(r => <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>)}
                </select>
              </div>

              {/* Portfolio — only shown for managers */}
              {form.role === 'manager' && (
                <div>
                  <label className={labelClass}>Portfolio</label>
                  <select id="register-domain" value={form.domain} onChange={set('domain')} className={inputClass}>
                    <option value="">— Select portfolio —</option>
                    {PORTFOLIO_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              )}
              <button type="submit" id="register-submit" disabled={submitting}
                className="w-full py-2.5 px-4 bg-[#2463eb] text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-sm">
                {submitting ? 'Creating account…' : 'Create Account'}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="text-[#2463eb] font-semibold hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
