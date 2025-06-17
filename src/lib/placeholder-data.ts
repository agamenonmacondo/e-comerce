
import type { Product, Category, Order, User } from '@/types';

export const categories: Category[] = [
  { id: '1', name: 'iPhones', slug: 'iphones' },
  { id: '2', name: 'Otros Celulares', slug: 'otros-celulares' },
  { id: '3', name: 'Accesorios', slug: 'accesorios' },
  { id: '4', name: 'iPads', slug: 'ipads' },
  { id: '5', name: 'MacBooks', slug: 'macbooks' },
  { id: '6', name: 'Apple Watch', slug: 'apple-watch' },
];

const now = new Date();

// Prices in COP (Colombian Pesos)
export const products: Product[] = [
  // iPhones
  {
    id: 'iphone-16-pro-max-256-es',
    name: 'iPhone 16 Pro Max 256GB ES',
    description: 'El último iPhone con la tecnología más avanzada. Colores disponibles: ES (Naranja), Negro, Blanco, Plata.',
    price: 4000000,
    imageUrls: [
      '/apple-iphone-16-pro-max-desert-titanium-1.png',
      'https://placehold.co/600x400.png',
    ],
    category: categories.find(c => c.slug === 'iphones')!,
    stock: 25,
    rating: 4.9,
    reviewsCount: 150,
    details: { Almacenamiento: '256GB', Variante: 'ES (Naranja)', OtrosColores: 'Negro, Blanco, Plata' },
    createdAt: now,
    updatedAt: now,
  },
  // iPads
  {
    id: 'ipad-11-a16-256gb-pink',
    name: 'iPad 11 A16 256GB',
    description: 'Potente iPad 11 con chip A16 y 256GB de almacenamiento.',
    price: 1950000,
    imageUrls: ['https://placehold.co/600x600.png'],
    category: categories.find(c => c.slug === 'ipads')!,
    stock: 30,
    rating: 4.8,
    reviewsCount: 90,
    details: { Chip: 'A16', Almacenamiento: '256GB', Color: 'Pink' },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'ipad-air-11-m3-128gb-multi',
    name: 'iPad Air 11" M3 128GB',
    description: 'Versátil iPad Air de 11 pulgadas con el potente chip M3.',
    price: 2450000,
    imageUrls: ['https://placehold.co/600x600.png'],
    category: categories.find(c => c.slug === 'ipads')!,
    stock: 20,
    rating: 4.7,
    reviewsCount: 75,
    details: { Pantalla: '11 pulgadas', Chip: 'M3', Almacenamiento: '128GB', Colores: 'Starlight, Space Gray, Blue' },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'ipad-air-13-m3-128gb-multi',
    name: 'iPad Air 13" M3 128GB',
    description: 'iPad Air más grande de 13 pulgadas con chip M3 y 128GB.',
    price: 3220000,
    imageUrls: ['https://placehold.co/600x600.png'],
    category: categories.find(c => c.slug === 'ipads')!,
    stock: 15,
    rating: 4.8,
    reviewsCount: 60,
    details: { Pantalla: '13 pulgadas', Chip: 'M3', Almacenamiento: '128GB', Colores: 'Purple, Space Gray' },
    createdAt: now,
    updatedAt: now,
  },
  // MacBooks
  {
    id: 'macbook-air-13-m1-8-256-multi',
    name: 'MacBook Air 13" M1 8/256',
    description: 'MacBook Air ligero y potente con chip M1, 8GB RAM y 256GB SSD.',
    price: 2850000,
    imageUrls: ['https://placehold.co/600x400.png'],
    category: categories.find(c => c.slug === 'macbooks')!,
    stock: 20,
    rating: 4.9,
    reviewsCount: 110,
    details: { Chip: 'M1', RAM: '8GB', Almacenamiento: '256GB SSD', Colores: 'Silver, Gold, Space Gray' },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'macbook-air-13-m4-16-256-skyblue',
    name: 'MacBook Air 13" M4 16/256',
    description: 'El nuevo MacBook Air con el revolucionario chip M4, 16GB RAM y 256GB SSD.',
    price: 4200000,
    imageUrls: ['https://placehold.co/600x400.png'],
    category: categories.find(c => c.slug === 'macbooks')!,
    stock: 18,
    rating: 5.0,
    reviewsCount: 45,
    details: { Chip: 'M4', RAM: '16GB', Almacenamiento: '256GB SSD', Color: 'Sky Blue' },
    createdAt: now,
    updatedAt: now,
  },
  // Accesorios
  {
    id: 'airpods-4-gen-sencillo',
    name: 'AirPods 4 Gen Sencillo',
    description: 'La nueva generación de AirPods con sonido mejorado.',
    price: 530000,
    imageUrls: ['https://placehold.co/600x600.png'],
    category: categories.find(c => c.slug === 'accesorios')!,
    stock: 50,
    rating: 4.6,
    reviewsCount: 120,
    details: { Generación: '4ta', Tipo: 'Sencillo' },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'airpods-pro-2-gen-usbc',
    name: 'AirPods Pro 2 Gen USB C',
    description: 'AirPods Pro con cancelación de ruido y estuche de carga USB-C.',
    price: 850000,
    imageUrls: ['https://placehold.co/600x600.png'],
    category: categories.find(c => c.slug === 'accesorios')!,
    stock: 40,
    rating: 4.8,
    reviewsCount: 180,
    details: { Generación: '2da Pro', ConexiónEstuche: 'USB-C', Característica: 'Cancelación Activa de Ruido' },
    createdAt: now,
    updatedAt: now,
  },
  // Apple Watch
  {
    id: 'apple-watch-ultra-2-ti-white',
    name: 'Apple Watch Ultra 2',
    description: 'El Apple Watch más robusto y capaz. Caja de titanio.',
    price: 2900000,
    imageUrls: ['https://placehold.co/600x600.png'],
    category: categories.find(c => c.slug === 'apple-watch')!,
    stock: 15,
    rating: 4.9,
    reviewsCount: 95,
    details: { MaterialCaja: 'Titanio', CorreaColor: 'Blanco/Claro (o similar)' },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'apple-watch-ultra-2-ti-black',
    name: 'Apple Watch Ultra 2',
    description: 'El Apple Watch más robusto y capaz. Caja de titanio con correa oscura.',
    price: 3100000,
    imageUrls: ['https://placehold.co/600x600.png'],
    category: categories.find(c => c.slug === 'apple-watch')!,
    stock: 12,
    rating: 4.9,
    reviewsCount: 80,
    details: { MaterialCaja: 'Titanio', CorreaColor: 'Negro/Oscuro (o similar)' },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'apple-watch-series-10-42mm-multi',
    name: 'Apple Watch Series 10 42mm',
    description: 'El compañero perfecto para una vida saludable. Varios colores disponibles.',
    price: 1400000,
    imageUrls: ['https://placehold.co/600x600.png'],
    category: categories.find(c => c.slug === 'apple-watch')!,
    stock: 25,
    rating: 4.7,
    reviewsCount: 70,
    details: { TamañoCaja: '42mm', ColoresSugeridos: 'Rosado, Negro, Blanco' },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'apple-watch-series-10-46mm-multi',
    name: 'Apple Watch Series 10 46mm',
    description: 'Pantalla más grande para una mejor experiencia. Varios colores disponibles.',
    price: 1590000,
    imageUrls: ['https://placehold.co/600x600.png'],
    category: categories.find(c => c.slug === 'apple-watch')!,
    stock: 22,
    rating: 4.7,
    reviewsCount: 65,
    details: { TamañoCaja: '46mm', ColoresSugeridos: 'Negro, Blanco' },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'apple-watch-se-gen2-40mm-multi',
    name: 'Apple Watch SE (2nd Gen) 40mm',
    description: 'Características esenciales de Apple Watch a un precio más accesible.',
    price: 870000,
    imageUrls: ['https://placehold.co/600x600.png'],
    category: categories.find(c => c.slug === 'apple-watch')!,
    stock: 30,
    rating: 4.6,
    reviewsCount: 100,
    details: { TamañoCaja: '40mm', ColoresSugeridos: 'Naranja (o similar), Blanco' },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'apple-watch-se-gen2-44mm-black',
    name: 'Apple Watch SE (2nd Gen) 44mm',
    description: 'Apple Watch SE con caja más grande de 44mm.',
    price: 970000, // Assumed price
    imageUrls: ['https://placehold.co/600x600.png'],
    category: categories.find(c => c.slug === 'apple-watch')!,
    stock: 28,
    rating: 4.6,
    reviewsCount: 90,
    details: { TamañoCaja: '44mm', ColorSugerido: 'Medianoche (o similar)' },
    createdAt: now,
    updatedAt: now,
  },
];

