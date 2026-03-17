import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AddQuery() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    domain: '',
    category: '',
    priority: 'medium',
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting query:", formData);
    alert("Query successfully raised! (Mock)");
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center py-4 px-4 sm:px-6 w-full">
      <div className="w-full max-w-[700px] flex flex-col gap-6">
        {/* Progress & Title Section */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-end">
              <span className="text-primary text-sm font-semibold uppercase tracking-wider">Step 1 of 1</span>
              <span className="text-slate-500 text-xs font-medium">100% Complete</span>
            </div>
            <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-primary w-full rounded-full"></div>
            </div>
          </div>
          <div className="pt-2">
            <h1 className="text-3xl font-bold text-slate-900 w-full">Create New Query</h1>
            <p className="text-slate-500 mt-1">Submit your detailed request to the administrative team.</p>
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 bg-white p-6 md:p-8 rounded-xl shadow-sm border border-slate-200">
          
          {/* Title Field */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700" htmlFor="query-title">Query Title</label>
            <input 
              className="w-full rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary p-3 transition-colors outline-none" 
              id="query-title" 
              placeholder="Enter a brief, descriptive title" 
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>

          {/* Grid for Domain and Category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700" htmlFor="domain">Domain</label>
              <select 
                className="w-full rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary p-3 transition-colors outline-none cursor-pointer" 
                id="domain"
                value={formData.domain}
                onChange={(e) => setFormData({...formData, domain: e.target.value})}
                required
              >
                <option value="" disabled>Select domain</option>
                <option value="tech">Technology & Infrastructure</option>
                <option value="finance">Finance & Funding</option>
                <option value="marketing">Marketing & Outreach</option>
                <option value="operations">Operations & Events</option>
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700" htmlFor="category">Category</label>
              <input 
                className="w-full rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary p-3 transition-colors outline-none" 
                id="category" 
                placeholder="e.g. Sponsorship, Workshop" 
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              />
            </div>
          </div>

          {/* Priority Selection */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-semibold text-slate-700">Priority Level</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <label className="relative cursor-pointer">
                <input 
                  className="peer sr-only" 
                  name="priority" 
                  type="radio" 
                  value="low"
                  checked={formData.priority === 'low'}
                  onChange={() => setFormData({...formData, priority: 'low'})}
                />
                <div className="flex items-center justify-center p-3 rounded-lg border-2 border-slate-200 bg-slate-50 peer-checked:border-slate-400 peer-checked:bg-slate-100 transition-all">
                  <span className="text-sm font-medium text-slate-600">Low</span>
                </div>
              </label>

              <label className="relative cursor-pointer">
                <input 
                  className="peer sr-only" 
                  name="priority" 
                  type="radio" 
                  value="medium"
                  checked={formData.priority === 'medium'}
                  onChange={() => setFormData({...formData, priority: 'medium'})}
                />
                <div className="flex items-center justify-center p-3 rounded-lg border-2 border-slate-200 bg-slate-50 peer-checked:border-primary peer-checked:bg-primary/10 transition-all">
                  <span className="text-sm font-medium text-primary">Medium</span>
                </div>
              </label>

              <label className="relative cursor-pointer">
                <input 
                  className="peer sr-only" 
                  name="priority" 
                  type="radio" 
                  value="high"
                  checked={formData.priority === 'high'}
                  onChange={() => setFormData({...formData, priority: 'high'})}
                />
                <div className="flex items-center justify-center p-3 rounded-lg border-2 border-slate-200 bg-slate-50 peer-checked:border-amber-500 peer-checked:bg-amber-500/10 transition-all">
                  <span className="text-sm font-medium text-amber-600">High</span>
                </div>
              </label>

              <label className="relative cursor-pointer">
                <input 
                  className="peer sr-only" 
                  name="priority" 
                  type="radio" 
                  value="critical"
                  checked={formData.priority === 'critical'}
                  onChange={() => setFormData({...formData, priority: 'critical'})}
                />
                <div className="flex items-center justify-center p-3 rounded-lg border-2 border-slate-200 bg-slate-50 peer-checked:border-red-500 peer-checked:bg-red-500/10 transition-all">
                  <span className="text-sm font-medium text-red-600">Critical</span>
                </div>
              </label>
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-semibold text-slate-700" htmlFor="description">Detailed Description</label>
              <span className="text-xs text-slate-400">{formData.description.length} / 1000 characters</span>
            </div>
            <textarea 
              className="w-full rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary p-3 transition-colors outline-none resize-none" 
              id="description" 
              placeholder="Please provide all relevant details regarding your query..." 
              rows="5"
              maxLength={1000}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
            ></textarea>
          </div>

          {/* File Upload */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700">Attachments</label>
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-slate-400 text-4xl">cloud_upload</span>
              <div className="text-center">
                <p className="text-sm font-medium text-slate-700">Drag and drop files here or <span className="text-primary">browse</span></p>
                <p className="text-xs text-slate-500 mt-1">Supported formats: PDF, DOCX, PNG, JPG (Max 10MB)</p>
              </div>
            </div>
            {/* File Chips */}
            <div className="flex flex-wrap gap-2 mt-2">
              <div className="flex items-center gap-2 bg-primary/10 text-primary text-xs font-medium px-3 py-1.5 rounded-full border border-primary/20">
                <span className="material-symbols-outlined text-sm">description</span>
                <span>proposal_draft_v1.pdf</span>
                <button className="hover:text-primary/70" type="button"><span className="material-symbols-outlined text-sm">close</span></button>
              </div>
              <div className="flex items-center gap-2 bg-primary/10 text-primary text-xs font-medium px-3 py-1.5 rounded-full border border-primary/20">
                <span className="material-symbols-outlined text-sm">image</span>
                <span>event_banner.jpg</span>
                <button className="hover:text-primary/70" type="button"><span className="material-symbols-outlined text-sm">close</span></button>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 text-lg" type="submit">
              <span>Submit Query</span>
              <span className="material-symbols-outlined">send</span>
            </button>
            <p className="text-center text-xs text-slate-500 mt-4">By submitting, you agree to our Terms of Service and Privacy Policy.</p>
          </div>
        </form>
      </div>
    </div>
  );
}
