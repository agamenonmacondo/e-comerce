
export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number; // Prices will be in COP
  imageUrls: string[]; // Changed from images to imageUrls
  category: Category;
  stock: number;
  rating?: number; 
  reviewsCount?: number; 
  details?: Record<string, string>; 
  createdAt: Date; // Added
  updatedAt: Date; // Added
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
  name?: string;
  email: string;
  phone?: string; // Added phone to User type
  avatar?: string;
  addresses?: Address[];
}

export interface Address {
  id: string;
  street: string;
  city: string;
  state: string; // For Colombia, this would be "Departamento"
  zipCode: string;
  country: string;
  isDefault?: boolean;
}

export type OrderStatus = 'Pendiente' | 'Procesando' | 'Enviado' | 'Entregado' | 'Cancelado';


export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number; // Prices in COP
  status: OrderStatus;
  orderDate: string; // ISO string date
  shippingAddress: Address;
  trackingNumber?: string;
}
