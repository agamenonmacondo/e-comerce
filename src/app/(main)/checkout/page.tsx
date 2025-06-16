
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
import { CreditCard, Home, Landmark, Lock, ShoppingCart, Copy, Phone, DollarSign } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Label } from '@/components/ui/label';
import { formatColombianCurrency } from '@/lib/utils';
import { products as allProductsForSummary } from '@/lib/placeholder-data';
import { placeOrder, type PlaceOrderInput } from '@/lib/actions/order.actions';
import { useState } from 'react';
import { useRouter } from 'next/navigation';


const shippingFormSchema = z.object({
  fullName: z.string().min(2, "El nombre completo es requerido"),
  address: z.string().min(5, "La dirección es requerida"),
  city: z.string().min(2, "La ciudad es requerida"),
  state: z.string().min(2, "El departamento es requerido"),
  zipCode: z.string().optional(),
  country: z.string().min(2, "El país es requerido"),
  phone: z.string().optional(),
});

const paymentFormSchema = z.object({
  paymentMethod: z.enum(["creditCard", "pse", "cash", "crypto"], {
    required_error: "Debes seleccionar un método de pago conceptual.",
  }),
});

type ShippingFormValues = z.infer<typeof shippingFormSchema>;
type PaymentFormValues = z.infer<typeof paymentFormSchema>;

