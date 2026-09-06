// app/App.tsx
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProviders } from './providers';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/layout/Sidebar';
import Topbar from '../components/layout/Topbar';
import Toast from '../components/ui/Toast';
import AuroraBackground from './AuroraBackground.tsx';
import OverviewPage from '../pages/Overview/OverviewPage.tsx';
import PatientDetailPage from '../pages/PatientDetail/PatientDetailPage.tsx';
import AlertsPage from '../pages/Alerts/AlertsPage.tsx';
import DevicesPage from '../pages/Devices/DevicesPage.tsx';
import TrendsPage from '../pages/Trends/TrendsPage.tsx';
import SettingsPage from '../pages/Settings/SettingsPage.tsx';
import LoginPage from '../pages/Login/LoginPage.tsx';
import FamilyPortalPage from '../pages/Family/FamilyPortalPage.tsx';
import WardEditorPage from '../pages/WardEditor/WardEditorPage.tsx';
import ProtectedRoute from '../components/auth/ProtectedRoute.tsx';
import styles from './app.module.css';

function DashboardShell() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Strict isolation: Family members only see the Family Portal
  if (user.role === 'family') {
    return <Navigate to="/family" replace />;
  }

  return (
    <div className={styles.shell}>
      <Sidebar />
      <div className={styles.main}>
        <Topbar />
        <div className={styles.content}>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute allowedRoles={['doctor', 'staff']}>
                  <OverviewPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/:id"
              element={
                <ProtectedRoute allowedRoles={['doctor', 'staff']}>
                  <PatientDetailPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ward-editor"
              element={
                <ProtectedRoute allowedRoles={['doctor', 'staff']} requiredPermission="EDIT_PATIENT_CELLS">
                  <WardEditorPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/alerts"
              element={
                <ProtectedRoute allowedRoles={['doctor', 'staff']}>
                  <AlertsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/devices"
              element={
                <ProtectedRoute allowedRoles={['doctor', 'staff']}>
                  <DevicesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trends"
              element={
                <ProtectedRoute allowedRoles={['doctor', 'staff']}>
                  <TrendsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute allowedRoles={['doctor', 'staff']}>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProviders>
      <HashRouter>
        <AuroraBackground />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/family"
            element={
              <ProtectedRoute allowedRoles={['family', 'doctor', 'staff']}>
                <FamilyPortalPage />
              </ProtectedRoute>
            }
          />
          <Route path="/*" element={<DashboardShell />} />
        </Routes>
        <Toast />
      </HashRouter>
    </AppProviders>
  );
}
