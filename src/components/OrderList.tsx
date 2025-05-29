import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Order, OrderType } from '../types';
import OrderCard from './OrderCard';
import { getTodayDate } from '../utils/helpers';

interface OrderListProps {
  orders: Order[];
  onOrderSelect: (id: string) => void;
}

const OrderList: React.FC<OrderListProps> = ({ orders, onOrderSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [typeFilter, setTypeFilter] = useState<OrderType | 'all'>('all');
  const [statusFilters, setStatusFilters] = useState<string[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState(getTodayDate());

  const handleStatusFilterChange = (status: string) => {
    setStatusFilters(prev => 
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    );
  };

  // Apply filters
  const filteredOrders = orders.filter(order => {
    // Filter by search query
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      order.id.toLowerCase().includes(query) ||
      (order.customer?.toLowerCase().includes(query) || false) ||
      (order.supplier?.toLowerCase().includes(query) || false);
    
    if (!matchesSearch) return false;
    
    // Filter by type
    if (typeFilter !== 'all' && order.type !== typeFilter) return false;
    
    // Filter by status
    if (statusFilters.length > 0 && !statusFilters.includes(order.status)) return false;
    
    // Filter by date range
    if (startDate && order.date < startDate) return false;
    if (endDate && order.date > endDate) return false;
    
    return true;
  });
  
  const clearFilters = () => {
    setTypeFilter('all');
    setStatusFilters([]);
    setStartDate('');
    setEndDate(getTodayDate());
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by ID, customer or supplier..."
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
        <div className="bg-gray-50 p-4 rounded-md shadow-sm border border-gray-200">
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
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700">
                Order Type
              </label>
              <select
                id="type-filter"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value as OrderType | 'all')}
              >
                <option value="all">All Types</option>
                <option value="sale">Sales</option>
                <option value="purchase">Purchases</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <div className="space-y-2">
                {['pending', 'partial', 'completed', 'cancelled'].map((status) => (
                  <label key={status} className="inline-flex items-center mr-4">
                    <input
                      type="checkbox"
                      checked={statusFilters.includes(status)}
                      onChange={() => handleStatusFilterChange(status)}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm text-gray-700 capitalize">{status}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label htmlFor="start-date" className="block text-sm font-medium text-gray-700">
                From Date
              </label>
              <input
                type="date"
                id="start-date"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="end-date" className="block text-sm font-medium text-gray-700">
                To Date
              </label>
              <input
                type="date"
                id="end-date"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>
      )}
      
      {filteredOrders.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg shadow">
          <p className="text-gray-500">No orders found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} onClick={onOrderSelect} />
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderList;