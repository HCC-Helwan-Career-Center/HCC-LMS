"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Brain, ShieldCheck, Code, X, Pencil, UserPlus, UserMinus } from "lucide-react";
import { updateTrack, assignMentorToTrack, removeMentorFromTrack } from "@/actions/admin";
import styles from "../admin.module.css";

const TRACK_ICONS = {
  ai: Brain,
  cybersecurity: ShieldCheck,
  swe: Code,
};

export default function TracksClient({ tracks }) {
  const router = useRouter();
  const [editTrack, setEditTrack] = useState(null);
  const [manageMentorsTrack, setManageMentorsTrack] = useState(null);
  const [form, setForm] = useState({ title: "", slug: "", description: "", color: "" });
  const [saving, setSaving] = useState(false);

  function openEdit(track) {
    setForm({ title: track.title, slug: track.slug, description: track.description || "", color: track.color });
    setEditTrack(track);
  }

  async function handleSave() {
    setSaving(true);
    const res = await updateTrack(editTrack.id, form);
    setSaving(false);
    if (res.error) { alert(res.error); return; }
    setEditTrack(null);
    router.refresh();
  }

  async function handleAssignMentor(mentorId) {
    setSaving(true);
    const res = await assignMentorToTrack(manageMentorsTrack.id, mentorId);
    setSaving(false);
    if (res.error) alert(res.error);
    else {
      setManageMentorsTrack(prev => ({ ...prev, mentors: [...prev.mentors, mentors.find(m => m.id === mentorId)] }));
      router.refresh();
    }
  }

  async function handleRemoveMentor(mentorId) {
    setSaving(true);
    const res = await removeMentorFromTrack(manageMentorsTrack.id, mentorId);
    setSaving(false);
    if (res.error) alert(res.error);
    else {
      setManageMentorsTrack(prev => ({ ...prev, mentors: prev.mentors.filter(m => m.id !== mentorId) }));
      router.refresh();
    }
  }

  // Collect all enrollments from all tracks
  const allEnrollments = tracks.flatMap((t) =>
    t.enrollments.map((e) => ({ ...e, trackTitle: t.title, trackColor: t.color }))
  ).sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1>Track Management</h1>
        <p>Manage the {tracks.length} learning tracks.</p>
      </div>

      {/* Track Cards */}
      <div className={styles.trackCards}>
        {tracks.map((t) => {
          const Icon = TRACK_ICONS[t.slug] || Code;
          return (
            <div key={t.id} className={styles.trackCard}>
              <div className={styles.trackCardHeader}>
                <div className={styles.trackIcon} style={{ background: `${t.color}14`, color: t.color }}>
                  <Icon size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>{t.title}</h3>
                  <p style={{ fontSize: '0.8125rem', color: '#94A3B8' }}>{t.slug}</p>
                </div>
              </div>
              {t.description && <p style={{ fontSize: '0.875rem', color: '#64748B', marginBottom: '12px' }}>{t.description}</p>}
              <div className={styles.trackCardStats}>
                <span><strong>{t.studentCount}</strong> Students</span>
                <span><strong>{t.mentorCount}</strong> Mentors</span>
                <span><strong>{t.totalEnrollments}</strong> Total</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                <button className={styles.actionBtn} onClick={() => openEdit(t)} style={{ flex: 1, justifyContent: 'center' }}>
                  <Pencil size={14} style={{ marginRight: 4 }} /> Edit
                </button>
                <button className={styles.actionBtn} onClick={() => setManageMentorsTrack(t)} style={{ flex: 1, justifyContent: 'center' }}>
                  <UserPlus size={14} style={{ marginRight: 4 }} /> Mentors
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* All Enrollments Table */}
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <h2>All Enrollments</h2>
        </div>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Student</th>
                <th>Email</th>
                <th>Track</th>
                <th>Enrolled</th>
              </tr>
            </thead>
            <tbody>
              {allEnrollments.map((e) => (
                <tr key={e.id}>
                  <td><strong>{e.userName || "—"}</strong></td>
                  <td>{e.userEmail}</td>
                  <td><span style={{ color: e.trackColor, fontWeight: 600 }}>{e.trackTitle}</span></td>
                  <td>{e.createdAt}</td>
                </tr>
              ))}
              {allEnrollments.length === 0 && (
                <tr><td colSpan={4} style={{ textAlign: 'center', padding: '24px', color: '#94A3B8' }}>No enrollments yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Track Modal */}
      {editTrack && (
        <div className={styles.modalOverlay} onClick={() => setEditTrack(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Edit Track</h3>
              <button className={styles.actionBtn} onClick={() => setEditTrack(null)}><X size={16} /></button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label>Title</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className={styles.formGroup}>
                <label>Slug</label>
                <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
              </div>
              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className={styles.formGroup}>
                <label>Color</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
                  <div style={{ width: 32, height: 32, borderRadius: 6, background: form.color, border: '1px solid #E2E8F0', flexShrink: 0 }} />
                </div>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className="btn btn-secondary" onClick={() => setEditTrack(null)} style={{ padding: '8px 20px', fontSize: '0.875rem' }}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving} style={{ padding: '8px 20px', fontSize: '0.875rem' }}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manage Mentors Modal */}
      {manageMentorsTrack && (
        <div className={styles.modalOverlay} onClick={() => setManageMentorsTrack(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Manage Mentors - {manageMentorsTrack.title}</h3>
              <button className={styles.actionBtn} onClick={() => setManageMentorsTrack(null)}><X size={16} /></button>
            </div>
            <div className={styles.modalBody}>
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1A1A2E', marginBottom: '8px' }}>Currently Assigned</h4>
                {manageMentorsTrack.mentors.length > 0 ? (
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {manageMentorsTrack.mentors.map(m => (
                      <li key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', background: '#F8FAFC', borderRadius: '6px' }}>
                        <div>
                          <p style={{ fontSize: '0.875rem', fontWeight: 500, margin: 0 }}>{m.name}</p>
                          <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0 }}>{m.email}</p>
                        </div>
                        <button className={styles.actionBtn} onClick={() => handleRemoveMentor(m.id)} disabled={saving} style={{ color: '#D32F2F', padding: '4px 8px' }}>
                          <UserMinus size={14} /> Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ fontSize: '0.875rem', color: '#64748B' }}>No mentors assigned yet.</p>
                )}
              </div>

              <div>
                <h4 style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1A1A2E', marginBottom: '8px' }}>Available Mentors</h4>
                {mentors.filter(m => !manageMentorsTrack.mentors.some(tm => tm.id === m.id)).length > 0 ? (
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {mentors.filter(m => !manageMentorsTrack.mentors.some(tm => tm.id === m.id)).map(m => (
                      <li key={m.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', border: '1px solid #E2E8F0', borderRadius: '6px' }}>
                        <div>
                          <p style={{ fontSize: '0.875rem', fontWeight: 500, margin: 0 }}>{m.name}</p>
                          <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0 }}>{m.email}</p>
                        </div>
                        <button className="btn btn-primary" onClick={() => handleAssignMentor(m.id)} disabled={saving} style={{ padding: '4px 12px', fontSize: '0.75rem' }}>
                          <UserPlus size={14} style={{ marginRight: '4px' }}/> Assign
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p style={{ fontSize: '0.875rem', color: '#64748B' }}>All available mentors are already assigned.</p>
                )}
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className="btn btn-secondary" onClick={() => setManageMentorsTrack(null)} style={{ padding: '8px 20px', fontSize: '0.875rem' }}>Done</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
