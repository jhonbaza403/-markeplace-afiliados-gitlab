# Credi Marketplace — Database Test Suite

Suite de pruebas de integridad, seguridad, concurrencia y lógica
transaccional de la plataforma Credi Marketplace.

## Arquitectura probada

La suite cubre:

- esquema PostgreSQL;
- órdenes;
- checkout;
- inventario;
- concurrencia;
- idempotencia;
- afiliados;
- comisiones;
- pagos;
- webhooks;
- máquina de estados;
- RLS;
- seguridad;
- auditoría.

## Requisitos

Antes de ejecutar la suite deben estar aplicadas todas las migraciones:

```text
001_extensions.sql
002_core_schema.sql
003_orders.sql
004_order_items.sql
005_inventory.sql
006_idempotency.sql
007_affiliates.sql
008_payments.sql
009_webhooks.sql
010_order_state_machine.sql
011_functions.sql
012_create_pending_order_batch.sql
013_rls.sql
014_indexes.sql
015_triggers.sql
016_audit.sql
017_security.sql
018_cart.sql
019_b2b.sql
020_affiliate_tracking.sql
021_notifications.sql
022_jobs.sql
023_services.sql