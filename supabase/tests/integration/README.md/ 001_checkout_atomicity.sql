from pathlib import Path

base = Path("/mnt/data/integration")
base.mkdir(parents=True, exist_ok=True)

readme = """# Integration Tests — Checkout

Suite de pruebas de integración para validar las propiedades críticas del checkout de Credi Marketplace.

## 001 — Checkout Atomicity

`001_checkout_atomicity.sql` verifica que un checkout multi-producto sea atómico:

- todos los productos se procesan correctamente o ninguno;
- el inventario no queda parcialmente descontado;
- no queda una orden huérfana;
- no quedan `order_items` parciales;
- un fallo de stock provoca rollback;
- la operación depende de la RPC transaccional `create_pending_order_batch`.

## Requisitos

Las migraciones de Supabase deben estar aplicadas antes de ejecutar la prueba, especialmente:

- `003_orders.sql`
- `004_order_items.sql`
- `005_inventory.sql`
- `006_idempotency.sql`
- `010_order_state_machine.sql`
- `011_functions.sql`
- `012_create_pending_order_batch.sql`

La prueba debe ejecutarse contra una base de datos aislada de pruebas.

## Principio

El cliente nunca constituye la fuente de verdad para precios, stock, totales o estado financiero. La transacción PostgreSQL debe ser la autoridad final.

No ejecutar esta prueba directamente sobre producción.
"""

atomicity = """-- ============================================================
-- Credi Marketplace
-- Integration Test 001
-- Checkout Atomicity
-- ============================================================
--
-- OBJETIVO
-- Verificar que create_pending_order_batch sea completamente
-- atómica para un checkout de múltiples productos.
--
-- GARANTÍAS ESPERADAS
--   1. Se bloquean y validan todos los productos.
--   2. El precio procede exclusivamente de PostgreSQL.
--   3. El stock se valida dentro de la transacción.
--   4. Se crean orders y order_items conjuntamente.
--   5. Una reserva parcial nunca puede sobrevivir a un fallo.
--   6. No queda inventario parcialmente modificado.
--   7. Si una línea falla, toda la operación hace rollback.
--
-- IMPORTANTE
-- Este test asume que la RPC:
--
--   public.create_pending_order_batch(
--       p_items jsonb,
--       p_affiliate_ref text
--   )
--
-- devuelve al menos order_id.
--
-- Si la firma final de la RPC utiliza nombres distintos, ajustar
-- únicamente la invocación del test; no debilitar las garantías.
-- ============================================================

begin;

do $$
declare
    v_product_a uuid;
    v_product_b uuid;

    v_stock_a numeric;
    v_stock_b numeric;

    v_orders_before bigint;
    v_orders_after bigint;

    v_items_before bigint;
    v_items_after bigint;

    v_reservations_before bigint;
    v_reservations_after bigint;

    v_order_id uuid;
begin
    -- ========================================================
    -- 1. Fixture: localizar dos productos activos con stock.
    -- ========================================================

    select
        p.id,
        p.stock
    into
        v_product_a,
        v_stock_a
    from public.products p
    where p.is_active = true
      and p.stock >= 1
    order by p.id
    limit 1;

    select
        p.id,
        p.stock
    into
        v_product_b,
        v_stock_b
    from public.products p
    where p.is_active = true
      and p.id <> v_product_a
      and p.stock >= 1
    order by p.id
    limit 1;

    if v_product_a is null or v_product_b is null then
        raise exception
            'TEST_FIXTURE_MISSING: se requieren al menos dos productos activos con stock';
    end if;

    -- ========================================================
    -- 2. Capturar invariantes antes de ejecutar el checkout.
    -- ========================================================

    select count(*)
    into v_orders_before
    from public.orders;

    select count(*)
    into v_items_before
    from public.order_items;

    if to_regclass('public.inventory_reservations') is not null then
        execute
            'select count(*) from public.inventory_reservations'
        into v_reservations_before;
    else
        v_reservations_before := 0;
    end if;

    -- ========================================================
    -- 3. Ejecutar checkout deliberadamente inválido.
    --
    -- Producto A: cantidad válida.
    -- Producto B: cantidad superior al stock.
    --
    -- Resultado obligatorio:
    --   la RPC debe fallar completamente.
    -- ========================================================

    begin

        select x.order_id
        into v_order_id
        from public.create_pending_order_batch(
            jsonb_build_array(
                jsonb_build_object(
                    'product_id', v_product_a,
                    'quantity', 1
                ),
                jsonb_build_object(
                    'product_id', v_product_b,
                    'quantity', v_stock_b + 1
                )
            ),
            null
        ) x;

        raise exception
            'TEST_FAILED: el checkout debía fallar por stock insuficiente';

    exception
        when others then
            -- Error esperado.
            null;
    end;

    -- ========================================================
    -- 4. El primer producto NO puede haber perdido stock.
    -- ========================================================

    if (
        select stock
        from public.products
        where id = v_product_a
    ) <> v_stock_a then

        raise exception
            'TEST_FAILED: el stock del primer producto fue modificado parcialmente';
    end if;

    -- ========================================================
    -- 5. El segundo producto tampoco puede haber cambiado.
    -- ========================================================

    if (
        select