# Esquema de Base de Datos — Credi Marketplace

**Arquitectura objetivo:** Next.js 16.3 · React 19.2 · React Compiler · Node.js 24 · Supabase PostgreSQL · Supabase Auth

---

## 1. Arquitectura de datos

Credi Marketplace utiliza **PostgreSQL administrado por Supabase** como fuente principal de verdad para los datos transaccionales, comerciales y de seguridad.

La autenticación se gestiona mediante **Supabase Auth**.

La aplicación **no utiliza `password_hash` dentro de la tabla pública de usuarios**. Las credenciales son responsabilidad exclusiva de Supabase Auth.

La arquitectura se divide conceptualmente en:

1. Identidad y autenticación.
2. Perfiles y roles.
3. Comercios y vendedores.
4. Catálogo y categorías.
5. Inventario.
6. Carrito.
7. Órdenes.
8. Pagos.
9. Afiliados y referencias.
10. Servicios profesionales.
11. Empresas y empleos.
12. Auditoría.
13. B2B y comercio mayorista.

---

# 2. Identidad, autenticación y perfiles

## 2.1 `auth.users`

Tabla administrada exclusivamente por Supabase Auth.

Contiene la identidad técnica del usuario:

* `id`
* `email`
* `encrypted_password`
* `created_at`
* `updated_at`
* `last_sign_in_at`
* metadatos de autenticación

### Regla fundamental

La aplicación nunca debe crear, modificar ni almacenar manualmente contraseñas en una tabla pública.

La relación con el perfil público se realiza mediante:

```text
auth.users.id
        ↓
profiles.id
```

---

# 3. `profiles`

Información pública y operativa asociada al usuario autenticado.

Campos recomendados:

```text
id                UUID PRIMARY KEY
email             TEXT
full_name         TEXT
avatar_url        TEXT
phone             TEXT
role              TEXT
is_active         BOOLEAN
created_at        TIMESTAMPTZ
updated_at        TIMESTAMPTZ
```

## Roles

Los roles iniciales pueden comprender:

```text
customer
vendor
professional
company
admin
```

### Seguridad

El campo `role` no debe considerarse una autorización suficiente por sí mismo.

Las operaciones privilegiadas deben estar protegidas mediante:

* Row Level Security.
* políticas PostgreSQL.
* funciones `SECURITY DEFINER` cuando corresponda.
* validaciones server-side.
* control de permisos.

Nunca se debe confiar en:

```text
role enviado por el navegador
```

para conceder privilegios administrativos.

---

# 4. Comercios

## 4.1 `stores`

Representa las tiendas o comercios registrados dentro del Marketplace.

Campos:

```text
id                UUID PRIMARY KEY
vendor_id         UUID REFERENCES profiles(id)
store_name        TEXT
slug              TEXT UNIQUE
description       TEXT
logo_url          TEXT
is_verified       BOOLEAN
is_active         BOOLEAN
created_at        TIMESTAMPTZ
updated_at        TIMESTAMPTZ
```

Relación:

```text
profiles
   │
   └── stores
          │
          └── products
```

Un vendedor puede administrar una o varias tiendas dependiendo de las reglas comerciales de la plataforma.

---

# 5. Categorías

## 5.1 `categories`

Sistema jerárquico de clasificación.

Campos:

```text
id                UUID PRIMARY KEY
name              TEXT
slug              TEXT UNIQUE
description       TEXT
parent_id         UUID REFERENCES categories(id)
is_active         BOOLEAN
created_at        TIMESTAMPTZ
updated_at        TIMESTAMPTZ
```

La columna `parent_id` permite construir árboles:

```text
Electrónica
├── Computación
│   ├── Laptops
│   └── Accesorios
├── Telefonía
└── Audio
```

---

# 6. Productos

## 6.1 `products`

Es una de las entidades centrales del Marketplace.

Campos mínimos:

```text
id                UUID PRIMARY KEY
store_id          UUID REFERENCES stores(id)
category_id       UUID REFERENCES categories(id)
title             TEXT
slug              TEXT
description       TEXT
price             NUMERIC(12,2)
stock             INTEGER
images            JSONB
is_active         BOOLEAN
created_at        TIMESTAMPTZ
updated_at        TIMESTAMPTZ
```

## Reglas de integridad

### Precio

`price` debe ser:

```text
>= 0
```

### Inventario

`stock` debe ser:

```text
>= 0
```

### Estado

