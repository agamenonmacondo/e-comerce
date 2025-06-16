
# Plan de Desarrollo del Backend para GigaGO

Este documento describe la arquitectura y los componentes clave para el backend de la aplicación de comercio electrónico GigaGO, utilizando Next.js, Firebase Firestore, Firebase Storage y Firebase Authentication.

## 1. Tecnologías Principales

*   **Next.js (App Router)**: Framework para el frontend y backend (Server Components, Server Actions, Route Handlers).
*   **Firebase Firestore**: Base de datos NoSQL para almacenar datos de productos, usuarios, pedidos, etc.
*   **Firebase Storage**: Para almacenar imágenes de productos y avatares de usuarios.
*   **Firebase Authentication**: Para la gestión de usuarios (registro, inicio de sesión).
*   **Genkit**: Para funcionalidades de IA (actualmente no se usa para el core del backend, pero disponible para futuras mejoras).

## 2. Modelo de Datos (Firestore)

Se proponen las siguientes colecciones principales:

*   **`products`**:
    *   `id` (string): ID único del producto.
    *   `name` (string): Nombre del producto.
    *   `description` (string): Descripción detallada.
    *   `price` (number): Precio en COP.
    *   `imageUrls` (array of strings): URLs de las imágenes del producto (almacenadas en Firebase Storage).
    *   `categoryId` (string): ID de la categoría a la que pertenece.
    *   `stock` (number): Cantidad disponible en inventario.
    *   `rating` (number, opcional): Calificación promedio.
    *   `reviewsCount` (number, opcional): Número de reseñas.
    *   `details` (map, opcional): Especificaciones adicionales (ej: { Almacenamiento: "256GB", Color: "Azul" }).
    *   `createdAt` (timestamp): Fecha de creación.
    *   `updatedAt` (timestamp): Fecha de última actualización.

*   **`categories`**:
    *   `id` (string): ID único de la categoría.
    *   `name` (string): Nombre de la categoría (ej: "iPhones").
    *   `slug` (string): Slug para URL (ej: "iphones").

*   **`users`**:
    *   `uid` (string): ID de Firebase Authentication.
    *   `name` (string, opcional): Nombre del usuario.
    *   `email` (string): Correo electrónico (único).
    *   `phone` (string, opcional): Número de teléfono.
    *   `avatarUrl` (string, opcional): URL del avatar (almacenado en Firebase Storage).
    *   `role` (string): "customer" o "admin".
    *   `defaultShippingAddressId` (string, opcional): ID de la dirección de envío por defecto.
    *   `createdAt` (timestamp): Fecha de registro.

*   **`addresses`** (puede ser una subcolección de `users` o una colección principal):
    *   `id` (string): ID único de la dirección.
    *   `userId` (string): ID del usuario al que pertenece.
    *   `street` (string): Calle, carrera, etc.
    *   `city` (string): Ciudad.
    *   `state` (string): Departamento.
    *   `zipCode` (string): Código postal.
    *   `country` (string): País.
    *   `isDefault` (boolean): Si es la dirección por defecto.

*   **`orders`**:
    *   `id` (string): ID único del pedido.
    *   `userId` (string): ID del usuario que realizó el pedido.
    *   `items` (array of maps): Productos en el pedido. Cada item:
        *   `productId` (string)
        *   `name` (string)
        *   `price` (number) (precio al momento de la compra)
        *   `quantity` (number)
        *   `imageUrl` (string) (URL de la imagen principal del producto)
    *   `totalAmount` (number): Monto total del pedido en COP.
    *   `status` (string): "Pendiente", "Procesando", "Enviado", "Entregado", "Cancelado".
    *   `orderDate` (timestamp): Fecha del pedido.
    *   `shippingAddress` (map): Copia de la dirección de envío.
        *   `fullName` (string)
        *   `street` (string)
        *   `city` (string)
        *   `state` (string)
        *   `zipCode` (string)
        *   `country` (string)
        *   `phone` (string, opcional)
    *   `paymentDetails` (map):
        *   `method` (string): "creditCard", "pse", "cash", "crypto".
        *   `transactionId` (string, opcional): ID de la transacción del proveedor de pagos.
        *   `status` (string): "paid", "pending", "failed".
    *   `createdAt` (timestamp): Fecha de creación del registro.
    *   `updatedAt` (timestamp): Fecha de última actualización.

*   **`cartItems`** (opcional, para carritos persistentes):
    *   `id` (string): ID único del ítem del carrito.
    *   `userId` (string): ID del usuario.
    *   `productId` (string): ID del producto.
    *   `quantity` (number): Cantidad.
    *   `addedAt` (timestamp): Fecha en que se añadió.
    *   Alternativa: Manejar el carrito en el lado del cliente (localStorage) y transferirlo al backend solo durante el checkout.

## 3. Autenticación

*   Utilizar **Firebase Authentication** para el registro, inicio de sesión y gestión de sesiones.
*   Proteger rutas y Server Actions según el rol del usuario (ej. acceso al panel de admin solo para roles "admin").
*   El `uid` de Firebase Auth se usará como `userId` en otras colecciones para relacionar datos.

## 4. Gestión de Productos (Admin)

