import { useState } from 'react';
import type { Device } from '../../types/device';
import type { Patient } from '../../types/patient';
import { useWardSocket } from '../../hooks/useWardSocket';
import DeviceGatewayCard from './DeviceGatewayCard.tsx';
import DeviceTelemetryModal from '../../components/devices/DeviceTelemetryModal.tsx';
import PageTransition from '../../components/layout/PageTransition.tsx';
import styles from './devices.module.css';

export default function DevicesPage() {
  const patients   = useWardSocket();
  const allDevices = patients.flatMap(p => p.devices.map(d => ({ device: d, patient: p })));
  const online     = allDevices.filter(({ device: d }) => d.trust === 'trusted').length;
  const advisory   = allDevices.filter(({ device: d }) => d.trust === 'advisory').length;

  const [selectedDevice, setSelectedDevice] = useState<{ device: Device; patient: Patient } | null>(null);
  const [filter, setFilter] = useState<'all' | 'breathing' | 'cardiac' | 'bp'>('all');

  const filteredDevices = allDevices.filter(({ device: d }) => {
    const name = d.name.toLowerCase();
    if (filter === 'breathing') return name.includes('breathing') || d.telemetry?.tidalVolume !== undefined;
    if (filter === 'cardiac') return name.includes('heart') || name.includes('cardiac');
    if (filter === 'bp') return name.includes('pressure') || name.includes('bp') || name.includes('pulse');
    return true;
  });

  return (
    <PageTransition>
      <div className={styles.head}>
        <div>
          <h1 className={styles.title}>Connected Medical Equipment</h1>
          <p className={styles.sub}>Bedside monitors &amp; sensors · monitored in real-time under Doctor 1 supervision</p>
        </div>
        <div className={styles.counts}>
          <span style={{ color: '#1c8a5f' }}>● {online} Working Normally</span>
          <span style={{ color: '#b8791f' }}>● {advisory} Check Advised</span>
        </div>
      </div>

      {/* Equipment Category Filter Tabs */}
      <div className={styles.filterTabs}>
        <button
          type="button"
          className={`${styles.filterTab} ${filter === 'all' ? styles.filterTabActive : ''}`}
          onClick={() => setFilter('all')}
        >
          All Equipment ({allDevices.length})
        </button>
        <button
          type="button"
          className={`${styles.filterTab} ${filter === 'breathing' ? styles.filterTabActive : ''}`}
          onClick={() => setFilter('breathing')}
        >
          💨 Breathing &amp; Ventilators (Oxygen Flow)
        </button>
        <button
          type="button"
          className={`${styles.filterTab} ${filter === 'cardiac' ? styles.filterTabActive : ''}`}
          onClick={() => setFilter('cardiac')}
        >
          ❤️ Cardiac &amp; Heart Monitors
        </button>
        <button
          type="button"
          className={`${styles.filterTab} ${filter === 'bp' ? styles.filterTabActive : ''}`}
          onClick={() => setFilter('bp')}
        >
          🩺 Blood Pressure &amp; Sensors
        </button>
      </div>

      <div className={styles.grid}>
        {filteredDevices.map(({ device, patient }, i) => (
          <DeviceGatewayCard
            key={i}
            device={device}
            patient={patient}
            onSelect={(d, p) => setSelectedDevice({ device: d, patient: p })}
          />
        ))}
      </div>

      <DeviceTelemetryModal
        device={selectedDevice?.device ?? null}
        patientName={selectedDevice?.patient.name}
        roomBed={`Room ${selectedDevice?.patient.bed}`}
        onClose={() => setSelectedDevice(null)}
      />
    </PageTransition>
  );
}

