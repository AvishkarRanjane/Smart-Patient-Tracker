// pages/PatientDetail/PatientDetailPage.tsx
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import type { Device } from '../../types/device';
import { useWardSocket } from '../../hooks/useWardSocket';
import { vitalStatus, mlScoreLabel } from '../../utils/vitalStatus';
import { useAlertContext } from '../../context/AlertContext';
import VitalTiles from './VitalTiles.tsx';
import VitalTrendChart from './VitalTrendChart.tsx';
import ConnectedDevicesPanel from './ConnectedDevicesPanel.tsx';
import PatientAlertsPanel from './PatientAlertsPanel.tsx';
import StatusRing from '../../components/ui/StatusRing.tsx';
import Badge from '../../components/ui/Badge.tsx';
import DeviceTelemetryModal from '../../components/devices/DeviceTelemetryModal.tsx';
import PatientTimetable from '../../components/patient/PatientTimetable.tsx';
import DailyReportsArchive from '../../components/patient/DailyReportsArchive.tsx';
import FamilyMessageDesk from '../../components/patient/FamilyMessageDesk.tsx';
import RapidResponseModal from '../../components/patient/RapidResponseModal.tsx';
import PageTransition from '../../components/layout/PageTransition.tsx';
import { useMessages } from '../../context/MessageContext';
import styles from './detail.module.css';

