
import type { Product, Category, Order, User } from '@/types';

// Updated categories based on the full product list
export const iphoneCategory: Category = { id: '1', name: 'iPhones', slug: 'iphones' };
export const macbookCategory: Category = { id: '5', name: 'MacBooks', slug: 'macbooks' };
export const accesoriosCategory: Category = { id: '3', name: 'Accesorios', slug: 'accesorios' };
export const appleWatchCategory: Category = { id: '6', name: 'Apple Watch', slug: 'apple-watch' };

export const categories: Category[] = [
  iphoneCategory,
  macbookCategory,
  accesoriosCategory,
  appleWatchCategory,
];

const now = new Date();

export const products: Product[] = [
  {
    id: 'iphone-16-pro-max-256-es',
    name: 'iPhone 16 Pro Max 256GB ES (Nuevo)',
    description: 'Experimenta el pináculo de la innovación con el iPhone 16 Pro Max. Con Dynamic Island, pantalla ProMotion siempre activa, el potente chip A18 Pro y un revolucionario sistema de cámaras Pro Fusion.',
    price: 4450000,
    imageUrls: ['https://firebasestorage.googleapis.com/v0/b/icommerce-ya7tu.appspot.com/o/product_images%2Fiphone_16_pro_max_natural_titanium.png?alt=media&token=19e3c54d-2e11-464a-a92c-4b715a3a7b6b', 'https://firebasestorage.googleapis.com/v0/b/icommerce-ya7tu.appspot.com/o/product_images%2Fiphone_16_pro_max_side.png?alt=media&token=c1a2f647-7503-45da-9c59-251a82f3b9c7'],
    category: iphoneCategory,
    stock: 20,
    rating: 4.9,
    reviewsCount: 150,
    details: {
      Pantalla: 'Super Retina XDR OLED 6,9", ProMotion 120Hz',
      Chip: 'A18 Pro con Neural Engine de 16 núcleos',
      'Camara Principal': 'Pro Fusion 48MP + Ultra Gran Angular 48MP + Teleobjetivo 5x 12MP',
      Condición: 'Nuevo',
    },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'iphone-13-128gb-nuevo-list',
    name: 'iPhone 13 128GB (Nuevo)',
    description: 'Un excelente iPhone 13 con 128GB de almacenamiento. Condición: Nuevo.',
    price: 2030000,
    imageUrls: ['https://firebasestorage.googleapis.com/v0/b/icommerce-ya7tu.appspot.com/o/product_images%2Fiphone_13_blue.png?alt=media&token=42d17482-1698-4665-9852-5a41552a926f'],
    category: iphoneCategory, stock: 15, rating: 4.5, reviewsCount: 80,
    details: { Condición: 'Nuevo', Almacenamiento: '128GB' }, createdAt: now, updatedAt: now,
  },
  {
    id: 'iphone-14-128gb-nuevo-list',
    name: 'iPhone 14 128GB (Nuevo)',
    description: 'Un excelente iPhone 14 con 128GB de almacenamiento. Condición: Nuevo.',
    price: 2400000,
    imageUrls: ['https://firebasestorage.googleapis.com/v0/b/icommerce-ya7tu.appspot.com/o/product_images%2Fiphone_14_purple.png?alt=media&token=2d1a3c7e-0b1e-4f3b-8c4d-6e5b9f7a4a9c'],
    category: iphoneCategory, stock: 18, rating: 4.6, reviewsCount: 90,
    details: { Condición: 'Nuevo', Almacenamiento: '128GB' }, createdAt: now, updatedAt: now,
  },
  {
    id: 'iphone-15-128gb-sf-nuevo-list',
    name: 'iPhone 15 128GB SF (Nuevo)',
    description: 'Un excelente iPhone 15 con 128GB de almacenamiento, sellado de fábrica. Condición: Nuevo.',
    price: 2790000,
    imageUrls: ['https://firebasestorage.googleapis.com/v0/b/icommerce-ya7tu.appspot.com/o/product_images%2Fiphone_15_pink.png?alt=media&token=8d2c2d4a-9b5f-4d4e-8f5b-6a5b8e9d3b1a'],
    category: iphoneCategory, stock: 20, rating: 4.7, reviewsCount: 100,
    details: { Condición: 'Nuevo', Almacenamiento: '128GB', Variante: 'SF (Sellado Fábrica)' }, createdAt: now, updatedAt: now,
  },
  {
    id: 'iphone-15-256gb-sf-nuevo-list',
    name: 'iPhone 15 256GB SF (Nuevo)',
    description: 'Un excelente iPhone 15 con 256GB de almacenamiento, sellado de fábrica. Condición: Nuevo.',
    price: 3300000,
    imageUrls: ['https://firebasestorage.googleapis.com/v0/b/icommerce-ya7tu.appspot.com/o/product_images%2Fiphone_15_black.png?alt=media&token=2f9b8c3a-8b1e-4c3e-8a1a-3e2c1b4a5d6e'],
    category: iphoneCategory, stock: 22, rating: 4.7, reviewsCount: 110,
    details: { Condición: 'Nuevo', Almacenamiento: '256GB', Variante: 'SF (Sellado Fábrica)' }, createdAt: now, updatedAt: now,
  },
  {
    id: 'iphone-16-128gb-sf-nuevo-list',
    name: 'iPhone 16 128GB SF (Nuevo)',
    description: 'El nuevo iPhone 16 con 128GB de almacenamiento, sellado de fábrica. Condición: Nuevo.',
    price: 3125000,
    imageUrls: ['https://firebasestorage.googleapis.com/v0/b/icommerce-ya7tu.appspot.com/o/product_images%2Fiphone_16_green.png?alt=media&token=5b1a9c3d-6b1e-4d5e-8b4d-9e1b5a8c2d1b'],
    category: iphoneCategory, stock: 25, rating: 4.8, reviewsCount: 70,
    details: { Condición: 'Nuevo', Almacenamiento: '128GB', Variante: 'SF (Sellado Fábrica)' }, createdAt: now, updatedAt: now,
  },
  {
    id: 'iphone-16-256gb-nuevo-list',
    name: 'iPhone 16 256GB (Nuevo)',
    description: 'El nuevo iPhone 16 con 256GB de almacenamiento. Condición: Nuevo.',
    price: 3600000,
    imageUrls: ['https://firebasestorage.googleapis.com/v0/b/icommerce-ya7tu.appspot.com/o/product_images%2Fiphone_16_pink.png?alt=media&token=c2d5e8b4-9a1d-4b5c-8b3d-7e1a3b5c6d8e'],
    category: iphoneCategory, stock: 19, rating: 4.8, reviewsCount: 65,
    details: { Condición: 'Nuevo', Almacenamiento: '256GB' }, createdAt: now, updatedAt: now,
  },
  {
    id: 'iphone-16pro-128gb-es-nuevo-list',
    name: 'iPhone 16 Pro 128GB ES (Nuevo)',
    description: 'El potente iPhone 16 Pro con 128GB de almacenamiento, variante ES. Condición: Nuevo.',
    price: 3820000,
    imageUrls: ['https://firebasestorage.googleapis.com/v0/b/icommerce-ya7tu.appspot.com/o/product_images%2Fiphone_16_pro_white_titanium.png?alt=media&token=a3c5b8d4-8e1c-4f5b-9d4e-2c1b4a5d6e7f'],
    category: iphoneCategory, stock: 15, rating: 4.9, reviewsCount: 85,
    details: { Condición: 'Nuevo', Almacenamiento: '128GB', Variante: 'ES' }, createdAt: now, updatedAt: now,
  },
  {
    id: 'iphone-16-pro-max-256-sf-nuevo-list', 
    name: 'iPhone 16 Pro Max 256GB SF (Nuevo)',
    description: 'El impresionante iPhone 16 Pro Max con 256GB, sellado de fábrica. Condición: Nuevo.',
    price: 4990000,
    imageUrls: ['https://firebasestorage.googleapis.com/v0/b/icommerce-ya7tu.appspot.com/o/product_images%2Fiphone_16_pro_max_blue_titanium.png?alt=media&token=7e1a3b5c-6d8e-4b5c-8b3d-9a1d4b5c6d8e'],
    category: iphoneCategory, stock: 12, rating: 4.9, reviewsCount: 95,
    details: { Condición: 'Nuevo', Almacenamiento: '256GB', Variante: 'SF (Sellado Fábrica)' }, createdAt: now, updatedAt: now,
  },
  {
    id: 'iphone-13-128gb-usado-list',
    name: 'iPhone 13 128GB (Usado)',
    description: 'iPhone 13 con 128GB de almacenamiento. Condición: Usado, Garantía 3 meses.',
    price: 1260000,
    imageUrls: ['https://firebasestorage.googleapis.com/v0/b/icommerce-ya7tu.appspot.com/o/product_images%2Fiphone_13_starlight.png?alt=media&token=d5e8b4a9-1d4b-4c5c-8b3d-7e1a3b5c6d8e'],
    category: iphoneCategory, stock: 8, rating: 4.2, reviewsCount: 50,
    details: { Condición: 'Usado', Almacenamiento: '128GB', Garantía: '3 meses' }, createdAt: now, updatedAt: now,
  },
  {
    id: 'iphone-13promax-128gb-usado-list',
    name: 'iPhone 13 Pro Max 128GB (Usado)',
    description: 'iPhone 13 Pro Max con 128GB de almacenamiento. Condición: Usado, Garantía 3 meses.',
    price: 1990000,
    imageUrls: ['https://firebasestorage.googleapis.com/v0/b/icommerce-ya7tu.appspot.com/o/product_images%2Fiphone_13_pro_max_graphite.png?alt=media&token=b3d7e1a3-b5c6-4d8e-8b3d-9a1d4b5c6d8e'],
    category: iphoneCategory, stock: 5, rating: 4.4, reviewsCount: 60,
    details: { Condición: 'Usado', Almacenamiento: '128GB', Garantía: '3 meses' }, createdAt: now, updatedAt: now,
  },
  {
    id: 'iphone-15plus-128gb-usado-list',
    name: 'iPhone 15 Plus 128GB (Usado)',
    description: 'iPhone 15 Plus con 128GB de almacenamiento. Condición: Usado, Garantía 3 meses.',
    price: 2550000,
    imageUrls: ['https://firebasestorage.googleapis.com/v0/b/icommerce-ya7tu.appspot.com/o/product_images%2Fiphone_15_plus_green.png?alt=media&token=8e1c4f5b-9d4e-4c5c-8b3d-2c1b4a5d6e7f'],
    category: iphoneCategory, stock: 7, rating: 4.5, reviewsCount: 40,
    details: { Condición: 'Usado', Almacenamiento: '128GB', Garantía: '3 meses' }, createdAt: now, updatedAt: now,
  },
  {
    id: 'iphone-15pro-256gb-usado-list',
    name: 'iPhone 15 Pro 256GB (Usado)',
    description: 'iPhone 15 Pro con 256GB de almacenamiento. Condición: Usado, Garantía 3 meses.',
    price: 2800000,
    imageUrls: ['https://firebasestorage.googleapis.com/v0/b/icommerce-ya7tu.appspot.com/o/product_images%2Fiphone_15_pro_natural_titanium.png?alt=media&token=a5d6e7f8-9a1d-4b5c-8b3d-7e1a3b5c6d8e'],
    category: iphoneCategory, stock: 6, rating: 4.6, reviewsCount: 55,
    details: { Condición: 'Usado', Almacenamiento: '256GB', Garantía: '3 meses' }, createdAt: now, updatedAt: now,
  },
  {
    id: 'iphone-15promax-256gb-es-usado-list',
    name: 'iPhone 15 Pro Max 256GB ES (Usado)',
    description: 'iPhone 15 Pro Max con 256GB, variante ES. Condición: Usado, Garantía 3 meses.',
    price: 3340000,
    imageUrls: ['https://firebasestorage.googleapis.com/v0/b/icommerce-ya7tu.appspot.com/o/product_images%2Fiphone_15_pro_max_blue_titanium.png?alt=media&token=6d8e4b5c-8b3d-4c5c-9a1d-4b5c6d8e7f1a'],
    category: iphoneCategory, stock: 4, rating: 4.6, reviewsCount: 45,
    details: { Condición: 'Usado', Almacenamiento: '256GB', Variante: 'ES', Garantía: '3 meses' }, createdAt: now, updatedAt: now,
  },
  {
    id: 'iphone-16-128gb-es-premium-list',
    name: 'iPhone 16 128GB ES (Premium)',
    description: 'iPhone 16 con 128GB, variante ES. Condición: Premium, Garantía 6 meses.',
    price: 2800000,
    imageUrls: ['https://firebasestorage.googleapis.com/v0/b/icommerce-ya7tu.appspot.com/o/product_images%2Fiphone_16_yellow.png?alt=media&token=9d4e2c1b-4a5d-4c5c-8b3d-7e1a3b5c6d8e'],
    category: iphoneCategory, stock: 10, rating: 4.7, reviewsCount: 30,
    details: { Condición: 'Premium', Almacenamiento: '128GB', Variante: 'ES', Garantía: '6 meses' }, createdAt: now, updatedAt: now,
  },
  {
    id: 'macbook-air-m2-256gb',
    name: 'MacBook Air M2 256GB',
    description: 'Ultraligero y potente MacBook Air con chip M2. Almacenamiento de 256GB.',
    price: 3800000,
    imageUrls: ['https://firebasestorage.googleapis.com/v0/b/icommerce-ya7tu.appspot.com/o/product_images%2Fmacbook_air_m2_starlight.png?alt=media&token=4b5c6d8e-7f1a-4b5c-8b3d-9a1d4b5c6d8e'],
    category: macbookCategory,
    stock: 10,
    rating: 4.8,
    reviewsCount: 120,
    details: { Chip: 'M2', Almacenamiento: '256GB', Condición: 'Nuevo' },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'macbook-pro-m3-512gb',
    name: 'MacBook Pro M3 512GB',
    description: 'MacBook Pro de alto rendimiento con el nuevo chip M3. Almacenamiento de 512GB.',
    price: 6200000,
    imageUrls: ['https://firebasestorage.googleapis.com/v0/b/icommerce-ya7tu.appspot.com/o/product_images%2Fmacbook_pro_m3_space_black.png?alt=media&token=1d4b5c6d-8e7f-4b5c-8b3d-9a1d4b5c6d8e'],
    category: macbookCategory,
    stock: 8,
    rating: 4.9,
    reviewsCount: 95,
    details: { Chip: 'M3', Almacenamiento: '512GB', Condición: 'Nuevo' },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'airpods-pro-2nd-gen',
    name: 'AirPods Pro (2da Generación)',
    description: 'AirPods Pro de segunda generación con cancelación de ruido mejorada y audio espacial.',
    price: 750000,
    imageUrls: ['https://firebasestorage.googleapis.com/v0/b/icommerce-ya7tu.appspot.com/o/product_images%2Fairpods_pro_2.png?alt=media&token=5c6d8e7f-1a3b-4c5c-8b3d-9a1d4b5c6d8e'],
    category: accesoriosCategory,
    stock: 30,
    rating: 4.7,
    reviewsCount: 250,
    details: { Generación: '2da', Característica: 'Cancelación de Ruido', Condición: 'Nuevo' },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'airpods-3rd-gen',
    name: 'AirPods (3ra Generación)',
    description: 'AirPods de tercera generación con audio espacial y ajuste universal.',
    price: 550000,
    imageUrls: ['https://firebasestorage.googleapis.com/v0/b/icommerce-ya7tu.appspot.com/o/product_images%2Fairpods_3.png?alt=media&token=8e7f1a3b-5c6d-4b5c-8b3d-9a1d4b5c6d8e'],
    category: accesoriosCategory,
    stock: 25,
    rating: 4.6,
    reviewsCount: 180,
    details: { Generación: '3ra', Característica: 'Audio Espacial', Condición: 'Nuevo' },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'apple-watch-series-9',
    name: 'Apple Watch Series 9',
    description: 'El Apple Watch Series 9 con nuevas funciones de salud y el chip S9.',
    price: 1500000,
    imageUrls: ['https://firebasestorage.googleapis.com/v0/b/icommerce-ya7tu.appspot.com/o/product_images%2Fapple_watch_series_9_midnight.png?alt=media&token=9a1d4b5c-6d8e-4b5c-8b3d-7e1a3b5c6d8e'],
    category: appleWatchCategory,
    stock: 15,
    rating: 4.8,
    reviewsCount: 150,
    details: { Modelo: 'Series 9', Chip: 'S9', Condición: 'Nuevo' },
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'apple-watch-ultra-2',
    name: 'Apple Watch Ultra 2',
    description: 'El Apple Watch Ultra 2, diseñado para la aventura y la resistencia.',
    price: 2800000,
    imageUrls: ['https://firebasestorage.googleapis.com/v0/b/icommerce-ya7tu.appspot.com/o/product_images%2Fapple_watch_ultra_2.png?alt=media&token=c6d8e7f1-a3b5-4c5c-8b3d-9a1d4b5c6d8e'],
    category: appleWatchCategory,
    stock: 10,
    rating: 4.9,
    reviewsCount: 100,
    details: { Modelo: 'Ultra 2', Resistencia: 'Titanio', Condición: 'Nuevo' },
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
  {
    id: 'order001',
    userId: 'user123',
    items: [], 
    totalAmount: 0, 
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
