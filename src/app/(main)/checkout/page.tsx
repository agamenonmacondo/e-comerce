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
import { Contact, CreditCard, Home, Landmark, Lock, Truck, ShoppingCart } from 'lucide-react'; // Added ShoppingCart
import Link from 'next/link';

const shippingFormSchema = z.object({
  fullName: z.string().min(2, "El nombre completo es requerido"),
  address: z.string().min(5, "La dirección es requerida"),
  city: z.string().min(2, "La ciudad es requerida"),
  state: z.string().min(2, "El departamento es requerido"),
  zipCode: z.string().min(3, "El código postal es requerido"), // Adjusted for Colombian postal codes
  country: z.string().min(2, "El país es requerido"),
  phone: z.string().optional(),
});

const paymentFormSchema = z.object({
  paymentMethod: z.enum(["creditCard", "pse", "cash"], { // Changed payment methods for Colombia
    required_error: "Debes seleccionar un método de pago.",
  }),
  cardNumber: z.string().optional(), 
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
});

type ShippingFormValues = z.infer<typeof shippingFormSchema>;
type PaymentFormValues = z.infer<typeof paymentFormSchema>;

// Helper function for Colombian currency
const formatColombianCurrency = (amount: number) => {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
};

export default function CheckoutPage() {
  const { toast } = useToast();

  const shippingForm = useForm<ShippingFormValues>({
    resolver: zodResolver(shippingFormSchema),
    defaultValues: { fullName: '', address: '', city: '', state: '', zipCode: '', country: 'Colombia', phone: '' },
  });

  const paymentForm = useForm<PaymentFormValues>({
    resolver: zodResolver(paymentFormSchema),
  });

  function onShippingSubmit(data: ShippingFormValues) {
    console.log("Datos de envío:", data);
    toast({ title: "Detalles de Envío Guardados", description: "Procede al pago." });
  }

  function onPaymentSubmit(data: PaymentFormValues) {
    console.log("Datos de pago:", data);
    toast({ title: "Pago Enviado", description: "Procesando pedido (simulación)." });
    // Simulate order placement
    // router.push('/account/orders');
  }

  const orderSummary = {
    subtotal: 1298000, // Example in COP
    shipping: 0,
    tax: 246620, // Example 19% IVA
    total: 1544620,
    items: [
      { name: 'iPhone 15 Pro', quantity: 1, price: 999000 },
      { name: 'AirPods Pro (2da Gen)', quantity: 1, price: 299000 },
    ]
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
                <form onSubmit={shippingForm.handleSubmit(onShippingSubmit)} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <FormField control={shippingForm.control} name="fullName" render={({ field }) => ( <FormItem> <FormLabel>Nombre Completo</FormLabel> <FormControl><Input placeholder="Ej: Ana Pérez" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                    <FormField control={shippingForm.control} name="phone" render={({ field }) => ( <FormItem> <FormLabel>Teléfono (Opcional)</FormLabel> <FormControl><Input placeholder="Ej: 3001234567" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                  </div>
                  <FormField control={shippingForm.control} name="address" render={({ field }) => ( <FormItem> <FormLabel>Dirección (Calle, Carrera, Apto)</FormLabel> <FormControl><Input placeholder="Ej: Carrera 10 # 20-30 Apto 101" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                  <div className="grid sm:grid-cols-3 gap-4">
                    <FormField control={shippingForm.control} name="city" render={({ field }) => ( <FormItem> <FormLabel>Ciudad</FormLabel> <FormControl><Input placeholder="Ej: Bogotá D.C." {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                    <FormField control={shippingForm.control} name="state" render={({ field }) => ( <FormItem> <FormLabel>Departamento</FormLabel> <FormControl><Input placeholder="Ej: Cundinamarca" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                    <FormField control={shippingForm.control} name="zipCode" render={({ field }) => ( <FormItem> <FormLabel>Código Postal (Opcional)</FormLabel> <FormControl><Input placeholder="Ej: 110111" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                  </div>
                  <FormField control={shippingForm.control} name="country" render={({ field }) => ( <FormItem> <FormLabel>País</FormLabel> <FormControl><Input placeholder="Colombia" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                  {/* <Button type="submit" className="w-full sm:w-auto">Guardar Información de Envío</Button> */}
                </form>
              </Form>
            </CardContent>
          </Card>

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
                                  <Landmark className="mr-2 h-5 w-5"/> Tarjeta de Crédito/Débito
                                </FormLabel>
                              </Card>
                            </FormItem>
                             <FormItem className="flex items-center space-x-3 space-y-0">
                               <Card className={`p-4 rounded-lg border-2 hover:border-primary transition-all w-full ${field.value === 'pse' ? 'border-primary bg-primary/10' : ''}`}>
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
                               <Card className={`p-4 rounded-lg border-2 hover:border-primary transition-all w-full ${field.value === 'cash' ? 'border-primary bg-primary/10' : ''}`}>
                                <FormControl>
                                  <RadioGroupItem value="cash" id="cash" className="sr-only"/>
                                </FormControl>
                                <FormLabel htmlFor="cash" className="font-medium cursor-pointer flex items-center w-full">
                                   <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path d="M17.08,7.85A3.51,3.51,0,0,0,13.5,5H6.5A3.51,3.51,0,0,0,3,8.5V11H2a1,1,0,0,0-1,1v3a1,1,0,0,0,1,1H18a1,1,0,0,0,1-1V12a1,1,0,0,0-1-1H16.92V8.5A3.43,3.43,0,0,0,17.08,7.85ZM15,11H5V8.5A1.5,1.5,0,0,1,6.5,7h7A1.5,1.5,0,0,1,15,8.5Zm1,3H4V13H16Z"/><circle cx="10" cy="10" r="1.5"/></svg>
                                  Efectivo (Efecty, Baloto)
                                </FormLabel>
                               </Card>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                   <Button type="submit" size="lg" className="w-full text-base mt-8 transition-transform hover:scale-105 active:scale-95">
                    <Lock className="mr-2 h-5 w-5" /> Realizar Pedido
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

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
                <span className="text-muted-foreground">Impuestos (IVA 19%)</span>
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
                  Al realizar tu pedido, aceptas nuestros <Link href="/terms" className="underline hover:text-primary">Términos de Servicio</Link>.
                </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
