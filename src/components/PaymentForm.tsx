import React, { useState } from 'react';
import { CreditCard, Loader2 } from 'lucide-react';
import { Order, PaymentMode } from '../types';
import { createPayment } from '../services/paymentService';
import { getTodayDate } from '../utils/helpers';

interface PaymentFormProps {
  order: Order;
  onPaymentCreated: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ order, onPaymentCreated }) => {
  const [paymentDate, setPaymentDate] = useState(getTodayDate());
  const [amount, setAmount] = useState<number | null>(null);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('cash');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!amount || amount <= 0) {
      setError('Amount must be greater than 0');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await createPayment({
        orderId: order.id,
        amount,
        paymentDate,
        paymentMode,
        referenceNumber,
        notes
      });
      
      onPaymentCreated();
      
      setAmount(null);
      setPaymentMode('cash');
      setReferenceNumber('');
      setNotes('');
    } catch (error) {
      console.error('Error creating payment:', error);
      setError('Failed to create payment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white shadow-md rounded-lg p-4">
      <div className="flex items-center text-lg font-semibold text-gray-800 mb-2">
        <CreditCard className="mr-2 text-blue-600" size={20} /> Record Payment
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="payment-date" className="block text-sm font-medium text-gray-700">
            Payment Date
          </label>
          <input
            type="date"
            id="payment-date"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Amount (₹)
          </label>
          <input
            type="number"
            id="amount"
            value={amount || ''}
            onChange={(e) => setAmount(parseFloat(e.target.value) || null)}
            min="0.01"
            step="0.01"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="payment-mode" className="block text-sm font-medium text-gray-700">
            Payment Mode
          </label>
          <select
            id="payment-mode"
            value={paymentMode}
            onChange={(e) => setPaymentMode(e.target.value as PaymentMode)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="cash">Cash</option>
            <option value="cheque">Cheque</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="upi">UPI</option>
          </select>
        </div>

        <div>
          <label htmlFor="reference-number" className="block text-sm font-medium text-gray-700">
            Reference Number
          </label>
          <input
            type="text"
            id="reference-number"
            value={referenceNumber}
            onChange={(e) => setReferenceNumber(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder={paymentMode === 'cash' ? 'Optional' : 'Required'}
            required={paymentMode !== 'cash'}
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="payment-notes" className="block text-sm font-medium text-gray-700">
          Notes (Optional)
        </label>
        <textarea
          id="payment-notes"
          rows={2}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>
      
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className={`inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
          }`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin h-4 w-4 mr-2" />
              Recording...
            </>
          ) : (
            'Record Payment'
          )}
        </button>
      </div>
    </form>
  );
};

export default PaymentForm;