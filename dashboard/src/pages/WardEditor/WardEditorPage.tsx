// pages/WardEditor/WardEditorPage.tsx
import { useState } from 'react';
import { useWardManagement } from '../../context/WardManagementContext';
import WardConfigCard from './WardConfigCard.tsx';
import WardCellTable from './WardCellTable.tsx';
import AdmitPatientModal from './AdmitPatientModal.tsx';
import TransferPatientModal from './TransferPatientModal.tsx';
import type { EditablePatientRecord } from '../../types/ward';
import { showToast } from '../../components/ui/Toast.tsx';
import PageTransition from '../../components/layout/PageTransition.tsx';
import styles from './wardEditor.module.css';

export default function WardEditorPage() {
  const {
    wards,
    beds,
    activeWard,
    activeWardId,
    setActiveWardId,
    getWardBeds,
    getWardPatients,
    updateWardConfig,
    updatePatientCell,
    updateFullPatientRecord,
    addNewBed,
    transferPatient,
    dischargePatient,
    admitPatient,
  } = useWardManagement();

  const [showAdmitModal, setShowAdmitModal] = useState(false);
  const [transferTargetPatient, setTransferTargetPatient] = useState<EditablePatientRecord | null>(null);

  const wardBeds = getWardBeds(activeWardId);
  const wardPatients = getWardPatients(activeWardId);

  // Compute live KPI metrics
  const occupiedCount = wardBeds.filter((b) => b.status === 'occupied').length;
  const availableCount = wardBeds.filter((b) => b.status === 'available').length;
  const cleaningCount = wardBeds.filter((b) => b.status === 'cleaning').length;
  const occupancyRate = wardBeds.length > 0 ? Math.round((occupiedCount / wardBeds.length) * 100) : 0;

  const handleExportData = () => {
    const data = {
      ward: activeWard,
      exportedAt: new Date().toISOString(),
      beds: wardBeds,
      patients: wardPatients,
    };
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeWard.code}_ward_cell_data.json`;
    link.click();
    showToast(`Exported ${activeWard.code} ward and patient cell data.`);
  };

  return (
    <PageTransition>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.head}>
          <div>
            <div className={styles.titleRow}>
              <h1 className={styles.title}>Ward &amp; Patient Cell Editor</h1>
              <span className={styles.wardBadge}>{activeWard.name}</span>
            </div>
            <p className={styles.sub}>
              Administrative workstation: Edit ward configurations, manage bed allocation, and click any cell to edit patient records inline.
            </p>
          </div>

          <div className={styles.topActions}>
            {/* Switch Ward */}
            <select
              className={styles.fieldInput}
              style={{ fontWeight: 700, padding: '9px 14px', cursor: 'pointer' }}
              value={activeWardId}
              onChange={(e) => setActiveWardId(e.target.value)}
            >
              {wards.map((w) => (
                <option key={w.id} value={w.id}>
                  Switch: {w.name}
                </option>
              ))}
            </select>

            <button
              type="button"
              className={`${styles.actionBtn} ${styles.secondaryBtn}`}
              onClick={() => addNewBed(activeWardId)}
              title="Add a new available bed to this ward"
            >
              + Add New Bed
            </button>

            <button
              type="button"
              className={`${styles.actionBtn} ${styles.primaryBtn}`}
              onClick={() => setShowAdmitModal(true)}
              title="Admit a new patient into an available bed"
            >
              + Admit Patient
            </button>

            <button
              type="button"
              className={`${styles.actionBtn} ${styles.secondaryBtn}`}
              onClick={handleExportData}
              title="Download ward and patient data in JSON format"
            >
              📥 Export Data
            </button>
          </div>
        </div>

        {/* KPI Metrics Row */}
        <div className={styles.kpiGrid}>
          <div className={styles.kpiCard}>
            <span className={styles.kpiLabel}>Total Bed Capacity</span>
            <span className={styles.kpiValue}>{wardBeds.length} Beds</span>
            <span className={styles.kpiSub}>{activeWard.floor}</span>
          </div>

          <div className={styles.kpiCard}>
            <span className={styles.kpiLabel}>Occupancy Rate</span>
            <span className={styles.kpiValue} style={{ color: occupancyRate > 85 ? 'var(--amber)' : 'var(--blue)' }}>
              {occupancyRate}%
            </span>
            <span className={styles.kpiSub}>{occupiedCount} of {wardBeds.length} beds occupied</span>
          </div>

          <div className={styles.kpiCard}>
            <span className={styles.kpiLabel}>Available (Ready)</span>
            <span className={styles.kpiValue} style={{ color: 'var(--mint)' }}>
              {availableCount}
            </span>
            <span className={styles.kpiSub}>Cleaned &amp; telemetry online</span>
          </div>

          <div className={styles.kpiCard}>
            <span className={styles.kpiLabel}>Turnover / Cleaning</span>
            <span className={styles.kpiValue} style={{ color: cleaningCount > 0 ? 'var(--amber)' : 'var(--ink)' }}>
              {cleaningCount}
            </span>
            <span className={styles.kpiSub}>Sanitization pending</span>
          </div>

          <div className={styles.kpiCard}>
            <span className={styles.kpiLabel}>Duty Clinicians</span>
            <span className={styles.kpiValue}>2 Active</span>
            <span className={styles.kpiSub}>{activeWard.leadDoctor} &amp; {activeWard.headNurse}</span>
          </div>
        </div>

        {/* Collapsible Ward Details Editor Card */}
        <WardConfigCard
          ward={activeWard}
          onSave={(updates) => updateWardConfig(activeWard.id, updates)}
        />

        {/* Interactive Spreadsheet-Like Editable Cell Table */}
        <WardCellTable
          patients={wardPatients}
          beds={wardBeds}
          onUpdateCell={updatePatientCell}
          onUpdateFullRecord={updateFullPatientRecord}
          onDischarge={dischargePatient}
          onTransfer={(p) => setTransferTargetPatient(p)}
        />

        {/* Admit Patient Modal */}
        {showAdmitModal && (
          <AdmitPatientModal
            beds={wardBeds}
            wardId={activeWardId}
            onAdmit={admitPatient}
            onClose={() => setShowAdmitModal(false)}
          />
        )}

        {/* Transfer Patient Modal */}
        {transferTargetPatient && (
          <TransferPatientModal
            patient={transferTargetPatient}
            wards={wards}
            beds={beds}
            onTransfer={transferPatient}
            onClose={() => setTransferTargetPatient(null)}
          />
        )}
      </div>
    </PageTransition>
  );
}
