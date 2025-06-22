
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Home, Lock, ShoppingCart, Mail, CreditCard, Bitcoin } from 'lucide-react';
import Link from 'next/link';
import { formatColombianCurrency } from '@/lib/utils';
import { products as allProductsForSummary } from '@/lib/placeholder-data';
import { placeOrder, PlaceOrderInput } from '@/lib/actions/order.actions';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const shippingFormSchema = z.object({
  fullName: z.string().min(2, "El nombre completo es requerido (mín. 2 caracteres)."),
  address: z.string().min(5, "La dirección es requerida (mín. 5 caracteres)."),
  city: z.string().min(2, "La ciudad es requerida (mín. 2 caracteres)."),
  state: z.string().min(2, "El departamento es requerido (mín. 2 caracteres)."),
  zipCode: z.string().optional(),
  country: z.string().min(2, "El país es requerido (mín. 2 caracteres).").default('Colombia'),
  email: z.string().email("Debe ser un correo electrónico válido."), 
});

type ShippingFormValues = z.infer<typeof shippingFormSchema>;

const mockCartItems = [
  { ...allProductsForSummary[0], quantity: 1, imageUrls: allProductsForSummary[0].imageUrls.slice(0,1) },
  { ...allProductsForSummary[4], quantity: 1, imageUrls: allProductsForSummary[4].imageUrls.slice(0,1) },
].map(item => ({
  id: item.id,
  name: item.name,
  quantity: item.quantity,
  price: item.price,
  stock: item.stock, 
  imageUrls: item.imageUrls,
}));

const calculateOrderSummary = () => {
  if (mockCartItems.length === 0) {
    return { items: [], subtotal: 0, shipping: 0, tax: 0, total: 0 };
  }
  const subtotal = mockCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const taxRate = 0.19; 
  const tax = subtotal * taxRate;
  const shipping = subtotal > 200000 ? 0 : 15000; 
  const total = subtotal + tax + shipping;
  return {
    items: mockCartItems.map(item => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      stock: item.stock,
      imageUrls: item.imageUrls || [],
    })),
    subtotal,
    shipping,
    tax,
    total,
  };
};

