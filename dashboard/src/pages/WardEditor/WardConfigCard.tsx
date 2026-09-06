// pages/WardEditor/WardConfigCard.tsx
import { useState } from 'react';
import type { Ward } from '../../types/ward';
import styles from './wardEditor.module.css';

interface Props {
  ward: Ward;
  onSave: (updates: Partial<Ward>) => void;
}

export default function WardConfigCard({ ward, onSave }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(ward.name);
  const [department, setDepartment] = useState(ward.department);
  const [floor, setFloor] = useState(ward.floor);
  const [totalBeds, setTotalBeds] = useState(ward.totalBeds);
  const [leadDoctor, setLeadDoctor] = useState(ward.leadDoctor);
  const [headNurse, setHeadNurse] = useState(ward.headNurse);
  const [specialty, setSpecialty] = useState(ward.specialty);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      department,
      floor,
      totalBeds: Number(totalBeds),
      leadDoctor,
      headNurse,
      specialty,
    });
    setOpen(false);
  };

  return (
    <div className={styles.configCard}>
      <div className={styles.configHead} onClick={() => setOpen((prev) => !prev)}>
        <div className={styles.configTitle}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2.2">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
          </svg>
          Ward &amp; Floor Setup Details: {ward.name}
        </div>
        <button type="button" className={`${styles.actionBtn} ${styles.secondaryBtn}`} style={{ padding: '6px 12px', fontSize: 12 }}>
          {open ? '▲ Collapse Ward Details' : '▼ Edit Ward Information'}
        </button>
      </div>

      {open && (
        <form onSubmit={handleSave}>
          <div className={styles.configGrid}>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Ward Name</label>
              <input className={styles.fieldInput} value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Department</label>
              <input className={styles.fieldInput} value={department} onChange={(e) => setDepartment(e.target.value)} required />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Floor &amp; Wing Location</label>
              <input className={styles.fieldInput} value={floor} onChange={(e) => setFloor(e.target.value)} required />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Bed Capacity Limit</label>
              <input
                type="number"
                className={styles.fieldInput}
                value={totalBeds}
                onChange={(e) => setTotalBeds(Number(e.target.value))}
                min={1}
                required
              />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Lead Physician (ICU)</label>
              <input className={styles.fieldInput} value={leadDoctor} onChange={(e) => setLeadDoctor(e.target.value)} />
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>Head Nurse on Duty</label>
              <input className={styles.fieldInput} value={headNurse} onChange={(e) => setHeadNurse(e.target.value)} />
            </div>

            <div className={styles.fieldGroup} style={{ gridColumn: 'span 2' }}>
              <label className={styles.fieldLabel}>Clinical Specialty Focus</label>
              <input className={styles.fieldInput} value={specialty} onChange={(e) => setSpecialty(e.target.value)} />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 16 }}>
            <button type="button" className={styles.secondaryBtn} onClick={() => setOpen(false)}>
              Cancel
            </button>
            <button type="submit" className={`${styles.actionBtn} ${styles.primaryBtn}`}>
              Save Ward Settings
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
