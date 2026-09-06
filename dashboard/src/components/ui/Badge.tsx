// components/ui/Badge.tsx
import type { ReactNode } from 'react';
import styles from './Badge.module.css';

type Variant = 'blue' | 'mint' | 'amber' | 'coral' | 'lavender' | 'neutral';

interface Props { children: ReactNode; variant?: Variant; }

export default function Badge({ children, variant = 'neutral' }: Props) {
  return <span className={`${styles.badge} ${styles[variant]}`}>{children}</span>;
}
