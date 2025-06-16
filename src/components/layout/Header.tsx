import Link from 'next/link';
import { BriefcaseBusiness, Search, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import UserNav from './UserNav';
import { ThemeToggle } from './ThemeToggle';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <BriefcaseBusiness className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl font-headline">iCommerce</span>
        </Link>
        <nav className="flex flex-1 items-center space-x-6 text-sm font-medium">
          <Link href="/" className="text-foreground/70 transition-colors hover:text-foreground">
            All Products
          </Link>
          <Link href="/#categories" className="text-foreground/70 transition-colors hover:text-foreground">
            Categories
          </Link>
          {/* More links can be added here or via a dropdown */}
        </nav>
        <div className="flex items-center space-x-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input type="search" placeholder="Search products..." className="w-full rounded-lg bg-muted pl-8 md:w-[200px] lg:w-[300px]" />
          </div>
          <ThemeToggle />
          <Button variant="ghost" size="icon" asChild>
            <Link href="/cart" aria-label="Shopping Cart">
              <ShoppingCart className="h-5 w-5" />
            </Link>
          </Button>
          <UserNav />
        </div>
      </div>
    </header>
  );
}
