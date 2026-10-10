import React from 'react';
import { ArrowRight, Calendar, Compass, Clock } from 'lucide-react';
import { restaurantInfo } from '../data/restaurantInfo';

interface HeroProps {
  onOpenReservation: () => void;
  onExploreMenu: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenReservation, onExploreMenu }) => {
  return (
    <section
      id="hero"
      className="relative min-h-[90vh] flex items-center justify-center bg-charcoal-950 text-sand-50 overflow-hidden"
      aria-label="Welcome to MĀRA"
    >
      {/* Background Image with Cinematic Dark Gradient */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2000&q=85"
          alt="Warmly lit contemporary dining room at MĀRA in Coimbatore"
          className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out"
          fetchPriority="high"
        />
        {/* Editorial gradient overlay for maximum readability and mood */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/75 to-charcoal-950/40" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center flex flex-col items-center">
        {/* Live Status Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sand-50/10 backdrop-blur-md border border-sand-50/20 text-sand-200 text-xs sm:text-sm font-medium tracking-wide mb-8 shadow-subtle animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
          <span>Coimbatore · Open today {restaurantInfo.hours.displayToday}</span>
        </div>

        {/* Headline */}
        <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-medium tracking-tight text-sand-50 mb-6 max-w-4xl leading-[1.12]">
          A taste worth remembering.
        </h1>

        {/* Supporting text */}
        <p className="text-base sm:text-lg md:text-xl text-sand-200/90 max-w-2xl font-normal leading-relaxed mb-10">
          Contemporary Indian dining shaped by seasonal ingredients, thoughtful technique and the warmth of the table.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 w-full sm:w-auto">
          <button
            onClick={onOpenReservation}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-terracotta-500 text-white font-semibold text-base rounded hover:bg-terracotta-600 transition-all duration-200 shadow-elevated focus:outline-none focus:ring-2 focus:ring-terracotta-400 focus:ring-offset-2 focus:ring-offset-charcoal-950"
          >
            <Calendar className="w-4 h-4" />
            <span>Reserve a Table</span>
          </button>

          <button
            onClick={onExploreMenu}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-sand-50/10 hover:bg-sand-50/20 text-sand-100 font-medium text-base rounded border border-sand-50/30 transition-all duration-200 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-sand-200"
          >
            <Compass className="w-4 h-4" />
            <span>Explore Menu</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </button>
        </div>

        {/* Subtle quick bullet points */}
        <div className="mt-16 pt-8 border-t border-sand-50/10 grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-sand-300 max-w-2xl w-full">
          <div className="flex items-center justify-center gap-2">
            <Clock className="w-3.5 h-3.5 text-saffron-400" />
            <span>Lunch 12–3:30 PM · Dinner 7–11 PM</span>
          </div>
          <div>
            <span>42 Race Course Road, Coimbatore</span>
          </div>
          <div>
            <span>Progressive Modern Indian</span>
          </div>
        </div>
      </div>
    </section>
  );
};
