import { prisma } from "@/lib/prisma";
import styles from "../admin.module.css";

export default async function ReportsPage() {
  // Enrollments per track
  const tracks = await prisma.track.findMany({
    include: { _count: { select: { enrollments: true } } },
  });

  const maxEnrollments = Math.max(...tracks.map((t) => t._count.enrollments), 1);

  // User growth: registrations by month (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const users = await prisma.user.findMany({
    where: { createdAt: { gte: sixMonthsAgo } },
    select: { createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  // Group by month
  const monthMap = {};
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    monthMap[key] = { label: d.toLocaleString("en", { month: "short", year: "numeric" }), count: 0 };
  }
  users.forEach((u) => {
    const key = `${u.createdAt.getFullYear()}-${String(u.createdAt.getMonth() + 1).padStart(2, "0")}`;
    if (monthMap[key]) monthMap[key].count++;
  });

  const months = Object.values(monthMap);
  const totalUsers = await prisma.user.count();
  const totalEnrollments = await prisma.enrollment.count();

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1>Reports</h1>
        <p>Platform analytics and growth data.</p>
      </div>

      {/* Enrollments per track */}
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <h2>Enrollments by Track</h2>
        </div>
        <div className={styles.sectionBody}>
          <div className={styles.barChart}>
            {tracks.map((t) => {
              const height = Math.max((t._count.enrollments / maxEnrollments) * 150, 8);
              return (
                <div key={t.id} className={styles.barItem}>
                  <div className={styles.barValue}>{t._count.enrollments}</div>
                  <div className={styles.bar} style={{ height, background: t.color }} />
                  <div className={styles.barLabel}>{t.title}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className={styles.twoCol}>
        {/* User Growth */}
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h2>User Growth (Last 6 Months)</h2>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Month</th>
                  <th>New Registrations</th>
                </tr>
              </thead>
              <tbody>
                {months.map((m) => (
                  <tr key={m.label}>
                    <td>{m.label}</td>
                    <td><strong>{m.count}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary */}
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h2>Platform Summary</h2>
          </div>
          <div className={styles.sectionBody}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className={styles.reportBlock} style={{ border: 'none', padding: 0 }}>
                <p style={{ fontSize: '0.8125rem', color: '#94A3B8', marginBottom: 4 }}>Total Users</p>
                <p style={{ fontSize: '2rem', fontWeight: 800, color: '#1A1A2E' }}>{totalUsers}</p>
              </div>
              <div className={styles.reportBlock} style={{ border: 'none', padding: 0 }}>
                <p style={{ fontSize: '0.8125rem', color: '#94A3B8', marginBottom: 4 }}>Total Enrollments</p>
                <p style={{ fontSize: '2rem', fontWeight: 800, color: '#1A1A2E' }}>{totalEnrollments}</p>
              </div>
              <div className={styles.reportBlock} style={{ border: 'none', padding: 0 }}>
                <p style={{ fontSize: '0.8125rem', color: '#94A3B8', marginBottom: 4 }}>Active Tracks</p>
                <p style={{ fontSize: '2rem', fontWeight: 800, color: '#1A1A2E' }}>{tracks.length}</p>
              </div>
            </div>

            <button
              className="btn btn-secondary"
              disabled
              style={{ marginTop: '24px', opacity: 0.5, cursor: 'not-allowed', padding: '8px 20px', fontSize: '0.875rem' }}
            >
              📥 Export Data — Coming Soon
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
