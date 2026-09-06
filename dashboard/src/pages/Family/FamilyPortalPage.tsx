// pages/Family/FamilyPortalPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useWardSocket } from '../../hooks/useWardSocket';
import { vitalStatus } from '../../utils/vitalStatus';
import { fmt1 } from '../../utils/formatters';
import { showToast } from '../../components/ui/Toast.tsx';
import PatientTimetable from '../../components/patient/PatientTimetable';
import DailyReportsArchive from '../../components/patient/DailyReportsArchive';
import FamilyMessageDesk from '../../components/patient/FamilyMessageDesk';
import { useMessages } from '../../context/MessageContext';
import styles from './family.module.css';

const DOCTOR_NOTES: Record<number, string> = {
  0: 'Person 1 had a peaceful morning and is recovering steadily from heart procedure care. Vitals are completely stable and resting calmly.',
  1: 'Person 2 is responding well to breathing support with regulated oxygen flow. Oxygen levels have remained solid throughout the day. Rest is currently prioritized.',
  2: 'Person 3 is making wonderful progress post-surgery. Pain levels are controlled, vitals are within normal range, and vitals check completed.',
  3: 'Person 4 is doing well during general observation. Responsive, comfortable, and all indicators are healthy.',
  4: 'Person 5 continues to heal smoothly following accident care. Stable cardiac rhythm, healthy oxygenation, resting quietly.',
  5: 'Person 6 is stable under comfort care. Lung airflow is steady and no abnormal alerts have occurred.',
};

