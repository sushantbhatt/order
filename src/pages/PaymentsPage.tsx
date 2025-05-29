import React, { useEffect, useState } from 'react';
import { getAllOrders } from '../services/orderService';
import { getPaymentsByOrderId } from '../services/paymentService';
import { Order, Payment } from '../types';
import PaymentList from '../components/PaymentList';
import PaymentForm from '../components/PaymentForm';
import { formatCurrency, formatDateForDisplay } from '../utils/helpers';
import { CreditCard, Search, Filter, X } from 'lucide-react';

const PaymentsPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [customerFilter, setCustomerFilter] = useState('');
  const [supplierFilter, setSupplierFilter] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState<string[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

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

  const handlePaymentSuccess = async () => {
    if (!selectedOrder) return;
    
    try {
      const updatedPayments = await getPaymentsByOrderId(selectedOrder.id);
      setPayments(updatedPayments);
      
      // Refresh orders to get updated payment status
      const updatedOrders = await getAllOrders();
      setOrders(updatedOrders);
    } catch (err) {
      console.error('Error updating payments:', err);
      setError('Failed to update payments');
    }
  };

  const calculateTotalAmount = (order: Order) => {
    return order.items.reduce((sum, item) => 
      sum + ((item.price + item.commission) * item.quantity), 0);
  };

  const calculateTotalPaidAmount = (orderPayments: Payment[]) => {
    return orderPayments.reduce((sum, payment) => sum + payment.amount, 0);
  };

  const getPaymentStatus = (order: Order, orderPayments: Payment[]) => {
    const totalAmount = calculateTotalAmount(order);
    const paidAmount = calculateTotalPaidAmount(orderPayments);
    
    if (paidAmount === 0) return 'pending';
    if (paidAmount >= totalAmount) return 'completed';
    return 'partial';
  };

  const calculateDispatchedQuantity = (order: Order) => {
    return order.dispatches?.reduce((sum, dispatch) => sum + (dispatch.quantity || 0), 0) || 0;
  };

  const calculateDispatchAmount = (order: Order) => {
    // Calculate average commission per unit from all items
    const totalCommission = order.items.reduce((sum, item) => sum + item.commission, 0);
    const avgCommissionPerUnit = totalCommission / order.items.length;

    return order.dispatches?.reduce((sum, dispatch) => {
      // For each dispatch, add dispatch price plus commission multiplied by quantity
      return sum + ((dispatch.dispatchPrice || 0) + avgCommissionPerUnit) * dispatch.quantity;
    }, 0) || 0;
  };

  const clearFilters = () => {
    setSearchQuery('');
    setCustomerFilter('');
    setSupplierFilter('');
    setPaymentStatusFilter([]);
    setStartDate('');
    setEndDate(new Date().toISOString().split('T')[0]);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCustomer = !customerFilter || (order.customer?.toLowerCase().includes(customerFilter.toLowerCase()) ?? false);
    const matchesSupplier = !supplierFilter || (order.supplier?.toLowerCase().includes(supplierFilter.toLowerCase()) ?? false);
    const matchesPaymentStatus = paymentStatusFilter.length === 0 || paymentStatusFilter.includes(order.paymentStatus);
    const matchesDateRange = (!startDate || order.date >= startDate) && (!endDate || order.date <= endDate);

    return matchesSearch && matchesCustomer && matchesSupplier && matchesPaymentStatus && matchesDateRange;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Payment Management</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search order ID..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {showFilters && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Filters</h2>
            <button
              onClick={clearFilters}
              className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
            >
              <X className="h-4 w-4 mr-1" />
              Clear filters
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer
              </label>
              <input
                type="text"
                className="w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={customerFilter}
                onChange={(e) => setCustomerFilter(e.target.value)}
                placeholder="Filter by customer..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Supplier
              </label>
              <input
                type="text"
                className="w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={supplierFilter}
                onChange={(e) => setSupplierFilter(e.target.value)}
                placeholder="Filter by supplier..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Status
              </label>
              <div className="space-y-2">
                {['pending', 'partial', 'completed'].map((status) => (
                  <label key={status} className="inline-flex items-center mr-4">
                    <input
                      type="checkbox"
                      checked={paymentStatusFilter.includes(status)}
                      onChange={() => {
                        setPaymentStatusFilter(prev =>
                          prev.includes(status)
                            ? prev.filter(s => s !== status)
                            : [...prev, status]
                        );
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700 capitalize">{status}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                From Date
              </label>
              <input
                type="date"
                className="w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                To Date
              </label>
              <input
                type="date"
                className="w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium">Orders</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer/Supplier
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dispatched
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dispatch Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.map((order) => {
                    const orderPayments = payments.filter(p => p.orderId === order.id);
                    const paymentStatus = getPaymentStatus(order, orderPayments);
                    const dispatchedQty = calculateDispatchedQuantity(order);
                    const dispatchAmount = calculateDispatchAmount(order);

                    return (
                      <tr
                        key={order.id}
                        onClick={() => setSelectedOrder(order)}
                        className={`hover:bg-gray-50 cursor-pointer ${
                          selectedOrder?.id === order.id ? 'bg-blue-50' : ''
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {order.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDateForDisplay(order.date)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.type === 'sale' ? order.customer : order.supplier}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.totalQuantity.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {dispatchedQty.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(calculateTotalAmount(order))}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(dispatchAmount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            paymentStatus === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : paymentStatus === 'partial'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {paymentStatus}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {selectedOrder ? (
            <>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-medium mb-4">Payment Details</h2>
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
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-medium mb-4">Record Payment</h2>
                <PaymentForm 
                  orderId={selectedOrder.id} 
                  onSuccess={handlePaymentSuccess}
                />
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-medium mb-4">Payment History</h2>
                <PaymentList payments={payments} />
              </div>
            </>
          ) : (
            <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
              <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No Order Selected</h3>
              <p className="mt-1 text-sm text-gray-500">
                Select an order from the list to view and manage payments
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;