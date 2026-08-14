src/
├── app/
│   ├── (public)/
│   │   ├── page.tsx
│   │   ├── marketplace/
│   │   └── b2b/
│   │
│   ├── auth/
│   │   ├── login/
│   │   ├── register/
│   │   ├── callback/
│   │   └── forgot-password/
│   │
│   ├── cart/
│   │   └── page.tsx
│   │
│   ├── checkout/
│   │   ├── page.tsx
│   │   └── success/
│   │
│   ├── dashboard/
│   │
│   ├── api/
│   │   ├── ai/
│   │   │   └── assistant/
│   │   ├── orders/
│   │   ├── checkout/
│   │   ├── payments/
│   │   ├── affiliates/
│   │   └── webhooks/
│   │
│   ├── layout.tsx
│   └── globals.css
│
├── components/
│   ├── ui/
│   ├── marketplace/
│   ├── checkout/
│   ├── cart/
│   ├── b2b/
│   ├── auth/
│   └── dashboard/
│
├── context/
│   └── CartContext.tsx
│
├── features/
│   ├── auth/
│   ├── marketplace/
│   ├── cart/
│   ├── checkout/
│   ├── orders/
│   ├── payments/
│   ├── affiliates/
│   ├── b2b/
│   └── ai/
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   │
│   ├── auth/
│   ├── payments/
│   ├── validation/
│   ├── security/
│   ├── pricing/
│   ├── affiliates/
│   └── utils/
│
├── types/
│   ├── auth.ts
│   ├── product.ts
│   ├── cart.ts
│   ├── order.ts
│   ├── payment.ts
│   ├── affiliate.ts
│   ├── b2b.ts
│   └── database.ts
│
└── middleware.ts