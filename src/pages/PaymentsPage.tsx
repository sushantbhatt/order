import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllOrders } from '../services/orderService';
import { getPaymentsByOrderId } from '../services/paymentService';
import { Order, Payment } from '../types';
import { formatDateForDisplay, formatCurrency } from '../utils/helpers';
import { CreditCard, Search, Filter, X } from 'lucide-react';
import PaymentForm from '../components/PaymentForm';
import PaymentList from '../components/PaymentList';

const PaymentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<'all' | 'sale' | 'purchase'>('all');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const allOrders = await getAllOrders();
      setOrders(allOrders);
      setLoading(false);
    } catch (error) {
      console.error('Error loading orders:', error);
      setError('Failed to load orders');
      setLoading(false);
    }
  };

  const loadPayments = async (orderId: string) => {
    try {
      const orderPayments = await getPaymentsByOrderId(orderId);
      setPayments(orderPayments);
    } catch (error) {
      console.error('Error loading payments:', error);
      setError('Failed to load payments');
    }
  };

  const handleOrderSelect = (order: Order) => {
    setSelectedOrder(order);
    loadPayments(order.id);
  };

  const handlePaymentCreated = () => {
    if (selectedOrder) {
      loadPayments(selectedOrder.id);
      loadOrders(); // Refresh orders to update payment status
    }
  };

  const filteredOrders = orders.filter(order => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      order.id.toLowerCase().includes(query) ||
      (order.customer?.toLowerCase().includes(query) || false) ||
      (order.supplier?.toLowerCase().includes(query) || false);

    if (!matchesSearch) return false;
    if (typeFilter !== 'all' && order.type !== typeFilter) return false;
    if (paymentStatusFilter !== 'all' && order.paymentStatus !== paymentStatusFilter) return false;

    return true;
  });

  const calculateTotalAmount = (order: Order) => {
    return order.items.reduce((sum, item) => 
      sum + ((item.quantity + item.commission) * item.price), 0);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
        <div className="flex gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search orders..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium text-gray-700">Filters</h3>
            <button 
              onClick={() => {
                setTypeFilter('all');
                setPaymentStatusFilter('all');
              }}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >
              <X className="h-4 w-4 mr-1" />
              Clear filters
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Order Type</label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as 'all' | 'sale' | 'purchase')}
              >
                <option value="all">All Types</option>
                <option value="sale">Sales</option>
                <option value="purchase">Purchases</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Payment Status</label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={paymentStatusFilter}
                onChange={(e) => setPaymentStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="partial">Partial</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Orders</h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {filteredOrders.map((order) => {
                const totalAmount = calculateTotalAmount(order);
                return (
                  <li key={order.id}>
                    <button
                      onClick={() => handleOrderSelect(order)}
                      className={`block hover:bg-gray-50 w-full text-left p-4 ${
                        selectedOrder?.id === order.id ? 'bg-blue-50' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{order.id}</p>
                          <p className="text-sm text-gray-500">
                            {order.type === 'sale' ? order.customer : order.supplier}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {formatCurrency(totalAmount)}
                          </p>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            order.paymentStatus === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : order.paymentStatus === 'partial'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {order.paymentStatus}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-500">
                        {formatDateForDisplay(order.date)}
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div>
          {selectedOrder ? (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Record Payment</h2>
                <PaymentForm order={selectedOrder} onPaymentCreated={handlePaymentCreated} />
              </div>
              
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Payment History</h2>
                <PaymentList payments={payments} />
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No order selected</h3>
              <p className="mt-1 text-sm text-gray-500">
                Select an order from the list to view or record payments
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;