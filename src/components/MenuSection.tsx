import React, { useState, useMemo } from 'react';
import { Search, X, Flame, MessageCircle, AlertCircle, Sparkles } from 'lucide-react';
import { MenuCategoryId, MenuItem, DietaryTag } from '../types';
import { menuCategories, menuItems } from '../data/menuData';
import { getDishEnquiryLink } from '../utils/whatsapp';

interface MenuSectionProps {
  onSelectDish: (dish: MenuItem) => void;
}

export const MenuSection: React.FC<MenuSectionProps> = ({ onSelectDish }) => {
  const [activeCategory, setActiveCategory] = useState<MenuCategoryId>('starters');
  const [searchQuery, setSearchQuery] = useState('');
  const [dietaryFilter, setDietaryFilter] = useState<'ALL' | DietaryTag | 'UNDER-400'>('ALL');

  // Filtered menu items
  const filteredItems = useMemo(() => {
    return menuItems.filter((item) => {
      // If search query exists, search globally across all categories
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
          item.category.toLowerCase().includes(q) ||
          item.dietary.some((d) => d.toLowerCase().includes(q));

        if (!matchesSearch) return false;
      } else {
        // Otherwise filter by active category
        if (item.category !== activeCategory) return false;
      }

      // Dietary filter check
      if (dietaryFilter === 'UNDER-400') {
        if (item.price > 400) return false;
      } else if (dietaryFilter !== 'ALL') {
        if (!item.dietary.includes(dietaryFilter)) return false;
      }

      return true;
    });
  }, [activeCategory, searchQuery, dietaryFilter]);

  const activeCategoryMeta = menuCategories.find((c) => c.id === activeCategory);

  const clearSearchAndFilters = () => {
    setSearchQuery('');
    setDietaryFilter('ALL');
  };

  return (
    <section id="menu" className="py-20 sm:py-28 bg-sand-50" aria-labelledby="menu-heading">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.2em] text-terracotta-600 font-semibold mb-2 block">
            Seasonal & Contemporary
          </span>
          <h2
            id="menu-heading"
            className="font-serif text-3xl sm:text-5xl font-medium text-charcoal-900 tracking-tight mb-4"
          >
            The Dining Menu
          </h2>
          <p className="text-charcoal-600 text-sm sm:text-base leading-relaxed">
            Every dish is cooked fresh to order with stone-ground spices, cold-pressed oils, and ingredients from local hill farms.
          </p>
        </div>

        {/* Search & Dietary Filter Controls */}
        <div className="bg-white p-4 sm:p-6 rounded-xl border border-sand-200 shadow-subtle mb-10 max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <label htmlFor="menu-search" className="sr-only">
                Search dishes or ingredients
              </label>
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal-400" />
              <input
                id="menu-search"
                type="text"
                placeholder="Search dishes, ingredients (e.g. paneer, crab, biryani)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-sand-50 border border-sand-200 rounded-lg text-sm text-charcoal-900 placeholder:text-charcoal-400 focus:outline-none focus:ring-2 focus:ring-terracotta-500 focus:bg-white transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-400 hover:text-charcoal-700 p-1 rounded-full"
                  aria-label="Clear search input"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Dietary Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none" role="group" aria-label="Dietary filter options">
              <button
                onClick={() => setDietaryFilter('ALL')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  dietaryFilter === 'ALL'
                    ? 'bg-charcoal-900 text-sand-50'
                    : 'bg-sand-100 text-charcoal-700 hover:bg-sand-200'
                }`}
              >
                All Dishes
              </button>
              <button
                onClick={() => setDietaryFilter('VEG')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  dietaryFilter === 'VEG'
                    ? 'bg-sage-600 text-white'
                    : 'bg-sand-100 text-sage-800 hover:bg-sage-100'
                }`}
              >
                Vegetarian
              </button>
              <button
                onClick={() => setDietaryFilter('NON-VEG')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  dietaryFilter === 'NON-VEG'
                    ? 'bg-terracotta-600 text-white'
                    : 'bg-sand-100 text-terracotta-800 hover:bg-terracotta-100'
                }`}
              >
                Non-Veg
              </button>
              <button
                onClick={() => setDietaryFilter('GLUTEN-FREE')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  dietaryFilter === 'GLUTEN-FREE'
                    ? 'bg-charcoal-800 text-sand-50'
                    : 'bg-sand-100 text-charcoal-700 hover:bg-sand-200'
                }`}
              >
                Gluten-Free
              </button>
              <button
                onClick={() => setDietaryFilter('UNDER-400')}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  dietaryFilter === 'UNDER-400'
                    ? 'bg-saffron-600 text-white'
                    : 'bg-sand-100 text-charcoal-700 hover:bg-sand-200'
                }`}
              >
                Under ₹400
              </button>
            </div>
          </div>
        </div>

        {/* Category Tabs (shown when not in global search mode) */}
        {!searchQuery && (
          <div className="mb-10">
            <nav
              className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-3 border-b border-sand-200 scrollbar-none"
              aria-label="Menu Category Tabs"
            >
              {menuCategories.map((category) => {
                const isActive = activeCategory === category.id;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`px-5 py-2.5 rounded-t-lg font-medium text-sm transition-all whitespace-nowrap border-b-2 focus:outline-none ${
                      isActive
                        ? 'border-terracotta-500 text-terracotta-600 font-semibold bg-sand-100/60'
                        : 'border-transparent text-charcoal-600 hover:text-charcoal-900 hover:bg-sand-100/40'
                    }`}
                    aria-selected={isActive}
                    role="tab"
                  >
                    {category.title}
                  </button>
                );
              })}
            </nav>

            {/* Category Subtitle */}
            {activeCategoryMeta && (
              <p className="text-center text-xs sm:text-sm text-charcoal-500 mt-4 italic">
                {activeCategoryMeta.description}
              </p>
            )}
          </div>
        )}

        {/* Active Search Notification Banner */}
        {searchQuery && (
          <div className="mb-8 flex items-center justify-between bg-sand-100 px-4 py-2.5 rounded-lg border border-sand-200 text-xs text-charcoal-700">
            <span>
              Searching all categories for: <strong>"{searchQuery}"</strong> ({filteredItems.length} results)
            </span>
            <button
              onClick={() => setSearchQuery('')}
              className="text-terracotta-600 hover:text-terracotta-700 font-semibold underline ml-3"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Menu Items Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {filteredItems.map((item) => (
              <article
                key={item.id}
                className="bg-white p-5 rounded-lg border border-sand-200 hover:border-sand-300 shadow-subtle hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Title and Price */}
                  <div className="flex items-baseline justify-between gap-3 mb-1.5">
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif text-lg sm:text-xl font-semibold text-charcoal-900 group-hover:text-terracotta-600 transition-colors">
                        {item.name}
                      </h3>
                      {item.isSignature && (
                        <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold bg-saffron-100 text-saffron-800 px-1.5 py-0.5 rounded border border-saffron-200">
                          <Sparkles className="w-2.5 h-2.5" />
                          Signature
                        </span>
                      )}
                    </div>
                    <span className="font-semibold text-charcoal-900 text-base shrink-0">
                      ₹{item.price}
                    </span>
                  </div>

                  {/* Subtitle / Key Flavor */}
                  {item.subtitle && (
                    <p className="text-xs text-charcoal-500 font-medium mb-2.5">
                      {item.subtitle}
                    </p>
                  )}

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-charcoal-600 leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                {/* Badges & Actions */}
                <div className="pt-3 border-t border-sand-100 flex items-center justify-between flex-wrap gap-2 text-xs">
                  {/* Dietary & Spice Tags */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {item.dietary.map((tag) => (
                      <span
                        key={tag}
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wide ${
                          tag === 'VEG'
                            ? 'bg-sage-100 text-sage-800 border border-sage-200'
                            : tag === 'NON-VEG'
                            ? 'bg-terracotta-100 text-terracotta-800 border border-terracotta-200'
                            : 'bg-sand-100 text-charcoal-600 border border-sand-200'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}

                    {item.spiceLevel > 0 && (
                      <span
                        className="inline-flex items-center gap-0.5 text-[9px] text-terracotta-600 bg-terracotta-50 px-1.5 py-0.5 rounded border border-terracotta-200 font-medium"
                        title={`Spice level: ${item.spiceLevel}/3`}
                      >
                        <Flame className="w-2.5 h-2.5 fill-terracotta-500" />
                        <span>{'•'.repeat(item.spiceLevel)}</span>
                      </span>
                    )}
                  </div>

                  {/* Quick Links */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onSelectDish(item)}
                      className="text-xs font-semibold text-charcoal-800 hover:text-terracotta-600 underline focus:outline-none"
                    >
                      Details
                    </button>
                    <a
                      href={getDishEnquiryLink(item.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-sage-700 hover:text-sage-900 font-medium p-1 rounded hover:bg-sage-50 transition-colors"
                      aria-label={`Ask about ${item.name} on WhatsApp`}
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Ask MĀRA</span>
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* Empty Search / Filter State */
          <div className="bg-white border border-sand-200 rounded-xl p-10 text-center max-w-md mx-auto my-8 shadow-subtle">
            <AlertCircle className="w-10 h-10 text-charcoal-400 mx-auto mb-3" />
            <h3 className="font-serif text-lg font-semibold text-charcoal-900 mb-1">
              No dishes found
            </h3>
            <p className="text-xs text-charcoal-500 mb-6 leading-relaxed">
              We couldn't find any dishes matching your current search or dietary selection.
            </p>
            <button
              onClick={clearSearchAndFilters}
              className="px-5 py-2.5 bg-terracotta-500 hover:bg-terracotta-600 text-white rounded text-xs font-semibold transition-colors shadow-sm"
            >
              Reset Search & Filters
            </button>
          </div>
        )}

        {/* Dietary & Allergy Notice Card */}
        <div className="mt-14 max-w-4xl mx-auto bg-sand-100/70 border border-sand-200 rounded-lg p-5 flex items-start gap-3 text-xs text-charcoal-600">
          <AlertCircle className="w-4 h-4 text-terracotta-600 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Dietary & Allergy Notice:</strong> Please inform our service team about any specific allergies, dairy intolerances, or dietary requirements before ordering. While we maintain strict kitchen segregation for vegetarian preparations, all items are prepared in a kitchen where nuts and spices are present.
          </p>
        </div>
      </div>
    </section>
  );
};
