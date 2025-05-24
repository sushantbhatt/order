import { supabase } from '../lib/supabase';

export const getDashboardStats = async (filters: {
  month?: string;
  supplier?: string;
  customer?: string;
  orderId?: string;
}) => {
  let query = supabase
    .from('orders')
    .select(`
      *,
      items:order_items(*),
      dispatches:dispatches(*)
    `);

  // Apply filters
  if (filters.month) {
    const startDate = new Date(filters.month);
    const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
    query = query.gte('date', startDate.toISOString().split('T')[0])
                 .lte('date', endDate.toISOString().split('T')[0]);
  }
  
  if (filters.supplier) {
    query = query.ilike('supplier', `%${filters.supplier}%`);
  }
  
  if (filters.customer) {
    query = query.ilike('customer', `%${filters.customer}%`);
  }
  
  if (filters.orderId) {
    query = query.ilike('id', `%${filters.orderId}%`);
  }

  const { data: orders, error } = await query;

  if (error) throw error;

  const stats = {
    totalSalesAmount: orders
      ?.filter(order => order.type === 'sale')
      .reduce((sum, order) => {
        const orderTotal = order.items.reduce((itemSum, item) => 
          itemSum + (item.price * item.quantity) + item.commission, 0);
        return sum + orderTotal;
      }, 0) || 0,
    totalPurchaseAmount: orders
      ?.filter(order => order.type === 'purchase')
      .reduce((sum, order) => {
        const orderTotal = order.items.reduce((itemSum, item) => 
          itemSum + (item.price * item.quantity) + item.commission, 0);
        return sum + orderTotal;
      }, 0) || 0,
    totalQuantityOrdered: orders?.reduce((sum, order) => sum + order.total_quantity, 0) || 0,
    quantityDispatched: orders?.reduce((sum, order) => sum + (order.total_quantity - order.remaining_quantity), 0) || 0,
    quantityLeft: orders?.reduce((sum, order) => sum + order.remaining_quantity, 0) || 0
  };

  return stats;
};