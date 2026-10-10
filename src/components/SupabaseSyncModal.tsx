import React, { useState } from 'react';
import { 
  X, 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  RefreshCw, 
  ExternalLink, 
  Trash2, 
  Sparkles,
  Server,
  Zap,
  Radio
} from 'lucide-react';
import { 
  getStoredConfig, 
  saveSupabaseCredentials, 
  clearSupabaseCredentials, 
  testSupabaseConnection 
} from '../lib/supabase';
import { useRestaurantData } from '../context/RestaurantDataContext';

interface SupabaseSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SUPABASE_SCHEMA_SQL = `-- ==============================================================================
-- MARA - Modern Indian Dining (Coimbatore)
-- Supabase PostgreSQL Schema & Realtime Setup
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id TEXT NOT NULL UNIQUE,
    customer_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    order_type TEXT NOT NULL CHECK (order_type IN ('dine-in', 'takeaway', 'delivery')),
    table_number TEXT,
    delivery_address TEXT,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('pay-at-table', 'upi-qr', 'card')),
    subtotal NUMERIC(10, 2) NOT NULL DEFAULT 0,
    tax NUMERIC(10, 2) NOT NULL DEFAULT 0,
    delivery_fee NUMERIC(10, 2) NOT NULL DEFAULT 0,
    total NUMERIC(10, 2) NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'received' CHECK (status IN ('received', 'kitchen', 'ready', 'completed', 'cancelled')),
    estimated_minutes INTEGER DEFAULT 30,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. RESERVATIONS TABLE
CREATE TABLE IF NOT EXISTS public.reservations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    res_code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    date DATE NOT NULL,
    time TEXT NOT NULL,
    guests INTEGER NOT NULL DEFAULT 2,
    seating_preference TEXT NOT NULL DEFAULT 'indoor',
    table_id TEXT,
    table_name TEXT,
    table_zone TEXT,
    special_request TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'seated', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. MENU ITEMS TABLE
CREATE TABLE IF NOT EXISTS public.menu_items (
    id TEXT PRIMARY KEY,
    slug TEXT NOT NULL,
    name TEXT NOT NULL,
    subtitle TEXT DEFAULT '',
    description TEXT NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    original_price NUMERIC(10, 2),
    category TEXT NOT NULL,
    vegetarian BOOLEAN NOT NULL DEFAULT true,
    vegan BOOLEAN NOT NULL DEFAULT false,
    gluten_free BOOLEAN NOT NULL DEFAULT false,
    dairy_free BOOLEAN NOT NULL DEFAULT false,
    dietary TEXT[] DEFAULT '{}',
    spice_level INTEGER NOT NULL DEFAULT 1 CHECK (spice_level BETWEEN 0 AND 3),
    spice_label TEXT DEFAULT 'MILD',
    image TEXT NOT NULL,
    featured BOOLEAN DEFAULT false,
    pairing_note TEXT,
    ingredients TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    notif_id TEXT NOT NULL UNIQUE,
    type TEXT NOT NULL CHECK (type IN ('order', 'reservation')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    time TEXT NOT NULL,
    read BOOLEAN NOT NULL DEFAULT false,
    reference_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. REALTIME REPLICATION
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.reservations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.menu_items;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- 7. ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Public Insert Orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Orders" ON public.orders FOR UPDATE USING (true);
CREATE POLICY "Public Delete Orders" ON public.orders FOR DELETE USING (true);

CREATE POLICY "Public Read Reservations" ON public.reservations FOR SELECT USING (true);
CREATE POLICY "Public Insert Reservations" ON public.reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Reservations" ON public.reservations FOR UPDATE USING (true);
CREATE POLICY "Public Delete Reservations" ON public.reservations FOR DELETE USING (true);

CREATE POLICY "Public Read Menu Items" ON public.menu_items FOR SELECT USING (true);
CREATE POLICY "Public Insert Menu Items" ON public.menu_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Menu Items" ON public.menu_items FOR UPDATE USING (true);
CREATE POLICY "Public Delete Menu Items" ON public.menu_items FOR DELETE USING (true);

CREATE POLICY "Public Read Notifications" ON public.notifications FOR SELECT USING (true);
CREATE POLICY "Public Insert Notifications" ON public.notifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Notifications" ON public.notifications FOR UPDATE USING (true);
CREATE POLICY "Public Delete Notifications" ON public.notifications FOR DELETE USING (true);
`;

