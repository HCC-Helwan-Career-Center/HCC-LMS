"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard, BookOpen, BarChart3, Calendar,
  Award, Bell, Settings, LogOut, Menu, X, ChevronRight
} from "lucide-react";
import styles from "./DashboardLayout.module.css";

const sidebarLinks = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "My Tracks", href: "/dashboard/tracks", icon: BookOpen },
  { label: "Progress", href: "/dashboard/progress", icon: BarChart3 },
  { label: "Schedule", href: "/dashboard/schedule", icon: Calendar },
  { label: "Badges", href: "/dashboard/badges", icon: Award },
];

const bottomLinks = [
  { label: "Notifications", href: "/dashboard/notifications", icon: Bell },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { data: session, status } = useSession();

  useEffect(() => {
    setMounted(true); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);
  
  // Use stable defaults until client mounts to avoid hydration mismatch
  const user = mounted ? { 
    name: session?.user?.name || "Student", 
    initials: session?.user?.name?.substring(0, 2).toUpperCase() || "ST", 
    role: session?.user?.role || "student" 
  } : {
    name: "Student",
    initials: "ST",
    role: "student"
  };

  return (
    <div className={styles.dashboardWrapper}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.sidebarHeader}>
          <Link href="/" className={styles.sidebarLogo}>
            <img src="/images/hcc_logo.webp" alt="HCC" width={36} height={36} />
            <span>HCC</span>
          </Link>
          <button className={styles.closeSidebar} onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className={styles.sidebarNav}>
          <ul>
            {sidebarLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`${styles.sidebarLink} ${isActive ? styles.active : ""}`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <link.icon size={20} />
                    <span>{link.label}</span>
                    {isActive && <ChevronRight size={16} className={styles.activeArrow} />}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={styles.sidebarBottom}>
          {bottomLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`${styles.sidebarLink} ${isActive ? styles.active : ""}`}
                onClick={() => setSidebarOpen(false)}
              >
                <link.icon size={20} />
                <span>{link.label}</span>
              </Link>
            );
          })}
          <button onClick={() => signOut({ callbackUrl: '/login' })} className={`${styles.sidebarLink} ${styles.logoutLink}`} style={{ width: '100%', border: 'none', cursor: 'pointer' }}>
            <LogOut size={20} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />}

      {/* Main Content */}
      <div className={styles.mainArea}>
        {/* Top Bar */}
        <header className={styles.topBar}>
          <button className={styles.menuBtn} onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            <Menu size={22} />
          </button>

          <div className={styles.topBarRight}>
            <button className={styles.notifBtn} aria-label="Notifications">
              <Bell size={20} />
              <span className={styles.notifDot} />
            </button>
            <div className={styles.userPill}>
              <div className={styles.avatar}>{user.initials}</div>
              <div className={styles.userInfo}>
                <strong>{user.name}</strong>
                <span>{user.role}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className={styles.pageContent}>
          {children}
        </main>
      </div>
    </div>
  );
}
