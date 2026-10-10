import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, 
  Calendar, 
  Bell, 
  X, 
  Plus, 
  Trash2, 
  Edit3, 
  TrendingUp, 
  Volume2, 
  VolumeX, 
  ExternalLink, 
  Search, 
  ChefHat, 
  RefreshCw, 
  Lock, 
  LogOut, 
  KeyRound, 
  ArrowLeft, 
  Sparkles,
  Clock,
  Phone,
  User,
  MapPin,
  CreditCard,
  CheckCircle2,
  Columns3,
  LayoutGrid,
  UtensilsCrossed,
  Flame,
  Check,
  Database
} from 'lucide-react';
import { useRestaurantData, OrderStatus, ReservationStatus } from '../../context/RestaurantDataContext';
import { useAuth } from '../../context/AuthContext';
import { menuCategories, MenuCategoryId, DietaryTag, MenuItem, SpiceLevel } from '../../data/menu';
import { SupabaseSyncModal } from '../../components/SupabaseSyncModal';

type AdminTab = 'overview' | 'orders' | 'reservations' | 'menu';

const ALL_DIETARY_TAGS: DietaryTag[] = [
  'VEG',
  'NON-VEG',
  'VEGAN',
  'GLUTEN-FREE',
  'CONTAINS-NUTS',
  'DAIRY-FREE',
];

