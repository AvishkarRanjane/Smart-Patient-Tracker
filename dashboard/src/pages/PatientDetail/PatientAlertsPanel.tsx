// pages/PatientDetail/PatientAlertsPanel.tsx
import type { Alert } from '../../types/alert';
import { timeAgo } from '../../utils/formatters';
import styles from './detail.module.css';

interface Props { alerts: Alert[]; }

export default function PatientAlertsPanel({ alerts }: Props) {
  const recent = alerts.slice(0, 8);
  if (!recent.length) {
    return <div className={styles.emptyState}>No recent alerts for this patient.</div>;
  }
  return (
    <div>
      {recent.map(a => (
        <div key={a.id} className={styles.alertItem}>
          <div className={`${styles.alertSev} ${styles[a.severity]}`}></div>
          <div>
            <div className={styles.alertText}>{a.text.split(' — ')[1] ?? a.text}</div>
            <div className={styles.alertSub}>
              {timeAgo(a.time)} · {a.auditId} · {a.acked ? 'Acknowledged' : 'Pending ack'}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
