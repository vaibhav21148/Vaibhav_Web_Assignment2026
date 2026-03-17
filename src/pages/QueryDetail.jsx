import React from 'react';
import { useParams, Link } from 'react-router-dom';

const DUMMY_QUERY_DETAIL = {
  id: 'QRY-8429',
  subject: 'Issue with Startup Registration Form',
  status: 'Open',
  priority: 'High',
  domain: 'Tech Support',
  category: 'Registration',
  date: '2 hours ago',
  assignee: 'Rahul Verma',
  author: 'Ananya Sharma',
  description: 'The user is unable to upload the GST certificate in the final step of the registration. The system throws a 413 Payload Too Large error even for files under 2MB. This is blocking multiple founders from completing their applications before the Sunday deadline.',
};

export default function QueryDetail() {
  const { id } = useParams();
  const query = DUMMY_QUERY_DETAIL;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 w-full">
      <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link to="/" className="hover:text-primary">Home</Link>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <Link to="/my-queries" className="hover:text-primary">Support Queries</Link>
        <span className="material-symbols-outlined text-sm">chevron_right</span>
        <span className="text-slate-900 font-medium">{id || query.id}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-8">
          <section>
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <h1 className="text-3xl font-black text-slate-900 leading-tight">{query.subject}</h1>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1">
                  <span className="size-2 bg-amber-500 rounded-full"></span> High Priority
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wider flex items-center gap-1">
                  <span className="size-2 bg-blue-500 rounded-full"></span> Open
                </span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500 mb-6 border-b border-slate-200 pb-6">
              <div className="flex items-center gap-1.5"><span className="material-symbols-outlined text-base">tag</span> {id || query.id}</div>
              <div className="flex items-center gap-1.5"><span className="material-symbols-outlined text-base">person</span> {query.author}</div>
              <div className="flex items-center gap-1.5"><span className="material-symbols-outlined text-base">schedule</span> {query.date}</div>
              <div className="flex items-center gap-1.5"><span className="material-symbols-outlined text-base">domain</span> {query.domain}</div>
              <div className="flex items-center gap-1.5"><span className="material-symbols-outlined text-base">category</span> {query.category}</div>
            </div>
            
            <div className="prose max-w-none mb-8">
              <p className="text-slate-700 leading-relaxed">
                {query.description}
              </p>
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-4 border-b border-slate-200 overflow-x-auto">
              <button className="px-4 py-3 border-b-2 border-primary text-primary font-bold text-sm whitespace-nowrap">Discussion</button>
              <button className="px-4 py-3 border-b-2 border-transparent text-slate-500 font-bold text-sm hover:text-slate-700 whitespace-nowrap">Timeline</button>
              <button className="px-4 py-3 border-b-2 border-transparent text-slate-500 font-bold text-sm hover:text-slate-700 whitespace-nowrap">Activity</button>
            </div>

            <div className="space-y-6">
              {/* Comment 1 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                  <div className="w-full h-full bg-slate-300 flex items-center justify-center font-bold text-slate-500">AS</div>
                </div>
                <div className="flex-1">
                  <div className="bg-white p-4 rounded-xl rounded-tl-none shadow-sm border border-slate-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-sm">Ananya Sharma</span>
                      <span className="text-xs text-slate-400">10:45 AM</span>
                    </div>
                    <p className="text-sm text-slate-600">I've tried multiple browsers (Chrome, Safari, Firefox) and the result is the same. The file is a standard PDF of 1.2MB.</p>
                  </div>
                </div>
              </div>

              {/* Bot Note */}
              <div className="flex gap-4 pl-12">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                  <span className="material-symbols-outlined text-lg">support_agent</span>
                </div>
                <div className="flex-1 border-l-4 border-amber-400">
                  <div className="bg-amber-50 p-4 rounded-xl rounded-tl-none shadow-sm border border-slate-200">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-amber-900">System Bot</span>
                        <span className="bg-amber-200 text-[10px] font-bold px-1.5 py-0.5 rounded text-amber-800 uppercase">Internal Note</span>
                      </div>
                      <span className="text-xs text-slate-400">11:02 AM</span>
                    </div>
                    <p className="text-sm text-amber-800 font-medium">Auto-check: Server logs show Cloudflare is rejecting the request before it hits our backend. Checking WAF rules.</p>
                  </div>
                </div>
              </div>

              {/* Support Response */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                   <div className="w-full h-full bg-slate-300 flex items-center justify-center font-bold text-slate-500">RV</div>
                </div>
                <div className="flex-1">
                  <div className="bg-primary/5 p-4 rounded-xl rounded-tl-none shadow-sm border border-primary/20">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-sm text-primary">Rahul Verma (Support)</span>
                      <span className="text-xs text-slate-400">11:15 AM</span>
                    </div>
                    <p className="text-sm text-slate-700">Hi Ananya, we are looking into this. It seems like a temporary restriction on the file upload gateway. Will update you in 15 mins.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Reply box */}
            <div className="mt-8 bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
              <textarea 
                className="w-full min-h-[120px] bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none resize-none" 
                placeholder="Type your response here..."
              ></textarea>
              <div className="flex flex-wrap items-center justify-between mt-4 gap-4">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input className="w-4 h-4 text-primary rounded border border-slate-300 focus:ring-primary" type="checkbox"/>
                    <span className="text-sm font-medium text-slate-600">Mark as Internal Note</span>
                  </label>
                  <button className="flex items-center gap-1.5 text-slate-500 hover:text-primary transition-colors text-sm font-medium">
                    <span className="material-symbols-outlined text-xl">attach_file</span>
                    Attach Files
                  </button>
                </div>
                <button className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-lg font-bold text-sm shadow-lg shadow-primary/20 transition-all flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">send</span>
                  Post Comment
                </button>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 space-y-6">
          <div className="sticky top-24 space-y-6">
            
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                <h3 className="font-bold text-slate-900">Query Details</h3>
                <button className="material-symbols-outlined text-slate-400 hover:text-primary">settings</button>
              </div>
              <div className="p-5 space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-primary outline-none p-2">
                    <option>Open</option>
                    <option>In Progress</option>
                    <option>Pending Verification</option>
                    <option>Resolved</option>
                    <option>Closed</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Priority</label>
                  <select className="w-full bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-primary outline-none p-2" defaultValue="High">
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned To</label>
                  <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-200 flex items-center justify-center font-bold text-slate-500 text-xs">
                        RV
                      </div>
                      <div className="text-sm">
                        <p className="font-bold leading-none">Rahul Verma</p>
                        <p className="text-xs text-slate-500 mt-1">L2 Support</p>
                      </div>
                    </div>
                    <button className="text-primary text-xs font-bold hover:underline">Reassign</button>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Domain</p>
                    <p className="text-sm font-semibold">{query.domain}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Category</p>
                    <p className="text-sm font-semibold">{query.category}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-200 bg-slate-50">
                <h3 className="font-bold text-slate-900">Attachments (2)</h3>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:border-primary/30 border border-transparent transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-red-500">picture_as_pdf</span>
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold truncate w-32">GST_Cert.pdf</p>
                      <p className="text-[10px] text-slate-500">1.2 MB</p>
                    </div>
                  </div>
                  <button className="material-symbols-outlined text-slate-400 hover:text-primary transition-colors">download</button>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:border-primary/30 border border-transparent transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-blue-500">image</span>
                    <div className="overflow-hidden">
                      <p className="text-xs font-bold truncate w-32">Error_Screen.png</p>
                      <p className="text-[10px] text-slate-500">450 KB</p>
                    </div>
                  </div>
                  <button className="material-symbols-outlined text-slate-400 hover:text-primary transition-colors">download</button>
                </div>
              </div>
            </div>

            <button className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold text-sm shadow-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
              <span className="material-symbols-outlined">check_circle</span>
              Mark as Resolved
            </button>
            
          </div>
        </aside>

      </div>
    </div>
  );
}
