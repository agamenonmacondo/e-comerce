
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const status = searchParams.get('status');
  const [message, setMessage] = useState('Gracias por tu compra.');

  useEffect(() => {
    if (orderId && status === 'success') {
      setMessage(`Tu pedido ${orderId} ha sido recibido y está siendo procesado. Te enviaremos una confirmación pronto.`);
      // Here you might typically clear the cart or perform other client-side success actions.
      // The actual order fulfillment logic (DB update, stock reduction, email) should be handled
      // by a webhook from Bold to your backend.
    } else if (status === 'pending') {
       setMessage(`Tu pago para el pedido ${orderId} está pendiente. Te notificaremos una vez se confirme.`);
    } else if (status === 'failed') {
       setMessage(`El pago para el pedido ${orderId} falló. Por favor, intenta de nuevo o contacta a soporte.`);
    }
    // Add more conditions for other statuses Bold might return
  }, [orderId, status]);

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 min-h-[60vh] flex items-center justify-center">
      <Card className="w-full max-w-lg text-center shadow-xl">
        <CardHeader>
          <CheckCircle2 className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <CardTitle className="text-3xl font-bold font-headline">
            {status === 'success' ? '¡Pedido Confirmado!' : 
             status === 'pending' ? 'Pago Pendiente' : 
             status === 'failed' ? 'Pago Fallido' : 
             'Estado del Pedido'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-lg text-muted-foreground mb-6">
            {message}
          </CardDescription>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            {status !== 'failed' && (
                 <Button asChild size="lg" className="transition-transform hover:scale-105 active:scale-95">
                    <Link href="/dashboard">Ver Mis Pedidos</Link>
                </Button>
            )}
            <Button variant="outline" size="lg" asChild className="transition-transform hover:scale-105 active:scale-95">
              <Link href="/">Continuar Comprando</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
