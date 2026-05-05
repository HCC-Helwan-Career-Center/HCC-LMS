"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Plus, Trash2 } from "lucide-react";
import { changeUserRole, deleteUser, createUser, enrollUserInTrack, unenrollUserFromTrack } from "@/actions/admin";
import styles from "../admin.module.css";

const ITEMS_PER_PAGE = 10;

export default function UsersClient({ users, tracks }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [trackFilter, setTrackFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [viewUser, setViewUser] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({ name: "", email: "", password: "", track: "none", role: "student" });
  const [busy, setBusy] = useState(false);

  // Filter logic
  const filtered = users.filter((u) => {
    if (search) {
      const q = search.toLowerCase();
      if (!u.name?.toLowerCase().includes(q) && !u.email?.toLowerCase().includes(q)) return false;
    }
    if (roleFilter !== "all" && u.role !== roleFilter) return false;
    if (trackFilter !== "all" && !u.trackSlugs.includes(trackFilter)) return false;
    if (statusFilter === "verified" && !u.emailVerified) return false;
    if (statusFilter === "unverified" && u.emailVerified) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  async function handleRoleChange(userId, newRole) {
    setBusy(true);
    await changeUserRole(userId, newRole);
    setBusy(false);
    router.refresh();
  }

  async function handleDelete() {
    if (!confirmDelete) return;
    setBusy(true);
    const res = await deleteUser(confirmDelete);
    setBusy(false);
    if (res.error) alert(res.error);
    setConfirmDelete(null);
    router.refresh();
  }

  async function handleCreate() {
    if (!createForm.email || !createForm.password || !createForm.name) {
      alert("Name, email, and password are required.");
      return;
    }
    setBusy(true);
    const res = await createUser(createForm);
    setBusy(false);
    if (res.error) {
      alert(res.error);
      return;
    }
    setCreateForm({ name: "", email: "", password: "", track: "none", role: "student" });
    setShowCreate(false);
    router.refresh();
  }

  async function handleAddTrack(userId, trackSlug) {
    if (trackSlug === "none") return;
    setBusy(true);
    const res = await enrollUserInTrack(userId, trackSlug);
    setBusy(false);
    if (res.error) {
      alert(res.error);
      return;
    }
    setViewUser({
      ...viewUser,
      trackSlugs: [...viewUser.trackSlugs, trackSlug],
      tracks: [...viewUser.tracks, tracks.find(t => t.slug === trackSlug)?.title || trackSlug]
    });
    router.refresh();
  }

  async function handleRemoveTrack(userId, trackSlug) {
    if (!confirm("Are you sure you want to remove the user from this track?")) return;
    setBusy(true);
    const res = await unenrollUserFromTrack(userId, trackSlug);
    setBusy(false);
    if (res.error) {
      alert(res.error);
      return;
    }
    setViewUser({
      ...viewUser,
      trackSlugs: viewUser.trackSlugs.filter(t => t !== trackSlug),
      tracks: viewUser.tracks.filter((t, i) => viewUser.trackSlugs[i] !== trackSlug)
    });
    router.refresh();
  }

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <h1>User Management</h1>
        <p>{users.length} total users</p>
      </div>

      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <h2>User List</h2>
          <button className="btn btn-primary" style={{ padding: '8px 20px', fontSize: '0.875rem' }} onClick={() => setShowCreate(true)}>
            <Plus size={16} /> Add User
          </button>
        </div>
        
        {/* Filters */}
        <div className={styles.filtersBar}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
          <select className={styles.filterSelect} value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}>
            <option value="all">All Roles</option>
            <option value="student">Student</option>
            <option value="mentor">Mentor</option>
            <option value="admin">Admin</option>
          </select>
          <select className={styles.filterSelect} value={trackFilter} onChange={(e) => { setTrackFilter(e.target.value); setPage(1); }}>
            <option value="all">All Tracks</option>
            {tracks.map((t) => (
              <option key={t.slug} value={t.slug}>{t.title}</option>
            ))}
          </select>
          <select className={styles.filterSelect} value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}>
            <option value="all">All Status</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
          </select>
        </div>

        {/* Table */}
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>University ID</th>
                <th>Track</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((u) => (
                <tr key={u.id}>
                  <td><strong>{u.name || "—"}</strong></td>
                  <td>{u.email}</td>
                  <td>{u.universityId || "—"}</td>
                  <td>{u.tracks.join(", ") || "—"}</td>
                  <td>
                    <select
                      className={styles.roleSelect}
                      value={u.role}
                      disabled={busy}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                    >
                      <option value="student">Student</option>
                      <option value="mentor">Mentor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td>{u.createdAt}</td>
                  <td>
                    <span className={u.emailVerified ? styles.statusVerified : styles.statusUnverified}>
                      {u.emailVerified ? "Verified" : "Unverified"}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actionBtns}>
                      <button className={styles.actionBtn} onClick={() => setViewUser(u)}>View</button>
                      <button className={`${styles.actionBtn} ${styles.actionBtnDanger}`} onClick={() => setConfirmDelete(u.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: '24px', color: '#94A3B8' }}>No users found.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
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

      {/* View User Modal */}
      {viewUser && (
        <div className={styles.modalOverlay} onClick={() => setViewUser(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>User Profile</h3>
              <button className={styles.actionBtn} onClick={() => setViewUser(null)}><X size={16} /></button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}><label>Name</label><p>{viewUser.name || "—"}</p></div>
              <div className={styles.formGroup}><label>Email</label><p>{viewUser.email}</p></div>
              <div className={styles.formGroup}><label>University ID</label><p>{viewUser.universityId || "—"}</p></div>
              <div className={styles.formGroup}><label>Phone</label><p>{viewUser.phone || "—"}</p></div>
              <div className={styles.formGroup}><label>Academic Year</label><p>{viewUser.academicYear || "—"}</p></div>
              <div className={styles.formGroup}><label>Department</label><p>{viewUser.department || "—"}</p></div>
              <div className={styles.formGroup}><label>GitHub</label><p>{viewUser.github || "—"}</p></div>
              <div className={styles.formGroup}><label>LinkedIn</label><p>{viewUser.linkedin || "—"}</p></div>
              <div className={styles.formGroup}><label>Role</label><p style={{ textTransform: 'capitalize' }}>{viewUser.role}</p></div>
              <div className={styles.formGroup}>
                <label>Tracks</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                  {viewUser.trackSlugs.map((slug, i) => (
                    <span key={slug} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#F1F5F9', padding: '4px 8px', borderRadius: '4px', fontSize: '0.875rem' }}>
                      {viewUser.tracks[i]}
                      <button onClick={() => handleRemoveTrack(viewUser.id, slug)} disabled={busy} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444', padding: 0, display: 'flex' }}>
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                  {viewUser.trackSlugs.length === 0 && <span style={{ color: '#94A3B8', fontSize: '0.875rem' }}>None</span>}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <select 
                    className={styles.filterSelect} 
                    style={{ flex: 1, margin: 0 }}
                    onChange={(e) => {
                      handleAddTrack(viewUser.id, e.target.value);
                      e.target.value = "none";
                    }}
                    disabled={busy}
                    defaultValue="none"
                  >
                    <option value="none">Add to track...</option>
                    {tracks.filter(t => !viewUser.trackSlugs.includes(t.slug)).map((t) => (
                      <option key={t.slug} value={t.slug}>{t.title}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className={styles.formGroup}><label>Joined</label><p>{viewUser.createdAt}</p></div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className={styles.modalOverlay} onClick={() => setConfirmDelete(null)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Confirm Deletion</h3>
              <button className={styles.actionBtn} onClick={() => setConfirmDelete(null)}><X size={16} /></button>
            </div>
            <div className={styles.modalBody}>
              <p style={{ fontSize: '0.9375rem' }}>Are you sure you want to delete this user? This action cannot be undone. All their enrollments and data will be permanently removed.</p>
            </div>
            <div className={styles.modalFooter}>
              <button className="btn btn-secondary" onClick={() => setConfirmDelete(null)} style={{ padding: '8px 20px', fontSize: '0.875rem' }}>Cancel</button>
              <button className="btn btn-primary" onClick={handleDelete} disabled={busy} style={{ padding: '8px 20px', fontSize: '0.875rem', background: '#D32F2F' }}>
                {busy ? "Deleting..." : "Delete User"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showCreate && (
        <div className={styles.modalOverlay} onClick={() => setShowCreate(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Add New User</h3>
              <button className={styles.actionBtn} onClick={() => setShowCreate(false)}><X size={16} /></button>
            </div>
            <div className={styles.modalBody}>
              <div className={styles.formGroup}>
                <label>Full Name</label>
                <input value={createForm.name} onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })} placeholder="John Doe" />
              </div>
              <div className={styles.formGroup}>
                <label>Email</label>
                <input type="email" value={createForm.email} onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })} placeholder="john@example.com" />
              </div>
              <div className={styles.formGroup}>
                <label>Password</label>
                <input type="text" value={createForm.password} onChange={(e) => setCreateForm({ ...createForm, password: e.target.value })} placeholder="Temp password..." />
              </div>
              <div className={styles.formGroup}>
                <label>Role</label>
                <select value={createForm.role} onChange={(e) => setCreateForm({ ...createForm, role: e.target.value })}>
                  <option value="student">Student</option>
                  <option value="mentor">Mentor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Enroll in Track</label>
                <select value={createForm.track} onChange={(e) => setCreateForm({ ...createForm, track: e.target.value })}>
                  <option value="none">None</option>
                  {tracks.map((t) => (
                    <option key={t.slug} value={t.slug}>{t.title}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className={styles.modalFooter}>
              <button className="btn btn-secondary" onClick={() => setShowCreate(false)} style={{ padding: '8px 20px', fontSize: '0.875rem' }}>Cancel</button>
              <button className="btn btn-primary" onClick={handleCreate} disabled={busy} style={{ padding: '8px 20px', fontSize: '0.875rem' }}>
                {busy ? "Creating..." : "Create User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
