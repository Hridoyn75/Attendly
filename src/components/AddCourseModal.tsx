import React, { useState, useEffect } from 'react';
import { Course } from '../types/attendance';
import { X, BookOpen, Palette } from 'lucide-react';

interface AddCourseModalProps {
  isOpen: boolean;
  editingCourse?: Course | null;
  onClose: () => void;
  onSave: (courseData: Omit<Course, 'id' | 'records'>) => void;
}

const COLOR_OPTIONS = [
  { id: 'indigo', name: 'Indigo', bg: 'bg-indigo-600' },
  { id: 'violet', name: 'Violet', bg: 'bg-violet-600' },
  { id: 'emerald', name: 'Emerald', bg: 'bg-emerald-600' },
  { id: 'amber', name: 'Amber', bg: 'bg-amber-500' },
  { id: 'rose', name: 'Rose', bg: 'bg-rose-600' },
  { id: 'sky', name: 'Sky', bg: 'bg-sky-600' },
];

export const AddCourseModal: React.FC<AddCourseModalProps> = ({
  isOpen,
  editingCourse,
  onClose,
  onSave,
}) => {
  if (!isOpen) return null;

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [color, setColor] = useState('indigo');

  useEffect(() => {
    if (editingCourse) {
      setName(editingCourse.name);
      setCode(editingCourse.code || '');
      setColor(editingCourse.color || 'indigo');
    } else {
      setName('');
      setCode('');
      setColor('indigo');
    }
  }, [editingCourse, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      name: name.trim(),
      code: code.trim().toUpperCase(),
      color,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-zinc-950/50 backdrop-blur-xs z-50 flex items-end sm:items-center justify-center animate-fade-in select-none">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="w-full max-w-md bg-white border border-zinc-200/80 p-5 sm:p-6 rounded-t-3xl sm:rounded-3xl shadow-2xl space-y-4 relative animate-scale-up z-10 max-h-[90vh] overflow-y-auto">
        
        <div className="w-12 h-1.5 bg-zinc-200 rounded-full mx-auto sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-zinc-900 tracking-tight font-outfit">
                {editingCourse ? 'Edit Course' : 'Add Subject Course'}
              </h2>
              <p className="text-[11px] text-zinc-400 font-semibold">
                Provide course name, code, and color
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-lg hover:bg-zinc-100 transition-colors cursor-pointer"
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 font-sans">
          
          {/* Course Name */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-zinc-450 uppercase tracking-wider pl-1">
              Course Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Data Structures & Algorithms"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-white border border-zinc-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-zinc-800 text-xs font-bold rounded-xl px-3 py-2.5 outline-none shadow-2xs"
              required
            />
          </div>

          {/* Course Code */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-zinc-450 uppercase tracking-wider pl-1">
              Course Code
            </label>
            <input
              type="text"
              placeholder="e.g. CS201"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full bg-white border border-zinc-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-zinc-800 text-xs font-mono font-bold uppercase rounded-xl px-3 py-2.5 outline-none shadow-2xs"
            />
          </div>

          {/* Color Tag Picker */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-zinc-450 uppercase tracking-wider pl-1 flex items-center gap-1">
              <Palette className="w-3 h-3 text-zinc-400" /> Color Accent
            </label>
            <div className="flex items-center space-x-3 pt-1">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setColor(c.id)}
                  className={`w-7 h-7 rounded-full ${c.bg} transition-all cursor-pointer flex items-center justify-center ${
                    color === c.id ? 'ring-3 ring-indigo-500/40 scale-110 shadow-xs' : 'opacity-70 hover:opacity-100'
                  }`}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2.5 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-zinc-200 hover:bg-zinc-50 text-zinc-600 font-bold text-xs rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
            >
              {editingCourse ? 'Save Changes' : 'Create Course'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
