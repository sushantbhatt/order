import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import PaymentList from '../components/PaymentList';
import PaymentForm from '../components/PaymentForm';
import { Payment } from '../types';
import { getPaymentsByOrderId } from '../services/paymentService';

const PaymentsPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      if (orderId) {
        try {
          const fetchedPayments = await getPaymentsByOrderId(orderId);
          setPayments(fetchedPayments);
        } catch (error) {
          console.error('Error fetching payments:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchPayments();
  }, [orderId]);

  const handlePaymentAdded = (newPayment: Payment) => {
    setPayments([...payments, newPayment]);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Payments</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Add Payment</h2>
          {orderId && <PaymentForm orderId={orderId} onPaymentAdded={handlePaymentAdded} />}
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Payment History</h2>
          <PaymentList payments={payments} />
        </div>
      </div>
    </div>
  );
};

export default PaymentsPage;