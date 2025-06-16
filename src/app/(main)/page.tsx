'use client'; // Required for useState, useEffect

import { useState, useEffect, useCallback } from 'react';
import ProductList from '@/components/products/ProductList';
import FilterSidebar from '@/components/products/FilterSidebar';
import { products as allProducts, categories } from '@/lib/placeholder-data';
import type { Product } from '@/types';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight } from 'lucide-react';

export default function HomePage() {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(allProducts);
  const [currentFilters, setCurrentFilters] = useState({ categories: [], priceRange: [0, 1500] });
  const [currentSortKey, setCurrentSortKey] = useState('relevance');

  const applyFiltersAndSort = useCallback(() => {
    let tempProducts = [...allProducts];

    // Apply category filter
    if (currentFilters.categories.length > 0) {
      tempProducts = tempProducts.filter(product => 
        currentFilters.categories.includes(product.category.id)
      );
    }

    // Apply price range filter
    tempProducts = tempProducts.filter(product => 
      product.price >= currentFilters.priceRange[0] && product.price <= currentFilters.priceRange[1]
    );
    
    // Apply sorting
    switch (currentSortKey) {
      case 'price-asc':
        tempProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        tempProducts.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        tempProducts.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest': // This would need a date field on products, mock sorting by ID for now
        tempProducts.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        break;
      case 'relevance': // Default, no specific sort or could be based on popularity in real app
      default:
        // Potentially sort by a default relevance score or keep as is
        break;
    }

    setFilteredProducts(tempProducts);
  }, [currentFilters, currentSortKey]);


  useEffect(() => {
    applyFiltersAndSort();
  }, [applyFiltersAndSort]);

  const handleFilterChange = (newFilters: any) => {
    setCurrentFilters(newFilters);
  };

  const handleSortChange = (sortKey: string) => {
    setCurrentSortKey(sortKey);
  };


  return (
    <>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/20 via-background to-accent/10 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold font-headline mb-6 text-foreground">
            Discover Innovation
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Explore the latest in cutting-edge technology and stylish accessories. Find your next favorite gadget with iCommerce.
          </p>
          <Button size="lg" asChild className="transition-transform hover:scale-105 active:scale-95">
            <Link href="#products">
              Shop Now <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <h2 className="text-3xl font-bold font-headline text-center mb-10">Shop by Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map(category => (
              <Link key={category.id} href={`#products`} onClick={() => handleFilterChange({ categories: [category.id], priceRange: [0,2000]})}
                className="block group bg-card p-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors mb-2">{category.name}</h3>
                <p className="text-sm text-muted-foreground">Explore all {category.name.toLowerCase()}.</p>
                <div className="mt-4 text-primary font-medium flex items-center">
                  View Products <ChevronRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Products Section */}
      <section id="products" className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row gap-8">
            <aside className="w-full md:w-1/4 lg:w-1/5">
              <FilterSidebar 
                categories={categories} 
                onFilterChange={handleFilterChange}
                onSortChange={handleSortChange}
              />
            </aside>
            <div className="w-full md:w-3/4 lg:w-4/5">
              <h2 className="text-3xl font-bold font-headline mb-8">Our Products</h2>
              <ProductList products={filteredProducts} />
              {/* TODO: Add Pagination component here */}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
