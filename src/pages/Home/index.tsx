import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Calendar, Compass, MessageCircle, Flame } from 'lucide-react';
import { menuItems, menuCategories, MenuItem, MenuCategoryId } from '../../data/menu';
import { chefProfile } from '../../data/story';
import { atmosphereGallery } from '../../data/gallery';
import { getGeneralWhatsAppLink } from '../../utils/whatsapp';
import { DishDetailModal } from '../../components/modals/DishDetailModal';
import { GradualBlur } from '../../components/GradualBlur';
import { useCart } from '../../context/CartContext';

export const HomePage: React.FC = () => {
  const { addToCart, openCheckout } = useCart();
  const [activeKitchenCategory, setActiveKitchenCategory] = useState<MenuCategoryId>('signature');
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null);

  const handleOrderDish = (dish: MenuItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    addToCart(dish, 1);
    openCheckout();
  };

  // Filtered dishes for interactive kitchen section
  const currentKitchenDishes = menuItems
    .filter((d) => d.category === activeKitchenCategory)
    .slice(0, 3);

  // Featured marquee dishes
  const featuredDishes = menuItems.filter((d) => d.featured).slice(0, 2);

  // Curated atmosphere spaces preview (top 4 flagship spaces)
  const previewAtmosphere = atmosphereGallery.slice(0, 4);

  return (
    <div className="bg-dark-900 text-ivory-100 overflow-hidden">
      {/* 1. HERO SECTION (Inspired by Reference Image: Bold Editorial Title + Floating Bowl + Info Pill) */}
      <section
        id="hero"
        className="relative min-h-[92dvh] flex items-center justify-center pt-8 pb-16 px-4 sm:px-6 lg:px-8 border-b border-dark-800/80"
        aria-label="Welcome to MĀRA"
      >
        {/* Ambient Dark Texture Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-dark-800/60 via-dark-900 to-dark-950 pointer-events-none" />
        <div className="absolute top-1/4 right-10 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Hero Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-dark-800 border border-dark-700 text-amber-400 text-xs font-bold uppercase tracking-wider shadow-sm">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>Modern Indian Dining · Coimbatore</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-ivory-100 leading-[1.08]">
              Experience the{' '}
              <span className="relative inline-block text-amber-400">
                Taste
                <span className="absolute bottom-1 left-0 right-0 h-[3px] bg-gradient-to-r from-amber-500 to-amber-400 rounded-full" />
              </span>{' '}
              of the Table
            </h1>

            <p className="text-sm sm:text-base text-stone-300 max-w-lg leading-relaxed font-normal">
              Modern Indian dining shaped by fire, seasonality and memory. From ancestral stone-ground masalas to progressive culinary expressions.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/reservations"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-dark-950 font-bold text-xs uppercase tracking-wider shadow-glow-amber transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <Calendar className="w-4 h-4" />
                <span>Reserve a Table</span>
              </Link>

              <Link
                to="/menu"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-dark-800 hover:bg-dark-750 text-ivory-100 font-semibold text-xs uppercase tracking-wider border border-dark-700 transition-colors"
              >
                <Compass className="w-4 h-4 text-amber-400" />
                <span>Explore Menu</span>
                <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
              </Link>
            </div>

            {/* Floating Info Capsule (Inspired by Reference Pill Card) */}
            <div className="pt-6">
              <div className="bg-ivory-100 text-dark-950 p-4 sm:p-5 rounded-3xl shadow-floating max-w-md flex items-center justify-between gap-4 border border-ivory-200">
                <div className="space-y-0.5">
                  <p className="font-bold text-xs uppercase tracking-wider text-dark-950">
                    42 Race Course Road
                  </p>
                  <p className="text-[11px] text-stone-600">
                    Open today 12 PM - 11 PM · Valet Available
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0 pl-3 border-l border-stone-300">
                  <div className="text-right">
                    <span className="font-bold text-sm text-dark-950 block">100%</span>
                    <span className="text-[10px] text-stone-600 uppercase font-semibold">Fresh Daily</span>
                  </div>
                  <div className="w-10 h-10 rounded-full overflow-hidden border border-stone-300 shrink-0">
                    <img
                      src="https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=150&q=80"
                      alt="Signature Dish Mini"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Hero Column: Large Floating Dish Platter (Direct Reference Image Aesthetic) */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Ambient Backlight Glow */}
            <div className="absolute w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-gradient-to-tr from-amber-600/30 to-amber-400/10 blur-2xl" />

            {/* Main Circular Floating Platter */}
            <div className="relative w-72 sm:w-96 md:w-[420px] aspect-square rounded-full p-3 bg-gradient-to-b from-dark-700/80 to-dark-850/90 border border-dark-700 shadow-2xl overflow-hidden group">
              <img
                src="https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=1000&q=85"
                alt="Signature Dindigul Biryani Platter"
                className="w-full h-full object-cover rounded-full group-hover:scale-105 transition-transform duration-700 ease-out"
                fetchPriority="high"
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-t from-dark-950/60 via-transparent to-transparent pointer-events-none" />
            </div>

            {/* Overlapping Badge */}
            <div className="absolute -bottom-4 -left-2 sm:left-4 bg-dark-850/95 backdrop-blur-md border border-dark-700 p-3.5 rounded-2xl shadow-glow-subtle flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 block">
                  Signature Specialty
                </span>
                <span className="font-serif text-xs font-bold text-ivory-100">
                  Dindigul Seeraga Samba Biryani
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Subtle gradual blur at Hero boundary */}
        <GradualBlur position="bottom" height="4rem" divCount={5} strength={0.8} opacity={0.7} exponential={false} />
      </section>

      {/* 2. SIGNATURE DISH SECTION (Inspired by Reference Image "Our Best Delivered / Creations") */}
      <section className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-dark-800/80">
        <div className="text-center mb-14">
          <h2 className="section-bracket text-xs font-bold uppercase tracking-widest text-amber-400 mb-2">
            Our Best Creations
          </h2>
          <p className="font-serif text-3xl sm:text-5xl font-bold text-ivory-100">
            Artisanal Signatures
          </p>
        </div>

        {/* Large Editorial Cards with Circular Cutouts & Rich Dark Backdrop */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {featuredDishes.map((dish) => (
            <article
              key={dish.id}
              className="bg-dark-850 rounded-4xl border border-dark-750 p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 shadow-dark-card hover:border-amber-500/50 hover:shadow-glow-subtle transition-all duration-300 group"
            >
              {/* Circular Dish Platter Image */}
              <div className="w-48 sm:w-56 aspect-square rounded-3xl overflow-hidden bg-dark-800 border border-dark-700 shrink-0 relative">
                <img
                  src={dish.image}
                  alt={dish.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute top-2.5 left-2.5">
                  <span className="text-[9px] font-bold uppercase tracking-wider bg-dark-900/90 text-amber-400 px-2 py-0.5 rounded-full border border-dark-700">
                    {dish.dietary[0]}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-3 flex-1 text-center sm:text-left">
                <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400 block">
                  {dish.category}
                </span>

                <h3 className="font-serif text-2xl font-bold text-ivory-100 group-hover:text-amber-400 transition-colors">
                  {dish.name}
                </h3>

                <p className="text-xs text-stone-400 leading-relaxed line-clamp-2">
                  {dish.subtitle || dish.description}
                </p>

                <div className="pt-2 flex items-center justify-center sm:justify-between gap-3">
                  <span className="font-serif text-2xl font-bold text-amber-400">
                    ₹{dish.price}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedDish(dish)}
                      className="px-4 py-2 rounded-full bg-dark-800 hover:bg-dark-750 text-stone-200 font-semibold text-xs border border-dark-700 transition-colors"
                    >
                      Details
                    </button>
                    <button
                      onClick={(e) => handleOrderDish(dish, e)}
                      className="px-5 py-2 rounded-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-dark-950 font-bold text-xs uppercase tracking-wider shadow-sm transition-all"
                    >
                      Order Now
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Subtle gradual blur at section transition */}
        <GradualBlur position="bottom" height="3.5rem" divCount={4} strength={0.75} opacity={0.65} exponential={false} />
      </section>

      {/* 3. INTERACTIVE "FROM THE KITCHEN" MENU SWITCHER (Reference Image 6-Grid Style) */}
      <section className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-dark-800/80">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="section-bracket text-xs font-bold uppercase tracking-widest text-amber-400 mb-2">
              From The Kitchen
            </h2>
            <p className="font-serif text-3xl sm:text-5xl font-bold text-ivory-100">
              Seasonal Culinary Repertoire
            </p>
          </div>

          {/* Interactive Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none" role="tablist">
            {(['signature', 'small-plates', 'mains', 'rice-biryani', 'breads', 'desserts', 'drinks'] as MenuCategoryId[]).map((catId) => {
              const meta = menuCategories.find((c) => c.id === catId);
              const isActive = activeKitchenCategory === catId;
              return (
                <button
                  key={catId}
                  onClick={() => setActiveKitchenCategory(catId)}
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-amber-500 text-dark-950 shadow-glow-subtle'
                      : 'bg-dark-800 text-stone-400 hover:text-ivory-100 hover:bg-dark-750 border border-dark-700'
                  }`}
                  role="tab"
                  aria-selected={isActive}
                >
                  {meta?.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* Animated Dishes Grid (Circular floating dishes over dark rounded cards) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeKitchenCategory}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {currentKitchenDishes.map((dish) => (
              <div
                key={dish.id}
                className="bg-dark-850 rounded-3xl border border-dark-750 p-6 flex flex-col justify-between hover:border-amber-500/40 hover:shadow-dark-card transition-all group"
              >
                <div>
                  {/* Floating Circular Dish Image */}
                  <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-dark-800 border border-dark-700 relative mb-4">
                    <img
                      src={dish.image}
                      alt={dish.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3 flex gap-1.5">
                      {dish.dietary.map((tag) => (
                        <span
                          key={tag}
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            tag === 'VEG'
                              ? 'bg-sage-600/80 text-white'
                              : 'bg-amber-600/80 text-white'
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h3 className="font-serif text-lg font-bold text-ivory-100 group-hover:text-amber-400 transition-colors">
                      {dish.name}
                    </h3>
                    <span className="font-serif text-lg font-bold text-amber-400 shrink-0">
                      ₹{dish.price}
                    </span>
                  </div>

                  <p className="text-xs text-stone-400 leading-relaxed mb-4 line-clamp-2">
                    {dish.subtitle || dish.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-dark-750 flex items-center justify-between text-xs">
                  <button
                    onClick={() => setSelectedDish(dish)}
                    className="font-bold text-stone-300 hover:text-amber-400 transition-colors"
                  >
                    View Details
                  </button>

                  <button
                    onClick={(e) => handleOrderDish(dish, e)}
                    className="px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-dark-950 font-bold text-[11px] uppercase tracking-wider transition-all"
                  >
                    Order Now
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        <div className="mt-12 text-center">
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-dark-800 hover:bg-dark-750 text-ivory-100 font-bold text-xs uppercase tracking-wider border border-dark-700 transition-colors"
          >
            <span>Explore Complete Dining Menu</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </Link>
        </div>

        {/* Subtle gradual blur at section transition */}
        <GradualBlur position="bottom" height="3.5rem" divCount={4} strength={0.75} opacity={0.65} exponential={false} />
      </section>

      {/* 4. THE MĀRA EXPERIENCE ATMOSPHERE GRID */}
      <section className="relative py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-dark-800/80">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="section-bracket text-xs font-bold uppercase tracking-widest text-amber-400 mb-2">
              The Experience
            </h2>
            <p className="font-serif text-3xl sm:text-5xl font-bold text-ivory-100">
              Atmosphere & Dining Spaces
            </p>
          </div>
          <Link
            to="/gallery"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-400 hover:text-amber-300 transition-colors"
          >
            <span>View Full Gallery</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {previewAtmosphere.map((item) => (
            <Link
              key={item.id}
              to="/gallery"
              className="group relative rounded-2xl overflow-hidden bg-dark-800 border border-dark-750/90 hover:border-amber-500/50 shadow-xl transition-all duration-500 aspect-[4/3] block"
            >
              <img
                src={item.imageUrl}
                alt={item.altText}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-950/90 via-dark-950/20 to-transparent p-5 flex flex-col justify-end">
                {item.subtitle && (
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-400 mb-1">
                    {item.subtitle}
                  </span>
                )}
                <span className="text-base font-serif font-bold text-ivory-100 group-hover:text-amber-200 transition-colors">
                  {item.title}
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Subtle gradual blur at section transition */}
        <GradualBlur position="bottom" height="3.5rem" divCount={4} strength={0.7} opacity={0.65} exponential={false} />
      </section>

      {/* 5. CHEF SECTION (Inspired by Reference Image "Meet Our Chefs" Card) */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-dark-800/80">
        <div className="text-center mb-12">
          <h2 className="section-bracket text-xs font-bold uppercase tracking-widest text-amber-400 mb-2">
            Meet Our Chefs
          </h2>
          <p className="font-serif text-3xl sm:text-5xl font-bold text-ivory-100">
            Kitchen Leadership
          </p>
        </div>

        <div className="bg-dark-850 rounded-4xl border border-dark-750 p-8 sm:p-12 lg:p-14 shadow-dark-card grid grid-cols-1 md:grid-cols-12 gap-8 items-center max-w-5xl mx-auto">
          {/* Chef Image with Rounded Frame */}
          <div className="md:col-span-5 relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-dark-800 border border-dark-700 shadow-elevated">
              <img
                src={chefProfile.image}
                alt={chefProfile.name}
                className="w-full h-full object-cover object-top"
                loading="lazy"
              />
            </div>
            <div className="absolute top-4 left-4 bg-dark-900/90 backdrop-blur-md text-amber-400 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-dark-700">
              Executive Chef
            </div>
          </div>

          {/* Chef Narrative */}
          <div className="md:col-span-7 space-y-5">
            <div>
              <h3 className="font-serif text-3xl sm:text-4xl font-bold text-ivory-100">
                {chefProfile.name}
              </h3>
              <p className="text-xs text-amber-400 font-bold uppercase tracking-wider mt-1">
                {chefProfile.role}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              {chefProfile.bio}
            </p>

            <blockquote className="bg-dark-800/80 p-4 sm:p-5 rounded-2xl border-l-4 border-amber-500 font-serif italic text-xs sm:text-sm text-ivory-200 leading-relaxed">
              "{chefProfile.quote}"
            </blockquote>

            <div className="pt-2">
              <Link
                to="/our-story"
                className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400 hover:text-amber-300"
              >
                <span>Read Full Philosophy & Story</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PRIVATE CELEBRATIONS SECTION */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-dark-800/80">
        <div className="bg-gradient-to-r from-dark-850 to-dark-800 rounded-4xl border border-dark-750 p-8 sm:p-14 shadow-dark-card grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-4">
            <h2 className="section-bracket text-xs font-bold uppercase tracking-widest text-amber-400 mb-2">
              Private Dining
            </h2>
            <h3 className="font-serif text-3xl sm:text-4xl font-bold text-ivory-100">
              Gather Around the Table
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-xl">
              Our private dining sanctuary accommodates intimate gatherings of 8 to 24 guests with bespoke multi-course menus curated personally by Chef Arjun Menon.
            </p>
            <div className="pt-2">
              <Link
                to="/private-dining"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-dark-800 hover:bg-dark-750 text-ivory-100 font-bold text-xs uppercase tracking-wider border border-dark-700"
              >
                <span>Explore Private Dining Suite</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 aspect-[16/10] rounded-3xl overflow-hidden border border-dark-700 bg-dark-800">
            <img
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=85"
              alt="Private Table Setting"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* 7. RESERVATION CALL TO ACTION */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center space-y-8">
        <div className="space-y-3">
          <h2 className="section-bracket text-xs font-bold uppercase tracking-widest text-amber-400 mb-2">
            Your Table is Waiting
          </h2>
          <p className="font-serif text-3xl sm:text-5xl font-bold text-ivory-100">
            Book an Unforgettable Experience
          </p>
          <p className="text-xs sm:text-sm text-stone-400 max-w-md mx-auto leading-relaxed">
            Reserve your table online or connect with our concierge team directly on WhatsApp for special dietary requirements.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/reservations"
            className="w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-dark-950 font-bold text-xs uppercase tracking-wider shadow-glow-amber transition-all"
          >
            Reserve a Table
          </Link>

          <a
            href={getGeneralWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-dark-800 hover:bg-dark-750 text-ivory-100 font-semibold text-xs uppercase tracking-wider border border-dark-700 transition-colors"
          >
            <MessageCircle className="w-4 h-4 text-sage-400" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </section>

      {/* Dish Detail Modal */}
      <DishDetailModal
        dish={selectedDish}
        onClose={() => setSelectedDish(null)}
      />
    </div>
  );
};
