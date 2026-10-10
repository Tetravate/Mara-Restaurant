import React from 'react';
import { MessageCircle, Sparkles } from 'lucide-react';
import { restaurantInfo } from '../data/restaurantInfo';
import { getGeneralWhatsAppLink } from '../utils/whatsapp';

interface FooterProps {
  onOpenReservation: () => void;
  onOpenCaseStudy: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenReservation, onOpenCaseStudy }) => {
  return (
    <footer className="bg-charcoal-950 text-sand-200 border-t border-charcoal-800" aria-label="Restaurant Footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 sm:gap-12 mb-16">
          {/* Col 1: Brand & Tagline */}
          <div className="lg:col-span-2">
            <a href="#hero" className="inline-block mb-4">
              <span className="font-serif text-3xl font-bold tracking-widest text-sand-50 block">
                MĀRA
              </span>
              <span className="text-[11px] uppercase tracking-[0.25em] text-sand-400 font-medium">
                Modern Indian Dining
              </span>
            </a>
            <p className="text-xs sm:text-sm text-sand-400 max-w-sm leading-relaxed mb-6">
              Contemporary Indian dining shaped by seasonal ingredients, thoughtful technique, and the warmth of the table. Located on Race Course Road, Coimbatore.
            </p>

            <button
              onClick={onOpenReservation}
              className="px-6 py-3 bg-terracotta-500 hover:bg-terracotta-600 text-white font-semibold text-xs rounded transition-colors shadow-sm"
            >
              Reserve a Table
            </button>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <p className="text-xs uppercase tracking-widest text-saffron-300 font-bold mb-4">
              Explore
            </p>
            <ul className="space-y-2.5 text-xs text-sand-300">
              <li>
                <a href="#hero" className="hover:text-sand-50 transition-colors">Home</a>
              </li>
              <li>
                <a href="#menu" className="hover:text-sand-50 transition-colors">Dining Menu</a>
              </li>
              <li>
                <a href="#find-your-dish" className="hover:text-sand-50 transition-colors">Find Your Dish</a>
              </li>
              <li>
                <a href="#story" className="hover:text-sand-50 transition-colors">Our Philosophy</a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-sand-50 transition-colors">Atmosphere & Gallery</a>
              </li>
              <li>
                <a href="#private-dining" className="hover:text-sand-50 transition-colors">Private Dining</a>
              </li>
            </ul>
          </div>

          {/* Col 3: Hours & Timing */}
          <div>
            <p className="text-xs uppercase tracking-widest text-saffron-300 font-bold mb-4">
              Hours
            </p>
            <div className="space-y-2 text-xs text-sand-300 leading-relaxed">
              <p>
                <strong className="text-sand-100 block">Open Daily</strong>
                12:00 PM – 11:00 PM
              </p>
              <p className="text-sand-400 pt-1">
                Lunch: 12:00 PM – 3:30 PM<br />
                Dinner: 7:00 PM – 11:00 PM
              </p>
              <p className="text-[11px] text-sand-400/80 pt-1">
                Last kitchen order at 10:30 PM
              </p>
            </div>
          </div>

          {/* Col 4: Location & Contact */}
          <div>
            <p className="text-xs uppercase tracking-widest text-saffron-300 font-bold mb-4">
              Visit Us
            </p>
            <div className="space-y-2 text-xs text-sand-300">
              <p className="leading-relaxed">
                42 Race Course Road<br />
                Coimbatore, Tamil Nadu 641018
              </p>
              <p className="pt-2">
                <a href={`tel:${restaurantInfo.phone}`} className="hover:text-sand-50 block">
                  {restaurantInfo.displayPhone}
                </a>
              </p>
              <p>
                <a href={getGeneralWhatsAppLink()} target="_blank" rel="noopener noreferrer" className="text-sage-400 hover:text-sage-300 flex items-center gap-1">
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp Concierge</span>
                </a>
              </p>
              <p className="text-[11px] text-sand-400 pt-1">
                Instagram: @mara.coimbatore (Concept)
              </p>
            </div>
          </div>
        </div>

        {/* Studio Attribution & Portfolio Credit Section */}
        <div className="pt-8 border-t border-charcoal-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-sand-400">
          <div>
            <p>© {new Date().getFullYear()} MĀRA Contemporary Dining. All rights reserved.</p>
          </div>

          {/* Tetravate Studio Signature */}
          <div className="flex items-center gap-3 bg-charcoal-900 px-4 py-2 rounded-full border border-charcoal-800">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-sm bg-terracotta-500 transform rotate-45" />
              <span className="font-semibold text-sand-200 tracking-wider text-[11px]">
                TETRAVATE
              </span>
            </div>
            <span className="text-charcoal-600">•</span>
            <span className="text-sand-400 text-[11px]">From Thought to Thing.</span>
            <span className="text-charcoal-600">•</span>
            <button
              onClick={onOpenCaseStudy}
              className="text-terracotta-400 hover:text-terracotta-300 font-medium underline text-[11px] flex items-center gap-1"
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
