import React, { useState, useEffect } from 'react';
import { Menu, X, Phone, MessageCircle, Sparkles } from 'lucide-react';
import { restaurantInfo } from '../data/restaurantInfo';
import { getGeneralWhatsAppLink } from '../utils/whatsapp';

interface NavbarProps {
  onOpenReservation: () => void;
  onOpenCaseStudy: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenReservation, onOpenCaseStudy }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Prevent background scrolling when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: 'Home', href: '#hero' },
    { name: 'Menu', href: '#menu' },
    { name: 'Find Your Dish', href: '#find-your-dish' },
    { name: 'Our Story', href: '#story' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Private Dining', href: '#private-dining' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Portfolio Banner Pill */}
      <div className="bg-charcoal-950 text-sand-200 text-xs py-1.5 px-4 border-b border-charcoal-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-terracotta-500"></span>
            <span className="font-medium tracking-wide">Tetravate Portfolio Project · Self-Initiated Concept</span>
          </div>
          <button
            onClick={onOpenCaseStudy}
            className="flex items-center gap-1.5 text-terracotta-400 hover:text-terracotta-300 font-medium transition-colors focus:outline-none focus:underline"
            aria-label="View Tetravate Case Study"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>View Case Study</span>
          </button>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-sand-50/95 backdrop-blur-md shadow-subtle border-b border-sand-200/80 py-3.5'
            : 'bg-sand-50/90 backdrop-blur-sm border-b border-sand-200/40 py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <a
            href="#hero"
            className="group flex flex-col focus:outline-none focus:ring-2 focus:ring-terracotta-500 rounded p-1"
            aria-label="MĀRA Home"
          >
            <span className="font-serif text-2xl sm:text-3xl font-bold tracking-widest text-charcoal-900 group-hover:text-terracotta-600 transition-colors">
              MĀRA
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-charcoal-600 font-medium -mt-1">
              Modern Indian Dining
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="text-sm font-medium text-charcoal-700 hover:text-terracotta-600 transition-colors py-1 focus:outline-none focus:ring-1 focus:ring-terracotta-500 rounded px-1"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href={`tel:${restaurantInfo.phone}`}
              className="inline-flex items-center justify-center p-2.5 rounded-full text-charcoal-700 hover:text-terracotta-600 hover:bg-sand-200 transition-colors"
              aria-label={`Call restaurant at ${restaurantInfo.displayPhone}`}
              title={restaurantInfo.displayPhone}
            >
              <Phone className="w-4 h-4" />
            </a>

            <a
              href={getGeneralWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center p-2.5 rounded-full text-charcoal-700 hover:text-sage-600 hover:bg-sand-200 transition-colors"
              aria-label="Chat with MĀRA on WhatsApp"
              title="Chat on WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </a>

            <button
              onClick={onOpenReservation}
              className="px-5 py-2.5 bg-charcoal-900 text-sand-50 hover:bg-terracotta-600 transition-colors rounded text-sm font-semibold tracking-wide shadow-sm focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:ring-offset-2"
            >
              Reserve a Table
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={onOpenReservation}
              className="px-3.5 py-1.5 bg-charcoal-900 text-sand-50 rounded text-xs font-semibold"
            >
              Reserve
            </button>
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-charcoal-800 hover:text-terracotta-600 rounded-md focus:outline-none focus:ring-2 focus:ring-terracotta-500"
              aria-label="Open menu navigation"
              aria-expanded={mobileMenuOpen}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
        >
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-charcoal-950/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-sand-50 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-sand-200">
                <div className="flex flex-col">
                  <span className="font-serif text-2xl font-bold tracking-widest text-charcoal-900">
                    MĀRA
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-charcoal-600">
                    Coimbatore · Modern Indian
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-charcoal-700 hover:text-charcoal-950 rounded-full hover:bg-sand-200 focus:outline-none focus:ring-2 focus:ring-terracotta-500"
                  aria-label="Close menu navigation"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="mt-8 flex flex-col gap-2">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavClick(link.href);
                    }}
                    className="px-4 py-3 text-lg font-serif text-charcoal-900 hover:text-terracotta-600 hover:bg-sand-100 rounded-md transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
              </nav>
            </div>

            {/* Drawer Bottom Actions */}
            <div className="pt-6 border-t border-sand-200 flex flex-col gap-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenReservation();
                }}
                className="w-full py-3.5 bg-terracotta-500 text-white hover:bg-terracotta-600 transition-colors rounded text-base font-semibold text-center shadow-sm"
              >
                Reserve a Table
              </button>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href={`tel:${restaurantInfo.phone}`}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 bg-sand-100 hover:bg-sand-200 text-charcoal-900 rounded text-xs font-medium transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call {restaurantInfo.displayPhone}</span>
                </a>
                <a
                  href={getGeneralWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 px-3 bg-sage-50 text-sage-700 hover:bg-sage-100 rounded text-xs font-medium transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp</span>
                </a>
              </div>

              <div className="text-center pt-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenCaseStudy();
                  }}
                  className="text-xs text-charcoal-500 hover:text-terracotta-600 font-medium underline"
                >
                  View Tetravate Design Case Study
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
