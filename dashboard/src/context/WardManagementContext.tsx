// context/WardManagementContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Ward, Bed, BedStatus, EditablePatientRecord } from '../types/ward';
import { showToast } from '../components/ui/Toast.tsx';

const WARDS_STORAGE_KEY = 'smart_patient_wards_v2';
const BEDS_STORAGE_KEY = 'smart_patient_beds_v2';
const PATIENTS_CELL_KEY = 'smart_patient_cell_data_v2';

const SEED_WARDS: Ward[] = [
  {
    id: 'ward-4',
    name: 'ICU · Ward 4 (Cardiovascular & Critical Care)',
    code: 'ICU-4',
    department: 'Cardiovascular Medicine',
    floor: 'Level 4 · West Wing',
    totalBeds: 8,
    leadDoctor: 'Doctor 1',
    headNurse: 'Staff 1',
    specialty: 'Cardiac Surgery, Vasoactive Infusion, Ventilatory Support',
  },
  {
    id: 'ward-2',
    name: 'ICU · Ward 2 (Trauma & Neuro ICU)',
    code: 'ICU-2',
    department: 'Neuro-Trauma Care',
    floor: 'Level 2 · North Wing',
    totalBeds: 6,
    leadDoctor: 'Doctor 1',
    headNurse: 'Staff 1',
    specialty: 'Neuro-Monitoring & Trauma Resuscitation',
  },
  {
    id: 'ward-stepdown',
    name: 'HDU · Stepdown Recovery Wing',
    code: 'HDU-1',
    department: 'High Dependency Stepdown',
    floor: 'Level 3 · East Wing',
    totalBeds: 6,
    leadDoctor: 'Doctor 1',
    headNurse: 'Staff 1',
    specialty: 'Post-ICU Weaning & Telemetry Recovery',
  },
];

const SEED_BEDS: Bed[] = [
  { id: 'bed-401', bedNumber: 'ICU-401', wardId: 'ward-4', status: 'occupied', patientId: 0, assignedNurse: 'Staff 1', equipmentCount: 2 },
  { id: 'bed-402', bedNumber: 'ICU-402', wardId: 'ward-4', status: 'occupied', patientId: 1, assignedNurse: 'Staff 1', equipmentCount: 3 },
  { id: 'bed-403', bedNumber: 'ICU-403', wardId: 'ward-4', status: 'occupied', patientId: 2, assignedNurse: 'Staff 1', equipmentCount: 2 },
  { id: 'bed-404', bedNumber: 'ICU-404', wardId: 'ward-4', status: 'occupied', patientId: 3, assignedNurse: 'Staff 1', equipmentCount: 2 },
  { id: 'bed-405', bedNumber: 'ICU-405', wardId: 'ward-4', status: 'occupied', patientId: 4, assignedNurse: 'Staff 1', equipmentCount: 2 },
  { id: 'bed-406', bedNumber: 'ICU-406', wardId: 'ward-4', status: 'occupied', patientId: 5, assignedNurse: 'Staff 1', equipmentCount: 2 },
  { id: 'bed-407', bedNumber: 'ICU-407', wardId: 'ward-4', status: 'available', assignedNurse: 'Staff 1', equipmentCount: 2 },
  { id: 'bed-408', bedNumber: 'ICU-408', wardId: 'ward-4', status: 'cleaning', assignedNurse: 'Staff 1', equipmentCount: 3, lastCleaned: 'Terminal clean queued' },

  // Ward 2 Beds
  { id: 'bed-201', bedNumber: 'ICU-201', wardId: 'ward-2', status: 'available', assignedNurse: 'Staff 1', equipmentCount: 2 },
  { id: 'bed-202', bedNumber: 'ICU-202', wardId: 'ward-2', status: 'available', assignedNurse: 'Staff 1', equipmentCount: 2 },
  { id: 'bed-203', bedNumber: 'ICU-203', wardId: 'ward-2', status: 'maintenance', assignedNurse: 'Staff 1', equipmentCount: 1, notes: 'Telemetry sensor calibration' },
  { id: 'bed-204', bedNumber: 'ICU-204', wardId: 'ward-2', status: 'available', assignedNurse: 'Staff 1', equipmentCount: 2 },

  // Stepdown Beds
  { id: 'bed-101', bedNumber: 'HDU-101', wardId: 'ward-stepdown', status: 'available', assignedNurse: 'Staff 1', equipmentCount: 1 },
  { id: 'bed-102', bedNumber: 'HDU-102', wardId: 'ward-stepdown', status: 'available', assignedNurse: 'Staff 1', equipmentCount: 1 },
];

