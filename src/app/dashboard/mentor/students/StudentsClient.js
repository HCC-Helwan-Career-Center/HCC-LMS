"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Search } from "lucide-react";
import { addMentorNote } from "@/actions/mentor";
import styles from "../mentor.module.css";

const ITEMS_PER_PAGE = 10;

export default function StudentsClient({ students, tracks }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [trackFilter, setTrackFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [viewStudent, setViewStudent] = useState(null);
  const [noteStudent, setNoteStudent] = useState(null);
  const [noteContent, setNoteContent] = useState("");
  const [busy, setBusy] = useState(false);

  const filtered = students.filter((s) => {
    if (search) {
      const q = search.toLowerCase();
      if (!s.name?.toLowerCase().includes(q) && !s.email?.toLowerCase().includes(q)) return false;
    }
    if (trackFilter !== "all" && !s.tracks.some(t => t.id === trackFilter)) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  async function handleAddNote() {
    if (!noteContent.trim()) return;
    setBusy(true);
    const res = await addMentorNote(noteStudent.id, noteContent);
    setBusy(false);
    if (res.error) {
      alert(res.error);
    } else {
      setNoteStudent(null);
      setNoteContent("");
      router.refresh();
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1>My Students</h1>
        <p>{students.length} students enrolled in your tracks</p>
      </div>

      <div className={styles.sectionCard}>
        <div className={styles.filtersBar}>
          <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '10px', color: '#94A3B8' }} />
            <input
              type="text"
              className={styles.searchInput}
              style={{ paddingLeft: '36px' }}
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          {tracks.length > 1 && (
            <select className={styles.filterSelect} value={trackFilter} onChange={(e) => { setTrackFilter(e.target.value); setPage(1); }}>
              <option value="all">All My Tracks</option>
              {tracks.map((t) => (
                <option key={t.id} value={t.id}>{t.title}</option>
              ))}
            </select>
          )}
        </div>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>University ID</th>
                <th>Track(s) & Progress</th>
                <th>Enrolled Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((s) => (
                <tr key={s.id}>
                  <td><strong>{s.name || "—"}</strong></td>
                  <td>{s.email}</td>
                  <td>{s.universityId || "—"}</td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {s.tracks.map(t => (
                        <span key={t.id} style={{ fontSize: '0.8125rem' }}>
                          {t.title} ({t.progress}%)
                        </span>
                      ))}
                    </div>
                  </td>
                  <td>{s.createdAt}</td>
                  <td>
                    <div className={styles.actionBtns}>
                      <button className={styles.actionBtn} onClick={() => setViewStudent(s)}>View</button>
                      <button className={styles.actionBtn} onClick={() => setNoteStudent(s)}>Add Note</button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr><td colSpan={6} style={{ textAlign: 'center', padding: '24px', color: '#94A3B8' }}>No students found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button className={styles.pageBtn} disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i + 1} className={`${styles.pageBtn} ${page === i + 1 ? styles.active : ""}`} onClick={() => setPage(i + 1)}>
                {i + 1}
              </button>
            ))}
            <button className={styles.pageBtn} disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
          </div>
        )}
      </div>

      {/* View Student Modal */}
      {viewStudent && (
        <div className={styles.modalOverlay} onClick={() => setViewStudent(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Student Profile</h3>
              <button className={styles.actionBtn} onClick={() => setViewStudent(null)}><X size={16} /></button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}><label>Name</label><p>{viewStudent.name || "—"}</p></div>
              <div className={styles.formGroup}><label>Email</label><p>{viewStudent.email}</p></div>
              <div className={styles.formGroup}><label>University ID</label><p>{viewStudent.universityId || "—"}</p></div>
              <div className={styles.formGroup}><label>Joined Platform</label><p>{viewStudent.createdAt}</p></div>
              <div className={styles.formGroup}>
                <label>Enrollments</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                  {viewStudent.tracks.map(t => (
                    <div key={t.id} style={{ background: '#F8FAFC', padding: '8px', borderRadius: '4px', fontSize: '0.875rem' }}>
                      <strong>{t.title}</strong>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px', color: '#64748B' }}>
                        <span>Enrolled: {t.enrolledAt}</span>
                        <span>Progress: {t.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Note Modal */}
      {noteStudent && (
        <div className={styles.modalOverlay} onClick={() => setNoteStudent(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Add Note for {noteStudent.name}</h3>
              <button className={styles.actionBtn} onClick={() => setNoteStudent(null)}><X size={16} /></button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label>Note Content</label>
                <textarea 
                  rows={4}
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  placeholder="E.g., Needs help with the latest assignment..."
                  style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #E2E8F0' }}
                />
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className="btn btn-secondary" onClick={() => setNoteStudent(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleAddNote} disabled={busy || !noteContent.trim()}>
                {busy ? "Saving..." : "Save Note"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
