-- ==========================================================
-- CREDI MARKETPLACE
-- MIGRATION: B2B ORDERS
--
-- Next.js 16.3
-- React 19
-- Node.js 24
-- Supabase / PostgreSQL
--
-- Órdenes mayoristas B2B
-- RLS + RBAC + integridad transaccional
-- ==========================================================

BEGIN;

-- ==========================================================
-- 1. EXTENSIONES
-- ==========================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;


-- ==========================================================
-- 2. ENUMS
-- ==========================================================

DO $$
BEGIN
  CREATE TYPE public.b2b_order_status AS ENUM (
    'pending',
    'verifying',
    'completed',
    'cancelled'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;


DO $$
BEGIN
  CREATE TYPE public.b2b_payment_method AS ENUM (
    'binance_pay',
    'usdt_trc20',
    'bank_transfer'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END
$$;


-- ==========================================================
-- 3. TABLA PRINCIPAL
-- ==========================================================

CREATE TABLE IF NOT EXISTS public.b2b_orders (

  -- --------------------------------------------------------
  -- Identidad
  -- --------------------------------------------------------

  id UUID
    PRIMARY KEY
    DEFAULT gen_random_uuid(),

  -- Usuario comprador
  user_id UUID
    NOT NULL
    REFERENCES auth.users(id)
    ON DELETE RESTRICT,

  -- Proveedor / vendedor.
  --
  -- Se mantiene UUID porque el proveedor debe corresponder
  -- a una identidad de Supabase Auth.
  supplier_id UUID
    REFERENCES auth.users(id)
    ON DELETE SET NULL,


  -- --------------------------------------------------------
  -- Producto
  -- --------------------------------------------------------

  product_id TEXT
    NOT NULL
    CHECK (length(trim(product_id)) > 0),

  product_title TEXT
    NOT NULL
    CHECK (length(trim(product_title)) > 0),


  -- --------------------------------------------------------
  -- Cantidades / precios
  -- --------------------------------------------------------

  quantity INTEGER
    NOT NULL
    CHECK (quantity > 0),

  unit_price_usd NUMERIC(12, 2)
    NOT NULL
    CHECK (unit_price_usd > 0),

  total_usd NUMERIC(14, 2)
    NOT NULL
    CHECK (total_usd > 0),

  /*
   * Integridad matemática:
   *
   * total = quantity × unit_price
   *
   * ROUND se utiliza para mantener la semántica monetaria
   * a dos decimales.
   */
  CONSTRAINT b2b_orders_total_integrity
    CHECK (
      total_usd =
      ROUND(quantity::NUMERIC * unit_price_usd, 2)
    ),


  -- --------------------------------------------------------
  -- Pago
  -- --------------------------------------------------------

  payment_method public.b2b_payment_method
    NOT NULL,

  binance_tx_id TEXT,

  /*
   * El identificador de transacción debe existir únicamente
   * cuando se utilice Binance Pay.
   *
   * No hacemos obligatorio el valor aquí porque la orden
   * puede encontrarse inicialmente en estado pending/verifying.
   */
  CONSTRAINT b2b_orders_binance_tx_check
    CHECK (
      payment_method <> 'binance_pay'
      OR binance_tx_id IS NULL
      OR length(trim(binance_tx_id)) > 0
    ),


  -- --------------------------------------------------------
  -- Estado
  -- --------------------------------------------------------

  status public.b2b_order_status
    NOT NULL
    DEFAULT 'pending',


  -- --------------------------------------------------------
  -- Auditoría temporal
  -- --------------------------------------------------------

  created_at TIMESTAMPTZ
    NOT NULL
    DEFAULT now(),

  updated_at TIMESTAMPTZ
    NOT NULL
    DEFAULT now()

);


-- ==========================================================
-- 4. ÍNDICES
-- ==========================================================

CREATE INDEX IF NOT EXISTS idx_b2b_orders_user_id
  ON public.b2b_orders (user_id);

CREATE INDEX IF NOT EXISTS idx_b2b_orders_supplier_id
  ON public.b2b_orders (supplier_id);

CREATE INDEX IF NOT EXISTS idx_b2b_orders_status
  ON public.b2b_orders (status);

CREATE INDEX IF NOT EXISTS idx_b2b_orders_created_at
  ON public.b2b_orders (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_b2b_orders_user_created
  ON public.b2b_orders (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_b2b_orders_supplier_created
  ON public.b2b_orders (supplier_id, created_at DESC);


-- ==========================================================
-- 5. FUNCIÓN updated_at
-- ==========================================================

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


-- ==========================================================
-- 6. TRIGGER updated_at
-- ==========================================================

DROP TRIGGER IF EXISTS set_b2b_orders_updated_at
ON public.b2b_orders;

CREATE TRIGGER set_b2b_orders_updated_at
BEFORE UPDATE ON public.b2b_orders
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();


-- ==========================================================
-- 7. FUNCIÓN RBAC — ADMIN
-- ==========================================================
--
-- IMPORTANTE:
--
-- Esta función consulta profiles sin quedar atrapada por
-- una política RLS recursiva.
--
-- SECURITY DEFINER exige search_path seguro.
-- ==========================================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE public.profiles.id = (select auth.uid())
      AND public.profiles.role = 'admin'
  );
$$;


-- ==========================================================
-- 8. PROTECCIÓN DE LA FUNCIÓN ADMIN
-- ==========================================================

REVOKE EXECUTE
ON FUNCTION public.is_admin()
FROM PUBLIC;

GRANT EXECUTE
ON FUNCTION public.is_admin()
TO authenticated;


-- ==========================================================
-- 9. ROW LEVEL SECURITY
-- ==========================================================

ALTER TABLE public.b2b_orders
ENABLE ROW LEVEL SECURITY;


-- ==========================================================
-- 10. SELECT
-- ==========================================================

DROP POLICY IF EXISTS
  "b2b_orders_select"
ON public.b2b_orders;

CREATE POLICY "b2b_orders_select"
ON public.b2b_orders
FOR SELECT
TO authenticated
USING (

  (select auth.uid()) = user_id

  OR

  (select auth.uid()) = supplier_id

  OR

  (select public.is_admin())

);


-- ==========================================================
-- 11. INSERT
-- ==========================================================
--
-- El comprador puede crear únicamente una orden cuyo
-- user_id sea su propio UUID.
--
-- Además:
-- - status debe comenzar en pending
-- - total debe respetar el CHECK matemático
--
-- ==========================================================

DROP POLICY IF EXISTS
  "b2b_orders_insert"
ON public.b2b_orders;

CREATE POLICY "b2b_orders_insert"
ON public.b2b_orders
FOR INSERT
TO authenticated
WITH CHECK (

  (select auth.uid()) = user_id

  AND

  status = 'pending'

);


-- ==========================================================
-- 12. UPDATE
-- ==========================================================
--
-- MUY IMPORTANTE:
--
-- No permitimos que el comprador pueda modificar
-- arbitrariamente precio, cantidad, producto o proveedor.
--
-- El comprador solamente puede actualizar determinados
-- campos operativos mientras la orden está pending/verifying.
--
-- PostgreSQL RLS controla FILAS, pero no restringe columnas.
-- Por eso las modificaciones sensibles deberán realizarse
-- posteriormente mediante funciones RPC controladas o desde
-- servidor.
--
-- Para esta primera migración:
--
-- - comprador: puede modificar la orden mientras está activa
-- - proveedor: puede modificar mientras tenga asignación
-- - admin: acceso completo
--
-- La protección de columnas sensibles se reforzará mediante
-- RPC/Server Actions en la capa de aplicación.
--
-- ==========================================================

DROP POLICY IF EXISTS
  "b2b_orders_update"
ON public.b2b_orders;

CREATE POLICY "b2b_orders_update"
ON public.b2b_orders
FOR UPDATE
TO authenticated
USING (

  (
    (select auth.uid()) = user_id
    AND status IN ('pending', 'verifying')
  )

  OR

  (
    (select auth.uid()) = supplier_id
  )

  OR

  (
    (select public.is_admin())
  )

)
WITH CHECK (

  (
    (select auth.uid()) = user_id
    AND status IN ('pending', 'verifying')
  )

  OR

  (
    (select auth.uid()) = supplier_id
  )

  OR

  (
    (select public.is_admin())
  )

);


-- ==========================================================
-- 13. DELETE
-- ==========================================================
--
-- Las órdenes B2B son registros financieros/auditables.
--
-- No permitimos DELETE desde el cliente.
--
-- Si posteriormente necesitamos eliminación administrativa,
-- se hará mediante una función de servidor/controlada.
-- ==========================================================

DROP POLICY IF EXISTS
  "b2b_orders_delete"
ON public.b2b_orders;


-- ==========================================================
-- 14. PERMISOS DATA API
-- ==========================================================

REVOKE ALL
ON public.b2b_orders
FROM anon;

GRANT SELECT, INSERT, UPDATE
ON public.b2b_orders
TO authenticated;


-- ==========================================================
-- 15. COMENTARIOS
-- ==========================================================

COMMENT ON TABLE public.b2b_orders IS
'Órdenes mayoristas B2B de Credi Marketplace.';

COMMENT ON COLUMN public.b2b_orders.user_id IS
'UUID del usuario comprador en auth.users.';

COMMENT ON COLUMN public.b2b_orders.supplier_id IS
'UUID del proveedor/vendedor en auth.users.';

COMMENT ON COLUMN public.b2b_orders.unit_price_usd IS
'Precio unitario expresado en USD.';

COMMENT ON COLUMN public.b2b_orders.total_usd IS
'Total de la orden. Debe coincidir con quantity × unit_price_usd.';

COMMENT ON COLUMN public.b2b_orders.status IS
'Estado operacional de la orden B2B.';


-- ==========================================================
-- 16. COMMIT
-- ==========================================================

COMMIT;