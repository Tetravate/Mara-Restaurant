import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, MessageCircle, Sparkles, ShoppingBag, ShieldCheck, LogOut, KeyRound } from 'lucide-react';
import { restaurantInfo } from '../../data/restaurant';
import { getGeneralWhatsAppLink } from '../../utils/whatsapp';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  onOpenCaseStudy: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCaseStudy }) => {
  const { totalItems, openCart } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'Story', path: '/our-story' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Private Dining', path: '/private-dining' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Portfolio & Access Gateway Top Bar */}
      <div className="bg-dark-950 text-stone-400 text-[11px] py-1.5 px-4 border-b border-dark-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="font-medium tracking-wide text-stone-300 hidden sm:inline">Tetravate Portfolio Project · MĀRA Restaurant</span>
            {isAuthenticated && user && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                user.role === 'admin'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : user.role === 'staff'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}>
                {user.role === 'admin' ? '👑 Admin' : user.role === 'staff' ? '👨‍🍳 Staff Brigade' : `👤 ${user.name}`}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {(user?.role === 'admin' || user?.role === 'staff') && (
              <Link
                to="/admin"
                className="flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-bold transition-colors"
                title="Open Restaurant Management Console"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Operations Dashboard</span>
              </Link>
            )}

            <Link
              to="/login"
              className="flex items-center gap-1 text-stone-400 hover:text-ivory-100 font-medium transition-colors"
              title="Switch user role or access portal"
            >
              <KeyRound className="w-3 h-3 text-amber-400" />
              <span>{isAuthenticated ? 'Switch Role' : 'Login Portal'}</span>
            </Link>

            {isAuthenticated && (
              <button
                onClick={logout}
                className="flex items-center gap-1 text-stone-500 hover:text-red-400 font-medium transition-colors"
                title="Log out of session"
              >
                <LogOut className="w-3 h-3" />
                <span>Logout</span>
              </button>
            )}

            <span className="text-dark-700 hidden sm:inline">•</span>

            <button
              onClick={onOpenCaseStudy}
              className="hidden sm:flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-medium transition-colors focus:outline-none focus:underline"
              aria-label="View Tetravate Case Study"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Design Case Study</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-dark-900/90 backdrop-blur-md shadow-dark-card border-b border-dark-750 py-3'
            : 'bg-dark-900/60 backdrop-blur-sm border-b border-dark-800/40 py-4 sm:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            to="/"
            className="group flex flex-col focus:outline-none focus:ring-2 focus:ring-amber-500 rounded p-0.5"
            aria-label="MĀRA Home"
          >
            <div className="flex items-center gap-1">
              <span className="font-serif text-2xl sm:text-3xl font-bold tracking-widest text-ivory-100 group-hover:text-amber-400 transition-colors">
                MĀRA
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mb-1" />
            </div>
            <span className="text-[9px] uppercase tracking-[0.25em] text-stone-400 font-medium -mt-1">
              Modern Indian Dining
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `text-xs font-semibold uppercase tracking-wider transition-colors py-1 relative focus:outline-none focus:ring-1 focus:ring-amber-500 rounded px-1.5 ${
                    isActive
                      ? 'text-amber-400 after:absolute after:bottom-0 after:left-1 after:right-1 after:h-[2px] after:bg-amber-500'
                      : 'text-stone-300 hover:text-amber-400'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            {/* On-Website Order Tray Button */}
            <button
              onClick={openCart}
              className="relative inline-flex items-center gap-2 py-2 px-3.5 bg-dark-800 hover:bg-dark-750 text-ivory-100 rounded-full text-xs font-semibold border border-dark-700 hover:border-amber-500/50 transition-colors"
              aria-label={`Open order tray with ${totalItems} items`}
            >
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span>Order Tray</span>
              {totalItems > 0 && (
                <span className="bg-amber-500 text-dark-950 text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-[18px] text-center">
                  {totalItems}
                </span>
              )}
            </button>

            <a
              href={`tel:${restaurantInfo.phone}`}
              className="inline-flex items-center justify-center p-2.5 rounded-full text-stone-300 hover:text-amber-400 hover:bg-dark-800 transition-colors"
              aria-label={`Call restaurant at ${restaurantInfo.displayPhone}`}
              title={restaurantInfo.displayPhone}
            >
              <Phone className="w-4 h-4" />
            </a>

            <Link
              to="/reservations"
              className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-dark-950 font-bold text-xs uppercase tracking-wider rounded-full shadow-glow-subtle hover:shadow-glow-amber transition-all focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              Reserve Table
            </Link>
          </div>

          {/* Mobile Actions */}
          <div className="flex sm:hidden items-center gap-2">
            <button
              onClick={openCart}
              className="relative p-2 text-stone-200 hover:text-amber-400 bg-dark-800 rounded-full border border-dark-700"
              aria-label={`Open order tray with ${totalItems} items`}
            >
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-dark-950 text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            <Link
              to="/reservations"
              className="px-3.5 py-1.5 bg-amber-500 text-dark-950 rounded-full text-xs font-bold uppercase tracking-wider"
            >
              Reserve
            </Link>
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-stone-200 hover:text-amber-400 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
              aria-label="Open menu navigation"
              aria-expanded={mobileMenuOpen}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Fullscreen Drawer */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
        >
          <div
            className="fixed inset-0 bg-dark-950/80 backdrop-blur-md transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-dark-900 border-l border-dark-750 shadow-2xl p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-dark-800">
                <div className="flex flex-col">
                  <span className="font-serif text-2xl font-bold tracking-widest text-ivory-100">
                    MĀRA
                  </span>
                  <span className="text-[10px] uppercase tracking-widest text-stone-400">
                    Coimbatore · Modern Indian
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-stone-400 hover:text-ivory-100 rounded-full hover:bg-dark-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  aria-label="Close menu navigation"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="mt-8 flex flex-col gap-2">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.name}
                    to={link.path}
                    className={({ isActive }) =>
                      `px-4 py-3 text-lg font-serif rounded-lg transition-colors ${
                        isActive
                          ? 'text-amber-400 bg-dark-800 font-bold border-l-2 border-amber-500'
                          : 'text-stone-300 hover:text-amber-400 hover:bg-dark-800/50'
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                ))}
              </nav>

              <div className="mt-8 pt-6 border-t border-dark-800 text-xs text-stone-400 space-y-2">
                <p>
                  <strong className="text-stone-200">Hours:</strong> {restaurantInfo.hours.displayToday}
                </p>
                <p>
                  <strong className="text-stone-200">Location:</strong> {restaurantInfo.address.line1}, {restaurantInfo.address.city}
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-dark-800 flex flex-col gap-3">
              <Link
                to="/reservations"
                className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-amber-500 text-dark-950 rounded-full text-sm font-bold text-center uppercase tracking-wider shadow-glow-subtle"
              >
                Reserve a Table
              </Link>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <a
                  href={`tel:${restaurantInfo.phone}`}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 bg-dark-800 hover:bg-dark-750 text-stone-200 rounded-lg text-xs font-medium transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>Call Us</span>
                </a>
                <a
                  href={getGeneralWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 py-2.5 px-3 bg-dark-800 hover:bg-dark-750 text-sage-400 rounded-lg text-xs font-medium transition-colors"
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
                  className="text-xs text-stone-500 hover:text-amber-400 font-medium underline"
                >
                  View Tetravate Case Study
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