export default function FamilyPortalPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const patients = useWardSocket(2000);
  const { getMessages, sendMessage } = useMessages();
  const [activeTab, setActiveTab] = useState<'overview' | 'timetable' | 'reports' | 'messages'>('overview');

  // Each family member only sees their respective patient
  const patientId = user?.patientId ?? 0;
  const p = patients[patientId] || patients[0];
  const familyMessages = getMessages(patientId);

  if (!p) {
    return <div className={styles.container}>Loading patient information...</div>;
  }

  const s = vitalStatus(p.vitals);
  const isHealthy = s === 'stable';
  const statusText = isHealthy
    ? 'Stable & Resting Comfortably'
    : s === 'watch'
    ? 'Under Routine Close Monitoring'
    : 'Receiving Immediate Doctor Care';

  // Find if any device is providing oxygen support
  const oxygenDevice = p.devices.find(d => d.telemetry?.oxygenFlow && d.telemetry.oxygenFlow > 0);
  const oxygenFlow = oxygenDevice?.telemetry?.oxygenFlow;

  const handleSignOut = () => {
    logout();
    showToast('Signed out from Family Portal');
    navigate('/login');
  };

  const handleDoctorCall = () => {
    sendMessage(patientId, 'Urgent: Family has requested a physician callback regarding patient condition.');
    setActiveTab('messages');
    showToast(`Request posted for Doctor 1 regarding ${p.name}. Check the Message Desk.`);
  };

  const handleNurseDesk = () => {
    setActiveTab('messages');
    showToast(`Opened Family Message Desk to communicate directly with Staff 1.`);
  };

  return (
    <div className={styles.container}>
      {/* Top Navigation */}
      <header className={`${styles.topNav} glass`}>
        <div className={styles.brand}>
          <div className={styles.logoMark}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.4" strokeLinecap="round">
              <path d="M3 12h4l2-8 4 16 2-8h6" />
            </svg>
          </div>
          <div>
            <div className={styles.brandTitle}>Family Care Portal</div>
            <div className={styles.brandSub}>ICU Ward 4 · Dedicated Family Access · Doctor 1 Lead</div>
          </div>
        </div>

        <div className={styles.topRight}>
          <div className={styles.liveTag}>
            <span className={styles.liveDot}></span>
            Live Health Feed
          </div>
          <div className={styles.patientPill}>
            Dedicated to: {p.name}
          </div>
          <button type="button" className={styles.switchBtn} onClick={handleSignOut} title="Sign out to log in for another patient family">
            Sign Out / Switch Family Member
          </button>
        </div>
      </header>

      {/* Hero Patient Status Banner */}
      <section className={`${styles.heroCard} glass`}>
        <div className={styles.heroLeft}>
          <div className={styles.heroAvatar}>
            P{patientId + 1}
          </div>
          <div>
            <h1 className={styles.heroName}>{p.name}</h1>
            <div className={styles.heroMeta}>
              Room {p.bed} · Age {p.age} · Care Focus: {p.diagnosis}
            </div>
            <div className={`${styles.heroStatus} ${styles[s]}`}>
              <span
                className={styles.liveDot}
                style={{ background: isHealthy ? 'var(--mint)' : s === 'watch' ? 'var(--amber)' : 'var(--coral)' }}
              ></span>
              {statusText}
            </div>
          </div>
        </div>

        <div className={styles.heroRight}>
          <div className={styles.doctorAssigned}>Physician in Charge</div>
          <div className={styles.doctorName}>Doctor 1</div>
          <div className={styles.doctorRole}>Chief ICU Specialist · Staff 1 on duty</div>
        </div>
      </section>

      {/* Navigation Tabs for Family Portal */}
      <div className={styles.tabsRow}>
        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'overview' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M3 12h4l2-8 4 16 2-8h6" />
          </svg>
          Live Vitals &amp; Condition
        </button>

        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'timetable' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('timetable')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          Today's Timetable &amp; Visiting
          <span className={styles.tabBadge}>{p.schedule?.length || 5} events</span>
        </button>

        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'reports' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
          </svg>
          24-Hour Daily Reports Archive
          <span className={styles.tabBadge}>{p.dailyReports?.length || 4} days</span>
        </button>

        <button
          type="button"
          className={`${styles.tabBtn} ${activeTab === 'messages' ? styles.tabBtnActive : ''}`}
          onClick={() => setActiveTab('messages')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          Family Message Desk
          <span className={styles.tabBadge}>{familyMessages.length} msgs</span>
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <>
          {/* Hospital Stay, Admission & Surgery Report */}
          <section className={`${styles.stayCard} glass`}>
            <div className={styles.stayHeader}>
              <div className={styles.stayTitle}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2.2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                Hospital Stay &amp; Clinical Progress Report
              </div>
              <span className={styles.stayBadge}>
                ● Supervised by Doctor 1
              </span>
            </div>

            <div className={styles.stayGrid}>
              <div className={styles.stayItem}>
                <span className={styles.stayLabel}>Admit / Join Date</span>
                <span className={styles.stayVal}>{p.admitDate}</span>
                <span className={styles.staySub}>Admitted to ICU Ward 4</span>
              </div>

              <div className={styles.stayItem}>
                <span className={styles.stayLabel}>Operation / Procedure</span>
                <span className={styles.stayVal}>
                  {p.operationDate ? p.operationDate : 'No Surgery Scheduled'}
                </span>
                <span className={styles.staySub}>
                  {p.operationName ? `${p.operationName} · ${p.operationStatus}` : 'Medical therapy & rest'}
                </span>
              </div>

              <div className={styles.stayItem}>
                <span className={styles.stayLabel}>Expected Discharge / Exit</span>
                <span className={styles.stayVal}>{p.expectedExitDate}</span>
                <span className={styles.staySub}>Based on steady vitals recovery</span>
              </div>

              <div className={styles.stayItem}>
                <span className={styles.stayLabel}>Current Nutrition &amp; Diet</span>
                <span className={styles.stayVal}>{p.dietStatus}</span>
                <span className={styles.staySub}>Carefully managed by Staff 1</span>
              </div>
            </div>

            <div style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--ink-soft)' }}>
              <strong>Care Condition Summary: </strong>
              {p.careSummary}
            </div>
          </section>

          {/* Oxygen / Breathing Support live indicator if active */}
          {oxygenFlow !== undefined && (
            <section className={styles.oxygenBanner}>
              <div className={styles.oxygenLeft}>
                <div className={styles.oxygenIcon}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
                <div>
                  <div className={styles.oxygenTitle}>Continuous Breathing &amp; Oxygen Support Active</div>
                  <div className={styles.oxygenDesc}>
                    {oxygenDevice?.name || 'Breathing Assistant'} is delivering continuous soothing airflow. Patient is breathing comfortably.
                  </div>
                </div>
              </div>
              <div className={styles.oxygenRight}>
                <span className={styles.oxygenFlowRate}>{oxygenFlow.toFixed(1)}</span>
                <span className={styles.oxygenFlowUnit}>L/min Flow</span>
              </div>
            </section>
          )}

          {/* Vitals in Easy Words */}
          <div className={styles.sectionHead}>
            <h2 className={styles.sectionTitle}>Real-Time Vital Signs</h2>
            <span className={styles.sectionSub}>Updates automatically every 2 seconds</span>
          </div>

          <div className={styles.vitalsGrid}>
            {/* Heart Rate */}
            <div className={`${styles.vitalCard} glass`}>
              <div className={styles.vitalTop}>
                <span className={styles.vitalLabel}>Heart Beat</span>
                <div className={styles.vitalIcon} style={{ background: 'rgba(76,141,255,0.1)', color: 'var(--blue)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                    <path d="M3 12h4l2-8 4 16 2-8h6" />
                  </svg>
                </div>
              </div>
              <div className={styles.vitalValue}>
                {fmt1(p.vitals.hr)} <span className={styles.vitalUnit}>bpm</span>
              </div>
              <span className={styles.vitalStatusPill}>
                {p.vitals.hr >= 60 && p.vitals.hr <= 100 ? 'Normal & Calm' : 'Under Doctor Check'}
              </span>
              <div className={styles.vitalNote}>
                Normal resting range is 60 to 100 beats per minute.
              </div>
            </div>

            {/* Oxygen */}
            <div className={`${styles.vitalCard} glass`}>
              <div className={styles.vitalTop}>
                <span className={styles.vitalLabel}>Oxygen Level</span>
                <div className={styles.vitalIcon} style={{ background: 'rgba(47,189,133,0.1)', color: 'var(--mint)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M12 21s-7-4.4-9.3-9C1 8 2.6 4 6.6 4c2 0 3.6 1.2 4.4 2.7C11.8 5.2 13.4 4 15.4 4 19.4 4 21 8 19.3 12 17 16.6 12 21 12 21z" />
                  </svg>
                </div>
              </div>
              <div className={styles.vitalValue}>
                {fmt1(p.vitals.spo2)} <span className={styles.vitalUnit}>%</span>
              </div>
              <span className={styles.vitalStatusPill} style={{ background: 'var(--mint-soft)', color: '#1c8a5f' }}>
                {p.vitals.spo2 >= 95 ? 'Healthy & Strong' : 'Breathing Assisted'}
              </span>
              <div className={styles.vitalNote}>
                Target oxygen saturation is 95% or higher.
              </div>
            </div>

            {/* Blood Pressure */}
            <div className={`${styles.vitalCard} glass`}>
              <div className={styles.vitalTop}>
                <span className={styles.vitalLabel}>Blood Pressure</span>
                <div className={styles.vitalIcon} style={{ background: 'rgba(140,124,240,0.1)', color: 'var(--lavender)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <circle cx="12" cy="13" r="7" />
                    <path d="M12 6V3M9 3h6" />
                  </svg>
                </div>
              </div>
              <div className={styles.vitalValue}>
                {Math.round(p.vitals.sbp)}/{Math.round(p.vitals.dbp || 75)} <span className={styles.vitalUnit}>mmHg</span>
              </div>
              <span className={styles.vitalStatusPill}>
                {p.vitals.sbp <= 140 ? 'Normal Circulation' : 'Observed by Staff'}
              </span>
              <div className={styles.vitalNote}>
                Healthy blood pressure for comfortable resting.
              </div>
            </div>

            {/* Temperature */}
            <div className={`${styles.vitalCard} glass`}>
              <div className={styles.vitalTop}>
                <span className={styles.vitalLabel}>Body Temperature</span>
                <div className={styles.vitalIcon} style={{ background: 'rgba(255,92,108,0.1)', color: 'var(--coral)' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M14 14.76V4a2 2 0 0 0-4 0v10.76a4 4 0 1 0 4 0z" />
                  </svg>
                </div>
              </div>
              <div className={styles.vitalValue}>
                {fmt1(p.vitals.temp)} <span className={styles.vitalUnit}>°C</span>
              </div>
              <span className={styles.vitalStatusPill}>
                {p.vitals.temp <= 37.5 ? 'Completely Normal' : 'Monitored for Warmth'}
              </span>
              <div className={styles.vitalNote}>
                No fever. Body temperature is comfortable.
              </div>
            </div>
          </div>

          {/* Two Columns: Doctor Report & Visiting Info */}
          <div className={styles.twoCol}>
            {/* Doctor Note */}
            <div className={`${styles.panel} glass`}>
              <div className={styles.panelTitle}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2.2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                Daily Care Summary by Doctor 1
              </div>

              <div className={styles.doctorNoteCard}>
                <div className={styles.doctorNoteHead}>
                  <span className={styles.doctorBadge}>Latest Physician Update</span>
                  <span className={styles.noteTime}>Today · 2:15 PM</span>
                </div>
                <p className={styles.doctorNoteText}>
                  "{DOCTOR_NOTES[patientId] || DOCTOR_NOTES[0]}"
                </p>
                <div className={styles.doctorSignature}>
                  — Doctor 1, Lead ICU Physician
                </div>
              </div>

              <div className={styles.panelTitle} style={{ fontSize: 14 }}>
                Daily Visiting Hours Highlights
              </div>
              <div className={styles.careSchedule}>
                <div className={styles.scheduleRow}>
                  <span className={styles.scheduleTime}>Morning</span>
                  <span className={styles.scheduleDesc}>10:00 AM – 01:00 PM (Family visiting allowed, max 2 members at bedside).</span>
                </div>
                <div className={styles.scheduleRow}>
                  <span className={styles.scheduleTime}>Afternoon</span>
                  <span className={styles.scheduleDesc}>01:45 PM – 03:30 PM (Quiet rest &amp; sleep period for patient recovery).</span>
                </div>
                <div className={styles.scheduleRow}>
                  <span className={styles.scheduleTime}>Evening</span>
                  <span className={styles.scheduleDesc}>04:00 PM – 07:30 PM (Evening family visiting window open).</span>
                </div>
              </div>
            </div>

            {/* Visiting & Meeting Time Card */}
            <div className={`${styles.panel} glass`}>
              <div className={styles.panelTitle}>
                Time to Meet Patient (Visiting Hours)
              </div>

              {/* Prominent Visiting Status Card */}
              <div className={styles.visitingCard}>
                <div className={styles.visitingTop}>
                  <span className={styles.stayLabel}>Visiting Window Status</span>
                  <span className={`${styles.visitingBadge} ${p.visitingHours.isOpen ? '' : styles.closed}`}>
                    {p.visitingHours.isOpen ? '● Visiting Allowed Right Now' : '○ Closed (Next Window Soon)'}
                  </span>
                </div>
                <div className={styles.visitingHoursText}>
                  {p.visitingHours.currentWindow}
                </div>
                <div className={styles.visitingDetail}>
                  Next Evening Window: <strong>{p.visitingHours.nextWindow}</strong>
                  <br />
                  {p.visitingHours.rules}
                </div>
              </div>

              <div className={styles.infoItem}>
                <div className={styles.infoLabel}>Room &amp; Bed Location</div>
                <div className={styles.infoVal}>Room {p.bed} · Bed 1</div>
                <div className={styles.infoSub}>West Wing · ICU Level 4 · Follow Green Signs</div>
              </div>

              <div className={styles.infoItem}>
                <div className={styles.infoLabel}>Care Team on Duty</div>
                <div className={styles.infoVal}>Doctor 1 (Lead Doctor)</div>
                <div className={styles.infoSub}>Staff 1 (Primary Duty Nurse)</div>
              </div>

              <div className={styles.actionButtons}>
                <button type="button" className={`${styles.actionBtn} ${styles.primaryAction}`} onClick={handleDoctorCall}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  Request Doctor 1 Callback
                </button>
                <button type="button" className={`${styles.actionBtn} ${styles.secondaryAction}`} onClick={handleNurseDesk}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                  Message Nurse Station (Staff 1)
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Tab 2: Timetable */}
      {activeTab === 'timetable' && (
        <PatientTimetable
          schedule={p.schedule || []}
          isStaff={false}
          patientName={p.name}
        />
      )}

      {/* Tab 3: 24-Hour Daily Reports Archive */}
      {activeTab === 'reports' && (
        <DailyReportsArchive
          dailyReports={p.dailyReports || []}
          patientName={p.name}
          roomBed={`Room ${p.bed}`}
          admitDate={p.admitDate}
          isStaff={false}
        />
      )}

      {/* Tab 4: Family Message Desk */}
      {activeTab === 'messages' && (
        <FamilyMessageDesk
          patientId={patientId}
          patientName={p.name}
          isStaff={false}
        />
      )}
    </div>
  );
}
