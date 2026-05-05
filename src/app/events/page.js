import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Calendar, Clock, MapPin, Users, Brain, ShieldCheck, Code } from "lucide-react";
import styles from "./events.module.css";

export const metadata = {
  title: "Events & Sessions – HCC | Helwan Career Center",
  description: "Upcoming and past events, workshops, and sessions at HCC – Helwan Career Center.",
};

const upcomingEvents = [
  {
    title: "AI Track Kickoff – Season 3",
    date: "May 10, 2026",
    time: "5:00 PM",
    location: "Hall A – Faculty of Engineering",
    track: "AI",
    trackColor: "#8B5CF6",
    trackIcon: Brain,
    description: "Join us for the official kickoff of Season 3 of the AI Track. Meet your instructors, understand the curriculum, and get started on your AI journey.",
    spots: "40 spots remaining",
  },
  {
    title: "Cybersecurity Workshop: Intro to CTF",
    date: "May 17, 2026",
    time: "3:00 PM",
    location: "Lab 201 – Faculty of Engineering",
    track: "Cybersecurity",
    trackColor: "#10B981",
    trackIcon: ShieldCheck,
    description: "Hands-on Capture The Flag introduction. Learn the basics of CTF competitions, common challenge categories, and solve your first flags.",
    spots: "25 spots remaining",
  },
  {
    title: "SWE: Building REST APIs with Node.js",
    date: "May 24, 2026",
    time: "4:00 PM",
    location: "Online – Zoom",
    track: "SWE",
    trackColor: "#3B82F6",
    trackIcon: Code,
    description: "Learn how to design and build RESTful APIs using Node.js and Express.js. Covers routing, middleware, authentication, and deployment.",
    spots: "Open to all",
  },
];

const pastEvents = [
  {
    title: "Git & GitHub Masterclass",
    date: "Apr 12, 2026",
    track: "General",
    attendees: 85,
  },
  {
    title: "AI: Introduction to Machine Learning",
    date: "Apr 5, 2026",
    track: "AI",
    attendees: 62,
  },
  {
    title: "Cybersecurity Awareness Day",
    date: "Mar 22, 2026",
    track: "Cybersecurity",
    attendees: 45,
  },
  {
    title: "HCC Open Day – Season 2 Showcase",
    date: "Mar 8, 2026",
    track: "General",
    attendees: 120,
  },
];

export default function EventsPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className={styles.hero}>
          <div className={styles.heroOverlay} />
          <div className={`container ${styles.heroContent}`}>
            <span className="badge badge-dark">Events & Sessions</span>
            <h1>Learn, Build, <span className="text-gradient">Connect</span></h1>
            <p>Join our workshops, sessions, and community events. Every event is designed to help you grow.</p>
          </div>
        </section>

        {/* Upcoming */}
        <section className="section">
          <div className="container">
            <div className="section-header" style={{ textAlign: "left" }}>
              <h2>Upcoming Events</h2>
              <p style={{ margin: "var(--space-sm) 0 0" }}>Don&apos;t miss out — register now to secure your spot.</p>
            </div>
            <div className={styles.eventGrid}>
              {upcomingEvents.map((event) => (
                <div key={event.title} className={`card ${styles.eventCard}`}>
                  <div className={styles.eventTop}>
                    <span className={styles.trackTag} style={{ background: `${event.trackColor}15`, color: event.trackColor }}>
                      <event.trackIcon size={14} />
                      {event.track}
                    </span>
                    <span className={styles.spots}>{event.spots}</span>
                  </div>
                  <h3 className={styles.eventTitle}>{event.title}</h3>
                  <p className={styles.eventDesc}>{event.description}</p>
                  <div className={styles.eventMeta}>
                    <span><Calendar size={14} /> {event.date}</span>
                    <span><Clock size={14} /> {event.time}</span>
                    <span><MapPin size={14} /> {event.location}</span>
                  </div>
                  <button className="btn btn-primary" style={{ marginTop: "var(--space-lg)", width: "100%" }}>
                    Register for Event
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Past Events */}
        <section className={`section ${styles.pastSection}`}>
          <div className="container">
            <div className="section-header" style={{ textAlign: "left" }}>
              <h2>Past Events</h2>
              <p style={{ margin: "var(--space-sm) 0 0" }}>A look back at what we&apos;ve done together.</p>
            </div>
            <div className={styles.pastGrid}>
              {pastEvents.map((event) => (
                <div key={event.title} className={styles.pastCard}>
                  <div>
                    <span className={styles.pastDate}>{event.date}</span>
                    <h4>{event.title}</h4>
                    <span className={styles.pastTrack}>{event.track}</span>
                  </div>
                  <div className={styles.pastAttendees}>
                    <Users size={16} />
                    <span>{event.attendees} attended</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
