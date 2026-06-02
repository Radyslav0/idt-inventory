import { useState } from 'react';
import { ITEM_TYPES, ITEM_TYPE_LABELS } from '../constants/app';
import type { User, InventoryItem, CreateInventoryItemDto, UpdateInventoryItemDto } from '../types';

interface ItemModalProps {
  users: User[];
  item?: InventoryItem | null;
  onSave: (dto: CreateInventoryItemDto | UpdateInventoryItemDto) => Promise<void>;
  onClose: () => void;
}

const toDateInputValue = (iso: string) => iso.split('T')[0];
const todayInputValue = () => new Date().toISOString().split('T')[0];

export function ItemModal({ users, item, onSave, onClose }: ItemModalProps) {
  const [form, setForm] = useState({
    type:         item?.type         ?? 'Laptop',
    comment:      item?.comment      ?? '',
    purchaseDate: item ? toDateInputValue(item.purchaseDate) : todayInputValue(),
    userId:       item?.userId       ?? '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSave = async () => {
    if (!form.comment.trim()) return;
    setSubmitting(true);
    try {
      await onSave({
        type:         form.type,
        comment:      form.comment,
        purchaseDate: form.purchaseDate,
        userId:       form.userId || null,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-title">{item ? '✏️ Edit Item' : '➕ Add Item'}</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="form-group">
            <label>Type</label>
            <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
              {ITEM_TYPES.map(t => (
                <option key={t} value={t}>{ITEM_TYPE_LABELS[t]}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Comment / Description</label>
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
            <label>Assigned User (optional)</label>
            <select value={form.userId} onChange={e => setForm(f => ({ ...f, userId: e.target.value }))}>
              <option value="">— Unassigned —</option>
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
            onClick={handleSave}
            disabled={submitting || !form.comment.trim()}
          >
            {submitting ? 'Saving...' : item ? 'Save Changes' : 'Add Item'}
          </button>
        </div>
      </div>
    </div>
  );
}
