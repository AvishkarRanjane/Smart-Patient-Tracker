// components/ui/StatusRing.tsx
import type { StatusColor } from '../../utils/vitalStatus';
import styles from './StatusRing.module.css';

interface Props {
  status: StatusColor;
  size?:  number;
  label?: string;
}

export default function StatusRing({ status, size = 44, label }: Props) {
  const defaultLabel = status === 'stable' ? 'OK' : status === 'watch' ? '!' : '!!';
  return (
    <div
      className={`${styles.ring} ${styles[status]}`}
      style={{ width: size, height: size, fontSize: size < 48 ? '12.5px' : '10.5px' }}
    >
      {label ?? defaultLabel}
    </div>
  );
}
