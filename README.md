
---

# 13. `README.md`

```md
# Credi Marketplace

Plataforma full-stack de comercio digital, marketplace, afiliados, B2B, servicios profesionales, empleos y pagos.

---

## Stack oficial

| Tecnología | Versión |
|---|---|
| Node.js | 24.x |
| Next.js | 16.3.x |
| React | 19.2.x |
| React Compiler | Integrado |
| TypeScript | 5.x |
| PostgreSQL | Supabase |
| Supabase | Actual |
| Tailwind CSS | 4.x |

### Regla fundamental

**Node.js 24 es la única versión oficial.**

No utilizar Node.js 20 para este proyecto.

---

## Arquitectura

```text
                    CREDI MARKETPLACE
                           │
              ┌────────────┴────────────┐
              │                         │
          Next.js 16.3             React 19.2
              │                         │
              └────────────┬────────────┘
                           │
                    App Router
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
      Pages             Server            APIs
        │              Components        Route Handlers
        │                  │                  │
        └──────────────────┼──────────────────┘
                           │
                      Supabase
                           │
                  ┌────────┴────────┐
                  │                 │
              PostgreSQL          Auth
                  │
       ┌──────────┼───────────┐
       │          │           │
     Orders    Payments    Affiliates
       │          │           │
       └──────────┼───────────┘
                  │
             Transactions
                  │
             RPC PostgreSQL