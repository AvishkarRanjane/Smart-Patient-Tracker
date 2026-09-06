// pages/Overview/ClinicalTableView.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Patient } from '../../types/patient';
import styles from './overview.module.css';

interface ClinicalTableViewProps {
  patients: Patient[];
}

type SortField = 'bed' | 'name' | 'condition' | 'hr' | 'spo2' | 'sbp' | 'rr' | 'temp';

export default function ClinicalTableView({ patients }: ClinicalTableViewProps) {
  const navigate = useNavigate();
  const [sortField, setSortField] = useState<SortField>('bed');
  const [sortAsc, setSortAsc] = useState(true);

  const handleHeaderClick = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const sortedPatients = [...patients].sort((a, b) => {
    let cmp = 0;
    if (sortField === 'bed') {
      cmp = a.bed.localeCompare(b.bed);
    } else if (sortField === 'name') {
      cmp = a.name.localeCompare(b.name);
    } else if (sortField === 'condition') {
      const order = { critical: 3, watch: 2, stable: 1 };
      const statusA = (a.vitals.spo2 < 93 || a.vitals.hr > 115) ? 'critical' : (a.vitals.spo2 < 96 || a.vitals.hr > 95) ? 'watch' : 'stable';
      const statusB = (b.vitals.spo2 < 93 || b.vitals.hr > 115) ? 'critical' : (b.vitals.spo2 < 96 || b.vitals.hr > 95) ? 'watch' : 'stable';
      cmp = order[statusA] - order[statusB];
    } else if (sortField === 'hr') {
      cmp = a.vitals.hr - b.vitals.hr;
    } else if (sortField === 'spo2') {
      cmp = a.vitals.spo2 - b.vitals.spo2;
    } else if (sortField === 'sbp') {
      cmp = a.vitals.sbp - b.vitals.sbp;
    } else if (sortField === 'rr') {
      cmp = a.vitals.rr - b.vitals.rr;
    } else if (sortField === 'temp') {
      cmp = a.vitals.temp - b.vitals.temp;
    }
    return sortAsc ? cmp : -cmp;
  });

  const getAcuity = (patient: Patient) => {
    if (patient.vitals.spo2 < 93 || patient.vitals.hr > 115) {
      return { label: 'Critical Alert', badgeClass: styles.badgeCritical, dot: '🔴' };
    }
    if (patient.vitals.spo2 < 96 || patient.vitals.hr > 95) {
      return { label: 'Watch / High', badgeClass: styles.badgeWatch, dot: '🟡' };
    }
    return { label: 'Resting Stable', badgeClass: styles.badgeStable, dot: '🟢' };
  };

  return (
    <div className={styles.tableContainer}>
      <table className={styles.clinicalTable}>
        <thead>
          <tr>
            <th className={styles.thSortable} onClick={() => handleHeaderClick('bed')}>
              Bed {sortField === 'bed' ? (sortAsc ? '↑' : '↓') : ''}
            </th>
            <th className={styles.thSortable} onClick={() => handleHeaderClick('name')}>
              Patient {sortField === 'name' ? (sortAsc ? '↑' : '↓') : ''}
            </th>
            <th className={styles.thSortable} onClick={() => handleHeaderClick('condition')}>
              Condition / Acuity {sortField === 'condition' ? (sortAsc ? '↑' : '↓') : ''}
            </th>
            <th className={styles.thSortable} onClick={() => handleHeaderClick('hr')}>
              HR (bpm) {sortField === 'hr' ? (sortAsc ? '↑' : '↓') : ''}
            </th>
            <th className={styles.thSortable} onClick={() => handleHeaderClick('spo2')}>
              SpO₂ (%) {sortField === 'spo2' ? (sortAsc ? '↑' : '↓') : ''}
            </th>
            <th className={styles.thSortable} onClick={() => handleHeaderClick('sbp')}>
              BP (mmHg) {sortField === 'sbp' ? (sortAsc ? '↑' : '↓') : ''}
            </th>
            <th className={styles.thSortable} onClick={() => handleHeaderClick('rr')}>
              RR (/min) {sortField === 'rr' ? (sortAsc ? '↑' : '↓') : ''}
            </th>
            <th className={styles.thSortable} onClick={() => handleHeaderClick('temp')}>
              Temp (°C) {sortField === 'temp' ? (sortAsc ? '↑' : '↓') : ''}
            </th>
            <th>Primary Diagnosis</th>
            <th>Admit Date</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedPatients.map((patient) => {
            const acuity = getAcuity(patient);
            return (
              <tr
                key={patient.id}
                className={styles.tableRow}
                onClick={() => navigate(`/patient/${patient.id}`)}
              >
                <td>
                  <strong style={{ color: 'var(--blue)' }}>{patient.bed}</strong>
                </td>
                <td>
                  <div className={styles.patientCellMain}>
                    <span className={styles.patientCellName}>{patient.name}</span>
                    <span className={styles.patientCellSub}>{patient.age} yrs · Room ICU-40{patient.id + 1}</span>
                  </div>
                </td>
                <td>
                  <span className={`${styles.badgeRisk} ${acuity.badgeClass}`}>
                    <span>{acuity.dot}</span>
                    {acuity.label}
                  </span>
                </td>
                <td>
                  <span className={styles.vitalValueHighlight} style={{ color: patient.vitals.hr > 100 ? '#dc2626' : 'var(--ink)' }}>
                    {patient.vitals.hr}
                  </span>
                </td>
                <td>
                  <span className={styles.vitalValueHighlight} style={{ color: patient.vitals.spo2 < 95 ? '#dc2626' : 'var(--ink)' }}>
                    {patient.vitals.spo2}%
                  </span>
                </td>
                <td>
                  <span>{patient.vitals.sbp}/{patient.vitals.dbp}</span>
                </td>
                <td>
                  <span>{patient.vitals.rr}</span>
                </td>
                <td>
                  <span>{patient.vitals.temp.toFixed(1)}</span>
                </td>
                <td>
                  <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
                    {patient.diagnosis}
                  </span>
                </td>
                <td>
                  <span style={{ fontSize: 11, color: 'var(--ink-faint)' }}>
                    {patient.admitDate.split(',')[0]}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }} onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    className={styles.tableActionBtn}
                    onClick={() => navigate(`/patient/${patient.id}`)}
                  >
                    Open Monitor →
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
