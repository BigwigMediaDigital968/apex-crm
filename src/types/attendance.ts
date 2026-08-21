import type { Role } from "./auth";

export const ATTENDANCE_STATUS = {
    PRESENT: "present",
    LATE: "late",
    HALF_DAY: "half_day",
    ABSENT: "absent",
    ON_LEAVE: "on_leave",
} as const;

export type AttendanceStatus =
    (typeof ATTENDANCE_STATUS)[keyof typeof ATTENDANCE_STATUS];

export const ATTENDANCE_STATUS_LABELS: Record<AttendanceStatus, string> = {
  present: "Present",
  late: "Late",
  half_day: "Half Day",
  absent: "Absent",
  on_leave: "On Leave",
};

export const ATTENDANCE_WORK_MODE = {
    WFO: "wfo",
    WFH: "wfh",
} as const;

export type AttendanceWorkMode =
    (typeof ATTENDANCE_WORK_MODE)[keyof typeof ATTENDANCE_WORK_MODE];

export const ATTENDANCE_WORK_MODE_LABELS: Record<AttendanceWorkMode, string> = {
  wfo: "Office",
  wfh: "Remote",
};

export const ATTENDANCE_EVENT = {
    CHECK_IN: "check_in",
    CHECK_OUT: "check_out",
} as const;

export type AttendanceEvent =
    (typeof ATTENDANCE_EVENT)[keyof typeof ATTENDANCE_EVENT];

export interface AttendanceEmployeeRef {
  _id: string;
  name: string;
  email: string;
  role: Role;
}

export interface AttendanceBranchRef {
  _id: string;
  name: string;
  code: string;
}

export interface AttendanceRecord {
  _id: string;
  employee: AttendanceEmployeeRef | string;
  branch: AttendanceBranchRef | string;
  date: string;
  status: AttendanceStatus;
  workMode: AttendanceWorkMode;
  checkInAt?: string;
  checkOutAt?: string;
  checkInLatitude?: number;
  checkInLongitude?: number;
  checkOutLatitude?: number;
  checkOutLongitude?: number;
  checkInDistanceMeters?: number;
  checkOutDistanceMeters?: number;
  lateMinutes: number;
  earlyCheckoutMinutes: number;
  totalWorkingMinutes?: number;
  remarks?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CheckInPayload {
    latitude: string | number;
    longitude: string | number;
}

export interface CheckOutPayload {
    latitude: string | number;
    longitude: string | number;
}

export interface AttendanceQueryParams {
  employeeId?: string;
  branchId?: string;
  dateFrom?: string;
  dateTo?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface AttendanceReport {
  // Add the exact fields returned by getTeamAttendanceSummary
  totalEmployees?: number;
  present?: number;
  late?: number;
  absent?: number;
}




export interface AttendanceListQuery {
  date?: string;
  dateFrom?: string;
  dateTo?: string;
  employeeId?: string;
  branchId?: string;
  status?: AttendanceStatus | "";
  workMode?: AttendanceWorkMode | "";
  page?: number;
  limit?: number;
}

export interface AttendancePagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AttendanceListData {
  records: AttendanceRecord[];
  pagination: AttendancePagination;
}

export interface AttendanceSummaryRow {
  employeeId: string;
  name: string;
  email: string;
  totalDays: number;
  presentDays: number;
  lateDays: number;
  absentDays: number;
  leaveDays: number;
  totalWorkingMinutes: number;
  attendancePercentage: number;
}

export interface AttendanceReportQuery {
  dateFrom: string;
  dateTo: string;
  branchId?: string;
  employeeId?: string;
}