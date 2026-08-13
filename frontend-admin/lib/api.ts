/**
 * frontend-admin/lib/api.ts
 * Central API client for the Admin panel — all backend calls go through here.
 * Base URL is read from NEXT_PUBLIC_API_URL (.env.local)
 */

const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

// ─── Cookie helpers (browser-only) ───────────────────────────────
function getToken(): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(/(?:^|;\s*)auth_token=([^;]+)/);
  return match ? decodeURIComponent(match[1]) : null;
}

// ─── Core fetch wrapper ───────────────────────────────────────────
async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(err.message || `Error ${res.status}`);
  }
  return res.json();
}

// ─── AUTH ────────────────────────────────────────────────────────
export const authApi = {
  login: (email: string, password: string) =>
    apiFetch<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  getMe: () => apiFetch<{ user: any }>('/auth/me'),
};

// ─── PRODUCTS ────────────────────────────────────────────────────
export const productsApi = {
  getAll: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiFetch<{ data: any[]; total: number }>(`/products${qs}`);
  },
  getById: (id: string) => apiFetch<{ data: any }>(`/products/${id}`),
  create: (payload: any) =>
    apiFetch<{ data: any }>('/products', { method: 'POST', body: JSON.stringify(payload) }),
  update: (id: string, payload: any) =>
    apiFetch<{ data: any }>(`/products/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  toggleVisibility: (id: string, isVisible: boolean) =>
    apiFetch<{ data: any }>(`/products/${id}/visibility`, { method: 'PATCH', body: JSON.stringify({ isVisible }) }),
  delete: (id: string) =>
    apiFetch<{ success: boolean }>(`/products/${id}`, { method: 'DELETE' }),
};

// ─── ORDERS ──────────────────────────────────────────────────────
export const ordersApi = {
  getAll: (params?: Record<string, string>) => {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return apiFetch<{ data: any[]; total: number }>(`/orders${qs}`);
  },
  updateStatus: (id: string, status: string) =>
    apiFetch<{ data: any }>(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    }),
};

// ─── USERS / CUSTOMERS ───────────────────────────────────────────
export const usersApi = {
  getAll: () => apiFetch<{ success: boolean; data: any[] }>('/admin/users'),
  updateRole: (id: string, role: 'USER' | 'ADMIN') =>
    apiFetch<{ success: boolean; data: any }>(`/admin/users/${id}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    }),
  setPassword: (id: string, password: string) =>
    apiFetch<{ success: boolean; message: string }>(`/admin/users/${id}/password`, {
      method: 'PATCH',
      body: JSON.stringify({ password }),
    }),
};

// ─── STATS / DASHBOARD ───────────────────────────────────────────
export const statsApi = {
  getDashboard: () => apiFetch<{
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    totalUsers: number;
    recentOrders: any[];
    topProducts: any[];
  }>('/admin/stats'),
};
