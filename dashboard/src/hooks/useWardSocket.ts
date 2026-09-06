// hooks/useWardSocket.ts
/**
 * useWardSocket — simulates the ward-wide aggregate stream.
 * In production: replace setInterval with a WebSocket/SSE connection
 * to the stream-processing layer.
 */
import { useEffect, useState } from 'react';
import type { Patient } from '../types/patient';
import { DEVICE_CATALOGUE, PATIENT_NAMES, PATIENT_DIAGNOSES, PATIENT_AGES } from '../utils/constants';

function rand(min: number, max: number) { return Math.random() * (max - min) + min; }
function clamp(v: number, lo: number, hi: number) { return Math.max(lo, Math.min(hi, v)); }

const ADMIT_RECORDS = [
  {
    admitDate: '28 Aug 2026, 09:30 AM',
    expectedExitDate: '12 Sep 2026 (6 days left)',
    operationDate: '30 Aug 2026, 10:00 AM',
    operationName: 'Heart Valve Repair Surgery',
    operationStatus: 'Completed Successfully · Healing Steady',
    dietStatus: 'Light broth, electrolyte water & fruits',
    medications: ['Antibiotic IV (Cefazolin)', 'Metoprolol 25mg', 'Electrolyte Infusion'],
    careSummary: 'Post-surgery recovery is progressing as planned. Heart rhythm is stable, pain is well-controlled, and mobility exercises start tomorrow.',
  },
  {
    admitDate: '01 Sep 2026, 02:15 PM',
    expectedExitDate: '14 Sep 2026 (8 days left)',
    operationDate: 'None Required',
    operationName: 'Airway Support Protocol',
    operationStatus: 'Stable Response · No Surgery Needed',
    dietStatus: 'Soft digestible meals & high-protein shake',
    medications: ['Bronchodilator Inhaler', 'Steroid Anti-inflammatory', 'Oxygen Flow 5.5 L/min'],
    careSummary: 'Breathing support is maintaining excellent oxygen saturation above 96%. Patient is alert and resting comfortably.',
  },
  {
    admitDate: '03 Sep 2026, 08:45 AM',
    expectedExitDate: '16 Sep 2026 (10 days left)',
    operationDate: '03 Sep 2026, 01:30 PM',
    operationName: 'Abdominal Post-Op Drainage',
    operationStatus: 'Procedure Successful · Healing on Track',
    dietStatus: 'Clear liquids & IV hydration',
    medications: ['Pain Relief Infusion', 'Broad-Spectrum Antibiotic', 'Multivitamin IV'],
    careSummary: 'Infection markers have dropped significantly. Vital signs are normal and oral fluids are tolerated well.',
  },
  {
    admitDate: '04 Sep 2026, 11:00 AM',
    expectedExitDate: '09 Sep 2026 (3 days left)',
    operationDate: '04 Sep 2026, 02:00 PM',
    operationName: 'Orthopedic Joint Realignment',
    operationStatus: 'Completed · Post-Op Observation',
    dietStatus: 'Full nutritious hospital diet',
    medications: ['Oral Analgesic', 'Anti-inflammatory Tablet', 'Calcium Supplement'],
    careSummary: 'Person 4 is doing great and walking short distances with staff assistance. Discharge anticipated in 3 days.',
  },
  {
    admitDate: '26 Aug 2026, 06:20 PM',
    expectedExitDate: '18 Sep 2026 (12 days left)',
    operationDate: '27 Aug 2026, 09:00 AM',
    operationName: 'Trauma Wound Repair & Stabilization',
    operationStatus: 'Surgical Success · Extended Healing',
    dietStatus: 'Nutrient-rich puree & recovery supplements',
    medications: ['IV Pain Control', 'Wound Care Dressing Anti-microbial', 'Saline Hydration'],
    careSummary: 'Healing smoothly following accident care. Cardiac rhythm is stable and neurological responses are completely intact.',
  },
  {
    admitDate: '02 Sep 2026, 04:30 PM',
    expectedExitDate: '11 Sep 2026 (5 days left)',
    operationDate: 'None Scheduled',
    operationName: 'Respiratory Comfort Protocol',
    operationStatus: 'Therapy Ongoing · No Surgery Needed',
    dietStatus: 'Balanced low-sodium meals',
    medications: ['Nebulizer Treatment', 'Oral Corticosteroid', 'Hydration Support'],
    careSummary: 'Comfort therapy is proving very effective. Breath sounds are clear and vital readings are well within target ranges.',
  },
];

