# Esquema de Base de Datos - Credi Marketplace

## 1. Módulo de Usuarios y Roles
- **Users (Auth)**: Administrado por Supabase Auth / Prisma (`id`, `email`, `password_hash`, `created_at`).
- **Roles & Permissions**: Control de privilegios (`customer`, `vendor`, `professional`, `company`, `admin`).
- **Profiles**: Información extendida del usuario (`full_name`, `avatar_url`, `phone`, `is_active`).

## 2. Módulo de Comercio y Tiendas
- **Stores**: Datos del negocio del vendedor (`vendor_id`, `store_name`, `slug`, `description`, `is_verified`).
- **Categories**: Árbol de categorías de productos y servicios con soporte jerárquico (`name`, `slug`, `parent_id`).
- **Products**: Inventario físico o digital (`store_id`, `category_id`, `title`, `slug`, `description`, `price`, `stock`, `images`, `is_active`).
- **Orders & Order_Items**: Transacciones de compra divididas por tienda, ítems, cantidades y precios unitarios.

## 3. Módulo de Servicios y Empleos
- **Professionals**: Perfiles profesionales especializados (abogados, médicos, técnicos, asesores financieros, etc.).
- **Companies**: Páginas corporativas para la gestión y postulación empresarial.
- **Jobs**: Ofertas de empleo publicadas por las empresas y control de postulaciones de candidatos.