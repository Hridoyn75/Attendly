import { Course, CollegiateStatus, CollegiateSettings, WeekStartDay, AttendanceRecord } from '../types/attendance';

export interface CourseStats {
  present: number;
  absent: number;
  total: number;
  percentage: number;
  collegiateStatus: CollegiateStatus;
  safeBunkCount: number;
  requiredAttendForCollegiate: number;
  requiredAttendForNonCollegiate: number;
  nonCollegiateThreshold: number;
  disCollegiateThreshold: number;
}

export function computeCourseStats(
  course: Course,
  settings: CollegiateSettings = { nonCollegiateThreshold: 75, disCollegiateThreshold: 50, weekStartDay: 'sunday' }
): CourseStats {
  const present = course.records.filter((r) => r.status === 'present').length;
  const absent = course.records.filter((r) => r.status === 'absent').length;
  const total = present + absent;
  
  const targetCollegiate = settings.nonCollegiateThreshold || 75;
  const targetNonCollegiate = settings.disCollegiateThreshold || 50;

  const percentage = total > 0 ? Math.round((present / total) * 1000) / 10 : 100;

  let collegiateStatus: CollegiateStatus = 'collegiate';
  if (total > 0) {
    if (percentage >= targetCollegiate) {
      collegiateStatus = 'collegiate';
    } else if (percentage >= targetNonCollegiate) {
      collegiateStatus = 'non-collegiate';
    } else {
      collegiateStatus = 'dis-collegiate';
    }
  }

  let safeBunkCount = 0;
  if (total > 0 && percentage >= targetCollegiate && targetCollegiate > 0) {
    const maxTotal = (present * 100) / targetCollegiate;
    safeBunkCount = Math.max(0, Math.floor(maxTotal - total));
  }

  let requiredAttendForCollegiate = 0;
  if (total > 0 && percentage < targetCollegiate && targetCollegiate < 100) {
    const numerator = targetCollegiate * total - 100 * present;
    const denominator = 100 - targetCollegiate;
    requiredAttendForCollegiate = Math.max(0, Math.ceil(numerator / denominator));
  }

  let requiredAttendForNonCollegiate = 0;
  if (total > 0 && percentage < targetNonCollegiate && targetNonCollegiate < 100) {
    const numerator = targetNonCollegiate * total - 100 * present;
    const denominator = 100 - targetNonCollegiate;
    requiredAttendForNonCollegiate = Math.max(0, Math.ceil(numerator / denominator));
  }

  return {
    present,
    absent,
    total,
    percentage,
    collegiateStatus,
    safeBunkCount,
    requiredAttendForCollegiate,
    requiredAttendForNonCollegiate,
    nonCollegiateThreshold: targetCollegiate,
    disCollegiateThreshold: targetNonCollegiate,
  };
}

export interface SemesterStats {
  totalCourses: number;
  overallPresent: number;
  overallAbsent: number;
  overallTotal: number;
  overallPercentage: number;
  collegiateCount: number;
  nonCollegiateCount: number;
  disCollegiateCount: number;
}

export function computeSemesterStats(
  courses: Course[],
  settings: CollegiateSettings = { nonCollegiateThreshold: 75, disCollegiateThreshold: 50, weekStartDay: 'sunday' }
): SemesterStats {
  let overallPresent = 0;
  let overallAbsent = 0;
  let collegiateCount = 0;
  let nonCollegiateCount = 0;
  let disCollegiateCount = 0;

  courses.forEach((course) => {
    const stats = computeCourseStats(course, settings);
    overallPresent += stats.present;
    overallAbsent += stats.absent;

    if (stats.collegiateStatus === 'collegiate') {
      collegiateCount++;
    } else if (stats.collegiateStatus === 'non-collegiate') {
      nonCollegiateCount++;
    } else {
      disCollegiateCount++;
    }
  });

  const overallTotal = overallPresent + overallAbsent;
  const overallPercentage =
    overallTotal > 0 ? Math.round((overallPresent / overallTotal) * 1000) / 10 : 100;

  return {
    totalCourses: courses.length,
    overallPresent,
    overallAbsent,
    overallTotal,
    overallPercentage,
    collegiateCount,
    nonCollegiateCount,
    disCollegiateCount,
  };
}

