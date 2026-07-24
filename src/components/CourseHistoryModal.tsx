import React from 'react';
import { Course, AttendanceRecord } from '../types/attendance';
import { computeCourseStats } from '../utils/calculations';
import { X, History, Trash2, CheckCircle2, XCircle, Calendar, MessageSquare } from 'lucide-react';

interface CourseHistoryModalProps {
  course: Course | null;
  onClose: () => void;
  onDeleteRecord: (courseId: string, recordId: string) => void;
  onToggleRecordStatus: (courseId: string, recordId: string) => void;
}

export const CourseHistoryModal: React.FC<CourseHistoryModalProps> = ({
  course,
  onClose,
  onDeleteRecord,
  onToggleRecordStatus,
}) => {
  if (!course) return null;

  const stats = computeCourseStats(course);
  const sortedRecords = [...course.records].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime() || b.timestamp - a.timestamp
  );

  return (
    <div className="fixed inset-0 bg-zinc-950/45 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in select-none">
      <div className="w-full max-w-lg bg-white border border-zinc-200/80 p-6 rounded-2xl shadow-2xl space-y-5 relative max-h-[90vh] flex flex-col animate-scale-up">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-zinc-100 pb-3.5 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
              <History className="w-4.5 h-4.5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[9.5px] font-mono font-black uppercase tracking-wider bg-zinc-100 text-zinc-600 px-1.5 py-0.5 rounded border border-zinc-200">
                  {course.code || 'COURSE'}
                </span>
                <h2 className="text-base font-black text-zinc-900 tracking-tight font-outfit truncate">
                  {course.name}
                </h2>
              </div>
              <p className="text-xs text-zinc-400 font-semibold mt-0.5">
                Attendance Timeline & Logs ({course.records.length} entries)
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

        {/* Quick Summary Pill Bar */}
        <div className="grid grid-cols-3 gap-2 text-center p-3 bg-zinc-50 rounded-xl border border-zinc-200/60 shrink-0 font-sans">
          <div>
            <span className="text-[9px] font-black text-zinc-400 uppercase tracking-wider block">Rate</span>
            <span className={`text-base font-black font-outfit ${stats.percentage >= (course.targetPercentage || 75) ? 'text-emerald-600' : 'text-rose-600'}`}>
              {stats.percentage}%
            </span>
          </div>
          <div>
            <span className="text-[9px] font-black text-zinc-400 uppercase tracking-wider block">Present</span>
            <span className="text-base font-black text-emerald-600 font-outfit">{stats.present}</span>
          </div>
          <div>
            <span className="text-[9px] font-black text-zinc-400 uppercase tracking-wider block">Absent</span>
            <span className="text-base font-black text-rose-600 font-outfit">{stats.absent}</span>
          </div>
        </div>

        {/* Logs Timeline List */}
        <div className="flex-1 overflow-y-auto scrollbar-thin pr-1 space-y-2.5">
          {sortedRecords.length === 0 ? (
            <div className="text-center py-10 text-zinc-400 space-y-2">
              <History className="w-8 h-8 mx-auto opacity-40 text-zinc-400" />
              <p className="text-xs font-semibold">No attendance entries recorded yet.</p>
            </div>
          ) : (
            sortedRecords.map((record: AttendanceRecord) => (
              <div
                key={record.id}
                className="flex items-center justify-between p-3 bg-white border border-zinc-200/70 hover:border-zinc-300 rounded-xl shadow-2xs transition-all group font-sans"
              >
                <div className="flex items-center space-x-3">
                  {/* Status Toggle Button */}
                  <button
                    onClick={() => onToggleRecordStatus(course.id, record.id)}
                    className="cursor-pointer transition-transform hover:scale-105 active:scale-95"
                    title="Click to toggle Present/Absent status"
                  >
                    {record.status === 'present' ? (
                      <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center">
                        <CheckCircle2 className="w-4.5 h-4.5" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center">
                        <XCircle className="w-4.5 h-4.5" />
                      </div>
                    )}
                  </button>

                  {/* Details */}
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-zinc-800 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-zinc-400" />
                        {new Date(record.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                      <span
                        className={`text-[9.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                          record.status === 'present'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200/50'
                            : 'bg-rose-50 text-rose-700 border-rose-200/50'
                        }`}
                      >
                        {record.status}
                      </span>
                    </div>

                    {record.note ? (
                      <p className="text-[11px] font-semibold text-zinc-500 flex items-center gap-1 mt-0.5">
                        <MessageSquare className="w-3 h-3 text-zinc-400 shrink-0" />
                        <span>{record.note}</span>
                      </p>
                    ) : (
                      <span className="text-[10px] text-zinc-400 font-semibold italic mt-0.5 block">
                        No note attached
                      </span>
                    )}
                  </div>
                </div>

                {/* Delete record */}
                <button
                  onClick={() => onDeleteRecord(course.id, record.id)}
                  className="p-1.5 text-zinc-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer opacity-70 group-hover:opacity-100"
                  title="Delete entry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer Close */}
        <div className="pt-2 border-t border-zinc-100 shrink-0">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
          >
            Close History
          </button>
        </div>

      </div>
    </div>
  );
};
