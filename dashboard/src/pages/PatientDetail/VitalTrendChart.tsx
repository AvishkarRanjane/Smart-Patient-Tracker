// pages/PatientDetail/VitalTrendChart.tsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { Patient } from '../../types/patient';
import { VITAL_LABELS, VITAL_COLORS, VITAL_UNITS } from '../../utils/constants';
import { fmt1 } from '../../utils/formatters';
import styles from './detail.module.css';

interface Props { patient: Patient; vitalKey: string; }

export default function VitalTrendChart({ patient, vitalKey }: Props) {
  const history = patient.history[vitalKey as keyof typeof patient.history] ?? [];
  const data    = history.map((v, i) => ({ i, value: fmt1(v) }));
  const color   = VITAL_COLORS[vitalKey] ?? '#4C8DFF';

  return (
    <div className={`${styles.chartCard} glass`}>
      <div className={styles.chartHead}>
        <span className={styles.chartTitle}>{VITAL_LABELS[vitalKey]} — live trend</span>
        <span className={styles.chartSub}>last {data.length} readings · updates every 2s</span>
      </div>
      <div className={styles.chartWrap}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(28,35,49,0.06)" />
            <XAxis dataKey="i" hide />
            <YAxis
              tick={{ fontSize: 11, fill: '#8A93A3', fontFamily: 'Inter' }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: '1px solid rgba(255,255,255,.9)',
                background: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(12px)',
                fontSize: 12,
              }}
              formatter={(value: any) => [`${value ?? ''} ${VITAL_UNITS[vitalKey]}`, VITAL_LABELS[vitalKey]]}
              labelFormatter={() => ''}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