const SEED_PATIENTS: Record<number, EditablePatientRecord> = {
  0: {
    id: 0,
    name: 'Person 1',
    bed: 'ICU-401',
    wardId: 'ward-4',
    age: 62,
    diagnosis: 'Post Cardiac Valve Repair',
    condition: 'stable',
    admitDate: '28 Aug 2026, 09:30 AM',
    operationDate: '30 Aug 2026, 11:15 AM',
    operationName: 'Heart Valve Repair',
    operationStatus: 'Completed Successfully · Healing Steady',
    expectedExitDate: '12 Sep 2026',
    dietStatus: 'Light recovery broth & electrolyte fluids',
    medications: ['Cefazolin 1g IV', 'Morphine 2mg', 'Normal Saline'],
    careSummary: 'Comfort therapy is proving very effective. Breath sounds are clear and vital readings are well within target ranges.',
    assignedDoctor: 'Doctor 1',
    assignedNurse: 'Staff 1',
  },
  1: {
    id: 1,
    name: 'Person 2',
    bed: 'ICU-402',
    wardId: 'ward-4',
    age: 55,
    diagnosis: 'Acute Respiratory Support',
    condition: 'watch',
    admitDate: '30 Aug 2026, 02:15 PM',
    expectedExitDate: '14 Sep 2026',
    dietStatus: 'Soft pureed nutrition & humidified fluids',
    medications: ['Bronchodilator Nebulizer', 'Methylprednisolone IV'],
    careSummary: 'Continuous oxygen delivery via high-flow cannula. Patient breathing comfortably without coughing.',
    assignedDoctor: 'Doctor 1',
    assignedNurse: 'Staff 1',
  },
  2: {
    id: 2,
    name: 'Person 3',
    bed: 'ICU-403',
    wardId: 'ward-4',
    age: 48,
    diagnosis: 'Post Laparotomy Recovery',
    condition: 'stable',
    admitDate: '01 Sep 2026, 08:45 AM',
    operationDate: '01 Sep 2026, 10:00 AM',
    operationName: 'Exploratory Laparotomy',
    operationStatus: 'Procedure Finished · Stable Rest',
    expectedExitDate: '09 Sep 2026',
    dietStatus: 'Clear liquids and oral rehydration solution',
    medications: ['Paracetamol 1g IV', 'Ondansetron 4mg', 'IV Fluids'],
    careSummary: 'Incision site clean and dry. Pain score 2/10. Early mobility protocol initiated.',
    assignedDoctor: 'Doctor 1',
    assignedNurse: 'Staff 1',
  },
  3: {
    id: 3,
    name: 'Person 4',
    bed: 'ICU-404',
    wardId: 'ward-4',
    age: 71,
    diagnosis: 'Cardiac Rhythm Monitoring',
    condition: 'stable',
    admitDate: '02 Sep 2026, 11:00 AM',
    expectedExitDate: '08 Sep 2026',
    dietStatus: 'Heart-healthy low-sodium meals',
    medications: ['Metoprolol 25mg', 'Aspirin 81mg', 'Potassium Supplement'],
    careSummary: 'Sinus rhythm intact. No arrhythmias detected over the past 24 hours.',
    assignedDoctor: 'Doctor 1',
    assignedNurse: 'Staff 1',
  },
  4: {
    id: 4,
    name: 'Person 5',
    bed: 'ICU-405',
    wardId: 'ward-4',
    age: 39,
    diagnosis: 'Orthopedic Trauma Stabilization',
    condition: 'stable',
    admitDate: '29 Aug 2026, 06:30 PM',
    operationDate: '30 Aug 2026, 08:00 AM',
    operationName: 'Femur Fracture Fixation',
    operationStatus: 'Pins Secure · Healing Smoothly',
    expectedExitDate: '15 Sep 2026',
    dietStatus: 'High-protein recovery diet',
    medications: ['Enoxaparin 40mg SubQ', 'Tramadol 50mg', 'Multivitamins'],
    careSummary: 'Neurovascular status intact in lower extremities. Swelling resolved.',
    assignedDoctor: 'Doctor 1',
    assignedNurse: 'Staff 1',
  },
  5: {
    id: 5,
    name: 'Person 6',
    bed: 'ICU-406',
    wardId: 'ward-4',
    age: 67,
    diagnosis: 'Pneumonia & Recovery Observation',
    condition: 'stable',
    admitDate: '31 Aug 2026, 04:00 PM',
    expectedExitDate: '10 Sep 2026',
    dietStatus: 'Balanced low-sodium meals',
    medications: ['Nebulizer Treatment', 'Oral Corticosteroid', 'Hydration Support'],
    careSummary: 'Comfort therapy is proving very effective. Breath sounds are clear and vital readings are well within target ranges.',
    assignedDoctor: 'Doctor 1',
    assignedNurse: 'Staff 1',
  },
};

