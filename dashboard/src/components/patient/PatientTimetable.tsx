// components/patient/PatientTimetable.tsx
import { useState } from 'react';
import type { ScheduleItem, ScheduleCategory } from '../../types/patient';
import { showToast } from '../ui/Toast.tsx';
import styles from './timetable.module.css';

interface Props {
  schedule: ScheduleItem[];
  isStaff?: boolean;
  patientName: string;
}

const CATEGORY_META: Record<
  ScheduleCategory,
  { label: string; icon: string; color: string; bg: string }
> = {
  visiting: {
    label: 'Family Meet',
    icon: '👨‍👩‍👧',
    color: 'var(--blue)',
    bg: 'rgba(76, 141, 255, 0.12)',
  },
  medicine: {
    label: 'Medicine Time',
    icon: '💊',
    color: '#e84379',
    bg: 'rgba(232, 67, 121, 0.12)',
  },
  sleep: {
    label: 'Sleep & Rest',
    icon: '🌙',
    color: '#8C7CF0',
    bg: 'rgba(140, 124, 240, 0.12)',
  },
  doctor_rounds: {
    label: 'Doctor Rounds',
    icon: '🩺',
    color: '#1c8a5f',
    bg: 'rgba(47, 189, 133, 0.12)',
  },
  meal: {
    label: 'Meal & Nutrition',
    icon: '🥗',
    color: '#b8791f',
    bg: 'rgba(245, 169, 63, 0.12)',
  },
  vitals_check: {
    label: 'Vitals Check',
    icon: '📊',
    color: 'var(--blue)',
    bg: 'rgba(76, 141, 255, 0.12)',
  },
};

