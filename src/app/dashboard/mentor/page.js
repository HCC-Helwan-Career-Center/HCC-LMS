import { prisma } from "@/lib/prisma";
import { requireMentor } from "@/actions/mentor";
import Link from "next/link";
import { Users, BookOpen, CalendarDays, Megaphone, ArrowRight } from "lucide-react";
import styles from "./mentor.module.css";

export default async function MentorOverviewPage() {
  const { dbUser } = await requireMentor();
  const trackIds = dbUser.mentorTracks.map(t => t.id);

  if (trackIds.length === 0) {
    return (
      <div className={styles.page}>
        <div className={styles.pageHeader}>
          <h1>Welcome, {dbUser.name}</h1>
          <p>You have not been assigned to any tracks yet. Please contact an administrator.</p>
        </div>
      </div>
    );
  }

  // Stats
  const studentsCount = await prisma.user.count({
    where: {
      enrollments: {
        some: { trackId: { in: trackIds } }
      }
    }
  });

  const sessionsCount = await prisma.learningSession.count({
    where: {
      trackId: { in: trackIds },
      status: "UPCOMING"
    }
  });

  const materialsCount = await prisma.material.count({
    where: { trackId: { in: trackIds } }
  });

  // Recent Students
  const recentEnrollments = await prisma.enrollment.findMany({
    where: { trackId: { in: trackIds } },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { user: true, track: true }
  });

  // Next Session
  const nextSession = await prisma.learningSession.findFirst({
    where: { trackId: { in: trackIds }, status: "UPCOMING", date: { gte: new Date() } },
    orderBy: { date: "asc" },
    include: { track: true }
  });

  const statCards = [
    { title: "My Students", value: studentsCount, icon: Users, color: "#3B82F6", link: "/dashboard/mentor/students" },
    { title: "My Tracks", value: trackIds.length, icon: BookOpen, color: "#8B5CF6", link: null },
    { title: "Upcoming Sessions", value: sessionsCount, icon: CalendarDays, color: "#10B981", link: "/dashboard/mentor/sessions" },
    { title: "Materials", value: materialsCount, icon: BookOpen, color: "#F59E0B", link: "/dashboard/mentor/materials" },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1>Mentor Overview</h1>
        <p>Manage your students, materials, and upcoming sessions.</p>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        {statCards.map((stat, i) => (
          <div key={i} className={styles.statCard}>
            <div className={styles.statIcon} style={{ background: `${stat.color}15`, color: stat.color }}>
              <stat.icon size={24} />
            </div>
            <div className={styles.statInfo}>
              <h3>{stat.value}</h3>
              <p>{stat.title}</p>
            </div>
            {stat.link && (
              <Link href={stat.link} className={styles.statLink}>
                <ArrowRight size={16} />
              </Link>
            )}
          </div>
        ))}
      </div>

      <div className={styles.twoCol}>
        {/* Recent Enrollments */}
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h2>Recent Student Enrollments</h2>
            <Link href="/dashboard/mentor/students" className={styles.viewAllBtn}>View All</Link>
          </div>
          <div className={styles.sectionBody}>
            {recentEnrollments.length > 0 ? (
              <div className={styles.activityList}>
                {recentEnrollments.map((e) => (
                  <div key={e.id} className={styles.activityItem}>
                    <div className={styles.activityAvatar}>{e.user.name?.[0] || 'S'}</div>
                    <div className={styles.activityContent}>
                      <p><strong>{e.user.name || "Unknown"}</strong> enrolled in <strong>{e.track.title}</strong></p>
                      <span>{e.createdAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: '#64748B', fontSize: '0.875rem' }}>No recent enrollments found.</p>
            )}
          </div>
        </div>

        {/* Next Session & Quick Actions */}
        <div className={styles.sectionCard}>
          <div className={styles.sectionHeader}>
            <h2>Next Upcoming Session</h2>
          </div>
          <div className={styles.sectionBody}>
            {nextSession ? (
              <div className={styles.sessionBox}>
                <div className={styles.sessionDateBox}>
                  <strong>{nextSession.date.toLocaleString('en-US', { month: 'short' })}</strong>
                  <span>{nextSession.date.getDate()}</span>
                </div>
                <div>
                  <h4>{nextSession.title}</h4>
                  <p>{nextSession.track.title} • {nextSession.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
              </div>
            ) : (
              <p style={{ color: '#64748B', fontSize: '0.875rem' }}>No upcoming sessions scheduled.</p>
            )}
            
            <div style={{ marginTop: '24px' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1A1A2E', marginBottom: '12px' }}>Quick Actions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Link href="/dashboard/mentor/materials" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <BookOpen size={16} /> Upload Material
                </Link>
                <Link href="/dashboard/mentor/sessions" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <CalendarDays size={16} /> Schedule Session
                </Link>
                <Link href="/dashboard/mentor/announcements" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <Megaphone size={16} /> Post Announcement
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
