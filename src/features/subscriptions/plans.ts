export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: 'monthly' | 'yearly';
  features: string[];
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Cuenta Gratuita',
    price: 0,
    currency: 'USD',
    interval: 'monthly',
    features: [
      'Publicar productos y servicios',
      'Comisión estándar por venta (5%)',
      'Acceso al marketplace global',
    ],
  },
  {
    id: 'premium-pro',
    name: 'Vendedor Pro',
    price: 19.99,
    currency: 'USD',
    interval: 'monthly',
    features: [
      'Comisión reducida por venta (2%)',
      'Mayor exposición en recomendaciones e IA',
      'Acceso a estadísticas y métricas avanzadas',
      'Soporte prioritario',
    ],
  },
];