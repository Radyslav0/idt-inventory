import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchInventoryItems, fetchUsers, createInventoryItem, updateInventoryItem, softDeleteItem } from '../api/client';
import { QUERY_KEYS } from '../constants/app';
import { InventoryStats } from '../components/InventoryStats';
import { FilterBar } from '../components/FilterBar';
import { InventoryTable } from '../components/InventoryTable';
import { ItemModal } from '../components/ItemModal';
import { ExportModal } from '../components/ExportModal';
import type { InventoryItem, InventoryFilter, CreateInventoryItemDto, UpdateInventoryItemDto } from '../types';

const DEFAULT_FILTER: InventoryFilter = { includeDeleted: true };

export function InventoryPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<InventoryFilter>(DEFAULT_FILTER);
  const [editItem, setEditItem] = useState<InventoryItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  const { data: items = [], isLoading } = useQuery({
    queryKey: QUERY_KEYS.inventoryItems(filter),
    queryFn: () => fetchInventoryItems(filter),
  });

  const { data: users = [] } = useQuery({
    queryKey: QUERY_KEYS.users,
    queryFn: fetchUsers,
  });

  const invalidateInventory = () =>
    queryClient.invalidateQueries({ queryKey: ['inventory'] });

  const createMutation = useMutation({
    mutationFn: createInventoryItem,
    onSuccess: () => { invalidateInventory(); setShowAddModal(false); },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateInventoryItemDto }) =>
      updateInventoryItem(id, dto),
    onSuccess: () => { invalidateInventory(); setEditItem(null); },
  });

  const deleteMutation = useMutation({
    mutationFn: softDeleteItem,
    onSuccess: () => invalidateInventory(),
  });

  const handleCreate = (dto: CreateInventoryItemDto | UpdateInventoryItemDto) =>
    createMutation.mutateAsync(dto as CreateInventoryItemDto);

  const handleUpdate = (dto: CreateInventoryItemDto | UpdateInventoryItemDto) =>
    updateMutation.mutateAsync({ id: editItem!.id, dto: dto as UpdateInventoryItemDto });

  const handleDelete = (item: InventoryItem) => {
    if (!confirm(`Mark "${item.comment}" as deleted?`)) return;
    deleteMutation.mutate(item.id);
  };

  // Export uses current filters but never includes deleted
  const exportFilter: InventoryFilter = {
    type:    filter.type,
    comment: filter.comment,
    userId:  filter.userId,
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">Inventory</div>
          <div className="page-subtitle">All company assets</div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary" onClick={() => setShowExportModal(true)}>
            📄 Export PDF
          </button>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            + Add Item
          </button>
        </div>
      </div>

      <div className="page-body">
        <InventoryStats items={items} />

        <FilterBar
          filter={filter}
          users={users}
          onChange={setFilter}
          onReset={() => setFilter(DEFAULT_FILTER)}
        />

        <div className="card table-wrap">
          {isLoading ? (
            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--muted)' }}>
              Loading...
            </div>
          ) : (
            <InventoryTable
              items={items}
              onEdit={setEditItem}
              onDelete={handleDelete}
            />
          )}
        </div>
      </div>

      {showAddModal && (
        <ItemModal users={users} onSave={handleCreate} onClose={() => setShowAddModal(false)} />
      )}
      {editItem && (
        <ItemModal users={users} item={editItem} onSave={handleUpdate} onClose={() => setEditItem(null)} />
      )}
      {showExportModal && (
        <ExportModal filter={exportFilter} onClose={() => setShowExportModal(false)} />
      )}
    </div>
  );
}
