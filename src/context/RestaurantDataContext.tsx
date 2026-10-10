import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { MenuItem, menuItems as initialMenuItems } from '../data/menu';
import { getSupabase, isSupabaseConfigured } from '../lib/supabase';

export type OrderStatus = 'received' | 'kitchen' | 'ready' | 'completed' | 'cancelled';
export type ReservationStatus = 'pending' | 'confirmed' | 'seated' | 'completed' | 'cancelled';

export interface CartItem {
  dish: MenuItem;
  quantity: number;
  specialInstructions?: string;
}

export type OrderType = 'dine-in' | 'takeaway' | 'delivery';
export type PaymentMethod = 'pay-at-table' | 'upi-qr' | 'card';

export interface PlacedOrder {
  orderId: string;
  items: CartItem[];
  orderType: OrderType;
  customerName: string;
  phone: string;
  tableNumber?: string;
  deliveryAddress?: string;
  paymentMethod: PaymentMethod;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  createdDate: string;
  estimatedMinutes: number;
}

export interface AdminReservation {
  id: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  seatingPreference: 'indoor' | 'courtyard' | 'private';
  tableId?: string;
  tableName?: string;
  tableZone?: string;
  specialRequest?: string;
  status: ReservationStatus;
  createdAt: string;
}

export interface AdminNotification {
  id: string;
  type: 'order' | 'reservation';
  title: string;
  message: string;
  time: string;
  read: boolean;
  referenceId: string;
}

interface RestaurantDataContextType {
  // Menu Management
  menuItemsList: MenuItem[];
  addDish: (dish: Omit<MenuItem, 'id' | 'slug'>) => MenuItem;
  updateDish: (id: string, updates: Partial<MenuItem>) => void;
  deleteDish: (id: string) => void;
  resetMenuToDefault: () => void;

  // Order Management
  orders: PlacedOrder[];
  placeCustomerOrder: (orderDetails: {
    items: CartItem[];
    orderType: OrderType;
    customerName: string;
    phone: string;
    tableNumber?: string;
    deliveryAddress?: string;
    paymentMethod: PaymentMethod;
    subtotal: number;
    tax: number;
    deliveryFee: number;
    total: number;
  }) => PlacedOrder;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  deleteOrder: (orderId: string) => void;

  // Reservation Management
  reservations: AdminReservation[];
  addCustomerReservation: (resData: {
    name: string;
    phone: string;
    date: string;
    time: string;
    guests: number;
    seatingPreference: 'indoor' | 'courtyard' | 'private';
    tableId?: string;
    tableName?: string;
    tableZone?: string;
    specialRequest?: string;
  }) => AdminReservation;
  updateReservationStatus: (resId: string, status: ReservationStatus) => void;
  deleteReservation: (resId: string) => void;

  // Notifications
  notifications: AdminNotification[];
  unreadNotificationsCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotifications: () => void;

  // Sound / Audio alert
  playNotificationSound: () => void;

  // Supabase Status & Sync
  isSupabaseLive: boolean;
  isSyncing: boolean;
  syncWithSupabase: () => Promise<void>;
}

const RestaurantDataContext = createContext<RestaurantDataContextType | undefined>(undefined);

const SEED_ORDERS: PlacedOrder[] = [
  {
    orderId: 'MARA-4821',
    items: [
      {
        dish: initialMenuItems[0],
        quantity: 1,
      },
      {
        dish: initialMenuItems[1],
        quantity: 2,
      },
    ],
    orderType: 'dine-in',
    customerName: 'Priya Sundaram',
    phone: '+91 98421 88320',
    tableNumber: 'Table 06',
    paymentMethod: 'pay-at-table',
    subtotal: 1970,
    tax: 99,
    deliveryFee: 0,
    total: 2069,
    status: 'kitchen',
    createdAt: '7:42 PM',
    createdDate: new Date().toISOString().split('T')[0],
    estimatedMinutes: 20,
  },
  {
    orderId: 'MARA-7109',
    items: [
      {
        dish: initialMenuItems[2],
        quantity: 2,
      },
      {
        dish: initialMenuItems[7],
        quantity: 1,
      },
    ],
    orderType: 'delivery',
    customerName: 'Karthik Raja',
    phone: '+91 94432 10982',
    deliveryAddress: '14/2 Avinashi Road, Peelamedu, Coimbatore',
    paymentMethod: 'upi-qr',
    subtotal: 1570,
    tax: 79,
    deliveryFee: 40,
    total: 1689,
    status: 'received',
    createdAt: '8:05 PM',
    createdDate: new Date().toISOString().split('T')[0],
    estimatedMinutes: 35,
  },
];

