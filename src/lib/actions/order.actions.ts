
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
  phone: z.string().optional(), // Changed back to optional phone
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
): Promise<{ success: boolean; message?: string; orderId?: string }> {
  console.log("Place Order Action - Input received (Simulation):", JSON.stringify(input, null, 2));

  const validationResult = PlaceOrderInputSchema.safeParse(input);
  if (!validationResult.success) {
    console.error("Server-side validation failed:", validationResult.error.flatten().fieldErrors);
    return {
        success: false,
        message: `Error de validación del servidor: ${validationResult.error.errors.map(e => `${e.path.join('.')} - ${e.message}`).join(', ')}`
    };
  }

  const validatedInput = validationResult.data;

  // 1. Validate Stock (Simulation)
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

  // 2. Simulate Payment Processing
  console.log(`Simulating payment processing for method: ${validatedInput.paymentMethod}...`);
  // In a real scenario, interact with a payment gateway API here.
  // For now, assume payment is successful if stock validation passes.

  // 3. Simulate Order Creation
  // In a real scenario, save the order to Firestore here and update stock.
  const mockOrderId = `SIM-${Date.now()}`;
  console.log(`Simulated order creation with ID: ${mockOrderId}`);
  console.log('Simulated stock reduction for items in cart.');

  return {
    success: true,
    message: `Pedido ${mockOrderId} realizado con éxito (simulación).`,
    orderId: mockOrderId,
  };
}
