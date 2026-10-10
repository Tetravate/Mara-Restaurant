import React from 'react';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export const CartDrawer: React.FC = () => {
  const {
    items,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    tax,
    total,
    isCartOpen,
    closeCart,
    openCheckout,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cart-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-dark-950/80 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-dark-900 border-l border-dark-750 shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-6 border-b border-dark-800 flex items-center justify-between bg-dark-950/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 id="cart-title" className="font-serif text-lg font-bold text-ivory-100">
                  Your Order Selection
                </h2>
                <p className="text-xs text-stone-400">
                  {items.length} {items.length === 1 ? 'dish' : 'dishes'} in selection
                </p>
              </div>
            </div>

            <button
              onClick={closeCart}
              className="p-2 rounded-full text-stone-400 hover:text-ivory-100 hover:bg-dark-800 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500"
              aria-label="Close cart drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="w-16 h-16 rounded-full bg-dark-800 flex items-center justify-center text-stone-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-ivory-100 font-medium">Your tray is empty</h3>
                  <p className="text-xs text-stone-400 max-w-xs mt-1">
                    Explore our menu and add artisanal small plates, curries, or tandoori breads to place an order.
                  </p>
                </div>
                <button
                  onClick={closeCart}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-dark-950 font-bold text-xs rounded-full shadow-glow-amber transition-all"
                >
                  Explore Menu
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.dish.id}
                  className="bg-dark-950/80 rounded-2xl border border-dark-800 p-3.5 flex gap-3.5 items-center"
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-dark-900 shrink-0 border border-dark-800">
                    <img
                      src={item.dish.image}
                      alt={item.dish.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-serif text-sm font-semibold text-ivory-100 truncate">
                      {item.dish.name}
                    </h4>
                    <span className="font-serif text-xs font-bold text-amber-400 block mt-0.5">
                      ₹{item.dish.price * item.quantity}
                    </span>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center bg-dark-850 rounded-lg border border-dark-750 p-0.5">
                        <button
                          onClick={() => updateQuantity(item.dish.id, item.quantity - 1)}
                          className="p-1 text-stone-400 hover:text-ivory-100 hover:bg-dark-750 rounded transition-colors"
                          aria-label={`Decrease quantity of ${item.dish.name}`}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-mono font-bold text-ivory-100">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.dish.id, item.quantity + 1)}
                          className="p-1 text-stone-400 hover:text-ivory-100 hover:bg-dark-750 rounded transition-colors"
                          aria-label={`Increase quantity of ${item.dish.name}`}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.dish.id)}
                        className="p-1 text-stone-500 hover:text-red-400 transition-colors ml-auto"
                        title="Remove dish"
                        aria-label={`Remove ${item.dish.name} from tray`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {items.length > 0 && (
            <div className="p-6 border-t border-dark-800 bg-dark-950/90 space-y-4">
              {/* Bill Details */}
              <div className="space-y-1.5 text-xs text-stone-300">
                <div className="flex justify-between">
                  <span className="text-stone-400">Subtotal</span>
                  <span className="font-mono text-ivory-100">₹{subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-400">GST (5%)</span>
                  <span className="font-mono text-ivory-100">₹{tax}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-dark-800 font-bold text-sm text-ivory-100">
                  <span className="font-serif">Total Payable</span>
                  <span className="font-mono text-amber-400">₹{total}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={openCheckout}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-dark-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-glow-amber transition-all"
                >
                  <span>Place Order on Website</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    Direct on-site ordering
                  </span>
                  <button
                    onClick={clearCart}
                    className="hover:text-stone-300 underline transition-colors"
                  >
                    Clear Tray
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
