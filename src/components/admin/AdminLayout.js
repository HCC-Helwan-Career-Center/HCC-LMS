"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard, Users, GraduationCap, Megaphone,
  BarChart2, ArrowLeft, Menu, X, Bell, LogOut, ChevronRight
} from "lucide-react";
import styles from "../dashboard/DashboardLayout.module.css";

const adminLinks = [
  { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboard },
  { label: "Users", href: "/dashboard/admin/users", icon: Users },
  { label: "Tracks", href: "/dashboard/admin/tracks", icon: GraduationCap },
  { label: "Announcements", href: "/dashboard/admin/announcements", icon: Megaphone },
  { label: "Reports", href: "/dashboard/admin/reports", icon: BarChart2 },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: session } = useSession();

  const user = {
    name: session?.user?.name || "Admin",
    initials: session?.user?.name?.substring(0, 2).toUpperCase() || "AD",
    role: "admin",
  };

  return (
    <div className={styles.dashboardWrapper}>
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.sidebarHeader}>
          <Link href="/" className={styles.sidebarLogo}>
            <img src="/images/hcc_logo.webp" alt="HCC" width={36} height={36} />
            <span>HCC Admin</span>
          </Link>
          <button className={styles.closeSidebar} onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className={styles.sidebarNav}>
          <ul>
            {adminLinks.map((link) => {
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
          <Link href="/" className={styles.sidebarLink} onClick={() => setSidebarOpen(false)}>
            <ArrowLeft size={20} />
            <span>Back to Site</span>
          </Link>
          <button onClick={() => signOut({ callbackUrl: '/login' })} className={`${styles.sidebarLink} ${styles.logoutLink}`} style={{ width: '100%', border: 'none', cursor: 'pointer' }}>
            <LogOut size={20} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />}

      <div className={styles.mainArea}>
        <header className={styles.topBar}>
          <button className={styles.menuBtn} onClick={() => setSidebarOpen(true)} aria-label="Open menu">
            <Menu size={22} />
          </button>
          <div className={styles.topBarRight}>
            <div className={styles.userPill}>
              <div className={styles.avatar}>{user.initials}</div>
              <div className={styles.userInfo}>
                <strong>{user.name}</strong>
                <span>{user.role}</span>
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
