import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PaymentList from '../components/PaymentList';
import PaymentForm from '../components/PaymentForm';
import OrderList from '../components/OrderList';
import { Payment, Order } from '../types';
import { getPaymentsByOrderId } from '../services/paymentService';
import { getOrderById, getAllOrders } from '../services/orderService';
import { formatDateForDisplay, formatCurrency } from '../utils/helpers';
import { CreditCard, ArrowLeft } from 'lucide-react';

const PaymentsPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [order, setOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const allOrders = await getAllOrders();
        setOrders(allOrders);
      } catch (err) {
        console.error('Error fetching orders:', err);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }

      try {
        const [orderData, paymentsData] = await Promise.all([
          getOrderById(id),
          getPaymentsByOrderId(id)
        ]);

        if (!orderData) {
          throw new Error('Order not found');
        }

        setOrder(orderData);
        setPayments(paymentsData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handlePaymentSuccess = async () => {
    if (id) {
      const updatedPayments = await getPaymentsByOrderId(id);
      const updatedOrder = await getOrderById(id);
      setPayments(updatedPayments);
      setOrder(updatedOrder);
    }
  };

  const handleOrderSelect = (orderId: string) => {
    navigate(`/payments/${orderId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!id) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Manage Payments</h1>
        <OrderList orders={orders} onOrderSelect={handleOrderSelect} />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {error || 'Order not found'}
              </p>
              <button
                onClick={() => navigate('/payments')}
                className="mt-2 text-sm text-red-700 underline"
              >
                Return to Payments
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Calculate total order amount
  const totalOrderAmount = order.items.reduce((sum, item) => 
    sum + ((item.price + item.commission) * item.quantity), 0);

  // Calculate total paid amount
  const totalPaidAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);

  // Calculate remaining amount
  const remainingAmount = totalOrderAmount - totalPaidAmount;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate('/payments')}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Payments
        </button>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Payments for Order {order.id}</h1>
          <p className="text-gray-600 mt-1">
            {order.type === 'sale' ? 'Sales' : 'Purchase'} order • {formatDateForDisplay(order.date)}
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
          <CreditCard className="h-5 w-5 text-gray-500" />
          <span className="font-medium">Payment Status:</span>
          <span className={`capitalize ${
            order.paymentStatus === 'completed' 
              ? 'text-green-600' 
              : order.paymentStatus === 'partial' 
              ? 'text-amber-600' 
              : 'text-red-600'
          }`}>
            {order.paymentStatus}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Payment Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Order Amount</span>
                <span className="font-medium">{formatCurrency(totalOrderAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Paid Amount</span>
                <span className="font-medium text-green-600">{formatCurrency(totalPaidAmount)}</span>
              </div>
              <div className="pt-2 border-t">
                <div className="flex justify-between">
                  <span className="text-gray-600">Remaining Amount</span>
                  <span className="font-medium text-red-600">{formatCurrency(remainingAmount)}</span>
                </div>
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
            orderId={order.id} 
            onSuccess={handlePaymentSuccess}
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;