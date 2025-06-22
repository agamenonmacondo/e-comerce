
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { products as allProducts } from '@/lib/placeholder-data';
import { cn } from '@/lib/utils';
import type { Product } from '@/types';

// Define which products to feature in the hero carousel
const featuredProductIds = [
  'iphone-16-pro-max-256-es',
  'macbook-pro-m3-512gb',
  'apple-watch-ultra-2',
];

const getImageHint = (product: Product) => {
    if (product.category.slug === 'iphones') return 'phone photo';
    if (product.category.slug === 'macbooks') return 'laptop computer';
    if (product.category.slug === 'apple-watch') return 'smartwatch product';
    return 'product photo';
};

export default function HeroSection() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    // Filter the products once on component mount
    const filtered = allProducts.filter(p => featuredProductIds.includes(p.id));
    setFeaturedProducts(filtered);
  }, []);

  useEffect(() => {
    if (featuredProducts.length === 0) return;

    // Set up the interval for auto-rotation
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % featuredProducts.length);
    }, 5000); // Change product every 5 seconds

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, [featuredProducts.length]);

  if (featuredProducts.length === 0) {
    // Fallback or loading state while products are being filtered
    return <section className="relative bg-background w-full h-[500px]"></section>;
  }

  const activeProduct = featuredProducts[activeIndex];

  return (
    <section className="relative bg-background w-full">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-8 items-center py-12 md:py-24">
          <div className="space-y-6 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-headline tracking-tight">
              <span className="text-primary">AVA Shop:</span> La Tecnología Que Te Define
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto md:mx-0">
              Explora lo último en iPhones, MacBooks y accesorios premium. Calidad y servicio que marcan la diferencia.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button asChild size="lg" className="transition-transform hover:scale-105 active:scale-95">
                <Link href="/#products">
                  Explorar Productos <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative h-80 md:h-96 flex flex-col items-center justify-center">
            <Image
              key={activeProduct.id} // Forces re-render on product change
              src={activeProduct.imageUrls[0]}
              alt={activeProduct.name}
              fill
              className="object-contain drop-shadow-[0_15px_30px_rgba(255,255,255,0.1)] animate-in fade-in duration-500"
              data-ai-hint={getImageHint(activeProduct)}
              priority={activeIndex === 0} // Prioritize loading the first image
            />
             <div className="absolute -bottom-4 md:-bottom-8 flex justify-center gap-3">
              {featuredProducts.map((product, index) => (
                <button
                  key={product.id}
                  onClick={() => setActiveIndex(index)}
                  className={cn(
                    'h-2.5 w-2.5 rounded-full transition-all duration-300',
                    activeIndex === index ? 'w-6 bg-primary' : 'bg-muted hover:bg-muted-foreground/50'
                  )}
                  aria-label={`Mostrar ${product.name}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
