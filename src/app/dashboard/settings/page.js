"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { User, Mail, GraduationCap, Phone, MapPin, Book, Camera, Save } from "lucide-react";
import styles from "./settings.module.css";

function GithubIcon({ size = 18, className }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  );
}

function LinkedinIcon({ size = 18, className }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

export default function SettingsPage() {
  const { data: session } = useSession();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    universityId: "",
    phone: "",
    academicYear: "Freshman",
    department: "",
    github: "",
    linkedin: "",
  });

  // Pre-fill from session when available
  useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        name: session.user.name || "",
        email: session.user.email || "",
      }));
    }
  }, [session]);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Account Settings</h1>
      <p className={styles.subtitle}>Manage your profile and personal details.</p>

      <div className={styles.content}>
        {/* Profile Image Section */}
        <div className={styles.profileSection}>
          <div className={styles.avatarWrap}>
            <div className={styles.avatar}>
              {formData.name ? formData.name.substring(0, 2).toUpperCase() : "ST"}
            </div>
            <button className={styles.avatarBtn} aria-label="Change avatar">
              <Camera size={16} />
            </button>
          </div>
          <div className={styles.profileInfo}>
            <h2>{formData.name || "Student"}</h2>
            <span>{session?.user?.role === "admin" ? "Admin Account" : "Student Account"}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.section}>
            <h3>Personal Information</h3>
            <div className={styles.grid}>
              <div className={styles.formGroup}>
                <label>Full Name</label>
                <div className={styles.inputWrap}>
                  <User size={18} className={styles.icon} />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Email Address</label>
                <div className={styles.inputWrap}>
                  <Mail size={18} className={styles.icon} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Phone Number</label>
                <div className={styles.inputWrap}>
                  <Phone size={18} className={styles.icon} />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h3>Academic Details</h3>
            <div className={styles.grid}>
              <div className={styles.formGroup}>
                <label>University ID</label>
                <div className={styles.inputWrap}>
                  <MapPin size={18} className={styles.icon} />
                  <input
                    type="text"
                    value={formData.universityId}
                    onChange={(e) => setFormData({ ...formData, universityId: e.target.value })}
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Academic Year</label>
                <div className={styles.inputWrap}>
                  <GraduationCap size={18} className={styles.icon} />
                  <select
                    value={formData.academicYear}
                    onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                  >
                    <option value="Freshman">Freshman</option>
                    <option value="Sophomore">Sophomore</option>
                    <option value="Junior">Junior</option>
                    <option value="Senior">Senior</option>
                    <option value="Graduate">Graduate</option>
                  </select>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Department</label>
                <div className={styles.inputWrap}>
                  <Book size={18} className={styles.icon} />
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={styles.section}>
            <h3>Social Profiles</h3>
            <div className={styles.grid}>
              <div className={styles.formGroup}>
                <label>GitHub Link</label>
                <div className={styles.inputWrap}>
                  <GithubIcon size={18} className={styles.icon} />
                  <input
                    type="url"
                    value={formData.github}
                    onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                    placeholder="https://github.com/yourusername"
                  />
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>LinkedIn Link</label>
                <div className={styles.inputWrap}>
                  <LinkedinIcon size={18} className={styles.icon} />
                  <input
                    type="url"
                    value={formData.linkedin}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    placeholder="https://linkedin.com/in/yourusername"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className={styles.actions}>
            {saved && <span className={styles.successMsg}>Changes saved successfully!</span>}
            <button type="submit" className="btn btn-primary">
              <Save size={18} /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