function generatePatientSchedule(i: number) {
  return [
    {
      id: `sch-${i}-1`,
      time: '06:00 AM',
      title: 'Morning Awakening & Baseline Vitals Check',
      category: 'vitals_check' as const,
      status: 'completed' as const,
      description: 'Morning temperature, blood pressure, heart rhythm and SpO2 logged into ward telemetry.',
      assignedTo: 'Staff 1',
    },
    {
      id: `sch-${i}-2`,
      time: '08:00 AM',
      title: 'Morning Medication & IV Infusion',
      category: 'medicine' as const,
      status: 'completed' as const,
      description: 'Administered prescribed morning dose with saline flush and heart stabilizer.',
      assignedTo: 'Staff 1',
    },
    {
      id: `sch-${i}-3`,
      time: '08:30 AM',
      title: 'Nutritious Recovery Breakfast',
      category: 'meal' as const,
      status: 'completed' as const,
      description: 'Light digestible breakfast, high-protein broth, and electrolyte water.',
      assignedTo: 'Staff 1',
    },
    {
      id: `sch-${i}-4`,
      time: '10:00 AM – 01:00 PM',
      title: 'Morning Family Visiting Window (Family Meet)',
      category: 'visiting' as const,
      status: 'completed' as const,
      description: 'Bedside visitation window open. Family interaction encouraged for emotional comfort.',
      assignedTo: 'Family & Staff 1',
    },
    {
      id: `sch-${i}-5`,
      time: '11:30 AM',
      title: 'Lead Physician ICU Clinical Review Rounds',
      category: 'doctor_rounds' as const,
      status: 'completed' as const,
      description: 'Doctor 1 bedside clinical evaluation, chest examination, and lab review.',
      assignedTo: 'Doctor 1',
    },
    {
      id: `sch-${i}-6`,
      time: '01:00 PM',
      title: 'Lunch & Hydration Management',
      category: 'meal' as const,
      status: 'completed' as const,
      description: 'Warm recovery puree, fresh fruit vitamins, and mineral fluid balance.',
      assignedTo: 'Staff 1',
    },
    {
      id: `sch-${i}-7`,
      time: '01:45 PM – 03:30 PM',
      title: 'Afternoon Quiet Rest & Deep Healing Sleep',
      category: 'sleep' as const,
      status: 'completed' as const,
      description: 'Ward lights dimmed. Vital sensors set to silent background monitoring.',
      assignedTo: 'Staff 1',
    },
    {
      id: `sch-${i}-8`,
      time: '04:00 PM – 07:30 PM',
      title: 'Evening Family Visiting Window (Family Meet)',
      category: 'visiting' as const,
      status: 'in_progress' as const,
      description: 'Visiting window ACTIVE NOW. Family members welcome at bedside (Max 2 visitors).',
      assignedTo: 'Family & Staff 1',
    },
    {
      id: `sch-${i}-9`,
      time: '06:00 PM',
      title: 'Evening Medication Administration',
      category: 'medicine' as const,
      status: 'in_progress' as const,
      description: 'Evening antibiotic dose, analgesia review, and intravenous electrolyte maintenance.',
      assignedTo: 'Staff 1',
    },
    {
      id: `sch-${i}-10`,
      time: '07:45 PM',
      title: 'Light Evening Dinner & Hydration Assessment',
      category: 'meal' as const,
      status: 'upcoming' as const,
      description: 'Nutritious evening broth and relaxation tea. Fluid intake recorded.',
      assignedTo: 'Staff 1',
    },
    {
      id: `sch-${i}-11`,
      time: '09:30 PM',
      title: 'Night Medication & Pain Relief Care',
      category: 'medicine' as const,
      status: 'upcoming' as const,
      description: 'Overnight comfort medication, blood pressure check, and airway alignment.',
      assignedTo: 'Staff 1',
    },
    {
      id: `sch-${i}-12`,
      time: '10:00 PM – 06:00 AM',
      title: 'Overnight Deep Sleep & Restorative Rest',
      category: 'sleep' as const,
      status: 'upcoming' as const,
      description: 'Full night quiet sleep. Automated telemetry alert triggers active under Doctor 1 supervision.',
      assignedTo: 'Staff 1 & Doctor 1',
    },
  ];
}

