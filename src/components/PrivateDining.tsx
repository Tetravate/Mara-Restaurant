import React, { useState } from 'react';
import { Users, Calendar, Sparkles, MessageCircle, Wine, HeartHandshake } from 'lucide-react';
import { getPrivateDiningWhatsAppLink } from '../utils/whatsapp';

export const PrivateDining: React.FC = () => {
  const [guestCount, setGuestCount] = useState<number>(12);
  const [selectedDate, setSelectedDate] = useState<string>('');

  const features = [
    {
      icon: Users,
      title: 'Seating for 8 to 24',
      description: 'An intimate, sound-insulated private dining room with dedicated service staff and bespoke table arrangements.',
    },
    {
      icon: Wine,
      title: 'Curated Tasting Menus',
      description: 'Custom multi-course vegetarian and non-vegetarian menus curated personally by Chef Vikram Sundaram.',
    },
    {
      icon: HeartHandshake,
      title: 'Milestones & Corporate Gatherings',
      description: 'Tailored ambient lighting, custom floral arrangements, and quiet hospitality suited for important occasions.',
    },
  ];

  return (
    <section id="private-dining" className="py-20 sm:py-28 bg-white border-t border-sand-200" aria-labelledby="private-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-charcoal-900 rounded-2xl overflow-hidden shadow-floating text-sand-50">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center p-8 sm:p-12 lg:p-16">
            {/* Left Column: Story & Features */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sand-50/10 border border-sand-50/15 text-saffron-300 text-xs font-semibold uppercase tracking-wider mb-4">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Exclusive Gatherings</span>
              </div>

              <h2
                id="private-heading"
                className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium tracking-tight text-sand-50 mb-4 leading-tight"
              >
                Private Dining & Celebrations
              </h2>

              <p className="text-sand-300 text-sm sm:text-base leading-relaxed mb-8">
                Whether celebrating family milestones, hosting corporate dinners, or sharing an intimate anniversary feast, our private dining sanctuary provides an elevated dining experience crafted around your pace.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 pt-6 border-t border-charcoal-800">
                {features.map((feat) => {
                  const Icon = feat.icon;
                  return (
                    <div key={feat.title} className="flex flex-col">
                      <div className="p-2 w-fit rounded-lg bg-charcoal-800 text-saffron-300 mb-2.5">
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="font-serif text-base font-semibold text-sand-100 mb-1">
                        {feat.title}
                      </h3>
                      <p className="text-xs text-sand-400 leading-relaxed">
                        {feat.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Quick Enquiry Box */}
            <div className="lg:col-span-5 bg-charcoal-800/90 border border-charcoal-700 p-6 sm:p-8 rounded-xl flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-xl font-semibold text-sand-50 mb-2">
                  Plan Your Event
                </h3>
                <p className="text-xs text-sand-300 mb-6">
                  Select your expected party size and date. We will prepare an immediate tailored menu enquiry for WhatsApp.
                </p>

                {/* Guest counter */}
                <div className="mb-4">
                  <label htmlFor="private-guests" className="block text-xs uppercase tracking-wider text-sand-400 font-semibold mb-2">
                    Estimated Guests: <span className="text-saffron-300 font-bold">{guestCount}</span>
                  </label>
                  <input
                    id="private-guests"
                    type="range"
                    min="6"
                    max="24"
                    step="1"
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full accent-terracotta-500 cursor-pointer h-2 bg-charcoal-700 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-sand-400 mt-1">
                    <span>6 Guests (Intimate)</span>
                    <span>24 Guests (Full Room)</span>
                  </div>
                </div>

                {/* Date Input */}
                <div className="mb-6">
                  <label htmlFor="private-date" className="block text-xs uppercase tracking-wider text-sand-400 font-semibold mb-2">
                    Preferred Date (Optional)
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sand-400" />
                    <input
                      id="private-date"
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-charcoal-900 border border-charcoal-700 rounded text-xs text-sand-100 focus:outline-none focus:ring-1 focus:ring-terracotta-400"
                    />
                  </div>
                </div>
              </div>

              {/* WhatsApp Enquiry Button */}
              <a
                href={getPrivateDiningWhatsAppLink(guestCount, selectedDate || undefined)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-lg bg-terracotta-500 hover:bg-terracotta-600 text-white font-semibold text-sm transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-terracotta-400"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Enquire on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
