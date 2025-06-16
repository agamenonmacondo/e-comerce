
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import type { CartItem, Product } from '@/types';
import { products as allProducts } from '@/lib/placeholder-data';
import { CreditCard, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import { formatColombianCurrency } from '@/lib/utils';

const initialCartItems: CartItem[] = [
  { ...allProducts[0], quantity: 1 },
  { ...allProducts[2], quantity: 2 },
];

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Simulate fetching cart items
    setCartItems(initialCartItems);
  }, []);

  const updateQuantity = (productId: string, newQuantity: number) => {
    setCartItems(currentItems =>
      currentItems.map(item =>
        item.id === productId ? { ...item, quantity: Math.max(0, newQuantity) } : item
      ).filter(item => item.quantity > 0) // Remove item if quantity is 0
    );
  };

  const removeItem = (productId: string) => {
    setCartItems(currentItems => currentItems.filter(item => item.id !== productId));
    toast({
      title: "Artículo Eliminado",
      description: "El artículo ha sido eliminado de tu carrito.",
    });
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const taxRate = 0.19; // 19% IVA Colombia (ejemplo, puede variar)
  const taxAmount = subtotal * taxRate;
  const shippingCost = subtotal > 200000 ? 0 : 15000; // Envío gratis sobre $200.000 COP (ejemplo)
  const totalAmount = subtotal + taxAmount + shippingCost;

  const getImageHint = (product: Product) => {
    if (product.category.slug === 'iphones' || product.category.slug === 'otros-celulares') {
      return 'phone photo';
    }
    if (product.category.slug === 'accesorios') {
      if (product.name.toLowerCase().includes('airpods')) return 'earbuds product';
      if (product.name.toLowerCase().includes('cargador')) return 'charger product';
      if (product.name.toLowerCase().includes('cable')) return 'cable product';
      return 'accessory product';
    }
    return 'product photo';
  };


  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-12 text-center">
        <ShoppingCart className="mx-auto h-16 w-16 text-muted-foreground mb-6" />
        <h1 className="text-3xl font-bold font-headline mb-4">Tu Carrito está Vacío</h1>
        <p className="text-muted-foreground mb-6">Parece que aún no has añadido nada a tu carrito.</p>
        <Button asChild size="lg" className="transition-transform hover:scale-105 active:scale-95">
          <Link href="/">Continuar Comprando</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
      <h1 className="text-3xl md:text-4xl font-bold font-headline mb-8">Tu Carrito de Compras</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {cartItems.map(item => (
            <Card key={item.id} className="flex flex-col sm:flex-row items-center p-4 gap-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-md overflow-hidden flex-shrink-0 bg-muted">
                <Image 
                  src={item.images[0]} 
                  alt={item.name} 
                  fill sizes="10vw" 
                  className="object-cover" 
                  data-ai-hint={getImageHint(item)}
                />
              </div>
              <div className="flex-grow text-center sm:text-left">
                <Link href={`/products/${item.id}`} className="text-lg font-semibold hover:text-primary transition-colors">{item.name}</Link>
                <p className="text-sm text-muted-foreground">{item.category.name}</p>
                <p className="text-lg font-medium text-primary mt-1">{formatColombianCurrency(item.price)}</p>
              </div>
              <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, item.quantity - 1)} className="h-8 w-8">
                  <Minus className="h-4 w-4" />
                </Button>
                <Input 
                  type="number" 
                  value={item.quantity} 
                  readOnly 
                  className="h-8 w-12 text-center focus-visible:ring-0"
                  aria-label={`${item.name} cantidad`}
                />
                <Button variant="outline" size="icon" onClick={() => updateQuantity(item.id, item.quantity + 1)} className="h-8 w-8">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <p className="font-semibold text-lg w-32 text-right hidden sm:block">
                {formatColombianCurrency(item.price * item.quantity)}
              </p>
              <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="text-destructive hover:text-destructive/80">
                <Trash2 className="h-5 w-5" />
                <span className="sr-only">Eliminar {item.name}</span>
              </Button>
            </Card>
          ))}
        </div>

        <div className="lg:col-span-1">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-headline">Resumen del Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatColombianCurrency(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Envío</span>
                <span>{shippingCost === 0 ? 'Gratis' : formatColombianCurrency(shippingCost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Impuestos ({(taxRate * 100).toFixed(0)}%)</span>
                <span>{formatColombianCurrency(taxAmount)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-xl">
                <span>Total</span>
                <span>{formatColombianCurrency(totalAmount)}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button size="lg" className="w-full text-base transition-transform hover:scale-105 active:scale-95" asChild>
                <Link href="/checkout">
                  <CreditCard className="mr-2 h-5 w-5" /> Proceder al Pago
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
