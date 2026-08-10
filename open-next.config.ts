"scripts": {
  "dev": "next dev",
  "build": "prisma generate && opennextjs-cloudflare build",
  "start": "next start",
  "lint": "next lint",
  "preview": "opennextjs-cloudflare build && opennextjs-cloudflare preview",
  "deploy": "opennextjs-cloudflare build && opennextjs-cloudflare deploy"
}