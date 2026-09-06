// pages/Login/LoginPage.tsx
import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import type { UserRole } from '../../types/auth';
import { PATIENT_NAMES } from '../../utils/constants';
import styles from './login.module.css';

export default function LoginPage() {
  const { user, login, loginWithCredentials } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<UserRole>('doctor');
  
  // Doctor form state
  const [docUsername, setDocUsername] = useState('doctor');
  const [docPassword, setDocPassword] = useState('');
  const [showDocPass, setShowDocPass] = useState(false);

  // Staff form state
  const [staffId, setStaffId] = useState('staff');
  const [staffPin, setStaffPin] = useState('');
  const [showStaffPass, setShowStaffPass] = useState(false);

  // Family form state
  const [selectedPatientId, setSelectedPatientId] = useState(0);
  const [familyPin, setFamilyPin] = useState('');
  const [showFamilyPass, setShowFamilyPass] = useState(false);

  // Error feedback
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleDoctorSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const res = loginWithCredentials('doctor', docUsername, docPassword);
    if (res.success) {
      navigate('/');
    } else {
      setErrorMsg(res.error || 'Authentication failed');
    }
  };

  const handleStaffSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const res = loginWithCredentials('staff', staffId, staffPin);
    if (res.success) {
      navigate('/');
    } else {
      setErrorMsg(res.error || 'Authentication failed');
    }
  };

  const handleFamilySubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const res = loginWithCredentials('family', '', familyPin, selectedPatientId);
    if (res.success) {
      navigate('/family');
    } else {
      setErrorMsg(res.error || 'Authentication failed');
    }
  };

  const handleQuickLogin = (role: UserRole, patientId = 0) => {
    setErrorMsg(null);
    login(role, patientId);
    if (role === 'family') {
      navigate('/family');
    } else {
      navigate('/');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginCard}>
        {/* Brand Header */}
        <div className={styles.brandHead}>
          <div className={styles.brandLogo}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
              <path d="M3 12h4l2-8 4 16 2-8h6" />
            </svg>
          </div>
          <div>
            <div className={styles.brandTitle}>Smart Patient Tracker</div>
            <div className={styles.brandSub}>Clinical ICU Monitoring & Family Portal</div>
          </div>
        </div>

        {/* Current Active User Banner if logged in */}
        {user && (
          <div className={styles.currentActiveUser}>
            <div className={styles.currentActiveInfo}>
              Currently signed in as: <strong>{user.name}</strong> ({user.roleTitle})
            </div>
            <button
              type="button"
              className={styles.returnBtn}
              onClick={() => navigate(user.role === 'family' ? '/family' : '/')}
            >
              Go to Dashboard →
            </button>
          </div>
        )}

        <div className={styles.titleArea}>
          <h1 className={styles.welcomeTitle}>Secure Hospital Sign-In</h1>
          <p className={styles.welcomeDesc}>
            Select your role portal. Clinical staff manage real-time vitals and ward beds, while family members access a private live update stream.
          </p>
        </div>

        {/* Portal Role Tabs */}
        <div className={styles.tabsContainer}>
          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === 'doctor' ? `${styles.tabBtnActive} ${styles.tabDocActive}` : ''}`}
            onClick={() => {
              setActiveTab('doctor');
              setErrorMsg(null);
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={activeTab === 'doctor' ? '#2A85FF' : 'currentColor'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
              <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
              <circle cx="20" cy="10" r="2" />
            </svg>
            Doctor Portal
          </button>

          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === 'staff' ? `${styles.tabBtnActive} ${styles.tabStaffActive}` : ''}`}
            onClick={() => {
              setActiveTab('staff');
              setErrorMsg(null);
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={activeTab === 'staff' ? '#2FBD85' : 'currentColor'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
            Staff & Nurse
          </button>

          <button
            type="button"
            className={`${styles.tabBtn} ${activeTab === 'family' ? `${styles.tabBtnActive} ${styles.tabFamilyActive}` : ''}`}
            onClick={() => {
              setActiveTab('family');
              setErrorMsg(null);
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={activeTab === 'family' ? '#FF5B79' : 'currentColor'} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            Family Portal
          </button>
        </div>

        {/* Error Feedback */}
        {errorMsg && (
          <div className={styles.errorMessage}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            {errorMsg}
          </div>
        )}

        {/* Tab 1: Doctor Login Form */}
        {activeTab === 'doctor' && (
          <form className={styles.formBody} onSubmit={handleDoctorSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Doctor License ID / Username
                <span className={styles.hintText}>demo: doctor</span>
              </label>
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  className={styles.inputField}
                  placeholder="e.g. doctor"
                  value={docUsername}
                  onChange={(e) => setDocUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                Clinical Password
                <span className={styles.hintText}>demo: doctor123</span>
              </label>
              <div className={styles.inputWrapper}>
                <input
                  type={showDocPass ? 'text' : 'password'}
                  className={styles.inputField}
                  placeholder="Enter medical security password"
                  value={docPassword}
                  onChange={(e) => setDocPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowDocPass(!showDocPass)}
                  title={showDocPass ? 'Hide password' : 'Show password'}
                >
                  {showDocPass ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className={`${styles.submitBtn} ${styles.docBtn}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              Sign In as Doctor 1
            </button>

            {/* Quick 1-click demo */}
            <div className={styles.quickSection}>
              <div className={styles.quickHead}>
                <span className={styles.quickLabel}>Quick Testing</span>
                <span className={styles.hintText}>No typing needed</span>
              </div>
              <button
                type="button"
                className={styles.demoBtn}
                onClick={() => handleQuickLogin('doctor')}
              >
                ⚡ Instant Demo Login as Doctor 1 (Lead ICU Specialist)
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Staff & Nurse Form */}
        {activeTab === 'staff' && (
          <form className={styles.formBody} onSubmit={handleStaffSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Nursing Staff ID
                <span className={styles.hintText}>demo: staff</span>
              </label>
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  className={styles.inputField}
                  placeholder="e.g. staff"
                  value={staffId}
                  onChange={(e) => setStaffId(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                Station Authorization PIN
                <span className={styles.hintText}>demo: staff123</span>
              </label>
              <div className={styles.inputWrapper}>
                <input
                  type={showStaffPass ? 'text' : 'password'}
                  className={styles.inputField}
                  placeholder="Enter staff security PIN"
                  value={staffPin}
                  onChange={(e) => setStaffPin(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowStaffPass(!showStaffPass)}
                  title={showStaffPass ? 'Hide password' : 'Show password'}
                >
                  {showStaffPass ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className={`${styles.submitBtn} ${styles.staffBtn}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              Authorize Staff 1 Station
            </button>

            {/* Quick 1-click demo */}
            <div className={styles.quickSection}>
              <div className={styles.quickHead}>
                <span className={styles.quickLabel}>Quick Testing</span>
                <span className={styles.hintText}>No typing needed</span>
              </div>
              <button
                type="button"
                className={`${styles.demoBtn} ${styles.demoBtnStaff}`}
                onClick={() => handleQuickLogin('staff')}
              >
                ⚡ Instant Demo Login as Staff 1 (Senior Ward Nurse)
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Family Portal Form */}
        {activeTab === 'family' && (
          <form className={styles.formBody} onSubmit={handleFamilySubmit}>
            <div className={styles.formGroup}>
              <label className={styles.label}>
                Select Your Admitted Family Member
              </label>
              <select
                className={styles.patientSelect}
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(Number(e.target.value))}
              >
                {PATIENT_NAMES.map((name, idx) => (
                  <option key={name} value={idx}>
                    {name} — Room ICU-{401 + idx} (Bed B-{idx + 1})
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.patientPreviewCard}>
              <div className={styles.patientPreviewInfo}>
                <div className={styles.patientPreviewName}>
                  {PATIENT_NAMES[selectedPatientId]}
                </div>
                <div className={styles.patientPreviewRoom}>
                  Location: ICU Ward 4 · Room {401 + selectedPatientId} · Bed B-{selectedPatientId + 1}
                </div>
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#2FBD85', background: 'rgba(47, 189, 133, 0.1)', padding: '4px 8px', borderRadius: 6 }}>
                Active Telemetry
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>
                Family Access PIN Code
                <span className={styles.hintText}>demo: family123</span>
              </label>
              <div className={styles.inputWrapper}>
                <input
                  type={showFamilyPass ? 'text' : 'password'}
                  className={styles.inputField}
                  placeholder="Enter 4-9 digit family access PIN"
                  value={familyPin}
                  onChange={(e) => setFamilyPin(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowFamilyPass(!showFamilyPass)}
                  title={showFamilyPass ? 'Hide PIN' : 'Show PIN'}
                >
                  {showFamilyPass ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className={`${styles.submitBtn} ${styles.familyBtn}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              Access Patient Care Portal
            </button>

            {/* Quick 1-click select for each patient */}
            <div className={styles.quickSection}>
              <div className={styles.quickHead}>
                <span className={styles.quickLabel}>1-Click Family Access (Select Loved One)</span>
                <span className={styles.hintText}>Instant Entry</span>
              </div>
              <div className={styles.familyPillsGrid}>
                {PATIENT_NAMES.map((name, idx) => (
                  <button
                    key={name}
                    type="button"
                    className={styles.familyPill}
                    onClick={() => handleQuickLogin('family', idx)}
                  >
                    <span>{name}</span>
                    <span className={styles.familyPillSub}>Room ICU-{401 + idx}</span>
                  </button>
                ))}
              </div>
            </div>
          </form>
        )}

        {/* Security & HIPAA Compliance Footer */}
        <div className={styles.footerBadge}>
          <div className={styles.securityBadge}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            256-Bit Encrypted · HIPAA Isolated
          </div>
          <div>All sessions are audit-logged for clinical compliance</div>
        </div>
      </div>
    </div>
  );
}
