import type { Product, Category, Order, User } from '@/types';

export const categories: Category[] = [
  { id: '1', name: 'iPhones', slug: 'iphones' },
  { id: '2', name: 'Other Phones', slug: 'other-phones' },
  { id: '3', name: 'Accessories', slug: 'accessories' },
];

export const products: Product[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro',
    description: 'The ultimate iPhone experience. A17 Bionic chip, Pro camera system, and stunning ProMotion display.',
    price: 999,
    images: ['https://placehold.co/600x600.png?text=iPhone+15+Pro', 'https://placehold.co/600x600.png?text=iPhone+15+Pro+Back', 'https://placehold.co/600x600.png?text=iPhone+15+Pro+Side'],
    category: categories[0],
    stock: 50,
    rating: 4.9,
    reviewsCount: 120,
    details: { Storage: '256GB', Color: 'Titanium Blue', Display: '6.1-inch Super Retina XDR' }
  },
  {
    id: '2',
    name: 'iPhone 15',
    description: 'Powerful and packed with features. A16 Bionic chip, advanced dual-camera system, and vibrant display.',
    price: 799,
    images: ['https://placehold.co/600x600.png?text=iPhone+15', 'https://placehold.co/600x600.png?text=iPhone+15+Colors'],
    category: categories[0],
    stock: 75,
    rating: 4.7,
    reviewsCount: 95,
    details: { Storage: '128GB', Color: 'Pink', Display: '6.1-inch Super Retina XDR' }
  },
  {
    id: '3',
    name: 'Pixel 8 Pro',
    description: 'The most advanced Pixel yet. Google Tensor G3, pro-level cameras, and a brilliant Actua display.',
    price: 899,
    images: ['https://placehold.co/600x600.png?text=Pixel+8+Pro', 'https://placehold.co/600x600.png?text=Pixel+8+Pro+Camera'],
    category: categories[1],
    stock: 40,
    rating: 4.8,
    reviewsCount: 80,
    details: { Storage: '256GB', Color: 'Obsidian', Display: '6.7-inch Super Actua' }
  },
  {
    id: '4',
    name: 'Galaxy S24 Ultra',
    description: 'Epic. Just like that. Experience the new standard with Galaxy AI, S Pen, and incredible camera.',
    price: 1199,
    images: ['https://placehold.co/600x600.png?text=Galaxy+S24+Ultra', 'https://placehold.co/600x600.png?text=S24+Ultra+Detail'],
    category: categories[1],
    stock: 30,
    rating: 4.9,
    reviewsCount: 110,
    details: { Storage: '512GB', Color: 'Titanium Gray', Display: '6.8-inch Dynamic AMOLED 2X' }
  },
  {
    id: '5',
    name: 'AirPods Pro (2nd Gen)',
    description: 'Adaptive Audio. Now automatically prioritizes sounds that need your attention.',
    price: 249,
    images: ['https://placehold.co/600x600.png?text=AirPods+Pro', 'https://placehold.co/600x600.png?text=AirPods+Pro+Case'],
    category: categories[2],
    stock: 150,
    rating: 4.8,
    reviewsCount: 250,
    details: { Connectivity: 'Bluetooth 5.3', Special: 'Active Noise Cancellation' }
  },
  {
    id: '6',
    name: 'MagSafe Charger',
    description: 'The MagSafe Charger makes wireless charging a snap. Perfectly aligned magnets attach to your iPhone.',
    price: 39,
    images: ['https://placehold.co/600x600.png?text=MagSafe+Charger'],
    category: categories[2],
    stock: 200,
    rating: 4.5,
    reviewsCount: 180,
    details: { Compatibility: 'iPhone 12 and later', Type: 'Wireless Charger' }
  },
   {
    id: '7',
    name: 'Anker USB-C Cable',
    description: 'High-speed charging and data transfer. Durable braided nylon design.',
    price: 19,
    images: ['https://placehold.co/600x600.png?text=USB-C+Cable'],
    category: categories[2],
    stock: 300,
    rating: 4.7,
    reviewsCount: 320,
    details: { Length: '6 ft', Material: 'Braided Nylon', Type: 'USB-C to USB-C' }
  },
  {
    id: '8',
    name: 'Smart LED Desk Lamp',
    description: 'Adjustable brightness and color temperature, with app control.',
    price: 59,
    images: ['https://placehold.co/600x600.png?text=Desk+Lamp'],
    category: categories[2],
    stock: 80,
    rating: 4.6,
    reviewsCount: 90,
    details: { Features: 'App Control, Dimmable', Color: 'White' }
  }
];

export const mockUser: User = {
  id: 'user123',
  name: 'Alice Wonderland',
  email: 'alice@example.com',
  avatar: 'https://placehold.co/100x100.png?text=AW',
  addresses: [
    { id: 'addr1', street: '123 Main St', city: 'Techville', state: 'CA', zipCode: '90210', country: 'USA', isDefault: true },
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
    status: 'Delivered',
    orderDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    shippingAddress: mockUser.addresses![0],
    trackingNumber: '1Z999AA10123456789',
  },
  {
    id: 'order002',
    userId: 'user123',
    items: [{ ...products[2], quantity: 1 }],
    totalAmount: products[2].price,
    status: 'Shipped',
    orderDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    shippingAddress: mockUser.addresses![0],
    trackingNumber: '1Z999AA10198765432',
  },
];

export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  const category = categories.find(c => c.slug === categorySlug);
  if (!category) return [];
  return products.filter(p => p.category.id === category.id);
}
