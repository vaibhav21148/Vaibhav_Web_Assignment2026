import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const NAV_ITEMS = [
  { to: '/', icon: 'dashboard', label: 'Dashboard', exact: true },
  { to: '/my-queries', icon: 'format_list_bulleted', label: 'All Queries' },
  { to: '/add-query', icon: 'add_circle', label: 'Create Query' },
]

const ADMIN_ITEM = { to: '/admin', icon: 'admin_panel_settings', label: 'Admin Panel' }

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  const isAdmin = user?.role === 'admin'

  const linkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
      isActive
        ? 'bg-[#2463eb] text-white'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
    }`

  return (
    <aside className="flex flex-col w-64 shrink-0 bg-white border-r border-slate-200 h-screen sticky top-0 overflow-y-auto">
      {/* Logo */}
      <div className="flex items-center gap-2.5 h-16 px-5 border-b border-slate-200 shrink-0 mb-2">
        <img src="/ecell_black.png" alt="E-Cell" className="h-7 object-contain" />
        <span className="font-bold text-slate-900 text-lg">ResolvIT</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(item => (
          <NavLink key={item.to} to={item.to} end={item.exact} className={linkClass}>
            <span className="material-icons-round text-[20px]">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
        {isAdmin && (
          <NavLink to={ADMIN_ITEM.to} className={linkClass}>
            <span className="material-icons-round text-[20px]">{ADMIN_ITEM.icon}</span>
            {ADMIN_ITEM.label}
          </NavLink>
        )}
      </nav>

      {/* User footer */}
      <div className="px-3 py-4 border-t border-slate-200 shrink-0">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1">
          <div className="w-8 h-8 rounded-full bg-[#2463eb]/10 flex items-center justify-center text-[#2463eb] font-bold text-sm uppercase shrink-0">
            {user?.name?.slice(0, 2) || 'U'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-slate-500 capitalize">{user?.role || 'user'}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 transition-all"
        >
          <span className="material-icons-round text-[20px]">logout</span>
          Sign Out
        </button>
      </div>
    </aside>
  )
}
