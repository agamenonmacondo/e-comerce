
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
import { products as allProductsForSummary } from '@/lib/placeholder-data'; // Renamed to avoid conflict if needed
import { placeOrder, type PlaceOrderInput } from '@/lib/actions/order.actions'; // Import the server action
import { useState } from 'react';


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
    required_error: "Debes seleccionar un método de pago.",
  }),
  cardNumber: z.string().optional(), 
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
});

type ShippingFormValues = z.infer<typeof shippingFormSchema>;
type PaymentFormValues = z.infer<typeof paymentFormSchema>;

// Mocked cart items for summary, ideally this would come from a global state or context
const mockCartItems = [
  { id: allProductsForSummary[0].id, name: allProductsForSummary[0].name, quantity: 1, price: allProductsForSummary[0].price, stock: allProductsForSummary[0].stock, imageUrls: allProductsForSummary[0].imageUrls, category: allProductsForSummary[0].category, description: allProductsForSummary[0].description, createdAt: allProductsForSummary[0].createdAt, updatedAt: allProductsForSummary[0].updatedAt },
  { id: allProductsForSummary[4].id, name: allProductsForSummary[4].name, quantity: 1, price: allProductsForSummary[4].price, stock: allProductsForSummary[4].stock, imageUrls: allProductsForSummary[4].imageUrls, category: allProductsForSummary[4].category, description: allProductsForSummary[4].description, createdAt: allProductsForSummary[4].createdAt, updatedAt: allProductsForSummary[4].updatedAt },
];

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
      stock: item.stock, // Pass stock for the action to check
    })),
    subtotal,
    shipping,
    tax,
    total,
  };
};


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
    // Default payment method can be set here if desired
    defaultValues: { paymentMethod: undefined }
  });

  const selectedPaymentMethod = paymentForm.watch("paymentMethod");

  async function handleFinalSubmit() {
    setIsSubmitting(true);
    // Trigger validation for both forms
    const isShippingValid = await shippingForm.trigger();
    const isPaymentValid = await paymentForm.trigger();

    if (!isShippingValid) {
      toast({ title: "Error de Envío", description: "Por favor, completa los detalles de envío.", variant: "destructive" });
      setIsSubmitting(false);
      return;
    }
    if (!isPaymentValid) {
        toast({ title: "Error de Pago", description: "Por favor, selecciona un método de pago.", variant: "destructive" });
        setIsSubmitting(false);
        return;
    }
    
    const shippingData = shippingForm.getValues();
    const paymentData = paymentForm.getValues();

    const orderInput: PlaceOrderInput = {
      shippingDetails: shippingData,
      paymentMethod: paymentData.paymentMethod!, // paymentMethod is required by schema if form is valid
      cartItems: orderSummary.items, // Pass cart items from summary
    };
    
    const result = await placeOrder(orderInput);

    if (result.success) {
      toast({ 
        title: "Pedido Enviado (Simulación)", 
        description: result.message,
        duration: 5000,
      });
      // Here you would typically redirect to an order confirmation page
      // e.g., router.push(`/order-confirmation?orderId=${result.orderId}`);
      // For now, we can reset forms or navigate away
      shippingForm.reset();
      paymentForm.reset();
      // Potentially clear cart from client-side state here
    } else {
      toast({
        title: "Problema con el Pedido",
        description: result.message,
        variant: "destructive",
        duration: 7000,
      });
    }
    setIsSubmitting(false);
  }


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
                <form id="shipping-form" className="space-y-4"> {/* Removed onSubmit here */}
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
                  <FormField control={shippingForm.control} name="country" render={({ field }) => ( <FormItem> <FormLabel>País</FormLabel> <FormControl><Input placeholder="Colombia" {...field} defaultValue="Colombia" /></FormControl> <FormMessage /> </FormItem> )} />
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
                 {/* Removed onSubmit from form tag, will be handled by the main button */}
                <form id="payment-form" className="space-y-6">
                  <FormField
                    control={paymentForm.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel className="text-base">Selecciona Método de Pago</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={(value) => {
                              field.onChange(value);
                              if (value !== 'creditCard') {
                                paymentForm.resetField("cardNumber");
                                paymentForm.resetField("expiryDate");
                                paymentForm.resetField("cvv");
                              }
                            }}
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
                                   <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path d="M17.08,7.85A3.51,3.51,0,0,0,13.5,5H6.5A3.51,3.51,0,0,0,3,8.5V11H2a1,1,0,0,0-1,1v3a1,1,0,0,0,1,1H18a1,1,0,0,0,1-1V12a1,1,0,0,0-1-1H16.92V8.5A3.43,3.43,0,0,0,17.08,7.85ZM15,11H5V8.5A1.5,1.5,0,0,1,6.5,7h7A1.5,1.5,0,0,1,15,8.5Zm1,3H4V13H16Z"/><circle cx="10" cy="10" r="1.5"/></svg>
                                  Efectivo (Efecty, Baloto)
                                </FormLabel>
                               </Card>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                               <Card className={`p-4 rounded-lg border-2 hover:border-primary transition-all w-full ${field.value === 'crypto' ? 'border-primary bg-primary/10' : 'border-border'}`}>
                                <FormControl>
                                  <RadioGroupItem value="crypto" id="crypto" className="sr-only"/>
                                </FormControl>
                                <FormLabel htmlFor="crypto" className="font-medium cursor-pointer flex items-center w-full">
                                  <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 0C4.478 0 0 4.478 0 10s4.478 10 10 10 10-4.478 10-10S15.522 0 10 0zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/>
                                    <path d="M10 3.658c-.838 0-1.59.192-2.278.537l.694 1.194c.43-.237.925-.377 1.442-.377.93 0 1.737.443 2.205 1.135l.756-1.103C11.987 4.11 11.047 3.658 10 3.658zm2.664 3.248c-.468-.692-1.275-1.135-2.205-1.135-.517 0-1.012.14-1.442.377l-.694-1.194C9.022 4.57 9.5 4.423 10 4.423c1.115 0 2.11.538 2.778 1.358L10.95 7.754l1.714-.848zM6.006 7.417l-.756 1.103c.462.346.86.777 1.17 1.27L7.14 8.635a3.455 3.455 0 0 0-.48-.682 3.423 3.423 0 0 0-.654-.536zm5.064 4.69c.838 0 1.59-.192 2.278-.537l-.694-1.194c-.43-.237-.925-.377 1.442-.377-.93 0-1.737-.443-2.205-1.135l-.756 1.103C8.013 11.89 8.953 12.342 10 12.342c.362 0 .71-.054 1.07-.158v.001zm2.924-3.097c-.31-.493-.708-.924-1.17-1.27l-.72 1.155c.338.21.62.47.832.768l.916-.453a3.423 3.423 0 0 0 .142-.2zm-6.216-.818c.212-.298.494-.558.832-.768l-.72-1.155c-.462.346-.86.777-1.17 1.27l.916.453a3.42 3.42 0 0 0 .142-.2z"/>
                                  </svg>
                                  Criptomonedas
                                </FormLabel>
                               </Card>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage /> {/* For paymentMethod field itself */}
                      </FormItem>
                    )}
                  />
                   {selectedPaymentMethod === 'creditCard' && (
                     <div className="space-y-4">
                        <FormField control={paymentForm.control} name="cardNumber" render={({ field }) => ( <FormItem> <FormLabel>Número de Tarjeta</FormLabel> <FormControl><Input placeholder="**** **** **** ****" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                        <div className="grid grid-cols-2 gap-4">
                        <FormField control={paymentForm.control} name="expiryDate" render={({ field }) => ( <FormItem> <FormLabel>Fecha de Expiración</FormLabel> <FormControl><Input placeholder="MM/AA" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                        <FormField control={paymentForm.control} name="cvv" render={({ field }) => ( <FormItem> <FormLabel>CVV</FormLabel> <FormControl><Input placeholder="123" {...field} /></FormControl> <FormMessage /> </FormItem> )} />
                        </div>
                     </div>
                   )}

                  {selectedPaymentMethod === 'crypto' && (
                    <Card className="mt-6 bg-muted/20 border-primary/50 shadow-md">
                      <CardHeader>
                        <CardTitle className="text-xl font-headline flex items-center">
                          <svg className="mr-2 h-5 w-5 text-primary" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10 0C4.478 0 0 4.478 0 10s4.478 10 10 10 10-4.478 10-10S15.522 0 10 0zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/>
                            <path d="M10 3.658c-.838 0-1.59.192-2.278.537l.694 1.194c.43-.237.925-.377 1.442-.377.93 0 1.737.443 2.205 1.135l.756-1.103C11.987 4.11 11.047 3.658 10 3.658zm2.664 3.248c-.468-.692-1.275-1.135-2.205-1.135-.517 0-1.012.14-1.442.377l-.694-1.194C9.022 4.57 9.5 4.423 10 4.423c1.115 0 2.11.538 2.778 1.358L10.95 7.754l1.714-.848zM6.006 7.417l-.756 1.103c.462.346.86.777 1.17 1.27L7.14 8.635a3.455 3.455 0 0 0-.48-.682 3.423 3.423 0 0 0-.654-.536zm5.064 4.69c.838 0 1.59-.192 2.278-.537l-.694-1.194c-.43-.237-.925-.377 1.442-.377-.93 0-1.737-.443-2.205-1.135l-.756 1.103C8.013 11.89 8.953 12.342 10 12.342c.362 0 .71-.054 1.07-.158v.001zm2.924-3.097c-.31-.493-.708-.924-1.17-1.27l-.72 1.155c.338.21.62.47.832.768l.916-.453a3.423 3.423 0 0 0 .142-.2zm-6.216-.818c.212-.298.494-.558.832-.768l-.72-1.155c-.462.346-.86.777-1.17 1.27l.916.453a3.42 3.42 0 0 0 .142-.2z"/>
                          </svg>
                          Pagar con Criptomonedas
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          Escanea el código QR o copia la dirección para enviar el equivalente de <strong className="text-foreground">{formatColombianCurrency(orderSummary.total)}</strong> en tu criptomoneda preferida (ej. BTC, ETH, USDC).
                        </p>
                        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
                          <Image
                            src="https://placehold.co/160x160.png"
                            alt="Código QR para pago con criptomonedas"
                            width={160}
                            height={160}
                            className="rounded-lg border-2 border-primary/30 shadow-sm"
                            data-ai-hint="qr code payment"
                          />
                          <div className="space-y-3 flex-grow">
                            <div>
                              <Label htmlFor="crypto-address" className="text-xs text-muted-foreground">Dirección de Wallet (Ejemplo):</Label>
                              <div className="flex items-center gap-2 mt-1">
                                <Input
                                  id="crypto-address"
                                  readOnly
                                  value="0x1234567890abcdef1234567890abcdef12345678"
                                  className="font-mono text-xs h-9 bg-background"
                                />
                                <Button variant="outline" size="icon" className="h-9 w-9 flex-shrink-0" onClick={() => handleCopyToClipboard("0x1234567890abcdef1234567890abcdef12345678")}>
                                  <Copy className="h-4 w-4" />
                                  <span className="sr-only">Copiar dirección</span>
                                </Button>
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground pt-2">
                              <strong className="text-foreground">Importante:</strong> Asegúrate de seleccionar la red correcta (ej. ERC20, BEP20, TRC20) compatible con nuestra wallet. Las transacciones pueden tardar varios minutos en confirmarse en la blockchain.
                            </p>
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
              type="button" // Changed from submit to button to prevent default form submission
              onClick={handleFinalSubmit} // Call the combined handler
              size="lg" 
              className="w-full text-base mt-0 lg:mt-8 transition-transform hover:scale-105 active:scale-95" // Adjusted margin for consistency
              disabled={isSubmitting || !shippingForm.formState.isValid || !paymentForm.formState.isValid } // Disable if forms aren't valid or submitting
            >
            <Lock className="mr-2 h-5 w-5" /> 
            {isSubmitting ? 'Procesando Pedido...' : (selectedPaymentMethod === 'crypto' ? 'Confirmar Transacción Crypto' : 'Realizar Pedido')}
          </Button>
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

