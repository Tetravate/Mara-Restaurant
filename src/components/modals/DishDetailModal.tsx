import React, { useEffect, useState } from 'react';
import { X, Flame, Utensils, Check, ChevronLeft, ChevronRight, Sparkles, Plus, Minus, ShoppingBag } from 'lucide-react';
import { MenuItem } from '../../data/menu';
import { useCart } from '../../context/CartContext';

interface DishDetailModalProps {
  dish: MenuItem | null;
  onClose: () => void;
  onNavigate?: (direction: 'prev' | 'next') => void;
}

export const DishDetailModal: React.FC<DishDetailModalProps> = ({ dish, onClose, onNavigate }) => {
  const { addToCart, openCheckout } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    if (!dish) return;
    addToCart(dish, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const handleDirectOrder = () => {
    if (!dish) return;
    addToCart(dish, quantity);
    onClose();
    openCheckout();
  };
  // Lock body scroll when modal is open and handle Escape key
  useEffect(() => {
    if (!dish) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft' && onNavigate) {
        onNavigate('prev');
      } else if (e.key === 'ArrowRight' && onNavigate) {
        onNavigate('next');
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [dish, onClose, onNavigate]);

  if (!dish) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-dark-950/85 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-dish-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl max-h-[88vh] bg-dark-900 rounded-3xl border border-dark-700 shadow-2xl overflow-hidden flex flex-col md:flex-row animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-dark-950/80 text-ivory-100 hover:text-amber-400 hover:bg-dark-950 border border-dark-700 transition-colors shadow-lg"
          aria-label="Close dish details"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LEFT COLUMN: Large Food Photo */}
        <div className="md:w-[48%] relative bg-dark-950 shrink-0 min-h-[240px] md:min-h-full overflow-hidden">
          <img
            src={dish.image}
            alt={dish.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-950/80 via-transparent to-transparent md:hidden" />

          {/* Top Left Dietary Pills Overlay */}
          <div className="absolute top-4 left-4 flex items-center gap-1.5 flex-wrap z-10">
            {dish.featured && (
              <span className="bg-amber-500 text-dark-950 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Featured
              </span>
            )}
            {dish.dietary.map((tag) => (
              <span
                key={tag}
                className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase shadow-md ${
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
        </div>

        {/* RIGHT COLUMN: Scrollable Content Body */}
        <div className="md:w-[52%] p-6 sm:p-8 overflow-y-auto flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            {/* Category & Title */}
            <div>
              <span className="text-[11px] uppercase font-bold tracking-widest text-amber-500 font-mono block mb-1">
                [ {dish.category.replace('-', ' ')} ]
              </span>
              <h2 id="modal-dish-title" className="font-serif text-2xl sm:text-3xl font-bold text-ivory-100 leading-tight">
                {dish.name}
              </h2>
              {dish.subtitle && (
                <p className="text-xs sm:text-sm text-stone-300 italic mt-1 font-medium">
                  {dish.subtitle}
                </p>
              )}
            </div>

            {/* Price & Spice Indicator */}
            <div className="flex items-center justify-between border-y border-dark-800 py-3">
              <div className="flex items-baseline gap-3">
                {dish.originalPrice && (
                  <span className="text-sm text-stone-500 line-through font-serif">
                    ₹{dish.originalPrice}
                  </span>
                )}
                <span className="font-serif text-2xl sm:text-3xl font-bold text-amber-400">
                  ₹{dish.price}
                </span>
              </div>

              {dish.spiceLevel > 0 && (
                <span className="text-xs bg-dark-800 text-amber-400 px-3 py-1 rounded-full border border-dark-700 font-medium flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  <span>Spice {dish.spiceLevel}/3 ({dish.spiceLabel})</span>
                </span>
              )}
            </div>

            {/* Culinary Description */}
            <div className="space-y-1.5">
              <h3 className="text-xs uppercase font-bold tracking-wider text-amber-500 font-mono">
                Preparation & Provenance
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                {dish.description}
              </p>
            </div>

            {/* Key Ingredients */}
            {dish.ingredients && dish.ingredients.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-xs uppercase font-bold tracking-wider text-amber-500 font-mono">
                  Key Ingredients
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {dish.ingredients.map((ing) => (
                    <div key={ing} className="flex items-center gap-2 text-xs text-stone-300 bg-dark-950/80 p-2 rounded-lg border border-dark-800">
                      <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span className="truncate">{ing}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Chef Pairing Note */}
            {dish.pairingNote && (
              <div className="bg-dark-950/80 p-3.5 rounded-xl border border-dark-800 text-xs text-stone-300 flex items-start gap-3">
                <Utensils className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-ivory-100 block mb-0.5">Chef Pairing Recommendation:</strong>
                  <span className="text-stone-400">{dish.pairingNote}</span>
                </div>
              </div>
            )}
          </div>

            {/* Direct On-Website Ordering Controls */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-dark-950 rounded-xl border border-dark-750 p-1">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2 text-stone-400 hover:text-ivory-100 hover:bg-dark-800 rounded-lg transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="px-3 text-sm font-mono font-bold text-ivory-100 min-w-[28px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-2 text-stone-400 hover:text-ivory-100 hover:bg-dark-800 rounded-lg transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-dark-800 hover:bg-dark-750 text-ivory-100 font-semibold text-xs rounded-xl border border-dark-700 transition-colors"
                >
                  <ShoppingBag className="w-4 h-4 text-amber-400" />
                  <span>{isAdded ? 'Added to Tray ✓' : `Add to Order · ₹${dish.price * quantity}`}</span>
                </button>
              </div>

              <button
                onClick={handleDirectOrder}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-dark-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-glow-amber transition-all"
              >
                <span>Place Order Now</span>
              </button>
            </div>

            {/* Previous / Next Dish Navigation Buttons */}
            {onNavigate && (
              <div className="flex items-center justify-between text-xs text-stone-400 pt-1">
                <button
                  onClick={() => {
                    setQuantity(1);
                    onNavigate('prev');
                  }}
                  className="inline-flex items-center gap-1 hover:text-amber-400 transition-colors py-1 px-2 rounded hover:bg-dark-800"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous dish</span>
                </button>
                <button
                  onClick={() => {
                    setQuantity(1);
                    onNavigate('next');
                  }}
                  className="inline-flex items-center gap-1 hover:text-amber-400 transition-colors py-1 px-2 rounded hover:bg-dark-800"
                >
                  <span>Next dish</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};
