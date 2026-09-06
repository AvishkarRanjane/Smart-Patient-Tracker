// pages/Overview/KpiRow.tsx
import type { Patient } from '../../types/patient';
import { vitalStatus } from '../../utils/vitalStatus';
import GlassCard from '../../components/ui/GlassCard.tsx';
import styles from './overview.module.css';

interface Props { patients: Patient[]; }

export default function KpiRow({ patients }: Props) {
  let stable = 0, watch = 0, critical = 0;
  patients.forEach(p => {
    const s = vitalStatus(p.vitals);
    if (s === 'stable') stable++;
    else if (s === 'watch') watch++;
    else critical++;
  });

  return (
    <div className={styles.kpiRow}>
      <GlassCard className={styles.kpiCard}>
        <div className={styles.kpiLabel}>Total Patients</div>
        <div className={`${styles.kpiValue} ${styles.blue}`}>{patients.length}</div>
        <div className={styles.kpiSub}>resting in ICU Ward 4</div>
      </GlassCard>
      <GlassCard className={styles.kpiCard}>
        <div className={styles.kpiLabel}>Stable &amp; Healthy</div>
        <div className={`${styles.kpiValue} ${styles.mint}`}>{stable}</div>
        <div className={styles.kpiSub}>all vital signs normal</div>
      </GlassCard>
      <GlassCard className={styles.kpiCard}>
        <div className={styles.kpiLabel}>Needs Check</div>
        <div className={`${styles.kpiValue} ${styles.amber}`}>{watch}</div>
        <div className={styles.kpiSub}>routine check advised</div>
      </GlassCard>
      <GlassCard className={styles.kpiCard}>
        <div className={styles.kpiLabel}>Immediate Help</div>
        <div className={`${styles.kpiValue} ${styles.coral}`}>{critical}</div>
        <div className={styles.kpiSub}>doctor attention needed</div>
      </GlassCard>
      <GlassCard className={styles.kpiCard}>
        <div className={styles.kpiLabel}>Safety Status</div>
        <div className={`${styles.kpiValue} ${critical === 0 ? styles.mint : styles.coral}`}>
          {critical === 0 ? '100%' : 'Alert'}
        </div>
        <div className={styles.kpiSub}>{critical === 0 ? 'all patients safe & steady' : 'active nurse review'}</div>
      </GlassCard>
    </div>
  );
}
