"use client";

import Link from "next/link";
import { ArrowLeft, FileText, Video, Link2, Brain, ShieldCheck, Code } from "lucide-react";
import styles from "./materials.module.css";

const TRACK_ICONS = {
  ai: Brain,
  cybersecurity: ShieldCheck,
  swe: Code,
};

export default function MaterialsClient({ trackData, materials }) {
  const TrackIcon = TRACK_ICONS[trackData.slug] || Code;

  const getTypeIcon = (type) => {
    if (type === "VIDEO") return Video;
    if (type === "LINK") return Link2;
    return FileText;
  };

  return (
    <div className={styles.page}>
      <Link href="/dashboard/tracks" className={styles.backLink}>
        <ArrowLeft size={16} /> Back to My Tracks
      </Link>

      <div className={styles.header}>
        <div className={styles.headerIcon} style={{ background: `${trackData.color}15`, color: trackData.color }}>
          <TrackIcon size={32} />
        </div>
        <div>
          <h1>{trackData.title}</h1>
          <p>Track Roadmap & Materials</p>
        </div>
      </div>

      <div className={styles.roadmap}>
        <div className={`${styles.moduleBlock} ${styles.current}`}>
          <div className={styles.moduleIndicator}>
            <div className={styles.currentPulse} />
          </div>

          <div className={styles.moduleCard}>
            <div className={styles.moduleHead}>
              <h3>Track Resources</h3>
              <span className={`${styles.statusTag} ${styles.tag_current}`}>
                ● Active
              </span>
            </div>

            <div className={styles.materialsList}>
              {materials.length > 0 ? (
                materials.map((mat) => {
                  const TypeIcon = getTypeIcon(mat.type);
                  return (
                    <a key={mat.id} href={mat.url} target="_blank" rel="noopener noreferrer" className={styles.materialItem}>
                      <TypeIcon size={16} className={styles.matIcon} />
                      <span className={styles.matTitle}>{mat.title}</span>
                      <span className={styles.matType} style={{ marginLeft: 'auto' }}>{mat.type}</span>
                    </a>
                  );
                })
              ) : (
                <p style={{ padding: '16px', color: '#64748B', fontSize: '0.875rem' }}>No materials uploaded yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