export default function PatientTimetable({ schedule: initialSchedule, isStaff = false, patientName }: Props) {
  const [schedule, setSchedule] = useState<ScheduleItem[]>(initialSchedule);
  const [filter, setFilter] = useState<'all' | ScheduleCategory>('all');

  const filtered = schedule.filter((item) => (filter === 'all' ? true : item.category === filter));

  const currentActive = schedule.find((item) => item.status === 'in_progress');

  const handleToggleStatus = (id: string) => {
    setSchedule((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const nextStatus = item.status === 'completed' ? 'upcoming' : 'completed';
        showToast(`Updated status for "${item.title}" to ${nextStatus}.`);
        return { ...item, status: nextStatus };
      })
    );
  };

  return (
    <div className={`${styles.timetableCard} glass`}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <div className={styles.badgeRow}>
            <span className={styles.sectionBadge}>
              {isStaff ? 'Ward Clinical Schedule' : 'Daily Routine Guide'}
            </span>
            <span className={styles.liveClock}>
              ● Current Shift: 08:00 AM – 08:00 PM
            </span>
          </div>
          <h2 className={styles.title}>
            {patientName}'s Daily Timetable &amp; Care Routine
          </h2>
          <p className={styles.sub}>
            Scheduled medicine times, family visiting windows, doctor rounds, and quiet sleep hours.
          </p>
        </div>
      </div>

      {/* Prominent Banner for Currently Active Timeblock */}
      {currentActive && (
        <div
          className={`${styles.activeBanner} ${
            currentActive.category === 'visiting'
              ? styles.visitingActive
              : currentActive.category === 'sleep'
              ? styles.sleepActive
              : styles.medicineActive
          }`}
        >
          <div className={styles.bannerIconWrap}>
            <span className={styles.bannerIcon}>
              {CATEGORY_META[currentActive.category].icon}
            </span>
          </div>
          <div className={styles.bannerContent}>
            <div className={styles.bannerBadge}>
              <span className={styles.pulseDot}></span>
              Happening Right Now ({currentActive.time})
            </div>
            <div className={styles.bannerTitle}>{currentActive.title}</div>
            <div className={styles.bannerDesc}>{currentActive.description}</div>
          </div>
          <div className={styles.bannerAssigned}>
            Assigned: <strong>{currentActive.assignedTo}</strong>
          </div>
        </div>
      )}

      {/* Category Filter Tabs */}
      <div className={styles.filters}>
        <button
          type="button"
          className={`${styles.filterBtn} ${filter === 'all' ? styles.filterActive : ''}`}
          onClick={() => setFilter('all')}
        >
          All Activities ({schedule.length})
        </button>
        <button
          type="button"
          className={`${styles.filterBtn} ${filter === 'visiting' ? styles.filterActive : ''}`}
          onClick={() => setFilter('visiting')}
        >
          👨‍👩‍👧 Family Meet Time
        </button>
        <button
          type="button"
          className={`${styles.filterBtn} ${filter === 'medicine' ? styles.filterActive : ''}`}
          onClick={() => setFilter('medicine')}
        >
          💊 Medicine Schedule
        </button>
        <button
          type="button"
          className={`${styles.filterBtn} ${filter === 'sleep' ? styles.filterActive : ''}`}
          onClick={() => setFilter('sleep')}
        >
          🌙 Sleep &amp; Rest Hours
        </button>
        <button
          type="button"
          className={`${styles.filterBtn} ${filter === 'doctor_rounds' ? styles.filterActive : ''}`}
          onClick={() => setFilter('doctor_rounds')}
        >
          🩺 Doctor 1 Rounds
        </button>
        <button
          type="button"
          className={`${styles.filterBtn} ${filter === 'meal' ? styles.filterActive : ''}`}
          onClick={() => setFilter('meal')}
        >
          🥗 Meals &amp; Nutrition
        </button>
      </div>

      {/* Schedule Timeline Grid */}
      <div className={styles.timelineList}>
        {filtered.map((item) => {
          const meta = CATEGORY_META[item.category];
          const isDone = item.status === 'completed';
          const isCurrent = item.status === 'in_progress';

          return (
            <div
              key={item.id}
              className={`${styles.itemRow} ${isCurrent ? styles.itemRowActive : ''} ${
                isDone ? styles.itemRowDone : ''
              }`}
            >
              {/* Time Column */}
              <div className={styles.timeCol}>
                <span className={styles.timeText}>{item.time}</span>
                <span
                  className={styles.catPill}
                  style={{ color: meta.color, background: meta.bg }}
                >
                  {meta.icon} {meta.label}
                </span>
              </div>

              {/* Dot & Line */}
              <div className={styles.lineCol}>
                <div
                  className={`${styles.timelineDot} ${
                    isDone ? styles.dotDone : isCurrent ? styles.dotCurrent : styles.dotUpcoming
                  }`}
                ></div>
                <div className={styles.timelineLine}></div>
              </div>

              {/* Details Column */}
              <div className={styles.detailCol}>
                <div className={styles.itemHeader}>
                  <div className={styles.itemTitleRow}>
                    <span className={styles.itemTitle}>{item.title}</span>
                    <span
                      className={`${styles.statusBadge} ${
                        isDone
                          ? styles.badgeCompleted
                          : isCurrent
                          ? styles.badgeCurrent
                          : styles.badgeUpcoming
                      }`}
                    >
                      {isDone ? '✓ Completed' : isCurrent ? '⏳ In Progress' : '🕒 Upcoming'}
                    </span>
                  </div>
                  <span className={styles.assignedBadge}>
                    By {item.assignedTo}
                  </span>
                </div>
                <p className={styles.itemDesc}>{item.description}</p>
              </div>

              {/* Staff Action if in doctor/staff mode */}
              {isStaff && (
                <div className={styles.actionCol}>
                  <button
                    type="button"
                    className={`${styles.statusToggleBtn} ${isDone ? styles.btnUndo : styles.btnMark}`}
                    onClick={() => handleToggleStatus(item.id)}
                    title={isDone ? 'Mark as pending' : 'Mark as completed'}
                  >
                    {isDone ? 'Mark Pending' : 'Mark Done ✓'}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
