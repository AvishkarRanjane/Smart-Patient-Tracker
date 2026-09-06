import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWardManagement } from '../../context/WardManagementContext';
import type { Patient } from '../../types/patient';
import AdmitPatientModal from '../WardEditor/AdmitPatientModal';
import styles from './overview.module.css';

interface BedMatrixViewProps {
  livePatients: Patient[];
}

export default function BedMatrixView({ livePatients }: BedMatrixViewProps) {
  const { activeWard, getWardBeds, getWardPatients, setBedStatus, admitPatient } = useWardManagement();
  const navigate = useNavigate();

  const [admitBedId, setAdmitBedId] = useState<string | null>(null);

  const beds = getWardBeds(activeWard.id);
  const wardPatients = getWardPatients(activeWard.id);

  // Map patientId to live vital patient
  const liveMap = new Map<number, Patient>();
  livePatients.forEach((lp) => liveMap.set(lp.id, lp));

  // Map patientId to editable patient record
  const patientRecordMap = new Map<number, (typeof wardPatients)[0]>();
  wardPatients.forEach((wp) => patientRecordMap.set(wp.id, wp));

  return (
    <div>
      <div className={styles.matrixGrid}>
        {beds.map((bed) => {
          const isOccupied = bed.status === 'occupied' && bed.patientId !== undefined;
          const patientRecord = bed.patientId !== undefined ? patientRecordMap.get(bed.patientId) : undefined;
          const liveData = bed.patientId !== undefined ? liveMap.get(bed.patientId) : undefined;

          // Compute card styling
          let cardClass = styles.bedCard;
          let statusPillClass = styles.statusAvailable;

          if (bed.status === 'occupied') {
            cardClass += ` ${styles.bedCardOccupied}`;
            statusPillClass = styles.statusOccupied;
          } else if (bed.status === 'available') {
            cardClass += ` ${styles.bedCardAvailable}`;
            statusPillClass = styles.statusAvailable;
          } else if (bed.status === 'cleaning') {
            cardClass += ` ${styles.bedCardCleaning}`;
            statusPillClass = styles.statusCleaning;
          } else if (bed.status === 'maintenance') {
            cardClass += ` ${styles.bedCardMaintenance}`;
            statusPillClass = styles.statusMaintenance;
          }

          return (
            <div key={bed.id} className={cardClass}>
              <div>
                {/* Header */}
                <div className={styles.bedCardHeader}>
                  <div className={styles.bedNumberBadge}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                      <path d="M2 4v16" />
                      <path d="M2 8h18a2 2 0 0 1 2 2v10" />
                      <path d="M2 17h20" />
                      <path d="M6 8v9" />
                    </svg>
                    {bed.bedNumber}
                  </div>
                  <span className={`${styles.bedStatusPill} ${statusPillClass}`}>
                    {bed.status}
                  </span>
                </div>

                {/* Body depending on bed status */}
                {isOccupied && patientRecord ? (
                  <div>
                    <div className={styles.bedPatientName}>
                      {patientRecord.name}
                    </div>
                    <div className={styles.bedDiagnosis}>
                      {patientRecord.diagnosis}
                    </div>

                    {/* Live vitals snippet */}
                    {liveData && (
                      <div className={styles.bedVitalsRow}>
                        <div className={styles.bedVitalPill}>
                          <span style={{ color: 'var(--coral)' }}>♥</span>
                          <span>{liveData.vitals.hr} <small style={{ fontSize: 9, opacity: 0.7 }}>bpm</small></span>
                        </div>
                        <div className={styles.bedVitalPill}>
                          <span style={{ color: 'var(--blue)' }}>O₂</span>
                          <span>{liveData.vitals.spo2}%</span>
                        </div>
                        <div className={styles.bedVitalPill}>
                          <span style={{ color: 'var(--mint)' }}>BP</span>
                          <span>{liveData.vitals.sbp}/{liveData.vitals.dbp}</span>
                        </div>
                      </div>
                    )}

                    <div style={{ fontSize: 11, color: 'var(--ink-faint)', marginBottom: 12 }}>
                      Admitted: <strong>{patientRecord.admitDate.split(',')[0]}</strong> · Dr: {patientRecord.assignedDoctor}
                    </div>
                  </div>
                ) : bed.status === 'available' ? (
                  <div className={styles.emptyBedArea}>
                    <div className={styles.emptyBedIcon}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                        <line x1="12" y1="5" x2="12" y2="19" />
                        <line x1="5" y1="12" x2="19" y2="12" />
                      </svg>
                    </div>
                    <div className={styles.emptyBedTitle}>Bed Ready for Admission</div>
                    <div className={styles.emptyBedSub}>Disinfected & sensor kit attached</div>
                    <button
                      type="button"
                      className={`${styles.bedActionBtn} ${styles.bedActionBtnPrimary}`}
                      onClick={() => setAdmitBedId(bed.id)}
                    >
                      + Admit Patient Here
                    </button>
                  </div>
                ) : bed.status === 'cleaning' ? (
                  <div className={styles.cleaningBedArea}>
                    <div className={styles.cleaningIcon}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                    </div>
                    <div className={styles.emptyBedTitle}>Turnover Sanitization</div>
                    <div className={styles.emptyBedSub}>
                      {bed.lastCleaned || 'Terminal UV disinfection in progress'}
                    </div>
                    <button
                      type="button"
                      className={styles.bedActionBtn}
                      onClick={() => setBedStatus(bed.id, 'available')}
                    >
                      ✓ Mark Clean & Ready
                    </button>
                  </div>
                ) : (
                  <div className={styles.cleaningBedArea}>
                    <div className={styles.cleaningIcon} style={{ background: 'rgba(148, 163, 184, 0.2)', color: '#475569' }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                      </svg>
                    </div>
                    <div className={styles.emptyBedTitle}>Maintenance Check</div>
                    <div className={styles.emptyBedSub}>
                      {bed.notes || 'Sensor and electrical calibration'}
                    </div>
                    <button
                      type="button"
                      className={styles.bedActionBtn}
                      onClick={() => setBedStatus(bed.id, 'available')}
                    >
                      ✓ Mark Serviced & Ready
                    </button>
                  </div>
                )}
              </div>

              {/* Actions Footer for Occupied Bed */}
              {isOccupied && (
                <div className={styles.bedActions}>
                  <button
                    type="button"
                    className={`${styles.bedActionBtn} ${styles.bedActionBtnPrimary}`}
                    onClick={() => navigate(`/patient/${bed.patientId}`)}
                  >
                    View Vitals Monitor →
                  </button>
                  <button
                    type="button"
                    className={styles.bedActionBtn}
                    onClick={() => navigate('/ward-editor')}
                    title="Edit record in Ward Editor"
                  >
                    Edit Record
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Admission Modal */}
      {admitBedId && (
        <AdmitPatientModal
          beds={beds}
          wardId={activeWard.id}
          initialBedId={admitBedId}
          onAdmit={admitPatient}
          onClose={() => setAdmitBedId(null)}
        />
      )}
    </div>
  );
}
