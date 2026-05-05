import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Calendar, Clock, MapPin, Brain, ShieldCheck, Code, Video } from "lucide-react";
import styles from "./schedule.module.css";

const TRACK_ICONS = {
  ai: Brain,
  cybersecurity: ShieldCheck,
  swe: Code,
};

export default async function SchedulePage() {
  const session = await auth();
  if (!session) return null;

  // Find tracks the student is enrolled in
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { enrollments: { select: { trackId: true } } }
  });
  
  const trackIds = user?.enrollments.map(e => e.trackId) || [];

  const sessions = await prisma.learningSession.findMany({
    where: { trackId: { in: trackIds }, status: "UPCOMING" },
    include: { track: true },
    orderBy: { date: "asc" }
  });

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Schedule</h1>
      <p className={styles.subtitle}>Your upcoming sessions and workshops.</p>

      <div className={styles.timeline}>
        {sessions.map((s) => {
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
        {sessions.length === 0 && (
          <p style={{ color: '#64748B' }}>No upcoming sessions for your tracks.</p>
        )}
      </div>
    </div>
  );
}
