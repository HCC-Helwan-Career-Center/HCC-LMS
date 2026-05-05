"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Mail, MapPin, Clock, Send, ExternalLink, MessageCircle } from "lucide-react";
import styles from "./contact.module.css";

function GithubIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  );
}

function LinkedinIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

function YoutubeIcon({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  );
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles.heroOverlay} />
          <div className={`container ${styles.heroContent}`}>
            <span className="badge badge-dark">Get In Touch</span>
            <h1>Contact <span className="text-gradient">HCC</span></h1>
            <p>
              Have a question, partnership idea, or just want to say hello?
              We&apos;d love to hear from you.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="section">
          <div className="container">
            <div className={styles.grid}>
              {/* Contact Form */}
              <div className={styles.formSide}>
                <h2>Send us a message</h2>
                <p className={styles.formSubtitle}>
                  Fill out the form below and we&apos;ll get back to you as soon as possible.
                </p>

                {submitted && (
                  <div className={styles.successMsg}>
                    ✅ Message sent successfully! We&apos;ll get back to you soon.
                  </div>
                )}

                <form onSubmit={handleSubmit} className={styles.form}>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="contact-name">Full Name</label>
                      <input
                        type="text"
                        id="contact-name"
                        placeholder="Your name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="contact-email">Email Address</label>
                      <input
                        type="email"
                        id="contact-email"
                        placeholder="you@example.com"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="contact-subject">Subject</label>
                    <input
                      type="text"
                      id="contact-subject"
                      placeholder="What's this about?"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="contact-message">Message</label>
                    <textarea
                      id="contact-message"
                      placeholder="Tell us more..."
                      rows={6}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary btn-lg">
                    <Send size={18} /> Send Message
                  </button>
                </form>
              </div>

              {/* Contact Info */}
              <div className={styles.infoSide}>
                <div className={styles.infoCard}>
                  <h3>Contact Information</h3>
                  <div className={styles.infoItems}>
                    <div className={styles.infoItem}>
                      <div className={styles.infoIcon}>
                        <Mail size={20} />
                      </div>
                      <div>
                        <strong>Email</strong>
                        <a href="mailto:helwancareercenter@gmail.com">helwancareercenter@gmail.com</a>
                      </div>
                    </div>
                    <div className={styles.infoItem}>
                      <div className={styles.infoIcon} style={{ background: 'rgba(37, 211, 102, 0.12)', color: '#25D366' }}>
                        <MessageCircle size={20} />
                      </div>
                      <div>
                        <strong>WhatsApp</strong>
                        <a href="https://wa.me/201505864761" target="_blank" rel="noopener noreferrer">+20 150 586 4761</a>
                      </div>
                    </div>
                    <div className={styles.infoItem}>
                      <div className={styles.infoIcon}>
                        <MapPin size={20} />
                      </div>
                      <div>
                        <strong>Location</strong>
                        <span>Faculty of Engineering, Helwan University, Cairo, Egypt</span>
                      </div>
                    </div>
                    <div className={styles.infoItem}>
                      <div className={styles.infoIcon}>
                        <Clock size={20} />
                      </div>
                      <div>
                        <strong>Office Hours</strong>
                        <span>Sun–Thu, 10:00 AM – 5:00 PM</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.socialsCard}>
                  <h3>Follow Us</h3>
                  <div className={styles.socialLinks}>
                    <a
                      href="https://github.com/HCC-Helwan-Career-Center"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialLink}
                    >
                      <GithubIcon size={24} />
                      <div>
                        <strong>GitHub</strong>
                        <span>HCC-Helwan-Career-Center</span>
                      </div>
                      <ExternalLink size={14} className={styles.extIcon} />
                    </a>
                    <a
                      href="https://www.linkedin.com/company/hcc-helwan-career-center/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialLink}
                    >
                      <LinkedinIcon size={24} />
                      <div>
                        <strong>LinkedIn</strong>
                        <span>HCC – Helwan Career Center</span>
                      </div>
                      <ExternalLink size={14} className={styles.extIcon} />
                    </a>
                    <a
                      href="https://www.youtube.com/@HCC-HelwanCareerCenter"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialLink}
                    >
                      <YoutubeIcon size={24} />
                      <div>
                        <strong>YouTube</strong>
                        <span>@HCC-HelwanCareerCenter</span>
                      </div>
                      <ExternalLink size={14} className={styles.extIcon} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
