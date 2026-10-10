import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  UtensilsCrossed, 
  ShoppingBag, 
  Truck, 
  CreditCard, 
  QrCode, 
  Banknote, 
  ArrowRight,
  Printer
} from 'lucide-react';
import { useCart, OrderType, PaymentMethod, PlacedOrder } from '../../context/CartContext';

export const CheckoutModal: React.FC = () => {
  const {
    subtotal,
    tax,
    isCheckoutOpen,
    closeCheckout,
    placeOrder,
  } = useCart();

  const [orderType, setOrderType] = useState<OrderType>('dine-in');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pay-at-table');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrderDetails, setPlacedOrderDetails] = useState<PlacedOrder | null>(null);

  if (!isCheckoutOpen) return null;

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone) return;
    if (orderType === 'dine-in' && !tableNumber) return;
    if (orderType === 'delivery' && !deliveryAddress) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const order = placeOrder({
        orderType,
        customerName,
        phone,
        tableNumber: orderType === 'dine-in' ? tableNumber : undefined,
        deliveryAddress: orderType === 'delivery' ? deliveryAddress : undefined,
        paymentMethod,
      });
      setPlacedOrderDetails(order);
      setIsSubmitting(false);
    }, 600);
  };

  const handleClose = () => {
    setPlacedOrderDetails(null);
    closeCheckout();
  };

  const calculatedTotal = subtotal + tax + (orderType === 'delivery' ? 40 : 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-modal-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-dark-950/85 backdrop-blur-md transition-opacity"
        onClick={handleClose}
      />

      <div className="relative w-full max-w-2xl bg-dark-900 border border-dark-750 rounded-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-dark-800 flex items-center justify-between bg-dark-950/70">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <h2 id="checkout-modal-title" className="font-serif text-lg sm:text-xl font-bold text-ivory-100">
              {placedOrderDetails ? 'Order Confirmed' : 'Complete Your Order'}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-full text-stone-400 hover:text-ivory-100 hover:bg-dark-800 transition-colors"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        {placedOrderDetails ? (
          /* ========================================================
             ORDER SUCCESS SCREEN (ON-WEBSITE ORDER CONFIRMATION)
             ======================================================== */
          <div className="p-6 sm:p-8 space-y-6">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-ivory-100">
                Thank You, {placedOrderDetails.customerName}!
              </h3>
              <p className="text-xs sm:text-sm text-stone-300 max-w-md mx-auto">
                Your order has been transmitted directly to our kitchen. You do not need any third-party app to track it.
              </p>
            </div>

            {/* Order Token & Live Status Timeline */}
            <div className="bg-dark-950 rounded-2xl border border-dark-800 p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-dark-800 pb-3">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-stone-400 block">
                    Order Reference
                  </span>
                  <span className="font-mono text-lg font-bold text-amber-400">
                    {placedOrderDetails.orderId}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-stone-400 block">
                    Estimated Time
                  </span>
                  <span className="font-sans text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {placedOrderDetails.estimatedMinutes} mins
                  </span>
                </div>
              </div>

              {/* Progress Timeline */}
              <div className="space-y-2 pt-1">
                <span className="text-xs font-semibold text-stone-300 block">Live Kitchen Status</span>
                <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                  <div className="p-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-medium">
                    1. Order Received
                  </div>
                  <div className="p-2 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-300 font-medium animate-pulse">
                    2. In Kitchen
                  </div>
                  <div className="p-2 rounded-lg bg-dark-850 border border-dark-750 text-stone-500">
                    3. Ready for Service
                  </div>
                </div>
              </div>

              {/* Ordered Items Summary */}
              <div className="pt-2 border-t border-dark-800 space-y-1.5 text-xs">
                <span className="text-stone-400 block font-semibold">Order Summary ({placedOrderDetails.items.length} items):</span>
                {placedOrderDetails.items.map((item) => (
                  <div key={item.dish.id} className="flex justify-between text-stone-300">
                    <span>{item.quantity}x {item.dish.name}</span>
                    <span className="font-mono text-ivory-100">₹{item.dish.price * item.quantity}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-2 border-t border-dark-800 font-bold text-sm text-ivory-100">
                  <span>Total Amount ({placedOrderDetails.paymentMethod.replace('-', ' ').toUpperCase()})</span>
                  <span className="font-mono text-amber-400">₹{placedOrderDetails.total}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-3 px-4 bg-dark-950 hover:bg-dark-800 text-stone-300 hover:text-ivory-100 font-semibold text-xs rounded-xl border border-dark-700 flex items-center justify-center gap-2 transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print Receipt</span>
              </button>
              <button
                onClick={handleClose}
                className="flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-400 text-dark-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-glow-amber transition-all"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* ========================================================
             CHECKOUT FORM (NO EXTERNAL REDIRECTS)
             ======================================================== */
          <form onSubmit={handleSubmitOrder} className="p-6 sm:p-8 space-y-6">
            
            {/* 1. Dining Type Selection */}
            <div className="space-y-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-300 block">
                1. Select Dining Mode
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setOrderType('dine-in')}
                  className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    orderType === 'dine-in'
                      ? 'bg-amber-500/15 border-amber-500 text-amber-300 shadow-glow-subtle'
                      : 'bg-dark-950 border-dark-800 text-stone-400 hover:border-dark-700'
                  }`}
                >
                  <UtensilsCrossed className="w-5 h-5" />
                  <span className="text-xs font-bold">Dine-in</span>
                </button>

                <button
                  type="button"
                  onClick={() => setOrderType('takeaway')}
                  className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    orderType === 'takeaway'
                      ? 'bg-amber-500/15 border-amber-500 text-amber-300 shadow-glow-subtle'
                      : 'bg-dark-950 border-dark-800 text-stone-400 hover:border-dark-700'
                  }`}
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span className="text-xs font-bold">Takeaway</span>
                </button>

                <button
                  type="button"
                  onClick={() => setOrderType('delivery')}
                  className={`p-3.5 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    orderType === 'delivery'
                      ? 'bg-amber-500/15 border-amber-500 text-amber-300 shadow-glow-subtle'
                      : 'bg-dark-950 border-dark-800 text-stone-400 hover:border-dark-700'
                  }`}
                >
                  <Truck className="w-5 h-5" />
                  <span className="text-xs font-bold">Delivery</span>
                </button>
              </div>
            </div>

            {/* 2. Customer & Location Details */}
            <div className="space-y-4">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-300 block">
                2. Contact & Details
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] text-stone-400 block mb-1">Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-dark-950 border border-dark-800 rounded-xl px-3.5 py-2.5 text-xs text-ivory-100 placeholder-stone-600 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-stone-400 block mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-dark-950 border border-dark-800 rounded-xl px-3.5 py-2.5 text-xs text-ivory-100 placeholder-stone-600 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {orderType === 'dine-in' && (
                <div>
                  <label className="text-[11px] text-stone-400 block mb-1">Table Number (or mention "At Counter") *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Table 04 or Counter"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value)}
                    className="w-full bg-dark-950 border border-dark-800 rounded-xl px-3.5 py-2.5 text-xs text-ivory-100 placeholder-stone-600 focus:outline-none focus:border-amber-500"
                  />
                </div>
              )}

              {orderType === 'delivery' && (
                <div>
                  <label className="text-[11px] text-stone-400 block mb-1">Delivery Address & Landmark (Coimbatore) *</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="e.g. 42 Race Course Road, Near Thomas Park, Coimbatore"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full bg-dark-950 border border-dark-800 rounded-xl px-3.5 py-2.5 text-xs text-ivory-100 placeholder-stone-600 focus:outline-none focus:border-amber-500"
                  />
                </div>
              )}
            </div>

            {/* 3. Payment Method */}
            <div className="space-y-3">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-300 block">
                3. Payment Method
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('pay-at-table')}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                    paymentMethod === 'pay-at-table'
                      ? 'bg-amber-500/15 border-amber-500 text-amber-300'
                      : 'bg-dark-950 border-dark-800 text-stone-400'
                  }`}
                >
                  <Banknote className="w-4 h-4" />
                  <span className="text-[11px] font-medium">Pay Later</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi-qr')}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                    paymentMethod === 'upi-qr'
                      ? 'bg-amber-500/15 border-amber-500 text-amber-300'
                      : 'bg-dark-950 border-dark-800 text-stone-400'
                  }`}
                >
                  <QrCode className="w-4 h-4" />
                  <span className="text-[11px] font-medium">UPI / QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border text-center transition-all flex flex-col items-center gap-1 ${
                    paymentMethod === 'card'
                      ? 'bg-amber-500/15 border-amber-500 text-amber-300'
                      : 'bg-dark-950 border-dark-800 text-stone-400'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span className="text-[11px] font-medium">Card</span>
                </button>
              </div>

              {paymentMethod === 'upi-qr' && (
                <div className="bg-dark-950 p-4 rounded-xl border border-dark-800 text-xs text-stone-300 flex items-center gap-3">
                  <div className="w-12 h-12 bg-ivory-100 rounded-lg flex items-center justify-center text-dark-950 shrink-0">
                    <QrCode className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="font-semibold text-ivory-100 block">UPI ID: mara.dining@okhdfcbank</span>
                    <span className="text-[11px] text-stone-400">Scan & pay or pay directly upon arrival / delivery.</span>
                  </div>
                </div>
              )}
            </div>

            {/* 4. Total and Confirm Button */}
            <div className="pt-4 border-t border-dark-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-stone-400 block">Total Amount</span>
                <span className="font-serif text-2xl font-bold text-amber-400">
                  ₹{calculatedTotal}
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="py-3 px-6 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-dark-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-glow-amber transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Transmitting...</span>
                ) : (
                  <>
                    <span>Confirm & Place Order</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
