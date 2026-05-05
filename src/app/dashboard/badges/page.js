import styles from "./badges.module.css";

const earned = [
  { emoji: "🚀", name: "First Step", desc: "Completed your first module", date: "Jan 22, 2026" },
  { emoji: "🐙", name: "First PR", desc: "Opened your first Pull Request", date: "Feb 10, 2026" },
];

const available = [
  { emoji: "⭐", name: "Track Graduate", desc: "Successfully finish your chosen track", locked: true },
  { emoji: "💜", name: "Merged Contributor", desc: "Get your first PR merged", locked: true },
  { emoji: "🏆", name: "Project Master", desc: "Build a strong Capstone Project", locked: true },
  { emoji: "🤝", name: "Open Source Hero", desc: "Get 5 PRs merged to open source", locked: true },
  { emoji: "💎", name: "Top Contributor", desc: "Ranked top 10% in GitHub contributions", locked: true },
  { emoji: "🛠️", name: "Tooling Expert", desc: "Create a reusable internal tool or library", locked: true },
];

export default function BadgesPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Badges & Achievements</h1>
      <p className={styles.subtitle}>Earn badges by completing milestones in your learning journey.</p>

      <h2 className={styles.sectionTitle}>Earned ({earned.length})</h2>
      <div className={styles.badgeGrid}>
        {earned.map((b) => (
          <div key={b.name} className={styles.badgeCard}>
            <span className={styles.badgeEmoji}>{b.emoji}</span>
            <strong>{b.name}</strong>
            <p>{b.desc}</p>
            <span className={styles.badgeDate}>Earned {b.date}</span>
          </div>
        ))}
      </div>

      <h2 className={styles.sectionTitle}>Available ({available.length})</h2>
      <div className={styles.badgeGrid}>
        {available.map((b) => (
          <div key={b.name} className={`${styles.badgeCard} ${styles.locked}`}>
            <span className={styles.badgeEmoji}>{b.emoji}</span>
            <strong>{b.name}</strong>
            <p>{b.desc}</p>
            <span className={styles.lockTag}>🔒 Locked</span>
          </div>
        ))}
      </div>
    </div>
  );
}
