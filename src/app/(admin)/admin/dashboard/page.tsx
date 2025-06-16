
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { products as initialProducts } from '@/lib/placeholder-data';
import type { Product } from '@/types';
import { DollarSign, ShoppingBag, Package, Users, BarChart3, Save, PlusCircle, Eye, ListChecks, UserPlus, TrendingUp } from 'lucide-react';
import { formatColombianCurrency } from '@/lib/utils';
import Link from 'next/link';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Badge } from '@/components/ui/badge';


interface AdminProduct extends Product {
  currentStock: number;
  newStockInput: string;
}

export default function AdminDashboardPage() {
  const { toast } = useToast();
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedStat, setSelectedStat] = useState<string | null>(null);

  useEffect(() => {
    setProducts(
      initialProducts.map(p => ({
        ...p,
        currentStock: p.stock,
        newStockInput: p.stock.toString(),
      }))
    );
  }, []);

  const handleStockInputChange = (productId: string, value: string) => {
    setProducts(prevProducts =>
      prevProducts.map(p =>
        p.id === productId ? { ...p, newStockInput: value } : p
      )
    );
  };

  const handleUpdateStock = (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const newStock = parseInt(product.newStockInput, 10);
    if (isNaN(newStock) || newStock < 0) {
      toast({
        title: 'Error de Stock',
        description: 'Por favor, introduce un número válido para el stock.',
        variant: 'destructive',
      });
      return;
    }

    setProducts(prevProducts =>
      prevProducts.map(p =>
        p.id === productId ? { ...p, currentStock: newStock, stock: newStock } : p
      )
    );

    toast({
      title: 'Inventario Actualizado (Simulación)',
      description: `El stock para ${product.name} ha sido ajustado a ${newStock}. (Esto es una simulación y no persistirá).`,
    });
  };

  const totalSales = 125800000;
  const totalOrders = 342;
  const newCustomers = 58;
  const lowStockItemsCount = products.filter(p => p.currentStock < 10).length;
  const lowStockProductsDetail = products.filter(p => p.currentStock < 10);

  const openDetailModal = (statType: string) => {
    setSelectedStat(statType);
    setIsDetailModalOpen(true);
  };

  const renderModalContent = () => {
    if (!selectedStat) return null;

    switch (selectedStat) {
      case 'sales':
        return (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center"><TrendingUp className="mr-2 h-5 w-5 text-primary" />Detalle de Ventas Totales (Mes)</DialogTitle>
              <DialogDescription>Un desglose de las ventas de este mes.</DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-3 text-sm py-4">
              <p><strong>Productos más vendidos (ejemplo):</strong></p>
              <ul className="list-disc pl-6 space-y-1">
                <li>iPhone 15 Pro: {formatColombianCurrency(50000000)}</li>
                <li>Galaxy S24 Ultra: {formatColombianCurrency(30000000)}</li>
                <li>AirPods Pro (2da Gen): {formatColombianCurrency(15000000)}</li>
                <li>Otros: {formatColombianCurrency(totalSales - 95000000)}</li>
              </ul>
              <p className="mt-3"><strong>Desglose por método de pago (ejemplo):</strong></p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Tarjeta de Crédito/Débito: 70%</li>
                <li>PSE (Transferencias Bancarias): 20%</li>
                <li>Efectivo (Puntos de pago): 10%</li>
              </ul>
            </div>
          </>
        );
      case 'orders':
        return (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center"><ListChecks className="mr-2 h-5 w-5 text-primary" />Detalle de Pedidos Totales (Mes)</DialogTitle>
              <DialogDescription>Estado y lista de pedidos recientes.</DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-3 text-sm py-4">
              <p><strong>Resumen de estados (ejemplo):</strong></p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Entregados: {Math.floor(totalOrders * 0.85)}</li>
                <li>Enviados: {Math.floor(totalOrders * 0.10)}</li>
                <li>Procesando: {totalOrders - Math.floor(totalOrders * 0.85) - Math.floor(totalOrders * 0.10)}</li>
              </ul>
              <p className="mt-3"><strong>Últimos pedidos (ejemplo):</strong></p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID Pedido</TableHead><TableHead>Cliente</TableHead><TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow><TableCell>#ORD789</TableCell><TableCell>Carlos Villa</TableCell><TableCell>{formatColombianCurrency(250000)}</TableCell></TableRow>
                  <TableRow><TableCell>#ORD788</TableCell><TableCell>Lucia Mora</TableCell><TableCell>{formatColombianCurrency(4800000)}</TableCell></TableRow>
                  <TableRow><TableCell>#ORD787</TableCell><TableCell>Pedro Gómez</TableCell><TableCell>{formatColombianCurrency(120000)}</TableCell></TableRow>
                </TableBody>
              </Table>
            </div>
          </>
        );
      case 'customers':
        return (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center"><UserPlus className="mr-2 h-5 w-5 text-primary" />Detalle de Nuevos Clientes (Mes)</DialogTitle>
              <DialogDescription>Clientes registrados recientemente.</DialogDescription>
            </DialogHeader>
            <div className="mt-4 space-y-3 text-sm py-4">
              <p><strong>Clientes nuevos (ejemplo):</strong></p>
              <ul className="list-disc pl-6 space-y-1">
                {[...Array(5)].map((_, i) => (
                  <li key={i}>Cliente Ejemplo {i + 1} - Registrado el {new Date(Date.now() - i * 2 * 24 * 60 * 60 * 1000).toLocaleDateString('es-CO')}</li>
                ))}
              </ul>
            </div>
          </>
        );
      case 'lowStock':
        return (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center"><Package className="mr-2 h-5 w-5 text-destructive" />Detalle de Productos Bajos en Stock</DialogTitle>
              <DialogDescription>Productos con menos de 10 unidades disponibles.</DialogDescription>
            </DialogHeader>
            <div className="mt-4 text-sm py-4">
              {lowStockProductsDetail.length > 0 ? (
                <Table>
                  <TableHeader><TableRow><TableHead>Producto</TableHead><TableHead className="text-right">Stock Actual</TableHead></TableRow></TableHeader>
                  <TableBody>
                    {lowStockProductsDetail.map(p => (
                      <TableRow key={p.id}><TableCell>{p.name}</TableCell><TableCell className="text-right">{p.currentStock}</TableCell></TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (<p>¡Excelente! No hay productos bajos en stock actualmente.</p>)}
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold font-headline flex items-center">
          <BarChart3 className="mr-3 h-8 w-8 text-primary" />
          Panel de Administración
        </h1>
        <p className="text-muted-foreground">Gestiona tu tienda GigaGO.</p>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold font-headline mb-6">Estadísticas Clave</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <DialogTrigger asChild>
            <Card className="shadow-md hover:shadow-lg transition-shadow cursor-pointer" onClick={() => openDetailModal('sales')}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Ventas Totales (Mes)</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatColombianCurrency(totalSales)}</div>
                <p className="text-xs text-muted-foreground">+15.3% desde el mes pasado</p>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogTrigger asChild>
            <Card className="shadow-md hover:shadow-lg transition-shadow cursor-pointer" onClick={() => openDetailModal('orders')}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pedidos Totales (Mes)</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+{totalOrders}</div>
                <p className="text-xs text-muted-foreground">+8.1% desde el mes pasado</p>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogTrigger asChild>
            <Card className="shadow-md hover:shadow-lg transition-shadow cursor-pointer" onClick={() => openDetailModal('customers')}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Nuevos Clientes (Mes)</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+{newCustomers}</div>
                <p className="text-xs text-muted-foreground">Registrados este mes</p>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogTrigger asChild>
            <Card className="shadow-md hover:shadow-lg transition-shadow cursor-pointer" onClick={() => openDetailModal('lowStock')}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Productos Bajos en Stock</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${lowStockItemsCount > 0 ? 'text-destructive' : ''}`}>{lowStockItemsCount}</div>
                <p className="text-xs text-muted-foreground">Menos de 10 unidades</p>
              </CardContent>
            </Card>
          </DialogTrigger>
        </div>
      </section>

      <section>
        <Card className="shadow-xl">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-2xl font-headline flex items-center">
                <Package className="mr-3 h-6 w-6 text-primary" />
                Ajustar Stock de Productos Existentes (Simulación)
              </CardTitle>
              <Button asChild>
                <Link href="/admin/products/add">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Añadir Nuevo Producto
                </Link>
              </Button>
            </div>
            <CardDescription>
              Visualiza y ajusta el stock de tus productos. Los cambios aquí son solo para demostración y no persistirán.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead className="w-32 text-center">Stock Actual</TableHead>
                  <TableHead className="w-48 text-center">Ajustar Stock</TableHead>
                  <TableHead className="w-32 text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map(product => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="font-medium">{product.name}</div>
                      <div className="text-xs text-muted-foreground">{product.category.name}</div>
                    </TableCell>
                    <TableCell className="text-center font-semibold">{product.currentStock}</TableCell>
                    <TableCell className="text-center">
                      <Input
                        type="number"
                        value={product.newStockInput}
                        onChange={e => handleStockInputChange(product.id, e.target.value)}
                        className="h-9 text-center"
                        min="0"
                        aria-label={`Nuevo stock para ${product.name}`}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleUpdateStock(product.id)}
                        className="transition-transform hover:scale-105 active:scale-95"
                      >
                        <Save className="mr-1.5 h-3.5 w-3.5" />
                        Guardar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>

      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="sm:max-w-lg overflow-y-auto max-h-[80vh]">
          {/* DialogHeader is rendered inside renderModalContent now */}
          {renderModalContent()}
          <DialogFooter className="sm:justify-end pt-4">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cerrar
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

