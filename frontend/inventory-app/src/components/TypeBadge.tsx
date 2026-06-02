import { ITEM_TYPE_LABELS } from '../constants/app';

const TYPE_ICONS: Record<string, string> = {
  Laptop:  '💻',
  Phone:   '📱',
  SimCard: '📡',
  Tablet:  '🖥️',
};

interface TypeBadgeProps {
  type: string;
}

export function TypeBadge({ type }: TypeBadgeProps) {
  return (
    <span className={`badge badge-${type.toLowerCase()}`}>
      {TYPE_ICONS[type] ?? '📦'} {ITEM_TYPE_LABELS[type] ?? type}
    </span>
  );
}
