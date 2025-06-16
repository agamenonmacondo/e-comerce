
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
// import { useSearchParams } from 'next/navigation'; // To get session_id if needed later

export default function OrderSuccessPage() {
  // const searchParams = useSearchParams();
  // const sessionId = searchParams.get('session_id');

  // In a real app, you might:
  // 1. Use the sessionId to fetch order details from your backend (which verified with Stripe).
  // 2. Display a summary of the order.
  // 3. Clear the cart.

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 min-h-[60vh] flex items-center justify-center">
      <Card className="w-full max-w-lg text-center shadow-xl">
        <CardHeader>
          <CheckCircle2 className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <CardTitle className="text-3xl font-bold font-headline">¡Pago Exitoso!</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-lg text-muted-foreground mb-6">
            Tu pedido ha sido procesado correctamente. Recibirás un correo electrónico de confirmación en breve.
          </CardDescription>
          {/* {sessionId && <p className="text-sm text-muted-foreground">ID de Sesión: {sessionId}</p>} */}
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="transition-transform hover:scale-105 active:scale-95">
              <Link href="/dashboard">Ver Mis Pedidos</Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="transition-transform hover:scale-105 active:scale-95">
              <Link href="/">Continuar Comprando</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
