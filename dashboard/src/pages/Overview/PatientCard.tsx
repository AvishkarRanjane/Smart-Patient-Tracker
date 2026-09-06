// pages/Overview/PatientCard.tsx
import type { Patient } from '../../types/patient';
import { vitalStatus, mlScoreLabel } from '../../utils/vitalStatus';
import { fmt1, timeAgo } from '../../utils/formatters';
import StatusRing from '../../components/ui/StatusRing';
import styles from './overview.module.css';

// Inline SVG icons — avoids JSX.Element namespace issue
function HrIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="13" height="13">
      <path d="M3 12h4l2-8 4 16 2-8h6"/>
    </svg>
  );
}
function Spo2Icon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13">
      <path d="M12 21s-7-4.4-9.3-9C1 8 2.6 4 6.6 4c2 0 3.6 1.2 4.4 2.7C11.8 5.2 13.4 4 15.4 4 19.4 4 21 8 19.3 12 17 16.6 12 21 12 21z"/>
    </svg>
  );
}
function BpIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13">
      <circle cx="12" cy="13" r="7"/><path d="M12 6V3M9 3h6"/>
    </svg>
  );
}
function TempIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="13" height="13">
      <path d="M14 14.76V4a2 2 0 0 0-4 0v10.76a4 4 0 1 0 4 0z"/>
    </svg>
  );
}

interface Props { patient: Patient; onClick: () => void; }

export default function PatientCard({ patient: p, onClick }: Props) {
  const s  = vitalStatus(p.vitals);
  const v  = p.vitals;
  const ml = mlScoreLabel(p.mlScore);
  const mlCls = ml.cls === 'high' ? styles.ml_high : ml.cls === 'elevated' ? styles.ml_elevated : styles.mlChip;

  return (
    <div className={`${styles.card} glass`} onClick={onClick}>
      <div className={styles.cardTop}>
        <StatusRing status={s} size={46} />
        <div>
          <div className={styles.cardName}>{p.name}</div>
          <div className={styles.cardBed}>Room {p.bed} · Age {p.age}</div>
        </div>
      </div>
      <div className={styles.cardDx}>{p.diagnosis}</div>
      <div className={styles.vitalsGrid}>
        <div className={styles.vitalChip}>
          <HrIcon />
          <span className={styles.vitalNum}>{fmt1(v.hr)}<span className={styles.vitalUnit}> bpm</span></span>
        </div>
        <div className={styles.vitalChip}>
          <Spo2Icon />
          <span className={styles.vitalNum}>{fmt1(v.spo2)}<span className={styles.vitalUnit}> %</span></span>
        </div>
        <div className={styles.vitalChip}>
          <BpIcon />
          <span className={styles.vitalNum}>{Math.round(v.sbp)}/{Math.round(v.dbp)}<span className={styles.vitalUnit}> mmHg</span></span>
        </div>
        <div className={styles.vitalChip}>
          <TempIcon />
          <span className={styles.vitalNum}>{fmt1(v.temp)}<span className={styles.vitalUnit}> °C</span></span>
        </div>
      </div>
      <div className={styles.cardFoot}>
        <span className={styles.updated}>Live · {timeAgo(p.lastUpdate)}</span>
        <span className={mlCls}>Health Score: {p.mlScore} ({ml.label})</span>
      </div>
    </div>
  );
}
