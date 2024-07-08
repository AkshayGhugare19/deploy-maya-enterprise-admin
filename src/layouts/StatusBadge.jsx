import React from 'react';

const StatusBadge = ({ status }) => {
  const getStatusClasses = (status) => {
    switch (status) {
      case 'fulfilled':
        return 'bg-green-500 text-white';
      case 'awaiting_response':
        return 'bg-yellow-200 text-black';
      case 'in_progress':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="">
      <div className={` overflow-hidden ${getStatusClasses(status)} rounded-md p-2 shadow-lg`}>
        <div className="flex justify-center items-center h-full">
          <div className=""><strong>Enquiry Status:</strong> 
          {
          status==="fulfilled"?"Full Filled":"" ||
          status==="awaiting_response" ? "Awaiting Response":"" ||
          status==="in_progress" ? "In Progress":"" 
           }</div>
        </div>
      </div>
    </div>
  );
};

export default StatusBadge;
