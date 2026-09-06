// context/AlertContext.tsx
import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { Alert } from '../types/alert';

interface AlertCtx {
  alerts:       Alert[];
  addAlert:     (a: Alert) => void;
  acknowledgeAlert: (id: number) => void;
  unackedCount: number;
  criticalUnacked: number;
}

const AlertContext = createContext<AlertCtx>({
  alerts: [], addAlert: () => {}, acknowledgeAlert: () => {}, unackedCount: 0, criticalUnacked: 0,
});

export function AlertProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const addAlert = useCallback((a: Alert) => {
    setAlerts(prev => [a, ...prev].slice(0, 80));
  }, []);

  const acknowledgeAlert = useCallback((id: number) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, acked: true } : a));
  }, []);

  const unackedCount    = alerts.filter(a => !a.acked).length;
  const criticalUnacked = alerts.filter(a => !a.acked && a.severity === 'critical').length;

  return (
    <AlertContext.Provider value={{ alerts, addAlert, acknowledgeAlert, unackedCount, criticalUnacked }}>
      {children}
    </AlertContext.Provider>
  );
}

export function useAlertContext() { return useContext(AlertContext); }
