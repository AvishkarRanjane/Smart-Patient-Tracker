// utils/constants.ts
import type { Thresholds } from '../types/threshold';
import type { Device } from '../types/device';

export const DEFAULT_THRESHOLDS: Thresholds = {
  hrLow:    50,
  hrHigh:   120,
  spo2Min:  90,
  sbpHigh:  150,
  rrHigh:   26,
  tempHigh: 38.4,
};

// Easy-to-understand vital indicator descriptions
export const VITAL_LOINC: Record<string, string> = {
  hr:   'Normal: 60–100 bpm',
  spo2: 'Normal: 95–100%',
  sbp:  'Normal: 90–140 mmHg',
  rr:   'Normal: 12–20 /min',
  temp: 'Normal: 36.1–37.8 °C',
};

export const VITAL_LABELS: Record<string, string> = {
  hr:   'Heart Rate',
  spo2: 'Oxygen (SpO₂)',
  sbp:  'Blood Pressure',
  rr:   'Breathing Rate',
  temp: 'Temperature',
};

export const VITAL_UNITS: Record<string, string> = {
  hr:   'bpm',
  spo2: '%',
  sbp:  'mmHg',
  rr:   '/min',
  temp: '°C',
};

export const VITAL_RANGES: Record<string, string> = {
  hr:   '60–100 normal',
  spo2: '≥95% healthy',
  sbp:  '90–140 normal',
  rr:   '12–20 normal',
  temp: '36.1–37.8 °C normal',
};

export const VITAL_COLORS: Record<string, string> = {
  hr:   '#4C8DFF',
  spo2: '#2FBD85',
  sbp:  '#8C7CF0',
  rr:   '#F5A93F',
  temp: '#FF5C6C',
};

// Simulated device catalogue with easy-to-read names and live telemetry
export const DEVICE_CATALOGUE: Device[] = [
  {
    id: 'dev-1',
    name: 'Bedside Heart Monitor',
    proto: 'Wireless Live Sync',
    reads: 'Heart Rate, Breathing',
    fw: 'v4.2.1',
    trust: 'trusted',
    telemetry: {
      oxygenFlow: 2.0,
      airwayPressure: 14,
      batteryLevel: 98,
      mapBloodPressure: 93,
      perfusionIndex: 4.8,
      pulseRate: 78,
      signalQuality: 'Excellent · 99%',
      lastCalibrated: 'Today, 06:00 AM',
      serialNumber: 'SN-MX750-8842',
      operatingMode: 'Continuous Cardiac Monitor',
    },
  },
  {
    id: 'dev-2',
    name: 'Blood Pressure Tracker',
    proto: 'Automated Cuff Link',
    reads: 'Blood Pressure, Temp',
    fw: 'v3.8.0',
    trust: 'trusted',
    telemetry: {
      mapBloodPressure: 92,
      batteryLevel: 95,
      signalQuality: 'Strong · 97%',
      lastCalibrated: 'Today, 07:15 AM',
      serialNumber: 'SN-BP650-1049',
      operatingMode: 'Interval NIBP Auto-Cycle (Every 15 min)',
    },
  },
  {
    id: 'dev-3',
    name: 'Breathing Assistant (Ventilator)',
    proto: 'Oxygen Flow Sync',
    reads: 'Oxygen Flow, Airway Pressure, PEEP',
    fw: 'v2.1.0',
    trust: 'advisory',
    advisory: 'Routine checkup scheduled soon. Working safely under Doctor 1 supervision.',
    telemetry: {
      oxygenFlow: 5.5,          // L/min live flow rate
      tidalVolume: 460,         // mL
      peepPressure: 6,          // cmH2O
      fio2: 42,                 // %
      airwayPressure: 18,       // cmH2O
      batteryLevel: 100,
      signalQuality: 'Good · 94%',
      lastCalibrated: 'Yesterday, 10:00 PM',
      serialNumber: 'SN-SV800-4412',
      operatingMode: 'Pressure Support / CPAP Mode',
    },
  },
  {
    id: 'dev-4',
    name: 'Pulse & Oxygen Sensor',
    proto: 'Continuous Finger Sensor',
    reads: 'Oxygen Level, Pulse Rate, Perfusion',
    fw: 'v5.0.2',
    trust: 'trusted',
    telemetry: {
      oxygenFlow: 2.5,
      perfusionIndex: 5.1,
      batteryLevel: 91,
      signalQuality: 'Excellent · 100%',
      lastCalibrated: 'Today, 05:45 AM',
      serialNumber: 'SN-RAD7-9021',
      operatingMode: 'Continuous Pulse Oximetry',
    },
  },
  {
    id: 'dev-5',
    name: 'Multi-Vital Care Screen',
    proto: 'Direct Ward Link',
    reads: 'Heart, Oxygen, BP, Temperature',
    fw: 'v6.3.0',
    trust: 'trusted',
    telemetry: {
      oxygenFlow: 3.0,
      airwayPressure: 15,
      mapBloodPressure: 90,
      batteryLevel: 100,
      perfusionIndex: 4.4,
      signalQuality: 'Excellent · 99%',
      lastCalibrated: 'Today, 06:30 AM',
      serialNumber: 'SN-DELTA-7731',
      operatingMode: 'Full Multi-Parameter ICU Hub',
    },
  },
  {
    id: 'dev-6',
    name: 'Backup Vital Reader',
    proto: 'Secondary Monitor',
    reads: 'Pulse & Oxygen',
    fw: 'v1.4.0',
    trust: 'compromised',
    advisory: 'Checked and paused for safety verification by Doctor 1.',
    telemetry: {
      oxygenFlow: 0,
      batteryLevel: 84,
      signalQuality: 'Paused · Diagnostic State',
      lastCalibrated: '3 Days Ago',
      serialNumber: 'SN-CMS-0092',
      operatingMode: 'Standby / Diagnostic Test Mode',
    },
  },
];

export const PATIENT_NAMES     = ['Person 1', 'Person 2', 'Person 3', 'Person 4', 'Person 5', 'Person 6'];
export const PATIENT_DIAGNOSES = [
  'Heart Recovery Care',
  'Breathing Support',
  'Post-Surgery Rest',
  'General Health Check',
  'Accident Recovery',
  'Comfort & Healing Care',
];
export const PATIENT_AGES      = [54, 67, 43, 71, 38, 62];
