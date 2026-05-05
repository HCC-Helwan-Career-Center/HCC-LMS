"use client";

import { Brain, ShieldCheck, TrendingUp, Clock, BarChart3 } from "lucide-react";
import styles from "./progress.module.css";

const weeklyActivity = [
  { day: "Mon", hours: 2.5 },
  { day: "Tue", hours: 1.0 },
  { day: "Wed", hours: 3.0 },
  { day: "Thu", hours: 0.5 },
  { day: "Fri", hours: 2.0 },
  { day: "Sat", hours: 4.0 },
  { day: "Sun", hours: 1.5 },
];
const maxHours = Math.max(...weeklyActivity.map((d) => d.hours));

const stats = [
  { label: "Total Learning Hours", value: "64h", icon: Clock },
  { label: "Modules Completed", value: "9", icon: BarChart3 },
  { label: "Current Streak", value: "7 days", icon: TrendingUp },
];

const trackProgress = [
  { name: "Artificial Intelligence", icon: Brain, color: "#8B5CF6", completed: 5, total: 8 },
  { name: "Cybersecurity", icon: ShieldCheck, color: "#10B981", completed: 2, total: 7 },
];

export default function ProgressPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Progress & Analytics</h1>
      <p className={styles.subtitle}>Track your learning journey and stay on course.</p>

      {/* Stats */}
      <div className={styles.statsRow}>
        {stats.map((s) => (
          <div key={s.label} className={styles.statCard}>
            <s.icon size={22} className={styles.statIcon} />
            <strong>{s.value}</strong>
            <span>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Weekly Activity */}
      <div className={styles.card}>
        <h2>Weekly Activity</h2>
        <div className={styles.chart}>
          {weeklyActivity.map((d) => (
            <div key={d.day} className={styles.barCol}>
              <div className={styles.barWrap}>
                <div className={styles.bar} style={{ height: `${(d.hours / maxHours) * 100}%` }} />
              </div>
              <span className={styles.barLabel}>{d.day}</span>
              <span className={styles.barValue}>{d.hours}h</span>
            </div>
          ))}
        </div>
      </div>

      {/* Track Breakdown */}
      <div className={styles.card}>
        <h2>Track Breakdown</h2>
        <div className={styles.breakdownList}>
          {trackProgress.map((t) => (
            <div key={t.name} className={styles.breakdownItem}>
              <div className={styles.breakdownIcon} style={{ background: `${t.color}15`, color: t.color }}>
                <t.icon size={22} />
              </div>
              <div className={styles.breakdownInfo}>
                <strong>{t.name}</strong>
                <span>{t.completed} / {t.total} modules</span>
              </div>
              <div className={styles.breakdownBar}>
                <div className={styles.breakdownFill} style={{ width: `${(t.completed / t.total) * 100}%`, background: t.color }} />
              </div>
              <span className={styles.breakdownPct}>{Math.round((t.completed / t.total) * 100)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
