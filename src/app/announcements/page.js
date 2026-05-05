import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Bell, Pin, ArrowRight } from "lucide-react";
import styles from "./announcements.module.css";

export const metadata = {
  title: "Announcements – HCC | Helwan Career Center",
  description: "Stay updated with the latest news and announcements from HCC – Helwan Career Center.",
};

const announcements = [
  {
    title: "🎉 Registration Open for Season 3 Tracks",
    content: "We're excited to announce that enrollment for Season 3 of all three tracks — AI, Cybersecurity, and Software Engineering — is now open! This season introduces new modules, guest speakers from industry, and a revamped project-based curriculum. Seats are limited, so register early to secure your spot.",
    date: "Apr 25, 2026",
    author: "HCC Team",
    pinned: true,
    tags: ["Enrollment", "All Tracks"],
  },
  {
    title: "🐙 Launching Our GitHub Contribution Program",
    content: "Starting this season, every HCC student will have the opportunity to contribute to real open-source projects through our new GitHub Contribution Program. We've partnered with the open-source community to provide beginner-friendly issues, guided PRs, and mentorship. More details coming soon!",
    date: "Apr 20, 2026",
    author: "HCC Team",
    pinned: true,
    tags: ["Open Source", "GitHub"],
  },
  {
    title: "📚 New LMS Platform Coming Soon",
    content: "We're building a custom Learning Management System to centralize all your learning materials, track progress, schedule sessions, and earn badges. The platform will launch alongside Season 3. Stay tuned for early access!",
    date: "Apr 15, 2026",
    author: "HCC Team",
    pinned: false,
    tags: ["Platform", "Update"],
  },
  {
    title: "🏆 Season 2 Wrap-Up & Highlights",
    content: "Season 2 was a massive success! With over 200 active students across 3 tracks, 15 completed projects, and 4 workshops, we've grown beyond expectations. Special shout-out to the AI track for their outstanding capstone projects. Full recap coming soon.",
    date: "Mar 30, 2026",
    author: "HCC Team",
    pinned: false,
    tags: ["Recap", "Community"],
  },
  {
    title: "📅 Updated Session Schedule for April",
    content: "Check the events page for the updated April session schedule. We've added extra office hours and peer programming sessions based on your feedback.",
    date: "Mar 28, 2026",
    author: "HCC Team",
    pinned: false,
    tags: ["Schedule"],
  },
];

export default function AnnouncementsPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className={styles.hero}>
          <div className={styles.heroOverlay} />
          <div className={`container ${styles.heroContent}`}>
            <span className="badge badge-dark"><Bell size={14} /> Announcements</span>
            <h1>Latest <span className="text-gradient">News</span></h1>
            <p>Stay in the loop with everything happening at HCC.</p>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className={styles.feed}>
              {announcements.map((ann, i) => (
                <article key={i} className={`${styles.annCard} ${ann.pinned ? styles.pinned : ""}`}>
                  {ann.pinned && (
                    <div className={styles.pinnedTag}>
                      <Pin size={12} /> Pinned
                    </div>
                  )}
                  <div className={styles.annHeader}>
                    <span className={styles.annDate}>{ann.date}</span>
                    <span className={styles.annAuthor}>by {ann.author}</span>
                  </div>
                  <h2 className={styles.annTitle}>{ann.title}</h2>
                  <p className={styles.annContent}>{ann.content}</p>
                  <div className={styles.annFooter}>
                    <div className={styles.tags}>
                      {ann.tags.map((tag) => (
                        <span key={tag} className={styles.tag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
