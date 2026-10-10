import React from 'react';
import { Quote } from 'lucide-react';
import { chefProfile } from '../data/storyData';

export const ChefSection: React.FC = () => {
  return (
    <section className="py-20 sm:py-24 bg-sand-100 border-t border-sand-200" aria-labelledby="chef-heading">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-xl border border-sand-200 p-8 sm:p-12 shadow-subtle grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          {/* Chef Image */}
          <div className="md:col-span-5 relative">
            <div className="aspect-[4/5] rounded-lg overflow-hidden bg-sand-200 shadow-elevated">
              <img
                src={chefProfile.image}
                alt={`${chefProfile.name} in the MĀRA kitchen`}
                className="w-full h-full object-cover object-top"
                loading="lazy"
              />
            </div>
            <div className="absolute top-4 left-4 bg-charcoal-900/80 backdrop-blur-md text-sand-50 text-[10px] uppercase font-bold tracking-widest px-2.5 py-1 rounded">
              Executive Chef
            </div>
          </div>

          {/* Chef Content */}
          <div className="md:col-span-7 flex flex-col justify-center">
            <span className="text-xs uppercase tracking-[0.2em] text-terracotta-600 font-semibold mb-2 block">
              The Kitchen Leadership
            </span>
            <h2 id="chef-heading" className="font-serif text-3xl sm:text-4xl font-semibold text-charcoal-900 mb-2">
              {chefProfile.name}
            </h2>
            <p className="text-xs text-charcoal-500 font-medium uppercase tracking-wider mb-6">
              {chefProfile.role}
            </p>

            <p className="text-charcoal-700 text-sm sm:text-base leading-relaxed mb-6">
              {chefProfile.bio}
            </p>

            {/* Chef Quote Card */}
            <div className="bg-sand-50 rounded-lg p-5 border-l-4 border-terracotta-500 relative mt-2">
              <Quote className="w-5 h-5 text-terracotta-400 mb-2 opacity-50" aria-hidden="true" />
              <blockquote className="font-serif italic text-charcoal-800 text-sm sm:text-base leading-relaxed">
                "{chefProfile.quote}"
              </blockquote>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
