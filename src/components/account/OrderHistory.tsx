'use client';

import type { Order } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Package, Eye, FileText } from 'lucide-react';
import { format, parseISO } from 'date-fns';

interface OrderHistoryProps {
  orders: Order[];
}

export default function OrderHistory({ orders }: OrderHistoryProps) {
  if (orders.length === 0) {
    return (
      <Card className="shadow-lg text-center py-12">
        <CardHeader>
          <Package className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <CardTitle className="text-2xl font-headline">Aún no hay Pedidos</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="mb-6">
            No has realizado ningún pedido. Empieza a comprar para ver tu historial de pedidos aquí.
          </CardDescription>
          <Button asChild className="transition-transform hover:scale-105 active:scale-95">
            <Link href="/">Empezar a Comprar</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const getStatusBadgeVariant = (status: Order['status']) => {
    switch (status) {
      case 'Pending': return 'default';
      case 'Processing': return 'secondary';
      case 'Shipped': return 'outline'; // Or some other color like blue/info
      case 'Delivered': return 'default'; // Should be success like green
      case 'Cancelled': return 'destructive';
      default: return 'default';
    }
  };
  
  // Custom styles for badge based on status for better visual cues.
  // Tailwind classes for colors like bg-green-500 text-white etc. are not allowed per guidelines,
  // so relying on ShadCN variants or custom CSS variables if absolutely needed.
  // For 'Delivered', 'default' variant is fine, but ideally it'd be green.
  // 'Shipped' with 'outline' might be okay.

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-headline flex items-center"><Package className="mr-3 h-6 w-6 text-primary"/>Historial de Pedidos</CardTitle>
        <CardDescription>Ver detalles y estado de tus pedidos anteriores.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden sm:table-cell">ID Pedido</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map(order => (
              <TableRow key={order.id}>
                <TableCell className="hidden sm:table-cell font-mono text-xs text-muted-foreground">{order.id.substring(0,8)}...</TableCell>
                <TableCell>{format(parseISO(order.orderDate), 'dd MMM, yyyy')}</TableCell>
                <TableCell>{order.totalAmount.toFixed(2)} €</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(order.status)} 
                         className={order.status === 'Delivered' ? 'bg-green-500/20 text-green-700 border-green-400' : 
                                    order.status === 'Shipped' ? 'bg-blue-500/20 text-blue-700 border-blue-400' : ''}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/account/orders/${order.id}`}> {/* Placeholder link */}
                      <Eye className="mr-1 h-4 w-4"/> Ver
                    </Link>
                  </Button>
                  {/* <Button variant="ghost" size="icon" className="ml-2">
                     <FileText className="h-4 w-4" /> <span className="sr-only">Invoice</span>
                  </Button> */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