*   **Server Actions** para Crear, Leer, Actualizar y Eliminar (CRUD) productos.
    *   **`addProduct(formData)`**:
        1.  Validar datos del formulario.
        2.  Subir imágenes a Firebase Storage (ver sección 6).
        3.  Guardar el nuevo producto en Firestore con las URLs de las imágenes.
        *   Ubicación sugerida de la acción: `src/app/(admin)/admin/products/add/page.tsx` o un archivo dedicado como `src/lib/actions/product.actions.ts`.
    *   **`updateProduct(productId, formData)`**: Similar a `addProduct`, pero actualiza un producto existente.
    *   **`deleteProduct(productId)`**: Eliminar producto de Firestore (y opcionalmente sus imágenes de Storage).
    *   **`updateStock(productId, newStock)`**:
        1.  Validar `newStock`.
        2.  Actualizar el campo `stock` del producto en Firestore.
        *   Ubicación sugerida de la acción: `src/app/(admin)/admin/dashboard/page.tsx` o `src/lib/actions/product.actions.ts`.
*   La visualización de productos en la tienda (`/` y `/products/[id]`) se hará mediante Server Components que leen directamente de Firestore.

## 5. Manejo de Imágenes

*   Utilizar **Firebase Storage**.
*   **Flujo de subida de imágenes** (ej. al añadir producto):
    1.  El formulario del cliente envía los archivos al Server Action.
    2.  El Server Action genera nombres de archivo únicos.
    3.  Sube los archivos a una ruta específica en Firebase Storage (ej: `products/<productId>/<imageName>`).
    4.  Obtiene las URLs públicas (o de acceso firmado) de las imágenes subidas.
    5.  Guarda estas URLs en el documento del producto en Firestore.

## 6. Carrito de Compras

*   **Opción 1 (Preferida para persistencia):**
    *   Colección `cartItems` en Firestore, ligada a `userId`.
    *   Server Actions para `addItemToCart`, `updateItemQuantityInCart`, `removeItemFromCart`.
    *   La página del carrito (`/cart`) carga los ítems usando un Server Component o un Server Action.
*   **Opción 2 (Más simple, no persistente entre dispositivos/sesiones):**
    *   `localStorage` en el cliente.
    *   Los datos del carrito se envían al backend solo durante el proceso de checkout.

## 7. Proceso de Checkout y Pedidos

*   **Server Action `placeOrder(formData)`**:
    1.  Llamado desde la página de checkout (`/checkout`).
    2.  Recibe: detalles de envío, método de pago, ítems del carrito (o los obtiene del `cartItems` del usuario).
    3.  **Validación de Stock**: Verifica que todos los ítems del pedido estén disponibles en la cantidad solicitada. Si no, devuelve un error.
    4.  **(Simulación/Integración de Pago)**: Aquí iría la lógica para procesar el pago con una pasarela. Por ahora, se puede simular un pago exitoso.
    5.  **Crear Documento de Pedido**: Si el pago es exitoso (o simulado), crea un nuevo documento en la colección `orders` con todos los detalles.
    6.  **Actualizar Stock de Productos**: Decrementar el stock de cada producto vendido. **Importante**: Usar transacciones de Firestore para asegurar atomicidad (o todas las actualizaciones de stock tienen éxito, o ninguna).
    7.  **Limpiar Carrito**: Eliminar ítems del carrito del usuario (de `cartItems` o `localStorage`).
    8.  Devolver una confirmación de pedido al cliente (ej. ID del pedido).
    *   Ubicación sugerida: `src/lib/actions/order.actions.ts`.

## 8. Gestión de Cuentas de Usuario

*   **Server Actions** para:
    *   **`updateUserProfile(formData)`**: Actualizar nombre, teléfono, avatar (subir a Storage, guardar URL).
    *   **`manageAddresses(formData, actionType)`**: Añadir, editar, eliminar, establecer como predeterminada una dirección.
    *   Ubicación sugerida: `src/lib/actions/user.actions.ts`.
*   La página de pedidos del usuario (`/account/orders`) listará los pedidos filtrados por `userId` desde Firestore.

## 9. Reportes (Admin)

*   Las páginas de reportes (`/admin/sales-report`, `/admin/orders-report`, etc.) usarán Server Components que realizan consultas a Firestore.
*   Para agregaciones complejas o cálculos que Firestore no soporte directamente de forma eficiente, se puede:
    *   Realizar múltiples consultas y procesar los datos en el servidor.
    *   Considerar el uso de Firebase Functions (Cloud Functions) para generar resúmenes periódicamente o bajo demanda si las consultas se vuelven muy pesadas.

## 10. Seguridad y Validación

*   **Validación de Entradas**: Usar Zod (como ya se hace en el frontend) también en los Server Actions para validar todos los datos provenientes del cliente.
*   **Autorización**: Verificar roles de usuario en Server Actions para operaciones sensibles (ej. solo "admin" puede gestionar productos).
*   **Reglas de Seguridad de Firestore**: Configurar reglas robustas para controlar el acceso a los datos directamente desde el cliente (aunque la mayoría de las operaciones pasarán por Server Actions).
    *   Ej: Los usuarios solo pueden leer/escribir sus propios carritos y pedidos. Los administradores tienen acceso más amplio. Los productos son de lectura pública.

## Estructura de Archivos Sugerida para Acciones

```
src/
└── lib/
    └── actions/
        ├── product.actions.ts
        ├── user.actions.ts
        ├── order.actions.ts
        └── cart.actions.ts (si se implementa carrito en backend)
```

Este plan proporciona una base sólida. Cada funcionalidad se puede desarrollar de manera incremental.
Por ejemplo, podrías empezar implementando la autenticación y la gestión de productos, luego el carrito y el proceso de checkout.
Recuerda que este es un plan conceptual y la implementación específica de cada Server Action y las interacciones con Firestore requerirán código detallado.
