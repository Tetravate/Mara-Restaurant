import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Sparkles } from 'lucide-react';
import { restaurantInfo } from '../../data/restaurant';
import { getGeneralWhatsAppLink } from '../../utils/whatsapp';
import { GradualBlur } from '../GradualBlur';

interface FooterProps {
  onOpenCaseStudy: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenCaseStudy }) => {
  return (
    <footer className="relative bg-dark-950 text-stone-300 border-t border-dark-800 overflow-hidden" aria-label="Restaurant Footer">
      {/* Subtle top gradual blur for seamless transition */}
      <GradualBlur position="top" height="3.5rem" divCount={4} strength={0.75} opacity={0.65} exponential={false} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 sm:gap-12 mb-16">
          {/* Col 1: Brand & Tagline */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <span className="font-serif text-3xl font-bold tracking-widest text-ivory-100 block">
                MĀRA
              </span>
              <span className="text-[10px] uppercase tracking-[0.25em] text-amber-500 font-semibold font-mono">
                Modern Indian Dining
              </span>
            </Link>
            <p className="text-xs sm:text-sm text-stone-400 max-w-sm leading-relaxed">
              A contemporary Indian dining experience shaped by time-honored slow-cooking traditions, thoughtful modern techniques, and the warmth of the communal table. Located on Race Course Road, Coimbatore.
            </p>

            <div className="pt-2">
              <Link
                to="/reservations"
                className="inline-block px-6 py-3 bg-amber-500 hover:bg-amber-400 text-dark-950 font-bold text-xs rounded-xl shadow-glow-amber transition-all"
              >
                Reserve a Table
              </Link>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <p className="text-amber-500 font-mono text-xs uppercase tracking-widest font-semibold mb-4">
              Explore
            </p>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <Link to="/" className="hover:text-amber-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/menu" className="hover:text-amber-400 transition-colors">Our Menu</Link>
              </li>
              <li>
                <Link to="/our-story" className="hover:text-amber-400 transition-colors">Our Story</Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-amber-400 transition-colors">Atmosphere & Gallery</Link>
              </li>
              <li>
                <Link to="/private-dining" className="hover:text-amber-400 transition-colors">Private Dining</Link>
              </li>
              <li>
                <Link to="/reservations" className="hover:text-amber-400 transition-colors">Table Reservations</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-amber-400 transition-colors">Location & Contact</Link>
              </li>
              <li className="pt-2 border-t border-dark-800/80">
                <Link to="/login" className="text-amber-400 hover:text-amber-300 transition-colors font-medium flex items-center gap-1">
                  <span>Multi-Role Login Portal (Staff / Admin / User) →</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Hours & Timing */}
          <div>
            <p className="text-amber-500 font-mono text-xs uppercase tracking-widest font-semibold mb-4">
              Hours
            </p>
            <div className="space-y-2 text-xs text-stone-400 leading-relaxed">
              <p>
                <strong className="text-ivory-100 block">Open Daily</strong>
                12:00 PM - 11:00 PM
              </p>
              <p className="pt-1 text-stone-400">
                Lunch: 12:00 PM - 3:30 PM<br />
                Dinner: 7:00 PM - 11:00 PM
              </p>
              <p className="text-[11px] text-stone-500 pt-1">
                Last orders accepted at 10:30 PM
              </p>
            </div>
          </div>

          {/* Col 4: Location & Contact */}
          <div>
            <p className="text-amber-500 font-mono text-xs uppercase tracking-widest font-semibold mb-4">
              Visit Us
            </p>
            <div className="space-y-2.5 text-xs text-stone-400">
              <p className="leading-relaxed">
                42 Race Course Road<br />
                Coimbatore, Tamil Nadu 641018
              </p>
              <p className="pt-1">
                <a href={`tel:${restaurantInfo.phone}`} className="hover:text-amber-400 block font-medium text-ivory-100 transition-colors">
                  {restaurantInfo.displayPhone}
                </a>
              </p>
              <p>
                <a
                  href={getGeneralWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-400 hover:text-amber-300 flex items-center gap-1.5 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp Concierge</span>
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Studio Attribution & Portfolio Credit Section */}
        <div className="pt-8 border-t border-dark-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div>
            <p>© {new Date().getFullYear()} MĀRA Modern Indian Dining. All rights reserved.</p>
          </div>

          {/* Tetravate Studio Signature */}
          <div className="flex items-center gap-3 bg-dark-900 px-4 py-2 rounded-full border border-dark-700/80">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-sm bg-amber-500 transform rotate-45" />
              <span className="font-semibold text-ivory-100 tracking-wider text-[11px]">
                TETRAVATE
              </span>
            </div>
            <span className="text-dark-700">•</span>
            <span className="text-stone-400 text-[11px]">Concept designed & engineered by Tetravate</span>
            <span className="text-dark-700">•</span>
            <button
              onClick={onOpenCaseStudy}
              className="text-amber-400 hover:text-amber-300 font-medium underline text-[11px] flex items-center gap-1 transition-colors"
            >
              <Sparkles className="w-3 h-3" />
              <span>Case Study</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
