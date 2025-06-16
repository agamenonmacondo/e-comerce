
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Home, Landmark, Lock, ShoppingCart, Copy } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Label } from '@/components/ui/label';
import { formatColombianCurrency } from '@/lib/utils';
import { products as allProductsForSummary } from '@/lib/placeholder-data';
import { placeOrder, type PlaceOrderInput } from '@/lib/actions/order.actions';
import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import type { Stripe } from '@stripe/stripe-js';

const shippingFormSchema = z.object({
  fullName: z.string().min(2, "El nombre completo es requerido"),
  address: z.string().min(5, "La dirección es requerida"),
  city: z.string().min(2, "La ciudad es requerida"),
  state: z.string().min(2, "El departamento es requerido"),
  zipCode: z.string().optional(),
  country: z.string().min(2, "El país es requerido"),
  phone: z.string().email("Por favor, introduce un correo electrónico válido para el cliente.").min(5, "El correo es requerido"),
});

const paymentFormSchema = z.object({
  paymentMethod: z.enum(["creditCard", "pse", "cash", "crypto"], {
    required_error: "Debes seleccionar un método de pago conceptual (Stripe lo gestionará).",
  }),
});

type ShippingFormValues = z.infer<typeof shippingFormSchema>;
type PaymentFormValues = z.infer<typeof paymentFormSchema>;

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
      imageUrls: item.imageUrls,
    })),
    subtotal,
    shipping,
    tax,
    total,
  };
};

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;


