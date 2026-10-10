import React, { useState } from 'react';
import { Users, Calendar, Wine, HeartHandshake, MessageCircle, ShieldCheck, Sparkles, Sliders } from 'lucide-react';
import { getPrivateDiningWhatsAppLink } from '../../utils/whatsapp';

export const PrivateDiningPage: React.FC = () => {
  const [guestCount, setGuestCount] = useState<number>(14);
  const [selectedDate, setSelectedDate] = useState<string>('');

  const occasions = [
    {
      title: 'Family Milestones',
      description: 'Birthdays, anniversaries, and multi-generational reunions celebrated around an unhurried, communal table.',
    },
    {
      title: 'Executive Dinners',
      description: 'Acoustically treated, quiet surroundings for discrete corporate dinners, strategy summits, and client hospitality.',
    },
    {
      title: 'Curated Chef Tastings',
      description: 'Custom multi-course vegetarian and non-vegetarian menus created personally by Chef Arjun Menon and team.',
    },
    {
      title: 'Intimate Celebrations',
      description: 'Warm ambient lighting, tailored floral centerpieces, brass tableware, and dedicated service staff.',
    },
  ];

  return (
    <div className="py-12 sm:py-20 bg-dark-950 text-ivory-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 sm:space-y-24">
        {/* Page Hero */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-amber-500 font-mono text-xs uppercase tracking-widest font-semibold">
              Exclusive Spaces
            </span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-medium text-ivory-100 tracking-tight leading-[1.12]">
            The Private Chamber
          </h1>
          <p className="text-sm sm:text-base text-stone-400 leading-relaxed max-w-xl mx-auto">
            An intimate private dining sanctuary designed for meaningful celebrations, family feasts, and executive hospitality in central Coimbatore.
          </p>
        </div>

        {/* Feature Visual Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-6xl mx-auto">
          <div className="lg:col-span-7 aspect-[16/10] rounded-2xl overflow-hidden border border-dark-700/70 shadow-2xl bg-dark-900 group">
            <img
              src="/images/atmosphere/private-dining-chamber.jpg"
              alt="MĀRA Private Dining Chamber with warm wisteria canopy, bamboo basket lanterns and banquet table"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="lazy"
            />
          </div>

          <div className="lg:col-span-5 bg-dark-900/90 border border-dark-700/80 p-8 rounded-2xl shadow-xl space-y-6">
            <h2 className="font-serif text-2xl font-bold text-ivory-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
              Private Chamber Specs
            </h2>
            
            <div className="space-y-5 text-xs text-stone-300">
              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-lg bg-dark-800 border border-dark-700 text-amber-500 shrink-0 mt-0.5">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-ivory-100 text-sm mb-0.5">Capacity</strong>
                  <span>8 to 24 seated guests comfortably around a central teak table.</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-lg bg-dark-800 border border-dark-700 text-amber-500 shrink-0 mt-0.5">
                  <Wine className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-ivory-100 text-sm mb-0.5">Curated Menus</strong>
                  <span>Custom 4 to 6 course regional tasting journeys with pairing options.</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-lg bg-dark-800 border border-dark-700 text-amber-500 shrink-0 mt-0.5">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-ivory-100 text-sm mb-0.5">Dedicated Service</strong>
                  <span>Exclusive host and service brigade dedicated to your gathering.</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="p-2 rounded-lg bg-dark-800 border border-dark-700 text-amber-500 shrink-0 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <strong className="block text-ivory-100 text-sm mb-0.5">Acoustic Privacy</strong>
                  <span>Acoustically insulated walls ensuring discrete conversations.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Event Builder Capsule */}
        <div className="max-w-4xl mx-auto bg-dark-900/90 border border-dark-700/80 rounded-2xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-6 relative z-10">
            <div className="border-b border-dark-800 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-amber-500 font-mono text-xs uppercase tracking-widest font-semibold">
                  Plan Your Gathering
                </span>
                <h3 className="font-serif text-2xl font-bold text-ivory-100 mt-1">
                  Private Dining Planner
                </h3>
              </div>
              <span className="text-xs text-stone-400">
                Minimum 8 guests · Advance notice requested
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Slider for Guest Count */}
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <label htmlFor="guest-slider" className="font-semibold text-ivory-100 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-amber-500" />
                    Number of Guests:
                  </label>
                  <span className="font-serif text-xl font-bold text-amber-400 bg-dark-950 px-3 py-1 rounded-lg border border-dark-700">
                    {guestCount} Guests
                  </span>
                </div>

                <input
                  id="guest-slider"
                  type="range"
                  min="8"
                  max="24"
                  value={guestCount}
                  onChange={(e) => setGuestCount(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-dark-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />

                <div className="flex justify-between text-[11px] text-stone-500">
                  <span>8 (Intimate)</span>
                  <span>16 (Mid-size)</span>
                  <span>24 (Full Chamber)</span>
                </div>

                <div className="p-3 bg-dark-950/60 rounded-xl border border-dark-800 text-xs text-stone-300">
                  <span className="text-amber-400 font-semibold">Recommended Layout: </span>
                  {guestCount <= 12
                    ? 'Center oval table configuration with generous spacing.'
                    : 'Grand linear banquet table with dual sommelier stations.'}
                </div>
              </div>

              {/* Date & WhatsApp Trigger */}
              <div className="space-y-4 bg-dark-950/80 p-6 rounded-xl border border-dark-800">
                <div>
                  <label htmlFor="pref-date" className="block text-xs font-semibold text-ivory-100 mb-2 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-amber-500" />
                    Preferred Date (Optional):
                  </label>
                  <input
                    id="pref-date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-3 py-2.5 bg-dark-900 border border-dark-700 rounded-lg text-xs text-ivory-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <a
                  href={getPrivateDiningWhatsAppLink(guestCount, selectedDate)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-amber-500 hover:bg-amber-400 text-dark-950 font-bold text-xs rounded-xl shadow-glow-amber transition-all duration-200"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Enquire for {guestCount} Guests via WhatsApp</span>
                </a>
                <p className="text-[11px] text-center text-stone-500">
                  Our private events manager responds within 2 business hours.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Occasions 4-Column Grid */}
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-amber-500 font-mono text-xs uppercase tracking-widest font-semibold">
              Bespoke Occasions
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-medium text-ivory-100">
              Suited for Every Meaningful Occasion
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {occasions.map((occ) => (
              <div
                key={occ.title}
                className="bg-dark-900/70 hover:bg-dark-900 border border-dark-800 hover:border-amber-500/40 p-6 rounded-2xl transition-all duration-300 space-y-3"
              >
                <div className="w-8 h-8 rounded-full bg-dark-800 border border-dark-700 flex items-center justify-center text-amber-400 text-xs font-mono font-bold">
                  *
                </div>
                <h3 className="font-serif text-lg font-bold text-ivory-100">
                  {occ.title}
                </h3>
                <p className="text-xs text-stone-400 leading-relaxed">
                  {occ.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
