import React, { useState, useMemo } from 'react';
import { Sparkles, X, Check, ArrowRight, MessageCircle, HelpCircle } from 'lucide-react';
import { MoodTag, MenuItem } from '../types';
import { menuItems } from '../data/menuData';
import { getDishEnquiryLink } from '../utils/whatsapp';

interface FindYourDishProps {
  onSelectDish: (dish: MenuItem) => void;
  onExploreMenu: () => void;
}

const MOOD_OPTIONS: { label: MoodTag; icon: string; description: string }[] = [
  { label: 'Vegetarian', icon: '🌱', description: 'Pure plant & dairy preparations' },
  { label: 'Spicy', icon: '🌶️', description: 'Bold stone-ground heat & peppercorn' },
  { label: 'Light', icon: '🍃', description: 'Clarified broths, fresh greens & herb oils' },
  { label: 'Comfort', icon: '🍲', description: 'Slow-simmered curries, biryanis & buttery breads' },
  { label: 'Sweet', icon: '🍯', description: 'Artisanal tarts, jaggery caramel & payasam' },
  { label: 'Under ₹400', icon: '🏷️', description: 'Accessible small plates, broths & coolers' },
];

export const FindYourDish: React.FC<FindYourDishProps> = ({ onSelectDish, onExploreMenu }) => {
  const [selectedMoods, setSelectedMoods] = useState<MoodTag[]>(['Vegetarian', 'Comfort']);

  const toggleMood = (mood: MoodTag) => {
    setSelectedMoods((prev) =>
      prev.includes(mood) ? prev.filter((m) => m !== mood) : [...prev, mood]
    );
  };

  const clearMoods = () => {
    setSelectedMoods([]);
  };

  // Filter recommendations based on active moods
  const recommendedDishes = useMemo(() => {
    if (selectedMoods.length === 0) {
      // If nothing selected, show popular curated items
      return menuItems.filter((i) => i.isSignature).slice(0, 6);
    }

    return menuItems.filter((item) => {
      // Must match every selected mood tag
      return selectedMoods.every((mood) => {
        if (mood === 'Under ₹400') {
          return item.price <= 400;
        }
        if (mood === 'Vegetarian') {
          return item.dietary.includes('VEG') || item.dietary.includes('VEGAN');
        }
        return item.moods.includes(mood);
      });
    });
  }, [selectedMoods]);

  return (
    <section
      id="find-your-dish"
      className="py-20 sm:py-28 bg-charcoal-900 text-sand-50 relative overflow-hidden"
      aria-labelledby="find-dish-heading"
    >
      {/* Decorative subtle texture glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-terracotta-900/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-saffron-900/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-sand-50/10 border border-sand-50/15 text-saffron-300 text-xs font-semibold tracking-wider uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Guide</span>
          </div>

          <h2
            id="find-dish-heading"
            className="font-serif text-3xl sm:text-5xl font-medium tracking-tight text-sand-50 mb-4"
          >
            What are you in the mood for?
          </h2>

          <p className="text-sand-300 text-sm sm:text-base leading-relaxed">
            Select what you are craving. Our live menu filter pairs your mood with dishes crafted for that exact moment.
          </p>
        </div>

        {/* Mood Selector Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3.5 max-w-4xl mx-auto mb-10">
          {MOOD_OPTIONS.map((option) => {
            const isSelected = selectedMoods.includes(option.label);
            return (
              <button
                key={option.label}
                onClick={() => toggleMood(option.label)}
                className={`group flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 border focus:outline-none focus:ring-2 focus:ring-terracotta-400 ${
                  isSelected
                    ? 'bg-terracotta-500 text-white border-terracotta-400 shadow-md scale-105'
                    : 'bg-charcoal-800 text-sand-200 border-charcoal-700 hover:bg-charcoal-700 hover:border-sand-400/40'
                }`}
                aria-pressed={isSelected}
              >
                <span className="text-base">{option.icon}</span>
                <span>{option.label}</span>
                {isSelected ? (
                  <Check className="w-3.5 h-3.5 ml-0.5 text-white" />
                ) : null}
              </button>
            );
          })}

          {selectedMoods.length > 0 && (
            <button
              onClick={clearMoods}
              className="flex items-center gap-1 px-3 py-2 text-xs text-sand-400 hover:text-sand-200 transition-colors underline ml-2"
              aria-label="Clear active filters"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Results Info & Count */}
        <div className="flex items-center justify-between max-w-5xl mx-auto mb-6 text-xs text-sand-400 px-2">
          <span>
            {selectedMoods.length > 0 ? (
              <>
                Matching <strong className="text-sand-100">{selectedMoods.join(' + ')}</strong>:{' '}
                <span className="text-saffron-300 font-semibold">{recommendedDishes.length}</span> {recommendedDishes.length === 1 ? 'dish' : 'dishes'}
              </>
            ) : (
              <>Showing Chef's curated selections ({recommendedDishes.length} dishes)</>
            )}
          </span>

          <div className="hidden sm:flex items-center gap-1 text-[11px] text-sand-400/80">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Direct rule-based matching · Transparent & instant</span>
          </div>
        </div>

        {/* Results Cards Grid */}
        {recommendedDishes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {recommendedDishes.map((dish) => (
              <div
                key={dish.id}
                className="bg-charcoal-800/80 border border-charcoal-700/80 rounded-lg p-5 flex flex-col justify-between hover:border-terracotta-500/60 hover:bg-charcoal-800 transition-all duration-200"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="font-serif text-lg font-semibold text-sand-50">
                      {dish.name}
                    </h3>
                    <span className="font-semibold text-saffron-300 text-base shrink-0">
                      ₹{dish.price}
                    </span>
                  </div>

                  <p className="text-xs text-sand-300 font-medium mb-3">
                    {dish.subtitle || dish.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {dish.dietary.map((tag) => (
                      <span
                        key={tag}
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wider ${
                          tag === 'VEG'
                            ? 'bg-sage-900/80 text-sage-200 border border-sage-700/50'
                            : 'bg-terracotta-900/80 text-terracotta-200 border border-terracotta-700/50'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                    {dish.moods.map((m) => (
                      <span
                        key={m}
                        className="text-[9px] bg-charcoal-700 text-sand-300 px-1.5 py-0.5 rounded"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-charcoal-700/60 flex items-center justify-between text-xs">
                  <button
                    onClick={() => onSelectDish(dish)}
                    className="text-sand-300 hover:text-white font-medium underline focus:outline-none"
                  >
                    View Details
                  </button>

                  <a
                    href={getDishEnquiryLink(dish.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-terracotta-300 hover:text-terracotta-200 font-medium"
                    aria-label={`Ask about ${dish.name} on WhatsApp`}
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Ask MĀRA</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-charcoal-800/60 border border-charcoal-700 rounded-lg p-10 text-center max-w-lg mx-auto">
            <p className="font-serif text-xl text-sand-100 mb-2">No dishes match this exact combination.</p>
            <p className="text-xs text-sand-400 mb-6">
              Try deselecting one filter or browse our entire seasonal menu.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={clearMoods}
                className="px-4 py-2 bg-charcoal-700 hover:bg-charcoal-600 text-sand-50 rounded text-xs font-semibold transition-colors"
              >
                Reset Mood Filters
              </button>
              <button
                onClick={onExploreMenu}
                className="px-4 py-2 bg-terracotta-500 hover:bg-terracotta-600 text-white rounded text-xs font-semibold transition-colors"
              >
                View Full Menu
              </button>
            </div>
          </div>
        )}

        {/* View Full Menu Footer Link */}
        <div className="mt-12 text-center">
          <button
            onClick={onExploreMenu}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-sand-50/10 hover:bg-sand-50/20 text-sand-100 text-sm font-medium border border-sand-50/20 transition-colors"
          >
            <span>View Full Menu & All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};
