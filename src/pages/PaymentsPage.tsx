import React, { useEffect, useState } from 'react';
import { getAllOrders } from '../services/orderService';
import { getPaymentsByOrderId } from '../services/paymentService';
import { Order, Payment } from '../types';
import PaymentList from '../components/PaymentList';
import PaymentForm from '../components/PaymentForm';
import { formatCurrency } from '../utils/helpers';
import { CreditCard } from 'lucide-react';

const PaymentsPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getAllOrders();
        setOrders(data);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders');
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const fetchPayments = async () => {
      if (selectedOrder) {
        try {
          const paymentsData = await getPaymentsByOrderId(selectedOrder.id);
          setPayments(paymentsData);
        } catch (err) {
          console.error('Error fetching payments:', err);
          setError('Failed to load payments');
        }
      } else {
        setPayments([]);
      }
    };

    fetchPayments();
  }, [selectedOrder]);

  const handleOrderSelect = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const order = orders.find(o => o.id === event.target.value);
    setSelectedOrder(order || null);
  };

  const handlePaymentSuccess = async () => {
    if (!selectedOrder) return;
    
    try {
      const updatedPayments = await getPaymentsByOrderId(selectedOrder.id);
      setPayments(updatedPayments);
    } catch (err) {
      console.error('Error updating payments:', err);
      setError('Failed to update payments');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const calculateTotalAmount = (order: Order) => {
    return order.items.reduce((sum, item) => 
      sum + ((item.price + item.commission) * item.quantity), 0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Manage Payments</h1>
        <div className="flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-gray-500" />
          <span className="text-gray-600">Select an order to manage payments</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <label htmlFor="order-select" className="block text-sm font-medium text-gray-700 mb-2">
          Select Order
        </label>
        <select
          id="order-select"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          value={selectedOrder?.id || ''}
          onChange={handleOrderSelect}
        >
          <option value="">Choose an order...</option>
          {orders.map(order => (
            <option key={order.id} value={order.id}>
              {order.id} - {order.type === 'sale' ? order.customer : order.supplier} 
              ({formatCurrency(calculateTotalAmount(order))})
            </option>
          ))}
        </select>
      </div>

      {selectedOrder && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Order Details</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Order ID</span>
                  <span className="font-medium">{selectedOrder.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    {selectedOrder.type === 'sale' ? 'Customer' : 'Supplier'}
                  </span>
                  <span className="font-medium">
                    {selectedOrder.type === 'sale' ? selectedOrder.customer : selectedOrder.supplier}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Amount</span>
                  <span className="font-medium">
                    {formatCurrency(calculateTotalAmount(selectedOrder))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment Status</span>
                  <span className={`font-medium capitalize ${
                    selectedOrder.paymentStatus === 'completed' 
                      ? 'text-green-600' 
                      : selectedOrder.paymentStatus === 'partial' 
                      ? 'text-amber-600' 
                      : 'text-red-600'
                  }`}>
                    {selectedOrder.paymentStatus}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4">Payment History</h2>
              <PaymentList payments={payments} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Record Payment</h2>
            <PaymentForm 
              orderId={selectedOrder.id} 
              onSuccess={handlePaymentSuccess}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentsPage;