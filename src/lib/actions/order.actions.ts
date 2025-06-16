
'use server';

import { z } from 'zod';
import { products as allProducts } from '@/lib/placeholder-data';

// Updated ShippingDetailsSchema: email is now required
const ShippingDetailsSchema = z.object({
  fullName: z.string().min(1, "Nombre completo es requerido."),
  address: z.string().min(1, "Dirección es requerida."),
  city: z.string().min(1, "Ciudad es requerida."),
  state: z.string().min(1, "Departamento es requerido."),
  zipCode: z.string().optional(),
  country: z.string().min(1, "País es requerido."),
  email: z.string().email("Debe ser un correo electrónico válido."), // Changed from phone, made required
});

const CartItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  quantity: z.number().min(1),
  price: z.number(),
  stock: z.number(),
  imageUrls: z.array(z.string()).optional(),
});

// Removed paymentMethod from PlaceOrderInputSchema as Bold handles payment options
const PlaceOrderInputSchema = z.object({
  shippingDetails: ShippingDetailsSchema,
  cartItems: z.array(CartItemSchema),
});

export type PlaceOrderInput = z.infer<typeof PlaceOrderInputSchema>;

export async function placeOrder(
  input: PlaceOrderInput
): Promise<{ success: boolean; message?: string; orderId?: string; paymentUrl?: string }> {
  console.log("Place Order Action - Input for Bold:", JSON.stringify(input, null, 2));

  const validationResult = PlaceOrderInputSchema.safeParse(input);
  if (!validationResult.success) {
    const errors = validationResult.error.flatten().fieldErrors;
    console.error("Server-side validation failed:", errors);
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

  // 2. Prepare for Bold API call
  const boldSecretKey = process.env.BOLD_SECRET_KEY;
  const boldClientId = process.env.BOLD_CLIENT_ID;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!boldSecretKey || !boldClientId) {
    console.error("Bold API keys are not configured in .env file.");
    return { success: false, message: "Error de configuración del servidor: claves de Bold no encontradas." };
  }
  if (!appUrl) {
    console.error("NEXT_PUBLIC_APP_URL is not configured in .env file.");
    return { success: false, message: "Error de configuración del servidor: URL de la aplicación no encontrada." };
  }

  const order_id = `GIGA-${Date.now()}`; // Unique order ID for Bold
  const totalAmount = validatedInput.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  // Bold expects amount in cents for COP
  const amount_in_cents = Math.round(totalAmount * 100);

  const boldApiUrl = 'https://api.bold.co/v2/payment_links'; // Confirmed Bold API endpoint

  const boldPayload = {
    data: {
      order_id: order_id,
      amount_in_cents: amount_in_cents,
      currency: 'COP',
      payment_description: `Pedido GigaGO #${order_id}`,
      redirect_url: `${appUrl}/order/success?orderId=${order_id}&status=success`, // Redirect URL after payment attempt
      customer: {
        name: validatedInput.shippingDetails.fullName,
        email: validatedInput.shippingDetails.email,
        phone_number: "" // Bold API might require a phone number, even if empty or a placeholder
      },
      // notification_url: `${appUrl}/api/webhooks/bold`, // For server-to-server confirmation (future step)
      // single_use: true, // Typically true for e-commerce
      // collect_shipping_info: false, // We are collecting it
    }
  };

  console.log("Sending payload to Bold:", JSON.stringify(boldPayload, null, 2));

  try {
    const response = await fetch(boldApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': boldSecretKey,   // Correct header for "Llave secreta" (API Key / Llave de comercio)
        'X-Client-Id': boldClientId, // Correct header for "Llave de identidad" (Client ID)
      },
      body: JSON.stringify(boldPayload),
    });

    const responseText = await response.text(); // Read response text first for better error diagnosis
    console.log("Bold API Response Status:", response.status);
    console.log("Bold API Response Text:", responseText);

    if (!response.ok) {
      let errorData;
      try {
        errorData = JSON.parse(responseText);
      } catch (e) {
        errorData = { message: responseText || response.statusText };
      }
      console.error('Bold API Error Data:', errorData);
      const errorMessage = errorData?.errors?.[0]?.detail || errorData?.message || `Error HTTP ${response.status}`;
      return { success: false, message: `Error al crear link de pago Bold: ${errorMessage}` };
    }

    const responseData = JSON.parse(responseText);
    const paymentUrl = responseData.data?.payment_url;
    const boldTransactionId = responseData.data?.id; // This is Bold's payment link ID

    if (!paymentUrl) {
      console.error('Payment URL not found in Bold response:', responseData);
      return { success: false, message: 'No se pudo obtener el link de pago de Bold. Respuesta inesperada.' };
    }

    console.log(`Bold Payment Link Generated: ${paymentUrl} for order ${order_id}, Bold ID: ${boldTransactionId}`);
    
    // TODO: In a real scenario, you might save a "pending" order to Firestore here
    // before redirecting the user. The actual order confirmation and stock update
    // should ideally happen via a webhook from Bold.

    return {
      success: true,
      message: 'Link de pago generado. Redirigiendo...',
      orderId: order_id, // Your internal order ID
      paymentUrl: paymentUrl,
    };

  } catch (error: any) {
    console.error('Error al contactar la API de Bold:', error);
    return { success: false, message: `Error de conexión con la pasarela de pago: ${error.message}` };
  }
}
