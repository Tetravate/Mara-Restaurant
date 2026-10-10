import React, { useState } from 'react';
import { MessageCircle, Phone, X } from 'lucide-react';
import { restaurantInfo } from '../../data/restaurant';
import { getGeneralWhatsAppLink } from '../../utils/whatsapp';

export const FloatingWhatsApp: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <aside aria-label="WhatsApp quick contact assistance" className="fixed bottom-6 right-6 z-30 flex flex-col items-end">
      {/* Tooltip Popup */}
      {showTooltip && (
        <div
          role="region"
          aria-label="Direct Concierge Details"
          className="mb-3 w-80 bg-dark-900/95 rounded-2xl shadow-2xl border border-dark-700/80 p-5 text-xs text-stone-300 backdrop-blur-xl animate-fade-in"
        >
          <div className="flex items-start justify-between mb-3 border-b border-dark-800 pb-3">
            <div>
              <p className="font-serif font-bold text-ivory-100 text-sm">
                MĀRA Host Concierge
              </p>
              <p className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1.5 mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Available Daily · 12 PM - 11 PM
              </p>
            </div>
            <button
              onClick={() => setShowTooltip(false)}
              className="text-stone-500 hover:text-ivory-100 p-1 rounded-lg hover:bg-dark-800 transition-colors"
              aria-label="Close concierge popup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-stone-400 mb-4 leading-relaxed text-xs">
            Have questions regarding dietary requirements, table availability, or private celebrations? Chat directly with our host team in Coimbatore.
          </p>

          <div className="space-y-2">
            <a
              href={getGeneralWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 bg-amber-500 hover:bg-amber-400 text-dark-950 rounded-xl text-xs font-bold shadow-glow-amber transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Open in WhatsApp</span>
            </a>

            <a
              href={`tel:${restaurantInfo.phone}`}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-dark-950 hover:bg-dark-800 text-stone-300 hover:text-ivory-100 rounded-xl text-[11px] font-medium border border-dark-800 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-amber-500" />
              <span>Direct Dial: {restaurantInfo.displayPhone}</span>
            </a>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setShowTooltip((prev) => !prev)}
          className="flex items-center justify-center w-14 h-14 rounded-full bg-amber-500 hover:bg-amber-400 text-dark-950 shadow-glow-amber transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-dark-950 group"
          aria-label="Toggle MĀRA WhatsApp Concierge"
          title="Chat with MĀRA Concierge"
        >
          <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
        </button>
      </div>
    </aside>
  );
};
