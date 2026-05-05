import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Bell, Megaphone, CheckCircle2 } from "lucide-react";
import styles from "./notifications.module.css";

export default async function NotificationsPage() {
  const session = await auth();
  if (!session) return null;

  // Find tracks the student is enrolled in
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { enrollments: { include: { track: true } } }
  });
  
  const trackSlugs = user?.enrollments.map(e => e.track.slug) || [];
  trackSlugs.push("all"); // Always include "all" announcements

  const announcements = await prisma.announcement.findMany({
    where: { target: { in: trackSlugs } },
    include: { author: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Notifications</h1>
          <p className={styles.subtitle}>Stay updated on announcements from mentors and admins.</p>
        </div>
      </div>

      <div className={styles.list}>
        {announcements.map((ann) => (
          <div key={ann.id} className={styles.item}>
            <div className={styles.iconWrap} style={{ background: "#E8871E15", color: "#E8871E" }}>
              <Megaphone size={20} />
            </div>
            <div className={styles.content}>
              <div className={styles.itemHeader}>
                <strong>{ann.title}</strong>
                <span>{ann.createdAt.toLocaleDateString()}</span>
              </div>
              <p>{ann.body}</p>
              <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '4px' }}>
                Posted by {ann.author.name} {ann.target !== "all" ? `• to ${ann.target}` : ""}
              </div>
            </div>
          </div>
        ))}
        {announcements.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px", color: "#94A3B8" }}>
            <Bell size={32} style={{ margin: "0 auto 16px", opacity: 0.5 }} />
            <p>You have no notifications yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
