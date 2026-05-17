import { useState } from 'react';
import { exportInventory } from '../api/client';
import type { InventoryFilter, ExportRequest } from '../types';

interface Props {
  filter: InventoryFilter;
  onClose: () => void;
}

export function ExportModal({ filter, onClose }: Props) {
  const [template, setTemplate] = useState<'template1' | 'template2'>('template1');
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportInventory({ template, type: filter.type, comment: filter.comment, userId: filter.userId } as ExportRequest);
      onClose();
    } finally {
      setExporting(false);
    }
  };

  const templates = [
    {
      id: 'template1' as const,
      name: 'Corporate Table',
      desc: 'Landscape A4, tabular layout. Best for large lists.',
    },
    {
      id: 'template2' as const,
      name: 'Grouped Cards',
      desc: 'Portrait A4, items grouped by user. Best for per-person overview.',
    },
  ];

  return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal" onClick={e => e.stopPropagation()}>
          <div className="modal-title">Export to PDF</div>

          <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 16 }}>
            Includes only active items matching current filters.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {templates.map(t => (
                <label
                    key={t.id}
                    style={{
                      display: 'flex',
                      gap: 12,
                      padding: '12px 14px',
                      border: `1px solid ${template === t.id ? 'var(--accent)' : 'var(--border2)'}`,
                      borderRadius: 8,
                      cursor: 'pointer',
                      background: template === t.id ? 'var(--surface2)' : 'transparent',
                      transition: 'border-color .1s, background .1s',
                    }}
                >
                  <input
                      type="radio"
                      value={t.id}
                      checked={template === t.id}
                      onChange={() => setTemplate(t.id)}
                      style={{ width: 'auto', marginTop: 2, flexShrink: 0 }}
                  />
                  <div>
                    <div style={{ fontWeight: 500, fontSize: 13, marginBottom: 2 }}>{t.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>{t.desc}</div>
                  </div>
                </label>
            ))}
          </div>

          <div className="modal-actions">
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn btn-primary" onClick={handleExport} disabled={exporting}>
              {exporting ? 'Generating…' : 'Download PDF'}
            </button>
          </div>
        </div>
      </div>
  );
}
