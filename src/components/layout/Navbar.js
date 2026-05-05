"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import styles from "./Navbar.module.css";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Tracks", href: "/tracks" },
  { label: "Events", href: "/events" },
  { label: "Announcements", href: "/announcements" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`${styles.navbar} ${scrolled ? styles.scrolled : ""}`}
      id="main-nav"
    >
      <div className={`container ${styles.navInner}`}>
        <Link href="/" className={styles.logo}>
          <img
            src="/images/hcc_logo.webp"
            alt="HCC Logo"
            width={48}
            height={48}
            className={styles.logoImg}
          />
          <span className={styles.logoText}>HCC</span>
        </Link>

        <ul className={`${styles.navLinks} ${menuOpen ? styles.open : ""}`}>
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className={styles.navLink}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
          <li className={styles.mobileAuth}>
            <Link href="/login" className="btn btn-secondary" onClick={() => setMenuOpen(false)}>
              Login
            </Link>
            <Link href="/register" className="btn btn-primary" onClick={() => setMenuOpen(false)}>
              Register
            </Link>
          </li>
        </ul>

        <div className={styles.authButtons}>
          <Link href="/login" className={`btn ${scrolled ? "btn-secondary" : "btn-ghost"}`}>
            Login
          </Link>
          <Link href="/register" className="btn btn-primary">
            Register
          </Link>
        </div>

        <button
          className={styles.menuToggle}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          id="nav-toggle"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
}
