import React from 'react';
import { chefProfile, storySections, philosophyPillars } from '../../data/story';
import { GradualBlur } from '../../components/GradualBlur';

export const StoryPage: React.FC = () => {
  return (
    <div className="py-12 sm:py-20 bg-dark-950 text-ivory-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 sm:space-y-28">
        {/* Page Hero */}
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <span className="section-bracket text-xs font-bold uppercase tracking-widest text-amber-400">
            Our Story
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold text-ivory-100 tracking-tight leading-[1.08]">
            Food Rooted in Tradition. Designed for Today.
          </h1>
          <p className="text-sm sm:text-lg text-stone-300 max-w-2xl mx-auto leading-relaxed">
            MĀRA was established to celebrate the regional soul of South Indian cooking with quiet confidence, pure ingredients, and contemporary restraint.
          </p>
        </div>

        {/* Full-Bleed Atmospheric Visual */}
        <div className="relative aspect-[16/9] md:aspect-[21/9] rounded-4xl overflow-hidden shadow-dark-card border border-dark-750 bg-dark-800">
          <img
            src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=1800&q=85"
            alt="Chefs preparing dishes over brass and open embers"
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent" />
          <GradualBlur position="bottom" height="3.5rem" divCount={4} strength={0.7} opacity={0.65} exponential={false} />
        </div>

        {/* Story Sections (The Idea, The Ingredients, The Kitchen, The People, The Experience) */}
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="text-center">
            <h2 className="section-bracket text-xs font-bold uppercase tracking-widest text-amber-400 mb-2">
              The Journey
            </h2>
            <p className="font-serif text-3xl sm:text-4xl font-bold text-ivory-100">
              The Five Dimensions of MĀRA
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {storySections.map((sec, idx) => (
              <div
                key={sec.title}
                className="bg-dark-850 p-8 rounded-3xl border border-dark-750 shadow-dark-card space-y-3"
              >
                <div className="flex items-center justify-between border-b border-dark-750 pb-3">
                  <span className="font-mono text-xs font-bold text-amber-400">0{idx + 1}</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-stone-500">MĀRA Heritage</span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-ivory-100">
                  {sec.title}
                </h3>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                  {sec.content}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Philosophy Highlights */}
        <div className="bg-gradient-to-b from-dark-850 to-dark-800 rounded-4xl border border-dark-750 p-8 sm:p-14 shadow-dark-card max-w-6xl mx-auto space-y-8">
          <div className="text-center">
            <h2 className="section-bracket text-xs font-bold uppercase tracking-widest text-amber-400 mb-2">
              Founding Philosophy
            </h2>
            <p className="font-serif text-3xl font-bold text-ivory-100">
              The Three Guiding Principles
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
            {philosophyPillars.map((pillar) => (
              <div key={pillar.title} className="space-y-2.5">
                <h3 className="font-serif text-lg font-bold text-amber-400">
                  {pillar.title}
                </h3>
                <p className="text-xs text-stone-300 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Executive Chef Section */}
        <div className="bg-dark-850 rounded-4xl p-8 sm:p-12 lg:p-16 shadow-dark-card border border-dark-750 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-5 relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-dark-800 border border-dark-700 shadow-elevated">
              <img
                src={chefProfile.image}
                alt={chefProfile.name}
                className="w-full h-full object-cover object-top"
                loading="lazy"
              />
            </div>
            <div className="absolute top-4 left-4 bg-dark-900/90 text-amber-400 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-dark-700">
              Executive Chef
            </div>
          </div>

          <div className="md:col-span-7 space-y-5">
            <div>
              <span className="section-bracket text-xs font-bold uppercase tracking-widest text-amber-400 mb-1">
                The Chef
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-ivory-100">
                {chefProfile.name}
              </h2>
              <p className="text-xs text-amber-400 font-bold uppercase tracking-wider mt-1">
                {chefProfile.role}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              {chefProfile.bio}
            </p>

            <blockquote className="bg-dark-800/90 p-5 rounded-2xl border-l-4 border-amber-500 font-serif italic text-xs sm:text-sm text-ivory-200 leading-relaxed">
              "{chefProfile.quote}"
            </blockquote>
          </div>
        </div>
      </div>
    </div>
  );
};
