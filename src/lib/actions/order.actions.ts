
'use server';

import { z } from 'zod';
import { products as allProducts } from '@/lib/placeholder-data'; // Using placeholder data for stock check

// --- Schemas ---

const ShippingDetailsSchema = z.object({
  fullName: z.string().min(2, "Nombre completo es requerido (mín. 2 caracteres)."),
  address: z.string().min(5, "Dirección es requerida (mín. 5 caracteres)."),
  city: z.string().min(2, "Ciudad es requerida (mín. 2 caracteres)."),
  state: z.string().min(2, "Departamento es requerido (mín. 2 caracteres)."),
  zipCode: z.string().optional(),
  country: z.string().min(2, "País es requerido (mín. 2 caracteres)."),
  email: z.string().email("Debe ser un correo electrónico válido."),
});

const CartItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  quantity: z.number().min(1),
  price: z.number(),
  stock: z.number(),
  imageUrls: z.array(z.string()).optional(),
});

const PlaceOrderInputSchema = z.object({
  shippingDetails: ShippingDetailsSchema,
  cartItems: z.array(CartItemSchema).min(1, "El carrito no puede estar vacío."),
  paymentMethod: z.enum(['bold', 'coinbase'], { required_error: "Debe seleccionar un método de pago." }),
  totalAmount: z.number().positive("El monto total debe ser positivo."),
});

export type PlaceOrderInput = z.infer<typeof PlaceOrderInputSchema>;

// --- Action ---

export async function placeOrder(
  input: PlaceOrderInput
): Promise<{ success: boolean; message?: string; orderId?: string; redirectUrl?: string; }> {
  
  console.log("--- Iniciando placeOrder Action ---");
  console.log("Método de pago seleccionado:", input.paymentMethod);

  const validationResult = PlaceOrderInputSchema.safeParse(input);
  if (!validationResult.success) {
    const errors = validationResult.error.flatten().fieldErrors;
    console.error("Validación de entrada fallida en el servidor:", errors);
    const errorMessages = Object.entries(errors)
      .map(([field, messages]) => `${field}: ${messages?.join(', ')}`)
      .join('; ');
    return {
      success: false,
      message: `Error de validación del servidor: ${errorMessages}`,
    };
  }

  const { shippingDetails, cartItems, paymentMethod, totalAmount } = validationResult.data;

  // 1. Stock Check (common for all payment methods)
  for (const item of cartItems) {
    const productInDb = allProducts.find(p => p.id === item.id);
    if (!productInDb) {
      return { success: false, message: `El producto "${item.name}" ya no está disponible.` };
    }
    if (productInDb.stock < item.quantity) {
      return {
        success: false,
        message: `No hay suficiente stock para "${item.name}". Disponible: ${productInDb.stock}, Solicitado: ${item.quantity}.`,
      };
    }
  }

  const orderId = `AVA-${Date.now()}`;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9004';

  // --- Payment Gateway Logic ---

  switch (paymentMethod) {
    case 'coinbase':
      console.log("Procesando con Coinbase...");
      const coinbaseApiKey = process.env.COINBASE_API_KEY;
      if (!coinbaseApiKey || coinbaseApiKey === 'YOUR_API_KEY_HERE' || coinbaseApiKey.trim() === '') {
        console.error("La API Key de Coinbase no está configurada en .env");
        return { success: false, message: "La integración de pago con criptomonedas no está configurada correctamente por el administrador." };
      }

      try {
        const chargeData = {
          name: `Pedido ${orderId} - AVA Shop`,
          description: `Compra de ${cartItems.length} tipos de productos.`,
          local_price: {
            amount: totalAmount.toFixed(2),
            currency: 'COP',
          },
          pricing_type: 'fixed_price',
          metadata: {
            order_id: orderId,
            customer_name: shippingDetails.fullName,
          },
          redirect_url: `${appUrl}/order/success?order_id=${orderId}`,
          cancel_url: `${appUrl}/order/cancel?order_id=${orderId}`,
        };
        
        const response = await fetch('https://api.commerce.coinbase.com/charges', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-CC-Api-Key': coinbaseApiKey,
            'X-CC-Version': '2018-03-22',
          },
          body: JSON.stringify(chargeData),
        });

        const responseData = await response.json();

        if (!response.ok) {
          console.error("Error de la API de Coinbase:", responseData);
          throw new Error(responseData.error?.message || 'Error al crear el cargo en Coinbase.');
        }
        
        // TODO: In a real app, save the order to DB here with 'pending_payment' status and the charge ID from responseData.data.id

        return {
          success: true,
          redirectUrl: responseData.data.hosted_url,
        };

      } catch (error: any) {
        console.error("Fallo al procesar con Coinbase:", error);
        return { success: false, message: `Error al contactar a Coinbase: ${error.message}` };
      }

    case 'bold':
      console.log("Procesando con Bold (Simulación)...");
      // This is a simulation. A real Bold integration would involve:
      // 1. Calling Bold's API to get a payment link.
      // 2. Returning the link to the client for redirection.
      // 3. Setting up a webhook to listen for payment status updates from Bold.

      // For now, we simulate a successful payment immediately.
      // TODO: In a real app, save the order to DB here with 'paid' status.
      // TODO: Reduce stock levels in the database.
      
      console.log(`(Simulación) Pedido ${orderId} procesado exitosamente con Bold.`);
      
      return {
        success: true,
        orderId: orderId,
        message: 'Pedido recibido y procesado con éxito (Simulación Bold).',
      };

    default:
      // This case should not be reachable due to the Zod enum validation
      return { success: false, message: "Método de pago no válido." };
  }
}
