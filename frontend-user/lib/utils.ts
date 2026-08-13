import { Product, CartItem } from '@/types';

// ===== FORMATTING =====
export const formatPrice = (price: number): string =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);

export const formatDate = (dateString: string): string =>
  new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(dateString));

export const formatRelativeDate = (dateString: string): string => {
  const diff = Date.now() - new Date(dateString).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days} days ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
};

// ===== CART UTILS =====
export const calcCartTotal = (items: CartItem[]): number =>
  items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

export const calcCartCount = (items: CartItem[]): number =>
  items.reduce((sum, item) => sum + item.quantity, 0);

export const calcDiscount = (original: number, current: number): number =>
  Math.round(((original - current) / original) * 100);

// ===== PRODUCT UTILS =====
export const getStockLabel = (stock: number): { label: string; color: string } => {
  if (stock === 0) return { label: 'Out of Stock', color: 'error' };
  if (stock < 10) return { label: `Only ${stock} left`, color: 'warning' };
  return { label: 'In Stock', color: 'success' };
};

export const filterProducts = (
  products: Product[],
  { category, minPrice, maxPrice, search, sort }: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    sort?: string;
  }
): Product[] => {
  let filtered = [...products];

  if (category && category !== 'all') {
    filtered = filtered.filter(p =>
      p.category.toLowerCase().replace(/\s/g, '-') === category ||
      p.category === category
    );
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.tags.some(t => t.includes(q))
    );
  }

  if (minPrice !== undefined) filtered = filtered.filter(p => p.price >= minPrice);
  if (maxPrice !== undefined) filtered = filtered.filter(p => p.price <= maxPrice);

  switch (sort) {
    case 'price-asc': return filtered.sort((a, b) => a.price - b.price);
    case 'price-desc': return filtered.sort((a, b) => b.price - a.price);
    case 'rating': return filtered.sort((a, b) => b.rating - a.rating);
    case 'newest': return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    case 'popular': return filtered.sort((a, b) => b.reviewCount - a.reviewCount);
    default: return filtered;
  }
};

// ===== SLUG UTILS =====
export const slugify = (str: string): string =>
  str.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

// ===== LOCAL STORAGE =====
export const storage = {
  get: <T>(key: string): T | null => {
    if (typeof window === 'undefined') return null;
    try { return JSON.parse(localStorage.getItem(key) || 'null'); }
    catch { return null; }
  },
  set: <T>(key: string, value: T): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
  },
  remove: (key: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  },
};

// ===== API HELPERS (for backend integration) =====
export const apiUrl = (path: string) => `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/v1${path}`;

export const apiFetch = async <T>(
  path: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = storage.get<string>('auth_token');
  const res = await fetch(apiUrl(path), {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(err.message || 'Request failed');
  }
  return res.json();
};

// ===== GENERATE AVATAR INITIALS =====
export const getInitials = (name: string): string =>
  name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

// ===== ORDER STATUS CONFIG =====
export const ORDER_STATUS_CONFIG: Record<string, { label: string; color: string; icon: string }> = {
  PENDING: { label: 'Pending', color: 'warning', icon: '⏳' },
  PROCESSING: { label: 'Processing', color: 'accent', icon: '⚙️' },
  SHIPPED: { label: 'Shipped', color: 'primary', icon: '🚚' },
  DELIVERED: { label: 'Delivered', color: 'success', icon: '✅' },
  CANCELLED: { label: 'Cancelled', color: 'error', icon: '❌' },
};
