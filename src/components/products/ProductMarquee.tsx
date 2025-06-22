
import type { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { formatColombianCurrency } from '@/lib/utils'; 

interface ProductMarqueeProps {
  products: Product[];
  title: string;
}

export default function ProductMarquee({ products, title }: ProductMarqueeProps) {
  if (!products || products.length === 0) {
    return null;
  }

  const marqueeProducts = [...products, ...products];

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
    <section className="py-12 md:py-16 bg-background overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-10 text-foreground">
          {title}
        </h2>
        <div className="marquee-container relative flex overflow-x-hidden">
          <div className="marquee-content flex animate-marquee whitespace-nowrap py-4">
            {marqueeProducts.map((product, index) => (
              <div
                key={`${product.id}-${index}`}
                className="marquee-item mx-4 w-72 md:w-80 flex-shrink-0 transform transition-all duration-300 hover:scale-105 hover:z-10 group"
              >
                <Link
                  href={`/products/${product.id}`}
                  className="block relative h-96 w-full rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-card"
                  aria-label={`Ver ${product.name}`}
                >
                  <Image
                    src={product.imageUrls[0]} // Changed from product.images[0]
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 288px, 320px"
                    className="object-cover transition-opacity duration-300 group-hover:opacity-30"
                    data-ai-hint={getImageHint(product)}
                  />
                  <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
                    <h3 className="text-lg font-semibold text-white mb-1 line-clamp-2">{product.name}</h3>
                    <p className="text-base font-bold text-primary-foreground/90 mb-2">{formatColombianCurrency(product.price)}</p>
                    <Button variant="outline" size="sm" className="mt-auto w-full bg-white/20 text-white backdrop-blur-sm hover:bg-white/30 border-white/30 text-xs py-2">
                      Ver Detalles
                    </Button>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
