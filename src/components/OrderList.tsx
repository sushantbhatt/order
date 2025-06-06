// // import React from 'react';
// // import { Package, Truck, CreditCard } from 'lucide-react';
// // import { Order } from '../types';
// // import { formatDateForDisplay } from '../utils/helpers';

// // interface OrderListProps {
// //   orders: Order[];
// //   onOrderSelect: (id: string) => void;
// // }

// // const OrderList: React.FC<OrderListProps> = ({ orders, onOrderSelect }) => {
// //   if (!orders || orders.length === 0) {
// //     return (
// //       <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
// //         <p className="text-gray-500">No orders found</p>
// //       </div>
// //     );
// //   }

// //   const getStatusColor = (status: string): string => {
// //     switch (status) {
// //       case 'completed':
// //         return 'bg-green-100 text-green-800';
// //       case 'partial':
// //         return 'bg-amber-100 text-amber-800';
// //       case 'cancelled':
// //         return 'bg-red-100 text-red-800';
// //       default:
// //         return 'bg-blue-100 text-blue-800';
// //     }
// //   };

// //   return (
// //     <div className="bg-white shadow-md rounded-lg overflow-hidden">
// //       <div className="overflow-x-auto">
// //         <table className="min-w-full divide-y divide-gray-200">
// //           <thead className="bg-gray-50">
// //             <tr>
// //               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                 Order ID
// //               </th>
// //               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                 Type
// //               </th>
// //               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                 Date
// //               </th>
// //               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                 Customer/Supplier
// //               </th>
// //               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                 Total Qty
// //               </th>
// //               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                 Status
// //               </th>
// //               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                 Payment Status
// //               </th>
// //             </tr>
// //           </thead>
// //           <tbody className="bg-white divide-y divide-gray-200">
// //             {orders.map((order) => (
// //               <tr
// //                 key={order.id}
// //                 onClick={() => onOrderSelect(order.id)}
// //                 className="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
// //               >
// //                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
// //                   <div className="flex items-center">
// //                     {order.type === 'sale' ? (
// //                       <Truck className="h-5 w-5 text-blue-600 mr-2" />
// //                     ) : (
// //                       <Package className="h-5 w-5 text-emerald-600 mr-2" />
// //                     )}
// //                     <span className="hidden sm:inline">{order.id}</span>
// //                     <span className="sm:hidden">{order.id.slice(-8)}</span>
// //                   </div>
// //                 </td>
// //                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
// //                   {order.type}
// //                 </td>
// //                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
// //                   {formatDateForDisplay(order.date)}
// //                 </td>
// //                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
// //                   {order.type === 'sale' ? order.customer : order.supplier}
// //                 </td>
// //                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
// //                   {order.totalQuantity?.toFixed(2)}
// //                 </td>
// //                 <td className="px-6 py-4 whitespace-nowrap">
// //                   <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
// //                     {order.status}
// //                   </span>
// //                 </td>
// //                 <td className="px-6 py-4 whitespace-nowrap">
// //                   <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.paymentStatus)}`}>
// //                     <CreditCard className="h-4 w-4 mr-1" />
// //                     {order.paymentStatus}
// //                   </span>
// //                 </td>
// //               </tr>
// //             ))}
// //           </tbody>
// //         </table>
// //       </div>
// //     </div>
// //   );
// // };

// // export default OrderList;

// // import React from 'react';
// // import { Package, Truck, CreditCard } from 'lucide-react';
// // import { Order } from '../types';
// // import { formatDateForDisplay, formatCurrency } from '../utils/helpers';

// // interface OrderListProps {
// //   orders: Order[];
// //   onOrderSelect: (id: string) => void;
// // }

// // const OrderList: React.FC<OrderListProps> = ({ orders, onOrderSelect }) => {
// //   if (!orders || orders.length === 0) {
// //     return (
// //       <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
// //         <p className="text-gray-500">No orders found</p>
// //       </div>
// //     );
// //   }

// //   const getStatusColor = (status: string): string => {
// //     switch (status) {
// //       case 'completed':
// //         return 'bg-green-100 text-green-800';
// //       case 'partial':
// //         return 'bg-amber-100 text-amber-800';
// //       case 'cancelled':
// //         return 'bg-red-100 text-red-800';
// //       default:
// //         return 'bg-blue-100 text-blue-800';
// //     }
// //   };

// //   // Function to calculate the total amount for an order
// //   const calculateTotalAmount = (order: Order): number => {
// //     return order.items.reduce((sum, item) =>
// //       sum + ((item.price + item.commission) * item.quantity), 0);
// //   };

// //   // Function to calculate the total dispatch amount for an order
// //   const calculateTotalDispatchAmount = (order: Order): number => {
// //     return order.dispatches?.reduce((sum, dispatch) => sum + (dispatch.dispatchPrice || 0), 0) || 0;
// //   };

// //   // Calculate the sum of total amounts for all orders
// //   const totalOfAllOrderAmounts = orders.reduce((sum, order) => sum + calculateTotalAmount(order), 0);

