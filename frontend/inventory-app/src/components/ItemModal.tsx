import { useState } from 'react';
import type { User, CreateInventoryItemDto, UpdateInventoryItemDto, InventoryItem } from '../types';

const ITEM_TYPES = ['Laptop', 'Phone', 'SimCard', 'Tablet'];

interface Props {
  users: User[];
  item?: InventoryItem | null;
  onSave: (dto: CreateInventoryItemDto | UpdateInventoryItemDto) => Promise<void>;
  onClose: () => void;
}

export function ItemModal({ users, item, onSave, onClose }: Props) {
  const [form, setForm] = useState({
    type: item?.type ?? 'Laptop',
    comment: item?.comment ?? '',
    purchaseDate: item ? item.purchaseDate.split('T')[0] : new Date().toISOString().split('T')[0],
    userId: item?.userId ?? '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!form.comment.trim()) return;
    setSubmitting(true);
    try {
      await onSave({
        type: form.type,
        comment: form.comment,
        purchaseDate: form.purchaseDate,
        userId: form.userId || null,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <div className="modal-title">{item ? 'Edit Item' : 'Add Item'}</div>

          <div className="modal-body">
            <div className="form-group">
              <label>Type</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                {ITEM_TYPES.map(t => (
                    <option key={t} value={t}>{t === 'SimCard' ? 'SIM Card' : t}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Description</label>
              <input
                  value={form.comment}
                  onChange={e => setForm(f => ({ ...f, comment: e.target.value }))}
                  placeholder="e.g. Dell XPS 15, 2023"
                  autoFocus
              />
            </div>

            <div className="form-group">
              <label>Purchase Date</label>
              <input
                  type="date"
                  value={form.purchaseDate}
                  onChange={e => setForm(f => ({ ...f, purchaseDate: e.target.value }))}
              />
            </div>

            <div className="form-group">
              <label>Assigned User</label>
              <select value={form.userId} onChange={e => setForm(f => ({ ...f, userId: e.target.value }))}>
                <option value="">Unassigned</option>
                {users.map(u => (
                    <option key={u.id} value={u.id}>{u.firstName} {u.lastName}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="modal-actions">
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={submitting || !form.comment.trim()}
            >
              {submitting ? 'Saving…' : item ? 'Save Changes' : 'Add Item'}
            </button>
          </div>
        </div>
      </div>
  );
}
