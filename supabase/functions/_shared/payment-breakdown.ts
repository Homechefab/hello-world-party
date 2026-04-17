export type PaymentBreakdown = {
  totalAmount: number;
  basePrice: number;
  serviceFee: number;
  sellerCommission: number;
  platformFee: number;
  chefEarnings: number;
};

const SERVICE_FEE_RATE = 0.06;
const SELLER_COMMISSION_RATE = 0.19;

export const calculatePaymentBreakdown = (totalAmount: number): PaymentBreakdown => {
  const basePrice = totalAmount / (1 + SERVICE_FEE_RATE);
  const serviceFee = totalAmount - basePrice;
  const sellerCommission = basePrice * SELLER_COMMISSION_RATE;
  const platformFee = serviceFee + sellerCommission;
  const chefEarnings = basePrice - sellerCommission;

  return {
    totalAmount,
    basePrice,
    serviceFee,
    sellerCommission,
    platformFee,
    chefEarnings,
  };
};
