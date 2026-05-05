import { Bell, Megaphone, FileText, Calendar, CheckCircle2 } from "lucide-react";
import styles from "./notifications.module.css";

const notifications = [
  {
    id: 1,
    type: "assignment",
    title: "New Assignment: Neural Network Implementation",
    message: "A new assignment has been posted for the AI track. Due in 5 days.",
    time: "2 hours ago",
    read: false,
    icon: FileText,
    color: "#8B5CF6"
  },
  {
    id: 2,
    type: "announcement",
    title: "General Meeting This Friday",
    message: "Don't forget the all-hands meeting this Friday at 6:00 PM in Hall A.",
    time: "1 day ago",
    read: false,
    icon: Megaphone,
    color: "#E8871E"
  },
  {
    id: 3,
    type: "event",
    title: "Upcoming Session Reminder",
    message: "Your session 'Network Security & Protocols' starts tomorrow at 3:00 PM.",
    time: "2 days ago",
    read: true,
    icon: Calendar,
    color: "#10B981"
  },
  {
    id: 4,
    type: "system",
    title: "Track Enrolled Successfully",
    message: "You have been successfully enrolled in the Cybersecurity track.",
    time: "1 week ago",
    read: true,
    icon: CheckCircle2,
    color: "#3B82F6"
  }
];

export default function NotificationsPage() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Notifications</h1>
          <p className={styles.subtitle}>Stay updated on assignments and announcements.</p>
        </div>
        <button className="btn btn-ghost">Mark all as read</button>
      </div>

      <div className={styles.list}>
        {notifications.map((n) => (
          <div key={n.id} className={`${styles.item} ${!n.read ? styles.unread : ""}`}>
            <div className={styles.iconWrap} style={{ background: `${n.color}15`, color: n.color }}>
              <n.icon size={20} />
            </div>
            <div className={styles.content}>
              <div className={styles.itemHeader}>
                <strong>{n.title}</strong>
                <span>{n.time}</span>
              </div>
              <p>{n.message}</p>
            </div>
            {!n.read && <div className={styles.unreadDot} />}
          </div>
        ))}
      </div>
    </div>
  );
}
