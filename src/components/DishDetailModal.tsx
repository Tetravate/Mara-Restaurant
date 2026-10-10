import React from 'react';
import { X, Flame, MessageCircle, Utensils } from 'lucide-react';
import { MenuItem } from '../types';
import { getDishEnquiryLink } from '../utils/whatsapp';

interface DishDetailModalProps {
  dish: MenuItem | null;
  onClose: () => void;
}

export const DishDetailModal: React.FC<DishDetailModalProps> = ({ dish, onClose }) => {
  if (!dish) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal-950/75 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dish-detail-title"
    >
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-sand-200 overflow-hidden">
        {/* Dish Image */}
        {dish.image && (
          <div className="relative aspect-[16/9] w-full bg-sand-200 overflow-hidden">
            <img
              src={dish.image}
              alt={dish.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/70 via-transparent to-transparent" />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full bg-charcoal-950/60 text-sand-50 hover:bg-charcoal-950 transition-colors"
              aria-label="Close dish details"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {!dish.image && (
          <div className="flex justify-end p-4 border-b border-sand-200">
            <button
              onClick={onClose}
              className="p-2 rounded-full text-charcoal-500 hover:text-charcoal-950"
              aria-label="Close dish details"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-terracotta-600 block mb-1">
                {dish.category}
              </span>
              <h2 id="dish-detail-title" className="font-serif text-2xl font-bold text-charcoal-900">
                {dish.name}
              </h2>
            </div>
            <span className="font-serif text-xl font-bold text-charcoal-900">
              ₹{dish.price}
            </span>
          </div>

          {dish.subtitle && (
            <p className="text-xs text-charcoal-500 font-medium mb-3 italic">
              {dish.subtitle}
            </p>
          )}

          {/* Badges */}
          <div className="flex items-center gap-1.5 flex-wrap mb-4">
            {dish.dietary.map((tag) => (
              <span
                key={tag}
                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  tag === 'VEG'
                    ? 'bg-sage-600 text-white'
                    : tag === 'NON-VEG'
                    ? 'bg-terracotta-600 text-white'
                    : 'bg-sand-200 text-charcoal-800'
                }`}
              >
                {tag}
              </span>
            ))}
            {dish.spiceLevel > 0 && (
              <span className="text-[10px] bg-terracotta-50 text-terracotta-700 px-2 py-0.5 rounded border border-terracotta-200 font-medium flex items-center gap-1">
                <Flame className="w-3 h-3 text-terracotta-500" />
                <span>Spice {dish.spiceLevel}/3</span>
              </span>
            )}
          </div>

          <p className="text-xs sm:text-sm text-charcoal-700 leading-relaxed mb-5">
            {dish.description}
          </p>

          {/* Pairing Note */}
          {dish.pairingNote && (
            <div className="bg-sand-50 p-3.5 rounded-lg border border-sand-200 text-xs text-charcoal-600 flex items-start gap-2 mb-6">
              <Utensils className="w-4 h-4 text-terracotta-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-charcoal-900 block mb-0.5">Sommelier & Chef Pairing:</strong>
                <span>{dish.pairingNote}</span>
              </div>
            </div>
          )}

          {/* Action CTAs */}
          <div className="flex items-center justify-between gap-3 pt-4 border-t border-sand-200">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded text-xs font-semibold text-charcoal-600 hover:text-charcoal-900"
            >
              Close
            </button>

            <a
              href={getDishEnquiryLink(dish.name)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-sage-600 hover:bg-sage-700 text-white rounded font-semibold text-xs shadow transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Ask About Dish on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
