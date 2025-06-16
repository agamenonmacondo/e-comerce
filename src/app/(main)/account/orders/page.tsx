'use client';

import OrderHistory from '@/components/account/OrderHistory';
import { mockOrders } from '@/lib/placeholder-data';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

export default function AccountOrdersPage() {
  const orders = mockOrders; // Using mock data

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
       <div className="flex items-center justify-between mb-8">
         <Button variant="outline" size="sm" asChild className="mb-0 md:mb-0">
          <Link href="/account">
            <ChevronLeft className="mr-1 h-4 w-4" /> Volver a la Cuenta
          </Link>
        </Button>
        <h1 className="text-3xl md:text-4xl font-bold font-headline text-right">Panel de Pedidos</h1>
      </div>
      <OrderHistory orders={orders} />
    </div>
  );
}
