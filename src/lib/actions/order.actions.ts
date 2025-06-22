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
): Promise<{ success: boolean; message?: string; orderId?: string; }> {
  
  console.log("--- Iniciando placeOrder Action (Simulación de Pedido) ---");

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

  // Simulate stock check
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

  // --- SIMULATION LOGIC ---
  // In a real app, you would:
  // 1. Create the order in your database (e.g., Firestore) with a "pending" status.
  // 2. Call a payment gateway API (like Bold) to create a payment link.
  // 3. Return the payment link to the client for redirection.
  
  const orderId = `AVA-SIM-${Date.now()}`; 
  
  console.log(`(Simulación) Pedido ${orderId} creado para ${shippingDetails.fullName}.`);
  console.log(`(Simulación) En un escenario real, aquí se llamaría a la pasarela de pago (Ej. Bold).`);
  console.log(`(Simulación) Por ahora, se marcará como exitoso para la demostración.`);

  // TODO: Update stock in the database
  // TODO: Save order to the database

  // For this simulation, we'll just return a success response
  return {
    success: true,
    message: 'Pedido recibido y procesado con éxito (simulación).',
    orderId: orderId,
  };
}
