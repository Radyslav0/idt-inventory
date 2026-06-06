import { ITEM_TYPE_LABELS } from '../constants/app';

interface TypeBadgeProps {
  type: string;
}

export function TypeBadge({ type }: TypeBadgeProps) {
  return (
    <span className={`badge badge-${type.toLowerCase()}`}>
      {ITEM_TYPE_LABELS[type] ?? type}
    </span>
  );
}