interface WardManagementCtx {
  wards: Ward[];
  beds: Bed[];
  activeWardId: string;
  activeWard: Ward;
  setActiveWardId: (id: string) => void;
  getWardBeds: (wardId?: string) => Bed[];
  getWardPatients: (wardId?: string) => EditablePatientRecord[];
  updateWardConfig: (wardId: string, updates: Partial<Ward>) => void;
  updatePatientCell: (patientId: number, field: keyof EditablePatientRecord, value: any) => void;
  updateFullPatientRecord: (patientId: number, record: EditablePatientRecord) => void;
  addNewBed: (wardId: string, customBedNumber?: string) => void;
  setBedStatus: (bedId: string, status: BedStatus, notes?: string) => void;
  transferPatient: (patientId: number, targetWardId: string, targetBedId: string, reason?: string) => void;
  dischargePatient: (patientId: number) => void;
  admitPatient: (patient: Omit<EditablePatientRecord, 'id'>, targetBedId: string) => void;
}

const WardManagementContext = createContext<WardManagementCtx>({
  wards: SEED_WARDS,
  beds: SEED_BEDS,
  activeWardId: 'ward-4',
  activeWard: SEED_WARDS[0],
  setActiveWardId: () => {},
  getWardBeds: () => [],
  getWardPatients: () => [],
  updateWardConfig: () => {},
  updatePatientCell: () => {},
  updateFullPatientRecord: () => {},
  addNewBed: () => {},
  setBedStatus: () => {},
  transferPatient: () => {},
  dischargePatient: () => {},
  admitPatient: () => {},
});

