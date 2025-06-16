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
import { CreditCard, LogOut, Settings, User, UserCircle } from 'lucide-react';
import { useState, useEffect } from 'react'; // Assuming some auth state management

export default function UserNav() {
  // Mock authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userAvatar, setUserAvatar] = useState<string | undefined>(undefined);

  useEffect(() => {
    // In a real app, this would check auth status (e.g., from a context or cookie)
    // For now, let's simulate a logged-in user after a delay
    const timer = setTimeout(() => {
      // setIsAuthenticated(true);
      // setUserName("Demo User");
      // setUserAvatar("https://placehold.co/40x40.png?text=DU");
    }, 100); // Simulate loading user data
    return () => clearTimeout(timer);
  }, []);

  if (!isAuthenticated) {
    return (
      <Button variant="ghost" asChild>
        <Link href="/login">
          <UserCircle className="mr-2 h-5 w-5" /> Login
        </Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={userAvatar || undefined} alt={userName || "User"} />
            <AvatarFallback>{userName ? userName.charAt(0).toUpperCase() : <UserCircle/>}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userName || "User"}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {/* user.email - if available */}
              user@example.com 
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href="/account">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/account/orders">
               <CreditCard className="mr-2 h-4 w-4" />
              <span>Orders</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => setIsAuthenticated(false)}> {/* Mock logout */}
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
