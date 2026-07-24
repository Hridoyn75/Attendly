import React, { useState, useMemo } from 'react';
import { Course, CollegiateSettings } from '../types/attendance';
import { getWeeklyTrendData, getMonthlyTrendData, computeCourseStats } from '../utils/calculations';
import { TrendingUp, BarChart3 } from 'lucide-react';

interface AnalyticsChartsProps {
  courses: Course[];
  settings: CollegiateSettings;
  timeframe?: 'week' | 'month' | 'all';
}

export const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ courses, settings, timeframe = 'all' }) => {
  const [chartView, setChartView] = useState<'weekly' | 'monthly'>('weekly');

  const weeklyTrend = useMemo(
    () => getWeeklyTrendData(courses, settings.weekStartDay),
    [courses, settings.weekStartDay]
  );

  const monthlyTrend = useMemo(
    () => getMonthlyTrendData(courses),
    [courses]
  );

  const activeTrend = (timeframe === 'month' || (timeframe === 'all' && chartView === 'monthly'))
    ? monthlyTrend
    : weeklyTrend;

  const isMonthlyActive = (timeframe === 'month' || (timeframe === 'all' && chartView === 'monthly'));

  return (
    <div className="space-y-4 font-sans">
      
      {/* 1. Dynamic Attendance Trend Graph (Weekly & Monthly) */}
      <div className="glass-card p-4 rounded-2xl border border-zinc-200/80 bg-white space-y-3">
        <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-xs font-black text-zinc-900 uppercase tracking-wider">
                {isMonthlyActive ? '6-Month Attendance Trend' : '6-Week Attendance Trend'}
              </h3>
              <p className="text-[10px] text-zinc-500 font-semibold">
                {isMonthlyActive ? 'Monthly' : 'Weekly'} rate vs. {settings.nonCollegiateThreshold}% Collegiate target
              </p>
            </div>
          </div>

          {/* Toggle pill for Semester view */}
          {timeframe === 'all' && (
            <div className="flex items-center bg-zinc-100 p-0.5 rounded-xl border border-zinc-200 text-[10px] font-bold">
              <button
                onClick={() => setChartView('weekly')}
                className={`px-2 py-0.5 rounded-lg transition-all duration-150 cursor-pointer ${
                  chartView === 'weekly' ? 'bg-white text-indigo-700 shadow-2xs font-extrabold' : 'text-zinc-500'
                }`}
              >
                Weekly
              </button>
              <button
                onClick={() => setChartView('monthly')}
                className={`px-2 py-0.5 rounded-lg transition-all duration-150 cursor-pointer ${
                  chartView === 'monthly' ? 'bg-white text-indigo-700 shadow-2xs font-extrabold' : 'text-zinc-500'
                }`}
              >
                Monthly
              </button>
            </div>
          )}
        </div>

        {/* SVG Bar Graph */}
        <div className="pt-2">
          <div className="flex items-end justify-between h-36 gap-2 px-1 relative">
            
            {/* Target 75% Line Indicator */}
            <div
              className="absolute left-0 right-0 border-t-2 border-dashed border-emerald-400/80 z-10 pointer-events-none flex justify-end"
              style={{ bottom: `${settings.nonCollegiateThreshold}%` }}
            >
              <span className="text-[9px] font-black text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded -mt-2.5 mr-1 border border-emerald-200">
                {settings.nonCollegiateThreshold}% Target
              </span>
            </div>

            {activeTrend.map((pt, idx) => {
              const heightPct = Math.max(8, pt.percentage);
              const isCollegiate = pt.total > 0 && pt.percentage >= settings.nonCollegiateThreshold;
              const isDisCollegiate = pt.total > 0 && pt.percentage < settings.disCollegiateThreshold;

              return (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                  
                  {/* Tooltip on Hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 absolute -top-8 bg-zinc-900 text-white text-[9px] font-bold px-2 py-1 rounded-md shadow-md pointer-events-none whitespace-nowrap z-20">
                    {pt.total > 0 ? `${pt.percentage}% (${pt.present}P/${pt.absent}A)` : 'No records'}
                  </div>

                  {/* Percentage label on top of bar */}
                  <span className="text-[9.5px] font-black font-outfit mb-1 text-zinc-700">
                    {pt.total > 0 ? `${pt.percentage}%` : '-'}
                  </span>

                  {/* Bar Element */}
                  <div className="w-full bg-zinc-100 rounded-t-xl overflow-hidden h-full flex items-end">
                    <div
                      className={`w-full transition-all duration-200 ease-out transform-gpu rounded-t-xl ${
                        pt.total === 0
                          ? 'bg-zinc-200'
                          : isCollegiate
                          ? 'bg-emerald-500 group-hover:bg-emerald-600'
                          : isDisCollegiate
                          ? 'bg-rose-500 group-hover:bg-rose-600'
                          : 'bg-amber-500 group-hover:bg-amber-600'
                      }`}
                      style={{ height: pt.total > 0 ? `${heightPct}%` : '8%' }}
                    />
                  </div>

                  {/* Timeframe Label */}
                  <span className="text-[9.5px] font-extrabold text-zinc-500 mt-2 font-mono truncate max-w-full">
                    {pt.label}
                  </span>
                </div>
              );
            })}

          </div>
        </div>
      </div>

      {/* 2. Subject Breakdown Chart */}
      {courses.length > 0 && (
        <div className="glass-card p-4 rounded-2xl border border-zinc-200/80 bg-white space-y-3">
          <div className="flex items-center space-x-2 border-b border-zinc-100 pb-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <BarChart3 className="w-3.5 h-3.5" />
            </div>
            <div>
              <h3 className="text-xs font-black text-zinc-900 uppercase tracking-wider">
                Subject Attendance Comparison
              </h3>
              <p className="text-[10px] text-zinc-500 font-semibold">
                Per-course attendance rates
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-1">
            {courses.map((course) => {
              const stats = computeCourseStats(course, settings);
              const barColor =
                stats.collegiateStatus === 'collegiate'
                  ? 'bg-emerald-500'
                  : stats.collegiateStatus === 'non-collegiate'
                  ? 'bg-amber-500'
                  : 'bg-rose-500';

              return (
                <div key={course.id} className="space-y-1">
                  <div className="flex justify-between items-baseline text-xs">
                    <span className="font-extrabold text-zinc-800 font-outfit truncate max-w-[65%]">
                      {course.code ? `${course.code}: ` : ''}{course.name}
                    </span>
                    <span className="font-mono font-extrabold text-zinc-700">
                      {stats.percentage}% <span className="text-[10px] text-zinc-400 font-normal">({stats.present}/{stats.total})</span>
                    </span>
                  </div>

                  <div className="w-full bg-zinc-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-200 ease-out transform-gpu ${barColor}`}
                      style={{ width: `${Math.min(100, stats.percentage)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
