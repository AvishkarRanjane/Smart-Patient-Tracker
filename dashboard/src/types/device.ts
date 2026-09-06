// types/device.ts
export type TrustStatus = 'trusted' | 'advisory' | 'compromised';

export interface DeviceTelemetry {
  oxygenFlow?: number;       // Oxygen Flow in L/min
  tidalVolume?: number;      // Tidal volume in mL
  peepPressure?: number;     // PEEP pressure in cmH2O
  fio2?: number;             // FiO2 in %
  airwayPressure?: number;   // Airway pressure in cmH2O
  batteryLevel?: number;     // Battery in %
  perfusionIndex?: number;   // Perfusion index in %
  mapBloodPressure?: number; // Mean Arterial Pressure in mmHg
  pulseRate?: number;        // Pulse Rate in bpm
  signalQuality?: string;    // Signal quality string
  lastCalibrated?: string;   // Last calibration time
  serialNumber?: string;     // Hardware serial number
  operatingMode?: string;    // Device operating mode
}

export interface Device {
  id?: string;
  name:     string;
  proto:    string;
  reads:    string;
  fw:       string;
  trust:    TrustStatus;
  advisory?: string;         // FDA/CISA advisory text if present
  telemetry?: DeviceTelemetry;
}

