# Guía de Despliegue (Deployment) - Cloudflare Pages

Esta guía detalla el proceso para desplegar la aplicación full-stack en **Cloudflare Pages**, conectada a **Supabase** para la base de datos y autenticación.

---

## 1. Requisitos Previos
- Una cuenta activa en [Cloudflare Dashboard](https://dash.cloudflare.com/).
- El repositorio de GitLab conectado a Cloudflare Pages.
- Un proyecto configurado en [Supabase](https://supabase.com/) con sus respectivas credenciales.

---

## 2. Variables de Entorno en Cloudflare Pages
En el panel de tu proyecto en Cloudflare Pages, dirígete a **Settings > Environment variables** (tanto para producción como para preview) y añade las credenciales necesarias:

```env
NEXT_PUBLIC_SUPABASE_URL=[https://tu-proyecto.supabase.co](https://tu-proyecto.supabase.co)
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-supabase-anon-key
DATABASE_URL=postgresql://postgres:[TU-PASSWORD]@db.[TU-PROYECTO].supabase.co:5432/postgres