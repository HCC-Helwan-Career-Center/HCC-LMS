import { Calendar, Clock, MapPin, Bell } from "lucide-react";
import styles from "./EventsSection.module.css";

const events = [
  {
    title: "AI Track Kickoff – Season 3",
    date: "May 10, 2026",
    time: "5:00 PM",
    location: "Hall A – Faculty of Engineering",
    track: "AI",
    trackColor: "#8B5CF6",
  },
  {
    title: "Cybersecurity Workshop: Intro to CTF",
    date: "May 17, 2026",
    time: "3:00 PM",
    location: "Lab 201",
    track: "Cybersecurity",
    trackColor: "#10B981",
  },
  {
    title: "SWE: Building REST APIs with Node.js",
    date: "May 24, 2026",
    time: "4:00 PM",
    location: "Online – Zoom",
    track: "SWE",
    trackColor: "#3B82F6",
  },
];

const announcements = [
  {
    title: "Registration Open for Season 3 Tracks",
    preview: "Enrollment is now open for AI, Cybersecurity, and SWE tracks. Limited seats available!",
    date: "Apr 25, 2026",
  },
  {
    title: "New GitHub Contribution Program",
    preview: "We're launching our open-source contribution program. Stay tuned for details.",
    date: "Apr 20, 2026",
  },
];

export default function EventsSection() {
  return (
    <section className="section" id="events">
      <div className="container">
        <div className="section-header">
          <h2>Events & Announcements</h2>
          <p>Stay updated with upcoming sessions, workshops, and important news.</p>
        </div>

        <div className={styles.grid}>
          <div className={styles.eventsCol}>
            <h4 className={styles.colTitle}>
              <Calendar size={20} /> Upcoming Events
            </h4>
            <div className={styles.eventsList}>
              {events.map((event) => (
                <div key={event.title} className={`card ${styles.eventCard}`}>
                  <span
                    className={styles.trackTag}
                    style={{ background: `${event.trackColor}15`, color: event.trackColor }}
                  >
                    {event.track}
                  </span>
                  <h5>{event.title}</h5>
                  <div className={styles.eventMeta}>
                    <span><Clock size={14} /> {event.date} · {event.time}</span>
                    <span><MapPin size={14} /> {event.location}</span>
                  </div>
                  <button className="btn btn-secondary" style={{ marginTop: "var(--space-md)", padding: "8px 20px", fontSize: "0.875rem" }}>
                    Register
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.announcementsCol}>
            <h4 className={styles.colTitle}>
              <Bell size={20} /> Latest News
            </h4>
            <div className={styles.announcementsList}>
              {announcements.map((ann) => (
                <div key={ann.title} className={`card ${styles.annCard}`}>
                  <span className={styles.annDate}>{ann.date}</span>
                  <h5>{ann.title}</h5>
                  <p>{ann.preview}</p>
                  <a href="#" className={styles.readMore}>Read More →</a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
