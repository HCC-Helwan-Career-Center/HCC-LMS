"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, Users, BookOpen, CalendarDays, Megaphone,
  ArrowLeft, LogOut, Menu, Bell
} from "lucide-react";
import { signOut } from "next-auth/react";
import styles from "../dashboard/DashboardLayout.module.css"; // Reuse identical layout css

const navItems = [
  { name: "Overview", href: "/dashboard/mentor", icon: LayoutDashboard },
  { name: "My Students", href: "/dashboard/mentor/students", icon: Users },
  { name: "Materials", href: "/dashboard/mentor/materials", icon: BookOpen },
  { name: "Sessions", href: "/dashboard/mentor/sessions", icon: CalendarDays },
  { name: "Announcements", href: "/dashboard/mentor/announcements", icon: Megaphone },
];

export default function MentorLayout({ children, user }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className={styles.layout}>
      {/* Mobile Header */}
      <header className={styles.mobileHeader}>
        <div className={styles.mobileLogo}>
          <div className={styles.logoIcon}>HCC</div>
          <span>HCC Mentor</span>
        </div>
        <button className={styles.mobileMenuBtn} onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <Menu size={24} />
        </button>
      </header>

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${isMobileMenuOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logoIcon}>HCC</div>
          <span className={styles.logoText}>HCC Mentor</span>
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <Link href="/" className={styles.navItem}>
            <ArrowLeft size={20} />
            <span>Back to Site</span>
          </Link>
          <button onClick={() => signOut({ callbackUrl: "/login" })} className={styles.navItemLogout}>
            <div className={styles.avatarMini}>{user?.name?.[0] || 'M'}</div>
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        <header className={styles.topbar}>
          <div className={styles.topbarRight}>
            <button className={styles.iconBtn}><Bell size={20} /></button>
            <div className={styles.userProfile}>
              <div className={styles.avatar}>{user?.name?.[0] || 'M'}</div>
              <div className={styles.userInfo}>
                <span className={styles.userName}>{user?.name || "HCC Mentor"}</span>
                <span className={styles.userRole}>MENTOR</span>
              </div>
            </div>
          </div>
        </header>
        <div className={styles.content}>
          {children}
        </div>
      </main>

      {isMobileMenuOpen && (
        <div className={styles.overlay} onClick={() => setIsMobileMenuOpen(false)} />
      )}
    </div>
  );
}
