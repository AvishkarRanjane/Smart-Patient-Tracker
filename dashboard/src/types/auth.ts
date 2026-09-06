// types/auth.ts
export type UserRole = 'doctor' | 'staff' | 'family';

export type Permission =
  | 'VIEW_ALL_PATIENTS'
  | 'VIEW_SINGLE_PATIENT'
  | 'EDIT_PATIENT_CELLS'
  | 'MANAGE_WARDS_AND_BEDS'
  | 'ACKNOWLEDGE_ALERTS'
  | 'VIEW_DEVICE_TELEMETRY'
  | 'CONTROL_DEVICES'
  | 'VIEW_TRENDS'
  | 'MANAGE_SETTINGS'
  | 'SEND_MESSAGES'
  | 'EMERGENCY_BROADCAST'
  | 'GENERATE_REPORTS';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  roleTitle: string;
  shift: string;
  initials: string;
  patientId?: number; // strictly for family users (0 to 5)
  permissions: Permission[];
}

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  doctor: [
    'VIEW_ALL_PATIENTS',
    'EDIT_PATIENT_CELLS',
    'MANAGE_WARDS_AND_BEDS',
    'ACKNOWLEDGE_ALERTS',
    'VIEW_DEVICE_TELEMETRY',
    'CONTROL_DEVICES',
    'VIEW_TRENDS',
    'MANAGE_SETTINGS',
    'SEND_MESSAGES',
    'EMERGENCY_BROADCAST',
    'GENERATE_REPORTS',
  ],
  staff: [
    'VIEW_ALL_PATIENTS',
    'EDIT_PATIENT_CELLS',
    'MANAGE_WARDS_AND_BEDS',
    'ACKNOWLEDGE_ALERTS',
    'VIEW_DEVICE_TELEMETRY',
    'VIEW_TRENDS',
    'SEND_MESSAGES',
    'EMERGENCY_BROADCAST',
    'GENERATE_REPORTS',
  ],
  family: [
    'VIEW_SINGLE_PATIENT',
    'SEND_MESSAGES',
  ],
};
