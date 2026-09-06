// pages/WardEditor/EditCellModal.tsx
import { useState } from 'react';
import type { EditablePatientRecord } from '../../types/ward';
import styles from './wardEditor.module.css';

interface Props {
  patient: EditablePatientRecord;
  onSave: (updated: EditablePatientRecord) => void;
  onClose: () => void;
}

export default function EditCellModal({ patient, onSave, onClose }: Props) {
  const [formData, setFormData] = useState<EditablePatientRecord>({ ...patient });
  const [medsInput, setMedsInput] = useState(patient.medications.join(', '));

  const handleChange = (field: keyof EditablePatientRecord, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const meds = medsInput
      .split(',')
      .map((m) => m.trim())
      .filter(Boolean);
    onSave({ ...formData, medications: meds });
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15, 23, 42, 0.45)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
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
          boxShadow: '0 24px 64px rgba(28, 35, 49, 0.2)',
          border: '1.5px solid var(--border-color)',
          width: '100%',
          maxWidth: 680,
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: 28,
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 14 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: 'var(--ink)' }}>
              Edit Patient &amp; Bed Data Cells
            </h3>
            <span style={{ fontSize: 12, color: 'var(--ink-soft)' }}>
              Editing record for {formData.name} · Bed {formData.bed}
            </span>
          </div>
          <button
            type="button"
            style={{
              background: 'var(--bg-hover)',
              border: 'none',
              borderRadius: 8,
              width: 32,
              height: 32,
              cursor: 'pointer',
              fontWeight: 700,
            }}
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Patient Full Name</label>
              <input
                className={styles.fieldInput}
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Bed Assigned</label>
              <input
                className={styles.fieldInput}
                value={formData.bed}
                onChange={(e) => handleChange('bed', e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr 1.5fr', gap: 12 }}>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Age</label>
              <input
                type="number"
                className={styles.fieldInput}
                value={formData.age}
                onChange={(e) => handleChange('age', Number(e.target.value))}
                required
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Diagnosis / Care Focus</label>
              <input
                className={styles.fieldInput}
                value={formData.diagnosis}
                onChange={(e) => handleChange('diagnosis', e.target.value)}
                required
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Clinical Condition</label>
              <select
                className={styles.fieldInput}
                value={formData.condition}
                onChange={(e) => handleChange('condition', e.target.value as any)}
              >
                <option value="stable">Stable Condition</option>
                <option value="watch">Under Close Watch</option>
                <option value="critical">Critical Attention</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Admit / Join Date</label>
              <input
                className={styles.fieldInput}
                value={formData.admitDate}
                onChange={(e) => handleChange('admitDate', e.target.value)}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Expected Exit / Discharge Date</label>
              <input
                className={styles.fieldInput}
                value={formData.expectedExitDate}
                onChange={(e) => handleChange('expectedExitDate', e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Operation / Procedure Date</label>
              <input
                className={styles.fieldInput}
                placeholder="e.g. 30 Aug 2026, 11:15 AM or None"
                value={formData.operationDate || ''}
                onChange={(e) => handleChange('operationDate', e.target.value)}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Procedure Name</label>
              <input
                className={styles.fieldInput}
                placeholder="e.g. Heart Valve Repair"
                value={formData.operationName || ''}
                onChange={(e) => handleChange('operationName', e.target.value)}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Procedure Status</label>
              <input
                className={styles.fieldInput}
                placeholder="e.g. Completed · Healing"
                value={formData.operationStatus || ''}
                onChange={(e) => handleChange('operationStatus', e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Assigned Doctor</label>
              <input
                className={styles.fieldInput}
                value={formData.assignedDoctor}
                onChange={(e) => handleChange('assignedDoctor', e.target.value)}
              />
            </div>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Assigned Nurse</label>
              <input
                className={styles.fieldInput}
                value={formData.assignedNurse}
                onChange={(e) => handleChange('assignedNurse', e.target.value)}
              />
            </div>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Diet &amp; Nutrition Guidelines</label>
            <input
              className={styles.fieldInput}
              value={formData.dietStatus}
              onChange={(e) => handleChange('dietStatus', e.target.value)}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Medications (comma-separated)</label>
            <input
              className={styles.fieldInput}
              value={medsInput}
              onChange={(e) => setMedsInput(e.target.value)}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Clinical Care Condition Summary</label>
            <textarea
              rows={2}
              className={styles.fieldInput}
              style={{ resize: 'vertical' }}
              value={formData.careSummary}
              onChange={(e) => handleChange('careSummary', e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 8 }}>
            <button type="button" className={styles.secondaryBtn} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className={`${styles.actionBtn} ${styles.primaryBtn}`}>
              Save All Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
