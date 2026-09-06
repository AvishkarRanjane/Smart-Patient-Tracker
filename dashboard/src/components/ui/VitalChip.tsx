// components/ui/VitalChip.tsx
import styles from './VitalChip.module.css';

interface Props { value: string; unit: string; icon: React.ReactNode; }

export default function VitalChip({ value, unit, icon }: Props) {
  return (
    <div className={styles.chip}>
      {icon}
      <div>
        <span className={styles.num}>{value}</span>
        <span className={styles.unit}> {unit}</span>
      </div>
    </div>
  );
}
