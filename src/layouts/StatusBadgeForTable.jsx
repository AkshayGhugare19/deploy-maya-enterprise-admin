import React from 'react';

const StatusBadgeForTable = ({ status }) => {
  const getStatusClasses = (status) => {
    switch (status) {
      case 'pending':
        return 'border border-yellow-500 text-yellow-500 text-sm';
      case 'shipped':
        return 'border border-blue-500 text-blue-500 text-sm';
      case 'delivered':
        return 'border border-green-500 text-green-500 text-sm';
      case 'cancelled':
        return 'border border-red-500 text-red-500 text-sm';
      case 'fulfilled':
        return 'border border-green-500 text-green-500 text-sm';
      case 'awaiting_response':
        return 'border border-yellow-500 text-yellow-500 text-sm';
      case 'in_progress':
        return 'border border-blue-500 text-blue-500 text-sm';
      default:
        return 'border border-gray-500 text-gray-500 text-sm';
    }
  };

  return (
    <div className="">
      <div className={`overflow-hidden ${getStatusClasses(status)} rounded-md p-1 shadow-md`}>
        <div className="flex justify-center items-center h-full">
          <div className='whitespace-nowrap'>
            {
              status === 'pending' ? "Pending" :
              status === 'shipped' ? "Shipped" :
              status === 'delivered' ? "Delivered" :
              status === 'cancelled' ? "Cancelled" : 
              status === 'fulfilled' ? "Fulfilled" :
              status === 'awaiting_response' ? "Awaiting Response" :
              status === 'in_progress' ? "In Progress" : "--"
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusBadgeForTable;
