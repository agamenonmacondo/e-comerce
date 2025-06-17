
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle2, AlertTriangle, Clock } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  // Bold might use 'id' for their transaction_id, 'order_id' for our internal one, and 'status'
  const boldTransactionId = searchParams.get('id'); 
  const orderId = searchParams.get('order_id'); // Our internal order_id passed to Bold
  const status = searchParams.get('status')?.toUpperCase(); // e.g., APPROVED, PENDING, REJECTED, ERROR

  const [title, setTitle] = useState('Estado del Pedido');
  const [message, setMessage] = useState('Gracias por tu compra. Estamos verificando los detalles.');
  const [icon, setIcon] = useState(<Clock className="mx-auto h-16 w-16 text-yellow-500 mb-4" />);

  useEffect(() => {
    if (status === 'APPROVED') {
      setTitle('¡Pedido Confirmado!');
      setMessage(`Tu pedido ${orderId || boldTransactionId || ''} ha sido recibido y está siendo procesado. Te enviaremos una confirmación pronto.`);
      setIcon(<CheckCircle2 className="mx-auto h-16 w-16 text-green-500 mb-4" />);
      // TODO: Consider clearing the cart here if it's stored client-side
      // The actual order fulfillment (DB update, stock reduction, email)
      // should ideally be handled by a webhook from Bold to your backend.
    } else if (status === 'PENDING') {
      setTitle('Pago Pendiente');
      setMessage(`Tu pago para el pedido ${orderId || boldTransactionId || ''} está pendiente. Te notificaremos una vez se confirme.`);
      setIcon(<Clock className="mx-auto h-16 w-16 text-yellow-500 mb-4" />);
    } else if (status === 'REJECTED' || status === 'ERROR' || status === 'DECLINED') {
      setTitle('Pago Fallido');
      setMessage(`El pago para el pedido ${orderId || boldTransactionId || ''} no pudo ser procesado. Por favor, intenta de nuevo o contacta a soporte.`);
      setIcon(<AlertTriangle className="mx-auto h-16 w-16 text-destructive mb-4" />);
    } else if (orderId && !status) {
      // Fallback if Bold only redirects with orderId and no status (less likely for full redirect)
      // Or if it's our old simple success page before status parameter
      setTitle('¡Pedido Enviado a Procesar!');
      setMessage(`Tu pedido ${orderId} ha sido enviado para procesar el pago. Serás notificado sobre el estado.`);
      setIcon(<CheckCircle2 className="mx-auto h-16 w-16 text-green-500 mb-4" />);
    }
    // Add more conditions for other statuses Bold might return
  }, [orderId, boldTransactionId, status]);

  return (
    <div className="container mx-auto px-4 md:px-6 py-12 min-h-[60vh] flex items-center justify-center">
      <Card className="w-full max-w-lg text-center shadow-xl">
        <CardHeader>
          {icon}
          <CardTitle className="text-3xl font-bold font-headline">
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-lg text-muted-foreground mb-6">
            {message}
          </CardDescription>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            {(status === 'APPROVED' || status === 'PENDING' || (orderId && !status)) && (
                 <Button asChild size="lg" className="transition-transform hover:scale-105 active:scale-95">
                    <Link href="/dashboard">Ver Mis Pedidos</Link>
                </Button>
            )}
            {status === 'REJECTED' && (
                 <Button asChild size="lg" className="transition-transform hover:scale-105 active:scale-95">
                    <Link href="/cart">Volver al Carrito</Link>
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

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