export default function PatientDetailPage() {
  const { id }   = useParams<{ id: string }>();
  const patients = useWardSocket();
  const navigate = useNavigate();
  const { getMessages } = useMessages();
  const { alerts } = useAlertContext();
  const [selectedVital, setSelectedVital] = useState('hr');
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'timetable' | 'reports' | 'handoff'>('overview');
  const [rapidModalOpen, setRapidModalOpen] = useState(false);

  const p = patients.find(x => x.id === Number(id));
  if (!p) return <div className={styles.notFound}>Patient not found.</div>;

  const s       = vitalStatus(p.vitals);
  const ml      = mlScoreLabel(p.mlScore);
  const pAlerts = alerts.filter(a => a.patientId === p.id);
  const patientMessages = getMessages(p.id);

  return (
    <PageTransition>
      <button className={styles.backBtn} onClick={() => navigate('/')}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
        Back to Ward
      </button>

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.avatar}>P{p.id + 1}</div>
        <div>
          <div className={styles.name}>{p.name}</div>
          <div className={styles.sub}>
            Room {p.bed} · Age {p.age} · Diagnosis: {p.diagnosis} · Admitted: {p.admitDate}
          </div>
        </div>
        <div className={styles.statusWrap}>
          <StatusRing status={s} />
          <div>
            <div className={styles.statusLabel}>
              {s === 'critical' ? 'Needs Immediate Check' : s === 'watch' ? 'Close Observation' : 'Stable Condition'}
            </div>
            <div className={styles.mlLabel}>
              Advisory score: <span style={{ fontWeight: 700 }}>{ml.label}</span>
            </div>
          </div>
        </div>

        {/* Emergency Rapid Response Button */}
        <button
          type="button"
          className={styles.rapidBtn}
          onClick={() => setRapidModalOpen(true)}
          title="Trigger Emergency Code Blue or Rapid Response Team"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
          🚨 Emergency Rapid Response
        </button>
      </div>

      {/* Section Navigation Tabs */}
      <div className={styles.tabNav}>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'overview' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          🩺 Clinical Overview
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'timetable' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('timetable')}
        >
          🕒 Daily Care Timetable ({p.schedule.length})
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'reports' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          📄 24-Hour Daily Reports Archive ({p.dailyReports.length})
        </button>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'handoff' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('handoff')}
        >
          💬 Shift Handoff &amp; Family Messages ({patientMessages.length})
        </button>
      </div>

      {/* TAB 1: CLINICAL OVERVIEW */}
      {activeTab === 'overview' && (
        <>
          {/* Hospital Admission, Surgery & Care Journey */}
          <div className={`${styles.admissionCard} glass`}>
            <div className={styles.admitCardHead}>
              <div className={styles.admitTitle}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2.2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                Hospital Admission &amp; Clinical Journey Record
              </div>
              <Badge variant={p.visitingHours.isOpen ? 'mint' : 'neutral'}>
                {p.visitingHours.isOpen ? '● Visiting Open Now' : '○ Visiting Window Closed'}
              </Badge>
            </div>

            <div className={styles.admitGrid}>
              <div className={styles.admitItem}>
                <span className={styles.admitLabel}>Admit / Join Date</span>
                <span className={styles.admitVal}>{p.admitDate}</span>
                <span className={styles.admitSub}>Admitted under Doctor 1</span>
              </div>

              <div className={styles.admitItem}>
                <span className={styles.admitLabel}>Operation / Procedure</span>
                <span className={styles.admitVal}>{p.operationDate ? p.operationDate : 'No Surgery Needed'}</span>
                <span className={styles.admitSub}>
                  {p.operationName ? `${p.operationName} · ${p.operationStatus}` : 'Medical observation care'}
                </span>
              </div>

              <div className={styles.admitItem}>
                <span className={styles.admitLabel}>Expected Exit / Discharge</span>
                <span className={styles.admitVal}>{p.expectedExitDate}</span>
                <span className={styles.admitSub}>Doctor 1 review required</span>
              </div>

              <div className={styles.admitItem}>
                <span className={styles.admitLabel}>Nutrition &amp; Diet</span>
                <span className={styles.admitVal}>{p.dietStatus}</span>
                <span className={styles.admitSub}>Supervised by Staff 1</span>
              </div>
            </div>

            <div className={styles.admitExtra}>
              <div className={styles.careSummaryBox}>
                <strong style={{ color: 'var(--blue)', display: 'block', marginBottom: 4 }}>
                  Current Clinical Condition &amp; Treatment Plan:
                </strong>
                {p.careSummary}
              </div>
              <div>
                <span className={styles.admitLabel}>Prescribed Medications:</span>
                <div className={styles.medsWrap}>
                  {p.medications.map((m, idx) => (
                    <span key={idx} className={styles.medPill}>💊 {m}</span>
                  ))}
                </div>
                <div style={{ marginTop: 10, fontSize: 11.5, color: 'var(--ink-faint)' }}>
                  Visiting Window: <strong>{p.visitingHours.currentWindow}</strong> (Max {p.visitingHours.maxVisitors} visitors)
                </div>
              </div>
            </div>
          </div>

          <VitalTiles patient={p} selected={selectedVital} onSelect={setSelectedVital} />
          <VitalTrendChart patient={p} vitalKey={selectedVital} />

          <div className={styles.twoCol}>
            <div className={`${styles.panel} glass`}>
              <div className={styles.panelTitle}>AI Health Prediction</div>
              <div className={styles.mlPanel}>
                <div className={styles.mlHead}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#8C7CF0" strokeWidth="2" width="16" height="16">
                    <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"/>
                  </svg>
                  <span className={styles.mlLabel}>Patient Health Score</span>
                  <span className={styles.mlTag}>Safety Check</span>
                </div>
                <div className={styles.mlScore}>
                  <span
                    className={styles.mlVal}
                    style={{ color: ml.cls === 'high' ? 'var(--coral)' : ml.cls === 'elevated' ? 'var(--amber)' : '#6550d4' }}
                  >
                    {p.mlScore}
                  </span>
                  <span className={styles.mlScoreLabel}>/ 100 · {ml.label}</span>
                </div>
                <p className={styles.mlDisclaimer}>
                  Summary: Vital signs are stable and continuous monitoring is active under Doctor 1 supervision.
                </p>
              </div>

              <div className={styles.panelTitle} style={{ marginTop: 22 }}>
                Connected Bedside Equipment (Click to Inspect Telemetry)
              </div>
              <ConnectedDevicesPanel devices={p.devices} onSelectDevice={setSelectedDevice} />
            </div>

            <div className={`${styles.panel} glass`}>
              <div className={styles.panelTitle}>Recent Safety Alerts — {p.name}</div>
              <PatientAlertsPanel alerts={pAlerts} />
            </div>
          </div>
        </>
      )}

      {/* TAB 2: DAILY TIMETABLE */}
      {activeTab === 'timetable' && (
        <PatientTimetable
          schedule={p.schedule}
          isStaff={true}
          patientName={p.name}
        />
      )}

      {/* TAB 3: 24-HOUR DAILY REPORTS ARCHIVE */}
      {activeTab === 'reports' && (
        <DailyReportsArchive
          dailyReports={p.dailyReports}
          patientName={p.name}
          roomBed={`Room ${p.bed}`}
          admitDate={p.admitDate}
          currentVitals={p.vitals}
          isStaff={true}
        />
      )}

      {/* TAB 4: SHIFT HANDOFF & FAMILY MESSAGES */}
      {activeTab === 'handoff' && (
        <div>
          {/* Shift Handoff Card */}
          {p.shiftHandoffs && p.shiftHandoffs.length > 0 && (
            <div className={`${styles.shiftCard} glass`}>
              <div className={styles.shiftHead}>
                <div className={styles.shiftTitle}>
                  📋 Clinical Shift Handoff Record
                </div>
                <span className={styles.shiftTime}>{p.shiftHandoffs[0].timestamp}</span>
              </div>
              <div className={styles.shiftGrid}>
                <div className={styles.shiftBox}>
                  <span className={styles.shiftBoxLabel}>Physician Handoff (Doctor 1)</span>
                  <p className={styles.shiftBoxText}>"{p.shiftHandoffs[0].doctorNote}"</p>
                </div>
                <div className={styles.shiftBox}>
                  <span className={styles.shiftBoxLabel}>Nursing Handoff (Staff 1)</span>
                  <p className={styles.shiftBoxText}>"{p.shiftHandoffs[0].nurseNote}"</p>
                </div>
              </div>
              <div className={styles.shiftFooter}>
                <span>Outgoing: <strong>{p.shiftHandoffs[0].outgoingStaff}</strong></span>
                <span>Incoming: <strong>{p.shiftHandoffs[0].incomingStaff}</strong></span>
              </div>
            </div>
          )}

          {/* Family Message Desk */}
          <FamilyMessageDesk
            patientId={p.id}
            patientName={p.name}
            isStaff={true}
          />
        </div>
      )}

      {/* Device Telemetry Modal */}
      <DeviceTelemetryModal
        device={selectedDevice}
        patientName={p.name}
        roomBed={`Room ${p.bed}`}
        onClose={() => setSelectedDevice(null)}
      />

      {/* Rapid Response Modal */}
      <RapidResponseModal
        isOpen={rapidModalOpen}
        patientName={p.name}
        roomBed={`Room ${p.bed}`}
        onClose={() => setRapidModalOpen(false)}
      />
    </PageTransition>
  );
}


