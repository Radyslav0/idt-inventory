import axios from 'axios';
import type {
  User, InventoryItem,
  CreateUserDto, CreateInventoryItemDto, UpdateInventoryItemDto,
  InventoryFilter, ExportRequest
} from '../types';

const api = axios.create({
  baseURL: 'http://localhost:5023/api',
});

// Users
export const getUsers = () =>
  api.get<User[]>('/users').then(r => r.data);

export const createUser = (dto: CreateUserDto) =>
  api.post<User>('/users', dto).then(r => r.data);

export const deleteUser = (id: string) =>
  api.delete(`/users/${id}`);

// Inventory
export const getInventoryItems = (filter: InventoryFilter = {}) =>
  api.get<InventoryItem[]>('/inventory', { params: filter }).then(r => r.data);

export const createInventoryItem = (dto: CreateInventoryItemDto) =>
  api.post<InventoryItem>('/inventory', dto).then(r => r.data);

export const updateInventoryItem = (id: string, dto: UpdateInventoryItemDto) =>
  api.put<InventoryItem>(`/inventory/${id}`, dto).then(r => r.data);

export const softDeleteItem = (id: string) =>
  api.delete(`/inventory/${id}`);

export const exportInventory = async (request: ExportRequest) => {
  const response = await api.post('/inventory/export', request, {
    responseType: 'blob',
  });
  const url = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `inventory-${request.template}-${Date.now()}.pdf`;
  link.click();
  URL.revokeObjectURL(url);
};
