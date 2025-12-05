'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { href: '/copy', label: 'Copy', fullLabel: 'Education Ad Copy Generator' },
    { href: '/optimise', label: 'Optimise', fullLabel: 'University Landing Page Optimiser' },
    { href: '/assets', label: 'Assets', fullLabel: 'Creative Asset Spec Query Tool' },
    { href: '/insights', label: 'Insights', fullLabel: 'Education Insight Assistant' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#222222] border-b border-gray-800">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
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

          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                {link.fullLabel}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-gray-300 hover:text-white transition-colors p-2"
            aria-label="Toggle menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300"
            onClick={closeMenu}
          />

          {/* Mobile Menu Drawer */}
          <div
            className={`fixed top-0 right-0 h-full w-80 bg-[#222222] border-l border-gray-800 z-50 md:hidden transform transition-transform duration-300 ease-in-out ${
              isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
          >
            {/* Close Button */}
            <div className="flex justify-end p-4">
              <button
                onClick={closeMenu}
                className="text-gray-300 hover:text-white transition-colors p-2"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>

            {/* Mobile Navigation Links */}
            <nav className="flex flex-col px-6 py-4 gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className="text-base font-medium text-gray-300 hover:text-[#55A2C3] transition-colors py-3 border-b border-gray-700"
                >
                  {link.fullLabel}
                </Link>
              ))}
            </nav>
          </div>
        </>
      )}
    </header>
  );
}
