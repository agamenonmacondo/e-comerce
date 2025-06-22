
'use server';

import { z } from 'zod';
import { products as allProducts } from '@/lib/placeholder-data'; // Using placeholder data for stock check

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
});

export type PlaceOrderInput = z.infer<typeof PlaceOrderInputSchema>;

export async function placeOrder(
  input: PlaceOrderInput
): Promise<{ success: boolean; message?: string; orderId?: string; paymentUrl?: string }> {
  
  console.log("--- Iniciando placeOrder Action (Integración Coinbase) ---");

  const coinbaseApiKey = process.env.COINBASE_API_KEY;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  console.log("Verificando variables de entorno para Coinbase:");
  console.log(`COINBASE_API_KEY disponible: ${!!coinbaseApiKey}`);
  console.log(`NEXT_PUBLIC_APP_URL disponible: ${!!appUrl}`);
  
  if (!coinbaseApiKey || coinbaseApiKey === "YOUR_COINBASE_API_KEY_HERE") {
    console.error("Error Crítico: COINBASE_API_KEY no configurada correctamente en .env.");
    return { success: false, message: "Error de configuración del servidor: Falta la clave API de Coinbase. Revisa los logs del servidor y el archivo .env." };
  }
  if (!appUrl) {
    console.error("Error Crítico: NEXT_PUBLIC_APP_URL no configurado en .env.");
    return { success: false, message: "Error de configuración del servidor: URL de la aplicación no encontrada. Revisa los logs del servidor." };
  }

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

  const { shippingDetails, cartItems } = validationResult.data;

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

  const order_id = `AVA-${Date.now()}`; 
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const taxRate = 0.19; 
  const taxAmount = subtotal * taxRate;
  const shippingCost = subtotal > 200000 ? 0 : 15000; 
  const totalAmount = subtotal + taxAmount + shippingCost;
  const itemsDescription = cartItems.map(item => `${item.name} (x${item.quantity})`).join(', ');

  const coinbasePayload = {
    name: `Pedido AVA Shop #${order_id}`,
    description: `Compra de: ${itemsDescription.substring(0, 190)}...`,
    local_price: {
      amount: totalAmount.toFixed(2),
      currency: "COP"
    },
    pricing_type: "fixed_price",
    metadata: {
        order_id: order_id,
        customer_name: shippingDetails.fullName,
        customer_email: shippingDetails.email,
    },
    redirect_url: `${appUrl}/order/success?order_id=${order_id}`,
    cancel_url: `${appUrl}/order/cancel?order_id=${order_id}`
  };

  console.log("Payload para API de Coinbase Commerce:", JSON.stringify(coinbasePayload, null, 2));

  try {
    const response = await fetch('https://api.commerce.coinbase.com/charges', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CC-Api-Key': coinbaseApiKey,
        'X-CC-Version': '2018-03-22',
      },
      body: JSON.stringify(coinbasePayload),
    });

    const responseData = await response.json();

    if (!response.ok) {
      const errorMessage = responseData?.error?.message || `Error HTTP ${response.status}`;
      console.error('Error de la API de Coinbase:', errorMessage, 'Detalles:', responseData);
      return { success: false, message: `Error al crear el cargo de Coinbase: ${errorMessage}` };
    }

    const paymentUrl = responseData.data?.hosted_url;

    if (!paymentUrl) {
      console.error('URL de pago no encontrada en la respuesta de Coinbase:', responseData);
      return { success: false, message: 'No se pudo obtener la página de pago de Coinbase.' };
    }

    console.log(`Página de pago de Coinbase generada: ${paymentUrl} para order ${order_id}`);
    
    return {
      success: true,
      message: 'Página de pago generada. Redirigiendo...',
      orderId: order_id,
      paymentUrl: paymentUrl,
    };

  } catch (error: any) {
    console.error('Error CRÍTICO al contactar la API de Coinbase (fetch failed o error de red):', error);
    return { success: false, message: `Error de conexión con la pasarela de pago: ${error.message || 'fetch failed'}. Revisa la consola del servidor.` };
  }
}
