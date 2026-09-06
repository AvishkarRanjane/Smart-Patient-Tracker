// pages/Settings/AlarmInventoryTable.tsx
import styles from './settings.module.css';

const INVENTORY = [
  { type: 'Tachycardia',          threshold: 'HR > 120 bpm',    owner: 'Dr. Patel (Cardiology)',    lastReview: '2026-08-15', status: 'Active' },
  { type: 'Bradycardia',          threshold: 'HR < 50 bpm',     owner: 'Dr. Patel (Cardiology)',    lastReview: '2026-08-15', status: 'Active' },
  { type: 'Hypoxia',              threshold: 'SpO₂ < 90%',       owner: 'Dr. Osei (Pulmonology)',   lastReview: '2026-08-10', status: 'Active' },
  { type: 'Hypertensive crisis',  threshold: 'SBP > 170 mmHg',  owner: 'Dr. Li (Nephrology)',      lastReview: '2026-07-28', status: 'Review' },
  { type: 'Tachypnea',            threshold: 'RR > 26/min',     owner: 'Dr. Osei (Pulmonology)',   lastReview: '2026-08-01', status: 'Active' },
  { type: 'Hyperthermia',         threshold: 'Temp > 38.4°C',   owner: 'Nursing (ICU)',            lastReview: '2026-08-20', status: 'Active' },
  { type: 'Low SpO₂ device noise', threshold: 'SpO₂ < 88% (motion)', owner: 'Dr. Osei (Pulmonology)', lastReview: '2026-06-15', status: 'Deprecated' },
];

const STATUS_CLASSES: Record<string, string> = { Active: 'mint', Review: 'amber', Deprecated: 'coral' };

export default function AlarmInventoryTable() {
  return (
    <div className={`${styles.card} glass`} style={{ marginTop: 16 }}>
      <div className={styles.cardTitle}>Alarm Inventory</div>
      <p className={styles.cardSub}>Per-alarm ownership, clinical justification, and review dates</p>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Alarm Type</th><th>Threshold</th><th>Owner</th><th>Last Review</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            {INVENTORY.map((r, i) => (
              <tr key={i}>
                <td className={styles.tdBold}>{r.type}</td>
                <td className={styles.tdMono}>{r.threshold}</td>
                <td>{r.owner}</td>
                <td>{r.lastReview}</td>
                <td><span className={`${styles.statusBadge} ${styles[STATUS_CLASSES[r.status] || 'mint']}`}>{r.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
