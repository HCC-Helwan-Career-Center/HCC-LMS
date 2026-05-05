import Link from "next/link";
import {
  BookOpen, Calendar, Award, ArrowRight,
  Brain, ShieldCheck, TrendingUp, Clock, Code
} from "lucide-react";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import styles from "./dashboard.module.css";

// Helper to get icon and color by slug
const getTrackMeta = (slug) => {
  if (slug === 'ai') return { icon: Brain, color: "#8B5CF6" };
  if (slug === 'cybersecurity') return { icon: ShieldCheck, color: "#10B981" };
  return { icon: Code, color: "#3B82F6" };
};

// Mock data for upcoming sessions and badges
const upcomingSessions = [
  { title: "AI: CNN Architectures", date: "May 10", time: "5:00 PM", track: "AI" },
  { title: "Cybersecurity: OWASP Top 10", date: "May 12", time: "3:00 PM", track: "CS" },
  { title: "AI: NLP with Transformers", date: "May 15", time: "5:00 PM", track: "AI" },
];

const recentBadges = [
  { name: "First Step", emoji: "🚀", desc: "Completed first module" },
  { name: "Streak Master", emoji: "🔥", desc: "7-day activity streak" },
];

export default async function DashboardPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const userName = session.user.name || "Student";

  // Fetch real enrollments
  const userRecord = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      enrollments: {
        include: { track: true }
      }
    }
  });

  const enrolledTracks = userRecord?.enrollments.map(e => {
    const meta = getTrackMeta(e.track.slug);
    return {
      title: e.track.title,
      slug: e.track.slug,
      icon: meta.icon,
      color: meta.color,
      progress: 0, 
      currentModule: "Welcome to " + e.track.title,
      nextSession: "Pending Schedule",
    };
  }) || [];

  return (
    <div className={styles.dashboard}>
      {/* Welcome Banner */}
      <div className={styles.welcome}>
        <div className={styles.welcomeText}>
          <h1>Welcome back, <span className="text-gradient">{userName}</span> 👋</h1>
          <p>You&apos;re making great progress. Keep up the momentum!</p>
        </div>
        <div className={styles.welcomeStats}>
          <div className={styles.welcomeStat}>
            <TrendingUp size={20} />
            <div>
              <strong>47%</strong>
              <span>Overall Progress</span>
            </div>
          </div>
          <div className={styles.welcomeStat}>
            <Award size={20} />
            <div>
              <strong>2</strong>
              <span>Badges Earned</span>
            </div>
          </div>
        </div>
      </div>

      {/* Track Cards */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2><BookOpen size={22} /> My Tracks</h2>
          <Link href="/dashboard/tracks" className={styles.viewAll}>
            View All <ArrowRight size={16} />
          </Link>
        </div>
        <div className={styles.trackGrid}>
          {enrolledTracks.map((track) => (
            <div key={track.title} className={styles.trackCard}>
              <div className={styles.trackCardHeader}>
                <div className={styles.trackCardIcon} style={{ background: `${track.color}15`, color: track.color }}>
                  <track.icon size={24} />
                </div>
                <div>
                  <h3>{track.title}</h3>
                  <span className={styles.trackModule}>{track.currentModule}</span>
                </div>
              </div>
              <div className={styles.progressSection}>
                <div className={styles.progressInfo}>
                  <span>Progress</span>
                  <strong>{track.progress}%</strong>
                </div>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${track.progress}%`, background: track.color }}
                  />
                </div>
              </div>
              <div className={styles.trackCardFooter}>
                <span className={styles.nextSession}>
                  <Clock size={14} /> Next: {track.nextSession}
                </span>
                <Link href={`/dashboard/materials?track=${track.slug}`} className={styles.continueBtn}>
                  Continue <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Grid */}
      <div className={styles.bottomGrid}>
        {/* Upcoming Sessions */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h3><Calendar size={20} /> Upcoming Sessions</h3>
          </div>
          <div className={styles.sessionsList}>
            {upcomingSessions.map((s, i) => (
              <div key={i} className={styles.sessionItem}>
                <div className={styles.sessionDate}>
                  <strong>{s.date}</strong>
                  <span>{s.time}</span>
                </div>
                <div className={styles.sessionInfo}>
                  <span className={styles.sessionTitle}>{s.title}</span>
                  <span className={styles.sessionTrack}>{s.track}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Badges */}
        <section className={styles.card}>
          <div className={styles.cardHeader}>
            <h3><Award size={20} /> Recent Badges</h3>
            <Link href="/dashboard/badges" className={styles.viewAll}>
              All Badges <ArrowRight size={14} />
            </Link>
          </div>
          <div className={styles.badgesList}>
            {recentBadges.map((badge) => (
              <div key={badge.name} className={styles.badgeItem}>
                <span className={styles.badgeEmoji}>{badge.emoji}</span>
                <div>
                  <strong>{badge.name}</strong>
                  <span>{badge.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
