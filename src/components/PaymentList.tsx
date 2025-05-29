import React from 'react';
import { Payment } from '../types';
import { BanknoteIcon, CalendarIcon, HashIcon, FileTextIcon } from 'lucide-react';

interface PaymentListProps {
  payments: Payment[];
}

const PaymentList: React.FC<PaymentListProps> = ({ payments }) => {
  if (payments.length === 0) {
    return (
      <div className="text-center p-6 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No payments found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {payments.map((payment) => (
        <div
          key={payment.id}
          className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <BanknoteIcon className="w-5 h-5 text-green-600" />
              <span className="font-semibold text-lg">
                ${payment.amount.toFixed(2)}
              </span>
            </div>
            <span className="text-sm text-gray-500 flex items-center gap-1">
              <CalendarIcon className="w-4 h-4" />
              {new Date(payment.payment_date).toLocaleDateString()}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <HashIcon className="w-4 h-4" />
              <span>Mode: {payment.payment_mode}</span>
            </div>
            {payment.reference_number && (
              <div className="flex items-center gap-1">
                <FileTextIcon className="w-4 h-4" />
                <span>Ref: {payment.reference_number}</span>
              </div>
            )}
          </div>
          
          {payment.notes && (
            <p className="mt-2 text-sm text-gray-500 italic">
              {payment.notes}
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default PaymentList;