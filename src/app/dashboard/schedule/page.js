import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Clock, MapPin, Brain, ShieldCheck, Code, Video, User } from "lucide-react";
import styles from "./schedule.module.css";

const TRACK_ICONS = {
  ai: Brain,
  cybersecurity: ShieldCheck,
  swe: Code,
};

export default async function SchedulePage() {
  const session = await auth();
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { enrollments: { select: { trackId: true } } }
  });

  const trackIds = user?.enrollments.map(e => e.trackId) || [];

  const [upcomingSessions, completedSessions] = await Promise.all([
    prisma.learningSession.findMany({
      where: { trackId: { in: trackIds }, status: "UPCOMING" },
      include: { track: true },
      orderBy: { date: "asc" }
    }),
    prisma.learningSession.findMany({
      where: { trackId: { in: trackIds }, status: "COMPLETED" },
      include: { track: true, mentor: true },
      orderBy: { date: "desc" }
    }),
  ]);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Schedule</h1>
      <p className={styles.subtitle}>Your upcoming sessions and workshops.</p>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Upcoming Sessions</h2>
        <div className={styles.timeline}>
          {upcomingSessions.map((s) => {
            const Icon = TRACK_ICONS[s.track.slug] || Code;
            const dateObj = new Date(s.date);
            const dateStr = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
            const timeStr = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

            return (
              <div key={s.id} className={styles.sessionCard}>
                <div className={styles.dateBadge}>
                  <span>{dateStr.split(", ")[0]}</span>
                  <strong>{dateStr.split(", ")[1]}</strong>
                </div>
                <div className={styles.sessionBody}>
                  <div className={styles.sessionTrackTag} style={{ background: `${s.track.color}15`, color: s.track.color }}>
                    <Icon size={14} /> {s.track.title}
                  </div>
                  <h3>{s.title}</h3>
                  {s.description && <p style={{ fontSize: '0.875rem', color: '#64748B', marginTop: '4px' }}>{s.description}</p>}
                  <div className={styles.sessionMeta} style={{ marginTop: '12px' }}>
                    <span><Clock size={14} /> {timeStr} ({s.durationMinutes} min)</span>
                    <span>
                      {s.type === "ONLINE" ? <Video size={14} /> : <MapPin size={14} />}
                      {s.type === "ONLINE" ? "Online" : "In Person"}
                      {(s.location || s.meetingLink) && ` — ${s.location || s.meetingLink}`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
          {upcomingSessions.length === 0 && (
            <p style={{ color: '#64748B' }}>No upcoming sessions for your tracks.</p>
          )}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Past Sessions</h2>
        <div className={styles.timeline}>
          {completedSessions.map((s) => {
            const Icon = TRACK_ICONS[s.track.slug] || Code;
            const dateObj = new Date(s.date);
            const monthDay = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
            const year = dateObj.getFullYear();

            return (
              <div key={s.id} className={styles.sessionCard}>
                <div className={styles.dateBadge}>
                  <span>{weekday}</span>
                  <strong>{monthDay}</strong>
                  <span>{year}</span>
                </div>
                <div className={styles.sessionBody}>
                  <div className={styles.sessionTrackTag} style={{ background: `${s.track.color}15`, color: s.track.color }}>
                    <Icon size={14} /> {s.track.title}
                  </div>
                  <h3>{s.title}</h3>
                  {s.description && <p style={{ fontSize: '0.875rem', color: '#64748B', marginTop: '4px' }}>{s.description}</p>}
                  <div className={styles.sessionMeta} style={{ marginTop: '12px' }}>
                    <span><Clock size={14} /> {s.durationMinutes} min</span>
                    <span>
                      {s.type === "ONLINE" ? <Video size={14} /> : <MapPin size={14} />}
                      {s.type === "ONLINE" ? "Online" : "In Person"}
                    </span>
                    {s.mentor?.name && <span><User size={14} /> {s.mentor.name}</span>}
                  </div>
                  {s.meetingLink && (
                    <a
                      href={s.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.viewLinkBtn}
                    >
                      View Link
                    </a>
                  )}
                </div>
              </div>
            );
          })}
          {completedSessions.length === 0 && (
            <p style={{ color: '#64748B' }}>No past sessions yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
