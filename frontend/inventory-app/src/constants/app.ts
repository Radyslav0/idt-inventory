export const ITEM_TYPES = ['Laptop', 'Phone', 'SimCard', 'Tablet'] as const;
export type ItemTypeName = typeof ITEM_TYPES[number];

export const ITEM_TYPE_LABELS: Record<string, string> = {
  Laptop:  'Laptop',
  Phone:   'Phone',
  SimCard: 'SIM Card',
  Tablet:  'Tablet',
};

export const PDF_TEMPLATES = {
  template1: 'template1',
  template2: 'template2',
} as const;

export const QUERY_KEYS = {
  users: ['users'] as const,
  inventoryItems: (filter: object) => ['inventory', filter] as const,
};
