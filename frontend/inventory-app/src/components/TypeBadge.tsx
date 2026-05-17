export function TypeBadge({ type }: { type: string }) {
  return (
      <span className={`badge badge-${type.toLowerCase()}`}>
      {type === 'SimCard' ? 'SIM Card' : type}
    </span>
  );
}
