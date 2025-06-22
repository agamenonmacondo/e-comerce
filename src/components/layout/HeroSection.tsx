
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative bg-background w-full">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-8 items-center py-12 md:py-24">
          <div className="space-y-6 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-headline tracking-tight">
              <span className="text-primary">AVA Shop:</span> La Tecnología Que Te Define
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto md:mx-0">
              Explora lo último en iPhones, MacBooks y accesorios premium. Calidad y servicio que marcan la diferencia.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button asChild size="lg" className="transition-transform hover:scale-105 active:scale-95">
                <Link href="/#products">
                  Explorar Productos <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative h-64 md:h-96 flex items-center justify-center">
             <Image
                src="/images/iphone_16_promax/121032-iphone-16-pro-max.png"
                alt="Featured product from AVA Shop"
                fill
                className="object-contain drop-shadow-[0_15px_30px_rgba(255,255,255,0.1)]"
                priority
             />
          </div>
        </div>
      </div>
    </section>
  );
}
