import type {Metadata} from 'next';
import Script from 'next/script';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/components/layout/ThemeProvider';

export const metadata: Metadata = {
  title: 'AVA Shop',
  description: 'AVA Shop - Tu Tienda Online de Tecnología',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      {/* The <head> section with direct font links has been removed.
          Next.js will generate the <head> based on the metadata object.
          Fonts should be re-added using next/font if this fixes the issue. */}
      <body className="font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
        <Script src="https://checkout.bold.co/library/boldPaymentButton.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
