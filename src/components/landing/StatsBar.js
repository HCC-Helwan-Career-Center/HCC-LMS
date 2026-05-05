"use client";

import { useEffect, useRef, useState } from "react";
import { Users, Layers, FolderOpen, GitBranch } from "lucide-react";
import styles from "./StatsBar.module.css";

const stats = [
  { icon: Users, value: 300, suffix: "+", label: "Students Trained" },
  { icon: Layers, value: 3, suffix: "", label: "Active Tracks" },
  { icon: FolderOpen, value: 20, suffix: "+", label: "Projects Built" },
  { icon: GitBranch, value: 0, suffix: "", label: "GitHub Contributions", note: "Coming Soon" },
];

function AnimatedCounter({ value, suffix, inView }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (value === 0) { setCount(0); return; }

    let start = 0;
    const duration = 2000;
    const increment = value / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [inView, value]);

  return (
    <span className={styles.value}>
      {count}{suffix}
    </span>
  );
}

export default function StatsBar() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.statsBar} ref={ref} id="stats">
      <div className={`container ${styles.inner}`}>
        {stats.map((stat) => (
          <div key={stat.label} className={styles.statItem}>
            <stat.icon size={28} className={styles.icon} />
            <AnimatedCounter value={stat.value} suffix={stat.suffix} inView={inView} />
            <span className={styles.label}>{stat.label}</span>
            {stat.note && <span className={styles.note}>{stat.note}</span>}
          </div>
        ))}
      </div>
    </section>
  );
}
