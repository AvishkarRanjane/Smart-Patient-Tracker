// pages/WardEditor/AdmitPatientModal.tsx
import { useState } from 'react';
import type { EditablePatientRecord, Bed } from '../../types/ward';
import styles from './wardEditor.module.css';

interface Props {
  beds: Bed[];
  wardId: string;
  initialBedId?: string;
  onAdmit: (patientData: Omit<EditablePatientRecord, 'id'>, targetBedId: string) => void;
  onClose: () => void;
}

export default function AdmitPatientModal({ beds, wardId, initialBedId, onAdmit, onClose }: Props) {
  const availableBeds = beds.filter((b) => b.wardId === wardId && b.status === 'available');

  const [name, setName] = useState('');
  const [age, setAge] = useState(50);
  const [diagnosis, setDiagnosis] = useState('');
  const [condition, setCondition] = useState<'stable' | 'watch' | 'critical'>('stable');
  const [targetBedId, setTargetBedId] = useState(initialBedId || availableBeds[0]?.id || '');
  const [dietStatus, setDietStatus] = useState('Standard nutritional recovery broth');
  const [medsText, setMedsText] = useState('IV Saline 0.9%, Cefazolin 1g');
  const [careSummary, setCareSummary] = useState('Patient newly admitted for telemetry and vital observation.');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetBedId || !name.trim()) return;

    const selectedBed = beds.find((b) => b.id === targetBedId);

    onAdmit(
      {
        name: name.trim(),
        bed: selectedBed?.bedNumber || 'BED-NEW',
        wardId,
        age: Number(age),
        diagnosis: diagnosis.trim() || 'General Clinical Observation',
        condition,
        admitDate: 'Today, Just Now',
        expectedExitDate: 'In 7 Days',
        dietStatus,
        medications: medsText.split(',').map((m) => m.trim()).filter(Boolean),
        careSummary,
        assignedDoctor: 'Doctor 1',
        assignedNurse: 'Staff 1',
      },
      targetBedId
    );
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
          maxWidth: 580,
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
            Admit New Patient to Ward
          </h3>
          <button type="button" style={{ background: 'var(--bg-hover)', border: 'none', borderRadius: 8, width: 30, height: 30, cursor: 'pointer' }} onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Patient Full Name</label>
              <input
                className={styles.fieldInput}
                placeholder="e.g. Person 7 / John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Age</label>
              <input
                type="number"
                className={styles.fieldInput}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                min={1}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.5fr', gap: 12 }}>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Diagnosis / Care Reason</label>
              <input
                className={styles.fieldInput}
                placeholder="e.g. Post-Op Cardiac Care"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                required
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Select Available Bed</label>
              {availableBeds.length > 0 ? (
                <select
                  className={styles.fieldInput}
                  value={targetBedId}
                  onChange={(e) => setTargetBedId(e.target.value)}
                  required
                >
                  {availableBeds.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.bedNumber} (Clean &amp; Ready)
                    </option>
                  ))}
                </select>
              ) : (
                <div style={{ fontSize: 11.5, color: 'var(--coral)', fontWeight: 600 }}>
                  No available beds in this ward! Click "+ Add New Bed" first.
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Initial Clinical Condition</label>
              <select
                className={styles.fieldInput}
                value={condition}
                onChange={(e) => setCondition(e.target.value as any)}
              >
                <option value="stable">Stable Condition</option>
                <option value="watch">Under Close Watch</option>
                <option value="critical">Critical Attention Required</option>
              </select>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Dietary Regimen</label>
              <input
                className={styles.fieldInput}
                value={dietStatus}
                onChange={(e) => setDietStatus(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Initial Prescribed Medications (comma-separated)</label>
            <input
              className={styles.fieldInput}
              value={medsText}
              onChange={(e) => setMedsText(e.target.value)}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Care Plan Summary</label>
            <input
              className={styles.fieldInput}
              value={careSummary}
              onChange={(e) => setCareSummary(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
            <button type="button" className={styles.secondaryBtn} onClick={onClose}>
              Cancel
            </button>
            <button
              type="submit"
              className={`${styles.actionBtn} ${styles.primaryBtn}`}
              disabled={!targetBedId || !name.trim()}
            >
              Admit Patient &amp; Assign Bed
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
