import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import styles from "./tracks.module.css";
import { Brain, ShieldCheck, Code, ArrowRight, Clock, BookOpen, Users, Star } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Tracks – HCC | Helwan Career Center",
  description:
    "Explore HCC's structured learning tracks in Artificial Intelligence, Cybersecurity, and Software Engineering.",
};

const tracks = [
  {
    slug: "ai",
    icon: Brain,
    title: "Artificial Intelligence",
    tagline: "Build intelligent systems that solve real problems.",
    description:
      "Dive deep into machine learning, neural networks, natural language processing, and computer vision. This track takes you from Python fundamentals to deploying production AI models.",
    color: "#8B5CF6",
    modules: 8,
    duration: "16 Weeks",
    students: "120+",
    curriculum: [
      "Python Foundations & Data Manipulation",
      "Statistics & Probability for ML",
      "Supervised Learning (Regression & Classification)",
      "Unsupervised Learning & Clustering",
      "Deep Learning & Neural Networks",
      "Natural Language Processing (NLP)",
      "Computer Vision with CNNs",
      "Capstone: End-to-End AI Project",
    ],
    outcomes: [
      "Build and deploy ML models",
      "Work with real-world datasets",
      "Understand deep learning architectures",
      "Publish AI projects on GitHub",
    ],
    tools: ["Python", "NumPy", "Pandas", "Scikit-learn", "TensorFlow", "PyTorch", "Jupyter"],
  },
  {
    slug: "cybersecurity",
    icon: ShieldCheck,
    title: "Cybersecurity",
    tagline: "Defend systems and master ethical hacking.",
    description:
      "Master the fundamentals of network security, ethical hacking, digital forensics, and incident response. Learn to think like an attacker to become a better defender.",
    color: "#10B981",
    modules: 7,
    duration: "14 Weeks",
    students: "90+",
    curriculum: [
      "Introduction to Cybersecurity & Networking",
      "Linux Fundamentals & Command Line",
      "Network Security & Protocols",
      "Web Application Security (OWASP Top 10)",
      "Ethical Hacking & Penetration Testing",
      "Cryptography & Secure Communication",
      "Capstone: CTF Competition & Security Audit",
    ],
    outcomes: [
      "Perform penetration testing",
      "Analyze and respond to security incidents",
      "Secure web applications",
      "Compete in CTF challenges",
    ],
    tools: ["Kali Linux", "Wireshark", "Burp Suite", "Nmap", "Metasploit", "OWASP ZAP"],
  },
  {
    slug: "swe",
    icon: Code,
    title: "Software Engineering",
    tagline: "Ship production-grade software like a pro.",
    description:
      "Build modern software using industry best practices. From clean code principles to system design, this track prepares you to work on real engineering teams.",
    color: "#3B82F6",
    modules: 9,
    duration: "18 Weeks",
    students: "130+",
    curriculum: [
      "Programming Fundamentals & OOP",
      "Data Structures & Algorithms",
      "Version Control with Git & GitHub",
      "Web Development (HTML, CSS, JavaScript)",
      "Backend Development (Node.js / Django)",
      "Databases & SQL / NoSQL",
      "API Design & RESTful Services",
      "System Design & Architecture Patterns",
      "Capstone: Full-Stack Project & Deployment",
    ],
    outcomes: [
      "Build full-stack web applications",
      "Write clean, maintainable code",
      "Design scalable system architectures",
      "Contribute to open-source projects",
    ],
    tools: ["JavaScript", "Node.js", "React", "Git", "PostgreSQL", "Docker", "VS Code"],
  },
];

export default function TracksPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles.heroOverlay} />
          <div className={`container ${styles.heroContent}`}>
            <span className="badge badge-dark">Learning Tracks</span>
            <h1>
              Choose Your <span className="text-gradient">Path</span>
            </h1>
            <p>
              Three structured technical tracks designed to take you from fundamentals
              to portfolio-ready skills. Project-based, mentor-guided, and career-focused.
            </p>
          </div>
        </section>

        {/* Track Cards */}
        {tracks.map((track, idx) => (
          <section
            key={track.slug}
            className={`section ${idx % 2 === 1 ? styles.altBg : ""}`}
            id={track.slug}
          >
            <div className="container">
              <div className={styles.trackDetail}>
                <div className={styles.trackHeader}>
                  <div
                    className={styles.trackIcon}
                    style={{ background: `${track.color}15`, color: track.color }}
                  >
                    <track.icon size={40} />
                  </div>
                  <div>
                    <h2>{track.title}</h2>
                    <p className={styles.tagline}>{track.tagline}</p>
                  </div>
                </div>

                <div className={styles.trackMeta}>
                  <div className={styles.metaItem}>
                    <BookOpen size={18} />
                    <span>{track.modules} Modules</span>
                  </div>
                  <div className={styles.metaItem}>
                    <Clock size={18} />
                    <span>{track.duration}</span>
                  </div>
                  <div className={styles.metaItem}>
                    <Users size={18} />
                    <span>{track.students} Enrolled</span>
                  </div>
                </div>

                <p className={styles.trackDesc}>{track.description}</p>

                <div className={styles.trackContent}>
                  {/* Curriculum */}
                  <div className={styles.curriculumSection}>
                    <h3>Curriculum</h3>
                    <ol className={styles.curriculumList}>
                      {track.curriculum.map((item, i) => (
                        <li key={i}>
                          <span className={styles.moduleNum}>Module {i + 1}</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Sidebar */}
                  <div className={styles.trackSidebar}>
                    <div className={styles.sidebarCard}>
                      <h4>What You&apos;ll Achieve</h4>
                      <ul>
                        {track.outcomes.map((outcome, i) => (
                          <li key={i}>
                            <Star size={14} className={styles.starIcon} />
                            {outcome}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className={styles.sidebarCard}>
                      <h4>Tools & Technologies</h4>
                      <div className={styles.toolTags}>
                        {track.tools.map((tool) => (
                          <span key={tool} className={styles.toolTag}>
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>

                    <Link href="/register" className="btn btn-primary" style={{ width: "100%" }}>
                      Enroll Now <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ))}
      </main>
      <Footer />
    </>
  );
}
