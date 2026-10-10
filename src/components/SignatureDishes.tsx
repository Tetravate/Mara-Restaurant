import React from 'react';
import { Flame, MessageCircle, ArrowRight } from 'lucide-react';
import { MenuItem } from '../types';
import { menuItems } from '../data/menuData';
import { getDishEnquiryLink } from '../utils/whatsapp';

interface SignatureDishesProps {
  onSelectDish: (dish: MenuItem) => void;
  onExploreMenu: () => void;
}

export const SignatureDishes: React.FC<SignatureDishesProps> = ({ onSelectDish, onExploreMenu }) => {
  const signatures = menuItems.filter((item) => item.isSignature).slice(0, 4);

  return (
    <section className="py-20 sm:py-28 bg-sand-50" aria-labelledby="signatures-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16">
          <div>
            <span className="text-xs uppercase tracking-[0.2em] text-terracotta-600 font-semibold mb-2 block">
              Curated Highlights
            </span>
            <h2 id="signatures-heading" className="font-serif text-3xl sm:text-4xl md:text-5xl font-medium text-charcoal-900 tracking-tight">
              Signature Dishes
            </h2>
          </div>
          <p className="text-charcoal-600 text-sm sm:text-base max-w-md mt-4 md:mt-0 leading-relaxed">
            Dishes that define our philosophy — ancestral spice craft paired with contemporary restraint and seasonal produce.
          </p>
        </div>

        {/* Dishes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {signatures.map((dish) => (
            <article
              key={dish.id}
              className="group bg-white rounded-lg border border-sand-200 overflow-hidden shadow-subtle hover:shadow-elevated transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Dish Image Container */}
                <div className="relative aspect-[4/3] overflow-hidden bg-sand-200">
                  {dish.image && (
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                      loading="lazy"
                    />
                  )}
                  {/* Dietary Badge */}
                  <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                    {dish.dietary.map((tag) => (
                      <span
                        key={tag}
                        className={`text-[10px] font-bold tracking-wider px-2 py-0.5 rounded shadow-sm ${
                          tag === 'VEG'
                            ? 'bg-sage-600 text-white'
                            : tag === 'NON-VEG'
                            ? 'bg-terracotta-600 text-white'
                            : 'bg-charcoal-900/80 text-sand-50 backdrop-blur-sm'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Spice Rating */}
                  {dish.spiceLevel > 0 && (
                    <div
                      className="absolute top-3 right-3 bg-charcoal-950/75 backdrop-blur-sm text-sand-50 px-2 py-0.5 rounded flex items-center gap-1 text-[11px]"
                      title={`Spice level: ${dish.spiceLevel} of 3`}
                    >
                      <Flame className="w-3 h-3 text-terracotta-400 fill-terracotta-400" />
                      <span>{Array(dish.spiceLevel).fill('•').join('')}</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-baseline justify-between gap-2 mb-2">
                    <h3 className="font-serif text-xl font-semibold text-charcoal-900 group-hover:text-terracotta-600 transition-colors">
                      {dish.name}
                    </h3>
                    <span className="font-semibold text-charcoal-900 text-base shrink-0">
                      ₹{dish.price}
                    </span>
                  </div>

                  <p className="text-xs text-charcoal-500 font-medium mb-2.5">
                    {dish.subtitle}
                  </p>

                  <p className="text-sm text-charcoal-600 leading-relaxed line-clamp-3">
                    {dish.description}
                  </p>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="px-5 pb-5 pt-2 border-t border-sand-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => onSelectDish(dish)}
                  className="font-semibold text-charcoal-900 hover:text-terracotta-600 transition-colors focus:outline-none focus:underline"
                >
                  View Details
                </button>

                <a
                  href={getDishEnquiryLink(dish.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sage-700 hover:text-sage-800 font-medium py-1 px-2 rounded hover:bg-sage-50 transition-colors"
                  aria-label={`Ask about ${dish.name} on WhatsApp`}
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Ask on WhatsApp</span>
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom Menu Link */}
        <div className="mt-12 text-center">
          <button
            onClick={onExploreMenu}
            className="inline-flex items-center gap-2 text-sm font-semibold text-charcoal-900 hover:text-terracotta-600 transition-colors group"
          >
            <span>Browse our complete dining menu</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};
