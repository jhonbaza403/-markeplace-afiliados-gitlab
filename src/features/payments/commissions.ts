export interface CommissionConfig {
  basePercentage: number; // Por ejemplo, 5%
  premiumPercentage: number; // Por ejemplo, 2% para vendedores Premium
}

export const DEFAULT_COMMISSION_CONFIG: CommissionConfig = {
  basePercentage: 0.05,
  premiumPercentage: 0.02,
};

export function calculateCommission(
  saleAmount: number,
  isSellerPremium: boolean = false
): { commission: number; sellerEarnings: number } {
  const rate = isSellerPremium
    ? DEFAULT_COMMISSION_CONFIG.premiumPercentage
    : DEFAULT_COMMISSION_CONFIG.basePercentage;

  const commission = saleAmount * rate;
  const sellerEarnings = saleAmount - commission;

  return {
    commission: Number(commission.toFixed(2)),
    sellerEarnings: Number(sellerEarnings.toFixed(2)),
  };
}