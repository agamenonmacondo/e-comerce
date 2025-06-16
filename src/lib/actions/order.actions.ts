
'use server';

import { z } from 'zod';
import { products as allProducts } from '@/lib/placeholder-data'; // For stock checking
import Stripe from 'stripe';

// Ensure your Stripe secret key is set in your environment variables
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not set in environment variables.');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20', 
});

const ShippingDetailsSchema = z.object({
  fullName: z.string().min(1, "Nombre completo es requerido."),
  address: z.string().min(1, "Dirección es requerida."),
  city: z.string().min(1, "Ciudad es requerida."),
  state: z.string().min(1, "Departamento es requerido."),
  zipCode: z.string().optional(),
  country: z.string().min(1, "País es requerido."),
  phone: z.string().email("Se requiere un correo electrónico válido para el cliente."), // Changed to required email
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
  paymentMethod: z.enum(["creditCard", "pse", "cash", "crypto"]), 
  cartItems: z.array(CartItemSchema),
});

export type PlaceOrderInput = z.infer<typeof PlaceOrderInputSchema>;

export async function placeOrder(
  input: PlaceOrderInput
): Promise<{ success: boolean; message?: string; sessionId?: string }> {
  console.log("Place Order Action - Input received for Stripe:", JSON.stringify(input, null, 2));

  const validationResult = PlaceOrderInputSchema.safeParse(input);
  if (!validationResult.success) {
    console.error("Server-side validation failed:", validationResult.error.flatten().fieldErrors);
    return { 
        success: false, 
        message: `Error de validación del servidor: ${validationResult.error.errors.map(e => `${e.path.join('.')} - ${e.message}`).join(', ')}`
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
        message: `No hay suficiente stock para "${item.name}". Disponible: ${productInDb.stock}, Solicitado: ${item.quantity}.` 
      };
    }
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002';
  if (!process.env.NEXT_PUBLIC_APP_URL) {
    console.warn("NEXT_PUBLIC_APP_URL is not set. Defaulting to http://localhost:9002 for redirect URLs.");
  }


  const line_items = validatedInput.cartItems.map(item => {
    let imageUrl = 'https://placehold.co/100x100.png'; // Default placeholder
    if (item.imageUrls && item.imageUrls.length > 0) {
        imageUrl = item.imageUrls[0].startsWith('http') ? item.imageUrls[0] : `${appUrl}${item.imageUrls[0]}`;
    }

    return {
        price_data: {
            currency: 'cop',
            product_data: {
                name: item.name,
                images: [imageUrl],
            },
            unit_amount: item.price, // Stripe handles COP as a zero-decimal currency.
        },
        quantity: item.quantity,
    }
  });
  
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'], 
      line_items: line_items,
      mode: 'payment',
      success_url: `${appUrl}/order/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/order/cancel`,
      shipping_address_collection: {
        allowed_countries: ['CO'], 
      },
      customer_email: validatedInput.shippingDetails.phone, // Using the validated email
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