const PRESET_DISH_IMAGES = [
  { label: 'Gulab Jamun (Dessert)', url: '/images/dishes/gulab-jamun.jpg' },
  { label: 'Tandoori Butter Naan (Bread)', url: '/images/dishes/tandoori-naan.jpg' },
  { label: 'Malabar Parotta (Bread)', url: '/images/dishes/malabar-parotta.jpg' },
  { label: 'Garlic Kulcha (Bread)', url: '/images/dishes/garlic-kulcha.jpg' },
  { label: 'Ragi Roti (Bread)', url: '/images/dishes/ragi-roti.jpg' },
  { label: 'Smoked Paneer Tikka (Starter)', url: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&w=800&q=85' },
  { label: 'Chettinad Spiced Curry (Main)', url: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=85' },
  { label: 'Seeraga Dum Biryani (Rice)', url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=85' },
  { label: 'Artisanal Beverage / Cooler (Drinks)', url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=85' },
  { label: 'Spiced Rasam Broth (Soup)', url: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=85' },
];

export const AdminPage: React.FC = () => {
  const { user, logout: authLogout } = useAuth();

  // Authentication State
  const [localAuth, setLocalAuth] = useState<boolean>(() => {
    try {
      return localStorage.getItem('mara_admin_auth') === 'true';
    } catch {
      return false;
    }
  });

  const isAuthenticated = localAuth || user?.role === 'admin' || user?.role === 'staff';
  const [pinInput, setPinInput] = useState('');
  const [loginError, setLoginError] = useState('');

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (pinInput.trim() === '1234' || pinInput.trim().toLowerCase() === 'admin' || pinInput.trim() === 'mara2026') {
      setLocalAuth(true);
      setLoginError('');
      try {
        localStorage.setItem('mara_admin_auth', 'true');
      } catch {}
    } else {
      setLoginError('Invalid Passcode. Enter 1234 or use 1-Click Demo Login below.');
    }
  };

  const handleQuickDemoLogin = () => {
    setLocalAuth(true);
    setLoginError('');
    try {
      localStorage.setItem('mara_admin_auth', 'true');
    } catch {}
  };

  const handleLogout = () => {
    setLocalAuth(false);
    setPinInput('');
    authLogout();
    try {
      localStorage.removeItem('mara_admin_auth');
    } catch {}
  };

  const {
    menuItemsList,
    addDish,
    updateDish,
    deleteDish,
    resetMenuToDefault,
    orders,
    updateOrderStatus,
    deleteOrder,
    reservations,
    updateReservationStatus,
    deleteReservation,
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotifications,
    placeCustomerOrder,
    addCustomerReservation,
    isSupabaseLive,
    isSyncing,
  } = useRestaurantData();

  const [activeTab, setActiveTab] = useState<AdminTab>('orders');
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [ordersViewMode, setOrdersViewMode] = useState<'cards' | 'kanban'>('cards');

  // Search & Filters for Orders
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | OrderStatus>('all');
  const [orderTypeFilter, setOrderTypeFilter] = useState<'all' | 'dine-in' | 'takeaway' | 'delivery'>('all');

  // Search & Filters for Reservations
  const [resSearch, setResSearch] = useState('');
  const [resStatusFilter, setResStatusFilter] = useState<'all' | ReservationStatus>('all');

  // Search & Filters for Menu
  const [menuSearch, setMenuSearch] = useState('');
  const [menuCategoryFilter, setMenuCategoryFilter] = useState<'all' | MenuCategoryId>('all');

  // Dish Modal State (Add / Edit)
  const [isDishModalOpen, setIsDishModalOpen] = useState(false);
  const [editingDishId, setEditingDishId] = useState<string | null>(null);

  // Dish Form State
  const [dishForm, setDishForm] = useState<{
    name: string;
    subtitle: string;
    description: string;
    price: number;
    originalPrice?: number;
    category: MenuCategoryId;
    vegetarian: boolean;
    vegan: boolean;
    glutenFree: boolean;
    dairyFree: boolean;
    dietary: DietaryTag[];
    spiceLevel: SpiceLevel;
    spiceLabel?: string;
    image: string;
    featured: boolean;
    pairingNote: string;
    ingredientsText: string;
  }>({
    name: '',
    subtitle: '',
    description: '',
    price: 350,
    category: 'small-plates',
    vegetarian: true,
    vegan: false,
    glutenFree: false,
    dairyFree: false,
    dietary: ['VEG'],
    spiceLevel: 1,
    spiceLabel: 'MILD',
    image: '/images/dishes/tandoori-naan.jpg',
    featured: false,
    pairingNote: '',
    ingredientsText: '',
  });

  // Calculate Metrics
  const stats = useMemo(() => {
    const totalRevenue = orders
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.total, 0);

    const activeOrders = orders.filter((o) => o.status === 'received' || o.status === 'kitchen' || o.status === 'ready').length;
    const todayReservations = reservations.length;
    const pendingReservations = reservations.filter((r) => r.status === 'pending').length;

    return {
      totalRevenue,
      activeOrders,
      todayReservations,
      pendingReservations,
      totalDishes: menuItemsList.length,
    };
  }, [orders, reservations, menuItemsList]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (orderStatusFilter !== 'all' && o.status !== orderStatusFilter) return false;
      if (orderTypeFilter !== 'all' && o.orderType !== orderTypeFilter) return false;
      if (orderSearch.trim()) {
        const q = orderSearch.toLowerCase().trim();
        const matches =
          o.orderId.toLowerCase().includes(q) ||
          o.customerName.toLowerCase().includes(q) ||
          o.phone.toLowerCase().includes(q) ||
          (o.tableNumber && o.tableNumber.toLowerCase().includes(q));
        if (!matches) return false;
      }
      return true;
    });
  }, [orders, orderStatusFilter, orderTypeFilter, orderSearch]);

  // Filtered Reservations
  const filteredReservations = useMemo(() => {
    return reservations.filter((r) => {
      if (resStatusFilter !== 'all' && r.status !== resStatusFilter) return false;
      if (resSearch.trim()) {
        const q = resSearch.toLowerCase().trim();
        const matches =
          r.id.toLowerCase().includes(q) ||
          r.name.toLowerCase().includes(q) ||
          r.phone.toLowerCase().includes(q) ||
          r.time.toLowerCase().includes(q) ||
          (r.tableName && r.tableName.toLowerCase().includes(q));
        if (!matches) return false;
      }
      return true;
    });
  }, [reservations, resStatusFilter, resSearch]);

  // Filtered Menu Items
  const filteredMenuItems = useMemo(() => {
    return menuItemsList.filter((item) => {
      if (menuCategoryFilter !== 'all' && item.category !== menuCategoryFilter) return false;
      if (menuSearch.trim()) {
        const q = menuSearch.toLowerCase().trim();
        const matches =
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.subtitle?.toLowerCase().includes(q) ||
          item.ingredients.some((ing) => ing.toLowerCase().includes(q));
        if (!matches) return false;
      }
      return true;
    });
  }, [menuItemsList, menuCategoryFilter, menuSearch]);

  // Open Add Dish Modal
  const handleOpenAddDish = () => {
    setEditingDishId(null);
    setDishForm({
      name: '',
      subtitle: '',
      description: '',
      price: 450,
      category: 'mains',
      vegetarian: true,
      vegan: false,
      glutenFree: false,
      dairyFree: false,
      dietary: ['VEG'],
      spiceLevel: 1,
      spiceLabel: 'MILD',
      image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=85',
      featured: false,
      pairingNote: '',
      ingredientsText: 'First-press coconut milk, stoneground spices, curry leaf oil',
    });
    setIsDishModalOpen(true);
  };

  // Open Edit Dish Modal
  const handleOpenEditDish = (dish: MenuItem) => {
    setEditingDishId(dish.id);
    setDishForm({
      name: dish.name,
      subtitle: dish.subtitle || '',
      description: dish.description,
      price: dish.price,
      originalPrice: dish.originalPrice,
      category: dish.category,
      vegetarian: dish.vegetarian,
      vegan: dish.vegan,
      glutenFree: dish.glutenFree,
      dairyFree: dish.dairyFree,
      dietary: [...dish.dietary],
      spiceLevel: dish.spiceLevel,
      spiceLabel: dish.spiceLabel || 'MILD',
      image: dish.image,
      featured: !!dish.featured,
      pairingNote: dish.pairingNote || '',
      ingredientsText: dish.ingredients.join(', '),
    });
    setIsDishModalOpen(true);
  };

  // Save Dish (Add or Edit)
  const handleSaveDish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dishForm.name.trim() || !dishForm.description.trim()) return;

    const ingredients = dishForm.ingredientsText
      .split(',')
      .map((i) => i.trim())
      .filter(Boolean);

    const isVeg = dishForm.dietary.includes('VEG');
    const isVegan = dishForm.dietary.includes('VEGAN');
    const isGf = dishForm.dietary.includes('GLUTEN-FREE');
    const isDf = dishForm.dietary.includes('DAIRY-FREE');

    if (editingDishId) {
      updateDish(editingDishId, {
        name: dishForm.name.trim(),
        subtitle: dishForm.subtitle.trim() || '',
        description: dishForm.description.trim(),
        price: Number(dishForm.price),
        originalPrice: dishForm.originalPrice ? Number(dishForm.originalPrice) : undefined,
        category: dishForm.category,
        vegetarian: isVeg,
        vegan: isVegan,
        glutenFree: isGf,
        dairyFree: isDf,
        dietary: dishForm.dietary,
        spiceLevel: dishForm.spiceLevel,
        spiceLabel: dishForm.spiceLabel,
        image: dishForm.image.trim(),
        featured: dishForm.featured,
        pairingNote: dishForm.pairingNote.trim() || undefined,
        ingredients: ingredients.length > 0 ? ingredients : ['Seasonal masalas', 'Cold-pressed oils'],
      });
    } else {
      addDish({
        name: dishForm.name.trim(),
        subtitle: dishForm.subtitle.trim() || '',
        description: dishForm.description.trim(),
        price: Number(dishForm.price),
        originalPrice: dishForm.originalPrice ? Number(dishForm.originalPrice) : undefined,
        category: dishForm.category,
        vegetarian: isVeg,
        vegan: isVegan,
        glutenFree: isGf,
        dairyFree: isDf,
        dietary: dishForm.dietary,
        spiceLevel: dishForm.spiceLevel,
        spiceLabel: dishForm.spiceLabel,
        image: dishForm.image.trim() || '/images/dishes/tandoori-naan.jpg',
        featured: dishForm.featured,
        pairingNote: dishForm.pairingNote.trim() || undefined,
        ingredients: ingredients.length > 0 ? ingredients : ['Fresh spices', 'Pure ghee'],
      });
    }

    setIsDishModalOpen(false);
  };

  // Quick Simulation Handlers for Demo Presentations
  const handleSimulateOrder = () => {
    const randomItems = [
      { dish: menuItemsList[0] || menuItemsList[1], quantity: 2 },
      { dish: menuItemsList[2] || menuItemsList[3], quantity: 1 },
      { dish: menuItemsList[4] || menuItemsList[0], quantity: 2 },
    ];
    const subtotal = randomItems.reduce((sum, item) => sum + item.dish.price * item.quantity, 0);
    const tax = Math.round(subtotal * 0.05);

    const names = ['Kavitha Narayanan', 'Dr. Rajesh Kumar', 'Sneha Balasubramanian', 'Gokul Chandran', 'Aishwarya Ram'];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const randomTables = ['Table 01 (Window)', 'Table 04 (Leather Booth)', 'Table 06 (Bamboo Arch)', 'Table 10 (Courtyard)'];

    placeCustomerOrder({
      items: randomItems,
      orderType: 'dine-in',
      customerName: randomName,
      phone: '+91 98421 ' + Math.floor(10000 + Math.random() * 90000),
      tableNumber: randomTables[Math.floor(Math.random() * randomTables.length)],
      paymentMethod: 'pay-at-table',
      subtotal,
      tax,
      deliveryFee: 0,
      total: subtotal + tax,
    });
  };

  const handleSimulateReservation = () => {
    const names = ['Senthil Prabhu', 'Divya Meenakshi', 'Vikramaditya Rao', 'Meera Subramaniam'];
    const randomName = names[Math.floor(Math.random() * names.length)];
    const timeSlots = ['7:30 PM', '8:00 PM', '8:30 PM', '1:00 PM', '9:00 PM'];
    const today = new Date().toISOString().split('T')[0];
    const tableChoices = [
      { id: 'T1', name: 'Wisteria Window Table 01', zone: 'Floral Grand Hall' },
      { id: 'T6', name: 'Bamboo Arch Table 06', zone: 'Bamboo Chamber' },
      { id: 'T10', name: 'Courtyard Veranda Table 10', zone: 'Umbrella Courtyard' },
      { id: 'T13', name: 'Executive Teak Suite 13', zone: 'Private Chamber' },
    ];
    const pickedTable = tableChoices[Math.floor(Math.random() * tableChoices.length)];

    addCustomerReservation({
      name: randomName,
      phone: '+91 97890 ' + Math.floor(10000 + Math.random() * 90000),
      date: today,
      time: timeSlots[Math.floor(Math.random() * timeSlots.length)],
      guests: Math.floor(2 + Math.random() * 5),
      seatingPreference: 'indoor',
      tableId: pickedTable.id,
      tableName: pickedTable.name,
      tableZone: pickedTable.zone,
      specialRequest: 'Anniversary dinner with custom dessert request.',
    });
  };

  // If not authenticated, render Passcode Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-dark-950 text-ivory-100">
        <div className="w-full max-w-md bg-dark-900 border border-dark-750 p-8 rounded-3xl shadow-2xl space-y-6 text-center">
          <div className="w-16 h-16 bg-amber-500/10 border border-amber-500/30 text-amber-400 rounded-full flex items-center justify-center mx-auto shadow-glow-amber">
            <Lock className="w-8 h-8" />
          </div>

          <div>
            <h1 className="font-serif text-2xl font-bold text-ivory-100">Staff & Management Gateway</h1>
            <p className="text-xs text-stone-400 mt-1">Enter authorized staff or admin passcode.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1">
                Passcode / PIN
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                <input
                  type="password"
                  placeholder="Enter 1234 or staff PIN"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-dark-950 border border-dark-700 rounded-xl text-sm text-ivory-100 placeholder-stone-600 focus:outline-none focus:border-amber-500"
                  autoFocus
                />
              </div>
              {loginError && <p className="text-xs text-red-400 mt-1">{loginError}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-dark-950 font-bold rounded-xl shadow-glow-amber transition-all text-sm"
            >
              Unlock Operations Workspace
            </button>

            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="w-full py-2 bg-dark-950 hover:bg-dark-850 text-amber-400 hover:text-amber-300 text-xs rounded-xl border border-dark-750 transition-colors"
            >
              ⚡ 1-Click Demo Login
            </button>
          </form>

          <div className="pt-2 border-t border-dark-800">
            <Link to="/login" className="text-xs text-stone-400 hover:text-ivory-100 underline">
              ← Return to Multi-Role Login Portal
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950 text-ivory-100 flex flex-col selection:bg-amber-500 selection:text-dark-950">
      
      {/* ========================================================
          1. CLEAN TOP NAVIGATION BAR (SINGLE SOURCE OF NAVIGATION)
          ======================================================== */}
      <header className="sticky top-0 z-40 bg-dark-900/95 backdrop-blur-md border-b border-dark-800 shadow-xl py-3 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Left: Brand + Role Badge */}
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-dark-950 hover:bg-dark-800 border border-dark-750 text-xs font-semibold text-stone-300 hover:text-amber-400 transition-colors"
              title="Return to Login Gateway"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Login Portal</span>
            </Link>

            <div className="h-4 w-px bg-dark-800 hidden sm:block" />

            <div className="flex items-center gap-2">
              <span className="font-serif text-lg font-bold text-ivory-100 tracking-wider">
                MĀRA
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30 font-mono font-bold uppercase tracking-wider">
                {user?.role === 'staff' ? 'Staff Brigade' : 'Admin Console'}
              </span>
            </div>
          </div>

          {/* Center: Clean Segmented Tab Controller */}
          <nav className="flex items-center bg-dark-950/90 p-1 rounded-2xl border border-dark-800 shadow-inner">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'overview'
                  ? 'bg-amber-500 text-dark-950 font-bold shadow-glow-amber'
                  : 'text-stone-400 hover:text-ivory-100'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'orders'
                  ? 'bg-amber-500 text-dark-950 font-bold shadow-glow-amber'
                  : 'text-stone-400 hover:text-ivory-100'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Kitchen Orders</span>
              {stats.activeOrders > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                  activeTab === 'orders' ? 'bg-dark-950 text-amber-400' : 'bg-amber-500 text-dark-950'
                }`}>
                  {stats.activeOrders}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('reservations')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'reservations'
                  ? 'bg-amber-500 text-dark-950 font-bold shadow-glow-amber'
                  : 'text-stone-400 hover:text-ivory-100'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Table Bookings</span>
              {stats.pendingReservations > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-emerald-500 text-dark-950">
                  {stats.pendingReservations}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('menu')}
              className={`px-3 sm:px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === 'menu'
                  ? 'bg-amber-500 text-dark-950 font-bold shadow-glow-amber'
                  : 'text-stone-400 hover:text-ivory-100'
              }`}
            >
              <ChefHat className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Menu</span>
              <span className="text-[10px] font-mono opacity-80">({stats.totalDishes})</span>
            </button>
          </nav>

          {/* Right: Quick Tools, Supabase Status, Notifications, Live Customer Link */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Supabase Status Button */}
            <button
              onClick={() => setIsSupabaseModalOpen(true)}
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isSupabaseLive
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20'
              }`}
              title="Supabase PostgreSQL Database Configuration"
            >
              <Database className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">
                {isSyncing ? 'Syncing...' : isSupabaseLive ? 'Supabase Live' : 'Local Storage'}
              </span>
              <span className={`w-2 h-2 rounded-full ${isSupabaseLive ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            </button>

            {/* Audio chime toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 text-stone-300 hover:text-ivory-100 bg-dark-950 hover:bg-dark-850 rounded-xl border border-dark-800 transition-colors"
              title={soundEnabled ? 'Mute audio notifications' : 'Enable audio notifications'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className="relative p-2 text-stone-300 hover:text-ivory-100 bg-dark-950 hover:bg-dark-850 rounded-xl border border-dark-800 transition-colors"
                aria-label="Admin notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-ivory-100 text-[9px] font-bold rounded-full flex items-center justify-center animate-bounce">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>

              {/* Notification Popover & Outside-Click Backdrop */}
              {isNotifOpen && (
                <>
                  {/* Backdrop overlay for 1-click outside dismiss */}
                  <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-[2px]"
                    onClick={() => setIsNotifOpen(false)}
                    aria-hidden="true"
                  />

                  {/* Popover Card */}
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-dark-900 border-2 border-dark-700 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in duration-200 ring-1 ring-white/10">
                    <div className="p-3.5 bg-dark-950 border-b border-dark-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-bold text-ivory-100">Live Activity Feed</span>
                        {unreadNotificationsCount > 0 && (
                          <span className="px-1.5 py-0.2 bg-red-500/20 text-red-400 border border-red-500/40 text-[10px] font-mono font-bold rounded-full">
                            {unreadNotificationsCount} new
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {notifications.length > 0 && (
                          <button
                            onClick={markAllNotificationsAsRead}
                            className="text-[10px] text-amber-400 hover:underline font-semibold"
                          >
                            Mark all read
                          </button>
                        )}
                        <button
                          onClick={() => setIsNotifOpen(false)}
                          className="p-1 rounded-lg text-stone-400 hover:text-ivory-100 hover:bg-dark-800 transition-colors"
                          aria-label="Close notification panel"
                          title="Close panel"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="max-h-72 overflow-y-auto divide-y divide-dark-800">
                      {notifications.length === 0 ? (
                        <div className="p-8 text-center text-xs text-stone-500 space-y-1">
                          <Bell className="w-6 h-6 text-stone-700 mx-auto" />
                          <p>No recent activity recorded</p>
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => markNotificationAsRead(n.id)}
                            className={`p-3.5 hover:bg-dark-850 transition-colors cursor-pointer flex items-start gap-3 ${
                              !n.read ? 'bg-amber-500/10' : ''
                            }`}
                          >
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                              n.type === 'order' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                            }`}>
                              {n.type === 'order' ? <ShoppingBag className="w-3.5 h-3.5" /> : <Calendar className="w-3.5 h-3.5" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <span className="text-xs font-semibold text-ivory-100 truncate">{n.title}</span>
                                <span className="text-[10px] text-stone-500 font-mono shrink-0">{n.time}</span>
                              </div>
                              <p className="text-[11px] text-stone-400 mt-0.5 leading-snug">{n.message}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                    {/* Footer Controls */}
                    <div className="p-2.5 bg-dark-950 border-t border-dark-800 flex items-center justify-between gap-2">
                      {notifications.length > 0 ? (
                        <button
                          onClick={clearNotifications}
                          className="text-[11px] text-stone-400 hover:text-red-400 transition-colors"
                        >
                          Clear activity list
                        </button>
                      ) : (
                        <span className="text-[11px] text-stone-600">All caught up</span>
                      )}

                      <button
                        onClick={() => setIsNotifOpen(false)}
                        className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-dark-950 font-bold text-xs rounded-lg transition-all"
                      >
                        Done & Close
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Back to Live Customer Dining Site */}
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-amber-500 hover:bg-amber-400 text-dark-950 text-xs font-bold rounded-xl shadow-glow-amber transition-all"
            >
              <span>Customer Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="p-2 text-stone-400 hover:text-red-400 hover:bg-dark-850 rounded-xl transition-colors border border-dark-800"
              title="Log out"
              aria-label="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Body */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-8 py-6 space-y-6 flex-1">
        
        {/* Workspace Title & Live Simulators */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-dark-900 p-4 sm:p-5 rounded-2xl border-2 border-dark-700 shadow-xl ring-1 ring-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-amber-500 font-mono text-[11px] uppercase tracking-widest font-semibold">
                Operations Center
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] text-emerald-400 font-mono font-medium">Kitchen Live</span>
            </div>
            <h1 className="font-serif text-xl sm:text-2xl font-bold text-ivory-100 tracking-tight mt-0.5">
              {activeTab === 'overview' && 'Restaurant Executive Dashboard'}
              {activeTab === 'orders' && 'Live Kitchen Orders & Fulfillment Stream'}
              {activeTab === 'reservations' && 'Guest Table Allocations & Floor Plan'}
              {activeTab === 'menu' && 'Culinary Menu Catalog & Recipe Inventory'}
            </h1>
          </div>

          {/* Quick Simulation Buttons for Demo */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleSimulateOrder}
              className="px-3.5 py-2 bg-dark-950 hover:bg-dark-850 text-amber-400 hover:text-amber-300 text-xs font-semibold rounded-xl border-2 border-dark-700 hover:border-amber-500/50 flex items-center gap-1.5 transition-all shadow-md hover:scale-[1.02]"
              title="Simulate incoming customer ticket"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Simulate Order</span>
            </button>

            <button
              onClick={handleSimulateReservation}
              className="px-3.5 py-2 bg-dark-950 hover:bg-dark-850 text-emerald-400 hover:text-emerald-300 text-xs font-semibold rounded-xl border-2 border-dark-700 hover:border-emerald-500/50 flex items-center gap-1.5 transition-all shadow-md hover:scale-[1.02]"
              title="Simulate table booking"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Simulate Booking</span>
            </button>
          </div>
        </div>

        {/* ========================================================
            TAB 1: OVERVIEW DASHBOARD
            ======================================================== */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Live Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-dark-900 via-dark-900 to-dark-950 p-5 rounded-2xl border-2 border-amber-500/40 shadow-[0_6px_25px_rgba(245,158,11,0.12)] ring-1 ring-amber-500/20 hover:border-amber-400 transition-all space-y-2">
                <div className="flex items-center justify-between text-stone-400 text-xs">
                  <span className="font-semibold uppercase text-[10px] tracking-wider text-stone-300">Gross Orders Revenue</span>
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shadow">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-serif text-2xl sm:text-3xl font-bold text-amber-400">
                  ₹{stats.totalRevenue.toLocaleString()}
                </div>
                <div className="text-[11px] text-stone-400 font-mono">
                  {orders.length} total orders recorded
                </div>
              </div>

              <div className="bg-gradient-to-br from-dark-900 via-dark-900 to-dark-950 p-5 rounded-2xl border-2 border-orange-500/40 shadow-[0_6px_25px_rgba(249,115,22,0.12)] ring-1 ring-orange-500/20 hover:border-orange-400 transition-all space-y-2">
                <div className="flex items-center justify-between text-stone-400 text-xs">
                  <span className="font-semibold uppercase text-[10px] tracking-wider text-stone-300">Active Kitchen Queue</span>
                  <div className="w-8 h-8 rounded-xl bg-orange-500/20 border border-orange-500/40 text-orange-400 flex items-center justify-center shadow">
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-serif text-2xl sm:text-3xl font-bold text-ivory-100">
                  {stats.activeOrders}
                </div>
                <div className="text-[11px] text-orange-400 font-medium">
                  In cooking / plating stage
                </div>
              </div>

              <div className="bg-gradient-to-br from-dark-900 via-dark-900 to-dark-950 p-5 rounded-2xl border-2 border-emerald-500/40 shadow-[0_6px_25px_rgba(16,185,129,0.12)] ring-1 ring-emerald-500/20 hover:border-emerald-400 transition-all space-y-2">
                <div className="flex items-center justify-between text-stone-400 text-xs">
                  <span className="font-semibold uppercase text-[10px] tracking-wider text-stone-300">Table Reservations</span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shadow">
                    <Calendar className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-serif text-2xl sm:text-3xl font-bold text-ivory-100">
                  {stats.todayReservations}
                </div>
                <div className="text-[11px] text-emerald-400 font-medium">
                  {stats.pendingReservations} pending confirmation
                </div>
              </div>

              <div className="bg-gradient-to-br from-dark-900 via-dark-900 to-dark-950 p-5 rounded-2xl border-2 border-amber-500/40 shadow-[0_6px_25px_rgba(245,158,11,0.08)] ring-1 ring-amber-500/20 hover:border-amber-400 transition-all space-y-2">
                <div className="flex items-center justify-between text-stone-400 text-xs">
                  <span className="font-semibold uppercase text-[10px] tracking-wider text-stone-300">Active Dishes Catalog</span>
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shadow">
                    <ChefHat className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-serif text-2xl sm:text-3xl font-bold text-ivory-100">
                  {stats.totalDishes}
                </div>
                <div className="text-[11px] text-stone-400">
                  Across 9 seasonal categories
                </div>
              </div>
            </div>

            {/* Quick Operations Hub */}
            <div className="bg-dark-900 rounded-2xl border-2 border-dark-700 shadow-xl ring-1 ring-white/10 p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-base font-bold text-ivory-100 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Operations Launchpad</span>
                </h3>
                <span className="text-xs text-stone-400 font-mono">1-click navigation</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <button
                  onClick={handleOpenAddDish}
                  className="p-4 rounded-xl bg-dark-950 hover:bg-dark-850 border-2 border-dark-750 hover:border-amber-500/70 text-left transition-all group shadow-md ring-1 ring-white/5 hover:scale-[1.01]"
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow">
                    <Plus className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-xs text-ivory-100">Add New Dish to Menu</h4>
                  <p className="text-[11px] text-stone-400 mt-1 leading-relaxed">
                    Create a new signature starter, curry, bread, or dessert.
                  </p>
                </button>

                <button
                  onClick={() => setActiveTab('orders')}
                  className="p-4 rounded-xl bg-dark-950 hover:bg-dark-850 border-2 border-dark-750 hover:border-orange-500/70 text-left transition-all group shadow-md ring-1 ring-white/5 hover:scale-[1.01]"
                >
                  <div className="w-10 h-10 rounded-xl bg-orange-500/20 border border-orange-500/40 text-orange-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-xs text-ivory-100">Kitchen Orders Queue</h4>
                  <p className="text-[11px] text-stone-400 mt-1 leading-relaxed">
                    Advance active tickets through cooking and completion stages.
                  </p>
                </button>

                <button
                  onClick={() => setActiveTab('reservations')}
                  className="p-4 rounded-xl bg-dark-950 hover:bg-dark-850 border-2 border-dark-750 hover:border-emerald-500/70 text-left transition-all group shadow-md ring-1 ring-white/5 hover:scale-[1.01]"
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-xs text-ivory-100">Table Allocations & Seating</h4>
                  <p className="text-[11px] text-stone-400 mt-1 leading-relaxed">
                    Review guest party requests and floor plan table bookings.
                  </p>
                </button>
              </div>
            </div>

            {/* Split Stream: Recent Kitchen Orders & Today's Bookings */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Orders Card */}
              <div className="bg-dark-900 rounded-2xl border-2 border-dark-700 shadow-xl ring-1 ring-white/10 p-5 space-y-3.5">
                <div className="flex items-center justify-between border-b-2 border-dark-800 pb-3">
                  <h3 className="font-serif text-sm font-bold text-ivory-100 flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-amber-400" />
                    <span>Recent Kitchen Tickets</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-amber-400 hover:underline font-semibold"
                  >
                    View All ({orders.length}) →
                  </button>
                </div>

                {orders.length === 0 ? (
                  <div className="p-8 text-center text-xs text-stone-500">No active orders</div>
                ) : (
                  <div className="space-y-3">
                    {orders.slice(0, 3).map((order) => (
                      <div
                        key={order.orderId}
                        className="bg-dark-950 p-4 rounded-xl border-2 border-dark-750 hover:border-amber-500/60 shadow-md ring-1 ring-white/5 space-y-2 hover:scale-[1.01] transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                            #{order.orderId} · {order.orderType.toUpperCase()}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase bg-dark-900 text-stone-200 border border-dark-700">
                            ● {order.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-ivory-100 font-semibold text-sm">
                            {order.customerName} {order.tableNumber ? `(${order.tableNumber})` : ''}
                          </span>
                          <span className="font-serif font-bold text-amber-400 text-sm">
                            ₹{order.total}
                          </span>
                        </div>
                        <div className="text-[11px] text-stone-400 truncate">
                          {order.items.map((i) => `${i.quantity}x ${i.dish.name}`).join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Table Reservations */}
              <div className="bg-dark-900 rounded-2xl border-2 border-dark-700 shadow-xl ring-1 ring-white/10 p-5 space-y-3.5">
                <div className="flex items-center justify-between border-b-2 border-dark-800 pb-3">
                  <h3 className="font-serif text-sm font-bold text-ivory-100 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-400" />
                    <span>Upcoming Table Bookings</span>
                  </h3>
                  <button
                    onClick={() => setActiveTab('reservations')}
                    className="text-xs text-emerald-400 hover:underline font-semibold"
                  >
                    View All ({reservations.length}) →
                  </button>
                </div>

                {reservations.length === 0 ? (
                  <div className="p-8 text-center text-xs text-stone-500">No reservations recorded</div>
                ) : (
                  <div className="space-y-3">
                    {reservations.slice(0, 3).map((res) => (
                      <div
                        key={res.id}
                        className="bg-dark-950 p-4 rounded-xl border-2 border-dark-750 hover:border-emerald-500/60 shadow-md ring-1 ring-white/5 space-y-2 hover:scale-[1.01] transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-serif text-sm font-bold text-ivory-100">
                            {res.name} ({res.guests} Guests)
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                            res.status === 'confirmed'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                              : res.status === 'pending'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-dark-900 text-stone-300 border border-dark-700'
                          }`}>
                            ● {res.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-stone-300 font-mono">
                          <span>📅 {res.time} · {res.tableName || res.seatingPreference}</span>
                          <span className="text-stone-400">📞 {res.phone}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: KITCHEN ORDERS STREAM (ENHANCED POS ARCHITECTURE)
            ======================================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-5 animate-in fade-in duration-300">
            {/* Control Bar: Search + Status Filters + Type Filters + View Mode */}
            <div className="bg-dark-900/95 p-4 rounded-2xl border border-dark-750 shadow-lg space-y-3">
              <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
                
                {/* Search Box */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                  <input
                    type="text"
                    placeholder="Search by order ID, customer name, phone, table..."
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    className="w-full bg-dark-950 border border-dark-800 rounded-xl pl-10 pr-3.5 py-2 text-xs text-ivory-100 placeholder-stone-600 focus:outline-none focus:border-amber-500"
                  />
                  {orderSearch && (
                    <button
                      onClick={() => setOrderSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* View Mode & Order Type Toggles */}
                <div className="flex items-center gap-2 flex-wrap justify-between sm:justify-end">
                  {/* Order Type Filter */}
                  <div className="flex items-center bg-dark-950 p-1 rounded-xl border border-dark-800 text-xs">
                    {(['all', 'dine-in', 'takeaway', 'delivery'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setOrderTypeFilter(type)}
                        className={`px-2.5 py-1 rounded-lg capitalize font-medium transition-all ${
                          orderTypeFilter === type
                            ? 'bg-amber-500 text-dark-950 font-bold'
                            : 'text-stone-400 hover:text-ivory-100'
                        }`}
                      >
                        {type === 'all' ? 'All Types' : type}
                      </button>
                    ))}
                  </div>

                  {/* Kanban vs Card View Switcher */}
                  <div className="flex items-center bg-dark-950 p-1 rounded-xl border border-dark-800 text-xs">
                    <button
                      onClick={() => setOrdersViewMode('cards')}
                      className={`p-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                        ordersViewMode === 'cards'
                          ? 'bg-amber-500 text-dark-950 font-bold'
                          : 'text-stone-400 hover:text-ivory-100'
                      }`}
                      title="Cards View"
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Cards</span>
                    </button>

                    <button
                      onClick={() => setOrdersViewMode('kanban')}
                      className={`p-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
                        ordersViewMode === 'kanban'
                          ? 'bg-amber-500 text-dark-950 font-bold'
                          : 'text-stone-400 hover:text-ivory-100'
                      }`}
                      title="Kanban Board View"
                    >
                      <Columns3 className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Kitchen Board</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Status Filter Badges Strip */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 border-t border-dark-800 text-xs">
                {(['all', 'received', 'kitchen', 'ready', 'completed', 'cancelled'] as const).map((st) => {
                  const count = st === 'all' 
                    ? orders.length 
                    : orders.filter((o) => o.status === st).length;
                  return (
                    <button
                      key={st}
                      onClick={() => setOrderStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-lg capitalize font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                        orderStatusFilter === st
                          ? 'bg-amber-500 text-dark-950 font-bold shadow'
                          : 'bg-dark-950 text-stone-400 hover:text-ivory-100 border border-dark-800'
                      }`}
                    >
                      <span>{st === 'all' ? 'All Orders' : st}</span>
                      <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                        orderStatusFilter === st ? 'bg-dark-950 text-amber-400 font-bold' : 'bg-dark-850 text-stone-400'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* VIEW MODE 1: KANBAN BOARD */}
            {ordersViewMode === 'kanban' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
                {(['received', 'kitchen', 'ready', 'completed'] as const).map((stage) => {
                  const stageOrders = filteredOrders.filter((o) => o.status === stage);
                  const stageMeta = {
                    received: { title: '1. Received', color: 'border-amber-500/40 text-amber-400 bg-amber-500/10' },
                    kitchen: { title: '2. Cooking Hearth', color: 'border-orange-500/40 text-orange-400 bg-orange-500/10' },
                    ready: { title: '3. Ready for Service', color: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10' },
                    completed: { title: '4. Completed & Paid', color: 'border-stone-700 text-stone-400 bg-dark-900' },
                  }[stage];

                  return (
                    <div key={stage} className="bg-dark-900/70 rounded-2xl border border-dark-800 p-3.5 space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-dark-800">
                        <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border ${stageMeta.color}`}>
                          {stageMeta.title}
                        </span>
                        <span className="font-mono text-xs font-bold text-stone-400">
                          {stageOrders.length}
                        </span>
                      </div>

                      <div className="space-y-3 min-h-[300px]">
                        {stageOrders.length === 0 ? (
                          <div className="p-8 text-center text-xs text-stone-600 italic">No tickets in this stage</div>
                        ) : (
                          stageOrders.map((order) => (
                            <div
                              key={order.orderId}
                              className="bg-dark-950 p-4 rounded-xl border border-dark-800 hover:border-dark-700 transition-all space-y-3 shadow-md"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-mono text-xs font-bold text-amber-400">
                                  {order.orderId}
                                </span>
                                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-dark-900 text-stone-300 border border-dark-750">
                                  {order.orderType}
                                </span>
                              </div>

                              <div className="text-xs space-y-0.5">
                                <div className="font-semibold text-ivory-100 flex items-center justify-between">
                                  <span>{order.customerName}</span>
                                  <span className="font-mono font-bold text-amber-400">₹{order.total}</span>
                                </div>
                                {order.tableNumber && (
                                  <span className="text-[11px] text-amber-300/80 font-medium block">
                                    📍 {order.tableNumber}
                                  </span>
                                )}
                              </div>

                              {/* Items Snippet */}
                              <div className="bg-dark-900/80 p-2 rounded-lg border border-dark-800 text-[11px] text-stone-300 space-y-1">
                                {order.items.map((it, i) => (
                                  <div key={i} className="flex items-center justify-between">
                                    <span className="truncate pr-2">{it.quantity}x {it.dish.name}</span>
                                    <span className="font-mono text-stone-400">₹{it.dish.price * it.quantity}</span>
                                  </div>
                                ))}
                              </div>

                              {/* Stage Transition Control */}
                              <div className="pt-1 flex items-center justify-between gap-2">
                                {stage === 'received' && (
                                  <button
                                    onClick={() => updateOrderStatus(order.orderId, 'kitchen')}
                                    className="w-full py-1.5 bg-orange-500 hover:bg-orange-400 text-dark-950 font-bold text-xs rounded-lg transition-all text-center shadow"
                                  >
                                    Send to Kitchen →
                                  </button>
                                )}
                                {stage === 'kitchen' && (
                                  <button
                                    onClick={() => updateOrderStatus(order.orderId, 'ready')}
                                    className="w-full py-1.5 bg-emerald-500 hover:bg-emerald-400 text-dark-950 font-bold text-xs rounded-lg transition-all text-center shadow"
                                  >
                                    Mark Ready ✓
                                  </button>
                                )}
                                {stage === 'ready' && (
                                  <button
                                    onClick={() => updateOrderStatus(order.orderId, 'completed')}
                                    className="w-full py-1.5 bg-amber-500 hover:bg-amber-400 text-dark-950 font-bold text-xs rounded-lg transition-all text-center shadow"
                                  >
                                    Complete & Paid ✓
                                  </button>
                                )}
                                {stage === 'completed' && (
                                  <span className="text-[11px] text-stone-500 font-mono text-center w-full block">
                                    ✓ Settled at {order.createdAt}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* VIEW MODE 2: REFINED STRUCTURED ORDER CARDS */
              <div className="space-y-4">
                {filteredOrders.length === 0 ? (
                  <div className="p-16 text-center bg-dark-900/50 rounded-3xl border-2 border-dark-800 space-y-2">
                    <ShoppingBag className="w-8 h-8 text-stone-600 mx-auto" />
                    <p className="font-serif text-base text-ivory-100">No matching kitchen orders found</p>
                    <p className="text-xs text-stone-400">Try changing your search query or status filter.</p>
                  </div>
                ) : (
                  filteredOrders.map((order) => {
                    const statusCardStyle = {
                      received: 'border-amber-500/50 border-l-[6px] border-l-amber-500 shadow-[0_6px_30px_rgba(0,0,0,0.8),0_0_15px_rgba(245,158,11,0.15)]',
                      kitchen: 'border-orange-500/60 border-l-[6px] border-l-orange-500 shadow-[0_6px_30px_rgba(0,0,0,0.8),0_0_15px_rgba(249,115,22,0.18)]',
                      ready: 'border-emerald-500/60 border-l-[6px] border-l-emerald-500 shadow-[0_6px_30px_rgba(0,0,0,0.8),0_0_15px_rgba(16,185,129,0.18)]',
                      completed: 'border-dark-700 border-l-[6px] border-l-stone-600 shadow-lg',
                      cancelled: 'border-red-500/40 border-l-[6px] border-l-red-500 shadow-lg',
                    }[order.status] || 'border-dark-750 border-l-[6px] border-l-amber-500';

                    return (
                      <div
                        key={order.orderId}
                        className={`bg-dark-900 rounded-2xl border-2 ${statusCardStyle} overflow-hidden transition-all my-5 ring-1 ring-white/10`}
                      >
                        {/* 1. Header Bar: Order ID + Type + Timestamp + Status Pill */}
                        <div className="bg-dark-950 px-5 py-4 border-b-2 border-dark-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="font-mono text-sm font-bold text-amber-400 bg-amber-500/15 px-3 py-1.5 rounded-xl border border-amber-500/30">
                              #{order.orderId}
                            </span>
                            
                            <span className="text-xs uppercase font-bold px-3 py-1.5 rounded-xl bg-dark-900 text-stone-200 border border-dark-700 flex items-center gap-1.5 shadow-sm">
                              {order.orderType === 'dine-in' && <UtensilsCrossed className="w-3.5 h-3.5 text-amber-400" />}
                              {order.orderType === 'takeaway' && <ShoppingBag className="w-3.5 h-3.5 text-orange-400" />}
                              {order.orderType === 'delivery' && <MapPin className="w-3.5 h-3.5 text-blue-400" />}
                              <span>{order.orderType}</span>
                            </span>

                            {order.tableNumber && (
                              <span className="text-xs font-bold text-amber-300 bg-amber-500/10 px-3 py-1.5 rounded-xl border border-amber-500/40 flex items-center gap-1.5">
                                <span>📍</span>
                                <span>{order.tableNumber}</span>
                              </span>
                            )}

                            <span className="text-xs text-stone-300 flex items-center gap-1.5 font-mono bg-dark-900 px-2.5 py-1 rounded-lg border border-dark-800">
                              <Clock className="w-3.5 h-3.5 text-amber-400" />
                              <span>{order.createdAt} ({order.createdDate})</span>
                            </span>
                          </div>

                          {/* Status Badge + Delete Control */}
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-bold uppercase px-3.5 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm ${
                              order.status === 'kitchen'
                                ? 'bg-orange-500/20 text-orange-300 border-2 border-orange-500/50 animate-pulse'
                                : order.status === 'ready'
                                ? 'bg-emerald-500/20 text-emerald-300 border-2 border-emerald-500/50'
                                : order.status === 'completed'
                                ? 'bg-dark-850 text-stone-300 border-2 border-dark-700'
                                : order.status === 'cancelled'
                                ? 'bg-red-500/20 text-red-300 border-2 border-red-500/50'
                                : 'bg-amber-500/20 text-amber-300 border-2 border-amber-500/50'
                            }`}>
                              <span className="h-2 w-2 rounded-full bg-current" />
                              <span>● {order.status}</span>
                            </span>

                            <button
                              onClick={() => {
                                if (window.confirm(`Delete order ${order.orderId}?`)) {
                                  deleteOrder(order.orderId);
                                }
                              }}
                              className="p-2 text-stone-400 hover:text-red-400 hover:bg-dark-850 rounded-xl border border-dark-800 transition-colors"
                              title="Delete order ticket"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* 2. Customer & Delivery Info Box */}
                        <div className="mx-4 sm:mx-5 my-3.5 p-4 bg-dark-950/90 border border-dark-750/90 rounded-xl shadow-inner grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-dark-900 border border-dark-700 flex items-center justify-center text-amber-400 shrink-0 shadow">
                              <User className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="text-stone-400 text-[10px] uppercase font-bold tracking-wider block">Customer Name</span>
                              <span className="font-semibold text-ivory-100 text-sm">{order.customerName}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-dark-900 border border-dark-700 flex items-center justify-center text-emerald-400 shrink-0 shadow">
                              <Phone className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="text-stone-400 text-[10px] uppercase font-bold tracking-wider block">Contact Phone</span>
                              <span className="font-mono font-semibold text-stone-200">{order.phone}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-dark-900 border border-dark-700 flex items-center justify-center text-amber-400 shrink-0 shadow">
                              <CreditCard className="w-4 h-4" />
                            </div>
                            <div>
                              <span className="text-stone-400 text-[10px] uppercase font-bold tracking-wider block">Payment Mode</span>
                              <span className="capitalize font-semibold text-stone-200">{order.paymentMethod.replace('-', ' ')}</span>
                            </div>
                          </div>

                          {order.deliveryAddress && (
                            <div className="sm:col-span-3 pt-2 mt-1 border-t border-dark-800 text-xs text-stone-300 flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                              <span><strong className="text-stone-400">Delivery Address:</strong> {order.deliveryAddress}</span>
                            </div>
                          )}
                        </div>

                        {/* 3. Items Breakdown Table */}
                        <div className="mx-4 sm:mx-5 mb-4 p-4 bg-dark-950/60 border border-dark-750/80 rounded-xl space-y-2.5">
                          <div className="flex items-center justify-between text-xs text-stone-400 border-b border-dark-800 pb-2">
                            <span className="font-bold uppercase text-[11px] tracking-wider text-stone-300">
                              Ordered Culinary Items ({order.items.length})
                            </span>
                            <span className="font-bold uppercase text-[11px] tracking-wider text-stone-300">
                              Price
                            </span>
                          </div>

                          <div className="divide-y divide-dark-800/80">
                            {order.items.map((it, idx) => (
                              <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                                <div className="flex items-center gap-3">
                                  <span className="font-mono font-bold text-dark-950 bg-amber-400 px-2.5 py-1 rounded-lg text-xs shadow-sm">
                                    {it.quantity}×
                                  </span>
                                  <div>
                                    <span className="font-bold text-ivory-100 text-sm">{it.dish.name}</span>
                                    <span className="text-stone-400 text-[11px] block capitalize font-medium">{it.dish.category}</span>
                                  </div>
                                </div>
                                <span className="font-mono font-bold text-amber-400 text-sm">
                                  ₹{it.dish.price * it.quantity}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 4. Financial Footer & Stage Advance Workflow */}
                        <div className="px-5 py-4 bg-dark-950 border-t-2 border-dark-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-center gap-3 sm:gap-5 text-xs font-mono flex-wrap">
                            <span className="text-stone-400">Subtotal: <strong className="text-stone-200">₹{order.subtotal}</strong></span>
                            <span className="text-stone-400">GST (5%): <strong className="text-stone-200">₹{order.tax}</strong></span>
                            <span className="font-serif text-base font-bold text-amber-400 bg-amber-500/15 px-3.5 py-1.5 rounded-xl border border-amber-500/40 shadow-glow-amber">
                              Total: ₹{order.total}
                            </span>
                          </div>

                          {/* Workflow Action Buttons */}
                          <div className="flex items-center gap-2 flex-wrap">
                            {order.status === 'received' && (
                              <button
                                onClick={() => updateOrderStatus(order.orderId, 'kitchen')}
                                className="px-4 py-2.5 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 text-dark-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5 hover:scale-[1.02]"
                              >
                                <span>Start Cooking in Kitchen</span>
                                <span>→</span>
                              </button>
                            )}
                            {order.status === 'kitchen' && (
                              <button
                                onClick={() => updateOrderStatus(order.orderId, 'ready')}
                                className="px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-dark-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5 hover:scale-[1.02]"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                                <span>Mark Plated & Ready</span>
                              </button>
                            )}
                            {order.status === 'ready' && (
                              <button
                                onClick={() => updateOrderStatus(order.orderId, 'completed')}
                                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-dark-950 font-bold text-xs rounded-xl shadow-glow-amber transition-all flex items-center gap-1.5 hover:scale-[1.02]"
                              >
                                <Check className="w-4 h-4" />
                                <span>Complete & Settle Paid</span>
                              </button>
                            )}
                            {order.status !== 'cancelled' && order.status !== 'completed' && (
                              <button
                                onClick={() => updateOrderStatus(order.orderId, 'cancelled')}
                                className="px-3.5 py-2 bg-dark-900 hover:bg-red-950/40 text-stone-400 hover:text-red-300 text-xs rounded-xl border border-dark-750 transition-colors"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 3: TABLE RESERVATIONS MANAGER
            ======================================================== */}
        {activeTab === 'reservations' && (
          <div className="space-y-5 animate-in fade-in duration-300">
            {/* Search + Status Filters */}
            <div className="bg-dark-900/95 p-4 rounded-2xl border border-dark-750 shadow-lg space-y-3">
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                  <input
                    type="text"
                    placeholder="Search by guest name, phone, table code..."
                    value={resSearch}
                    onChange={(e) => setResSearch(e.target.value)}
                    className="w-full bg-dark-950 border border-dark-800 rounded-xl pl-10 pr-3.5 py-2 text-xs text-ivory-100 placeholder-stone-600 focus:outline-none focus:border-amber-500"
                  />
                  {resSearch && (
                    <button
                      onClick={() => setResSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <button
                  onClick={handleSimulateReservation}
                  className="px-3.5 py-2 bg-dark-950 hover:bg-dark-850 text-emerald-400 text-xs font-semibold rounded-xl border border-dark-800 flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Simulate Booking</span>
                </button>
              </div>

              {/* Status Filter Badges */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 border-t border-dark-800 text-xs">
                {(['all', 'pending', 'confirmed', 'seated', 'completed', 'cancelled'] as const).map((st) => {
                  const count = st === 'all'
                    ? reservations.length
                    : reservations.filter((r) => r.status === st).length;
                  return (
                    <button
                      key={st}
                      onClick={() => setResStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-lg capitalize font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                        resStatusFilter === st
                          ? 'bg-amber-500 text-dark-950 font-bold shadow'
                          : 'bg-dark-950 text-stone-400 hover:text-ivory-100 border border-dark-800'
                      }`}
                    >
                      <span>{st === 'all' ? 'All Bookings' : st}</span>
                      <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                        resStatusFilter === st ? 'bg-dark-950 text-amber-400 font-bold' : 'bg-dark-850 text-stone-400'
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Reservations Grid Cards */}
            <div className="space-y-4">
              {filteredReservations.length === 0 ? (
                <div className="p-16 text-center bg-dark-900/50 rounded-3xl border-2 border-dark-800 space-y-2">
                  <Calendar className="w-8 h-8 text-stone-600 mx-auto" />
                  <p className="font-serif text-base text-ivory-100">No reservations found</p>
                  <p className="text-xs text-stone-400">Try adjusting your search criteria.</p>
                </div>
              ) : (
                filteredReservations.map((res) => {
                  const resStatusCardStyle = {
                    confirmed: 'border-emerald-500/50 border-l-[6px] border-l-emerald-500 shadow-[0_6px_30px_rgba(0,0,0,0.8),0_0_15px_rgba(16,185,129,0.15)]',
                    pending: 'border-amber-500/50 border-l-[6px] border-l-amber-500 shadow-[0_6px_30px_rgba(0,0,0,0.8),0_0_15px_rgba(245,158,11,0.15)]',
                    seated: 'border-blue-500/50 border-l-[6px] border-l-blue-500 shadow-[0_6px_30px_rgba(0,0,0,0.8),0_0_15px_rgba(59,130,246,0.15)]',
                    completed: 'border-dark-700 border-l-[6px] border-l-stone-600 shadow-lg',
                    cancelled: 'border-red-500/40 border-l-[6px] border-l-red-500 shadow-lg',
                  }[res.status] || 'border-dark-750 border-l-[6px] border-l-emerald-500';

                  return (
                    <div
                      key={res.id}
                      className={`bg-dark-900 rounded-2xl border-2 ${resStatusCardStyle} p-5 space-y-4 my-5 transition-all ring-1 ring-white/10`}
                    >
                      {/* Header Row */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-dark-800 pb-3">
                        <div className="flex items-center gap-3 flex-wrap">
                          <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/15 px-3 py-1.5 rounded-xl border border-amber-500/30">
                            #{res.id}
                          </span>
                          <h3 className="font-serif text-base font-bold text-ivory-100">
                            {res.name}
                          </h3>
                          <span className="text-xs bg-dark-950 text-stone-200 px-3 py-1.5 rounded-xl border border-dark-700 font-mono">
                            👥 {res.guests} {res.guests === 1 ? 'Guest' : 'Guests'}
                          </span>
                          <span className="text-xs text-stone-300 font-mono bg-dark-950 px-3 py-1.5 rounded-xl border border-dark-800">
                            📅 {res.date} at {res.time}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold uppercase px-3.5 py-1.5 rounded-full shadow-sm ${
                            res.status === 'confirmed'
                              ? 'bg-emerald-500/20 text-emerald-300 border-2 border-emerald-500/50'
                              : res.status === 'pending'
                              ? 'bg-amber-500/20 text-amber-300 border-2 border-amber-500/50 animate-pulse'
                              : res.status === 'seated'
                              ? 'bg-blue-500/20 text-blue-300 border-2 border-blue-500/50'
                              : 'bg-dark-850 text-stone-300 border-2 border-dark-700'
                          }`}>
                            ● {res.status}
                          </span>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete reservation for ${res.name}?`)) {
                                deleteReservation(res.id);
                              }
                            }}
                            className="p-2 text-stone-400 hover:text-red-400 hover:bg-dark-850 rounded-xl border border-dark-800 transition-colors"
                            title="Delete record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Table Allocation & Contact Strip */}
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs bg-dark-950/90 p-4 rounded-xl border border-dark-750/90 shadow-inner">
                        <div>
                          <span className="text-stone-400 text-[10px] uppercase font-bold tracking-wider block">Assigned Table</span>
                          <span className="font-bold text-amber-400 font-mono text-sm">
                            {res.tableName ? `${res.tableId || 'T'} · ${res.tableName}` : `${res.seatingPreference} (Auto)`}
                          </span>
                        </div>
                        <div>
                          <span className="text-stone-400 text-[10px] uppercase font-bold tracking-wider block">Seating Zone</span>
                          <span className="capitalize font-semibold text-stone-200">{res.tableZone || res.seatingPreference}</span>
                        </div>
                        <div>
                          <span className="text-stone-400 text-[10px] uppercase font-bold tracking-wider block">Contact Phone</span>
                          <span className="font-mono font-semibold text-stone-200">{res.phone}</span>
                        </div>
                        <div>
                          <span className="text-stone-400 text-[10px] uppercase font-bold tracking-wider block">Special Request</span>
                          <span className="text-stone-300 italic truncate block">{res.specialRequest || 'None'}</span>
                        </div>
                      </div>

                      {/* Action Controls */}
                      <div className="flex items-center justify-end gap-2 flex-wrap pt-1">
                        {res.status === 'pending' && (
                          <button
                            onClick={() => updateReservationStatus(res.id, 'confirmed')}
                            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-dark-950 text-xs font-bold rounded-xl transition-all shadow-lg hover:scale-[1.02]"
                          >
                            Confirm Reservation ✓
                          </button>
                        )}
                        {res.status === 'confirmed' && (
                          <button
                            onClick={() => updateReservationStatus(res.id, 'seated')}
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-400 text-dark-950 text-xs font-bold rounded-xl transition-all shadow-lg hover:scale-[1.02]"
                          >
                            Seat Guests at Table →
                          </button>
                        )}
                        {res.status === 'seated' && (
                          <button
                            onClick={() => updateReservationStatus(res.id, 'completed')}
                            className="px-4 py-2 bg-dark-850 hover:bg-dark-750 text-stone-200 text-xs font-semibold rounded-xl border border-dark-700 transition-colors"
                          >
                            Mark Completed
                          </button>
                        )}
                        {res.status !== 'cancelled' && res.status !== 'completed' && (
                          <button
                            onClick={() => updateReservationStatus(res.id, 'cancelled')}
                            className="px-3.5 py-2 bg-dark-950 hover:bg-red-950/40 text-stone-400 hover:text-red-300 text-xs rounded-xl border border-dark-800 transition-colors"
                          >
                            Decline
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 4: MENU CATALOG & DISHES INVENTORY
            ======================================================== */}
        {activeTab === 'menu' && (
          <div className="space-y-5 animate-in fade-in duration-300">
            {/* Action Bar + Category Selector */}
            <div className="bg-dark-900 p-4 rounded-2xl border-2 border-dark-700 shadow-xl ring-1 ring-white/10 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                  <input
                    type="text"
                    placeholder="Search dishes by name, ingredients, category..."
                    value={menuSearch}
                    onChange={(e) => setMenuSearch(e.target.value)}
                    className="w-full bg-dark-950 border-2 border-dark-750 rounded-xl pl-10 pr-3.5 py-2 text-xs text-ivory-100 placeholder-stone-600 focus:outline-none focus:border-amber-500"
                  />
                  {menuSearch && (
                    <button
                      onClick={() => setMenuSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={resetMenuToDefault}
                    className="px-3.5 py-2 bg-dark-950 hover:bg-dark-850 text-stone-300 hover:text-ivory-100 text-xs rounded-xl border-2 border-dark-750 flex items-center gap-1.5 transition-colors shadow"
                    title="Restore standard 44 dish portfolio catalog"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset Defaults</span>
                  </button>

                  <button
                    onClick={handleOpenAddDish}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-dark-950 font-bold text-xs uppercase tracking-wider rounded-xl shadow-glow-amber flex items-center gap-1.5 transition-all hover:scale-[1.02]"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add New Dish</span>
                  </button>
                </div>
              </div>

              {/* 9 Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-t-2 border-dark-800 pt-3 text-xs">
                <button
                  onClick={() => setMenuCategoryFilter('all')}
                  className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-semibold transition-all ${
                    menuCategoryFilter === 'all'
                      ? 'bg-amber-500 text-dark-950 font-bold shadow'
                      : 'bg-dark-950 text-stone-400 hover:text-ivory-100 border border-dark-800'
                  }`}
                >
                  All ({menuItemsList.length})
                </button>
                {menuCategories.map((cat) => {
                  const count = menuItemsList.filter((d) => d.category === cat.id).length;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setMenuCategoryFilter(cat.id)}
                      className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-semibold transition-all ${
                        menuCategoryFilter === cat.id
                          ? 'bg-amber-500 text-dark-950 font-bold shadow'
                          : 'bg-dark-950 text-stone-400 hover:text-ivory-100 border border-dark-800'
                      }`}
                    >
                      {cat.title} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Dishes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredMenuItems.map((dish) => (
                <div
                  key={dish.id}
                  className="bg-dark-900 rounded-2xl border-2 border-dark-700 hover:border-amber-500/70 shadow-xl ring-1 ring-white/10 p-4 flex flex-col justify-between group hover:scale-[1.01] transition-all"
                >
                  <div className="space-y-3">
                    {/* Photo with 4:3 Aspect Ratio & Border */}
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-dark-950 border-2 border-dark-750 shadow-inner">
                      <img
                        src={dish.image}
                        alt={dish.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute top-2 left-2 flex items-center gap-1 flex-wrap">
                        {dish.dietary.map((tag) => (
                          <span
                            key={tag}
                            className={`text-[8px] font-bold px-2 py-0.5 rounded-md uppercase shadow ${
                              tag === 'VEG'
                                ? 'bg-emerald-950/95 text-emerald-400 border border-emerald-700'
                                : tag === 'NON-VEG'
                                ? 'bg-red-950/95 text-red-400 border border-red-700'
                                : 'bg-dark-950/95 text-stone-300 border border-dark-700'
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                      <div className="absolute top-2 right-2 bg-dark-950/90 backdrop-blur-sm text-amber-400 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border border-dark-700 shadow">
                        {dish.category}
                      </div>
                    </div>

                    {/* Titles */}
                    <div className="space-y-1">
                      <h4 className="font-serif text-base font-bold text-ivory-100 leading-snug">
                        {dish.name}
                      </h4>
                      <p className="text-[11px] text-stone-400 line-clamp-2 leading-relaxed">
                        {dish.description}
                      </p>
                    </div>
                  </div>

                  {/* Price & CRUD Control Actions */}
                  <div className="pt-3 border-t-2 border-dark-800 mt-3 flex items-center justify-between">
                    <div className="flex items-baseline gap-2">
                      <span className="font-serif text-base font-bold text-amber-400">
                        ₹{dish.price}
                      </span>
                      {dish.originalPrice && (
                        <span className="text-[11px] line-through text-stone-500 font-mono">
                          ₹{dish.originalPrice}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditDish(dish)}
                        className="p-2 bg-dark-950 hover:bg-dark-850 text-stone-300 hover:text-amber-400 rounded-xl border border-dark-700 transition-colors shadow"
                        title="Edit dish details & price"
                        aria-label={`Edit ${dish.name}`}
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to remove "${dish.name}" from the menu?`)) {
                            deleteDish(dish.id);
                          }
                        }}
                        className="p-2 bg-dark-950 hover:bg-red-950/40 text-stone-400 hover:text-red-400 rounded-xl border border-dark-700 transition-colors shadow"
                        title="Remove dish from menu"
                        aria-label={`Delete ${dish.name}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* ========================================================
          ADD / EDIT DISH MODAL WITH PRESET PHOTO PICKER
          ======================================================== */}
      {isDishModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-dark-950/90 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
        >
          <div className="relative w-full max-w-3xl bg-dark-900 border border-dark-700 rounded-3xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-5 sm:p-6 border-b border-dark-800 flex items-center justify-between bg-dark-950/80">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsDishModalOpen(false)}
                  className="p-2 rounded-xl bg-dark-900 hover:bg-dark-800 border border-dark-750 text-stone-300 hover:text-amber-400 transition-colors flex items-center gap-1.5 text-xs font-semibold"
                  title="Return to Admin"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Return to Admin</span>
                </button>
                <div className="h-4 w-px bg-dark-800" />
                <h3 className="font-serif text-lg font-bold text-ivory-100 flex items-center gap-2">
                  <ChefHat className="w-4 h-4 text-amber-400" />
                  <span>{editingDishId ? 'Edit Dish Details' : 'Add New Dish to Catalog'}</span>
                </h3>
              </div>

              <button
                onClick={() => setIsDishModalOpen(false)}
                className="p-2 rounded-full text-stone-400 hover:text-ivory-100 hover:bg-dark-800 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSaveDish} className="p-6 sm:p-8 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Preset Image Quick Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-amber-400 mb-2">
                  1-Click Preset Indian Food Photos (Naan, Kulcha, Biryani, Curries)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {PRESET_DISH_IMAGES.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setDishForm({ ...dishForm, image: preset.url })}
                      className={`relative aspect-video rounded-xl overflow-hidden border text-left p-1 transition-all group ${
                        dishForm.image === preset.url
                          ? 'border-amber-500 ring-2 ring-amber-500/50 scale-[1.02]'
                          : 'border-dark-750 hover:border-stone-500 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.label}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      <span className="absolute inset-x-1 bottom-1 bg-dark-950/85 backdrop-blur-sm text-[8px] font-bold text-ivory-100 px-1 py-0.5 rounded truncate block">
                        {preset.label.split(' ')[0]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Basic Fields Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-stone-300 mb-1">
                    Dish Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Malabar Truffle Parotta"
                    value={dishForm.name}
                    onChange={(e) => setDishForm({ ...dishForm, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-dark-950 border border-dark-750 rounded-xl text-xs text-ivory-100 placeholder-stone-600 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-stone-300 mb-1">
                    Category *
                  </label>
                  <select
                    value={dishForm.category}
                    onChange={(e) => setDishForm({ ...dishForm, category: e.target.value as MenuCategoryId })}
                    className="w-full px-3.5 py-2.5 bg-dark-950 border border-dark-750 rounded-xl text-xs text-ivory-100 focus:outline-none focus:border-amber-500 capitalize"
                  >
                    {menuCategories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Subtitle & Custom Image URL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-stone-300 mb-1">
                    Subtitle / Provenance
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Coimbatore Heritage Bread"
                    value={dishForm.subtitle}
                    onChange={(e) => setDishForm({ ...dishForm, subtitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-dark-950 border border-dark-750 rounded-xl text-xs text-ivory-100 placeholder-stone-600 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-stone-300 mb-1">
                    Custom Image URL / Path
                  </label>
                  <input
                    type="text"
                    placeholder="/images/dishes/malabar-parotta.jpg"
                    value={dishForm.image}
                    onChange={(e) => setDishForm({ ...dishForm, image: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-dark-950 border border-dark-750 rounded-xl text-xs text-ivory-100 placeholder-stone-600 focus:outline-none focus:border-amber-500 font-mono text-[11px]"
                  />
                </div>
              </div>

              {/* Price & Original Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-stone-300 mb-1">
                    Price in INR (₹) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    placeholder="450"
                    value={dishForm.price}
                    onChange={(e) => setDishForm({ ...dishForm, price: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-dark-950 border border-dark-750 rounded-xl text-xs text-ivory-100 placeholder-stone-600 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-stone-300 mb-1">
                    Original Price (Optional strikethrough)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="520"
                    value={dishForm.originalPrice || ''}
                    onChange={(e) => setDishForm({ ...dishForm, originalPrice: e.target.value ? Number(e.target.value) : undefined })}
                    className="w-full px-3.5 py-2.5 bg-dark-950 border border-dark-750 rounded-xl text-xs text-ivory-100 placeholder-stone-600 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold uppercase text-stone-300 mb-1">
                  Culinary Description *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Detailed description of flavors, textures, and heritage preparation..."
                  value={dishForm.description}
                  onChange={(e) => setDishForm({ ...dishForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-dark-950 border border-dark-750 rounded-xl text-xs text-ivory-100 placeholder-stone-600 focus:outline-none focus:border-amber-500 leading-relaxed"
                />
              </div>

              {/* Ingredients */}
              <div>
                <label className="block text-xs font-semibold uppercase text-stone-300 mb-1">
                  Key Ingredients (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="First-press coconut milk, tellicherry pepper, organic curry leaves"
                  value={dishForm.ingredientsText}
                  onChange={(e) => setDishForm({ ...dishForm, ingredientsText: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-dark-950 border border-dark-750 rounded-xl text-xs text-ivory-100 placeholder-stone-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Dietary Tags Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase text-stone-300 mb-2">
                  Dietary Tags & Classifications
                </label>
                <div className="flex items-center gap-2 flex-wrap">
                  {ALL_DIETARY_TAGS.map((tag) => {
                    const active = dishForm.dietary.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          if (active) {
                            setDishForm({
                              ...dishForm,
                              dietary: dishForm.dietary.filter((t) => t !== tag),
                            });
                          } else {
                            setDishForm({
                              ...dishForm,
                              dietary: [...dishForm.dietary, tag],
                            });
                          }
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          active
                            ? 'bg-amber-500 text-dark-950 shadow-glow-amber'
                            : 'bg-dark-950 text-stone-400 border border-dark-750 hover:text-ivory-100'
                        }`}
                      >
                        {active ? '✓ ' : '+ '}{tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Spice Heat Level Selector */}
              <div>
                <label className="block text-xs font-semibold uppercase text-stone-300 mb-2">
                  Spice Heat Level ({dishForm.spiceLevel} Flame{dishForm.spiceLevel !== 1 ? 's' : ''})
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { level: 0, label: 'MILD / NONE', desc: 'No chili heat' },
                    { level: 1, label: 'GENTLE WARMTH', desc: 'Aromatic balance' },
                    { level: 2, label: 'MEDIUM SPICE', desc: 'Authentic South warmth' },
                    { level: 3, label: 'FIERY HEARTH', desc: 'Chettinad heat' },
                  ].map((sp) => (
                    <button
                      key={sp.level}
                      type="button"
                      onClick={() => setDishForm({ ...dishForm, spiceLevel: sp.level as SpiceLevel, spiceLabel: sp.label })}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        dishForm.spiceLevel === sp.level
                          ? 'border-amber-500 bg-amber-500/10 text-ivory-100'
                          : 'border-dark-750 bg-dark-950 text-stone-400 hover:text-ivory-100'
                      }`}
                    >
                      <div className="flex items-center gap-1 text-amber-400 mb-1">
                        {Array.from({ length: sp.level || 1 }).map((_, i) => (
                          <Flame key={i} className={`w-3.5 h-3.5 ${sp.level === 0 ? 'text-stone-600' : ''}`} />
                        ))}
                      </div>
                      <span className="text-[11px] font-bold block">{sp.label}</span>
                      <span className="text-[9px] text-stone-500 block">{sp.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sticky Modal Action Bar */}
              <div className="pt-4 border-t border-dark-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setIsDishModalOpen(false)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-dark-950 hover:bg-dark-850 text-stone-400 hover:text-stone-200 text-xs font-semibold border border-dark-800 transition-colors"
                >
                  Cancel & Return to Admin
                </button>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-dark-950 font-bold text-xs rounded-xl shadow-glow-amber transition-all"
                  >
                    {editingDishId ? 'Save Dish Updates' : 'Add Dish to Menu Catalog'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Supabase Integration & Sync Modal */}
      <SupabaseSyncModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
      />

    </div>
  );
};
export default AdminPage;