export const mockUser: User = {
  id: 'user123',
  name: 'Ana Pérez',
  email: 'ana.perez@example.com',
  phone: '3001234567',
  avatar: 'https://placehold.co/100x100.png',
  addresses: [
    { id: 'addr1', street: 'Carrera 7 # 70-30', city: 'Bogotá D.C.', state: 'Cundinamarca', zipCode: '110231', country: 'Colombia', isDefault: true },
  ],
};

export const mockOrders: Order[] = [
  // Orders are cleared or should be updated to use new product IDs.
  // For simplicity, items array is empty.
  {
    id: 'order001',
    userId: 'user123',
    items: [], // Example: [{ ...products.find(p => p.id === 'iphone-16-pro-max-256-es')!, quantity: 1 }],
    totalAmount: 0, // Example: products.find(p => p.id === 'iphone-16-pro-max-256-es')!.price,
    status: 'Entregado',
    orderDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    shippingAddress: mockUser.addresses![0],
    trackingNumber: 'CO999AA10123456789',
  },
];

export function getProductById(id: string): Product | undefined {
  const product = products.find(p => p.id === id);
  return product;
}

export function getProductsByCategory(categorySlug: string): Product[] {
  const category = categories.find(c => c.slug === categorySlug);
  if (!category) return [];
  return products.filter(p => p.category.id === category.id);
}

    