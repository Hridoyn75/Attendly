import { Course, CollegiateStatus, CollegiateSettings } from '../types/attendance';

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
  settings: CollegiateSettings = { nonCollegiateThreshold: 75, disCollegiateThreshold: 50 }
): CourseStats {
  const present = course.records.filter((r) => r.status === 'present').length;
  const absent = course.records.filter((r) => r.status === 'absent').length;
  const total = present + absent;
  
  const targetCollegiate = settings.nonCollegiateThreshold || 75; // Below this is non-collegiate
  const targetNonCollegiate = settings.disCollegiateThreshold || 50; // Below this is dis-collegiate

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

  // Calculate Safe Bunks before dropping below Collegiate target
  let safeBunkCount = 0;
  if (total > 0 && percentage >= targetCollegiate && targetCollegiate > 0) {
    const maxTotal = (present * 100) / targetCollegiate;
    safeBunkCount = Math.max(0, Math.floor(maxTotal - total));
  }

  // Calculate Required Attends for Collegiate
  let requiredAttendForCollegiate = 0;
  if (total > 0 && percentage < targetCollegiate && targetCollegiate < 100) {
    const numerator = targetCollegiate * total - 100 * present;
    const denominator = 100 - targetCollegiate;
    requiredAttendForCollegiate = Math.max(0, Math.ceil(numerator / denominator));
  }

  // Calculate Required Attends for Non-Collegiate (escape Dis-Collegiate)
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
  settings: CollegiateSettings = { nonCollegiateThreshold: 75, disCollegiateThreshold: 50 }
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
