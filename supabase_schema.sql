-- ==============================================================================
-- MĀRA — Modern Indian Dining (Coimbatore)
-- Supabase PostgreSQL Schema & Realtime Setup
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. ORDERS TABLE
-- ==============================================================================
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

-- ==============================================================================
-- 3. RESERVATIONS TABLE
-- ==============================================================================
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

-- ==============================================================================
-- 4. MENU ITEMS TABLE
-- ==============================================================================
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

-- ==============================================================================
-- 5. NOTIFICATIONS TABLE
-- ==============================================================================
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

-- ==============================================================================
-- 6. REALTIME REPLICATION (For instant live updates on kitchen screens)
-- ==============================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.reservations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.menu_items;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- ==============================================================================
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Allow public read & insert for orders & bookings
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