Un producto solamente puede venderse cuando:

```text
is_active = true
AND stock > 0
```

Sin embargo, esta condición debe comprobarse nuevamente en el servidor y dentro de la transacción que crea la orden.

---

# 7. Inventario

Cuando el sistema alcance una escala elevada, se recomienda separar el inventario actual de su historial.

## 7.1 `inventory_movements`

Registra cada movimiento:

```text
id
product_id
quantity
movement_type
reference_type
reference_id
created_by
created_at
```

Tipos posibles:

```text
purchase
reservation
release
restock
adjustment
return
cancellation
```

Esto permite reconstruir históricamente el inventario.

Ejemplo:

```text
Stock inicial       +100
Reserva de orden     -5
Cancelación          +5
Nueva compra         -3
Reabastecimiento    +50
```

El historial de inventario nunca debería depender únicamente del valor actual de `products.stock`.

---

# 8. Carrito

El carrito debe considerarse una etapa previa a la creación de una orden.

## 8.1 `carts`

```text
id
user_id
status
created_at
updated_at
```

Estados:

```text
active
converted
abandoned
```

## 8.2 `cart_items`

```text
id
cart_id
product_id
quantity
created_at
updated_at
```

### Importante

El carrito **no constituye una reserva definitiva de inventario**.

El stock debe verificarse nuevamente cuando se crea la orden.

---

# 9. Órdenes

## 9.1 `orders`

La tabla `orders` constituye el registro comercial principal de una compra.

Modelo recomendado:

```text
id
buyer_id
status
currency
total_amount
affiliate_ref
payment_status
payment_provider
payment_reference
created_at
updated_at
```

### Estados de orden

```text
pending
payment_processing
paid
processing
shipped
completed
cancelled
refunded
failed
```

### Estados de pago

Es recomendable mantener el estado de pago separado:

```text
pending
processing
paid
failed
refunded
partially_refunded
```

Esto evita mezclar:

```text
estado comercial
```

con:

```text
estado financiero
```

---

# 10. Elementos de la orden

## 10.1 `order_items`

Una orden puede contener uno o varios productos.

Campos:

```text
id
order_id
product_id
store_id
product_title
unit_price
quantity
subtotal
created_at
```

### Regla crítica

`unit_price` representa el precio capturado en el momento de la compra.

No debe depender posteriormente de:

```text
products.price
```

porque el precio del producto puede cambiar después de la compra.

Ejemplo:

```text
Producto actual:       $150
Precio histórico:      $125
Cantidad:                 2

Subtotal histórico:   $250
```

La orden debe conservar `$125`, aunque el producto posteriormente cueste `$150`.

---

# 11. Creación segura de órdenes

La creación de una orden debe realizarse preferentemente mediante una función PostgreSQL transaccional:

```text
create_pending_order(...)
```

La función debe:

1. Bloquear el producto mediante `FOR UPDATE`.
2. Verificar que el producto continúa activo.
3. Verificar el stock disponible.
4. Obtener el precio directamente desde PostgreSQL.
5. Validar la cantidad.
6. Validar la referencia de afiliado.
7. Calcular el subtotal.
8. Calcular el total.
9. Crear la orden.
10. Crear sus `order_items`.
11. Reservar o descontar el inventario.
12. Registrar el movimiento de inventario.
13. Confirmar toda la operación como una única transacción.

Conceptualmente:

```text
Cliente
   ↓
POST /api/orders
   ↓
Supabase Auth
   ↓
PostgreSQL RPC
   ↓
FOR UPDATE
   ↓
Validación
   ↓
Precio real
   ↓
Stock real
   ↓
Orden
   ↓
Order Items
   ↓
Inventario
```

Esto evita condiciones de carrera entre compradores simultáneos.

---

# 12. Regla de oro del precio

Nunca debe utilizarse como fuente de verdad:

```text
price enviado por el navegador
```

Ni:

```text
total enviado por el navegador
```

El navegador solamente puede solicitar:

```text
product_id
quantity
affiliate_ref
```

El servidor determina:

```text
precio
subtotal
comisiones
total
stock
```

---

# 13. Afiliados

## 13.1 `affiliate_profiles`

Permite identificar usuarios afiliados.

Campos:

```text
id
user_id
affiliate_code
is_active
commission_rate
created_at
updated_at
```

`affiliate_code` debe poseer un índice `UNIQUE`.

Ejemplo:

```text
JOHN10
BAZA2026
CREDI25
```

