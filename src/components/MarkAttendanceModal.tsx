import React, { useState, useEffect } from 'react';
import { Course, AttendanceStatus } from '../types/attendance';
import { X, Check, Calendar, MessageSquare, PlusCircle } from 'lucide-react';

interface MarkAttendanceModalProps {
  isOpen: boolean;
  course: Course | null;
  courses: Course[];
  initialStatus?: AttendanceStatus;
  onClose: () => void;
  onConfirm: (courseId: string, status: AttendanceStatus, date: string, note?: string) => void;
}

export const MarkAttendanceModal: React.FC<MarkAttendanceModalProps> = ({
  isOpen,
  course,
  courses,
  initialStatus = 'present',
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  const [selectedCourseId, setSelectedCourseId] = useState<string>(
    course ? course.id : courses[0]?.id || ''
  );

  useEffect(() => {
    if (course) {
      setSelectedCourseId(course.id);
    } else if (courses.length > 0) {
      setSelectedCourseId(courses[0].id);
    }
  }, [course, courses, isOpen]);

  const activeCourse = courses.find((c) => c.id === selectedCourseId) || course || courses[0];

  const todayStr = new Date().toISOString().split('T')[0];
  const [status, setStatus] = useState<AttendanceStatus>(initialStatus);
  const [date, setDate] = useState<string>(todayStr);
  const [note, setNote] = useState<string>('');

  useEffect(() => {
    setStatus(initialStatus);
    setDate(new Date().toISOString().split('T')[0]);
    setNote('');
  }, [isOpen, initialStatus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCourse) return;
    onConfirm(activeCourse.id, status, date, note.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-zinc-950/50 backdrop-blur-xs z-50 flex items-end sm:items-center justify-center animate-fade-in select-none">
      
      {/* Backdrop overlay touch close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Bottom Sheet Card on Mobile */}
      <div className="w-full max-w-md bg-white border border-zinc-200/80 p-5 sm:p-6 rounded-t-3xl sm:rounded-3xl shadow-2xl space-y-4 relative animate-scale-up z-10 max-h-[90vh] overflow-y-auto">
        
        {/* Mobile Drag Indicator Bar */}
        <div className="w-12 h-1.5 bg-zinc-200 rounded-full mx-auto sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
          <div>
            <h2 className="text-base sm:text-lg font-black text-zinc-900 tracking-tight font-outfit">
              Record Attendance
            </h2>
            <p className="text-xs text-zinc-400 font-semibold">
              Log daily session for your courses
            </p>
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
          
          {/* Select Course dropdown */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-zinc-450 uppercase tracking-wider pl-1">
              Select Subject Course
            </label>
            <select
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="w-full bg-white border border-zinc-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-zinc-800 text-xs font-bold rounded-xl px-3 py-2.5 outline-none shadow-2xs"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.code ? `[${c.code}] ` : ''}{c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Presence / Absence Toggle Buttons */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-zinc-450 uppercase tracking-wider pl-1">
              Status
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setStatus('present')}
                className={`py-3 px-4 rounded-xl border text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center space-x-2 ${
                  status === 'present'
                    ? 'bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-600/20 scale-[1.02]'
                    : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Present</span>
              </button>

              <button
                type="button"
                onClick={() => setStatus('absent')}
                className={`py-3 px-4 rounded-xl border text-xs font-extrabold transition-all cursor-pointer flex items-center justify-center space-x-2 ${
                  status === 'absent'
                    ? 'bg-rose-600 border-rose-600 text-white shadow-md shadow-rose-600/20 scale-[1.02]'
                    : 'bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50'
                }`}
              >
                <X className="w-4 h-4 stroke-[3]" />
                <span>Absent</span>
              </button>
            </div>
          </div>

          {/* Date Picker */}
          <div className="space-y-1">
            <div className="flex justify-between items-center pl-1">
              <label className="text-[10px] font-black text-zinc-450 uppercase tracking-wider flex items-center gap-1">
                <Calendar className="w-3 h-3 text-indigo-600" /> Class Date
              </label>
              <span className="text-[9px] text-indigo-600 font-bold">
                Multiple entries allowed
              </span>
            </div>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-white border border-zinc-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-zinc-800 text-xs font-bold rounded-xl px-3 py-2.5 outline-none shadow-2xs"
              required
            />
          </div>

          {/* Optional Note */}
          <div className="space-y-1">
            <label className="text-[10px] font-black text-zinc-450 uppercase tracking-wider pl-1 flex items-center gap-1">
              <MessageSquare className="w-3 h-3 text-zinc-400" /> Note / Topic
            </label>
            <input
              type="text"
              placeholder="e.g. Lab session, Double lecture"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-white border border-zinc-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 text-zinc-800 text-xs font-bold rounded-xl px-3 py-2.5 outline-none shadow-2xs"
            />
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
              className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20 transition-all cursor-pointer flex items-center justify-center space-x-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Record Entry</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