// Helpers for Week & Month date filtering
export function getWeekStart(d: Date, weekStartDay: WeekStartDay): Date {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  const day = date.getDay(); // 0: Sun, 1: Mon, ... 6: Sat

  const map: Record<WeekStartDay, number> = {
    sunday: 0,
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
  };

  const targetDay = map[weekStartDay] ?? 0;
  const diff = (day < targetDay ? 7 : 0) + day - targetDay;
  date.setDate(date.getDate() - diff);
  return date;
}

export function filterRecordsByPeriod(
  records: AttendanceRecord[],
  timeframe: 'week' | 'month' | 'all',
  weekStartDay: WeekStartDay
): AttendanceRecord[] {
  if (timeframe === 'all') return records;

  const now = new Date();

  if (timeframe === 'week') {
    const weekStart = getWeekStart(now, weekStartDay);
    return records.filter((r) => new Date(r.date) >= weekStart);
  }

  if (timeframe === 'month') {
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    return records.filter((r) => new Date(r.date) >= monthStart);
  }

  return records;
}

export function computeTimeframeSemesterStats(
  courses: Course[],
  timeframe: 'week' | 'month' | 'all',
  settings: CollegiateSettings
) {
  let present = 0;
  let absent = 0;

  courses.forEach((course) => {
    const filtered = filterRecordsByPeriod(course.records, timeframe, settings.weekStartDay);
    filtered.forEach((r) => {
      if (r.status === 'present') present++;
      if (r.status === 'absent') absent++;
    });
  });

  const total = present + absent;
  const percentage = total > 0 ? Math.round((present / total) * 1000) / 10 : 100;

  return { present, absent, total, percentage };
}

export interface TrendPoint {
  label: string;
  present: number;
  absent: number;
  total: number;
  percentage: number;
}

export function getWeeklyTrendData(courses: Course[], weekStartDay: WeekStartDay): TrendPoint[] {
  const result: TrendPoint[] = [];
  const now = new Date();
  const currentWeekStart = getWeekStart(now, weekStartDay);

  // Get last 5 weeks + current week (total 6 weeks)
  for (let i = 5; i >= 0; i--) {
    const start = new Date(currentWeekStart);
    start.setDate(start.getDate() - i * 7);

    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    end.setHours(23, 59, 59, 999);

    let present = 0;
    let absent = 0;

    courses.forEach((course) => {
      course.records.forEach((r) => {
        const rDate = new Date(r.date);
        if (rDate >= start && rDate <= end) {
          if (r.status === 'present') present++;
          if (r.status === 'absent') absent++;
        }
      });
    });

    const total = present + absent;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

    const label = i === 0 ? 'This Wk' : `Wk -${i}`;
    result.push({ label, present, absent, total, percentage });
  }

  return result;
}

export function getMonthlyTrendData(courses: Course[]): TrendPoint[] {
  const result: TrendPoint[] = [];
  const now = new Date();

  // Get last 5 months + current month (total 6 months)
  for (let i = 5; i >= 0; i--) {
    const targetMonth = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = targetMonth.getFullYear();
    const month = targetMonth.getMonth();

    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0, 23, 59, 59, 999);

    let present = 0;
    let absent = 0;

    courses.forEach((course) => {
      course.records.forEach((r) => {
        const rDate = new Date(r.date);
        if (rDate >= start && rDate <= end) {
          if (r.status === 'present') present++;
          if (r.status === 'absent') absent++;
        }
      });
    });

    const total = present + absent;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

    const label = targetMonth.toLocaleString('default', { month: 'short' });
    result.push({ label, present, absent, total, percentage });
  }

  return result;
}
