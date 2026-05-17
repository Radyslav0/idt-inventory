import { useState, useEffect } from 'react';
import { getUsers, createUser, deleteUser } from '../api/client';
import type { User, CreateUserDto } from '../types';

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<CreateUserDto>({ firstName: '', lastName: '' });
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    try { setUsers(await getUsers()); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    if (!form.firstName.trim() || !form.lastName.trim()) return;
    setSubmitting(true);
    try {
      await createUser(form);
      setForm({ firstName: '', lastName: '' });
      setShowModal(false);
      await load();
    } finally { setSubmitting(false); }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    await deleteUser(id);
    await load();
  };

  return (
      <div>
        <div className="page-header">
          <div>
            <div className="page-title">Users</div>
            <div className="page-subtitle">Manage team members</div>
          </div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add User</button>
        </div>

        <div className="page-body">
          <div className="stats-row" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <div className="stat-card">
              <div className="stat-label">Total Users</div>
              <div className="stat-value" style={{ color: 'var(--blue)' }}>{users.length}</div>
            </div>
          </div>

          <div className="card table-wrap">
            {loading ? (
                <div style={{ padding: 48, textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>Loading…</div>
            ) : users.length === 0 ? (
                <div className="empty-state"><p>No users yet.</p></div>
            ) : (
                <table>
                  <thead>
                  <tr>
                    <th style={{ width: 40 }}>#</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th>ID</th>
                    <th style={{ width: 72 }}></th>
                  </tr>
                  </thead>
                  <tbody>
                  {users.map((u, i) => (
                      <tr key={u.id}>
                        <td className="text-muted mono" style={{ fontSize: 12 }}>{i + 1}</td>
                        <td style={{ fontWeight: 500 }}>{u.firstName}</td>
                        <td>{u.lastName}</td>
                        <td className="mono text-muted" style={{ fontSize: 11 }}>{u.id.split('-')[0]}</td>
                        <td>
                          <button
                              className="btn btn-ghost-danger btn-sm"
                              onClick={() => handleDelete(u.id, `${u.firstName} ${u.lastName}`)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                  ))}
                  </tbody>
                </table>
            )}
          </div>
        </div>

        {showModal && (
            <div className="modal-overlay" onClick={() => setShowModal(false)}>
              <div className="modal" onClick={e => e.stopPropagation()}>
                <div className="modal-title">Add User</div>
                <div className="modal-body">
                  <div className="form-group">
                    <label>First Name</label>
                    <input
                        value={form.firstName}
                        onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                        placeholder="e.g. Linas"
                        autoFocus
                    />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input
                        value={form.lastName}
                        onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                        placeholder="e.g. Petraitis"
                        onKeyDown={e => e.key === 'Enter' && handleCreate()}
                    />
                  </div>
                </div>
                <div className="modal-actions">
                  <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                  <button
                      className="btn btn-primary"
                      onClick={handleCreate}
                      disabled={submitting || !form.firstName.trim() || !form.lastName.trim()}
                  >
                    {submitting ? 'Creating…' : 'Create User'}
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
}