// //   // Calculate the sum of total quantities for all orders
// //   const totalOfAllOrderQuantities = orders.reduce((sum, order) => sum + (order.totalQuantity || 0), 0);

// //   // Calculate the sum of total dispatch amounts for all orders
// //   const totalOfAllDispatchAmounts = orders.reduce((sum, order) => sum + calculateTotalDispatchAmount(order), 0);

// //   return (
// //     <div className="bg-white shadow-md rounded-lg overflow-hidden">
// //       <div className="overflow-x-auto">
// //         <table className="min-w-full divide-y divide-gray-200">
// //           <thead className="bg-gray-50">
// //             <tr>
// //               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                 Order ID
// //               </th>
// //               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                 Type
// //               </th>
// //               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                 Date
// //               </th>
// //               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                 Customer/Supplier
// //               </th>
// //               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                 Total Qty
// //               </th>
// //               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                 Total Amount
// //               </th>
// //               {/* Added Dispatch Price Column */}
// //               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                 Dispatch Price (₹)
// //               </th>
// //               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                 Status
// //               </th>
// //               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
// //                 Payment Status
// //               </th>
// //             </tr>
// //           </thead>
// //           <tbody className="bg-white divide-y divide-gray-200">
// //             {orders.map((order) => (
// //               <tr
// //                 key={order.id}
// //                 onClick={() => onOrderSelect(order.id)}
// //                 className="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
// //               >
// //                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
// //                   <div className="flex items-center">
// //                     {order.type === 'sale' ? (
// //                       <Truck className="h-5 w-5 text-blue-600 mr-2" />
// //                     ) : (
// //                       <Package className="h-5 w-5 text-emerald-600 mr-2" />
// //                     )}
// //                     <span className="hidden sm:inline">{order.id}</span>
// //                     <span className="sm:hidden">{order.id.slice(-8)}</span>
// //                   </div>
// //                 </td>
// //                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
// //                   {order.type}
// //                 </td>
// //                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
// //                   {formatDateForDisplay(order.date)}
// //                 </td>
// //                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
// //                   {order.type === 'sale' ? order.customer : order.supplier}
// //                 </td>
// //                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
// //                   {order.totalQuantity?.toFixed(2)}
// //                 </td>
// //                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
// //                   {formatCurrency(calculateTotalAmount(order))}
// //                 </td>
// //                 {/* Added Dispatch Price Data */}
// //                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
// //                   {formatCurrency(calculateTotalDispatchAmount(order))}
// //                 </td>
// //                 <td className="px-6 py-4 whitespace-nowrap">
// //                   <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
// //                     {order.status}
// //                   </span>
// //                 </td>
// //                 <td className="px-6 py-4 whitespace-nowrap">
// //                   <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.paymentStatus)}`}>
// //                     <CreditCard className="h-4 w-4 mr-1" />
// //                     {order.paymentStatus}
// //                   </span>
// //                 </td>
// //               </tr>
// //             ))}
// //           </tbody>
// //           {/* Added Footer Row for Total */}
// //           <tfoot className="bg-gray-100 divide-y divide-gray-200">
// //             <tr>
// //               <td className="px-6 py-3 text-left text-sm font-semibold text-gray-700" colSpan={5}>
// //                 Total of All Orders
// //               </td>
// //               <td className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
// //                 {formatCurrency(totalOfAllOrderAmounts)}
// //               </td>
// //               <td className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
// //                 {formatCurrency(totalOfAllDispatchAmounts)}
// //               </td>
// //               <td className="px-6 py-3 text-left text-sm font-semibold text-gray-700" colSpan={2}>
// //                 Total Quantity: {totalOfAllOrderQuantities.toFixed(2)}
// //               </td>
// //             </tr>
// //           </tfoot>
// //         </table>
// //       </div>
// //     </div>
// //   );
// // };

// // export default OrderList;

// import React from 'react';
// import { Package, Truck, CreditCard } from 'lucide-react';
// import { Order } from '../types';
// import { formatDateForDisplay, formatCurrency } from '../utils/helpers';

// interface OrderListProps {
//   orders: Order[];
//   onOrderSelect: (id: string) => void;
// }

// const OrderList: React.FC<OrderListProps> = ({ orders, onOrderSelect }) => {
//   if (!orders || orders.length === 0) {
//     return (
//       <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
//         <p className="text-gray-500">No orders found</p>
//       </div>
//     );
//   }

//   const getStatusColor = (status: string): string => {
//     switch (status) {
//       case 'completed':
//         return 'bg-green-100 text-green-800';
//       case 'partial':
//         return 'bg-amber-100 text-amber-800';
//       case 'cancelled':
//         return 'bg-red-100 text-red-800';
//       default:
//         return 'bg-blue-100 text-blue-800';
//     }
//   };

//   // Function to calculate the total amount for an order
//   const calculateTotalAmount = (order: Order): number => {
//     return order.items.reduce((sum, item) =>
//       sum + ((item.price + item.commission) * item.quantity), 0);
//   };

//   // Calculate the sum of total amounts for all orders
//   const totalOfAllOrderAmounts = orders.reduce((sum, order) => sum + calculateTotalAmount(order), 0);