export default function CheckoutPage() {
  const { toast } = useToast();
  const orderSummary = calculateOrderSummary();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const shippingForm = useForm<ShippingFormValues>({
    resolver: zodResolver(shippingFormSchema),
    defaultValues: { fullName: '', address: '', city: '', state: '', zipCode: '', country: 'Colombia', phone: '' },
  });

  const paymentForm = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    defaultValues: { paymentMethod: "creditCard" }
  });

  useEffect(() => {
    if (!stripePromise) {
      console.error("Stripe.js no se cargó, probablemente debido a una clave publicable faltante o incorrecta.");
      toast({
        title: "Error de Configuración de Pago",
        description: "No se pudo inicializar Stripe. Verifica tu NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY en el archivo .env y reinicia el servidor. El botón de pago estará desactivado.",
        variant: "destructive",
        duration: Infinity, // Hace el toast persistente
      });
    }
  }, [stripePromise, toast]);


  async function handleFinalSubmit() {
    if (!stripePromise) {
      toast({ title: "Error", description: "Stripe no está configurado correctamente.", variant: "destructive"});
      return;
    }
    setIsSubmitting(true);

    const isShippingValid = await shippingForm.trigger();
    const isPaymentValid = await paymentForm.trigger();

    if (!isShippingValid) {
      toast({ title: "Error de Envío", description: "Por favor, completa los detalles de envío correctamente.", variant: "destructive" });
      setIsSubmitting(false);
      return;
    }
    if (!isPaymentValid) {
        toast({ title: "Error de Pago", description: "Por favor, selecciona un método de pago conceptual.", variant: "destructive" });
        setIsSubmitting(false);
        return;
    }

    const shippingData = shippingForm.getValues();
    const paymentData = paymentForm.getValues();

    const orderInput: PlaceOrderInput = {
      shippingDetails: {
        ...shippingData,
        phone: shippingData.phone, // Este es el correo electrónico
      },
      paymentMethod: paymentData.paymentMethod!,
      cartItems: orderSummary.items.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        stock: item.stock,
        imageUrls: item.imageUrls,
      })),
    };

    const result = await placeOrder(orderInput);

    if (result.success && result.sessionId) {
      const stripe = await stripePromise;
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId: result.sessionId });
        if (error) {
          console.error("Stripe redirectToCheckout error:", error);
          toast({ title: "Error de Redirección", description: error.message || "No se pudo redirigir a Stripe.", variant: "destructive"});
        }
      } else {
         toast({ title: "Error", description: "Stripe.js no se cargó.", variant: "destructive"});
      }
    } else {
      toast({
        title: "Problema con el Pedido",
        description: result.message || "No se pudo iniciar el proceso de pago.",
        variant: "destructive",
        duration: 7000,
      });
    }
    setIsSubmitting(false);
  }

  const selectedPaymentMethod = paymentForm.watch("paymentMethod");

  const handleCopyToClipboard = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        toast({ title: "Copiado", description: "Dirección de wallet copiada al portapapeles." });
      }).catch(err => {
        console.error('Error al copiar: ', err);
        toast({ title: "Error", description: "No se pudo copiar la dirección.", variant: "destructive" });
      });
    } else {
       toast({ title: "Error", description: "El portapapeles no está disponible en este navegador.", variant: "destructive" });
    }
  };

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
                    <FormField control={shippingForm.control} name="phone" render={({ field }) => ( <FormItem> <FormLabel>Correo Electrónico del Cliente</FormLabel> <FormControl><Input type="email" placeholder="cliente@ejemplo.com" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                  </div>
                  <FormField control={shippingForm.control} name="address" render={({ field }) => ( <FormItem> <FormLabel>Dirección (Calle, Carrera, Apto)</FormLabel> <FormControl><Input placeholder="Ej: Carrera 10 # 20-30 Apto 101" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                  <div className="grid sm:grid-cols-3 gap-4">
                    <FormField control={shippingForm.control} name="city" render={({ field }) => ( <FormItem> <FormLabel>Ciudad</FormLabel> <FormControl><Input placeholder="Ej: Bogotá D.C." {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                    <FormField control={shippingForm.control} name="state" render={({ field }) => ( <FormItem> <FormLabel>Departamento</FormLabel> <FormControl><Input placeholder="Ej: Cundinamarca" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                    <FormField control={shippingForm.control} name="zipCode" render={({ field }) => ( <FormItem> <FormLabel>Código Postal (Opcional)</FormLabel> <FormControl><Input placeholder="Ej: 110111" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                  </div>
                  <FormField control={shippingForm.control} name="country" render={({ field }) => ( <FormItem> <FormLabel>País</FormLabel> <FormControl><Input placeholder="Colombia" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-headline flex items-center"><CreditCard className="mr-3 h-6 w-6 text-primary"/>Método de Pago</CardTitle>
              <CardDescription>Serás redirigido a Stripe para completar tu pago de forma segura.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...paymentForm}>
                <form id="payment-form" className="space-y-6">
                   <FormField
                    control={paymentForm.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-base">Opciones de Pago (Gestionado por Stripe)</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-1 md:grid-cols-2 gap-4"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <Card className={`p-4 rounded-lg border-2 hover:border-primary transition-all w-full ${field.value === 'creditCard' ? 'border-primary bg-primary/10' : 'border-border'}`}>
                                <FormControl>
                                  <RadioGroupItem value="creditCard" id="creditCard" className="sr-only"/>
                                </FormControl>
                                <FormLabel htmlFor="creditCard" className="font-medium cursor-pointer flex items-center w-full">
                                  <Landmark className="mr-2 h-5 w-5"/> Tarjeta de Crédito/Débito
                                </FormLabel>
                              </Card>
                            </FormItem>
                             <FormItem className="flex items-center space-x-3 space-y-0">
                               <Card className={`p-4 rounded-lg border-2 hover:border-primary transition-all w-full ${field.value === 'pse' ? 'border-primary bg-primary/10' : 'border-border'}`}>
                                <FormControl>
                                  <RadioGroupItem value="pse" id="pse" className="sr-only"/>
                                </FormControl>
                                <FormLabel htmlFor="pse" className="font-medium cursor-pointer flex items-center w-full">
                                  <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10zm-.623-14.963h1.246v3.952h2.44V9.01h1.245v5.976h-1.245v-1.75h-2.44v3.716H9.177v-2.44H7.2V13.25h1.977v-2.261zm5.088 0h1.245v5.976h-1.245V11.01z"/></svg>
                                  PSE (Bancos)
                                </FormLabel>
                               </Card>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {selectedPaymentMethod === 'crypto' && (
                    <Card className="mt-6 bg-muted/20 border-primary/50 shadow-md">
                      <CardHeader><CardTitle className="text-xl font-headline flex items-center">Pagar con Criptomonedas (Manual)</CardTitle></CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          Escanea el QR o copia la dirección para enviar <strong className="text-foreground">{formatColombianCurrency(orderSummary.total)}</strong>.
                        </p>
                        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                          <Image src="https://placehold.co/160x160.png" alt="QR Cripto" width={160} height={160} className="rounded-lg border-2 border-primary/30 shadow-sm" data-ai-hint="qr code crypto" />
                          <div className="space-y-3 flex-grow">
                            <div>
                              <Label htmlFor="crypto-address" className="text-xs text-muted-foreground">Dirección Wallet (Ejemplo):</Label>
                              <div className="flex items-center gap-2 mt-1">
                                <Input id="crypto-address" readOnly value="0x123...cdef" className="font-mono text-xs h-9 bg-background" />
                                <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => handleCopyToClipboard("0x123...cdef")}><Copy className="h-4 w-4" /></Button>
                              </div>
                            </div>
                             <p className="text-xs text-muted-foreground pt-2"> <strong className="text-foreground">Importante:</strong> Verifica la red. Confirma la transacción.</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>
           <Button
              type="button"
              onClick={handleFinalSubmit}
              size="lg"
              className="w-full text-base mt-0 lg:mt-8 transition-transform hover:scale-105 active:scale-95"
              disabled={isSubmitting || !stripePromise || !shippingForm.formState.isValid || !paymentForm.formState.isValid}
            >
            <Lock className="mr-2 h-5 w-5" />
            {isSubmitting ? 'Procesando...' : 'Pagar con Stripe'}
          </Button>
        </div>

        <div className="lg:col-span-1">
          <Card className="shadow-lg sticky top-24">
            <CardHeader>
              <CardTitle className="text-2xl font-headline flex items-center"><ShoppingCart className="mr-3 h-6 w-6 text-primary"/>Resumen del Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {orderSummary.items.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">Cant: {item.quantity}</p>
                  </div>
                  <p>{formatColombianCurrency(item.price * item.quantity)}</p>
                </div>
              ))}
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
                <span className="text-muted-foreground">Impuestos (Aprox.)</span>
                <span>{formatColombianCurrency(orderSummary.tax)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-xl">
                <span>Total</span>
                <span>{formatColombianCurrency(orderSummary.total)}</span>
              </div>
            </CardContent>
             <CardFooter>
                <p className="text-xs text-muted-foreground text-center w-full">
                  Al continuar, serás redirigido a Stripe. Aceptas nuestros <Link href="/terms" className="underline hover:text-primary">Términos</Link>.
                </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
