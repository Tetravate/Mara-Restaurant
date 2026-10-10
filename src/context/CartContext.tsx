import React, { createContext, useContext, useState, useEffect } from 'react';
import { MenuItem } from '../data/menu';
import { useRestaurantData, PlacedOrder, CartItem, OrderType, PaymentMethod } from './RestaurantDataContext';

export type { PlacedOrder, CartItem, OrderType, PaymentMethod };

interface CartContextType {
  items: CartItem[];
  addToCart: (dish: MenuItem, quantity?: number, instructions?: string) => void;
  removeFromCart: (dishId: string) => void;
  updateQuantity: (dishId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  isCheckoutOpen: boolean;
  openCheckout: () => void;
  closeCheckout: () => void;
  currentOrder: PlacedOrder | null;
  placeOrder: (orderDetails: {
    orderType: OrderType;
    customerName: string;
    phone: string;
    tableNumber?: string;
    deliveryAddress?: string;
    paymentMethod: PaymentMethod;
  }) => PlacedOrder;
  clearCurrentOrder: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('mara_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [currentOrder, setCurrentOrder] = useState<PlacedOrder | null>(() => {
    try {
      const saved = localStorage.getItem('mara_active_order');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('mara_cart', JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  useEffect(() => {
    try {
      if (currentOrder) {
        localStorage.setItem('mara_active_order', JSON.stringify(currentOrder));
      } else {
        localStorage.removeItem('mara_active_order');
      }
    } catch {
      // ignore
    }
  }, [currentOrder]);

  const addToCart = (dish: MenuItem, quantity = 1, instructions?: string) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.dish.id === dish.id);
      if (existing) {
        return prev.map((i) =>
          i.dish.id === dish.id
            ? {
                ...i,
                quantity: i.quantity + quantity,
                specialInstructions: instructions || i.specialInstructions,
              }
            : i
        );
      }
      return [...prev, { dish, quantity, specialInstructions: instructions }];
    });
  };

  const removeFromCart = (dishId: string) => {
    setItems((prev) => prev.filter((i) => i.dish.id !== dishId));
  };

  const updateQuantity = (dishId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(dishId);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.dish.id === dishId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.dish.price * i.quantity, 0);
  const tax = Math.round(subtotal * 0.05); // 5% GST
  const deliveryFee = items.length > 0 ? 40 : 0;
  const total = subtotal + tax + deliveryFee;

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const openCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };
  const closeCheckout = () => setIsCheckoutOpen(false);

  const { placeCustomerOrder } = useRestaurantData();

  const placeOrder = (orderDetails: {
    orderType: OrderType;
    customerName: string;
    phone: string;
    tableNumber?: string;
    deliveryAddress?: string;
    paymentMethod: PaymentMethod;
  }): PlacedOrder => {
    const newOrder = placeCustomerOrder({
      items: [...items],
      orderType: orderDetails.orderType,
      customerName: orderDetails.customerName,
      phone: orderDetails.phone,
      tableNumber: orderDetails.tableNumber,
      deliveryAddress: orderDetails.deliveryAddress,
      paymentMethod: orderDetails.paymentMethod,
      subtotal,
      tax,
      deliveryFee: orderDetails.orderType === 'delivery' ? 40 : 0,
      total: subtotal + tax + (orderDetails.orderType === 'delivery' ? 40 : 0),
    });

    setCurrentOrder(newOrder);
    clearCart();
    return newOrder;
  };

  const clearCurrentOrder = () => {
    setCurrentOrder(null);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        tax,
        deliveryFee,
        total,
        isCartOpen,
        openCart,
        closeCart,
        isCheckoutOpen,
        openCheckout,
        closeCheckout,
        currentOrder,
        placeOrder,
        clearCurrentOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
