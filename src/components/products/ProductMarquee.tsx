import type { Product } from '@/types';
import ProductCard from './ProductCard';

interface ProductMarqueeProps {
  products: Product[];
  title: string;
}

export default function ProductMarquee({ products, title }: ProductMarqueeProps) {
  if (!products || products.length === 0) {
    return null;
  }

  // Duplicate products for a seamless loop effect in the marquee
  const marqueeProducts = [...products, ...products];

  return (
    <section className="py-12 md:py-16 bg-gradient-to-r from-primary/20 via-background to-accent/10 overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl font-bold font-headline text-center mb-10 text-foreground">
          {title}
        </h2>
        <div className="marquee-container relative flex overflow-x-hidden">
          <div className="marquee-content flex animate-marquee whitespace-nowrap py-4">
            {marqueeProducts.map((product, index) => (
              <div
                key={`${product.id}-${index}`}
                className="marquee-item mx-3 w-64 md:w-72 flex-shrink-0"
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
