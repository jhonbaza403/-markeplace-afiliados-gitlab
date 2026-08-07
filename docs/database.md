# Esquema de Base de Datos - Credi Marketplace

## 1. Módulo de Usuarios y Roles
- **Users (Auth)**: Administrado por Supabase Auth / Prisma (id, email, password_hash, created_at).
- **Roles & Permissions**: Control de privilegios (`customer`, `vendor`, `professional`, `company`, `admin`).
- **Profiles**: Información extendida del usuario (full_name, avatar_url, phone, is_active).

## 2. Módulo de Comercio y Tiendas
- **Stores**: Datos del negocio del vendedor (vendor_id, store_name, slug, description, is_verified).
- **Categories**: Árbol de categorías de productos y servicios (name, slug, parent_id).
- **Products**: Inventario físico o digital (store_id, category_id, title, price, stock, images).
- **Orders & Order_Items**: Transacciones de compra divididas por tienda y vendedor.

## 3. Módulo de Servicios y Empleos
- **Professionals**: Perfiles profesionales especializados (abogados, médicos, técnicos, etc.).
- **Companies**: Páginas corporativas para gestión empresarial.
- **Jobs**: Ofertas de empleo publicadas por las empresas y postulaciones de candidatos.