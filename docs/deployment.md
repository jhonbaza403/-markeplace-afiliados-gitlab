# Guía de Despliegue (Deployment)

El despliegue recomendado para esta aplicación es **Vercel** debido a su integración nativa con Next.js y variables de entorno seguras.

## Pasos para Desplegar:
1. Conecta tu repositorio de GitLab a Vercel.
2. Configura las siguientes variables de entorno en el panel de Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `DATABASE_URL` (Conexión directa a PostgreSQL / Supabase)
3. Asegúrate de que el comando de compilación incluya la generación del cliente Prisma:
   ```json
   "build": "prisma generate && next build"