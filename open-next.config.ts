/**
 * Credi Marketplace
 * OpenNext + Cloudflare
 *
 * Next.js 15
 * Arquitectura preparada para Cloudflare Workers
 */

import { defineCloudflareConfig } from "@opennextjs/cloudflare";

export default defineCloudflareConfig({
  /**
   * Configuración base de OpenNext.
   *
   * Se mantiene deliberadamente sin bindings externos
   * para evitar que el primer despliegue falle por una
   * dependencia de R2, KV o Durable Objects todavía
   * no configurada.
   */
});