// types/patient.ts
export type VitalStatus = 'stable' | 'watch' | 'critical';

export interface Vitals {
  hr:   number; // bpm
  spo2: number; // %
  sbp:  number; // mmHg systolic
  dbp:  number; // mmHg diastolic
  rr:   number; // /min
  temp: number; // °C
}

export interface VitalHistory {
  hr:   number[];
  spo2: number[];
  sbp:  number[];
  rr:   number[];
  temp: number[];
}

export interface VisitingInfo {
  isOpen: boolean;
  currentWindow: string;
  nextWindow: string;
  maxVisitors: number;
  rules: string;
}

export type ScheduleCategory = 'medicine' | 'visiting' | 'sleep' | 'meal' | 'doctor_rounds' | 'vitals_check';
export type ScheduleStatus = 'completed' | 'in_progress' | 'upcoming';

export interface ScheduleItem {
  id: string;
  time: string;           // e.g. '08:00 AM'
  endTime?: string;       // e.g. '01:00 PM'
  title: string;          // e.g. 'Morning Antibiotic & Heart Dose'
  category: ScheduleCategory;
  status: ScheduleStatus;
  description: string;
  assignedTo: string;     // e.g. 'Staff 1', 'Doctor 1', 'Family'
}

export interface DailyReport {
  id: string;
  dayNumber: number;      // e.g. Day 1, Day 2, Day 3
  reportDate: string;     // e.g. '05 Sep 2026'
  createdAt: string;      // e.g. '06:00 AM Daily Review'
  summary: string;
  vitalsAverage: {
    avgHr: number;
    avgSpo2: number;
    avgBp: string;
    avgTemp: number;
  };
  fluidBalance: {
    intakeMl: number;
    outputMl: number;
  };
  medicationsAdministered: string[];
  clinicalEvaluation: string;
  doctorSignOff: string;  // e.g. 'Doctor 1 (Chief ICU Specialist)'
  status: 'improving' | 'stable' | 'needs_attention';
}

export interface PatientMessage {
  id: string;
  patientId: number;
  senderRole: 'doctor' | 'staff' | 'family';
  senderName: string;
  senderBadge: string;
  avatar: string;
  timestamp: string;
  text: string;
  replyToId?: string;
  replyToSender?: string;
  replyToText?: string;
}

export interface FamilyMessage {
  id: string;
  sender: string;         // e.g. 'Family Member'
  timestamp: string;      // e.g. 'Today, 11:15 AM'
  message: string;
  reply?: string;
  replyBy?: string;       // e.g. 'Staff 1' or 'Doctor 1'
  replyTime?: string;
}

export interface ShiftHandoff {
  id: string;
  shift: string;          // e.g. 'Morning to Evening Handoff'
  timestamp: string;      // e.g. 'Today, 02:00 PM'
  doctorNote: string;
  nurseNote: string;
  outgoingStaff: string;
  incomingStaff: string;
}

export interface Patient {
  id:               number;
  name:             string;
  bed:              string;
  age:              number;
  diagnosis:        string;
  admitDate:        string;          // e.g. '28 Aug 2026, 09:30 AM'
  expectedExitDate: string;          // e.g. '12 Sep 2026 (6 days remaining)'
  operationDate?:   string;          // e.g. '30 Aug 2026, 11:15 AM'
  operationName?:   string;          // e.g. 'Heart Valve Repair'
  operationStatus:  string;          // e.g. 'Completed Successfully · Healing Steady'
  visitingHours:    VisitingInfo;
  dietStatus:       string;          // e.g. 'Light recovery broth & electrolyte fluids'
  medications:      string[];        // e.g. ['Cefazolin 1g IV', 'Morphine 2mg', 'Normal Saline']
  careSummary:      string;          // High level doctor summary
  schedule:         ScheduleItem[];
  dailyReports:     DailyReport[];
  familyMessages:   FamilyMessage[];
  shiftHandoffs:    ShiftHandoff[];
  vitals:           Vitals;
  history:          VitalHistory;
  devices:          import('./device').Device[];
  mlScore:          number;          // 0–100 advisory only
  lastUpdate:       number;          // Date.now()
}
