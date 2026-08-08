import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  /* 
   * Nota: La configuración por defecto `{}` ya incluye el empaquetado optimizado 
   * para Next.js 15 + React 19 en Cloudflare Workers.
   *
   * Si en el futuro utilizas ISR (Incremental Static Regeneration) o revalidación
   * de datos con `revalidateTag` / `revalidatePath`, puedes descomentar el bloque de abajo
   * para usar un Namespace KV de Cloudflare como caché incremental.
   */

  /*
  incrementalCache: async () => {
    const { createKVIncrementalCache } = await import("@opennextjs/cloudflare/kv-cache");
    return createKVIncrementalCache({
      binding: "NEXT_CACHE_WORKERS_KV", // Nombre de la vinculación KV en wrangler.jsonc
    });
  },
  */
});