// pages/Alerts/AlertRow.tsx
import type { Alert } from '../../types/alert';
import { timeAgo } from '../../utils/formatters';
import { useAlertContext } from '../../context/AlertContext';
import { showToast } from '../../components/ui/Toast.tsx';
import styles from './alerts.module.css';

const ESCALATION_LABELS: Record<string, string> = {
  tier1:     'Staff Check',
  tier2:     'Nurse Review',
  escalated: 'Doctor 1 Review',
};

interface Props { alert: Alert; }

export default function AlertRow({ alert: a }: Props) {
  const { acknowledgeAlert } = useAlertContext();

  const handleAck = () => {
    acknowledgeAlert(a.id);
    showToast(`Alert for ${a.text} marked as checked.`);
  };

  return (
    <div className={`${styles.row} ${a.acked ? styles.acked : ''}`}>
      <div className={`${styles.urgencyBar} ${styles[a.severity]}`}></div>
      <div className={`${styles.sev} ${styles[a.severity]}`}></div>
      <div className={styles.body}>
        <div className={styles.text}>{a.text}</div>
        <div className={styles.rowsub}>{a.sub} · {timeAgo(a.time)}</div>
        <div className={styles.audit}>Reference: {a.auditId} · Recorded safely for care team</div>
      </div>
      <span className={`${styles.escalation} ${styles[a.escalation]}`}>
        {ESCALATION_LABELS[a.escalation]}
      </span>
      <button
        className={`${styles.ackBtn} ${a.acked ? styles.done : ''}`}
        onClick={!a.acked ? handleAck : undefined}
        disabled={a.acked}
      >
        {a.acked ? '✓ Checked' : 'Mark as Checked'}
      </button>
    </div>
  );
}
