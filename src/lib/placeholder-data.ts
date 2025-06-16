
import type { Product, Category, Order, User } from '@/types';

export const categories: Category[] = [
  { id: '1', name: 'iPhones', slug: 'iphones' },
  { id: '2', name: 'Otros Celulares', slug: 'otros-celulares' },
  { id: '3', name: 'Accesorios', slug: 'accesorios' },
];

// Prices in COP (Colombian Pesos)
export const products: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    description: 'La experiencia iPhone definitiva. Chip A17 Bionic, sistema de cámara Pro y espectacular pantalla ProMotion.',
    price: 4500000, // Example COP price
    images: [
      '/apple-iphone-16-pro-max-desert-titanium-1.png',
      '/iphone-16-pro-max-back-black-titanium-1.png',
      '/iphone-16-pro-max-different-colors-phones-1.png'
    ],
    category: categories[0],
    stock: 50,
    rating: 4.9,
    reviewsCount: 120,
    details: { Almacenamiento: '256GB', Color: 'Titanio Azul', Pantalla: '6.1 pulgadas Super Retina XDR' }
  },
  {
    id: '2',
    name: 'iPhone 15',
    description: 'Potente y lleno de funciones. Chip A16 Bionic, sistema avanzado de doble cámara y pantalla vibrante.',
    price: 3800000, // Example COP price
    images: [
      '/iphone_15_hero.png',
      'https://placehold.co/600x400.png'
    ],
    category: categories[0],
    stock: 75,
    rating: 4.7,
    reviewsCount: 95,
    details: { Almacenamiento: '128GB', Color: 'Rosado', Pantalla: '6.1 pulgadas Super Retina XDR' }
  },
  {
    id: '3',
    name: 'Pixel 8 Pro',
    description: 'El Pixel más avanzado hasta la fecha. Google Tensor G3, cámaras de nivel profesional y una brillante pantalla Actua.',
    price: 4200000, // Example COP price
    images: ['https://placehold.co/600x600.png', 'https://placehold.co/600x600.png'],
    category: categories[1],
    stock: 40,
    rating: 4.8,
    reviewsCount: 80,
    details: { Almacenamiento: '256GB', Color: 'Obsidiana', Pantalla: '6.7 pulgadas Super Actua' }
  },
  {
    id: '4',
    name: 'Galaxy S24 Ultra',
    description: 'Épico. Así de simple. Experimenta el nuevo estándar con Galaxy AI, S Pen y una cámara increíble.',
    price: 5500000, // Example COP price
    images: ['https://placehold.co/600x600.png', 'https://placehold.co/600x600.png'],
    category: categories[1],
    stock: 30,
    rating: 4.9,
    reviewsCount: 110,
    details: { Almacenamiento: '512GB', Color: 'Gris Titanio', Pantalla: '6.8 pulgadas Dynamic AMOLED 2X' }
  },
  {
    id: '5',
    name: 'AirPods Pro (2da Gen)',
    description: 'Audio Adaptable. Ahora prioriza automáticamente los sonidos que necesitan tu atención.',
    price: 950000, // Example COP price
    images: ['https://placehold.co/600x600.png', 'https://placehold.co/600x600.png'],
    category: categories[2],
    stock: 150,
    rating: 4.8,
    reviewsCount: 250,
    details: { Conectividad: 'Bluetooth 5.3', Especial: 'Cancelación Activa de Ruido' }
  },
  {
    id: '6',
    name: 'Cargador MagSafe',
    description: 'El cargador MagSafe hace que la carga inalámbrica sea instantánea. Imanes perfectamente alineados se adhieren a tu iPhone.',
    price: 180000, // Example COP price
    images: ['https://placehold.co/600x600.png'],
    category: categories[2],
    stock: 200,
    rating: 4.5,
    reviewsCount: 180,
    details: { Compatibilidad: 'iPhone 12 y posterior', Tipo: 'Cargador Inalámbrico' }
  },
   {
    id: '7',
    name: 'Cable USB-C Anker',
    description: 'Carga de alta velocidad y transferencia de datos. Diseño duradero de nylon trenzado.',
    price: 85000, // Example COP price
    images: ['https://placehold.co/600x600.png'],
    category: categories[2],
    stock: 300,
    rating: 4.7,
    reviewsCount: 320,
    details: { Longitud: '1.8 m', Material: 'Nylon Trenzado', Tipo: 'USB-C a USB-C' }
  },
  {
    id: '8',
    name: 'Lámpara de Escritorio LED Inteligente',
    description: 'Brillo y temperatura de color ajustables, con control desde la app.',
    price: 250000, // Example COP price
    images: ['https://placehold.co/600x600.png'],
    category: categories[2],
    stock: 80,
    rating: 4.6,
    reviewsCount: 90,
    details: { Funciones: 'Control por App, Regulable', Color: 'Blanco' }
  }
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
    items: [
      { ...products[0], quantity: 1 },
      { ...products[4], quantity: 1 },
    ],
    totalAmount: products[0].price + products[4].price,
    status: 'Entregado',
    orderDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    shippingAddress: mockUser.addresses![0],
    trackingNumber: 'CO999AA10123456789',
  },
  {
    id: 'order002',
    userId: 'user123',
    items: [{ ...products[2], quantity: 1 }],
    totalAmount: products[2].price,
    status: 'Enviado',
    orderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    shippingAddress: mockUser.addresses![0],
    trackingNumber: 'CO999AA10198765432',
  },
  {
    id: 'order003',
    userId: 'user123',
    items: [{ ...products[1], quantity: 2 }],
    totalAmount: products[1].price * 2,
    status: 'Procesando',
    orderDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    shippingAddress: mockUser.addresses![0],
  },
];

export function getProductById(id: string): Product | undefined {
  const product = products.find(p => p.id === id);
  if (product) {
    // Ensure all images have appropriate data-ai-hint attributes
    const updatedImages = product.images.map(imgSrc => {
      if (imgSrc.startsWith('https://placehold.co')) {
        if (product.category.slug === 'iphones' || product.category.slug === 'otros-celulares') {
          return imgSrc; // Placeholder already includes data-ai-hint via ProductCard/ProductDetailPage
        }
        if (product.category.slug === 'accesorios') {
          if (product.name.toLowerCase().includes('airpods')) return imgSrc;
          if (product.name.toLowerCase().includes('cargador')) return imgSrc;
          if (product.name.toLowerCase().includes('cable')) return imgSrc;
          return imgSrc;
        }
        return imgSrc;
      }
      return imgSrc; // For local images, hints are added in components
    });
    return { ...product, images: updatedImages };
  }
  return undefined;
}

export function getProductsByCategory(categorySlug: string): Product[] {
  const category = categories.find(c => c.slug === categorySlug);
  if (!category) return [];
  return products.filter(p => p.category.id === category.id).map(product => {
    const updatedImages = product.images.map(imgSrc => {
       if (imgSrc.startsWith('https://placehold.co')) {
        if (product.category.slug === 'iphones' || product.category.slug === 'otros-celulares') {
          return imgSrc;
        }
        if (product.category.slug === 'accesorios') {
          if (product.name.toLowerCase().includes('airpods')) return imgSrc;
          if (product.name.toLowerCase().includes('cargador')) return imgSrc;
          if (product.name.toLowerCase().includes('cable')) return imgSrc;
          return imgSrc;
        }
        return imgSrc;
      }
      return imgSrc;
    });
    return { ...product, images: updatedImages };
  });
}
