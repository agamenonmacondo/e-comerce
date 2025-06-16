// This is a placeholder for the Checkout page.
// In a real application, this would involve forms for shipping, billing, and payment.
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
import { Bitcoin, Contact, CreditCard, Home, Landmark, Lock, Truck } from 'lucide-react';
import Link from 'next/link';

const shippingFormSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  address: z.string().min(5, "Street address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().min(5, "Zip code is required"),
  country: z.string().min(2, "Country is required"),
  phone: z.string().optional(),
});

const paymentFormSchema = z.object({
  paymentMethod: z.enum(["creditCard", "paypal", "crypto"], {
    required_error: "You need to select a payment method.",
  }),
  cardNumber: z.string().optional(), // Add more specific validation if creditCard is selected
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
});

type ShippingFormValues = z.infer<typeof shippingFormSchema>;
type PaymentFormValues = z.infer<typeof paymentFormSchema>;

export default function CheckoutPage() {
  const { toast } = useToast();

  const shippingForm = useForm<ShippingFormValues>({
    resolver: zodResolver(shippingFormSchema),
    defaultValues: { fullName: '', address: '', city: '', state: '', zipCode: '', country: '' },
  });

  const paymentForm = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
  });

  function onShippingSubmit(data: ShippingFormValues) {
    console.log("Shipping data:", data);
    toast({ title: "Shipping Details Saved", description: "Proceed to payment." });
    // Move to next step or enable payment section
  }

  function onPaymentSubmit(data: PaymentFormValues) {
    console.log("Payment data:", data);
    toast({ title: "Payment Submitted", description: "Order processing (placeholder)." });
    // Simulate order placement
    // router.push('/account/orders');
  }

  // Mock order summary (in real app, this comes from cart state)
  const orderSummary = {
    subtotal: 1298.00,
    shipping: 0.00,
    tax: 103.84,
    total: 1401.84,
    items: [
      { name: 'iPhone 15 Pro', quantity: 1, price: 999.00 },
      { name: 'AirPods Pro (2nd Gen)', quantity: 1, price: 249.00 },
    ]
  };


  return (
    <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
      <h1 className="text-3xl md:text-4xl font-bold font-headline mb-8">Checkout</h1>
      <div className="grid lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          {/* Shipping Information */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-headline flex items-center"><Home className="mr-3 h-6 w-6 text-primary"/>Dirección de Envío</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...shippingForm}>
                <form onSubmit={shippingForm.handleSubmit(onShippingSubmit)} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField control={shippingForm.control} name="fullName" render={({ field }) => ( <FormItem> <FormLabel>Nombre Completo</FormLabel> <FormControl><Input placeholder="John Doe" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                    <FormField control={shippingForm.control} name="phone" render={({ field }) => ( <FormItem> <FormLabel>Teléfono (Opcional)</FormLabel> <FormControl><Input placeholder="(123) 456-7890" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                  </div>
                  <FormField control={shippingForm.control} name="address" render={({ field }) => ( <FormItem> <FormLabel>Dirección</FormLabel> <FormControl><Input placeholder="123 Main St" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                  <div className="grid sm:grid-cols-3 gap-4">
                    <FormField control={shippingForm.control} name="city" render={({ field }) => ( <FormItem> <FormLabel>Ciudad</FormLabel> <FormControl><Input placeholder="Techville" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                    <FormField control={shippingForm.control} name="state" render={({ field }) => ( <FormItem> <FormLabel>Estado / Provincia</FormLabel> <FormControl><Input placeholder="CA" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                    <FormField control={shippingForm.control} name="zipCode" render={({ field }) => ( <FormItem> <FormLabel>Código Postal</FormLabel> <FormControl><Input placeholder="90210" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                  </div>
                  <FormField control={shippingForm.control} name="country" render={({ field }) => ( <FormItem> <FormLabel>País</FormLabel> <FormControl><Input placeholder="Estados Unidos" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                  {/* <Button type="submit" className="w-full sm:w-auto">Save Shipping Info</Button> */}
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Payment Information */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-headline flex items-center"><CreditCard className="mr-3 h-6 w-6 text-primary"/>Detalles de Pago</CardTitle>
              <CardDescription>Todas las transacciones son seguras y encriptadas.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...paymentForm}>
                <form onSubmit={paymentForm.handleSubmit(onPaymentSubmit)} className="space-y-6">
                  <FormField
                    control={paymentForm.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-base">Selecciona Método de Pago</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="grid grid-cols-1 md:grid-cols-3 gap-4"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <Card className={`p-4 rounded-lg border-2 hover:border-primary transition-all w-full ${field.value === 'creditCard' ? 'border-primary bg-primary/10' : ''}`}>
                                <FormControl>
                                  <RadioGroupItem value="creditCard" id="creditCard" className="sr-only"/>
                                </FormControl>
                                <FormLabel htmlFor="creditCard" className="font-medium cursor-pointer flex items-center w-full">
                                  <Landmark className="mr-2 h-5 w-5"/> Tarjeta de Crédito
                                </FormLabel>
                              </Card>
                            </FormItem>
                             <FormItem className="flex items-center space-x-3 space-y-0">
                               <Card className={`p-4 rounded-lg border-2 hover:border-primary transition-all w-full ${field.value === 'paypal' ? 'border-primary bg-primary/10' : ''}`}>
                                <FormControl>
                                  <RadioGroupItem value="paypal" id="paypal" className="sr-only"/>
                                </FormControl>
                                <FormLabel htmlFor="paypal" className="font-medium cursor-pointer flex items-center w-full">
                                  <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M7.552 16.002c.264-.023.444-.067.63-.312.188-.246.28-.628.272-1.037-.02-.987-.59-1.482-1.627-1.482h-.896v2.83h.896c.38 0 .54-.076.725-.11zm7.756-5.404c-.07-.413-.143-.803-.28-1.153-.21-.54-.508-.93-.9-1.174-.39-.245-.88-.368-1.46-.368H9.39v10.322h2.936c.983 0 1.74-.243 2.27-.727.532-.485.798-1.22.798-2.208.002-.734-.165-1.34-.49-1.81-.328-.47-.77-.79-1.33-.96.45-.206.82-.537 1.1-.993zm-2.32 4.518c0 .69-.146 1.126-.44 1.31-.293.182-.7.274-1.22.274H11.11v-3.168h.46c.96 0 1.45.49 1.45 1.47v.114zm.12-4.24c0 .62-.14.986-.42 1.103-.28.117-.64.176-1.08.176h-.34V8.69h.34c.89 0 1.33.39 1.33 1.18v.04z"/></svg>
                                  PayPal
                                </FormLabel>
                               </Card>
                            </FormItem>
                             <FormItem className="flex items-center space-x-3 space-y-0">
                               <Card className={`p-4 rounded-lg border-2 hover:border-primary transition-all w-full ${field.value === 'crypto' ? 'border-primary bg-primary/10' : ''}`}>
                                <FormControl>
                                  <RadioGroupItem value="crypto" id="crypto" className="sr-only"/>
                                </FormControl>
                                <FormLabel htmlFor="crypto" className="font-medium cursor-pointer flex items-center w-full">
                                  <Bitcoin className="mr-2 h-5 w-5"/> Criptomoneda
                                </FormLabel>
                               </Card>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Conditional fields for credit card could be added here */}
                   <Button type="submit" size="lg" className="w-full text-base mt-8 transition-transform hover:scale-105 active:scale-95">
                    <Lock className="mr-2 h-5 w-5" /> Realizar Pedido
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="shadow-lg sticky top-24">
            <CardHeader>
              <CardTitle className="text-2xl font-headline flex items-center"><ShoppingCart className="mr-3 h-6 w-6 text-primary"/>Resumen del Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {orderSummary.items.map(item => (
                <div key={item.name} className="flex justify-between items-center text-sm">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">Cant: {item.quantity}</p>
                  </div>
                  <p>{(item.price * item.quantity).toFixed(2)} €</p>
                </div>
              ))}
              <Separator/>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{orderSummary.subtotal.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Envío</span>
                <span>{orderSummary.shipping === 0 ? 'Gratis' : `${orderSummary.shipping.toFixed(2)} €`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Impuestos</span>
                <span>{orderSummary.tax.toFixed(2)} €</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-xl">
                <span>Total</span>
                <span>{orderSummary.total.toFixed(2)} €</span>
              </div>
            </CardContent>
             <CardFooter>
                <p className="text-xs text-muted-foreground text-center w-full">
                  Al realizar tu pedido, aceptas nuestros <Link href="/terms" className="underline hover:text-primary">Términos de Servicio</Link>.
                </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
