import React, { useState, useEffect } from 'react';
import { Course, CollegiateSettings, WeekStartDay } from '../types/attendance';
import { Smartphone, Download, RefreshCw, HardDrive, Sliders, ShieldCheck, AlertTriangle, Flame, Calendar } from 'lucide-react';

interface PwaSettingsViewProps {
  courses: Course[];
  settings: CollegiateSettings;
  canInstallPwa: boolean;
  onUpdateSettings: (newSettings: CollegiateSettings) => void;
  onInstallPwa: () => void;
  onOpenExportImport: () => void;
  onResetData: () => void;
}

const ALL_DAYS: { id: WeekStartDay; label: string; short: string }[] = [
  { id: 'sunday', label: 'Sunday', short: 'Sun' },
  { id: 'monday', label: 'Monday', short: 'Mon' },
  { id: 'tuesday', label: 'Tuesday', short: 'Tue' },
  { id: 'wednesday', label: 'Wednesday', short: 'Wed' },
  { id: 'thursday', label: 'Thursday', short: 'Thu' },
  { id: 'friday', label: 'Friday', short: 'Fri' },
  { id: 'saturday', label: 'Saturday', short: 'Sat' },
];

export const PwaSettingsView: React.FC<PwaSettingsViewProps> = ({
  courses,
  settings,
  canInstallPwa,
  onUpdateSettings,
  onInstallPwa,
  onOpenExportImport,
  onResetData,
}) => {
  const [nonCollegiate, setNonCollegiate] = useState(settings.nonCollegiateThreshold);
  const [disCollegiate, setDisCollegiate] = useState(settings.disCollegiateThreshold);
  const [weekStart, setWeekStart] = useState<WeekStartDay>(settings.weekStartDay);

  useEffect(() => {
    setNonCollegiate(settings.nonCollegiateThreshold);
    setDisCollegiate(settings.disCollegiateThreshold);
    setWeekStart(settings.weekStartDay || 'sunday');
  }, [settings]);

  const handleNonCollegiateChange = (val: number) => {
    const validVal = Math.max(val, disCollegiate + 1);
    setNonCollegiate(validVal);
    onUpdateSettings({
      nonCollegiateThreshold: validVal,
      disCollegiateThreshold: disCollegiate,
      weekStartDay: weekStart,
    });
  };

  const handleDisCollegiateChange = (val: number) => {
    const validVal = Math.min(val, nonCollegiate - 1);
    setDisCollegiate(validVal);
    onUpdateSettings({
      nonCollegiateThreshold: nonCollegiate,
      disCollegiateThreshold: validVal,
      weekStartDay: weekStart,
    });
  };

  const handleWeekStartChange = (val: WeekStartDay) => {
    setWeekStart(val);
    onUpdateSettings({
      nonCollegiateThreshold: nonCollegiate,
      disCollegiateThreshold: disCollegiate,
      weekStartDay: val,
    });
  };

  return (
    <div className="space-y-4 font-sans animate-fade-in pb-12">
      
      {/* Header */}
      <div className="glass-card p-4 rounded-2xl border border-zinc-200/80 bg-white">
        <h2 className="text-lg font-black text-zinc-900 tracking-tight font-outfit">
          Settings & University Rules
        </h2>
        <p className="text-xs text-zinc-500 font-semibold mt-0.5">
          Live instant criteria sliders & app data management
        </p>
      </div>

      {/* University Collegiate Thresholds Form Card */}
      <div className="glass-card p-4 rounded-2xl border border-zinc-200/80 bg-white space-y-4">
        <div className="flex items-center space-x-2.5 border-b border-zinc-100 pb-2.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-black text-zinc-900 uppercase tracking-wider">
              University Collegiate Thresholds
            </h3>
            <p className="text-[10px] text-zinc-500 font-semibold">
              Adjust sliders & options for live instant application
            </p>
          </div>
        </div>

        <div className="space-y-4 pt-1">
          {/* Week Start Day Setting - 7 Days Selector */}
          <div className="space-y-1.5 bg-zinc-50/80 p-3 rounded-2xl border border-zinc-200/60">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black text-zinc-700 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-indigo-600" /> Start Day of the Week
              </label>
              <span className="text-xs font-black text-indigo-700 font-outfit uppercase bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                {weekStart}
              </span>
            </div>

            {/* 7 Days Grid Pill Buttons */}
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-1 pt-1">
              {ALL_DAYS.map((day) => (
                <button
                  key={day.id}
                  type="button"
                  onClick={() => handleWeekStartChange(day.id)}
                  className={`py-1.5 px-1 text-[10.5px] font-extrabold rounded-xl transition-all border cursor-pointer text-center ${
                    weekStart === day.id
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                      : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-100'
                  }`}
                  title={day.label}
                >
                  {day.short}
                </button>
              ))}
            </div>

            <p className="text-[9.5px] text-zinc-400 font-medium pt-0.5">
              Sets the starting day for weekly attendance calculations & graphs.
            </p>
          </div>

          {/* Non-Collegiate Slider */}
          <div className="space-y-1.5 bg-amber-50/50 p-3 rounded-2xl border border-amber-200/50">
            <div className="flex justify-between items-center pl-1">
              <label className="text-[10px] font-black text-amber-800 uppercase tracking-wider flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Non-Collegiate Cutoff
              </label>
              <span className="text-xs font-black text-amber-800 font-outfit bg-white px-2 py-0.5 rounded border border-amber-300 shadow-2xs">
                Below {nonCollegiate}%
              </span>
            </div>

            <input
              type="range"
              min="30"
              max="95"
              step="1"
              value={nonCollegiate}
              onChange={(e) => handleNonCollegiateChange(Number(e.target.value))}
              className="w-full h-2 bg-amber-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
            />

            <div className="flex justify-between text-[9px] font-bold text-amber-600 px-1">
              <span>30%</span>
              <span>75% (Default)</span>
              <span>95%</span>
            </div>

            <p className="text-[10px] text-amber-900 font-semibold leading-relaxed pt-1">
              • Attendance <strong className="font-black">&ge; {nonCollegiate}%</strong> = <span className="text-emerald-700 font-extrabold">COLLEGIATE (Safe)</span><br />
              • Attendance <strong className="font-black">below {nonCollegiate}%</strong> = <span className="text-amber-700 font-extrabold">NON-COLLEGIATE (Warning)</span>
            </p>
          </div>

          {/* Dis-Collegiate Slider */}
          <div className="space-y-1.5 bg-rose-50/50 p-3 rounded-2xl border border-rose-200/50">
            <div className="flex justify-between items-center pl-1">
              <label className="text-[10px] font-black text-rose-800 uppercase tracking-wider flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-rose-600" /> Dis-Collegiate Cutoff
              </label>
              <span className="text-xs font-black text-rose-800 font-outfit bg-white px-2 py-0.5 rounded border border-rose-300 shadow-2xs">
                Below {disCollegiate}%
              </span>
            </div>

            <input
              type="range"
              min="10"
              max="80"
              step="1"
              value={disCollegiate}
              onChange={(e) => handleDisCollegiateChange(Number(e.target.value))}
              className="w-full h-2 bg-rose-200 rounded-lg appearance-none cursor-pointer accent-rose-600"
            />

            <div className="flex justify-between text-[9px] font-bold text-rose-600 px-1">
              <span>10%</span>
              <span>50% (Default)</span>
              <span>80%</span>
            </div>

            <p className="text-[10px] text-rose-900 font-semibold leading-relaxed pt-1">
              • Attendance <strong className="font-black">below {disCollegiate}%</strong> = <span className="text-rose-700 font-extrabold">DIS-COLLEGIATE (Debarred)</span>
            </p>
          </div>

          <div className="p-2.5 bg-indigo-50/70 border border-indigo-200/60 rounded-xl text-[10.5px] font-bold text-indigo-800 flex items-center justify-between">
            <span>✨ Live auto-save active. Criteria updates instantly!</span>
          </div>
        </div>
      </div>

      {/* PWA Install Card */}
      <div className="glass-card p-4 rounded-2xl border border-indigo-200/60 bg-gradient-to-br from-indigo-50/50 via-white to-white space-y-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20 shrink-0">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-black text-zinc-900 uppercase tracking-wider">
              Homescreen App Installation
            </h3>
            <p className="text-[11px] text-zinc-500 font-semibold leading-snug">
              Install Attendly as a native mobile app on iOS or Android.
            </p>
          </div>
        </div>

        {canInstallPwa ? (
          <button
            onClick={onInstallPwa}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20 transition-all cursor-pointer flex items-center justify-center space-x-2"
          >
            <Smartphone className="w-4 h-4" />
            <span>Install App on Homescreen</span>
          </button>
        ) : (
          <div className="flex items-center space-x-2 p-2.5 bg-emerald-50 border border-emerald-200/50 rounded-xl text-emerald-800 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>PWA Ready / App Installed & Offline Enabled</span>
          </div>
        )}
      </div>

      {/* Local Data Storage Card */}
      <div className="glass-card p-4 rounded-2xl border border-zinc-200/80 bg-white space-y-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-zinc-100 border border-zinc-200 text-zinc-700 flex items-center justify-center shrink-0">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-black text-zinc-900 uppercase tracking-wider">
              LocalStorage Database
            </h3>
            <p className="text-[11px] text-zinc-500 font-semibold">
              Currently storing {courses.length} courses with full offline history.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            onClick={onOpenExportImport}
            className="py-2.5 px-3 bg-white hover:bg-zinc-50 border border-zinc-200 text-zinc-700 font-bold text-xs rounded-xl shadow-2xs transition-all cursor-pointer flex items-center justify-center space-x-1.5"
          >
            <Download className="w-4 h-4 text-indigo-600" />
            <span>Backup / Restore</span>
          </button>

          <button
            onClick={onResetData}
            className="py-2.5 px-3 bg-white hover:bg-rose-50 border border-zinc-200 hover:border-rose-200 text-rose-600 font-bold text-xs rounded-xl shadow-2xs transition-all cursor-pointer flex items-center justify-center space-x-1.5"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reset Demo</span>
          </button>
        </div>
      </div>

    </div>
  );
};
