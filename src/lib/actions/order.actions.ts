
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
  email: z.string().email("Debe ser un correo electrónico válido."), // Email is crucial for Bold
});

const CartItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  quantity: z.number().min(1),
  price: z.number(), // Price per unit
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
  
  console.log("--- Iniciando placeOrder Action (Integración Bold) ---");

  const boldSecretKey = process.env.BOLD_SECRET_KEY;
  const boldClientId = process.env.BOLD_CLIENT_ID;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  console.log("Verificando variables de entorno para Bold:");
  console.log(`BOLD_SECRET_KEY disponible: ${!!boldSecretKey}`);
  console.log(`BOLD_CLIENT_ID disponible: ${!!boldClientId}`);
  console.log(`NEXT_PUBLIC_APP_URL disponible: ${!!appUrl}`);
  
  if (!boldSecretKey || !boldClientId) {
    console.error("Error Crítico: Claves API de Bold (BOLD_SECRET_KEY o BOLD_CLIENT_ID) no configuradas en .env.");
    return { success: false, message: "Error de configuración del servidor: credenciales de Bold incompletas. Revisa los logs del servidor." };
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

  // 1. Validate Stock (using placeholder data for now)
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

  const order_id = `GIGA-${Date.now()}`; // Generate a unique order ID
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  // Assuming tax and shipping are calculated similarly to the frontend for consistency,
  // or you might recalculate them here if business logic dictates.
  // For Bold, we need the final total amount.
  const taxRate = 0.19; 
  const taxAmount = subtotal * taxRate;
  const shippingCost = subtotal > 200000 ? 0 : 15000; 
  const totalAmount = subtotal + taxAmount + shippingCost;

  const amount_in_cents = Math.round(totalAmount * 100); // Convert to cents for COP

  // TODO: In a real app, create an order document in Firestore here with 'pending' status.

  const boldApiUrl = 'https://api.bold.co/v2/payment_links';
  const boldPayload = {
    data: {
      order_id: order_id,
      amount_in_cents: amount_in_cents,
      currency: 'COP',
      payment_description: `Pedido GigaGO #${order_id}`,
      // Bold appends transaction details to this URL on success/failure/pending
      redirect_url: `${appUrl}/order/success`, 
      customer: {
        name: shippingDetails.fullName,
        email: shippingDetails.email,
        // phone_number is optional for Bold payment links but good to have if available
        // phone_number: shippingDetails.phone || "", 
      },
      // single_use: true, // Recommended for typical e-commerce orders
      // collect_shipping_info: false, // We are collecting it
      // expiration_date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Optional: Link expires in 24h
    }
  };

  console.log("Payload para API de Bold:", JSON.stringify(boldPayload, null, 2));
  console.log("Intentando conectar a Bold API en:", boldApiUrl);

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

    const responseText = await response.text(); // Read as text first for better error logging
    console.log("Respuesta de la API de Bold - Status:", response.status);
    console.log("Respuesta de la API de Bold - Texto:", responseText);

    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch (e) {
        errorData = { message: `Respuesta no JSON: ${responseText}` };
      }
      const errorMessage = errorData?.errors?.[0]?.detail || errorData?.message || `Error HTTP ${response.status}`;
      console.error('Error de la API de Bold:', errorMessage, 'Detalles:', errorData);
      return { success: false, message: `Error al crear link de pago con Bold: ${errorMessage}` };
    }

    const responseData = JSON.parse(responseText);
    const paymentUrl = responseData.data?.payment_url;
    const boldTransactionId = responseData.data?.id; // Bold's transaction ID for the payment link

    if (!paymentUrl) {
      console.error('URL de pago no encontrada en la respuesta de Bold:', responseData);
      return { success: false, message: 'No se pudo obtener el link de pago de Bold. Respuesta inesperada del servidor de Bold.' };
    }

    console.log(`Link de pago de Bold generado: ${paymentUrl} para order ${order_id}, Bold Transaction ID: ${boldTransactionId}`);
    
    // TODO: Update your order document in Firestore with the order_id, boldTransactionId, and set status to 'pending_payment' or similar.

    return {
      success: true,
      message: 'Link de pago generado. Redirigiendo...',
      orderId: order_id, // Our internal order ID
      paymentUrl: paymentUrl,
    };

  } catch (error: any) {
    console.error('Error CRÍTICO al contactar la API de Bold (fetch failed o error de red):', error);
    if (error.cause) {
      console.error('Causa del error (si existe):', error.cause);
    }
    return { success: false, message: `Error de conexión con la pasarela de pago: ${error.message || 'fetch failed'}. Revisa la consola del servidor.` };
  }
}

