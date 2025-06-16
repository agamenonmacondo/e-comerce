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
import { CreditCard, LogOut, Settings, User, UserCircle, ShoppingBag } from 'lucide-react'; // ShoppingBag instead of CreditCard for Orders
import { useState, useEffect } from 'react';

export default function UserNav() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null); // Added userEmail state
  const [userAvatar, setUserAvatar] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Simulate a logged-in user for demonstration. 
    // In a real app, this would check auth status.
    // To test logged out state, comment out the setIsAuthenticated(true) block.
    const timer = setTimeout(() => {
      // setIsAuthenticated(true);
      // setUserName("Usuario Demo");
      // setUserEmail("usuario@example.com");
      // setUserAvatar("https://placehold.co/40x40.png?text=UD");
    }, 100); 
    return () => clearTimeout(timer);
  }, []);

  if (!isAuthenticated) {
    return (
      <Button variant="ghost" asChild>
        <Link href="/login">
          <UserCircle className="mr-2 h-5 w-5" /> Iniciar Sesión
        </Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={userAvatar || undefined} alt={userName || "Usuario"} />
            <AvatarFallback>{userName ? userName.charAt(0).toUpperCase() : <UserCircle/>}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userName || "Usuario"}</p>
            {userEmail && (
              <p className="text-xs leading-none text-muted-foreground">
                {userEmail}
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/account">
              <User className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/account/orders">
               <ShoppingBag className="mr-2 h-4 w-4" />
              <span>Pedidos</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <Settings className="mr-2 h-4 w-4" />
            <span>Configuración</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setIsAuthenticated(false)}> 
          <LogOut className="mr-2 h-4 w-4" />
          <span>Cerrar Sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
