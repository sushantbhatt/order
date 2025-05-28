import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderById, getDispatchesByOrderId } from '../services/orderService';
import { Order, Dispatch } from '../types';
import DispatchForm from '../components/DispatchForm';
import DispatchList from '../components/DispatchList';
import { formatDateForDisplay } from '../utils/helpers';

const OrderDetailPage: React.FC = () => {
  const { id } = useParams();
  const orderId = id ? decodeURIComponent(id) : '';
  const navigate = useNavigate();

  const [order, setOrder] = useState<Order | null>(null);
  const [dispatches, setDispatches] = useState<Dispatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        if (!orderId) throw new Error('Missing order ID');
        const data = await getOrderById(orderId);
        if (!data) throw new Error('Order not found');
        setOrder(data);

        const dispatchData = await getDispatchesByOrderId(orderId);
        setDispatches(dispatchData);
      } catch (err: any) {
        console.error('Error loading order:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [orderId]);

  const handleDispatchCreated = async () => {
    const updatedOrder = await getOrderById(orderId);
    const updatedDispatches = await getDispatchesByOrderId(orderId);
    if (updatedOrder) setOrder(updatedOrder);
    setDispatches(updatedDispatches);
  };

  if (loading) return <div className="p-6">Loading order...</div>;
  if (error || !order) {
    return (
      <div className="p-6 text-red-600">
        {error || 'Order not found'}
        <button className="block mt-4 text-blue-600 underline" onClick={() => navigate('/orders')}>
          Go back
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Order {order.id}</h1>
      <p className="text-sm text-gray-500 mb-4">
        {order.type === 'sale' ? 'Sales' : 'Purchase'} order • {formatDateForDisplay(order.date)}
      </p>

      <div className="bg-white rounded shadow p-4 mb-6">
        <h2 className="text-lg font-semibold mb-2">Order Details</h2>
        <p>Status: <strong className="capitalize">{order.status}</strong></p>
        <p>Total Quantity: <strong>{order.totalQuantity?.toFixed(2)}</strong></p>
        <p>Remaining Quantity: <strong>{order.remainingQuantity?.toFixed(2)}</strong></p>
        {order.notes && <p>Notes: {order.notes}</p>}
        <div className="mt-4">
          <h3 className="font-medium mb-1">Items:</h3>
          <ul className="list-disc ml-6 text-sm text-gray-700">
            {order.items?.map((item) => (
              <li key={item.id}>
                {item.name} — {item.quantity} {item.unit} • ₹{item.price?.toFixed(2)} • Commission: ₹{item.commission?.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Dispatches</h2>
          <DispatchList dispatches={dispatches} />
        </div>

        {order.remainingQuantity > 0 && (
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold mb-2">New Dispatch</h2>
            <DispatchForm order={order} onDispatchCreated={handleDispatchCreated} />
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetailPage;