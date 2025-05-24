import React from 'react';
import { Package, Truck, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { Order } from '../types';
import { formatDateForDisplay } from '../utils/helpers';

interface OrderCardProps {
  order: Order;
  onClick: (id: string) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onClick }) => {
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'partial':
        return 'bg-amber-100 text-amber-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'partial':
        return <Clock className="h-4 w-4" />;
      case 'cancelled':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  // Calculate total quantity from items if not available directly
  const totalQuantity = order.totalQuantity || order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
  
  // Calculate remaining quantity, defaulting to total if not set
  const remainingQuantity = typeof order.remainingQuantity === 'number' ? order.remainingQuantity : totalQuantity;

  return (
    <div 
      className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-shadow duration-200"
      onClick={() => onClick(order.id)}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          {order.type === 'sale' ? (
            <Truck className="h-5 w-5 text-blue-600 mr-2" />
          ) : (
            <Package className="h-5 w-5 text-emerald-600 mr-2" />
          )}
          <span className="font-medium text-gray-900">
            {order.id}
          </span>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(order.status)}`}>
          {getStatusIcon(order.status)}
          <span className="ml-1 capitalize">{order.status}</span>
        </div>
      </div>
      
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Date:</span>
          <span className="font-medium">{formatDateForDisplay(order.date)}</span>
        </div>
        
        {order.type === 'sale' && order.customer && (
          <div className="flex justify-between">
            <span className="text-gray-500">Customer:</span>
            <span className="font-medium">{order.customer}</span>
          </div>
        )}
        
        {order.type === 'purchase' && order.supplier && (
          <div className="flex justify-between">
            <span className="text-gray-500">Supplier:</span>
            <span className="font-medium">{order.supplier}</span>
          </div>
        )}
        
        <div className="flex justify-between">
          <span className="text-gray-500">Total Quantity:</span>
          <span className="font-medium">{totalQuantity}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-500">Remaining:</span>
          <span className={`font-medium ${
            remainingQuantity > 0 ? 'text-amber-600' : 'text-green-600'
          }`}>
            {remainingQuantity}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;