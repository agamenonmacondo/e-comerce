import SignupForm from '@/components/auth/SignupForm';
import Link from 'next/link';
import { BriefcaseBusiness } from 'lucide-react';

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/10 via-background to-accent/5 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
           <Link href="/" className="inline-flex items-center space-x-2 mb-4">
            <BriefcaseBusiness className="h-8 w-8 text-primary" />
            <span className="font-bold text-3xl font-headline">iCommerce</span>
          </Link>
          <h2 className="text-2xl font-semibold text-foreground">Create an Account</h2>
          <p className="text-muted-foreground">Join iCommerce today to get started.</p>
        </div>
        <SignupForm />
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Button variant="link" asChild className="text-primary p-0 h-auto">
            <Link href="/login">Sign in</Link>
          </Button>
        </p>
      </div>
    </div>
  );
}
