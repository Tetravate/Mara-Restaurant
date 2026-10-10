import React from 'react';
import { Clock, MapPin, UtensilsCrossed, CalendarCheck2, ArrowUpRight } from 'lucide-react';
import { restaurantInfo } from '../data/restaurantInfo';

interface QuickInfoProps {
  onOpenReservation: () => void;
}

export const QuickInfo: React.FC<QuickInfoProps> = ({ onOpenReservation }) => {
  return (
    <section className="bg-sand-100 border-y border-sand-200" aria-label="Essential Restaurant Details">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Card 1: Today's Hours */}
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-lg bg-sand-200 text-charcoal-800 shrink-0">
              <Clock className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-charcoal-500 font-semibold mb-0.5">Today's Hours</p>
              <p className="text-base font-bold text-charcoal-900">{restaurantInfo.hours.displayToday}</p>
              <p className="text-xs text-charcoal-600 mt-0.5">Lunch 12–3:30 PM · Dinner 7–11 PM</p>
            </div>
          </div>

          {/* Card 2: Location */}
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-lg bg-sand-200 text-charcoal-800 shrink-0">
              <MapPin className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-charcoal-500 font-semibold mb-0.5">Location</p>
              <p className="text-base font-bold text-charcoal-900">{restaurantInfo.address.city}, {restaurantInfo.address.state}</p>
              <a
                href={restaurantInfo.address.mapQueryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-terracotta-600 hover:text-terracotta-700 font-medium underline mt-0.5"
              >
                <span>42 Race Course Road</span>
                <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Card 3: Cuisine */}
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-lg bg-sand-200 text-charcoal-800 shrink-0">
              <UtensilsCrossed className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-charcoal-500 font-semibold mb-0.5">Cuisine</p>
              <p className="text-base font-bold text-charcoal-900">{restaurantInfo.cuisine}</p>
              <p className="text-xs text-charcoal-600 mt-0.5">Seasonal sourcing · Kongu & Pan-Indian</p>
            </div>
          </div>

          {/* Card 4: Reservations */}
          <div className="flex items-start gap-4">
            <div className="p-2.5 rounded-lg bg-sand-200 text-terracotta-600 shrink-0">
              <CalendarCheck2 className="w-5 h-5" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider text-charcoal-500 font-semibold mb-0.5">Reservations</p>
              <p className="text-base font-bold text-charcoal-900">Available Online</p>
              <button
                onClick={onOpenReservation}
                className="inline-flex items-center gap-1 text-xs text-terracotta-600 hover:text-terracotta-700 font-semibold underline mt-0.5"
              >
                <span>Request a table for today</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
