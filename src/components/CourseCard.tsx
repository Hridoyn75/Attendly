import React from 'react';
import { Course, CollegiateSettings } from '../types/attendance';
import { computeCourseStats } from '../utils/calculations';
import { Check, X, History, AlertCircle, ShieldCheck, Flame, Trash2, Edit3 } from 'lucide-react';

interface CourseCardProps {
  course: Course;
  settings?: CollegiateSettings;
  onMarkAttendance: (course: Course, status: 'present' | 'absent') => void;
  onViewHistory: (course: Course) => void;
  onEditCourse: (course: Course) => void;
  onDeleteCourse: (courseId: string) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  settings,
  onMarkAttendance,
  onViewHistory,
  onEditCourse,
  onDeleteCourse,
}) => {
  const stats = computeCourseStats(course, settings);

  const statusStyles = {
    collegiate: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
      bar: 'bg-emerald-500',
      badge: 'COLLEGIATE',
      icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 mr-1" />,
    },
    'non-collegiate': {
      bg: 'bg-amber-50 text-amber-700 border-amber-200/60',
      bar: 'bg-amber-500',
      badge: 'NON-COLLEGIATE',
      icon: <AlertCircle className="w-3.5 h-3.5 text-amber-600 mr-1" />,
    },
    'dis-collegiate': {
      bg: 'bg-rose-50 text-rose-700 border-rose-200/60',
      bar: 'bg-rose-500',
      badge: 'DIS-COLLEGIATE',
      icon: <Flame className="w-3.5 h-3.5 text-rose-600 mr-1" />,
    },
  };

  const currentStatus = statusStyles[stats.collegiateStatus];

  const colorAccents: Record<string, string> = {
    indigo: 'border-l-indigo-500',
    violet: 'border-l-violet-500',
    emerald: 'border-l-emerald-500',
    amber: 'border-l-amber-500',
    rose: 'border-l-rose-500',
    sky: 'border-l-sky-500',
  };

  const borderClass = colorAccents[course.color] || 'border-l-indigo-500';

  return (
    <div className={`glass-card rounded-2xl border border-zinc-200/60 border-l-4 ${borderClass} p-4 sm:p-5 hover:-translate-y-0.5 hover:shadow-md transition-all duration-150 ease-out transform-gpu flex flex-col justify-between space-y-3 bg-white/95 group`}>
      
      {/* Top Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-1.5 mb-1">
            <span className="text-[9.5px] font-mono font-black uppercase tracking-wider bg-zinc-100 text-zinc-600 px-2 py-0.5 rounded-md border border-zinc-200/60">
              {course.code || 'COURSE'}
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-black tracking-wider border ${currentStatus.bg}`}>
              {currentStatus.icon}
              {currentStatus.badge}
            </span>
          </div>

          <h3 className="text-base font-black text-zinc-900 tracking-tight font-outfit truncate group-hover:text-indigo-600 transition-colors duration-150">
            {course.name}
          </h3>
        </div>

        {/* Edit & Delete Options */}
        <div className="flex items-center space-x-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity duration-150">
          <button
            onClick={() => onEditCourse(course)}
            className="p-1.5 hover:bg-zinc-100 rounded-lg text-zinc-400 hover:text-zinc-700 transition-colors duration-150 cursor-pointer"
            title="Edit Subject"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDeleteCourse(course.id)}
            className="p-1.5 hover:bg-red-50 rounded-lg text-zinc-400 hover:text-red-500 transition-colors duration-150 cursor-pointer"
            title="Delete Subject"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Stats Display */}
      <div className="bg-zinc-50/80 p-3 rounded-xl border border-zinc-200/50 space-y-2">
        <div className="flex items-baseline justify-between">
          <div>
            <span className="text-[9px] font-black text-zinc-450 uppercase tracking-wider">Attendance Rate</span>
            <div className="flex items-baseline space-x-1.5">
              <span
                className={`text-2xl font-black font-outfit ${
                  stats.collegiateStatus === 'collegiate'
                    ? 'text-zinc-900'
                    : stats.collegiateStatus === 'non-collegiate'
                    ? 'text-amber-700'
                    : 'text-rose-700'
                }`}
              >
                {stats.percentage}%
              </span>
              <span className="text-[10px] font-bold text-zinc-400">
                Min: {stats.nonCollegiateThreshold}%
              </span>
            </div>
          </div>

          <div className="text-right font-mono text-xs">
            <span className="font-extrabold text-emerald-600">{stats.present} P</span>
            <span className="text-zinc-300 mx-1">/</span>
            <span className="font-extrabold text-rose-600">{stats.absent} A</span>
            <div className="text-[9px] text-zinc-400 font-sans font-semibold mt-0.5">
              Total: {stats.total} classes
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-zinc-200/70 h-2 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-200 ease-out transform-gpu rounded-full ${currentStatus.bar}`}
            style={{ width: `${Math.min(100, stats.percentage)}%` }}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-2 pt-0.5 font-sans">
        <button
          onClick={() => onMarkAttendance(course, 'present')}
          className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs hover:shadow-emerald-600/20 transition-all duration-150 cursor-pointer flex items-center justify-center space-x-1.5 active:scale-[0.98] transform-gpu"
        >
          <Check className="w-4 h-4 stroke-[3]" />
          <span>Present</span>
        </button>

        <button
          onClick={() => onMarkAttendance(course, 'absent')}
          className="flex-1 py-2 px-3 bg-white hover:bg-rose-50 border border-zinc-200 hover:border-rose-200 text-rose-600 font-bold text-xs rounded-xl shadow-2xs transition-all duration-150 cursor-pointer flex items-center justify-center space-x-1.5 active:scale-[0.98] transform-gpu"
        >
          <X className="w-4 h-4 stroke-[3]" />
          <span>Absent</span>
        </button>

        <button
          onClick={() => onViewHistory(course)}
          className="p-2 text-zinc-500 hover:text-indigo-600 bg-white hover:bg-indigo-50 border border-zinc-200 hover:border-indigo-200 rounded-xl transition-all duration-150 shadow-2xs cursor-pointer active:scale-95 transform-gpu"
          title="View History Logs"
        >
          <History className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
