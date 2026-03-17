import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from 'react-router-dom';

export default function Navbar({ onMenuClick }) {
  const { user } = useAuth();
  const location = useLocation();
  
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return 'Dashboard';
      case '/my-queries': return 'My Queries';
      case '/raise-issue': return 'Create Query';
      case '/admin': return 'Admin Panel';
      default: 
        if (location.pathname.startsWith('/query/')) return 'Query Details';
        return '';
    }
  };
  
  return (
    <header className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between px-4 sm:px-8">
      <div className="flex items-center gap-3 md:hidden">
         <button onClick={onMenuClick} className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-md">
            <span className="material-symbols-outlined">menu</span>
         </button>
         <h2 className="text-lg font-semibold text-slate-800">ResolvIT</h2>
      </div>

      <div className="hidden md:block">
         <h2 className="text-lg font-semibold text-slate-800">{getPageTitle()}</h2>
      </div>

      <div className="flex items-center gap-4 sm:gap-6 ml-auto">
        <div className="relative cursor-pointer group hover:text-primary transition-colors text-slate-600 pt-1">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full text-[10px] text-white flex items-center justify-center font-bold">3</span>
        </div>
        <div className="hidden sm:block h-8 w-[1px] bg-slate-200"></div>
        <div className="flex items-center gap-3">
          <div className="text-right flex flex-col hidden sm:flex">
            <span className="text-sm font-bold text-slate-900">{user?.name || "User"}</span>
            <span className="text-[10px] text-slate-500 font-medium capitalize">{user?.role || "Guest"}</span>
          </div>
          <div className="w-10 h-10 rounded-full border-2 border-primary/20 p-0.5 bg-slate-50 flex items-center justify-center">
            <span className="font-bold text-slate-700 text-sm">{user?.name?.charAt(0) || "U"}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
