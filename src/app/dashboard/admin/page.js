import { prisma } from "@/lib/prisma";
import { Users, GraduationCap, BookOpen, UserCheck, Clock } from "lucide-react";
import Link from "next/link";
import styles from "./admin.module.css";

export default async function AdminOverview() {
  const [
    totalStudents,
    totalMentors,
    totalTracks,
    totalEnrollments,
    pendingVerifications,
    recentUsers,
    recentEnrollments,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "student" } }),
    prisma.user.count({ where: { role: "mentor" } }),
    prisma.track.count(),
    prisma.enrollment.count(),
    prisma.user.count({ where: { emailVerified: null } }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { enrollments: { include: { track: true } } },
    }),
    prisma.enrollment.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { user: true, track: true },
    }),
  ]);

  const stats = [
    { label: "Total Students", value: totalStudents, color: "#3B82F6", icon: Users },
    { label: "Total Mentors", value: totalMentors, color: "#10B981", icon: UserCheck },
    { label: "Active Tracks", value: totalTracks, color: "#8B5CF6", icon: GraduationCap },
    { label: "Total Enrollments", value: totalEnrollments, color: "#E8871E", icon: BookOpen },
    { label: "Pending Verifications", value: pendingVerifications, color: "#F59E0B", icon: Clock },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1>Admin Overview</h1>
        <p>Platform statistics and recent activity.</p>
      </div>

      <div className={styles.statsGrid}>
        {stats.map((s) => (
          <div key={s.label} className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: `${s.color}14`, color: s.color }}>
              <s.icon size={24} />
            </div>
            <div className={styles.statInfo}>
              <h3>{s.value}</h3>
              <p>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <h2>Quick Actions</h2>
        </div>
        <div className={styles.sectionBody}>
          <div className={styles.quickActions}>
            <Link href="/dashboard/admin/users" className={styles.quickAction}>
              <Users size={18} /> Manage Users
            </Link>
            <Link href="/dashboard/admin/announcements" className={styles.quickAction}>
              <span style={{ fontSize: '18px' }}>📢</span> Create Announcement
            </Link>
            <Link href="/dashboard/admin/reports" className={styles.quickAction}>
              <span style={{ fontSize: '18px' }}>📊</span> View Reports
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className={styles.twoCol}>
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h2>Recent Registrations</h2>
          </div>
          <div className={styles.sectionBody}>
            {recentUsers.length === 0 ? (
              <p style={{ fontSize: '0.875rem' }}>No users yet.</p>
            ) : (
              recentUsers.map((u) => (
                <div key={u.id} className={styles.activityItem}>
                  <div className={styles.activityDot} />
                  <div className={styles.activityText}>
                    <strong>{u.name}</strong> ({u.email})
                    {u.enrollments[0] && ` — ${u.enrollments[0].track.title}`}
                    <span>{u.createdAt.toISOString().split("T")[0]}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h2>Recent Enrollments</h2>
          </div>
          <div className={styles.sectionBody}>
            {recentEnrollments.length === 0 ? (
              <p style={{ fontSize: '0.875rem' }}>No enrollments yet.</p>
            ) : (
              recentEnrollments.map((e) => (
                <div key={e.id} className={styles.activityItem}>
                  <div className={styles.activityDot} style={{ background: e.track.color }} />
                  <div className={styles.activityText}>
                    <strong>{e.user.name}</strong> enrolled in <strong>{e.track.title}</strong>
                    <span>{e.createdAt.toISOString().split("T")[0]}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
