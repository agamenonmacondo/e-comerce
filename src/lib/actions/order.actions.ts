
'use server';

import { z } from 'zod';
import { products as allProducts } from '@/lib/placeholder-data'; // For stock checking
import Stripe from 'stripe';

// Ensure your Stripe secret key is set in your environment variables
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20', // Use the latest API version
});

const ShippingDetailsSchema = z.object({
  fullName: z.string().min(1, "Nombre completo es requerido."),
  address: z.string().min(1, "Dirección es requerida."),
  city: z.string().min(1, "Ciudad es requerida."),
  state: z.string().min(1, "Departamento es requerido."),
  zipCode: z.string().optional(),
  country: z.string().min(1, "País es requerido."),
  phone: z.string().optional(),
});

const CartItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  quantity: z.number().min(1),
  price: z.number(), // Price in COP (smallest currency unit, e.g., cents for USD, or base unit for COP)
  stock: z.number(), 
  imageUrls: z.array(z.string()).optional(), // For Stripe line items
});

const PlaceOrderInputSchema = z.object({
  shippingDetails: ShippingDetailsSchema,
  paymentMethod: z.enum(["creditCard", "pse", "cash", "crypto"]), // Note: Stripe handles specific methods on its page
  cartItems: z.array(CartItemSchema),
});

export type PlaceOrderInput = z.infer<typeof PlaceOrderInputSchema>;

export async function placeOrder(
  input: PlaceOrderInput
): Promise<{ success: boolean; message?: string; sessionId?: string }> {
  console.log("Place Order Action - Input received for Stripe:", JSON.stringify(input, null, 2));

  // 1. Validate Stock
  for (const item of input.cartItems) {
    const productInDb = allProducts.find(p => p.id === item.id); 
    if (!productInDb) {
      return { success: false, message: `El producto "${item.name}" ya no está disponible.` };
    }
    if (productInDb.stock < item.quantity) {
      return { 
        success: false, 
        message: `No hay suficiente stock para "${item.name}". Disponible: ${productInDb.stock}, Solicitado: ${item.quantity}.` 
      };
    }
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002';

  const line_items = input.cartItems.map(item => ({
    price_data: {
      currency: 'cop', // Colombian Pesos
      product_data: {
        name: item.name,
        images: item.imageUrls && item.imageUrls.length > 0 ? [item.imageUrls[0]] : [], // Stripe uses a list of image URLs
      },
      unit_amount: item.price * 100, // Stripe expects amount in the smallest currency unit (centavos for COP).
                                     // If your price is already in centavos, remove *100.
                                     // For COP, which doesn't typically use centavos in this way, ensure item.price is the full amount.
                                     // Stripe treats COP as a zero-decimal currency, so price * 100 might be incorrect.
                                     // Let's assume item.price is in full COP pesos. Stripe will handle it.
                                     // For zero-decimal currencies, Stripe expects the amount as is.
    },
    quantity: item.quantity,
  }));
  
  // Adjust unit_amount for COP: Stripe treats COP as a zero-decimal currency.
  // So, if item.price is 4500000 for 4,500,000 COP, it should be sent as 4500000.
  // The `* 100` is generally for currencies like USD where $1.00 = 100 cents.
  // Let's correct this for COP.
  const corrected_line_items = input.cartItems.map(item => ({
    price_data: {
      currency: 'cop',
      product_data: {
        name: item.name,
        images: item.imageUrls && item.imageUrls.length > 0 ? [item.imageUrls[0].startsWith('http') ? item.imageUrls[0] : `${appUrl}${item.imageUrls[0]}`] : [],
      },
      unit_amount: item.price, // Pass the COP amount directly
    },
    quantity: item.quantity,
  }));


  try {
    // Create a Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'], // Add other payment methods supported by Stripe in CO if needed
      line_items: corrected_line_items,
      mode: 'payment',
      success_url: `${appUrl}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/order/cancel`,
      shipping_address_collection: {
        allowed_countries: ['CO'], // Restrict to Colombia for now
      },
       // Stripe will collect shipping information if not provided this way.
       // Or you can pass customer_email and shipping details if already collected.
      customer_email: input.shippingDetails.phone, // Example: using phone for email if that's what users provide, or get email
      // For pre-filling shipping, you'd use 'shipping_options' or pass 'customer' with address.
      // Simpler to let Stripe collect it if not fully integrating that part yet.
    });

    if (!session.id) {
      return { success: false, message: 'Error al crear la sesión de pago de Stripe.' };
    }

    return { 
      success: true, 
      sessionId: session.id 
    };

  } catch (error: any) {
    console.error("Error creating Stripe session:", error);
    return { success: false, message: `Error de Stripe: ${error.message}` };
  }
}
