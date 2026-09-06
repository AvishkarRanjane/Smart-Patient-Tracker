// pages/Trends/TrendsPage.tsx
import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { useWardSocket } from '../../hooks/useWardSocket';
import { useAlertContext } from '../../context/AlertContext';
import { useSystemHealth } from '../../hooks/useSystemHealth';
import { fmt1 } from '../../utils/formatters';
import { VITAL_LABELS, VITAL_COLORS, VITAL_UNITS } from '../../utils/constants';
import PageTransition from '../../components/layout/PageTransition';
import styles from './trends.module.css';

const VITAL_KEYS = ['hr','spo2','sbp','rr','temp'];

export default function TrendsPage() {
  const patients = useWardSocket();
  const { alerts } = useAlertContext();
  const health = useSystemHealth();
  const [vk, setVk] = useState('hr');

  // Build per-patient trend data
  const trendData = (patients[0]?.history[vk as keyof typeof patients[0]['history']] || []).map((_, i) => {
    const point: Record<string, number|string> = { i };
    patients.forEach(p => {
      const h = p.history[vk as keyof typeof p.history];
      if (h) point[p.bed] = fmt1(h[i] ?? 0);
    });
    return point;
  });

  // Alarm-rate per hour bars
  const hourWindow = Date.now() - 3_600_000;
  const alarmRate = alerts.filter(a => a.time > hourWindow).length / Math.max(patients.length, 1);
  const alarmBar = [
    { label: 'This hour', value: fmt1(alarmRate) },
    { label: 'Target',    value: 1 },
  ];

  return (
    <PageTransition>
      <div className={styles.head}>
        <div>
          <h1 className={styles.title}>Vital Health Trends</h1>
          <p className={styles.sub}>Ward vital charts · safety tracking · live network status</p>
        </div>
      </div>

      {/* Canary panel */}
      <div className={`${styles.canaryCard} glass`}>
        <div className={styles.canaryTitle}>System Network &amp; Live Data Health</div>
        <div className={styles.canaryGrid}>
          <div className={styles.canaryMetric}><div className={styles.metaLabel}>Connection Speed</div><div className={styles.metaVal}>{health.canaryRtt}<span className={styles.metaUnit}> ms</span></div></div>
          <div className={styles.canaryMetric}><div className={styles.metaLabel}>Peak Response</div><div className={styles.metaVal}>{health.canaryP95}<span className={styles.metaUnit}> ms</span></div></div>
          <div className={styles.canaryMetric}><div className={styles.metaLabel}>Live Stream</div><div className={`${styles.metaVal} ${health.pipelineUp ? styles.mint : styles.coral}`}>{health.pipelineUp ? '● Connected' : '● Reconnecting'}</div></div>
          <div className={styles.canaryMetric}><div className={styles.metaLabel}>Reliability (30d)</div><div className={styles.metaVal}>{health.uptimePct}</div></div>
        </div>
      </div>

      {/* Vital selector + chart */}
      <div className={`${styles.panel} glass`}>
        <div className={styles.panelHead}>
          <span className={styles.panelTitle}>Ward-wide {VITAL_LABELS[vk]} ({VITAL_UNITS[vk]})</span>
          <div className={styles.tabs}>
            {VITAL_KEYS.map(k => (
              <button key={k} className={`${styles.tab} ${vk === k ? styles.active : ''}`} onClick={() => setVk(k)}>
                {VITAL_LABELS[k]}
              </button>
            ))}
          </div>
        </div>
        <div className={styles.chartWrap}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData} margin={{ top: 4, right: 16, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(28,35,49,0.06)" />
              <XAxis dataKey="i" hide />
              <YAxis tick={{ fontSize: 11, fill: '#8A93A3', fontFamily: 'Inter' }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid rgba(255,255,255,.9)', background: 'rgba(255,255,255,.88)', backdropFilter: 'blur(12px)', fontSize: 12 }} />
              {patients.map((p, i) => (
                <Line key={p.id} type="monotone" dataKey={p.bed} stroke={[VITAL_COLORS[vk], '#8C7CF0', '#F5A93F', '#FF5C6C', '#2FBD85', '#4C8DFF'][i % 6]} strokeWidth={2} dot={false} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Alarm rate bar */}
      <div className={`${styles.alarmCard} glass`}>
        <div className={styles.panelTitle}>Safety Alert Rate vs. Standard Target</div>
        <div className={styles.alarmRow}>
          <div className={styles.alarmStat}>
            <div className={styles.alarmNum} style={{ color: alarmRate < 1 ? '#1c8a5f' : alarmRate < 2 ? '#b8791f' : '#c73a48' }}>{fmt1(alarmRate)}</div>
            <div className={styles.alarmLabel}>alerts/patient (this hour)</div>
          </div>
          <div className={styles.alarmTarget}>
            <div className={styles.alarmNum} style={{ color: '#1c8a5f' }}>1.0</div>
            <div className={styles.alarmLabel}>Hospital Safety Target</div>
          </div>
        </div>
        <div className={styles.barWrap}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={alarmBar} layout="vertical" margin={{ top: 0, right: 20, left: 70, bottom: 0 }}>
              <XAxis type="number" tick={{ fontSize: 11, fill: '#8A93A3' }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="label" tick={{ fontSize: 11, fill: '#8A93A3' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 10, fontSize: 12 }} />
              <Bar dataKey="value" fill={alarmRate < 1 ? '#2FBD85' : '#F5A93F'} radius={[0, 8, 8, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </PageTransition>
  );
}
