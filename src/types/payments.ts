export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface PaymentTransaction {
  id: string;
  orderId: string;
  buyerId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  provider: 'stripe' | 'paypal' | 'credits';
  createdAt: string;
}