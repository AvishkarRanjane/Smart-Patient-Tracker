// components/devices/DeviceTelemetryModal.tsx
import { useState } from 'react';
import type { Device, DeviceTelemetry } from '../../types/device';
import { showToast } from '../ui/Toast.tsx';
import styles from './modal.module.css';

interface Props {
  device: Device | null;
  patientName?: string;
  roomBed?: string;
  onClose: () => void;
}

type DeviceCategory = 'ventilator' | 'cardiac' | 'blood_pressure' | 'oximeter' | 'multi';

function getDeviceCategory(name: string, tel?: DeviceTelemetry): DeviceCategory {
  const n = name.toLowerCase();
  if (n.includes('breathing') || n.includes('ventilator') || (tel?.tidalVolume !== undefined)) {
    return 'ventilator';
  }
  if (n.includes('heart') || n.includes('cardiac')) {
    return 'cardiac';
  }
  if (n.includes('pressure') || n.includes('cuff') || (n.includes('blood') && !n.includes('multi'))) {
    return 'blood_pressure';
  }
  if (n.includes('pulse') || n.includes('oximeter') || n.includes('finger')) {
    return 'oximeter';
  }
  return 'multi';
}

export default function DeviceTelemetryModal({ device, patientName, roomBed, onClose }: Props) {
  const [testing, setTesting] = useState(false);
  const [activeTab, setActiveTab] = useState<'telemetry' | 'diagnostics'>('telemetry');

  if (!device) return null;

  const tel = device.telemetry;
  const category = getDeviceCategory(device.name, tel);

  const handleSelfTest = () => {
    setTesting(true);
    setTimeout(() => {
      setTesting(false);
      showToast(`Diagnostic check completed for ${device.name}. All sensors aligned.`);
    }, 1200);
  };

  const handleCalibrate = () => {
    showToast(`Calibration request registered for ${device.name} under Doctor 1 supervision.`);
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headLeft}>
            <div className={`${styles.deviceIcon} ${styles[device.trust]}`}>
              {category === 'ventilator' && (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="24" height="24">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              )}
              {category === 'cardiac' && (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="24" height="24">
                  <path d="M3 12h4l2-8 4 16 2-8h6" />
                </svg>
              )}
              {category === 'blood_pressure' && (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="24" height="24">
                  <circle cx="12" cy="13" r="7" />
                  <path d="M12 6V3M9 3h6" />
                </svg>
              )}
              {category === 'oximeter' && (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="24" height="24">
                  <path d="M12 21s-7-4.4-9.3-9C1 8 2.6 4 6.6 4c2 0 3.6 1.2 4.4 2.7C11.8 5.2 13.4 4 15.4 4 19.4 4 21 8 19.3 12 17 16.6 12 21 12 21z" />
                </svg>
              )}
              {category === 'multi' && (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" width="24" height="24">
                  <rect x="4" y="4" width="16" height="12" rx="2" />
                  <path d="M8 20h8M12 16v4" />
                </svg>
              )}
            </div>
            <div>
              <div className={styles.titleRow}>
                <h2 className={styles.title}>{device.name}</h2>
                <span className={`${styles.trustBadge} ${styles[device.trust]}`}>
                  {device.trust === 'trusted' ? '● Verified Safe & Online' : device.trust === 'advisory' ? '▲ Routine Check Scheduled' : '✕ Paused for Inspection'}
                </span>
              </div>
              <div className={styles.subtitle}>
                Hardware ID: {tel?.serialNumber || 'SN-MED-7741'} · {device.proto}
                {patientName && ` · Assigned to ${patientName} (${roomBed || 'ICU'})`}
              </div>
            </div>
          </div>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Advisory if present */}
        {device.advisory && (
          <div className={styles.advisoryAlert}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
            </svg>
            <span>{device.advisory}</span>
          </div>
        )}

        {/* Quick Nav Tabs */}
        <div className={styles.tabNav}>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === 'telemetry' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('telemetry')}
          >
            Live Readings &amp; Telemetry
          </button>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === 'diagnostics' ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab('diagnostics')}
          >
            Hardware Specs &amp; Diagnostics
          </button>
        </div>

        {activeTab === 'telemetry' && (
          <>
            {/* 1. VENTILATOR / BREATHING EQUIPMENT DISPLAY */}
            {category === 'ventilator' && (
              <div className={`${styles.primaryDisplayCard} ${styles.ventilatorTheme}`}>
                <div className={styles.primaryHead}>
                  <div>
                    <span className={styles.primaryBadge}>Active Mechanical Ventilation</span>
                    <h3 className={styles.primaryTitle}>Continuous Oxygen Flow &amp; Airway Mechanics</h3>
                    <p className={styles.primarySub}>Supplying pressurized oxygen directly to patient airway</p>
                  </div>
                  <div className={styles.flowRateBox}>
                    <div className={styles.flowNumber}>
                      {(tel?.oxygenFlow ?? 5.5).toFixed(1)} <span className={styles.flowUnit}>L/min</span>
                    </div>
                    <span className={styles.flowLabel}>Live Oxygen Flow Rate</span>
                  </div>
                </div>

                {/* Animated Breathing Waveform */}
                <div className={styles.waveWrap}>
                  <div className={styles.waveHeader}>
                    <span>Airway Pressure Curve (Paw)</span>
                    <span>16 Breaths / min · PEEP: {tel?.peepPressure ?? 6} cmH2O</span>
                  </div>
                  <svg className={styles.waveSvg} viewBox="0 0 500 50" preserveAspectRatio="none">
                    <path
                      d="M0,40 Q30,10 60,15 T120,40 L160,40 Q190,10 220,15 T280,40 L320,40 Q350,10 380,15 T440,40 L500,40"
                      fill="none"
                      stroke="#2FBD85"
                      strokeWidth="2.5"
                    />
                  </svg>
                </div>

                {/* Respiratory Telemetry Grid */}
                <div className={styles.paramGrid}>
                  <div className={styles.paramItem}>
                    <span className={styles.paramLabel}>Tidal Volume (Vt)</span>
                    <span className={styles.paramVal}>{tel?.tidalVolume ?? 460} <span className={styles.paramUnit}>mL</span></span>
                    <span className={styles.paramSub}>Delivered per breath</span>
                  </div>

                  <div className={styles.paramItem}>
                    <span className={styles.paramLabel}>Airway Pressure (PIP)</span>
                    <span className={styles.paramVal}>{tel?.airwayPressure ?? 18} <span className={styles.paramUnit}>cmH2O</span></span>
                    <span className={styles.paramSub}>Safe (&lt; 25 cmH2O)</span>
                  </div>

                  <div className={styles.paramItem}>
                    <span className={styles.paramLabel}>PEEP Pressure</span>
                    <span className={styles.paramVal}>{tel?.peepPressure ?? 6} <span className={styles.paramUnit}>cmH2O</span></span>
                    <span className={styles.paramSub}>Alveoli stabilization</span>
                  </div>

                  <div className={styles.paramItem}>
                    <span className={styles.paramLabel}>Delivered O2 (FiO2)</span>
                    <span className={styles.paramVal}>{tel?.fio2 ?? 42} <span className={styles.paramUnit}>%</span></span>
                    <span className={styles.paramSub}>Inspired oxygen purity</span>
                  </div>

                  <div className={styles.paramItem}>
                    <span className={styles.paramLabel}>I:E Ratio</span>
                    <span className={styles.paramVal}>1 : 2.0</span>
                    <span className={styles.paramSub}>Inspiratory / Expiratory</span>
                  </div>

                  <div className={styles.paramItem}>
                    <span className={styles.paramLabel}>Minute Ventilation</span>
                    <span className={styles.paramVal}>7.4 <span className={styles.paramUnit}>L/min</span></span>
                    <span className={styles.paramSub}>Total gas exchanged</span>
                  </div>
                </div>
              </div>
            )}

            {/* 2. CARDIAC / HEART MONITOR DISPLAY */}
            {category === 'cardiac' && (
              <div className={`${styles.primaryDisplayCard} ${styles.cardiacTheme}`}>
                <div className={styles.primaryHead}>
                  <div>
                    <span className={styles.primaryBadge}>Bedside Electrocardiography (ECG)</span>
                    <h3 className={styles.primaryTitle}>Live Cardiac Rhythm &amp; Pulse Stream</h3>
                    <p className={styles.primarySub}>Continuous 5-lead arrhythmia &amp; ST-segment detection</p>
                  </div>
                  <div className={styles.flowRateBox} style={{ borderColor: 'rgba(76, 141, 255, 0.35)' }}>
                    <div className={styles.flowNumber} style={{ color: 'var(--blue)' }}>
                      {tel?.pulseRate ?? 78} <span className={styles.flowUnit}>bpm</span>
                    </div>
                    <span className={styles.flowLabel}>Heart Beat Rate</span>
                  </div>
                </div>

                {/* Animated ECG Waveform */}
                <div className={styles.waveWrap}>
                  <div className={styles.waveHeader}>
                    <span>Lead II · Normal Sinus Rhythm (NSR)</span>
                    <span>QRS: 88 ms · ST: +0.02 mV</span>
                  </div>
                  <svg className={styles.waveSvg} viewBox="0 0 500 50" preserveAspectRatio="none">
                    <path
                      d="M0,25 L40,25 L50,22 L55,28 L60,25 L75,25 L80,10 L85,45 L90,20 L95,25 L115,25 L125,20 L135,25 L175,25 L185,22 L190,28 L195,25 L210,25 L215,10 L220,45 L225,20 L230,25 L250,25 L260,20 L270,25 L310,25 L320,22 L325,28 L330,25 L345,25 L350,10 L355,45 L360,20 L365,25 L385,25 L395,20 L405,25 L450,25"
                      fill="none"
                      stroke="#4C8DFF"
                      strokeWidth="2.2"
                    />
                  </svg>
                </div>

                {/* Cardiac Telemetry Grid */}
                <div className={styles.paramGrid}>
                  <div className={styles.paramItem}>
                    <span className={styles.paramLabel}>Cardiac Rhythm</span>
                    <span className={styles.paramVal} style={{ fontSize: 16 }}>Normal Sinus</span>
                    <span className={styles.paramSub}>No ectopy detected</span>
                  </div>

                  <div className={styles.paramItem}>
                    <span className={styles.paramLabel}>Blood Pressure Sync</span>
                    <span className={styles.paramVal}>{tel?.mapBloodPressure ? `${tel.mapBloodPressure + 28}/${tel.mapBloodPressure - 15}` : '120/78'} <span className={styles.paramUnit}>mmHg</span></span>
                    <span className={styles.paramSub}>MAP: {tel?.mapBloodPressure ?? 92} mmHg</span>
                  </div>

                  <div className={styles.paramItem}>
                    <span className={styles.paramLabel}>Perfusion Index</span>
                    <span className={styles.paramVal}>{tel?.perfusionIndex ?? 4.8} <span className={styles.paramUnit}>%</span></span>
                    <span className={styles.paramSub}>Strong pulse wave</span>
                  </div>

                  <div className={styles.paramItem}>
                    <span className={styles.paramLabel}>QTc Interval</span>
                    <span className={styles.paramVal}>410 <span className={styles.paramUnit}>ms</span></span>
                    <span className={styles.paramSub}>Normal repolarization</span>
                  </div>

                  <div className={styles.paramItem}>
                    <span className={styles.paramLabel}>Respiration Rate</span>
                    <span className={styles.paramVal}>16 <span className={styles.paramUnit}>/min</span></span>
                    <span className={styles.paramSub}>Impedance pneumogram</span>
                  </div>

                  <div className={styles.paramItem}>
                    <span className={styles.paramLabel}>Nasal Cannula Oxygen</span>
                    <span className={styles.paramVal}>{(tel?.oxygenFlow ?? 2.0).toFixed(1)} <span className={styles.paramUnit}>L/min</span></span>
                    <span className={styles.paramSub}>Low-flow supplemental</span>
                  </div>
                </div>
              </div>
            )}

            {/* 3. BLOOD PRESSURE TRACKER DISPLAY */}
            {category === 'blood_pressure' && (
              <div className={`${styles.primaryDisplayCard} ${styles.bpTheme}`}>
                <div className={styles.primaryHead}>
                  <div>
                    <span className={styles.primaryBadge}>Automated Non-Invasive BP (NIBP)</span>
                    <h3 className={styles.primaryTitle}>Arterial Pressure &amp; Vascular Tone</h3>
                    <p className={styles.primarySub}>Oscillometric pneumatic cuff measurement</p>
                  </div>
                  <div className={styles.flowRateBox} style={{ borderColor: 'rgba(140, 124, 240, 0.35)' }}>
                    <div className={styles.flowNumber} style={{ color: 'var(--lavender)' }}>
                      120 / 78 <span className={styles.flowUnit}>mmHg</span>
                    </div>
                    <span className={styles.flowLabel}>Systolic / Diastolic</span>
                  </div>
                </div>

                {/* Blood Pressure Telemetry Grid */}
                <div className={styles.paramGrid}>
                  <div className={styles.paramItem}>
                    <span className={styles.paramLabel}>Mean Arterial Pressure (MAP)</span>
                    <span className={styles.paramVal}>{tel?.mapBloodPressure ?? 92} <span className={styles.paramUnit}>mmHg</span></span>
                    <span className={styles.paramSub}>Optimal perfusion (70–105)</span>
                  </div>

                  <div className={styles.paramItem}>
                    <span className={styles.paramLabel}>Systolic Reading</span>
                    <span className={styles.paramVal}>120 <span className={styles.paramUnit}>mmHg</span></span>
                    <span className={styles.paramSub}>Peak cardiac ejection</span>
                  </div>

                  <div className={styles.paramItem}>
                    <span className={styles.paramLabel}>Diastolic Reading</span>
                    <span className={styles.paramVal}>78 <span className={styles.paramUnit}>mmHg</span></span>
                    <span className={styles.paramSub}>Resting vascular tone</span>
                  </div>

                  <div className={styles.paramItem}>
                    <span className={styles.paramLabel}>Pulse Pressure</span>
                    <span className={styles.paramVal}>42 <span className={styles.paramUnit}>mmHg</span></span>
                    <span className={styles.paramSub}>Arterial compliance normal</span>
                  </div>

                  <div className={styles.paramItem}>
                    <span className={styles.paramLabel}>Cuff Auto-Cycle</span>
                    <span className={styles.paramVal} style={{ fontSize: 16 }}>Every 15 min</span>
                    <span className={styles.paramSub}>Next cycle in 6 mins</span>
                  </div>

                  <div className={styles.paramItem}>
                    <span className={styles.paramLabel}>Cuff Inflation Status</span>
                    <span className={styles.paramVal} style={{ fontSize: 16, color: '#1c8a5f' }}>Deflated · Ready</span>
                    <span className={styles.paramSub}>Zero limb pressure</span>
                  </div>
                </div>
              </div>
            )}

            {/* 4. PULSE & OXIMETER DISPLAY */}
            {category === 'oximeter' && (
              <div className={`${styles.primaryDisplayCard} ${styles.oximeterTheme}`}>
                <div className={styles.primaryHead}>
                  <div>
                    <span className={styles.primaryBadge}>Continuous Pulse Oximetry</span>
                    <h3 className={styles.primaryTitle}>Blood Oxygen Saturation (SpO2)</h3>
                    <p className={styles.primarySub}>Optical dual-wavelength spectrophotometry</p>
                  </div>
                  <div className={styles.flowRateBox} style={{ borderColor: 'rgba(47, 189, 133, 0.35)' }}>
                    <div className={styles.flowNumber} style={{ color: '#1c8a5f' }}>
                      98 <span className={styles.flowUnit}>%</span>
                    </div>
                    <span className={styles.flowLabel}>SpO2 Oxygen Purity</span>
                  </div>
                </div>

                <div className={styles.paramGrid}>
                  <div className={styles.paramItem}>
                    <span className={styles.paramLabel}>Perfusion Index (PI)</span>
                    <span className={styles.paramVal}>{tel?.perfusionIndex ?? 5.1} <span className={styles.paramUnit}>%</span></span>
                    <span className={styles.paramSub}>Strong capillary pulsatility</span>
                  </div>

                  <div className={styles.paramItem}>
                    <span className={styles.paramLabel}>Pulse Rate</span>
                    <span className={styles.paramVal}>{tel?.pulseRate ?? 78} <span className={styles.paramUnit}>bpm</span></span>
                    <span className={styles.paramSub}>Synchronized with ECG</span>
                  </div>

                  <div className={styles.paramItem}>
                    <span className={styles.paramLabel}>Signal Quality</span>
                    <span className={styles.paramVal} style={{ fontSize: 16 }}>100% Reliable</span>
                    <span className={styles.paramSub}>Zero optical motion noise</span>
                  </div>

                  <div className={styles.paramItem}>
                    <span className={styles.paramLabel}>Supplemental Flow</span>
                    <span className={styles.paramVal}>{(tel?.oxygenFlow ?? 2.5).toFixed(1)} <span className={styles.paramUnit}>L/min</span></span>
                    <span className={styles.paramSub}>Finger sensor correlation</span>
                  </div>
                </div>
              </div>
            )}

            {/* 5. MULTI-VITAL CENTRAL HUB DISPLAY */}
            {category === 'multi' && (
              <div className={`${styles.primaryDisplayCard} ${styles.multiTheme}`}>
                <div className={styles.primaryHead}>
                  <div>
                    <span className={styles.primaryBadge}>Bedside Multi-Parameter Hub</span>
                    <h3 className={styles.primaryTitle}>Synchronized Patient Monitor Matrix</h3>
                    <p className={styles.primarySub}>Aggregating ECG, SpO2, NIBP, and Airway telemetry</p>
                  </div>
                  <div className={styles.flowRateBox}>
                    <div className={styles.flowNumber} style={{ fontSize: 24, color: 'var(--blue)' }}>
                      All Vitals Normal
                    </div>
                    <span className={styles.flowLabel}>Central Ward Sync</span>
                  </div>
                </div>

                <div className={styles.paramGrid}>
                  <div className={styles.paramItem}>
                    <span className={styles.paramLabel}>Heart Rate</span>
                    <span className={styles.paramVal}>78 <span className={styles.paramUnit}>bpm</span></span>
                    <span className={styles.paramSub}>Normal Rhythm</span>
                  </div>

                  <div className={styles.paramItem}>
                    <span className={styles.paramLabel}>Oxygen Saturation</span>
                    <span className={styles.paramVal}>98 <span className={styles.paramUnit}>%</span></span>
                    <span className={styles.paramSub}>Optimal Delivery</span>
                  </div>

                  <div className={styles.paramItem}>
                    <span className={styles.paramLabel}>Blood Pressure</span>
                    <span className={styles.paramVal}>120/78 <span className={styles.paramUnit}>mmHg</span></span>
                    <span className={styles.paramSub}>MAP: 92 mmHg</span>
                  </div>

                  <div className={styles.paramItem}>
                    <span className={styles.paramLabel}>Oxygen Flow Rate</span>
                    <span className={styles.paramVal}>{(tel?.oxygenFlow ?? 3.0).toFixed(1)} <span className={styles.paramUnit}>L/min</span></span>
                    <span className={styles.paramSub}>Assisted support</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'diagnostics' && (
          <div className={styles.diagGrid}>
            <div className={styles.diagItem}>
              <span className={styles.diagLabel}>Hardware Serial Number</span>
              <span className={styles.diagVal}>{tel?.serialNumber || 'SN-MED-9941'}</span>
              <span className={styles.diagSub}>Manufacturer ID Verified</span>
            </div>

            <div className={styles.diagItem}>
              <span className={styles.diagLabel}>Operating Mode</span>
              <span className={styles.diagVal}>{tel?.operatingMode || 'Continuous Safe Monitoring'}</span>
              <span className={styles.diagSub}>Active ICU Preset</span>
            </div>

            <div className={styles.diagItem}>
              <span className={styles.diagLabel}>Battery &amp; Power Source</span>
              <span className={styles.diagVal}>{tel?.batteryLevel ?? 98}% (AC Mains Connected)</span>
              <span className={styles.diagSub}>Battery backup ready</span>
            </div>

            <div className={styles.diagItem}>
              <span className={styles.diagLabel}>Signal Reliability</span>
              <span className={styles.diagVal}>{tel?.signalQuality || '100% Signal Integrity'}</span>
              <span className={styles.diagSub}>0% packet loss</span>
            </div>

            <div className={styles.diagItem}>
              <span className={styles.diagLabel}>Last Calibration</span>
              <span className={styles.diagVal}>{tel?.lastCalibrated || 'Today, 06:00 AM'}</span>
              <span className={styles.diagSub}>Certified by Medical Eng.</span>
            </div>

            <div className={styles.diagItem}>
              <span className={styles.diagLabel}>Firmware Version</span>
              <span className={styles.diagVal}>{device.fw}</span>
              <span className={styles.diagSub}>Hospital Security Patch v4.2</span>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className={styles.footer}>
          <div className={styles.actionsLeft}>
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={handleSelfTest}
              disabled={testing}
            >
              {testing ? 'Running Sensor Check...' : 'Run Diagnostics Self-Test'}
            </button>
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={handleCalibrate}
            >
              Calibrate Sensor
            </button>
          </div>
          <button type="button" className={styles.primaryBtn} onClick={onClose}>
            Close Device Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
