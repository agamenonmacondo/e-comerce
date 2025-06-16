
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { mockUser } from '@/lib/placeholder-data';
import { User, Mail, Phone, MapPin, Save, ShoppingBag, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

const profileFormSchema = z.object({
  name: z.string().min(2, "El nombre es requerido"),
  email: z.string().email("Correo electrónico inválido"),
  phone: z.string().optional(),
  avatarFile: z.any().optional(), // Para el input de archivo de avatar
});

const addressFormSchema = z.object({
  street: z.string().min(3, "La dirección es requerida"),
  city: z.string().min(2, "La ciudad es requerida"),
  state: z.string().min(2, "El departamento/estado es requerido"),
  zipCode: z.string().min(3, "El código postal es requerido"),
  country: z.string().min(2, "El país es requerido"),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type AddressFormValues = z.infer<typeof addressFormSchema>;

export default function AccountPage() {
  const { toast } = useToast();
  const user = mockUser; 

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user.name || '',
      email: user.email,
      phone: user.phone || '',
      avatarFile: undefined,
    },
  });

  const addressForm = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: user.addresses?.[0] || { street: '', city: '', state: '', zipCode: '', country: 'Colombia' },
  });

  function onProfileSubmit(data: ProfileFormValues) {
    console.log("Datos del perfil:", data);
    let description = "Tu información de perfil ha sido guardada.";
    if (data.avatarFile && data.avatarFile.length > 0) {
      const fileName = data.avatarFile[0].name;
      description += ` Nuevo avatar seleccionado: ${fileName} (simulación de carga).`;
      console.log("Archivo de avatar seleccionado:", data.avatarFile[0]);
      // En una app real: aquí se subiría data.avatarFile[0] y se actualizaría la URL del avatar del usuario.
    }
    toast({ title: "Perfil Actualizado", description });
  }

  function onAddressSubmit(data: AddressFormValues) {
    console.log("Datos de dirección:", data);
    toast({ title: "Dirección Actualizada", description: "Tu dirección ha sido guardada." });
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl md:text-4xl font-bold font-headline">Mi Cuenta</h1>
        <Button variant="outline" asChild>
            <Link href="/account/orders"><ShoppingBag className="mr-2 h-4 w-4" /> Ver Pedidos</Link>
        </Button>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-1/2 lg:w-1/3 mb-6">
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="addresses">Direcciones</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-headline flex items-center"><User className="mr-3 h-6 w-6 text-primary"/>Información Personal</CardTitle>
              <CardDescription>Administra tus detalles personales, información de contacto y avatar.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <FormField control={profileForm.control} name="name" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center"><User className="mr-2 h-4 w-4 text-muted-foreground"/>Nombre Completo</FormLabel>
                        <FormControl><Input placeholder="Ej: Ana Pérez" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={profileForm.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center"><Mail className="mr-2 h-4 w-4 text-muted-foreground"/>Correo Electrónico</FormLabel>
                        <FormControl><Input type="email" placeholder="tu@correo.com" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <FormField control={profileForm.control} name="phone" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><Phone className="mr-2 h-4 w-4 text-muted-foreground"/>Número de Teléfono</FormLabel>
                      <FormControl><Input type="tel" placeholder="Opcional" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField
                    control={profileForm.control}
                    name="avatarFile"
                    render={({ field: { value, onChange, ...fieldProps } }) => (
                      <FormItem>
                        <FormLabel className="flex items-center"><ImageIcon className="mr-2 h-4 w-4 text-muted-foreground"/>Foto de Perfil (Avatar)</FormLabel>
                        <FormControl>
                          <Input
                            {...fieldProps}
                            type="file"
                            accept="image/png, image/jpeg, image/gif"
                            onChange={(event) => {
                              onChange(event.target.files);
                            }}
                            className="pt-2" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="transition-transform hover:scale-105 active:scale-95">
                    <Save className="mr-2 h-4 w-4" /> Guardar Perfil
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="addresses">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-headline flex items-center"><MapPin className="mr-3 h-6 w-6 text-primary"/>Administrar Direcciones</CardTitle>
              <CardDescription>Actualiza tus direcciones de envío y facturación.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...addressForm}>
                <form onSubmit={addressForm.handleSubmit(onAddressSubmit)} className="space-y-6">
                  <FormField control={addressForm.control} name="street" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dirección (Calle, Carrera, etc.)</FormLabel>
                      <FormControl><Input placeholder="Ej: Carrera 10 # 20-30" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <div className="grid sm:grid-cols-3 gap-6">
                    <FormField control={addressForm.control} name="city" render={({ field }) => (
                      <FormItem><FormLabel>Ciudad</FormLabel><FormControl><Input placeholder="Ej: Bogotá" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={addressForm.control} name="state" render={({ field }) => (
                      <FormItem><FormLabel>Departamento</FormLabel><FormControl><Input placeholder="Ej: Cundinamarca" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={addressForm.control} name="zipCode" render={({ field }) => (
                      <FormItem><FormLabel>Código Postal</FormLabel><FormControl><Input placeholder="Ej: 110111" {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <FormField control={addressForm.control} name="country" render={({ field }) => (
                    <FormItem>
                      <FormLabel>País</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Button type="submit" className="transition-transform hover:scale-105 active:scale-95">
                    <Save className="mr-2 h-4 w-4" /> Guardar Dirección
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
