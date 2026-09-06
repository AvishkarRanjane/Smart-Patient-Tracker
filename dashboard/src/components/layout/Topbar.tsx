// components/layout/Topbar.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAlertContext } from '../../context/AlertContext';
import { useWardManagement } from '../../context/WardManagementContext';
import { useAuth } from '../../context/AuthContext';
import { uptimeStr } from '../../utils/formatters';
import styles from './Topbar.module.css';

const START_TIME = Date.now();

export default function Topbar() {
  const [time, setTime] = useState(new Date());
  const { criticalUnacked } = useAlertContext();
  const { wards, activeWardId, setActiveWardId } = useWardManagement();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const isAlert = criticalUnacked > 0;

  return (
    <header className={`${styles.topbar} glass`}>
      {/* Dynamic Ward Switcher */}
      <select
        className={styles.wardSelect}
        value={activeWardId}
        onChange={(e) => setActiveWardId(e.target.value)}
        title="Switch clinical ward / recovery unit"
      >
        {wards.map((ward) => (
          <option key={ward.id} value={ward.id}>
            {ward.code} · {ward.name}
          </option>
        ))}
      </select>

      <div className={styles.searchWrap}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
          <circle cx="11" cy="11" r="7" /><path d="M21 21l-4-4" />
        </svg>
        <input
          className={styles.searchInput}
          placeholder="Search patient or bed…"
          onKeyDown={e => { if (e.key === 'Enter') navigate('/'); }}
        />
      </div>

      <div className={styles.right}>
        {/* User Session Profile Badge */}
        {user && (
          <button
            type="button"
            className={styles.userBadge}
            onClick={() => navigate('/login')}
            title={`Logged in as ${user.name}. Click to switch role portal.`}
          >
            <div
              className={`${styles.userAvatar} ${
                user.role === 'doctor'
                  ? styles.userDoc
                  : user.role === 'staff'
                  ? styles.userStaff
                  : styles.userFam
              }`}
            >
              {user.initials}
            </div>
            <div className={styles.userTextWrap}>
              <div className={styles.userName}>{user.name}</div>
              <div className={styles.userRole}>{user.roleTitle}</div>
            </div>
          </button>
        )}

        <div className={styles.canaryPill} title="Live data connection to bedside monitors">
          <span className={styles.canaryDot}></span>
          Live Sync: Fast
        </div>

        <div className={styles.clock}>
          <div className={styles.clockTime}>{time.toLocaleTimeString('en-US', { hour12: false })}</div>
          <div className={styles.clockDate}>{time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</div>
        </div>

        <div className={styles.uptime}>
          <div className={styles.uptimeLabel}>Active Time</div>
          <div className={styles.uptimeVal}>{uptimeStr(START_TIME)}</div>
        </div>

        <div className={`${styles.statusPill} ${isAlert ? styles.alert : ''}`}>
          <span className={styles.statusDot}></span>
          {isAlert ? `${criticalUnacked} Urgent Alert${criticalUnacked > 1 ? 's' : ''} Needs Review` : 'All Systems Running Well'}
        </div>
      </div>
    </header>
  );
}
