// components/ui/Toast.tsx
import { useEffect, useState } from 'react';
import styles from './Toast.module.css';

interface ToastMsg { id: number; text: string; }
let _listeners: ((msg: string) => void)[] = [];
export function showToast(msg: string) { _listeners.forEach(fn => fn(msg)); }

export default function Toast() {
  const [toasts, setToasts] = useState<ToastMsg[]>([]);
  let _seq = 0;

  useEffect(() => {
    const handler = (msg: string) => {
      const id = ++_seq;
      setToasts(p => [...p, { id, text: msg }]);
      setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 2600);
    };
    _listeners.push(handler);
    return () => { _listeners = _listeners.filter(fn => fn !== handler); };
  }, []);

  return (
    <div className={styles.container}>
      {toasts.map(t => (
        <div key={t.id} className={styles.toast}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
          {t.text}
        </div>
      ))}
    </div>
  );
}
