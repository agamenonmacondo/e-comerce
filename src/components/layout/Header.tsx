
import Link from 'next/link';
import { Menu, Search, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import UserNav from './UserNav';
import { ThemeToggle } from './ThemeToggle';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

// Simple SVG Logo for AVA
const AvaLogo = () => (
    <svg width="32" height="32" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
        <path d="M20 80L35 20L50 80" stroke="currentColor" strokeWidth="12" strokeLinejoin="round" strokeLinecap="round"/>
        <path d="M50 80L65 20L80 80" stroke="currentColor" strokeWidth="12" strokeLinejoin="round" strokeLinecap="round"/>
        <path d="M30 60H70" stroke="currentColor" strokeWidth="10" strokeLinecap="round"/>
    </svg>
);


export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        {/* Left container for logo and nav */}
        <div className="flex items-center">
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="mr-2">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Abrir menú</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-3/4 pr-0">
                  <nav className="grid gap-6 text-lg font-medium mt-8 pl-6">
                      <Link
                          href="/"
                          className="flex items-center gap-2 text-lg font-semibold -ml-2"
                      >
                          <AvaLogo />
                          <span className="font-bold text-xl font-headline">AVA Shop</span>
                      </Link>
                  </nav>
              </SheetContent>
            </Sheet>
          </div>
          {/* Desktop Logo & Nav */}
          <Link href="/" className="mr-6 hidden md:flex items-center gap-2">
            <AvaLogo />
            <span className="font-bold text-xl font-headline">AVA Shop</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
            {/* Navigation links removed */}
          </nav>
        </div>

        {/* Right container for actions */}
        <div className="flex flex-1 items-center justify-end gap-2 md:gap-4">
          <div className="relative hidden sm:block">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input type="search" placeholder="Buscar..." className="w-full rounded-lg bg-muted pl-8 md:w-[150px] lg:w-[250px]" />
          </div>
          <ThemeToggle />
          <Button variant="ghost" size="icon" asChild>
            <Link href="/cart" aria-label="Carrito de Compras">
              <ShoppingCart className="h-5 w-5" />
            </Link>
          </Button>
          <UserNav />
        </div>
      </div>
    </header>
  );
}
