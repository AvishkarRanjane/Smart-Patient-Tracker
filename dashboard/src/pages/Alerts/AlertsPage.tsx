// pages/Alerts/AlertsPage.tsx
import { useState } from 'react';
import { useAlertContext } from '../../context/AlertContext';
import AlertRow from './AlertRow.tsx';
import SeverityFilterChips from './SeverityFilterChips.tsx';
import PageTransition from '../../components/layout/PageTransition.tsx';
import type { AlertSeverity } from '../../types/alert';
import styles from './alerts.module.css';

type Filter = 'all' | AlertSeverity;

export default function AlertsPage() {
  const { alerts, unackedCount } = useAlertContext();
  const [filter, setFilter] = useState<Filter>('all');

  const filtered = alerts.filter(a => filter === 'all' || a.severity === filter);

  return (
    <PageTransition>
      <div className={styles.head}>
        <div>
          <h1 className={styles.title}>Safety Alerts Log</h1>
          <p className={styles.subtext}>Live safety notifications · reviewed by Doctor 1 and Ward Staff</p>
        </div>
        <div className={styles.badge}>
          Needs Check: <strong style={{ color: 'var(--coral)' }}>{unackedCount}</strong>
        </div>
      </div>
      <SeverityFilterChips active={filter} onChange={setFilter} />
      <div className={`${styles.panel} glass`}>
        {filtered.length
          ? filtered.map(a => <AlertRow key={a.id} alert={a} />)
          : <div className={styles.empty}>No alerts in this category. Ward is peaceful &amp; safe.</div>
        }
      </div>
    </PageTransition>
  );
}
