import Link from 'next/link';
import { BriefcaseBusiness } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container mx-auto py-8 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <BriefcaseBusiness className="h-7 w-7 text-primary" />
              <span className="font-bold text-2xl font-headline">iCommerce</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Your one-stop shop for the latest tech and accessories.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3 font-headline">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="/faq" className="text-muted-foreground hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3 font-headline">Connect With Us</h3>
            <p className="text-muted-foreground text-sm mb-2">
              Stay updated with our latest offers and products.
            </p>
            {/* Placeholder for social media icons or newsletter signup */}
            <div className="flex space-x-3">
              {/* Example: <Link href="#" className="text-muted-foreground hover:text-primary"><Twitter className="h-5 w-5" /></Link> */}
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} iCommerce. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
