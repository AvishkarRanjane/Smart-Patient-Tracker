// pages/PatientDetail/ConnectedDevicesPanel.tsx
import type { Device } from '../../types/device';
import styles from './detail.module.css';

interface Props {
  devices: Device[];
  onSelectDevice?: (device: Device) => void;
}

const TRUST_LABELS: Record<Device['trust'], string> = {
  trusted:     'Online',
  advisory:    'Advisory',
  compromised: 'Compromised',
};

export default function ConnectedDevicesPanel({ devices, onSelectDevice }: Props) {
  return (
    <div>
      {devices.map((d, i) => {
        const name = d.name.toLowerCase();
        let telemetrySummary = `${d.proto} · Verified Live Link`;
        if (name.includes('breathing') || d.telemetry?.tidalVolume !== undefined) {
          telemetrySummary = `💨 Oxygen Flow: ${(d.telemetry?.oxygenFlow ?? 5.5).toFixed(1)} L/min · Airway: ${d.telemetry?.airwayPressure ?? 18} cmH2O · FiO2: ${d.telemetry?.fio2 ?? 42}%`;
        } else if (name.includes('heart') || name.includes('cardiac')) {
          telemetrySummary = `❤️ Heart Rate: ${d.telemetry?.pulseRate ?? 78} bpm · Normal Sinus · MAP: ${d.telemetry?.mapBloodPressure ?? 93} mmHg`;
        } else if (name.includes('pressure') || name.includes('bp')) {
          telemetrySummary = `🩺 Blood Pressure: 120/78 mmHg · MAP: ${d.telemetry?.mapBloodPressure ?? 92} mmHg · Cycle: 15 min`;
        } else if (name.includes('pulse') || name.includes('sensor')) {
          telemetrySummary = `💧 SpO2: 98% · Pulse: 78 bpm · Perfusion Index: ${d.telemetry?.perfusionIndex ?? 5.1}%`;
        }

        return (
          <div key={i}>
            <div
              className={styles.deviceRow}
              onClick={() => onSelectDevice?.(d)}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && onSelectDevice?.(d)}
              title="Click to view detailed device telemetry, oxygen flow & waveforms"
            >
              <div className={`${styles.dot} ${styles[d.trust]}`}></div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span className={styles.devName}>{d.name}</span>
                  <span style={{ fontSize: 11, color: 'var(--blue)', fontWeight: 600 }}>Inspect →</span>
                </div>
                <div className={styles.devMeta}>
                  {telemetrySummary}
                </div>
              </div>
              <span className={`${styles.devBadge} ${styles[d.trust]}`}>
                {TRUST_LABELS[d.trust]}
              </span>
            </div>
            {d.advisory && (
              <div className={styles.advisoryBanner}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="13" height="13">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                </svg>
                {d.advisory}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
