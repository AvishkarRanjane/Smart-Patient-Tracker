// types/ward.ts
export type BedStatus = 'occupied' | 'available' | 'cleaning' | 'maintenance';

export interface Ward {
  id: string;
  name: string;
  code: string;
  department: string;
  floor: string;
  totalBeds: number;
  leadDoctor: string;
  headNurse: string;
  specialty: string;
}

export interface Bed {
  id: string;
  bedNumber: string;
  wardId: string;
  status: BedStatus;
  patientId?: number;
  assignedNurse?: string;
  equipmentCount: number;
  lastCleaned?: string;
  notes?: string;
}

export interface EditablePatientRecord {
  id: number;
  name: string;
  bed: string;
  wardId: string;
  age: number;
  diagnosis: string;
  condition: 'stable' | 'watch' | 'critical';
  admitDate: string;
  operationDate?: string;
  operationName?: string;
  operationStatus?: string;
  expectedExitDate: string;
  dietStatus: string;
  medications: string[];
  careSummary: string;
  assignedDoctor: string;
  assignedNurse: string;
}
