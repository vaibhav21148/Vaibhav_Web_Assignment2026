import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const DUMMY_QUERIES = [
  { id: 'Q-101', subject: 'Server down in main lab', status: 'Pending', priority: 'High', domain: 'IT Ops', assignee: 'Demo manager' },
  { id: 'Q-102', subject: 'Budget approval for Q3', status: 'In-Progress', priority: 'Med', domain: 'Finance', assignee: 'Jane Smith' },
  { id: 'Q-103', subject: 'New marketing materials needed', status: 'Resolved', priority: 'Low', domain: 'Marketing', assignee: 'Demo manager' },
  { id: 'Q-104', subject: 'Update on project Alpha', status: 'Pending', priority: 'Med', domain: 'IT Ops', assignee: 'John Doe' },
  { id: 'Q-105', subject: 'Vendor payment delayed', status: 'In-Progress', priority: 'High', domain: 'Finance', assignee: 'Demo manager' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Filtering Logic based on auth role
  const filteredByRole = DUMMY_QUERIES.filter((query) => {
    if (user?.role === 'admin') return true;
    if (user?.role === 'lead') {
      return query.domain === 'IT Ops' || query.domain === 'Finance'; 
    }
    if (user?.role === 'manager') {
      return query.assignee === user?.name || query.assignee === 'Demo manager';
    }
    return false;
  });

  const displayQueries = filteredByRole;
  
  const stats = {
    open: displayQueries.filter(q => q.status === 'Pending').length,
    inProgress: displayQueries.filter(q => q.status === 'In-Progress').length,
    resolved: displayQueries.filter(q => q.status === 'Resolved').length,
    closed: 0,
  };
  
  const priorityInfo = {
    'High': { color: 'bg-rose-600', text: 'text-rose-600' },
    'Med': { color: 'bg-slate-400', text: 'text-slate-600' },
    'Low': { color: 'bg-slate-300', text: 'text-slate-400' }
  };
  
  const statusInfo = {
    'Pending': { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Open' },
    'In-Progress': { bg: 'bg-amber-100', text: 'text-amber-700', label: 'In Progress' },
    'Resolved': { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Resolved' }
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto w-full space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 leading-tight">Good morning, {user?.name?.split(' ')[0] || 'User'}</h1>
          <p className="text-slate-500 text-sm mt-1">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} • Portal Context: {user?.role}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border border-slate-200 bg-white rounded text-sm font-semibold flex items-center gap-2 hover:bg-slate-50 transition-colors">
            <span className="material-symbols-outlined text-lg">download</span> Export Report
          </button>
          <Link to="/raise-issue" className="px-4 py-2 bg-primary text-white rounded text-sm font-semibold flex items-center gap-2 hover:bg-primary/90 transition-colors">
            <span className="material-symbols-outlined text-lg">add</span> New Query
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Open */}
        <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-sm">
          <div className="flex justify-between items-start">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Open Queries</p>
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded">
              <span className="material-symbols-outlined text-lg">pending</span>
            </div>
          </div>
          <div className="mt-4 flex items-end justify-between">
            <h3 className="text-3xl font-bold">{stats.open}</h3>
          </div>
          <div className="w-full bg-slate-100 h-1.5 mt-4 rounded-full overflow-hidden">
            <div className="bg-primary h-full rounded-full" style={{ width: `${Math.min((stats.open / (displayQueries.length||1)) * 100, 100)}%` }}></div>
          </div>
        </div>
        
        {/* In Progress */}
        <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-sm">
          <div className="flex justify-between items-start">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">In Progress</p>
            <div className="p-1.5 bg-amber-50 text-amber-600 rounded">
              <span className="material-symbols-outlined text-lg">autorenew</span>
            </div>
          </div>
          <div className="mt-4 flex items-end justify-between">
            <h3 className="text-3xl font-bold">{stats.inProgress}</h3>
          </div>
          <div className="w-full bg-slate-100 h-1.5 mt-4 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: `${Math.min((stats.inProgress / (displayQueries.length||1)) * 100, 100)}%` }}></div>
          </div>
        </div>
        
        {/* Resolved */}
        <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-sm">
          <div className="flex justify-between items-start">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Resolved</p>
            <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded">
              <span className="material-symbols-outlined text-lg">check_circle</span>
            </div>
          </div>
          <div className="mt-4 flex items-end justify-between">
            <h3 className="text-3xl font-bold">{stats.resolved}</h3>
          </div>
          <div className="w-full bg-slate-100 h-1.5 mt-4 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${Math.min((stats.resolved / (displayQueries.length||1)) * 100, 100)}%` }}></div>
          </div>
        </div>
        
        {/* Closed */}
        <div className="bg-white border border-slate-200 p-5 rounded-lg shadow-sm">
          <div className="flex justify-between items-start">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Closed</p>
            <div className="p-1.5 bg-slate-50 text-slate-600 rounded">
              <span className="material-symbols-outlined text-lg">lock</span>
            </div>
          </div>
          <div className="mt-4 flex items-end justify-between">
            <h3 className="text-3xl font-bold">{stats.closed}</h3>
          </div>
          <div className="w-full bg-slate-100 h-1.5 mt-4 rounded-full overflow-hidden">
            <div className="bg-slate-500 h-full rounded-full" style={{ width: `${Math.min((stats.closed / (displayQueries.length||1)) * 100, 100)}%` }}></div>
          </div>
        </div>
      </div>

      {/* Dashboard Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Recent Queries */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h4 className="font-bold text-slate-800">Recent Queries</h4>
            <Link to="/my-queries" className="text-xs font-bold text-primary hover:underline">View All</Link>
          </div>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50">
                  <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Query Title</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">Priority</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider">ID</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayQueries.slice(0, 5).map((query) => {
                  const sInfo = statusInfo[query.status] || statusInfo['Pending'];
                  const pInfo = priorityInfo[query.priority] || priorityInfo['Low'];
                  
                  return (
                    <tr key={query.id} className="hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => navigate(`/query/${query.id}`)}>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                            <span className="font-bold text-slate-500 text-xs">{query.assignee.charAt(0).toUpperCase()}</span>
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-sm font-bold truncate group-hover:text-primary transition-colors">{query.subject}</span>
                            <span className="text-[11px] text-slate-500 font-medium">Domain: {query.domain}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase ${sInfo.bg} ${sInfo.text}`}>
                          {sInfo.label}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1 text-[11px] font-bold ${pInfo.text}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${pInfo.color}`}></span> {query.priority}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-[11px] font-bold text-slate-400 font-mono whitespace-nowrap">{query.id}</span>
                      </td>
                    </tr>
                  )
                })}
                {displayQueries.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-5 py-8 text-center text-slate-500 text-sm">
                      No queries found matching your criteria.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Queries by Domain */}
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h4 className="font-bold text-slate-800">Queries by Domain</h4>
            <span className="material-symbols-outlined text-slate-400 cursor-pointer">info</span>
          </div>
          <div className="flex-1 space-y-6">
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
                <span>IT Ops</span>
                <span>{displayQueries.filter(q => q.domain === 'IT Ops').length || 0}</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: `${(displayQueries.filter(q => q.domain === 'IT Ops').length / (displayQueries.length||1)) * 100}%` }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
                <span>Finance</span>
                <span>{displayQueries.filter(q => q.domain === 'Finance').length || 0}</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div className="bg-primary/80 h-full rounded-full" style={{ width: `${(displayQueries.filter(q => q.domain === 'Finance').length / (displayQueries.length||1)) * 100}%` }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
                <span>Marketing</span>
                <span>{displayQueries.filter(q => q.domain === 'Marketing').length || 0}</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div className="bg-primary/60 h-full rounded-full" style={{ width: `${(displayQueries.filter(q => q.domain === 'Marketing').length / (displayQueries.length||1)) * 100}%` }}></div>
              </div>
            </div>
            
          </div>
          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-400 font-medium">Domain statistics based on your assigned tickets</p>
          </div>
        </div>
        
      </div>
    </div>
  );
}
