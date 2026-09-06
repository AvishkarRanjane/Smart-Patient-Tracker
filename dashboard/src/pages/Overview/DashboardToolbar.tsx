// pages/Overview/DashboardToolbar.tsx
import styles from './overview.module.css';

export type ViewMode = 'grid' | 'matrix' | 'table';
export type RiskFilter = 'all' | 'critical' | 'watch' | 'stable';
export type SortOption = 'bed' | 'risk' | 'spo2' | 'hr';

interface DashboardToolbarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  riskFilter: RiskFilter;
  onRiskFilterChange: (filter: RiskFilter) => void;
  sortOption: SortOption;
  onSortOptionChange: (sort: SortOption) => void;
  showKpis: boolean;
  onToggleKpis: () => void;
  totalVisible: number;
}

export default function DashboardToolbar({
  viewMode,
  onViewModeChange,
  riskFilter,
  onRiskFilterChange,
  sortOption,
  onSortOptionChange,
  showKpis,
  onToggleKpis,
  totalVisible,
}: DashboardToolbarProps) {
  return (
    <div className={styles.toolbar}>
      {/* Left: View Mode Tabs */}
      <div className={styles.toolbarLeft}>
        <div className={styles.viewTabs}>
          <button
            type="button"
            className={`${styles.viewTab} ${viewMode === 'grid' ? styles.viewTabActive : ''}`}
            onClick={() => onViewModeChange('grid')}
            title="Telemetry Card Grid"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
            </svg>
            Telemetry Grid
          </button>

          <button
            type="button"
            className={`${styles.viewTab} ${viewMode === 'matrix' ? styles.viewTabActive : ''}`}
            onClick={() => onViewModeChange('matrix')}
            title="Ward Floor Map & Bed Matrix"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 4v16" />
              <path d="M2 8h18a2 2 0 0 1 2 2v10" />
              <path d="M2 17h20" />
              <path d="M6 8v9" />
            </svg>
            Bed Matrix
          </button>

          <button
            type="button"
            className={`${styles.viewTab} ${viewMode === 'table' ? styles.viewTabActive : ''}`}
            onClick={() => onViewModeChange('table')}
            title="High-Density Clinical Triage Table"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6" />
              <line x1="8" y1="12" x2="21" y2="12" />
              <line x1="8" y1="18" x2="21" y2="18" />
              <line x1="3" y1="6" x2="3.01" y2="6" />
              <line x1="3" y1="12" x2="3.01" y2="12" />
              <line x1="3" y1="18" x2="3.01" y2="18" />
            </svg>
            Clinical Table
          </button>
        </div>

        <div style={{ fontSize: 12, color: 'var(--ink-faint)', fontWeight: 600 }}>
          Showing <strong>{totalVisible}</strong> records
        </div>
      </div>

      {/* Right: Filters, Sort, and KPI Toggle */}
      <div className={styles.toolbarRight}>
        {/* Acuity Filter */}
        <select
          className={styles.filterSelect}
          value={riskFilter}
          onChange={(e) => onRiskFilterChange(e.target.value as RiskFilter)}
          title="Filter by patient clinical status"
        >
          <option value="all">All Conditions</option>
          <option value="critical">🔴 Critical Alert Only</option>
          <option value="watch">🟡 Watch / Elevated</option>
          <option value="stable">🟢 Stable Patients</option>
        </select>

        {/* Sort Select */}
        <select
          className={styles.sortSelect}
          value={sortOption}
          onChange={(e) => onSortOptionChange(e.target.value as SortOption)}
          title="Sort patients"
        >
          <option value="bed">Sort: Bed Order</option>
          <option value="risk">Sort: Severity & Risk</option>
          <option value="spo2">Sort: Lowest SpO2 first</option>
          <option value="hr">Sort: Highest Heart Rate</option>
        </select>

        {/* KPI Toggle Button */}
        <button
          type="button"
          className={styles.kpiToggleBtn}
          onClick={onToggleKpis}
          title={showKpis ? 'Hide KPI Summary Bar' : 'Show KPI Summary Bar'}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            {showKpis ? (
              <>
                <polyline points="18 15 12 9 6 15" />
              </>
            ) : (
              <>
                <polyline points="6 9 12 15 18 9" />
              </>
            )}
          </svg>
          {showKpis ? 'Hide KPIs' : 'Show KPIs'}
        </button>
      </div>
    </div>
  );
}