const SEED_RESERVATIONS: AdminReservation[] = [
  {
    id: 'RES-892',
    name: 'Ananya Raghavan',
    phone: '+91 98940 12345',
    date: new Date().toISOString().split('T')[0],
    time: '8:00 PM',
    guests: 4,
    seatingPreference: 'courtyard',
    tableId: 'T10',
    tableName: 'Courtyard Veranda Table 10',
    tableZone: 'Umbrella Courtyard',
    specialRequest: 'Window table preferred, celebrating family anniversary.',
    status: 'confirmed',
    createdAt: '4:15 PM',
  },
  {
    id: 'RES-904',
    name: 'Vikram Chandran',
    phone: '+91 97890 54321',
    date: new Date().toISOString().split('T')[0],
    time: '8:30 PM',
    guests: 2,
    seatingPreference: 'indoor',
    tableId: 'T6',
    tableName: 'Bamboo Arch Table 06',
    tableZone: 'Bamboo Chamber',
    specialRequest: 'Quiet table for business dinner.',
    status: 'pending',
    createdAt: '6:50 PM',
  },
];

interface DbOrderRow {
  order_id: string;
  items: CartItem[];
  order_type: OrderType;
  customer_name: string;
  phone: string;
  table_number?: string;
  delivery_address?: string;
  payment_method: PaymentMethod;
  subtotal: number;
  tax: number;
  delivery_fee: number;
  total: number;
  status: OrderStatus;
  estimated_minutes: number;
  created_at?: string;
}

interface DbReservationRow {
  res_code: string;
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  seating_preference: 'indoor' | 'courtyard' | 'private';
  table_id?: string;
  table_name?: string;
  table_zone?: string;
  special_request?: string;
  status: ReservationStatus;
  created_at?: string;
}

interface DbNotificationRow {
  notif_id: string;
  type: 'order' | 'reservation';
  title: string;
  message: string;
  time: string;
  read: boolean;
  reference_id: string;
}

interface DbMenuItemRow {
  id: string;
  slug: string;
  name: string;
  subtitle?: string;
  description: string;
  price: number;
  original_price?: number;
  category: string;
  vegetarian: boolean;
  vegan: boolean;
  gluten_free: boolean;
  dairy_free: boolean;
  dietary?: string[];
  spice_level: number;
  spice_label?: string;
  image: string;
  featured?: boolean;
  pairing_note?: string;
  ingredients?: string[];
}

