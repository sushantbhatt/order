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

  const salesOrders = orders?.filter(order => order.type === 'sale') || [];
  const purchaseOrders = orders?.filter(order => order.type === 'purchase') || [];

  const stats = {
    totalSalesAmount: salesOrders
      .reduce((sum, order) => {
        const orderTotal = order.items.reduce((itemSum, item) => 
          itemSum + ((item.quantity + item.commission) * item.price), 0);
        return sum + orderTotal;
      }, 0) || 0,
    totalPurchaseAmount: purchaseOrders
      .reduce((sum, order) => {
        const orderTotal = order.items.reduce((itemSum, item) => 
          itemSum + ((item.quantity + item.commission) * item.price), 0);
        return sum + orderTotal;
      }, 0) || 0,
    salesQuantity: salesOrders.reduce((sum, order) => sum + order.total_quantity, 0) || 0,
    purchaseQuantity: purchaseOrders.reduce((sum, order) => sum + order.total_quantity, 0) || 0,
    salesDispatched: salesOrders.reduce((sum, order) => 
      sum + (order.dispatches?.reduce((dSum, dispatch) => dSum + (dispatch.quantity || 0), 0) || 0), 0) || 0,
    purchaseDispatched: purchaseOrders.reduce((sum, order) => 
      sum + (order.dispatches?.reduce((dSum, dispatch) => dSum + (dispatch.quantity || 0), 0) || 0), 0) || 0,
    salesRemaining: salesOrders.reduce((sum, order) => {
      const dispatched = order.dispatches?.reduce((dSum, dispatch) => dSum + (dispatch.quantity || 0), 0) || 0;
      return sum + (order.total_quantity - dispatched);
    }, 0) || 0,
    purchaseRemaining: purchaseOrders.reduce((sum, order) => {
      const dispatched = order.dispatches?.reduce((dSum, dispatch) => dSum + (dispatch.quantity || 0), 0) || 0;
      return sum + (order.total_quantity - dispatched);
    }, 0) || 0
  };

  return stats;
};