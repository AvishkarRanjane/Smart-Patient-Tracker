// components/ui/GlassCard.tsx
import type { ReactNode, CSSProperties } from 'react';
import styles from './GlassCard.module.css';

interface Props {
  children:   ReactNode;
  className?: string;
  style?:     CSSProperties;
  onClick?:   () => void;
  strong?:    boolean;
}

export default function GlassCard({ children, className = '', style, onClick, strong }: Props) {
  return (
    <div
      className={`${strong ? 'glass-strong' : 'glass'} ${styles.card} ${className}`}
      style={style}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
