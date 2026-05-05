"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Plus, Trash2 } from "lucide-react";
import { createMentorAnnouncement, deleteMentorAnnouncement } from "@/actions/mentor";
import styles from "../mentor.module.css";

export default function AnnouncementsClient({ announcements, tracks, mentorId }) {
  const router = useRouter();
  const [showCreate, setShowCreate] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [busy, setBusy] = useState(false);

  const [form, setForm] = useState({ title: "", body: "", targetId: tracks[0]?.id || "" });

  async function handleCreate() {
    if (!form.title || !form.body || !form.targetId) {
      alert("Please fill all fields.");
      return;
    }
    setBusy(true);
    const res = await createMentorAnnouncement(form);
    setBusy(false);
    if (res.error) alert(res.error);
    else {
      setForm({ title: "", body: "", targetId: tracks[0]?.id || "" });
      setShowCreate(false);
      router.refresh();
    }
  }

  async function handleDelete() {
    if (!confirmDelete) return;
    setBusy(true);
    const res = await deleteMentorAnnouncement(confirmDelete);
    setBusy(false);
    if (res.error) alert(res.error);
    setConfirmDelete(null);
    router.refresh();
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1>Announcements</h1>
        <p>Post announcements to your enrolled students.</p>
      </div>

      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <h2>Track Announcements</h2>
          <button className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '0.875rem' }} onClick={() => setShowCreate(true)} disabled={tracks.length === 0}>
            <Plus size={16} /> New Announcement
          </button>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title & Preview</th>
                <th>Target Track</th>
                <th>Author</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {announcements.map((ann) => {
                const isOwner = ann.authorId === mentorId;
                const trackName = tracks.find(t => t.slug === ann.target)?.title || ann.target;

                return (
                  <tr key={ann.id}>
                    <td style={{ maxWidth: '300px' }}>
                      <strong>{ann.title}</strong>
                      <div style={{ fontSize: '0.8125rem', color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {ann.body}
                      </div>
                    </td>
                    <td>
                      <span className={styles.badge}>{trackName}</span>
                    </td>
                    <td>{ann.author.name}</td>
                    <td>{ann.createdAt.toLocaleDateString()}</td>
                    <td>
                      {isOwner ? (
                        <button className={`${styles.actionBtn} ${styles.actionBtnDanger}`} onClick={() => setConfirmDelete(ann.id)}>
                          <Trash2 size={16} /> Delete
                        </button>
                      ) : (
                        <span style={{ fontSize: '0.8125rem', color: '#94A3B8' }}>Read-only</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {announcements.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: '24px', color: '#94A3B8' }}>No announcements found for your tracks.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className={styles.modalOverlay} onClick={() => setShowCreate(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Create Announcement</h3>
              <button className={styles.actionBtn} onClick={() => setShowCreate(false)}><X size={16} /></button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label>Title</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="E.g., Next Session Rescheduled" />
              </div>
              <div className={styles.formGroup}>
                <label>Announcement Body</label>
                <textarea rows={4} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} placeholder="Write your message here..." style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #E2E8F0' }} />
              </div>
              <div className={styles.formGroup}>
                <label>Target Track</label>
                <select value={form.targetId} onChange={(e) => setForm({ ...form, targetId: e.target.value })}>
                  {tracks.map((t) => (
                    <option key={t.id} value={t.id}>{t.title}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className="btn btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleCreate} disabled={busy}>
                {busy ? "Posting..." : "Post Announcement"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {confirmDelete && (
        <div className={styles.modalOverlay} onClick={() => setConfirmDelete(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Confirm Deletion</h3>
              <button className={styles.actionBtn} onClick={() => setConfirmDelete(null)}><X size={16} /></button>
            </div>
            <div className={styles.modalBody}>
              <p>Are you sure you want to delete this announcement?</p>
            </div>
            <div className={styles.modalFooter}>
              <button className="btn btn-secondary" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleDelete} disabled={busy} style={{ background: '#D32F2F' }}>
                {busy ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
