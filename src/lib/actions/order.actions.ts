
'use server';

import { z } from 'zod';
import { products as allProducts } from '@/lib/placeholder-data'; // For stock checking
import type { Product } from '@/types';

// Define schemas for input. These can be expanded later.
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
  price: z.number(),
  stock: z.number(), // Existing stock before order
});

const PlaceOrderInputSchema = z.object({
  shippingDetails: ShippingDetailsSchema,
  paymentMethod: z.enum(["creditCard", "pse", "cash", "crypto"]),
  cartItems: z.array(CartItemSchema),
  // Add payment details if needed for specific methods later
});

export type PlaceOrderInput = z.infer<typeof PlaceOrderInputSchema>;

export async function placeOrder(
  input: PlaceOrderInput
): Promise<{ success: boolean; message: string; orderId?: string }> {
  console.log("Place Order Action - Input received:", JSON.stringify(input, null, 2));

  // 1. Validate Stock
  for (const item of input.cartItems) {
    const productInDb = allProducts.find(p => p.id === item.id); // Simulate fetching from DB
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
  // In a real app, this would involve calling a payment gateway API.
  // For now, we'll assume payment is successful if stock is available.
  console.log(`Simulating payment processing for method: ${input.paymentMethod}... Payment successful.`);

  // 3. Simulate Creating Order in Firestore (not implemented yet)
  const mockOrderId = `MOCK_ORD_${Date.now()}`;
  console.log(`Simulating order creation in Firestore. Order ID: ${mockOrderId}`);

  // 4. Simulate Updating Stock in Firestore (not implemented yet)
  let stockReductionLog = "Simulación de reducción de stock (no se guarda aún):\n";
  input.cartItems.forEach(item => {
    const productInDb = allProducts.find(p => p.id === item.id);
    if (productInDb) {
      stockReductionLog += `- ${item.name}: Stock anterior ${productInDb.stock}, Stock nuevo ${productInDb.stock - item.quantity}\n`;
      // In a real app with Firestore:
      // await updateDoc(doc(db, "products", item.id), { stock: productInDb.stock - item.quantity });
    }
  });
  console.log(stockReductionLog);
  
  // 5. Simulate Cleaning Cart (client-side responsibility or a separate action)
  console.log("Simulating cart cleaning (client should handle or call another action).");

  return { 
    success: true, 
    message: '¡Pedido realizado con éxito! (Simulación). El stock se actualizaría aquí.', 
    orderId: mockOrderId 
  };
}
