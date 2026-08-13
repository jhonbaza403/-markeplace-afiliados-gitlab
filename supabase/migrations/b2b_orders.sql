-- ==========================================================
-- ARCHIVO: supabase/migrations/b2b_orders.sql
-- Tabla y Políticas para Órdenes Mayoristas B2B en Supabase
-- ==========================================================

-- 1. Crear tipos enumerados de forma segura (si no existen)
DO $$ BEGIN
    CREATE TYPE b2b_order_status AS ENUM ('pending', 'verifying', 'completed', 'cancelled');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
    CREATE TYPE b2b_payment_method AS ENUM ('binance_pay', 'usdt_trc20', 'bank_transfer');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 2. Crear tabla de órdenes B2B
CREATE TABLE IF NOT EXISTS public.b2b_orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id TEXT NOT NULL,
  product_title TEXT NOT NULL,
  supplier_id TEXT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price_usd NUMERIC(10, 2) NOT NULL CHECK (unit_price_usd > 0),
  total_usd NUMERIC(10, 2) NOT NULL CHECK (total_usd > 0),
  payment_method b2b_payment_method NOT NULL,
  binance_tx_id TEXT,
  status b2b_order_status DEFAULT 'verifying'::b2b_order_status NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Trigger para actualizar automáticamente 'updated_at'
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_b2b_orders_updated_at ON public.b2b_orders;
CREATE TRIGGER set_b2b_orders_updated_at
  BEFORE UPDATE ON public.b2b_orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4. Habilitar Row Level Security (RLS)
ALTER TABLE public.b2b_orders ENABLE ROW LEVEL SECURITY;

-- 5. Función auxiliar de verificación Admin (evita recursión RLS)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Políticas de acceso (RLS)

-- SELECT: Comprador, Vendedor/Proveedor o Admin ven la orden
DROP POLICY IF EXISTS "Usuarios ven sus propias órdenes B2B" ON public.b2b_orders;
CREATE POLICY "Usuarios ven sus propias órdenes B2B"
  ON public.b2b_orders FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id 
    OR auth.uid()::text = supplier_id 
    OR public.is_admin()
  );

-- INSERT: Usuarios autenticados registran sus órdenes
DROP POLICY IF EXISTS "Usuarios pueden registrar sus órdenes B2B" ON public.b2b_orders;
CREATE POLICY "Usuarios pueden registrar sus órdenes B2B"
  ON public.b2b_orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- UPDATE: Compradores (si está pendiente), Proveedores o Admin actualizan el estado
DROP POLICY IF EXISTS "Actualización de órdenes B2B" ON public.b2b_orders;
CREATE POLICY "Actualización de órdenes B2B"
  ON public.b2b_orders FOR UPDATE
  TO authenticated
  USING (
    (auth.uid() = user_id AND status IN ('pending', 'verifying'))
    OR auth.uid()::text = supplier_id
    OR public.is_admin()
  )
  WITH CHECK (
    auth.uid() = user_id 
    OR auth.uid()::text = supplier_id 
    OR public.is_admin()
  );

-- 7. Índices de rendimiento
CREATE INDEX IF NOT EXISTS idx_b2b_orders_user_id ON public.b2b_orders(user_id);
CREATE INDEX IF NOT EXISTS idx_b2b_orders_supplier_id ON public.b2b_orders(supplier_id);
CREATE INDEX IF NOT EXISTS idx_b2b_orders_status ON public.b2b_orders(status);
CREATE INDEX IF NOT EXISTS idx_b2b_orders_created_at ON public.b2b_orders(created_at DESC);

-- 8. Otorgar permisos al rol autenticado
GRANT SELECT, INSERT, UPDATE ON public.b2b_orders TO authenticated;