---

# 14. Referencias de afiliación

Una orden puede conservar la referencia utilizada durante la adquisición:

```text
orders.affiliate_ref
```

La referencia debe validarse antes de asociarla definitivamente.

No debe ser suficiente que el cliente envíe:

```json
{
  "affiliate_ref": "CODIGO-INVENTADO"
}
```

La base de datos debe comprobar su existencia y vigencia.

---

# 15. Comisiones

Para una arquitectura financiera profesional se recomienda separar las comisiones de las órdenes.

## 15.1 `commissions`

Campos:

```text
id
order_id
affiliate_id
seller_id
commission_type
rate
amount
currency
status
created_at
paid_at
```

Tipos:

```text
affiliate
platform
seller
referral
```

Estados:

```text
pending
approved
paid
cancelled
reversed
```

---

# 16. Pagos

El sistema debe separar una orden de su transacción financiera.

## 16.1 `payments`

Campos:

```text
id
order_id
provider
provider_payment_id
amount
currency
status
payment_method
metadata
created_at
updated_at
```

Proveedores posibles:

```text
stripe
binance_pay
paypal
mercado_pago
manual
other
```

Estados:

```text
pending
processing
succeeded
failed
cancelled
refunded
```

### Regla crítica

El frontend nunca debe ejecutar:

```text
UPDATE orders
SET status = 'completed'
```

El cambio a `paid` o `completed` debe originarse en un proceso server-side autorizado.

Cuando el proveedor disponga de webhooks, estos deben ser la fuente de confirmación del pago.

---

# 17. Idempotencia financiera

Las operaciones críticas de pago deben admitir claves de idempotencia.

Se recomienda una entidad o campo como:

```text
idempotency_key
```

con restricción:

```text
UNIQUE
```

Esto evita crear dos pagos cuando el cliente repite accidentalmente una solicitud.

---

# 18. Auditoría

## 18.1 `audit_logs`

Toda operación administrativa o financiera relevante debe poder auditarse.

Campos:

```text
id
actor_id
action
entity_type
entity_id
old_data
new_data
ip_hash
user_agent
created_at
```

Ejemplos:

```text
PRODUCT_UPDATED
ORDER_CREATED
ORDER_CANCELLED
PAYMENT_CONFIRMED
REFUND_CREATED
USER_ROLE_CHANGED
STOCK_ADJUSTED
```

Los registros de auditoría no deben ser modificables por usuarios normales.

---

# 19. Profesionales

## 19.1 `professionals`

Perfil comercial/profesional.

Campos:

```text
id
user_id
professional_type
license_number
bio
location
is_verified
is_active
created_at
updated_at
```

Ejemplos:

```text
abogado
médico
ingeniero
contador
técnico
asesor
consultor
```

---

# 20. Empresas

## 20.1 `companies`

Campos:

```text
id
owner_id
name
slug
description
logo_url
website
industry
is_verified
is_active
created_at
updated_at
```

---

# 21. Empleos

## 21.1 `jobs`

Campos:

```text
id
company_id
title
description
location
employment_type
salary_min
salary_max
currency
is_remote
status
created_at
updated_at
```

Estados:

```text
draft
published
paused
closed
```

---

# 22. Postulaciones

## 22.1 `job_applications`

Campos:

```text
id
job_id
candidate_id
resume_url
cover_letter
status
created_at
updated_at
```

Estados:

```text
submitted
reviewing
shortlisted
interview
rejected
accepted
withdrawn
```

Debe existir una restricción para evitar postulaciones duplicadas:

```text
UNIQUE(job_id, candidate_id)
```

---

# 23. B2B

El módulo B2B debe mantenerse separado conceptualmente del Marketplace minorista.

## 23.1 `b2b_products`

Campos compatibles con el módulo actual:

```text
id
supplier_id
title
description
moq
unit_price_usdt
stock_available
category
image_url
binance_pay_id
usdt_wallet_address
is_active
created_at
updated_at
```

### Reglas

```text
moq >= 1
unit_price_usdt >= 0
stock_available >= 0
```

Nunca deben almacenarse credenciales privadas de Binance ni claves secretas en esta tabla.

Una dirección pública de recepción USDT no equivale a una credencial privada y debe tratarse igualmente con controles de seguridad apropiados.

---

# 24. Seguridad mediante Row Level Security

Las tablas sensibles deben utilizar RLS.

Especialmente:

