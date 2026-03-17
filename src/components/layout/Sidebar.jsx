import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Sidebar({ isMobile, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className={`w-64 border-r border-slate-200 bg-white flex flex-col h-full transition-colors z-30 ${!isMobile ? 'fixed hidden md:flex' : 'flex'}`}>
      <div className="p-6 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="bg-primary rounded-lg p-1.5 flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-2xl">hub</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-sm font-bold tracking-tight uppercase text-slate-900">ResolvIT</h1>
            <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">Portal Management</span>
          </div>
        </div>
        {isMobile && (
          <button onClick={onClose} className="p-1 rounded-md hover:bg-slate-100 text-slate-500">
            <span className="material-symbols-outlined">close</span>
          </button>
        )}
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        <NavLink to="/" className={({ isActive }) => 
          `flex items-center gap-3 px-3 py-2.5 rounded-r-lg transition-all group ${
            isActive ? 'bg-primary/10 border-l-4 border-primary text-primary font-semibold' : 'text-slate-600 hover:bg-slate-100 rounded-lg'
          }`
        } end>
          <span className="material-symbols-outlined text-[22px]">dashboard</span>
          <span className="text-sm">Dashboard</span>
        </NavLink>
        
        {user?.role === 'admin' && (
          <NavLink to="/admin" className={({ isActive }) => 
            `flex items-center gap-3 px-3 py-2.5 transition-all group ${
              isActive ? 'bg-primary/10 border-l-4 border-primary text-primary font-semibold rounded-r-lg' : 'text-slate-600 hover:bg-slate-100 rounded-lg'
            }`
          }>
            <span className="material-symbols-outlined text-[22px]">admin_panel_settings</span>
            <span className="text-sm">Admin Panel</span>
          </NavLink>
        )}

        <NavLink to="/my-queries" className={({ isActive }) => 
          `flex items-center gap-3 px-3 py-2.5 transition-all group ${
            isActive ? 'bg-primary/10 border-l-4 border-primary text-primary font-semibold rounded-r-lg' : 'text-slate-600 hover:bg-slate-100 rounded-lg'
          }`
        }>
          <span className="material-symbols-outlined text-[22px]">person_search</span>
          <span className="text-sm">My Queries</span>
        </NavLink>
        
        <NavLink to="/raise-issue" className={({ isActive }) => 
          `flex items-center gap-3 px-3 py-2.5 transition-all group ${
            isActive ? 'bg-primary/10 border-l-4 border-primary text-primary font-semibold rounded-r-lg' : 'text-slate-600 hover:bg-slate-100 rounded-lg'
          }`
        }>
          <span className="material-symbols-outlined text-[22px]">add_circle</span>
          <span className="text-sm">Create Query</span>
        </NavLink>
        
        <div className="pt-4 pb-2 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Management</div>
      </nav>

      <div className="p-4 border-t border-slate-200">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 cursor-pointer transition-colors" onClick={handleLogout}>
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
             <span className="font-bold text-slate-600 text-xs">{user?.name?.charAt(0) || 'U'}</span>
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs font-bold truncate text-slate-900">{user?.name || 'User'}</span>
            <span className="text-[10px] text-slate-500 truncate capitalize">Logout</span>
          </div>
          <span className="material-symbols-outlined text-slate-400 text-lg ml-auto">logout</span>
        </div>
      </div>
    </aside>
  );
}
