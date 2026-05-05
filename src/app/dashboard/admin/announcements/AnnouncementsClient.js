"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X, Trash2 } from "lucide-react";
import { createAnnouncement, deleteAnnouncement } from "@/actions/admin";
import styles from "../admin.module.css";

export default function AnnouncementsClient({ announcements, tracks }) {
  const router = useRouter();
  const [showCreate, setShowCreate] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [form, setForm] = useState({ title: "", body: "", target: "all" });
  const [saving, setSaving] = useState(false);

  async function handleCreate() {
    if (!form.title.trim() || !form.body.trim()) { alert("Title and body are required."); return; }
    setSaving(true);
    const res = await createAnnouncement(form);
    setSaving(false);
    if (res.error) { alert(res.error); return; }
    setForm({ title: "", body: "", target: "all" });
    setShowCreate(false);
    router.refresh();
  }

  async function handleDelete() {
    if (!confirmDelete) return;
    setSaving(true);
    await deleteAnnouncement(confirmDelete);
    setSaving(false);
    setConfirmDelete(null);
    router.refresh();
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1>Announcements</h1>
        <p>Manage platform announcements.</p>
      </div>

      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <h2>All Announcements ({announcements.length})</h2>
          <button className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '0.875rem' }} onClick={() => setShowCreate(true)}>
            <Plus size={16} /> New
          </button>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Preview</th>
                <th>Target</th>
                <th>Author</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {announcements.map((a) => (
                <tr key={a.id}>
                  <td><strong>{a.title}</strong></td>
                  <td style={{ maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.body.substring(0, 80)}{a.body.length > 80 ? "…" : ""}</td>
                  <td>
                    <span className={styles.roleBadge} style={{ background: a.target === 'all' ? 'rgba(232,135,30,0.1)' : 'rgba(59,130,246,0.1)', color: a.target === 'all' ? '#E8871E' : '#3B82F6' }}>
                      {a.target === "all" ? "All Users" : a.target}
                    </span>
                  </td>
                  <td>{a.authorName}</td>
                  <td>{a.createdAt}</td>
                  <td>
                    <button className={`${styles.actionBtn} ${styles.actionBtnDanger}`} onClick={() => setConfirmDelete(a.id)}>
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {announcements.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: '#94A3B8' }}>No announcements yet.</td></tr>
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
              <h3>New Announcement</h3>
              <button className={styles.actionBtn} onClick={() => setShowCreate(false)}><X size={16} /></button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label>Title</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Announcement title..." />
              </div>
              <div className={styles.formGroup}>
                <label>Body</label>
                <textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} placeholder="Write your announcement..." />
              </div>
              <div className={styles.formGroup}>
                <label>Target Audience</label>
                <select value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })}>
                  <option value="all">All Users</option>
                  {tracks.map((t) => (
                    <option key={t.slug} value={t.slug}>{t.title} track only</option>
                  ))}
                </select>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className="btn btn-secondary" onClick={() => setShowCreate(false)} style={{ padding: '8px 20px', fontSize: '0.875rem' }}>Cancel</button>
              <button className="btn btn-primary" onClick={handleCreate} disabled={saving} style={{ padding: '8px 20px', fontSize: '0.875rem' }}>
                {saving ? "Publishing..." : "Publish"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {confirmDelete && (
        <div className={styles.modalOverlay} onClick={() => setConfirmDelete(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Delete Announcement</h3>
              <button className={styles.actionBtn} onClick={() => setConfirmDelete(null)}><X size={16} /></button>
            </div>
            <div className={styles.modalBody}>
              <p style={{ fontSize: '0.9375rem' }}>Are you sure? This announcement will be permanently deleted.</p>
            </div>
            <div className={styles.modalFooter}>
              <button className="btn btn-secondary" onClick={() => setConfirmDelete(null)} style={{ padding: '8px 20px', fontSize: '0.875rem' }}>Cancel</button>
              <button className="btn btn-primary" onClick={handleDelete} disabled={saving} style={{ padding: '8px 20px', fontSize: '0.875rem', background: '#D32F2F' }}>
                {saving ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
