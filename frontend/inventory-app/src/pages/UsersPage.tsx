import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchUsers, createUser, deleteUser } from '../api/client';
import { QUERY_KEYS } from '../constants/app';
import type { CreateUserDto } from '../types';

const DEFAULT_FORM: CreateUserDto = { firstName: '', lastName: '' };

export function UsersPage() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<CreateUserDto>(DEFAULT_FORM);

  const { data: users = [], isLoading } = useQuery({
    queryKey: QUERY_KEYS.users,
    queryFn: fetchUsers,
  });

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users });
      setForm(DEFAULT_FORM);
      setShowModal(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users }),
  });

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    deleteMutation.mutate(id);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Users</div>
          <div className="page-subtitle">Manage team members</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          Add User
        </button>
      </div>

      <div className="page-body">
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-label">Total Users</div>
            <div className="stat-value" style={{ color: 'var(--accent)' }}>{users.length}</div>
          </div>
        </div>

        <div className="card table-wrap">
          {isLoading ? (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--muted)' }}>Loading...</div>
          ) : users.length === 0 ? (
            <div className="empty-state">
              <p>No users yet. Add one.</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>ID</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={u.id}>
                    <td className="text-muted text-mono">{i + 1}</td>
                    <td style={{ fontWeight: 500 }}>{u.firstName}</td>
                    <td>{u.lastName}</td>
                    <td className="text-mono" style={{ fontSize: 11, color: 'var(--muted)' }}>
                      {u.id.split('-')[0]}...
                    </td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(u.id, `${u.firstName} ${u.lastName}`)}
                        disabled={deleteMutation.isPending}
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
            <div className="modal-title">Add New User</div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
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
                  onKeyDown={e => e.key === 'Enter' && createMutation.mutate(form)}
                />
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button
                className="btn btn-primary"
                onClick={() => createMutation.mutate(form)}
                disabled={createMutation.isPending || !form.firstName.trim() || !form.lastName.trim()}
              >
                {createMutation.isPending ? 'Creating...' : 'Create User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
