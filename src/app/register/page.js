"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, GraduationCap, Brain, ShieldCheck, Code, Info } from "lucide-react";
import { registerUser } from "@/actions/auth";
import styles from "../login/auth.module.css";
import regStyles from "./register.module.css";

const trackOptions = [
  { value: "ai", label: "Artificial Intelligence", icon: Brain, color: "#8B5CF6" },
  { value: "cybersecurity", label: "Cybersecurity", icon: ShieldCheck, color: "#10B981" },
  { value: "swe", label: "Software Engineering", icon: Code, color: "#3B82F6" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    universityId: "",
    track: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (!formData.track) {
      setError("Please select a track.");
      return;
    }

    setLoading(true);
    const res = await registerUser(formData);
    setLoading(false);

    if (res?.error) {
      setError(res.error);
    } else {
      // Registration successful — redirect to login with success message
      router.push("/login?registered=true");
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authLeft}>
        <div className={styles.authLeftContent}>
          <Link href="/" className={styles.backHome}>
            <img src="/images/hcc_logo.webp" alt="HCC" width={44} height={44} />
            <span>HCC</span>
          </Link>
          <div className={styles.authLeftText}>
            <h1>Join HCC</h1>
            <p>Start your journey in AI, Cybersecurity, or Software Engineering. Build real projects and launch your career.</p>
          </div>
          <div className={styles.authLeftDecor}>
            <div className={styles.decorOrb1} />
            <div className={styles.decorOrb2} />
          </div>
        </div>
      </div>

      <div className={styles.authRight}>
        <div className={styles.authForm}>
          <h2>Create Account</h2>
          <p className={styles.authSubtitle}>
            Already have an account?{" "}
            <Link href="/login" className={styles.authLink}>Sign in</Link>
          </p>

          <form onSubmit={handleSubmit}>
            {error && <div className={styles.errorAlert}>{error}</div>}
            
            <div className={styles.inputGroup}>
              <label htmlFor="reg-name">Full Name</label>
              <div className={styles.inputWrap}>
                <User size={18} className={styles.inputIcon} />
                <input
                  type="text"
                  id="reg-name"
                  placeholder="Your full name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="reg-email">Email Address</label>
              <div className={styles.inputWrap}>
                <Mail size={18} className={styles.inputIcon} />
                <input
                  type="email"
                  id="reg-email"
                  placeholder="you@example.com"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="reg-uid">University ID</label>
              <div className={styles.inputWrap}>
                <GraduationCap size={18} className={styles.inputIcon} />
                <input
                  type="text"
                  id="reg-uid"
                  placeholder="e.g. 20221234"
                  required
                  value={formData.universityId}
                  onChange={(e) => setFormData({ ...formData, universityId: e.target.value })}
                />
              </div>
            </div>

            {/* Track Selection */}
            <div className={styles.inputGroup}>
              <label>Choose Your Track</label>
              <div className={regStyles.trackSelection}>
                {trackOptions.map((t) => {
                  const selected = formData.track === t.value;
                  return (
                    <button
                      key={t.value}
                      type="button"
                      className={`${regStyles.trackOption} ${selected ? regStyles.trackSelected : ""}`}
                      style={selected ? { borderColor: t.color, background: `${t.color}08` } : {}}
                      onClick={() => setFormData({ ...formData, track: t.value })}
                    >
                      <t.icon size={20} style={{ color: t.color }} />
                      <span>{t.label}</span>
                    </button>
                  );
                })}
              </div>
              <div className={regStyles.trackNote}>
                <Info size={14} />
                <span>You can register for <strong>one track only</strong>. To enroll in additional tracks, contact the admin.</span>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="reg-password">Password</label>
              <div className={styles.inputWrap}>
                <Lock size={18} className={styles.inputIcon} />
                <input
                  type={showPassword ? "text" : "password"}
                  id="reg-password"
                  placeholder="Create a password (min 8 characters)"
                  required
                  minLength={8}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className={styles.togglePassword}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="reg-confirm">Confirm Password</label>
              <div className={styles.inputWrap}>
                <Lock size={18} className={styles.inputIcon} />
                <input
                  type="password"
                  id="reg-confirm"
                  placeholder="Confirm your password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: "100%", marginTop: "var(--space-sm)" }}>
              {loading ? "Creating Account..." : <>Create Account <ArrowRight size={18} /></>}
            </button>
          </form>

          <div className={styles.divider}>
            <span>or</span>
          </div>

          <button
            className={`btn ${styles.googleBtn}`}
            type="button"
            onClick={() => alert("Google Sign-In will be available once the backend is set up with NextAuth.js. For now, please register with email.")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
            <span className={regStyles.comingSoonTag}>Coming Soon</span>
          </button>
        </div>
      </div>
    </div>
  );
}
