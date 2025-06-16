'use client';

import { useState } from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import type { Category } from '@/types';
import { ListFilter, RotateCcw } from 'lucide-react';
import { cn } from "@/lib/utils";

interface FilterSidebarProps {
  categories: Category[];
  onFilterChange: (filters: any) => void;
  onSortChange: (sortKey: string) => void;
  className?: string;
  maxPrice?: number; // Max price for the slider
  priceStep?: number; // Step for the slider
}

// Helper function for Colombian currency
const formatColombianCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
};

export default function FilterSidebar({ 
  categories, 
  onFilterChange, 
  onSortChange, 
  className,
  maxPrice = 5000000, // Default max price in COP
  priceStep = 100000   // Default step in COP
}: FilterSidebarProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, maxPrice]);
  const [sortKey, setSortKey] = useState<string>('relevance');

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const newSelectedCategories = checked
      ? [...selectedCategories, categoryId]
      : selectedCategories.filter(id => id !== categoryId);
    setSelectedCategories(newSelectedCategories);
  };

  const handlePriceChange = (newRange: [number, number]) => {
    setPriceRange(newRange);
  };
  
  const handleSortChange = (value: string) => {
    setSortKey(value);
    onSortChange(value);
  };

  const applyFilters = () => {
    onFilterChange({ categories: selectedCategories, priceRange });
  };

  const resetFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, maxPrice]);
    setSortKey('relevance');
    onFilterChange({ categories: [], priceRange: [0, maxPrice] });
    onSortChange('relevance');
  };

  return (
    <div className={cn("space-y-6 p-4 bg-card rounded-lg shadow-sm", className)}>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold font-headline flex items-center">
          <ListFilter className="mr-2 h-5 w-5 text-primary" />
          Filtros
        </h3>
        <Button variant="ghost" size="sm" onClick={resetFilters} className="text-xs">
          <RotateCcw className="mr-1 h-3 w-3" />
          Reiniciar
        </Button>
      </div>

      <div>
        <Label htmlFor="sort-by" className="text-sm font-medium">Ordenar Por</Label>
        <Select value={sortKey} onValueChange={handleSortChange}>
          <SelectTrigger id="sort-by" className="w-full mt-1">
            <SelectValue placeholder="Seleccionar ordenación" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">Relevancia</SelectItem>
            <SelectItem value="price-asc">Precio: Menor a Mayor</SelectItem>
            <SelectItem value="price-desc">Precio: Mayor a Menor</SelectItem>
            <SelectItem value="rating-desc">Calificación: Mayor a Menor</SelectItem>
            <SelectItem value="newest">Más Recientes</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Accordion type="multiple" defaultValue={['categories', 'price']} className="w-full">
        <AccordionItem value="categories">
          <AccordionTrigger className="text-base font-medium">Categorías</AccordionTrigger>
          <AccordionContent className="space-y-2 pt-2">
            {categories.map(category => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category.id}`}
                  checked={selectedCategories.includes(category.id)}
                  onCheckedChange={(checked) => handleCategoryChange(category.id, !!checked)}
                />
                <Label htmlFor={`category-${category.id}`} className="font-normal text-sm">
                  {category.name}
                </Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger className="text-base font-medium">Rango de Precios</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-4">
            <Slider
              min={0}
              max={maxPrice}
              step={priceStep}
              value={priceRange}
              onValueChange={(value) => handlePriceChange(value as [number, number])}
              className="w-full"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{formatColombianCurrency(priceRange[0])}</span>
              <span>{formatColombianCurrency(priceRange[1])}</span>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      
      <Button onClick={applyFilters} className="w-full mt-4">Aplicar Filtros</Button>
    </div>
  );
}
