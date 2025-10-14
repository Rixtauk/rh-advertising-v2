import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || 'RH AI Assistant',
  description: 'Education ad copy generator and creative asset specification tool',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <header className="border-b">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <Link href="/" className="text-2xl font-bold text-primary">
                  {process.env.NEXT_PUBLIC_APP_NAME || 'RH AI Assistant'}
                </Link>
                <nav className="flex gap-6">
                  <Link
                    href="/copy"
                    className="text-sm font-medium hover:text-primary transition-colors"
                  >
                    Copy Generator
                  </Link>
                  <Link
                    href="/optimize"
                    className="text-sm font-medium hover:text-primary transition-colors"
                  >
                    Landing Page Optimizer
                  </Link>
                  <Link
                    href="/assets"
                    className="text-sm font-medium hover:text-primary transition-colors"
                  >
                    Asset Specs
                  </Link>
                </nav>
              </div>
            </div>
          </header>

          <main className="flex-1 container mx-auto px-4 py-8">{children}</main>

          <footer className="border-t mt-auto">
            <div className="container mx-auto px-4 py-6">
              <div className="bg-muted p-4 rounded-md text-sm mb-4">
                <p className="font-semibold mb-2">Important Compliance Note:</p>
                <p>
                  This tool provides initial draft copy. All claims must be verified before
                  submitting to RH for build. Copy character limits may also need checking to
                  ensure individual requirements.
                </p>
              </div>
              <p className="text-center text-sm text-muted-foreground">
                © {new Date().getFullYear()} RH Creative. All rights reserved.
              </p>
            </div>
          </footer>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
