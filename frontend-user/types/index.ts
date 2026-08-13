// ===== TYPE DEFINITIONS =====

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  images: string[];
  category: string | { id: string; name: string; slug: string };
  subcategory?: string;
  brand: string;
  rating: number;
  reviewCount: number;
  stock: number;
  sku: string;
  tags: string[];
  isFeatured?: boolean;
  isNew?: boolean;
  isBestSeller?: boolean;
  specifications?: Record<string, string>;
  createdAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'USER' | 'ADMIN';
  createdAt: string;
  address?: Address;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  paymentStatus: 'PAID' | 'UNPAID' | 'REFUNDED';
  paymentMethod: string;
  shippingAddress: Address;
  createdAt: string;
  updatedAt: string;
  trackingNumber?: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  productId: string;
  rating: number;
  title: string;
  body: string;
  helpful: number;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  productCount: number;
  gradient: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
