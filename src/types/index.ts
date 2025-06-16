
export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: Category;
  stock: number;
  rating?: number; // Optional, average rating
  reviewsCount?: number; // Optional
  details?: Record<string, string>; // e.g. {"Storage": "256GB", "Color": "Blue"}
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
  name?: string;
  email: string;
  avatar?: string;
  addresses?: Address[];
}

export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  orderDate: string; // ISO string date
  shippingAddress: Address;
  trackingNumber?: string;
}
