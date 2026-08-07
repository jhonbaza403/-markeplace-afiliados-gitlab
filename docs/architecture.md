# Arquitectura del Sistema - Credi Marketplace & Afiliados

## 1. Visión General del Sistema
La plataforma está construida utilizando una arquitectura moderna y escalable basada en los siguientes componentes principales:
- **Framework Full-Stack (SSR/API):** [Next.js](https://nextjs.org/) con App Router para renderizado híbrido y optimización de rendimiento.
- **Base de Datos y Backend as a Service (BaaS):** PostgreSQL alojado en [Supabase](https://supabase.com/), gestionando la persistencia de datos y el motor de autenticación.
- **ORM y Migraciones:** [Prisma ORM](https://www.prisma.io/) para la definición del esquema de base de datos, tipos seguros y consultas optimizadas.
- **Seguridad y Control de Acceso:** Middleware de Next.js en conjunto con Supabase Auth (JWT y sesiones seguras en cookies).
- **Estilos y Componentes:** [Tailwind CSS](https://tailwindcss.com/) para una interfaz de usuario completamente responsiva.

---

## 2. Estructura de Directorios (`src/`)
La organización del código fuente sigue una arquitectura modular orientada a dominios de negocio:

```text
src/
├── app/                  # Rutas y páginas del App Router de Next.js
│   ├── auth/             # Páginas de inicio de sesión y registro (/auth/login)
│   ├── marketplace/      # Vistas del catálogo, buscador y detalle de productos ([slug])
│   └── layout.tsx        # Layout principal de la aplicación
├── features/             # Módulos funcionales encapsulados por dominio
│   ├── auth/             # Formularios y lógica de autenticación
│   └── marketplace/      # Componentes específicos de productos y tiendas
├── lib/                  # Configuraciones de clientes externos e inicialización
│   ├── prisma.ts         # Instancia del cliente de Prisma
│   └── supabase.ts       # Instancia del cliente de Supabase
├── types/                # Definiciones globales de tipos e interfaces de TypeScript
│   ├── user.ts           # Interfaces para perfiles, tiendas y roles
│   ├── product.ts        # Interfaces para productos, categorías y stock
│   └── order.ts          # Interfaces para órdenes, ítems y estados de transacciones
└── middleware.ts         # Control de sesiones y rutas protegidas a nivel de red