//   // Calculate the sum of total quantities for all orders
//   const totalOfAllOrderQuantities = orders.reduce((sum, order) => sum + (order.totalQuantity || 0), 0);

//   return (
//     <div className="bg-white shadow-md rounded-lg overflow-hidden">
//       <div className="overflow-x-auto">
//         <table className="min-w-full divide-y divide-gray-200">
//           <thead className="bg-gray-50">
//             <tr>
//               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Order ID
//               </th>
//               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Type
//               </th>
//               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Date
//               </th>
//               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Customer/Supplier
//               </th>
//               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Total Qty
//               </th>
//               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//              Price (₹)
//               </th>
//               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Status
//               </th>
//               <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                 Payment Status
//               </th>
//             </tr>
//           </thead>
//           <tbody className="bg-white divide-y divide-gray-200">
//             {orders.map((order) => (
//               <tr
//                 key={order.id}
//                 onClick={() => onOrderSelect(order.id)}
//                 className="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
//               >
//                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                   <div className="flex items-center">
//                     {order.type === 'sale' ? (
//                       <Truck className="h-5 w-5 text-blue-600 mr-2" />
//                     ) : (
//                       <Package className="h-5 w-5 text-emerald-600 mr-2" />
//                     )}
//                     <span className="hidden sm:inline">{order.id}</span>
//                     <span className="sm:hidden">{order.id.slice(-8)}</span>
//                   </div>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
//                   {order.type}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                   {formatDateForDisplay(order.date)}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                   {order.type === 'sale' ? order.customer : order.supplier}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                   {order.totalQuantity?.toFixed(2)}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                   {formatCurrency(calculateTotalAmount(order))}
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
//                     {order.status}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 whitespace-nowrap">
//                   <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.paymentStatus)}`}>
//                     <CreditCard className="h-4 w-4 mr-1" />
//                     {order.paymentStatus}
//                   </span>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//           {/* Added Footer Row for Total */}
//           <tfoot className="bg-gray-100 divide-y divide-gray-200">
//             <tr>
//               <td className="px-6 py-3 text-left text-sm font-semibold text-gray-700" colSpan={4}>
//                 Total of All Orders
//               </td>
//               <td className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
//                 {totalOfAllOrderQuantities.toFixed(2)}
//               </td>
//               <td className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
//                 {formatCurrency(totalOfAllOrderAmounts)}
//               </td>
//               <td className="px-6 py-3 text-left text-sm font-semibold text-gray-700" colSpan={2}></td>
//             </tr>
//           </tfoot>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default OrderList;


import React from 'react';
import { Package, Truck, CreditCard } from 'lucide-react';
import { Order } from '../types';
import { formatDateForDisplay, formatCurrency } from '../utils/helpers';

interface OrderListProps {
  orders: Order[];
  onOrderSelect: (id: string) => void;
}

const OrderList: React.FC<OrderListProps> = ({ orders, onOrderSelect }) => {
  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-500">No orders found</p>
      </div>
    );
  }

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

  // Calculate the sum of total quantities for all orders
  const totalOfAllOrderQuantities = orders.reduce((sum, order) => sum + (order.totalQuantity || 0), 0);

  // Calculate the sum of prices (per piece of the first item) for all orders
  const totalOfAllPrices = orders.reduce((sum, order) => {
    if (order.items && order.items.length > 0) {
      return sum + (order.items[0].price || 0);
    }
    return sum;
  }, 0);

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer/Supplier
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Qty
              </th>
              {/* Changed Total Amount to Price */}
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price (₹)
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr
                key={order.id}
                onClick={() => onOrderSelect(order.id)}
                className="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  <div className="flex items-center">
                    {order.type === 'sale' ? (
                      <Truck className="h-5 w-5 text-blue-600 mr-2" />
                    ) : (
                      <Package className="h-5 w-5 text-emerald-600 mr-2" />
                    )}
                    <span className="hidden sm:inline">{order.id}</span>
                    <span className="sm:hidden">{order.id.slice(-8)}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                  {order.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDateForDisplay(order.date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.type === 'sale' ? order.customer : order.supplier}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.totalQuantity?.toFixed(2)}
                </td>
                {/* Added Price Data (Price per unit of the first item) */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.items && order.items.length > 0 ? formatCurrency(order.items[0].price) : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.paymentStatus)}`}>
                    <CreditCard className="h-4 w-4 mr-1" />
                    {order.paymentStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          {/* Updated Footer Row */}
          <tfoot className="bg-gray-100 divide-y divide-gray-200">
            <tr>
              <td className="px-6 py-3 text-left text-sm font-semibold text-gray-700" colSpan={4}>
                Total of All Orders
              </td>
              <td className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                {totalOfAllOrderQuantities.toFixed(2)}
              </td>
              <td className="px-6 py-3 text-left text-sm font-semibold text-gray-700">
                {formatCurrency(totalOfAllPrices)}
              </td>
              <td className="px-6 py-3 text-left text-sm font-semibold text-gray-700" colSpan={2}></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default OrderList;