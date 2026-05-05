"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Plus, Clock, MapPin, Video, CheckCircle, Trash2, Edit } from "lucide-react";
import { scheduleSession, updateSession, deleteSession, markSessionCompleted } from "@/actions/mentor";
import styles from "../mentor.module.css";

export default function SessionsClient({ sessions, tracks, mentorId }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("UPCOMING");
  
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("CREATE"); // CREATE or EDIT
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [busy, setBusy] = useState(false);
  
  const [form, setForm] = useState({
    id: "", title: "", description: "", date: "", time: "", durationMinutes: "60", type: "ONLINE", location: "", meetingLink: "", trackId: tracks[0]?.id || ""
  });

  const filteredSessions = sessions.filter(s => s.status === activeTab);

  const openCreateModal = () => {
    setForm({ id: "", title: "", description: "", date: "", time: "", durationMinutes: "60", type: "ONLINE", location: "", meetingLink: "", trackId: tracks[0]?.id || "" });
    setModalMode("CREATE");
    setShowModal(true);
  };

  const openEditModal = (s) => {
    const d = new Date(s.date);
    const dateStr = d.toISOString().split("T")[0];
    const timeStr = d.toTimeString().substring(0, 5); // HH:MM

    setForm({
      id: s.id,
      title: s.title,
      description: s.description || "",
      date: dateStr,
      time: timeStr,
      durationMinutes: s.durationMinutes.toString(),
      type: s.type,
      location: s.location || "",
      meetingLink: s.meetingLink || "",
      trackId: s.trackId
    });
    setModalMode("EDIT");
    setShowModal(true);
  };

  async function handleSave() {
    if (!form.title || !form.date || !form.time || !form.trackId) {
      alert("Title, date, time, and track are required.");
      return;
    }
    
    // combine date and time
    const dateTimeObj = new Date(`${form.date}T${form.time}`);
    const payload = { ...form, date: dateTimeObj.toISOString() };

    setBusy(true);
    let res;
    if (modalMode === "CREATE") {
      res = await scheduleSession(payload);
    } else {
      res = await updateSession(form.id, payload);
    }
    setBusy(false);

    if (res.error) alert(res.error);
    else {
      setShowModal(false);
      router.refresh();
    }
  }

  async function handleDelete() {
    if (!confirmDelete) return;
    setBusy(true);
    const res = await deleteSession(confirmDelete);
    setBusy(false);
    if (res.error) alert(res.error);
    setConfirmDelete(null);
    router.refresh();
  }

  async function handleComplete(id) {
    if (!confirm("Mark this session as completed?")) return;
    setBusy(true);
    const res = await markSessionCompleted(id);
    setBusy(false);
    if (res.error) alert(res.error);
    router.refresh();
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1>Sessions</h1>
        <p>Schedule and manage live sessions.</p>
      </div>

      <div className={styles.sectionCard}>
        <div className={styles.tabsHeader}>
          <div className={styles.tabs}>
            <button className={`${styles.tabBtn} ${activeTab === "UPCOMING" ? styles.tabActive : ""}`} onClick={() => setActiveTab("UPCOMING")}>
              Upcoming
            </button>
            <button className={`${styles.tabBtn} ${activeTab === "COMPLETED" ? styles.tabActive : ""}`} onClick={() => setActiveTab("COMPLETED")}>
              Archive (Past)
            </button>
          </div>
          <button className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '0.875rem' }} onClick={openCreateModal} disabled={tracks.length === 0}>
            <Plus size={16} /> Schedule Session
          </button>
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title & Track</th>
                <th>Date & Time</th>
                <th>Duration</th>
                <th>Type / Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSessions.map((s) => {
                const dateObj = new Date(s.date);
                const isOwner = s.mentorId === mentorId;

                return (
                  <tr key={s.id}>
                    <td>
                      <strong>{s.title}</strong>
                      <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px' }}>{s.track.title}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={14} color="#64748B" />
                        <span>{dateObj.toLocaleDateString()} at {dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </td>
                    <td>{s.durationMinutes} min</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {s.type === "ONLINE" ? <Video size={14} color="#3B82F6" /> : <MapPin size={14} color="#10B981" />}
                        <span>{s.type === "ONLINE" ? "Online" : "In Person"}</span>
                      </div>
                      {(s.meetingLink || s.location) && (
                        <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '4px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {s.type === "ONLINE" ? s.meetingLink : s.location}
                        </div>
                      )}
                    </td>
                    <td>
                      {isOwner && activeTab === "UPCOMING" ? (
                        <div className={styles.actionBtns}>
                          <button className={styles.actionBtn} onClick={() => handleComplete(s.id)} title="Mark Completed"><CheckCircle size={16} color="#10B981" /></button>
                          <button className={styles.actionBtn} onClick={() => openEditModal(s)} title="Edit"><Edit size={16} /></button>
                          <button className={`${styles.actionBtn} ${styles.actionBtnDanger}`} onClick={() => setConfirmDelete(s.id)} title="Delete"><Trash2 size={16} /></button>
                        </div>
                      ) : (
                        <span style={{ fontSize: '0.8125rem', color: '#94A3B8' }}>Read-only</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filteredSessions.length === 0 && (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: '24px', color: '#94A3B8' }}>No {activeTab.toLowerCase()} sessions.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {showModal && (
        <div className={styles.modalOverlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>{modalMode === "CREATE" ? "Schedule Session" : "Edit Session"}</h3>
              <button className={styles.actionBtn} onClick={() => setShowModal(false)}><X size={16} /></button>
            </div>
            <div className={styles.modalBody} style={{ maxHeight: '60vh', overflowY: 'auto' }}>
              <div className={styles.formGroup}>
                <label>Title</label>
                <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Q&A Session" />
              </div>
              <div className={styles.formGroup}>
                <label>Description</label>
                <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Optional description..." style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #E2E8F0' }} />
              </div>
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <div className={styles.formGroup} style={{ flex: 1 }}>
                  <label>Date</label>
                  <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
                </div>
                <div className={styles.formGroup} style={{ flex: 1 }}>
                  <label>Time</label>
                  <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Duration (Minutes)</label>
                <input type="number" value={form.durationMinutes} onChange={(e) => setForm({ ...form, durationMinutes: e.target.value })} min="15" step="15" />
              </div>

              <div className={styles.formGroup}>
                <label>Type</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value, meetingLink: "", location: "" })}>
                  <option value="ONLINE">Online</option>
                  <option value="IN_PERSON">In Person</option>
                </select>
              </div>

              {form.type === "ONLINE" ? (
                <div className={styles.formGroup}>
                  <label>Meeting Link</label>
                  <input type="url" value={form.meetingLink} onChange={(e) => setForm({ ...form, meetingLink: e.target.value })} placeholder="https://zoom.us/..." />
                </div>
              ) : (
                <div className={styles.formGroup}>
                  <label>Location</label>
                  <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Room 101..." />
                </div>
              )}

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
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave} disabled={busy}>
                {busy ? "Saving..." : "Save Session"}
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
              <p>Are you sure you want to cancel and delete this session?</p>
            </div>
            <div className={styles.modalFooter}>
              <button className="btn btn-secondary" onClick={() => setConfirmDelete(null)}>Keep Session</button>
              <button className="btn btn-primary" onClick={handleDelete} disabled={busy} style={{ background: '#D32F2F' }}>
                {busy ? "Deleting..." : "Delete Session"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
