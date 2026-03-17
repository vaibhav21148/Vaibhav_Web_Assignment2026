import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const MY_DUMMY_QUERIES = [
  { id: 'Q-201', subject: 'Laptop replacement request', status: 'Pending', priority: 'Med', domain: 'IT Ops', assignee: 'Jane Smith', date: 'Oct 12, 2023', comments: 2, attachments: 0, description: 'My current laptop is 4 years old and is experiencing severe lag during builds.' },
  { id: 'Q-184', subject: 'Reimbursement for conference', status: 'In-Progress', priority: 'Low', domain: 'Finance', assignee: 'Demo manager', date: 'Oct 05, 2023', comments: 5, attachments: 2, description: 'Attaching the receipts for the ReactConf 2023 attendance.' },
  { id: 'Q-092', subject: 'Access to production DB', status: 'Resolved', priority: 'High', domain: 'IT Ops', assignee: 'John Doe', date: 'Sep 15, 2023', comments: 1, attachments: 0, description: 'Need read-only access to investigate issue #441.' },
];

export default function MyQueries() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All Queries');
  const [searchTerm, setSearchTerm] = useState('');
  
  const TABS = ['All Queries', 'Assigned to Me', 'Pending Review', 'Resolved'];

  const filteredQueries = MY_DUMMY_QUERIES.filter(q => {
    let matchTab = true;
    if (activeTab === 'Assigned to Me') matchTab = q.assignee === user?.name || q.assignee === 'Demo manager';
    if (activeTab === 'Pending Review') matchTab = q.status === 'Pending';
    if (activeTab === 'Resolved') matchTab = q.status === 'Resolved';
    
    let matchSearch = q.subject.toLowerCase().includes(searchTerm.toLowerCase()) || q.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchTab && matchSearch;
  });
  
  const statusInfo = {
    'Pending': { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Open' },
    'In-Progress': { bg: 'bg-amber-100', text: 'text-amber-700', label: 'In Progress' },
    'Resolved': { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Resolved' }
  };
  
  const priorityInfo = {
    'High': { bg: 'bg-red-100', text: 'text-red-700' },
    'Med': { bg: 'bg-slate-100', text: 'text-slate-700' },
    'Low': { bg: 'bg-green-100', text: 'text-green-700' }
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Query Management</h1>
          <p className="text-slate-500">Track and resolve student and startup inquiries across all domains.</p>
        </div>
        <Link to="/raise-issue" className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition-all shadow-sm">
          <span className="material-symbols-outlined text-lg">add_circle</span>
          Create New Query
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-slate-200 mb-6 overflow-x-auto">
        <div className="flex gap-8 min-w-max">
          {TABS.map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`border-b-2 pb-3 px-1 text-sm transition-colors ${activeTab === tab ? 'border-primary font-bold text-primary' : 'border-transparent font-medium text-slate-500 hover:text-slate-700'}`}
            >
              {tab} {tab === 'All Queries' && `(${MY_DUMMY_QUERIES.length})`}
            </button>
          ))}
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[280px]">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input 
              type="text" 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none" 
              placeholder="Search by Query ID, Title, or Submitter..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <select className="bg-slate-50 border border-slate-200 rounded-lg text-sm py-2 px-3 focus:ring-primary outline-none">
            <option>Status: All</option>
            <option>Open</option>
            <option>In Progress</option>
            <option>Resolved</option>
          </select>
          <select className="bg-slate-50 border border-slate-200 rounded-lg text-sm py-2 px-3 focus:ring-primary outline-none">
            <option>Priority: All</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
          <select className="bg-slate-50 border border-slate-200 rounded-lg text-sm py-2 px-3 focus:ring-primary outline-none">
            <option>Domain: All</option>
            <option>Technical</option>
            <option>Funding</option>
            <option>Marketing</option>
            <option>Legal</option>
          </select>
          <select className="bg-slate-50 border border-slate-200 rounded-lg text-sm py-2 px-3 focus:ring-primary outline-none">
            <option>Sort by: Newest</option>
            <option>Oldest</option>
            <option>Priority (High to Low)</option>
            <option>Last Updated</option>
          </select>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Query ID & Title</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Priority</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Domain</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned To</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Created / Updated</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredQueries.map((query) => {
                const sInfo = statusInfo[query.status] || statusInfo['Pending'];
                const pInfo = priorityInfo[query.priority] || priorityInfo['Low'];

                return (
                  <tr key={query.id} className="hover:bg-slate-50/50 transition-colors cursor-pointer" onClick={() => navigate(`/query/${query.id}`)}>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-primary mb-0.5">#{query.id}</span>
                        <span className="font-semibold text-slate-900 truncate max-w-[200px]">{query.subject}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${sInfo.bg} ${sInfo.text}`}>
                        {sInfo.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${pInfo.bg} ${pInfo.text}`}>
                        {query.priority === 'Med' ? 'Medium' : query.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium bg-slate-100 px-2 py-1 rounded border border-slate-200">{query.domain}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                          <span className="text-[10px] font-bold text-slate-600">{query.assignee.charAt(0)}</span>
                        </div>
                        <span className="text-sm font-medium">{query.assignee}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col text-xs text-slate-500">
                        <span>{query.date}</span>
                        <span className="italic">Recently</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-primary hover:text-primary/80">
                        <span className="material-symbols-outlined">chevron_right</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredQueries.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-slate-500 text-sm">
                    No queries found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {filteredQueries.length > 0 && (
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Showing <span className="font-semibold">1</span> to <span className="font-semibold">{filteredQueries.length}</span> of <span className="font-semibold">{filteredQueries.length}</span> queries
            </p>
            <div className="flex gap-2">
              <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50" disabled>
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>
              <button className="px-3.5 py-2 bg-primary text-white text-sm font-bold rounded-lg">1</button>
              <button className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50" disabled>
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
