// pages/Settings/DowntimeProtocolCard.tsx
import styles from './settings.module.css';

const STEPS = [
  { num: '1', text: 'Acknowledge system downtime in paper log — timestamp + signature.', tag: 'Immediate' },
  { num: '2', text: 'Assign manual vital signs every 15 min per nurse (paper bedside chart).', tag: 'Within 2 min' },
  { num: '3', text: 'Notify charge nurse. Activate orange "DOWNTIME" binders at nurses station.', tag: 'Within 3 min' },
  { num: '4', text: 'Do NOT rely on any algorithmic ML advisory scores during downtime.', tag: 'Critical' },
  { num: '5', text: 'Contact on-call biomedical engineer if devices report connectivity errors.', tag: 'Within 5 min' },
  { num: '6', text: 'After recovery, enter all paper vitals into system for retroactive record; close downtime log.', tag: 'Post-recovery' },
];

export default function DowntimeProtocolCard() {
  return (
    <div className={`${styles.card} glass`} style={{ marginTop: 16, border: '2px solid var(--amber-soft)' }}>
      <div className={styles.downtimeHead}>
        <svg viewBox="0 0 24 24" fill="none" stroke="var(--amber)" strokeWidth="2" width="16" height="16"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        <span className={styles.downtimeTitle}>Downtime Protocol — DHHS Compliant</span>
        <span className={styles.drillBadge}>Last drill: 2026-07-22</span>
      </div>
      <p className={styles.downtimeSub}>Downtime is a designed mode — not a failure. Follow these steps in sequence.</p>
      <div className={styles.steps}>
        {STEPS.map(s => (
          <div key={s.num} className={styles.step}>
            <div className={styles.stepNum}>{s.num}</div>
            <div className={styles.stepBody}>
              <div className={styles.stepText}>{s.text}</div>
              <span className={`${styles.stepTag} ${s.tag === 'Critical' ? styles.coral : s.tag === 'Immediate' ? styles.blue : styles.amber}`}>{s.tag}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
