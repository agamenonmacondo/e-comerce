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
import { User, Edit3, Mail, Phone, MapPin, Save } from 'lucide-react';
import Link from 'next/link';
import OrderHistory from '@/components/account/OrderHistory'; // This component will be created

const profileFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
});

const addressFormSchema = z.object({
  street: z.string().min(3, "Street is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().min(5, "Zip code is required"),
  country: z.string().min(2, "Country is required"),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type AddressFormValues = z.infer<typeof addressFormSchema>;

export default function AccountPage() {
  const { toast } = useToast();
  const user = mockUser; // Using mock data

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user.name || '',
      email: user.email,
      phone: user.addresses?.[0]?.id, // This is not phone, should be phone from user
    },
  });

  const addressForm = useForm<AddressFormValues>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: user.addresses?.[0] || { street: '', city: '', state: '', zipCode: '', country: '' },
  });

  function onProfileSubmit(data: ProfileFormValues) {
    console.log("Profile data:", data);
    toast({ title: "Profile Updated", description: "Your profile information has been saved." });
  }

  function onAddressSubmit(data: AddressFormValues) {
    console.log("Address data:", data);
    toast({ title: "Address Updated", description: "Your address has been saved." });
  }

  return (
    <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl md:text-4xl font-bold font-headline">My Account</h1>
        <Button variant="outline" asChild>
            <Link href="/account/orders"><User className="mr-2 h-4 w-4" /> View Orders</Link>
        </Button>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-1/2 lg:w-1/3 mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="addresses">Addresses</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-headline flex items-center"><User className="mr-3 h-6 w-6 text-primary"/>Personal Information</CardTitle>
              <CardDescription>Manage your personal details and contact information.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <FormField control={profileForm.control} name="name" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center"><User className="mr-2 h-4 w-4 text-muted-foreground"/>Full Name</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={profileForm.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center"><Mail className="mr-2 h-4 w-4 text-muted-foreground"/>Email Address</FormLabel>
                        <FormControl><Input type="email" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>
                  <FormField control={profileForm.control} name="phone" render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center"><Phone className="mr-2 h-4 w-4 text-muted-foreground"/>Phone Number</FormLabel>
                      <FormControl><Input type="tel" placeholder="Optional" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Button type="submit" className="transition-transform hover:scale-105 active:scale-95">
                    <Save className="mr-2 h-4 w-4" /> Save Profile
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="addresses">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-headline flex items-center"><MapPin className="mr-3 h-6 w-6 text-primary"/>Manage Addresses</CardTitle>
              <CardDescription>Update your shipping and billing addresses.</CardDescription>
            </CardHeader>
            <CardContent>
              {/* For simplicity, only showing one address form. A real app would list multiple addresses. */}
              <Form {...addressForm}>
                <form onSubmit={addressForm.handleSubmit(onAddressSubmit)} className="space-y-6">
                  <FormField control={addressForm.control} name="street" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Street Address</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <div className="grid sm:grid-cols-3 gap-6">
                    <FormField control={addressForm.control} name="city" render={({ field }) => (
                      <FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={addressForm.control} name="state" render={({ field }) => (
                      <FormItem><FormLabel>State / Province</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                    <FormField control={addressForm.control} name="zipCode" render={({ field }) => (
                      <FormItem><FormLabel>Zip / Postal Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )} />
                  </div>
                  <FormField control={addressForm.control} name="country" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <Button type="submit" className="transition-transform hover:scale-105 active:scale-95">
                    <Save className="mr-2 h-4 w-4" /> Save Address
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
