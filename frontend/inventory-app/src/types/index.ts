export interface User {
  id: string;
  firstName: string;
  lastName: string;
}

export type ItemType = 'Tablet' | 'Phone' | 'SimCard' | 'Laptop';

export interface InventoryItem {
  id: string;
  type: string;
  comment: string;
  purchaseDate: string;
  isDeleted: boolean;
  userId: string | null;
  userFullName: string | null;
}

export interface CreateUserDto {
  firstName: string;
  lastName: string;
}

export interface CreateInventoryItemDto {
  type: string;
  comment: string;
  purchaseDate: string;
  userId: string | null;
}

export interface UpdateInventoryItemDto {
  type: string;
  comment: string;
  purchaseDate: string;
  userId: string | null;
}

export interface InventoryFilter {
  type?: string;
  comment?: string;
  userId?: string;
  includeDeleted?: boolean;
}

export interface ExportRequest {
  template: 'template1' | 'template2';
  type?: string;
  comment?: string;
  userId?: string;
}
