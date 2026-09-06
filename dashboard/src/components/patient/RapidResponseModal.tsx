// components/patient/RapidResponseModal.tsx
import { useState } from 'react';
import { showToast } from '../ui/Toast.tsx';
import styles from './rapidResponse.module.css';

interface Props {
  isOpen: boolean;
  patientName: string;
  roomBed: string;
  onClose: () => void;
}

export default function RapidResponseModal({ isOpen, patientName, roomBed, onClose }: Props) {
  const [confirmed, setConfirmed] = useState(false);

  if (!isOpen) return null;

  const handleTriggerCode = (type: string) => {
    setConfirmed(true);
    showToast(`EMERGENCY ALERT: ${type} dispatched to Room ${roomBed} (${patientName})!`);
    setTimeout(() => {
      setConfirmed(false);
      onClose();
    }, 2000);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.warningIcon}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <div>
            <h2 className={styles.title}>Emergency Rapid Response &amp; Code Blue</h2>
            <p className={styles.sub}>
              Patient: <strong>{patientName}</strong> · Room: <strong>{roomBed}</strong> · ICU Ward 4
            </p>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose}>
            ✕
          </button>
        </div>

        {confirmed ? (
          <div className={styles.dispatchedBanner}>
            <div className={styles.dispatchedDot}></div>
            <div>
              <div style={{ fontWeight: 800, fontSize: 16 }}>Rapid Response Team Dispatched</div>
              <div style={{ fontSize: 12 }}>Doctor 1, Code Blue Resuscitation Team &amp; ICU Crash Cart arriving at Room {roomBed}.</div>
            </div>
          </div>
        ) : (
          <div className={styles.body}>
            <p className={styles.noticeText}>
              Select emergency protocol to broadcast hospital-wide alarm and summon immediate bedside resuscitation:
            </p>

            <div className={styles.emergencyGrid}>
              <button
                type="button"
                className={`${styles.codeBtn} ${styles.codeBlue}`}
                onClick={() => handleTriggerCode('Code Blue (Cardiac Arrest)')}
              >
                <div className={styles.codeTitle}>🚨 Code Blue (Cardiac / Respiratory Arrest)</div>
                <div className={styles.codeDesc}>
                  Initiates crash cart dispatch, automated chest compression team, and airway intubation specialist.
                </div>
              </button>

              <button
                type="button"
                className={`${styles.codeBtn} ${styles.codeYellow}`}
                onClick={() => handleTriggerCode('Rapid Medical Response (Acute Deterioration)')}
              >
                <div className={styles.codeTitle}>⚠️ Medical Rapid Response Team (MET)</div>
                <div className={styles.codeDesc}>
                  Sudden drop in oxygen saturation (&lt;88%), acute arrhythmia, or severe hypertension alert.
                </div>
              </button>

              <button
                type="button"
                className={`${styles.codeBtn} ${styles.codeOrange}`}
                onClick={() => handleTriggerCode('Emergency On-Call Physician Summons')}
              >
                <div className={styles.codeTitle}>🩺 Page On-Duty Lead Specialist (Doctor 1)</div>
                <div className={styles.codeDesc}>
                  Urgent bedside clinical consult and stat medication dosage adjustment.
                </div>
              </button>
            </div>
          </div>
        )}

        <div className={styles.footer}>
          <span className={styles.emergencyNote}>
            All emergency activations are logged into hospital audit records.
          </span>
          <button type="button" className={styles.cancelBtn} onClick={onClose}>
            Cancel / Stand Down
          </button>
        </div>
      </div>
    </div>
  );
}
