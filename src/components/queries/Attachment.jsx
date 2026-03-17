import React, { useState } from 'react';
import { UploadCloud, File, X } from 'lucide-react';

export function Attachment() {
  const [files, setFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFiles([...files, ...Array.from(e.dataTransfer.files)]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFiles([...files, ...Array.from(e.target.files)]);
    }
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  return (
    <div className="w-full">
      <div 
        className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors
          ${isDragOver ? 'border-primary-500 bg-primary-50' : 'border-slate-300 hover:border-slate-400 bg-white'}
        `}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
      >
        <div className="space-y-1 text-center">
          <UploadCloud className="mx-auto h-12 w-12 text-slate-400" />
          <div className="flex text-sm text-slate-600 justify-center">
            <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500 px-1 py-0.5">
              <span>Upload a file</span>
              <input id="file-upload" name="file-upload" type="file" className="sr-only" multiple onChange={handleChange} />
            </label>
            <p className="pl-1 py-0.5">or drag and drop</p>
          </div>
          <p className="text-xs text-slate-500">PNG, JPG, PDF up to 10MB</p>
        </div>
      </div>
      
      {files.length > 0 && (
        <ul className="mt-4 space-y-3">
          {files.map((file, idx) => (
            <li key={idx} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-md">
              <div className="flex items-center flex-1 w-0">
                <File className="flex-shrink-0 h-5 w-5 text-slate-400" />
                <span className="ml-2 w-0 flex-1 truncate text-sm text-slate-900">{file.name}</span>
              </div>
              <div className="ml-4 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => removeFile(idx)}
                  className="rounded-md font-medium text-red-600 hover:text-red-500 p-1 hover:bg-red-50"
                  title="Remove file"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
