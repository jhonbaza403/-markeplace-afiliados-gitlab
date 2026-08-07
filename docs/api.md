# Documentación de Rutas y Endpoints

La aplicación utiliza principalmente Server Actions de Next.js combinadas con las consultas directas de Prisma y los servicios de Supabase.

## Autenticación (`/api/auth`)
- **POST `/auth/v1/signup`** (Gestionado por Supabase): Registra un nuevo usuario en la plataforma.
- **POST `/auth/v1/token`** (Gestionado por Supabase): Inicia sesión y emite un token de sesión.

## Marketplace & Productos (`/marketplace`)
- **GET `/marketplace`**: Carga el listado general de productos activos.
- **GET `/marketplace/products/[slug]`**: Obtiene la información detallada de un producto específico mediante su slug único.