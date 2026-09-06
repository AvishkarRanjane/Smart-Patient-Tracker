// pages/Settings/SettingsPage.tsx
import { useState } from 'react';
import { useThresholds } from '../../hooks/useThresholds';
import AlarmInventoryTable from './AlarmInventoryTable.tsx';
import DowntimeProtocolCard from './DowntimeProtocolCard.tsx';
import Switch from '../../components/ui/Switch.tsx';
import { showToast } from '../../components/ui/Toast.tsx';
import PageTransition from '../../components/layout/PageTransition.tsx';
import styles from './settings.module.css';
import type { Thresholds } from '../../types/threshold';

export default function SettingsPage() {
  const { thresholds, update } = useThresholds();
  const [local, setLocal]             = useState<Thresholds>(thresholds);
  const [sustainedFilter, setSustained] = useState(true);
  const [mlSuggestions, setMlSugg]    = useState(true);

  const save = () => { update(local); showToast('Threshold settings saved'); };
  const setT = (key: keyof Thresholds, val: number) => setLocal(p => ({ ...p, [key]: val }));

  const SLIDERS: { key: keyof Thresholds; label: string; min: number; max: number; step: number }[] = [
    { key: 'hrLow',    label: 'HR Low',    min: 30,  max: 70,  step: 1   },
    { key: 'hrHigh',   label: 'HR High',   min: 80,  max: 160, step: 1   },
    { key: 'spo2Min',  label: 'SpO₂ Min',  min: 80,  max: 95,  step: 1   },
    { key: 'sbpHigh',  label: 'SBP High',  min: 120, max: 190, step: 1   },
    { key: 'rrHigh',   label: 'RR High',   min: 18,  max: 36,  step: 1   },
    { key: 'tempHigh', label: 'Temp High', min: 37,  max: 40,  step: 0.1 },
  ];

  return (
    <PageTransition>
      <div className={styles.head}>
        <h1 className={styles.title}>Safety Controls &amp; Settings</h1>
        <p className={styles.sub}>Vital alert limits · emergency backup plan · doctor preferences</p>
      </div>

      <div className={styles.twoCol}>
        <div className={`${styles.card} glass`}>
          <div className={styles.cardTitle}>Vital Safety Limits (Doctor 1)</div>
          {SLIDERS.map(({ key, label, min, max, step }) => (
            <div key={key} className={styles.sliderRow}>
              <div className={styles.sliderLabel}>{label}</div>
              <input
                type="range" min={min} max={max} step={step}
                value={local[key]}
                onChange={e => setT(key, Number(e.target.value))}
                className={styles.slider}
              />
              <div className={styles.sliderVal}>{local[key]}</div>
            </div>
          ))}
          <button className={styles.saveBtn} onClick={save}>Save Limits</button>
        </div>

        <div className={`${styles.card} glass`}>
          <div className={styles.cardTitle}>Smart Alarm Filters</div>
          <div className={styles.toggleRow}>
            <div>
              <div className={styles.toggleLabel}>Accidental Bump Filter</div>
              <div className={styles.toggleSub}>Prevents alarms from temporary arm movement or sensor touches</div>
            </div>
            <Switch on={sustainedFilter} onToggle={() => {
              setSustained(p => !p);
              showToast(`Accidental bump filter ${!sustainedFilter ? 'enabled' : 'disabled'}`);
            }} />
          </div>
          <div className={styles.toggleRow}>
            <div>
              <div className={styles.toggleLabel}>AI Health Score Assistance</div>
              <div className={styles.toggleSub}>Show continuous health prediction scores for Doctor 1 review</div>
            </div>
            <Switch on={mlSuggestions} onToggle={() => {
              setMlSugg(p => !p);
              showToast(`AI health scores ${!mlSuggestions ? 'enabled' : 'disabled'}`);
            }} />
          </div>
          <div className={styles.auditNote}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            All setting changes are recorded safely with timestamp and user name.
          </div>
        </div>
      </div>

      <AlarmInventoryTable />
      <DowntimeProtocolCard />
    </PageTransition>
  );
}
