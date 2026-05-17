import { useState, useEffect, useCallback } from 'react';
import {
  getInventoryItems, getUsers, createInventoryItem,
  updateInventoryItem, softDeleteItem
} from '../api/client';
import type { InventoryItem, User, InventoryFilter, CreateInventoryItemDto, UpdateInventoryItemDto } from '../types';
import { TypeBadge } from '../components/TypeBadge';
import { ItemModal } from '../components/ItemModal';
import { ExportModal } from '../components/ExportModal';

const ITEM_TYPES = ['', 'Laptop', 'Phone', 'SimCard', 'Tablet'];

export function InventoryPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<InventoryFilter>({ includeDeleted: true });
  const [showAddModal, setShowAddModal] = useState(false);
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);
  const [showExport, setShowExport] = useState(false);

  const loadItems = useCallback(async () => {
    setLoading(true);
    try { setItems(await getInventoryItems(filter)); }
    finally { setLoading(false); }
  }, [filter]);

  useEffect(() => { loadItems(); }, [loadItems]);
  useEffect(() => { getUsers().then(setUsers); }, []);

  const handleCreate = async (dto: CreateInventoryItemDto | UpdateInventoryItemDto) => {
    await createInventoryItem(dto as CreateInventoryItemDto);
    setShowAddModal(false);
    await loadItems();
  };

  const handleUpdate = async (dto: CreateInventoryItemDto | UpdateInventoryItemDto) => {
    if (!editItem) return;
    await updateInventoryItem(editItem.id, dto as UpdateInventoryItemDto);
    setEditItem(null);
    await loadItems();
  };

  const handleDelete = async (item: InventoryItem) => {
    if (!confirm(`Mark "${item.comment}" as deleted?`)) return;
    await softDeleteItem(item.id);
    await loadItems();
  };

  const active  = items.filter(i => !i.isDeleted);
  const deleted = items.filter(i => i.isDeleted);
  const exportFilter: InventoryFilter = { type: filter.type, comment: filter.comment, userId: filter.userId };

  return (
      <div>
        <div className="page-header">
          <div>
            <div className="page-title">Inventory</div>
            <div className="page-subtitle">All company assets</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-secondary" onClick={() => setShowExport(true)}>Export PDF</button>
            <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>+ Add Item</button>
          </div>
        </div>

        <div className="page-body">
          <div className="stats-row">
            <div className="stat-card">
              <div className="stat-label">Active</div>
              <div className="stat-value" style={{ color: 'var(--blue)' }}>{active.length}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Deleted</div>
              <div className="stat-value" style={{ color: 'var(--danger)' }}>{deleted.length}</div>
            </div>
            {['Laptop', 'Phone', 'Tablet', 'SimCard'].map(type => (
                <div className="stat-card" key={type}>
                  <div className="stat-label">{type === 'SimCard' ? 'SIM Cards' : type + 's'}</div>
                  <div className="stat-value">{active.filter(i => i.type === type).length}</div>
                </div>
            ))}
          </div>

          <div className="filter-bar">
            <div className="form-row">
              <div className="form-group">
                <label>Type</label>
                <select value={filter.type ?? ''} onChange={e => setFilter(f => ({ ...f, type: e.target.value || undefined }))}>
                  {ITEM_TYPES.map(t => (
                      <option key={t} value={t}>{t === '' ? 'All Types' : t === 'SimCard' ? 'SIM Card' : t}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Search</label>
                <input
                    value={filter.comment ?? ''}
                    onChange={e => setFilter(f => ({ ...f, comment: e.target.value || undefined }))}
                    placeholder="Search by description…"
                />
              </div>

              <div className="form-group">
                <label>User</label>
                <select value={filter.userId ?? ''} onChange={e => setFilter(f => ({ ...f, userId: e.target.value || undefined }))}>
                  <option value="">All Users</option>
                  {users.map(u => (
                      <option key={u.id} value={u.id}>{u.firstName} {u.lastName}</option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ flex: '0 0 auto', minWidth: 'auto' }}>
                <label>Deleted</label>
                <label className="checkbox-label">
                  <input
                      type="checkbox"
                      checked={filter.includeDeleted ?? true}
                      onChange={e => setFilter(f => ({ ...f, includeDeleted: e.target.checked }))}
                  />
                  Include deleted
                </label>
              </div>

              <div className="form-group" style={{ flex: '0 0 auto', minWidth: 'auto' }}>
                <label style={{ visibility: 'hidden' }}>x</label>
                <button className="btn btn-secondary" onClick={() => setFilter({ includeDeleted: true })}>Reset</button>
              </div>
            </div>
          </div>

          <div className="card table-wrap">
            {loading ? (
                <div style={{ padding: 48, textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>Loading…</div>
            ) : items.length === 0 ? (
                <div className="empty-state">
                  <p>No items match your filters.</p>
                </div>
            ) : (
                <table>
                  <thead>
                  <tr>
                    <th style={{ width: 40 }}>#</th>
                    <th>Type</th>
                    <th>Description</th>
                    <th>Assigned To</th>
                    <th>Purchase Date</th>
                    <th>ID</th>
                    <th style={{ width: 80 }}></th>
                  </tr>
                  </thead>
                  <tbody>
                  {items.map((item, i) => (
                      <tr key={item.id} className={item.isDeleted ? 'deleted-row' : ''}>
                        <td className="text-muted mono" style={{ fontSize: 12 }}>{i + 1}</td>
                        <td>
                          <TypeBadge type={item.type} />
                          {item.isDeleted && <span className="deleted-badge">deleted</span>}
                        </td>
                        <td style={{ fontWeight: 450 }}>{item.comment}</td>
                        <td>
                          {item.userFullName
                              ? item.userFullName
                              : <span className="text-muted">Unassigned</span>}
                        </td>
                        <td className="mono text-muted" style={{ fontSize: 12 }}>
                          {new Date(item.purchaseDate).toLocaleDateString('lt-LT')}
                        </td>
                        <td className="mono text-muted" style={{ fontSize: 11 }}>
                          {item.id.split('-')[0]}
                        </td>
                        <td>
                          {!item.isDeleted && (
                              <div style={{ display: 'flex', gap: 4 }}>
                                <button className="btn btn-ghost btn-sm" onClick={() => setEditItem(item)}>Edit</button>
                                <button className="btn btn-ghost-danger btn-sm" onClick={() => handleDelete(item)}>Delete</button>
                              </div>
                          )}
                        </td>
                      </tr>
                  ))}
                  </tbody>
                </table>
            )}
          </div>
        </div>

        {showAddModal && <ItemModal users={users} onSave={handleCreate} onClose={() => setShowAddModal(false)} />}
        {editItem    && <ItemModal users={users} item={editItem} onSave={handleUpdate} onClose={() => setEditItem(null)} />}
        {showExport  && <ExportModal filter={exportFilter} onClose={() => setShowExport(false)} />}
      </div>
  );
}
