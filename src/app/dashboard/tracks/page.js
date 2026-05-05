import { Brain, ShieldCheck, Code, Clock, BookOpen, CheckCircle2, Circle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import styles from "./tracks-dash.module.css";

// Helper to get icon and color by slug
const getTrackMeta = (slug) => {
  if (slug === 'ai') return { icon: Brain, color: "#8B5CF6" };
  if (slug === 'cybersecurity') return { icon: ShieldCheck, color: "#10B981" };
  return { icon: Code, color: "#3B82F6" };
};

export default async function MyTracksPage() {
  const session = await auth();
  if (!session) redirect("/login");

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
      enrolled: e.createdAt.toISOString().split("T")[0],
      modules: [
        { name: "Welcome Module", status: "current" },
        { name: "Module 1", status: "locked" },
        { name: "Module 2", status: "locked" },
        { name: "Capstone", status: "locked" },
      ],
    };
  }) || [];

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>My Tracks</h1>
      <p className={styles.pageSubtitle}>Your enrolled tracks and module progress.</p>

      <div className={styles.tracksList}>
        {enrolledTracks.length === 0 ? (
          <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <p style={{ color: '#64748b' }}>You are not enrolled in any tracks yet.</p>
          </div>
        ) : enrolledTracks.map((track) => (
          <div key={track.title} className={styles.trackBlock}>
            <div className={styles.trackHeader}>
              <div className={styles.trackIcon} style={{ background: `${track.color}15`, color: track.color }}>
                <track.icon size={28} />
              </div>
              <div className={styles.trackInfo}>
                <h2>{track.title}</h2>
                <span>Enrolled: {track.enrolled} · {track.progress}% complete</span>
              </div>
              <div className={styles.progressRing}>
                <svg viewBox="0 0 36 36" className={styles.ring}>
                  <path d="M18 2.0845a15.9155 15.9155 0 0 1 0 31.831a15.9155 15.9155 0 0 1 0-31.831" fill="none" stroke="#E2E8F0" strokeWidth="3" />
                  <path d="M18 2.0845a15.9155 15.9155 0 0 1 0 31.831a15.9155 15.9155 0 0 1 0-31.831" fill="none" stroke={track.color} strokeWidth="3" strokeDasharray={`${track.progress}, 100`} strokeLinecap="round" />
                </svg>
                <span className={styles.ringText}>{track.progress}%</span>
              </div>
            </div>

            <div className={styles.modulesList}>
              {track.modules.map((mod, i) => (
                <div key={mod.name} className={`${styles.moduleItem} ${styles[mod.status]}`}>
                  <div className={styles.moduleStatus}>
                    {mod.status === "completed" ? (
                      <CheckCircle2 size={18} />
                    ) : mod.status === "current" ? (
                      <div className={styles.currentDot} />
                    ) : (
                      <Circle size={18} />
                    )}
                    {i < track.modules.length - 1 && <div className={styles.connector} />}
                  </div>
                  <div className={styles.moduleContent}>
                    <span className={styles.moduleLabel}>Module {i + 1}</span>
                    <strong>{mod.name}</strong>
                    {mod.status === "current" && (
                      <Link href={`/dashboard/materials?track=${track.slug}`} className={styles.resumeBtn}>
                        Resume <ArrowRight size={14} />
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
