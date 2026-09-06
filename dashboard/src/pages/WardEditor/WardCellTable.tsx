// pages/WardEditor/WardCellTable.tsx
import { useState } from 'react';
import type { EditablePatientRecord, Bed } from '../../types/ward';
import EditCellModal from './EditCellModal.tsx';
import styles from './wardEditor.module.css';

interface Props {
  patients: EditablePatientRecord[];
  beds?: Bed[];
  onUpdateCell: (patientId: number, field: keyof EditablePatientRecord, value: any) => void;
  onUpdateFullRecord: (patientId: number, record: EditablePatientRecord) => void;
  onDischarge: (patientId: number) => void;
  onTransfer: (patient: EditablePatientRecord) => void;
}

export default function WardCellTable({
  patients,
  beds: _beds,
  onUpdateCell,
  onUpdateFullRecord,
  onDischarge,
  onTransfer,
}: Props) {
  const [editingCell, setEditingCell] = useState<{
    patientId: number;
    field: keyof EditablePatientRecord;
  } | null>(null);

  const [cellValue, setCellValue] = useState<string>('');
  const [modalPatient, setModalPatient] = useState<EditablePatientRecord | null>(null);
  const [search, setSearch] = useState('');

  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.bed.toLowerCase().includes(search.toLowerCase()) ||
      p.diagnosis.toLowerCase().includes(search.toLowerCase())
  );

  const startEdit = (patient: EditablePatientRecord, field: keyof EditablePatientRecord) => {
    setEditingCell({ patientId: patient.id, field });
    setCellValue(String(patient[field] ?? ''));
  };

  const saveEdit = (patientId: number, field: keyof EditablePatientRecord) => {
    let finalVal: any = cellValue;
    if (field === 'age') {
      finalVal = Number(cellValue) || 0;
    }
    onUpdateCell(patientId, field, finalVal);
    setEditingCell(null);
  };

  const cancelEdit = () => {
    setEditingCell(null);
  };

  const isEditing = (patientId: number, field: keyof EditablePatientRecord) => {
    return editingCell?.patientId === patientId && editingCell?.field === field;
  };

  return (
    <div className={styles.tableCard}>
      <div className={styles.tableToolbar}>
        <div className={styles.tableTitle}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--blue)" strokeWidth="2.2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="3" y1="9" x2="21" y2="9" />
            <line x1="3" y1="15" x2="21" y2="15" />
            <line x1="9" y1="3" x2="9" y2="21" />
            <line x1="15" y1="3" x2="15" y2="21" />
          </svg>
          Interactive Ward Data Grid ({patients.length} Occupied Beds)
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className={styles.hintPill}>💡 Tip: Click any cell to edit inline</span>
          <input
            className={styles.fieldInput}
            style={{ width: 220, padding: '7px 12px', fontSize: 12 }}
            placeholder="Search bed, person, or diagnosis…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.cellTable}>
          <thead>
            <tr>
              <th>Bed #</th>
              <th>Patient Name</th>
              <th>Age</th>
              <th>Diagnosis / Care Focus</th>
              <th>Clinical Condition</th>
              <th>Admit Date</th>
              <th>Procedure / Surgery</th>
              <th>Expected Exit</th>
              <th>Doctor</th>
              <th>Nurse</th>
              <th>Diet</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.map((p) => {
              return (
                <tr key={p.id}>
                  {/* Bed # */}
                  <td>
                    {isEditing(p.id, 'bed') ? (
                      <div className={styles.inlineInputWrap}>
                        <input
                          autoFocus
                          className={styles.inlineInput}
                          style={{ width: 80 }}
                          value={cellValue}
                          onChange={(e) => setCellValue(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && saveEdit(p.id, 'bed')}
                        />
                        <button className={styles.saveBtn} onClick={() => saveEdit(p.id, 'bed')}>✓</button>
                        <button className={styles.cancelCellBtn} onClick={cancelEdit}>✕</button>
                      </div>
                    ) : (
                      <div
                        className={styles.editableCell}
                        onClick={() => startEdit(p, 'bed')}
                        title="Click to edit bed number"
                      >
                        <span
                          className={styles.bedDot}
                          style={{
                            background:
                              p.condition === 'critical'
                                ? 'var(--coral)'
                                : p.condition === 'watch'
                                ? 'var(--amber)'
                                : 'var(--mint)',
                          }}
                        />
                        <strong>{p.bed}</strong>
                      </div>
                    )}
                  </td>

                  {/* Patient Name */}
                  <td>
                    {isEditing(p.id, 'name') ? (
                      <div className={styles.inlineInputWrap}>
                        <input
                          autoFocus
                          className={styles.inlineInput}
                          style={{ width: 110 }}
                          value={cellValue}
                          onChange={(e) => setCellValue(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && saveEdit(p.id, 'name')}
                        />
                        <button className={styles.saveBtn} onClick={() => saveEdit(p.id, 'name')}>✓</button>
                        <button className={styles.cancelCellBtn} onClick={cancelEdit}>✕</button>
                      </div>
                    ) : (
                      <div
                        className={styles.editableCell}
                        onClick={() => startEdit(p, 'name')}
                        title="Click to edit name"
                      >
                        <strong>{p.name}</strong>
                      </div>
                    )}
                  </td>

                  {/* Age */}
                  <td>
                    {isEditing(p.id, 'age') ? (
                      <div className={styles.inlineInputWrap}>
                        <input
                          autoFocus
                          type="number"
                          className={styles.inlineInput}
                          style={{ width: 55 }}
                          value={cellValue}
                          onChange={(e) => setCellValue(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && saveEdit(p.id, 'age')}
                        />
                        <button className={styles.saveBtn} onClick={() => saveEdit(p.id, 'age')}>✓</button>
                        <button className={styles.cancelCellBtn} onClick={cancelEdit}>✕</button>
                      </div>
                    ) : (
                      <div
                        className={styles.editableCell}
                        onClick={() => startEdit(p, 'age')}
                        title="Click to edit age"
                      >
                        {p.age} y/o
                      </div>
                    )}
                  </td>

                  {/* Diagnosis */}
                  <td>
                    {isEditing(p.id, 'diagnosis') ? (
                      <div className={styles.inlineInputWrap}>
                        <input
                          autoFocus
                          className={styles.inlineInput}
                          style={{ width: 180 }}
                          value={cellValue}
                          onChange={(e) => setCellValue(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && saveEdit(p.id, 'diagnosis')}
                        />
                        <button className={styles.saveBtn} onClick={() => saveEdit(p.id, 'diagnosis')}>✓</button>
                        <button className={styles.cancelCellBtn} onClick={cancelEdit}>✕</button>
                      </div>
                    ) : (
                      <div
                        className={styles.editableCell}
                        onClick={() => startEdit(p, 'diagnosis')}
                        title="Click to edit diagnosis"
                      >
                        {p.diagnosis}
                      </div>
                    )}
                  </td>

                  {/* Clinical Condition */}
                  <td>
                    <select
                      className={styles.fieldInput}
                      style={{
                        padding: '3px 8px',
                        fontSize: 11,
                        fontWeight: 700,
                        borderRadius: 12,
                        cursor: 'pointer',
                        borderColor:
                          p.condition === 'critical'
                            ? 'var(--coral)'
                            : p.condition === 'watch'
                            ? 'var(--amber)'
                            : 'var(--mint)',
                      }}
                      value={p.condition}
                      onChange={(e) => onUpdateCell(p.id, 'condition', e.target.value)}
                    >
                      <option value="stable">Stable</option>
                      <option value="watch">Watch</option>
                      <option value="critical">Critical</option>
                    </select>
                  </td>

                  {/* Admit Date */}
                  <td>
                    {isEditing(p.id, 'admitDate') ? (
                      <div className={styles.inlineInputWrap}>
                        <input
                          autoFocus
                          className={styles.inlineInput}
                          style={{ width: 140 }}
                          value={cellValue}
                          onChange={(e) => setCellValue(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && saveEdit(p.id, 'admitDate')}
                        />
                        <button className={styles.saveBtn} onClick={() => saveEdit(p.id, 'admitDate')}>✓</button>
                        <button className={styles.cancelCellBtn} onClick={cancelEdit}>✕</button>
                      </div>
                    ) : (
                      <div
                        className={styles.editableCell}
                        onClick={() => startEdit(p, 'admitDate')}
                        title="Click to edit admit date"
                      >
                        {p.admitDate}
                      </div>
                    )}
                  </td>

                  {/* Operation Date / Procedure */}
                  <td>
                    {isEditing(p.id, 'operationDate') ? (
                      <div className={styles.inlineInputWrap}>
                        <input
                          autoFocus
                          className={styles.inlineInput}
                          style={{ width: 140 }}
                          value={cellValue}
                          onChange={(e) => setCellValue(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && saveEdit(p.id, 'operationDate')}
                        />
                        <button className={styles.saveBtn} onClick={() => saveEdit(p.id, 'operationDate')}>✓</button>
                        <button className={styles.cancelCellBtn} onClick={cancelEdit}>✕</button>
                      </div>
                    ) : (
                      <div
                        className={styles.editableCell}
                        onClick={() => startEdit(p, 'operationDate')}
                        title="Click to edit surgery date"
                      >
                        {p.operationDate ? (
                          <span>{p.operationDate} ({p.operationName || 'Procedure'})</span>
                        ) : (
                          <span style={{ color: 'var(--ink-faint)', fontStyle: 'italic' }}>None Scheduled</span>
                        )}
                      </div>
                    )}
                  </td>

                  {/* Expected Exit */}
                  <td>
                    {isEditing(p.id, 'expectedExitDate') ? (
                      <div className={styles.inlineInputWrap}>
                        <input
                          autoFocus
                          className={styles.inlineInput}
                          style={{ width: 110 }}
                          value={cellValue}
                          onChange={(e) => setCellValue(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && saveEdit(p.id, 'expectedExitDate')}
                        />
                        <button className={styles.saveBtn} onClick={() => saveEdit(p.id, 'expectedExitDate')}>✓</button>
                        <button className={styles.cancelCellBtn} onClick={cancelEdit}>✕</button>
                      </div>
                    ) : (
                      <div
                        className={styles.editableCell}
                        onClick={() => startEdit(p, 'expectedExitDate')}
                        title="Click to edit discharge date"
                      >
                        {p.expectedExitDate}
                      </div>
                    )}
                  </td>

                  {/* Doctor */}
                  <td>
                    <span style={{ fontWeight: 700, color: 'var(--blue)' }}>{p.assignedDoctor}</span>
                  </td>

                  {/* Nurse */}
                  <td>
                    <span style={{ fontWeight: 600 }}>{p.assignedNurse}</span>
                  </td>

                  {/* Diet */}
                  <td>
                    {isEditing(p.id, 'dietStatus') ? (
                      <div className={styles.inlineInputWrap}>
                        <input
                          autoFocus
                          className={styles.inlineInput}
                          style={{ width: 140 }}
                          value={cellValue}
                          onChange={(e) => setCellValue(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && saveEdit(p.id, 'dietStatus')}
                        />
                        <button className={styles.saveBtn} onClick={() => saveEdit(p.id, 'dietStatus')}>✓</button>
                        <button className={styles.cancelCellBtn} onClick={cancelEdit}>✕</button>
                      </div>
                    ) : (
                      <div
                        className={styles.editableCell}
                        onClick={() => startEdit(p, 'dietStatus')}
                        title="Click to edit diet instructions"
                      >
                        {p.dietStatus}
                      </div>
                    )}
                  </td>

                  {/* Actions */}
                  <td>
                    <div className={styles.actionCell}>
                      <button
                        type="button"
                        className={styles.rowActionBtn}
                        onClick={() => setModalPatient(p)}
                        title="Open full editor modal"
                      >
                        ✏️ Edit All
                      </button>
                      <button
                        type="button"
                        className={styles.rowActionBtn}
                        onClick={() => onTransfer(p)}
                        title="Transfer to another bed or ward"
                      >
                        ⇄ Transfer
                      </button>
                      <button
                        type="button"
                        className={styles.rowActionBtn}
                        style={{ color: 'var(--coral)' }}
                        onClick={() => onDischarge(p.id)}
                        title="Discharge patient"
                      >
                        Discharge
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {modalPatient && (
        <EditCellModal
          patient={modalPatient}
          onSave={(updated) => onUpdateFullRecord(updated.id, updated)}
          onClose={() => setModalPatient(null)}
        />
      )}
    </div>
  );
}
