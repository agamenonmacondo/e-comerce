
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

// Image arrays for iPhone 16 models
const iphone16ProMaxImages = [
  '/images/iphone%2016%20promax/apple-iphone-16-pro-max-desert-titanium-1.png',
  '/images/iphone%2016%20promax/iphone-16-pro-max-back-black-titanium-1.png',
  '/images/iphone%2016%20promax/iphone-16-pro-max-different-colors-phones-1.png',
];

const iphone16Images = [
  '/images/iphone%2016/iphone-16-blue.png',
  '/images/iphone%2016/iphone-16-pink.png',
  '/images/iphone%2016/iphone-16-black.png',
];


export const products: Product[] = [
  // Detailed iPhone 16 Pro Max (ES version from new list)
  {
    id: 'iphone-16-pro-max-256-es',
    name: 'iPhone 16 Pro Max 256GB ES (Nuevo)',
    description: 'Experimenta el pináculo de la innovación con el iPhone 16 Pro Max. Con Dynamic Island, pantalla ProMotion siempre activa, el potente chip A18 Pro y un revolucionario sistema de cámaras Pro Fusion. Apple Intelligence integrado para una experiencia más personal y privada.',
    price: 4450000,
    imageUrls: iphone16ProMaxImages,
    category: iphoneCategory,
    stock: 20,
    rating: 4.9,
    reviewsCount: 150,
    details: {
      Pantalla: 'Super Retina XDR OLED 6,9", ProMotion 120Hz, Siempre Activa',
      Resolucion: '2868 x 1320 pixeles a 460 ppi',
      Chip: 'A18 Pro con Neural Engine de 16 núcleos',
      'Camara Principal': 'Sistema Pro Fusion 48MP + Ultra Gran Angular 48MP + Teleobjetivo 5x 12MP',
      'Camara Frontal': 'TrueDepth 12MP con autoenfoque',
      Video: '4K Dolby Vision hasta 120fps, ProRes, modo Cine, modo Acción',
      Resistencia: 'IP68 (hasta 6m por 30 min), Revestimiento oleofóbico',
      Inteligencia: 'Apple Intelligence integrada',
      Almacenamiento: '256GB',
      Variante: 'ES (Titanio Desierto)',
      Condición: 'Nuevo',
      'Caracteristicas Pantalla': 'Dynamic Island, True Tone, Amplia gama de colores (P3), Toque con respuesta háptica, Contraste 2.000.000:1, Brillo máx 1000 nits (normal), pico 1600 nits (HDR), pico 2000 nits (exteriores), brillo min 1 nit',
      'Detalles Camara': 'Estabilización óptica por desplazamiento (Fusion y Teleobjetivo 3D), Lente de zafiro, Flash True Tone adaptativo, Photonic Engine, Deep Fusion, HDR Inteligente 5, Retratos avanzados, Modo Noche, Fotos panorámicas, Estilos Fotográficos, Fotos espaciales, Macro 48MP, Apple ProRAW',
      'Grabacion Video Detallada': '4K Dolby Vision (24/25/30/60/100/120fps Fusion), 1080p Dolby Vision (25/30/60/120fps Fusion), ProRes hasta 4K@120fps (externo), Log, ACES, Macro video, Cámara lenta 1080p@240fps, QuickTake, Zoom audio, Audio Espacial, 4 Micrófonos, Reducción de ruido',
      'Camara TrueDepth Detalles': '12MP, ƒ/1.9, Autoenfoque, Retina Flash, Photonic Engine, Deep Fusion, HDR Inteligente 5, Retratos avanzados, Animoji/Memoji, Modo Noche, Estilos Fotográficos, Apple ProRAW',
    },
    createdAt: now,
    updatedAt: now,
  },

  // EQUIPOS NUEVOS (iPhones from the list)
  {
    id: 'iphone-13-128gb-nuevo-list',
    name: 'iPhone 13 128GB (Nuevo)',
    description: 'Un excelente iPhone 13 con 128GB de almacenamiento. Condición: Nuevo.',
    price: 2030000,
    imageUrls: ['/images/iphone_13/iPhone-13-PNG-Pic.png'],
    category: iphoneCategory, stock: 15, rating: 4.5, reviewsCount: 80,
    details: { Condición: 'Nuevo', Almacenamiento: '128GB' }, createdAt: now, updatedAt: now,
  },
  {
    id: 'iphone-14-128gb-nuevo-list',
    name: 'iPhone 14 128GB (Nuevo)',
    description: 'Un excelente iPhone 14 con 128GB de almacenamiento. Condición: Nuevo.',
    price: 2400000,
    imageUrls: ['/images/iphone_14/iPhone%2014.png'],
    category: iphoneCategory, stock: 18, rating: 4.6, reviewsCount: 90,
    details: { Condición: 'Nuevo', Almacenamiento: '128GB' }, createdAt: now, updatedAt: now,
  },
  {
    id: 'iphone-15-128gb-sf-nuevo-list',
    name: 'iPhone 15 128GB SF (Nuevo)',
    description: 'Un excelente iPhone 15 con 128GB de almacenamiento, sellado de fábrica. Condición: Nuevo.',
    price: 2790000,
    imageUrls: ['/images/iphone%2015/iphone_15_hero.png'],
    category: iphoneCategory, stock: 20, rating: 4.7, reviewsCount: 100,
    details: { Condición: 'Nuevo', Almacenamiento: '128GB', Variante: 'SF (Sellado Fábrica)' }, createdAt: now, updatedAt: now,
  },
  {
    id: 'iphone-15-256gb-sf-nuevo-list',
    name: 'iPhone 15 256GB SF (Nuevo)',
    description: 'Un excelente iPhone 15 con 256GB de almacenamiento, sellado de fábrica. Condición: Nuevo.',
    price: 3300000,
    imageUrls: ['/images/iphone%2015/650383081fa16-apple%20iphone%2015.png'],
    category: iphoneCategory, stock: 22, rating: 4.7, reviewsCount: 110,
    details: { Condición: 'Nuevo', Almacenamiento: '256GB', Variante: 'SF (Sellado Fábrica)' }, createdAt: now, updatedAt: now,
  },
  {
    id: 'iphone-16-128gb-sf-nuevo-list',
    name: 'iPhone 16 128GB SF (Nuevo)',
    description: 'El nuevo iPhone 16 con 128GB de almacenamiento, sellado de fábrica. Condición: Nuevo.',
    price: 3125000,
    imageUrls: iphone16Images,
    category: iphoneCategory, stock: 25, rating: 4.8, reviewsCount: 70,
    details: { Condición: 'Nuevo', Almacenamiento: '128GB', Variante: 'SF (Sellado Fábrica)' }, createdAt: now, updatedAt: now,
  },
  {
    id: 'iphone-16-256gb-nuevo-list',
    name: 'iPhone 16 256GB (Nuevo)',
    description: 'El nuevo iPhone 16 con 256GB de almacenamiento. Condición: Nuevo.',
    price: 3600000,
    imageUrls: iphone16Images,
    category: iphoneCategory, stock: 19, rating: 4.8, reviewsCount: 65,
    details: { Condición: 'Nuevo', Almacenamiento: '256GB' }, createdAt: now, updatedAt: now,
  },
  {
    id: 'iphone-16pro-128gb-es-nuevo-list',
    name: 'iPhone 16 Pro 128GB ES (Nuevo)',
    description: 'El potente iPhone 16 Pro con 128GB de almacenamiento, variante ES. Condición: Nuevo.',
    price: 3820000,
    imageUrls: iphone16ProMaxImages,
    category: iphoneCategory, stock: 15, rating: 4.9, reviewsCount: 85,
    details: { Condición: 'Nuevo', Almacenamiento: '128GB', Variante: 'ES' }, createdAt: now, updatedAt: now,
  },
  {
    id: 'iphone-16-pro-max-256-sf-nuevo-list', 
    name: 'iPhone 16 Pro Max 256GB SF (Nuevo)',
    description: 'El impresionante iPhone 16 Pro Max con 256GB, sellado de fábrica. Condición: Nuevo.',
    price: 4990000,
    imageUrls: iphone16ProMaxImages,
    category: iphoneCategory, stock: 12, rating: 4.9, reviewsCount: 95,
    details: { Condición: 'Nuevo', Almacenamiento: '256GB', Variante: 'SF (Sellado Fábrica)' }, createdAt: now, updatedAt: now,
  },

  // EQUIPOS USADOS (iPhones from the list)
  {
    id: 'iphone-13-128gb-usado-list',
    name: 'iPhone 13 128GB (Usado)',
    description: 'iPhone 13 con 128GB de almacenamiento. Condición: Usado, Garantía 3 meses.',
    price: 1260000,
    imageUrls: ['/images/iphone_13/iphone-13-pink-select-2021-1.png'],
    category: iphoneCategory, stock: 8, rating: 4.2, reviewsCount: 50,
    details: { Condición: 'Usado', Almacenamiento: '128GB', Garantía: '3 meses' }, createdAt: now, updatedAt: now,
  },
  {
    id: 'iphone-13promax-128gb-usado-list',
    name: 'iPhone 13 Pro Max 128GB (Usado)',
    description: 'iPhone 13 Pro Max con 128GB de almacenamiento. Condición: Usado, Garantía 3 meses.',
    price: 1990000,
    imageUrls: ['https://placehold.co/600x400.png'],
    category: iphoneCategory, stock: 5, rating: 4.4, reviewsCount: 60,
    details: { Condición: 'Usado', Almacenamiento: '128GB', Garantía: '3 meses' }, createdAt: now, updatedAt: now,
  },
  {
    id: 'iphone-15plus-128gb-usado-list',
    name: 'iPhone 15 Plus 128GB (Usado)',
    description: 'iPhone 15 Plus con 128GB de almacenamiento. Condición: Usado, Garantía 3 meses.',
    price: 2550000,
    imageUrls: ['/images/iphone%2015/PNG.monsteriphone-15-plus-pro-pro-max-blue%20png.png'],
    category: iphoneCategory, stock: 7, rating: 4.5, reviewsCount: 40,
    details: { Condición: 'Usado', Almacenamiento: '128GB', Garantía: '3 meses' }, createdAt: now, updatedAt: now,
  },
  {
    id: 'iphone-15pro-256gb-usado-list',
    name: 'iPhone 15 Pro 256GB (Usado)',
    description: 'iPhone 15 Pro con 256GB de almacenamiento. Condición: Usado, Garantía 3 meses.',
    price: 2800000,
    imageUrls: ['/images/iphone%2015/PNG.monsteriphone-15-plus-pro-pro-max-blue%20png.png'],
    category: iphoneCategory, stock: 6, rating: 4.6, reviewsCount: 55,
    details: { Condición: 'Usado', Almacenamiento: '256GB', Garantía: '3 meses' }, createdAt: now, updatedAt: now,
  },
  {
    id: 'iphone-15promax-256gb-es-usado-list',
    name: 'iPhone 15 Pro Max 256GB ES (Usado)',
    description: 'iPhone 15 Pro Max con 256GB, variante ES. Condición: Usado, Garantía 3 meses.',
    price: 3340000,
    imageUrls: ['/images/iphone%2015/PNG.monsteriphone-15-plus-pro-pro-max-blue%20png.png'],
    category: iphoneCategory, stock: 4, rating: 4.6, reviewsCount: 45,
    details: { Condición: 'Usado', Almacenamiento: '256GB', Variante: 'ES', Garantía: '3 meses' }, createdAt: now, updatedAt: now,
  },

  // EQUIPO PREMIUM (iPhone from the list)
  {
    id: 'iphone-16-128gb-es-premium-list',
    name: 'iPhone 16 128GB ES (Premium)',
    description: 'iPhone 16 con 128GB, variante ES. Condición: Premium, Garantía 6 meses.',
    price: 2800000,
    imageUrls: iphone16Images,
    category: iphoneCategory, stock: 10, rating: 4.7, reviewsCount: 30,
    details: { Condición: 'Premium', Almacenamiento: '128GB', Variante: 'ES', Garantía: '6 meses' }, createdAt: now, updatedAt: now,
  },

  // MACBOOKS 
  {
    id: 'macbook-air-m2-256gb',
    name: 'MacBook Air M2 256GB',
    description: 'Ultraligero y potente MacBook Air con chip M2. Almacenamiento de 256GB.',
    price: 3800000,
    imageUrls: ['https://placehold.co/600x400.png'],
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
    imageUrls: ['https://placehold.co/600x400.png'],
    category: macbookCategory,
    stock: 8,
    rating: 4.9,
    reviewsCount: 95,
    details: { Chip: 'M3', Almacenamiento: '512GB', Condición: 'Nuevo' },
    createdAt: now,
    updatedAt: now,
  },

  // ACCESORIOS
  {
    id: 'airpods-pro-2nd-gen',
    name: 'AirPods Pro (2da Generación)',
    description: 'AirPods Pro de segunda generación con cancelación de ruido mejorada y audio espacial.',
    price: 750000,
    imageUrls: ['https://placehold.co/600x400.png'],
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
    imageUrls: ['https://placehold.co/600x400.png'],
    category: accesoriosCategory,
    stock: 25,
    rating: 4.6,
    reviewsCount: 180,
    details: { Generación: '3ra', Característica: 'Audio Espacial', Condición: 'Nuevo' },
    createdAt: now,
    updatedAt: now,
  },

  // APPLE WATCH
  {
    id: 'apple-watch-series-9',
    name: 'Apple Watch Series 9',
    description: 'El Apple Watch Series 9 con nuevas funciones de salud y el chip S9.',
    price: 1500000,
    imageUrls: ['https://placehold.co/600x400.png'],
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
    imageUrls: ['https://placehold.co/600x400.png'],
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
    

    




