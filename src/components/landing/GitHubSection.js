import { GitFork, Code2, GitPullRequest, GitMerge, ArrowRight } from "lucide-react";
import styles from "./GitHubSection.module.css";

const steps = [
  { icon: GitFork, label: "Fork", desc: "Find a project" },
  { icon: Code2, label: "Code", desc: "Make changes" },
  { icon: GitPullRequest, label: "PR", desc: "Submit your work" },
  { icon: GitMerge, label: "Merge", desc: "Get recognized" },
];

export default function GitHubSection() {
  return (
    <section className={`section section-dark ${styles.section}`} id="opensource">
      <div className="container">
        <div className="section-header">
          <h2>Contribute to Open Source</h2>
          <p>
            Start contributing to real open-source projects from day one. Build
            your GitHub profile while you learn.
          </p>
        </div>

        <div className={styles.flow}>
          {steps.map((step, i) => (
            <div key={step.label} className={styles.flowItem}>
              <div className={styles.stepIcon}>
                <step.icon size={28} />
              </div>
              <strong>{step.label}</strong>
              <span>{step.desc}</span>
              {i < steps.length - 1 && (
                <div className={styles.arrow}>
                  <ArrowRight size={20} />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className={styles.terminal}>
          <div className={styles.termHeader}>
            <span className={styles.termDot} style={{ background: "#FF5F56" }} />
            <span className={styles.termDot} style={{ background: "#FFBD2E" }} />
            <span className={styles.termDot} style={{ background: "#27C93F" }} />
            <span className={styles.termTitle}>terminal</span>
          </div>
          <div className={styles.termBody}>
            <p><span className={styles.prompt}>$</span> git clone https://github.com/hcc-helwan/project.git</p>
            <p><span className={styles.prompt}>$</span> git checkout -b feature/my-contribution</p>
            <p><span className={styles.prompt}>$</span> git commit -m &quot;feat: add AI model pipeline&quot;</p>
            <p><span className={styles.prompt}>$</span> git push origin feature/my-contribution</p>
            <p className={styles.success}>✓ Pull request created successfully!</p>
          </div>
        </div>

        <div className={styles.ctaWrap}>
          <a href="#" className="btn btn-primary btn-lg">
            Start Contributing <ArrowRight size={18} />
          </a>
        </div>
      </div>
    </section>
  );
}