export const RestaurantDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Sync State
  const [isSupabaseLive, setIsSupabaseLive] = useState<boolean>(isSupabaseConfigured());
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const isInitialMount = useRef(true);

  // Menu Items State
  const [menuItemsList, setMenuItemsList] = useState<MenuItem[]>(() => {
    try {
      const saved = localStorage.getItem('mara_menu_catalog');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
      return initialMenuItems;
    } catch {
      return initialMenuItems;
    }
  });

  // Orders State
  const [orders, setOrders] = useState<PlacedOrder[]>(() => {
    try {
      const saved = localStorage.getItem('mara_all_orders');
      if (saved) return JSON.parse(saved);
      return SEED_ORDERS;
    } catch {
      return SEED_ORDERS;
    }
  });

  // Reservations State
  const [reservations, setReservations] = useState<AdminReservation[]>(() => {
    try {
      const saved = localStorage.getItem('mara_all_reservations');
      if (saved) return JSON.parse(saved);
      return SEED_RESERVATIONS;
    } catch {
      return SEED_RESERVATIONS;
    }
  });

  // Notifications State
  const [notifications, setNotifications] = useState<AdminNotification[]>(() => {
    try {
      const saved = localStorage.getItem('mara_admin_notifications');
      if (saved) return JSON.parse(saved);
      return [
        {
          id: 'NOTIF-1',
          type: 'order',
          title: 'New Online Order #MARA-7109',
          message: 'Karthik Raja placed a Delivery order (₹1689)',
          time: '8:05 PM',
          read: false,
          referenceId: 'MARA-7109',
        },
        {
          id: 'NOTIF-2',
          type: 'reservation',
          title: 'Table Request #RES-904',
          message: 'Vikram Chandran requested a table for 2 at 8:30 PM',
          time: '6:50 PM',
          read: false,
          referenceId: 'RES-904',
        },
      ];
    } catch {
      return [];
    }
  });

  // Persist to localStorage as robust offline cache
  useEffect(() => {
    try {
      localStorage.setItem('mara_menu_catalog', JSON.stringify(menuItemsList));
    } catch {
      // ignore
    }
  }, [menuItemsList]);

  useEffect(() => {
    try {
      localStorage.setItem('mara_all_orders', JSON.stringify(orders));
    } catch {
      // ignore
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem('mara_all_reservations', JSON.stringify(reservations));
    } catch {
      // ignore
    }
  }, [reservations]);

  useEffect(() => {
    try {
      localStorage.setItem('mara_admin_notifications', JSON.stringify(notifications));
    } catch {
      // ignore
    }
  }, [notifications]);

  // Audio chime player using Web Audio API synthesis
  const playNotificationSound = useCallback(() => {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof window.AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc1.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
      gain1.gain.setValueAtTime(0.15, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start();
      osc1.stop(ctx.currentTime + 0.4);
    } catch {
      // Audio not supported / blocked by browser autoplay policy
    }
  }, []);

  // Sync state from Supabase
  const syncWithSupabase = useCallback(async () => {
    const configured = isSupabaseConfigured();
    setIsSupabaseLive(configured);
    if (!configured) return;

    setIsSyncing(true);
    const supabase = getSupabase();

    try {
      // 1. Fetch Orders
      const { data: ordersData, error: ordersErr } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (!ordersErr && ordersData && ordersData.length > 0) {
        const mappedOrders: PlacedOrder[] = ordersData.map((row: DbOrderRow & { created_at?: string }) => {
          const createdAtDate = row.created_at ? new Date(row.created_at) : new Date();
          return {
            orderId: row.order_id,
            items: row.items || [],
            orderType: row.order_type,
            customerName: row.customer_name,
            phone: row.phone,
            tableNumber: row.table_number,
            deliveryAddress: row.delivery_address,
            paymentMethod: row.payment_method,
            subtotal: Number(row.subtotal),
            tax: Number(row.tax),
            deliveryFee: Number(row.delivery_fee),
            total: Number(row.total),
            status: row.status,
            createdAt: createdAtDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            createdDate: createdAtDate.toISOString().split('T')[0],
            estimatedMinutes: row.estimated_minutes || 25,
          };
        });
        setOrders(mappedOrders);
      }

      // 2. Fetch Reservations
      const { data: resData, error: resErr } = await supabase
        .from('reservations')
        .select('*')
        .order('created_at', { ascending: false });

      if (!resErr && resData && resData.length > 0) {
        const mappedRes: AdminReservation[] = resData.map((row: DbReservationRow & { created_at?: string }) => {
          const createdAtDate = row.created_at ? new Date(row.created_at) : new Date();
          return {
            id: row.res_code,
            name: row.name,
            phone: row.phone,
            date: row.date,
            time: row.time,
            guests: Number(row.guests),
            seatingPreference: row.seating_preference,
            tableId: row.table_id,
            tableName: row.table_name,
            tableZone: row.table_zone,
            specialRequest: row.special_request,
            status: row.status,
            createdAt: createdAtDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
        });
        setReservations(mappedRes);
      }

      // 3. Fetch Notifications
      const { data: notifData, error: notifErr } = await supabase
        .from('notifications')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(30);

      if (!notifErr && notifData && notifData.length > 0) {
        const mappedNotifs: AdminNotification[] = notifData.map((row: DbNotificationRow) => ({
          id: row.notif_id,
          type: row.type,
          title: row.title,
          message: row.message,
          time: row.time,
          read: row.read,
          referenceId: row.reference_id,
        }));
        setNotifications(mappedNotifs);
      }

      // 4. Fetch Menu items if available in Supabase
      const { data: menuData, error: menuErr } = await supabase
        .from('menu_items')
        .select('*');

      if (!menuErr && menuData && menuData.length > 0) {
        const mappedMenu: MenuItem[] = menuData.map((row: DbMenuItemRow) => ({
          id: row.id,
          slug: row.slug,
          name: row.name,
          subtitle: row.subtitle || '',
          description: row.description,
          price: Number(row.price),
          originalPrice: row.original_price ? Number(row.original_price) : undefined,
          category: row.category as MenuItem['category'],
          vegetarian: Boolean(row.vegetarian),
          vegan: Boolean(row.vegan),
          glutenFree: Boolean(row.gluten_free),
          dairyFree: Boolean(row.dairy_free),
          dietary: (row.dietary || []) as MenuItem['dietary'],
          spiceLevel: (row.spice_level || 1) as MenuItem['spiceLevel'],
          spiceLabel: (row.spice_label || 'MILD') as MenuItem['spiceLabel'],
          image: row.image,
          featured: Boolean(row.featured),
          pairingNote: row.pairing_note,
          ingredients: row.ingredients || [],
        }));
        setMenuItemsList(mappedMenu);
      }
    } catch (err) {
      console.warn('Supabase fetch failed or network offline, using cached/local state:', err);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // Mount & Realtime Subscription
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      syncWithSupabase();
    }

    if (!isSupabaseConfigured()) return;

    const supabase = getSupabase();
    const channel = supabase
      .channel('public:restaurant_live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const row = payload.new as DbOrderRow & { created_at?: string };
            const createdAtDate = row.created_at ? new Date(row.created_at) : new Date();
            const newOrder: PlacedOrder = {
              orderId: row.order_id,
              items: row.items || [],
              orderType: row.order_type,
              customerName: row.customer_name,
              phone: row.phone,
              tableNumber: row.table_number,
              deliveryAddress: row.delivery_address,
              paymentMethod: row.payment_method,
              subtotal: Number(row.subtotal),
              tax: Number(row.tax),
              deliveryFee: Number(row.delivery_fee),
              total: Number(row.total),
              status: row.status,
              createdAt: createdAtDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              createdDate: createdAtDate.toISOString().split('T')[0],
              estimatedMinutes: row.estimated_minutes || 25,
            };

            setOrders((prev) => {
              if (prev.some((o) => o.orderId === newOrder.orderId)) return prev;
              return [newOrder, ...prev];
            });
            playNotificationSound();
          } else if (payload.eventType === 'UPDATE') {
            const row = payload.new as DbOrderRow;
            setOrders((prev) =>
              prev.map((o) => (o.orderId === row.order_id ? { ...o, status: row.status } : o))
            );
          } else if (payload.eventType === 'DELETE') {
            const oldRow = payload.old as { order_id?: string };
            if (oldRow?.order_id) {
              setOrders((prev) => prev.filter((o) => o.orderId !== oldRow.order_id));
            }
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'reservations' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const row = payload.new as DbReservationRow & { created_at?: string };
            const createdAtDate = row.created_at ? new Date(row.created_at) : new Date();
            const newRes: AdminReservation = {
              id: row.res_code,
              name: row.name,
              phone: row.phone,
              date: row.date,
              time: row.time,
              guests: Number(row.guests),
              seatingPreference: row.seating_preference,
              tableId: row.table_id,
              tableName: row.table_name,
              tableZone: row.table_zone,
              specialRequest: row.special_request,
              status: row.status,
              createdAt: createdAtDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            };

            setReservations((prev) => {
              if (prev.some((r) => r.id === newRes.id)) return prev;
              return [newRes, ...prev];
            });
            playNotificationSound();
          } else if (payload.eventType === 'UPDATE') {
            const row = payload.new as DbReservationRow;
            setReservations((prev) =>
              prev.map((r) => (r.id === row.res_code ? { ...r, status: row.status } : r))
            );
          } else if (payload.eventType === 'DELETE') {
            const oldRow = payload.old as { res_code?: string };
            if (oldRow?.res_code) {
              setReservations((prev) => prev.filter((r) => r.id !== oldRow.res_code));
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [syncWithSupabase, playNotificationSound]);

  // MENU ACTIONS
  const addDish = (dishData: Omit<MenuItem, 'id' | 'slug'>): MenuItem => {
    const slug = dishData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const id = `${slug}-${Date.now().toString().slice(-4)}`;
    const newDish: MenuItem = {
      ...dishData,
      id,
      slug,
    };

    setMenuItemsList((prev) => [newDish, ...prev]);

    if (isSupabaseConfigured()) {
      const supabase = getSupabase();
      supabase
        .from('menu_items')
        .insert({
          id: newDish.id,
          slug: newDish.slug,
          name: newDish.name,
          subtitle: newDish.subtitle || '',
          description: newDish.description,
          price: newDish.price,
          original_price: newDish.originalPrice || null,
          category: newDish.category,
          vegetarian: newDish.vegetarian,
          vegan: newDish.vegan,
          gluten_free: newDish.glutenFree,
          dairy_free: newDish.dairyFree,
          dietary: newDish.dietary || [],
          spice_level: newDish.spiceLevel,
          spice_label: newDish.spiceLabel,
          image: newDish.image,
          featured: newDish.featured || false,
          pairing_note: newDish.pairingNote || null,
          ingredients: newDish.ingredients || [],
        })
        .then(({ error }) => {
          if (error) console.error('Supabase error inserting dish:', error.message);
        });
    }

    return newDish;
  };

  const updateDish = (id: string, updates: Partial<MenuItem>) => {
    setMenuItemsList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );

    if (isSupabaseConfigured()) {
      const supabase = getSupabase();
      const dbUpdates: Record<string, unknown> = {};
      if (updates.name !== undefined) dbUpdates.name = updates.name;
      if (updates.subtitle !== undefined) dbUpdates.subtitle = updates.subtitle;
      if (updates.description !== undefined) dbUpdates.description = updates.description;
      if (updates.price !== undefined) dbUpdates.price = updates.price;
      if (updates.originalPrice !== undefined) dbUpdates.original_price = updates.originalPrice;
      if (updates.category !== undefined) dbUpdates.category = updates.category;
      if (updates.vegetarian !== undefined) dbUpdates.vegetarian = updates.vegetarian;
      if (updates.vegan !== undefined) dbUpdates.vegan = updates.vegan;
      if (updates.glutenFree !== undefined) dbUpdates.gluten_free = updates.glutenFree;
      if (updates.dairyFree !== undefined) dbUpdates.dairy_free = updates.dairyFree;
      if (updates.dietary !== undefined) dbUpdates.dietary = updates.dietary;
      if (updates.spiceLevel !== undefined) dbUpdates.spice_level = updates.spiceLevel;
      if (updates.spiceLabel !== undefined) dbUpdates.spice_label = updates.spiceLabel;
      if (updates.image !== undefined) dbUpdates.image = updates.image;
      if (updates.featured !== undefined) dbUpdates.featured = updates.featured;
      if (updates.pairingNote !== undefined) dbUpdates.pairing_note = updates.pairingNote;
      if (updates.ingredients !== undefined) dbUpdates.ingredients = updates.ingredients;

      supabase
        .from('menu_items')
        .update(dbUpdates)
        .eq('id', id)
        .then(({ error }) => {
          if (error) console.error('Supabase error updating dish:', error.message);
        });
    }
  };

  const deleteDish = (id: string) => {
    setMenuItemsList((prev) => prev.filter((item) => item.id !== id));

    if (isSupabaseConfigured()) {
      const supabase = getSupabase();
      supabase
        .from('menu_items')
        .delete()
        .eq('id', id)
        .then(({ error }) => {
          if (error) console.error('Supabase error deleting dish:', error.message);
        });
    }
  };

  const resetMenuToDefault = () => {
    setMenuItemsList(initialMenuItems);
  };

  // ORDER ACTIONS
  const placeCustomerOrder = (orderDetails: {
    items: CartItem[];
    orderType: OrderType;
    customerName: string;
    phone: string;
    tableNumber?: string;
    deliveryAddress?: string;
    paymentMethod: PaymentMethod;
    subtotal: number;
    tax: number;
    deliveryFee: number;
    total: number;
  }): PlacedOrder => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const orderId = `MARA-${randomNum}`;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = new Date().toISOString().split('T')[0];

    const newOrder: PlacedOrder = {
      orderId,
      items: orderDetails.items,
      orderType: orderDetails.orderType,
      customerName: orderDetails.customerName,
      phone: orderDetails.phone,
      tableNumber: orderDetails.tableNumber,
      deliveryAddress: orderDetails.deliveryAddress,
      paymentMethod: orderDetails.paymentMethod,
      subtotal: orderDetails.subtotal,
      tax: orderDetails.tax,
      deliveryFee: orderDetails.deliveryFee,
      total: orderDetails.total,
      status: 'received',
      createdAt: timeStr,
      createdDate: dateStr,
      estimatedMinutes: orderDetails.orderType === 'dine-in' ? 20 : 35,
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Create Notification for Admin
    const newNotif: AdminNotification = {
      id: `NOTIF-${Date.now()}`,
      type: 'order',
      title: `New Order #${orderId}`,
      message: `${orderDetails.customerName} placed ${orderDetails.orderType.toUpperCase()} order (₹${orderDetails.total})`,
      time: timeStr,
      read: false,
      referenceId: orderId,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    playNotificationSound();

    // Persist to Supabase if configured
    if (isSupabaseConfigured()) {
      const supabase = getSupabase();
      supabase
        .from('orders')
        .insert({
          order_id: newOrder.orderId,
          customer_name: newOrder.customerName,
          phone: newOrder.phone,
          order_type: newOrder.orderType,
          table_number: newOrder.tableNumber || null,
          delivery_address: newOrder.deliveryAddress || null,
          payment_method: newOrder.paymentMethod,
          subtotal: newOrder.subtotal,
          tax: newOrder.tax,
          delivery_fee: newOrder.deliveryFee,
          total: newOrder.total,
          status: newOrder.status,
          estimated_minutes: newOrder.estimatedMinutes,
          items: newOrder.items,
        })
        .then(({ error }) => {
          if (error) console.error('Supabase error inserting order:', error.message);
        });

      supabase
        .from('notifications')
        .insert({
          notif_id: newNotif.id,
          type: newNotif.type,
          title: newNotif.title,
          message: newNotif.message,
          time: newNotif.time,
          read: newNotif.read,
          reference_id: newNotif.referenceId,
        })
        .then(({ error }) => {
          if (error) console.error('Supabase error inserting notification:', error.message);
        });
    }

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.orderId === orderId ? { ...o, status } : o))
    );

    if (isSupabaseConfigured()) {
      const supabase = getSupabase();
      supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('order_id', orderId)
        .then(({ error }) => {
          if (error) console.error('Supabase error updating order status:', error.message);
        });
    }
  };

  const deleteOrder = (orderId: string) => {
    setOrders((prev) => prev.filter((o) => o.orderId !== orderId));

    if (isSupabaseConfigured()) {
      const supabase = getSupabase();
      supabase
        .from('orders')
        .delete()
        .eq('order_id', orderId)
        .then(({ error }) => {
          if (error) console.error('Supabase error deleting order:', error.message);
        });
    }
  };

  // RESERVATION ACTIONS
  const addCustomerReservation = (resData: {
    name: string;
    phone: string;
    date: string;
    time: string;
    guests: number;
    seatingPreference: 'indoor' | 'courtyard' | 'private';
    tableId?: string;
    tableName?: string;
    tableZone?: string;
    specialRequest?: string;
  }): AdminReservation => {
    const randomNum = Math.floor(100 + Math.random() * 900);
    const id = `RES-${randomNum}`;
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newRes: AdminReservation = {
      id,
      ...resData,
      status: 'confirmed',
      createdAt: timeStr,
    };

    setReservations((prev) => [newRes, ...prev]);

    // Create Notification for Admin
    const tableInfo = resData.tableName ? ` (${resData.tableName})` : '';
    const newNotif: AdminNotification = {
      id: `NOTIF-${Date.now()}`,
      type: 'reservation',
      title: `Table Booked #${id}`,
      message: `${resData.name} booked ${resData.guests} guests for ${resData.time}${tableInfo}`,
      time: timeStr,
      read: false,
      referenceId: id,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    playNotificationSound();

    // Persist to Supabase if configured
    if (isSupabaseConfigured()) {
      const supabase = getSupabase();
      supabase
        .from('reservations')
        .insert({
          res_code: newRes.id,
          name: newRes.name,
          phone: newRes.phone,
          date: newRes.date,
          time: newRes.time,
          guests: newRes.guests,
          seating_preference: newRes.seatingPreference,
          table_id: newRes.tableId || null,
          table_name: newRes.tableName || null,
          table_zone: newRes.tableZone || null,
          special_request: newRes.specialRequest || null,
          status: newRes.status,
        })
        .then(({ error }) => {
          if (error) console.error('Supabase error inserting reservation:', error.message);
        });

      supabase
        .from('notifications')
        .insert({
          notif_id: newNotif.id,
          type: newNotif.type,
          title: newNotif.title,
          message: newNotif.message,
          time: newNotif.time,
          read: newNotif.read,
          reference_id: newNotif.referenceId,
        })
        .then(({ error }) => {
          if (error) console.error('Supabase error inserting notification:', error.message);
        });
    }

    return newRes;
  };

  const updateReservationStatus = (resId: string, status: ReservationStatus) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === resId ? { ...r, status } : r))
    );

    if (isSupabaseConfigured()) {
      const supabase = getSupabase();
      supabase
        .from('reservations')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('res_code', resId)
        .then(({ error }) => {
          if (error) console.error('Supabase error updating reservation status:', error.message);
        });
    }
  };

  const deleteReservation = (resId: string) => {
    setReservations((prev) => prev.filter((r) => r.id !== resId));

    if (isSupabaseConfigured()) {
      const supabase = getSupabase();
      supabase
        .from('reservations')
        .delete()
        .eq('res_code', resId)
        .then(({ error }) => {
          if (error) console.error('Supabase error deleting reservation:', error.message);
        });
    }
  };

  // NOTIFICATION ACTIONS
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

    if (isSupabaseConfigured()) {
      const supabase = getSupabase();
      supabase
        .from('notifications')
        .update({ read: true })
        .eq('notif_id', id)
        .then(({ error }) => {
          if (error) console.error('Supabase error updating notification:', error.message);
        });
    }
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

    if (isSupabaseConfigured()) {
      const supabase = getSupabase();
      supabase
        .from('notifications')
        .update({ read: true })
        .eq('read', false)
        .then(({ error }) => {
          if (error) console.error('Supabase error updating all notifications:', error.message);
        });
    }
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  return (
    <RestaurantDataContext.Provider
      value={{
        menuItemsList,
        addDish,
        updateDish,
        deleteDish,
        resetMenuToDefault,
        orders,
        placeCustomerOrder,
        updateOrderStatus,
        deleteOrder,
        reservations,
        addCustomerReservation,
        updateReservationStatus,
        deleteReservation,
        notifications,
        unreadNotificationsCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearNotifications,
        playNotificationSound,
        isSupabaseLive,
        isSyncing,
        syncWithSupabase,
      }}
    >
      {children}
    </RestaurantDataContext.Provider>
  );
};

export const useRestaurantData = () => {
  const context = useContext(RestaurantDataContext);
  if (!context) {
    throw new Error('useRestaurantData must be used within a RestaurantDataProvider');
  }
  return context;
};
