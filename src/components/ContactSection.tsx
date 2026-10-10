import React from 'react';
import { MapPin, Phone, MessageCircle, Clock, Navigation } from 'lucide-react';
import { restaurantInfo } from '../data/restaurantInfo';
import { getGeneralWhatsAppLink } from '../utils/whatsapp';

export const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="py-20 sm:py-28 bg-sand-50 border-t border-sand-200" aria-labelledby="contact-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.2em] text-terracotta-600 font-semibold mb-2 block">
            Visit & Connect
          </span>
          <h2
            id="contact-heading"
            className="font-serif text-3xl sm:text-5xl font-medium text-charcoal-900 tracking-tight mb-4"
          >
            Location & Inquiries
          </h2>
          <p className="text-charcoal-600 text-sm sm:text-base leading-relaxed">
            Conveniently situated along the tree-lined avenues of Race Course Road in central Coimbatore.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Contact Details Cards */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-xl border border-sand-200 shadow-subtle space-y-6">
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="p-2.5 rounded-lg bg-sand-100 text-charcoal-800 shrink-0">
                  <MapPin className="w-5 h-5 text-terracotta-600" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-charcoal-900 mb-1">
                    Where to Find Us
                  </h3>
                  <p className="text-xs sm:text-sm text-charcoal-700 leading-relaxed">
                    {restaurantInfo.address.line1}, {restaurantInfo.address.line2}<br />
                    {restaurantInfo.address.city}, {restaurantInfo.address.state} {restaurantInfo.address.pincode}
                  </p>
                  <p className="text-xs text-charcoal-500 mt-1">
                    Landmark: 200m from Thomas Park · Complimentary Valet
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-4 border-t border-sand-100 pt-6">
                <div className="p-2.5 rounded-lg bg-sand-100 text-charcoal-800 shrink-0">
                  <Clock className="w-5 h-5 text-saffron-600" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-charcoal-900 mb-1">
                    Opening Hours
                  </h3>
                  <div className="text-xs sm:text-sm text-charcoal-700 space-y-1">
                    <p>
                      <strong>Lunch:</strong> {restaurantInfo.hours.lunch} (Daily)
                    </p>
                    <p>
                      <strong>Dinner:</strong> {restaurantInfo.hours.dinner} (Daily)
                    </p>
                    <p className="text-xs text-charcoal-500 mt-1">
                      Kitchen accepts last orders 30 minutes prior to closing.
                    </p>
                  </div>
                </div>
              </div>

              {/* Phone & WhatsApp */}
              <div className="flex items-start gap-4 border-t border-sand-100 pt-6">
                <div className="p-2.5 rounded-lg bg-sand-100 text-charcoal-800 shrink-0">
                  <Phone className="w-5 h-5 text-sage-600" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-charcoal-900 mb-1">
                    Direct Contacts
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-3 pt-1 text-xs">
                    <a
                      href={`tel:${restaurantInfo.phone}`}
                      className="inline-flex items-center gap-1.5 text-charcoal-900 font-semibold hover:text-terracotta-600"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{restaurantInfo.displayPhone}</span>
                    </a>
                    <span className="hidden sm:inline text-sand-300">|</span>
                    <a
                      href={getGeneralWhatsAppLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sage-700 font-semibold hover:text-sage-800"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>{restaurantInfo.displayWhatsapp}</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a
                href={restaurantInfo.address.mapQueryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3.5 px-6 rounded-lg bg-charcoal-900 hover:bg-terracotta-600 text-sand-50 font-semibold text-xs transition-colors shadow-sm"
              >
                <Navigation className="w-4 h-4" />
                <span>Get Directions (Google Maps)</span>
              </a>

              <a
                href={getGeneralWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3.5 px-6 rounded-lg bg-sage-600 hover:bg-sage-700 text-white font-semibold text-xs transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat with Concierge</span>
              </a>
            </div>
          </div>

          {/* Map Preview & Arrival Card */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-xl border border-sand-200 shadow-subtle flex flex-col justify-between">
            <div>
              <h3 className="font-serif text-xl font-bold text-charcoal-900 mb-2">
                Getting to MĀRA
              </h3>
              <p className="text-xs sm:text-sm text-charcoal-600 mb-6 leading-relaxed">
                Situated in Coimbatore's premier dining and walking promenade at Race Course. Accessible easily from Avinashi Road and Trichy Road.
              </p>

              {/* Stylized Map View / Landmark Card */}
              <div className="relative aspect-[16/9] rounded-lg overflow-hidden border border-sand-300 bg-sand-100 flex flex-col items-center justify-center p-6 text-center shadow-inner group">
                <div className="w-12 h-12 rounded-full bg-terracotta-500 text-white flex items-center justify-center shadow-elevated mb-3 group-hover:scale-110 transition-transform">
                  <MapPin className="w-6 h-6" />
                </div>
                <p className="font-serif text-base font-bold text-charcoal-900">
                  42 Race Course Road, Coimbatore
                </p>
                <p className="text-[11px] text-charcoal-500 mt-1 max-w-xs">
                  Near Thomas Park · Ample dedicated valet parking at the portico entrance
                </p>

                <a
                  href={restaurantInfo.address.mapQueryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 px-4 py-2 bg-white text-charcoal-900 font-semibold text-xs rounded border border-sand-300 shadow-sm hover:bg-sand-50 transition-colors inline-flex items-center gap-1.5"
                >
                  <Navigation className="w-3.5 h-3.5 text-terracotta-600" />
                  <span>Open in Navigation App</span>
                </a>
              </div>
            </div>

            {/* Travel Times & Highlights */}
            <div className="grid grid-cols-3 gap-2 text-center pt-6 mt-6 border-t border-sand-100 text-[11px] text-charcoal-600">
              <div className="p-2 rounded bg-sand-50">
                <span className="font-bold text-charcoal-900 block">15 min</span>
                <span>From Airport</span>
              </div>
              <div className="p-2 rounded bg-sand-50">
                <span className="font-bold text-charcoal-900 block">8 min</span>
                <span>From Railway Stn</span>
              </div>
              <div className="p-2 rounded bg-sand-50">
                <span className="font-bold text-charcoal-900 block">Valet</span>
                <span>Complimentary</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
