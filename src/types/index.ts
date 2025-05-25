export type OrderType = 'sale' | 'purchase';

export type OrderStatus = 'pending' | 'partial' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  type: OrderType;
  date: string;
  customer?: string;
  supplier?: string;
  items: OrderItem[];
  totalQuantity: number;
  remainingQuantity: number;
  status: OrderStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  price: number;
  commission: number;
}

export interface Dispatch {
  id: string;
  orderId: string;
  date: string;
  quantity: number;
  dispatchPrice: number;
  invoiceNumber?: string;
  notes?: string;
  createdAt: string;
}