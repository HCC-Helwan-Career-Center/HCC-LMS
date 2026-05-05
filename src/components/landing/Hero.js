"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={styles.hero} id="hero">
      <div className={styles.gridOverlay} />
      <div className={styles.glowOrb1} />
      <div className={styles.glowOrb2} />

      <div className={`container ${styles.heroContent}`}>
        <div className={styles.textSide}>
          <span className={`badge badge-dark ${styles.badge}`}>
            <Sparkles size={14} />
            Faculty of Engineering – Helwan University
          </span>

          <h1 className="animate-fade-in-up">
            Launch Your{" "}
            <span className="text-gradient">Career</span>
          </h1>

          <p className="animate-fade-in-up animate-delay-1">
            Master Artificial Intelligence, Cybersecurity, and Software
            Engineering through real projects and open-source contributions.
            Join Helwan&apos;s most active student-led tech community.
          </p>

          <div className={`${styles.ctas} animate-fade-in-up animate-delay-2`}>
            <a href="#tracks" className="btn btn-primary btn-lg">
              Explore Tracks <ArrowRight size={18} />
            </a>
            <Link href="/register" className="btn btn-ghost btn-lg">
              Join HCC
            </Link>
          </div>

          <div className={`${styles.stats} animate-fade-in-up animate-delay-3`}>
            <div className={styles.statItem}>
              <strong>300+</strong>
              <span>Students</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <strong>3</strong>
              <span>Tracks</span>
            </div>
            <div className={styles.statDivider} />
            <div className={styles.statItem}>
              <strong>20+</strong>
              <span>Projects</span>
            </div>
          </div>
        </div>

        <div className={styles.visualSide}>
          <div className={styles.codeCard}>
            <div className={styles.codeHeader}>
              <span className={styles.dot} style={{ background: "#FF5F56" }} />
              <span className={styles.dot} style={{ background: "#FFBD2E" }} />
              <span className={styles.dot} style={{ background: "#27C93F" }} />
              <span className={styles.codeTitle}>career.py</span>
            </div>
            <pre className={styles.codeBody}>
              <code>
{`class HCCStudent:
    def __init__(self, name):
        self.name = name
        self.track = "AI"
        self.projects = []
        self.github_prs = 0

    def launch_career(self):
        self.learn()
        self.build_projects()
        self.contribute_opensource()
        return "Career Launched! 🚀"`}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
