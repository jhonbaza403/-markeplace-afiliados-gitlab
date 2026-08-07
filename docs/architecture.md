# Arquitectura del Sistema - Credi Marketplace

## 1. Visión General
Credi Marketplace es una plataforma modular desarrollada con Next.js 15 (App Router), TypeScript y Tailwind CSS, respaldada por Supabase/PostgreSQL y Prisma ORM para la gestión de datos transaccionales, tiendas múltiples, servicios profesionales y empleos.

## 2. Estructura de Capas
- **`app/`**: Enrutamiento basado en vistas y endpoints de API bajo el App Router de Next.js.
- **`features/`**: Módulos desacoplados de lógica de negocio (marketplace, auth, pagos, chat, etc.).
- **`components/`**: Componentes globales reutilizables de interfaz de usuario.
- **`lib/`**: Conexiones externas, clientes de base de datos y utilidades globales.

## 3. Seguridad y Control de Acceso
- **Middleware (`middleware.ts`)**: Encargado de interceptar peticiones en rutas protegidas (`/dashboard/*`, `/checkout/*`) y validar las sesiones de usuario basadas en roles (`customer`, `vendor`, `admin`).