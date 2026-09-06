// pages/Alerts/SeverityFilterChips.tsx
import type { AlertSeverity } from '../../types/alert';
import styles from './alerts.module.css';

type Filter = 'all' | AlertSeverity;
interface Props { active: Filter; onChange: (f: Filter) => void; }

const CHIPS: { label: string; value: Filter }[] = [
  { label: 'All',      value: 'all' },
  { label: 'Critical', value: 'critical' },
  { label: 'Watch',    value: 'watch' },
  { label: 'Info',     value: 'info' },
];

export default function SeverityFilterChips({ active, onChange }: Props) {
  return (
    <div className={styles.chips}>
      {CHIPS.map(c => (
        <button
          key={c.value}
          className={`${styles.chip} ${active === c.value ? styles.chipActive : ''}`}
          onClick={() => onChange(c.value)}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}
