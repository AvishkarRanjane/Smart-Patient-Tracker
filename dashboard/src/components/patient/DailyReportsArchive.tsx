// components/patient/DailyReportsArchive.tsx
import { useState } from 'react';
import type { DailyReport, Vitals } from '../../types/patient';
import { showToast } from '../ui/Toast.tsx';
import styles from './reports.module.css';

interface Props {
  dailyReports: DailyReport[];
  patientName: string;
  roomBed: string;
  admitDate: string;
  currentVitals?: Vitals;
  isStaff?: boolean;
}

export default function DailyReportsArchive({
  dailyReports: initialReports,
  patientName,
  roomBed,
  admitDate,
  currentVitals,
  isStaff = false,
}: Props) {
  const [reports, setReports] = useState<DailyReport[]>(initialReports);
  const [selectedIndex, setSelectedIndex] = useState<number>(initialReports.length - 1);
  const [showPdfModal, setShowPdfModal] = useState<boolean>(false);

  const activeReport = reports[selectedIndex] || reports[0];

  const handleGenerateTodayReport = () => {
    const nextDayNumber = reports.length + 1;
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    const newRep: DailyReport = {
      id: `rep-${Date.now()}`,
      dayNumber: nextDayNumber,
      reportDate: `Today (${dateStr})`,
      createdAt: `${timeStr} Automated 24h Review`,
      summary: `24-hour automated clinical record compiled by Doctor 1. Vital signs and device telemetry remain in optimal stability.`,
      vitalsAverage: {
        avgHr: Math.round(currentVitals?.hr ?? 78),
        avgSpo2: Number((currentVitals?.spo2 ?? 98).toFixed(1)),
        avgBp: `${Math.round(currentVitals?.sbp ?? 120)}/${Math.round(currentVitals?.dbp ?? 78)} mmHg`,
        avgTemp: Number((currentVitals?.temp ?? 36.8).toFixed(1)),
      },
      fluidBalance: {
        intakeMl: 1900,
        outputMl: 1820,
      },
      medicationsAdministered: [
        'IV Maintenance Saline 1000mL',
        'Cefazolin 1g IV Antibiotic',
        'Analgesic Comfort Dose',
      ],
      clinicalEvaluation: `Patient is alert, responsive, and hemodynamically stable. Oxygenation assisted with steady airway gas exchange. Pain controlled.`,
      doctorSignOff: 'Doctor 1 (Chief ICU Specialist)',
      status: 'stable',
    };

    setReports((prev) => [...prev, newRep]);
    setSelectedIndex(reports.length);
    showToast(`24-Hour Clinical Report generated and archived for ${patientName}.`);
  };

  const handlePrintPdf = () => {
    setShowPdfModal(true);
  };

  return (
    <div className={`${styles.archiveCard} glass`}>
      {/* Card Header */}
      <div className={styles.header}>
        <div>
          <div className={styles.badgeRow}>
            <span className={styles.badgeSection}>24-Hour Medical History Archive</span>
            <span className={styles.badgeLive}>● Auto-compiled every 24 hrs</span>
          </div>
          <h2 className={styles.title}>
            Clinical Daily Progress Reports — {patientName}
          </h2>
          <p className={styles.sub}>
            Official 24-hour hospital records detailing vital averages, fluid balance, medications, and Doctor 1 sign-offs.
          </p>
        </div>

        <div className={styles.actionsRight}>
          {isStaff && (
            <button
              type="button"
              className={styles.generateBtn}
              onClick={handleGenerateTodayReport}
            >
              + Generate Today's 24h Report
            </button>
          )}
          <button
            type="button"
            className={styles.printBtn}
            onClick={handlePrintPdf}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            Print / Export PDF
          </button>
        </div>
      </div>

      {/* Day Selector Tabs */}
      <div className={styles.dayTabs}>
        {reports.map((rep, idx) => (
          <button
            key={rep.id}
            type="button"
            className={`${styles.dayTab} ${selectedIndex === idx ? styles.dayTabActive : ''}`}
            onClick={() => setSelectedIndex(idx)}
          >
            <span className={styles.dayTabNumber}>Day {rep.dayNumber}</span>
            <span className={styles.dayTabDate}>{rep.reportDate}</span>
          </button>
        ))}
      </div>

      {/* Active Daily Report View */}
      {activeReport && (
        <div className={styles.reportBody}>
          {/* Report Meta Header */}
          <div className={styles.reportMetaHead}>
            <div>
              <div className={styles.dayHeading}>
                Day {activeReport.dayNumber} Official 24-Hour Clinical Report
              </div>
              <div className={styles.dateSub}>
                Compiled on {activeReport.reportDate} · {activeReport.createdAt} · Room {roomBed}
              </div>
            </div>
            <div className={styles.statusPill}>
              {activeReport.status === 'improving'
                ? '● Patient Improving Consistently'
                : activeReport.status === 'stable'
                ? '● Steady & Stable Condition'
                : '▲ Monitored Closely'}
            </div>
          </div>

          {/* 24-Hour Vital Signs Average Grid */}
          <div className={styles.vitalSection}>
            <div className={styles.sectionTitleSmall}>
              24-Hour Aggregated Vital Signs (Average)
            </div>
            <div className={styles.vitalsGrid}>
              <div className={styles.vitalBox}>
                <span className={styles.vLabel}>Heart Beat Average</span>
                <span className={styles.vVal}>{activeReport.vitalsAverage.avgHr} <span className={styles.vUnit}>bpm</span></span>
                <span className={styles.vSub}>Resting range: 60–90</span>
              </div>

              <div className={styles.vitalBox}>
                <span className={styles.vLabel}>Oxygen Saturation</span>
                <span className={styles.vVal}>{activeReport.vitalsAverage.avgSpo2} <span className={styles.vUnit}>%</span></span>
                <span className={styles.vSub}>Healthy tissue aeration</span>
              </div>

              <div className={styles.vitalBox}>
                <span className={styles.vLabel}>Blood Pressure Range</span>
                <span className={styles.vVal}>{activeReport.vitalsAverage.avgBp}</span>
                <span className={styles.vSub}>Normal arterial pressure</span>
              </div>

              <div className={styles.vitalBox}>
                <span className={styles.vLabel}>Body Temperature</span>
                <span className={styles.vVal}>{activeReport.vitalsAverage.avgTemp} <span className={styles.vUnit}>°C</span></span>
                <span className={styles.vSub}>Afebrile · No fever</span>
              </div>
            </div>
          </div>

          {/* Two Columns: Fluid Balance & Administered Medications */}
          <div className={styles.twoCol}>
            {/* Fluid Balance */}
            <div className={styles.subCard}>
              <div className={styles.sectionTitleSmall}>
                24-Hour Fluid Balance (Intake vs Output)
              </div>
              <div className={styles.fluidRow}>
                <div>
                  <span className={styles.fluidLabel}>Total Fluid Intake:</span>
                  <span className={styles.fluidVal} style={{ color: 'var(--blue)' }}>
                    {activeReport.fluidBalance.intakeMl} mL
                  </span>
                  <span className={styles.fluidSub}>IV infusions &amp; oral fluids</span>
                </div>
                <div>
                  <span className={styles.fluidLabel}>Total Fluid Output:</span>
                  <span className={styles.fluidVal} style={{ color: '#b8791f' }}>
                    {activeReport.fluidBalance.outputMl} mL
                  </span>
                  <span className={styles.fluidSub}>Urine output &amp; drainage</span>
                </div>
              </div>
              <div className={styles.balanceStatus}>
                Net Balance: <strong>+{activeReport.fluidBalance.intakeMl - activeReport.fluidBalance.outputMl} mL</strong> (Euvolemic · Optimal Hydration)
              </div>
            </div>

            {/* Administered Medications */}
            <div className={styles.subCard}>
              <div className={styles.sectionTitleSmall}>
                Medications Administered in Past 24 Hours
              </div>
              <div className={styles.medsList}>
                {activeReport.medicationsAdministered.map((med, mIdx) => (
                  <span key={mIdx} className={styles.medPill}>
                    💊 {med}
                  </span>
                ))}
              </div>
              <div className={styles.medAdminNote}>
                Verified and signed by <strong>Staff 1</strong> at nurse medication station.
              </div>
            </div>
          </div>

          {/* Clinical Progress Summary & Doctor Evaluation */}
          <div className={styles.doctorEvaluationCard}>
            <div className={styles.evalHead}>
              <div className={styles.doctorBadge}>Lead Physician Daily Assessment</div>
              <div className={styles.signOffName}>
                Official Signature: <strong>{activeReport.doctorSignOff}</strong>
              </div>
            </div>
            <p className={styles.evalText}>
              "{activeReport.clinicalEvaluation}"
            </p>
            <div className={styles.evalFooter}>
              <div>Summary: {activeReport.summary}</div>
              <div className={styles.hospitalStamp}>✓ St. Jude ICU Wing Verified Record</div>
            </div>
          </div>
        </div>
      )}

      {/* PDF Export & Print Simulation Modal */}
      {showPdfModal && (
        <div className={styles.modalOverlay} onClick={() => setShowPdfModal(false)}>
          <div className={`${styles.pdfModal} glass`} onClick={(e) => e.stopPropagation()}>
            <div className={styles.pdfHeader}>
              <div>
                <h3 className={styles.pdfTitle}>Hospital Clinical 24-Hour Progress Record</h3>
                <p className={styles.pdfSub}>St. Jude Medical Wing · ICU Ward 4 · Formal Document</p>
              </div>
              <button
                type="button"
                className={styles.closePdfBtn}
                onClick={() => setShowPdfModal(false)}
              >
                ✕
              </button>
            </div>

            <div className={styles.pdfSheet}>
              <div className={styles.sheetTop}>
                <div>
                  <strong>Patient Name:</strong> {patientName}
                  <br />
                  <strong>Room / Bed:</strong> {roomBed}
                  <br />
                  <strong>Admit Date:</strong> {admitDate}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <strong>Report Cycle:</strong> Day {activeReport?.dayNumber}
                  <br />
                  <strong>Generated:</strong> {activeReport?.reportDate}
                  <br />
                  <strong>Lead Physician:</strong> Doctor 1
                </div>
              </div>

              <hr className={styles.sheetHr} />

              <div>
                <strong>24-Hour Vital Signs Average:</strong>
                <div style={{ marginTop: 6, display: 'flex', gap: 16 }}>
                  <span>Heart Beat: <strong>{activeReport?.vitalsAverage.avgHr} bpm</strong></span>
                  <span>Oxygen: <strong>{activeReport?.vitalsAverage.avgSpo2}%</strong></span>
                  <span>BP: <strong>{activeReport?.vitalsAverage.avgBp}</strong></span>
                  <span>Temp: <strong>{activeReport?.vitalsAverage.avgTemp} °C</strong></span>
                </div>
              </div>

              <div style={{ marginTop: 14 }}>
                <strong>Fluid Balance (24 Hours):</strong>
                <p style={{ margin: '4px 0 0 0' }}>
                  Intake: {activeReport?.fluidBalance.intakeMl} mL · Output: {activeReport?.fluidBalance.outputMl} mL (Net: +{activeReport ? activeReport.fluidBalance.intakeMl - activeReport.fluidBalance.outputMl : 0} mL)
                </p>
              </div>

              <div style={{ marginTop: 14 }}>
                <strong>Administered Medications:</strong>
                <p style={{ margin: '4px 0 0 0' }}>
                  {activeReport?.medicationsAdministered.join(', ')}
                </p>
              </div>

              <div style={{ marginTop: 14 }}>
                <strong>Physician Clinical Notes:</strong>
                <p style={{ margin: '4px 0 0 0', fontStyle: 'italic' }}>
                  "{activeReport?.clinicalEvaluation}"
                </p>
              </div>

              <div className={styles.signatureBox}>
                <div>
                  ____________________________
                  <br />
                  <strong>{activeReport?.doctorSignOff}</strong>
                  <br />
                  Chief ICU Physician, St. Jude Hospital
                </div>
                <div>
                  ____________________________
                  <br />
                  <strong>Staff 1, Senior Ward Nurse</strong>
                  <br />
                  Nurse In-Charge Verification
                </div>
              </div>
            </div>

            <div className={styles.pdfActions}>
              <button
                type="button"
                className={styles.printActionBtn}
                onClick={() => {
                  window.print();
                  setShowPdfModal(false);
                }}
              >
                Send to Hospital Printer / Save as PDF
              </button>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => setShowPdfModal(false)}
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
