import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, X, Calendar, Plus, Minus, Check, ShoppingBag, ArrowRight } from 'lucide-react';
import { menuCategories, MenuItem, MenuCategoryId, DietaryTag } from '../../data/menu';
import { DishDetailModal } from '../../components/modals/DishDetailModal';
import { useCart } from '../../context/CartContext';
import { useRestaurantData } from '../../context/RestaurantDataContext';
import { GradualBlur } from '../../components/GradualBlur';

export const MenuPage: React.FC = () => {
  const { menuItemsList } = useRestaurantData();
  const { items: cartItems, addToCart, updateQuantity, openCheckout, openCart, totalItems, subtotal } = useCart();
  const [selectedCategory, setSelectedCategory] = useState<'all' | MenuCategoryId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dietaryFilter, setDietaryFilter] = useState<'ALL' | DietaryTag>('ALL');
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  // Map dish IDs to quantities currently in cart for instant reactive UI
  const cartQuantityMap = useMemo(() => {
    const map = new Map<string, number>();
    cartItems.forEach((ci) => {
      map.set(ci.dish.id, ci.quantity);
    });
    return map;
  }, [cartItems]);

  const handleAddDish = (dish: MenuItem, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(dish, 1);
    setRecentlyAddedId(dish.id);
    setTimeout(() => {
      setRecentlyAddedId((curr) => (curr === dish.id ? null : curr));
    }, 1600);
  };

  const handleOrderDish = (dish: MenuItem, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(dish, 1);
    openCheckout();
  };

  const handleIncrement = (dish: MenuItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const curr = cartQuantityMap.get(dish.id) || 0;
    updateQuantity(dish.id, curr + 1);
  };

  const handleDecrement = (dish: MenuItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const curr = cartQuantityMap.get(dish.id) || 0;
    updateQuantity(dish.id, curr - 1);
  };

  // Filtered dishes for search & category views
  const filteredItems = useMemo(() => {
    return menuItemsList.filter((item) => {
      // Global text search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches =
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.subtitle.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.ingredients.some((ing) => ing.toLowerCase().includes(q)) ||
          item.dietary.some((d) => d.toLowerCase().includes(q));

        if (!matches) return false;
      } else {
        if (selectedCategory !== 'all' && item.category !== selectedCategory) {
          return false;
        }
      }

      if (dietaryFilter !== 'ALL') {
        if (!item.dietary.includes(dietaryFilter)) return false;
      }

      return true;
    });
  }, [menuItemsList, selectedCategory, searchQuery, dietaryFilter]);

  // Categories to render in category-wise view
  const categoriesToDisplay = useMemo(() => {
    if (selectedCategory !== 'all') {
      return menuCategories.filter((c) => c.id === selectedCategory);
    }
    return menuCategories;
  }, [selectedCategory]);

  // Handle modal prev/next dish navigation
  const handleModalNavigate = (direction: 'prev' | 'next') => {
    if (!selectedDish) return;
    const currentList = filteredItems.length > 0 ? filteredItems : menuItemsList;
    const currentIndex = currentList.findIndex((d: MenuItem) => d.id === selectedDish.id);
    if (currentIndex === -1) return;

    if (direction === 'prev') {
      const prevIndex = (currentIndex - 1 + currentList.length) % currentList.length;
      setSelectedDish(currentList[prevIndex]);
    } else {
      const nextIndex = (currentIndex + 1) % currentList.length;
      setSelectedDish(currentList[nextIndex]);
    }
  };

  return (
    <div className="bg-dark-950 text-ivory-100 min-h-screen relative overflow-hidden">
      {/* Ambient background grain overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#D8893E_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* ========================================================
          1. HERO BANNER: "Our Menu"
          ======================================================== */}
      <div className="relative aspect-[21/9] sm:aspect-[24/7] max-h-[380px] w-full overflow-hidden bg-dark-900 border-b border-dark-800">
        <img
          src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1800&q=85"
          alt="Artisanal dining table with seared delicacies"
          className="w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/60 to-dark-950/30" />
        
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 space-y-2">
          <span className="text-[11px] uppercase font-bold tracking-[0.25em] text-amber-400 font-mono">
            Delicious & Authentic
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-ivory-100 italic">
            Our Menu
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 max-w-md">
            Ancestral spice craft paired with contemporary restraint and seasonal produce.
          </p>
        </div>

        {/* Gradual blur transition */}
        <GradualBlur position="bottom" height="3.5rem" divCount={4} strength={0.75} opacity={0.65} exponential={false} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-16 relative z-10">

        {/* ========================================================
            2. UNIFIED CATEGORY-DRIVEN MENU SHOWCASE (NO DUPLICATES)
            ======================================================== */}
        <section aria-labelledby="menu-catalog-title" className="space-y-10">
          
          {/* Section Header & Interactive Filter Bar */}
          <div className="space-y-6">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <span className="text-amber-500 font-mono text-xs uppercase tracking-widest font-semibold">
                Complete Culinary Repertoire
              </span>
              <h2 id="menu-catalog-title" className="font-serif text-3xl sm:text-5xl font-bold text-ivory-100">
                Course by Course
              </h2>
              <p className="text-xs sm:text-sm text-stone-400">
                Every dish crafted from heritage recipes with zero repetition. Filter by category, spice, or dietary preference.
              </p>
            </div>

            {/* Sticky Search & Dietary Filter Container */}
            <div className="bg-dark-900/95 p-4 sm:p-5 rounded-3xl border border-dark-750 shadow-2xl space-y-4 backdrop-blur-md sticky top-20 z-20">
              <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                {/* Search Bar */}
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Search dishes, spices, ingredients..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-10 py-2.5 bg-dark-950 border border-dark-700 rounded-xl text-xs text-ivory-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-500"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-ivory-100 p-1"
                      aria-label="Clear search"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Dietary Filter Buttons & Quick Tray Opener */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none w-full md:w-auto justify-between md:justify-end">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <button
                      onClick={() => setDietaryFilter('ALL')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                        dietaryFilter === 'ALL'
                          ? 'bg-amber-500 text-dark-950 shadow-glow-amber'
                          : 'bg-dark-950 text-stone-400 hover:text-ivory-100 border border-dark-700'
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setDietaryFilter('VEG')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                        dietaryFilter === 'VEG'
                          ? 'bg-emerald-500 text-dark-950 font-bold'
                          : 'bg-dark-950 text-emerald-400 border border-emerald-900/50'
                      }`}
                    >
                      Veg
                    </button>
                    <button
                      onClick={() => setDietaryFilter('NON-VEG')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                        dietaryFilter === 'NON-VEG'
                          ? 'bg-red-500 text-dark-950 font-bold'
                          : 'bg-dark-950 text-red-400 border border-red-900/50'
                      }`}
                    >
                      Non-Veg
                    </button>
                    <button
                      onClick={() => setDietaryFilter('GLUTEN-FREE')}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                        dietaryFilter === 'GLUTEN-FREE'
                          ? 'bg-amber-500 text-dark-950 font-bold'
                          : 'bg-dark-950 text-stone-400 border border-dark-700'
                      }`}
                    >
                      Gluten-Free
                    </button>
                  </div>

                  {/* Tray Shortcut Pill in Filter Bar */}
                  <button
                    onClick={openCart}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-colors whitespace-nowrap ml-2"
                    aria-label={`Open Tray with ${totalItems} items`}
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                    <span>Tray ({totalItems})</span>
                  </button>
                </div>
              </div>

              {/* 9 Category Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 border-t border-dark-800 scrollbar-none text-xs">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all font-semibold ${
                    selectedCategory === 'all'
                      ? 'bg-amber-500 text-dark-950 shadow-glow-amber font-bold'
                      : 'bg-dark-950 text-stone-400 hover:text-ivory-100 border border-dark-700'
                  }`}
                >
                  All ({menuItemsList.length})
                </button>
                {menuCategories.map((cat) => {
                  const count = menuItemsList.filter((i) => i.category === cat.id).length;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all font-semibold ${
                        selectedCategory === cat.id
                          ? 'bg-amber-500 text-dark-950 shadow-glow-amber font-bold'
                          : 'bg-dark-950 text-stone-400 hover:text-ivory-100 border border-dark-700'
                      }`}
                    >
                      {cat.title} ({count})
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Render Each Category in Clean Ordered Grids */}
          <div className="space-y-16">
            {categoriesToDisplay.map((cat) => {
              const categoryDishes = filteredItems.filter((d) => d.category === cat.id);
              if (categoryDishes.length === 0) return null;

              // Balanced column distribution based on item count
              const gridClass = categoryDishes.length === 2 
                ? 'grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl' 
                : categoryDishes.length === 3 || categoryDishes.length === 6
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6';

              return (
                <div key={cat.id} className="space-y-6 pt-4">
                  {/* Category Header */}
                  <div className="border-b border-dark-800 pb-3 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <div>
                      <h3 className="font-serif text-2xl sm:text-3xl font-bold text-ivory-100">
                        {cat.title}
                      </h3>
                      <p className="text-xs text-amber-400/90 font-mono mt-0.5">
                        {cat.subtitle}
                      </p>
                    </div>
                    <span className="text-xs text-stone-500">
                      {categoryDishes.length} {categoryDishes.length === 1 ? 'creation' : 'creations'}
                    </span>
                  </div>

                  {/* Balanced Grid for this Category */}
                  <div className={gridClass}>
                    {categoryDishes.map((dish) => {
                      const qtyInCart = cartQuantityMap.get(dish.id) || 0;
                      const isRecentlyAdded = recentlyAddedId === dish.id;

                      return (
                        <div
                          key={dish.id}
                          onClick={() => setSelectedDish(dish)}
                          className="bg-dark-900/80 rounded-2xl border border-dark-800 hover:border-amber-500/50 p-4 transition-all duration-300 cursor-pointer group flex flex-col justify-between shadow-lg relative"
                        >
                          <div className="space-y-3.5">
                            {/* Photo with Fixed Aspect Ratio (Strict 4:3) & Dietary Badge */}
                            <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-dark-950 border border-dark-800">
                              <img
                                src={dish.image}
                                alt={dish.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                                loading="lazy"
                              />
                              
                              {/* Dietary Tags */}
                              <div className="absolute top-2 right-2 flex items-center gap-1">
                                {dish.dietary.map((tag) => (
                                  <span
                                    key={tag}
                                    className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${
                                      tag === 'VEG'
                                        ? 'bg-emerald-950/90 text-emerald-400 border border-emerald-800'
                                        : tag === 'NON-VEG'
                                        ? 'bg-red-950/90 text-red-400 border border-red-800'
                                        : 'bg-dark-950/90 text-stone-300 border border-dark-700'
                                    }`}
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>

                              {/* Bestseller Badge if featured */}
                              {dish.featured && (
                                <div className="absolute top-2 left-2 bg-dark-950/85 backdrop-blur-sm text-amber-400 text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-dark-700">
                                  ★ SIGNATURE
                                </div>
                              )}
                            </div>

                            {/* Details: Natural wrapping dish title, no ellipsis */}
                            <div className="text-center space-y-1">
                              <h4 className="font-serif text-base font-bold text-ivory-100 group-hover:text-amber-400 transition-colors leading-snug">
                                {dish.name}
                              </h4>
                              <p className="text-[11px] text-stone-400 line-clamp-2 leading-relaxed">
                                {dish.subtitle}
                              </p>
                            </div>
                          </div>

                          {/* Price Tag & Interactive Controls: Order Now + Tray */}
                          <div className="pt-3 border-t border-dark-800/80 mt-3 flex items-center justify-between gap-2">
                            <span className="font-serif text-base sm:text-lg font-bold text-amber-400 shrink-0">
                              ₹{dish.price}
                            </span>

                            <div className="flex items-center gap-1.5 shrink-0">
                              {/* Direct "Order" Button that opens "Complete Your Order" modal immediately */}
                              <button
                                onClick={(e) => handleOrderDish(dish, e)}
                                className="inline-flex items-center gap-1 py-1.5 px-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-dark-950 text-[11px] font-bold rounded-lg shadow-sm transition-all"
                                aria-label={`Order ${dish.name} now`}
                                title={`Order ${dish.name} directly`}
                              >
                                <span>Order</span>
                              </button>

                              {qtyInCart > 0 ? (
                                /* Interactive Quantity Stepper for Items in Tray */
                                <div
                                  onClick={(e) => e.stopPropagation()}
                                  className="inline-flex items-center bg-dark-800 text-ivory-100 border border-amber-500/50 rounded-lg p-0.5 font-bold"
                                >
                                  <button
                                    onClick={(e) => handleDecrement(dish, e)}
                                    className="w-5 h-5 flex items-center justify-center rounded hover:bg-dark-700 transition-colors text-stone-300 hover:text-white"
                                    aria-label={`Decrease ${dish.name} quantity in tray`}
                                  >
                                    <Minus className="w-3 h-3 stroke-[2.5]" />
                                  </button>
                                  <span className="px-1.5 text-xs font-mono font-bold text-amber-400">
                                    {qtyInCart}
                                  </span>
                                  <button
                                    onClick={(e) => handleIncrement(dish, e)}
                                    className="w-5 h-5 flex items-center justify-center rounded hover:bg-dark-700 transition-colors text-stone-300 hover:text-white"
                                    aria-label={`Increase ${dish.name} quantity in tray`}
                                  >
                                    <Plus className="w-3 h-3 stroke-[2.5]" />
                                  </button>
                                </div>
                              ) : (
                                /* Add to Tray Button */
                                <button
                                  onClick={(e) => handleAddDish(dish, e)}
                                  className={`inline-flex items-center gap-1 py-1.5 px-2.5 rounded-lg text-[11px] font-bold border transition-all ${
                                    isRecentlyAdded
                                      ? 'bg-emerald-500 text-dark-950 border-emerald-400'
                                      : 'bg-dark-800 hover:bg-dark-750 text-stone-300 hover:text-ivory-100 border-dark-700 hover:border-dark-600'
                                  }`}
                                  aria-label={`Add ${dish.name} to tray`}
                                  title={`Add ${dish.name} to tray`}
                                >
                                  {isRecentlyAdded ? (
                                    <>
                                      <Check className="w-3 h-3 stroke-[2.5]" />
                                      <span>Added</span>
                                    </>
                                  ) : (
                                    <>
                                      <Plus className="w-3 h-3 stroke-[2.5]" />
                                      <span>Tray</span>
                                    </>
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {filteredItems.length === 0 && (
              <div className="text-center py-16 bg-dark-900/50 rounded-3xl border border-dark-800 space-y-3">
                <p className="font-serif text-xl text-ivory-100">No dishes match your active filter</p>
                <p className="text-xs text-stone-400">Try clearing your search query or selecting all categories.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('all');
                    setDietaryFilter('ALL');
                  }}
                  className="px-5 py-2 bg-amber-500 text-dark-950 rounded-xl text-xs font-bold"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ========================================================
            3. "BOOK YOUR TABLE" BANNER
            ======================================================== */}
        <section aria-label="Book your table" className="relative rounded-3xl overflow-hidden border border-dark-700 shadow-2xl bg-dark-900">
          <div className="aspect-[21/9] sm:aspect-[24/8] relative">
            <img
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=85"
              alt="MĀRA ambient dining room"
              className="w-full h-full object-cover opacity-30"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/70 to-dark-950/40" />

            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 space-y-4">
              <span className="text-amber-500 font-mono text-xs uppercase tracking-widest font-semibold">
                Reservations Open
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-ivory-100 tracking-tight">
                Book Your Table
              </h2>
              <p className="text-xs sm:text-sm text-stone-300 max-w-md">
                Experience contemporary Indian dining on Race Course Road, Coimbatore. Table allocations confirmed promptly.
              </p>
              <div className="pt-2">
                <Link
                  to="/reservations"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-dark-950 font-bold text-xs rounded-xl shadow-glow-amber transition-all"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Reserve Table for Tonight</span>
                </Link>
              </div>
            </div>

            {/* Gradual blur at bottom */}
            <GradualBlur position="bottom" height="3rem" divCount={4} strength={0.7} opacity={0.6} exponential={false} />
          </div>
        </section>

      </div>

      {/* Floating Sticky Tray Bar when items exist */}
      {totalItems > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-md animate-fade-in">
          <div 
            onClick={openCart}
            className="bg-dark-900/95 backdrop-blur-md border border-amber-500/50 hover:border-amber-400 p-3.5 rounded-2xl shadow-2xl flex items-center justify-between gap-3 cursor-pointer transition-all hover:scale-[1.01]"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-dark-950 flex items-center justify-center font-bold text-xs shadow-glow-subtle">
                {totalItems}
              </div>
              <div>
                <span className="text-xs font-semibold text-ivory-100 block">Order Tray</span>
                <span className="text-xs font-mono font-bold text-amber-400">₹{subtotal}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openCart();
                }}
                className="px-3.5 py-2 bg-dark-800 hover:bg-dark-750 text-stone-200 text-xs font-semibold rounded-xl border border-dark-700 transition-colors flex items-center gap-1.5"
              >
                <span>View Tray</span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openCheckout();
                }}
                className="px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-dark-950 text-xs font-bold uppercase tracking-wider rounded-xl shadow-glow-amber transition-all flex items-center gap-1.5"
              >
                <span>Checkout</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Dish Inspection Modal with Prev/Next Navigation */}
      <DishDetailModal
        dish={selectedDish}
        onClose={() => setSelectedDish(null)}
        onNavigate={handleModalNavigate}
      />
    </div>
  );
};
