import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import Image from 'next/image';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME || 'RH AI Assistant',
  description: 'Education ad copy generator and creative asset specification tool',
  icons: {
    icon: '/favicon.ico',
  },
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
          <header className="sticky top-0 z-50 bg-[#222222] border-b border-gray-800">
            <div className="container mx-auto px-4 py-3">
              <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                  <Image
                    src="/rh-logo.png"
                    alt="RH Advertising"
                    width={120}
                    height={40}
                    className="h-10 w-auto"
                    priority
                  />
                  <span className="text-xl font-semibold text-white border-l border-gray-600 pl-3">
                    AI Assistant
                  </span>
                </Link>
                <nav className="flex gap-6">
                  <Link
                    href="/copy"
                    className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                  >
                    Copy Generator
                  </Link>
                  <Link
                    href="/optimise"
                    className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                  >
                    Landing Page Optimiser
                  </Link>
                  <Link
                    href="/assets"
                    className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
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