export function WardManagementProvider({ children }: { children: ReactNode }) {
  const [wards, setWards] = useState<Ward[]>(() => {
    try {
      const s = localStorage.getItem(WARDS_STORAGE_KEY);
      if (s) return JSON.parse(s);
    } catch {}
    return SEED_WARDS;
  });

  const [beds, setBeds] = useState<Bed[]>(() => {
    try {
      const s = localStorage.getItem(BEDS_STORAGE_KEY);
      if (s) return JSON.parse(s);
    } catch {}
    return SEED_BEDS;
  });

  const [patients, setPatients] = useState<Record<number, EditablePatientRecord>>(() => {
    try {
      const s = localStorage.getItem(PATIENTS_CELL_KEY);
      if (s) return JSON.parse(s);
    } catch {}
    return SEED_PATIENTS;
  });

  const [activeWardId, setActiveWardId] = useState<string>('ward-4');

  useEffect(() => {
    try {
      localStorage.setItem(WARDS_STORAGE_KEY, JSON.stringify(wards));
    } catch {}
  }, [wards]);

  useEffect(() => {
    try {
      localStorage.setItem(BEDS_STORAGE_KEY, JSON.stringify(beds));
    } catch {}
  }, [beds]);

  useEffect(() => {
    try {
      localStorage.setItem(PATIENTS_CELL_KEY, JSON.stringify(patients));
    } catch {}
  }, [patients]);

  const activeWard = wards.find((w) => w.id === activeWardId) || wards[0];

  const getWardBeds = (wardId = activeWardId): Bed[] => {
    return beds.filter((b) => b.wardId === wardId);
  };

  const getWardPatients = (wardId = activeWardId): EditablePatientRecord[] => {
    return Object.values(patients).filter((p) => p.wardId === wardId);
  };

  const updateWardConfig = (wardId: string, updates: Partial<Ward>) => {
    setWards((prev) =>
      prev.map((w) => (w.id === wardId ? { ...w, ...updates } : w))
    );
    showToast(`Ward details updated successfully.`);
  };

  const updatePatientCell = (patientId: number, field: keyof EditablePatientRecord, value: any) => {
    setPatients((prev) => {
      const current = prev[patientId];
      if (!current) return prev;
      const updated = { ...current, [field]: value };
      return { ...prev, [patientId]: updated };
    });
    showToast(`Updated ${String(field)} for patient.`);
  };

  const updateFullPatientRecord = (patientId: number, record: EditablePatientRecord) => {
    setPatients((prev) => ({
      ...prev,
      [patientId]: record,
    }));
    showToast(`Saved complete medical record for ${record.name}.`);
  };

  const addNewBed = (wardId: string, customBedNumber?: string) => {
    const wardBeds = beds.filter((b) => b.wardId === wardId);
    const wardObj = wards.find((w) => w.id === wardId);
    const code = wardObj?.code || 'BED';
    const nextNum = wardBeds.length + 1;
    const bedNumber = customBedNumber || `${code}-${nextNum < 10 ? '40' + nextNum : nextNum}`;
    const newBed: Bed = {
      id: `bed-${Date.now()}`,
      bedNumber,
      wardId,
      status: 'available',
      assignedNurse: 'Staff 1',
      equipmentCount: 2,
    };

    setBeds((prev) => [...prev, newBed]);
    setWards((prev) =>
      prev.map((w) => (w.id === wardId ? { ...w, totalBeds: w.totalBeds + 1 } : w))
    );
    showToast(`Added new bed ${bedNumber} to ${wardObj?.name || 'ward'}.`);
  };

  const setBedStatus = (bedId: string, status: BedStatus, notes?: string) => {
    setBeds((prev) =>
      prev.map((b) => (b.id === bedId ? { ...b, status, ...(notes && { notes }) } : b))
    );
    showToast(`Bed status changed to ${status}.`);
  };

  const transferPatient = (
    patientId: number,
    targetWardId: string,
    targetBedId: string,
    reason?: string
  ) => {
    const patient = patients[patientId];
    if (!patient) return;

    const targetBed = beds.find((b) => b.id === targetBedId);
    if (!targetBed) return;

    // Free previous bed
    const previousBed = beds.find((b) => b.patientId === patientId);

    setBeds((prev) =>
      prev.map((b) => {
        if (b.id === previousBed?.id) {
          return { ...b, status: 'cleaning', patientId: undefined, lastCleaned: 'Turnover cleaning required' };
        }
        if (b.id === targetBedId) {
          return { ...b, status: 'occupied', patientId };
        }
        return b;
      })
    );

    setPatients((prev) => ({
      ...prev,
      [patientId]: {
        ...patient,
        wardId: targetWardId,
        bed: targetBed.bedNumber,
      },
    }));

    showToast(
      `Transferred ${patient.name} to ${targetBed.bedNumber}${reason ? ` (${reason})` : ''}.`
    );
  };

  const dischargePatient = (patientId: number) => {
    const patient = patients[patientId];
    if (!patient) return;

    // Free bed and set to cleaning
    setBeds((prev) =>
      prev.map((b) =>
        b.patientId === patientId
          ? { ...b, status: 'cleaning', patientId: undefined, lastCleaned: 'Terminal discharge cleaning' }
          : b
      )
    );

    // Remove or archive patient
    setPatients((prev) => {
      const updated = { ...prev };
      delete updated[patientId];
      return updated;
    });

    showToast(`Discharged ${patient.name}. Bed set for terminal cleaning.`);
  };

  const admitPatient = (patientData: Omit<EditablePatientRecord, 'id'>, targetBedId: string) => {
    const targetBed = beds.find((b) => b.id === targetBedId);
    if (!targetBed) return;

    const newId = Date.now();
    const newRecord: EditablePatientRecord = {
      ...patientData,
      id: newId,
      bed: targetBed.bedNumber,
      wardId: targetBed.wardId,
    };

    setPatients((prev) => ({
      ...prev,
      [newId]: newRecord,
    }));

    setBeds((prev) =>
      prev.map((b) => (b.id === targetBedId ? { ...b, status: 'occupied', patientId: newId } : b))
    );

    showToast(`Admitted ${newRecord.name} to ${targetBed.bedNumber}.`);
  };

  return (
    <WardManagementContext.Provider
      value={{
        wards,
        beds,
        activeWardId,
        activeWard,
        setActiveWardId,
        getWardBeds,
        getWardPatients,
        updateWardConfig,
        updatePatientCell,
        updateFullPatientRecord,
        addNewBed,
        setBedStatus,
        transferPatient,
        dischargePatient,
        admitPatient,
      }}
    >
      {children}
    </WardManagementContext.Provider>
  );
}

export function useWardManagement() {
  return useContext(WardManagementContext);
}
