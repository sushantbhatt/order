import React from 'react';
import { Payment } from '../types';
import { formatDateForDisplay, formatCurrency } from '../utils/helpers';

interface PaymentListProps {
  payments: Payment[];
}

const PaymentList: React.FC<PaymentListProps> = ({ payments }) => {
  if (!payments || payments.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-500">No payments recorded yet</p>
      </div>
    );
  }

  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
              Order ID
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Type
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Date
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Customer/Supplier
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Total Qty
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Payment Status
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Payment Date
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {payments.map((payment) => (
            <tr key={payment.id}>
              <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                {payment.orderId}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {payment.type}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {formatDateForDisplay(payment.date)}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {payment.type === 'sale' ? payment.customer : payment.supplier}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {payment.totalQuantity}
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  payment.paymentStatus === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : payment.paymentStatus === 'partial'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {payment.paymentStatus}
                </span>
              </td>
              <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                {formatDateForDisplay(payment.paymentDate)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot className="bg-gray-50">
          <tr>
            <th scope="row" colSpan={6} className="py-3.5 pl-4 pr-3 text-right text-sm font-semibold text-gray-900 sm:pl-6">
              Total Amount
            </th>
            <td className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              {formatCurrency(totalAmount)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default PaymentList;