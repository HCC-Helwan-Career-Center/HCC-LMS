import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import styles from "./about.module.css";
import { Target, Eye, Users, Award, Lightbulb, Heart } from "lucide-react";

export const metadata = {
  title: "About HCC – Helwan Career Center",
  description:
    "Learn about HCC's mission to empower Helwan University engineering students through project-based learning, mentorship, and open-source contributions.",
};

const values = [
  {
    icon: Lightbulb,
    title: "Project-Based Learning",
    description: "We believe the best way to learn is by building. Every concept is applied through real-world projects.",
  },
  {
    icon: Users,
    title: "Community First",
    description: "We grow together. Collaboration, peer support, and shared goals drive everything we do.",
  },
  {
    icon: Award,
    title: "Excellence",
    description: "We push for industry-standard quality in every project, presentation, and contribution.",
  },
  {
    icon: Heart,
    title: "Open Source Spirit",
    description: "We contribute back to the community. Open source is not just a practice — it's our culture.",
  },
];

const milestones = [
  { year: "2023", event: "HCC Founded at Faculty of Engineering, Helwan University" },
  { year: "2024", event: "Launched AI, Cybersecurity, and SWE tracks — 100+ students enrolled" },
  { year: "2025", event: "Expanded to 300+ students, 20+ completed projects" },
  { year: "2026", event: "Launching LMS platform & GitHub contribution program" },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles.heroOverlay} />
          <div className={`container ${styles.heroContent}`}>
            <span className="badge badge-dark">About Us</span>
            <h1>
              Empowering Students to{" "}
              <span className="text-gradient">Launch Their Careers</span>
            </h1>
            <p>
              HCC – Helwan Career Center is a student-led initiative at the Faculty
              of Engineering, Helwan University, dedicated to bridging the gap
              between academic knowledge and industry-ready skills.
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className={`section ${styles.missionSection}`}>
          <div className="container">
            <div className={styles.missionGrid}>
              <div className={styles.missionCard}>
                <div className={styles.missionIcon}>
                  <Target size={32} />
                </div>
                <h3>Our Mission</h3>
                <p>
                  To equip Helwan University engineering students with practical
                  technical skills through structured learning tracks, hands-on
                  projects, and real-world open-source contributions — preparing
                  them to excel in the global tech industry.
                </p>
              </div>
              <div className={styles.missionCard}>
                <div className={styles.missionIcon} style={{ background: "rgba(44, 82, 130, 0.12)", color: "var(--color-secondary)" }}>
                  <Eye size={32} />
                </div>
                <h3>Our Vision</h3>
                <p>
                  To become the leading student-led tech community in Egyptian
                  universities, producing graduates who are not just job-ready
                  but are active contributors to the global open-source ecosystem
                  and technology landscape.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className={`section ${styles.valuesSection}`}>
          <div className="container">
            <div className="section-header">
              <h2>Our Core Values</h2>
              <p>The principles that guide everything we do at HCC.</p>
            </div>
            <div className={styles.valuesGrid}>
              {values.map((value) => (
                <div key={value.title} className={`card ${styles.valueCard}`}>
                  <div className={styles.valueIcon}>
                    <value.icon size={24} />
                  </div>
                  <h4>{value.title}</h4>
                  <p>{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className={`section section-dark ${styles.timelineSection}`}>
          <div className="container">
            <div className="section-header">
              <h2>Our Journey</h2>
              <p>From a small idea to a thriving tech community.</p>
            </div>
            <div className={styles.timeline}>
              {milestones.map((m, i) => (
                <div key={m.year} className={styles.timelineItem}>
                  <div className={styles.timelineDot} />
                  <div className={styles.timelineCard}>
                    <span className={styles.timelineYear}>{m.year}</span>
                    <p>{m.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What Makes Us Different */}
        <section className="section">
          <div className="container">
            <div className="section-header">
              <h2>What Makes HCC Different?</h2>
              <p>We&apos;re not another lecture series. Here&apos;s why.</p>
            </div>
            <div className={styles.diffGrid}>
              <div className={styles.diffItem}>
                <h4>🎯 Career-Focused Tracks</h4>
                <p>Every track is designed around industry demand — AI, Cybersecurity, and Software Engineering.</p>
              </div>
              <div className={styles.diffItem}>
                <h4>🛠️ Build, Don&apos;t Just Watch</h4>
                <p>Students build real projects every module. No passive learning — every session is hands-on.</p>
              </div>
              <div className={styles.diffItem}>
                <h4>🐙 GitHub from Day One</h4>
                <p>Every project lives on GitHub. Students graduate with a professional portfolio of contributions.</p>
              </div>
              <div className={styles.diffItem}>
                <h4>👥 Peer-Led Community</h4>
                <p>Run by students, for students. Mentors are your peers who&apos;ve walked the same path.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
