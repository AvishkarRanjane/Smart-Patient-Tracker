// services/api/patients.ts
import type { Patient } from '../../types/patient';
import type { EditablePatientRecord } from '../../types/ward';

const PATIENTS_STORAGE_KEY = 'smart_patient_cell_data_v2';

/**
 * Service to interact with patient records, vitals, and reports
 */
export const patientService = {
  /**
   * Fetch all editable patient records
   */
  getStoredPatients(): Record<number, EditablePatientRecord> {
    try {
      const data = localStorage.getItem(PATIENTS_STORAGE_KEY);
      if (data) return JSON.parse(data);
    } catch {
      // Fallback
    }
    return {};
  },

  /**
   * Save patient records back to local storage
   */
  saveStoredPatients(patients: Record<number, EditablePatientRecord>): void {
    try {
      localStorage.setItem(PATIENTS_STORAGE_KEY, JSON.stringify(patients));
    } catch (e) {
      console.error('Failed to save patient records:', e);
    }
  },

  /**
   * Format patient acuity status
   */
  getAcuityLevel(patient: Patient): 'stable' | 'watch' | 'critical' {
    if (patient.vitals.spo2 < 93 || patient.vitals.hr > 115) return 'critical';
    if (patient.vitals.spo2 < 96 || patient.vitals.hr > 95) return 'watch';
    return 'stable';
  },
};
