import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function MainLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="font-display bg-background-light text-slate-900 min-h-screen flex">
      {/* Mobile Sidebar overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="relative flex w-full max-w-xs flex-1 flex-col transform transition-transform duration-300">
            <Sidebar isMobile={true} onClose={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Desktop Sidebar part of layout */}
      <Sidebar isMobile={false} />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 flex flex-col min-w-0 min-h-screen">
        <Navbar onMenuClick={() => setMobileMenuOpen(true)} />
        <div className="flex-1 overflow-x-hidden overflow-y-auto">
           <Outlet />
        </div>
      </main>
    </div>
  );
}
