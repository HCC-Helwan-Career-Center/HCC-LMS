"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import styles from "./auth.module.css";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get("registered") === "true";

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Map NextAuth error codes to user-friendly messages
  const ERROR_MESSAGES = {
    "Missing credentials": "Please enter your email and password.",
    "User not found": "No account found with this email.",
    "Email not verified": "Please verify your email before signing in. Check your inbox.",
    "Invalid password": "Incorrect password. Please try again.",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      // NextAuth v5: res.code contains the custom error code from CustomAuthError
      const code = res?.code || res?.error;
      const message = ERROR_MESSAGES[code] || "Login failed. Please try again.";
      setError(message);
    } else if (res?.ok) {
      window.location.href = "/dashboard";
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
            <h1>Welcome Back</h1>
            <p>Continue your learning journey with HCC. Your tracks, projects, and progress are waiting.</p>
          </div>
          <div className={styles.authLeftDecor}>
            <div className={styles.decorOrb1} />
            <div className={styles.decorOrb2} />
          </div>
        </div>
      </div>

      <div className={styles.authRight}>
        <div className={styles.authForm}>
          <h2>Sign In</h2>
          <p className={styles.authSubtitle}>
            Don&apos;t have an account?{" "}
            <Link href="/register" className={styles.authLink}>Register here</Link>
          </p>

          <form onSubmit={handleSubmit}>
            {justRegistered && (
              <div className={styles.errorAlert} style={{ background: '#e8f5e9', borderColor: '#4caf50', color: '#2e7d32' }}>
                Account created successfully! You can now sign in.
              </div>
            )}
            {error && <div className={styles.errorAlert}>{error}</div>}

            <div className={styles.inputGroup}>
              <label htmlFor="login-email">Email Address</label>
              <div className={styles.inputWrap}>
                <Mail size={18} className={styles.inputIcon} />
                <input
                  type="email"
                  id="login-email"
                  placeholder="you@example.com"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="login-password">Password</label>
              <div className={styles.inputWrap}>
                <Lock size={18} className={styles.inputIcon} />
                <input
                  type={showPassword ? "text" : "password"}
                  id="login-password"
                  placeholder="Enter your password"
                  required
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

            <div className={styles.formOptions}>
              <label className={styles.checkbox}>
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <a href="#" className={styles.forgotLink}>Forgot password?</a>
            </div>

            <button type="submit" className="btn btn-primary btn-lg" disabled={loading} style={{ width: "100%" }}>
              {loading ? "Signing in..." : <>Sign In <ArrowRight size={18} /></>}
            </button>
          </form>

          <div className={styles.divider}>
            <span>or</span>
          </div>

          <button
            className={`btn ${styles.googleBtn}`}
            type="button"
            onClick={() => alert("Google Sign-In will be available once the backend is set up with NextAuth.js. For now, please sign in with email.")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
            <span style={{ fontSize: '0.625rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', padding: '2px 8px', borderRadius: '999px', background: 'rgba(232,135,30,0.1)', color: '#E8871E' }}>Coming Soon</span>
          </button>
        </div>
      </div>
    </div>
  );
}
