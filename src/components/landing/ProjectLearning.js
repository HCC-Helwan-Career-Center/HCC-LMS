import { Layers, Rocket, FolderGit2 } from "lucide-react";
import styles from "./ProjectLearning.module.css";

const features = [
  {
    icon: Layers,
    title: "Build Real Projects",
    description:
      "Every track culminates in hands-on projects that solve real problems. No toy examples — you'll build systems that matter.",
  },
  {
    icon: Rocket,
    title: "Learn by Doing",
    description:
      "Our pedagogy is built on active learning. Write code from day one, debug real issues, and ship working software.",
  },
  {
    icon: FolderGit2,
    title: "Portfolio Ready",
    description:
      "Every project is pushed to GitHub. Graduate with a professional portfolio that speaks louder than any certificate.",
  },
];

export default function ProjectLearning() {
  return (
    <section className={`section ${styles.section}`} id="projects">
      <div className="container">
        <div className="section-header">
          <h2>Project-Based Learning</h2>
          <p>
            We believe the best way to learn tech is by building things. Every
            module ends with a real project.
          </p>
        </div>

        <div className={styles.features}>
          {features.map((feature, i) => (
            <div key={feature.title} className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <feature.icon size={28} />
              </div>
              <div className={styles.featureText}>
                <h4>{feature.title}</h4>
                <p>{feature.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.connectLine}>
          <div className={styles.lineNode} />
          <div className={styles.line} />
          <div className={styles.lineNode} />
          <div className={styles.line} />
          <div className={styles.lineNode} />
        </div>
      </div>
    </section>
  );
}
