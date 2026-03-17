import React from 'react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Link } from 'react-router-dom';
import { MessageSquare, Paperclip, Clock } from 'lucide-react';

export function QueryCard({ query }) {
  const statusColor = {
    'Pending': 'warning',
    'In-Progress': 'primary',
    'Resolved': 'success'
  };

  const priorityColor = {
    'High': 'text-red-600 bg-red-50 border-red-200',
    'Med': 'text-yellow-600 bg-yellow-50 border-yellow-200',
    'Low': 'text-green-600 bg-green-50 border-green-200'
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-mono text-slate-500">{query.id}</span>
            <Badge variant={statusColor[query.status]}>{query.status}</Badge>
            <span className={`text-xs px-2 py-0.5 rounded-full border ${priorityColor[query.priority]}`}>
              {query.priority} Priority
            </span>
          </div>
          <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 mb-1">
            <Link to={`/query/${query.id}`} className="hover:underline">{query.subject}</Link>
          </h3>
          <p className="text-sm text-slate-500 line-clamp-2">{query.description}</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm text-slate-500 mt-4 pt-4 border-t border-slate-100">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> {query.date}</span>
          <span className="flex items-center gap-1.5"><MessageSquare className="w-4 h-4" /> {query.comments}</span>
          {query.attachments > 0 && <span className="flex items-center gap-1.5"><Paperclip className="w-4 h-4" /> {query.attachments}</span>}
        </div>
        <div className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
          {query.domain}
        </div>
      </div>
    </div>
  );
}
