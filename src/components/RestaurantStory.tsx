import React from 'react';
import { philosophyPillars } from '../data/storyData';

export const RestaurantStory: React.FC = () => {
  return (
    <section id="story" className="py-20 sm:py-28 bg-white border-t border-sand-200" aria-labelledby="story-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Two-Column Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16 sm:mb-24">
          <div className="lg:col-span-6">
            <span className="text-xs uppercase tracking-[0.2em] text-terracotta-600 font-semibold mb-3 block">
              The Philosophy
            </span>
            <h2
              id="story-heading"
              className="font-serif text-3xl sm:text-5xl md:text-6xl font-medium text-charcoal-900 tracking-tight leading-[1.15] mb-6"
            >
              Food rooted in tradition. Designed for today.
            </h2>
            <p className="text-charcoal-700 text-base sm:text-lg leading-relaxed mb-6 font-normal">
              At MĀRA, we explore the depth of regional Indian culinary heritage without being bound by rigidity. We believe that true contemporary dining does not mean complicating food with unnecessary spectacle — it means distilling flavour to its purest essence.
            </p>
            <p className="text-charcoal-600 text-sm sm:text-base leading-relaxed">
              Every spice blend is roasted and ground in-house daily. Our produce arrives each morning from regenerative family farms in the surrounding Kongu plains and Nilgiri mist, bringing honesty, texture, and genuine warmth to your table.
            </p>
          </div>

          {/* Editorial Visual Composition */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-elevated bg-sand-200">
              <img
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1200&q=80"
                alt="Chefs carefully preparing slow-simmered dishes in MĀRA kitchen"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            {/* Overlapping Detail Card */}
            <div className="hidden sm:block absolute -bottom-8 -left-8 bg-charcoal-900 text-sand-50 p-6 rounded-lg shadow-floating max-w-xs border border-charcoal-700">
              <p className="font-serif text-2xl font-bold text-saffron-300 mb-1">100%</p>
              <p className="text-xs text-sand-200 leading-snug">
                Seasonal farm-to-table sourcing from the Western Ghats & Kongu belt.
              </p>
            </div>
          </div>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-sand-200">
          {philosophyPillars.map((pillar, idx) => (
            <div key={pillar.title} className="relative pl-6 border-l-2 border-terracotta-500/40">
              <span className="text-xs font-mono text-terracotta-600 font-bold block mb-2">
                0{idx + 1}
              </span>
              <h3 className="font-serif text-xl font-semibold text-charcoal-900 mb-2.5">
                {pillar.title}
              </h3>
              <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
