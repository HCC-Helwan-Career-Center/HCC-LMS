"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Brain, ShieldCheck, Code, ArrowLeft, ArrowRight,
  FileText, Video, Link2, Download, CheckCircle2, Circle, Lock, ExternalLink
} from "lucide-react";
import styles from "./materials.module.css";
import { Suspense } from "react";

const trackData = {
  ai: {
    title: "Artificial Intelligence",
    icon: Brain,
    color: "#8B5CF6",
    modules: [
      {
        name: "Python Foundations & Data Manipulation",
        status: "completed",
        materials: [
          { type: "video", title: "Python Crash Course", link: "#" },
          { type: "doc", title: "NumPy & Pandas Cheat Sheet", link: "#" },
          { type: "assignment", title: "Assignment 1: Data Cleaning", link: "#", submitted: true },
        ],
      },
      {
        name: "Statistics & Probability for ML",
        status: "completed",
        materials: [
          { type: "video", title: "Stats Fundamentals", link: "#" },
          { type: "doc", title: "Probability Theory Notes", link: "#" },
          { type: "assignment", title: "Assignment 2: Statistical Analysis", link: "#", submitted: true },
        ],
      },
      {
        name: "Supervised Learning",
        status: "completed",
        materials: [
          { type: "video", title: "Linear & Logistic Regression", link: "#" },
          { type: "doc", title: "Decision Trees & Random Forests", link: "#" },
          { type: "assignment", title: "Assignment 3: Classification Model", link: "#", submitted: true },
        ],
      },
      {
        name: "Unsupervised Learning & Clustering",
        status: "completed",
        materials: [
          { type: "video", title: "K-Means & Hierarchical Clustering", link: "#" },
          { type: "doc", title: "Dimensionality Reduction Guide", link: "#" },
          { type: "assignment", title: "Assignment 4: Customer Segmentation", link: "#", submitted: true },
        ],
      },
      {
        name: "Deep Learning & Neural Networks",
        status: "current",
        materials: [
          { type: "video", title: "Neural Network Fundamentals", link: "#" },
          { type: "video", title: "Backpropagation Explained", link: "#" },
          { type: "doc", title: "TensorFlow Getting Started Guide", link: "#" },
          { type: "assignment", title: "Assignment 5: Build a Neural Network", link: "#", submitted: false },
          { type: "project", title: "Project: Image Classifier", link: "#", submitted: false },
        ],
      },
      {
        name: "Natural Language Processing",
        status: "locked",
        materials: [
          { type: "video", title: "NLP with Transformers", link: "#" },
          { type: "doc", title: "Tokenization & Embeddings", link: "#" },
          { type: "assignment", title: "Assignment 6: Sentiment Analysis", link: "#" },
        ],
      },
      {
        name: "Computer Vision with CNNs",
        status: "locked",
        materials: [
          { type: "video", title: "Convolutional Neural Networks", link: "#" },
          { type: "assignment", title: "Assignment 7: Object Detection", link: "#" },
        ],
      },
      {
        name: "Capstone: End-to-End AI Project",
        status: "locked",
        materials: [
          { type: "project", title: "Capstone Project Brief", link: "#" },
          { type: "doc", title: "GitHub Submission Guidelines", link: "#" },
        ],
      },
    ],
  },
  cybersecurity: {
    title: "Cybersecurity",
    icon: ShieldCheck,
    color: "#10B981",
    modules: [
      {
        name: "Intro to Cybersecurity & Networking",
        status: "completed",
        materials: [
          { type: "video", title: "Cybersecurity Landscape", link: "#" },
          { type: "doc", title: "Networking Fundamentals", link: "#" },
          { type: "assignment", title: "Assignment 1: Network Mapping", link: "#", submitted: true },
        ],
      },
      {
        name: "Linux Fundamentals & Command Line",
        status: "completed",
        materials: [
          { type: "video", title: "Linux for Security", link: "#" },
          { type: "assignment", title: "Assignment 2: Bash Scripting", link: "#", submitted: true },
        ],
      },
      {
        name: "Network Security & Protocols",
        status: "current",
        materials: [
          { type: "video", title: "TCP/IP Deep Dive", link: "#" },
          { type: "video", title: "Wireshark Tutorial", link: "#" },
          { type: "doc", title: "Protocol Analysis Guide", link: "#" },
          { type: "assignment", title: "Assignment 3: Packet Capture Analysis", link: "#", submitted: false },
        ],
      },
      {
        name: "Web App Security (OWASP Top 10)",
        status: "locked",
        materials: [
          { type: "video", title: "OWASP Top 10 Walkthrough", link: "#" },
          { type: "assignment", title: "Assignment 4: Vulnerability Assessment", link: "#" },
        ],
      },
      {
        name: "Ethical Hacking & Penetration Testing",
        status: "locked",
        materials: [
          { type: "video", title: "Pen Testing Methodology", link: "#" },
          { type: "assignment", title: "Assignment 5: Pen Test Report", link: "#" },
        ],
      },
      {
        name: "Cryptography & Secure Communication",
        status: "locked",
        materials: [
          { type: "doc", title: "Encryption Algorithms Guide", link: "#" },
          { type: "assignment", title: "Assignment 6: Implement RSA", link: "#" },
        ],
      },
      {
        name: "Capstone: CTF Competition & Security Audit",
        status: "locked",
        materials: [
          { type: "project", title: "CTF Challenge Pack", link: "#" },
          { type: "doc", title: "Security Audit Template", link: "#" },
        ],
      },
    ],
  },
};