// Simulating cart items - in a real app, this would come from a cart context or state management
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
  const taxRate = 0.19; // Example tax rate
  const tax = subtotal * taxRate;
  const shipping = subtotal > 200000 ? 0 : 15000; // Example shipping cost
  const total = subtotal + tax + shipping;
  return {
    items: mockCartItems.map(item => ({ // Ensure this matches CartItemSchema in order.actions
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      stock: item.stock, // Include stock as per CartItemSchema in order.actions
      imageUrls: item.imageUrls,
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
  const orderSummary = calculateOrderSummary();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const shippingForm = useForm<ShippingFormValues>({
    resolver: zodResolver(shippingFormSchema),
    defaultValues: { fullName: '', address: '', city: '', state: '', zipCode: '', country: 'Colombia', phone: '' },
  });

  const paymentForm = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
    // Set a default value that is valid
    defaultValues: { paymentMethod: "creditCard" } 
  });

  async function handleFinalSubmit() {
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
        fullName: shippingData.fullName,
        address: shippingData.address,
        city: shippingData.city,
        state: shippingData.state,
        zipCode: shippingData.zipCode,
        country: shippingData.country,
        phone: shippingData.phone,
      },
      paymentMethod: paymentData.paymentMethod!,
      cartItems: orderSummary.items.map(item => ({ // Ensure this structure matches the server action
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        stock: item.stock, // Make sure stock is included if expected by server
        imageUrls: item.imageUrls || [],
      })),
    };

    const result = await placeOrder(orderInput);

    if (result.success) {
        toast({
            title: "Pedido Realizado (Simulación)",
            description: result.message || "Tu pedido simulado ha sido procesado.",
        });
        // Reset forms or redirect
        shippingForm.reset();
        paymentForm.reset({paymentMethod: "creditCard"}); // Reset with default
        router.push('/order/success'); 
    } else {
      toast({
        title: "Problema con el Pedido (Simulación)",
        description: result.message || "No se pudo procesar el pedido simulado.",
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
                    <FormField control={shippingForm.control} name="phone" render={({ field }) => ( <FormItem> <FormLabel>Teléfono (Opcional)</FormLabel> <FormControl><Input type="tel" placeholder="Ej: 3001234567" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                  </div>
                  <FormField control={shippingForm.control} name="address" render={({ field }) => ( <FormItem> <FormLabel>Dirección (Calle, Carrera, Apto)</FormLabel> <FormControl><Input placeholder="Ej: Carrera 10 # 20-30 Apto 101" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                  <div className="grid sm:grid-cols-3 gap-4">
                    <FormField control={shippingForm.control} name="city" render={({ field }) => ( <FormItem> <FormLabel>Ciudad</FormLabel> <FormControl><Input placeholder="Ej: Bogotá D.C." {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                    <FormField control={shippingForm.control} name="state" render={({ field }) => ( <FormItem> <FormLabel>Departamento</FormLabel> <FormControl><Input placeholder="Ej: Cundinamarca" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                    <FormField control={shippingForm.control} name="zipCode" render={({ field }) => ( <FormItem> <FormLabel>Código Postal (Opcional)</FormLabel> <FormControl><Input placeholder="Ej: 110111" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                  </div>
                  <FormField control={shippingForm.control} name="country" render={({ field }) => ( <FormItem> <FormLabel>País</FormLabel> <FormControl><Input placeholder="Colombia" {...field} defaultValue="Colombia" /></FormControl> <FormMessage /> </FormItem> )} />
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-headline flex items-center"><CreditCard className="mr-3 h-6 w-6 text-primary"/>Método de Pago (Simulación)</CardTitle>
              <CardDescription>Selecciona tu método de pago conceptual.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...paymentForm}>
                <form id="payment-form" className="space-y-6">
                   <FormField
                    control={paymentForm.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-base">Opciones de Pago</FormLabel>
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
                             <FormItem className="flex items-center space-x-3 space-y-0">
                               <Card className={`p-4 rounded-lg border-2 hover:border-primary transition-all w-full ${field.value === 'cash' ? 'border-primary bg-primary/10' : 'border-border'}`}>
                                <FormControl>
                                  <RadioGroupItem value="cash" id="cash" className="sr-only"/>
                                </FormControl>
                                <FormLabel htmlFor="cash" className="font-medium cursor-pointer flex items-center w-full">
                                 <DollarSign className="mr-2 h-5 w-5"/> Efectivo (Contraentrega)
                                </FormLabel>
                               </Card>
                            </FormItem>
                             <FormItem className="flex items-center space-x-3 space-y-0">
                               <Card className={`p-4 rounded-lg border-2 hover:border-primary transition-all w-full ${field.value === 'crypto' ? 'border-primary bg-primary/10' : 'border-border'}`}>
                                <FormControl>
                                  <RadioGroupItem value="crypto" id="crypto" className="sr-only"/>
                                </FormControl>
                                <FormLabel htmlFor="crypto" className="font-medium cursor-pointer flex items-center w-full">
                                  <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 0C4.478 0 0 4.478 0 10s4.478 10 10 10 10-4.478 10-10S15.522 0 10 0zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-.99-12.875c.308-.002.594.115.805.326l1.885 1.886a1.123 1.123 0 01.33.796v2.694a1.125 1.125 0 01-1.125 1.125h-3.75a1.125 1.125 0 01-1.125-1.125V8.287c0-.309.118-.596.33-.806l1.885-1.886c.211-.21.497-.328.805-.326zm0 1.031c-.124 0-.237.047-.322.13L7.08 8.444a.094.094 0 00-.026.067v2.694c0 .052.042.094.094.094h3.75c.052 0 .094-.042.094-.094V8.51a.094.094 0 00-.026-.067L9.392 6.578a.45.45 0 00-.322-.131zM10 12.375a.938.938 0 100 1.875.938.938 0 000-1.875z"/></svg>
                                  Criptomonedas
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
                      <CardHeader><CardTitle className="text-xl font-headline flex items-center">Pagar con Criptomonedas (Simulación)</CardTitle></CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          Para completar tu pago simulado con cripto, copia la siguiente dirección de ejemplo y envíanos la cantidad de <strong className="text-foreground">{formatColombianCurrency(orderSummary.total)}</strong>.
                        </p>
                        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                          <Image src="https://placehold.co/160x160.png" alt="QR Cripto Simulado" width={160} height={160} className="rounded-lg border-2 border-primary/30 shadow-sm" data-ai-hint="qr code crypto" />
                          <div className="space-y-3 flex-grow">
                            <div>
                              <Label htmlFor="crypto-address" className="text-xs text-muted-foreground">Dirección Wallet Ejemplo (Simulación):</Label>
                              <div className="flex items-center gap-2 mt-1">
                                <Input id="crypto-address" readOnly value="0xSimulado123...AbCdEf" className="font-mono text-xs h-9 bg-background" />
                                <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => handleCopyToClipboard("0xSimulado123...AbCdEf")}><Copy className="h-4 w-4" /></Button>
                              </div>
                            </div>
                             <p className="text-xs text-muted-foreground pt-2"> <strong className="text-foreground">Nota:</strong> Esto es solo una simulación. No envíes fondos reales.</p>
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
              disabled={isSubmitting || !shippingForm.formState.isValid || !paymentForm.formState.isValid }
            >
            <Lock className="mr-2 h-5 w-5" />
            {isSubmitting ? 'Procesando Pedido...' : 'Realizar Pedido (Simulación)'}
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
                  Al continuar, aceptas nuestros <Link href="/terms" className="underline hover:text-primary">Términos y Condiciones</Link> (Simulación).
                </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
