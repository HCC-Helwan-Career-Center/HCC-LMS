"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Plus, ExternalLink, FileText, Video, Link as LinkIcon } from "lucide-react";
import { uploadMaterial, deleteMaterial } from "@/actions/mentor";
import styles from "../mentor.module.css";

export default function MaterialsClient({ materials, tracks, mentorId }) {
  const router = useRouter();
  const [showCreate, setShowCreate] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [busy, setBusy] = useState(false);
  
  const [form, setForm] = useState({ title: "", description: "", type: "PDF", url: "", trackId: tracks[0]?.id || "" });

  async function handleCreate() {
    if (!form.title || !form.url || !form.trackId) {
      alert("Title, URL, and Track are required.");
      return;
    }
    setBusy(true);
    const res = await uploadMaterial(form);
    setBusy(false);
    if (res.error) alert(res.error);
    else {
      setForm({ title: "", description: "", type: "PDF", url: "", trackId: tracks[0]?.id || "" });
      setShowCreate(false);
      router.refresh();
    }
  }

  async function handleDelete() {
    if (!confirmDelete) return;
    setBusy(true);
    const res = await deleteMaterial(confirmDelete);
    setBusy(false);
    if (res.error) alert(res.error);
    setConfirmDelete(null);
    router.refresh();
  }

  const getTypeIcon = (type) => {
    if (type === "VIDEO") return <Video size={20} />;
    if (type === "LINK") return <LinkIcon size={20} />;
    return <FileText size={20} />;
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1>Learning Materials</h1>
        <p>Manage resources for your students.</p>
      </div>

      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <h2>All Materials</h2>
          <button className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '0.875rem' }} onClick={() => setShowCreate(true)} disabled={tracks.length === 0}>
            <Plus size={16} /> Upload Material
          </button>
        </div>

        <div className={styles.gridList} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', marginTop: '20px' }}>
          {materials.map((m) => (
            <div key={m.id} className={styles.cardItem} style={{ border: '1px solid #E2E8F0', borderRadius: '12px', padding: '20px', background: '#fff' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}>
                  {getTypeIcon(m.type)}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '1rem', margin: 0, color: '#1A1A2E' }}>{m.title}</h3>
                  <span style={{ fontSize: '0.75rem', color: '#94A3B8', textTransform: 'uppercase', fontWeight: 600 }}>{m.track.title}</span>
                </div>
              </div>
              <p style={{ fontSize: '0.875rem', color: '#64748B', marginBottom: '16px', minHeight: '40px' }}>
                {m.description || "No description provided."}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F1F5F9', paddingTop: '16px' }}>
                <a href={m.url} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.875rem', color: '#3B82F6', fontWeight: 500, textDecoration: 'none' }}>
                  <ExternalLink size={14} /> Open
                </a>
                {m.uploadedById === mentorId && (
                  <button onClick={() => setConfirmDelete(m.id)} style={{ background: 'none', border: 'none', color: '#D32F2F', fontSize: '0.875rem', fontWeight: 500, cursor: 'pointer' }}>
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
          {materials.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#94A3B8' }}>
              No materials uploaded yet.
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {showCreate && (
        <div className={styles.modalOverlay} onClick={() => setShowCreate(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Upload Material</h3>
              <button className={styles.actionBtn} onClick={() => setShowCreate(false)}><X size={16} /></button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label>Title</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Week 1 Slides" />
              </div>
              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Optional description..." style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #E2E8F0' }} />
              </div>
              <div className={styles.formGroup}>
                <label>Type</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  <option value="PDF">PDF / Document</option>
                  <option value="VIDEO">Video</option>
                  <option value="LINK">External Link</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>File URL or Link</label>
                <input type="url" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="https://..." />
              </div>
              <div className={styles.formGroup}>
                <label>Target Track</label>
                <select value={form.trackId} onChange={(e) => setForm({ ...form, trackId: e.target.value })}>
                  {tracks.map((t) => (
                    <option key={t.id} value={t.id}>{t.title}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className="btn btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleCreate} disabled={busy}>
                {busy ? "Uploading..." : "Upload Material"}
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
              <p>Are you sure you want to delete this material? Students will no longer be able to access it.</p>
            </div>
            <div className={styles.modalFooter}>
              <button className="btn btn-secondary" onClick={() => setConfirmDelete(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleDelete} disabled={busy} style={{ background: '#D32F2F' }}>
                {busy ? "Deleting..." : "Delete Material"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
