
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { getProductById, products as allProducts } from '@/lib/placeholder-data';
import type { Product } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, ChevronLeft, ChevronRight, Minus, Plus, ShoppingCart, Star } from 'lucide-react';
import Link from 'next/link';
import ProductList from '@/components/products/ProductList';
import { formatColombianCurrency } from '@/lib/utils';


export default function ProductDetailPage() {
  const params = useParams();
  const { id } = params;
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (id) {
      const fetchedProduct = getProductById(Array.isArray(id) ? id[0] : id);
      setProduct(fetchedProduct || null);
      setCurrentImageIndex(0); 
    }
  }, [id]);

  if (!product) {
    return (
      <div className="container mx-auto px-4 md:px-6 py-12 text-center">
        <p className="text-xl text-muted-foreground">Cargando detalles del producto...</p>
      </div>
    );
  }

  const relatedProducts = allProducts.filter(p => p.category.id === product.category.id && p.id !== product.id).slice(0, 4);

  const handleQuantityChange = (amount: number) => {
    setQuantity(prev => Math.max(1, Math.min(prev + amount, product.stock)));
  };

  const handleAddToCart = () => {
    toast({
      title: `¡${product.name} añadido al carrito!`,
      description: `Cantidad: ${quantity}`,
      action: (
        <Button variant="outline" size="sm" asChild>
          <Link href="/cart">Ver Carrito</Link>
        </Button>
      ),
    });
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % product.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + product.images.length) % product.images.length);
  };
  
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


  return (
    <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
        <div className="space-y-4">
          <div className="relative aspect-square rounded-lg overflow-hidden shadow-lg border bg-card">
            <Image
              src={product.images[currentImageIndex]}
              alt={`${product.name} imagen ${currentImageIndex + 1}`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain transition-opacity duration-300"
              data-ai-hint={getImageHint(product)}
              priority={currentImageIndex === 0}
            />
             {product.images.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-background/50 hover:bg-background/80"
                  onClick={prevImage}
                  aria-label="Imagen anterior"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-background/50 hover:bg-background/80"
                  onClick={nextImage}
                  aria-label="Siguiente imagen"
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`relative aspect-square rounded-md overflow-hidden border-2 ${index === currentImageIndex ? 'border-primary' : 'border-transparent'} hover:border-primary/50 transition-all`}
                  aria-label={`Ver imagen ${index + 1}`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} miniatura ${index + 1}`}
                    fill
                    sizes="10vw"
                    className="object-cover"
                    data-ai-hint={getImageHint(product)}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <Link href={`/#categories`} className="text-sm text-primary hover:underline mb-1">{product.category.name}</Link>
            <CardTitle className="text-3xl lg:text-4xl font-bold font-headline">{product.name}</CardTitle>
            {product.rating && (
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-5 w-5 ${i < Math.round(product.rating!) ? 'fill-amber-500' : 'fill-muted stroke-muted-foreground'}`} />
                  ))}
                </div>
                <span className="text-muted-foreground text-sm">({product.reviewsCount || 0} reseñas)</span>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <CardDescription className="text-base text-muted-foreground leading-relaxed">{product.description}</CardDescription>
            
            {product.details && Object.keys(product.details).length > 0 && (
              <div>
                <h4 className="font-semibold mb-1">Características Principales:</h4>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  {Object.entries(product.details).map(([key, value]) => (
                    <li key={key}><strong>{key}:</strong> {value}</li>
                  ))}
                </ul>
              </div>
            )}

            <Separator />
            
            <div className="flex items-center justify-between">
              <p className="text-3xl font-bold text-primary">{formatColombianCurrency(product.price)}</p>
              <div className="flex items-center gap-1 text-sm text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span>{product.stock > 0 ? `${product.stock} en stock` : 'Agotado'}</span>
              </div>
            </div>

            {product.stock > 0 && (
              <div className="flex items-center space-x-4">
                <Label htmlFor="quantity" className="text-sm font-medium">Cantidad:</Label>
                <div className="flex items-center border rounded-md">
                  <Button variant="outline" size="icon" onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1} className="h-9 w-9 rounded-r-none">
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input 
                    type="number" 
                    id="quantity" 
                    value={quantity} 
                    readOnly 
                    className="h-9 w-12 text-center border-y-0 rounded-none focus-visible:ring-0"
                    aria-label="Cantidad"
                  />
                  <Button variant="outline" size="icon" onClick={() => handleQuantityChange(1)} disabled={quantity >= product.stock} className="h-9 w-9 rounded-l-none">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
          {product.stock > 0 && (
            <CardFooter>
              <Button size="lg" className="w-full text-base transition-transform hover:scale-105 active:scale-95" onClick={handleAddToCart}>
                <ShoppingCart className="mr-2 h-5 w-5" /> Añadir al Carrito
              </Button>
            </CardFooter>
          )}
           {product.stock === 0 && (
            <CardFooter>
              <Button size="lg" className="w-full text-base" disabled>
                Agotado
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
      
      {relatedProducts.length > 0 && (
        <section className="mt-16 md:mt-24">
          <h2 className="text-2xl md:text-3xl font-bold font-headline mb-8 text-center md:text-left">
            También te podría interesar
          </h2>
          <ProductList products={relatedProducts} />
        </section>
      )}
    </div>
  );
}
