
'use server';

import { z } from 'zod';
import { products as allProducts } from '@/lib/placeholder-data';

const ShippingDetailsSchema = z.object({
  fullName: z.string().min(1, "Nombre completo es requerido."),
  address: z.string().min(1, "Dirección es requerida."),
  city: z.string().min(1, "Ciudad es requerida."),
  state: z.string().min(1, "Departamento es requerido."),
  zipCode: z.string().optional(),
  country: z.string().min(1, "País es requerido."),
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
  cartItems: z.array(CartItemSchema),
});

export type PlaceOrderInput = z.infer<typeof PlaceOrderInputSchema>;

export async function placeOrder(
  input: PlaceOrderInput
): Promise<{ success: boolean; message?: string; orderId?: string; paymentUrl?: string }> {
  
  const boldSecretKey = process.env.BOLD_SECRET_KEY;
  const boldClientId = process.env.BOLD_CLIENT_ID;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  console.log("--- Iniciando placeOrder Action ---");
  console.log("Verificando variables de entorno para Bold:");
  console.log(`BOLD_SECRET_KEY disponible: ${!!boldSecretKey}`);
  console.log(`BOLD_CLIENT_ID disponible: ${!!boldClientId}`);
  console.log(`NEXT_PUBLIC_APP_URL disponible: ${!!appUrl}`);
  
  if (!boldSecretKey || !boldClientId) {
    console.error("Error Crítico: Claves API de Bold (BOLD_SECRET_KEY o BOLD_CLIENT_ID) no configuradas en .env.");
    return { success: false, message: "Error de configuración del servidor: claves de Bold no encontradas. Revisa los logs del servidor." };
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

  const validatedInput = validationResult.data;

  // 1. Validate Stock
  for (const item of validatedInput.cartItems) {
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

  const order_id = `GIGA-${Date.now()}`;
  const totalAmount = validatedInput.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const amount_in_cents = Math.round(totalAmount * 100);

  const boldApiUrl = 'https://api.bold.co/v2/payment_links';

  const boldPayload = {
    data: {
      order_id: order_id,
      amount_in_cents: amount_in_cents,
      currency: 'COP',
      payment_description: `Pedido GigaGO #${order_id}`,
      redirect_url: `${appUrl}/order/success?orderId=${order_id}&status=success`, // Success con status success
      customer: {
        name: validatedInput.shippingDetails.fullName,
        email: validatedInput.shippingDetails.email,
        phone_number: "" 
      },
      // Para enviar URLs de cancelación o fallo específicas si Bold las soporta directamente en la creación del link:
      // failure_url: `${appUrl}/order/cancel?orderId=${order_id}&reason=failed`,
      // cancel_url: `${appUrl}/order/cancel?orderId=${order_id}&reason=cancelled`,
      // single_use: true,
      // collect_shipping_info: false, 
    }
  };

  console.log("Payload para Bold (antes de fetch):", JSON.stringify(boldPayload, null, 2));
  console.log("Intentando conectar a:", boldApiUrl);

  try {
    const response = await fetch(boldApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': boldSecretKey,
        'X-Client-Id': boldClientId,
      },
      body: JSON.stringify(boldPayload),
    });

    const responseText = await response.text();
    console.log("Respuesta de la API de Bold - Status:", response.status);
    console.log("Respuesta de la API de Bold - Texto:", responseText);

    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch (e) {
        errorData = { message: responseText || response.statusText };
      }
      console.error('Error de la API de Bold - Data:', errorData);
      const errorMessage = errorData?.errors?.[0]?.detail || errorData?.message || `Error HTTP ${response.status}`;
      return { success: false, message: `Error al crear link de pago Bold: ${errorMessage}` };
    }

    const responseData = JSON.parse(responseText);
    const paymentUrl = responseData.data?.payment_url;
    const boldTransactionId = responseData.data?.id;

    if (!paymentUrl) {
      console.error('URL de pago no encontrada en la respuesta de Bold:', responseData);
      return { success: false, message: 'No se pudo obtener el link de pago de Bold. Respuesta inesperada.' };
    }

    console.log(`Link de pago de Bold generado: ${paymentUrl} para order ${order_id}, Bold ID: ${boldTransactionId}`);
    
    return {
      success: true,
      message: 'Link de pago generado. Redirigiendo...',
      orderId: order_id,
      paymentUrl: paymentUrl,
    };

  } catch (error: any) {
    console.error('Error CRÍTICO al contactar la API de Bold (fetch failed o similar):', error);
    // Imprime más detalles del error si están disponibles
    if (error.cause) {
      console.error('Causa del error (si existe):', error.cause);
    }
    return { success: false, message: `Error de conexión con la pasarela de pago: ${error.message || 'fetch failed'}` };
  }
}
