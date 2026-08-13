/**
 * frontend-user/lib/api.ts
 * Central API client — all backend calls go through here.
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

  register: (name: string, email: string, password: string) =>
    apiFetch<{ token: string; user: any }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
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
  getBySlug: (slug: string) => apiFetch<{ data: any }>(`/products/slug/${slug}`),
};

// ─── ORDERS ──────────────────────────────────────────────────────
export const ordersApi = {
  getMyOrders: () => apiFetch<{ data: any[] }>('/orders/my'),
  createOrder: (payload: any) =>
    apiFetch<{ data: any }>('/orders', { method: 'POST', body: JSON.stringify(payload) }),
};

// ─── REVIEWS ────────────────────────────────────────────────────
export const reviewsApi = {
  getByProduct: (productId: string) =>
    apiFetch<{ data: any[] }>(`/reviews?productId=${productId}`),
  create: (payload: any) =>
    apiFetch<{ data: any }>('/reviews', { method: 'POST', body: JSON.stringify(payload) }),
};

// ─── CHAT ──────────────────────────────────────────────────
export const chatApi = {
  send: (messages: { role: 'user' | 'model'; content: string }[]) =>
    apiFetch<{ success: boolean; reply: string }>('/chat', {
      method: 'POST',
      body: JSON.stringify({ messages }),
    }),
};
