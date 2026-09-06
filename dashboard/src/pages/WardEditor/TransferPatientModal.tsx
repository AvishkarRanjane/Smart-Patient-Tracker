// pages/WardEditor/TransferPatientModal.tsx
import { useState } from 'react';
import type { EditablePatientRecord, Ward, Bed } from '../../types/ward';
import styles from './wardEditor.module.css';

interface Props {
  patient: EditablePatientRecord;
  wards: Ward[];
  beds: Bed[];
  onTransfer: (patientId: number, targetWardId: string, targetBedId: string, reason?: string) => void;
  onClose: () => void;
}

export default function TransferPatientModal({
  patient,
  wards,
  beds,
  onTransfer,
  onClose,
}: Props) {
  const [selectedWardId, setSelectedWardId] = useState<string>(patient.wardId);
  const availableBeds = beds.filter(
    (b) => b.wardId === selectedWardId && b.status === 'available'
  );
  const [selectedBedId, setSelectedBedId] = useState<string>(availableBeds[0]?.id || '');
  const [reason, setReason] = useState('Stepdown recovery / Routine transfer');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBedId) return;
    onTransfer(patient.id, selectedWardId, selectedBedId, reason);
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.45)',
        backdropFilter: 'blur(8px)',
        zIndex: 1200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: 22,
          padding: 28,
          maxWidth: 480,
          width: '100%',
          boxShadow: '0 24px 64px rgba(28, 35, 49, 0.2)',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 12 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: 'var(--ink)' }}>
            Transfer Patient: {patient.name}
          </h3>
          <button type="button" style={{ background: 'var(--bg-hover)', border: 'none', borderRadius: 8, width: 30, height: 30, cursor: 'pointer' }} onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Current Location</label>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink)' }}>
              Bed {patient.bed} · {wards.find((w) => w.id === patient.wardId)?.name}
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Select Destination Ward</label>
            <select
              className={styles.fieldInput}
              value={selectedWardId}
              onChange={(e) => {
                setSelectedWardId(e.target.value);
                const nextAvail = beds.filter(
                  (b) => b.wardId === e.target.value && b.status === 'available'
                );
                setSelectedBedId(nextAvail[0]?.id || '');
              }}
            >
              {wards.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} ({w.floor})
                </option>
              ))}
            </select>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Select Target Available Bed</label>
            {availableBeds.length > 0 ? (
              <select
                className={styles.fieldInput}
                value={selectedBedId}
                onChange={(e) => setSelectedBedId(e.target.value)}
                required
              >
                {availableBeds.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.bedNumber} (Ready &amp; Clean)
                  </option>
                ))}
              </select>
            ) : (
              <div style={{ fontSize: 12, color: 'var(--coral)', fontWeight: 600 }}>
                No beds currently available in this ward. Add a bed or discharge a patient.
              </div>
            )}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Clinical Transfer Reason</label>
            <input
              className={styles.fieldInput}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Clinical improvement, stepdown, isolation"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
            <button type="button" className={styles.secondaryBtn} onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className={`${styles.actionBtn} ${styles.primaryBtn}`}
              disabled={!selectedBedId}
            >
              Confirm Patient Transfer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
