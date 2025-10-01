export interface OrderLine {
  type: 'physical' | 'digital_goods' | 'shipping_fee' | 'sales_tax' | 'discount';
  name: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;
  total_amount: number;
  total_tax_amount: number;
  total_discount_amount?: number;
}

export interface Order {
  id: string;
  user_id?: string;
  klarna_order_id: string;
  customer_email: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'cancelled' | 'refunded';
  order_lines: OrderLine[];
  created_at: string;
  updated_at: string;
}