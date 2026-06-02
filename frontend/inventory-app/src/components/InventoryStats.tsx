import { ITEM_TYPES } from '../constants/app';
import type { InventoryItem } from '../types';

interface InventoryStatsProps {
  items: InventoryItem[];
}

export function InventoryStats({ items }: InventoryStatsProps) {
  const activeCount = items.filter(i => !i.isDeleted).length;
  const deletedCount = items.filter(i => i.isDeleted).length;

  return (
    <div className="stats-row">
      <div className="stat-card">
        <div className="stat-label">Active Items</div>
        <div className="stat-value" style={{ color: 'var(--accent)' }}>{activeCount}</div>
      </div>
      <div className="stat-card">
        <div className="stat-label">Deleted</div>
        <div className="stat-value" style={{ color: 'var(--danger)' }}>{deletedCount}</div>
      </div>
      {ITEM_TYPES.map(type => (
        <div className="stat-card" key={type}>
          <div className="stat-label">
            {type === 'SimCard' ? 'SIM Cards' : `${type}s`}
          </div>
          <div className="stat-value" style={{ fontSize: 22 }}>
            {items.filter(i => i.type === type && !i.isDeleted).length}
          </div>
        </div>
      ))}
    </div>
  );
}
