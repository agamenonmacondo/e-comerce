
'use client'; 

import { useState, useEffect, useCallback } from 'react';
import ProductList from '@/components/products/ProductList';
import FilterSidebar from '@/components/products/FilterSidebar';
import { products as allProducts, categories } from '@/lib/placeholder-data';
import type { Product } from '@/types';
import HeroSection from '@/components/layout/HeroSection';

export default function HomePage() {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(allProducts);
  const [currentFilters, setCurrentFilters] = useState({ categories: [], priceRange: [0, 5000000] }); // Price range in COP
  const [currentSortKey, setCurrentSortKey] = useState('relevance');

  const applyFiltersAndSort = useCallback(() => {
    let tempProducts = [...allProducts];

    if (currentFilters.categories.length > 0) {
      tempProducts = tempProducts.filter(product => 
        currentFilters.categories.includes(product.category.id)
      );
    }

    tempProducts = tempProducts.filter(product => 
      product.price >= currentFilters.priceRange[0] && product.price <= currentFilters.priceRange[1]
    );
    
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
      case 'newest': 
        tempProducts.sort((a, b) => parseInt(b.id) - parseInt(a.id)); 
        break;
      case 'relevance': 
      default:
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
      <HeroSection />
      <section id="products" className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row gap-8">
            <aside className="w-full md:w-1/4 lg:w-1/5">
              <FilterSidebar 
                categories={categories} 
                onFilterChange={handleFilterChange}
                onSortChange={handleSortChange}
                maxPrice={5000000} 
                priceStep={100000} 
              />
            </aside>
            <div className="w-full md:w-3/4 lg:w-4/5">
              <h2 className="text-3xl font-bold font-headline mb-8">Nuestros Productos</h2>
              <ProductList products={filteredProducts} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
