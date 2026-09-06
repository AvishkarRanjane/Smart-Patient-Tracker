// pages/Overview/OverviewPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWardSocket } from '../../hooks/useWardSocket';
import { useAlerts } from '../../hooks/useAlerts';
import { useWardManagement } from '../../context/WardManagementContext';
import KpiRow from './KpiRow.tsx';
import PatientCard from './PatientCard.tsx';
import DashboardToolbar from './DashboardToolbar.tsx';
import type { ViewMode, RiskFilter, SortOption } from './DashboardToolbar.tsx';
import BedMatrixView from './BedMatrixView.tsx';
import ClinicalTableView from './ClinicalTableView.tsx';
import PageTransition from '../../components/layout/PageTransition.tsx';
import styles from './overview.module.css';

const VIEW_MODE_KEY = 'dashboard_view_mode_v2';
const SHOW_KPIS_KEY = 'dashboard_show_kpis_v2';

export default function OverviewPage() {
  const patients = useWardSocket();
  useAlerts(patients);
  const { activeWard } = useWardManagement();
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    return (localStorage.getItem(VIEW_MODE_KEY) as ViewMode) || 'grid';
  });
  const [riskFilter, setRiskFilter] = useState<RiskFilter>('all');
  const [sortOption, setSortOption] = useState<SortOption>('bed');
  const [showKpis, setShowKpis] = useState<boolean>(() => {
    return localStorage.getItem(SHOW_KPIS_KEY) !== 'false';
  });

  useEffect(() => {
    localStorage.setItem(VIEW_MODE_KEY, viewMode);
  }, [viewMode]);

  useEffect(() => {
    localStorage.setItem(SHOW_KPIS_KEY, String(showKpis));
  }, [showKpis]);

  // Filter patients by search query and risk filter
  const filteredPatients = patients.filter((p) => {
    const matchesQuery =
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.bed.toLowerCase().includes(query.toLowerCase()) ||
      p.diagnosis.toLowerCase().includes(query.toLowerCase());

    if (!matchesQuery) return false;

    if (riskFilter === 'critical') {
      return p.vitals.spo2 < 93 || p.vitals.hr > 115;
    }
    if (riskFilter === 'watch') {
      return (p.vitals.spo2 < 96 && p.vitals.spo2 >= 93) || (p.vitals.hr > 95 && p.vitals.hr <= 115);
    }
    if (riskFilter === 'stable') {
      return p.vitals.spo2 >= 96 && p.vitals.hr <= 95;
    }
    return true;
  });

  // Sort patients
  const sortedPatients = [...filteredPatients].sort((a, b) => {
    if (sortOption === 'risk') {
      const getSeverity = (pat: typeof a) => {
        if (pat.vitals.spo2 < 93 || pat.vitals.hr > 115) return 3;
        if (pat.vitals.spo2 < 96 || pat.vitals.hr > 95) return 2;
        return 1;
      };
      return getSeverity(b) - getSeverity(a);
    }
    if (sortOption === 'spo2') {
      return a.vitals.spo2 - b.vitals.spo2;
    }
    if (sortOption === 'hr') {
      return b.vitals.hr - a.vitals.hr;
    }
    return a.bed.localeCompare(b.bed);
  });

  return (
    <PageTransition>
      {/* Head Area */}
      <div className={styles.head}>
        <div>
          <h1 className={styles.title}>{activeWard.name}</h1>
          <p className={styles.sub}>
            Showing {sortedPatients.length} patient{sortedPatients.length !== 1 ? 's' : ''} · {activeWard.floor} · Live vital feeds
          </p>
        </div>
        <input
          className={styles.search}
          placeholder="Search patient, bed, or diagnosis…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {/* KPI Cards Row (Collapsible) */}
      {showKpis && <KpiRow patients={patients} />}

      {/* Customizable Dashboard Toolbar */}
      <DashboardToolbar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        riskFilter={riskFilter}
        onRiskFilterChange={setRiskFilter}
        sortOption={sortOption}
        onSortOptionChange={setSortOption}
        showKpis={showKpis}
        onToggleKpis={() => setShowKpis(!showKpis)}
        totalVisible={sortedPatients.length}
      />

      {/* Render active view mode */}
      {viewMode === 'grid' && (
        <div className={styles.grid}>
          {sortedPatients.map((p) => (
            <PatientCard
              key={p.id}
              patient={p}
              onClick={() => navigate(`/patient/${p.id}`)}
            />
          ))}
        </div>
      )}

      {viewMode === 'matrix' && (
        <BedMatrixView livePatients={patients} />
      )}

      {viewMode === 'table' && (
        <ClinicalTableView patients={sortedPatients} />
      )}
    </PageTransition>
  );
}
