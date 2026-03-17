import React from 'react';

export default function AdminPanel() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* View Controls & Tabs */}
      <div>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">User Management</h1>
            <p className="text-slate-500 text-sm mt-1">Manage global access permissions and domain roles.</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20">
              <span className="material-symbols-outlined text-lg">person_add</span>
              Invite User
            </button>
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
              <button className="px-4 py-1.5 text-xs font-semibold rounded-md shadow-sm bg-white text-slate-900">List View</button>
              <button className="px-4 py-1.5 text-xs font-semibold rounded-md text-slate-500 hover:text-slate-700">Activity Log</button>
            </div>
          </div>
        </div>
        
        <div className="flex border-b border-slate-200 gap-8 overflow-x-auto">
          <button className="border-b-2 border-primary text-primary px-1 pb-3 text-sm font-semibold flex items-center gap-2 whitespace-nowrap">
            Users
            <span className="bg-primary/10 text-primary text-[10px] px-1.5 py-0.5 rounded-full">1,284</span>
          </button>
          <button className="border-b-2 border-transparent text-slate-500 hover:text-slate-800 px-1 pb-3 text-sm font-medium transition-colors whitespace-nowrap">
            All Queries
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
          <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Total Users</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900">1,284</span>
            <span className="text-emerald-500 text-xs font-bold">+12%</span>
          </div>
        </div>
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
          <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Domain Managers</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900">42</span>
            <span className="text-emerald-500 text-xs font-bold">+3%</span>
          </div>
        </div>
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
          <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Active Sessions</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900">156</span>
            <span className="text-rose-500 text-xs font-bold">-2%</span>
          </div>
        </div>
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm">
          <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Pending Requests</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-slate-900">12</span>
            <span className="text-emerald-500 text-xs font-bold">+5%</span>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Domain</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              
              {/* Row 1 */}
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500 text-xs">AR</div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Alex Riverstone</p>
                      <p className="text-xs text-slate-500">alex@e-cell.org</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-purple-100 text-purple-700 uppercase">Super Admin</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-slate-600">Global</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <button className="relative inline-flex h-5 w-9 items-center rounded-full bg-primary">
                    <span className="translate-x-4 inline-block h-3.5 w-3.5 transform rounded-full bg-white transition shadow-sm"></span>
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <div className="flex items-center justify-end gap-3">
                    <button className="text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined text-lg">edit</span></button>
                    <button className="text-slate-400 hover:text-rose-500 transition-colors"><span class="material-symbols-outlined text-lg">block</span></button>
                  </div>
                </td>
              </tr>

              {/* Row 2 */}
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500 text-xs">SJ</div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Sarah Jenkins</p>
                      <p className="text-xs text-slate-500">s.jenkins@tech.ecell.org</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-blue-100 text-blue-700 uppercase">Domain Manager</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-slate-600">Technology</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <button className="relative inline-flex h-5 w-9 items-center rounded-full bg-primary">
                    <span className="translate-x-4 inline-block h-3.5 w-3.5 transform rounded-full bg-white transition shadow-sm"></span>
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <div className="flex items-center justify-end gap-3">
                    <button className="text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined text-lg">edit</span></button>
                    <button className="text-slate-400 hover:text-rose-500 transition-colors"><span className="material-symbols-outlined text-lg">block</span></button>
                  </div>
                </td>
              </tr>

              {/* Row 3 */}
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500 text-xs">MV</div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Michael Vance</p>
                      <p className="text-xs text-slate-500">vance.m@marketing.ecell.org</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-teal-100 text-teal-700 uppercase">Team Member</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-slate-600">Marketing</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <button className="relative inline-flex h-5 w-9 items-center rounded-full bg-primary">
                    <span className="translate-x-4 inline-block h-3.5 w-3.5 transform rounded-full bg-white transition shadow-sm"></span>
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <div className="flex items-center justify-end gap-3">
                    <button className="text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined text-lg">edit</span></button>
                    <button className="text-slate-400 hover:text-rose-500 transition-colors"><span className="material-symbols-outlined text-lg">block</span></button>
                  </div>
                </td>
              </tr>
              
              {/* Row 4 (Inactive) */}
              <tr className="hover:bg-slate-50/50 transition-colors opacity-75">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-400 text-xs grayscale">EB</div>
                    <div>
                      <p className="text-sm font-semibold text-slate-400">Emily Blunt</p>
                      <p className="text-xs text-slate-400">e.blunt@ecell.org</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-500 uppercase">Reporter</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-slate-400">Public Relations</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <button className="relative inline-flex h-5 w-9 items-center rounded-full bg-slate-200">
                    <span className="translate-x-1 inline-block h-3.5 w-3.5 transform rounded-full bg-white transition shadow-sm"></span>
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <div className="flex items-center justify-end gap-3">
                    <button className="text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined text-lg">edit</span></button>
                    <button className="text-rose-500 transition-colors font-semibold">Activate</button>
                  </div>
                </td>
              </tr>

              {/* Row 5 */}
              <tr className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500 text-xs">RS</div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Rahul Sharma</p>
                      <p className="text-xs text-slate-500">rahul.s@ops.ecell.org</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-blue-100 text-blue-700 uppercase">Domain Manager</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-slate-600">Operations</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <button className="relative inline-flex h-5 w-9 items-center rounded-full bg-primary">
                    <span className="translate-x-4 inline-block h-3.5 w-3.5 transform rounded-full bg-white transition shadow-sm"></span>
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <div className="flex items-center justify-end gap-3">
                    <button className="text-slate-400 hover:text-primary transition-colors"><span className="material-symbols-outlined text-lg">edit</span></button>
                    <button className="text-slate-400 hover:text-rose-500 transition-colors"><span className="material-symbols-outlined text-lg">block</span></button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <p className="text-xs text-slate-500 font-medium tracking-tight">Showing 1 to 5 of 1,284 users</p>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-white border border-slate-200 rounded text-xs font-semibold hover:bg-slate-50">Previous</button>
            <button className="px-3 py-1 bg-white border border-slate-200 rounded text-xs font-semibold hover:bg-slate-50">Next</button>
          </div>
        </div>
      </div>
      
    </div>
  );
}
