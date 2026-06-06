import { TypeBadge } from './TypeBadge';
import type { InventoryItem } from '../types';

interface InventoryTableProps {
  items: InventoryItem[];
  onEdit: (item: InventoryItem) => void;
  onDelete: (item: InventoryItem) => void;
}

export function InventoryTable({ items, onEdit, onDelete }: InventoryTableProps) {
  if (items.length === 0) {
    return (
      <div className="empty-state">
        <p>No items match your filters.</p>
      </div>
    );
  }

  return (
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Type</th>
          <th>Comment</th>
          <th>Assigned To</th>
          <th>Purchase Date</th>
          <th>ID</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, i) => (
          <tr key={item.id} className={item.isDeleted ? 'deleted-row' : ''}>
            <td className="text-muted text-mono">{i + 1}</td>
            <td>
              <TypeBadge type={item.type} />
              {item.isDeleted && <span className="badge-deleted">deleted</span>}
            </td>
            <td>{item.comment}</td>
            <td>
              {item.userFullName
                ? <span style={{ fontWeight: 500 }}>{item.userFullName}</span>
                : <span className="text-muted">Unassigned</span>}
            </td>
            <td className="text-mono" style={{ fontSize: 12 }}>
              {new Date(item.purchaseDate).toLocaleDateString('lt-LT')}
            </td>
            <td className="text-mono" style={{ fontSize: 10, color: 'var(--muted)' }}>
              {item.id.split('-')[0]}...
            </td>
            <td>
              {!item.isDeleted && (
                <div className="flex gap-2">
                  <button className="btn btn-secondary btn-sm" onClick={() => onEdit(item)}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => onDelete(item)}>Delete</button>
                </div>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
