
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { categories } from '@/lib/placeholder-data';
import { PackagePlus, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

const addProductFormSchema = z.object({
  name: z.string().min(3, "El nombre del producto es requerido (mín. 3 caracteres)."),
  description: z.string().min(10, "La descripción es requerida (mín. 10 caracteres)."),
  price: z.coerce.number().positive("El precio debe ser un número positivo."),
  stock: z.coerce.number().int().min(0, "El stock no puede ser negativo."),
  categoryId: z.string({ required_error: "Debes seleccionar una categoría." }),
  imageUrl1: z.string().url({ message: "Por favor, introduce una URL de imagen válida." }).or(z.literal('')),
  imageUrl2: z.string().url({ message: "Por favor, introduce una URL de imagen válida." }).optional().or(z.literal('')),
});

type AddProductFormValues = z.infer<typeof addProductFormSchema>;

export default function AddProductPage() {
  const { toast } = useToast();

  const form = useForm<AddProductFormValues>({
    resolver: zodResolver(addProductFormSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      categoryId: undefined,
      imageUrl1: '',
      imageUrl2: '',
    },
  });

  function onSubmit(data: AddProductFormValues) {
    console.log("Datos del nuevo producto (simulación):", data);
    // En una aplicación real, aquí enviarías los datos al backend para crear el producto.
    // También se generaría un ID único para el producto.
    // Las imágenes podrían subirse a un servicio de almacenamiento.

    toast({
      title: "Producto Añadido (Simulación)",
      description: `"${data.name}" ha sido añadido. Esto es una simulación y el producto no se guardará permanentemente.`,
    });
    form.reset(); // Limpiar el formulario después del envío
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
      <div className="flex items-center justify-between mb-8">
         <Button variant="outline" size="sm" asChild className="mb-0 md:mb-0">
            <Link href="/admin/dashboard">
                <ChevronLeft className="mr-1 h-4 w-4" /> Volver al Dashboard
            </Link>
        </Button>
        <h1 className="text-3xl md:text-4xl font-bold font-headline text-right flex items-center">
          <PackagePlus className="mr-3 h-8 w-8 text-primary" />
          Añadir Nuevo Producto
        </h1>
      </div>

      <Card className="shadow-xl max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Detalles del Producto</CardTitle>
          <CardDescription>Completa la información para añadir un nuevo producto al catálogo (simulación).</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre del Producto</FormLabel>
                    <FormControl><Input placeholder="Ej: iPhone 15 Pro Max" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl><Textarea placeholder="Describe las características principales del producto..." {...field} rows={4} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid sm:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Precio (COP)</FormLabel>
                      <FormControl><Input type="number" placeholder="Ej: 4500000" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="stock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock Inicial</FormLabel>
                      <FormControl><Input type="number" placeholder="Ej: 50" {...field} min="0" /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoría</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona una categoría" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="imageUrl1"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL de Imagen Principal</FormLabel>
                    <FormControl><Input placeholder="https://ejemplo.com/imagen_principal.png" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="imageUrl2"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL de Imagen Secundaria (Opcional)</FormLabel>
                    <FormControl><Input placeholder="https://ejemplo.com/imagen_secundaria.png" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" size="lg" className="w-full transition-transform hover:scale-105 active:scale-95">
                <PackagePlus className="mr-2 h-5 w-5" /> Añadir Producto (Simulación)
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
