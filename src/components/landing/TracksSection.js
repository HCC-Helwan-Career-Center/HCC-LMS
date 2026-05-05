import Link from "next/link";
import { Brain, ShieldCheck, Code, ArrowRight } from "lucide-react";
import styles from "./TracksSection.module.css";

const tracks = [
  {
    icon: Brain,
    title: "Artificial Intelligence",
    description:
      "Dive into machine learning, neural networks, and data science. Build intelligent systems and learn to solve real-world problems with AI.",
    color: "#8B5CF6",
    slug: "ai",
    modules: "8 Modules",
    duration: "16 Weeks",
  },
  {
    icon: ShieldCheck,
    title: "Cybersecurity",
    description:
      "Master network security, ethical hacking, and digital forensics. Learn to protect systems and respond to cyber threats like a professional.",
    color: "#10B981",
    slug: "cybersecurity",
    modules: "7 Modules",
    duration: "14 Weeks",
  },
  {
    icon: Code,
    title: "Software Engineering",
    description:
      "Build production-grade software with modern tools and best practices. From clean code to system design, become an industry-ready developer.",
    color: "#3B82F6",
    slug: "swe",
    modules: "9 Modules",
    duration: "18 Weeks",
  },
];

export default function TracksSection() {
  return (
    <section className="section" id="tracks">
      <div className="container">
        <div className="section-header">
          <h2>Choose Your Path</h2>
          <p>
            Three focused technical tracks designed to take you from fundamentals
            to portfolio-ready skills.
          </p>
        </div>

        <div className={styles.grid}>
          {tracks.map((track, i) => (
            <div key={track.title} className={`card ${styles.trackCard}`}>
              <div
                className={styles.iconWrap}
                style={{ background: `${track.color}15`, color: track.color }}
              >
                <track.icon size={32} />
              </div>
              <h3 className={styles.trackTitle}>{track.title}</h3>
              <p className={styles.trackDesc}>{track.description}</p>
              <div className={styles.meta}>
                <span>{track.modules}</span>
                <span className={styles.dot}>•</span>
                <span>{track.duration}</span>
              </div>
              <Link href={`/tracks#${track.slug}`} className={styles.learnMore}>
                Learn More <ArrowRight size={16} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