```text
profiles
stores
products
carts
cart_items
orders
order_items
payments
commissions
affiliate_profiles
job_applications
audit_logs
```

Principio:

```text
Cliente
   ↓
RLS
   ↓
Permisos mínimos
```

La seguridad no debe depender exclusivamente del frontend.

---

# 25. Índices esenciales

Se recomienda indexar como mínimo:

```text
products(store_id)
products(category_id)
products(is_active)
products(slug)

orders(buyer_id)
orders(status)
orders(payment_status)
orders(created_at)

order_items(order_id)
order_items(product_id)

payments(order_id)
payments(provider_payment_id)

stores(vendor_id)
stores(slug)

categories(parent_id)

affiliate_profiles(affiliate_code)

jobs(company_id)
jobs(status)

job_applications(job_id)
job_applications(candidate_id)
```

Los índices deben revisarse posteriormente mediante análisis real de consultas y estadísticas PostgreSQL.

---

# 26. Integridad referencial

Las relaciones críticas deben utilizar claves foráneas.

Ejemplo:

```text
orders.buyer_id
        ↓
profiles.id
```

```text
order_items.order_id
        ↓
orders.id
```

```text
order_items.product_id
        ↓
products.id
```

```text
products.store_id
        ↓
stores.id
```

Esto evita registros huérfanos.

---

# 27. Montos monetarios

No se recomienda utilizar `float` para almacenar dinero.

Preferentemente:

```text
NUMERIC(12,2)
```

Para monedas con mayor precisión, como determinados activos digitales, puede utilizarse una escala superior:

```text
NUMERIC(20,8)
```

El frontend solamente representa el valor.

La fuente financiera definitiva siempre será PostgreSQL.

---

# 28. Principio de fuente única de verdad

Para Credi Marketplace:

```text
Frontend
   ↓
Solicitud
   ↓
API / Server Action
   ↓
Supabase
   ↓
PostgreSQL
```

Nunca:

```text
Frontend
   ↓
Precio enviado
   ↓
Total enviado
   ↓
Orden aceptada
```

La arquitectura correcta es:

```text
Frontend = interfaz

API = control de acceso y orquestación

PostgreSQL = fuente de verdad

RPC = operaciones transaccionales críticas

Supabase Auth = identidad

Webhook = confirmación financiera
```

---

# 29. Arquitectura transaccional recomendada

Una compra completa debe evolucionar así:

```text
CART
  ↓
CHECKOUT
  ↓
PENDING ORDER
  ↓
PAYMENT
  ↓
PAYMENT CONFIRMED
  ↓
PAID
  ↓
PROCESSING
  ↓
SHIPPED
  ↓
COMPLETED
```

En caso de fallo:

```text
PENDING
   ↓
FAILED
```

En caso de cancelación:

```text
PENDING
   ↓
CANCELLED
   ↓
INVENTORY RELEASED
```

En caso de devolución:

```text
COMPLETED
   ↓
REFUNDED
```

---

# 30. Regla arquitectónica definitiva

El sistema debe tratar como operaciones de alto riesgo:

* creación de órdenes;
* modificación de inventario;
* confirmación de pagos;
* reembolsos;
* comisiones;
* cambios de roles;
* operaciones administrativas;
* modificaciones de precios;
* operaciones B2B;
* movimientos financieros.

Todas estas operaciones deben ejecutarse exclusivamente mediante mecanismos server-side autorizados y, cuando involucren múltiples escrituras relacionadas, mediante transacciones PostgreSQL.

---

## Estado objetivo del modelo

La arquitectura final queda conceptualmente organizada así:

```text
                    SUPABASE AUTH
                         │
                         ▼
                      PROFILES
                    /    |     \
                   /     |      \
                  ▼      ▼       ▼
              STORES  PROFESSIONALS  COMPANIES
                │                     │
                ▼                     ▼
            PRODUCTS                JOBS
                │                     │
                ▼                     ▼
             CARTS              APPLICATIONS
                │
                ▼
              ORDERS
             /  |   \
            /   |    \
           ▼    ▼     ▼
    ORDER_ITEMS PAYMENTS COMMISSIONS
                    │
                    ▼
                 WEBHOOKS

                 B2B MODULE
                     │
                     ▼
                B2B_PRODUCTS
```

**Este esquema debe considerarse la referencia arquitectónica para las siguientes APIs, RPC, políticas RLS, páginas de checkout, carrito, marketplace, afiliados, pagos y módulo B2B.**
