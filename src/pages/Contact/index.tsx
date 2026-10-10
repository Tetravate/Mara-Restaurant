import React from 'react';
import { MapPin, Phone, MessageCircle, Clock, Navigation, Sparkles, Car } from 'lucide-react';
import { restaurantInfo } from '../../data/restaurant';
import { getGeneralWhatsAppLink } from '../../utils/whatsapp';

export const ContactPage: React.FC = () => {
  return (
    <div className="py-12 sm:py-20 bg-dark-950 text-ivory-100 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-amber-500 font-mono text-xs uppercase tracking-widest font-semibold">
              Location and Enquiries
            </span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-medium text-ivory-100 tracking-tight">
            Find Us in Coimbatore
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
            Conveniently situated along the tree-lined promenades of Race Course Road in central Coimbatore.
          </p>
        </div>

        {/* Contact Cards & Map Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Details Column */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="bg-dark-900/90 p-8 rounded-3xl border border-dark-700/80 shadow-2xl space-y-6 backdrop-blur-md">
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-dark-800 border border-dark-700 text-amber-500 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h2 className="font-serif text-base font-bold text-ivory-100">
                    Dining Address
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                    {restaurantInfo.address.line1}, {restaurantInfo.address.line2}<br />
                    {restaurantInfo.address.city}, {restaurantInfo.address.state} {restaurantInfo.address.pincode}
                  </p>
                  <p className="text-xs text-amber-400/80 pt-0.5">
                    Landmark: Near Thomas Park · Complimentary Valet
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-4 border-t border-dark-800 pt-6">
                <div className="p-3 rounded-xl bg-dark-800 border border-dark-700 text-amber-500 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h2 className="font-serif text-base font-bold text-ivory-100">
                    Opening Hours
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                    <strong className="text-ivory-100">Lunch:</strong> {restaurantInfo.hours.lunch} (Daily)<br />
                    <strong className="text-ivory-100">Dinner:</strong> {restaurantInfo.hours.dinner} (Daily)
                  </p>
                  <p className="text-[11px] text-stone-500 pt-0.5">
                    Last kitchen order accepted at 10:30 PM.
                  </p>
                </div>
              </div>

              {/* Phone & WhatsApp */}
              <div className="flex items-start gap-4 border-t border-dark-800 pt-6">
                <div className="p-3 rounded-xl bg-dark-800 border border-dark-700 text-amber-500 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="space-y-1.5">
                  <h2 className="font-serif text-base font-bold text-ivory-100">
                    Direct Concierge
                  </h2>
                  <div className="flex flex-col sm:flex-row gap-3 text-xs text-stone-300">
                    <a
                      href={`tel:${restaurantInfo.phone}`}
                      className="font-semibold text-ivory-100 hover:text-amber-400 transition-colors"
                    >
                      Phone: {restaurantInfo.displayPhone}
                    </a>
                    <span className="hidden sm:inline text-dark-700">|</span>
                    <a
                      href={getGeneralWhatsAppLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-amber-400 hover:text-amber-300 transition-colors"
                    >
                      WhatsApp: {restaurantInfo.displayWhatsapp}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href={restaurantInfo.address.mapQueryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-dark-900 border border-dark-700 hover:border-amber-500 text-ivory-100 font-semibold text-xs transition-all shadow-md group"
              >
                <Navigation className="w-4 h-4 text-amber-500 group-hover:scale-110 transition-transform" />
                <span>Get Directions (Google Maps)</span>
              </a>

              <a
                href={getGeneralWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-dark-950 font-bold text-xs transition-all shadow-glow-amber"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat with Concierge</span>
              </a>
            </div>
          </div>

          {/* Stylized Arrival Guide */}
          <div className="lg:col-span-6 bg-dark-900/90 p-8 rounded-3xl border border-dark-700/80 shadow-2xl flex flex-col justify-between backdrop-blur-md">
            <div className="space-y-5">
              <div className="flex items-center gap-2">
                <Car className="w-4 h-4 text-amber-500" />
                <h2 className="font-serif text-2xl font-bold text-ivory-100">
                  Getting to MĀRA
                </h2>
              </div>
              <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
                Located on Coimbatore's iconic Race Course promenade. Readily accessible from Avinashi Road and Trichy Road.
              </p>

              {/* Map Preview Graphic */}
              <div className="relative aspect-[16/10] rounded-2xl overflow-hidden border border-dark-700 bg-dark-950 flex flex-col items-center justify-center p-6 text-center shadow-inner group">
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#D8893E_1px,transparent_1px)] [background-size:16px_16px]" />

                <div className="w-12 h-12 rounded-full bg-amber-500 text-dark-950 flex items-center justify-center shadow-glow-amber mb-3 group-hover:scale-110 transition-transform relative z-10">
                  <MapPin className="w-6 h-6" />
                </div>
                <p className="font-serif text-base font-bold text-ivory-100 relative z-10">
                  42 Race Course Road, Coimbatore
                </p>
                <p className="text-[11px] text-stone-400 mt-1 max-w-xs relative z-10">
                  Near Thomas Park · Ample dedicated valet parking at our entrance
                </p>

                <a
                  href={restaurantInfo.address.mapQueryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 px-4 py-2 bg-dark-900 hover:bg-dark-800 text-ivory-100 font-semibold text-xs rounded-xl border border-dark-700 shadow-sm hover:border-amber-500 transition-colors inline-flex items-center gap-1.5 relative z-10"
                >
                  <Navigation className="w-3.5 h-3.5 text-amber-500" />
                  <span>Open in Navigation App</span>
                </a>
              </div>
            </div>

            {/* Travel Times */}
            <div className="grid grid-cols-3 gap-3 text-center pt-6 mt-6 border-t border-dark-800 text-[11px] text-stone-400">
              <div className="p-3 rounded-xl bg-dark-950/80 border border-dark-800">
                <span className="font-bold text-amber-400 block text-xs">15 min</span>
                <span>From Airport</span>
              </div>
              <div className="p-3 rounded-xl bg-dark-950/80 border border-dark-800">
                <span className="font-bold text-amber-400 block text-xs">8 min</span>
                <span>From Railway Stn</span>
              </div>
              <div className="p-3 rounded-xl bg-dark-950/80 border border-dark-800">
                <span className="font-bold text-amber-400 block text-xs">Valet</span>
                <span>Complimentary</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
