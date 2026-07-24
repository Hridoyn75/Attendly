import React, { useState, useEffect, useMemo } from 'react';
import { Course, AttendanceStatus, ToastNotification, CollegiateSettings } from './types/attendance';
import { loadCoursesFromStorage, saveCoursesToStorage, loadSettingsFromStorage, saveSettingsToStorage, DEFAULT_SAMPLE_COURSES } from './utils/storage';
import { computeSemesterStats, computeCourseStats, computeTimeframeSemesterStats } from './utils/calculations';
import { BottomNav } from './components/BottomNav';
import { CourseCard } from './components/CourseCard';
import { MarkAttendanceModal } from './components/MarkAttendanceModal';
import { AddCourseModal } from './components/AddCourseModal';
import { CourseHistoryModal } from './components/CourseHistoryModal';
import { ExportImportModal } from './components/ExportImportModal';
import { PwaSettingsView } from './components/PwaSettingsView';
import { AnalyticsCharts } from './components/AnalyticsCharts';
import { ToastItem } from './components/Toast';
import { Search, Plus, Sparkles, BookOpen, ShieldCheck, AlertTriangle, Flame } from 'lucide-react';

export function App() {
  const [courses, setCourses] = useState<Course[]>(() => loadCoursesFromStorage());
  const [settings, setSettings] = useState<CollegiateSettings>(() => loadSettingsFromStorage());
  
  const [activeTab, setActiveTab] = useState<'courses' | 'dashboard' | 'settings'>('courses');
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState<'all' | 'collegiate' | 'non-collegiate' | 'dis-collegiate'>('all');

  // Dashboard timeframe selector: 'week' | 'month' | 'all'
  const [dashboardTimeframe, setDashboardTimeframe] = useState<'week' | 'month' | 'all'>('all');

  // PWA Install Prompt event state
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [canInstallPwa, setCanInstallPwa] = useState(false);

  // Modals state
  const [markingCourse, setMarkingCourse] = useState<Course | null>(null);
  const [isQuickRecordOpen, setIsQuickRecordOpen] = useState(false);
  const [markingInitialStatus, setMarkingInitialStatus] = useState<AttendanceStatus>('present');
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const [historyCourse, setHistoryCourse] = useState<Course | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Sync courses to localStorage
  useEffect(() => {
    saveCoursesToStorage(courses);
  }, [courses]);

  // Sync settings to localStorage
  useEffect(() => {
    saveSettingsToStorage(settings);
  }, [settings]);

  // Listen for PWA Install Prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstallPwa(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallPwa = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setCanInstallPwa(false);
      addToast('success', 'PWA Installed', 'Attendance Tracker added to homescreen!');
    }
    setDeferredPrompt(null);
  };

  const addToast = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Compute overall semester stats
  const semesterStats = useMemo(() => computeSemesterStats(courses, settings), [courses, settings]);

  // Compute timeframe stats for dashboard (Week, Month, All)
  const timeframeStats = useMemo(
    () => computeTimeframeSemesterStats(courses, dashboardTimeframe, settings),
    [courses, dashboardTimeframe, settings]
  );

  // Filtered Courses
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch =
        course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (course.code && course.code.toLowerCase().includes(searchQuery.toLowerCase()));

      const stats = computeCourseStats(course, settings);
      if (courseFilter === 'collegiate') return matchesSearch && stats.collegiateStatus === 'collegiate';
      if (courseFilter === 'non-collegiate') return matchesSearch && stats.collegiateStatus === 'non-collegiate';
      if (courseFilter === 'dis-collegiate') return matchesSearch && stats.collegiateStatus === 'dis-collegiate';
      return matchesSearch;
    });
  }, [courses, searchQuery, courseFilter, settings]);

  // Handlers
  const handleOpenMarkAttendance = (course: Course, status: AttendanceStatus) => {
    setMarkingCourse(course);
    setMarkingInitialStatus(status);
  };

  const handleConfirmMarkAttendance = (
    courseId: string,
    status: AttendanceStatus,
    date: string,
    note?: string
  ) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id === courseId) {
          const newRecord = {
            id: Math.random().toString(36).substring(2, 9),
            date,
            status,
            note,
            timestamp: Date.now(),
          };
          return {
            ...c,
            records: [newRecord, ...c.records],
          };
        }
        return c;
      })
    );

    const targetCourse = courses.find((c) => c.id === courseId);
    addToast(
      'success',
      `Recorded ${status === 'present' ? 'Presence' : 'Absence'}`,
      `Logged for ${targetCourse?.name || 'course'} on ${date}`
    );
  };

  const handleSaveCourse = (courseData: Omit<Course, 'id' | 'records'>) => {
    if (editingCourse) {
      setCourses((prev) =>
        prev.map((c) => (c.id === editingCourse.id ? { ...c, ...courseData } : c))
      );
      addToast('success', 'Course Saved', `${courseData.name} updated.`);
      setEditingCourse(null);
    } else {
      const newCourse: Course = {
        id: `course-${Date.now()}`,
        ...courseData,
        records: [],
      };
      setCourses((prev) => [...prev, newCourse]);
      addToast('success', 'Course Created', `${courseData.name} added to semester.`);
    }
  };

  const handleDeleteCourse = (courseId: string) => {
    const target = courses.find((c) => c.id === courseId);
    if (!window.confirm(`Delete ${target?.name || 'this course'}?`)) return;

    setCourses((prev) => prev.filter((c) => c.id !== courseId));
    addToast('info', 'Course Removed', `${target?.name || 'Course'} was deleted.`);
  };

  const handleDeleteRecord = (courseId: string, recordId: string) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id === courseId) {
          return {
            ...c,
            records: c.records.filter((r) => r.id !== recordId),
          };
        }
        return c;
      })
    );

    if (historyCourse && historyCourse.id === courseId) {
      setHistoryCourse((prev) =>
        prev ? { ...prev, records: prev.records.filter((r) => r.id !== recordId) } : null
      );
    }

    addToast('info', 'Log Removed', 'Entry was deleted.');
  };

  const handleToggleRecordStatus = (courseId: string, recordId: string) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id === courseId) {
          const updatedRecords = c.records.map((r) =>
            r.id === recordId ? { ...r, status: (r.status === 'present' ? 'absent' : 'present') as AttendanceStatus } : r
          );
          return { ...c, records: updatedRecords };
        }
        return c;
      })
    );

    if (historyCourse && historyCourse.id === courseId) {
      setHistoryCourse((prev) =>
        prev
          ? {
              ...prev,
              records: prev.records.map((r) =>
                r.id === recordId ? { ...r, status: (r.status === 'present' ? 'absent' : 'present') as AttendanceStatus } : r
              ),
            }
          : null
      );
    }

    addToast('success', 'Status Toggled', 'Entry status updated.');
  };

  const handleResetData = () => {
    if (window.confirm('Reset and clear all semester courses?')) {
      setCourses([]);
      addToast('info', 'Reset Complete', 'Cleared all courses.');
    }
  };

  const handleImportCourses = (imported: Course[]) => {
    setCourses(imported);
    addToast('success', 'Data Restored', `Loaded ${imported.length} courses from JSON.`);
  };

  const handleUpdateSettings = (newSettings: CollegiateSettings) => {
    setSettings(newSettings);
  };

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-800 antialiased font-sans flex flex-col selection:bg-indigo-500 selection:text-white">
      
      {/* Mobile Shell Container */}
      <div className="w-full max-w-md mx-auto bg-zinc-50/95 min-h-screen flex flex-col relative shadow-xl border-x border-zinc-200/50 pb-20 pt-3">
        
        {/* Toast Notifications */}
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 w-full max-w-xs px-4 pointer-events-none">
          {toasts.map((t) => (
            <div key={t.id} className="pointer-events-auto">
              <ToastItem toast={t} onRemove={removeToast} />
            </div>
          ))}
        </div>

        {/* Main Content Pages */}
        <main className="flex-1 p-4 space-y-4">
          
          {/* DEFAULT HOME TAB: COURSES LIST ONLY */}
          {activeTab === 'courses' && (
            <div className="space-y-3 animate-fade-in">

              {/* Search Bar */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Search subject by name or code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-xs font-bold bg-white border border-zinc-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 rounded-2xl outline-none shadow-2xs transition-all"
                />
              </div>

              {/* University Collegiate Filter Tabs */}
              <div className="flex items-center space-x-1 bg-zinc-200/60 p-1 rounded-2xl border border-zinc-200 font-sans text-[11px]">
                <button
                  onClick={() => setCourseFilter('all')}
                  className={`flex-1 py-1.5 rounded-xl font-extrabold transition-all cursor-pointer ${
                    courseFilter === 'all' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-zinc-500'
                  }`}
                >
                  All ({courses.length})
                </button>
                <button
                  onClick={() => setCourseFilter('collegiate')}
                  className={`flex-1 py-1.5 rounded-xl font-extrabold transition-all cursor-pointer ${
                    courseFilter === 'collegiate' ? 'bg-white text-emerald-700 shadow-2xs' : 'text-zinc-500'
                  }`}
                >
                  Collegiate
                </button>
                <button
                  onClick={() => setCourseFilter('non-collegiate')}
                  className={`flex-1 py-1.5 rounded-xl font-extrabold transition-all cursor-pointer ${
                    courseFilter === 'non-collegiate' ? 'bg-white text-amber-700 shadow-2xs' : 'text-zinc-500'
                  }`}
                >
                  Non-Col.
                </button>
                <button
                  onClick={() => setCourseFilter('dis-collegiate')}
                  className={`flex-1 py-1.5 rounded-xl font-extrabold transition-all cursor-pointer ${
                    courseFilter === 'dis-collegiate' ? 'bg-white text-rose-700 shadow-2xs' : 'text-zinc-500'
                  }`}
                >
                  Dis-Col.
                </button>
              </div>

              {/* Course Cards List */}
              {courses.length === 0 ? (
                <div className="glass-card text-center py-14 px-5 rounded-3xl border border-dashed border-zinc-300 space-y-3 bg-white/70 font-sans">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mx-auto text-indigo-600">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-black text-zinc-900 font-outfit">No Courses Added Yet</h3>
                  <p className="text-xs text-zinc-500 max-w-xs mx-auto font-medium leading-relaxed">
                    Start tracking your semester by adding your enrolled subject courses.
                  </p>
                  <button
                    onClick={() => {
                      setEditingCourse(null);
                      setIsAddModalOpen(true);
                    }}
                    className="py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-600/20 transition-all cursor-pointer inline-flex items-center space-x-1.5 active:scale-95 mt-1"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>Add Your First Subject</span>
                  </button>
                </div>
              ) : filteredCourses.length === 0 ? (
                <div className="text-center py-12 px-4 rounded-3xl border border-dashed border-zinc-300 space-y-2 bg-white/60">
                  <BookOpen className="w-8 h-8 mx-auto text-zinc-300" />
                  <p className="text-xs font-semibold text-zinc-500">
                    {searchQuery ? `No courses matching "${searchQuery}".` : 'No courses in this status filter.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredCourses.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      settings={settings}
                      onMarkAttendance={handleOpenMarkAttendance}
                      onViewHistory={(c) => setHistoryCourse(c)}
                      onEditCourse={(c) => {
                        setEditingCourse(c);
                        setIsAddModalOpen(true);
                      }}
                      onDeleteCourse={handleDeleteCourse}
                    />
                  ))}
                </div>
              )}

            </div>
          )}

          {/* DEDICATED TAB 2: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-4 animate-fade-in">
              
              {/* Analytics Header Card */}
              <div className="glass-card p-5 rounded-3xl border border-zinc-200/80 bg-gradient-to-br from-white via-indigo-50/30 to-white shadow-xs space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-200/50 inline-flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Semester Analytics
                    </span>
                    <h2 className="text-xl font-black text-zinc-900 tracking-tight font-outfit mt-1">
                      Attendance Overview
                    </h2>
                  </div>

                  <button
                    onClick={() => {
                      setEditingCourse(null);
                      setIsAddModalOpen(true);
                    }}
                    className="py-1.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer flex items-center space-x-1 active:scale-95 shrink-0"
                    title="Create New Subject Course"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>Add Course</span>
                  </button>
                </div>

                {/* Timeframe Selector Pill (This Week / This Month / All Time) */}
                <div className="flex items-center space-x-1 bg-zinc-100 p-1 rounded-2xl border border-zinc-200/80 text-xs">
                  <button
                    onClick={() => setDashboardTimeframe('week')}
                    className={`flex-1 py-1.5 rounded-xl font-extrabold transition-all cursor-pointer ${
                      dashboardTimeframe === 'week' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-zinc-500'
                    }`}
                  >
                    This Week
                  </button>
                  <button
                    onClick={() => setDashboardTimeframe('month')}
                    className={`flex-1 py-1.5 rounded-xl font-extrabold transition-all cursor-pointer ${
                      dashboardTimeframe === 'month' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-zinc-500'
                    }`}
                  >
                    This Month
                  </button>
                  <button
                    onClick={() => setDashboardTimeframe('all')}
                    className={`flex-1 py-1.5 rounded-xl font-extrabold transition-all cursor-pointer ${
                      dashboardTimeframe === 'all' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-zinc-500'
                    }`}
                  >
                    Semester
                  </button>
                </div>

                <div className="flex justify-between items-center pt-1 border-t border-zinc-100">
                  <span className="text-xs font-bold text-zinc-500">
                    {dashboardTimeframe === 'week' ? 'This Week Rate' : dashboardTimeframe === 'month' ? 'This Month Rate' : 'Overall Semester Rate'}
                  </span>
                  <span
                    className={`text-2xl font-black font-outfit ${
                      timeframeStats.percentage >= settings.nonCollegiateThreshold ? 'text-indigo-600' : 'text-rose-600'
                    }`}
                  >
                    {timeframeStats.percentage}%
                  </span>
                </div>

                {/* Metric Pills */}
                <div className="grid grid-cols-2 gap-2 text-center font-sans">
                  <div className="p-2.5 bg-emerald-50/70 border border-emerald-200/50 rounded-2xl">
                    <span className="text-[9px] font-black text-emerald-700 uppercase tracking-wider block">Presences</span>
                    <span className="text-lg font-black text-emerald-700 font-outfit">{timeframeStats.present}</span>
                  </div>
                  <div className="p-2.5 bg-rose-50/70 border border-rose-200/50 rounded-2xl">
                    <span className="text-[9px] font-black text-rose-700 uppercase tracking-wider block">Absences</span>
                    <span className="text-lg font-black text-rose-700 font-outfit">{timeframeStats.absent}</span>
                  </div>
                </div>
              </div>

              {/* Visual SVG Graphs & Charts */}
              <AnalyticsCharts courses={courses} settings={settings} timeframe={dashboardTimeframe} />

              {/* University Collegiate Breakdown */}
              <div className="glass-card p-4 rounded-2xl border border-zinc-200/80 bg-white space-y-3 font-sans">
                <h3 className="text-xs font-black text-zinc-800 uppercase tracking-wider">
                  Collegiate Status Summary
                </h3>

                <div className="space-y-2 text-xs font-semibold">
                  {/* Collegiate Count */}
                  <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200/60 rounded-xl">
                    <div className="flex items-center space-x-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span className="font-extrabold text-emerald-900">Collegiate (&ge; {settings.nonCollegiateThreshold}%)</span>
                    </div>
                    <span className="font-black text-emerald-700 font-outfit text-sm">{semesterStats.collegiateCount} Subjects</span>
                  </div>

                  {/* Non-Collegiate Count */}
                  <div className="flex items-center justify-between p-2.5 bg-amber-50 border border-amber-200/60 rounded-xl">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      <span className="font-extrabold text-amber-900">Non-Collegiate ({settings.disCollegiateThreshold}% - {settings.nonCollegiateThreshold - 1}%)</span>
                    </div>
                    <span className="font-black text-amber-700 font-outfit text-sm">{semesterStats.nonCollegiateCount} Subjects</span>
                  </div>

                  {/* Dis-Collegiate Count */}
                  <div className="flex items-center justify-between p-2.5 bg-rose-50 border border-rose-200/60 rounded-xl">
                    <div className="flex items-center space-x-2">
                      <Flame className="w-4 h-4 text-rose-600" />
                      <span className="font-extrabold text-rose-900">Dis-Collegiate (&lt; {settings.disCollegiateThreshold}%)</span>
                    </div>
                    <span className="font-black text-rose-700 font-outfit text-sm">{semesterStats.disCollegiateCount} Subjects</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: SETTINGS & PWA */}
          {activeTab === 'settings' && (
            <PwaSettingsView
              courses={courses}
              settings={settings}
              canInstallPwa={canInstallPwa}
              onUpdateSettings={handleUpdateSettings}
              onInstallPwa={handleInstallPwa}
              onOpenExportImport={() => setIsExportOpen(true)}
              onResetData={handleResetData}
            />
          )}

        </main>

        {/* Native Mobile Bottom Navigation Bar */}
        <BottomNav
          activeTab={activeTab}
          onSelectTab={setActiveTab}
        />

        {/* Modals & Action Sheets */}
        <MarkAttendanceModal
          isOpen={markingCourse !== null}
          course={markingCourse}
          courses={courses}
          initialStatus={markingInitialStatus}
          onClose={() => setMarkingCourse(null)}
          onConfirm={handleConfirmMarkAttendance}
        />

        <MarkAttendanceModal
          isOpen={isQuickRecordOpen}
          course={null}
          courses={courses}
          initialStatus="present"
          onClose={() => setIsQuickRecordOpen(false)}
          onConfirm={handleConfirmMarkAttendance}
        />

        <AddCourseModal
          isOpen={isAddModalOpen}
          editingCourse={editingCourse}
          onClose={() => {
            setIsAddModalOpen(false);
            setEditingCourse(null);
          }}
          onSave={handleSaveCourse}
        />

        <CourseHistoryModal
          course={historyCourse}
          onClose={() => setHistoryCourse(null)}
          onDeleteRecord={handleDeleteRecord}
          onToggleRecordStatus={handleToggleRecordStatus}
        />

        <ExportImportModal
          isOpen={isExportOpen}
          courses={courses}
          onClose={() => setIsExportOpen(false)}
          onImportCourses={handleImportCourses}
        />

      </div>
    </div>
  );
}
