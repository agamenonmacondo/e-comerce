import LoginForm from '@/components/auth/LoginForm';
import Link from 'next/link';
import { BriefcaseBusiness } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/5 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-4">
            <BriefcaseBusiness className="h-8 w-8 text-primary" />
            <span className="font-bold text-3xl font-headline">iCommerce</span>
          </Link>
          <h2 className="text-2xl font-semibold text-foreground">Welcome Back!</h2>
          <p className="text-muted-foreground">Sign in to continue to your account.</p>
        </div>
        <LoginForm />
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{' '}
          <Button variant="link" asChild className="text-primary p-0 h-auto">
            <Link href="/signup">Sign up</Link>
          </Button>
        </p>
      </div>
    </div>
  );
}
