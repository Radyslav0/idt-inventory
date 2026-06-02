import { ITEM_TYPES, ITEM_TYPE_LABELS } from '../constants/app';
import type { InventoryFilter, User } from '../types';

interface FilterBarProps {
  filter: InventoryFilter;
  users: User[];
  onChange: (filter: InventoryFilter) => void;
  onReset: () => void;
}

export function FilterBar({ filter, users, onChange, onReset }: FilterBarProps) {
  return (
    <div className="filter-bar">
      <div className="form-row">
        <div className="form-group">
          <label>Type</label>
          <select
            value={filter.type ?? ''}
            onChange={e => onChange({ ...filter, type: e.target.value || undefined })}
          >
            <option value="">All Types</option>
            {ITEM_TYPES.map(t => (
              <option key={t} value={t}>{ITEM_TYPE_LABELS[t]}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Comment</label>
          <input
            value={filter.comment ?? ''}
            onChange={e => onChange({ ...filter, comment: e.target.value || undefined })}
            placeholder="Search comment..."
          />
        </div>

        <div className="form-group">
          <label>User</label>
          <select
            value={filter.userId ?? ''}
            onChange={e => onChange({ ...filter, userId: e.target.value || undefined })}
          >
            <option value="">All Users</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>
                {u.firstName} {u.lastName}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group" style={{ flex: '0 0 auto', minWidth: 'auto' }}>
          <label>Deleted</label>
          <label style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '8px 12px', border: '1px solid var(--border)',
            borderRadius: 6, cursor: 'pointer',
            textTransform: 'none', letterSpacing: 0, fontSize: 13,
          }}>
            <input
              type="checkbox"
              checked={filter.includeDeleted ?? true}
              onChange={e => onChange({ ...filter, includeDeleted: e.target.checked })}
              style={{ width: 'auto' }}
            />
            Show deleted
          </label>
        </div>

        <div className="form-group" style={{ flex: '0 0 auto', minWidth: 'auto' }}>
          <label>&nbsp;</label>
          <button className="btn btn-secondary" onClick={onReset}>↺ Reset</button>
        </div>
      </div>
    </div>
  );
}