const typeIcons = {
  video: Video,
  doc: FileText,
  assignment: Download,
  project: ExternalLink,
};

const typeLabels = {
  video: "Video",
  doc: "Document",
  assignment: "Assignment",
  project: "Project",
};

function MaterialsContent() {
  const searchParams = useSearchParams();
  const trackSlug = searchParams.get("track") || "ai";
  const track = trackData[trackSlug] || trackData.ai;
  const TrackIcon = track.icon;

  return (
    <div className={styles.page}>
      <Link href="/dashboard/tracks" className={styles.backLink}>
        <ArrowLeft size={16} /> Back to My Tracks
      </Link>

      <div className={styles.header}>
        <div className={styles.headerIcon} style={{ background: `${track.color}15`, color: track.color }}>
          <TrackIcon size={32} />
        </div>
        <div>
          <h1>{track.title}</h1>
          <p>Track Roadmap & Materials</p>
        </div>
      </div>

      <div className={styles.roadmap}>
        {track.modules.map((mod, i) => {
          const isLocked = mod.status === "locked";
          return (
            <div key={mod.name} className={`${styles.moduleBlock} ${styles[mod.status]}`}>
              <div className={styles.moduleIndicator}>
                {mod.status === "completed" ? (
                  <CheckCircle2 size={22} />
                ) : mod.status === "current" ? (
                  <div className={styles.currentPulse} />
                ) : (
                  <Lock size={18} />
                )}
                {i < track.modules.length - 1 && <div className={styles.connector} />}
              </div>

              <div className={styles.moduleCard}>
                <div className={styles.moduleHead}>
                  <span className={styles.moduleNum}>Module {i + 1}</span>
                  <h3>{mod.name}</h3>
                  <span className={`${styles.statusTag} ${styles[`tag_${mod.status}`]}`}>
                    {mod.status === "completed" ? "✓ Completed" : mod.status === "current" ? "● In Progress" : "🔒 Locked"}
                  </span>
                </div>

                {!isLocked && (
                  <div className={styles.materialsList}>
                    {mod.materials.map((mat, j) => {
                      const TypeIcon = typeIcons[mat.type] || FileText;
                      return (
                        <a key={j} href={mat.link} className={styles.materialItem}>
                          <TypeIcon size={16} className={styles.matIcon} />
                          <span className={styles.matTitle}>{mat.title}</span>
                          <span className={styles.matType}>{typeLabels[mat.type]}</span>
                          {mat.submitted !== undefined && (
                            <span className={`${styles.matStatus} ${mat.submitted ? styles.submitted : styles.pending}`}>
                              {mat.submitted ? "Submitted" : "Pending"}
                            </span>
                          )}
                        </a>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function MaterialsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MaterialsContent />
    </Suspense>
  );
}
