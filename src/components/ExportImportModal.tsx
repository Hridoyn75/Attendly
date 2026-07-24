import React, { useState } from 'react';
import { Course } from '../types/attendance';
import { X, Download, Upload, Copy, Check, FileText } from 'lucide-react';

interface ExportImportModalProps {
  isOpen: boolean;
  courses: Course[];
  onClose: () => void;
  onImportCourses: (imported: Course[]) => void;
}

export const ExportImportModal: React.FC<ExportImportModalProps> = ({
  isOpen,
  courses,
  onClose,
  onImportCourses,
}) => {
  if (!isOpen) return null;

  const [jsonText, setJsonText] = useState('');
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleExportDownload = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(courses, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `semester_attendance_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(courses, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImportJson = () => {
    try {
      setErrorMsg('');
      const parsed = JSON.parse(jsonText);
      if (!Array.isArray(parsed)) {
        throw new Error('Invalid JSON format. Expected an array of courses.');
      }
      onImportCourses(parsed);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to parse JSON file.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
          onImportCourses(parsed);
          onClose();
        } else {
          setErrorMsg('Uploaded file is not a valid course array JSON.');
        }
      } catch (err) {
        setErrorMsg('Error reading uploaded JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 bg-zinc-950/45 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in select-none">
      <div className="w-full max-w-lg bg-white border border-zinc-200/80 p-6 rounded-2xl shadow-2xl space-y-5 relative animate-scale-up">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3.5">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-lg font-black text-zinc-900 tracking-tight font-outfit">
                Backup & Restore Data
              </h2>
              <p className="text-xs text-zinc-500 font-semibold">
                Export semester records or restore from JSON backup
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Export Section */}
        <div className="space-y-2 bg-zinc-50 p-4 rounded-xl border border-zinc-200/60">
          <h3 className="text-xs font-black text-zinc-800 uppercase tracking-wider">
            Export Current Data
          </h3>
          <p className="text-[11px] text-zinc-500 font-semibold">
            Save all {courses.length} courses and attendance logs to a local file.
          </p>
          <div className="flex gap-2 pt-1">
            <button
              onClick={handleExportDownload}
              className="flex-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center justify-center space-x-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Download .JSON</span>
            </button>
            <button
              onClick={handleCopyJson}
              className="py-2 px-3 bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-700 font-bold text-xs rounded-xl shadow-2xs transition-all cursor-pointer flex items-center justify-center space-x-1.5"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-zinc-500" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Import Section */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-black text-zinc-800 uppercase tracking-wider">
            Restore / Import JSON
          </h3>

          <div>
            <label className="block py-2.5 px-4 bg-white border border-dashed border-zinc-300 hover:border-indigo-400 rounded-xl text-center cursor-pointer transition-all hover:bg-indigo-50/30">
              <Upload className="w-5 h-5 mx-auto text-indigo-600 mb-1" />
              <span className="text-xs font-bold text-zinc-700 block">Click to Upload .JSON Backup</span>
              <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-black text-zinc-450 uppercase tracking-wider">
              Or Paste JSON string:
            </label>
            <textarea
              rows={3}
              placeholder="Paste JSON array here..."
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              className="w-full bg-white border border-zinc-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-zinc-800 text-xs font-mono rounded-xl p-2.5 focus:outline-none"
            />
          </div>

          {errorMsg && (
            <p className="text-xs font-bold text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
              ⚠️ {errorMsg}
            </p>
          )}

          {jsonText && (
            <button
              onClick={handleImportJson}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
            >
              Apply Imported JSON Data
            </button>
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-zinc-100">
          <button
            onClick={onClose}
            className="w-full py-2.5 border border-zinc-200 hover:bg-zinc-50 text-zinc-600 font-bold text-xs rounded-xl cursor-pointer"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
