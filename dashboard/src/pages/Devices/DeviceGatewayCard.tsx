// pages/Devices/DeviceGatewayCard.tsx
import type { Device } from '../../types/device';
import type { Patient } from '../../types/patient';
import styles from './devices.module.css';

interface Props {
  device: Device;
  patient: Patient;
  onSelect?: (device: Device, patient: Patient) => void;
}

const TRUST_ICON: Record<Device['trust'], string>  = { trusted: '✓', advisory: '⚠', compromised: '✕' };
const TRUST_LABEL: Record<Device['trust'], string> = { trusted: 'Working Safe', advisory: 'Check Soon', compromised: 'Paused' };
const TRUST_STROKE: Record<Device['trust'], string> = {
  trusted:     'var(--blue)',
  advisory:    'var(--amber)',
  compromised: 'var(--coral)',
};

export default function DeviceGatewayCard({ device: d, patient: p, onSelect }: Props) {
  return (
    <div
      className={`${styles.card} glass`}
      onClick={() => onSelect?.(d, p)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && onSelect?.(d, p)}
      title="Click to view live device readings & oxygen flow"
    >
      <div className={styles.cardHead}>
        <div className={`${styles.icon} ${styles[d.trust]}`}>
          <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" stroke={TRUST_STROKE[d.trust]} width="20" height="20">
            <rect x="4" y="4" width="16" height="12" rx="2"/>
            <path d="M8 20h8M12 16v4"/>
          </svg>
        </div>
        <div>
          <div className={styles.devName}>{d.name}</div>
          <div className={styles.devPatient}>{p.name} · Room {p.bed}</div>
        </div>
        <span className={`${styles.trust} ${styles[d.trust]}`}>
          {TRUST_ICON[d.trust]} {TRUST_LABEL[d.trust]}
        </span>
      </div>

      <div className={styles.meta}>
        <div><div className={styles.metaLabel}>Connection</div><div className={styles.metaVal}>{d.proto}</div></div>
        <div><div className={styles.metaLabel}>Software</div><div className={styles.metaVal}>{d.fw}</div></div>
        <div><div className={styles.metaLabel}>Monitors</div><div className={styles.metaVal} style={{ fontSize: 11 }}>{d.reads}</div></div>
        <div><div className={styles.metaLabel}>Security</div><div className={styles.metaVal} style={{ fontSize: 11 }}>Verified Safe</div></div>
      </div>

      {/* Device-Specific Live Telemetry Highlight */}
      <div className={styles.liveMetricsCard}>
        {d.name.toLowerCase().includes('breathing') || d.telemetry?.tidalVolume !== undefined ? (
          <>
            <div className={styles.metricTitle}>
              <span>💨 Oxygen Flow Delivery</span>
              <span style={{ color: '#1c8a5f', fontWeight: 800 }}>Regulated Flow</span>
            </div>
            <div className={styles.metricMainRow}>
              <span className={styles.metricValBig} style={{ color: '#1c8a5f' }}>
                {(d.telemetry?.oxygenFlow ?? 5.5).toFixed(1)} L/min
              </span>
              <span style={{ fontSize: 11.5, color: 'var(--ink-faint)', fontWeight: 600 }}>
                FiO2: {d.telemetry?.fio2 ?? 42}%
              </span>
            </div>
            <div className={styles.metricSubLine}>
              Airway: {d.telemetry?.airwayPressure ?? 18} cmH2O · Tidal: {d.telemetry?.tidalVolume ?? 460} mL · PEEP: {d.telemetry?.peepPressure ?? 6}
            </div>
          </>
        ) : d.name.toLowerCase().includes('heart') || d.name.toLowerCase().includes('cardiac') ? (
          <>
            <div className={styles.metricTitle}>
              <span>❤️ Cardiac Stream</span>
              <span style={{ color: 'var(--blue)', fontWeight: 800 }}>Lead II Active</span>
            </div>
            <div className={styles.metricMainRow}>
              <span className={styles.metricValBig} style={{ color: 'var(--blue)' }}>
                {d.telemetry?.pulseRate ?? 78} bpm
              </span>
              <span style={{ fontSize: 11.5, color: 'var(--ink-faint)', fontWeight: 600 }}>
                Normal Sinus
              </span>
            </div>
            <div className={styles.metricSubLine}>
              ST: +0.02 mV · MAP: {d.telemetry?.mapBloodPressure ?? 93} mmHg · Respiration: 16 /min
            </div>
          </>
        ) : d.name.toLowerCase().includes('pressure') || d.name.toLowerCase().includes('bp') ? (
          <>
            <div className={styles.metricTitle}>
              <span>🩺 NIBP Cuff Monitor</span>
              <span style={{ color: 'var(--lavender)', fontWeight: 800 }}>Auto Cycle</span>
            </div>
            <div className={styles.metricMainRow}>
              <span className={styles.metricValBig} style={{ color: 'var(--lavender)' }}>
                120 / 78 mmHg
              </span>
              <span style={{ fontSize: 11.5, color: 'var(--ink-faint)', fontWeight: 600 }}>
                MAP: {d.telemetry?.mapBloodPressure ?? 92}
              </span>
            </div>
            <div className={styles.metricSubLine}>
              Pulse: 76 bpm · Next cycle in 6 mins · Cuff deflated
            </div>
          </>
        ) : d.name.toLowerCase().includes('pulse') || d.name.toLowerCase().includes('sensor') ? (
          <>
            <div className={styles.metricTitle}>
              <span>💧 Oximetry &amp; Pulse</span>
              <span style={{ color: '#1c8a5f', fontWeight: 800 }}>High Quality</span>
            </div>
            <div className={styles.metricMainRow}>
              <span className={styles.metricValBig} style={{ color: '#1c8a5f' }}>
                98% SpO2
              </span>
              <span style={{ fontSize: 11.5, color: 'var(--ink-faint)', fontWeight: 600 }}>
                Pulse: 78 bpm
              </span>
            </div>
            <div className={styles.metricSubLine}>
              Perfusion Index: {d.telemetry?.perfusionIndex ?? 5.1}% · Supplemental: {(d.telemetry?.oxygenFlow ?? 2.5).toFixed(1)} L/min
            </div>
          </>
        ) : (
          <>
            <div className={styles.metricTitle}>
              <span>📊 Multi-Vital Central Link</span>
              <span style={{ color: 'var(--blue)', fontWeight: 800 }}>All Normal</span>
            </div>
            <div className={styles.metricMainRow}>
              <span className={styles.metricValBig}>Synchronized</span>
              <span style={{ fontSize: 11.5, color: 'var(--ink-faint)', fontWeight: 600 }}>Ward Sync</span>
            </div>
            <div className={styles.metricSubLine}>
              HR: 78 · SpO2: 98% · BP: 120/78 · Airway: 15 cmH2O
            </div>
          </>
        )}
      </div>

      <button type="button" className={styles.telemetryBtn}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
        Inspect Device Telemetry &amp; Flow Readings →
      </button>

      <div className={styles.footer}>
        <div className={`${styles.egress} ${d.trust === 'compromised' ? styles.blocked : ''}`}>
          <div className={`${styles.egressDot} ${d.trust === 'compromised' ? styles.blocked : ''}`}></div>
          Status: {d.trust === 'compromised' ? 'Paused for Safety Check' : 'Active & Connected'}
        </div>
        <div className={styles.lastCheck}>
          {d.trust === 'trusted' ? 'Working normally · Checked 12s ago' : 'Scheduled check by Doctor 1'}
        </div>
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
}
