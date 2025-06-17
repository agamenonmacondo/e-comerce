
'use client';

import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, Settings, User as UserIcon, LogIn, UserPlus, ShoppingBag, LayoutDashboard } from 'lucide-react'; // Renamed User to UserIcon, Added LogIn, UserPlus
import { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase/firebaseConfig'; 
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth'; 
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';


export default function UserNav() {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
    });
    return () => unsubscribe(); 
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Sesión Cerrada",
        description: "Has cerrado sesión exitosamente.",
      });
      router.push('/login'); 
    } catch (error) {
      console.error("Error signing out: ", error);
      toast({
        title: "Error",
        description: "No se pudo cerrar la sesión. Inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  if (!firebaseUser) {
    return (
      <>
        <Button variant="ghost" asChild>
          <Link href="/login">
            <LogIn className="mr-2 h-5 w-5" /> Iniciar Sesión
          </Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/signup">
            <UserPlus className="mr-2 h-5 w-5" /> Regístrate
          </Link>
        </Button>
      </>
    );
  }

  const displayName = firebaseUser.displayName || firebaseUser.email?.split('@')[0] || "Usuario";
  const fallbackName = displayName.substring(0, 2).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={firebaseUser.photoURL || undefined} alt={displayName} />
            <AvatarFallback>{fallbackName}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{displayName}</p>
            {firebaseUser.email && (
              <p className="text-xs leading-none text-muted-foreground">
                {firebaseUser.email}
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/dashboard">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Panel de Control</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/account">
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/account/orders">
               <ShoppingBag className="mr-2 h-4 w-4" />
              <span>Pedidos</span>
            </Link>
          </DropdownMenuItem>
          {/* 
          // Example for admin link, you would need role management for this
          // if (userRole === 'admin') { ... }
          */}
          <DropdownMenuItem asChild>
             <Link href="/admin/dashboard">
                <Settings className="mr-2 h-4 w-4" />
                <span>Admin</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}> 
          <LogOut className="mr-2 h-4 w-4" />
          <span>Cerrar Sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
