
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';

export default function OrderSuccessPage() {
  return (
    <div className="container mx-auto px-4 md:px-6 py-12 min-h-[60vh] flex items-center justify-center">
      <Card className="w-full max-w-lg text-center shadow-xl">
        <CardHeader>
          <CheckCircle2 className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <CardTitle className="text-3xl font-bold font-headline">¡Pedido Confirmado (Simulación)!</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-lg text-muted-foreground mb-6">
            Tu pedido simulado ha sido procesado correctamente. En una aplicación real, recibirías un correo de confirmación.
          </CardDescription>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="transition-transform hover:scale-105 active:scale-95">
              <Link href="/dashboard">Ver Mis Pedidos (Simulados)</Link>
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