export default function CheckoutPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [orderSummary, setOrderSummary] = useState(calculateOrderSummary());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'bold' | 'coinbase'>('bold');

  const shippingForm = useForm<ShippingFormValues>({
    resolver: zodResolver(shippingFormSchema),
    defaultValues: { fullName: '', address: '', city: '', state: '', zipCode: '', country: 'Colombia', email: '' },
    mode: 'onChange', 
  });

  useEffect(() => {
    setOrderSummary(calculateOrderSummary());
    if (mockCartItems.length === 0) {
      toast({
        title: "Carrito Vacío",
        description: "No puedes proceder al pago con un carrito vacío. Añade algunos productos.",
        variant: "destructive"
      });
      router.push('/cart');
    }
  }, [router, toast]);

  async function handleFinalSubmit() {
    setIsSubmitting(true);

    const isShippingValid = await shippingForm.trigger();
    if (!isShippingValid) {
      toast({ title: "Información Incompleta", description: "Por favor, completa los detalles de envío correctamente.", variant: "destructive" });
      setIsSubmitting(false);
      return;
    }
    
    if (orderSummary.items.length === 0) {
      toast({ title: "Carrito Vacío", description: "Tu carrito está vacío.", variant: "destructive" });
      setIsSubmitting(false);
      return;
    }

    const shippingData = shippingForm.getValues();

    const orderInput: PlaceOrderInput = {
      shippingDetails: shippingData,
      cartItems: orderSummary.items.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        stock: item.stock,
        imageUrls: item.imageUrls,
      })),
      paymentMethod: paymentMethod,
      totalAmount: orderSummary.total,
    };

    const result = await placeOrder(orderInput);

    if (result.success) {
      if (result.redirectUrl) {
        // Coinbase flow: Redirect to payment gateway
        window.location.href = result.redirectUrl;
      } else if (result.orderId) {
        // Bold (simulated) flow: Redirect to our success page
        toast({
            title: "¡Pedido Realizado con Éxito!",
            description: result.message || `Tu pedido ${result.orderId} ha sido procesado.`,
        });
        router.push(`/order/success?order_id=${result.orderId}`);
      }
    } else {
      toast({
        title: "Problema con el Pedido",
        description: result.message || "No se pudo procesar el pedido. Inténtalo de nuevo o contacta a soporte.",
        variant: "destructive",
        duration: 7000,
      });
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
      <h1 className="text-3xl md:text-4xl font-bold font-headline mb-8">Finalizar Compra</h1>
      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-headline flex items-center"><Home className="mr-3 h-6 w-6 text-primary"/>Dirección de Envío</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...shippingForm}>
                <form id="shipping-form" className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField control={shippingForm.control} name="fullName" render={({ field }) => ( <FormItem> <FormLabel>Nombre Completo</FormLabel> <FormControl><Input placeholder="Ej: Ana Pérez" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                    <FormField control={shippingForm.control} name="email" render={({ field }) => ( <FormItem> <FormLabel className="flex items-center"><Mail className="mr-2 h-4 w-4 text-muted-foreground"/>Correo Electrónico</FormLabel> <FormControl><Input type="email" placeholder="tu@correo.com" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                  </div>
                  <FormField control={shippingForm.control} name="address" render={({ field }) => ( <FormItem> <FormLabel>Dirección (Calle, Carrera, Apto)</FormLabel> <FormControl><Input placeholder="Ej: Carrera 10 # 20-30 Apto 101" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                  <div className="grid sm:grid-cols-3 gap-4">
                    <FormField control={shippingForm.control} name="city" render={({ field }) => ( <FormItem> <FormLabel>Ciudad</FormLabel> <FormControl><Input placeholder="Ej: Bogotá D.C." {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                    <FormField control={shippingForm.control} name="state" render={({ field }) => ( <FormItem> <FormLabel>Departamento</FormLabel> <FormControl><Input placeholder="Ej: Cundinamarca" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                    <FormField control={shippingForm.control} name="zipCode" render={({ field }) => ( <FormItem> <FormLabel>Código Postal (Opcional)</FormLabel> <FormControl><Input placeholder="Ej: 110111" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                  </div>
                  <FormField control={shippingForm.control} name="country" render={({ field }) => ( <FormItem> <FormLabel>País</FormLabel> <FormControl><Input {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                </form>
              </Form>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-headline flex items-center"><CreditCard className="mr-3 h-6 w-6 text-primary"/>Método de Pago</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={paymentMethod}
                onValueChange={(value: 'bold' | 'coinbase') => setPaymentMethod(value)}
                className="grid grid-cols-1 gap-4"
              >
                <Label htmlFor="payment-bold" className="flex items-center gap-4 rounded-md border p-4 hover:bg-accent cursor-pointer has-[:checked]:border-primary transition-all">
                  <RadioGroupItem value="bold" id="payment-bold" />
                  <div className="flex items-center gap-2 font-medium">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <span>Tarjeta/PSE (Simulado con Bold)</span>
                  </div>
                </Label>
                <Label htmlFor="payment-coinbase" className="flex items-center gap-4 rounded-md border p-4 hover:bg-accent cursor-pointer has-[:checked]:border-primary transition-all">
                  <RadioGroupItem value="coinbase" id="payment-coinbase" />
                  <div className="flex items-center gap-2 font-medium">
                    <Bitcoin className="h-5 w-5 text-muted-foreground" />
                    <span>Criptomonedas (Coinbase)</span>
                  </div>
                </Label>
              </RadioGroup>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card className="shadow-lg sticky top-24">
            <CardHeader>
              <CardTitle className="text-2xl font-headline flex items-center"><ShoppingCart className="mr-3 h-6 w-6 text-primary"/>Resumen del Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {orderSummary.items.length > 0 ? orderSummary.items.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">Cant: {item.quantity}</p>
                  </div>
                  <p>{formatColombianCurrency(item.price * item.quantity)}</p>
                </div>
              )) : <p className="text-sm text-muted-foreground">Tu carrito está vacío.</p>}
              <Separator/>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatColombianCurrency(orderSummary.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Envío</span>
                <span>{orderSummary.shipping === 0 ? 'Gratis' : formatColombianCurrency(orderSummary.shipping)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Impuestos ({(0.19 * 100).toFixed(0)}%)</span>
                <span>{formatColombianCurrency(orderSummary.tax)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-xl">
                <span>Total</span>
                <span>{formatColombianCurrency(orderSummary.total)}</span>
              </div>
            </CardContent>
            <CardFooter className="flex-col space-y-4">
              <Button
                type="button"
                onClick={handleFinalSubmit}
                size="lg"
                className="w-full text-base transition-transform hover:scale-105 active:scale-95"
                disabled={isSubmitting || !shippingForm.formState.isValid || orderSummary.items.length === 0}
              >
                <Lock className="mr-2 h-5 w-5" />
                 {isSubmitting ? 'Procesando...' : (paymentMethod === 'coinbase' ? 'Continuar a Coinbase' : 'Realizar Pedido')}
              </Button>
              <p className="text-xs text-muted-foreground text-center w-full">
                {paymentMethod === 'coinbase' 
                  ? 'Serás redirigido a Coinbase para completar tu pago de forma segura.'
                  : 'Tu pago será procesado de forma segura (simulación).'
                }
              </p>
              <p className="text-xs text-muted-foreground text-center w-full">
                Al continuar, aceptas nuestros <Link href="/terms" className="underline hover:text-primary">Términos y Condiciones</Link>.
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
