// components/layout/Sidebar.tsx
import type { ReactNode } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAlertContext } from '../../context/AlertContext';
import { showToast } from '../ui/Toast.tsx';
import styles from './Sidebar.module.css';

interface NavItemDef {
  to: string;
  label: string;
  badge?: 'alerts';
  icon: () => ReactNode;
}

interface NavSectionDef {
  label: string;
  items: NavItemDef[];
}

const NAV_SECTIONS: NavSectionDef[] = [
  {
    label: 'Monitor',
    items: [
      {
        to: '/',
        label: 'Overview',
        icon: () => (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" rx="2" />
            <rect x="14" y="3" width="7" height="7" rx="2" />
            <rect x="3" y="14" width="7" height="7" rx="2" />
            <rect x="14" y="14" width="7" height="7" rx="2" />
          </svg>
        ),
      },
      {
        to: '/alerts',
        label: 'Alerts',
        badge: 'alerts',
        icon: () => (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>
        ),
      },
      {
        to: '/devices',
        label: 'Devices',
        icon: () => (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <line x1="8" y1="21" x2="16" y2="21" />
            <line x1="12" y1="17" x2="12" y2="21" />
          </svg>
        ),
      },
    ],
  },
  {
    label: 'Analytics',
    items: [
      {
        to: '/trends',
        label: 'Trends',
        icon: () => (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
            <polyline points="16 7 22 7 22 13" />
          </svg>
        ),
      },
    ],
  },
  {
    label: 'Ward Admin',
    items: [
      {
        to: '/ward-editor',
        label: 'Ward & Cells Editor',
        icon: () => (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M3 9h18" />
            <path d="M3 15h18" />
            <path d="M9 3v18" />
            <path d="M15 3v18" />
          </svg>
        ),
      },
      {
        to: '/settings',
        label: 'Settings',
        icon: () => (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        ),
      },
    ],
  },
  {
    label: 'Portal',
    items: [
      {
        to: '/login',
        label: 'Switch Portal',
        icon: () => (
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <polyline points="10 17 15 12 10 7" />
            <line x1="15" y1="12" x2="3" y2="12" />
          </svg>
        ),
      },
    ],
  },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { unackedCount } = useAlertContext();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    showToast('Signed out. Please select a portal to sign in.');
    navigate('/login');
  };

  const displayName = user?.name || 'Doctor 1';
  const displayRole = user?.roleTitle || (user?.role === 'staff' ? 'Senior Ward Nurse' : 'Chief ICU Doctor');
  const displayInitials = user?.initials || 'D1';

  return (
    <aside className={`${styles.sidebar} glass`}>
      {/* Brand */}
      <div className={styles.brand}>
        <div className={styles.brandMark}>
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" width="18" height="18">
            <path d="M3 12h4l2-8 4 16 2-8h6" />
          </svg>
        </div>
        <div className={styles.brandInfo}>
          <div className={styles.brandName}>Vitals</div>
          <div className={styles.brandSub}>
            <span className={styles.brandSubDot}></span>
            ICU · Ward 4
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className={styles.nav}>
        {NAV_SECTIONS.map(section => (
          <div key={section.label}>
            <div className={styles.navSection}>{section.label}</div>
            {section.items.map(item => {
              const isActive = item.to === '/'
                ? location.pathname === '/' || location.pathname.startsWith('/patient')
                : location.pathname === item.to;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={`${styles.navItem} ${isActive ? styles.active : ''}`}
                >
                  <span className={styles.navIcon}>{item.icon()}</span>
                  <span className={styles.navLabel}>{item.label}</span>
                  {item.badge === 'alerts' && item.to === '/alerts' && unackedCount > 0 && (
                    <span className={styles.badge}>{unackedCount}</span>
                  )}
                </NavLink>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User foot */}
      <div className={styles.foot}>
        <div className={styles.avatar}>{displayInitials}</div>
        <div className={styles.userInfo}>
          <div className={styles.shiftName}>{displayName}</div>
          <div className={styles.shiftRole}>{displayRole}</div>
        </div>
        <button
          type="button"
          className={styles.logoutBtn}
          title="Sign Out / Switch Portal"
          onClick={handleLogout}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>
    </aside>
  );
}
