export type AttendanceStatus = 'present' | 'absent';

export type CollegiateStatus = 'collegiate' | 'non-collegiate' | 'dis-collegiate';

export type WeekStartDay =
  | 'sunday'
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday';

export interface AttendanceRecord {
  id: string;
  date: string; // ISO string (YYYY-MM-DD)
  status: AttendanceStatus;
  note?: string;
  timestamp: number; // Unix epoch ms
}

export interface Course {
  id: string;
  code: string; // e.g. "CS101"
  name: string; // e.g. "Data Structures & Algorithms"
  color: string; // Hex or Tailwind color token e.g. "indigo"
  records: AttendanceRecord[];
}

export interface CollegiateSettings {
  nonCollegiateThreshold: number; // Default 75%
  disCollegiateThreshold: number; // Default 50%
  weekStartDay: WeekStartDay; // Default 'sunday'
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}
