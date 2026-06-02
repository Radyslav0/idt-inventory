import axios from 'axios';
import { API_ENDPOINTS } from '../constants/endpoints';
import type {
  User, InventoryItem,
  CreateUserDto, CreateInventoryItemDto,
  UpdateInventoryItemDto, InventoryFilter, ExportRequest,
} from '../types';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// --- Users ---
export const fetchUsers = (): Promise<User[]> =>
  apiClient.get<User[]>(API_ENDPOINTS.users.base).then(r => r.data);

export const createUser = (dto: CreateUserDto): Promise<User> =>
  apiClient.post<User>(API_ENDPOINTS.users.base, dto).then(r => r.data);

export const deleteUser = (id: string): Promise<void> =>
  apiClient.delete(API_ENDPOINTS.users.byId(id)).then(() => undefined);

// --- Inventory ---
export const fetchInventoryItems = (filter: InventoryFilter = {}): Promise<InventoryItem[]> =>
  apiClient.get<InventoryItem[]>(API_ENDPOINTS.inventory.base, { params: filter }).then(r => r.data);

export const createInventoryItem = (dto: CreateInventoryItemDto): Promise<InventoryItem> =>
  apiClient.post<InventoryItem>(API_ENDPOINTS.inventory.base, dto).then(r => r.data);

export const updateInventoryItem = (id: string, dto: UpdateInventoryItemDto): Promise<InventoryItem> =>
  apiClient.put<InventoryItem>(API_ENDPOINTS.inventory.byId(id), dto).then(r => r.data);

export const softDeleteItem = (id: string): Promise<void> =>
  apiClient.delete(API_ENDPOINTS.inventory.byId(id)).then(() => undefined);

export const exportInventory = async (request: ExportRequest): Promise<void> => {
  const response = await apiClient.post(API_ENDPOINTS.inventory.export, request, {
    responseType: 'blob',
  });
  const url = URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = `inventory-${request.template}-${Date.now()}.pdf`;
  link.click();
  URL.revokeObjectURL(url);
};
