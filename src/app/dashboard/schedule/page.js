import { Calendar, Clock, MapPin, Brain, ShieldCheck, Code } from "lucide-react";
import styles from "./schedule.module.css";

export default function SchedulePage() {
  const sessions = [
    { title: "AI: Computer Vision Project", date: "Mon, May 19", time: "5:00 – 7:00 PM", location: "Hall A", track: "AI", color: "#8B5CF6", icon: Brain },
    { title: "CS: Penetration Testing Lab", date: "Sat, May 17", time: "3:00 – 6:00 PM", location: "Lab 201", track: "Cybersecurity", color: "#10B981", icon: ShieldCheck },
    { title: "AI: NLP with Transformers", date: "Thu, May 15", time: "5:00 – 7:00 PM", location: "Online – Zoom", track: "AI", color: "#8B5CF6", icon: Brain },
    { title: "CS: OWASP Top 10 Workshop", date: "Mon, May 12", time: "3:00 – 5:00 PM", location: "Lab 201", track: "Cybersecurity", color: "#10B981", icon: ShieldCheck },
    { title: "AI: CNN Architectures", date: "Sat, May 10", time: "5:00 – 7:00 PM", location: "Hall A", track: "AI", color: "#8B5CF6", icon: Brain },
  ];

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Schedule</h1>
      <p className={styles.subtitle}>Your upcoming sessions and workshops.</p>

      <div className={styles.timeline}>
        {sessions.map((s, i) => (
          <div key={i} className={styles.sessionCard}>
            <div className={styles.dateBadge}>
              <span>{s.date.split(", ")[0]}</span>
              <strong>{s.date.split(", ")[1]}</strong>
            </div>
            <div className={styles.sessionBody}>
              <div className={styles.sessionTrackTag} style={{ background: `${s.color}15`, color: s.color }}>
                <s.icon size={14} /> {s.track}
              </div>
              <h3>{s.title}</h3>
              <div className={styles.sessionMeta}>
                <span><Clock size={14} /> {s.time}</span>
                <span><MapPin size={14} /> {s.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
