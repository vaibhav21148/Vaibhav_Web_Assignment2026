import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function Auth() {
  const { user, login } = useAuth();
  const [role, setRole] = useState('manager'); // default

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = (e) => {
    e.preventDefault();
    login(role);
  };

  return (
    <div className="font-display bg-background-light min-h-screen">
      <div className="flex flex-col md:flex-row min-h-screen">
        {/* Left Panel: Brand & Identity */}
        <div className="md:w-5/12 lg:w-4/12 bg-navy-deep relative overflow-hidden flex flex-col justify-between p-8 md:p-12 lg:p-16 geometric-pattern">
          {/* Subtle Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none"></div>
          
          {/* Top Logo Section */}
          <div className="relative z-10 flex items-center gap-3">
            <div className="bg-primary p-2 rounded-lg shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-white text-2xl">hub</span>
            </div>
            <h1 className="text-white text-xl font-bold tracking-tight">ResolvIT</h1>
          </div>
          
          {/* Middle Content Section */}
          <div className="relative z-10 mt-12 md:mt-0">
            <h2 className="text-white text-4xl md:text-5xl font-extrabold leading-tight tracking-tight mb-4">
              Centralized Query <span className="text-primary">Management</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-sm leading-relaxed">
              The official portal for structured support, troubleshooting, and issue resolution.
            </p>
          </div>
          
          {/* Bottom Section (Visible on Desktop) */}
          <div className="relative z-10 hidden md:block">
            <div className="flex items-center gap-4 py-4 px-6 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
              <div className="flex -space-x-2">
                <div className="h-8 w-8 rounded-full border-2 border-navy-deep bg-slate-300 flex items-center justify-center font-bold text-xs text-slate-700">R</div>
                <div className="h-8 w-8 rounded-full border-2 border-navy-deep bg-slate-400 flex items-center justify-center font-bold text-xs text-white">S</div>
                <div className="h-8 w-8 rounded-full border-2 border-navy-deep bg-slate-500 flex items-center justify-center font-bold text-xs text-white">A</div>
              </div>
              <span className="text-slate-300 text-sm font-medium">Joined by 5000+ members</span>
            </div>
          </div>
        </div>
        
        {/* Right Panel: Form Section */}
        <div className="flex-1 bg-white flex items-center justify-center p-6 md:p-12 lg:p-24 overflow-y-auto">
          <div className="w-full max-w-[440px] space-y-8">
            {/* Form Header */}
            <div>
              <h3 className="text-slate-900 text-3xl font-bold tracking-tight">Sign In</h3>
              <p className="text-slate-500 mt-2">
                Select your mock role to access your dashboard.
              </p>
            </div>
            
            {/* Form Content */}
            <form className="space-y-6" onSubmit={handleLogin}>
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700">Select Mock Role</label>
                <div className="grid grid-cols-3 gap-3">
                  {['admin', 'lead', 'manager'].map((r) => (
                    <button
                      key={r}
                      type="button"
                      className={`py-3 px-2 rounded-lg text-sm font-bold transition-all border ${
                        role === r 
                          ? 'bg-primary/10 border-primary text-primary shadow-sm' 
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300'
                      }`}
                      onClick={() => setRole(r)}
                    >
                      <span className="capitalize">{r}</span>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-2">
                    <span className="material-symbols-outlined text-[14px]">info</span>
                    {role === 'admin' && 'Admin: Can view and manage all queries across domains.'}
                    {role === 'lead' && 'Lead: Can view specific queries within their domain.'}
                    {role === 'manager' && 'Manager: Can view queries directly assigned to them.'}
                </p>
              </div>
              
              <div className="space-y-1.5 focus-within:text-primary">
                <label className="text-sm font-semibold text-slate-700">Mock Username</label>
                <div className="relative">
                  <input 
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" 
                    type="text" 
                    value={`mock_user_${role}`} 
                    disabled 
                  />
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">person</span>
                </div>
              </div>
              
              <button className="w-full mt-4 bg-primary hover:bg-primary/90 text-white font-bold py-3.5 px-4 rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2" type="submit">
                <span>Sign In Securely</span>
                <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
              </button>
            </form>
            
            {/* Footer Links */}
            <div className="pt-6 border-t border-slate-100">
              <p className="text-center text-slate-500 text-sm">
                Need an account? 
                <span className="text-primary font-bold hover:underline ml-1 cursor-not-allowed cursor-pointer">Contact Administrator</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
