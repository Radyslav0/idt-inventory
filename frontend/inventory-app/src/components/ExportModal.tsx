import { useState } from 'react';
import { exportInventory } from '../api/client';
import { PDF_TEMPLATES } from '../constants/app';
import type { InventoryFilter, ExportRequest } from '../types';

interface ExportModalProps {
  filter: InventoryFilter;
  onClose: () => void;
}

export function ExportModal({ filter, onClose }: ExportModalProps) {
  const [template, setTemplate] = useState(PDF_TEMPLATES.template1);
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    setExporting(true);
    try {
      const request: ExportRequest = {
        template,
        type:    filter.type,
        comment: filter.comment,
        userId:  filter.userId,
      };
      await exportInventory(request);
      onClose();
    } finally {
      setExporting(false);
    }
  };

  const templates = [
    {
      value: PDF_TEMPLATES.template1,
      label: '📊 Template 1 — Corporate Table',
      description: 'Landscape A4, tabular layout with dark header, alternating rows. Best for large lists.',
    },
    {
      value: PDF_TEMPLATES.template2,
      label: '🗂️ Template 2 — Grouped Cards',
      description: 'Portrait A4, items grouped by user with color-coded cards. Best for per-person overview.',
    },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-title">📄 Export to PDF</div>

        <p style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 20 }}>
          Export includes only active items matching current filters.
        </p>

        <label style={{ display: 'block', marginBottom: 12 }}>Select Template</label>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {templates.map(t => (
            <label
              key={t.value}
              style={{
                display: 'flex', gap: 14, padding: '14px 16px',
                border: `2px solid ${template === t.value ? 'var(--accent)' : 'var(--border)'}`,
                borderRadius: 8, cursor: 'pointer',
                background: template === t.value ? 'rgba(245,158,11,0.06)' : 'transparent',
                transition: 'all 0.15s',
              }}
            >
              <input
                type="radio"
                value={t.value}
                checked={template === t.value}
                onChange={() => setTemplate(t.value)}
                style={{ width: 'auto' }}
              />
              <div>
                <div style={{ fontWeight: 600, marginBottom: 3 }}>{t.label}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>{t.description}</div>
              </div>
            </label>
          ))}
        </div>

        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={handleExport} disabled={exporting}>
            {exporting ? 'Generating...' : '⬇ Download PDF'}
          </button>
        </div>
      </div>
    </div>
  );
}