function generateDailyReports(i: number, rec: (typeof ADMIT_RECORDS)[0]) {
  const pName = PATIENT_NAMES[i];
  return [
    {
      id: `rep-${i}-1`,
      dayNumber: 1,
      reportDate: '30 Aug 2026',
      createdAt: '06:00 AM Review',
      summary: `${pName} admitted to ICU Ward 4. Initial clinical stabilization and monitoring protocol established.`,
      vitalsAverage: {
        avgHr: 82,
        avgSpo2: 96.2,
        avgBp: '126/82 mmHg',
        avgTemp: 37.1,
      },
      fluidBalance: {
        intakeMl: 2100,
        outputMl: 1850,
      },
      medicationsAdministered: ['IV Cefazolin 1g', 'Normal Saline 1000mL', 'Analgesic 2mg'],
      clinicalEvaluation: 'Cardiac output stable. Hemodynamics responded well to volume resuscitation. Oxygen saturation maintained above 95%.',
      doctorSignOff: 'Doctor 1 (Chief ICU Specialist)',
      status: 'improving' as const,
    },
    {
      id: `rep-${i}-2`,
      dayNumber: 2,
      reportDate: '02 Sep 2026',
      createdAt: '06:00 AM Review',
      summary: `Second 24-hour cycle completed smoothly. Patient demonstrated excellent tolerance to oral nutrition and physical rest.`,
      vitalsAverage: {
        avgHr: 79,
        avgSpo2: 97.4,
        avgBp: '122/78 mmHg',
        avgTemp: 36.8,
      },
      fluidBalance: {
        intakeMl: 1950,
        outputMl: 1900,
      },
      medicationsAdministered: ['Antibiotic Infusion', 'Electrolyte Supplement', 'Oral Anti-inflammatory'],
      clinicalEvaluation: 'Surgical recovery on track. No secondary infections observed. Pain levels rated low (2/10). Lungs clear bilaterally.',
      doctorSignOff: 'Doctor 1 (Chief ICU Specialist)',
      status: 'stable' as const,
    },
    {
      id: `rep-${i}-3`,
      dayNumber: 3,
      reportDate: 'Yesterday (05 Sep 2026)',
      createdAt: 'Last 24-Hour Review',
      summary: `Outstanding 24-hour stability. Patient engaged comfortably during family visiting hours and achieved 8 hours of restorative sleep.`,
      vitalsAverage: {
        avgHr: 76,
        avgSpo2: 98.2,
        avgBp: '118/76 mmHg',
        avgTemp: 36.7,
      },
      fluidBalance: {
        intakeMl: 1850,
        outputMl: 1800,
      },
      medicationsAdministered: ['Maintenance Antibiotic', 'Multivitamin IV', 'Hydration Infusion'],
      clinicalEvaluation: `${rec.careSummary} All organ systems operating within healthy parameters. On track for scheduled discharge.`,
      doctorSignOff: 'Doctor 1 (Chief ICU Specialist)',
      status: 'improving' as const,
    },
  ];
}

function generateFamilyMessages(i: number) {
  const pName = PATIENT_NAMES[i];
  return [
    {
      id: `msg-${i}-1`,
      sender: 'Family Member',
      timestamp: 'Today, 11:20 AM',
      message: `Hello Doctor 1 and Staff 1, how did ${pName} sleep last night? Is pain controlled?`,
      reply: `${pName} had a very peaceful night, resting for over 7 continuous hours. Vitals are completely normal and pain is well controlled with medication.`,
      replyBy: 'Staff 1 (Senior Ward Nurse)',
      replyTime: 'Today, 11:32 AM',
    },
    {
      id: `msg-${i}-2`,
      sender: 'Family Member',
      timestamp: 'Today, 01:15 PM',
      message: `Can we bring some home-made vegetable soup or personal items during the 4:00 PM visiting window?`,
      reply: `Yes, vegetable soup is approved by Doctor 1 for current diet. You are very welcome to bring clean personal items during the visiting window.`,
      replyBy: 'Doctor 1 (Chief ICU Doctor)',
      replyTime: 'Today, 01:25 PM',
    },
  ];
}

function generateShiftHandoffs(i: number) {
  return [
    {
      id: `shift-${i}-1`,
      shift: 'Morning Shift (07:00 AM – 03:00 PM) to Evening Shift',
      timestamp: 'Today, 03:00 PM',
      doctorNote: 'Clinical course is completely steady. Morning labs reviewed and normal. Continue active hydration and breathing support.',
      nurseNote: 'All morning and afternoon medications administered on schedule. Fluid intake 950 mL. Patient rested calmly.',
      outgoingStaff: 'Staff 1 (Day Charge Nurse)',
      incomingStaff: 'Staff 2 (Evening Duty Nurse)',
    },
  ];
}

