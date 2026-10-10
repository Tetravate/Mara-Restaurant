import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Flame, Sparkles, Utensils, Check, ShoppingBag } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useRestaurantData } from '../../context/RestaurantDataContext';

export const DishDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart, openCart, openCheckout } = useCart();
  const { menuItemsList } = useRestaurantData();

  const dish = menuItemsList.find((d) => d.slug === slug);

  if (!dish) {
    return (
      <div className="py-24 text-center max-w-md mx-auto px-4 bg-dark-950 min-h-screen text-ivory-100 flex flex-col items-center justify-center">
        <h1 className="font-serif text-3xl font-bold text-ivory-100 mb-2">Dish Not Found</h1>
        <p className="text-xs text-stone-400 mb-6">The requested culinary creation could not be located on our current menu.</p>
        <Link
          to="/menu"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-dark-950 rounded-xl text-xs font-bold shadow-glow-amber transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Menu</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-10 sm:py-16 bg-dark-950 text-ivory-100 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Back navigation */}
        <div>
          <button
            onClick={() => navigate('/menu')}
            className="inline-flex items-center gap-2 text-xs font-semibold text-stone-400 hover:text-amber-400 transition-colors bg-dark-900/80 px-4 py-2 rounded-xl border border-dark-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Full Menu</span>
          </button>
        </div>

        {/* Dish Card / Editorial Presentation */}
        <article className="bg-dark-900/90 rounded-3xl border border-dark-700/80 overflow-hidden shadow-2xl backdrop-blur-md">
          {/* Hero Dish Image */}
          {dish.image && (
            <div className="relative aspect-[16/9] w-full bg-dark-950 overflow-hidden group">
              <img
                src={dish.image}
                alt={dish.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/40 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between text-ivory-100">
                <div>
                  <span className="text-amber-400 font-mono text-[11px] uppercase tracking-widest font-semibold block mb-1">
                    {dish.category.replace('-', ' ')}
                  </span>
                  <h1 className="font-serif text-3xl sm:text-5xl font-bold text-ivory-100 tracking-tight">
                    {dish.name}
                  </h1>
                </div>
                <span className="font-serif text-2xl sm:text-4xl font-bold text-amber-400 drop-shadow-md">
                  ₹{dish.price}
                </span>
              </div>
            </div>
          )}

          {/* Body Content */}
          <div className="p-6 sm:p-10 space-y-8">
            {!dish.image && (
              <div className="flex items-start justify-between border-b border-dark-800 pb-6">
                <div>
                  <span className="text-amber-400 font-mono text-[11px] uppercase tracking-widest font-semibold block mb-1">
                    {dish.category}
                  </span>
                  <h1 className="font-serif text-3xl sm:text-4xl font-bold text-ivory-100">
                    {dish.name}
                  </h1>
                </div>
                <span className="font-serif text-2xl sm:text-3xl font-bold text-amber-400">
                  ₹{dish.price}
                </span>
              </div>
            )}

            {/* Subtitle & Badges */}
            <div className="space-y-4">
              {dish.subtitle && (
                <p className="text-sm text-stone-300 italic font-serif">
                  "{dish.subtitle}"
                </p>
              )}

              <div className="flex items-center gap-2 flex-wrap">
                {dish.featured && (
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/40 px-3 py-1 rounded-full shadow-glow-amber">
                    <Sparkles className="w-3 h-3" />
                    Chef Signature
                  </span>
                )}
                {dish.dietary.map((tag) => (
                  <span
                    key={tag}
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                      tag === 'VEG'
                        ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/80'
                        : tag === 'NON-VEG'
                        ? 'bg-red-950/80 text-red-400 border border-red-800/80'
                        : 'bg-dark-800 text-stone-300 border border-dark-700'
                    }`}
                  >
                    {tag}
                  </span>
                ))}
                {dish.spiceLevel > 0 && (
                  <span className="text-[10px] bg-dark-800 text-amber-400 px-2.5 py-1 rounded-full border border-dark-700 font-medium flex items-center gap-1">
                    <Flame className="w-3 h-3 text-amber-500" />
                    <span>Spice Level {dish.spiceLevel}/3 ({dish.spiceLabel})</span>
                  </span>
                )}
              </div>
            </div>

            {/* Full Culinary Description */}
            <div className="space-y-2">
              <h2 className="text-xs uppercase font-bold tracking-widest text-amber-500 font-mono">
                Preparation and Technique
              </h2>
              <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
                {dish.description}
              </p>
            </div>

            {/* Ingredients */}
            {dish.ingredients && dish.ingredients.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-xs uppercase font-bold tracking-widest text-amber-500 font-mono">
                  Key Ingredients and Provenance
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {dish.ingredients.map((ing) => (
                    <div key={ing} className="flex items-center gap-2.5 text-xs text-stone-300 bg-dark-950/80 p-3 rounded-xl border border-dark-800">
                      <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span>{ing}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pairing Note */}
            {dish.pairingNote && (
              <div className="bg-dark-950/90 p-5 rounded-2xl border border-dark-800 text-xs text-stone-300 flex items-start gap-3.5">
                <div className="p-2 rounded-lg bg-dark-800 border border-dark-700 text-amber-400 shrink-0 mt-0.5">
                  <Utensils className="w-4 h-4" />
                </div>
                <div>
                  <strong className="text-ivory-100 block mb-0.5 text-sm">Chef Pairing Recommendation:</strong>
                  <span className="text-stone-400 leading-relaxed">{dish.pairingNote}</span>
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-6 border-t border-dark-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <button
                onClick={() => {
                  addToCart(dish);
                  openCheckout();
                }}
                className="flex-1 py-3.5 px-6 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-dark-950 font-bold text-xs uppercase tracking-wider rounded-xl text-center transition-all shadow-glow-amber"
              >
                Place Order on Website
              </button>

              <button
                onClick={() => {
                  addToCart(dish);
                  openCart();
                }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-dark-800 hover:bg-dark-700 text-ivory-100 rounded-xl font-semibold text-xs border border-dark-700 hover:border-amber-500/50 shadow transition-colors"
              >
                <ShoppingBag className="w-4 h-4 text-amber-400" />
                <span>Add to Order Tray (₹{dish.price})</span>
              </button>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};
