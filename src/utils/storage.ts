import { Course, CollegiateSettings } from '../types/attendance';

const COURSES_STORAGE_KEY = 'semester_attendance_courses_v1';
const SETTINGS_STORAGE_KEY = 'semester_collegiate_settings_v1';

export const DEFAULT_COLLEGIATE_SETTINGS: CollegiateSettings = {
  nonCollegiateThreshold: 75,
  disCollegiateThreshold: 50,
  weekStartDay: 'sunday',
};

export const DEFAULT_SAMPLE_COURSES: Course[] = [];

export function loadCoursesFromStorage(): Course[] {
  try {
    const raw = localStorage.getItem(COURSES_STORAGE_KEY);
    if (!raw) {
      saveCoursesToStorage([]);
      return [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (error) {
    console.error('Failed to load courses from localStorage:', error);
    return [];
  }
}

export function saveCoursesToStorage(courses: Course[]): void {
  try {
    localStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(courses));
  } catch (error) {
    console.error('Failed to save courses to localStorage:', error);
  }
}

export function loadSettingsFromStorage(): CollegiateSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return DEFAULT_COLLEGIATE_SETTINGS;
    const parsed = JSON.parse(raw);
    return {
      nonCollegiateThreshold: parsed.nonCollegiateThreshold ?? 75,
      disCollegiateThreshold: parsed.disCollegiateThreshold ?? 50,
      weekStartDay: parsed.weekStartDay ?? 'sunday',
    };
  } catch {
    return DEFAULT_COLLEGIATE_SETTINGS;
  }
}

export function saveSettingsToStorage(settings: CollegiateSettings): void {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings to localStorage:', error);
  }
}

export function clearStorage(): void {
  localStorage.removeItem(COURSES_STORAGE_KEY);
  localStorage.removeItem(SETTINGS_STORAGE_KEY);
}
