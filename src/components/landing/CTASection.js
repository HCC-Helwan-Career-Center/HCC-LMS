import Link from "next/link";
import { ArrowRight } from "lucide-react";
import styles from "./CTASection.module.css";

export default function CTASection() {
  return (
    <section className={`section section-dark ${styles.cta}`} id="cta">
      <div className={styles.glowOrb} />
      <div className={`container ${styles.inner}`}>
        <h2>Ready to Launch Your Career?</h2>
        <p>
          Join HCC today and start building your future with project-based
          learning, expert mentorship, and a supportive tech community.
        </p>
        <Link href="/register" className="btn btn-primary btn-lg btn-glow">
          Register Now <ArrowRight size={20} />
        </Link>
      </div>
    </section>
  );
}
