"use client";

import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import styles from "./DashboardLayout.module.css";

const LS_KEY = "hcc_notif_last_seen";

export default function NotificationBell() {
  const { data: session } = useSession();
  const [announcements, setAnnouncements] = useState([]);
  const [lastSeen, setLastSeen] = useState(null);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(LS_KEY);
    setLastSeen(stored ? new Date(stored) : null);

    fetch("/api/announcements")
      .then(r => r.json())
      .then(data => setAnnouncements(data.announcements || []));
  }, []);

  useEffect(() => {
    function onClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  function handleClick() {
    const now = new Date();
    localStorage.setItem(LS_KEY, now.toISOString());
    setLastSeen(now);
    setOpen(prev => !prev);
  }

  const unseenCount = !mounted ? 0 : announcements.filter(
    a => !lastSeen || new Date(a.createdAt) > lastSeen
  ).length;

  const role = session?.user?.role || "student";
  const viewAllHref =
    role === "admin"  ? "/dashboard/admin/announcements" :
    role === "mentor" ? "/dashboard/mentor/announcements" :
                        "/dashboard/notifications";

  const preview = announcements.slice(0, 3);

  return (
    <div className={styles.notifWrapper} ref={wrapperRef}>
      <button className={styles.notifBtn} aria-label="Notifications" onClick={handleClick}>
        <Bell size={20} />
        {mounted && unseenCount > 0 && (
          <span className={styles.notifBadge}>
            {unseenCount > 9 ? "9+" : unseenCount}
          </span>
        )}
      </button>

      {open && (
        <div className={styles.notifDropdown}>
          <div className={styles.notifDropdownHeader}>Notifications</div>

          {preview.length === 0 ? (
            <div className={styles.notifEmpty}>No announcements yet.</div>
          ) : (
            preview.map(a => (
              <Link
                key={a.id}
                href={viewAllHref}
                className={styles.notifDropdownItem}
                onClick={() => setOpen(false)}
              >
                <span className={styles.notifItemTitle}>{a.title}</span>
                <span className={styles.notifItemDate}>
                  {new Date(a.createdAt).toLocaleDateString("en-US", {
                    month: "short", day: "numeric", year: "numeric",
                  })}
                </span>
              </Link>
            ))
          )}

          <Link
            href={viewAllHref}
            className={styles.notifDropdownFooter}
            onClick={() => setOpen(false)}
          >
            View all announcements →
          </Link>
        </div>
      )}
    </div>
  );
}
