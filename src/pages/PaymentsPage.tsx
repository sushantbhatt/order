import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PaymentForm from '../components/PaymentForm';
import OrderList from '../components/OrderList';
import { Payment, Order, OrderType, PaymentStatus } from '../types';
import { getPaymentsByOrderId } from '../services/paymentService';
import { getOrderById, getAllOrders } from '../services/orderService';
import { formatDateForDisplay, formatCurrency } from '../utils/helpers';
import { CreditCard, ArrowLeft, Filter, X, Search } from 'lucide-react';

const PaymentsPage: React.FC = () => {
  const { id } = useParams();
  const orderId = id ? decodeURIComponent(id) : '';
  const navigate = useNavigate();

  const [payments, setPayments] = useState<Payment[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | OrderType>('all');
  const [customerFilter, setCustomerFilter] = useState('');
  const [supplierFilter, setSupplierFilter] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [paymentStatusFilters, setPaymentStatusFilters] = useState<PaymentStatus[]>([]);

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

        setSelectedOrder(orderData);
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
    if (selectedOrder) {
      const [updatedPayments, updatedOrder, updatedOrders] = await Promise.all([
        getPaymentsByOrderId(selectedOrder.id),
        getOrderById(selectedOrder.id),
        getAllOrders()
      ]);
      
      setPayments(updatedPayments);
      setSelectedOrder(updatedOrder);
      setOrders(updatedOrders);
    }
  };

  const handleOrderSelect = async (orderId: string) => {
    try {
      const [selectedOrder, orderPayments] = await Promise.all([
        getOrderById(orderId),
        getPaymentsByOrderId(orderId)
      ]);

      if (selectedOrder) {
        setSelectedOrder(selectedOrder);
        setPayments(orderPayments);
        navigate(`/payments/${orderId}`);
      }
    } catch (err) {
      console.error('Error selecting order:', err);
      setError('Failed to load order details');
    }
  };

  const handlePaymentStatusFilterChange = (status: PaymentStatus) => {
    setPaymentStatusFilters(prev => 
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setTypeFilter('all');
    setCustomerFilter('');
    setSupplierFilter('');
    setStartDate('');
    setEndDate(new Date().toISOString().split('T')[0]);
    setPaymentStatusFilters([]);
  };

  const filteredOrders = orders.filter(order => {
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      order.id.toLowerCase().includes(query) ||
      (order.customer?.toLowerCase().includes(query) || false) ||
      (order.supplier?.toLowerCase().includes(query) || false);
    
    if (!matchesSearch) return false;
    if (typeFilter !== 'all' && order.type !== typeFilter) return false;
    if (customerFilter && (!order.customer || !order.customer.toLowerCase().includes(customerFilter.toLowerCase()))) return false;
    if (supplierFilter && (!order.supplier || !order.supplier.toLowerCase().includes(supplierFilter.toLowerCase()))) return false;
    if (startDate && order.date < startDate) return false;
    if (endDate && order.date > endDate) return false;
    if (paymentStatusFilters.length > 0 && !paymentStatusFilters.includes(order.paymentStatus)) return false;
    
    return true;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!selectedOrder) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Manage Payments</h1>
        
        <div className="space-y-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
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
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Filter className="h-5 w-5 mr-2" />
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-gray-700">Filters</h3>
                <button 
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear filters
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Order Type</label>
                  <select
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value as 'all' | OrderType)}
                  >
                    <option value="all">All Types</option>
                    <option value="sale">Sales</option>
                    <option value="purchase">Purchases</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
                  <div className="space-y-2">
                    {(['pending', 'partial', 'completed'] as PaymentStatus[]).map((status) => (
                      <label key={status} className="inline-flex items-center mr-4">
                        <input
                          type="checkbox"
                          checked={paymentStatusFilters.includes(status)}
                          onChange={() => handlePaymentStatusFilterChange(status)}
                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                        <span className="ml-2 text-sm text-gray-700 capitalize">{status}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Customer</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={customerFilter}
                    onChange={(e) => setCustomerFilter(e.target.value)}
                    placeholder="Filter by customer..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Supplier</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={supplierFilter}
                    onChange={(e) => setSupplierFilter(e.target.value)}
                    placeholder="Filter by supplier..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">From Date</label>
                  <input
                    type="date"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">To Date</label>
                  <input
                    type="date"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <OrderList orders={filteredOrders} onOrderSelect={handleOrderSelect} />
      </div>
    );
  }

  // Calculate total order amount
  const totalOrderAmount = selectedOrder.items.reduce((sum, item) => 
    sum + ((item.price + item.commission) * item.quantity), 0);

  // Calculate total paid amount
  const totalPaidAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);

  // Calculate remaining amount
  const remainingAmount = totalOrderAmount - totalPaidAmount;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => {
            setSelectedOrder(null);
            setPayments([]);
            navigate('/payments');
          }}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Orders
        </button>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Payments for Order {selectedOrder.id}</h1>
          <p className="text-gray-600 mt-1">
            {selectedOrder.type === 'sale' ? 'Sales' : 'Purchase'} order • {formatDateForDisplay(selectedOrder.date)}
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg">
          <CreditCard className="h-5 w-5 text-gray-500" />
          <span className="font-medium">Payment Status:</span>
          <span className={`capitalize ${
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold mb-4">Order Details</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Order Type</span>
                <span className="font-medium capitalize">{selectedOrder.type}</span>
              </div>
              {selectedOrder.type === 'sale' && selectedOrder.customer && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Customer</span>
                  <span className="font-medium">{selectedOrder.customer}</span>
                </div>
              )}
              {selectedOrder.type === 'purchase' && selectedOrder.supplier && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Supplier</span>
                  <span className="font-medium">{selectedOrder.supplier}</span>
                </div>
              )}
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
            orderId={selectedOrder.id} 
            paymentStatus={selectedOrder.paymentStatus}
            onSuccess={handlePaymentSuccess}
          />
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;