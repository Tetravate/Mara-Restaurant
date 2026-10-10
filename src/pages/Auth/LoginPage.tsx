import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sparkles, Users, ChefHat, ShieldCheck, ArrowRight, Lock, KeyRound, AlertCircle, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginAsGuest, loginAsStaff, loginAsAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState<'user' | 'staff' | 'admin'>('user');

  // User form state
  const [userName, setUserName] = useState('');
  const [userPhone, setUserPhone] = useState('');

  // Staff form state
  const [staffPasscode, setStaffPasscode] = useState('');
  const [staffError, setStaffError] = useState('');

  // Admin form state
  const [adminPasscode, setAdminPasscode] = useState('');
  const [adminError, setAdminError] = useState('');

  // Handle User Login
  const handleUserLogin = (e: React.FormEvent) => {
    e.preventDefault();
    loginAsGuest(userName || 'Guest Patron', userPhone);
    const redirectPath = (location.state as any)?.from?.pathname || '/';
    navigate(redirectPath === '/login' ? '/' : redirectPath);
  };

  // 1-Click Quick Guest Entry
  const handleQuickGuest = () => {
    loginAsGuest('Guest Patron');
    navigate('/');
  };

  // Handle Staff Login
  const handleStaffLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setStaffError('');
    const success = loginAsStaff(staffPasscode);
    if (success) {
      navigate('/admin');
    } else {
      setStaffError('Invalid staff passcode. (Demo PIN: 5678 or click below)');
    }
  };

  // 1-Click Quick Staff Demo
  const handleQuickStaff = () => {
    setStaffPasscode('5678');
    loginAsStaff('5678', 'Chef Brigade (Staff)');
    navigate('/admin');
  };

  // Handle Admin Login
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    const success = loginAsAdmin(adminPasscode);
    if (success) {
      navigate('/admin');
    } else {
      setAdminError('Invalid admin passcode. (Demo PIN: 1234 or click below)');
    }
  };

  // 1-Click Quick Admin Demo
  const handleQuickAdmin = () => {
    setAdminPasscode('1234');
    loginAsAdmin('1234');
    navigate('/admin');
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-dark-950 text-ivory-100 overflow-hidden selection:bg-amber-500 selection:text-dark-950">
      {/* Background Atmosphere Image with Dark Editorial Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src="/images/atmosphere/floral-dining-hall.jpg"
          alt="MĀRA ambient dining hall"
          className="w-full h-full object-cover opacity-25 filter brightness-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/85 to-dark-950/70" />
      </div>

      {/* Decorative Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="relative z-10 w-full max-w-xl bg-dark-900/90 border border-dark-750/90 rounded-3xl shadow-2xl backdrop-blur-xl p-6 sm:p-10 space-y-8 animate-in fade-in duration-500">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-dark-950 border border-dark-750 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Modern Indian Dining · Coimbatore</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-wider text-ivory-100">
            MĀRA
          </h1>
          <p className="text-xs text-stone-400 font-mono tracking-widest uppercase">
            A taste worth remembering
          </p>
        </div>

        {/* Role Switcher Tabs */}
        <div className="grid grid-cols-3 gap-2 p-1.5 bg-dark-950 rounded-2xl border border-dark-800">
          <button
            type="button"
            onClick={() => {
              setActiveTab('user');
              setStaffError('');
              setAdminError('');
            }}
            className={`py-3 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
              activeTab === 'user'
                ? 'bg-amber-500 text-dark-950 shadow-glow-amber'
                : 'text-stone-400 hover:text-ivory-100 hover:bg-dark-900'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>User Login</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('staff');
              setStaffError('');
              setAdminError('');
            }}
            className={`py-3 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
              activeTab === 'staff'
                ? 'bg-amber-500 text-dark-950 shadow-glow-amber'
                : 'text-stone-400 hover:text-ivory-100 hover:bg-dark-900'
            }`}
          >
            <ChefHat className="w-4 h-4" />
            <span>Staff Login</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('admin');
              setStaffError('');
              setAdminError('');
            }}
            className={`py-3 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
              activeTab === 'admin'
                ? 'bg-amber-500 text-dark-950 shadow-glow-amber'
                : 'text-stone-400 hover:text-ivory-100 hover:bg-dark-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Admin Login</span>
          </button>
        </div>

        {/* 1. USER / GUEST LOGIN FORM */}
        {activeTab === 'user' && (
          <form onSubmit={handleUserLogin} className="space-y-5 animate-in fade-in duration-300">
            <div className="space-y-1">
              <h3 className="font-serif text-xl font-bold text-ivory-100">
                Customer & Dining Access
              </h3>
              <p className="text-xs text-stone-400">
                Browse our seasonal dining menu, book your table with interactive floor plan, and order directly.
              </p>
            </div>

            <div className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1.5">
                  Your Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Priya Sundaram"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-dark-950 border border-dark-750 text-sm text-ivory-100 placeholder-stone-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1.5">
                  Mobile Number (Optional)
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 98421 88320"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-dark-950 border border-dark-750 text-sm text-ivory-100 placeholder-stone-600 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="submit"
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-dark-950 font-bold rounded-xl shadow-glow-amber transition-all text-sm flex items-center justify-center gap-2"
              >
                <span>Enter Dining Website</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleQuickGuest}
                className="w-full py-2.5 bg-dark-950 hover:bg-dark-800 text-stone-300 hover:text-ivory-100 text-xs rounded-xl border border-dark-750 font-medium transition-colors"
              >
                Quick 1-Click Guest Entry →
              </button>
            </div>
          </form>
        )}

        {/* 2. STAFF / KITCHEN BRIGADE LOGIN FORM */}
        {activeTab === 'staff' && (
          <form onSubmit={handleStaffLogin} className="space-y-5 animate-in fade-in duration-300">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-xl font-bold text-ivory-100">
                  Staff & Kitchen Portal
                </h3>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                  PIN: 5678
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Access live kitchen stream, table seating manager, and incoming orders.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1.5">
                Staff Passcode PIN <span className="text-amber-500">*</span>
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                <input
                  type="password"
                  placeholder="Enter staff PIN (5678)"
                  value={staffPasscode}
                  onChange={(e) => {
                    setStaffPasscode(e.target.value);
                    if (staffError) setStaffError('');
                  }}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-dark-950 border border-dark-750 text-sm text-ivory-100 placeholder-stone-600 focus:outline-none focus:border-amber-500"
                  autoFocus
                />
              </div>
              {staffError && (
                <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{staffError}</span>
                </p>
              )}
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="submit"
                className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-dark-950 font-bold rounded-xl shadow-glow-amber transition-all text-sm flex items-center justify-center gap-2"
              >
                <span>Login to Staff Dashboard</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleQuickStaff}
                className="w-full py-2.5 bg-dark-950 hover:bg-dark-800 text-amber-400 hover:text-amber-300 text-xs rounded-xl border border-dark-750 font-bold transition-colors"
              >
                ⚡ 1-Click Demo Staff Access (PIN: 5678)
              </button>
            </div>
          </form>
        )}

        {/* 3. ADMIN / MANAGEMENT LOGIN FORM */}
        {activeTab === 'admin' && (
          <form onSubmit={handleAdminLogin} className="space-y-5 animate-in fade-in duration-300">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-xl font-bold text-ivory-100">
                  Executive Admin Console
                </h3>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                  PIN: 1234
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Full authority: Menu catalog CRUD, financial revenue metrics, table allocations, and settings.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-1.5">
                Admin Security PIN <span className="text-amber-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500" />
                <input
                  type="password"
                  placeholder="Enter admin PIN (1234)"
                  value={adminPasscode}
                  onChange={(e) => {
                    setAdminPasscode(e.target.value);
                    if (adminError) setAdminError('');
                  }}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-dark-950 border border-dark-750 text-sm text-ivory-100 placeholder-stone-600 focus:outline-none focus:border-amber-500"
                  autoFocus
                />
              </div>
              {adminError && (
                <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{adminError}</span>
                </p>
              )}
            </div>

            <div className="space-y-3 pt-2">
              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-dark-950 font-bold rounded-xl shadow-glow-amber transition-all text-sm flex items-center justify-center gap-2"
              >
                <span>Unlock Admin Workspace</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleQuickAdmin}
                className="w-full py-2.5 bg-dark-950 hover:bg-dark-800 text-amber-400 hover:text-amber-300 text-xs rounded-xl border border-dark-750 font-bold transition-colors"
              >
                ⚡ 1-Click Demo Admin Access (PIN: 1234)
              </button>
            </div>
          </form>
        )}

        {/* Project Attribution Footer */}
        <div className="pt-4 border-t border-dark-800 text-center text-[11px] text-stone-500 space-y-1">
          <p>MĀRA · 42 Race Course Road, Coimbatore, Tamil Nadu</p>
          <p className="text-stone-600">Tetravate Portfolio Project · Client-Ready Architecture</p>
        </div>
      </div>
    </div>
  );
};