export const SupabaseSyncModal: React.FC<SupabaseSyncModalProps> = ({ isOpen, onClose }) => {
  const { isSupabaseLive, isSyncing, syncWithSupabase } = useRestaurantData();

  const [urlInput, setUrlInput] = useState(() => getStoredConfig().url);
  const [keyInput, setKeyInput] = useState(() => getStoredConfig().key);
  const [testResult, setTestResult] = useState<{ loading: boolean; success?: boolean; message?: string } | null>(null);
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setTestResult(null);

    if (!urlInput.trim() || !keyInput.trim()) {
      clearSupabaseCredentials();
      setSavedSuccess(true);
      await syncWithSupabase();
      setTimeout(() => setSavedSuccess(false), 3000);
      return;
    }

    saveSupabaseCredentials(urlInput.trim(), keyInput.trim());
    setSavedSuccess(true);
    await syncWithSupabase();
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleClear = async () => {
    clearSupabaseCredentials();
    setUrlInput('');
    setKeyInput('');
    setTestResult(null);
    setSavedSuccess(true);
    await syncWithSupabase();
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleTestConnection = async () => {
    // Temporarily save inputs to test
    if (urlInput.trim() && keyInput.trim()) {
      saveSupabaseCredentials(urlInput.trim(), keyInput.trim());
    }

    setTestResult({ loading: true });
    const res = await testSupabaseConnection();
    setTestResult({ loading: false, success: res.success, message: res.message });
  };

  const handleCopySchema = async () => {
    try {
      await navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
      setCopiedSchema(true);
      setTimeout(() => setCopiedSchema(false), 3000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-dark-900 border-2 border-dark-700 rounded-3xl shadow-2xl overflow-hidden ring-1 ring-white/10 my-8">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-dark-950 border-b border-dark-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg font-bold text-ivory-100">Supabase Backend Integration</h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                  isSupabaseLive 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                }`}>
                  {isSupabaseLive ? 'Cloud Connected' : 'Local Storage Mode'}
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                Realtime cloud PostgreSQL sync with optimistic offline resilience.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-ivory-100 hover:bg-dark-800 transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Status Banner */}
          <div className={`p-4 rounded-2xl border-2 flex items-start gap-3.5 ${
            isSupabaseLive
              ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
              : 'bg-amber-950/20 border-amber-500/40 text-amber-300'
          }`}>
            <div className={`p-2 rounded-xl shrink-0 ${
              isSupabaseLive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
            }`}>
              {isSupabaseLive ? <Radio className="w-5 h-5 animate-pulse" /> : <Server className="w-5 h-5" />}
            </div>
            <div className="flex-1 text-xs space-y-1">
              <div className="font-bold text-sm">
                {isSupabaseLive
                  ? 'Active Cloud Database Connection'
                  : 'Operating in Local Storage Fallback Mode'}
              </div>
              <p className="text-stone-300 leading-relaxed">
                {isSupabaseLive
                  ? 'Orders, table bookings, menu catalog, and notifications are actively synchronized with your Supabase PostgreSQL cluster with Realtime updates enabled.'
                  : 'Orders and reservations are safely stored in browser storage. Connect your free Supabase project below to enable cross-device multi-user live sync!'}
              </p>
            </div>
          </div>

          {/* Test & Sync Actions Bar */}
          <div className="flex flex-wrap items-center gap-2.5 p-3 rounded-2xl bg-dark-950 border border-dark-800">
            <button
              onClick={handleTestConnection}
              disabled={testResult?.loading}
              className="px-3.5 py-2 rounded-xl bg-dark-850 hover:bg-dark-800 border border-dark-700 text-xs font-semibold text-stone-200 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <Zap className={`w-3.5 h-3.5 text-amber-400 ${testResult?.loading ? 'animate-spin' : ''}`} />
              <span>{testResult?.loading ? 'Testing Connection...' : 'Test Connection'}</span>
            </button>

            <button
              onClick={() => syncWithSupabase()}
              disabled={isSyncing}
              className="px-3.5 py-2 rounded-xl bg-dark-850 hover:bg-dark-800 border border-dark-700 text-xs font-semibold text-stone-200 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing...' : 'Sync Cloud Data Now'}</span>
            </button>

            <button
              onClick={handleCopySchema}
              className="px-3.5 py-2 rounded-xl bg-dark-850 hover:bg-dark-800 border border-dark-700 text-xs font-semibold text-amber-400 flex items-center gap-2 transition-all ml-auto"
            >
              {copiedSchema ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSchema ? 'SQL Copied!' : 'Copy SQL Schema'}</span>
            </button>
          </div>

          {/* Test Result Feedback */}
          {testResult && (
            <div className={`p-3.5 rounded-xl text-xs flex items-center gap-2.5 border ${
              testResult.success
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-red-500/10 border-red-500/30 text-red-300'
            }`}>
              {testResult.success ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" /> : <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />}
              <span className="leading-snug">{testResult.message}</span>
            </div>
          )}

          {/* Configuration Form */}
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                Supabase Project URL
              </label>
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://your-project-id.supabase.co"
                className="w-full px-4 py-2.5 rounded-xl bg-dark-950 border border-dark-750 text-ivory-100 text-xs focus:outline-none focus:border-amber-500 font-mono transition-colors"
              />
              <span className="text-[11px] text-stone-500 mt-1 block">
                Found in Supabase Dashboard &gt; Project Settings &gt; API &gt; Project URL
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                Supabase Public Anon Key
              </label>
              <input
                type="password"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full px-4 py-2.5 rounded-xl bg-dark-950 border border-dark-750 text-ivory-100 text-xs focus:outline-none focus:border-amber-500 font-mono transition-colors"
              />
              <span className="text-[11px] text-stone-500 mt-1 block">
                Found in Supabase Dashboard &gt; Project Settings &gt; API &gt; Project API keys (anon public)
              </span>
            </div>

            {savedSuccess && (
              <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Supabase credentials saved successfully. System synchronized!</span>
              </div>
            )}

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                type="button"
                onClick={handleClear}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-dark-950 hover:bg-dark-850 border border-dark-800 text-stone-400 hover:text-red-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Reset to Local Mode</span>
              </button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-dark-950 hover:bg-dark-850 border border-dark-800 text-stone-400 hover:text-stone-200 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-dark-950 font-bold text-xs shadow-glow-amber transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Save & Connect</span>
                </button>
              </div>
            </div>
          </form>

          {/* 3-Step Setup Quick Guide */}
          <div className="p-4 rounded-2xl bg-dark-950 border border-dark-800 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>3-Step Supabase Setup Guide</span>
              </h4>
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-stone-400 hover:text-ivory-100 flex items-center gap-1 underline"
              >
                <span>Open Supabase</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <ol className="text-xs text-stone-300 space-y-2.5 list-decimal list-inside leading-relaxed">
              <li>
                <strong className="text-ivory-100">Create a free Supabase project</strong> at{' '}
                <span className="font-mono text-amber-400">supabase.com</span>.
              </li>
              <li>
                <strong className="text-ivory-100">Run SQL Schema:</strong> Click the{' '}
                <button
                  type="button"
                  onClick={handleCopySchema}
                  className="text-amber-400 underline font-semibold mx-1"
                >
                  Copy SQL Schema
                </button>{' '}
                button above, open Supabase <em>SQL Editor</em>, paste, and click <strong>Run</strong>.
              </li>
              <li>
                <strong className="text-ivory-100">Paste Credentials:</strong> Go to{' '}
                <em>Project Settings &gt; API</em>, copy your <strong>Project URL</strong> and{' '}
                <strong>anon public key</strong>, paste into the form above, and click{' '}
                <strong>Save & Connect</strong>!
              </li>
            </ol>
          </div>

        </div>
      </div>
    </div>
  );
};
