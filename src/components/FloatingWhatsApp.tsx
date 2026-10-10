import React, { useState } from 'react';
import { MessageCircle, Phone, X } from 'lucide-react';
import { restaurantInfo } from '../data/restaurantInfo';
import { getGeneralWhatsAppLink } from '../utils/whatsapp';

export const FloatingWhatsApp: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <aside aria-label="WhatsApp quick contact assistance" className="fixed bottom-5 right-5 z-30 flex flex-col items-end">
      {/* Tooltip Popup */}
      {showTooltip && (
        <div
          role="region"
          aria-label="Direct Concierge Details"
          className="mb-3 w-72 bg-white rounded-xl shadow-floating border border-sand-200 p-4 text-xs text-charcoal-800 animate-fade-in"
        >
          <div className="flex items-start justify-between mb-2">
            <div>
              <p className="font-serif font-bold text-charcoal-900 text-sm">
                MĀRA Concierge
              </p>
              <p className="text-[10px] text-sage-700 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Available 12 PM – 11 PM
              </p>
            </div>
            <button
              onClick={() => setShowTooltip(false)}
              className="text-charcoal-400 hover:text-charcoal-800 p-0.5 rounded"
              aria-label="Close concierge popup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-charcoal-600 mb-3 leading-relaxed">
            Have a question about today's menu or dietary preferences? Chat directly with our host team.
          </p>

          <div className="space-y-1.5">
            <a
              href={getGeneralWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-sage-600 hover:bg-sage-700 text-white rounded text-xs font-semibold transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Open in WhatsApp</span>
            </a>

            <a
              href={`tel:${restaurantInfo.phone}`}
              className="w-full flex items-center justify-center gap-2 py-1.5 px-3 bg-sand-100 hover:bg-sand-200 text-charcoal-900 rounded text-[11px] font-medium transition-colors"
            >
              <Phone className="w-3 h-3" />
              <span>Call: {restaurantInfo.displayPhone}</span>
            </a>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <div className="flex items-center gap-2">
        <a
          href={getGeneralWhatsAppLink()}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setShowTooltip(true)}
          className="flex items-center justify-center w-12 h-12 rounded-full bg-sage-600 hover:bg-sage-700 text-white shadow-elevated hover:shadow-floating transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:ring-offset-2"
          aria-label="Chat with MĀRA on WhatsApp"
          title="Chat with MĀRA on WhatsApp"
        >
          <MessageCircle className="w-6 h-6" />
        </a>
      </div>
    </aside>
  );
};
