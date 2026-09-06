// components/ui/Switch.tsx
import styles from './Switch.module.css';

interface Props { on: boolean; onToggle: () => void; }

export default function Switch({ on, onToggle }: Props) {
  return (
    <div className={`${styles.sw} ${on ? styles.on : ''}`} onClick={onToggle} role="switch" aria-checked={on} tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onToggle()}>
      <div className={styles.knob}></div>
    </div>
  );
}
