"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, BookOpen, CalendarDays, Megaphone,
  ArrowLeft, LogOut, Menu, ChevronRight, X
} from "lucide-react";
import { signOut } from "next-auth/react";
import styles from "../dashboard/DashboardLayout.module.css";
import NotificationBell from "../dashboard/NotificationBell";

const navItems = [
  { name: "Overview", href: "/dashboard/mentor", icon: LayoutDashboard },
  { name: "My Students", href: "/dashboard/mentor/students", icon: Users },
  { name: "Materials", href: "/dashboard/mentor/materials", icon: BookOpen },
  { name: "Sessions", href: "/dashboard/mentor/sessions", icon: CalendarDays },
  { name: "Announcements", href: "/dashboard/mentor/announcements", icon: Megaphone },
];

export default function MentorLayout({ children, user }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
    : "M";

  return (
    <div className={styles.dashboardWrapper}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <Link href="/" className={styles.sidebarLogo}>
            <div className={styles.logoIcon}>HCC</div>
            <span className={styles.logoText}>Mentor Portal</span>
          </Link>
          <button className={styles.closeSidebar} onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className={styles.sidebarNav}>
          <ul>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`${styles.sidebarLink} ${isActive ? styles.active : ''}`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon size={20} />
                    <span>{item.name}</span>
                    {isActive && <ChevronRight size={16} className={styles.activeArrow} />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={styles.sidebarBottom}>
          <Link href="/" className={styles.sidebarLink}>
            <ArrowLeft size={20} />
            <span>Back to Site</span>
          </Link>
          <button onClick={() => signOut({ callbackUrl: "/login" })} className={`${styles.sidebarLink} ${styles.logoutLink}`} style={{ width: '100%', border: 'none', cursor: 'pointer' }}>
            <LogOut size={20} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />}

      {/* Main Content */}
      <div className={styles.mainArea}>
        <header className={styles.topBar}>
          <button className={styles.menuBtn} onClick={() => setSidebarOpen(true)}>
            <Menu size={22} />
          </button>
          
          <div className={styles.topBarRight}>
            <NotificationBell />
            <div className={styles.userPill}>
              <div className={styles.avatar}>{initials}</div>
              <div className={styles.userInfo}>
                <strong>{user?.name || "Mentor"}</strong>
                <span>MENTOR</span>
              </div>
            </div>
          </div>
        </header>
        
        <main className={styles.pageContent}>
          {children}
        </main>
      </div>
    </div>
  );
}