function seedPatient(i: number): Patient {
  const vitals = {
    hr:   rand(72, 86), spo2: rand(96, 99), sbp: rand(112, 126),
    dbp:  rand(70, 80), rr:   rand(14, 18), temp: rand(36.6, 37.2),
  };
  const history = { hr: [], spo2: [], sbp: [], rr: [], temp: [] } as Patient['history'];
  for (let k = 0; k < 30; k++) {
    history.hr.push(vitals.hr   + rand(-3, 3));
    history.spo2.push(vitals.spo2 + rand(-0.5, 0.5));
    history.sbp.push(vitals.sbp   + rand(-4, 4));
    history.rr.push(vitals.rr     + rand(-1, 1));
    history.temp.push(vitals.temp + rand(-0.1, 0.1));
  }
  const deviceSets: Patient['devices'][] = [
    [DEVICE_CATALOGUE[0], DEVICE_CATALOGUE[2]], // Bedside Heart Monitor + Breathing Assistant (Ventilator with oxygen flow)
    [DEVICE_CATALOGUE[0], DEVICE_CATALOGUE[4]],
    [DEVICE_CATALOGUE[2], DEVICE_CATALOGUE[1]], // Ventilator + BP
    [DEVICE_CATALOGUE[0], DEVICE_CATALOGUE[1]],
    [DEVICE_CATALOGUE[4], DEVICE_CATALOGUE[1]],
    [DEVICE_CATALOGUE[5], DEVICE_CATALOGUE[1]],
  ];
  const rec = ADMIT_RECORDS[i] || ADMIT_RECORDS[0];

  return {
    id: i,
    name: PATIENT_NAMES[i],
    bed: `ICU-${401+i}`,
    age: PATIENT_AGES[i],
    diagnosis: PATIENT_DIAGNOSES[i],
    admitDate: rec.admitDate,
    expectedExitDate: rec.expectedExitDate,
    operationDate: rec.operationDate,
    operationName: rec.operationName,
    operationStatus: rec.operationStatus,
    dietStatus: rec.dietStatus,
    medications: rec.medications,
    careSummary: rec.careSummary,
    visitingHours: {
      isOpen: true,
      currentWindow: '10:00 AM – 1:00 PM & 4:00 PM – 7:30 PM',
      nextWindow: 'Evening: 4:00 PM – 7:30 PM',
      maxVisitors: 2,
      rules: 'Up to 2 visitors at bedside. Please sanitize hands and maintain a quiet, calm environment.',
    },
    schedule: generatePatientSchedule(i),
    dailyReports: generateDailyReports(i, rec),
    familyMessages: generateFamilyMessages(i),
    shiftHandoffs: generateShiftHandoffs(i),
    vitals,
    history,
    devices: deviceSets[i] || deviceSets[0],
    mlScore: Math.floor(rand(3, 18)),
    lastUpdate: Date.now(),
  };
}

const INITIAL_PATIENTS: Patient[] = PATIENT_NAMES.map((_, i) => seedPatient(i));

export function useWardSocket(intervalMs = 2200) {
  const [patients, setPatients] = useState<Patient[]>(INITIAL_PATIENTS);

  useEffect(() => {
    const id = setInterval(() => {
      setPatients(prev => prev.map(p => {
        const v = { ...p.vitals };
        v.hr   = clamp(v.hr   + rand(-2.2, 2.2), 38, 168);
        v.spo2 = clamp(v.spo2 + rand(-0.4, 0.4), 78, 100);
        v.sbp  = clamp(v.sbp  + rand(-2.2, 2.2), 62, 195);
        v.dbp  = clamp(v.dbp  + rand(-1.4, 1.4), 38, 125);
        v.rr   = clamp(v.rr   + rand(-0.7, 0.7), 7, 36);
        v.temp = clamp(v.temp + rand(-0.06, 0.06), 34.5, 40.2);
        const history = { ...p.history };
        (['hr','spo2','sbp','rr','temp'] as const).forEach(k => {
          history[k] = [...history[k], v[k]].slice(-40);
        });
        const mlScore = clamp(p.mlScore + (Math.random() < 0.3 ? (Math.random() < 0.5 ? 1 : -1) : 0), 0, 100);
        return { ...p, vitals: v, history, mlScore, lastUpdate: Date.now() };
      }));
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return patients;
}
