export const API_ENDPOINTS = {
  users: {
    base: '/users',
    byId: (id: string) => `/users/${id}`,
  },
  inventory: {
    base: '/inventory',
    byId: (id: string) => `/inventory/${id}`,
    export: '/inventory/export',
  },
} as const;
